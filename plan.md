# StructApp 3D – Feature Update Roadmap & Implementation Plan

This document outlines the product and engineering roadmap for **StructApp 3D** (touch-friendly 3D structural analysis web app). It serves as an actionable specification for feature updates across development sessions.

---

## 🎯 Executive Summary & Objectives

1. **Engineering Completeness:** Support fundamental structural systems (trusses, braced frames, simply supported beam-girder framing) via member end releases and elastic spring supports.
2. **Workflow Acceleration:** Provide built-in standard steel/concrete section databases (AISC, Eurocode, British Standards) and 3D DXF CAD wireframe import.
3. **Touch & Tablet Productivity:** Exploit pen/stylus precision (Apple Pencil / S-Pen vs. finger discrimination), advanced geometric snapping (midpoint, perpendicular, polar angle tracking), and radial context menus.
4. **Professional Deliverables:** Offer automated PDF calculation reports (equilibrium verification, peak force envelopes, 3D views) and steel capacity/utilization checks (AISC 360 / Eurocode 3).
5. **AI Assistance (far future):** An optional AI agent that builds and edits models from plain-language requests, runs the analysis and explains the results, using only the app's own tools and solver.

---

## 🗺️ Roadmap Overview

```
Phase 1: Core Mechanics ──► Phase 2: Workflow & CAD ──► Phase 3: Non-Linear & Reports ──► Phase 4: Code Checks ──► Phase 5: AI Agent
• Member End Releases       • Standard Section Library    • P-Delta (P-Δ) Solver           • AISC / EC3 Capacity    • Chat Assistant Panel
• Spring Supports           • DXF Centerline Import       • PDF Calculation Reports        • Shell / Plate Elements • Model Tools (build/edit)
• Snapping Engine v2        • Apple Pencil / Stylus Mode  • Dynamic Modal Frequencies      • Auto Load Combinations • Explain & Check Results
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

## 🛠️ Technical Migration & Compatibility Matrix

| Feature | Primary Modules Affected | `.sav` Format Changes | Backward Compatible? |
|---|---|---|---|
| **Member Releases** | `model/types`, `solver/frame3d`, `ui/inspector`, `view/viewer` | Adds `Rel_I`, `Rel_J` to `TABLE,FRAMES` | ✅ Yes (defaults to Rigid) |
| **Spring Supports** | `model/types`, `solver/analyze`, `ui/dialogs` | Adds `TABLE,SPRINGS` | ✅ Yes (ignored if omitted) |
| **Section Catalog** | `model/sections`, `ui/dialogs` | None (serializes standard dimensions) | ✅ Yes |
| **DXF Import/Export** | `io/dxf.ts`, `ui/app` | None (populates `ModelData`) | ✅ Yes |
| **P-Delta Analysis** | `solver/analyze`, `solver/frame3d` | Adds setting `PDelta,Yes/No` | ✅ Yes |
| **Modal Analysis** | `solver/modal.ts`, `view/viewer` | None (computed dynamically) | ✅ Yes |
| **AI Agent (Phase 5)** | new `agent/tools`, `agent/provider`, `ui/agentPanel`; uses `model/model` commit/undo | Optional `TABLE,AI LOG`; API key is **never** saved | ✅ Yes (table ignored if omitted) |

---

## 🧪 Verification & Benchmark Strategy

Every solver enhancement must pass automated tests in `tests/` and ETABS benchmark verifications:
1. **Truss Verification (`tests/truss.test.ts`):** Compare pinned-end plane truss internal axial forces against method of joints / ETABS.
2. **Member Release Verification:** Simple beam with central point load and moment releases at both ends confirms zero end moments and $wL^2/8$ span moment.
3. **P-Delta Verification:** Column under gravity load with lateral tip load checked against Euler secondary magnification formula:
   $$\delta = \frac{\delta_0}{1 - P / P_{cr}}$$
4. **ETABS Benchmark Models:** Maintain benchmark files in `ETABS Verif/` to ensure agreement within $< 0.1\%$ discrepancy.
