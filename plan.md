# StructApp 3D – Feature Update Roadmap & Implementation Plan

This document outlines the product and engineering roadmap for **StructApp 3D** (touch-friendly 3D structural analysis web app). It serves as an actionable specification for feature updates across development sessions.

---

## 🎯 Executive Summary & Objectives

1. **Engineering Completeness:** Support fundamental structural systems (trusses, braced frames, simply supported beam-girder framing) via member end releases and elastic spring supports.
2. **Workflow Acceleration:** Provide built-in standard steel/concrete section databases (AISC, Eurocode, British Standards) and 3D DXF CAD wireframe import.
3. **Touch & Tablet Productivity:** Connect new members to existing frames without extra steps (midpoint and frame-crossing snaps that split the frame). Further drawing aids (polar tracking, perpendicular snap, pen/stylus mode, radial menu) are kept in the **Backlog**.
4. **Professional Deliverables:** Offer automated PDF calculation reports (equilibrium verification, peak force envelopes, 3D views) and steel capacity/utilization checks (AISC 360 / Eurocode 3).
5. **AI Assistance (far future):** An optional AI agent that builds and edits models from plain-language requests, runs the analysis and explains the results, using only the app's own tools and solver.

---

## 🗺️ Roadmap Overview

```
Phase 1: Core Mechanics ──► Phase 2: Workflow & CAD ──► Phase 3: Non-Linear & Reports ──► Phase 4: Code Checks ──► Phase 5: AI Agent
• Member End Releases       • Standard Section Library    • P-Delta (P-Δ) Solver           • AISC / EC3 Capacity    • Chat Assistant Panel
• Spring Supports           • DXF Centerline Import       • PDF Calculation Reports        • Shell / Plate Elements • Model Tools (build/edit)
                            • Snap Essentials             • Dynamic Modal Frequencies      • Auto Load Combinations • Explain & Check Results
```

**Backlog (unscheduled):** advanced snapping (polar tracking, perpendicular snap, area-edge snap) · pen/stylus mode · radial quick menu. See the **Backlog** section after Phase 5.

---

## 📌 Phase 1: Essential Engineering & Modeling Precision (Near-Term)

*Target: Enable realistic frame/truss connections and support conditions.*

> **Status:** ✅ Phase 1 is complete with items 1.1 and 1.2 (v1.1.8). The former item 1.3 (Advanced Snapping Engine) was split: midpoint and frame-crossing snaps moved to **2.3 Snap Essentials**; the rest moved to the **Backlog** as **B.1**.

### 1.1 Member End Releases (Moment Pins & Hinges)
- **Problem:** Currently, all frame joints are rigidly connected for all 6 DOFs. Trusses, cross-braces, and secondary floor beams framing into continuous girders cannot be realistically modeled without artificial joint splitting.
- **Specification:**
  - Support release of $P$ (axial), $V_2, V_3$ (shear), $T$ (torsion), $M_2$ (minor bending), and $M_3$ (major bending) independently at end $i$ and end $j$.
  - Common presets: **Rigid-Rigid (Fixed)**, **Pin-Pin (Truss)**, **Pin-Rigid**, **Rigid-Pin**.
- **Model Schema (`src/model/types.ts`):**
  ```ts
  export type ReleaseDof = 'P' | 'V2' | 'V3' | 'T' | 'M2' | 'M3';
  export type MemberReleases = [boolean, boolean, boolean, boolean, boolean, boolean]; // P V2 V3 T M2 M3

  export interface Frame {
    id: number;
    i: number;
    j: number;
    material: string;
    section: string;
    beta: number;
    relI?: MemberReleases; // false = rigid/continuous, true = released
    relJ?: MemberReleases;
  }
  ```
- **Solver Implementation (`src/solver/frame3d.ts` & `src/solver/analyze.ts`):**
  - Apply **static condensation** to the $12 \times 12$ local element stiffness matrix $k_l$ before rotating into the global coordinate system:
    $$\begin{bmatrix} k_{rr} & k_{re} \\ k_{er} & k_{ee} \end{bmatrix} \begin{Bmatrix} u_r \\ u_e \end{Bmatrix} = \begin{Bmatrix} f_r \\ 0 \end{Bmatrix}$$
    $$k^* = k_{rr} - k_{re} k_{ee}^{-1} k_{er}$$
  - Also condense element fixed-end reaction (FER) vectors due to span loads.
  - Zero out internal moment/action at the released end in `solver/diagram.ts`.
- **View & UI (`src/view/viewer.ts` & `src/ui/inspector.ts`):**
  - Render a small circular visual hinge or gap at member ends where $M_2$ and/or $M_3$ are released.
  - Add end-release toggles and presets in the Frame Inspector and Assign dialog.
- **Persistence (`src/io/savFormat.ts`):**
  - Add `Rel_I` and `Rel_J` columns to `TABLE,FRAMES` (e.g. `None`, `M2 M3`, `Pin`, etc.) with backward compatibility for older files defaulting to fixed.

---

### 1.2 Elastic Spring Supports & Prescribed Displacements
- **Problem:** Foundation flexibility (soil springs, pile caps) and support settlements cannot be modeled.
- **Specification:**
  - Add nodal translational springs ($K_x, K_y, K_z$ in $\text{kN/m}$) and rotational springs ($K_{rx}, K_{ry}, K_{rz}$ in $\text{kN}\cdot\text{m/rad}$) per joint.
  - In `src/solver/analyze.ts`, sum spring stiffness directly onto the diagonal of the global skyline stiffness matrix for unrestrained DOFs.
  - In `src/view/viewer.ts`, render coil spring glyphs for supported joints with elastic restraints.
- **Prescribed displacements (settlement):**
  - Stored per **load case** in `ModelData.jointDisplacements` (`{ case, joint, d: [UX, UY, UZ, RX, RY, RZ] }`), entered with **Loads → Joint displacement…**.
  - A value acts only on a **restrained** DOF; a non-zero value on a free DOF is ignored with a warning.
  - Solver: set $D$ at the restrained DOFs, subtract $K_{fr} D_r$ from the load vector (element by element, using the condensed element stiffness), solve for the free DOFs. Combinations superpose like loads.
  - `.sav`: `TABLE,SPRINGS` (`Joint, Kx…Krz`) and `TABLE,JOINT DISPLACEMENTS` (`Joint, UX…RZ, LoadCase`); both optional.
- **Status:** ✅ Done in v1.1.8 (tests: `tests/springs.test.ts`).

---

## 📌 Phase 2: Libraries, Interoperability & Touch Refinement (Mid-Term)

*Target: Eliminate manual dimension entry, enable CAD imports, and optimize tablet input.*

> **Status:** ✅ Phase 2 is complete: 2.1 (v1.2.0), 2.2 and 2.3 (v1.2.1).

### 2.1 Section Catalog Library, Editable in Excel (AISC, Eurocode, British, user/local)
- **Problem:** Users must manually compute and type dimensions (depth, width, flange/web thickness) for standard profiles. Users also need their **own** catalogs, based on the profiles sold in their local market or country.
- **Specification:**
  - **Catalog format = CSV table** (one row per section), the same format for built-in and user catalogs, so any catalog can be opened, edited and saved in MS Excel:
    - Columns: `Catalog, Name, Shape, d, bf, tf, tw, A, I33, I22, J, kg/m`, plus a units row (`Units, mm` / `cm` / `m` / `in`).
    - `Shape` uses the app's shapes: `I`, `box`, `pipe`, `unp`, `C`, `rect`, `circle`, `general`.
    - **Published properties:** if `A`, `I33`, `I22`, `J` are filled in, they override the shape formulas (so catalog values with root fillets are used in the analysis). If they are empty, the properties are computed from the dimensions.
  - **Catalog Manager** (Define → Section catalogs…):
    - Lists built-in and imported catalogs (name, rows, source).
    - **Export** a catalog, or an empty **template**, as `.csv`; the user edits it in Excel and saves it as CSV.
    - **Import** a `.csv` catalog: adds a new catalog or replaces one with the same name. Several catalogs can be loaded at once.
    - Before importing, show a **validation report** (unknown shape, missing / negative values, impossible geometry, duplicate names). Bad rows are skipped; the user confirms.
    - The importer accepts Excel's locale variants: `;` as delimiter and `,` as decimal separator, with or without a UTF-8 BOM.
    - Delete imported catalogs.
  - **Storage:** imported catalogs are kept in browser storage (localStorage), so they persist and work offline. iPad / Android browsers cannot re-read a local folder, so after editing a catalog in Excel the user imports it again.
  - **Starter data:** a small built-in starter set (e.g. EN IPE / HEA / HEB, common WF sizes) with nominal dimensions only (properties computed). Full official tables (AISC 15th, EN 10365 / EN 10210, BS UB/UC/PFC, SNI / JIS) can be imported as CSV once their redistribution licence is checked.
  - Add a "Catalog" picker in the Section Definition dialog (`src/ui/dialogs.ts`):
    - Searchable field across all catalogs (e.g., `W14X90`, `IPE 300`, `HEB 200`).
    - Selecting an entry automatically populates name, shape type, dimensions, $A$, $I_{33}$, $I_{22}$, $J$, and nominal weight.
  - **`.sav` portability:** the `.sav` SECTIONS table stores the full values used (dimensions + override properties + catalog name), so a model opens correctly on a device that does not have the catalog.

---

### 2.2 3D DXF Wireframe Importer & Exporter (`src/io/dxf.ts`)
- **Problem:** Creating complex space frames, roof trusses, or multi-story buildings directly on a tablet canvas is time-consuming.
- **Specification:**
  - **Import (File → Import DXF…):** Read ASCII DXF files. Extract `LINE`, `LWPOLYLINE`, 2D/3D `POLYLINE`, `3DFACE` and `POINT` entities (OCS / elevation handled; arcs are read as straight segments; blocks, meshes, text etc. are skipped and reported). Merge endpoints closer than a tolerance (default 1 mm, never below `COORD_TOL`) into `Joints`, create `Frames` and skip duplicates and zero-length segments.
    - **Units:** `$INSUNITS` sets the default drawing unit; the user can override it (m, cm, mm, ft, in).
    - **Layers:** the user picks the layers to import. A layer named `section@material` (or just a section or material name) assigns them; other layers use the first section / material and are listed in a warning.
    - **Areas:** `3DFACE`s and closed polylines on layers starting with `AREA` / `SA3D_AREA` become Areas. Other closed polylines become frames.
    - **Mode:** *Add to model* or *Replace model* (replace clears geometry and loads). One import = one Undo step.
  - **Export (File → Export DXF…):** Write an R12 (AC1009) DXF in the current length unit: joints (`SA3D_JOINTS`), frames on `section@material` layers, areas (`SA3D_AREAS`) and, when results exist, the deformed shape (`SA3D_RESULT_DEFORMED`, current deformation scale) and force diagrams with value labels (`SA3D_RESULT_<P|V2|V3|T|M2|M3>`: the shown diagram, or all six). Opens in AutoCAD / Revit / Rhino / BricsCAD / LibreCAD.
- **Status:** ✅ Done in v1.2.1 (tests: `tests/dxf.test.ts`).

---

### 2.3 Snap Essentials: Midpoint & Frame-Crossing Snaps with Auto-Split
- **Problem:** Drawing snaps only to grid points and existing joints. To connect a brace or secondary beam to the middle of a frame, or where two frames cross, the user must first run **Divide frames…**. If a member only *looks* connected but no joint exists there, the analysis is silently wrong.
- **Specification:**
  - **Midpoint snap:** while the Joint, Frame or Area tool is active, snap to the 50% point of an existing frame. Show a small triangle marker.
  - **Crossing snap:** snap to the point where two existing frames cross (distance between the lines ≤ `COORD_TOL`). Show an X marker.
  - **Auto-split:** placing a joint on a midpoint or crossing snap splits the frame(s) at that point, so the new member is really connected. Add `Model.splitFrameAt(frameId, t)` next to `divideFrame` in `src/model/model.ts`. The pieces keep material, section and `beta`; the original end releases stay on the **outer** ends only (new inner ends are rigid); uniform loads are copied to every piece; point loads are moved to the piece that contains them with a re-scaled `rd`.
  - The new joint, the split and the new member are **one** `Model.commit(...)` step, so one Undo reverts everything.
  - **Snap priority:** existing joint → midpoint / crossing → grid. Use the same pick radius as the joint snap (larger for touch).
  - **Feedback:** reuse `navigator.vibrate?.(15)` from `gestures.ts` when the snap locks. This only works on Android; iPad Safari has no Vibration API, so the marker is the main feedback.
- **Files:** `src/input/tools.ts` (snap search), `src/model/model.ts` (split), `src/view/viewer.ts` (markers), new `tests/snap.test.ts`.
- **Status:** ✅ Done in v1.2.1 (tests: `tests/snap.test.ts`). **Divide frames…** now keeps end releases too.
- **`.sav` format:** no change.

---

## 📌 Phase 3: Advanced Analysis & Reporting (Longer-Term)

*Target: Deliver advanced structural analysis capabilities and submittal-ready reports.*

### 3.1 Geometric Non-Linearity: $P$-Delta ($\text{P-}\Delta$) Analysis
- **Problem:** Linear static analysis neglects secondary sway effects and lateral stiffness reduction in tall slender frames.
- **Specification:**
  - Add an analysis option: `Settings.pDelta: boolean`.
  - Formulate element geometric stiffness matrix $k_g$ based on internal axial force $P$:
    $$k_g = \frac{P}{L} \begin{bmatrix} \dots \end{bmatrix}$$
  - Implement iterative iterative solver in `src/solver/analyze.ts`:
    1. Solve first-order linear system $[K]\{U^{(0)}\} = \{F\}$.
    2. Extract axial force $P$ for each frame member.
    3. Assemble global geometric stiffness matrix $K_g(P)$.
    4. Solve modified system $[K + K_g]\{U^{(k)}\} = \{F\}$.
    5. Iterate until displacement tolerance $|U^{(k)} - U^{(k-1)}| / |U^{(k)}| \le 10^{-3}$ (typically converges in 2–4 iterations).

---

### 3.2 Automated PDF Calculation Report Generator
- **Problem:** Engineers currently have to take screenshots or inspect CSV tables in Excel to present findings.
- **Specification:**
  - Client-side PDF generation (via `jspdf` or HTML print stylesheets):
    - **Header/Footer:** Project title, engineer, date, version, unit convention.
    - **Model Overview:** 3D perspective snapshot, joint coordinate table, material and section properties.
    - **Load Cases & Combinations:** Summary of applied loads and load factors.
    - **Equilibrium Validation Table:** Total Applied Forces vs. Sum of Base Reactions ($\sum F_x, \sum F_y, \sum F_z, \sum M_x, \sum M_y, \sum M_z$) with percentage error check.
    - **Governing Forces Table:** Maximum moments ($M_{33,\max}$), shears ($V_{2,\max}$), axial forces ($P_{\max}$), and member deflections ($\delta_{\max}$) per section group.

---

### 3.3 Dynamic Modal Analysis (Free Vibration / Eigenfrequencies)
- **Problem:** Cannot determine resonant frequencies, natural periods, or earthquake vulnerability.
- **Specification:**
  - Compute lumped mass matrix $M$ from frame self-weight and tributary area loads.
  - Solve generalized eigenvalue problem:
    $$[K - \omega_i^2 M]\{\phi_i\} = 0$$
  - Extract the first $N$ natural frequencies ($f_n = \omega_n / 2\pi$), periods ($T_n = 1/f_n$), and modal participation factors.
  - Render animated harmonic mode shapes in the 3D Three.js viewport.

---

## 📌 Phase 4: Structural Design & Code Checks (Future Horizon)

- **Steel Member Utilization Checks (AISC 360-16 / Eurocode 3):**
  - Compute axial capacity ($P_c = \phi_c F_{cr} A_g$), flexural capacity ($M_{c33} = \phi_b M_n$), and combined interaction ratio:
    $$\frac{P_u}{P_c} + \frac{8}{9}\left(\frac{M_{u2}}{M_{c2}} + \frac{M_{u3}}{M_{c3}}\right) \le 1.0$$
  - Display color-coded members in 3D: Green ($\le 0.8$), Yellow ($0.8 - 1.0$), Red ($> 1.0$).
- **ASCE 7 / Eurocode 0 Load Combination Auto-Generator:**
  - One-tap creation of standard ASD/LRFD combinations:
    - $1.4D$
    - $1.2D + 1.6L$
    - $1.2D + 1.0L + 1.0W$
    - $0.9D \pm 1.0W$
- **True Shell / Plate Bending Finite Elements:**
  - Evolve `Area` elements from pure load transfer surfaces into meshed 4-node Mindlin-Reissner shell elements with in-plane and out-of-plane stiffness for slabs and shear walls.

---

## 📌 Phase 5: AI Agent Assistant (Far Future)

*Target: Let users build, check and explain models in plain language ("add a 3-bay portal frame, 6 m spans, 4 m high, fixed bases"), while every change stays visible, undoable and verified by the real solver.*

> **Status:** idea / not scheduled. Start only after Phases 1–4 are stable, because the agent relies on their features (releases, springs, catalog sections, load combinations, code checks, reports).

### 5.1 Agent Architecture & Tool Layer
- **Principle:** the AI never edits `ModelData` directly and never computes structural results itself. It calls a fixed set of **typed tools**, and the app executes them with the existing code (`model/model.ts`, `solver/*`). The solver is the only source of numbers.
- **Tool registry (`src/agent/tools.ts`, new):** each tool has a name, a JSON schema for its arguments, and a handler that calls existing functions. Examples:
  - *Read:* `get_model_summary`, `list_joints`, `list_frames`, `get_selection`, `get_results(case|combo)`, `get_frame_forces(id)`.
  - *Edit:* `add_joints`, `add_frames`, `add_areas`, `define_material`, `define_section`, `assign_section`, `assign_releases`, `assign_supports`, `add_load_case`, `add_joint_load`, `add_frame_load`, `add_combination`, `delete`.
  - *Generate:* `generate_grid_frame(bays, spans, storeys, heights)`, `generate_truss(type, span, depth, panels)`, `generate_beam(spans, supports)`.
  - *Analyze/View:* `run_analysis`, `show_deformed(scale)`, `show_diagram(type)`, `select(ids)`, `zoom_to(ids)`.
- **Validation:** every handler checks its arguments with the same rules as the dialogs (units, positive dimensions, `releaseMechanismError`, unknown names). Invalid calls return an error message to the agent and change nothing.
- **Undo:** one agent request = one `Model.commit(...)` step, labelled e.g. `AI: add portal frame`, so a single Undo reverts it.
- **Units:** tools take and return values in the model's current display units (`model/units.ts`); the tool descriptions state the units.

### 5.2 Chat Panel UI (touch-friendly)
- A collapsible side panel (`src/ui/agentPanel.ts`, new) with a text box, the on-device dictation/microphone button of the OS keyboard, and suggestion chips (e.g. *"Check equilibrium"*, *"Explain the largest moment"*, *"Make all columns HEB 200"*).
- **Preview before apply:** edit tools first return a *proposed change* (count of joints/frames/loads added, changed, deleted), highlighted in the 3D view in a ghost colour. The user taps **Apply** or **Discard**. A setting may allow auto-apply for read-only and view tools.
- Each step the agent takes (tool name + short summary) is shown in the chat so the user can see what was done.
- Results answers must quote the solver values with units and the case/combination used; "explain" answers link to the relevant frame/joint (tap to select it).

### 5.3 AI Provider, Privacy & Security
- The app is a static PWA on GitHub Pages with no server. Options, to be decided at the start of the phase:
  1. **Bring-your-own-key (BYOK):** the user enters their own API key (OpenAI / Azure OpenAI / Anthropic / etc.); it is stored only in the browser (`localStorage`/IndexedDB), never in the source code, the `.sav` file or the repo.
  2. **Small proxy service** (e.g. a serverless function) that holds the key. This needs hosting, authentication and rate limiting.
  3. **On-device model** (WebGPU / WebLLM) for offline use: private, but large download and weaker tool-calling.
- Use a provider-neutral adapter (`src/agent/provider.ts`) so the provider can change without touching the tools.
- **Privacy:** show clearly that model data is sent to the chosen AI provider. Send only what is needed (summary + requested tables), not the whole file by default.
- **Offline:** the app must keep working without the agent. When offline or with no key, the panel is disabled with a short explanation.

### 5.4 Engineering Safeguards
- The agent must **not** invent results. Any number it reports must come from `get_results` / `get_frame_forces` after `run_analysis`.
- Code-check answers (Phase 4) must name the design code and clause and come from the code-check module, not from the AI's own knowledge.
- Every AI answer that states results or design advice shows a short notice: *"AI-assisted. Check results before use; the engineer of record is responsible."*
- Changes made by the agent are tagged in the undo history and can optionally be written to a `TABLE,AI LOG` in the `.sav` file (time, request, summary of changes), for traceability.

### 5.5 Testing & Versioning
- Tool handlers are normal TypeScript functions, so test them **without** an AI: `tests/agentTools.test.ts` calls each tool with valid and invalid arguments and checks the model and the undo step.
- Keep a small set of scripted conversations (recorded tool-call sequences) as regression tests, e.g. "portal frame → analyze → max M3" must give the same model and results as building it by hand.
- Phase 5 releases use app version `v1.5.N` (see the versioning rule below).

---

## 🗃️ Backlog (unscheduled)

*Ideas that are useful but not needed for correct models or results. They have no phase and no fixed order. Pull an item into the current phase only when users ask for it.*

> **Rules for backlog items:**
> - Backlog items are numbered **B.1, B.2, …**. These numbers are **not** phases and **not** app versions.
> - A backlog item has no version series of its own. When it is implemented, it ships in the **current** version series (for example, at `v1.2.3` it ships as `v1.2.4`). See the versioning rule in `docs/ROADMAP.md`.
> - Before starting an item, read its review notes in `docs/ROADMAP.md`.

### B.1 Advanced Drawing Snaps (from former item 1.3)
- **Why deferred:** grid and joint snaps, work-plane rotate/offset, **Divide frames…** and 2.3 Snap Essentials already cover regular structures. These snaps only save taps; they do not change any result.
- **Specification:**
  - **Perpendicular snap:** snap to the nearest orthogonal projection onto an existing member line.
  - **Polar angle tracking:** snap to configurable angle steps ($0^\circ, 30^\circ, 45^\circ, 90^\circ$) from the active draw origin, with dashed guide rays, inside the current work plane.
  - **Area-edge snap:** snap to points on area edges.
  - **Alternative worth considering first:** typed input of length + angle (or relative coordinates) from the last joint, which is more precise than dragging along a guide ray on a touch screen.

### B.2 Pen / Stylus Mode & Radial Quick Menu (from former item 2.3)
- **Why deferred:** only helps users with a stylus. Today a pen works exactly like a finger, a stray tap is fixed with one Undo, and every radial-menu option already exists in the sidebar, toolbar or long-press menu.
- **Specification:**
  - **Pen mode (`src/input/gestures.ts`):** `pointerType === 'pen'` draws, selects and moves joints; `pointerType === 'touch'` only moves the camera (orbit, pan, pinch-zoom). Pen mode is **off by default**, switches on automatically the first time a pen is detected, and has a manual toggle.
  - **Radial / pie quick menu:** options *Frame Tool*, *Joint Tool*, *Select*, *Delete*, *Run Solver*, *Toggle Work Plane*. It must replace or extend the existing long-press menu, not add a second competing gesture.

---

## 🛠️ Technical Migration & Compatibility Matrix

| Feature | Primary Modules Affected | `.sav` Format Changes | Backward Compatible? |
|---|---|---|---|
| **Member Releases** | `model/types`, `solver/frame3d`, `ui/inspector`, `view/viewer` | Adds `Rel_I`, `Rel_J` to `TABLE,FRAMES` | ✅ Yes (defaults to Rigid) |
| **Spring Supports** | `model/types`, `solver/analyze`, `ui/dialogs` | Adds `TABLE,SPRINGS`, `TABLE,JOINT DISPLACEMENTS` | ✅ Yes (ignored if omitted) |
| **Section Catalog** | `model/sections`, `model/catalog`, `ui/dialogs`, `io/savFormat` | Backward compatible: optional `Catalog`, `Override` columns in the SECTIONS table; older files load unchanged | ✅ Yes |
| **DXF Import/Export** | `io/dxf.ts`, `ui/app` | None (populates `ModelData`) | ✅ Yes |
| **Snap Essentials (2.3)** | `input/tools`, `model/model` (`splitFrameAt`), `view/viewer` | None | ✅ Yes |
| **P-Delta Analysis** | `solver/analyze`, `solver/frame3d` | Adds setting `PDelta,Yes/No` | ✅ Yes |
| **Modal Analysis** | `solver/modal.ts`, `view/viewer` | None (computed dynamically) | ✅ Yes |
| **AI Agent (Phase 5)** | new `agent/tools`, `agent/provider`, `ui/agentPanel`; uses `model/model` commit/undo | Optional `TABLE,AI LOG`; API key is **never** saved | ✅ Yes (table ignored if omitted) |

---

## 🧪 Verification & Benchmark Strategy

Every solver enhancement must pass automated tests in `tests/` and ETABS benchmark verifications:
1. **Truss Verification (`tests/releases.test.ts`):** Compare pinned-end plane truss internal axial forces against method of joints / ETABS, including a truss whose joint rotations are not restrained (auto-stabilised).
2. **Member Release Verification (`tests/releases.test.ts`):** Beam between two **fixed** supports with M3 released at both ends under a **uniform** load $w$ must match a simply supported beam: zero end moments and $wL^2/8$ at midspan. (A central **point** load $P$ gives $PL/4$ instead.)
3. **P-Delta Verification:** Column under gravity load with lateral tip load checked against Euler secondary magnification formula:
   $$\delta = \frac{\delta_0}{1 - P / P_{cr}}$$
4. **ETABS Benchmark Models:** Maintain benchmark files in `ETABS Verif/` to ensure agreement within $< 0.1\%$ discrepancy.
