import { describe, expect, it } from 'vitest';
import { Model } from '../src/model/model';
import { frameCrossing } from '../src/model/snap';

const J = (x: number, y: number, z: number) => ({ id: 0, x, y, z });

describe('frame splitting', () => {
  it('splitFrameAt keeps properties, outer releases and remaps loads in one undo step', () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    const b = m.addJoint(4, 0, 0);
    const f = m.addFrame(a, b)!;
    m.commit('props', (d) => {
      const fr = d.frames[0];
      fr.beta = 30;
      fr.relI = [false, false, false, false, true, true];
      fr.relJ = [false, false, false, true, false, false];
      d.frameUniformLoads.push({ case: 'DEAD', frame: f, dir: 'GRAV', w: 2 });
      d.framePointLoads.push({ case: 'DEAD', frame: f, dir: 'GRAV', P: 5, rd: 0.75 });
    });
    const res = m.splitFrameAt(f, [0.5])!;
    expect(res.frames.length).toBe(2);
    expect(m.joint(res.joints[0])).toMatchObject({ x: 2, y: 0, z: 0 });
    const [p1, p2] = res.frames.map((id) => m.frame(id)!);
    expect([p1.i, p1.j, p2.i, p2.j]).toEqual([a, res.joints[0], res.joints[0], b]);
    expect(p1.beta).toBe(30);
    expect(p1.relI).toEqual([false, false, false, false, true, true]);
    expect(p1.relJ).toBeUndefined();
    expect(p2.relI).toBeUndefined();
    expect(p2.relJ).toEqual([false, false, false, true, false, false]);
    expect(m.data.frameUniformLoads.map((l) => l.frame)).toEqual(res.frames);
    expect(m.data.framePointLoads).toEqual([{ case: 'DEAD', frame: p2.id, dir: 'GRAV', P: 5, rd: 0.5 }]);
    m.undo();
    expect(m.data.frames.length).toBe(1);
    expect(m.data.joints.length).toBe(2);
    expect(m.data.framePointLoads[0].rd).toBe(0.75);
  });

  it('divideFrame keeps end releases', () => {
    const m = new Model();
    const f = m.addFrame(m.addJoint(0, 0, 0), m.addJoint(3, 0, 0))!;
    m.commit('rel', (d) => (d.frames[0].relJ = [false, false, false, false, true, true]));
    m.divideFrame(f, 3);
    expect(m.data.frames.length).toBe(3);
    expect(m.data.frames.filter((x) => x.relJ).length).toBe(1);
    expect(m.data.frames.find((x) => x.relJ)!.j).toBe(2);
  });

  it('ignores cuts at the ends', () => {
    const m = new Model();
    const f = m.addFrame(m.addJoint(0, 0, 0), m.addJoint(1, 0, 0))!;
    expect(m.splitFrameAt(f, [0, 1, 1e-12])).toBeNull();
    expect(m.data.frames.length).toBe(1);
  });
});

describe('frame crossing', () => {
  it('finds the crossing of two frames', () => {
    const c = frameCrossing(J(0, 0, 0), J(4, 0, 0), J(1, -1, 0), J(1, 3, 0))!;
    expect(c.x).toBeCloseTo(1, 12);
    expect(c.y).toBeCloseTo(0, 12);
    expect(c.ta).toBeCloseTo(0.25, 12);
    expect(c.tb).toBeCloseTo(0.25, 12);
  });
  it('rejects skew lines, parallel lines and touching ends', () => {
    expect(frameCrossing(J(0, 0, 0), J(4, 0, 0), J(1, -1, 1), J(1, 3, 1))).toBeNull();
    expect(frameCrossing(J(0, 0, 0), J(4, 0, 0), J(0, 1, 0), J(4, 1, 0))).toBeNull();
    expect(frameCrossing(J(0, 0, 0), J(4, 0, 0), J(4, 0, 0), J(4, 3, 0))).toBeNull();
    expect(frameCrossing(J(0, 0, 0), J(4, 0, 0), J(2, 0, 0), J(2, 3, 0))).toBeNull();
  });
});
