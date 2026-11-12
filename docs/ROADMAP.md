# StructApp 3D – Feature Update Roadmap & Implementation Plan

This document outlines the product and engineering roadmap for **StructApp 3D** (touch-friendly 3D structural analysis web app). It serves as an actionable specification for feature updates across development sessions.

---

## 🎯 Executive Summary & Objectives

1. **Engineering Completeness:** Support fundamental structural systems (trusses, braced frames, simply supported beam-girder framing) via member end releases and elastic spring supports.
2. **Workflow Acceleration:** Provide built-in standard steel/concrete section databases (AISC, Eurocode, British Standards) and 3D DXF CAD wireframe import.
3. **Touch & Tablet Productivity:** Exploit pen/stylus precision (Apple Pencil / S-Pen vs. finger discrimination), advanced geometric snapping (midpoint, perpendicular, polar angle tracking), and radial context menus.
4. **Professional Deliverables:** Offer automated PDF calculation reports (equilibrium verification, peak force envelopes, 3D views) and steel capacity/utilization checks (AISC 360 / Eurocode 3).

---

## 🗺️ Roadmap Overview

```
Phase 1: Core Mechanics ──► Phase 2: Workflow & CAD ──► Phase 3: Non-Linear & Reports ──► Phase 4: Code Checks
• Member End Releases       • Standard Section Library    • P-Delta (P-Δ) Solver           • AISC / EC3 Capacity
• Spring Supports           • DXF Centerline Import       • PDF Calculation Reports        • Shell / Plate Elements
• Snapping Engine v2        • Apple Pencil / Stylus Mode  • Dynamic Modal Frequencies      • Auto Load Combinations
```

---

## 📌 Phase 1: Essential Engineering & Modeling Precision (Near-Term)

*Target: Enable realistic frame/truss connections and improve drawing accuracy.*

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

---

### 1.3 Advanced Snapping Engine (Smart Guides & Polar Tracking)
- **Problem:** Drawing is currently constrained to grid intersections or existing joints.
- **Specification:**
  - **Midpoint Snap:** Snaps to $50\%$ station along existing frame elements (visual triangle indicator).
  - **Perpendicular Snap:** Snaps to nearest orthogonal projection onto existing member lines.
  - **Polar Angle Tracking:** Snaps to configurable angular increments ($0^\circ, 30^\circ, 45^\circ, 90^\circ$) from the active draw origin with dashed guide rays.
  - **Haptic Feedback:** Vibrates mobile devices briefly (`navigator.vibrate(10)`) when a snap point locks.

---

## 📌 Phase 2: Libraries, Interoperability & Touch Refinement (Mid-Term)

*Target: Eliminate manual dimension entry, enable CAD imports, and optimize tablet input.*

### 2.1 Standard Steel Section Library (AISC, Eurocode, British)
- **Problem:** Users must manually compute and type dimensions (depth, width, flange/web thickness) for standard profiles.
- **Specification:**
  - Integrate compact JSON datasets:
    - **AISC 15th Edition:** W-shapes, HSS Rectangular/Round, Channels (C/MC), Equal/Unequal Angles (L).
    - **European Standards (EN 10365 / EN 10210):** IPE, IPN, HEA, HEB, HEM, SHS, RHS.
    - **British Standards:** UB, UC, PFC.
  - Add a "Catalog" tab in the Section Definition dialog (`src/ui/dialogs.ts`):
    - Searchable autocomplete field (e.g., `W14X90`, `IPE 300`, `HEB 200`).
    - Selecting an entry automatically populates shape type, dimensions, $A$, $I_{33}$, $I_{22}$, $J$, and nominal weight.

---

### 2.2 3D DXF Wireframe Importer & Exporter (`src/io/dxf.ts`)
- **Problem:** Creating complex space frames, roof trusses, or multi-story buildings directly on a tablet canvas is time-consuming.
- **Specification:**
  - **Import:** Read ASCII DXF files. Extract `LINE` and `3DLINE` entities, cluster endpoints within `COORD_TOL` into `Joints`, create `Frames`, and map layers to sections or materials.
  - **Export:** Write model geometry, deformed shapes, and internal force wireframes back to 3D DXF layers for presentation in AutoCAD/Revit/Rhino.

---

### 2.3 Tablet Ergonomics: Stylus / Apple Pencil Discrimination & Radial Menu
- **Problem:** Accidental drawing occurs while trying to pan/orbit on tablets.
- **Specification:**
  - **Pointer Discrimination (`src/input/gestures.ts`):**
    - `pointerType === 'pen'`: Dedicated exclusively to drawing, selecting, and moving joints.
    - `pointerType === 'touch'`: Dedicated to camera manipulation (orbit, pan, pinch-to-zoom), ignoring draw triggers unless finger drawing is explicitly toggled.
  - **Radial / Pie Quick-Action Menu:**
    - Triggered via stylus double-tap or long-press.
    - Radial options: *Frame Tool*, *Joint Tool*, *Select*, *Delete*, *Run Solver*, *Toggle Work Plane*.

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

## 🛠️ Technical Migration & Compatibility Matrix

| Feature | Primary Modules Affected | `.sav` Format Changes | Backward Compatible? |
|---|---|---|---|
| **Member Releases** | `model/types`, `solver/frame3d`, `ui/inspector`, `view/viewer` | Adds `Rel_I`, `Rel_J` to `TABLE,FRAMES` | ✅ Yes (defaults to Rigid) |
| **Spring Supports** | `model/types`, `solver/analyze`, `ui/dialogs` | Adds `TABLE,SPRINGS` | ✅ Yes (ignored if omitted) |
| **Section Catalog** | `model/sections`, `ui/dialogs` | None (serializes standard dimensions) | ✅ Yes |
| **DXF Import/Export** | `io/dxf.ts`, `ui/app` | None (populates `ModelData`) | ✅ Yes |
| **P-Delta Analysis** | `solver/analyze`, `solver/frame3d` | Adds setting `PDelta,Yes/No` | ✅ Yes |
| **Modal Analysis** | `solver/modal.ts`, `view/viewer` | None (computed dynamically) | ✅ Yes |

---

## 🧪 Verification & Benchmark Strategy

Every solver enhancement must pass automated tests in `tests/` and ETABS benchmark verifications:
1. **Truss Verification (`tests/truss.test.ts`):** Compare pinned-end plane truss internal axial forces against method of joints / ETABS.
2. **Member Release Verification:** Simple beam with central point load and moment releases at both ends confirms zero end moments and $wL^2/8$ span moment.
3. **P-Delta Verification:** Column under gravity load with lateral tip load checked against Euler secondary magnification formula:
   $$\delta = \frac{\delta_0}{1 - P / P_{cr}}$$
4. **ETABS Benchmark Models:** Maintain benchmark files in `ETABS Verif/` to ensure agreement within $< 0.1\%$ discrepancy.

---

## 🔍 Review Notes (checked against the v1.0-baseline code)

Corrections and gaps found when checking this plan against the current source. Resolve these before implementing each item.

### Phase 1
- **1.1 Releases – stability:** the solver already stops with "The structure is unstable (mechanism)" when a DOF has no stiffness (`analyze.ts`). With Pin-Pin members, a joint that only connects to truss members has free rotations, so the solver will reject it. Choose one: (a) automatically restrain or add a tiny stiffness to joint rotations that have no rotational stiffness (what ETABS/SAP2000 do), or (b) show a clear warning. Releasing **T** or **V2/V3** at *both* ends is always a mechanism, so the dialog must block it.
- **1.1 "Pin-Pin (Truss)" preset:** release M2 + M3 at both ends and **T at end i only**. Releasing T at both ends is unstable.
- **1.1 Diagrams:** `solver/diagram.ts` only samples values and needs no "zeroing". If the condensed stiffness and condensed fixed-end forces are correct, the end moments come out as zero on their own. Member deflections are already integrated from curvature using the end displacements (`integrateDeflection`), so hinge rotations need no special handling. Add a test that checks this.
- **1.1 `.sav` format:** fix the `Rel_I`/`Rel_J` cell format. Suggested: `None`, `Pin`, or space-separated DOF names (`M2 M3`). Unknown text → error with the row number.
- **1.2 Springs:** need new unit quantities in `model/units.ts` (force/length, moment/rad). Reactions must include the spring forces (−k·u), otherwise the equilibrium check (3.2) fails. A DOF that is both restrained and has a spring should keep the restraint, and the UI should warn.
- **1.2 Prescribed displacements:** the title mentions them, but there is no specification yet. They belong to a **load case** (like loads), not to the joint. They need a table such as `TABLE,JOINT DISPLACEMENTS` with a LoadCase column.
- **1.3 Snapping:** `gestures.ts` already uses `navigator.vibrate?.(15)`; reuse it. Polar tracking must work within the current work plane (XY/XZ/YZ + elevation). Also consider snapping to area edges and frame intersections.

### Phase 2
- **2.1 Catalog:**
  - Catalog values (A, I, J) include root fillets, but the current shape formulas ignore them. Store catalog sections with their catalog properties, for example as an override on the shape, so the analysis uses the published values.
  - Angles (L) are not supported yet. Unequal angles have rotated principal axes, but the solver assumes I33/I22 are principal axes, so they need extra work.
  - AISC data is in inches and must be converted. Lazy-load the JSON so the PWA stays small, and check the redistribution licence of each data source.
- **2.2 DXF:**
  - There is no `3DLINE` entity in DXF; a `LINE` entity is already 3D.
  - Also read `LWPOLYLINE`/`POLYLINE`, and optionally `3DFACE` → Areas.
  - Respect `$INSUNITS` for units. Reuse `COORD_TOL` from `model/model.ts` when merging endpoints.
- **2.3 Pen vs touch:** making touch camera-only by default would break finger drawing for tablets without a stylus, and the touch joint-drag added in v1. Switch to pen mode automatically the first time a `pen` pointer is detected, and add a manual toggle. Apple Pencil/S-Pen double-tap is **not exposed to web pages**, and long-press already opens the context menu. The radial menu should replace or extend that menu rather than add a conflicting gesture.

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

### Compatibility matrix / verification
- Add rows for Phase 4 (Material Fy, frame design parameters, case types) and mass source (modal).
- **Release test 2 is inconsistent:** a central *point* load gives PL/4, while **wL²/8** is for a *uniform* load. Use a beam between two **fixed** supports with M3 released at both ends, so it must match the simply supported result.
- `ETABS Verif/` currently holds `Test 1.xlsx` only. Add a `.sav` model per benchmark next to its ETABS result.

### Suggested branch order
`feature/phase1-core-mechanics` (this branch): 1.1 releases → 1.2 springs (+ settlements) → 1.3 snapping. Each item gets tests and README updates, then a merge to `main` and a tag (`v1.1`).