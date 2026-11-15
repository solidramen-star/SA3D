import {
  defaultModel,
  FREE,
  migrateModel,
  type Area,
  type Frame,
  type Joint,
  type ModelData,
  type Restraint,
} from './types';

export type Listener = (reason: string) => void;

const COORD_TOL = 1e-6;

/** Model store with snapshot-based undo/redo. All mutations go through `commit`. */
export class Model {
  data: ModelData;
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private listeners = new Set<Listener>();
  private batchDepth = 0;
  readonly maxUndo = 100;

  constructor(data?: ModelData) {
    this.data = migrateModel(data ?? defaultModel());
  }

  onChange(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(reason: string): void {
    for (const l of this.listeners) l(reason);
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Run a mutation as one undoable step. */
  commit<T>(label: string, fn: (d: ModelData) => T): T {
    if (this.batchDepth > 0) return fn(this.data);
    const before = JSON.stringify(this.data);
    this.batchDepth++;
    let out: T;
    try {
      out = fn(this.data);
    } catch (e) {
      this.data = JSON.parse(before);
      throw e;
    } finally {
      this.batchDepth--;
    }
    if (JSON.stringify(this.data) !== before) {
      this.undoStack.push(before);
      if (this.undoStack.length > this.maxUndo) this.undoStack.shift();
      this.redoStack = [];
      this.emit(label);
    }
    return out;
  }

  undo(): void {
    const s = this.undoStack.pop();
    if (!s) return;
    this.redoStack.push(JSON.stringify(this.data));
    this.data = JSON.parse(s);
    this.emit('undo');
  }

  redo(): void {
    const s = this.redoStack.pop();
    if (!s) return;
    this.undoStack.push(JSON.stringify(this.data));
    this.data = JSON.parse(s);
    this.emit('redo');
  }

  /** Replace the whole model (new/open). Clears history. */
  load(data: ModelData): void {
    this.data = migrateModel(data);
    this.undoStack = [];
    this.redoStack = [];
    this.emit('load');
  }

  // ---------- lookups ----------
  joint(id: number): Joint | undefined {
    return this.data.joints.find((j) => j.id === id);
  }
  frame(id: number): Frame | undefined {
    return this.data.frames.find((f) => f.id === id);
  }
  area(id: number): Area | undefined {
    return this.data.areas.find((a) => a.id === id);
  }
  jointMap(): Map<number, Joint> {
    return new Map(this.data.joints.map((j) => [j.id, j]));
  }
  frameLength(f: Frame): number {
    const a = this.joint(f.i);
    const b = this.joint(f.j);
    if (!a || !b) return 0;
    return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
  }

  private nextId(list: { id: number }[]): number {
    let m = 0;
    for (const o of list) if (o.id > m) m = o.id;
    return m + 1;
  }

  findJointAt(x: number, y: number, z: number): Joint | undefined {
    return this.data.joints.find(
      (j) => Math.abs(j.x - x) < COORD_TOL && Math.abs(j.y - y) < COORD_TOL && Math.abs(j.z - z) < COORD_TOL,
    );
  }

  // ---------- creation ----------
  addJoint(x: number, y: number, z: number): number {
    const r = (v: number) => Math.round(v * 1e9) / 1e9;
    x = r(x);
    y = r(y);
    z = r(z);
    const existing = this.findJointAt(x, y, z);
    if (existing) return existing.id;
    return this.commit('add joint', (d) => {
      const id = this.nextId(d.joints);
      d.joints.push({ id, x, y, z, r: [...FREE] as Restraint });
      return id;
    });
  }

  addFrame(i: number, j: number): number | null {
    if (i === j || !this.joint(i) || !this.joint(j)) return null;
    const dup = this.data.frames.find((f) => (f.i === i && f.j === j) || (f.i === j && f.j === i));
    if (dup) return dup.id;
    return this.commit('add frame', (d) => {
      const id = this.nextId(d.frames);
      d.frames.push({
        id,
        i,
        j,
        material: d.materials[0]?.name ?? '',
        section: d.sections[0]?.name ?? '',
        beta: 0,
      });
      return id;
    });
  }

  addArea(joints: number[]): number | null {
    const uniq = joints.filter((v, k) => joints.indexOf(v) === k);
    if (uniq.length < 3) return null;
    return this.commit('add area', (d) => {
      const id = this.nextId(d.areas);
      d.areas.push({ id, joints: uniq, distribution: 'two-way' });
      return id;
    });
  }

  // ---------- deletion ----------
  deleteObjects(joints: number[], frames: number[], areas: number[]): void {
    const js = new Set(joints);
    const fs = new Set(frames);
    const as = new Set(areas);
    this.commit('delete', (d) => {
      for (const f of d.frames) if (js.has(f.i) || js.has(f.j)) fs.add(f.id);
      for (const a of d.areas) if (a.joints.some((j) => js.has(j))) as.add(a.id);
      d.joints = d.joints.filter((j) => !js.has(j.id));
      d.frames = d.frames.filter((f) => !fs.has(f.id));
      d.areas = d.areas.filter((a) => !as.has(a.id));
      d.jointLoads = d.jointLoads.filter((l) => !js.has(l.joint));
      d.framePointLoads = d.framePointLoads.filter((l) => !fs.has(l.frame));
      d.frameUniformLoads = d.frameUniformLoads.filter((l) => !fs.has(l.frame));
      d.areaLoads = d.areaLoads.filter((l) => !as.has(l.area));
    });
  }

  /** Joints referenced by the given frames/areas plus the explicit joints. */
  jointsOf(joints: number[], frames: number[], areas: number[]): Set<number> {
    const s = new Set(joints);
    for (const id of frames) {
      const f = this.frame(id);
      if (f) {
        s.add(f.i);
        s.add(f.j);
      }
    }
    for (const id of areas) this.area(id)?.joints.forEach((j) => s.add(j));
    return s;
  }

  moveJoints(ids: Set<number>, dx: number, dy: number, dz: number): string | null {
    const moved = this.data.joints.filter((j) => ids.has(j.id));
    for (const j of moved) {
      const other = this.findJointAt(j.x + dx, j.y + dy, j.z + dz);
      if (other && !ids.has(other.id)) return `Joint ${j.id} would overlap joint ${other.id}`;
    }
    this.commit('move', () => {
      for (const j of moved) {
        j.x += dx;
        j.y += dy;
        j.z += dz;
      }
    });
    return null;
  }

  /** Copy selected frames/areas (and their joints, plus explicitly selected joints) n times by (dx,dy,dz). */
  replicate(joints: number[], frames: number[], areas: number[], dx: number, dy: number, dz: number, n: number) {
    const created = { joints: [] as number[], frames: [] as number[], areas: [] as number[] };
    this.commit('replicate', (d) => {
      const allJ = this.jointsOf(joints, frames, areas);
      for (let k = 1; k <= n; k++) {
        const map = new Map<number, number>();
        for (const jid of allJ) {
          const j = this.joint(jid)!;
          const nid = this.addJoint(j.x + dx * k, j.y + dy * k, j.z + dz * k);
          const nj = this.joint(nid)!;
          nj.r = [...j.r] as Restraint;
          map.set(jid, nid);
          created.joints.push(nid);
        }
        for (const fid of frames) {
          const f = this.frame(fid)!;
          const nid = this.addFrame(map.get(f.i)!, map.get(f.j)!);
          if (nid != null) {
            const nf = this.frame(nid)!;
            nf.material = f.material;
            nf.section = f.section;
            nf.beta = f.beta;
            created.frames.push(nid);
            for (const l of d.framePointLoads.filter((l) => l.frame === fid)) d.framePointLoads.push({ ...l, frame: nid });
            for (const l of d.frameUniformLoads.filter((l) => l.frame === fid)) d.frameUniformLoads.push({ ...l, frame: nid });
          }
        }
        for (const aid of areas) {
          const a = this.area(aid)!;
          const nid = this.addArea(a.joints.map((j) => map.get(j)!));
          if (nid != null) {
            this.area(nid)!.distribution = a.distribution;
            created.areas.push(nid);
            for (const l of d.areaLoads.filter((l) => l.area === aid)) d.areaLoads.push({ ...l, area: nid });
          }
        }
        for (const jid of joints) {
          for (const jl of d.jointLoads.filter((l) => l.joint === jid))
            d.jointLoads.push({ ...jl, joint: map.get(jid)!, f: [...jl.f] as typeof jl.f });
        }
      }
    });
    return created;
  }

  /** Split a frame at its midpoint/relative distance; returns new joint id. */
  divideFrame(id: number, parts: number): void {
    const f = this.frame(id);
    if (!f || parts < 2) return;
    this.commit('divide frame', (d) => {
      const a = this.joint(f.i)!;
      const b = this.joint(f.j)!;
      const ids = [f.i];
      for (let k = 1; k < parts; k++) {
        const t = k / parts;
        ids.push(this.addJoint(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t));
      }
      ids.push(f.j);
      const uniform = d.frameUniformLoads.filter((l) => l.frame === id);
      d.frames = d.frames.filter((x) => x.id !== id);
      d.frameUniformLoads = d.frameUniformLoads.filter((l) => l.frame !== id);
      const points = d.framePointLoads.filter((l) => l.frame === id);
      d.framePointLoads = d.framePointLoads.filter((l) => l.frame !== id);
      const newIds: number[] = [];
      for (let k = 0; k < parts; k++) {
        const nid = this.addFrame(ids[k], ids[k + 1])!;
        const nf = this.frame(nid)!;
        nf.material = f.material;
        nf.section = f.section;
        nf.beta = f.beta;
        newIds.push(nid);
        for (const u of uniform) d.frameUniformLoads.push({ ...u, frame: nid });
      }
      for (const p of points) {
        const pos = p.rd * parts;
        const k = Math.min(Math.floor(pos), parts - 1);
        d.framePointLoads.push({ ...p, frame: newIds[k], rd: pos - k });
      }
    });
  }
}
