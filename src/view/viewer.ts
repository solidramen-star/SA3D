import * as THREE from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { Frame, Joint, LoadDir, ModelData, Section } from '../model/types';
import { channelOutline, sectionProps } from '../model/sections';
import { localAxes, type Vec3 } from '../solver/frame3d';
import type { FrameResult, Results } from '../solver/analyze';
import { fmt, fmtU, units, withU } from '../model/units';

export type PickKind = 'j' | 'f' | 'a';
export type SelKey = `${PickKind}:${number}`;
export const selKey = (k: PickKind, id: number) => `${k}:${id}` as SelKey;
export function parseKey(k: string): { kind: PickKind; id: number } {
  const [kind, id] = k.split(':');
  return { kind: kind as PickKind, id: Number(id) };
}

export interface DisplayOptions {
  jointLabels: boolean;
  frameLabels: boolean;
  areaLabels: boolean;
  showLoads: boolean;
  loadValues: boolean;
  extruded: boolean;
  showSupports: boolean;
}

export type ResultView = 'none' | 'deformed' | 'P' | 'V2' | 'V3' | 'T' | 'M2' | 'M3' | 'reactions';
export const FORCE_VIEWS: ResultView[] = ['P', 'V2', 'V3', 'T', 'M2', 'M3'];

export interface ResultOptions {
  view: ResultView;
  /** Multiplier on displacements (true scale = 1). */
  deformScale: number;
  /** Multiplier relative to the automatic diagram scale. */
  forceScale: number;
  animate: boolean;
  showValues: boolean;
}

export interface Theme {
  bg: number;
  grid: number;
  gridMajor: number;
  joint: number;
  frame: number;
  area: number;
  sel: number;
  load: number;
  support: number;
  reaction: number;
  pos: number;
  neg: number;
  deformed: number;
  ghost: number;
}

export const DARK: Theme = {
  bg: 0x0f172a,
  grid: 0x1e293b,
  gridMajor: 0x334155,
  joint: 0x38bdf8,
  frame: 0xe2e8f0,
  area: 0x22c55e,
  sel: 0xf59e0b,
  load: 0xf43f5e,
  support: 0x22c55e,
  reaction: 0xa855f7,
  pos: 0x3b82f6,
  neg: 0xef4444,
  deformed: 0xfacc15,
  ghost: 0x475569,
};

export const LIGHT: Theme = {
  bg: 0xf8fafc,
  grid: 0xe2e8f0,
  gridMajor: 0xcbd5e1,
  joint: 0x0284c7,
  frame: 0x1e293b,
  area: 0x16a34a,
  sel: 0xea580c,
  load: 0xe11d48,
  support: 0x15803d,
  reaction: 0x7e22ce,
  pos: 0x2563eb,
  neg: 0xdc2626,
  deformed: 0xca8a04,
  ghost: 0x94a3b8,
};

const SECTION_COLORS = [0x94a3b8, 0x60a5fa, 0xf472b6, 0x34d399, 0xfbbf24, 0xa78bfa, 0xfb923c, 0x2dd4bf];

const v3 = (a: Vec3 | Joint) => (Array.isArray(a) ? new THREE.Vector3(a[0], a[1], a[2]) : new THREE.Vector3(a.x, a.y, a.z));
const jv = (j: Joint): Vec3 => [j.x, j.y, j.z];

export { fmt };

function loadDirVector(dir: LoadDir, axes: [Vec3, Vec3, Vec3]): THREE.Vector3 {
  switch (dir) {
    case 'GX':
      return new THREE.Vector3(1, 0, 0);
    case 'GY':
      return new THREE.Vector3(0, 1, 0);
    case 'GZ':
      return new THREE.Vector3(0, 0, 1);
    case 'GRAV':
      return new THREE.Vector3(0, 0, -1);
    case 'L1':
      return v3(axes[0]);
    case 'L2':
      return v3(axes[1]);
    case 'L3':
      return v3(axes[2]);
  }
}

function circleTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.beginPath();
  g.arc(32, 32, 28, 0, Math.PI * 2);
  g.fillStyle = '#fff';
  g.fill();
  g.lineWidth = 6;
  g.strokeStyle = 'rgba(0,0,0,0.55)';
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function hollowCircleTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.beginPath();
  g.arc(32, 32, 20, 0, Math.PI * 2);
  g.fillStyle = 'rgba(15, 23, 42, 0.9)';
  g.fill();
  g.lineWidth = 8;
  g.strokeStyle = '#38bdf8';
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function sectionShape(sec: Section): THREE.Shape | null {
  const d = sec.dims;
  const rect = (w: number, h: number, path: THREE.Path | THREE.Shape) => {
    path.moveTo(-w / 2, -h / 2);
    path.lineTo(w / 2, -h / 2);
    path.lineTo(w / 2, h / 2);
    path.lineTo(-w / 2, h / 2);
    path.closePath();
  };
  switch (sec.shape) {
    case 'rect': {
      const s = new THREE.Shape();
      rect(d[1], d[0], s);
      return s;
    }
    case 'circle': {
      const s = new THREE.Shape();
      s.absarc(0, 0, d[0] / 2, 0, Math.PI * 2, false);
      return s;
    }
    case 'pipe': {
      const s = new THREE.Shape();
      s.absarc(0, 0, d[0] / 2, 0, Math.PI * 2, false);
      const h = new THREE.Path();
      h.absarc(0, 0, d[0] / 2 - d[1], 0, Math.PI * 2, true);
      s.holes.push(h);
      return s;
    }
    case 'box': {
      const s = new THREE.Shape();
      rect(d[1], d[0], s);
      const h = new THREE.Path();
      rect(d[1] - 2 * d[3], d[0] - 2 * d[2], h);
      s.holes.push(h);
      return s;
    }
    case 'I': {
      const [h, bf, tf, tw] = d;
      const s = new THREE.Shape();
      const pts: [number, number][] = [
        [-bf / 2, -h / 2],
        [bf / 2, -h / 2],
        [bf / 2, -h / 2 + tf],
        [tw / 2, -h / 2 + tf],
        [tw / 2, h / 2 - tf],
        [bf / 2, h / 2 - tf],
        [bf / 2, h / 2],
        [-bf / 2, h / 2],
        [-bf / 2, h / 2 - tf],
        [-tw / 2, h / 2 - tf],
        [-tw / 2, -h / 2 + tf],
        [-bf / 2, -h / 2 + tf],
      ];
      s.moveTo(...pts[0]);
      for (const p of pts.slice(1)) s.lineTo(...p);
      s.closePath();
      return s;
    }
    case 'unp':
    case 'C': {
      const pts = channelOutline(sec)!;
      const s = new THREE.Shape();
      s.moveTo(...pts[0]);
      for (const p of pts.slice(1)) s.lineTo(...p);
      s.closePath();
      return s;
    }
    case 'general': {
      const p = sectionProps(sec);
      const s = new THREE.Shape();
      rect(p.width, p.depth, s);
      return s;
    }
  }
}

export class Viewer {
  readonly renderer: THREE.WebGLRenderer;
  readonly labels: CSS2DRenderer;
  readonly scene = new THREE.Scene();
  readonly persp = new THREE.PerspectiveCamera(45, 1, 0.01, 1e5);
  readonly ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.001, 1e6);
  camera: THREE.Camera = this.persp;
  useOrtho = false;

  target = new THREE.Vector3();
  azimuth = -Math.PI / 3;
  elevation = Math.PI / 6;
  distance = 20;

  theme: Theme = DARK;
  private width = 1;
  private height = 1;
  private lineMats: LineMaterial[] = [];
  private gridGroup = new THREE.Group();
  private modelGroup = new THREE.Group();
  private resultGroup = new THREE.Group();
  private overlayGroup = new THREE.Group();
  private jointTex = circleTexture();
  private hingeTex = hollowCircleTexture();
  private renderQueued = false;
  private animStart = 0;
  private deformed: { geo: LineSegmentsGeometry; base: Float32Array; delta: Float32Array; pts?: THREE.Points } | null = null;

  private data: ModelData | null = null;
  private selection = new Set<string>();
  private results: Results | null = null;
  display: DisplayOptions = {
    jointLabels: false,
    frameLabels: false,
    areaLabels: false,
    showLoads: true,
    loadValues: true,
    extruded: false,
    showSupports: true,
  };
  resultOpts: ResultOptions = { view: 'none', deformScale: 1, forceScale: 1, animate: false, showValues: true };

  /** Automatic scales computed for the current results. */
  autoDeformScale = 1;
  private span = 10;

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.className = 'viewport-canvas';
    host.appendChild(this.renderer.domElement);
    this.labels = new CSS2DRenderer();
    this.labels.domElement.className = 'viewport-labels';
    host.appendChild(this.labels.domElement);

    this.persp.up.set(0, 0, 1);
    this.ortho.up.set(0, 0, 1);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.6));
    const dl = new THREE.DirectionalLight(0xffffff, 1.4);
    dl.position.set(1, -2, 3);
    this.scene.add(dl);
    this.scene.add(this.gridGroup, this.modelGroup, this.resultGroup, this.overlayGroup);

    new ResizeObserver(() => this.resize()).observe(host);
    this.resize();
  }

  get canvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  setTheme(t: Theme): void {
    this.theme = t;
    this.rebuildAll();
  }

  private resize(): void {
    const r = this.host.getBoundingClientRect();
    this.width = Math.max(1, r.width);
    this.height = Math.max(1, r.height);
    this.renderer.setSize(this.width, this.height);
    this.labels.setSize(this.width, this.height);
    for (const m of this.lineMats) m.resolution.set(this.width, this.height);
    this.updateCamera();
  }

  // ---------------------------------------------------------------- camera
  private viewDir(): THREE.Vector3 {
    const ce = Math.cos(this.elevation);
    return new THREE.Vector3(ce * Math.cos(this.azimuth), ce * Math.sin(this.azimuth), Math.sin(this.elevation));
  }

  updateCamera(): void {
    const dir = this.viewDir();
    const aspect = this.width / this.height;
    const halfH = this.distance * Math.tan(THREE.MathUtils.degToRad(this.persp.fov / 2));
    this.persp.aspect = aspect;
    this.persp.near = Math.max(this.distance / 2000, 1e-4);
    this.persp.far = this.distance * 50 + this.span * 20;
    this.persp.position.copy(this.target).addScaledVector(dir, this.distance);
    this.persp.lookAt(this.target);
    this.persp.updateProjectionMatrix();

    const back = this.distance + this.span * 10;
    this.ortho.left = -halfH * aspect;
    this.ortho.right = halfH * aspect;
    this.ortho.top = halfH;
    this.ortho.bottom = -halfH;
    this.ortho.near = 0.001;
    this.ortho.far = back * 2 + this.span * 10;
    this.ortho.position.copy(this.target).addScaledVector(dir, back);
    this.ortho.lookAt(this.target);
    this.ortho.updateProjectionMatrix();
    this.camera = this.useOrtho ? this.ortho : this.persp;
    this.requestRender();
  }

  setOrtho(on: boolean): void {
    this.useOrtho = on;
    this.updateCamera();
  }

  orbit(dxPx: number, dyPx: number): void {
    this.azimuth -= dxPx * 0.008;
    this.elevation = THREE.MathUtils.clamp(this.elevation + dyPx * 0.008, -Math.PI / 2 + 0.002, Math.PI / 2 - 0.002);
    this.updateCamera();
  }

  private worldPerPixel(): number {
    return (2 * this.distance * Math.tan(THREE.MathUtils.degToRad(this.persp.fov / 2))) / this.height;
  }

  pan(dxPx: number, dyPx: number): void {
    const wpp = this.worldPerPixel();
    const cam = this.camera;
    cam.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    this.target.addScaledVector(right, -dxPx * wpp).addScaledVector(up, dyPx * wpp);
    this.updateCamera();
  }

  /** factor < 1 zooms in. Keeps the point under (cx,cy) fixed when given. */
  zoom(factor: number, cx?: number, cy?: number): void {
    factor = THREE.MathUtils.clamp(factor, 0.2, 5);
    const newDist = THREE.MathUtils.clamp(this.distance * factor, this.span * 1e-3 + 1e-3, this.span * 200 + 100);
    factor = newDist / this.distance;
    if (cx !== undefined && cy !== undefined) {
      const p = this.pointOnTargetPlane(cx, cy);
      if (p) this.target.add(p.sub(this.target).multiplyScalar(1 - factor));
    }
    this.distance = newDist;
    this.updateCamera();
  }

  private ndc(cx: number, cy: number): THREE.Vector2 {
    const r = this.canvas.getBoundingClientRect();
    return new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  }

  ray(cx: number, cy: number): THREE.Ray {
    const rc = new THREE.Raycaster();
    rc.setFromCamera(this.ndc(cx, cy), this.camera);
    return rc.ray;
  }

  private pointOnTargetPlane(cx: number, cy: number): THREE.Vector3 | null {
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(this.viewDir(), this.target);
    return this.ray(cx, cy).intersectPlane(plane, new THREE.Vector3());
  }

  /** Intersection of the pointer ray with the work plane. */
  /** Intersection of the pointer ray with the work plane (or a parallel plane at `elev`). */
  workPlanePoint(cx: number, cy: number, elev?: number): THREE.Vector3 | null {
    if (!this.data) return null;
    const { workPlane } = this.data.settings;
    const elevation = elev ?? this.data.settings.elevation;
    const n = workPlane === 'XY' ? new THREE.Vector3(0, 0, 1) : workPlane === 'XZ' ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const plane = new THREE.Plane(n, -elevation);
    const r = this.ray(cx, cy);
    if (Math.abs(r.direction.dot(n)) < 1e-4) return null;
    return r.intersectPlane(plane, new THREE.Vector3());
  }

  /** Client-space screen position of a world point. */
  toScreen(p: THREE.Vector3): { x: number; y: number; behind: boolean } {
    const r = this.canvas.getBoundingClientRect();
    const q = p.clone().project(this.camera);
    return { x: r.left + ((q.x + 1) / 2) * r.width, y: r.top + ((1 - q.y) / 2) * r.height, behind: q.z > 1 || q.z < -1 };
  }

  private bounds(): THREE.Box3 {
    const b = new THREE.Box3();
    if (this.data && this.data.joints.length) for (const j of this.data.joints) b.expandByPoint(v3(j));
    else {
      const s = this.data ? this.data.settings.gridSpacing * Math.min(this.data.settings.gridLines, 5) : 5;
      b.set(new THREE.Vector3(-s, -s, 0), new THREE.Vector3(s, s, 0));
    }
    return b;
  }

  fit(): void {
    const b = this.bounds();
    const sphere = b.getBoundingSphere(new THREE.Sphere());
    const rad = Math.max(sphere.radius, 1);
    this.target.copy(sphere.center);
    const fov = THREE.MathUtils.degToRad(this.persp.fov / 2);
    const aspect = this.width / this.height;
    const fitH = rad / Math.sin(fov);
    const fitW = rad / Math.sin(Math.atan(Math.tan(fov) * aspect));
    this.distance = Math.max(fitH, fitW) * 1.08;
    this.updateCamera();
  }

  viewPreset(p: 'top' | 'front' | 'side' | 'iso'): void {
    const map = {
      top: [-Math.PI / 2, Math.PI / 2 - 0.002],
      front: [-Math.PI / 2, 0],
      side: [0, 0],
      iso: [-Math.PI / 3, Math.PI / 6],
    } as const;
    [this.azimuth, this.elevation] = map[p];
    this.fit();
  }

  // ---------------------------------------------------------------- rendering
  requestRender(): void {
    if (this.renderQueued) return;
    this.renderQueued = true;
    requestAnimationFrame((t) => {
      this.renderQueued = false;
      if (this.resultOpts.animate && this.deformed) {
        const s = Math.sin(((t - this.animStart) / 1400) * Math.PI * 2);
        this.applyDeformation(s);
        this.requestRender();
      }
      this.renderer.render(this.scene, this.camera);
      this.labels.render(this.scene, this.camera);
    });
  }

  private clearGroup(g: THREE.Group): void {
    const objs = [...g.children];
    for (const o of objs) {
      g.remove(o);
      o.traverse((c) => {
        const m = c as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (mat) for (const x of Array.isArray(mat) ? mat : [mat]) if (x !== undefined) {
          if (x instanceof LineMaterial) this.lineMats = this.lineMats.filter((l) => l !== x);
          x.dispose();
        }
      });
    }
  }

  private lineMat(color: number | null, width: number, opts: Partial<{ opacity: number; dashed: boolean }> = {}): LineMaterial {
    const m = new LineMaterial({
      color: color ?? 0xffffff,
      linewidth: width,
      vertexColors: color === null,
      transparent: (opts.opacity ?? 1) < 1,
      opacity: opts.opacity ?? 1,
      dashed: opts.dashed ?? false,
      dashSize: this.span * 0.02,
      gapSize: this.span * 0.015,
    });
    m.resolution.set(this.width, this.height);
    this.lineMats.push(m);
    return m;
  }

  private lines(pos: number[], color: number | null, width: number, colors?: number[], opts?: { opacity?: number; dashed?: boolean }) {
    const g = new LineSegmentsGeometry();
    g.setPositions(pos);
    if (colors) g.setColors(colors);
    const l = new LineSegments2(g, this.lineMat(color, width, opts));
    if (opts?.dashed) l.computeLineDistances();
    return l;
  }

  private label(text: string, p: THREE.Vector3, cls = ''): CSS2DObject {
    const div = document.createElement('div');
    div.className = 'lbl ' + cls;
    div.textContent = text;
    const o = new CSS2DObject(div);
    o.position.copy(p);
    return o;
  }

  setData(data: ModelData, selection: Set<string>, results: Results | null): void {
    this.data = data;
    this.selection = selection;
    this.results = results;
    this.rebuildAll();
  }

  rebuildAll(): void {
    if (!this.data) return;
    this.scene.background = new THREE.Color(this.theme.bg);
    const b = this.bounds();
    this.span = Math.max(b.getSize(new THREE.Vector3()).length(), this.data.settings.gridSpacing * 2, 1e-3);
    this.computeAutoScales();
    this.buildGrid();
    this.buildModel();
    this.buildResults();
    this.requestRender();
  }

  private glyph(): number {
    return this.span * 0.035;
  }

  private buildGrid(): void {
    this.clearGroup(this.gridGroup);
    const d = this.data!;
    const { gridSpacing: s, gridLines: n, workPlane, elevation: e } = d.settings;
    const minor: number[] = [];
    const major: number[] = [];
    const ext = s * n;
    const P = (u: number, v: number): [number, number, number] =>
      workPlane === 'XY' ? [u, v, e] : workPlane === 'XZ' ? [u, e, v] : [e, u, v];
    for (let k = -n; k <= n; k++) {
      const arr = k === 0 ? major : minor;
      arr.push(...P(k * s, -ext), ...P(k * s, ext), ...P(-ext, k * s), ...P(ext, k * s));
    }
    this.gridGroup.add(this.lines(minor, this.theme.grid, 1));
    this.gridGroup.add(this.lines(major, this.theme.gridMajor, 1.5));
    const L = Math.max(s, this.span * 0.08);
    const axes = this.lines(
      [0, 0, 0, L, 0, 0, 0, 0, 0, 0, L, 0, 0, 0, 0, 0, 0, L],
      null,
      3,
      [1, 0.25, 0.25, 1, 0.25, 0.25, 0.3, 0.85, 0.3, 0.3, 0.85, 0.3, 0.3, 0.5, 1, 0.3, 0.5, 1],
    );
    this.gridGroup.add(axes);
    this.gridGroup.add(this.label('X', new THREE.Vector3(L * 1.15, 0, 0), 'axis x'));
    this.gridGroup.add(this.label('Y', new THREE.Vector3(0, L * 1.15, 0), 'axis y'));
    this.gridGroup.add(this.label('Z', new THREE.Vector3(0, 0, L * 1.15), 'axis z'));
  }

  private buildModel(): void {
    this.clearGroup(this.modelGroup);
    const d = this.data!;
    const t = this.theme;
    const sel = this.selection;
    const jm = new Map(d.joints.map((j) => [j.id, j]));
    const ghost = this.results && this.resultOpts.view !== 'none' && this.resultOpts.view !== 'reactions';
    const selColor = new THREE.Color(t.sel);

    // areas
    for (const a of d.areas) {
      const pts = a.joints.map((id) => jm.get(id)).filter(Boolean).map((j) => v3(j!));
      if (pts.length < 3) continue;
      const pos: number[] = [];
      for (let k = 1; k < pts.length - 1; k++) pos.push(...pts[0].toArray(), ...pts[k].toArray(), ...pts[k + 1].toArray());
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const isSel = sel.has(selKey('a', a.id));
      const m = new THREE.Mesh(
        g,
        new THREE.MeshBasicMaterial({
          color: isSel ? t.sel : t.area,
          transparent: true,
          opacity: ghost ? 0.08 : isSel ? 0.45 : 0.22,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      m.renderOrder = -1;
      this.modelGroup.add(m);
      if (this.display.areaLabels) {
        const c = pts.reduce((s, p) => s.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
        this.modelGroup.add(this.label('A' + a.id, c, 'area'));
      }
    }

    // frames
    const fpos: number[] = [];
    const fcol: number[] = [];
    const base = new THREE.Color(ghost ? t.ghost : t.frame);
    for (const f of d.frames) {
      const a = jm.get(f.i);
      const b = jm.get(f.j);
      if (!a || !b) continue;
      fpos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      const c = sel.has(selKey('f', f.id)) ? selColor : base;
      fcol.push(c.r, c.g, c.b, c.r, c.g, c.b);
      if (this.display.frameLabels) {
        this.modelGroup.add(this.label('F' + f.id, v3(a).add(v3(b)).multiplyScalar(0.5), 'frame'));
      }
    }
    if (fpos.length) {
      if (this.display.extruded && !ghost) this.buildExtruded(d, jm);
      else this.modelGroup.add(this.lines(fpos, null, 3, fcol));
      if (this.display.extruded && ghost) this.modelGroup.add(this.lines(fpos, null, 2, fcol));
      if (this.display.extruded && !ghost) {
        // keep selection visible with thin lines over the solids
        const sp: number[] = [];
        for (const f of d.frames) {
          if (!sel.has(selKey('f', f.id))) continue;
          const a = jm.get(f.i)!;
          const b = jm.get(f.j)!;
          sp.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        if (sp.length) this.modelGroup.add(this.lines(sp, t.sel, 4));
      }
    }

    // member end release visual hinges
    if (!ghost) {
      const hpos: number[] = [];
      for (const f of d.frames) {
        const a = jm.get(f.i);
        const b = jm.get(f.j);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const L = Math.hypot(dx, dy, dz);
        if (L <= 1e-6) continue;
        const frac = Math.min(0.08, 0.3 / L);
        if (f.relI && f.relI.some(Boolean)) {
          hpos.push(a.x + dx * frac, a.y + dy * frac, a.z + dz * frac);
        }
        if (f.relJ && f.relJ.some(Boolean)) {
          hpos.push(b.x - dx * frac, b.y - dy * frac, b.z - dz * frac);
        }
      }
      if (hpos.length) {
        const hg = new THREE.BufferGeometry();
        hg.setAttribute('position', new THREE.Float32BufferAttribute(hpos, 3));
        const hpts = new THREE.Points(
          hg,
          new THREE.PointsMaterial({
            size: 11,
            sizeAttenuation: false,
            map: this.hingeTex,
            transparent: true,
            alphaTest: 0.1,
            depthTest: false,
          }),
        );
        this.modelGroup.add(hpts);
      }
    }

    // joints
    if (d.joints.length) {
      const pos: number[] = [];
      const col: number[] = [];
      const jc = new THREE.Color(t.joint);
      for (const j of d.joints) {
        pos.push(j.x, j.y, j.z);
        const c = sel.has(selKey('j', j.id)) ? selColor : jc;
        col.push(c.r, c.g, c.b);
        if (this.display.jointLabels) {
          const l = this.label(String(j.id), v3(j), 'joint');
          this.modelGroup.add(l);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      const pts = new THREE.Points(
        g,
        new THREE.PointsMaterial({
          size: 13,
          sizeAttenuation: false,
          map: this.jointTex,
          vertexColors: true,
          alphaTest: 0.5,
          transparent: true,
          depthTest: false,
        }),
      );
      pts.renderOrder = 10;
      this.modelGroup.add(pts);
    }

    if (this.display.showSupports) this.buildSupports(d);
    if (this.display.showLoads && !(this.results && this.resultOpts.view !== 'none')) this.buildLoads(d, jm);
  }

  private buildExtruded(d: ModelData, jm: Map<number, Joint>): void {
    const secIdx = new Map(d.sections.map((s, k) => [s.name, k]));
    const mats = new Map<string, THREE.Material>();
    const matFor = (key: string, color: number) => {
      let m = mats.get(key);
      if (!m) {
        m = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 });
        mats.set(key, m);
      }
      return m;
    };
    for (const f of d.frames) {
      const a = jm.get(f.i);
      const b = jm.get(f.j);
      const sec = d.sections.find((s) => s.name === f.section);
      if (!a || !b || !sec) continue;
      const shape = sectionShape(sec);
      if (!shape) continue;
      const L = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: L, bevelEnabled: false, curveSegments: 16 });
      const ax = localAxes(jv(a), jv(b), f.beta);
      const isSel = this.selection.has(selKey('f', f.id));
      const color = isSel ? this.theme.sel : SECTION_COLORS[(secIdx.get(sec.name) ?? 0) % SECTION_COLORS.length];
      const mesh = new THREE.Mesh(geo, matFor(String(color), color));
      // shape x → −local 3, shape y → local 2, extrusion → local 1 (right-handed)
      const m = new THREE.Matrix4().makeBasis(v3(ax[2]).negate(), v3(ax[1]), v3(ax[0]));
      m.setPosition(a.x, a.y, a.z);
      mesh.applyMatrix4(m);
      this.modelGroup.add(mesh);
    }
  }

  private arrow(tail: THREE.Vector3, head: THREE.Vector3, color: number, width = 2, double = false): THREE.Group {
    const g = new THREE.Group();
    const dir = head.clone().sub(tail);
    const len = dir.length();
    if (len < 1e-12) return g;
    dir.normalize();
    const hl = Math.min(len * 0.35, this.glyph() * 0.6);
    const hr = hl * 0.35;
    const shaftEnd = head.clone().addScaledVector(dir, -hl * (double ? 1.6 : 0.9));
    g.add(this.lines([...tail.toArray(), ...shaftEnd.toArray()], color, width));
    const mat = new THREE.MeshBasicMaterial({ color });
    const heads = double ? [head, head.clone().addScaledVector(dir, -hl * 0.8)] : [head];
    for (const h of heads) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(hr, hl, 12), mat.clone());
      cone.position.copy(h).addScaledVector(dir, -hl / 2);
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      g.add(cone);
    }
    mat.dispose();
    return g;
  }

  private buildSupports(d: ModelData): void {
    const s = this.glyph();
    const col = this.theme.support;
    for (const j of d.joints) {
      if (!j.r.some(Boolean)) continue;
      const allT = j.r[0] && j.r[1] && j.r[2];
      const allR = j.r[3] && j.r[4] && j.r[5];
      const p = v3(j);
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.7 });
      let mesh: THREE.Object3D;
      if (allT && allR) {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(s * 1.6, s * 1.6, s * 0.5), mat);
        mesh.position.copy(p).add(new THREE.Vector3(0, 0, -s * 0.25));
      } else if (allT) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(s * 0.7, s * 1.1, 4), mat);
        cone.rotation.x = Math.PI / 2; // tip (+Y) → +Z, apex at the joint
        cone.position.copy(p).add(new THREE.Vector3(0, 0, -s * 0.55));
        mesh = cone;
      } else {
        const g = new THREE.Group();
        const cone = new THREE.Mesh(new THREE.ConeGeometry(s * 0.55, s * 0.8, 4), mat);
        cone.rotation.x = Math.PI / 2; // tip (+Y) → +Z, apex at the joint
        cone.position.set(0, 0, -s * 0.4);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(s * 0.22, 12, 8), mat);
        ball.position.set(0, 0, -s * 1.0);
        g.add(cone, ball);
        g.position.copy(p);
        mesh = g;
      }
      this.modelGroup.add(mesh);
    }
  }

  private buildLoads(d: ModelData, jm: Map<number, Joint>): void {
    const s = this.glyph();
    const col = this.theme.load;
    const L = s * 3;
    const vals = this.display.loadValues;
    for (const l of d.jointLoads) {
      const j = jm.get(l.joint);
      if (!j) continue;
      const p = v3(j);
      const f = new THREE.Vector3(l.f[0], l.f[1], l.f[2]);
      if (f.lengthSq() > 0) {
        const dir = f.clone().normalize();
        this.modelGroup.add(this.arrow(p.clone().addScaledVector(dir, -L), p, col, 2.5));
        if (vals) this.modelGroup.add(this.label(withU(f.length(), 'F'), p.clone().addScaledVector(dir, -L * 1.1), 'load'));
      }
      const m = new THREE.Vector3(l.f[3], l.f[4], l.f[5]);
      if (m.lengthSq() > 0) {
        const dir = m.clone().normalize();
        this.modelGroup.add(this.arrow(p, p.clone().addScaledVector(dir, L * 0.9), col, 2.5, true));
        if (vals) this.modelGroup.add(this.label(withU(m.length(), 'M'), p.clone().addScaledVector(dir, L), 'load'));
      }
    }
    const fm = new Map(d.frames.map((f) => [f.id, f]));
    const axesOf = (f: Frame) => {
      const a = jm.get(f.i)!;
      const b = jm.get(f.j)!;
      return { a: v3(a), b: v3(b), ax: localAxes(jv(a), jv(b), f.beta) };
    };
    for (const l of d.framePointLoads) {
      const f = fm.get(l.frame);
      if (!f || !jm.has(f.i) || !jm.has(f.j)) continue;
      const { a, b, ax } = axesOf(f);
      const p = a.clone().lerp(b, l.rd);
      const dir = loadDirVector(l.dir, ax).multiplyScalar(Math.sign(l.P) || 1);
      this.modelGroup.add(this.arrow(p.clone().addScaledVector(dir, -L), p, col, 2.5));
      if (vals) this.modelGroup.add(this.label(withU(Math.abs(l.P), 'F'), p.clone().addScaledVector(dir, -L * 1.1), 'load'));
    }
    const ucol = 0xfb923c;
    const stack = new Map<number, number>();
    for (const l of d.frameUniformLoads) {
      const f = fm.get(l.frame);
      if (!f || !jm.has(f.i) || !jm.has(f.j)) continue;
      const { a, b, ax } = axesOf(f);
      const k = stack.get(f.id) ?? 0;
      stack.set(f.id, k + 1);
      const dir = loadDirVector(l.dir, ax).multiplyScalar(Math.sign(l.w) || 1);
      const off = L * 0.7 * (1 + k * 0.6);
      const n = 6;
      const tails: number[] = [];
      for (let i = 0; i <= n; i++) {
        const p = a.clone().lerp(b, i / n);
        const tail = p.clone().addScaledVector(dir, -off);
        tails.push(...tail.toArray());
        if (i > 0 && i < n) tails.push(...tail.toArray());
        this.modelGroup.add(this.arrow(tail, p, ucol, 1.5));
      }
      this.modelGroup.add(this.lines(tails, ucol, 2));
      if (vals) {
        const mid = a.clone().lerp(b, 0.5).addScaledVector(dir, -off * 1.15);
        this.modelGroup.add(this.label(withU(Math.abs(l.w), 'FL'), mid, 'load uload'));
      }
    }
    const am = new Map(d.areas.map((a) => [a.id, a]));
    for (const l of d.areaLoads) {
      const a = am.get(l.area);
      if (!a) continue;
      const pts = a.joints.map((id) => jm.get(id)).filter(Boolean).map((j) => v3(j!));
      if (pts.length < 3) continue;
      const c = pts.reduce((s0, p) => s0.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
      const dir = new THREE.Vector3(0, 0, Math.sign(l.q) >= 0 ? -1 : 1);
      const targets = [c, ...pts.map((p) => p.clone().lerp(c, 0.45))];
      for (const p of targets) this.modelGroup.add(this.arrow(p.clone().addScaledVector(dir, -L * 0.8), p, 0x14b8a6, 1.5));
      if (vals) this.modelGroup.add(this.label(withU(Math.abs(l.q), 'FA'), c.clone().addScaledVector(dir, -L * 0.95), 'load aload'));
    }
  }

  // ---------------------------------------------------------------- results
  computeAutoScales(): void {
    const r = this.results;
    this.autoDeformScale = r && r.stats.maxDisp > 1e-15 ? (this.span * 0.08) / r.stats.maxDisp : 1;
  }

  setResults(results: Results | null): void {
    this.results = results;
    this.computeAutoScales();
  }

  setResultOptions(o: Partial<ResultOptions>): void {
    const prevView = this.resultOpts.view;
    Object.assign(this.resultOpts, o);
    if (o.animate) this.animStart = performance.now();
    if (prevView !== this.resultOpts.view) this.buildModel();
    if (!this.resultOpts.animate && this.deformed) this.applyDeformation(1);
    this.buildResults();
    this.requestRender();
  }

  private applyDeformation(f: number): void {
    const dfm = this.deformed!;
    const attr = dfm.geo.attributes.instanceStart as THREE.InterleavedBufferAttribute;
    const arr = attr.data.array as Float32Array;
    for (let i = 0; i < arr.length; i++) arr[i] = dfm.base[i] + dfm.delta[i] * f;
    attr.data.needsUpdate = true;
    dfm.geo.computeBoundingSphere();
  }

  private buildResults(): void {
    this.clearGroup(this.resultGroup);
    this.deformed = null;
    const r = this.results;
    const d = this.data;
    if (!r || !d) return;
    const v = this.resultOpts.view;
    if (v === 'deformed') this.buildDeformed(r, d);
    else if (FORCE_VIEWS.includes(v)) this.buildDiagram(r, v as keyof FrameResult);
    if (v === 'reactions' || v === 'deformed' || FORCE_VIEWS.includes(v)) {
      if (v === 'reactions') this.buildReactions(r, d);
    }
  }

  private buildDeformed(r: Results, d: ModelData): void {
    const scale = this.resultOpts.deformScale;
    const jm = new Map(d.joints.map((j) => [j.id, j]));
    const base: number[] = [];
    const delta: number[] = [];
    for (const fr of r.frames) {
      const f = d.frames.find((x) => x.id === fr.id);
      if (!f) continue;
      const a = v3(jm.get(f.i)!);
      const e1 = v3(fr.axes[0]);
      for (let k = 0; k < fr.x.length - 1; k++) {
        for (const kk of [k, k + 1]) {
          const p = a.clone().addScaledVector(e1, fr.x[kk]);
          base.push(p.x, p.y, p.z);
          const u = fr.disp[kk];
          delta.push(u[0] * scale, u[1] * scale, u[2] * scale);
        }
      }
    }
    if (!base.length) return;
    const pos = base.map((b, i) => b + delta[i]);
    const line = this.lines(pos, this.theme.deformed, 3);
    this.resultGroup.add(line);
    this.deformed = { geo: line.geometry as LineSegmentsGeometry, base: new Float32Array(base), delta: new Float32Array(delta) };

    if (this.resultOpts.showValues) {
      // label the joint with the largest translation
      let best = -1;
      let bestId = 0;
      for (const [id, u] of Object.entries(r.disp)) {
        const m = Math.hypot(u[0], u[1], u[2]);
        if (m > best) {
          best = m;
          bestId = Number(id);
        }
      }
      const j = jm.get(bestId);
      if (j && best > 0) {
        const u = r.disp[bestId];
        const p = v3(j).add(new THREE.Vector3(u[0], u[1], u[2]).multiplyScalar(scale));
        this.resultGroup.add(this.label(`max ${fmt(best / units().kSmall)} ${units().small} (J${bestId})`, p, 'result'));
      }
    }
  }

  private buildDiagram(r: Results, comp: keyof FrameResult): void {
    const d = this.data!;
    const jm = new Map(d.joints.map((j) => [j.id, j]));
    let maxAbs = 0;
    for (const fr of r.frames) for (const v of fr[comp] as number[]) maxAbs = Math.max(maxAbs, Math.abs(v));
    if (maxAbs < 1e-9) {
      this.resultGroup.add(this.label(`${comp} = 0 everywhere`, this.target.clone(), 'result'));
      return;
    }
    const scale = ((this.span * 0.12) / maxAbs) * this.resultOpts.forceScale;
    const qty = comp === 'P' || comp === 'V2' || comp === 'V3' ? 'F' : 'M';
    const pos: number[] = [];
    const col: number[] = [];
    const outline: number[] = [];
    const cp = new THREE.Color(this.theme.pos);
    const cn = new THREE.Color(this.theme.neg);
    for (const fr of r.frames) {
      const f = d.frames.find((x) => x.id === fr.id);
      if (!f) continue;
      const a = v3(jm.get(f.i)!);
      const e1 = v3(fr.axes[0]);
      const off = comp === 'M3' ? v3(fr.axes[1]).negate() : comp === 'M2' || comp === 'V3' ? v3(fr.axes[2]) : v3(fr.axes[1]);
      const vals = fr[comp] as number[];
      const basePt = (k: number) => a.clone().addScaledVector(e1, fr.x[k]);
      const tipPt = (k: number) => basePt(k).addScaledVector(off, vals[k] * scale);
      for (let k = 0; k < fr.x.length - 1; k++) {
        const b0 = basePt(k);
        const b1 = basePt(k + 1);
        const t0 = tipPt(k);
        const t1 = tipPt(k + 1);
        const c0 = vals[k] >= 0 ? cp : cn;
        const c1 = vals[k + 1] >= 0 ? cp : cn;
        pos.push(...b0.toArray(), ...t0.toArray(), ...b1.toArray(), ...t0.toArray(), ...t1.toArray(), ...b1.toArray());
        for (const c of [c0, c0, c1, c0, c1, c1]) col.push(c.r, c.g, c.b);
        outline.push(...t0.toArray(), ...t1.toArray());
      }
      outline.push(...basePt(0).toArray(), ...tipPt(0).toArray());
      const n = fr.x.length - 1;
      outline.push(...basePt(n).toArray(), ...tipPt(n).toArray());

      if (this.resultOpts.showValues) {
        const marks = new Set<number>([0, n]);
        let km = 0;
        for (let k = 1; k < n; k++) if (Math.abs(vals[k]) > Math.abs(vals[km])) km = k;
        if (Math.abs(vals[km]) > Math.max(Math.abs(vals[0]), Math.abs(vals[n])) * 1.02) marks.add(km);
        for (const k of marks) {
          if (Math.abs(vals[k]) < maxAbs * 0.01) continue;
          this.resultGroup.add(this.label(fmtU(vals[k], qty, 3), tipPt(k), 'result small'));
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const mesh = new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }),
    );
    this.resultGroup.add(mesh);
    this.resultGroup.add(this.lines(outline, this.theme.frame, 1.5, undefined, { opacity: 0.8 }));
  }

  private buildReactions(r: Results, d: ModelData): void {
    const jm = new Map(d.joints.map((j) => [j.id, j]));
    const L = this.glyph() * 3;
    const col = this.theme.reaction;
    let maxF = 0;
    for (const v of Object.values(r.reactions)) maxF = Math.max(maxF, Math.abs(v[0]), Math.abs(v[1]), Math.abs(v[2]));
    const tol = Math.max(maxF * 1e-6, 1e-9);
    const axes = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
    const names = ['FX', 'FY', 'FZ', 'MX', 'MY', 'MZ'];
    for (const [id, v] of Object.entries(r.reactions)) {
      const j = jm.get(Number(id));
      if (!j) continue;
      const p = v3(j);
      const lines: string[] = [];
      for (let k = 0; k < 3; k++) {
        if (Math.abs(v[k]) <= tol) continue;
        const dir = axes[k].clone().multiplyScalar(Math.sign(v[k]));
        this.resultGroup.add(this.arrow(p.clone().addScaledVector(dir, -L), p, col, 3));
        lines.push(`${names[k]} ${withU(v[k], 'F')}`);
      }
      for (let k = 3; k < 6; k++) {
        if (Math.abs(v[k]) <= tol) continue;
        const dir = axes[k - 3].clone().multiplyScalar(Math.sign(v[k]));
        this.resultGroup.add(this.arrow(p, p.clone().addScaledVector(dir, L * 0.8), col, 3, true));
        lines.push(`${names[k]} ${withU(v[k], 'M')}`);
      }
      if (this.resultOpts.showValues && lines.length) {
        this.resultGroup.add(this.label(`J${id}\n` + lines.join('\n'), p.clone().add(new THREE.Vector3(0, 0, -L * 0.6)), 'result react'));
      }
    }
  }

  // ---------------------------------------------------------------- overlay
  private overlayObjs: THREE.Object3D[] = [];
  setOverlay(rubber: [THREE.Vector3, THREE.Vector3][] | null, snap: THREE.Vector3 | null): void {
    for (const o of this.overlayObjs) this.overlayGroup.remove(o);
    this.clearGroup(this.overlayGroup);
    this.overlayObjs = [];
    if (rubber && rubber.length) {
      const pos: number[] = [];
      for (const [a, b] of rubber) pos.push(...a.toArray(), ...b.toArray());
      const l = this.lines(pos, this.theme.sel, 2, undefined, { dashed: true });
      this.overlayGroup.add(l);
    }
    if (snap) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(snap.toArray(), 3));
      const p = new THREE.Points(
        g,
        new THREE.PointsMaterial({ size: 20, sizeAttenuation: false, map: this.jointTex, color: this.theme.sel, transparent: true, opacity: 0.6, depthTest: false }),
      );
      p.renderOrder = 20;
      this.overlayGroup.add(p);
    }
    this.requestRender();
  }

  // ---------------------------------------------------------------- picking
  pick(cx: number, cy: number, tol: number): SelKey | null {
    const d = this.data;
    if (!d) return null;
    let best: SelKey | null = null;
    let bestD = tol;
    for (const j of d.joints) {
      const s = this.toScreen(v3(j));
      if (s.behind) continue;
      const dist = Math.hypot(s.x - cx, s.y - cy);
      if (dist < bestD) {
        bestD = dist;
        best = selKey('j', j.id);
      }
    }
    if (best) return best;
    const jm = new Map(d.joints.map((j) => [j.id, j]));
    bestD = tol;
    for (const f of d.frames) {
      const a = jm.get(f.i);
      const b = jm.get(f.j);
      if (!a || !b) continue;
      const sa = this.toScreen(v3(a));
      const sb = this.toScreen(v3(b));
      if (sa.behind && sb.behind) continue;
      const dist = segDist(cx, cy, sa.x, sa.y, sb.x, sb.y);
      if (dist < bestD) {
        bestD = dist;
        best = selKey('f', f.id);
      }
    }
    if (best) return best;
    // areas: pick the nearest (by camera depth) area whose projected polygon contains the point
    let bestDepth = Infinity;
    const camPos = this.camera.position;
    for (const a of d.areas) {
      const pts = a.joints.map((id) => jm.get(id)).filter(Boolean) as Joint[];
      if (pts.length < 3) continue;
      const scr = pts.map((j) => this.toScreen(v3(j)));
      if (scr.some((s) => s.behind)) continue;
      if (!pointInPoly(cx, cy, scr)) continue;
      const c = pts.reduce((s, j) => s.add(v3(j)), new THREE.Vector3()).multiplyScalar(1 / pts.length);
      const depth = c.distanceTo(camPos);
      if (depth < bestDepth) {
        bestDepth = depth;
        best = selKey('a', a.id);
      }
    }
    return best;
  }

  /** Window selection (fully inside) or crossing selection (touching) in client coordinates. */
  boxPick(x0: number, y0: number, x1: number, y1: number, crossing: boolean): SelKey[] {
    const d = this.data;
    if (!d) return [];
    const xmin = Math.min(x0, x1);
    const xmax = Math.max(x0, x1);
    const ymin = Math.min(y0, y1);
    const ymax = Math.max(y0, y1);
    const inside = (s: { x: number; y: number; behind: boolean }) => !s.behind && s.x >= xmin && s.x <= xmax && s.y >= ymin && s.y <= ymax;
    const scr = new Map(d.joints.map((j) => [j.id, this.toScreen(v3(j))]));
    const out: SelKey[] = [];
    for (const j of d.joints) if (inside(scr.get(j.id)!)) out.push(selKey('j', j.id));
    const segHits = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      segRect(a.x, a.y, b.x, b.y, xmin, ymin, xmax, ymax);
    for (const f of d.frames) {
      const a = scr.get(f.i);
      const b = scr.get(f.j);
      if (!a || !b) continue;
      if (crossing ? inside(a) || inside(b) || segHits(a, b) : inside(a) && inside(b)) out.push(selKey('f', f.id));
    }
    for (const ar of d.areas) {
      const s = ar.joints.map((id) => scr.get(id)).filter(Boolean) as { x: number; y: number; behind: boolean }[];
      if (!s.length) continue;
      const hit = crossing
        ? s.some(inside) || s.some((p, k) => segHits(p, s[(k + 1) % s.length]))
        : s.every(inside);
      if (hit) out.push(selKey('a', ar.id));
    }
    return out;
  }

  jointScreen(j: Joint) {
    return this.toScreen(v3(j));
  }

  dispose(): void {
    this.renderer.dispose();
  }
}

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function pointInPoly(x: number, y: number, pts: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i];
    const b = pts[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function segSeg(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): boolean {
  const o = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => Math.sign((qx - px) * (ry - py) - (qy - py) * (rx - px));
  return o(ax, ay, bx, by, cx, cy) !== o(ax, ay, bx, by, dx, dy) && o(cx, cy, dx, dy, ax, ay) !== o(cx, cy, dx, dy, bx, by);
}

function segRect(ax: number, ay: number, bx: number, by: number, x0: number, y0: number, x1: number, y1: number): boolean {
  return (
    segSeg(ax, ay, bx, by, x0, y0, x1, y0) ||
    segSeg(ax, ay, bx, by, x1, y0, x1, y1) ||
    segSeg(ax, ay, bx, by, x1, y1, x0, y1) ||
    segSeg(ax, ay, bx, by, x0, y1, x0, y0)
  );
}
