# StructApp 3D – Touch-Friendly 3D Structural Analysis

A browser-based 3D frame analysis app for laptops, iPads and Android tablets. Draw joints, frames and areas on a 3D canvas, define materials, sections and supports, apply loads, run a linear static analysis, and review forces, reactions and deformed shapes. Models are saved as comma-separated `.sav` files that open directly in Microsoft Excel.

Built with Vite, TypeScript and Three.js, and installable as a PWA (works offline once loaded).

## Getting started

```powershell
npm install
npm run dev        # development server, also reachable from a tablet on the same network
npm run build      # production build in dist/
npm run preview    # serve the production build
npm test           # unit tests (solver, model, .sav format)
```

Open the printed URL in Chrome, Edge, Safari (iPad) or Chrome (Android). For a quick start, use **File → Load example model** and then press **Run** (or F5).

## Workflow

1. **Define** → Materials, Frame sections, Support types, Grid & work plane.
2. **Draw** joints (tap the grid), frames (tap joint to joint and keep tapping to chain; Done/Esc ends the chain) and areas (tap 3 or more corners, then Done).
3. **Select** objects by tapping them (the Properties panel shows their data). Use the **Box** tool to drag a selection rectangle, or the **Multi** tool to toggle items one at a time.
4. **Assign** a material, section, β angle, supports or area distribution to the selection.
5. **Loads**: joint point loads (FX…MZ), frame point loads (at a relative distance), frame uniform loads and area loads (force/area). Every load belongs to a **load case**, chosen in the load dialog. You can also switch on self weight.
   - **Loads → Load cases…**: the defaults are `DEAD` (Dead) and `LIVE` (Live). You can add, rename (loads and combinations follow the new name) or delete your own cases. Self weight is added to the first Dead case.
   - **Loads → Load combinations…**: the default is `COMBO1 = 1.2 DEAD + 1.6 LIVE`. Enter a factor for each case (0 means not included). Combination results are the factored sum of the case results.
6. **Analyze → Run analysis** analyses every load case and combination. Use the case/combo dropdown at the start of the results bar to choose which one is shown (a combination is shown first by default). The results bar lets you choose Deformed, P, V2, V3, T, M2, M3 or Reactions. Use the slider (or type a value) to set the deformation scale, and press **Animate** to animate the deformed shape. The force-diagram size is adjustable as well, and **Tables** opens the full result tables.
7. **Frame diagrams**: after the analysis, select one frame and right-click or long-press it, then choose **Frame diagrams…** (or use **Diagrams…** in the Properties panel). The floating window can be dragged by its title. It has these views:
   - Axial P & torsion T.
   - Major (V2, M3 and deflection along local 2).
   - Minor (V3, M2 and deflection along local 3).

   You can switch the load case or combination, and show deflection either as absolute or relative to the chord between the member ends. Tap or drag on any diagram to read the values at that position. At a point load both the left and right values are shown.

### Touch and mouse gestures

| Action | Touch | Mouse |
|---|---|---|
| Orbit | 1-finger drag on empty space | Left drag |
| Pan | 2-finger drag | Right or middle drag |
| Zoom | Pinch | Wheel |
| Select / draw | Tap | Click |
| Context menu | Long-press | Right-click |
| Move the selected joint (snaps to the grid) | Drag that joint | Right-drag that joint |
| Zoom to fit | Fit button | `F` |
| Rotate work plane XY → XZ → YZ | Plane button | `P` |
| Shift work plane ± 1 grid spacing | Up / Down plane buttons | PgUp / PgDn |

Moving a joint keeps it in a plane parallel to the work plane through the joint, and the move is a single undo step. Dragging anywhere else orbits (touch) or pans (right mouse button) the view as usual. The browser's own long-press and right-click menus are turned off over the canvas, so the app menu always appears. The light theme is the default; tick **View → Dark theme** to switch.

The plane buttons at the bottom of the left toolbar show the current plane and offset (for example `XZ Y=4`). When exactly one joint is selected, rotating the plane makes the new plane pass through that joint; otherwise the last offset used for that plane is restored. Plane changes are saved with the model but are not part of undo/redo.

### Keyboard shortcuts

Ctrl+Z / Ctrl+Y undo/redo · Ctrl+S save · Ctrl+O open · Ctrl+N new · Ctrl+A select all · Del delete · Esc cancel/clear · Enter finish · `S` select · `J` joint · `L` frame · `A` area · `B` box select · `M` multi-select · `P` rotate work plane · PgUp/PgDn shift work plane · `0`–`3` view presets · F5 run · F1 help.

## Files (.sav)

**File → Save** writes a plain CSV text file with the `.sav` extension:
- Chrome and Edge on desktop: uses the File System Access API, so you pick a folder and later saves overwrite the same file.
- Safari, iPad and Android: falls back to a file download (saved to the Downloads folder / Files app) and a normal file picker for opening.

The model is also auto-saved to browser storage and offered for recovery on the next start.

The file is a sequence of tables. Each table starts with a `TABLE,<name>` row, then a header row, then data rows, followed by a blank line. In Excel use **File → Open**, choose *All files*, select the `.sav` file and pick *Delimited → Comma* if asked.

Tables: `PROGRAM`, `SETTINGS`, `MATERIALS`, `SECTIONS`, `SUPPORT TYPES`, `JOINTS`, `JOINT RESTRAINTS`, `FRAMES`, `AREAS`, `LOAD CASES`, `LOAD COMBOS`, `JOINT LOADS`, `FRAME POINT LOADS`, `FRAME UNIFORM LOADS`, `AREA LOADS` (every load table has a `LoadCase` column; older files without it put all loads into the first case). If **File → Include results in .sav** is ticked when saving, these are added: `RESULTS JOINT DISPLACEMENTS`, `RESULTS JOINT REACTIONS` and `RESULTS FRAME FORCES`, with a `Case` column for each load case and combination. Results are for reference only and are recomputed after you reopen a file.

You can edit a file in Excel and reopen it, provided you keep the table names, headers and CSV format.

A .sav file is written in the units chosen when you save. The `Units` cell in the `PROGRAM` table (for example `N, mm, C`) and the column headers (for example `X (mm)`) show which units. When you open a file, its values are converted and the display switches to the file's units.

## Conventions

- **Units:** use the dropdown at the bottom right of the status bar to choose kN, m · N, mm · ton, m · kg, mm (metric; ton and kg are tonne-force and kilogram-force) or kip, ft · kip, in · lb, in (imperial). All input fields, tables, labels and results switch to the chosen units straight away. Your choice is remembered on the device. Internally the model is stored and solved in kN and m. Rotations are always in rad and β in degrees. **Global Z is up**. GRAV loads act in −Z, and a positive value means downward.
- **Frame local axes** follow SAP2000:
  - Axis 1 runs from joint I to joint J.
  - For non-vertical members the 1-2 plane is vertical, with axis 2 pointing up.
  - For vertical members, axis 2 is global +X.
  - β rotates axes 2 and 3 about axis 1.
- **Section dimensions:**

  | Shape | Dimensions |
  |---|---|
  | Rectangle | d (depth, along local 2), b (width, along local 3) |
  | Circle | D |
  | Pipe | D, t |
  | I / Wide flange | d, bf, tf, tw |
  | Box / Tube | d, b, tf, tw |
  | UNP / Channel (hot-rolled) | d, bf, tf, tw |
  | C (cold-formed lipped channel) | d, b, c (lip), t |
  | General | A, I33, I22, J entered directly |

  I33 is the major-axis inertia (bending in the 1-2 plane), and I22 is the minor-axis inertia.
- **Internal forces:** P is positive in tension. V2, V3, T, M2 and M3 are reported in local axes along each member's stations.
- **Area loads** are distributed to the bounding frames (one-way or two-way/tributary). Areas carry no stiffness.

## Limitations

- Linear static analysis of 3D space frames: 12-DOF Euler–Bernoulli elements, with multiple load cases and linear combinations. Channels are analysed about their centroid; shear-centre eccentricity and warping torsion are ignored.
- No member end releases (pins), rigid end offsets, springs or P-Δ effects.
- Areas transfer load only and are not shell elements.

## Project layout

```
src/model   data types, section properties, model with undo/redo
src/solver  frame element, load processing, skyline solver, web-worker analysis
src/io      .sav CSV reader/writer, file open/save helpers
src/view    Three.js viewer (rendering, picking, result diagrams)
src/input   touch/mouse gestures and drawing/selection tools
src/ui      app shell, menus, dialogs, properties inspector, styles
tests       vitest unit tests
```
