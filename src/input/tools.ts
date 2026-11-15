import * as THREE from 'three';
import type { App } from '../ui/app';
import { parseKey, selKey, type SelKey } from '../view/viewer';
import { toast } from '../ui/dom';

export type ToolName = 'select' | 'joint' | 'frame' | 'area' | 'box';

export const TOOL_HINT: Record<ToolName, string> = {
  select: 'Tap an object to select it. Drag to rotate, two fingers to pan/zoom. Long-press for options. Drag a selected joint (right-drag with a mouse) to move it.',
  joint: 'Tap the grid to place joints (snaps to grid and existing joints).',
  frame: 'Tap start and end points to draw frames; drawing continues from the last point. Tap Done to stop.',
  area: 'Tap the corner points of the area, then tap the first point again or Done to close it.',
  box: 'Drag a box: left→right selects objects fully inside, right→left selects anything touched.',
};

interface Snap {
  pos: THREE.Vector3;
  joint: number | null;
}

export class ToolController {
  tool: ToolName = 'select';
  /** Multi-select mode: taps add/remove instead of replacing the selection. */
  multi = false;
  /** Frame tool: [last joint]; area tool: joints so far. */
  chain: number[] = [];
  private hoverSnap: Snap | null = null;
  private boxEl: HTMLDivElement;

  constructor(private app: App) {
    this.boxEl = document.createElement('div');
    this.boxEl.className = 'select-box';
    this.boxEl.hidden = true;
    document.body.append(this.boxEl);
  }

  setTool(t: ToolName): void {
    this.finishChain(false);
    this.tool = t;
    this.hoverSnap = null;
    this.updateOverlay();
    this.app.onToolChanged();
  }

  private tol(e: PointerEvent | { pointerType: string }) {
    return e.pointerType === 'mouse' ? 12 : 24;
  }

  // ---------------------------------------------------------------- snapping
  snap(x: number, y: number, e: PointerEvent | { pointerType: string }): Snap | null {
    const v = this.app.viewer;
    const d = this.app.model.data;
    let best: Snap | null = null;
    let bestD = this.tol(e);
    for (const j of d.joints) {
      const s = v.jointScreen(j);
      if (s.behind) continue;
      const dist = Math.hypot(s.x - x, s.y - y);
      if (dist < bestD) {
        bestD = dist;
        best = { pos: new THREE.Vector3(j.x, j.y, j.z), joint: j.id };
      }
    }
    if (best) return best;
    const p = v.workPlanePoint(x, y);
    if (!p) return null;
    const { gridSpacing: g, workPlane, elevation } = d.settings;
    const r = (val: number) => Math.round(val / g) * g;
    if (workPlane === 'XY') p.set(r(p.x), r(p.y), elevation);
    else if (workPlane === 'XZ') p.set(r(p.x), elevation, r(p.z));
    else p.set(elevation, r(p.y), r(p.z));
    const clean = (val: number) => Math.round(val * 1e9) / 1e9;
    p.set(clean(p.x), clean(p.y), clean(p.z));
    return { pos: p, joint: null };
  }

  private jointAt(s: Snap): number {
    return s.joint ?? this.app.model.addJoint(s.pos.x, s.pos.y, s.pos.z);
  }

  // ---------------------------------------------------------------- events
  tap(x: number, y: number, e: PointerEvent): void {
    const m = this.app.model;
    switch (this.tool) {
      case 'select':
      case 'box': {
        const hit = this.app.viewer.pick(x, y, this.tol(e));
        const additive = this.multi || e.shiftKey || e.ctrlKey || e.metaKey;
        if (hit) this.app.select([hit], additive ? 'toggle' : 'replace');
        else if (!additive) this.app.select([], 'replace');
        break;
      }
      case 'joint': {
        const s = this.snap(x, y, e);
        if (!s) return toast('Point is not on the work plane – rotate the view or change the work plane.', 'warn');
        const id = this.jointAt(s);
        this.app.select([selKey('j', id)], 'replace');
        break;
      }
      case 'frame': {
        const s = this.snap(x, y, e);
        if (!s) return toast('Point is not on the work plane – rotate the view or change the work plane.', 'warn');
        m.commit('draw frame', () => {
          const id = this.jointAt(s);
          const prev = this.chain[0];
          if (prev !== undefined && prev !== id) {
            const fid = m.addFrame(prev, id);
            if (fid !== null) this.app.select([selKey('f', fid)], 'replace');
          }
          this.chain = [id];
        });
        break;
      }
      case 'area': {
        const s = this.snap(x, y, e);
        if (!s) return toast('Point is not on the work plane – rotate the view or change the work plane.', 'warn');
        if (s.joint !== null && this.chain.length >= 3 && s.joint === this.chain[0]) {
          this.finishChain(true);
          break;
        }
        if (s.joint !== null && this.chain.includes(s.joint)) return toast('Joint already used in this area', 'warn');
        this.chain.push(this.jointAt(s));
        break;
      }
    }
    this.updateOverlay();
    this.app.updateStatus();
  }

  hover(x: number, y: number, e: PointerEvent): void {
    if (this.tool === 'joint' || this.tool === 'frame' || this.tool === 'area') {
      this.hoverSnap = this.snap(x, y, e);
      this.updateOverlay();
      this.app.setCoordReadout(this.hoverSnap?.pos ?? null);
    }
  }

  wantsBox(e: PointerEvent): boolean {
    return this.tool === 'box' || ((this.tool === 'select') && e.pointerType === 'mouse' && (e.ctrlKey || e.metaKey));
  }

  box(x0: number, y0: number, x1: number, y1: number, phase: 'move' | 'end' | 'cancel'): void {
    const el = this.boxEl;
    if (phase === 'cancel') {
      el.hidden = true;
      return;
    }
    const crossing = x1 < x0;
    if (phase === 'move') {
      el.hidden = false;
      el.classList.toggle('crossing', crossing);
      Object.assign(el.style, {
        left: Math.min(x0, x1) + 'px',
        top: Math.min(y0, y1) + 'px',
        width: Math.abs(x1 - x0) + 'px',
        height: Math.abs(y1 - y0) + 'px',
      });
      return;
    }
    el.hidden = true;
    const keys = this.app.viewer.boxPick(x0, y0, x1, y1, crossing);
    this.app.select(keys, this.multi ? 'add' : 'replace');
    toast(`${keys.length} object(s) ${crossing ? 'touched' : 'inside box'}`, 'info', 1500);
  }

  // ---------------------------------------------------------------- joint drag
  private dragState: { id: number; target: THREE.Vector3 | null } | null = null;

  /** Exactly one joint is selected and the pointer went down on it. */
  wantsDrag(x: number, y: number, e: PointerEvent): boolean {
    if (this.chain.length) return false;
    const sel = [...this.app.selection];
    if (sel.length !== 1) return false;
    const { kind, id } = parseKey(sel[0]);
    if (kind !== 'j') return false;
    const j = this.app.model.joint(id);
    if (!j) return false;
    const s = this.app.viewer.jointScreen(j);
    return !s.behind && Math.hypot(s.x - x, s.y - y) <= this.tol(e);
  }

  /** Snapped position for dragging joint `id` in the plane parallel to the work plane through the joint. */
  dragTarget(id: number, x: number, y: number): THREE.Vector3 | null {
    const j = this.app.model.joint(id);
    if (!j) return null;
    const { gridSpacing: g, workPlane } = this.app.model.data.settings;
    const elev = workPlane === 'XY' ? j.z : workPlane === 'XZ' ? j.y : j.x;
    const p = this.app.viewer.workPlanePoint(x, y, elev);
    if (!p) return null;
    const r = (val: number) => Math.round(Math.round(val / g) * g * 1e9) / 1e9;
    if (workPlane === 'XY') p.set(r(p.x), r(p.y), j.z);
    else if (workPlane === 'XZ') p.set(r(p.x), j.y, r(p.z));
    else p.set(j.x, r(p.y), r(p.z));
    return p;
  }

  drag(x: number, y: number, phase: 'start' | 'move' | 'end' | 'cancel'): void {
    if (phase === 'start') {
      const { id } = parseKey([...this.app.selection][0]);
      this.dragState = { id, target: null };
      return;
    }
    const st = this.dragState;
    if (!st) return;
    const m = this.app.model;
    if (phase === 'cancel') {
      this.dragState = null;
      this.updateOverlay();
      this.app.setCoordReadout(null);
      return;
    }
    if (phase === 'move') {
      st.target = this.dragTarget(st.id, x, y) ?? st.target;
      if (!st.target) return;
      const rubber: [THREE.Vector3, THREE.Vector3][] = [];
      const jm = m.jointMap();
      const pos = (jid: number) => {
        const q = jm.get(jid)!;
        return jid === st.id ? st.target! : new THREE.Vector3(q.x, q.y, q.z);
      };
      for (const f of m.data.frames) if (f.i === st.id || f.j === st.id) rubber.push([pos(f.i), pos(f.j)]);
      for (const a of m.data.areas) {
        const k = a.joints.indexOf(st.id);
        if (k < 0) continue;
        const n = a.joints.length;
        rubber.push([pos(a.joints[(k + n - 1) % n]), st.target], [st.target, pos(a.joints[(k + 1) % n])]);
      }
      this.app.viewer.setOverlay(rubber, st.target);
      this.app.setCoordReadout(st.target);
      return;
    }
    // end
    this.dragState = null;
    const j = m.joint(st.id);
    this.updateOverlay();
    this.app.setCoordReadout(null);
    if (!j || !st.target) return;
    const dx = st.target.x - j.x;
    const dy = st.target.y - j.y;
    const dz = st.target.z - j.z;
    if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) < 1e-12) return;
    const err = m.moveJoints(new Set([st.id]), dx, dy, dz);
    if (err) toast(err, 'warn');
  }

  /** Done button / Enter: close the current area or end the frame chain. */
  finishChain(commit = true): void {
    if (this.tool === 'area' && commit && this.chain.length >= 3) {
      const id = this.app.model.addArea(this.chain);
      if (id !== null) this.app.select([selKey('a', id)], 'replace');
    } else if (this.tool === 'area' && commit && this.chain.length > 0) {
      toast('An area needs at least 3 points', 'warn');
    }
    this.chain = [];
    this.updateOverlay();
    this.app.updateStatus();
  }

  /** Esc: drop the current chain, or clear the selection. */
  cancel(): void {
    if (this.chain.length) {
      this.chain = [];
      this.updateOverlay();
    } else {
      this.app.select([], 'replace');
    }
    this.app.updateStatus();
  }

  updateOverlay(): void {
    const v = this.app.viewer;
    const m = this.app.model;
    const pts = this.chain
      .map((id) => m.joint(id))
      .filter(Boolean)
      .map((j) => new THREE.Vector3(j!.x, j!.y, j!.z));
    const rubber: [THREE.Vector3, THREE.Vector3][] = [];
    const h = this.hoverSnap?.pos;
    if (this.tool === 'frame' && pts.length && h) rubber.push([pts[0], h]);
    if (this.tool === 'area' && pts.length) {
      for (let k = 0; k + 1 < pts.length; k++) rubber.push([pts[k], pts[k + 1]]);
      const last = h ?? pts[pts.length - 1];
      if (h) rubber.push([pts[pts.length - 1], h]);
      if (pts.length >= 2) rubber.push([last, pts[0]]);
    }
    let marker: THREE.Vector3 | null = null;
    if (this.tool === 'joint' || this.tool === 'frame' || this.tool === 'area') marker = h ?? (pts.length ? pts[pts.length - 1] : null);
    v.setOverlay(rubber, marker);
  }

  statusText(): string {
    if (this.tool === 'frame' && this.chain.length) return `Frame from joint ${this.chain[0]} – tap the next point, or Done to stop.`;
    if (this.tool === 'area' && this.chain.length)
      return `Area: ${this.chain.length} point(s) [${this.chain.join(', ')}] – tap the next point, the first point, or Done.`;
    return TOOL_HINT[this.tool];
  }

  /** Keys of objects whose joints were just drawn; used to keep the selection sane after undo. */
  static valid(app: App, k: SelKey): boolean {
    const { kind, id } = parseKey(k);
    const m = app.model;
    return kind === 'j' ? !!m.joint(id) : kind === 'f' ? !!m.frame(id) : !!m.area(id);
  }
}
