// All quantities are SI: kN, m, kN/m, kN/m², kN/m³, degrees for angles.

export type Restraint = [boolean, boolean, boolean, boolean, boolean, boolean]; // UX UY UZ RX RY RZ

export type WorkPlane = 'XY' | 'XZ' | 'YZ';

export interface Settings {
  gridSpacing: number;
  gridLines: number; // lines on each side of origin
  workPlane: WorkPlane;
  elevation: number; // offset of the work plane along its normal
  selfWeight: boolean;
}

export interface Material {
  name: string;
  E: number; // kN/m²
  nu: number;
  gamma: number; // kN/m³
}

export type SectionShape = 'rect' | 'circle' | 'pipe' | 'I' | 'box' | 'unp' | 'C' | 'general';

export interface Section {
  name: string;
  shape: SectionShape;
  /** Shape dimensions in m. See SHAPE_DIMS for meaning per shape. For 'general' these are A, I33, I22, J. */
  dims: number[];
}

export interface SupportType {
  name: string;
  r: Restraint;
}

export interface Joint {
  id: number;
  x: number;
  y: number;
  z: number;
  r: Restraint;
}

export type ReleaseDof = 'P' | 'V2' | 'V3' | 'T' | 'M2' | 'M3';
export const RELEASE_DOFS: ReleaseDof[] = ['P', 'V2', 'V3', 'T', 'M2', 'M3'];
export const RELEASE_DOF_LABEL: Record<ReleaseDof, string> = {
  P: 'Axial (P)',
  V2: 'Shear V2',
  V3: 'Shear V3',
  T: 'Torsion (T)',
  M2: 'Moment M2 (minor)',
  M3: 'Moment M3 (major)',
};

export type MemberReleases = [boolean, boolean, boolean, boolean, boolean, boolean]; // P V2 V3 T M2 M3 (false = rigid/continuous, true = released)

export const NO_RELEASES: MemberReleases = [false, false, false, false, false, false];
export const PIN_RELEASES: MemberReleases = [false, false, false, false, true, true]; // M2 & M3 released

export function hasMemberReleases(rel?: MemberReleases): boolean {
  return !!rel && rel.some(Boolean);
}

export function formatReleases(rel?: MemberReleases): string {
  if (!rel || !rel.some(Boolean)) return 'None';
  const tokens: string[] = [];
  if (rel[0]) tokens.push('P');
  if (rel[1]) tokens.push('V2');
  if (rel[2]) tokens.push('V3');
  if (rel[3]) tokens.push('T');
  if (rel[4]) tokens.push('M2');
  if (rel[5]) tokens.push('M3');
  return tokens.join(' ');
}

export function parseReleases(str?: string): MemberReleases | undefined {
  if (!str) return undefined;
  const s = str.trim().toUpperCase();
  if (!s || s === 'NONE' || s === 'NO' || s === 'FIXED' || s === 'RIGID') return undefined;
  if (s === 'PIN' || s === 'PINNED' || s === 'HINGE') {
    return [false, false, false, false, true, true];
  }
  const tokens = new Set(s.split(/[\s,;|+]+/).map((t) => t.trim().toUpperCase()));
  const rel: MemberReleases = [
    tokens.has('P') || tokens.has('U1') || tokens.has('AXIAL'),
    tokens.has('V2') || tokens.has('U2'),
    tokens.has('V3') || tokens.has('U3'),
    tokens.has('T') || tokens.has('R1') || tokens.has('TORSION'),
    tokens.has('M2') || tokens.has('R2'),
    tokens.has('M3') || tokens.has('R3'),
  ];
  return rel.some(Boolean) ? rel : undefined;
}

export interface Frame {
  id: number;
  i: number;
  j: number;
  material: string;
  section: string;
  beta: number; // degrees, rotation of local 2-3 about local 1
  relI?: MemberReleases; // false = rigid/continuous, true = released
  relJ?: MemberReleases;
}

export type AreaDistribution = 'two-way' | 'one-way';

export interface Area {
  id: number;
  joints: number[];
  distribution: AreaDistribution;
}

/** Load direction: global axes, gravity (−Z, positive = downward) or local member axes. */
export type LoadDir = 'GX' | 'GY' | 'GZ' | 'GRAV' | 'L1' | 'L2' | 'L3';
export const LOAD_DIRS: LoadDir[] = ['GRAV', 'GX', 'GY', 'GZ', 'L1', 'L2', 'L3'];
export const LOAD_DIR_LABEL: Record<LoadDir, string> = {
  GRAV: 'Gravity (−Z)',
  GX: 'Global X',
  GY: 'Global Y',
  GZ: 'Global Z',
  L1: 'Local 1',
  L2: 'Local 2',
  L3: 'Local 3',
};

export type LoadCaseType = 'Dead' | 'Live' | 'Other';
export const LOAD_CASE_TYPES: LoadCaseType[] = ['Dead', 'Live', 'Other'];

/** A named set of loads, analyzed on its own. Self weight goes into the first 'Dead' case. */
export interface LoadCase {
  name: string;
  type: LoadCaseType;
}

/** Linear combination of load case results. */
export interface LoadCombo {
  name: string;
  factors: { case: string; factor: number }[];
}

export interface JointLoad {
  case: string;
  joint: number;
  f: [number, number, number, number, number, number]; // Fx Fy Fz Mx My Mz
}

export interface FramePointLoad {
  case: string;
  frame: number;
  dir: LoadDir;
  P: number; // kN
  rd: number; // relative distance from end i (0..1)
}

export interface FrameUniformLoad {
  case: string;
  frame: number;
  dir: LoadDir;
  w: number; // kN/m
}

export interface AreaLoad {
  case: string;
  area: number;
  q: number; // kN/m², gravity, positive downward
}

export interface ModelData {
  settings: Settings;
  materials: Material[];
  sections: Section[];
  supportTypes: SupportType[];
  joints: Joint[];
  frames: Frame[];
  areas: Area[];
  loadCases: LoadCase[];
  loadCombos: LoadCombo[];
  jointLoads: JointLoad[];
  framePointLoads: FramePointLoad[];
  frameUniformLoads: FrameUniformLoad[];
  areaLoads: AreaLoad[];
}

export const FREE: Restraint = [false, false, false, false, false, false];
export const FIXED: Restraint = [true, true, true, true, true, true];
export const PINNED: Restraint = [true, true, true, false, false, false];
export const ROLLER_Z: Restraint = [false, false, true, false, false, false];

export const DOF_NAMES = ['UX', 'UY', 'UZ', 'RX', 'RY', 'RZ'];

export function defaultModel(): ModelData {
  return {
    settings: { gridSpacing: 1, gridLines: 10, workPlane: 'XY', elevation: 0, selfWeight: true },
    materials: [
      { name: 'STEEL', E: 2.0e8, nu: 0.3, gamma: 76.98 },
      { name: 'C30', E: 2.5743e7, nu: 0.2, gamma: 23.56 },
    ],
    sections: [
      { name: 'R300x500', shape: 'rect', dims: [0.5, 0.3] },
      { name: 'IWF300', shape: 'I', dims: [0.3, 0.15, 0.009, 0.0065] },
      { name: 'PIPE168', shape: 'pipe', dims: [0.1683, 0.0071] },
    ],
    supportTypes: [
      { name: 'Fixed', r: [...FIXED] as Restraint },
      { name: 'Pinned', r: [...PINNED] as Restraint },
      { name: 'Roller Z', r: [...ROLLER_Z] as Restraint },
      { name: 'Free', r: [...FREE] as Restraint },
    ],
    joints: [],
    frames: [],
    areas: [],
    loadCases: defaultLoadCases(),
    loadCombos: defaultLoadCombos(),
    jointLoads: [],
    framePointLoads: [],
    frameUniformLoads: [],
    areaLoads: [],
  };
}

export const DEAD = 'DEAD';
export const LIVE = 'LIVE';

export function defaultLoadCases(): LoadCase[] {
  return [
    { name: DEAD, type: 'Dead' },
    { name: LIVE, type: 'Live' },
  ];
}

export function defaultLoadCombos(): LoadCombo[] {
  return [
    {
      name: 'COMBO1',
      factors: [
        { case: DEAD, factor: 1.2 },
        { case: LIVE, factor: 1.6 },
      ],
    },
  ];
}

/**
 * Bring older or partial model data up to date in place: models saved before load cases existed get the
 * default cases and combo, and loads without a case (or with an unknown one) go to the first case.
 */
export function migrateModel(d: ModelData): ModelData {
  if (!Array.isArray(d.loadCases) || d.loadCases.length === 0) d.loadCases = defaultLoadCases();
  if (!Array.isArray(d.loadCombos)) d.loadCombos = defaultLoadCombos();
  const names = new Set(d.loadCases.map((c) => c.name));
  const first = d.loadCases[0].name;
  for (const list of [d.jointLoads, d.framePointLoads, d.frameUniformLoads, d.areaLoads] as { case?: string }[][])
    for (const l of list ?? []) if (!l.case || !names.has(l.case)) l.case = first;
  for (const c of d.loadCombos) c.factors = (c.factors ?? []).filter((f) => names.has(f.case) && Number.isFinite(f.factor));
  return d;
}
