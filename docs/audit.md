# StructApp 3D – Codebase Quality & Cleanup Audit

This document records duplicate code, dead code / slop, subtle bugs, and overcomplex solutions found during the codebase audit. It is intended for any developer or AI agent picking up cleanup work before or during Phase 3.

## Status (v1.2.2)

| Section | Status |
|---|---|
| 1. Subtle bugs | ✅ 1.1–1.3 fixed |
| 2. Duplicate code | ✅ 2.1–2.8 and 2.10 (textures) done · ⏸ 2.9 and 2.10 (label stacking) deferred |
| 3. Dead code & slop | ✅ 3.1 and 3.2 done |
| 4. Refactoring targets | ✅ 4.3 done (with 1.3) · ⏳ 4.1, 4.2, 4.4, 4.5 open |

---

## 1. Subtle Bugs & Oversights (Fix First)

### 1.1 `Model.replicate` drops member end releases (`relI` / `relJ`)
- **Location:** `src/model/model.ts:236-240` (inside `replicate`)
- **Issue:** When replicating frames, `replicate` copies `material`, `section`, and `beta` onto the new frame `nf`, and copies joint restraints (`r`) and springs (`k`) onto new joints `nj`, but **does not copy `f.relI` or `f.relJ`**. Note that `splitFrameAt` (`src/model/model.ts:314-315`) *does* copy `relI`/`relJ` correctly.
- **Fix:** Inside the frame replication loop (after `nf.beta = f.beta;`), add:
  ```ts
  if (f.relI) nf.relI = [...f.relI] as typeof f.relI;
  if (f.relJ) nf.relJ = [...f.relJ] as typeof f.relJ;
  ```
  Also copy `relI`/`relJ` in any other frame-duplication paths if present, and add a regression test in `tests/model.test.ts`.
- **Status:** ✅ Resolved in v1.2.2. `replicate` copies `relI`/`relJ` as new arrays; no other frame-duplication path needed it (`splitFrameAt` already did). Test: `tests/model.test.ts` → "replicate copies end releases as independent arrays".

### 1.2 Double-drawn frame lines when `extruded && ghost`
- **Location:** `src/view/viewer.ts:666-669` (inside `buildModel`)
- **Issue:**
  ```ts
  if (this.display.extruded && !ghost) this.buildExtruded(d, jm);
  else this.modelGroup.add(this.lines(fpos, null, 3, fcol));
  if (this.display.extruded && ghost) this.modelGroup.add(this.lines(fpos, null, 2, fcol));
  ```
  When `this.display.extruded && ghost` is true, the `else` branch draws width-3 lines **and** the next line draws width-2 lines on top of them. Also `this.display.extruded && !ghost` is checked twice in consecutive lines.
- **Fix:** Restructure the conditional so ghost frames with `extruded` on draw only once (or only draw the `else` branch when `!this.display.extruded`):
  ```ts
  if (this.display.extruded && !ghost) this.buildExtruded(d, jm);
  else if (!this.display.extruded || ghost) this.modelGroup.add(this.lines(fpos, null, this.display.extruded ? 2 : 3, fcol));
  ```
- **Status:** ✅ Resolved in v1.2.2 with a plain `else` (the suggested `!extruded || ghost` condition is implied): `else this.modelGroup.add(this.lines(fpos, null, this.display.extruded ? 2 : 3, fcol));`

### 1.3 Diagram scrubber destroys its own pointer capture on every move
- **Location:** `src/ui/diagrams.ts:141, 145-161, 178-229, 238-246`
- **Issue:** `pointerdown` calls `root.setPointerCapture(e.pointerId)` (or `handle.setPointerCapture`), and `pointermove` calls `onPick(x)` → `render()`, which executes `s.body.replaceChildren(...)` on every mouse/touch move. This detaches the captured element from the DOM mid-drag.
- **Fix:** During an active drag, update only the cursor `<line>` `x1`/`x2` attributes and the `.fd-readout` / `.fd-pos` text content in place instead of calling `s.body.replaceChildren(...)`.
- **Status:** ✅ Resolved in v1.2.2. It was worse than described: `pick` in `pointerdown` already replaced the SVG, so dragging never worked (only taps). `plot()` now returns `{ el, setCursor }`; taps and drags update the cursor line, readouts and position text in place, and only case/view/reference changes re-render.

---

## 2. Duplicate Code

| # | Duplication | Locations | Recommendation |
|---|---|---|---|
| 2.1 | **2D `segDist` helper** | `src/input/tools.ts:8-13` and `src/view/viewer.ts:1374-1380` | Move to a shared geometry utility (or export from `src/input/tools.ts` / `src/model/snap.ts`) and import in both. |
| 2.2 | **3D vector scale helper (`scale` vs `scale3`)** | `src/solver/frame3d.ts:13` (`scale`) and `src/solver/analyze.ts:193` (`scale3`) | Import and use `scale` from `./frame3d` in `analyze.ts`; remove `scale3`. |
| 2.3 | **3D vector helpers (`dot`, `cross`, `norm`, `normalize`)** | `src/solver/frame3d.ts:5-14`, re-inlined in `src/model/snap.ts:8` (`dot`) and `src/io/dxf.ts:75-79` (`cross`, `unit`) | Import `dot`, `cross`, `norm`, `normalize` from `../solver/frame3d` (or move `Vec3` helpers to `src/model/vec3.ts` if solver shouldn't be imported by `model/`). |
| 2.4 | **Polygon area (Newell's method)** | `src/solver/loads.ts:49-61` (`polygonArea`) and `src/ui/inspector.ts:334-344` | Export `polygonArea` from `src/solver/loads.ts` (or `src/model/model.ts`) and reuse in `inspector.ts`. |
| 2.5 | **1D linear interpolation** | `src/io/savFormat.ts:76-86` (`interp`) and `src/solver/diagram.ts:7-32` (`sampleAt`) | Reuse a single linear interpolation helper. |
| 2.6 | **Selection guard `need()` (checked twice)** | `src/ui/app.ts:528-532` (`App.need`) and `src/ui/dialogs.ts:615-622` (`need`) | `App.commands` already calls `this.need(...)`. Remove the duplicate `need()` check inside `dialogs.ts` (or have dialogs return early if passed empty arrays). |
| 2.7 | **Work-plane grid snapping** | `src/input/tools.ts:84-90` (`snap`) and `src/input/tools.ts:270-281` (`dragTarget`) | Extract a `snapToPlane(v: THREE.Vector3, plane: WorkPlane, spacing: number)` helper in `ToolController`. |
| 2.8 | **UI DOM helpers (`smallBtn` / `btn`, `table` / `listTable`, support checkboxes)** | `src/ui/inspector.ts:14-27, 94-122` vs `src/ui/dialogs.ts:54-72, 491-507, 725-755` | Move shared `btn`, `listTable`, and `restraintChecks` helpers into `src/ui/dom.ts` (or a new `src/ui/widgets.ts`). |
| 2.9 | **CRUD-list & Load-dialog boilerplate** | `src/ui/dialogs.ts` (`defineMaterials`, `defineSections`, `defineSupports`, `loadCasesDialog`, `loadCombosDialog`, and the 5 `*LoadDialog` functions) | Factor out a `createListDialog(...)` and `createLoadDialog(...)` helper. |
| 2.10 | **Canvas texture & multiline label stacking in `Viewer`** | `src/view/viewer.ts:120-191` (4 texture builders) and `887-1067` (`buildDisplacements` + 5 sections of `buildLoads`) | Extract `makeMarkerTexture(draw: (ctx) => void)` and `stackLabels(entries, prefix, renderFn)`. |

**Status (v1.2.2):**
- ✅ **2.1** `segDist` exported from `src/model/snap.ts`.
- ✅ **2.2 / 2.3** New `src/model/vec3.ts` (re-exported by `solver/frame3d.ts`), so `model/` doesn't import `solver/`; used by `analyze.ts` (`scale3` removed), `dxf.ts` and `snap.ts`.
- ✅ **2.4** `polygonArea` exported from `solver/loads.ts` and used by the inspector.
- ✅ **2.5** `savFormat.ts` uses `sampleAt(...).left` (same values at jumps; test in `tests/sav.test.ts`).
- ✅ **2.6** Done the other way round: `App.need` and its guards were removed; the dialogs' `need()` stays because it returns the ids and also guards direct calls.
- ✅ **2.7** `snapToPlane()` helper in `input/tools.ts`.
- ✅ **2.8** `btn` and `listTable` (with a `compact` option) moved to `ui/dom.ts`. The support checkboxes were not merged: the inspector and dialog layouts and commit behaviour differ.
- ✅ **2.10** `makeMarkerTexture(draw)` for the 4 marker textures. ⏸ Label stacking deferred (offsets, keys and classes differ per load type).
- ⏸ **2.9** Deferred to the file split (4.5): the load dialogs differ in validation and add-mode behaviour.

---

## 3. Dead Code, Unused Exports & Minor Slop

### 3.1 Dead / Unused Code to Remove
- **`src/model/types.ts`:**
  - `RELEASE_DOF_LABEL` (line 71) — never referenced.
  - `NO_RELEASES` (line 82) — never referenced.
  - `hasMemberReleases` (line 98) — never referenced.
- **`src/solver/loads.ts`:**
  - `lerp3` (line 47) and `export { lerp3 }` (line 212) — never referenced.
- **`src/solver/skyline.ts`:**
  - `SkylineMatrix.get(i, j)` (line 30) — never called.
- **`src/solver/analyze.ts`:**
  - `Elem.relI` and `Elem.relJ` (lines 64-65, assigned at 349-350) — stored on `Elem` and never read.
- **`src/io/fileAccess.ts`:**
  - `hasFsAccess` (line 34) — exported but never used.
- **`src/io/catalogCsv.ts` / `src/io/dxf.ts` / `src/model/catalog.ts` / `src/model/snap.ts` / `src/model/sections.ts`:**
  - `CATALOG_UNITS` (only used internally in `catalogCsv.ts`, no need to export), `insUnitsFor` & `layerToken` in `dxf.ts`, `saveUserCatalogs` in `catalog.ts`, `closestSegSeg` in `snap.ts` (only used internally by `frameCrossing`), `channelCentroid` in `sections.ts` — drop `export` keyword where only used in-file.
- **`src/input/tools.ts:386-390`:**
  - `static valid(app: App, k: SelKey)` — never called (`app.ts:364-368` inlines the check).
- **`src/ui/dom.ts`:**
  - `parseNum` (line 26) — only used inside `dom.ts`; drop `export`.
  - `selectField` (line 94) adds `input.addEventListener('change', () => input.blur())`, duplicating the global capturing listener at `dom.ts:218-225`.
- **`src/ui/diagrams.ts`:**
  - `frameDiagramsOpen` (line 296) — exported but never used.
  - `State.pos` (lines 39, 246, 280) — written on drag, never read.
- **`src/view/viewer.ts`:**
  - `overlayObjs` (line 1250, cleared at 1253-1255) — never pushed to; `clearGroup(this.overlayGroup)` already disposes children.
  - `deformed.pts?: THREE.Points` (line 297) — never assigned or read.
  - `dispose()` (lines 1369-1371) — never called (and missing `ResizeObserver` disconnect / texture dispose).
  - Line 99 (`export { fmt }`) — only imported by `app.ts:4`, which already imports from `../model/units`.
  - Lines 1100-1102: redundant outer `if (v === 'reactions' || v === 'deformed' || FORCE_VIEWS.includes(v))` wrapping `if (v === 'reactions')`.
  - Lines 442-443: duplicate JSDoc comment on `workPlanePoint`.
- **Status:** ✅ Resolved in v1.2.2 as listed. `hasFsAccess` was deleted (not used in-file either), `Viewer.dispose()` was deleted rather than fixed (the viewer lives as long as the page), and the now-unused `SelKey` / `MemberReleases` imports went with them.

### 3.2 Minor Slop
- **Double JSON deep-clone on every analysis run:**
  - `src/solver/client.ts:48` does `JSON.parse(JSON.stringify(data))` before `w.postMessage` (which already structured-clones), and `src/solver/analyze.ts:747, 754` does `JSON.parse(JSON.stringify(data))` again inside `analyzeAll` / `analyze`.
- **Misplaced JSDoc comment:** `src/solver/analyze.ts:127` has `/** Cumulative trapezoid integral of y over x. */` above `symEigen` (line 129) instead of above `cumtrapz` (line 167).
- **Awkward typing in `src/ui/dialogs.ts:54`:** `listTable` types cells as `Node[][]`, forcing 30+ `document.createTextNode(...)` calls even though `h('td', null, c)` accepts `string | Node`.
- **Unused parameter:** `src/ui/dialogs.ts:391` (`catalogManager(_app: App)`).
- **Inconsistent command call:** `src/ui/inspector.ts:254` calls `assignFrameReleases(app)` directly instead of `app.cmd('assignReleases')`.
- **Status:** ✅ Resolved in v1.2.2, except that the clones in `analyzeAll` / `analyze` stay on purpose: `migrateModel` mutates its input, and the main-thread fallback and the tests pass the live model. Only the `client.ts` clone was removed (`postMessage` already copies). The 30 `createTextNode` wrappers were replaced with plain strings.

---

## 4. Overcomplex Solutions & Refactoring Targets (For Phase 3)

### 4.1 `src/solver/analyze.ts` – Prescribed displacement matrix multiply (`O(12³)` → `O(12²)`)
- **Location:** `src/solver/analyze.ts:510-519`
- **Issue:** Inside `if (hasPrescribed)`, for each element it recomputes `const kg = globalStiffness(e.klCondensed, e.R)` (two $12\times 12$ matrix multiplications) just to multiply by `dg`.
- **Fix:** Compute local force `klCondensed * toLocal12(e.R, dg)` directly and rotate back with `toGlobal12(e.R, ...)`.

### 4.2 `src/solver/analyze.ts` – Breaking up `solveAll` before Phase 3.1 ($P$-Delta)
- **Location:** `src/solver/analyze.ts:302-740` (`solveAll` is ~440 lines)
- **Issue:** `solveAll` mixes validation, element setup, RCM ordering, skyline assembly, truss rotational stabilization, prescribed displacements, case solving, and result recovery.
- **Recommendation:** Extract `prepareModel`, `assembleAndFactor`, and `recoverCase` so Phase 3.1 ($P$-$\Delta$ iterative loop) can wrap the assembly/solve step cleanly.

### 4.3 `src/ui/diagrams.ts` – Full DOM teardown on drag
- **Location:** `src/ui/diagrams.ts:145-229`
- **Issue:** Rebuilding the entire dialog body on every `pointermove` (see Bug 1.3).
- **Fix:** Separate static render (on open / view change) from dynamic cursor overlay updates (on drag).
- **Status:** ✅ Resolved in v1.2.2 together with 1.3.

### 4.4 Tangled `workPlane` state between `ModelData.settings` and `App`
- **Location:** `src/ui/app.ts:471-482` (`setWorkPlane`), `542-552` (`keepWorkPlane`), and `src/model/types.ts:7-12` (`Settings`)
- **Issue:** `workPlane` and `elevation` live in `ModelData.settings` (and therefore in `.sav` and undo snapshots), but `App.setWorkPlane` mutates `model.data.settings` directly without `model.commit`, forcing `App.keepWorkPlane` to intercept `undo()`/`redo()` and overwrite the snapshot's `workPlane`/`elevation`.
- **Fix:** Either move `workPlane`/`elevation` out of `ModelData.settings` into `App` view state (and keep them out of `.sav` undo snapshots), or commit them properly.

### 4.5 Large Files to Split
- `src/ui/dialogs.ts` (~1450 lines): Split by domain (`materials/sections/catalogs`, `supports/assignments`, `loads/combos`, `results/help`).
- `src/view/viewer.ts` (~1400 lines): Extract 2D picking geometry (`pick`, `boxPick`, `pointInPoly`, `segSeg`, `segRect`) and marker textures into `src/view/picking.ts` and `src/view/markers.ts`.
- `src/ui/app.ts` (~1160 lines): Move `importDxf` (`660-740`) into `src/ui/dialogs.ts` and `loadExample` (`783-842`) into `src/io/example.ts`.