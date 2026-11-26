# AGENTS.md — StructApp 3D

Instructions for coding agents working in this repository. Read this first, then
`docs/ROADMAP.md` (phases, status, Backlog) and `plan.md` (design notes) before
starting any phase work.

## Project

StructApp 3D is a touch-friendly 3D structural analysis PWA (laptop, iPad and
Android tablet browsers). Stack: Vite + TypeScript + Three.js, tests with Vitest.
Units are kN and m. Models are saved as comma-separated `.sav` files that open
in Excel.

| Path | Contents |
|---|---|
| `src/model/` | Model data types, units, sections and catalogs, snap logic |
| `src/solver/` | 3D frame solver (stiffness, skyline solve, loads, diagrams), run in a Web Worker |
| `src/io/` | `.sav` format, section catalog CSV, DXF import/export, file access |
| `src/input/` | Touch/mouse gestures and drawing tools |
| `src/view/` | Three.js viewer |
| `src/ui/` | App shell, menus, dialogs, inspector, styles |
| `src/version.ts` | `APP_VERSION`, `APP_UPDATE_DATE` and the changelog shown in Help |
| `tests/` | Vitest suites |
| `dist/` | Built app (committed on `main`) |

## Working rules

- **Confirm first.** Propose changes and wait for approval on design decisions.
  Do not build, commit or push unless the user explicitly asks
  ("recompile & push to github" means the full release below).
- **Manual edits by the user** stay as they are and are not recorded in the
  changelog or version history unless the user asks.
- Keep the version unchanged unless asked; when asked to "keep same version",
  update content without bumping.
- When a phase finishes, update `docs/ROADMAP.md`, `plan.md` and `README.md`
  where relevant.
- Keep changes surgical; follow the existing code style (TypeScript, CRLF line
  endings, no unnecessary comments).
- Add focused tests in `tests/` for new behavior.

## Environment (Windows)

- Shell is Windows PowerShell 5.1: no `&&` / `||`; chain with `;`.
- Use `npm.cmd` / `npx.cmd` (not `npm` / `npx`).

| Task | Command |
|---|---|
| Dev server | `npm.cmd run dev -- --port 5173 --strictPort` → http://127.0.0.1:5173 |
| Tests | `npx.cmd vitest run` |
| Typecheck | `npm.cmd run typecheck` |
| Build | `npm.cmd run build` (typecheck + Vite build into `dist/`) |

Stop the dev server when the work is done.

## Release procedure (only when asked)

1. Bump the version in `src/version.ts` (`APP_VERSION`, `APP_UPDATE_DATE`,
   new changelog entry), `package.json`, and `package-lock.json` (lines 3 and 9).
2. Run tests, then `npm.cmd run build`.
3. Commit source **and** `dist/` with message `Release vX.Y.Z: <summary>`.
4. `git push origin HEAD:main`.
5. Deploy to GitHub Pages (`gh-pages` holds the contents of `dist/` at its root):
   ```powershell
   $w = "$env:TEMP\sa3d-ghp"
   git worktree add --detach $w origin/gh-pages
   Get-ChildItem $w -Force | ? Name -ne '.git' | Remove-Item -Recurse -Force
   Copy-Item dist\* $w -Recurse -Force
   Push-Location $w; git add -A; git commit -m "Deploy vX.Y.Z to GitHub Pages"; $g = git rev-parse HEAD; Pop-Location
   git push origin "$($g):refs/heads/gh-pages"
   git worktree remove --force $w
   ```
6. Verify with `git ls-remote origin main gh-pages`, and fast-forward the local
   `main` / `gh-pages` refs to match.

## Mark-of-the-Web rule

Every file created or modified (source, docs, `dist/`, `.git` internals, temp
files, npm logs) must get a `Zone.Identifier` alternate data stream:

```
[ZoneTransfer]
ZoneId=3
HostUrl=about:internet
```

- Keep an existing `ZoneId=4` unchanged.
- Skip `.git\refs\copilot\...` checkpoint refs.
- Read-only files (e.g. loose git objects): clear the read-only flag, mark,
  then restore it.
- Verify each mark by reading the stream back.
- End every reply with a **Marked files:** list and a **Not marked:** list.
