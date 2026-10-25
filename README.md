# Papertrail Studio — local-first LaTeX workspace

Papertrail is a self-contained LaTeX writing studio built with vanilla browser JavaScript and a small Node.js server. It starts with a project launcher, keeps each project in browser storage, and can build a real PDF with a local TeX engine. There is no account system, cloud database, demo project, or fake collaboration layer.

## Start the workspace

```bash
npm start
```

Open `http://127.0.0.1:4173`. There is no install step and no npm dependency.

The server binds to loopback by default. Real compilation is enabled automatically when TeX is detected **and** the server is bound to loopback. To turn real builds off explicitly:

```bash
npm run start:no-compile
```

Use `HOST` and `PORT` only when needed:

```bash
PORT=4300 npm start
```

Binding to a non-loopback interface disables compilation unless you explicitly opt in with `ALLOW_LOCAL_TEX_COMPILE=1`. Do that only for a trusted private machine; the compile endpoint is not a hardened multi-tenant sandbox.

## Local TeX support

Papertrail looks for `pdflatex`, `xelatex`, `lualatex`, and `tectonic` on `PATH`. pdfLaTeX is the default engine; XeLaTeX and LuaLaTeX are available from **Compiler settings**.

A user-space TinyTeX installation is enough for most documents:

```bash
# Check what is already available
pdflatex --version

# Typical TinyTeX location after a user-space install
export PATH="$HOME/.TinyTeX/bin/x86_64-linux:$PATH"
```

For a Debian/Ubuntu system installation, an approximate package set is:

```bash
sudo apt-get install latexmk texlive-latex-base texlive-latex-recommended texlive-latex-extra
```

Open **Compiler settings** to see whether the server detected an engine. `GET /api/health` reports the same state:

```bash
curl http://127.0.0.1:4173/api/health
```

Real builds use shell escape disabled, a temporary directory, a 5 MB source limit, an 8 MB request limit, an 18 MB PDF limit, and a compile timeout (120 seconds by default). SVG figures are preview-only and are rejected with a helpful error during a real compile; export them to PNG, JPG, or PDF first.

## Projects and local data

The first screen is a launcher containing every local project. From there you can create a project from a template, import a ZIP or individual files, open a recent project, export a ZIP, duplicate a project, or delete one with confirmation.

Project data is stored in the current browser:

- `papertrail.project.v1.<id>` — one project record, including source files, open tabs, and bounded snapshots.
- `papertrail.library.v1` — the launcher index.
- `papertrail.preferences.v1` — theme, font size, engine, and other workspace preferences.
- `papertrail.workspace.v1` — the old single-project key. It is migrated once on first run and left in place as a backup.
- `papertrail.legacy-migrated.v1` — prevents a deleted migrated project from being recreated on the next load.

Export a ZIP for a durable backup. Browser storage can be cleared and has a finite quota. There is no cloud sync, account, collaboration service, comments backend, or presence system.

## Included features

- Multi-project launcher with create, open, import, export, duplicate, rename, and confirmed delete flows.
- Article, blank, thesis, and presentation starters that compile with a normal LaTeX installation.
- Source editor with syntax highlighting, line numbers, undo/redo, search, indentation, word wrap, cursor/word status, and insertion helpers for sections, equations, tables, figures, citations, and symbols.
- File management: create, rename/move, duplicate, download, delete, copy path, import individual files or ZIP projects, export a ZIP, and print/save a preview.
- Project tree, open file tabs, outline, BibTeX references, bounded version snapshots, and a compile log drawer.
- Responsive source/preview layout down to phone widths, plus a dark theme and resizable editor/preview split.
- Real PDF builds through a local pdfLaTeX, XeLaTeX, or LuaLaTeX installation.
- Quick Preview as a clearly labelled browser approximation when a fast structural render is enough.

## Quick Preview is not full LaTeX

Quick Preview renders a useful subset of common LaTeX in the browser: metadata, headings, basic formatting, simple math, equations, lists, tables, figures, labels, references, and citations. It is deliberately labelled as an approximation. Package macros, custom classes, precise typography, advanced math, floats, bibliography passes, engine differences, and many other details are not reproduced.

Use **Recompile** for an authoritative PDF. If no TeX engine is available, Quick Preview remains usable but does not pretend to be a TeX build.

## Security and limits

- The server is a local workspace server, not a multi-tenant service. It serves static files with a restrictive Content Security Policy, `nosniff`, no-referrer, same-origin resource policy, and frame denial.
- Compilation runs directly on the host. Shell escape is disabled, paths are validated, source/output sizes are bounded, builds use a temporary directory, and concurrent builds are limited.
- The endpoint is still **not a security boundary** for untrusted users. A production or shared deployment must use a network-disabled container or VM with OS-enforced CPU, memory, time, and output quotas, authentication, authorization, and isolated storage.
- Real compilation is only enabled by default on loopback. `ALLOW_LOCAL_TEX_COMPILE=0` opts out; `ALLOW_LOCAL_TEX_COMPILE=1` opts in on a non-loopback bind for trusted use.

Useful environment controls:

| Variable | Default | Notes |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | Keep loopback unless LAN access is intentional. |
| `PORT` | `4173` | `0` selects an ephemeral port. |
| `ALLOW_LOCAL_TEX_COMPILE` | automatic on loopback | `0` disables; `1` enables on a trusted network bind. |
| `TEX_COMPILE_TIMEOUT_MS` | `120000` | Clamped to 10–300 seconds. |
| `TEX_MAX_CONCURRENT_COMPILES` | `1` | Clamped to 1–4. |
| `PDF_PREVIEW` | automatic | `0` disables server-rendered PDF pages and uses the browser PDF viewer fallback. |
| `PREVIEW_RENDER_DPI` | `120` | Page render resolution, clamped to 72–200 DPI. |

## Development and tests

```bash
npm run check   # syntax-check app.js, server.mjs, and the test file
npm test        # API/static-server smoke tests; no TeX installation required
```

The tests spawn ephemeral loopback servers, exercise static serving, security headers, health metadata, compile gating, HTTP method/content-type handling, unknown routes, path traversal, dotfile rejection, and static method handling. A TeX-independent test also verifies the loopback default honestly: if an engine is present, compilation is enabled; if not, the health response explains why it is unavailable.

## Scope

This is a functional local-first proof of concept, not a complete Overleaf replacement. It intentionally does not implement Overleaf's full TeX Live environment, a full SyncTeX viewer, rich-text editing, real-time collaborative OT/CRDT editing, accounts, cloud persistence, track changes, Git/Zotero sync, or institutional administration.

For a self-hosted collaborative product, evaluate the official Overleaf Community Edition: <https://github.com/overleaf/overleaf> (AGPL-3.0). Read its license and deployment/security notes before forking or deploying; unsandboxed compiles are unsuitable for untrusted users.

## References

- Overleaf feature overview: <https://www.overleaf.com/about/features-overview>
- Overleaf editor/file navigation: <https://docs.overleaf.com/navigating-in-the-editor/navigating-in-the-editor>
- Official Overleaf Community Edition: <https://github.com/overleaf/overleaf>
