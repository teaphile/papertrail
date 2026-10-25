const STORAGE_KEY = 'papertrail.workspace.v1';
const LIBRARY_KEY = 'papertrail.library.v1';
const PROJECT_KEY_PREFIX = 'papertrail.project.v1.';
const PREFERENCES_KEY = 'papertrail.preferences.v1';
const LEGACY_MIGRATED_KEY = 'papertrail.legacy-migrated.v1';
const DEFAULT_SETTINGS = Object.freeze({
  engine: 'pdfLaTeX',
  autoCompile: false,
  darkMode: false,
  fontSize: 11.5,
  wordWrap: false,
  lineNumbers: true,
});

const ICONS = {
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  document: '<path d="M6 3.75h8l4.25 4.3v12.2A1.75 1.75 0 0 1 16.5 22h-10A1.75 1.75 0 0 1 4.75 20.25v-14A2.5 2.5 0 0 1 7.25 3.75Z"/><path d="M14 4v4.5h4.25M8 13h8M8 16.5h8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.3 1-1.4 2.4-1.6-.6a7.7 7.7 0 0 1-1.7 1l-.3 1.7h-2.8l-.3-1.7a7.7 7.7 0 0 1-1.7-1l-1.6.6L6 16.1l1.3-1a7.3 7.3 0 0 1 0-2l-1.3-1L7.4 9.7l1.6.6a7.7 7.7 0 0 1 1.7-1l.3-1.7h2.8l.3 1.7a7.7 7.7 0 0 1 1.7 1l1.6-.6 1.4 2.4-1.3 1a7.3 7.3 0 0 1-.1 1.9Z" transform="translate(-1 -1)"/>',
  history: '<path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  compile: '<path d="M6 3.75h8l4.25 4.3v12.2A1.75 1.75 0 0 1 16.5 22h-10A1.75 1.75 0 0 1 4.75 20.25v-14A2.5 2.5 0 0 1 7.25 3.75Z"/><path d="M14 4v4.5h4.25M8 15l2.2 2.2 4.2-4.4"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h9a7 7 0 0 1 0 14h-2" transform="translate(0 -4)"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9h-9a7 7 0 0 0 0 14h2" transform="translate(0 -4)"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.3 4.3"/>',
  sigma: '<path d="M19 5H7l7 7-7 7h12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.35 2.35 0 1 1 3.7 1.9c-.9.6-1.5 1-1.5 2.4M12 17.4h.01"/>',
  files: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h4l2 2h7A1.5 1.5 0 0 1 20 9.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5Z"/><path d="M4 10h16"/>',
  outline: '<path d="M8 5h12M8 10h12M8 15h12M8 20h12"/><circle cx="4" cy="5" r=".7"/><circle cx="4" cy="10" r=".7"/><circle cx="4" cy="15" r=".7"/><circle cx="4" cy="20" r=".7"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 10h6"/>',
  'file-plus': '<path d="M6 3.75h8l4.25 4.3v12.2A1.75 1.75 0 0 1 16.5 22h-10A1.75 1.75 0 0 1 4.75 20.25v-14A2.5 2.5 0 0 1 7.25 3.75Z"/><path d="M14 4v4.5h4.25M12 12v6M9 15h6"/>',
  shield: '<path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  drive: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 14h18M7 17h.01M10 17h.01"/><path d="M7 8h10"/>',
  upload: '<path d="M12 16V4m0 0 4 4m-4-4-4 4"/><path d="M4 16v4h16v-4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6 8.5 8.5 0 1 0 20.4 14.2Z"/>',
  wrap: '<path d="M4 7h16M4 12h12a3.5 3.5 0 0 1 0 7h-3"/><path d="m15 17-2 2 2 2"/><path d="M4 19h5"/>',
  presentation: '<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M7 21h10M12 17v4M7 8h10M7 12h6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  'file-pdf': '<path d="M6 3.75h8l4.25 4.3v12.2A1.75 1.75 0 0 1 16.5 22h-10A1.75 1.75 0 0 1 4.75 20.25v-14A2.5 2.5 0 0 1 7.25 3.75Z"/><path d="M14 4v4.5h4.25M7.5 14h2.2a1.2 1.2 0 0 1 0 2.4H7.5V13m0 3.4v2M12 18.4v-5h1.2a2.5 2.5 0 0 1 0 5Zm5-5h-2v5m0-2.5h1.7"/>',
  terminal: '<path d="m4 5 6 6-6 6M12 18h8"/>',
  sync: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.5-3"/>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 18v2h16v-2"/>',
  minus: '<path d="M5 12h14"/>',
  sparkle: '<path d="m12 3 1.2 5.1L18 10l-4.8 1.7L12 17l-1.2-5.3L6 10l4.8-1.9L12 3Z"/><path d="m19 15 .6 2.2L22 18l-2.4.8L19 21l-.6-2.2L16 18l2.4-.8L19 15ZM5 15l.5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5L5 15Z"/>',
  keyboard: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01M10 9h.01M13 9h.01M16 9h.01M7 12h.01M10 12h.01M13 12h.01M16 12h.01M8 15h8"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 9h18"/>',
  tex: '<path d="M5 4h14M12 4v16M8 20h8"/><path d="M8 8h8"/>',
  bib: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 11h8M8 14h6M8 17h8"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  warning: '<path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4M12 16.5h.01"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-5L4 8"/><path d="M4 4v4h4M4 13a8 8 0 0 0 14 5l2-2"/><path d="M20 20v-4h-4"/>',
  cite: '<path d="M10 11H5V6h5v5Zm9 0h-5V6h5v5ZM5 11v3a4 4 0 0 0 4 4M14 11v3a4 4 0 0 0 4 4"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 14h18M9 4v16M15 4v16"/>',
  imagePlus: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20M17 2v4m-2-2h4"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  section: '<path d="M4 6h16M4 12h16M4 18h10"/><path d="M7 4v16"/>',
  print: '<path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6zM18 12h.01"/>',
  cursor: '<path d="m5 3 14 10-7 1-3 6L5 3Z"/>',
};

function svgIcon(name, size = 16) {
  const paths = ICONS[name] || ICONS.document;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${paths}</svg>`;
}
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    el.innerHTML = svgIcon(name);
  });
}
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const unescapeHtml = (value = '') => String(value)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const safeHref = (value = '') => {
  const url = unescapeHtml(String(value)).trim();
  if (/^(https?:|mailto:)/i.test(url) || /^#[a-zA-Z0-9_.:-]+$/.test(url)) return escapeHtml(url);
  return '#';
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const isMobileLayout = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches;
const isEditorHidden = () => !sourceEditor || $('#codeEditorWrap')?.hidden === true;
const debounce = (fn, delay) => { let timer = 0; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };

function emptyProject(settings = {}) {
  return {
    id: '',
    name: '',
    kind: 'LaTeX project',
    files: {},
    activeFile: '',
    openTabs: [],
    settings: { ...DEFAULT_SETTINGS, ...settings },
    snapshots: [],
    nextSnapshotId: 1,
    createdAt: '',
    updatedAt: '',
  };
}

function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || 'null');
    return saved && typeof saved === 'object' ? { ...DEFAULT_SETTINGS, ...saved } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function persistPreferences() {
  try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(project.settings)); } catch { /* storage may be full */ }
}

function newProjectId() {
  return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function projectStorageKey(id) {
  return `${PROJECT_KEY_PREFIX}${id}`;
}

function sanitizeProject(saved, forcedId = '') {
  const base = emptyProject();
  if (!saved || typeof saved !== 'object') return base;
  const files = {};
  if (saved.files && typeof saved.files === 'object' && !Array.isArray(saved.files)) {
    for (const [rawPath, content] of Object.entries(saved.files)) {
      if (typeof rawPath !== 'string' || rawPath.length > 180 || typeof content !== 'string') continue;
      const path = normalizeProjectPath(rawPath);
      if (path) files[path] = content;
    }
  }
  const firstTex = files['main.tex'] ? 'main.tex' : Object.keys(files).find(path => path.endsWith('.tex')) || Object.keys(files)[0] || '';
  const openTabs = Array.isArray(saved.openTabs) ? saved.openTabs.filter(path => typeof path === 'string' && path in files) : [];
  if (!openTabs.length && firstTex) openTabs.push(firstTex);
  const activeFile = typeof saved.activeFile === 'string' && saved.activeFile in files ? saved.activeFile : firstTex;
  const settings = { ...DEFAULT_SETTINGS };
  if (saved.settings && typeof saved.settings === 'object') {
    if (typeof saved.settings.engine === 'string') settings.engine = saved.settings.engine;
    if (typeof saved.settings.darkMode === 'boolean') settings.darkMode = saved.settings.darkMode;
    if (typeof saved.settings.autoCompile === 'boolean') settings.autoCompile = saved.settings.autoCompile;
    if (typeof saved.settings.wordWrap === 'boolean') settings.wordWrap = saved.settings.wordWrap;
    if (typeof saved.settings.lineNumbers === 'boolean') settings.lineNumbers = saved.settings.lineNumbers;
    const fontSize = Number(saved.settings.fontSize);
    if (Number.isFinite(fontSize)) settings.fontSize = clamp(fontSize, 9, 20);
  }
  const snapshots = Array.isArray(saved.snapshots)
    ? saved.snapshots.filter(snapshot => snapshot && snapshot.files && typeof snapshot.files === 'object').map(snapshot => ({
      id: Number(snapshot.id) || 0,
      label: typeof snapshot.label === 'string' ? snapshot.label : 'Snapshot',
      time: typeof snapshot.time === 'string' ? snapshot.time : 'Earlier',
      files: { ...snapshot.files },
      ...(Number(snapshot._time) ? { _time: Number(snapshot._time) } : {}),
    }))
    : [];
  return {
    ...base,
    id: forcedId || (typeof saved.id === 'string' && saved.id) || (typeof saved.activeProjectId === 'string' && saved.activeProjectId) || '',
    name: typeof saved.name === 'string' ? saved.name : '',
    kind: typeof saved.kind === 'string' && saved.kind ? saved.kind : 'LaTeX project',
    files,
    activeFile,
    openTabs,
    settings,
    snapshots,
    nextSnapshotId: Number(saved.nextSnapshotId) || snapshots.reduce((max, snapshot) => Math.max(max, snapshot.id), 0) + 1,
    createdAt: typeof saved.createdAt === 'string' ? saved.createdAt : '',
    updatedAt: typeof saved.updatedAt === 'string' ? saved.updatedAt : '',
  };
}

function libraryEntryFromRecord(record) {
  return {
    id: record.id,
    name: record.name || 'Untitled project',
    kind: record.kind || 'LaTeX project',
    files: Object.keys(record.files || {}).length,
    rootFile: record.files?.['main.tex'] ? 'main.tex' : Object.keys(record.files || {}).find(path => path.endsWith('.tex')) || '',
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: record.updatedAt || new Date().toISOString(),
  };
}

function discoverLibrary() {
  const discovered = [];
  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith(PROJECT_KEY_PREFIX)) continue;
      const id = key.slice(PROJECT_KEY_PREFIX.length);
      const record = readProjectRecord(id);
      if (record) discovered.push(libraryEntryFromRecord(record));
    }
  } catch {
    return [];
  }
  return discovered;
}

function readLibrary() {
  try {
    const raw = JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]');
    const items = Array.isArray(raw) && raw.length ? raw : discoverLibrary();
    if (!Array.isArray(items)) return [];
    return items
      .filter(item => item && typeof item.id === 'string' && item.id && localStorage.getItem(projectStorageKey(item.id)))
      .map(item => ({
        id: item.id,
        name: typeof item.name === 'string' && item.name.trim() ? item.name.trim() : 'Untitled project',
        kind: typeof item.kind === 'string' && item.kind ? item.kind : 'LaTeX project',
        files: Number(item.files) || 0,
        rootFile: typeof item.rootFile === 'string' ? item.rootFile : 'main.tex',
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : '',
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : '',
      }))
      .sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
  } catch {
    return [];
  }
}

function writeLibrary(library) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  } catch (error) {
    console.error('Could not write project library:', error);
  }
}

function rememberProject(record) {
  if (!record?.id) return;
  const entry = libraryEntryFromRecord(record);
  const library = readLibrary().filter(item => item.id !== entry.id);
  library.unshift(entry);
  writeLibrary(library);
  projectLibrary = library;
}

function readProjectRecord(id) {
  if (!id) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(projectStorageKey(id)) || 'null');
    if (!saved || typeof saved !== 'object') return null;
    const record = sanitizeProject(saved, id);
    record.id = id;
    return record;
  } catch {
    return null;
  }
}

function migrateLegacyWorkspace() {
  try {
    if (localStorage.getItem(LEGACY_MIGRATED_KEY) === '1') return;
  } catch { return; }
  let saved;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return; }
  if (!saved || !saved.files || typeof saved.files !== 'object' || Array.isArray(saved.files)) return;
  const id = (typeof saved.id === 'string' && saved.id) || (typeof saved.activeProjectId === 'string' && saved.activeProjectId) || 'legacy-project';
  if (localStorage.getItem(projectStorageKey(id))) {
    try { localStorage.setItem(LEGACY_MIGRATED_KEY, '1'); } catch { /* ignore */ }
    return;
  }
  const record = sanitizeProject(saved, id);
  if (!record.id) return;
  if (!record.name) record.name = 'Recovered project';
  record.createdAt = record.createdAt || new Date().toISOString();
  record.updatedAt = record.updatedAt || record.createdAt;
  try {
    localStorage.setItem(projectStorageKey(id), JSON.stringify(record));
    rememberProject(record);
    localStorage.setItem(LEGACY_MIGRATED_KEY, '1');
  } catch (error) {
    console.warn('Could not migrate the previous workspace:', error);
  }
}

let project = emptyProject(loadPreferences());
let projectLibrary = [];
let ui = {
  projectOpen: false,
  activePanel: 'files',
  zoom: 1,
  zoomMode: 'fit',
  compileDrawerOpen: false,
  activePreviewTab: 'pdf',
  isCompiled: false,
  realPdfUrl: null,
  realPdfPage: 1,
  realPdfPages: 1,
  pdfPreviewToken: null,
  pdfPreviewDpi: 0,
  pdfPreviewStale: false,
  compileLog: [],
  openFolders: new Set(),
  fileFilter: '',
  saveTimer: 0,
  compileTimer: 0,
  openMenu: null,
  lastEditorValue: '',
  lastHistoryTime: 0,
  undoStack: [],
  redoStack: [],
  restoring: false,
  compiler: { available: false, enabled: false, engine: null, engines: [], reason: 'Checking for a local TeX engine…' },
  modalType: null,
  searchQuery: '',
  currentPage: 1,
  pageTotal: 1,
  compilationInProgress: false,
  mobileView: 'source',
  sidebarOpen: false,
  dirtyFiles: new Set(),
  lastFocused: null,
  connectionState: 'checking',
  pendingImport: false
};

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const sourceEditor = $('#sourceEditor');
const highlightLayer = $('#highlightLayer');
const lineNumbers = $('#lineNumbers');
const sidebarContent = $('#sidebarContent');
const modalLayer = $('#modalLayer');
const menuLayer = $('#menuLayer');
const compileLog = $('#compileLog');
const previewLogList = $('#previewLogList');
const pdfStack = $('#pdfStack');
const previewScroll = $('#previewScroll');

const SPLIT_KEY = 'papertrail.split.v1';
function loadSplitRatio() {
  const value = Number(localStorage.getItem(SPLIT_KEY));
  return Number.isFinite(value) && value > 0.15 && value < 0.85 ? value : 0.5;
}
function saveSplitRatio() {
  try { localStorage.setItem(SPLIT_KEY, String(ui.splitRatio)); } catch { /* storage may be full */ }
}
ui.splitRatio = loadSplitRatio();

function formatProjectTime(value) {
  const date = new Date(value || '');
  if (Number.isNaN(date.getTime())) return 'Recently';
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)} hr ago`;
  if (diff < 604_800_000) return `${Math.round(diff / 86_400_000)} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
}

function projectIcon(kind = '') {
  if (/beamer|presentation|slide/i.test(kind)) return 'presentation';
  if (/thesis|report|book/i.test(kind)) return 'book';
  if (/blank|empty/i.test(kind)) return 'document';
  if (/import/i.test(kind)) return 'folder';
  return 'document';
}

function renderLauncher() {
  projectLibrary = readLibrary();
  const list = $('#launcherProjectList');
  if (!list) return;
  const count = $('#launcherProjectCount');
  if (count) count.textContent = `${projectLibrary.length} project${projectLibrary.length === 1 ? '' : 's'}`;

  if (!projectLibrary.length) {
    list.innerHTML = `<div class="launcher-empty">
      <span class="launcher-empty-icon">${svgIcon('files', 30)}</span>
      <strong>No projects yet</strong>
      <p>Create a project from a template, or import a LaTeX ZIP, .tex file, bibliography, or image asset.</p>
      <button class="button button-primary" data-action="new-project">${svgIcon('plus')} Create your first project</button>
    </div>`;
  } else {
    list.innerHTML = projectLibrary.map(entry => `<article class="launcher-project-card">
      <button class="launcher-project-open" data-action="open-project" data-project-id="${escapeHtml(entry.id)}" aria-label="Open ${escapeHtml(entry.name)}">
        <span class="launcher-project-icon">${svgIcon(projectIcon(entry.kind), 18)}</span>
        <span class="launcher-project-main">
          <strong>${escapeHtml(entry.name)}</strong>
          <span>${escapeHtml(entry.kind)} <span class="launcher-dot">·</span> ${entry.files} file${entry.files === 1 ? '' : 's'} <span class="launcher-dot">·</span> ${escapeHtml(formatProjectTime(entry.updatedAt || entry.createdAt))}</span>
        </span>
        <span class="launcher-project-open-label">Open ${svgIcon('arrow', 14)}</span>
      </button>
      <div class="launcher-project-actions">
        <button class="icon-button small-icon" data-action="export-project" data-project-id="${escapeHtml(entry.id)}" aria-label="Export ${escapeHtml(entry.name)} as ZIP" title="Export ZIP">${svgIcon('download', 14)}</button>
        <button class="icon-button small-icon launcher-delete" data-action="delete-project" data-project-id="${escapeHtml(entry.id)}" aria-label="Delete ${escapeHtml(entry.name)}" title="Delete project">${svgIcon('trash', 14)}</button>
      </div>
    </article>`).join('');
  }

  const status = $('#launcherCompiler');
  if (status) {
    if (ui.compiler.enabled) {
      status.innerHTML = `<span class="launcher-status-dot ready"></span><span><strong>${escapeHtml(ui.compiler.engine || project.settings.engine || 'TeX')}</strong> ready for real PDF builds</span><span class="launcher-status-sep">·</span><span>Shell escape disabled</span>`;
    } else if (ui.connectionState === 'checking') {
      status.innerHTML = `<span class="launcher-status-dot checking"></span><span>Checking for a local TeX engine…</span>`;
    } else if (ui.compiler.available) {
      status.innerHTML = `<span class="launcher-status-dot warning"></span><span>TeX found, but real builds are disabled</span><span class="launcher-status-sep">·</span><span>${escapeHtml(ui.compiler.reason || 'Quick Preview is still available.')}</span><button class="launcher-status-action" data-action="settings">Open settings</button>`;
    } else {
      status.innerHTML = `<span class="launcher-status-dot warning"></span><span>Quick Preview only</span><span class="launcher-status-sep">·</span><span>No local TeX engine detected</span><button class="launcher-status-action" data-action="help">Setup guide</button>`;
    }
    hydrateIcons(status);
  }
  hydrateIcons(list);
  document.title = 'Papertrail — LaTeX workspace';
}

function showWorkspace() {
  const launcher = $('#launcher');
  const shell = $('#appShell');
  if (launcher) launcher.hidden = true;
  if (shell) shell.hidden = false;
  document.body.classList.remove('launcher-open');
}

function showLauncher() {
  ui.projectOpen = false;
  const launcher = $('#launcher');
  const shell = $('#appShell');
  if (shell) shell.hidden = true;
  if (launcher) launcher.hidden = false;
  document.body.classList.add('launcher-open');
  closeSidebar();
  hideMenu();
  renderLauncher();
}

function resetWorkspaceUi() {
  clearCompiledPdf();
  ui.isCompiled = false;
  ui.compileLog = [];
  ui.compilationInProgress = false;
  ui.dirtyFiles.clear();
  ui.activePreviewTab = 'pdf';
  ui.mobileView = 'source';
  pdfStack.innerHTML = '';
  pdfStack.hidden = false;
  $('#previewEmpty').hidden = true;
  $('#previewLogs').hidden = true;
  $('#previewScroll').hidden = false;
  $('#quickPreviewNotice').hidden = false;
  $('#logAlert').hidden = true;
}

function openProject(id) {
  const record = readProjectRecord(id);
  if (!record) {
    toast('That project is no longer available. It may have been deleted or cleared from browser storage.', 'error', 5000);
    renderLauncher();
    return;
  }
  resetWorkspaceUi();
  project = record;
  // Theme, editor, and compiler choices are workspace preferences. Keep them
  // stable when switching projects instead of restoring an old project theme.
  project.settings = { ...project.settings, ...loadPreferences() };
  projectLibrary = readLibrary();
  ui.projectOpen = true;
  ui.activePanel = 'files';
  ui.openFolders = new Set(Object.keys(project.files).flatMap(path => pathAncestors(path)));
  ui.fileFilter = '';
  ui.zoom = 1;
  ui.zoomMode = 'fit';
  ui.realPdfPages = 1;
  showWorkspace();
  updateProjectHeader();
  applySettings();
  renderSidebar();
  renderTabs();
  if (project.activeFile) setEditorContent(project.activeFile);
  else setNoFileState('This project is empty');
  const result = buildQuickPreview();
  if (!result.error) renderQuickPreview(result);
  ui.isCompiled = true;
  appendCompileLogs([
    { level: 'info', message: `Opened “${project.name || 'Untitled project'}” from this browser.` },
    { level: 'info', message: ui.compiler.enabled ? `Real PDF compilation is available with ${ui.compiler.engine || project.settings.engine}.` : 'Quick Preview is active. Install a local TeX engine for real PDF output.' },
  ], 'success');
  updatePageIndicator();
  saveLocal(false);
}

function closeProject() {
  if (!ui.projectOpen) {
    showLauncher();
    return;
  }
  saveLocal(false);
  const settings = { ...project.settings };
  resetWorkspaceUi();
  project = emptyProject(settings);
  persistPreferences();
  showLauncher();
  toast('Project closed. Your files are still saved locally.');
}

function exportProjectById(id) {
  const record = (ui.projectOpen && project.id === id) ? project : readProjectRecord(id);
  if (!record) {
    toast('That project could not be exported.', 'error');
    return;
  }
  downloadBlob(makeZip(record.files), `${cleanFileName(record.name).replace(/\//g, '-') || 'latex-project'}.zip`);
  toast('Project ZIP exported');
}

function deleteProjectRecord(id) {
  const record = readProjectRecord(id);
  const name = record?.name || 'project';
  if (ui.projectOpen && project.id === id) {
    const settings = { ...project.settings };
    resetWorkspaceUi();
    ui.projectOpen = false;
    project = emptyProject(settings);
    persistPreferences();
  }
  try { localStorage.removeItem(projectStorageKey(id)); } catch { /* already gone */ }
  projectLibrary = readLibrary();
  writeLibrary(projectLibrary);
  showLauncher();
  toast(`Deleted “${name}”`, 'warning');
}

function saveLocal(showStatus = true) {
  if (!ui.projectOpen || !project.id) return;
  try {
    if (showStatus) setSaveState('saving');
    if (!String(project.name || '').trim()) project.name = 'Untitled project';
    project.updatedAt = new Date().toISOString();
    project.createdAt = project.createdAt || project.updatedAt;
    localStorage.setItem(projectStorageKey(project.id), JSON.stringify(project));
    rememberProject(project);
    ui.dirtyFiles.clear();
    if (showStatus) {
      clearTimeout(ui.saveTimer);
      ui.saveTimer = setTimeout(() => setSaveState('saved'), 240);
    }
  } catch (error) {
    console.error(error);
    setSaveState('error');
    toast('Local storage is full. Export your project to avoid losing work.', 'error', 5200);
  }
}
function setSaveState(state) {
  const box = $('#saveState');
  if (!box) return;
  box.classList.toggle('saving', state === 'saving');
  box.classList.toggle('error', state === 'error');
  $('#saveLabel').textContent = state === 'saving' ? 'Saving…' : state === 'error' ? 'Storage full' : 'All changes saved';
}
function toast(message, kind = 'success', duration = 2600) {
  const region = $('#toastRegion');
  const node = document.createElement('div');
  node.className = `toast ${kind === 'error' ? 'error' : kind === 'warning' ? 'warning' : ''}`;
  node.innerHTML = `${svgIcon(kind === 'error' ? 'warning' : kind === 'warning' ? 'info' : 'check')}<span>${escapeHtml(message)}</span>`;
  region.appendChild(node);
  setTimeout(() => { node.style.opacity = '0'; node.style.transform = 'translateY(4px)'; setTimeout(() => node.remove(), 180); }, duration);
}
function activeFileContent() { return project.files[project.activeFile] ?? ''; }
function isTextFile(path) { return !String(project.files[path] || '').startsWith('data:'); }
function fileExtension(path) { return (String(path).split('.').pop() || '').toLowerCase(); }
function isTexFile(path) { return ['tex', 'sty', 'cls', 'bst', 'bib', 'txt', 'md'].includes(fileExtension(path)); }
function updateProjectHeader() {
  const name = project.name || 'Untitled project';
  $('#projectName').value = project.name;
  $('#projectCrumb').textContent = ui.projectOpen ? name : 'No project open';
  $('#projectKind').textContent = project.kind || 'LaTeX project';
  if (ui.activePanel === 'files') $('#sidebarSubtitle').textContent = `${Object.keys(project.files).length} files · Saved locally`;
  document.title = ui.projectOpen ? `${name} — Papertrail` : 'Papertrail — LaTeX workspace';
}
function updateThemeControls() {
  const dark = Boolean(project.settings.darkMode);
  $$('[data-action="theme"]').forEach(button => {
    const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
    button.setAttribute('aria-label', label);
    button.title = label;
    const icon = button.querySelector('[data-icon]');
    if (icon) icon.setAttribute('data-icon', dark ? 'sun' : 'moon');
    const text = button.querySelector('.launcher-theme-label');
    if (text) text.textContent = dark ? 'Light mode' : 'Dark mode';
    hydrateIcons(button);
  });
}
function applySettings() {
  document.body.dataset.theme = project.settings.darkMode ? 'dark' : 'light';
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = project.settings.darkMode ? '#17211b' : '#fbfcfb';
  const size = clamp(Number(project.settings.fontSize) || 11.5, 9, 20);
  document.documentElement.style.setProperty('--editor-font-size', `${size}px`);
  sourceEditor.style.fontSize = `${size}px`;
  highlightLayer.style.fontSize = `${size}px`;
  const wrap = Boolean(project.settings.wordWrap);
  $('#codeEditorWrap').classList.toggle('soft-wrap', wrap);
  $('#codeEditorWrap').classList.toggle('hide-lines', project.settings.lineNumbers === false);
  $('#engineChip').classList.toggle('real-engine', ui.compiler.enabled);
  const engineLabel = $('#engineChip').querySelector('span:last-child');
  if (engineLabel) engineLabel.textContent = ui.compiler.enabled ? `TeX · ${ui.compiler.engine}` : 'Quick Preview';
  $('#statusEngine').textContent = ui.compiler.enabled ? `TeX engine · ${ui.compiler.engine}` : 'Quick Preview engine';
  updateThemeControls();
  persistPreferences();
}

const SNAPSHOT_BUDGET = 2.5 * 1024 * 1024;
const snapshotSignature = files => JSON.stringify(files || {});
function trimSnapshots() {
  let bytes = 0;
  const kept = [];
  for (const snapshot of project.snapshots) {
    const size = snapshotSignature(snapshot.files).length;
    if (kept.length && bytes + size > SNAPSHOT_BUDGET) break;
    bytes += size;
    kept.push(snapshot);
    if (kept.length >= 16) break;
  }
  project.snapshots = kept;
}
function ensureSnapshot(label = 'Auto-saved', force = false) {
  const stamp = new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const last = project.snapshots[0];
  const current = snapshotSignature(project.files);
  if (!force && last && snapshotSignature(last.files) === current) return false;
  project.snapshots.unshift({ id: project.nextSnapshotId++, label, time: stamp, files: { ...project.files } });
  trimSnapshots();
  saveLocal(false);
  return true;
}
function recordHistory(label = 'Edit') {
  if (ui.restoring) return;
  const now = Date.now();
  const last = project.snapshots[0];
  if (now - (last?._time || 0) < 3500) return;
  const stamp = new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const current = snapshotSignature(project.files);
  if (last && snapshotSignature(last.files) === current) return;
  project.snapshots.unshift({ id: project.nextSnapshotId++, label, time: stamp, files: { ...project.files }, _time: now });
  trimSnapshots();
}

function renderHighlight() {
  if (isEditorHidden()) return;
  const value = sourceEditor.value;
  highlightLayer.innerHTML = highlightLatex(value) + (value.endsWith('\n') ? ' ' : '');
  lineNumbers.innerHTML = value.split('\n').map((_, i) => `<span class="line-number${i === getCurrentLine() ? ' active' : ''}">${i + 1}</span>`).join('');
  lineNumbers.style.fontSize = `${Number(project.settings.fontSize) || 11.5}px`;
  highlightLayer.scrollTop = sourceEditor.scrollTop;
  highlightLayer.scrollLeft = sourceEditor.scrollLeft;
  lineNumbers.parentElement.scrollTop = sourceEditor.scrollTop;
  if (isMobileLayout()) {
    sourceEditor.scrollLeft = 0;
    highlightLayer.scrollLeft = 0;
  }
  updateCursorStatus();
}
function highlightLatex(text) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '%' && (i === 0 || text[i - 1] !== '\\')) {
      let end = text.indexOf('\n', i);
      if (end < 0) end = text.length;
      out += `<span class="syn-comment">${escapeHtml(text.slice(i, end))}</span>`;
      i = end;
      continue;
    }
    if (ch === '\\') {
      const commandMatch = text.slice(i).match(/^\\([a-zA-Z@]+\*?)/);
      if (commandMatch) {
        const full = commandMatch[0];
        const command = commandMatch[1];
        if ((command === 'begin' || command === 'end') && text[i + full.length] === '{') {
          const close = text.indexOf('}', i + full.length + 1);
          if (close !== -1) {
            const token = text.slice(i, close + 1);
            out += `<span class="syn-environment">${escapeHtml(token)}</span>`;
            i = close + 1;
            continue;
          }
        }
        out += `<span class="syn-command">${escapeHtml(full)}</span>`;
        i += full.length;
        continue;
      }
      if (i + 1 < text.length) {
        out += `<span class="syn-command">${escapeHtml(text.slice(i, i + 2))}</span>`;
        i += 2;
        continue;
      }
    }
    if (ch === '$') {
      const double = text[i + 1] === '$';
      const token = double ? '$$' : '$';
      out += `<span class="syn-math">${token}</span>`;
      i += token.length;
      continue;
    }
    if ('{}[]'.includes(ch)) {
      out += `<span class="syn-brace">${escapeHtml(ch)}</span>`;
      i++;
      continue;
    }
    const number = text.slice(i).match(/^\d+(?:\.\d+)?/);
    if (number) {
      out += `<span class="syn-number">${number[0]}</span>`;
      i += number[0].length;
      continue;
    }
    if ('&#'.includes(ch)) {
      out += `<span class="syn-key">${escapeHtml(ch)}</span>`;
      i++;
      continue;
    }
    out += escapeHtml(ch);
    i++;
  }
  return out;
}
function getCurrentLine() {
  const before = sourceEditor.value.slice(0, sourceEditor.selectionStart || 0);
  return before.split('\n').length - 1;
}
function updateCursorStatus() {
  if (isEditorHidden()) {
    $('#cursorPosition').textContent = '—';
    $('#wordCount').textContent = '0 words';
    return;
  }
  const cursor = sourceEditor.selectionStart || 0;
  const before = sourceEditor.value.slice(0, cursor);
  const line = before.split('\n').length;
  const col = cursor - before.lastIndexOf('\n');
  $('#cursorPosition').textContent = `Ln ${line}, Col ${col}`;
  const words = sourceEditor.value.trim().match(/\S+/g)?.length || 0;
  $('#wordCount').textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
}
function setNoFileState(message = 'No file open') {
  project.activeFile = '';
  $('#codeEditorWrap').hidden = true;
  const empty = $('#editorEmpty');
  empty.hidden = false;
  empty.innerHTML = `<div class="empty-icon">${svgIcon('document', 28)}</div><strong>${escapeHtml(message)}</strong><p>Choose a file from the project tree or create a new source file.</p><button class="button button-quiet" data-action="open-files">${svgIcon('files')} Browse files</button>`;
  ui.lastEditorValue = '';
  ui.undoStack = [];
  ui.redoStack = [];
  renderTabs();
  renderSidebar();
  updateContext('');
  updateCursorStatus();
}
function setEditorContent(path, { focus = false, preserveCursor = false } = {}) {
  if (!path || !(path in project.files)) { setNoFileState(path ? 'That file no longer exists' : 'No file open'); return; }
  project.activeFile = path;
  if (!project.openTabs.includes(path)) project.openTabs.push(path);
  if (project.openTabs.length > 8) project.openTabs = project.openTabs.slice(-8);
  const content = project.files[path] || '';
  const binary = content.startsWith('data:');
  $('#codeEditorWrap').hidden = binary;
  const empty = $('#editorEmpty');
  empty.hidden = !binary;
  if (binary) {
    const ext = fileExtension(path);
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext);
    const preview = isImage ? `<img class="asset-preview-image" src="${escapeHtml(content)}" alt="${escapeHtml(path.split('/').pop())}">` : `<div class="asset-preview-icon">${svgIcon(ext === 'pdf' ? 'file-pdf' : 'image', 30)}</div>`;
    const svgNote = ext === 'svg' ? ' <strong>SVG is preview-only.</strong> Export it as PNG, JPG, or PDF before a real LaTeX build.' : '';
    empty.innerHTML = `<div class="asset-preview">${preview}<strong>${escapeHtml(path.split('/').pop())}</strong><p>This is a project asset stored locally. Reference it with <code>\\includegraphics{${escapeHtml(path)}}</code>.${svgNote}</p><button class="button button-quiet" data-action="download-tex">${svgIcon('download')} Download asset</button></div>`;
    empty.hidden = false;
  } else {
    const caret = preserveCursor ? sourceEditor.selectionStart : 0;
    const scrollTop = preserveCursor ? sourceEditor.scrollTop : 0;
    const scrollLeft = preserveCursor ? sourceEditor.scrollLeft : 0;
    sourceEditor.value = content;
    ui.lastEditorValue = content;
    sourceEditor.scrollTop = scrollTop;
    sourceEditor.scrollLeft = scrollLeft;
    ui.undoStack = [];
    ui.redoStack = [];
    renderHighlight();
    if (focus) {
      sourceEditor.focus();
      sourceEditor.setSelectionRange(Math.min(caret, content.length), Math.min(caret, content.length));
    }
  }
  renderTabs();
  renderSidebar();
  updateContext(path);
  if (document.body.classList.contains('sidebar-open')) closeSidebar();
  if (isMobileLayout()) setMobileView('source', { focus: false });
  saveLocal(false);
}
function updateContext(path) {
  const ext = fileExtension(path);
  const label = !path ? 'No file' : ext === 'tex' ? 'LaTeX' : ext === 'bib' ? 'BibTeX' : ['svg', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) ? 'Image asset' : ext === 'pdf' ? 'PDF asset' : ext.toUpperCase() || 'Text';
  $('#editorContext').innerHTML = `<span class="context-dot"></span><span>${path ? 'Code editor' : 'Workspace'}</span><span class="context-separator">·</span><span class="muted-text">${escapeHtml(label)}</span>`;
  $('#encodingLabel').textContent = path ? 'UTF-8' : '—';
}
function renderTabs() {
  const tabs = project.openTabs.filter(path => path in project.files);
  $('#fileTabs').innerHTML = tabs.map(path => {
    const active = path === project.activeFile;
    const ext = fileExtension(path);
    const name = path.split('/').pop();
    const icon = ext === 'tex' ? 'tex' : ext === 'bib' ? 'bib' : ['png','jpg','jpeg','gif','webp','svg'].includes(ext) ? 'image' : 'code';
    const dirty = ui.dirtyFiles.has(path) ? `<span class="dirty-indicator" title="Unsaved changes"></span>` : '';
    return `<div class="file-tab-wrap${active ? ' active' : ''}"><button class="file-tab${active ? ' active' : ''}" data-file="${escapeHtml(path)}" title="${escapeHtml(path)}" role="tab" aria-selected="${active}">${svgIcon(icon)}<span class="tree-name">${escapeHtml(name)}</span>${dirty}</button><button class="tab-close" data-close-tab="${escapeHtml(path)}" aria-label="Close ${escapeHtml(name)}" title="Close tab">${svgIcon('close', 10)}</button></div>`;
  }).join('');
  if (!tabs.length) $('#fileTabs').innerHTML = '<span class="tabs-empty">No open files</span>';
  const activeTab = $('#fileTabs .file-tab.active');
  if (activeTab) activeTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function buildFileTree(files) {
  const root = { children: new Map(), files: [] };
  Object.keys(files).sort((a, b) => a.localeCompare(b)).forEach(path => {
    const parts = path.split('/').filter(Boolean);
    let node = root;
    for (const part of parts.slice(0, -1)) {
      if (!node.children.has(part)) node.children.set(part, { children: new Map(), files: [] });
      node = node.children.get(part);
    }
    node.files.push({ name: parts[parts.length - 1], path });
  });
  return root;
}
function iconForFile(path) {
  const ext = fileExtension(path);
  if (ext === 'tex') return 'tex';
  if (ext === 'bib') return 'bib';
  if (['png','jpg','jpeg','svg'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'file-pdf';
  return 'code';
}
function renderTreeNode(node, prefix = '') {
  let html = '';
  const forceExpanded = Boolean(ui.fileFilter);
  for (const [folder, child] of node.children) {
    const path = prefix ? `${prefix}/${folder}` : folder;
    const showChildren = forceExpanded || ui.openFolders.has(path);
    const collapsed = showChildren ? '' : ' collapsed';
    html += `<div class="tree-group"><button class="tree-row folder-row${collapsed}" data-folder="${escapeHtml(path)}"><span class="tree-chevron">${svgIcon('chevron', 11)}</span><span class="tree-icon">${svgIcon('folder')}</span><span class="tree-name">${escapeHtml(folder)}</span></button>`;
    if (showChildren) html += `<div class="tree-children">${renderTreeNode(child, path)}</div>`;
    html += '</div>';
  }
  for (const file of node.files) {
    const active = file.path === project.activeFile ? ' active' : '';
    html += `<button class="tree-row file-row${active}" data-file="${escapeHtml(file.path)}" title="${escapeHtml(file.path)}"><span class="tree-chevron"></span><span class="tree-icon">${svgIcon(iconForFile(file.path))}</span><span class="tree-name">${escapeHtml(file.name)}</span><span class="tree-context" data-file-menu="${escapeHtml(file.path)}">${svgIcon('more', 12)}</span></button>`;
  }
  return html;
}
function renderOutline() {
  const allTex = Object.entries(project.files).filter(([path, content]) => path.endsWith('.tex') && !String(content).startsWith('data:'));
  const result = [];
  for (const [path, content] of allTex) {
    const re = /\\(chapter|section|subsection|subsubsection|paragraph)\*?\{([^}]+)\}/g;
    let match;
    while ((match = re.exec(content))) result.push({ level: match[1], title: match[2], path, index: match.index });
  }
  if (!result.length) return `<div class="sidebar-empty">No sections found in your source.<br><button data-action="insert-section">Add a section</button></div>`;
  return `<div class="sidebar-section-label">Document structure</div>${result.map(item => `<button class="outline-item ${item.level === 'chapter' || item.level === 'section' ? '' : 'sublevel'}" data-outline-path="${escapeHtml(item.path)}" data-outline-index="${item.index}"><span class="outline-bullet"></span><span>${escapeHtml(item.title)}</span></button>`).join('')}`;
}
function parseBibEntries() {
  const bibFiles = Object.entries(project.files).filter(([path, content]) => path.endsWith('.bib') && !String(content).startsWith('data:'));
  const entries = [];
  for (const [path, content] of bibFiles) {
    let cursor = 0;
    while (cursor < content.length) {
      const at = content.indexOf('@', cursor);
      if (at < 0) break;
      let i = at + 1;
      while (/\s/.test(content[i] || '')) i++;
      const typeMatch = content.slice(i).match(/^[a-zA-Z]+/);
      if (!typeMatch) { cursor = at + 1; continue; }
      const type = typeMatch[0].toLowerCase();
      i += typeMatch[0].length;
      if (['comment', 'string', 'preamble'].includes(type)) { cursor = at + 1; continue; }
      while (/\s/.test(content[i] || '')) i++;
      const open = content[i];
      if (open !== '{' && open !== '(') { cursor = at + 1; continue; }
      const closing = open === '{' ? '}' : ')';
      i++;
      while (/\s/.test(content[i] || '')) i++;
      const comma = content.indexOf(',', i);
      if (comma < 0) { cursor = at + 1; continue; }
      const key = content.slice(i, comma).trim();
      if (!key) { cursor = comma + 1; continue; }
      const fields = {};
      i = comma + 1;
      while (i < content.length) {
        while (i < content.length && (/[\s,]/.test(content[i]))) i++;
        if (content[i] === closing) { i++; break; }
        const nameMatch = content.slice(i).match(/^[a-zA-Z][a-zA-Z0-9_-]*/);
        if (!nameMatch) { i++; continue; }
        const fieldName = nameMatch[0].toLowerCase();
        i += nameMatch[0].length;
        while (/\s/.test(content[i] || '')) i++;
        if (content[i] !== '=') {
          while (i < content.length && content[i] !== ',' && content[i] !== closing) i++;
          continue;
        }
        i++;
        while (/\s/.test(content[i] || '')) i++;
        let value = '';
        if (content[i] === '{') {
          let depth = 1;
          const valueStart = ++i;
          while (i < content.length && depth > 0) {
            if (content[i] === '{' && content[i - 1] !== '\\') depth++;
            else if (content[i] === '}' && content[i - 1] !== '\\') depth--;
            if (depth > 0) i++;
          }
          value = content.slice(valueStart, i);
          if (content[i] === '}') i++;
        } else if (content[i] === '"') {
          const valueStart = ++i;
          while (i < content.length && !(content[i] === '"' && content[i - 1] !== '\\')) i++;
          value = content.slice(valueStart, i);
          if (content[i] === '"') i++;
        } else {
          const valueStart = i;
          while (i < content.length && content[i] !== ',' && content[i] !== closing) i++;
          value = content.slice(valueStart, i).trim();
        }
        fields[fieldName] = value.replace(/\s+/g, ' ').trim();
        while (/\s/.test(content[i] || '')) i++;
        if (content[i] === ',') i++;
        else if (content[i] === closing) { i++; break; }
      }
      const field = name => String(fields[name] || '').replace(/[{}]/g, '').trim();
      entries.push({ key, type, title: field('title') || '(Untitled reference)', author: field('author'), year: field('year'), journal: field('journal') || field('booktitle'), path });
      cursor = Math.max(i, at + 1);
    }
  }
  return entries;
}
function renderReferences() {
  const refs = parseBibEntries();
  if (!refs.length) return `<div class="sidebar-empty">No BibTeX entries found.<br><button data-action="new-file">Create a .bib file</button></div>`;
  return `<div class="sidebar-section-label">Bibliography · ${refs.length}</div>${refs.map(ref => `<button class="reference-card" data-cite-key="${escapeHtml(ref.key)}"><span class="reference-key">${escapeHtml(ref.key)}</span><div class="reference-title">${escapeHtml(ref.title)}</div><div class="reference-meta">${escapeHtml(ref.author)}${ref.year ? ` · ${escapeHtml(ref.year)}` : ''}</div></button>`).join('')}<div class="sidebar-empty">Select an entry to insert a citation at the cursor.</div>`;
}
function renderSidebar() {
  const names = { files: ['Project files', `${Object.keys(project.files).length} files · Saved locally`], outline: ['Document outline', 'Navigate by section'], references: ['References', `${parseBibEntries().length} BibTeX entries`] };
  const [title, subtitle] = names[ui.activePanel] || names.files;
  $('#sidebarTitle').textContent = title;
  $('#sidebarSubtitle').textContent = subtitle;
  $('#sidebarSearch').hidden = ui.activePanel !== 'files';
  $('.sidebar-heading-actions').innerHTML = (ui.activePanel === 'files'
    ? `<button class="icon-button small-icon" data-action="new-file" aria-label="New file" title="New file">${svgIcon('file-plus')}</button><button class="icon-button small-icon" data-action="sidebar-menu" aria-label="More file options" title="More options">${svgIcon('more')}</button>`
    : `<button class="icon-button small-icon" data-action="${ui.activePanel === 'references' ? 'citation' : 'new-file'}" aria-label="Add item" title="Add item">${svgIcon('plus')}</button>`)
    + `<button class="icon-button small-icon sidebar-close" data-action="close-sidebar" aria-label="Close panel" title="Close panel">${svgIcon('close')}</button>`;
  $$('.rail-button[data-panel]').forEach(button => {
    const active = button.dataset.panel === ui.activePanel;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (ui.activePanel === 'files') {
    const tree = renderTreeNode(buildFileTree(project.files));
    sidebarContent.innerHTML = tree || `<div class="sidebar-empty">Your project is empty.<br><button data-action="new-file">Create your first file</button></div>`;
    if (ui.fileFilter) {
      const query = ui.fileFilter.toLowerCase();
      sidebarContent.querySelectorAll('.file-row').forEach(row => { row.hidden = !row.dataset.file.toLowerCase().includes(query); });
      sidebarContent.querySelectorAll('.folder-row').forEach(row => { row.hidden = !row.dataset.folder.toLowerCase().includes(query) && !Array.from(row.parentElement.querySelectorAll('.file-row')).some(child => !child.hidden); });
      const hasVisibleFile = Array.from(sidebarContent.querySelectorAll('.file-row')).some(row => !row.hidden);
      let empty = sidebarContent.querySelector('.filter-empty');
      if (!hasVisibleFile && Object.keys(project.files).length) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'sidebar-empty filter-empty';
          sidebarContent.appendChild(empty);
        }
        empty.textContent = `No files match “${ui.fileFilter}”.`;
      } else if (empty) {
        empty.remove();
      }
    }
  } else if (ui.activePanel === 'outline') sidebarContent.innerHTML = renderOutline();
  else if (ui.activePanel === 'references') sidebarContent.innerHTML = renderReferences();
  else sidebarContent.innerHTML = '';
  hydrateIcons(sidebarContent);
  updateProjectHeader();
}
function setPanel(panel) {
  ui.activePanel = panel;
  renderSidebar();
  if (isMobileLayout()) openSidebar();
}
function openSidebar() {
  const wasOpen = ui.sidebarOpen;
  ui.sidebarOpen = true;
  document.body.classList.add('sidebar-open');
  $('#sidebar')?.classList.add('mobile-open');
  const backdrop = $('#sidebarBackdrop');
  if (backdrop) backdrop.hidden = false;
  $$('.rail-button[data-panel]').forEach(button => button.setAttribute('aria-expanded', String(button.dataset.panel === ui.activePanel)));
  if (!wasOpen) setTimeout(() => { if (ui.sidebarOpen) $('#sidebar .sidebar-close')?.focus({ preventScroll: true }); }, 20);
}
function closeSidebar() {
  const wasOpen = ui.sidebarOpen;
  ui.sidebarOpen = false;
  document.body.classList.remove('sidebar-open');
  $('#sidebar')?.classList.remove('mobile-open');
  const backdrop = $('#sidebarBackdrop');
  if (backdrop) backdrop.hidden = true;
  $$('.rail-button[data-panel]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  if (wasOpen && isMobileLayout()) $(`.rail-button[data-panel="${ui.activePanel}"]`)?.focus({ preventScroll: true });
}
function closeTab(path) {
  const tabs = project.openTabs.filter(item => item in project.files);
  const index = tabs.indexOf(path);
  if (index < 0) return;
  const wasActive = project.activeFile === path;
  project.openTabs = tabs.filter(item => item !== path);
  ui.dirtyFiles.delete(path);
  if (wasActive) {
    const next = project.openTabs[index] || project.openTabs[index - 1] || project.openTabs.at(-1);
    if (next) setEditorContent(next);
    else setNoFileState('No open tabs');
  } else {
    renderTabs();
  }
  saveLocal(false);
}
function closeSidebarIfMobile() {
  if (isMobileLayout()) closeSidebar();
}
function setMobileView(view, options = {}) {
  ui.mobileView = view === 'preview' ? 'preview' : 'source';
  document.body.dataset.workspaceView = ui.mobileView;
  $$('button[data-mobile-view]').forEach(button => {
    const active = button.dataset.mobileView === ui.mobileView;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (ui.mobileView === 'source') {
    renderHighlight();
    if (options.focus !== false && !isEditorHidden()) sourceEditor.focus({ preventScroll: true });
  } else {
    if (document.activeElement === sourceEditor) sourceEditor.blur();
    requestAnimationFrame(() => applyZoomStyles());
  }
}

function updateActiveFileFromEditor() {
  if (!project.activeFile || isEditorHidden()) return;
  const next = sourceEditor.value;
  const previous = ui.lastEditorValue;
  if (next !== previous && !ui.restoring) {
    const now = Date.now();
    if (now - ui.lastHistoryTime > 850 || /\n$/.test(next) || /\n$/.test(previous)) {
      ui.undoStack.push(previous);
      if (ui.undoStack.length > 120) ui.undoStack.shift();
      ui.redoStack = [];
    }
    ui.lastHistoryTime = now;
    project.files[project.activeFile] = next;
    ui.lastEditorValue = next;
    ui.dirtyFiles.add(project.activeFile);
    if (ui.realPdfUrl) markPdfPreviewStale();
    renderTabs();
    setSaveState('saving');
    clearTimeout(ui.saveTimer);
    ui.saveTimer = setTimeout(() => saveLocal(true), 480);
    if (ui.activePanel === 'outline' || ui.activePanel === 'references') renderSidebar();
    if (project.settings.autoCompile) {
      clearTimeout(ui.compileTimer);
      ui.compileTimer = setTimeout(() => {
        if (ui.realPdfUrl) return;
        compileProject({ silent: true, previewOnly: true });
      }, 1250);
    }
  }
  renderHighlight();
}
function ensureEditorUsable() {
  if (isEditorHidden()) { toast('Choose a text source file first.', 'warning'); return false; }
  if (isMobileLayout() && ui.mobileView !== 'source') setMobileView('source');
  return true;
}
function insertAtCursor(text, options = {}) {
  if (!ensureEditorUsable()) return;
  sourceEditor.focus();
  const start = sourceEditor.selectionStart;
  const end = sourceEditor.selectionEnd;
  sourceEditor.setRangeText(text, start, end, options.select ? 'select' : 'end');
  sourceEditor.dispatchEvent(new Event('input', { bubbles: true }));
  if (options.select) sourceEditor.setSelectionRange(start + options.select[0], start + options.select[1]);
}
function wrapSelection(prefix, suffix = prefix) {
  if (!ensureEditorUsable()) return;
  sourceEditor.focus();
  const start = sourceEditor.selectionStart;
  const end = sourceEditor.selectionEnd;
  const selected = sourceEditor.value.slice(start, end);
  const replacement = `${prefix}${selected || 'text'}${suffix}`;
  sourceEditor.setRangeText(replacement, start, end, 'select');
  sourceEditor.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'text').length);
  sourceEditor.dispatchEvent(new Event('input', { bubbles: true }));
}
function indentSelection(outdent = false) {
  if (!ensureEditorUsable()) return;
  const start = sourceEditor.selectionStart;
  const end = sourceEditor.selectionEnd;
  const value = sourceEditor.value;
  if (start === end && !outdent) {
    sourceEditor.setRangeText('  ', start, end, 'end');
    sourceEditor.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', end) === -1 ? value.length : value.indexOf('\n', end);
  const block = value.slice(lineStart, lineEnd);
  const shifted = block.split('\n').map(line => outdent ? line.replace(/^ {1,2}/, '') : `  ${line}`).join('\n');
  sourceEditor.setRangeText(shifted, lineStart, lineEnd, 'select');
  sourceEditor.dispatchEvent(new Event('input', { bubbles: true }));
}
function toggleComment() {
  if (!ensureEditorUsable()) return;
  const start = sourceEditor.selectionStart;
  const end = sourceEditor.selectionEnd;
  const value = sourceEditor.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', end) === -1 ? value.length : value.indexOf('\n', end);
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split('\n');
  const nonEmpty = lines.filter(line => line.trim());
  const allCommented = nonEmpty.length > 0 && nonEmpty.every(line => /^\s*%/.test(line));
  const shifted = lines.map(line => allCommented ? line.replace(/^(\s*)% ?/, '$1') : `% ${line}`).join('\n');
  sourceEditor.setRangeText(shifted, lineStart, lineEnd, 'select');
  sourceEditor.dispatchEvent(new Event('input', { bubbles: true }));
}
function insertBlock(kind) {
  const blocks = {
    section: '\n\\section{New section}\\label{sec:new-section}\n\n',
    subsection: '\n\\subsection{New subsection}\n\n',
    chapter: '\n\\chapter{New chapter}\\label{chap:new-chapter}\n\n',
    equation: '\n\\begin{equation}\n  x = y + z\n  \\label{eq:new-equation}\n\\end{equation}\n\n',
    align: '\n\\begin{align}\n  a &= b + c \\\\\n  d &= e - f\n\\end{align}\n\n',
    table: '\n\\begin{table}[htbp]\n  \\centering\n  \\begin{tabular}{lcc}\n    \\toprule\n    Metric & Baseline & Proposed \\\\\n    \\midrule\n    Accuracy & 0.82 & 0.91 \\\\\n    Recall & 0.76 & 0.88 \\\\\n    \\bottomrule\n  \\end{tabular}\n  \\caption{Comparison of results.}\n  \\label{tab:results}\n\\end{table}\n\n',
    figure: '\n\\begin{figure}[htbp]\n  \\centering\n  \\includegraphics[width=0.8\\linewidth]{figures/figure.png}\n  \\caption{Figure caption.}\n  \\label{fig:example}\n\\end{figure}\n\n',
    itemize: '\n\\begin{itemize}\n  \\item First point\n  \\item Second point\n\\end{itemize}\n\n',
    enumerate: '\n\\begin{enumerate}\n  \\item First step\n  \\item Second step\n\\end{enumerate}\n\n',
    abstract: '\n\\begin{abstract}\nWrite a concise summary of your work here.\n\\end{abstract}\n\n',
    inline: '$x^2 + y^2 = z^2$',
    cite: '\\cite{nguyen2024}',
    ref: '\\ref{sec:introduction}',
    comment: '% Add a note for future edits\n',
  };
  if (!firesInsert(blocks[kind] || '\\')) return;
  hideMenu();
  toast(`${kind[0].toUpperCase()}${kind.slice(1)} inserted`);
}
function firesInsert(text) {
  if (!ensureEditorUsable()) return false;
  insertAtCursor(text);
  return true;
}
function undoEdit() {
  if (isEditorHidden() || ui.undoStack.length === 0) return;
  const current = sourceEditor.value;
  const prior = ui.undoStack.pop();
  ui.redoStack.push(current);
  ui.restoring = true;
  sourceEditor.value = prior;
  project.files[project.activeFile] = prior;
  ui.lastEditorValue = prior;
  ui.dirtyFiles.add(project.activeFile);
  sourceEditor.dispatchEvent(new Event('input', { bubbles: true }));
  ui.restoring = false;
  renderTabs();
  saveLocal();
}
function redoEdit() {
  if (isEditorHidden() || ui.redoStack.length === 0) return;
  const next = ui.redoStack.pop();
  ui.undoStack.push(sourceEditor.value);
  ui.restoring = true;
  sourceEditor.value = next;
  project.files[project.activeFile] = next;
  ui.lastEditorValue = next;
  ui.dirtyFiles.add(project.activeFile);
  sourceEditor.dispatchEvent(new Event('input', { bubbles: true }));
  ui.restoring = false;
  renderTabs();
  saveLocal();
}

function stripLatexComments(source) {
  return String(source).split('\n').map(line => {
    let out = '';
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '%' && (i === 0 || line[i - 1] !== '\\')) break;
      out += line[i];
    }
    return out;
  }).join('\n');
}
function normalizeProjectPath(path) {
  let value = String(path || '').replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '').trim();
  if (!value || value.length > 180 || value.endsWith('/') || value.includes('//')) return null;
  if (value.split('/').some(part => part === '..' || part === '.' || !part)) return null;
  if (/[\0\r\n\t]/.test(value)) return null;
  return value;
}
function pathAncestors(path) {
  const parts = String(path || '').split('/').filter(Boolean);
  return parts.slice(0, -1).map((part, index) => parts.slice(0, index + 1).join('/'));
}
function ensurePathFolders(path) {
  pathAncestors(path).forEach(folder => ui.openFolders.add(folder));
}
function pathConflicts(path, ignorePath = '') {
  return Object.keys(project.files).some(existing => existing !== ignorePath && (existing === path || existing.startsWith(`${path}/`) || path.startsWith(`${existing}/`)));
}
function importPathConflict(path) {
  return Object.keys(project.files).some(existing => existing !== path && (existing.startsWith(`${path}/`) || path.startsWith(`${existing}/`)));
}
function findIncludedPath(path, files) {
  const normalized = normalizeProjectPath(path);
  if (!normalized) return null;
  const candidates = [normalized, normalized.endsWith('.tex') ? normalized : `${normalized}.tex`];
  return candidates.find(candidate => Object.prototype.hasOwnProperty.call(files, candidate)) || null;
}
function findAssetPath(path, files) {
  const normalized = normalizeProjectPath(path);
  if (!normalized) return null;
  if (Object.prototype.hasOwnProperty.call(files, normalized)) return normalized;
  const extensions = ['', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf'];
  for (const extension of extensions) {
    const candidate = normalized + extension;
    if (Object.prototype.hasOwnProperty.call(files, candidate)) return candidate;
  }
  return null;
}
function expandIncludes(source, files, warnings = [], visited = new Set(), depth = 0) {
  if (depth > 12) { warnings.push('Include expansion stopped after 12 nested files.'); return source; }
  return String(source).replace(/\\(?:input|include)\s*\{([^}]+)\}/g, (full, requested) => {
    const path = findIncludedPath(requested, files);
    if (!path) { warnings.push(`Missing included file: ${requested}`); return `\n% Missing file: ${requested}\n`; }
    if (visited.has(path)) { warnings.push(`Circular include skipped: ${path}`); return ''; }
    visited.add(path);
    const next = expandIncludes(stripLatexComments(files[path]), files, warnings, visited, depth + 1);
    visited.delete(path);
    return `\n${next}\n`;
  });
}
function parseMetadata(source) {
  const title = source.match(/\\title\*?\s*\{([\s\S]*?)\}/)?.[1] || 'Untitled document';
  const author = source.match(/\\author\s*\{([\s\S]*?)\}/)?.[1] || '';
  const date = source.match(/\\date\s*\{([\s\S]*?)\}/)?.[1] || 'October 2026';
  return { title: simplifyLatexText(title), author: simplifyLatexText(author.replace(/\\and/g, ' · ')), date: simplifyLatexText(date) };
}
function simplifyLatexText(value) {
  return String(value).replace(/\\\\/g, ' · ').replace(/\\[a-zA-Z]+\*?/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}
function bibliographyMap() {
  const entries = parseBibEntries();
  const map = new Map();
  entries.forEach((entry, index) => map.set(entry.key, { ...entry, number: index + 1 }));
  return { entries, map };
}
function balancedGroupEnd(text, openIndex) {
  if (text[openIndex] !== '{') return -1;
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === '{' && (i === 0 || text[i - 1] !== '\\')) depth++;
    else if (text[i] === '}' && (i === 0 || text[i - 1] !== '\\')) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
function replaceLatexGroup(text, command, render) {
  let out = '';
  let cursor = 0;
  const needle = `\\${command}{`;
  while (cursor < text.length) {
    const found = text.indexOf(needle, cursor);
    if (found < 0) { out += text.slice(cursor); break; }
    const open = found + needle.length - 1;
    const close = balancedGroupEnd(text, open);
    if (close < 0) { out += text.slice(cursor, found + needle.length); cursor = found + needle.length; continue; }
    out += text.slice(cursor, found);
    out += render(text.slice(open + 1, close));
    cursor = close + 1;
  }
  return out;
}
const TEX_GLYPHS = {
  '\\alpha':'α','\\beta':'β','\\gamma':'γ','\\delta':'δ','\\epsilon':'ϵ','\\varepsilon':'ε','\\zeta':'ζ','\\eta':'η','\\theta':'θ','\\vartheta':'ϑ','\\iota':'ι','\\kappa':'κ','\\lambda':'λ','\\mu':'μ','\\nu':'ν','\\xi':'ξ','\\pi':'π','\\varpi':'ϖ','\\rho':'ρ','\\varrho':'ϱ','\\sigma':'σ','\\varsigma':'ς','\\tau':'τ','\\upsilon':'υ','\\phi':'φ','\\varphi':'ϕ','\\chi':'χ','\\psi':'ψ','\\omega':'ω',
  '\\Gamma':'Γ','\\Delta':'Δ','\\Theta':'Θ','\\Lambda':'Λ','\\Xi':'Ξ','\\Pi':'Π','\\Sigma':'Σ','\\Upsilon':'Υ','\\Phi':'Φ','\\Psi':'Ψ','\\Omega':'Ω','\\sum':'∑','\\prod':'∏','\\coprod':'∐','\\int':'∫','\\iint':'∬','\\iiint':'∭','\\oint':'∮','\\infty':'∞','\\times':'×','\\div':'÷','\\cdot':'·','\\pm':'±','\\mp':'∓','\\leq':'≤','\\geq':'≥','\\neq':'≠','\\approx':'≈','\\equiv':'≡','\\sim':'∼','\\simeq':'≃','\\propto':'∝','\\in':'∈','\\notin':'∉','\\subset':'⊂','\\subseteq':'⊆','\\supset':'⊃','\\supseteq':'⊇','\\cup':'∪','\\cap':'∩','\\emptyset':'∅','\\varnothing':'∅','\\to':'→','\\rightarrow':'→','\\leftarrow':'←','\\leftrightarrow':'↔','\\Rightarrow':'⇒','\\Leftarrow':'⇐','\\Leftrightarrow':'⇔','\\mapsto':'↦','\\forall':'∀','\\exists':'∃','\\nexists':'∄','\\partial':'∂','\\nabla':'∇','\\ell':'ℓ','\\hbar':'ℏ','\\Re':'ℜ','\\Im':'ℑ','\\angle':'∠','\\perp':'⊥','\\parallel':'∥','\\degree':'°','\\circ':'∘','\\bullet':'•','\\ldots':'…','\\dots':'…','\\cdots':'⋯','\\vdots':'⋮','\\ddots':'⋱','\\prime':'′','\\therefore':'∴','\\because':'∵'
};
function readLatexGroup(text, openIndex) {
  if (text[openIndex] !== '{') return null;
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === '{' && (i === 0 || text[i - 1] !== '\\')) depth++;
    else if (text[i] === '}' && (i === 0 || text[i - 1] !== '\\')) {
      depth--;
      if (depth === 0) return { value: text.slice(openIndex + 1, i), end: i + 1 };
    }
  }
  return null;
}
function mathToHtml(tex) {
  const source = String(tex).trim();
  let html = '';
  let i = 0;
  const glyphs = new Map(Object.entries(TEX_GLYPHS));
  while (i < source.length) {
    const rest = source.slice(i);
    const fracCommand = rest.match(/^\\(?:dfrac|tfrac|frac)\s*\{/);
    if (fracCommand) {
      const numeratorOpen = i + fracCommand[0].lastIndexOf('{');
      const numerator = readLatexGroup(source, numeratorOpen);
      if (numerator) {
        let denominatorOpen = numerator.end;
        while (/\s/.test(source[denominatorOpen] || '')) denominatorOpen++;
        const denominator = readLatexGroup(source, denominatorOpen);
        if (denominator) {
          html += `<span class="frac"><span>${mathToHtml(numerator.value)}</span><span>${mathToHtml(denominator.value)}</span></span>`;
          i = denominator.end;
          continue;
        }
      }
    }
    const sqrtMatch = rest.match(/^\\sqrt\s*(\[[^\]]*\])?\s*\{/);
    if (sqrtMatch) {
      const group = readLatexGroup(source, i + sqrtMatch[0].lastIndexOf('{'));
      if (group) { html += `${sqrtMatch[1] ? `<span class="math-root">${escapeHtml(sqrtMatch[1].slice(1, -1))}</span>` : ''}√<span class="math-run">${mathToHtml(group.value)}</span>`; i = group.end; continue; }
    }
    if (source[i] === '^' || source[i] === '_') {
      const tag = source[i] === '^' ? 'sup' : 'sub';
      i++;
      if (source[i] === '{') {
        const group = readLatexGroup(source, i);
        if (group) { html += `<${tag}>${mathToHtml(group.value)}</${tag}>`; i = group.end; continue; }
      }
      if (source[i] === '\\') {
        const command = source.slice(i).match(/^\\([a-zA-Z]+)/);
        if (command && glyphs.has(command[0])) { html += `<${tag}>${glyphs.get(command[0])}</${tag}>`; i += command[0].length; continue; }
      }
      if (i < source.length) { html += `<${tag}>${escapeHtml(source[i])}</${tag}>`; i++; continue; }
    }
    if (source[i] === '\\') {
      const command = rest.match(/^\\([a-zA-Z]+|[%&#_${}])/);
      if (command) {
        const full = command[0];
        const name = command[1];
        if (['mathrm','mathbf','mathit','text','operatorname','mathcal','mathbb','mathfrak'].includes(name) && source[i + full.length] === '{') {
          const group = readLatexGroup(source, i + full.length);
          if (group) { html += `<span class="math-run">${mathToHtml(group.value)}</span>`; i = group.end; continue; }
        }
        if (glyphs.has(full)) html += glyphs.get(full);
        else if (['left','right','displaystyle','textstyle','limits','quad','qquad'].includes(name)) { /* layout-only command */ }
        else if ([',',';','!',' '].includes(name)) html += ' ';
        else if (name.length === 1 && '%&#_${}'.includes(name)) html += escapeHtml(name);
        else html += escapeHtml(name);
        i += full.length;
        continue;
      }
    }
    if (source[i] === '{' || source[i] === '}') { i++; continue; }
    html += escapeHtml(source[i]);
    i++;
  }
  return html.replace(/\s+/g, ' ').trim();
}
function inlineLatexToHtml(source, citeMap = new Map(), labels = new Map(), options = {}) {
  let value = options.escaped ? String(source) : escapeHtml(String(source).trim());
  value = value.replace(/\\label\{([^}]+)\}/g, '');
  value = value.replace(/\\cite\w*\{([^}]+)\}/g, (_, keys) => {
    const refs = keys.split(',').map(key => citeMap.get(key.trim())).filter(Boolean);
    return refs.length ? `<span class="paper-key">[${refs.map(ref => ref.number).join(', ')}]</span>` : `<span class="missing-ref">[?]</span>`;
  });
  value = value.replace(/\\(?:eqref|ref|autoref|cref|Cref|pageref)\{([^}]+)\}/g, (_, keys) => keys.split(',').map(key => {
    const ref = labels.get(key.trim());
    return ref ? `<span class="paper-key">${escapeHtml(ref)}</span>` : '<span class="missing-ref">??</span>';
  }).join(', '));
  value = replaceLatexGroup(value, 'textbf', inner => `<strong>${inlineLatexToHtml(inner, citeMap, labels, { escaped: true })}</strong>`);
  value = replaceLatexGroup(value, 'emph', inner => `<em>${inlineLatexToHtml(inner, citeMap, labels, { escaped: true })}</em>`);
  value = replaceLatexGroup(value, 'textit', inner => `<em>${inlineLatexToHtml(inner, citeMap, labels, { escaped: true })}</em>`);
  value = replaceLatexGroup(value, 'underline', inner => `<u>${inlineLatexToHtml(inner, citeMap, labels, { escaped: true })}</u>`);
  value = replaceLatexGroup(value, 'texttt', inner => `<code class="paper-code">${inner}</code>`);
  value = replaceLatexGroup(value, 'textsuperscript', inner => `<sup>${inlineLatexToHtml(inner, citeMap, labels, { escaped: true })}</sup>`);
  value = replaceLatexGroup(value, 'textsubscript', inner => `<sub>${inlineLatexToHtml(inner, citeMap, labels, { escaped: true })}</sub>`);
  value = value.replace(/\\href\{([^}]+)\}\{([^{}]+)\}/g, (_, url, label) => `<a href="${safeHref(url)}" target="_blank" rel="noreferrer">${label}</a>`);
  value = value.replace(/\\url\{([^}]+)\}/g, (_, url) => `<a href="${safeHref(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`);
  value = value.replace(/\\verb\*?\|([^|]*)\|/g, '<code class="paper-code">$1</code>');
  value = value.replace(/\$([^$\n]+)\$/g, (_, math) => `<span class="math-run">${mathToHtml(unescapeHtml(math))}</span>`);
  value = value.replace(/\\\(([^]*?)\\\)/g, (_, math) => `<span class="math-run">${mathToHtml(unescapeHtml(math))}</span>`);
  value = value.replace(/\\(?:LaTeX|LaTex)\b/g, 'LaTeX').replace(/\\TeX\b/g, 'TeX');
  value = value.replace(/\\ldots\b|\\dots\b/g, '…').replace(/\\textendash\b/g, '–').replace(/\\textemdash\b/g, '—');
  value = value.replace(/``/g, '“').replace(/''/g, '”').replace(/---/g, '—').replace(/--/g, '–');
  value = value.replace(/\{\}/g, '');
  value = value.replace(/\\(?:newline|linebreak)\b/g, '<br>').replace(/\\\\/g, '<br>').replace(/\\(?:noindent|smallskip|medskip|bigskip)\b/g, ' ');
  value = value.replace(/\\quad/g, '&emsp;').replace(/\\qquad/g, '&emsp;&emsp;');
  value = value.replace(/~/g, '&nbsp;');
  value = value.replace(/\\([%&#_$])/g, (_, ch) => escapeHtml(ch)).replace(/\\\{/g, '{').replace(/\\\}/g, '}');
  value = value.replace(/\\[a-zA-Z]+\*?/g, '');
  return value.replace(/[ \t]+/g, ' ').trim();
}
function buildLabelMap(source) {
  const labels = new Map();
  const clean = stripLatexComments(source);
  let chapter = 0, section = 0, subsection = 0, subsubsection = 0, equation = 0, figure = 0, table = 0;
  let currentEnv = null;
  let currentEnvStarred = false;
  const lines = clean.split('\n');
  for (const line of lines) {
    const begin = line.match(/\\begin\{(equation|align|figure|table)(\*?)\}/);
    if (begin) {
      currentEnv = begin[1];
      currentEnvStarred = Boolean(begin[2]);
      if (!currentEnvStarred && (begin[1] === 'equation' || begin[1] === 'align')) equation++;
      if (!currentEnvStarred && begin[1] === 'figure') figure++;
      if (!currentEnvStarred && begin[1] === 'table') table++;
    }
    if (line.match(/\\chapter\*?\{/)) { chapter++; section = 0; subsection = 0; subsubsection = 0; }
    if (line.match(/\\section\*?\{/)) { section++; subsection = 0; subsubsection = 0; }
    if (line.match(/\\subsection\*?\{/)) { subsection++; subsubsection = 0; }
    if (line.match(/\\subsubsection\*?\{/)) subsubsection++;
    const label = line.match(/\\label\{([^}]+)\}/);
    if (label) {
      let context;
      if ((currentEnv === 'equation' || currentEnv === 'align') && currentEnvStarred) context = '*';
      else if (currentEnv === 'equation' || currentEnv === 'align') context = `(${equation || 1})`;
      else if (currentEnv === 'figure' && currentEnvStarred) context = 'Figure*';
      else if (currentEnv === 'figure') context = `Fig. ${figure || 1}`;
      else if (currentEnv === 'table' && currentEnvStarred) context = 'Table*';
      else if (currentEnv === 'table') context = `Table ${table || 1}`;
      else {
        const parts = [];
        if (chapter) parts.push(String(chapter));
        if (section || chapter) parts.push(String(section));
        if (subsection) parts.push(String(subsection));
        if (subsubsection) parts.push(String(subsubsection));
        context = parts.length ? parts.join('.') : '1';
      }
      labels.set(label[1], context);
    }
    if (line.match(/\\end\{(?:equation|align|figure|table)\*?\}/)) { currentEnv = null; currentEnvStarred = false; }
  }
  return labels;
}
function flattenBeamerFrames(source) {
  return source.replace(/\\begin\{frame\}(?:\[[^\]]*\])?(?:\{([^{}]*)\})?([\s\S]*?)\\end\{frame\}/g, (_, inlineTitle, inside) => {
    let content = inside.replace(/\\frametitle\*?\{([\s\S]*?)\}/g, (all, title) => {
      if (!inlineTitle) inlineTitle = title;
      return '';
    });
    content = content.replace(/\\framesubtitle\*?\{[^}]*\}/g, '').replace(/\\titlepage\b/g, '');
    return `\n\n${inlineTitle ? `\\section*{${inlineTitle}}` : ''}\n\n${content}\n\n`;
  });
}
function replaceBlockEnvironments(body, files, citeMap, labels) {
  const blocks = [];
  const store = html => { const key = `@@PAPERBLOCK${blocks.length}@@`; blocks.push(html); return key; };
  body = body.replace(/\\begin\{(figure|figure\*)\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{\1\}/g, (all, env, inside) => {
    const path = inside.match(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/)?.[1] || '';
    const caption = inside.match(/\\caption\*?\{([\s\S]*?)\}/)?.[1] || '';
    const alt = simplifyLatexText(caption) || path;
    let image = '';
    const assetPath = findAssetPath(path, files) || normalizeProjectPath(path);
    const asset = assetPath ? files[assetPath] : null;
    if (typeof asset === 'string' && asset.startsWith('data:image/')) image = `<img src="${escapeHtml(asset)}" alt="${escapeHtml(alt)}">`;
    else if (typeof asset === 'string' && asset.trim().startsWith('<svg')) image = `<img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(asset)}" alt="${escapeHtml(alt)}">`;
    else if (typeof asset === 'string' && asset.startsWith('data:')) image = `<img src="${escapeHtml(asset)}" alt="${escapeHtml(alt)}">`;
    else if (asset) image = `<span>${svgIcon('image', 24)}<br>${escapeHtml(path)}</span>`;
    else image = `<span>${svgIcon('image', 24)}<br>${escapeHtml(path || 'Figure asset')}</span>`;
    const cap = caption ? `<div class="paper-caption">${inlineLatexToHtml(caption, citeMap, labels)}</div>` : '';
    const label = inside.match(/\\label\{([^}]+)\}/)?.[1] || '';
    return store(`<div class="paper-figure"${label ? ` id="${escapeHtml(label)}"` : ''}><span class="figure-label">Figure preview</span><div class="figure-placeholder">${image}</div>${cap}</div>`);
  });
  body = body.replace(/\\begin\{table\*?\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{table\*?\}/g, (all, inside) => {
    const tabular = inside.match(/\\begin\{tabular\*?\}(?:\{[^}]*\})?(?:\{[^}]*\})?([\s\S]*?)\\end\{tabular\*?\}/);
    let tableHtml = '<div class="sidebar-empty">Table contents are not available in this preview.</div>';
    if (tabular) {
      let raw = tabular[1].replace(/\\(?:toprule|midrule|bottomrule|hline|cline\{[^}]*\})/g, '').trim();
      const rows = raw.split(/\\\\(?:\s*\[[^\]]*\])?/).map(row => row.trim()).filter(Boolean);
      const rowHtml = rows.map((row, index) => {
        const cells = row.split('&').map(cell => inlineLatexToHtml(cell.replace(/\\(?:multicolumn|multirow)\{[^}]*\}\{[^}]*\}\{([^}]*)\}/g, '$1'), citeMap, labels));
        const tag = index === 0 ? 'th' : 'td';
        return `<tr>${cells.map(cell => `<${tag}>${cell}</${tag}>`).join('')}</tr>`;
      }).join('');
      tableHtml = `<table><tbody>${rowHtml}</tbody></table>`;
    }
    const caption = inside.match(/\\caption\*?\{([\s\S]*?)\}/)?.[1] || '';
    const label = inside.match(/\\label\{([^}]+)\}/)?.[1] || '';
    return store(`<div class="paper-table-wrap"${label ? ` id="${escapeHtml(label)}"` : ''}>${tableHtml}${caption ? `<div class="paper-caption">${inlineLatexToHtml(caption, citeMap, labels)}</div>` : ''}</div>`);
  });
  body = body.replace(/\\begin\{(equation|equation\*|align|align\*)\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{\1\}/g, (all, env, inside) => {
    const label = inside.match(/\\label\{([^}]+)\}/)?.[1] || '';
    const tag = inside.match(/\\tag\{([^}]+)\}/)?.[1];
    const cleaned = inside.replace(/\\label\{[^}]+\}/g, '').trim();
    const equations = cleaned.split(/\\\\/).map(part => part.trim()).filter(Boolean);
    const math = equations.map(part => `<div>${mathToHtml(part.replace(/&amp;/g, '&'))}</div>`).join('');
    const numbered = !env.endsWith('*');
    const number = tag || (numbered ? String((ui.eqCount = (ui.eqCount || 0) + 1)) : '');
    const numberHtml = numbered ? `<span class="eq-number">${escapeHtml(number)}</span>` : '';
    const id = label ? ` id="${escapeHtml(label)}"` : '';
    return store(`<div class="paper-equation"${id}><div class="equation-body">${math}</div>${numberHtml}</div>`);
  });
  body = body.replace(/\\begin\{(itemize|enumerate)\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{\1\}/g, (all, env, inside) => {
    const tag = env === 'enumerate' ? 'ol' : 'ul';
    const items = inside.split(/\\item\s*/).slice(1).map(item => item.trim()).filter(Boolean);
    return store(`<${tag}>${items.map(item => `<li>${inlineLatexToHtml(item.replace(/\n/g, ' '), citeMap, labels)}</li>`).join('')}</${tag}>`);
  });
  body = body.replace(/\\begin\{description\}([\s\S]*?)\\end\{description\}/g, (_, inside) => {
    const items = inside.split(/\\item\s*/).slice(1).map(item => item.trim()).filter(Boolean);
    return store(`<dl class="paper-description">${items.map(item => {
      const term = item.match(/^\[([^\]]*)\]\s*([\s\S]*)$/);
      return term ? `<dt>${inlineLatexToHtml(term[1], citeMap, labels)}</dt><dd>${inlineLatexToHtml(term[2].replace(/\n/g, ' '), citeMap, labels)}</dd>` : `<dd>${inlineLatexToHtml(item.replace(/\n/g, ' '), citeMap, labels)}</dd>`;
    }).join('')}</dl>`);
  });
  body = body.replace(/\\begin\{(center|flushleft|flushright)\}([\s\S]*?)\\end\{\1\}/g, (_, env, inside) => store(`<div class="paper-${env}">${inlineLatexToHtml(inside.replace(/\n+/g, ' '), citeMap, labels)}</div>`));
  body = body.replace(/\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g, (_, inside) => store(`<blockquote>${inlineLatexToHtml(inside.replace(/\n/g, ' '), citeMap, labels)}</blockquote>`));
  body = body.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, (_, inside) => store(`<pre class="paper-code">${escapeHtml(inside)}</pre>`));
  body = body.replace(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/g, (_, inside) => store(`<div class="paper-abstract"><h2>Abstract</h2><p>${inlineLatexToHtml(inside.replace(/\n+/g, ' '), citeMap, labels)}</p></div>`));
  return { body, blocks };
}
function parseBibForPreview() {
  const { entries } = bibliographyMap();
  if (!entries.length) return '';
  const content = entries.map((entry, index) => {
    const author = entry.author || 'Unknown author';
    const title = entry.title || 'Untitled';
    const venue = entry.journal ? ` <em>${escapeHtml(entry.journal)}</em>.` : '.';
    return `<p><span>[${index + 1}]</span> ${escapeHtml(author)}. “${escapeHtml(title)}.”${venue} ${escapeHtml(entry.year || '')}.</p>`;
  }).join('');
  return `<h2>References</h2><div class="paper-references">${content}</div>`;
}
function renderBodyToHtml(body, blocks, citeMap, labels) {
  body = body.replace(/\\maketitle/g, '').replace(/\\bibliographystyle\{[^}]*\}/g, '').replace(/\\(?:bibliography|addbibresource)\{[^}]*\}/g, '').replace(/\\printbibliography(?:\[[^\]]*\])?/g, '');
  body = body.replace(/\\(?:centering|raggedright|raggedleft|noindent|hfill|vfill|clearpage|newpage|pagebreak|smallskip|medskip|bigskip)\b/g, '');
  body = body.replace(/\\(?:usepackage|documentclass|graphicspath|setlength|setcounter|thispagestyle|pagestyle|renewcommand|newcommand|providecommand)\*?(?:\[[^\]]*\])?\{[^}]*\}(?:\{[^}]*\})?/g, '');
  body = body.replace(/\\(?:label|index|glossary)\{[^}]*\}/g, '');
  // Block placeholders can be adjacent to headings or prose. Isolate them so they
  // render as their own block instead of leaking into an inline paragraph.
  body = body.replace(/@@PAPERBLOCK(\d+)@@/g, '\n\n@@PAPERBLOCK$1@@\n\n');
  const paragraphs = body.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);
  const out = [];
  for (let paragraph of paragraphs) {
    const blockMatch = paragraph.match(/^@@PAPERBLOCK(\d+)@@$/);
    if (blockMatch) { out.push(blocks[Number(blockMatch[1])] || ''); continue; }
    paragraph = paragraph.replace(/\\(?:begin|end)\{document\}/g, '').trim();
    if (!paragraph) continue;
    const sectionMatch = paragraph.match(/^\\(chapter|section|subsection|subsubsection|paragraph)\*?\{([\s\S]*?)\}(?:\s*\\label\{[^}]+\})?\s*([\s\S]*)$/);
    if (sectionMatch) {
      const level = sectionMatch[1];
      const title = inlineLatexToHtml(sectionMatch[2], citeMap, labels);
      const tag = level === 'chapter' ? 'h1' : level === 'section' ? 'h2' : level === 'subsection' ? 'h3' : 'h4';
      out.push(`<${tag} class="paper-heading paper-${level}">${title}</${tag}>`);
      if (sectionMatch[3].trim()) out.push(`<p>${inlineLatexToHtml(sectionMatch[3].replace(/\n/g, ' '), citeMap, labels)}</p>`);
      continue;
    }
    if (/^@@PAPERBLOCK\d+@@/.test(paragraph)) {
      paragraph = paragraph.replace(/@@PAPERBLOCK(\d+)@@/g, (_, index) => blocks[Number(index)] || '');
      out.push(paragraph);
      continue;
    }
    if (/^\\begin\{/.test(paragraph) || /^\\end\{/.test(paragraph)) continue;
    if (/\\(?:input|include)\s*\{/.test(paragraph)) continue;
    out.push(`<p>${inlineLatexToHtml(paragraph.replace(/\n/g, ' '), citeMap, labels)}</p>`);
  }
  return out.join('\n');
}
function buildQuickPreview() {
  const mainPath = project.files['main.tex'] ? 'main.tex' : Object.keys(project.files).find(path => path.endsWith('.tex'));
  if (!mainPath) return { error: 'No .tex source file found. Create or import a .tex file to preview the project.' };
  const source = project.files[mainPath] || '';
  const metadata = parseMetadata(source);
  const warnings = [];
  const expanded = stripLatexComments(expandIncludes(stripLatexComments(source), project.files, warnings));
  const labels = buildLabelMap(expanded);
  const { map: citeMap } = bibliographyMap();
  let body = expanded.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/)?.[1] || expanded;
  if (/\\documentclass(?:\[[^\]]*\])?\{beamer\}/.test(expanded)) body = flattenBeamerFrames(body);
  ui.eqCount = 0;
  const { body: blockedBody, blocks } = replaceBlockEnvironments(body, project.files, citeMap, labels);
  const abstract = blockedBody.match(/@@PAPERBLOCK(\d+)@@/g)?.map(token => {
    const index = Number(token.match(/\d+/)?.[0]);
    return blocks[index] || '';
  }).find(html => html.includes('paper-abstract')) || '';
  const renderedBody = renderBodyToHtml(blockedBody, blocks, citeMap, labels);
  const noAbstract = renderedBody.replace(/<div class="paper-abstract"[\s\S]*?<\/div>/, '');
  const referencesRequested = /\\bibliography\s*\{|\\printbibliography\b|\\begin\{thebibliography\}/.test(expanded);
  const references = referencesRequested ? parseBibForPreview() : '';
  const allHtml = `<article class="paper-page"><header class="paper-title-block"><h1>${escapeHtml(metadata.title)}</h1><div class="paper-authors">${escapeHtml(metadata.author)}</div><div class="paper-date">${escapeHtml(metadata.date)}</div></header>${abstract}${noAbstract}${references}</article>`;
  const diagnostic = collectDiagnostics(expanded, warnings);
  return { html: allHtml, warnings, diagnostics: diagnostic, mainPath, metadata };
}
function collectDiagnostics(source, includeWarnings = []) {
  const messages = includeWarnings.map(message => ({ level: 'warning', message }));
  const clean = stripLatexComments(source);
  if (!/\\begin\{document\}/.test(clean)) messages.push({ level: 'error', message: 'The root file is missing \\begin{document}.' });
  if (!/\\end\{document\}/.test(clean)) messages.push({ level: 'error', message: 'The root file is missing \\end{document}.' });
  let braceCount = 0;
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] === '\\') { i++; continue; }
    if (clean[i] === '{') braceCount++;
    if (clean[i] === '}') braceCount--;
    if (braceCount < 0) { messages.push({ level: 'error', message: 'An extra closing brace was found.' }); braceCount = 0; }
  }
  if (braceCount > 0) messages.push({ level: 'error', message: `${braceCount} opening brace${braceCount === 1 ? '' : 's'} are not closed.` });
  const envStack = [];
  const envRe = /\\(begin|end)\{([^}]+)\}/g;
  let envMatch;
  while ((envMatch = envRe.exec(clean))) {
    if (envMatch[1] === 'begin') envStack.push(envMatch[2]);
    else {
      const last = envStack.pop();
      if (last !== envMatch[2]) messages.push({ level: 'error', message: `Environment mismatch: \\end{${envMatch[2]}} does not match \\begin{${last || '…'}}.` });
    }
  }
  if (envStack.length) messages.push({ level: 'error', message: `Unclosed environment${envStack.length > 1 ? 's' : ''}: ${envStack.join(', ')}.` });
  const labels = new Set([...clean.matchAll(/\\label\{([^}]+)\}/g)].map(match => match[1]));
  const duplicateLabels = new Set();
  const seenLabels = new Set();
  for (const match of clean.matchAll(/\\label\{([^}]+)\}/g)) {
    if (seenLabels.has(match[1])) duplicateLabels.add(match[1]);
    seenLabels.add(match[1]);
  }
  for (const label of duplicateLabels) messages.push({ level: 'warning', message: `Label “${label}” is defined more than once.` });
  const bibEntries = parseBibEntries();
  const bibKeys = new Set();
  const duplicateBibKeys = new Set();
  for (const entry of bibEntries) {
    if (bibKeys.has(entry.key)) duplicateBibKeys.add(entry.key);
    bibKeys.add(entry.key);
  }
  for (const key of duplicateBibKeys) messages.push({ level: 'warning', message: `Bibliography key “${key}” is defined more than once.` });
  for (const match of clean.matchAll(/\\(?:ref|eqref|pageref|autoref|cref|Cref)\{([^}]+)\}/g)) {
    for (const key of match[1].split(',').map(part => part.trim())) if (key && !labels.has(key)) messages.push({ level: 'warning', message: `Reference “${key}” is not defined.` });
  }
  for (const match of clean.matchAll(/\\cite\w*\{([^}]+)\}/g)) {
    for (const key of match[1].split(',').map(part => part.trim())) if (key && !bibKeys.has(key)) messages.push({ level: 'warning', message: `Citation “${key}” was not found in the loaded .bib files.` });
  }
  for (const match of clean.matchAll(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g)) {
    if (!findAssetPath(match[1], project.files)) messages.push({ level: 'warning', message: `Image “${match[1]}” was not found in the project.` });
  }
  const dollarText = clean.replace(/\\\$/g, '');
  if ((dollarText.match(/(^|[^\\])\$/g) || []).length % 2 !== 0) messages.push({ level: 'warning', message: 'An unmatched $ math delimiter was found.' });
  if (/\\usepackage(?:\[[^\]]*\])?\{[^}]*minted/.test(clean)) messages.push({ level: 'warning', message: 'The minted package often needs shell escape. Shell escape is disabled in the optional local compiler.' });
  if (/\\(?:bibliography|addbibresource)\s*\{[^}]*\}|\\printbibliography\b/.test(clean) && !Object.keys(project.files).some(path => path.endsWith('.bib'))) messages.push({ level: 'warning', message: 'A bibliography is requested but no .bib file is present in the project.' });
  return messages;
}
function updatePageIndicator() {
  const total = ui.activePreviewTab === 'pdf' && ui.realPdfUrl ? ui.realPdfPages : 1;
  ui.pageTotal = Math.max(1, total);
  ui.currentPage = clamp(ui.currentPage, 1, ui.pageTotal);
  const pageNumber = $('#pageNumber');
  const pageTotal = $('#pageTotal');
  if (pageNumber) pageNumber.textContent = String(ui.currentPage);
  if (pageTotal) pageTotal.textContent = String(ui.pageTotal);
  const prev = $('[data-action="page-prev"]');
  const next = $('[data-action="page-next"]');
  if (prev) prev.disabled = ui.currentPage <= 1;
  if (next) next.disabled = ui.currentPage >= ui.pageTotal;
  const pageLabel = $('.page-control');
  if (pageLabel) pageLabel.title = ui.realPdfUrl ? 'Compiled PDF pages' : 'Quick Preview uses one continuous page';
}
function previewBaseWidth() {
  if (!previewScroll || previewScroll.clientWidth < 120) return 0;
  const style = getComputedStyle(previewScroll);
  const padding = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0);
  return Math.max(220, previewScroll.clientWidth - padding - 8);
}
function updatePreviewWidths() {
  const available = previewBaseWidth();
  if (!available) return;
  const paper = pdfStack.querySelector('.paper-page');
  if (paper) {
    const base = Math.min(available, 860);
    paper.style.width = `${Math.round(base * ui.zoom)}px`;
    paper.style.maxWidth = 'none';
  }
  const image = pdfStack.querySelector('.pdf-page-image');
  if (image) {
    const dpiScale = ui.pdfPreviewDpi ? 96 / ui.pdfPreviewDpi : 1;
    const intrinsic = image.naturalWidth ? image.naturalWidth * dpiScale : 816;
    const base = Math.min(available, Math.max(320, intrinsic));
    const width = Math.round(base * ui.zoom);
    const card = image.closest('.pdf-page-card');
    if (card) card.style.width = `${width}px`;
    image.style.width = `${width}px`;
  }
  const frame = $('#realPdfFrame');
  if (frame) frame.style.zoom = String(clamp(ui.zoom, 0.7, 1.3));
}
function applyZoomStyles() {
  document.documentElement.style.setProperty('--preview-scale', String(ui.zoom));
  pdfStack.style.setProperty('--preview-scale', String(ui.zoom));
  $('#zoomLabel').textContent = `${Math.round(ui.zoom * 100)}%`;
  updatePreviewWidths();
}
function clearCompiledPdf() {
  if (ui.realPdfUrl) URL.revokeObjectURL(ui.realPdfUrl);
  ui.realPdfUrl = null;
  ui.pdfPreviewToken = null;
  ui.pdfPreviewDpi = 0;
  ui.pdfPreviewStale = false;
  $('#realPdfFrame')?.remove();
  document.body.classList.remove('pdf-fallback');
  const noticeBar = $('#pdfNoticeBar');
  if (noticeBar) { noticeBar.hidden = true; noticeBar.innerHTML = ''; }
  pdfStack.querySelector('.pdf-document')?.remove();
  ui.realPdfPages = 1;
  ui.currentPage = 1;
}
function pdfNoticeMarkup(stale = false) {
  return `<div class="pdf-preview-notice${stale ? ' is-stale' : ''}" id="pdfPreviewNotice">${svgIcon(stale ? 'warning' : 'check')}<span><strong>${stale ? 'Compiled PDF is out of date' : 'Exact PDF output'}</strong> · ${stale ? 'Recompile to include your latest edits.' : `Rendered from ${escapeHtml(ui.compiler.engine || project.settings.engine || 'TeX')}.`}</span><span class="pdf-notice-actions">${stale ? '<button type="button" data-action="compile">Recompile</button>' : ''}<button type="button" data-action="open-pdf">Open PDF</button></span></div>`;
}
function updatePdfNotice(stale = ui.pdfPreviewStale) {
  const bar = $('#pdfNoticeBar');
  if (!bar) return;
  bar.hidden = false;
  bar.innerHTML = pdfNoticeMarkup(stale);
}
function refreshPdfPreviewPage(page = ui.currentPage, { scroll = true } = {}) {
  const image = pdfStack.querySelector('.pdf-page-image');
  if (!image || !ui.pdfPreviewToken) return;
  ui.currentPage = clamp(Number(page) || 1, 1, ui.realPdfPages);
  const card = image.closest('.pdf-page-card');
  const loading = card?.querySelector('.pdf-page-loading');
  card?.classList.remove('is-error');
  card?.classList.add('is-loading');
  if (loading) loading.innerHTML = `<span class="compile-spinner"></span><span>Rendering page ${ui.currentPage}…</span>`;
  image.alt = `Compiled PDF page ${ui.currentPage} of ${ui.realPdfPages}`;
  const caption = pdfStack.querySelector('.pdf-page-caption');
  if (caption) caption.textContent = `Page ${ui.currentPage} of ${ui.realPdfPages} · rendered from the compiled PDF`;
  image.onload = () => {
    card?.classList.remove('is-loading');
    updatePreviewWidths();
    if (ui.currentPage < ui.realPdfPages) new Image().src = `/api/preview/${ui.pdfPreviewToken}/${ui.currentPage + 1}.png`;
    if (ui.currentPage > 1) new Image().src = `/api/preview/${ui.pdfPreviewToken}/${ui.currentPage - 1}.png`;
  };
  image.onerror = () => {
    card?.classList.remove('is-loading');
    card?.classList.add('is-error');
    if (loading) loading.innerHTML = `${svgIcon('warning', 20)}<strong>Page preview unavailable</strong><span>Open the compiled PDF directly to view this page.</span><button type="button" class="button button-quiet small-button" data-action="open-pdf">Open PDF</button>`;
    hydrateIcons(loading);
  };
  image.src = `/api/preview/${ui.pdfPreviewToken}/${ui.currentPage}.png`;
  updatePageIndicator();
  if (scroll) previewScroll.scrollTo({ top: 0 });
}
function renderCompiledPdf(payload) {
  const preview = payload.preview;
  const pages = Math.max(1, Number(payload.pages) || 1);
  if (!preview?.token) return false;
  clearCompiledPdf();
  ui.pdfPreviewToken = preview.token;
  ui.pdfPreviewDpi = Number(preview.dpi) || 120;
  ui.realPdfPages = pages;
  ui.currentPage = 1;
  ui.pdfPreviewStale = false;
  const noticeBar = $('#pdfNoticeBar');
  if (noticeBar) { noticeBar.hidden = false; noticeBar.innerHTML = pdfNoticeMarkup(false); }
  pdfStack.innerHTML = `<div class="pdf-document" role="document" aria-label="Compiled PDF preview"><div class="pdf-page-card is-loading" aria-busy="true"><img class="pdf-page-image" alt="Compiled PDF page 1 of ${pages}" decoding="async"><div class="pdf-page-loading"><span class="compile-spinner"></span><span>Rendering page 1…</span></div></div><p class="pdf-page-caption">Page 1 of ${pages} · rendered from the compiled PDF</p></div>`;
  pdfStack.hidden = false;
  $('#previewEmpty').hidden = true;
  $('#previewLogs').hidden = true;
  $('#previewScroll').hidden = false;
  $('#quickPreviewNotice').hidden = true;
  const card = pdfStack.querySelector('.pdf-page-card');
  const image = pdfStack.querySelector('.pdf-page-image');
  image.addEventListener('load', () => {
    card?.classList.remove('is-loading');
    const caption = pdfStack.querySelector('.pdf-page-caption');
    if (caption) caption.textContent = `Page ${ui.currentPage} of ${pages} · rendered from the compiled PDF`;
  }, { once: false });
  setPreviewTab('pdf');
  refreshPdfPreviewPage(1);
  applyZoomStyles();
  return true;
}
function renderQuickPreview(result) {
  clearCompiledPdf();
  pdfStack.hidden = false;
  $('#previewEmpty').hidden = true;
  $('#previewLogs').hidden = true;
  $('#previewScroll').hidden = false;
  if (result.error) {
    pdfStack.innerHTML = '';
    $('#previewEmpty').hidden = false;
    $('#quickPreviewNotice').hidden = false;
    $('#previewEmpty').innerHTML = `<span>${svgIcon('warning', 30)}</span><strong>Nothing to preview yet</strong><p>${escapeHtml(result.error)}</p><button class="button button-primary" data-action="new-file"><span data-icon="file-plus"></span> Create a file</button>`;
    hydrateIcons($('#previewEmpty'));
    updatePageIndicator();
    return;
  }
  pdfStack.innerHTML = result.html;
  $('#quickPreviewNotice').hidden = !result;
  applyZoomStyles();
  updatePageIndicator();
}
function markPdfPreviewStale() {
  if (!ui.realPdfUrl || ui.pdfPreviewStale) return;
  ui.pdfPreviewStale = true;
  updatePdfNotice(true);
  const status = $('#statusCompile');
  if (status) status.textContent = 'PDF out of date';
}
function setCompilerStatus() {
  applySettings();
  const notice = $('#quickPreviewNotice');
  if (!notice) return;
  notice.hidden = false;
  if (ui.compiler.enabled) {
    notice.innerHTML = `${svgIcon('info')}<span><strong>Quick Preview</strong> · Browser approximation. ${escapeHtml(ui.compiler.engine || project.settings.engine)} is ready for exact PDF builds.</span><button data-action=\"compile\" aria-label=\"Recompile with TeX\">Recompile</button>`;
    notice.classList.add('engine-ready');
  } else if (ui.compiler.available) {
    notice.innerHTML = `${svgIcon('info')}<span><strong>Quick Preview</strong> · A TeX engine was found, but real builds are disabled. ${escapeHtml(ui.compiler.reason || '')}</span><button data-action="settings" aria-label="Configure compiler">Settings</button>`;
    notice.classList.remove('engine-ready');
  } else {
    notice.innerHTML = `${svgIcon('info')}<span><strong>Quick Preview</strong> · Browser-rendered approximation. Install TeX Live or TinyTeX for exact PDF output.</span><button data-action="help" aria-label="Open compiler setup guide">Setup</button>`;
    notice.classList.remove('engine-ready');
  }
  const badge = $('#launcherVisualBadge');
  if (badge) {
    const label = ui.compiler.enabled ? 'Real PDF ready' : ui.compiler.available ? 'TeX detected' : 'Quick Preview ready';
    badge.innerHTML = `<span data-icon="${ui.compiler.enabled ? 'check' : 'info'}"></span><span>${label}</span>`;
    hydrateIcons(badge);
  }
  if (!ui.projectOpen) renderLauncher();
}
function setConnectionState(state) {
  ui.connectionState = state;
  const online = $('.status-online');
  if (!online) return;
  online.classList.toggle('offline', state === 'offline');
  online.classList.toggle('checking', state === 'checking');
  online.lastChild.textContent = state === 'offline' ? 'Local only' : state === 'checking' ? 'Checking…' : 'Local server';
  online.title = state === 'online'
    ? 'Connected to the local compile service. Builds still use this browser or the local TeX engine you configured.'
    : state === 'checking'
      ? 'Checking the optional local compile service.'
      : 'The optional compile service is unreachable. Editing and local storage still work.';
}
async function detectCompiler() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch('/api/health', { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error('compiler endpoint is unavailable');
    const info = await response.json();
    ui.compiler = { ...ui.compiler, ...info };
    setConnectionState('online');
  } catch (error) {
    if (error.name === 'AbortError') console.warn('Compiler health check timed out.');
    ui.compiler = { available: false, enabled: false, engine: null, engines: [], reason: 'The local compile service is unreachable. Start the workspace with npm start to use real PDF builds.' };
    setConnectionState('offline');
  } finally {
    clearTimeout(timer);
  }
  setCompilerStatus();
  if (ui.isCompiled) {
    const result = buildQuickPreview();
    if (!ui.compiler.enabled || !ui.realPdfUrl) renderQuickPreview(result);
  }
}
function appendCompileLogs(lines, status = 'success') {
  ui.compileLog = lines.map(line => typeof line === 'string' ? { level: 'info', message: line, time: new Date() } : { ...line, time: line.time || new Date() });
  const html = ui.compileLog.map(line => {
    const text = escapeHtml(line.message);
    const location = String(line.message).match(/^(.*?\.(?:tex|bib|sty|cls)):(\d+):/);
    const body = location
      ? `<button class="log-link" data-log-path="${escapeHtml(location[1])}" data-log-line="${escapeHtml(location[2])}">${text}</button>`
      : `<span>${text}</span>`;
    return `<div class="log-line ${line.level === 'error' ? 'log-error' : line.level === 'warning' ? 'log-warning' : ''}"><span class="log-time">${new Date(line.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>${body}</div>`;
  }).join('');
  compileLog.innerHTML = html || '<div class="log-line">No output.</div>';
  previewLogList.innerHTML = html || '<div class="log-line">No output.</div>';
  const indicator = $('#drawerIndicator');
  const previewIndicator = $('#previewLogIndicator');
  if (indicator) indicator.className = `drawer-indicator ${status}`;
  if (previewIndicator) previewIndicator.className = `drawer-indicator ${status}`;
  const errors = ui.compileLog.filter(line => line.level === 'error').length;
  const warnings = ui.compileLog.filter(line => line.level === 'warning').length;
  const drawerSummary = $('#drawerSummary');
  if (drawerSummary) drawerSummary.textContent = errors ? `${errors} error${errors === 1 ? '' : 's'}${warnings ? ` · ${warnings} warning${warnings === 1 ? '' : 's'}` : ''}` : warnings ? `${warnings} warning${warnings === 1 ? '' : 's'}` : 'Build finished';
  const statusCompile = $('#statusCompile');
  if (statusCompile) statusCompile.textContent = errors ? `${errors} error${errors === 1 ? '' : 's'}` : warnings ? `${warnings} warning${warnings === 1 ? '' : 's'}` : 'Quick Preview ready';
  const alert = $('#logAlert');
  if (alert) {
    alert.hidden = errors + warnings === 0;
    alert.classList.toggle('error', errors > 0);
    alert.classList.toggle('warning', errors === 0 && warnings > 0);
  }
}
function unsupportedSvgReferences() {
  const hits = [];
  for (const [path, content] of Object.entries(project.files)) {
    if (!path.endsWith('.tex') || typeof content !== 'string') continue;
    const source = stripLatexComments(content);
    for (const match of source.matchAll(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g)) {
      if (/\.svg$/i.test(match[1].trim())) hits.push(`${path}: ${match[1].trim()}`);
    }
  }
  return hits;
}

async function compileProject({ silent = false, previewOnly = false } = {}) {
  if (!ui.projectOpen) {
    if (!silent) toast('Create or open a project before compiling.', 'warning');
    return;
  }
  if (ui.compilationInProgress) return;
  ui.compilationInProgress = true;
  const button = $('.compile-button');
  const original = button.innerHTML;
  button.disabled = true;
  button.classList.add('compiling');
  button.innerHTML = `<span class="compile-spinner"></span><span>Building…</span>`;
  const started = Date.now();
  try {
    const root = project.files['main.tex'] ? 'main.tex' : Object.keys(project.files).find(path => path.endsWith('.tex'));
    if (!root) {
      const result = { error: 'No .tex source file found. Create or import a .tex file to preview the project.' };
      renderQuickPreview(result);
      appendCompileLogs([{ level: 'error', message: result.error }], 'error');
      if (!silent) toast(result.error, 'error');
      return;
    }
    const svgReferences = unsupportedSvgReferences();
    if (ui.compiler.enabled && !previewOnly && svgReferences.length) {
      const message = 'SVG images are preview-only. Export the figure as PNG, JPG, or PDF and update \\includegraphics before compiling a real PDF.';
      appendCompileLogs([
        { level: 'error', message },
        ...svgReferences.map(reference => ({ level: 'error', message: `SVG reference: ${reference}` })),
      ], 'error');
      openCompileDrawer(true);
      if (!silent) toast(message, 'error', 5200);
      return;
    }
    recordHistory('Compile checkpoint');
    if (ui.compiler.enabled && !previewOnly) {
      const compileFiles = Object.fromEntries(Object.entries(project.files).filter(([, content]) => typeof content === 'string'));
      const timeoutMs = clamp(Number(ui.compiler.timeoutMs) || 120_000, 10_000, 300_000) + 20_000;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      let response;
      try {
        response = await fetch('/api/compile', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ files: compileFiles, rootFile: root, engine: project.settings.engine }), signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
      const payload = await response.json();
      const logLines = (payload.logs || []).map(line => ({ level: line.level || 'info', message: line.message || String(line) }));
      if (!response.ok || !payload.pdfBase64) {
        appendCompileLogs([...logLines, { level: 'error', message: payload.error || 'TeX compilation failed.' }], 'error');
        ui.isCompiled = true;
        renderQuickPreview(buildQuickPreview());
        if (!silent) toast('TeX compile failed. Open Logs for details.', 'error');
      } else {
        const binary = atob(payload.pdfBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const renderedInApp = renderCompiledPdf(payload);
        if (!renderedInApp) clearCompiledPdf();
        ui.realPdfUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        if (!renderedInApp) {
          pdfStack.innerHTML = '';
          pdfStack.hidden = true;
          $('#previewEmpty').hidden = true;
          $('#previewLogs').hidden = true;
          $('#previewScroll').hidden = false;
          let iframe = $('#realPdfFrame');
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'realPdfFrame';
            iframe.className = 'real-pdf-frame';
            iframe.title = 'Compiled PDF';
            iframe.setAttribute('aria-label', 'Compiled PDF document');
            previewScroll.appendChild(iframe);
          }
          ui.realPdfPages = Math.max(1, Number(payload.pages) || 1);
          ui.currentPage = 1;
          document.body.classList.add('pdf-fallback');
          const noticeBar = $('#pdfNoticeBar');
          if (noticeBar) {
            noticeBar.hidden = false;
            noticeBar.innerHTML = `<div class="pdf-preview-notice" id="pdfPreviewNotice">${svgIcon('info')}<span><strong>Browser PDF viewer</strong> · Server page rendering is unavailable. Use the viewer toolbar to zoom and navigate.</span><span class="pdf-notice-actions"><button type="button" data-action="open-pdf">Open PDF</button></span></div>`;
          }
          iframe.src = `${ui.realPdfUrl}#page=1&toolbar=1&navpanes=0&view=FitH`;
          setPreviewTab('pdf');
          applyZoomStyles();
          $('#quickPreviewNotice').hidden = true;
        }
        ui.pdfPreviewStale = false;
        updatePageIndicator();
        appendCompileLogs([...logLines, { level: 'info', message: `PDF generated by ${payload.engine || ui.compiler.engine || 'TeX'} in ${((Date.now() - started) / 1000).toFixed(1)}s.` }], 'success');
        setConnectionState('online');
        const pdfStatus = $('#statusCompile');
        if (pdfStatus) pdfStatus.textContent = 'PDF ready';
        if (!silent) { toast('PDF compiled successfully'); if (isMobileLayout()) setMobileView('preview'); }
      }
    } else {
      await sleep(360);
      const result = buildQuickPreview();
      if (result.error) {
        renderQuickPreview(result);
        appendCompileLogs([{ level: 'error', message: result.error }], 'error');
        if (!silent) toast(result.error, 'error');
        return;
      }
      renderQuickPreview(result);
      if (!silent) setPreviewTab('pdf');
      ui.currentPage = 1;
      const diagnostic = result.diagnostics;
      const hasErrors = diagnostic.some(item => item.level === 'error');
      const warnings = diagnostic.filter(item => item.level === 'warning');
      const lines = [
        { level: 'info', message: `Quick Preview rendered from ${result.mainPath}.` },
        { level: 'info', message: 'Quick Preview is an approximation of LaTeX. Connect a local TeX engine for a real PDF.' },
        ...diagnostic,
      ];
      if (diagnostic.length === 0) lines.push({ level: 'info', message: 'No basic source-structure issues detected.' });
      appendCompileLogs(lines, hasErrors ? 'error' : warnings.length ? 'warning' : 'success');
      if (!silent) {
        if (isMobileLayout()) setMobileView('preview');
        toast(hasErrors ? 'Preview built with source errors. Check the log.' : warnings.length ? `Preview updated · ${warnings.length} warning${warnings.length === 1 ? '' : 's'}` : 'Preview updated');
      }
    }
    ui.isCompiled = true;
    saveLocal(false);
  } catch (error) {
    console.error(error);
    const offline = error.name === 'TypeError' || /fetch|network/i.test(error.message || '');
    if (offline) setConnectionState('offline');
    const message = error.name === 'AbortError'
      ? 'The compile request exceeded its time limit. Check the source or raise TEX_COMPILE_TIMEOUT_MS on the local server.'
      : offline
        ? 'The local compile service is unreachable. Falling back to Quick Preview; editing still works.'
        : error.message || 'The compile request failed.';
    appendCompileLogs([{ level: 'error', message }], 'error');
    const fallback = buildQuickPreview();
    if (!fallback.error) { renderQuickPreview(fallback); setPreviewTab('pdf'); ui.isCompiled = true; }
    if (!silent) toast(error.name === 'AbortError' ? 'Compile timed out. See the log for details.' : offline ? 'Compiler unreachable. Showing Quick Preview instead.' : 'Build failed. See the log for details.', 'error');
  } finally {
    ui.compilationInProgress = false;
    button.disabled = false;
    button.classList.remove('compiling');
    button.innerHTML = original;
    hydrateIcons(button);
    if (ui.compileDrawerOpen && !silent) $('#compileDrawer').hidden = false;
  }
}
function openCompileDrawer(open = true) {
  ui.compileDrawerOpen = open;
  $('#compileDrawer').hidden = !open;
}
function setPreviewTab(tab) {
  ui.activePreviewTab = tab === 'logs' ? 'logs' : 'pdf';
  $$('.preview-tab').forEach(button => {
    const active = button.dataset.previewTab === ui.activePreviewTab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  const pdfMode = ui.activePreviewTab === 'pdf';
  $('#previewScroll').hidden = !pdfMode;
  $('#previewLogs').hidden = pdfMode;
  $('#pdfNoticeBar').hidden = !pdfMode || !$('#pdfPreviewNotice');
  document.querySelector('.preview-pane')?.classList.toggle('logs-mode', !pdfMode);
  updatePageIndicator();
}
function adjustZoom(delta, absolute = null) {
  const next = absolute === null ? ui.zoom + delta : absolute;
  ui.zoom = clamp(Math.round(next * 100) / 100, 0.65, 1.6);
  ui.zoomMode = 'manual';
  applyZoomStyles();
}
function gotoPage(page) {
  if (!ui.realPdfUrl) { updatePageIndicator(); return; }
  ui.currentPage = clamp(Number(page) || 1, 1, ui.realPdfPages);
  if (ui.pdfPreviewToken) {
    refreshPdfPreviewPage(ui.currentPage);
    return;
  }
  const frame = $('#realPdfFrame');
  if (frame) frame.src = `${ui.realPdfUrl}#page=${ui.currentPage}&toolbar=0&navpanes=0&view=FitH`;
  updatePageIndicator();
}
function approximateSync() {
  if (ui.realPdfUrl) { toast('This build is a real PDF. Use the page controls to navigate.', 'warning'); return; }
  if (isEditorHidden()) { toast('Open a source file to sync with the preview.', 'warning'); return; }
  const cursor = sourceEditor.selectionStart || 0;
  const before = sourceEditor.value.slice(0, cursor);
  const section = before.match(/\\(?:chapter|section|subsection)\*?\{([^}]+)\}/g)?.at(-1);
  const title = section?.match(/\{([^}]+)\}/)?.[1];
  if (title) {
    const target = Array.from(pdfStack.querySelectorAll('h1,h2,h3,h4')).find(node => node.textContent.includes(simplifyLatexText(title)));
    if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); toast('Scrolled to the nearest matching section'); return; }
  }
  previewScroll.scrollTo({ top: 0, behavior: 'smooth' });
  toast('Preview positioned at the document start. Exact SyncTeX needs a real TeX build.', 'warning');
}

function menuItems(menu) {
  const definitions = {
    file: [
      ['new-project', 'New project', 'document'], ['new-file', 'New file', 'file-plus'], ['import', 'Import project files…', 'upload'], ['divider'], ['download-project', 'Download project ZIP', 'download'], ['download-tex', 'Download current file', 'download'], ['divider'], ['settings', 'Workspace settings', 'settings'], ['close-project', 'Close project', 'folder']
    ],
    edit: [
      ['undo', 'Undo', 'undo', 'Ctrl/⌘+Z'], ['redo', 'Redo', 'redo', 'Ctrl/⌘+Shift+Z'], ['divider'], ['search', 'Find in project', 'search', 'Ctrl/⌘+F'], ['select-all', 'Select all in editor', 'cursor', 'Ctrl/⌘+A']
    ],
    insert: [
      ['insert-section', 'Section', 'section'], ['insert-subsection', 'Subsection', 'list'], ['insert-chapter', 'Chapter', 'book'], ['insert-equation', 'Equation', 'sigma'], ['insert-table', 'Table', 'table'], ['insert-figure', 'Figure', 'imagePlus'], ['divider'], ['citation', 'Citation…', 'cite'], ['symbols', 'Math symbol…', 'sigma']
    ],
    view: [
      ['panel-outline', 'Document outline', 'outline'], ['panel-references', 'References', 'book'], ['compile-logs', 'Build log', 'terminal'], ['divider'], ['toggle-wrap', project.settings.wordWrap ? 'Turn off word wrap' : 'Turn on word wrap', 'wrap'], ['toggle-lines', project.settings.lineNumbers === false ? 'Show line numbers' : 'Hide line numbers', 'list'], ['divider'], ['theme', project.settings.darkMode ? 'Switch to light theme' : 'Switch to dark theme', project.settings.darkMode ? 'sun' : 'moon'], ['settings', 'Workspace settings', 'settings']
    ],
    project: [
      ['projects', 'Project library', 'files'], ['new-project', 'New project', 'plus'], ['divider'], ['settings', 'Workspace settings', 'settings'], ['history', 'Version history', 'history'], ['divider'], ['import', 'Import files…', 'upload'], ['download-project', 'Download ZIP', 'download'], ['copy-project', 'Duplicate project', 'copy'], ['divider'], ['close-project', 'Close project', 'folder'], ['delete-project', 'Delete project', 'trash']
    ],
    sidebar: [['new-file', 'New file', 'file-plus'], ['import', 'Import files…', 'upload'], ['download-project', 'Download project ZIP', 'download'], ['settings', 'Workspace settings', 'settings']],
    editor: [['undo', 'Undo', 'undo'], ['redo', 'Redo', 'redo'], ['search', 'Find in project', 'search'], ['settings', 'Editor settings', 'settings']],
    preview: ui.realPdfUrl
      ? [['sync', 'Sync source and preview', 'sync'], ['preview-search', 'Find in preview', 'search'], ['open-pdf', 'Open PDF in new tab', 'external'], ['download-pdf', 'Download PDF', 'download'], ['divider'], ['zoom-reset', 'Reset zoom to fit', 'refresh']]
      : [['sync', 'Sync source and preview', 'sync'], ['preview-search', 'Find in preview', 'search'], ['print', 'Print Quick Preview', 'print'], ['zoom-reset', 'Reset zoom to fit', 'refresh']],
    insertQuick: [['insert-section', 'Section', 'section'], ['insert-equation', 'Equation', 'sigma'], ['insert-table', 'Table', 'table'], ['insert-figure', 'Figure', 'imagePlus'], ['citation', 'Citation', 'cite'], ['symbols', 'Symbol palette', 'sigma']]
  };
  return definitions[menu] || definitions.project;
}
function actionFromMenuItem(key) {
  const map = {
    'new-project': 'new-project', 'new-file': 'new-file', 'import': 'import', 'download-project': 'download-project', 'download-tex': 'download-tex', settings: 'settings',
    projects: 'projects', 'close-project': 'close-project', history: 'history', 'copy-project': 'copy-project', 'delete-project': 'delete-project',
    undo: 'undo', redo: 'redo', search: 'search', 'select-all': 'select-all', 'insert-section': 'insert-section', 'insert-subsection': 'insert-subsection', 'insert-chapter': 'insert-chapter', 'insert-equation': 'insert-equation',
    'insert-table': 'insert-table', 'insert-figure': 'insert-figure', citation: 'citation', symbols: 'symbols', 'panel-outline': 'panel-outline', 'panel-references': 'panel-references',
    'compile-logs': 'compile-logs', theme: 'theme', sync: 'sync',
    'preview-search': 'preview-search', print: 'print', 'open-pdf': 'open-pdf', 'download-pdf': 'download-pdf', 'zoom-reset': 'zoom-reset', 'toggle-wrap': 'toggle-wrap', 'toggle-lines': 'toggle-lines'
  };
  return map[key] || key;
}
function showMenu(anchor, name) {
  hideMenu();
  const rect = anchor.getBoundingClientRect();
  const layer = menuLayer;
  layer.hidden = false;
  const items = menuItems(name);
  const html = items.map(item => {
    if (item[0] === 'divider') return '<div class="menu-divider" role="separator"></div>';
    const [key, label, icon, shortcut] = item;
    return `<button class="menu-item" role="menuitem" data-menu-action="${escapeHtml(actionFromMenuItem(key))}"${key.startsWith('insert-') ? ` data-insert-kind="${escapeHtml(key.replace('insert-', ''))}"` : ''}>${svgIcon(icon)}<span>${escapeHtml(label)}</span>${shortcut ? `<span class="menu-shortcut">${escapeHtml(shortcut)}</span>` : ''}</button>`;
  }).join('');
  const menu = document.createElement('div');
  menu.className = 'menu-popover';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', `${name} menu`);
  menu.innerHTML = html;
  menu.style.visibility = 'hidden';
  menu.style.left = '0px';
  menu.style.top = '0px';
  layer.appendChild(menu);
  const menuRect = menu.getBoundingClientRect();
  const left = clamp(rect.left, 8, Math.max(8, window.innerWidth - menuRect.width - 8));
  let top = rect.bottom + 4;
  if (top + menuRect.height > window.innerHeight - 8) top = Math.max(8, rect.top - menuRect.height - 4);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.visibility = '';
  ui.openMenu = name;
  anchor.classList.add('open');
  menu.querySelector('.menu-item')?.focus({ preventScroll: true });
}
function hideMenu() {
  menuLayer.hidden = true;
  menuLayer.innerHTML = '';
  $$('.menu-trigger').forEach(button => button.classList.remove('open'));
  ui.openMenu = null;
}

function modalFrame(title, content, options = {}) {
  const headingIcon = options.icon || 'document';
  const footer = options.footer || `<button class="button button-quiet" data-modal-action="close">Close</button>`;
  return `<div class="modal-card${options.wide ? ' modal-wide' : ''}" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
    <header class="modal-header"><div class="modal-heading-title"><span>${svgIcon(headingIcon)}</span><div><h2>${escapeHtml(title)}</h2>${options.subtitle ? `<p>${escapeHtml(options.subtitle)}</p>` : ''}</div></div><button class="icon-button" data-modal-action="close" aria-label="Close dialog">${svgIcon('close')}</button></header>
    <div class="modal-body">${content}</div><footer class="modal-footer">${footer}</footer></div>`;
}
function openModal(type, extra = {}) {
  hideMenu();
  ui.modalType = type;
  let content = '';
  let frame = '';
  if (type === 'filemenu') {
    const path = extra.path || project.activeFile;
    if (!path || !(path in project.files)) { closeModal(); return; }
    const size = project.files[path]?.startsWith('data:') ? 'Binary asset' : `${(new Blob([project.files[path] || '']).size / 1024).toFixed(1)} KB`;
    content = `<div class="file-action-path"><span>${svgIcon(iconForFile(path))}</span><strong>${escapeHtml(path)}</strong><span>${escapeHtml(size)}</span></div>
      <div class="file-action-list">
        <button class="file-action" data-modal-action="rename-file" data-path="${escapeHtml(path)}">${svgIcon('edit')}<span><strong>Rename or move</strong><span>Change the project path for this file</span></span></button>
        <button class="file-action" data-modal-action="duplicate-file" data-path="${escapeHtml(path)}">${svgIcon('copy')}<span><strong>Duplicate</strong><span>Create a copy next to the original</span></span></button>
        <button class="file-action" data-modal-action="download-file" data-path="${escapeHtml(path)}">${svgIcon('download')}<span><strong>Download</strong><span>Save this file to your computer</span></span></button>
        <button class="file-action" data-modal-action="copy-path" data-path="${escapeHtml(path)}">${svgIcon('copy')}<span><strong>Copy path</strong><span>Useful for <code>\\input</code> and <code>\\includegraphics</code></span></span></button>
        <button class="file-action danger" data-modal-action="delete-file" data-path="${escapeHtml(path)}">${svgIcon('trash')}<span><strong>Delete file</strong><span>Remove it from this local project</span></span></button>
      </div>`;
    frame = modalFrame('File actions', content, { icon: 'document', subtitle: 'Manage this project file', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Close</button>` });
  } else if (type === 'renamefile') {
    const path = extra.path || '';
    content = `<div class="form-field"><label for="renameFileName">New file path</label><input id="renameFileName" value="${escapeHtml(path)}" placeholder="sections/introduction.tex" autocomplete="off"><span class="form-help">Use a relative path. Renaming does not update references in your LaTeX source automatically.</span></div>`;
    frame = modalFrame('Rename or move file', content, { icon: 'edit', subtitle: escapeHtml(path), footer: `<button class="button button-quiet" data-modal-action="close">Cancel</button><button class="button button-primary" data-modal-action="rename-file-submit" data-path="${escapeHtml(path)}">Rename</button>` });
  } else if (type === 'deletefile') {
    const path = extra.path || '';
    content = `<div class="confirm-card"><span class="confirm-icon">${svgIcon('trash', 22)}</span><div><strong>Delete “${escapeHtml(path)}”?</strong><p>This removes the file from the local project. A version snapshot will be saved first, so you can restore it from History.</p></div></div>`;
    frame = modalFrame('Delete file', content, { icon: 'warning', subtitle: 'This action can be undone from History', footer: `<button class="button button-quiet" data-modal-action="close">Cancel</button><button class="button button-danger" data-modal-action="delete-file-confirm" data-path="${escapeHtml(path)}">Delete file</button>` });
  } else if (type === 'history') {
    if (!project.snapshots.length) ensureSnapshot('Project created');
    content = project.snapshots.length ? project.snapshots.map((snapshot, index) => `<div class="snapshot-row"><div class="snapshot-timeline"><span class="snapshot-dot"></span></div><div class="snapshot-main"><div class="snapshot-title">${escapeHtml(snapshot.label)}</div><div class="snapshot-meta">${escapeHtml(snapshot.time)} · ${Object.keys(snapshot.files || {}).length} files</div></div><button class="button button-quiet" data-modal-action="restore" data-snapshot-index="${index}">Restore</button></div>`).join('') : `<div class="sidebar-empty">No saved versions yet.</div>`;
    content += `<div class="history-warning">Version history is stored in this browser only. Export a ZIP for a durable backup.</div>`;
    frame = modalFrame('Version history', content, { icon: 'history', subtitle: 'Restore a previous local snapshot', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Close</button><button class="button button-primary" data-modal-action="snapshot-now">Save snapshot</button>` });
  } else if (type === 'symbols') {
    const symbols = [
      ['α','\\alpha'],['β','\\beta'],['γ','\\gamma'],['Δ','\\Delta'],['π','\\pi'],['Σ','\\sum'],['∫','\\int'],['∞','\\infty'],['≤','\\leq'],['≥','\\geq'],['≠','\\neq'],['≈','\\approx'],['∈','\\in'],['→','\\to'],['∀','\\forall'],['∂','\\partial'],['√','\\sqrt{}'],['∇','\\nabla'],['×','\\times'],['±','\\pm'],['∏','\\prod'],['θ','\\theta'],['λ','\\lambda'],['ω','\\omega'],['½','\\frac{1}{2}']
    ];
    content = `<p style="margin:0 0 12px;color:#86928a">Select a symbol to insert its LaTeX command at the editor cursor.</p><div class="symbol-grid">${symbols.map(([glyph, command]) => `<button class="symbol-button" data-modal-action="insert-symbol" data-symbol="${escapeHtml(command)}"><span class="symbol-glyph">${escapeHtml(glyph)}</span><span class="symbol-command">${escapeHtml(command)}</span></button>`).join('')}</div>`;
    frame = modalFrame('Math symbol palette', content, { icon: 'sigma', subtitle: 'Common symbols and operators', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Done</button>` });
  } else if (type === 'search') {
    content = `<div class="form-field search-modal-input"><label for="projectSearch">Find in project</label><input id="projectSearch" type="search" placeholder="Search source, references, and file names…" value="${escapeHtml(extra.query || '')}" autocomplete="off"><span class="form-help">Use plain text. Results jump to the matching file and line.</span></div><div class="search-results" id="searchResults"></div>`;
    frame = modalFrame('Search project', content, { icon: 'search', subtitle: 'Search across all text files', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Close</button>` });
  } else if (type === 'settings') {
    const engines = ui.compiler.engines || [];
    const engineOptions = ['pdfLaTeX','XeLaTeX','LuaLaTeX','Tectonic'].map(name => {
      const missing = ui.compiler.available && !engines.includes(name);
      return `<option value="${name}" ${project.settings.engine === name ? 'selected' : ''}${missing ? ' disabled' : ''}>${name}${missing ? ' (not detected)' : ''}</option>`;
    }).join('');
    const status = ui.compiler.enabled ? `<div class="engine-status-card ready"><strong>Real TeX compilation available</strong>${escapeHtml(ui.compiler.engine || project.settings.engine)} is connected. Build output will be an actual PDF, and shell escape remains disabled.</div>` : `<div class="engine-status-card"><strong>${ui.compiler.available ? 'TeX compiler found, but real builds are disabled' : 'No real TeX compiler connected'}</strong>${escapeHtml(ui.compiler.reason || 'Install TeX Live or TinyTeX, then restart the workspace.')}<br><span>Quick Preview is a browser approximation, not full LaTeX.</span></div>`;
    content = `${status}<div class="form-row" style="margin-top:15px"><div class="form-field"><label for="engineSelect">Preferred engine</label><select id="engineSelect">${engineOptions}</select><span class="form-help">${engines.length ? `Detected: ${engines.map(escapeHtml).join(', ')}` : 'Common options: TeX Live, MiKTeX, or Tectonic.'}</span></div><div class="form-field"><label for="fontSizeSelect">Editor font size</label><select id="fontSizeSelect"><option value="10.5" ${project.settings.fontSize == 10.5 ? 'selected' : ''}>Compact · 10.5 px</option><option value="11.5" ${project.settings.fontSize == 11.5 ? 'selected' : ''}>Standard · 11.5 px</option><option value="13" ${project.settings.fontSize == 13 ? 'selected' : ''}>Large · 13 px</option><option value="14.5" ${project.settings.fontSize == 14.5 ? 'selected' : ''}>Extra large · 14.5 px</option></select></div></div>
      <div class="toggle-row"><div class="toggle-copy"><strong>Auto Preview</strong><span>Refresh Quick Preview after edits settle. Real PDF builds stay manual.</span></div><button class="switch${project.settings.autoCompile ? ' on' : ''}" role="switch" aria-checked="${project.settings.autoCompile}" data-setting-toggle="autoCompile" aria-label="Toggle automatic Quick Preview"></button></div>
      <div class="toggle-row"><div class="toggle-copy"><strong>Word wrap</strong><span>Wrap long source lines instead of scrolling sideways</span></div><button class="switch${project.settings.wordWrap ? ' on' : ''}" role="switch" aria-checked="${project.settings.wordWrap}" data-setting-toggle="wordWrap" aria-label="Toggle word wrap"></button></div>
      <div class="toggle-row"><div class="toggle-copy"><strong>Line numbers</strong><span>Show a gutter with source line numbers</span></div><button class="switch${project.settings.lineNumbers !== false ? ' on' : ''}" role="switch" aria-checked="${project.settings.lineNumbers !== false}" data-setting-toggle="lineNumbers" aria-label="Toggle line numbers"></button></div>
      <div class="toggle-row"><div class="toggle-copy"><strong>Dark theme</strong><span>Use a low-glare theme across the workspace</span></div><button class="switch${project.settings.darkMode ? ' on' : ''}" role="switch" aria-checked="${project.settings.darkMode}" data-setting-toggle="darkMode" aria-label="Toggle dark theme"></button></div>
      <p class="form-help" style="margin:12px 0 0">Real compilation is local and enabled by default on loopback when TeX is detected. Set <code>ALLOW_LOCAL_TEX_COMPILE=0</code> to opt out. Only expose the server to trusted users.</p>`;
    frame = modalFrame('Workspace settings', content, { icon: 'settings', subtitle: 'Compiler, editor, and theme preferences', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Close</button><button class="button button-primary" data-modal-action="save-settings">Save settings</button>` });
  } else if (type === 'newfile') {
    content = `<div class="form-field"><label for="newFileName">File path</label><input id="newFileName" value="${escapeHtml(extra.name || '')}" placeholder="sections/new-section.tex" autocomplete="off"><span class="form-help">You can use folders in the path, for example <code>sections/related-work.tex</code>.</span></div><div class="form-field" style="margin-bottom:0"><label for="newFileStarter">Starter content</label><select id="newFileStarter"><option value="blank">Blank file</option><option value="section">LaTeX section</option><option value="bib">BibTeX bibliography</option><option value="notes">Markdown notes</option></select></div>`;
    frame = modalFrame('Create a project file', content, { icon: 'file-plus', subtitle: 'Add a source file, bibliography, or asset', footer: `<button class="button button-quiet" data-modal-action="close">Cancel</button><button class="button button-primary" data-modal-action="create-file">Create file</button>` });
  } else if (type === 'newproject') {
    const templates = [
      ['article','Article','A clean paper starter with abstract, sections, math, and hyperlinks.'],['blank','Blank project','A minimal LaTeX document with one introduction section.'],['thesis','Thesis','A multi-file report scaffold with chapters and a BibTeX file.'],['beamer','Presentation','A compact Beamer slide deck starter.']
    ];
    content = `<div class="form-field"><label for="newProjectName">Project name <span class="form-optional">optional</span></label><input id="newProjectName" value="" maxlength="120" autocomplete="off" placeholder="e.g. Reliability paper"><span class="form-help">Leave blank to use the template name. You can rename the project later.</span></div><p class="modal-lead">Choose a starter template. The project is saved locally in this browser, and your existing projects stay in the library.</p><div class="template-grid">${templates.map(([id,title,desc]) => `<button class="template-card" data-modal-action="create-project" data-template="${id}"><span class="template-icon">${svgIcon(id === 'beamer' ? 'presentation' : id === 'thesis' ? 'book' : 'document')}</span><strong>${escapeHtml(title)}</strong><span>${escapeHtml(desc)}</span></button>`).join('')}</div>`;
    frame = modalFrame('Start a new project', content, { icon: 'document', subtitle: 'Choose a template', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Cancel</button><button class="button button-primary" data-modal-action="create-project" data-template="article">Create article</button>` });
  } else if (type === 'help') {
    content = `<div class="help-section"><strong>Projects &amp; files</strong><p>The launcher keeps every project in this browser. Use <em>New project</em> or <em>Import ZIP or files</em> to begin, click <em>Projects</em> in the top bar to return to the library, and use <em>File → Download project ZIP</em> for a portable backup.</p></div><div class="help-section"><strong>Real PDF vs. Quick Preview</strong><p>Quick Preview renders a useful subset in the browser and is clearly labelled as an approximation. Real PDF builds run through a local TeX engine and are enabled automatically when this workspace is served on loopback. Compiled pages appear inside the themed preview; use <em>Open PDF</em> for text selection, printing, and PDF search.</p></div><div class="help-section"><strong>Compilation notes</strong><p>Shell escape is disabled for safety. SVG images are preview-only; export them to PNG, JPG, or PDF before including them in a real LaTeX build. Use XeLaTeX or LuaLaTeX for system fonts and <code>fontspec</code>.</p></div><div class="help-section"><strong>Keyboard shortcuts</strong><p><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> Compile · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>F</kbd> Search project · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> Find in Quick Preview · <kbd>/</kbd> Focus file filter · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd> Save · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>/</kbd> Toggle comment · <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> Indent.</p></div><div class="help-section"><strong>Small screens</strong><p>On narrow screens use the Source / Preview switch above the workspace. The activity rail opens the project drawer, and side panels become a full-height sheet.</p></div><div class="help-section"><strong>Data &amp; privacy</strong><p>Projects, source files, open tabs, and snapshots are stored in this browser. A real TeX build sends the source only to the local server you started. There is no account, cloud sync, or external upload.</p></div>`;
    frame = modalFrame('Workspace guide', content, { icon: 'help', subtitle: 'How to use this local workspace', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Close</button><button class="button button-primary" data-modal-action="settings">Open settings</button>` });
  } else if (type === 'citation') {
    const refs = parseBibEntries();
    content = refs.length ? `<p style="margin:0 0 10px;color:#89958e">Choose a BibTeX entry to insert a citation.</p>${refs.map(ref => `<button class="reference-card" style="width:100%;text-align:left" data-modal-action="insert-citation" data-cite-key="${escapeHtml(ref.key)}"><span class="reference-key">${escapeHtml(ref.key)}</span><div class="reference-title">${escapeHtml(ref.title)}</div><div class="reference-meta">${escapeHtml(ref.author)}${ref.year ? ` · ${escapeHtml(ref.year)}` : ''}</div></button>`).join('')}` : `<div class="sidebar-empty">No entries found. Add a <code>.bib</code> file first.</div>`;
    frame = modalFrame('Insert citation', content, { icon: 'cite', subtitle: 'Select a reference from your project', wide: true, footer: `<button class="button button-quiet" data-modal-action="close">Cancel</button>` });
  } else if (type === 'figure') {
    content = `<div class="form-field"><label for="figurePath">Asset path</label><input id="figurePath" value="figures/figure.png" placeholder="figures/my-figure.png"><span class="form-help">The file should exist in your project. Use PNG, JPG, or PDF for real LaTeX builds; SVG only renders in Quick Preview.</span></div><div class="form-field"><label for="figureCaption">Caption</label><input id="figureCaption" value="Figure caption." placeholder="Briefly describe the figure"></div><div class="form-field" style="margin-bottom:0"><label for="figureLabel">Reference label</label><input id="figureLabel" value="fig:example" placeholder="fig:example"></div>`;
    frame = modalFrame('Insert figure', content, { icon: 'imagePlus', subtitle: 'Add a LaTeX figure environment', footer: `<button class="button button-quiet" data-modal-action="close">Cancel</button><button class="button button-primary" data-modal-action="insert-figure">Insert figure</button>` });
  } else if (type === 'deleteproject') {
    const targetId = extra.id || project.id || '';
    const target = readProjectRecord(targetId) || (project.id === targetId ? project : null);
    const name = target?.name || 'this project';
    const isOpen = ui.projectOpen && project.id === targetId;
    content = `<p class="modal-lead">Delete <strong>${escapeHtml(name)}</strong> from this browser? This removes its files, tabs, and version history permanently.</p><p class="form-help">${isOpen ? 'The project is currently open and will be closed. ' : ''}Export a ZIP first if you want a backup.</p>`;
    frame = modalFrame('Delete project', content, { icon: 'trash', subtitle: 'Permanent local deletion', footer: `<button class="button button-quiet" data-modal-action="close">Cancel</button><button class="button button-danger" data-modal-action="delete-project-confirm" data-project-id="${escapeHtml(targetId)}">Delete project</button>` });
  } else if (type === 'preview-search') {
    if (ui.realPdfUrl) {
      content = `<div class="preview-search-unavailable">${svgIcon('info', 24)}<div><strong>Text search is not available in the page preview</strong><p>The compiled PDF is shown as rendered page images so the background can follow your theme. Open the PDF in your browser to search text, select it, or print.</p><button class="button button-primary" data-modal-action="open-pdf">${svgIcon('external')} Open PDF</button></div></div>`;
      frame = modalFrame('Find in preview', content, { icon: 'search', subtitle: 'Compiled PDF', footer: `<button class="button button-quiet" data-modal-action="close">Close</button>` });
    } else {
      content = `<div class="form-field"><label for="previewSearchInput">Find in Quick Preview</label><input id="previewSearchInput" type="search" placeholder="Search this document…"><span class="form-help">Matches are highlighted in the current Quick Preview.</span></div><div id="previewSearchResults" class="form-help"></div>`;
      frame = modalFrame('Find in preview', content, { icon: 'search', footer: `<button class="button button-quiet" data-modal-action="close">Close</button><button class="button button-primary" data-modal-action="find-preview">Find</button>` });
    }
  } else {
    content = `<p>That action is not available in this version of the workspace.</p>`;
    frame = modalFrame('Workspace', content);
  }
  modalLayer.hidden = false;
  modalLayer.innerHTML = frame;
  hydrateIcons(modalLayer);
  ui.lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const shell = $('#appShell');
  if (shell) shell.inert = true;
  document.body.classList.add('modal-open');
  if (type === 'search') {
    const input = $('#projectSearch');
    input?.addEventListener('input', () => renderSearchResults(input.value));
    input?.focus();
    renderSearchResults(extra.query || '');
  }
  if (type === 'preview-search') $('#previewSearchInput')?.focus();
  if (type === 'newproject') $('#newProjectName')?.focus();
  if (type === 'newfile') $('#newFileName')?.focus();
  if (type === 'renamefile') $('#renameFileName')?.focus();
  if (!modalLayer.querySelector('input:focus, textarea:focus, select:focus')) {
    modalLayer.querySelector('.modal-footer .button-primary, .modal-footer .button, .modal-header .icon-button')?.focus({ preventScroll: true });
  }
  modalLayer.querySelector('.modal-body')?.scrollTo({ top: 0 });
}
function closeModal() {
  modalLayer.hidden = true;
  modalLayer.innerHTML = '';
  ui.modalType = null;
  const shell = $('#appShell');
  if (shell) shell.inert = false;
  document.body.classList.remove('modal-open');
  if (ui.lastFocused && document.contains(ui.lastFocused)) ui.lastFocused.focus({ preventScroll: true });
  ui.lastFocused = null;
}
function renderSearchResults(query) {
  const container = $('#searchResults');
  if (!container) return;
  const q = String(query || '').trim();
  if (!q) { container.innerHTML = '<div class="sidebar-empty">Type a word or phrase to search across project files.</div>'; return; }
  const qLower = q.toLowerCase();
  const fileMatches = [];
  const results = [];
  for (const [path, content] of Object.entries(project.files)) {
    if (path.toLowerCase().includes(qLower)) fileMatches.push({ path, line: 1, html: '<em>File name match</em>' });
    if (String(content).startsWith('data:')) continue;
    const lines = String(content).split('\n');
    lines.forEach((line, index) => {
      const at = line.toLowerCase().indexOf(qLower);
      if (at >= 0) {
        const excerpt = line.slice(Math.max(0, at - 42), Math.min(line.length, at + q.length + 65)).trim();
        const before = excerpt.slice(0, Math.max(0, excerpt.toLowerCase().indexOf(qLower)));
        const found = excerpt.slice(before.length, before.length + q.length);
        const after = excerpt.slice(before.length + q.length);
        results.push({ path, line: index + 1, html: `${escapeHtml(before)}<mark>${escapeHtml(found)}</mark>${escapeHtml(after)}` });
      }
    });
  }
  const ordered = [...fileMatches, ...results];
  container.innerHTML = ordered.length ? ordered.slice(0, 80).map(result => `<button class="search-result" data-search-path="${escapeHtml(result.path)}" data-search-line="${result.line}"><strong>${escapeHtml(result.path)} : ${result.line}</strong><code>${result.html}</code></button>`).join('') : '<div class="sidebar-empty">No matches found.</div>';
}
function setTheme(toggle = !project.settings.darkMode) {
  project.settings.darkMode = toggle;
  applySettings();
  saveLocal(false);
  renderSidebar();
}
function toggleSetting(key, value = null) {
  project.settings[key] = value === null ? !project.settings[key] : value;
  applySettings();
  saveLocal(false);
  return project.settings[key];
}
function templateContent(template) {
  if (template === 'empty') return { name: 'Imported project', kind: 'Imported project', files: {} };
  if (template === 'blank') return { name: 'Untitled LaTeX project', kind: 'Blank project', files: { 'main.tex': String.raw`\documentclass{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}
\title{Untitled document}
\author{Your Name}
\date{\today}
\begin{document}
\maketitle

\section{Introduction}
Start writing here.

\end{document}
` } };
  if (template === 'beamer') return { name: 'Research presentation', kind: 'Presentation', files: { 'main.tex': String.raw`\documentclass{beamer}
\usetheme{Madrid}
\title{Research presentation}
\author{Your Name}
\date{\today}
\begin{document}
\begin{frame}\titlepage\end{frame}
\begin{frame}{Motivation}
\begin{itemize}
\item Research question
\item Key contribution
\end{itemize}
\end{frame}
\begin{frame}{Results}
\begin{equation}
x^2 + y^2 = z^2
\end{equation}
\end{frame}
\end{document}
` } };
  if (template === 'thesis') return { name: 'Thesis project', kind: 'Thesis', files: {
    'main.tex': String.raw`\documentclass[12pt]{report}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{amsmath,graphicx,hyperref}
\title{Thesis title}
\author{Your Name}
\date{\today}
\begin{document}
\maketitle
\tableofcontents
\input{chapters/introduction}
\input{chapters/methods}
\bibliographystyle{plain}
\bibliography{references}
\end{document}
`,
    'chapters/introduction.tex': `\chapter{Introduction}
\section{Background}
Write your background and research question here.
`,
    'chapters/methods.tex': `\chapter{Methods}
Describe your method, data, and analysis plan here.
`,
    'references.bib': '@book{example2024,\n  author = {Author Name},\n  title = {An Example Reference},\n  year = {2024}\n}\n'
  } };
  return { name: 'Untitled article', kind: 'Article', files: { 'main.tex': String.raw`\documentclass[11pt]{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{amsmath,amssymb}
\usepackage{graphicx}
\usepackage{hyperref}
\title{Untitled article}
\author{Your Name}
\date{\today}
\begin{document}
\maketitle

\begin{abstract}
Write a concise summary of your article here.
\end{abstract}

\section{Introduction}
Start with the problem, context, and contribution.

\section{Method}
Describe the approach, data, or argument.

\section{Results}
Present the main findings and supporting evidence.

\section{Conclusion}
Summarize what the reader should take away.

\end{document}
` } };
}

function createProject(template, options = {}) {
  if (ui.projectOpen && project.id) saveLocal(false);
  const next = templateContent(template);
  const inheritedSettings = { ...project.settings, ...(next.settings || {}) };
  const now = new Date().toISOString();
  const files = { ...next.files };
  const firstTex = files['main.tex'] ? 'main.tex' : Object.keys(files).find(path => path.endsWith('.tex')) || Object.keys(files)[0] || '';
  const name = String(options.name || next.name || 'Untitled project').trim() || 'Untitled project';
  resetWorkspaceUi();
  project = {
    ...emptyProject(inheritedSettings),
    id: newProjectId(),
    name,
    kind: options.kind || next.kind || 'LaTeX project',
    files,
    activeFile: firstTex,
    openTabs: firstTex ? [firstTex] : [],
    createdAt: now,
    updatedAt: now,
  };
  ui.projectOpen = true;
  ui.activePanel = 'files';
  ui.fileFilter = '';
  ui.openFolders = new Set(Object.keys(files).flatMap(path => pathAncestors(path)));
  showWorkspace();
  updateProjectHeader();
  applySettings();
  setPanel('files');
  renderTabs();
  if (project.activeFile) setEditorContent(project.activeFile);
  else setNoFileState('This project has no files yet. Import files to begin.');
  if (!options.deferPreview) renderQuickPreview(buildQuickPreview());
  saveLocal(false);
  closeModal();
  closeSidebar();
  hideMenu();
  if (!options.deferPreview) appendCompileLogs([{ level: 'info', message: 'New project created. Preview rendered in the browser.' }], 'success');
  if (!options.silent) toast('New project created locally');
}
function createNewFile(path, starter) {
  const normalized = normalizeProjectPath(path);
  if (!normalized) return toast('Enter a valid relative project path.', 'error');
  if (project.files[normalized] !== undefined) return toast('A file with this name already exists.', 'warning');
  if (pathConflicts(normalized)) return toast('That path conflicts with an existing file or folder.', 'warning');
  const content = starter === 'section' ? '\\section{New section}\n\\label{sec:new-section}\n\nWrite your section here.\n' : starter === 'bib' ? '@article{newref,\n  author = {Author Name},\n  title = {Reference title},\n  year = {2026}\n}\n' : starter === 'notes' ? '# Project notes\n\nAdd notes here.\n' : '';
  project.files[normalized] = content;
  project.openTabs.push(normalized);
  if (project.openTabs.length > 8) project.openTabs = project.openTabs.slice(-8);
  ensurePathFolders(normalized);
  saveLocal(false);
  updateProjectHeader();
  renderSidebar();
  setEditorContent(normalized, { focus: true });
  closeModal();
  if (isMobileLayout()) setMobileView('source');
  toast(`Created ${normalized}`);
  renderTabs();
}

function deleteProjectFile(path) {
  if (!(path in project.files)) return toast('That file no longer exists.', 'warning');
  ensureSnapshot(`Before deleting ${path}`);
  delete project.files[path];
  project.openTabs = project.openTabs.filter(item => item !== path);
  ui.dirtyFiles.delete(path);
  const fallback = Object.keys(project.files).find(item => item.endsWith('.tex')) || Object.keys(project.files)[0] || '';
  closeModal();
  saveLocal(false);
  updateProjectHeader();
  if (project.activeFile === path) {
    if (fallback) setEditorContent(fallback); else setNoFileState('No files in this project');
  } else {
    renderTabs();
    renderSidebar();
  }
  renderQuickPreview(buildQuickPreview());
  saveLocal(false);
  toast(`Deleted ${path}`, 'warning');
}
function renameProjectFile(oldPath, newPath) {
  const normalized = normalizeProjectPath(newPath);
  if (!normalized) return toast('Enter a valid relative project path.', 'error');
  if (normalized === oldPath) { closeModal(); return; }
  if (!(oldPath in project.files)) return toast('That file no longer exists.', 'warning');
  if (normalized in project.files) return toast('A file with this name already exists.', 'warning');
  if (pathConflicts(normalized, oldPath)) return toast('That path conflicts with an existing file or folder.', 'warning');
  const content = project.files[oldPath];
  delete project.files[oldPath];
  project.files[normalized] = content;
  project.openTabs = project.openTabs.map(item => item === oldPath ? normalized : item);
  if (project.activeFile === oldPath) project.activeFile = normalized;
  ensurePathFolders(normalized);
  if (ui.dirtyFiles.delete(oldPath)) ui.dirtyFiles.add(normalized);
  saveLocal(false);
  updateProjectHeader();
  closeModal();
  if (project.activeFile === normalized) setEditorContent(normalized, { preserveCursor: true });
  else { renderTabs(); renderSidebar(); }
  const result = buildQuickPreview();
  renderQuickPreview(result);
  toast(`Renamed to ${normalized}`);
}
function duplicateProjectFile(path) {
  if (!(path in project.files)) return toast('That file no longer exists.', 'warning');
  const dot = path.lastIndexOf('.');
  const base = dot > path.lastIndexOf('/') ? path.slice(0, dot) : path;
  const ext = dot > path.lastIndexOf('/') ? path.slice(dot) : '';
  let candidate = `${base}-copy${ext}`;
  let counter = 2;
  while (candidate in project.files || pathConflicts(candidate)) candidate = `${base}-copy-${counter++}${ext}`;
  project.files[candidate] = project.files[path];
  project.openTabs.push(candidate);
  if (project.openTabs.length > 8) project.openTabs = project.openTabs.slice(-8);
  ensurePathFolders(candidate);
  saveLocal(false);
  updateProjectHeader();
  closeModal();
  setEditorContent(candidate, { focus: true });
  toast(`Duplicated as ${candidate}`);
}
async function copyText(text, message = 'Copied to clipboard') {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    toast(message);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    area.remove();
    if (copied) toast(message);
    else toast('Could not access the clipboard. Select the text and copy manually.', 'warning');
    return copied;
  }
}
function downloadProjectFile(path) {
  const content = project.files[path];
  if (typeof content !== 'string') return;
  if (content.startsWith('data:')) {
    const [meta, body] = content.split(',', 2);
    const bytes = Uint8Array.from(atob(body || ''), char => char.charCodeAt(0));
    downloadBlob(new Blob([bytes], { type: meta.match(/data:([^;]+)/)?.[1] || 'application/octet-stream' }), path.split('/').pop());
  } else {
    downloadBlob(new Blob([content], { type: 'text/plain;charset=utf-8' }), path.split('/').pop());
  }
  toast('File downloaded');
}
function cleanFileName(name) {
  return String(name).replace(/[^a-zA-Z0-9._/-]/g, '-').replace(/\/{2,}/g, '/').replace(/^\/+|\/+$/g, '');
}
function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1500);
}
function downloadCurrentFile() {
  const path = project.activeFile;
  if (!path) return toast('Open a file first.', 'warning');
  downloadProjectFile(path);
}
function openCompiledPdf() {
  if (!ui.realPdfUrl) return toast('Compile the project to create a PDF first.', 'warning');
  window.open(ui.realPdfUrl, '_blank', 'noopener');
}
function downloadCompiledPdf() {
  if (!ui.realPdfUrl) return toast('Compile the project to create a PDF first.', 'warning');
  const link = document.createElement('a');
  link.href = ui.realPdfUrl;
  link.download = `${cleanFileName(project.name || 'papertrail-build')}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  toast('PDF downloaded');
}
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function write16(view, offset, value) { view.setUint16(offset, value, true); }
function write32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }
function asBytes(value) {
  if (String(value).startsWith('data:')) {
    const [meta, data] = String(value).split(',', 2);
    if (/;base64/i.test(meta)) return Uint8Array.from(atob(data || ''), char => char.charCodeAt(0));
    return new TextEncoder().encode(decodeURIComponent(data || ''));
  }
  return new TextEncoder().encode(String(value));
}
function makeZip(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const [path, value] of Object.entries(files)) {
    const safeName = normalizeProjectPath(path);
    if (!safeName) continue;
    const name = encoder.encode(safeName);
    const data = asBytes(value);
    const checksum = crc32(data);
    const local = new Uint8Array(30 + name.length + data.length);
    const localView = new DataView(local.buffer);
    write32(localView, 0, 0x04034b50); write16(localView, 4, 20); write16(localView, 6, 0x0800); write16(localView, 8, 0);
    write16(localView, 10, 0); write16(localView, 12, 0x0021); write32(localView, 14, checksum); write32(localView, 18, data.length); write32(localView, 22, data.length); write16(localView, 26, name.length); write16(localView, 28, 0);
    local.set(name, 30); local.set(data, 30 + name.length); chunks.push(local);
    const centralChunk = new Uint8Array(46 + name.length);
    const centralView = new DataView(centralChunk.buffer);
    write32(centralView, 0, 0x02014b50); write16(centralView, 4, 20); write16(centralView, 6, 20); write16(centralView, 8, 0x0800); write16(centralView, 10, 0);
    write16(centralView, 12, 0); write16(centralView, 14, 0x0021); write32(centralView, 16, checksum); write32(centralView, 20, data.length); write32(centralView, 24, data.length);
    write16(centralView, 28, name.length); write16(centralView, 30, 0); write16(centralView, 32, 0); write16(centralView, 34, 0); write16(centralView, 36, 0); write32(centralView, 38, 0); write32(centralView, 42, offset);
    centralChunk.set(name, 46); central.push(centralChunk);
    offset += local.length;
  }
  const centralStart = offset;
  for (const chunk of central) { chunks.push(chunk); offset += chunk.length; }
  const centralSize = offset - centralStart;
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  write32(eocdView, 0, 0x06054b50); write16(eocdView, 4, 0); write16(eocdView, 6, 0); write16(eocdView, 8, central.length); write16(eocdView, 10, central.length); write32(eocdView, 12, centralSize); write32(eocdView, 16, centralStart); write16(eocdView, 20, 0);
  chunks.push(eocd);
  return new Blob(chunks, { type: 'application/zip' });
}
function downloadProjectZip() {
  downloadBlob(makeZip(project.files), `${cleanFileName(project.name).replace(/\//g, '-') || 'latex-project'}.zip`);
  toast('Project ZIP exported');
}
async function inflateRaw(bytes) {
  if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot decompress ZIP entries. Try importing individual files.');
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
function dataUrlFromBytes(bytes, mime) {
  let binary = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) binary += String.fromCharCode(...bytes.subarray(i, i + step));
  return `data:${mime};base64,${btoa(binary)}`;
}
function mimeForPath(path) {
  const ext = fileExtension(path);
  return ({ png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', svg:'image/svg+xml', pdf:'application/pdf', gif:'image/gif', webp:'image/webp' })[ext] || 'application/octet-stream';
}
async function readZipFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65558); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('The selected archive is not a valid ZIP file.');
  const entryCount = view.getUint16(eocd + 10, true);
  let cursor = view.getUint32(eocd + 16, true);
  const out = {};
  let total = 0;
  const decoder = new TextDecoder('utf-8');
  for (let entry = 0; entry < entryCount && entry < 250; entry++) {
    if (view.getUint32(cursor, true) !== 0x02014b50) break;
    const method = view.getUint16(cursor + 10, true);
    const expectedCrc = view.getUint32(cursor + 16, true);
    const compSize = view.getUint32(cursor + 20, true);
    const uncompSize = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localOffset = view.getUint32(cursor + 42, true);
    const name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLength));
    cursor += 46 + nameLength + extraLength + commentLength;
    if (!name || name.endsWith('/')) continue;
    if (name.startsWith('__MACOSX/') || /(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini)$/i.test(name)) continue;
    const safeName = normalizeProjectPath(name);
    if (!safeName) continue;
    total += uncompSize;
    if (total > 12 * 1024 * 1024) throw new Error('ZIP exceeds the 12 MB import limit.');
    if (view.getUint32(localOffset, true) !== 0x04034b50) continue;
    const localName = view.getUint16(localOffset + 26, true);
    const localExtra = view.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + localName + localExtra;
    const compressed = bytes.slice(dataStart, dataStart + compSize);
    const data = method === 0 ? compressed : method === 8 ? await inflateRaw(compressed) : null;
    if (!data) continue;
    if (data.length !== uncompSize || crc32(data) !== expectedCrc) throw new Error(`ZIP entry ${safeName} failed its size or checksum validation.`);
    if (['png','jpg','jpeg','svg','gif','webp','pdf'].includes(fileExtension(safeName))) out[safeName] = dataUrlFromBytes(data, mimeForPath(safeName));
    else out[safeName] = decoder.decode(data);
  }
  return out;
}
function ensureImportDestination(fileList) {
  ui.pendingImport = false;
  if (ui.projectOpen) return;
  const files = Array.from(fileList || []);
  const single = files.length === 1 ? files[0].name.replace(/\.(zip|tex|bib|sty|cls|png|jpe?g|svg|gif|webp|pdf)$/i, '') : '';
  createProject('empty', {
    name: single || 'Imported project',
    kind: 'Imported project',
    silent: true,
    deferPreview: true,
  });
}

async function importProjectFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  ensureImportDestination(files);
  let imported = 0;
  let skipped = 0;
  ensureSnapshot('Before import');
  try {
    for (const file of files) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        if (file.size > 30 * 1024 * 1024) { toast(`${file.name} is too large for this browser workspace.`, 'warning'); continue; }
        const entries = await readZipFile(file);
        for (const [name, content] of Object.entries(entries)) {
          if (importPathConflict(name)) { skipped++; continue; }
          project.files[name] = content;
          imported++;
        }
        continue;
      }
      const candidate = normalizeProjectPath(file.webkitRelativePath || file.name);
      if (!candidate) { skipped++; continue; }
      if (importPathConflict(candidate)) { skipped++; continue; }
      const ext = fileExtension(candidate);
      if (['png','jpg','jpeg','svg','gif','webp','pdf'].includes(ext)) {
        if (file.size > 6 * 1024 * 1024) { toast(`${file.name} is too large for this browser workspace.`, 'warning'); continue; }
        project.files[candidate] = await new Promise((resolve, reject) => {
          const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
        });
      } else {
        if (file.size > 2 * 1024 * 1024) { toast(`${file.name} is too large to import as a text file.`, 'warning'); continue; }
        project.files[candidate] = await file.text();
      }
      imported++;
    }
    if (imported) {
      const main = project.files['main.tex'] ? 'main.tex' : Object.keys(project.files).find(path => path.endsWith('.tex'));
      if (main && (!project.activeFile || !(project.activeFile in project.files))) setEditorContent(main);
      ui.openFolders = new Set(Object.keys(project.files).flatMap(path => path.includes('/') ? [path.split('/')[0]] : []));
      renderSidebar();
      updateProjectHeader();
      renderTabs();
      saveLocal(false);
      const result = buildQuickPreview();
      renderQuickPreview(result);
      ui.isCompiled = true;
      appendCompileLogs(result.error ? [
        { level: 'warning', message: result.error },
      ] : [
        { level: 'info', message: `Imported ${imported} project file${imported === 1 ? '' : 's'} locally.` },
        { level: 'info', message: ui.compiler.enabled ? `Real PDF compilation is available with ${ui.compiler.engine || project.settings.engine}.` : 'Quick Preview is active. Install a local TeX engine for real PDF output.' },
      ], result.error ? 'warning' : 'success');
      toast(`Imported ${imported} project file${imported === 1 ? '' : 's'}${skipped ? ` · skipped ${skipped} conflicting path${skipped === 1 ? '' : 's'}` : ''}`);
    } else if (skipped) {
      toast(`No files imported. ${skipped} path${skipped === 1 ? '' : 's'} conflicted with the existing project tree.`, 'warning', 4200);
    }
  } catch (error) {
    console.error(error);
    toast(error.message || 'Could not import the selected files.', 'error', 5000);
  }
}

function parsePreviewFind(query) {
  const paper = pdfStack.querySelector('.paper-page');
  if (!paper) return 0;
  // Remove previous highlights without changing the underlying text.
  paper.querySelectorAll('mark.preview-hit').forEach(mark => mark.replaceWith(document.createTextNode(mark.textContent)));
  paper.normalize();
  if (!query) return 0;
  const lower = query.toLowerCase();
  const walker = document.createTreeWalker(paper, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) if (node.nodeValue.toLowerCase().includes(lower)) nodes.push(node);
  let matches = 0;
  for (const textNode of nodes) {
    const text = textNode.nodeValue;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let at = text.toLowerCase().indexOf(lower, cursor);
    while (at >= 0) {
      if (at > cursor) fragment.append(document.createTextNode(text.slice(cursor, at)));
      const hit = document.createElement('mark');
      hit.className = 'preview-hit';
      hit.textContent = text.slice(at, at + query.length);
      fragment.append(hit);
      matches++;
      cursor = at + query.length;
      at = text.toLowerCase().indexOf(lower, cursor);
    }
    if (cursor < text.length) fragment.append(document.createTextNode(text.slice(cursor)));
    if (fragment.childNodes.length) textNode.parentNode.replaceChild(fragment, textNode);
  }
  return matches;
}

function getActionForClick(target) {
  return target.closest('[data-action]')?.dataset.action || null;
}
async function handleAction(action, element) {
  switch (action) {
    case 'compile': await compileProject(); break;
    case 'projects': closeProject(); break;
    case 'close-project': closeProject(); hideMenu(); break;
    case 'open-project': openProject(element?.dataset.projectId || ''); hideMenu(); break;
    case 'export-project': exportProjectById(element?.dataset.projectId || project.id); hideMenu(); break;
    case 'history': openModal('history'); break;
    case 'symbols': openModal('symbols'); break;
    case 'search': openModal('search'); break;
    case 'settings': openModal('settings'); break;
    case 'help': openModal('help'); break;
    case 'new-file': openModal('newfile'); break;
    case 'new-project': openModal('newproject'); break;
    case 'import':
      ui.pendingImport = !ui.projectOpen;
      $('#importInput').click();
      break;
    case 'download-project': downloadProjectZip(); break;
    case 'download-tex': downloadCurrentFile(); break;
    case 'undo': undoEdit(); break;
    case 'redo': redoEdit(); break;
    case 'select-all': if (!isEditorHidden()) { sourceEditor.focus(); sourceEditor.select(); } break;
    case 'insert-menu': showMenu(element, 'insertQuick'); break;
    case 'insert-section': insertBlock('section'); break;
    case 'insert-subsection': insertBlock('subsection'); break;
    case 'insert-chapter': insertBlock('chapter'); break;
    case 'insert-equation': insertBlock('equation'); break;
    case 'insert-table': insertBlock('table'); break;
    case 'insert-figure': openModal('figure'); break;
    case 'citation': openModal('citation'); break;
    case 'panel-outline': setPanel('outline'); break;
    case 'panel-references': setPanel('references'); break;
    case 'open-files': setPanel('files'); break;
    case 'close-sidebar': closeSidebar(); break;
    case 'toggle-wrap': {
      const enabled = toggleSetting('wordWrap');
      toast(enabled ? 'Word wrap enabled' : 'Word wrap disabled');
      break;
    }
    case 'toggle-lines': {
      const enabled = toggleSetting('lineNumbers', project.settings.lineNumbers === false);
      toast(enabled ? 'Line numbers shown' : 'Line numbers hidden');
      break;
    }
    case 'compile-logs': if (isMobileLayout()) { setMobileView('preview'); setPreviewTab('logs'); openCompileDrawer(false); } else openCompileDrawer(true); break;
    case 'copy-logs': {
      const text = ui.compileLog.map(line => `${line.level || 'info'}: ${line.message}`).join('\n') || 'No build output yet.';
      await copyText(text, 'Build log copied');
      break;
    }
    case 'close-logs': openCompileDrawer(false); break;
    case 'sync': approximateSync(); break;
    case 'zoom-in': adjustZoom(.1); break;
    case 'zoom-out': adjustZoom(-.1); break;
    case 'zoom-reset': ui.zoom = 1; ui.zoomMode = 'fit'; applyZoomStyles(); break;
    case 'page-prev': gotoPage(ui.currentPage - 1); break;
    case 'page-next': gotoPage(ui.currentPage + 1); break;
    case 'print':
      if (ui.realPdfUrl) openCompiledPdf();
      else window.print();
      break;
    case 'open-pdf': openCompiledPdf(); break;
    case 'download-pdf': downloadCompiledPdf(); break;
    case 'preview-search': openModal('preview-search'); break;
    case 'preview-menu': showMenu(element, 'preview'); break;
    case 'sidebar-menu': showMenu(element, 'sidebar'); break;
    case 'editor-menu': showMenu(element, 'editor'); break;
    case 'project-menu': showMenu(element, 'project'); break;
    case 'theme': setTheme(); hideMenu(); break;
    case 'copy-project': {
      ensureSnapshot('Before duplicate');
      const now = new Date().toISOString();
      const duplicate = sanitizeProject(JSON.parse(JSON.stringify(project)), newProjectId());
      duplicate.name = `${project.name || 'Untitled project'} copy`;
      duplicate.createdAt = now;
      duplicate.updatedAt = now;
      duplicate.snapshots = [];
      duplicate.nextSnapshotId = 1;
      resetWorkspaceUi();
      project = duplicate;
      ui.projectOpen = true;
      showWorkspace();
      updateProjectHeader();
      applySettings();
      renderTabs();
      renderSidebar();
      setEditorContent(project.activeFile);
      renderQuickPreview(buildQuickPreview());
      appendCompileLogs([
        { level: 'info', message: `Duplicated “${project.name}” locally.` },
        { level: 'info', message: ui.compiler.enabled ? `Real PDF compilation is available with ${ui.compiler.engine || project.settings.engine}.` : 'Quick Preview is active. Install a local TeX engine for real PDF output.' },
      ], 'success');
      updatePageIndicator();
      saveLocal(false);
      closeModal();
      hideMenu();
      toast('Project duplicated');
      break;
    }
    case 'delete-project':
      openModal('deleteproject', { id: element?.dataset.projectId || project.id });
      hideMenu();
      break;
    default: break;
  }
}

function addEventListeners() {
  document.addEventListener('click', async event => {
    if (event.target.closest('#modalLayer')) return;
    const menuTrigger = event.target.closest('.menu-trigger');
    if (menuTrigger) {
      event.preventDefault();
      const name = menuTrigger.dataset.menu;
      if (ui.openMenu === name) hideMenu(); else showMenu(menuTrigger, name);
      return;
    }
    const menuAction = event.target.closest('[data-menu-action]');
    if (menuAction) {
      const action = menuAction.dataset.menuAction;
      const kind = menuAction.dataset.insertKind;
      hideMenu();
      if (kind === 'figure') await handleAction('insert-figure', menuAction);
      else if (kind === 'citation') openModal('citation');
      else if (kind === 'symbols') openModal('symbols');
      else if (kind) insertBlock(kind);
      else await handleAction(action, menuAction);
      return;
    }
    const rail = event.target.closest('[data-panel]');
    if (rail) { setPanel(rail.dataset.panel); return; }
    const mobileView = event.target.closest('button[data-mobile-view]');
    if (mobileView) { setMobileView(mobileView.dataset.mobileView); return; }
    const file = event.target.closest('[data-file]');
    if (file && !event.target.closest('[data-file-menu]')) { setEditorContent(file.dataset.file); return; }
    const fileMenu = event.target.closest('[data-file-menu]');
    if (fileMenu) { event.preventDefault(); openModal('filemenu', { path: fileMenu.dataset.fileMenu }); return; }
    const tabClose = event.target.closest('[data-close-tab]');
    if (tabClose) {
      event.preventDefault();
      closeTab(tabClose.dataset.closeTab);
      return;
    }
    const folder = event.target.closest('[data-folder]');
    if (folder) {
      const path = folder.dataset.folder;
      if (ui.openFolders.has(path)) ui.openFolders.delete(path); else ui.openFolders.add(path);
      renderSidebar(); return;
    }
    const actionEl = event.target.closest('[data-action]');
    if (actionEl) { event.preventDefault(); await handleAction(actionEl.dataset.action, actionEl); return; }
    const citeKey = event.target.closest('[data-cite-key]');
    if (citeKey) { insertAtCursor(`\\cite{${citeKey.dataset.citeKey}}`); if (ui.modalType) closeModal(); return; }
    const outline = event.target.closest('[data-outline-path]');
    if (outline) {
      setEditorContent(outline.dataset.outlinePath, { focus: true });
      const index = Number(outline.dataset.outlineIndex) || 0;
      sourceEditor.setSelectionRange(index, index); sourceEditor.focus(); sourceEditor.scrollTop = Math.max(0, (sourceEditor.value.slice(0, index).split('\n').length - 4) * 22);
      renderHighlight(); return;
    }
    const logLink = event.target.closest('[data-log-path]');
    if (logLink) {
      const path = logLink.dataset.logPath;
      const line = Number(logLink.dataset.logLine) || 1;
      if (path in project.files) {
        setEditorContent(path, { focus: true });
        const index = sourceEditor.value.split('\n').slice(0, line - 1).join('\n').length + (line > 1 ? 1 : 0);
        sourceEditor.setSelectionRange(index, index);
        sourceEditor.scrollTop = Math.max(0, (line - 3) * 22);
        renderHighlight();
      }
      return;
    }
    if (!event.target.closest('.menu-popover')) hideMenu();
  });

  menuLayer.addEventListener('click', event => { if (event.target === menuLayer) hideMenu(); });
  modalLayer.addEventListener('click', async event => {
    if (event.target === modalLayer) { closeModal(); return; }
    const settingToggle = event.target.closest('[data-setting-toggle]');
    if (settingToggle) {
      const key = settingToggle.dataset.settingToggle;
      project.settings[key] = !project.settings[key];
      settingToggle.classList.toggle('on', Boolean(project.settings[key]));
      settingToggle.setAttribute('aria-checked', String(Boolean(project.settings[key])));
      applySettings();
      saveLocal(false);
      return;
    }
    const searchHit = event.target.closest('[data-search-path]');
    if (searchHit) {
      const path = searchHit.dataset.searchPath;
      const line = Number(searchHit.dataset.searchLine) || 1;
      closeModal();
      setEditorContent(path, { focus: true });
      const index = sourceEditor.value.split('\n').slice(0, line - 1).join('\n').length + (line > 1 ? 1 : 0);
      sourceEditor.setSelectionRange(index, index);
      sourceEditor.scrollTop = Math.max(0, (line - 3) * 22);
      renderHighlight();
      return;
    }
    const button = event.target.closest('[data-modal-action]');
    if (!button) return;
    const action = button.dataset.modalAction;
    if (action === 'close') { closeModal(); return; }
    if (action === 'download-project') { downloadProjectZip(); closeModal(); return; }
    if (action === 'settings') { closeModal(); openModal('settings'); return; }
    if (action === 'rename-file') { openModal('renamefile', { path: button.dataset.path || project.activeFile }); return; }
    if (action === 'duplicate-file') { duplicateProjectFile(button.dataset.path || project.activeFile); return; }
    if (action === 'download-file') { downloadProjectFile(button.dataset.path || project.activeFile); closeModal(); return; }
    if (action === 'open-pdf') { closeModal(); openCompiledPdf(); return; }
    if (action === 'copy-path') { copyText(button.dataset.path || project.activeFile, 'File path copied'); return; }
    if (action === 'delete-file') { openModal('deletefile', { path: button.dataset.path || project.activeFile }); return; }
    if (action === 'rename-file-submit') { renameProjectFile(button.dataset.path || project.activeFile, $('#renameFileName')?.value || ''); return; }
    if (action === 'delete-file-confirm') { deleteProjectFile(button.dataset.path || project.activeFile); return; }
    if (action === 'restore') {
      const snapshot = project.snapshots[Number(button.dataset.snapshotIndex)];
      if (!snapshot) return;
      const restoredFiles = { ...snapshot.files };
      ensureSnapshot('Before restore');
      ui.restoring = true;
      project.files = restoredFiles;
      project.activeFile = project.files[project.activeFile] !== undefined ? project.activeFile : Object.keys(project.files).find(path => path.endsWith('.tex')) || Object.keys(project.files)[0] || '';
      project.openTabs = project.activeFile ? [project.activeFile] : [];
      ui.restoring = false;
      updateProjectHeader(); renderTabs(); renderSidebar();
      if (project.activeFile) setEditorContent(project.activeFile); else setNoFileState();
      saveLocal(false); closeModal();
      const result = buildQuickPreview(); renderQuickPreview(result); toast('Snapshot restored'); return;
    }
    if (action === 'snapshot-now') { ensureSnapshot('Manual snapshot', true); saveLocal(false); openModal('history'); toast('Snapshot saved'); return; }
    if (action === 'insert-symbol') { insertAtCursor(button.dataset.symbol); closeModal(); return; }
    if (action === 'insert-citation') { insertAtCursor(`\\cite{${button.dataset.citeKey}}`); closeModal(); return; }
    if (action === 'save-settings') {
      project.settings.engine = $('#engineSelect').value;
      project.settings.fontSize = Number($('#fontSizeSelect').value) || 11.5;
      applySettings(); saveLocal(false); closeModal(); toast('Settings saved'); return;
    }
    if (action === 'create-file') {
      const filePath = $('#newFileName').value;
      const starter = $('#newFileStarter').value;
      createNewFile(filePath, starter); return;
    }
    if (action === 'create-project') {
      createProject(button.dataset.template, { name: $('#newProjectName')?.value || '' });
      return;
    }
    if (action === 'delete-project-confirm') {
      const id = button.dataset.projectId || project.id;
      closeModal();
      deleteProjectRecord(id);
      return;
    }
    if (action === 'insert-figure') {
      const path = $('#figurePath').value.trim() || 'figures/figure.png';
      const caption = $('#figureCaption').value.trim() || 'Figure caption.';
      const label = $('#figureLabel').value.trim() || 'fig:example';
      insertAtCursor(`\n\\begin{figure}[htbp]\n  \\centering\n  \\includegraphics[width=0.8\\linewidth]{${path}}\n  \\caption{${caption}}\n  \\label{${label}}\n\\end{figure}\n\n`);
      closeModal(); toast('Figure environment inserted'); return;
    }
    if (action === 'find-preview') {
      const query = $('#previewSearchInput').value.trim();
      if (ui.activePreviewTab !== 'pdf') setPreviewTab('pdf');
      const count = parsePreviewFind(query);
      $('#previewSearchResults').textContent = count ? `${count} match${count === 1 ? '' : 'es'} highlighted.` : query ? 'No matches found.' : '';
      if (count) { closeModal(); $('.preview-hit')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }
  });

  modalLayer.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
    if (event.key === 'Tab') {
      const focusable = Array.from(modalLayer.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      const target = event.target;
      if (target instanceof HTMLTextAreaElement) return;
      if (target.id === 'projectSearch') {
        const first = $('#searchResults .search-result');
        if (first) { event.preventDefault(); first.click(); }
        return;
      }
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
        const footerButtons = Array.from(modalLayer.querySelectorAll('.modal-footer [data-modal-action]'));
        const primary = footerButtons.find(button => button.classList.contains('button-primary') || button.classList.contains('button-danger')) || footerButtons.at(-1);
        if (primary) { event.preventDefault(); primary.click(); }
      }
    }
  });
  modalLayer.addEventListener('input', event => {
    if (event.target.id === 'projectSearch') renderSearchResults(event.target.value);
    if (event.target.id === 'previewSearchInput') $('#previewSearchResults').textContent = '';
  });

  $('#fileFilter').addEventListener('input', event => { ui.fileFilter = event.target.value; renderSidebar(); $('#fileFilter').focus(); });
  sourceEditor.addEventListener('input', updateActiveFileFromEditor);
  sourceEditor.addEventListener('scroll', () => {
    highlightLayer.scrollTop = sourceEditor.scrollTop;
    highlightLayer.scrollLeft = sourceEditor.scrollLeft;
    lineNumbers.parentElement.scrollTop = sourceEditor.scrollTop;
  });
  sourceEditor.addEventListener('click', renderHighlight);
  sourceEditor.addEventListener('keyup', renderHighlight);
  sourceEditor.addEventListener('select', renderHighlight);
  sourceEditor.addEventListener('keydown', event => {
    const mod = event.ctrlKey || event.metaKey;
    if (event.key === 'Tab') { event.preventDefault(); indentSelection(event.shiftKey); return; }
    if (mod && event.key === 'Enter') { event.preventDefault(); compileProject(); return; }
    if (mod && event.key.toLowerCase() === 's') { event.preventDefault(); saveLocal(); toast('Saved in this browser'); return; }
    if (mod && event.shiftKey && event.key.toLowerCase() === 'f') { event.preventDefault(); openModal('preview-search'); return; }
    if (mod && event.key.toLowerCase() === 'f') { event.preventDefault(); openModal('search'); return; }
    if (mod && event.shiftKey && event.key.toLowerCase() === 'p') { event.preventDefault(); openModal('newproject'); return; }
    if (mod && event.shiftKey && event.key.toLowerCase() === 'm') { event.preventDefault(); insertBlock('inline'); return; }
    if (mod && event.key.toLowerCase() === 'z') { event.preventDefault(); if (event.shiftKey) redoEdit(); else undoEdit(); return; }
    if (mod && event.key === '/') { event.preventDefault(); toggleComment(); return; }
    if (mod && !event.shiftKey && event.key.toLowerCase() === 'b') { event.preventDefault(); wrapSelection('\\textbf{', '}'); return; }
    if (mod && !event.shiftKey && event.key.toLowerCase() === 'i') { event.preventDefault(); wrapSelection('\\emph{', '}'); return; }
    if (event.key === 'Enter' && !mod && sourceEditor.selectionStart === sourceEditor.selectionEnd) {
      const start = sourceEditor.selectionStart;
      const before = sourceEditor.value.slice(0, start);
      const line = before.slice(before.lastIndexOf('\n') + 1);
      const indent = line.match(/^[ \t]*/)?.[0] || '';
      if (indent) {
        event.preventDefault();
        insertAtCursor(`\n${indent}`);
      }
    }
  });
  $$('.tool-button[data-insert]').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.insert;
    if (type === 'bold') wrapSelection('\\textbf{', '}');
    else if (type === 'italic') wrapSelection('\\emph{', '}');
    else if (type === 'inline-math') wrapSelection('$', '$');
  }));
  $('#projectName').addEventListener('input', event => {
    project.name = event.target.value;
    $('#projectCrumb').textContent = project.name || 'Untitled project';
    document.title = `${project.name || 'Untitled project'} — Papertrail`;
    clearTimeout(ui.saveTimer);
    ui.saveTimer = setTimeout(() => saveLocal(true), 350);
  });
  $('#importInput').addEventListener('change', event => {
    if (event.target.files?.length) importProjectFiles(event.target.files);
    else ui.pendingImport = false;
    event.target.value = '';
  });
  $$('.preview-tab').forEach(button => button.addEventListener('click', () => setPreviewTab(button.dataset.previewTab)));
  document.addEventListener('keydown', event => {
    const mod = event.ctrlKey || event.metaKey;
    const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement || event.target.isContentEditable;
    if (event.key === 'Escape') {
      if (!modalLayer.hidden) { closeModal(); return; }
      if (ui.openMenu) { hideMenu(); return; }
      if (document.body.classList.contains('sidebar-open')) { closeSidebar(); return; }
    }
    if (!modalLayer.hidden) return;
    if (event.key === '/' && !typing && !mod) {
      event.preventDefault();
      setPanel('files');
      setTimeout(() => $('#fileFilter')?.focus({ preventScroll: true }), 30);
      return;
    }
    if (mod && event.key === 'Enter') { event.preventDefault(); compileProject(); return; }
    if (mod && event.shiftKey && event.key.toLowerCase() === 'f') { event.preventDefault(); openModal('preview-search'); return; }
    if (mod && event.key.toLowerCase() === 'f' && !typing) { event.preventDefault(); openModal('search'); return; }
    if (mod && event.key.toLowerCase() === 'p' && !event.shiftKey && !typing) { event.preventDefault(); openModal('search'); $('#projectSearch')?.focus(); return; }
    if (mod && event.key.toLowerCase() === 's' && !typing) { event.preventDefault(); saveLocal(); toast('Saved in this browser'); return; }
  });
  const splitter = $('#splitter');
  let drag = false;
  function paneMetrics() {
    const grid = $('#workspaceGrid').getBoundingClientRect();
    const rail = $('.activity-rail')?.getBoundingClientRect().width || 46;
    const sidebar = $('#sidebar')?.getBoundingClientRect().width || 228;
    const splitterWidth = 6;
    const available = Math.max(0, grid.width - rail - sidebar - splitterWidth);
    return { grid, rail, sidebar, splitterWidth, available };
  }
  function applySplitRatio() {
    const gridEl = $('#workspaceGrid');
    if (isMobileLayout()) { gridEl.style.gridTemplateColumns = ''; return; }
    const { grid, rail, sidebar, splitterWidth, available } = paneMetrics();
    const maxEditor = Math.max(260, available - 280);
    const editorWidth = clamp(available * (ui.splitRatio ?? 0.5), 280, maxEditor);
    gridEl.style.gridTemplateColumns = `${rail}px ${sidebar}px ${editorWidth}px ${splitterWidth}px minmax(280px,1fr)`;
  }
  splitter.addEventListener('pointerdown', event => {
    if (isMobileLayout()) return;
    drag = true; splitter.classList.add('dragging'); splitter.setPointerCapture(event.pointerId);
    document.body.classList.add('resizing');
  });
  splitter.addEventListener('pointermove', event => {
    if (!drag) return;
    const { grid, rail, sidebar, splitterWidth, available } = paneMetrics();
    const maxEditor = Math.max(260, available - 280);
    const editorWidth = clamp(event.clientX - grid.left - rail - sidebar, 280, maxEditor);
    if (available > 0) ui.splitRatio = editorWidth / available;
    $('#workspaceGrid').style.gridTemplateColumns = `${rail}px ${sidebar}px ${editorWidth}px ${splitterWidth}px minmax(280px,1fr)`;
  });
  function stopDrag() {
    if (!drag) return;
    drag = false; splitter.classList.remove('dragging'); document.body.classList.remove('resizing');
    if (ui.splitRatio) saveSplitRatio();
  }
  splitter.addEventListener('pointerup', stopDrag);
  splitter.addEventListener('pointercancel', stopDrag);
  splitter.addEventListener('dblclick', () => { ui.splitRatio = 0.5; applySplitRatio(); saveSplitRatio(); });
  window.addEventListener('resize', debounce(() => {
    hideMenu();
    if (!isMobileLayout()) closeSidebar();
    applySplitRatio();
    setMobileView(ui.mobileView, { focus: false });
    renderHighlight();
  }, 120));
  window.addEventListener('orientationchange', () => setTimeout(() => { applySplitRatio(); renderHighlight(); }, 200));
  applySplitRatio();
  const sidebarBackdrop = $('#sidebarBackdrop');
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
  document.addEventListener('dragover', event => {
    if (event.dataTransfer?.types?.includes('Files')) {
      event.preventDefault();
      (ui.projectOpen ? $('#appShell') : $('#launcher'))?.classList.add('file-dragging');
    }
  });
  document.addEventListener('dragleave', event => {
    if (!event.relatedTarget) {
      $('#appShell').classList.remove('file-dragging');
      $('#launcher').classList.remove('file-dragging');
    }
  });
  document.addEventListener('drop', event => {
    $('#appShell').classList.remove('file-dragging');
    $('#launcher').classList.remove('file-dragging');
    if (event.dataTransfer?.files?.length) { event.preventDefault(); importProjectFiles(event.dataTransfer.files); }
  });
  window.addEventListener('beforeunload', () => { if (ui.dirtyFiles.size) saveLocal(false); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && ui.dirtyFiles.size) saveLocal(false); });
}

function initialize() {
  const applePlatform = /Mac|iPhone|iPad|iPod/.test(navigator.platform || '');
  const compileShortcut = document.querySelector('.compile-shortcut');
  if (compileShortcut) compileShortcut.textContent = applePlatform ? '⌘ ↵' : 'Ctrl ↵';
  hydrateIcons();
  migrateLegacyWorkspace();
  projectLibrary = readLibrary();
  project = emptyProject(loadPreferences());
  ui.projectOpen = false;
  ui.openFolders = new Set();
  updateProjectHeader();
  applySettings();
  addEventListeners();
  setMobileView('source', { focus: false });
  closeSidebar();
  showLauncher();
  updatePageIndicator();
  detectCompiler();
}
initialize();
