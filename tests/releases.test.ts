import { describe, expect, it } from 'vitest';
import {
  defaultModel,
  FIXED,
  releaseMechanismError,
  TRUSS_RELEASES_I,
  TRUSS_RELEASES_J,
  type MemberReleases, type ModelData, type Restraint } from '../src/model/types';
import { analyze } from '../src/solver/analyze';
import { condenseStiffness, localStiffness, solveDenseLinearSystem } from '../src/solver/frame3d';
import { readSav, writeSav } from '../src/io/savFormat';

const E = 2e8; // kN/m²
const A = 0.01; // m²
const I33 = 2e-4; // m⁴
const I22 = 1e-4; // m⁴
const J = 5e-5; // m⁴

function base(): ModelData {
  const m = defaultModel();
  m.materials = [{ name: 'Steel', E, nu: 0.3, gamma: 0 }];
  m.sections = [{ name: 'BeamSec', shape: 'general', dims: [A, I33, I22, J] }];
  return m;
}

function joint(m: ModelData, id: number, x: number, y: number, z: number, r: Restraint = [false, false, false, false, false, false]) {
  m.joints.push({ id, x, y, z, r });
}

function frame(
  m: ModelData,
  id: number,
  i: number,
  j: number,
  relI?: MemberReleases,
  relJ?: MemberReleases,
) {
  m.frames.push({ id, i, j, material: 'Steel', section: 'BeamSec', beta: 0, relI, relJ });
}

const close = (a: number, b: number, rel = 1e-5, abs = 1e-7) =>
  expect(Math.abs(a - b)).toBeLessThanOrEqual(Math.abs(b) * rel + abs);

describe('Member End Releases & Static Condensation', () => {
  it('solves small dense systems with partial pivoting', () => {
    const A = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2],
    ];
    const B = [
      [8],
      [-11],
      [-3],
    ];
    const X = solveDenseLinearSystem(A, B);
    expect(X).not.toBeNull();
    close(X![0][0], 2);
    close(X![1][0], 3);
    close(X![2][0], -1);
  });

  it('detects singular matrices in static condensation', () => {
    const L = 3;
    const G = E / (2 * 1.3);
    const kl = localStiffness(E, G, A, I22, I33, J, L);
    // Releasing axial at both ends is singular
    const bothP: MemberReleases = [true, false, false, false, false, false];
    expect(condenseStiffness(kl, bothP, bothP)).toBeNull();

    // Releasing torsion at both ends is singular
    const bothT: MemberReleases = [false, false, false, true, false, false];
    expect(condenseStiffness(kl, bothT, bothT)).toBeNull();
  });

  it('beam with both ends moment-released (M3 pin-pin) under uniform gravity load', () => {
    const m = base();
    const L = 6;
    const w = 10; // kN/m
    // Fixed supports at joints 1 and 2
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0, [...FIXED] as Restraint);
    // Frame with M3 moment releases at both ends (local 3 bending)
    const pinM3: MemberReleases = [false, false, false, false, false, true];
    frame(m, 1, 1, 2, pinM3, pinM3);
    m.frameUniformLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', w });

    const r = analyze(m);
    const fr = r.frames[0];

    // End moments in local axes should be zero
    close(fr.M3[0], 0, 1e-5, 1e-9);
    close(fr.M3[fr.M3.length - 1], 0, 1e-5, 1e-9);

    // Midspan moment must equal w * L^2 / 8 = 10 * 36 / 8 = 45 kN·m
    const midIdx = fr.x.findIndex((x) => Math.abs(x - L / 2) < 1e-9);
    expect(midIdx).toBeGreaterThan(0);
    close(fr.M3[midIdx], (w * L ** 2) / 8);

    // Support vertical reactions should be w * L / 2 = 30 kN each
    close(r.reactions[1][2], (w * L) / 2);
    close(r.reactions[2][2], (w * L) / 2);

    // Moment reaction at supports about Y (global bending) should be zero!
    close(r.reactions[1][4], 0, 1e-5, 1e-9);
    close(r.reactions[2][4], 0, 1e-5, 1e-9);
  });

  it('beam with center point load and pin-pin releases: M_max = PL/4, δ_max = PL³/48EI', () => {
    const m = base();
    const L = 4;
    const P = 24; // kN
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0, [...FIXED] as Restraint);
    const pin: MemberReleases = [false, false, false, false, true, true]; // M2 & M3
    frame(m, 1, 1, 2, pin, pin);
    m.framePointLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', P, rd: 0.5 });

    const r = analyze(m);
    const fr = r.frames[0];

    // End moments 0
    close(fr.M3[0], 0, 1e-5, 1e-9);
    close(fr.M3[fr.M3.length - 1], 0, 1e-5, 1e-9);

    // Midspan moment PL/4 = 24 * 4 / 4 = 24 kN·m
    const midIdx = fr.x.findIndex((x) => Math.abs(x - L / 2) < 1e-9);
    close(fr.M3[midIdx], (P * L) / 4);

    // Midspan deflection δ = PL^3 / (48 E I33)
    const expectedDefl = (P * L ** 3) / (48 * E * I33);
    const midDisp = Math.abs(fr.disp[midIdx][2]);
    close(midDisp, expectedDefl, 1e-3);
  });

  it('propped cantilever with UDL: End I fixed, End J moment-released (M = -wL²/8)', () => {
    const m = base();
    const L = 8;
    const w = 15; // kN/m
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0, [...FIXED] as Restraint);
    const relJ: MemberReleases = [false, false, false, false, false, true]; // M3 released at J
    frame(m, 1, 1, 2, undefined, relJ);
    m.frameUniformLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', w });

    const r = analyze(m);
    const fr = r.frames[0];

    // Moment at I: -w L^2 / 8 = -15 * 64 / 8 = -120 kN·m
    close(Math.abs(fr.M3[0]), (w * L ** 2) / 8);

    // Moment at J: 0
    close(fr.M3[fr.M3.length - 1], 0, 1e-5, 1e-9);

    // Reactions: V_I = 5/8 wL, V_J = 3/8 wL
    close(r.reactions[1][2], (5 / 8) * w * L);
    close(r.reactions[2][2], (3 / 8) * w * L);
  });

  it('triangular truss benchmark (method of joints): pure axial forces, zero bending', () => {
    // 3-joint triangular truss:
    // Joint 1: (0, 0, 0) pinned
    // Joint 2: (4, 0, 0) roller (UX free, UY, UZ fixed)
    // Joint 3: (2, 0, 2) top apex, loaded with 20 kN downward (-Z)
    const m = base();
    // Joint 1: pinned support (restrain translations X, Y, Z and rotations to avoid free node spinning)
    joint(m, 1, 0, 0, 0, [true, true, true, true, true, true]);
    // Joint 2: roller support (UX free, UY, UZ restrained, rotations restrained)
    joint(m, 2, 4, 0, 0, [false, true, true, true, true, true]);
    // Joint 3: apex in X-Z plane (restrain out-of-plane UY, and rotations RX, RY, RZ for ideal pin joint)
    joint(m, 3, 2, 0, 2, [false, true, false, true, true, true]);

    const pin: MemberReleases = [false, false, false, false, true, true]; // M2, M3
    frame(m, 1, 1, 2, pin, pin); // bottom chord: L = 4
    frame(m, 2, 1, 3, pin, pin); // left diagonal: span dx=2, dz=2, L = 2*sqrt(2)
    frame(m, 3, 3, 2, pin, pin); // right diagonal: span dx=2, dz=-2, L = 2*sqrt(2)

    // Applied load at apex (joint 3) = 20 kN downward (-Z)
    m.jointLoads.push({ case: 'DEAD', joint: 3, f: [0, 0, -20, 0, 0, 0] });

    const r = analyze(m);

    // Theoretical truss analysis:
    // Reactions at 1 and 2: R1z = 10 kN, R2z = 10 kN. R1x = 0.
    close(r.reactions[1][2], 10);
    close(r.reactions[2][2], 10);

    // Left diagonal (frame 2):
    // Sin(45°) = 1/sqrt(2). Axial force F * sin(45°) = 10 kN => F = 10 * sqrt(2) ≈ 14.1421 kN compression (-14.1421)
    const diagForce = 10 * Math.SQRT2;
    // Positive P = tension, negative P = compression
    close(r.frames[1].P[0], -diagForce);
    close(r.frames[2].P[0], -diagForce);

    // Bottom chord (frame 1):
    // Equilibrium at joint 1: F_bottom = F_diag * cos(45°) = 10 kN tension (+10)
    close(r.frames[0].P[0], 10);

    // All bending moments throughout all members must be zero!
    for (const fr of r.frames) {
      for (const m of fr.M3) close(m, 0, 1e-4, 1e-7);
      for (const m of fr.M2) close(m, 0, 1e-4, 1e-7);
    }
  });

  it('serializes and deserializes member releases in .sav format with backward compatibility', () => {
    const m = base();
    joint(m, 1, 0, 0, 0);
    joint(m, 2, 5, 0, 0);
    const pin: MemberReleases = [false, false, false, false, true, true];
    frame(m, 1, 1, 2, pin, undefined);

    const text = writeSav(m);
    expect(text).toContain('TABLE,FRAMES');
    expect(text).toContain('Rel_I');
    expect(text).toContain('Rel_J');
    expect(text).toContain('M2 M3');

    const m2 = readSav(text);
    expect(m2.frames[0].relI).toEqual([false, false, false, false, true, true]);
    expect(m2.frames[0].relJ).toBeUndefined();

    // Test backward compatibility: old .sav without Rel_I / Rel_J columns
    const oldSav = `TABLE,PROGRAM
Name,Version,Units
StructApp3D,1.0.0,"kN, m, C"

TABLE,MATERIALS
Name,E (kN/m2),Poisson,UnitWeight (kN/m3)
M,200000000,0.3,0

TABLE,SECTIONS
Name,Shape,Dim1,Dim2,Dim3,Dim4,A (m2),I33 (m4),I22 (m4),J (m4)
S,general,0.01,0.0002,0.0001,0.00005,0.01,0.0002,0.0001,0.00005

TABLE,JOINTS
ID,X (m),Y (m),Z (m)
1,0,0,0
2,4,0,0

TABLE,FRAMES
ID,JointI,JointJ,Material,Section,Beta (deg),Length (m)
1,1,2,M,S,0,4
`;
    const mOld = readSav(oldSav);
    expect(mOld.frames.length).toBe(1);
    expect(mOld.frames[0].relI).toBeUndefined();
    expect(mOld.frames[0].relJ).toBeUndefined();
  });
});

describe('Release review fixes (v1.1.7)', () => {
  const PIN_XYZ: Restraint = [true, true, true, false, false, false];

  function planarTruss(rollerUX: boolean): ModelData {
    // Same triangle as the benchmark above, but with ideal pins: joint rotations are NOT restrained
    const m = base();
    joint(m, 1, 0, 0, 0, [...PIN_XYZ] as Restraint);
    joint(m, 2, 4, 0, 0, rollerUX ? [false, true, true, false, false, false] : [false, true, false, false, false, false]);
    joint(m, 3, 2, 0, 2, [false, true, false, false, false, false]);
    frame(m, 1, 1, 2, TRUSS_RELEASES_I, TRUSS_RELEASES_J);
    frame(m, 2, 1, 3, TRUSS_RELEASES_I, TRUSS_RELEASES_J);
    frame(m, 3, 3, 2, TRUSS_RELEASES_I, TRUSS_RELEASES_J);
    m.jointLoads.push({ case: 'DEAD', joint: 3, f: [0, 0, -20, 0, 0, 0] });
    return m;
  }

  it('truss preset releases torsion at End I only, and is a valid combination', () => {
    expect(TRUSS_RELEASES_I).toEqual([false, false, false, true, true, true]);
    expect(TRUSS_RELEASES_J).toEqual([false, false, false, false, true, true]);
    expect(releaseMechanismError(TRUSS_RELEASES_I, TRUSS_RELEASES_J)).toBeNull();
    const bothT: MemberReleases = [false, false, false, true, true, true];
    expect(releaseMechanismError(bothT, bothT)).toMatch(/T cannot be released at both ends/);
    expect(releaseMechanismError([true, true, false, false, false, false], [true, true, false, false, false, false])).toMatch(
      /P, V2 cannot/,
    );
  });

  it('pin-jointed truss solves without restraining joint rotations (auto-stabilised, with warning)', () => {
    const r = analyze(planarTruss(true));
    close(r.reactions[1][2], 10);
    close(r.reactions[2][2], 10);
    close(r.frames[1].P[0], -10 * Math.SQRT2);
    close(r.frames[2].P[0], -10 * Math.SQRT2);
    close(r.frames[0].P[0], 10);
    for (const fr of r.frames) {
      for (const v of [...fr.M2, ...fr.M3, ...fr.T]) close(v, 0, 1e-4, 1e-7);
      expect(fr.M3[0]).toBe(0);
      expect(fr.M3[fr.M3.length - 1]).toBe(0);
    }
    expect(r.warnings.some((w) => /Joint rotation not resisted/.test(w))).toBe(true);
  });

  it('skewed 3D truss (tetrapod) solves with pin releases and equilibrium holds', () => {
    const m = base();
    joint(m, 1, 0, 0, 0, [...PIN_XYZ] as Restraint);
    joint(m, 2, 5, 1, 0, [...PIN_XYZ] as Restraint);
    joint(m, 3, 1.5, 4, 0.5, [...PIN_XYZ] as Restraint);
    joint(m, 4, 2.2, 1.7, 3.1);
    frame(m, 1, 1, 4, TRUSS_RELEASES_I, TRUSS_RELEASES_J);
    frame(m, 2, 4, 2, TRUSS_RELEASES_I, TRUSS_RELEASES_J);
    frame(m, 3, 3, 4, TRUSS_RELEASES_I, TRUSS_RELEASES_J);
    const F = [7, -4, -25];
    m.jointLoads.push({ case: 'DEAD', joint: 4, f: [F[0], F[1], F[2], 0, 0, 0] });
    const r = analyze(m);
    for (let k = 0; k < 3; k++) close(r.reactions[1][k] + r.reactions[2][k] + r.reactions[3][k], -F[k], 1e-6, 1e-6);
    for (const fr of r.frames) {
      for (const v of [...fr.M2, ...fr.M3, ...fr.T, ...fr.V2, ...fr.V3]) close(v, 0, 1e-4, 1e-6);
      // constant axial force along each member
      for (const p of fr.P) close(p, fr.P[0], 1e-6, 1e-6);
    }
  });

  it('a truss missing a support is still reported as unstable', () => {
    expect(() => analyze(planarTruss(false))).toThrow(/unstable/);
  });

  it('analysis rejects P/V2/V3/T released at both ends with a clear message', () => {
    const m = base();
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, 3, 0, 0, [...FIXED] as Restraint);
    const relT: MemberReleases = [false, false, false, true, false, false];
    frame(m, 1, 1, 2, relT, relT);
    expect(() => analyze(m)).toThrow(/Frame 1: T cannot be released at both ends/);
  });

  it('.sav reader reports unknown release text and both-end mechanisms with the line number', () => {
    const m = base();
    joint(m, 1, 0, 0, 0);
    joint(m, 2, 5, 0, 0);
    frame(m, 1, 1, 2, [false, false, false, false, true, true], undefined);
    const text = writeSav(m);
    expect(() => readSav(text.replace('M2 M3', 'M2 M4'))).toThrow(/Line \d+ \(FRAMES\): unknown release 'M4'/);

    const m2 = base();
    joint(m2, 1, 0, 0, 0);
    joint(m2, 2, 5, 0, 0);
    const relP: MemberReleases = [true, false, false, false, false, false];
    frame(m2, 1, 1, 2, relP, relP);
    expect(() => readSav(writeSav(m2))).toThrow(/Line \d+ \(FRAMES\): P cannot be released at both ends/);
  });
});
