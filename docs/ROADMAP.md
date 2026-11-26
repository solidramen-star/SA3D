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
> - A backlog item has no version series of its own. When it is implemented, it ships in the **current** version series (for example, at `v1.2.3` it ships as `v1.2.4`). See the versioning rule below.
> - Before starting an item, read its review notes in the Review Notes section.

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

---

## 🔍 Review Notes (checked against the v1.0-baseline code)

Corrections and gaps found when checking this plan against the current source. Resolve these before implementing each item.

### Phase 1
- ✅ **Resolved in v1.1.7** – all four 1.1 notes below: joint rotations with no rotational stiffness get a tiny automatic spring (with a warning listing the joints); the Assign Releases dialog, the analysis and the `.sav` reader reject P/V2/V3/T released at both ends; the Pin-Pin (Truss) preset releases T at End I only; released end values are no longer forced to zero (only round-off below 1e-9 of the member's force scale is cleaned); unknown `Rel_I`/`Rel_J` text is a `.sav` error with the line number. Tests: `tests/releases.test.ts` → "Release review fixes (v1.1.7)".
- **1.1 Releases – stability:** the solver already stops with "The structure is unstable (mechanism)" when a DOF has no stiffness (`analyze.ts`). With Pin-Pin members, a joint that only connects to truss members has free rotations, so the solver will reject it. Choose one: (a) automatically restrain or add a tiny stiffness to joint rotations that have no rotational stiffness (what ETABS/SAP2000 do), or (b) show a clear warning. Releasing **T** or **V2/V3** at *both* ends is always a mechanism, so the dialog must block it.
- **1.1 "Pin-Pin (Truss)" preset:** release M2 + M3 at both ends and **T at end i only**. Releasing T at both ends is unstable.
- **1.1 Diagrams:** `solver/diagram.ts` only samples values and needs no "zeroing". If the condensed stiffness and condensed fixed-end forces are correct, the end moments come out as zero on their own. Member deflections are already integrated from curvature using the end displacements (`integrateDeflection`), so hinge rotations need no special handling. Add a test that checks this.
- **1.1 `.sav` format:** fix the `Rel_I`/`Rel_J` cell format. Suggested: `None`, `Pin`, or space-separated DOF names (`M2 M3`). Unknown text → error with the row number.
- ✅ **Resolved in v1.1.8** – both 1.2 notes below: new unit quantities force/length (`FL`) and moment/rad (`MR`); reactions include spring forces (−k·u) so ΣReaction = ΣLoad; a DOF that is restrained and also has a spring keeps the restraint (analysis warning); prescribed displacements belong to a load case and are saved in `TABLE,JOINT DISPLACEMENTS` with a `LoadCase` column.
- **1.2 Springs:** need new unit quantities in `model/units.ts` (force/length, moment/rad). Reactions must include the spring forces (−k·u), otherwise the equilibrium check (3.2) fails. A DOF that is both restrained and has a spring should keep the restraint, and the UI should warn.
- **1.2 Prescribed displacements:** the title mentions them, but there is no specification yet. They belong to a **load case** (like loads), not to the joint. They need a table such as `TABLE,JOINT DISPLACEMENTS` with a LoadCase column.
- **1.3 Snapping:** moved out of Phase 1. Its notes are now under **2.3** (midpoint/crossing) and **Backlog → B.1** (the rest).

### Phase 2
- **2.1 Catalog:**
  - Catalog values (A, I, J) include root fillets, but the current shape formulas ignore them. Resolved by the property override: catalog rows with published A / I33 / I22 / J are stored with those values and the analysis uses them.
  - Excel saves CSV with the locale list separator (`;` in many countries) and decimal comma; the importer must handle both. A `.sav` must not depend on a catalog being installed on the device.
  - Angles (L) are not supported yet. Unequal angles have rotated principal axes, but the solver assumes I33/I22 are principal axes, so they need extra work.
  - AISC data is in inches and must be converted. Lazy-load the JSON so the PWA stays small, and check the redistribution licence of each data source.
- ✅ **Resolved in v1.2.1** – all 2.2 notes below: `LINE` is read as 3D; `LWPOLYLINE`/`POLYLINE`/`3DFACE` are read (3DFACE → Areas); `$INSUNITS` sets the default unit; the merge tolerance never goes below `COORD_TOL`.
- **2.2 DXF:**
  - There is no `3DLINE` entity in DXF; a `LINE` entity is already 3D.
  - Also read `LWPOLYLINE`/`POLYLINE`, and optionally `3DFACE` → Areas.
  - Respect `$INSUNITS` for units. Reuse `COORD_TOL` from `model/model.ts` when merging endpoints.
- ✅ **Resolved in v1.2.1** – all 2.3 notes below: `splitFrameAt` keeps releases on the outer ends and `divideFrame` now uses it; the 3D crossing test uses the segment-to-segment distance; a snap on an existing joint reuses it; haptics use `navigator.vibrate?.(15)`.
- **2.3 Snap Essentials:**
  - The existing `divideFrame` in `model/model.ts` does **not** copy `relI`/`relJ` to the new pieces, so dividing a released frame loses its releases. Fix this when adding `splitFrameAt` (outer ends keep the releases), and add a test.
  - Crossing snap works in 3D: two frames only "cross" if the shortest distance between them is ≤ `COORD_TOL` and the point lies inside both frames (not at an existing end joint).
  - Do not split a frame when the snap lands on an existing joint; reuse that joint.
  - `gestures.ts` already uses `navigator.vibrate?.(15)`; reuse it.

### Phase 3
- **3.1 P-Delta:**
  - Results are no longer linear, so **combinations cannot be added up from case results** the way v1 does. When P-Delta is on, each combination must be analyzed as its own nonlinear load set.
  - The 3D geometric stiffness also needs the torsional term.
  - The `.sav` change is a new `PDelta` column in `TABLE,SETTINGS`.
  - Typo in step list: "iterative iterative solver".
- **3.2 PDF:** the equilibrium table must include self weight and area loads. Moments are taken about the global origin. `jspdf` is a new dependency; the print-stylesheet route needs none.
- **3.3 Modal:**
  - The skyline solver needs an eigen solver, such as subspace iteration or Lanczos.
  - Define a **mass source**: which cases/self weight count as mass, with g = 9.81 m/s².
  - With a lumped mass matrix, rotational DOFs have zero mass and must be condensed out.

### Phase 4
- **Material** has no yield strength (Fy/fy) yet, so the schema and `.sav` must change.
- The interaction equation shown is AISC H1-1a only (Pr/Pc ≥ 0.2); H1-1b is also needed.
- The checks also need unbraced lengths and K factors per frame.
- **Auto combinations:** `LoadCaseType` only has Dead/Live/Other. Add Wind, Seismic, Snow, etc. "0.9D ± 1.0W" means two combinations.

### Phase 5 (planning notes, not yet reviewed against code)
- The undo system stores a full JSON snapshot per `Model.commit` (`maxUndo` limit). A large agent change is one snapshot, which is fine, but do not call `commit` once per created item.
- The analysis runs in a Web Worker (`solver/client.ts`); agent tools must `await` it and handle "analysis failed / unstable" as a normal tool result.
- Decide the AI provider option (5.3) before writing code. BYOK keeps the app serverless and matches the current GitHub Pages hosting.
- The PWA service worker must not cache AI API responses.

### Backlog
- **B.1 Advanced snaps:** polar tracking must work within the current work plane (XY/XZ/YZ + elevation). A perpendicular or area-edge snap that lands on a frame must use the same auto-split as 2.3.
- **B.2 Pen vs touch:** making touch camera-only by default would break finger drawing for tablets without a stylus, and the touch joint-drag added in v1. Switch to pen mode automatically the first time a `pen` pointer is detected, and add a manual toggle. Apple Pencil/S-Pen double-tap is **not exposed to web pages**, and long-press already opens the context menu. The radial menu should replace or extend that menu rather than add a conflicting gesture.

### Compatibility matrix / verification
- Add rows for Phase 4 (Material Fy, frame design parameters, case types) and mass source (modal).
- ✅ **Release test 2 (resolved in v1.1.7 – wording fixed above):** a central *point* load gives PL/4, while **wL²/8** is for a *uniform* load. Use a beam between two **fixed** supports with M3 released at both ends, so it must match the simply supported result.
- `ETABS Verif/` currently holds `Test 1.xlsx` only. Add a `.sav` model per benchmark next to its ETABS result.

### Suggested branch order
`feature/phase1-core-mechanics`: 1.1 releases → 1.2 springs (+ settlements). ✅ Phase 1 is complete (v1.1.8); the former 1.3 snapping moved to 2.3 and Backlog B.1. Each item gets tests and README updates, then a merge to `main` and a tag (`v1.1`).
✅ Phase 2 is complete (2.1 section catalog in v1.2.0 → 2.2 DXF and 2.3 snap essentials in v1.2.1). It was developed on `feature/phase1-core-mechanics` and released to `main`; no separate `feature/phase2-workflow-cad` branch was created.
Next phases follow the same pattern, one branch per phase: `feature/phase3-analysis-reports` (3.1 P-Delta → 3.2 PDF report → 3.3 modal), `feature/phase4-code-checks`, `feature/phase5-ai-agent` (5.1 tools → 5.2 chat panel → 5.3 provider → 5.4 safeguards).
Backlog items (B.1, B.2, …) have no fixed place in this order. Each one gets its own branch when it is pulled in, e.g. `feature/backlog-b1-advanced-snaps`.

#### App versioning rule (applies to every update)
The app version has the form `v1.P.N`. Pick `P` from the roadmap phase that the update belongs to:

| Roadmap phase | App version range | Example |
|---|---|---|
| Phase 1 (items 1.1, 1.2, plus Phase 1 fixes) | `v1.1.N` | `v1.1.5` → `v1.1.6` |
| Phase 2 (items 2.1, 2.2, 2.3 Snap Essentials) | `v1.2.N` | first Phase 2 release = `v1.2.0` |
| Phase 3 (items 3.1, 3.2, 3.3) | `v1.3.N` | first Phase 3 release = `v1.3.0` |
| Phase 4 (design & code checks) | `v1.4.N` | first Phase 4 release = `v1.4.0` |
| Phase 5 (AI agent, items 5.1–5.5) | `v1.5.N` | first Phase 5 release = `v1.5.0` |
| Backlog (items B.1, B.2, …) | no own series: use the **current** series | at `v1.2.3`, a backlog item ships as `v1.2.4` |

Follow these rules for every update:
1. **The roadmap item number is not the app version.** Roadmap item "1.2 Elastic Spring Supports" is still Phase 1, so it ships as `v1.1.N`, **not** `v1.2.x`.
2. **Updates inside the current phase:** increase `N` by 1 for each release, whether it is a feature, a fix or a UI tweak. For example, `v1.1.6` becomes `v1.1.7`. `N` has no upper limit: `v1.1.9` is followed by `v1.1.10`.
3. **The first release of a new phase:** set `P` to the phase number and reset `N` to 0. For example, the first Phase 2 release is `v1.2.0`.
4. **A fix to an earlier phase after a later phase has started:** use the current highest version series. For example, a Phase 1 bug fix released while the app is at `v1.2.3` ships as `v1.2.4`. Versions never go backwards.
5. **Where to change the version** (all three must match):
   - `package.json` / `package-lock.json`: run `npm version 1.P.N --no-git-tag-version`.
   - `src/version.ts`: set `APP_VERSION` and `APP_UPDATE_DATE` (YYYY-MM-DD).
   - `src/version.ts`: add a new entry at the **top** of the `CHANGELOG` array.
6. **Commit and deploy:** rebuild `dist/` and commit with a message that includes the version, e.g. `Release v1.1.7: ...`. Push the source to `main`. Then deploy `dist/` to `gh-pages` with the commit message `Deploy v1.P.N to GitHub Pages`.