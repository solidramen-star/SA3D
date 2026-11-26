export const APP_VERSION = '1.2.1';
export const APP_UPDATE_DATE = '2026-11-26';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

/** Newest first. Shown in Help ▸ About. */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.2.1',
    date: '2026-11-26',
    changes: [
      'Midpoint (triangle marker) and frame-crossing (X marker) snaps while drawing; placing a joint there splits the frame(s) so the new member is connected, in one undo step',
      'Short vibration when a snap locks (Android)',
      'Divide frames? now keeps end releases on the outer ends and moves point loads to the right piece',
      'File ? Import DXF?: lines, polylines, 3D faces and points from CAD; choose units, layers, merge tolerance and add/replace; section@material layers assign properties',
      'File ? Export DXF?: model geometry plus deformed shape and force diagrams (with values) on separate layers, in the current length unit',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-11-24',
    changes: [
      'Section catalogs: search and pick a standard section (IPE, HEA, HEB, WF) in Define ▸ Frame sections',
      'Define ▸ Section catalogs… imports your own tables from CSV files edited in Excel (comma or semicolon, decimal point or comma)',
      'Export any catalog or download a template to see the format; import shows a report of skipped rows and warnings',
      'Published A, I33, I22 and J from a catalog override the values computed from the dimensions',
      '.sav SECTIONS table gains Override, Catalog and Mass columns (older files still open)',
    ],
  },
  {
    version: '1.1.8',
    date: '2026-11-20',
    changes: [
      'Elastic joint springs: Assign ▸ Joint springs… sets Kx, Ky, Kz (force/length) and Krx, Kry, Krz (moment/rad) per joint',
      'Prescribed joint displacements (support settlement) per load case: Loads ▸ Joint displacement…',
      'Reactions include spring forces, so reactions still balance the loads',
      'Analysis warnings for a spring on a restrained DOF and for a displacement on a free DOF',
      'New .sav tables SPRINGS and JOINT DISPLACEMENTS (older files still open)',
      'Spring (coil / spiral) and prescribed-displacement glyphs in the 3D view; springs and displacements shown in the inspector',
    ],
  },
  {
    version: '1.1.7',
    date: '2026-11-19',
    changes: [
      'Pin-jointed trusses no longer need restrained joint rotations: unresisted joint rotations are stabilised automatically (with a warning)',
      'Pin - Pin (Truss) preset now releases T at End I only (M2 M3 at both ends)',
      'Releasing P, V2, V3 or T at both ends is blocked in the dialog, the analysis and the .sav reader',
      'Unknown end-release text in a .sav file is now an error with the line number',
      'Released end values are computed, not forced to zero (only round-off is cleaned)',
      'Support and release dialogs: Translations / Rotations (and End I / End J) checkboxes now sit on their own rows under their labels',
    ],
  },
  {
    version: '1.1.6',
    date: '2026-11-18',
    changes: [
      'Prevent Android soft keyboard flashing when selecting dropdown options or opening dialogs',
    ],
  },
  {
    version: '1.1.5',
    date: '2026-11-18',
    changes: [
      'Shear deformation (Timoshenko) in frame elements using shear modulus G and shear areas As2/As3',
      'Shear areas As2/As3 shown in section dialog, inspector and .sav SECTIONS table',
      '"Include self weight" is now checked by default for new models',
      'New Analyze ▸ Frame diagram… menu item',
      'Fixed diagram fill showing positive colour over negative values',
      'Joint labels are easier to read (background pill, offset from joint dot)',
      'Version history added to the About dialog',
    ],
  },
  {
    version: '1.1.4',
    date: '2026-11-17',
    changes: ['Compact multiline load labels, grouped like reaction labels'],
  },
  {
    version: '1.1.3',
    date: '2026-11-17',
    changes: [
      'Stacked load labels per load case with case-name prefixes',
      'Matching 2D/3D diagram colours',
      'Inverted moment axis in diagrams',
    ],
  },
  {
    version: '1.1.2',
    date: '2026-11-17',
    changes: ['Isolated 3D viewport stacking context so labels no longer bleed through dialogs'],
  },
  {
    version: '1.1.1',
    date: '2026-11-16',
    changes: ['Load dialog dropdown shows load case name and type'],
  },
  {
    version: '1.1.0',
    date: '2026-11-15',
    changes: ['Member end releases (Phase 1.1) with hinge markers in the 3D view'],
  },
  {
    version: '1.0.0',
    date: '2026-11-12',
    changes: [
      'Load cases (Dead, Live, custom) and load combinations (default 1.2D + 1.6L)',
      'Frame diagrams window: axial, torsion, V2/M3, V3/M2 and deflection with tap-to-read values',
      'UNP and C frame shapes',
      'Drag a selected joint to move it (snaps to grid)',
      'Unit systems selector (kN-m, N-mm, ton-m, kg-mm, imperial)',
      'Work plane rotate/offset shortcut buttons',
    ],
  },
  {
    version: 'Initial',
    date: '2026-11-07',
    changes: [
      'Touch-friendly 3D modelling canvas: joints, frames and areas',
      'Materials, sections, supports and joint/frame loads',
      'Linear static 3D frame analysis with forces, reactions and deformed shape',
      'Save/open models as comma-separated .sav files (Excel friendly)',
    ],
  },
];