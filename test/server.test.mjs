import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let child;
let base;
let stderr = '';

function waitForServer(proc, errorText = '') {
  return new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error(`Server did not start in time.\n${output}\n${errorText}`)), 12_000);
    const onData = data => {
      output += data.toString();
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) {
        clearTimeout(timer);
        proc.stdout.off('data', onData);
        resolve(match[0]);
      }
    };
    proc.stdout.on('data', onData);
    proc.once('exit', code => {
      clearTimeout(timer);
      reject(new Error(`Server exited early with code ${code}.\n${output}\n${errorText}`));
    });
    proc.once('error', error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function stopServer(proc) {
  if (!proc || proc.exitCode !== null) return;
  proc.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => proc.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 3_000)),
  ]);
}

before(async () => {
  child = spawn(process.execPath, ['server.mjs'], {
    cwd: ROOT,
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: '0',
      ALLOW_LOCAL_TEX_COMPILE: '0',
      TEX_COMPILE_TIMEOUT_MS: '10000',
      TEX_MAX_CONCURRENT_COMPILES: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stderr.on('data', data => { stderr += data.toString(); });
  base = await waitForServer(child);
});

after(async () => {
  await stopServer(child);
});

test('serves the workspace with security headers', async () => {
  const response = await fetch(`${base}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /text\/html/);
  assert.match(response.headers.get('content-security-policy') || '', /default-src 'self'/);
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(await response.text(), /Papertrail/);
});

test('supports HEAD for static assets', async () => {
  const response = await fetch(`${base}/styles.css`, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/css; charset=utf-8');
});

test('reports compile limits in the health endpoint', async () => {
  const response = await fetch(`${base}/api/health`);
  assert.equal(response.status, 200);
  const health = await response.json();
  assert.equal(typeof health.available, 'boolean');
  assert.equal(health.enabled, false);
  assert.equal(health.hostMode, 'loopback');
  assert.match(health.reason, /(disabled|No TeX)/i);
  assert.equal(health.timeoutMs, 10_000);
  assert.equal(health.maxConcurrentCompiles, 1);
  assert.equal(health.activeCompiles, 0);
  assert.deepEqual(health.limits, {
    maxProjectBytes: 5 * 1024 * 1024,
    maxRequestBytes: 8 * 1024 * 1024,
    maxOutputBytes: 18 * 1024 * 1024,
    maxFiles: 100,
  });
});

test('keeps real compilation off when ALLOW_LOCAL_TEX_COMPILE=0', async () => {
  const response = await fetch(`${base}/api/compile`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ files: { 'main.tex': '\\documentclass{article}' }, rootFile: 'main.tex' }),
  });
  assert.equal(response.status, 503);
  const payload = await response.json();
  assert.match(payload.error, /disabled/i);
});

test('honours the loopback compile default when no opt-out is set', async () => {
  const env = {
    ...process.env,
    HOST: '127.0.0.1',
    PORT: '0',
    TEX_COMPILE_TIMEOUT_MS: '10000',
    TEX_MAX_CONCURRENT_COMPILES: '1',
  };
  delete env.ALLOW_LOCAL_TEX_COMPILE;
  let localError = '';
  const localChild = spawn(process.execPath, ['server.mjs'], {
    cwd: ROOT,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  localChild.stderr.on('data', data => { localError += data.toString(); });
  try {
    const localBase = await waitForServer(localChild, localError);
    const health = await (await fetch(`${localBase}/api/health`)).json();
    assert.equal(health.hostMode, 'loopback');
    if (health.available) {
      assert.equal(health.enabled, true);
      const response = await fetch(`${localBase}/api/compile`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          rootFile: 'main.tex',
          files: {
            'main.tex': '\\documentclass{article}\\usepackage{graphicx}\\begin{document}\\includegraphics{plot.svg}\\end{document}',
            'plot.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>',
          },
        }),
      });
      assert.equal(response.status, 422);
      assert.match((await response.json()).error, /SVG/i);
    } else {
      assert.equal(health.enabled, false);
      assert.match(health.reason, /No TeX/i);
    }
  } finally {
    await stopServer(localChild);
  }
});

test('can disable server PDF page rendering with PDF_PREVIEW=0', async () => {
  const localChild = spawn(process.execPath, ['server.mjs'], {
    cwd: ROOT,
    env: { ...process.env, HOST: '127.0.0.1', PORT: '0', ALLOW_LOCAL_TEX_COMPILE: '0', PDF_PREVIEW: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let localError = '';
  localChild.stderr.on('data', data => { localError += data.toString(); });
  try {
    const localBase = await waitForServer(localChild, localError);
    const health = await (await fetch(`${localBase}/api/health`)).json();
    assert.equal(health.preview.available, false);
    assert.equal(health.preview.renderer, null);
    const page = await fetch(`${localBase}/api/preview/00000000-0000-0000-0000-000000000000/1.png`);
    assert.equal(page.status, 503);
  } finally {
    await stopServer(localChild);
  }
});

test('rejects wrong methods and content types with JSON errors', async () => {
  const wrongHealth = await fetch(`${base}/api/health`, { method: 'POST' });
  assert.equal(wrongHealth.status, 405);
  assert.equal(wrongHealth.headers.get('allow'), 'GET');

  const wrongCompile = await fetch(`${base}/api/compile`);
  assert.equal(wrongCompile.status, 405);
  assert.equal(wrongCompile.headers.get('allow'), 'POST');

  const noType = await fetch(`${base}/api/compile`, { method: 'POST', body: '{}' });
  assert.equal(noType.status, 415);
});

test('returns 404 for unknown API routes and assets', async () => {
  const api = await fetch(`${base}/api/not-a-route`);
  assert.equal(api.status, 404);
  assert.match((await api.json()).error, /Unknown API/);

  const asset = await fetch(`${base}/missing-file.js`);
  assert.equal(asset.status, 404);
});

test('blocks encoded path traversal and dotfiles', async () => {
  const traversal = await fetch(`${base}/%2e%2e/%2e%2e/etc/passwd`);
  assert.ok([403, 404].includes(traversal.status));

  const dotfile = await fetch(`${base}/.backup/app.js`);
  assert.equal(dotfile.status, 404);
});

test('rejects non-GET static methods', async () => {
  const response = await fetch(`${base}/`, { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});
