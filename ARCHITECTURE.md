# Implementation notes

## What runs where

```text
Browser UI (vanilla JS)
  ├─ project launcher + multi-project library → localStorage
  ├─ source files, tabs, snapshots → one localStorage record per project
  ├─ Quick Preview → deterministic, limited LaTeX-to-HTML renderer
  ├─ ZIP import/export → browser ZIP parser/writer
  └─ real compile request → local Node server → temporary TeX directory
```

Quick Preview and real TeX output are separate paths. Quick Preview is a navigation and structural-render convenience; it is not evidence that TeX compiled successfully. The UI labels it explicitly and never presents it as a real PDF.

## Browser application

`app.js` owns state, DOM rendering, storage, Quick Preview, diagnostics, ZIP handling, modals, and responsive behavior. There is no framework or bundler.

### Launcher and project lifecycle

- On startup the app migrates a legacy `papertrail.workspace.v1` record once, then shows the launcher instead of auto-opening a project. `papertrail.legacy-migrated.v1` ensures a deleted migrated project does not reappear on reload.
- Each project is stored under `papertrail.project.v1.<id>`. The launcher index lives in `papertrail.library.v1`; preferences live in `papertrail.preferences.v1`.
- If the library index is empty or stale, `readLibrary()` discovers project records by key prefix. This also recovers from a partially cleared index.
- Creating, opening, duplicating, importing, closing, and deleting a project all go through the same in-memory/project-record path. Closing saves the current project and returns to the launcher; deleting the open project resets the workspace and returns to the launcher.
- ZIP/file imports from the launcher create an empty project first, then import files so imported paths do not collide with template files. Imports from an open project merge into that project.
- Project rename is persisted through the debounced save path. Snapshots are bounded to 16 entries and a total content budget; duplicate projects start with empty snapshot history.

### Editing and preview

- The source editor is a transparent textarea over a syntax-highlighted layer. Both share font, padding, and line height. Word wrap hides the fixed line-number gutter; mobile forces wrapping.
- Quick Preview parses the root `.tex` file, expands `\input`/`\include` with cycle protection, strips comments, builds a limited label/citation map, renders supported environments, and reports basic structural diagnostics.
- Compile root selection prefers a root `main.tex`, then another `.tex` file. Diagnostics cover unclosed braces/environments, duplicate labels or bibliography keys, undefined references and citations, missing images or `.bib` files, unmatched `$` delimiters, and shell-escape warnings.
- A real build is attempted only when the health endpoint says `enabled` and the user asked for a compile. Auto-preview never starts a TeX build. SVG includes are blocked before a real build with a clear 422/error message.
- A successful build stores the PDF as an object URL and displays it in an iframe. Quick Preview output is removed when a real PDF is shown.

### Responsive behavior

- At 1100 px the layout switches to a single Source/Preview pane and an off-canvas project drawer.
- Sidebar, modal, and menu focus states are restored where possible; background content becomes `inert` while a modal is open.
- Splitter position is saved separately from project data and disabled on narrow layouts. The preview page uses fluid width, padding, and typography up to a readable measure.

## Server

`server.mjs` exposes:

- `GET /api/health` — engine availability, compile gate, host mode, timeout, concurrency, and request/source/output limits.
- `POST /api/compile` — JSON compilation request with a `files` object, `rootFile`, and optional `engine`.
- Static file serving with a restrictive CSP, `nosniff`, no-referrer, same-origin resource policy, and frame denial.

The server probes TeX executables in parallel at startup. Compilation is enabled automatically when at least one engine exists and the bind address is loopback. It validates relative paths, bounds request/source/output sizes, writes source to an OS temporary directory, disables TeX shell escape, runs a concurrency guard, enforces a total wall-clock deadline, and deletes the temporary directory after the request.

SVG files are accepted as browser assets but rejected during real compilation because pdfLaTeX, XeLaTeX, and LuaLaTeX do not include SVG directly without shell escape. The app and server both surface this limitation.

Environment controls:

| Variable | Default | Notes |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | Use `0.0.0.0` only for intentional LAN access. |
| `PORT` | `4173` | `0` selects an ephemeral port. |
| `ALLOW_LOCAL_TEX_COMPILE` | automatic on loopback | `0` disables; `1` enables on a trusted non-loopback bind. |
| `TEX_COMPILE_TIMEOUT_MS` | `120000` | Clamped to 10–300 seconds. |
| `TEX_MAX_CONCURRENT_COMPILES` | `1` | Clamped to 1–4. |
| `PDF_PREVIEW` | automatic | `0` disables server-rendered PDF pages and uses the browser PDF viewer fallback. |
| `PREVIEW_RENDER_DPI` | `120` | Page render resolution, clamped to 72–200 DPI. |

These are guardrails, **not a security sandbox**. A multi-user deployment must run TeX in a separate, network-disabled container or VM with OS-enforced resource quotas and a narrowly scoped filesystem.

## Tests

`npm test` spawns ephemeral loopback servers and verifies static serving, security headers, health metadata, the explicit compile opt-out, HTTP method/content-type handling, unknown routes, traversal rejection, dotfile rejection, and static method handling.

One test also starts a second server without `ALLOW_LOCAL_TEX_COMPILE`. It asserts the loopback policy honestly: if a TeX engine is available, compilation is enabled; otherwise the response includes a reason. If TeX is available, the SVG preflight is checked without invoking a build. The rest of the suite stays TeX-independent.

`npm run check` syntax-checks the browser application, server, and test file. No npm dependencies are installed.

## Deliberately out of scope

No identity provider, persistent database, cloud file store, WebSocket collaboration server, CRDT/OT document model, revision database, TeX package mirror, SyncTeX service, production PDF viewer, Git bridge, or institutional admin service is bundled. Demo collaboration, comments, invites, and reset-demo behavior have been removed; local snapshots, ZIP import/export, and project management remain real.
