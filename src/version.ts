export const APP_VERSION = '1.1.6';
export const APP_UPDATE_DATE = '2026-11-18';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

/** Newest first. Shown in Help ▸ About. */
export const CHANGELOG: ChangelogEntry[] = [
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