import { describe, expect, it } from 'vitest';
import { Model } from '../src/model/model';
import { sectionProps, validateSection } from '../src/model/sections';

const close = (a: number, b: number, rel = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(Math.abs(b) * rel + 1e-15);

describe('section properties', () => {
  it('circle and pipe', () => {
    const c = sectionProps({ name: 'c', shape: 'circle', dims: [0.2] });
    close(c.A, (Math.PI * 0.2 ** 2) / 4);
    close(c.I33, (Math.PI * 0.2 ** 4) / 64);
    close(c.J, (Math.PI * 0.2 ** 4) / 32);
    const p = sectionProps({ name: 'p', shape: 'pipe', dims: [0.2, 0.01] });
    close(p.A, (Math.PI * (0.2 ** 2 - 0.18 ** 2)) / 4);
    close(p.I22, p.I33);
  });
  it('box', () => {
    const b = sectionProps({ name: 'b', shape: 'box', dims: [0.4, 0.2, 0.02, 0.01] });
    close(b.A, 0.4 * 0.2 - 0.36 * 0.18);
    close(b.I33, (0.2 * 0.4 ** 3 - 0.18 * 0.36 ** 3) / 12);
  });
  it('general uses given values', () => {
    const g = sectionProps({ name: 'g', shape: 'general', dims: [1, 2, 3, 4] });
    expect([g.A, g.I33, g.I22, g.J]).toEqual([1, 2, 3, 4]);
  });
  it('validation catches bad dimensions', () => {
    expect(validateSection({ name: 'x', shape: 'rect', dims: [0.5, -1] })).not.toBeNull();
    expect(validateSection({ name: 'x', shape: 'I', dims: [0.3, 0.15, 0.2, 0.01] })).not.toBeNull();
    expect(validateSection({ name: 'x', shape: 'rect', dims: [0.5, 0.3] })).toBeNull();
  });
});

describe('Model editing and undo', () => {
  it('reuses coincident joints and deduplicates frames', () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    const b = m.addJoint(3, 0, 0);
    expect(m.addJoint(0, 0, 0)).toBe(a);
    const f = m.addFrame(a, b)!;
    expect(m.addFrame(b, a)).toBe(f);
    expect(m.addFrame(a, a)).toBeNull();
  });

  it('undo and redo restore snapshots', () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    const b = m.addJoint(1, 0, 0);
    m.addFrame(a, b);
    expect(m.data.frames.length).toBe(1);
    m.undo();
    expect(m.data.frames.length).toBe(0);
    m.undo();
    expect(m.data.joints.length).toBe(1);
    m.redo();
    m.redo();
    expect(m.data.frames.length).toBe(1);
    expect(m.canRedo).toBe(false);
  });

  it('delete cascades to frames, areas and loads', () => {
    const m = new Model();
    const ids = [m.addJoint(0, 0, 0), m.addJoint(1, 0, 0), m.addJoint(1, 1, 0)];
    const f = m.addFrame(ids[0], ids[1])!;
    const ar = m.addArea(ids)!;
    m.commit('loads', (d) => {
      d.frameUniformLoads.push({ case: 'DEAD', frame: f, dir: 'GRAV', w: 1 });
      d.areaLoads.push({ case: 'DEAD', area: ar, q: 2 });
      d.jointLoads.push({ case: 'DEAD', joint: ids[0], f: [1, 0, 0, 0, 0, 0] });
    });
    m.deleteObjects([ids[0]], [], []);
    expect(m.data.frames.length).toBe(0);
    expect(m.data.areas.length).toBe(0);
    expect(m.data.frameUniformLoads.length + m.data.areaLoads.length + m.data.jointLoads.length).toBe(0);
    m.undo();
    expect(m.data.areas.length).toBe(1);
  });

  it('replicate copies frames, properties and loads as one undo step', () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    const b = m.addJoint(0, 0, 3);
    const f = m.addFrame(a, b)!;
    m.commit('sec', (d) => {
      d.frames[0].section = 'IWF300';
      d.frameUniformLoads.push({ case: 'DEAD', frame: f, dir: 'GX', w: 2 });
    });
    m.replicate([], [f], [], 5, 0, 0, 3);
    expect(m.data.frames.length).toBe(4);
    expect(m.data.frames.every((x) => x.section === 'IWF300')).toBe(true);
    expect(m.data.frameUniformLoads.length).toBe(4);
    m.undo();
    expect(m.data.frames.length).toBe(1);
  });

  it('replicate copies end releases as independent arrays', () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    const b = m.addJoint(4, 0, 0);
    const f = m.addFrame(a, b)!;
    m.commit('rel', (d) => {
      d.frames[0].relI = [false, false, false, false, true, true];
      d.frames[0].relJ = [false, false, false, false, false, true];
    });
    const created = m.replicate([], [f], [], 0, 5, 0, 2);
    expect(created.frames.length).toBe(2);
    for (const id of created.frames) {
      const nf = m.frame(id)!;
      expect(nf.relI).toEqual([false, false, false, false, true, true]);
      expect(nf.relJ).toEqual([false, false, false, false, false, true]);
      expect(nf.relI).not.toBe(m.frame(f)!.relI);
    }
  });

  it('divide frame keeps loads at the right place', () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    const b = m.addJoint(4, 0, 0);
    const f = m.addFrame(a, b)!;
    m.commit('l', (d) => d.framePointLoads.push({ case: 'DEAD', frame: f, dir: 'GRAV', P: 1, rd: 0.75 }));
    m.divideFrame(f, 2);
    expect(m.data.frames.length).toBe(2);
    expect(m.data.joints.length).toBe(3);
    const pl = m.data.framePointLoads[0];
    const fr = m.frame(pl.frame)!;
    const ji = m.joint(fr.i)!;
    expect(ji.x + pl.rd * 2).toBeCloseTo(3);
  });

  it('move refuses to overlap other joints', () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    m.addJoint(1, 0, 0);
    expect(m.moveJoints(new Set([a]), 1, 0, 0)).not.toBeNull();
    expect(m.moveJoints(new Set([a]), 0, 2, 0)).toBeNull();
    expect(m.joint(a)!.y).toBe(2);
  });
});

describe('channel sections', () => {
  it('UNP area, strong axis inertia and centroid offset', () => {
    const [d, bf, tf, tw] = [0.2, 0.075, 0.0115, 0.0085];
    const p = sectionProps({ name: 'U', shape: 'unp', dims: [d, bf, tf, tw] });
    close(p.A, 2 * bf * tf + (d - 2 * tf) * tw);
    close(p.I33, (bf * d ** 3 - (bf - tw) * (d - 2 * tf) ** 3) / 12);
    expect(p.I22).toBeGreaterThan(0);
    expect(p.I22).toBeLessThan(p.I33);
    expect(validateSection({ name: 'U', shape: 'unp', dims: [d, bf, tf, tw] })).toBeNull();
  });
  it('lipped C area and strong axis inertia', () => {
    const [h, b, c, t] = [0.15, 0.065, 0.02, 0.0023];
    const p = sectionProps({ name: 'C', shape: 'C', dims: [h, b, c, t] });
    close(p.A, t * h + 2 * (b - t) * t + 2 * (c - t) * t);
    const flange = (b - t) * t;
    const lip = (c - t) * t;
    const Iexp =
      (t * h ** 3) / 12 +
      2 * ((b - t) * t ** 3 / 12 + flange * (h / 2 - t / 2) ** 2) +
      2 * ((t * (c - t) ** 3) / 12 + lip * (h / 2 - t - (c - t) / 2) ** 2);
    close(p.I33, Iexp, 1e-9);
  });
});