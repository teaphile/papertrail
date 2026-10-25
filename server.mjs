import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT ?? 4173);
if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  console.error('PORT must be an integer between 0 and 65535.');
  process.exit(1);
}
const MAX_BODY_BYTES = 8 * 1024 * 1024;
const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 18 * 1024 * 1024;
const COMPILE_TIMEOUT_MS = clampNumber(Number(process.env.TEX_COMPILE_TIMEOUT_MS || 120_000), 10_000, 300_000);
const MAX_CONCURRENT_COMPILES = clampNumber(Number(process.env.TEX_MAX_CONCURRENT_COMPILES || 1), 1, 4);
const PREVIEW_RENDER_DPI = clampNumber(Number(process.env.PREVIEW_RENDER_DPI || 120), 72, 200);
const PREVIEW_CACHE_TTL_MS = clampNumber(Number(process.env.PREVIEW_CACHE_TTL_MS || 30 * 60 * 1000), 60_000, 24 * 60 * 60 * 1000);
const PREVIEW_CACHE_MAX = 8;
const PREVIEW_RENDER_TIMEOUT_MS = 30_000;
const PREVIEW_TOKEN_RE = /^[a-f0-9-]{36}$/;
const COMPILE_SETTING = process.env.ALLOW_LOCAL_TEX_COMPILE;
const PDF_PREVIEW_SETTING = process.env.PDF_PREVIEW;
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
};
const candidates = ['latexmk', 'tectonic', 'pdflatex', 'xelatex', 'lualatex', 'bibtex', 'biber'];

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function probeCommand(command, args = ['--version']) {
  return new Promise(resolve => {
    let settled = false;
    const child = spawn(command, args, { stdio: 'ignore', windowsHide: true });
    const timer = setTimeout(() => { child.kill('SIGKILL'); finish(false); }, 2500);
    function finish(value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    }
    child.once('error', () => finish(false));
    child.once('close', code => finish(code === 0 || code === 1));
  });
}

// Probe in parallel so a machine with many TeX tools starts quickly.
const probes = await Promise.all([
  ...candidates.map(async command => [command, await probeCommand(command)]),
  ['pdftoppm', await probeCommand('pdftoppm', ['-v'])],
  ['pdfinfo', await probeCommand('pdfinfo', ['-v'])],
]);
const detected = Object.fromEntries(probes);
const previewRenderer = PDF_PREVIEW_SETTING === '0' ? null : detected.pdftoppm ? 'pdftoppm' : null;
const availableEngines = [
  detected.pdflatex && 'pdfLaTeX',
  detected.xelatex && 'XeLaTeX',
  detected.lualatex && 'LuaLaTeX',
  detected.tectonic && 'Tectonic',
].filter(Boolean);
// Real compilation is safe to enable by default only when the server is bound
// to the loopback interface. Setting ALLOW_LOCAL_TEX_COMPILE=0 opts out.
const compileOnLoopback = LOOPBACK_HOSTS.has(String(HOST).replace(/^\[|\]$/g, ''));
const compileEnabled = availableEngines.length > 0 && (
  COMPILE_SETTING === '1' || (COMPILE_SETTING !== '0' && compileOnLoopback)
);
const compileDisabledReason = !availableEngines.length
  ? 'No TeX executable was detected on the server. Install TeX Live or TinyTeX and restart the workspace.'
  : COMPILE_SETTING === '0'
    ? 'Real compilation is disabled by ALLOW_LOCAL_TEX_COMPILE=0.'
    : !compileOnLoopback
      ? 'Real compilation is enabled only when the server is bound to loopback. Set ALLOW_LOCAL_TEX_COMPILE=1 only for a trusted private server.'
      : '';
let activeCompiles = 0;
let previewCacheDir = '';
let activePreviewRenders = 0;
const previewEntries = new Map();

async function ensurePreviewCacheDir() {
  if (previewCacheDir) return previewCacheDir;
  previewCacheDir = await fs.mkdtemp(path.join(os.tmpdir(), 'papertrail-preview-'));
  await fs.chmod(previewCacheDir, 0o700);
  return previewCacheDir;
}

async function removePreviewEntry(token) {
  const entry = previewEntries.get(token);
  if (!entry) return;
  previewEntries.delete(token);
  const files = await fs.readdir(previewCacheDir).catch(() => []);
  await Promise.all(files
    .filter(name => name === `${token}.pdf` || name.startsWith(`${token}-page-`) || name.startsWith(`${token}-render-`))
    .map(name => fs.rm(path.join(previewCacheDir, name), { force: true }).catch(() => {})));
}

async function prunePreviewCache() {
  const now = Date.now();
  for (const [token, entry] of previewEntries) {
    if (now - entry.lastAccess > PREVIEW_CACHE_TTL_MS) await removePreviewEntry(token);
  }
  if (previewEntries.size <= PREVIEW_CACHE_MAX) return;
  const oldest = [...previewEntries.entries()].sort((a, b) => a[1].lastAccess - b[1].lastAccess);
  for (const [token] of oldest.slice(0, previewEntries.size - PREVIEW_CACHE_MAX)) await removePreviewEntry(token);
}

async function storePreviewPdf(pdf, pages) {
  const directory = await ensurePreviewCacheDir();
  const token = randomUUID();
  const pdfPath = path.join(directory, `${token}.pdf`);
  await fs.writeFile(pdfPath, pdf, { mode: 0o600 });
  previewEntries.set(token, { pdfPath, pages, lastAccess: Date.now() });
  await prunePreviewCache();
  return { token, pages, renderer: previewRenderer, dpi: PREVIEW_RENDER_DPI };
}

async function servePreviewImage(req, res, token, page) {
  if (!previewRenderer) return json(res, 503, { error: 'PDF page rendering is not available on this server.' });
  if (!PREVIEW_TOKEN_RE.test(token)) return json(res, 400, { error: 'Invalid preview token.' });
  await prunePreviewCache();
  const entry = previewEntries.get(token);
  if (!entry) return json(res, 404, { error: 'This PDF preview has expired. Recompile the project to view it again.' });
  if (!Number.isInteger(page) || page < 1 || page > entry.pages) return json(res, 400, { error: 'Page number is out of range.' });
  entry.lastAccess = Date.now();
  const cachePath = path.join(previewCacheDir, `${token}-page-${page}.png`);
  let image = await fs.readFile(cachePath).catch(() => null);
  if (!image) {
    if (activePreviewRenders >= 2) return json(res, 429, { error: 'The PDF preview is still rendering. Try again in a moment.' }, { 'retry-after': '1' });
    activePreviewRenders++;
    const prefix = path.join(previewCacheDir, `${token}-render-${randomUUID()}`);
    try {
      const result = await runCommand('pdftoppm', [
        '-f', String(page), '-l', String(page), '-singlefile', '-png',
        '-r', String(PREVIEW_RENDER_DPI), entry.pdfPath, prefix,
      ], previewCacheDir, PREVIEW_RENDER_TIMEOUT_MS);
      if (result.code !== 0) {
        console.error('pdftoppm failed:', result.stderr || result.error || `exit ${result.code}`);
        return json(res, 500, { error: 'The compiled PDF could not be rendered for preview.' });
      }
      image = await fs.readFile(`${prefix}.png`).catch(() => null);
      if (!image || !image.length) return json(res, 500, { error: 'The PDF preview renderer did not produce an image.' });
      await fs.rename(`${prefix}.png`, cachePath).catch(async () => {
        await fs.writeFile(cachePath, image, { mode: 0o600 });
        await fs.rm(`${prefix}.png`, { force: true }).catch(() => {});
      });
    } finally {
      activePreviewRenders--;
      await fs.rm(`${prefix}.png`, { force: true }).catch(() => {});
    }
  }
  res.writeHead(200, {
    'content-type': 'image/png',
    'content-length': image.length,
    'cache-control': 'private, max-age=300',
    'x-content-type-options': 'nosniff',
    'cross-origin-resource-policy': 'same-origin',
  });
  if (req.method === 'HEAD') res.end(); else res.end(image);
}

function json(res, statusCode, body, extraHeaders = {}) {
  const payload = Buffer.from(JSON.stringify(body));
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': payload.length,
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    ...extraHeaders,
  });
  res.end(payload);
}

function safeProjectPath(raw) {
  if (typeof raw !== 'string' || raw.length > 180 || raw.includes('\0')) return null;
  const normalized = path.posix.normalize(raw.replaceAll('\\', '/')).replace(/^\.\//, '');
  if (!normalized || normalized === '.' || normalized.startsWith('/') || normalized === '..' || normalized.startsWith('../')) return null;
  if (normalized.split('/').some(part => part === '..' || part === '.')) return null;
  return normalized;
}

async function readJson(req) {
  const declaredLength = Number(req.headers['content-length'] || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw Object.assign(new Error('Request body exceeds the 8 MB limit.'), { statusCode: 413 });
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('Request body exceeds the 8 MB limit.'), { statusCode: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('Request must contain valid JSON.'), { statusCode: 400 }); }
}

function runCommand(command, args, cwd, timeoutMs, extraEnv = {}) {
  return new Promise(resolve => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, HOME: cwd, TEXMFHOME: path.join(cwd, '.texmf-home'), openin_any: 'p', openout_any: 'p', ...extraEnv },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish({ code: 124, timedOut: true });
    }, Math.max(250, timeoutMs));
    const append = (target, data) => {
      const text = data.toString('utf8');
      if (target === 'stdout') stdout = (stdout + text).slice(-24_000);
      else stderr = (stderr + text).slice(-24_000);
    };
    child.stdout.on('data', data => append('stdout', data));
    child.stderr.on('data', data => append('stderr', data));
    function finish(result) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ...result, stdout, stderr });
    }
    child.once('error', error => finish({ code: 127, error: error.message }));
    child.once('close', code => finish({ code: code ?? 1, timedOut: false }));
  });
}

function logLinesFrom(result, stage) {
  const lines = [];
  if (result.stdout) for (const line of result.stdout.split(/\r?\n/).filter(Boolean)) lines.push({ level: 'info', message: line.slice(0, 1800) });
  if (result.stderr) for (const line of result.stderr.split(/\r?\n/).filter(Boolean)) lines.push({ level: result.code === 0 ? 'warning' : 'error', message: line.slice(0, 1800) });
  if (result.timedOut) lines.push({ level: 'error', message: `${stage} exceeded the ${Math.round(COMPILE_TIMEOUT_MS / 1000)} second compile limit and was stopped.` });
  if (result.error) lines.push({ level: 'error', message: `${stage}: ${result.error}` });
  return lines;
}

function parseDataAsset(content, relative) {
  const match = content.match(/^data:(image\/(?:png|jpeg|gif|webp|svg\+xml)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw Object.assign(new Error(`Unsupported binary data URI for ${relative}.`), { statusCode: 400 });
  const extension = path.posix.extname(relative).toLowerCase();
  const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.pdf']);
  if (!allowedExtensions.has(extension)) throw Object.assign(new Error(`Binary content is not allowed for ${relative}.`), { statusCode: 400 });
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > MAX_SOURCE_BYTES) throw Object.assign(new Error(`Binary asset ${relative} is empty or exceeds the size limit.`), { statusCode: 413 });
  return bytes;
}

function stripTexComments(source) {
  return String(source).split('\n').map(line => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '%' && (i === 0 || line[i - 1] !== '\\')) return line.slice(0, i);
    }
    return line;
  }).join('\n');
}

function svgIncludes(files) {
  const hits = [];
  for (const file of files) {
    if (typeof file.content !== 'string' || !file.path.toLowerCase().endsWith('.tex')) continue;
    const source = stripTexComments(file.content);
    for (const match of source.matchAll(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g)) {
      const target = match[1].trim();
      if (/\.svg$/i.test(target)) hits.push(`${file.path}: ${target}`);
    }
  }
  return hits;
}

async function countPdfPages(pdfPath, pdfText) {
  if (detected.pdfinfo) {
    const info = await runCommand('pdfinfo', [pdfPath], path.dirname(pdfPath), 8_000);
    const match = info.code === 0 && info.stdout.match(/^Pages:\s+(\d+)\s*$/m);
    if (match) return Math.max(1, Number(match[1]) || 1);
  }
  const pageObjects = (pdfText.match(/\/Type\s*\/Page\b/g) || []).length;
  const pageTreeCounts = [
    ...pdfText.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/g),
    ...pdfText.matchAll(/\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages\b/g),
  ].map(match => Number(match[1]) || 0);
  return Math.max(1, pageObjects, ...pageTreeCounts);
}

function compilerCommand(engineName) {
  const mapping = {
    pdfLaTeX: 'pdflatex', XeLaTeX: 'xelatex', LuaLaTeX: 'lualatex', Tectonic: 'tectonic',
  };
  const preferred = [engineName, 'pdfLaTeX', 'XeLaTeX', 'LuaLaTeX', 'Tectonic'];
  for (const engine of preferred) {
    const command = mapping[engine];
    if (command && detected[command]) return { engine, command };
  }
  return null;
}

async function compileProjectRequest(req, res) {
  const payload = await readJson(req);
  if (!payload || typeof payload !== 'object' || !payload.files || typeof payload.files !== 'object' || Array.isArray(payload.files)) {
    return json(res, 400, { error: 'Expected { files, rootFile, engine }.' });
  }
  const rootFile = safeProjectPath(payload.rootFile);
  if (!rootFile || !rootFile.toLowerCase().endsWith('.tex')) return json(res, 400, { error: 'Root file must be a relative .tex path.' });
  const requestedEngine = String(payload.engine || 'pdfLaTeX');
  const selection = compilerCommand(requestedEngine);
  if (!selection) return json(res, 503, { error: 'No supported TeX compiler was detected. Install TeX Live, MiKTeX, or Tectonic first.' });
  const entries = Object.entries(payload.files);
  if (entries.length > 100) return json(res, 413, { error: 'Projects are limited to 100 source files in this local workspace.' });
  let total = 0;
  const files = [];
  try {
    for (const [rawPath, content] of entries) {
      const relative = safeProjectPath(rawPath);
      if (!relative) return json(res, 400, { error: `Unsafe project path rejected: ${String(rawPath).slice(0, 80)}` });
      if (typeof content !== 'string') return json(res, 400, { error: `File content for ${relative} must be text or an image data URI.` });
      if (content.startsWith('data:')) {
        const bytes = parseDataAsset(content, relative);
        total += bytes.length;
        files.push({ path: relative, content: bytes });
      } else {
        const bytes = Buffer.byteLength(content, 'utf8');
        total += bytes;
        files.push({ path: relative, content });
      }
      if (total > MAX_SOURCE_BYTES) return json(res, 413, { error: 'Combined project source and assets exceed the 5 MB compile limit.' });
    }
  } catch (error) {
    return json(res, error.statusCode || 400, { error: error.message });
  }
  if (!files.some(file => file.path === rootFile)) return json(res, 400, { error: `Root file ${rootFile} was not included.` });
  const unsupportedSvg = svgIncludes(files);
  if (unsupportedSvg.length) {
    return json(res, 422, {
      error: 'SVG images are not supported by pdfLaTeX, XeLaTeX, or LuaLaTeX without shell escape. Export the figure as PNG, JPG, or PDF, then update \\includegraphics and compile again.',
      engine: selection.engine,
      logs: [{ level: 'error', message: `SVG image reference found in ${unsupportedSvg.join(', ')}.` }],
    });
  }

  const deadline = Date.now() + COMPILE_TIMEOUT_MS;
  const remaining = () => deadline - Date.now();
  const runStage = (command, args, cwd, extraEnv = {}, stage) => {
    const budget = remaining();
    if (budget < 500) return Promise.resolve({ code: 124, timedOut: true, stdout: '', stderr: '', stage });
    return runCommand(command, args, cwd, budget, extraEnv).then(result => ({ ...result, stage }));
  };

  let workDir = '';
  const logs = [];
  try {
    workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'papertrail-tex-'));
    await fs.chmod(workDir, 0o700);
    for (const file of files) {
      const absolute = path.resolve(workDir, file.path);
      if (!absolute.startsWith(workDir + path.sep)) throw new Error('Unsafe project path rejected.');
      await fs.mkdir(path.dirname(absolute), { recursive: true, mode: 0o700 });
      if (Buffer.isBuffer(file.content)) await fs.writeFile(absolute, file.content, { mode: 0o600 });
      else await fs.writeFile(absolute, file.content, { encoding: 'utf8', mode: 0o600 });
    }
    const outputDir = path.join(workDir, 'out');
    await fs.mkdir(outputDir, { mode: 0o700 });
    const basename = path.basename(rootFile);
    let args;
    if (selection.command === 'tectonic') {
      args = ['--keep-logs', '--keep-intermediates', '--outdir', outputDir, rootFile];
    } else {
      args = ['-interaction=nonstopmode', '-halt-on-error', '-file-line-error', '-no-shell-escape', `-output-directory=${outputDir}`, rootFile];
    }
    logs.push({ level: 'info', message: `Running ${selection.engine} with shell escape disabled.` });
    const first = await runStage(selection.command, args, workDir, {}, selection.engine);
    logs.push(...logLinesFrom(first, selection.engine));
    if (first.code !== 0) return json(res, first.timedOut ? 504 : 422, { error: first.timedOut ? 'TeX compilation timed out.' : 'TeX compilation failed.', engine: selection.engine, logs: logs.slice(-240) });

    // Run a bibliography processor when the requested document emitted the corresponding control file.
    if (selection.command !== 'tectonic') {
      const jobName = basename.replace(/\.tex$/i, '');
      const auxPath = path.join(outputDir, `${jobName}.aux`);
      const bcfPath = path.join(outputDir, `${jobName}.bcf`);
      const aux = await fs.readFile(auxPath, 'utf8').catch(() => '');
      const bibEnv = { BIBINPUTS: `${workDir}${path.delimiter}${process.env.BIBINPUTS || ''}` };
      if (detected.biber && await fs.access(bcfPath).then(() => true).catch(() => false)) {
        const bibliography = await runStage('biber', [jobName], outputDir, bibEnv, 'Biber');
        logs.push(...logLinesFrom(bibliography, 'Biber'));
        if (bibliography.code !== 0) return json(res, bibliography.timedOut ? 504 : 422, { error: 'Biber bibliography processing failed.', engine: selection.engine, logs: logs.slice(-240) });
      } else if (detected.bibtex && aux.includes('\\bibdata')) {
        const bibliography = await runStage('bibtex', [jobName], outputDir, bibEnv, 'BibTeX');
        logs.push(...logLinesFrom(bibliography, 'BibTeX'));
        if (bibliography.code !== 0) return json(res, bibliography.timedOut ? 504 : 422, { error: 'BibTeX bibliography processing failed.', engine: selection.engine, logs: logs.slice(-240) });
      }
      // Resolve common citations and cross-references. Stop early when a pass
      // does not change the auxiliary data, which avoids needless rebuilds.
      let previousAux = await fs.readFile(auxPath, 'utf8').catch(() => '');
      for (let pass = 1; pass <= 2; pass++) {
        const nextPass = await runStage(selection.command, args, workDir, {}, `${selection.engine} reference pass ${pass}`);
        logs.push(...logLinesFrom(nextPass, `${selection.engine} reference pass ${pass}`));
        if (nextPass.code !== 0) return json(res, nextPass.timedOut ? 504 : 422, { error: 'A TeX reference pass failed.', engine: selection.engine, logs: logs.slice(-240) });
        const nextAux = await fs.readFile(auxPath, 'utf8').catch(() => '');
        if (nextAux === previousAux) break;
        previousAux = nextAux;
      }
    }
    const pdfPath = path.join(outputDir, basename.replace(/\.tex$/i, '.pdf'));
    const stat = await fs.stat(pdfPath).catch(() => null);
    if (!stat || stat.size < 100 || stat.size > MAX_OUTPUT_BYTES) {
      return json(res, 422, { error: 'The compiler did not produce a valid PDF within the 18 MB output limit.', engine: selection.engine, logs: logs.slice(-240) });
    }
    const pdf = await fs.readFile(pdfPath);
    if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') {
      return json(res, 422, { error: 'The compiler output is not a valid PDF file.', engine: selection.engine, logs: logs.slice(-240) });
    }
    const pdfText = pdf.toString('latin1');
    const pages = await countPdfPages(pdfPath, pdfText);
    const sizeLabel = pdf.length < 1024 ? `${pdf.length} B` : `${(pdf.length / 1024).toFixed(0)} KB`;
    logs.push({ level: 'info', message: `PDF created (${sizeLabel}, ${pages} page${pages === 1 ? '' : 's'}).` });
    let preview = null;
    if (previewRenderer) {
      try {
        preview = await storePreviewPdf(pdf, pages);
      } catch (error) {
        console.warn('Could not cache the PDF preview:', error);
      }
    }
    return json(res, 200, { engine: selection.engine, pdfBase64: pdf.toString('base64'), pages, preview, logs: logs.slice(-240) });
  } catch (error) {
    console.error('Compile request failed:', error);
    return json(res, 500, { error: error.message || 'Compile failed unexpectedly.', engine: selection.engine, logs: logs.slice(-240) });
  } finally {
    if (workDir) await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function compileProject(req, res) {
  if (!compileEnabled) {
    return json(res, 503, { error: compileDisabledReason || 'Local TeX compilation is not available. Start the server on loopback or set ALLOW_LOCAL_TEX_COMPILE=1 for trusted local use.', logs: [] });
  }
  if (activeCompiles >= MAX_CONCURRENT_COMPILES) {
    return json(res, 429, { error: 'Another TeX build is already running on this server. Try again when it finishes.' }, { 'retry-after': '5' });
  }
  activeCompiles++;
  try {
    return await compileProjectRequest(req, res);
  } catch (error) {
    if (!error.statusCode || error.statusCode >= 500) console.error('Compile request rejected:', error);
    return json(res, error.statusCode || 500, { error: error.message || 'Could not process compile request.' });
  } finally {
    activeCompiles--;
  }
}

async function serveStatic(req, res, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  if (relative.split('/').some(part => part.startsWith('.'))) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Not found'); return; }
  const filePath = path.resolve(ROOT, relative);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) { res.writeHead(403); res.end('Forbidden'); return; }
  try {
    const data = await fs.readFile(filePath);
    const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'content-type': type,
      'content-length': data.length,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      'cross-origin-resource-policy': 'same-origin',
      'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
      'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      'x-frame-options': 'DENY',
    });
    if (req.method === 'HEAD') res.end(); else res.end(data);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  let url;
  try { url = new URL(req.url, 'http://localhost'); }
  catch { res.writeHead(400); res.end('Bad request'); return; }

  if (url.pathname === '/api/health') {
    if (req.method !== 'GET') return json(res, 405, { error: 'Use GET for this endpoint.' }, { allow: 'GET' });
    const engine = compileEnabled ? compilerCommand('pdfLaTeX')?.engine || availableEngines[0] || null : null;
    return json(res, 200, {
      available: availableEngines.length > 0,
      enabled: compileEnabled,
      engine,
      engines: availableEngines,
      reason: compileDisabledReason,
      hostMode: compileOnLoopback ? 'loopback' : 'network',
      timeoutMs: COMPILE_TIMEOUT_MS,
      maxConcurrentCompiles: MAX_CONCURRENT_COMPILES,
      activeCompiles,
      preview: { available: Boolean(previewRenderer), renderer: previewRenderer, dpi: PREVIEW_RENDER_DPI },
      limits: { maxProjectBytes: MAX_SOURCE_BYTES, maxRequestBytes: MAX_BODY_BYTES, maxOutputBytes: MAX_OUTPUT_BYTES, maxFiles: 100 },
    });
  }
  if (url.pathname === '/api/compile') {
    if (req.method !== 'POST') return json(res, 405, { error: 'Use POST for this endpoint.' }, { allow: 'POST' });
    const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (contentType !== 'application/json') return json(res, 415, { error: 'Compile requests must use application/json.' });
    return compileProject(req, res);
  }
  const previewMatch = url.pathname.match(/^\/api\/preview\/([a-f0-9-]{36})\/(\d+)\.png$/);
  if (previewMatch) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Use GET for this endpoint.' }, { allow: 'GET, HEAD' });
    return servePreviewImage(req, res, previewMatch[1], Number(previewMatch[2]));
  }
  if (url.pathname.startsWith('/api/')) return json(res, 404, { error: 'Unknown API route.' });
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { allow: 'GET, HEAD' }); res.end('Method not allowed'); return; }
  return serveStatic(req, res, url.pathname);
});

server.requestTimeout = COMPILE_TIMEOUT_MS + 60_000;
server.headersTimeout = 15_000;
server.keepAliveTimeout = 5_000;
server.on('error', error => {
  if (error.code === 'EADDRINUSE') console.error(`Port ${PORT} is already in use. Set PORT to a free port and try again.`);
  else console.error('Server error:', error);
  process.exit(1);
});
server.listen(PORT, HOST, () => {
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : PORT;
  const shownHost = HOST === '0.0.0.0' ? '127.0.0.1' : HOST;
  console.log(`Papertrail workspace available on http://${shownHost}:${actualPort}`);
  console.log(`Detected TeX engines: ${availableEngines.length ? availableEngines.join(', ') : 'none'}`);
  console.log(`Real TeX compile: ${compileEnabled ? `enabled on ${compileOnLoopback ? 'loopback' : 'network'}` : `disabled${compileDisabledReason ? ` (${compileDisabledReason})` : ''}`}`);
  console.log(`PDF preview renderer: ${previewRenderer ? `${previewRenderer} at ${PREVIEW_RENDER_DPI} DPI` : 'browser PDF viewer fallback'}`);
  console.log(`Limits: ${Math.round(COMPILE_TIMEOUT_MS / 1000)}s compile timeout, ${MAX_CONCURRENT_COMPILES} concurrent build${MAX_CONCURRENT_COMPILES === 1 ? '' : 's'}, ${Math.round(MAX_SOURCE_BYTES / 1024 / 1024)} MB project source.`);
});

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}; shutting down.`);
  if (previewCacheDir) fs.rm(previewCacheDir, { recursive: true, force: true }).catch(() => {});
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
