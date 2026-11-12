/**
 * Unified mouse / pen / touch gestures on the viewport, built on Pointer Events.
 *  - tap: select / draw          - one-finger or left drag: orbit (or box select)
 *  - two fingers: pan + pinch    - right/middle drag or Shift+drag: pan
 *  - wheel: zoom at cursor       - long press (touch): context menu
 *  - right drag / one-finger drag starting on the selected joint: move that joint
 */
export interface GestureHandlers {
  tap(x: number, y: number, e: PointerEvent): void;
  longPress(x: number, y: number, e: PointerEvent): void;
  hover(x: number, y: number, e: PointerEvent): void;
  orbit(dx: number, dy: number): void;
  pan(dx: number, dy: number): void;
  zoom(factor: number, x: number, y: number): void;
  /** Return true when a one-pointer drag should be a box selection instead of orbit. */
  wantsBox(e: PointerEvent): boolean;
  box(x0: number, y0: number, x1: number, y1: number, phase: 'move' | 'end' | 'cancel'): void;
  /** Return true when a drag (right mouse button, or one finger/pen) starting at (x,y) should drag an object. */
  wantsDrag?(x: number, y: number, e: PointerEvent): boolean;
  drag?(x: number, y: number, phase: 'start' | 'move' | 'end' | 'cancel'): void;
}

interface Pt {
  x: number;
  y: number;
  sx: number;
  sy: number;
  t: number;
  type: string;
  button: number;
}

const LONG_PRESS_MS = 550;

export class Gestures {
  private pts = new Map<number, Pt>();
  private mode: 'idle' | 'pending' | 'orbit' | 'pan' | 'box' | 'drag' | 'multi' | 'done' = 'idle';
  private lpTimer: number | undefined;
  private lastPinch = 0;
  private lastMid = { x: 0, y: 0 };

  constructor(
    private el: HTMLElement,
    private h: GestureHandlers,
  ) {
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', this.down);
    el.addEventListener('pointermove', this.move);
    el.addEventListener('pointerup', this.up);
    el.addEventListener('pointercancel', this.cancel);
    el.addEventListener('lostpointercapture', (e) => this.pts.has(e.pointerId) && this.cancel(e));
    el.addEventListener('wheel', this.wheel, { passive: false });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    // Safari gesture events would otherwise zoom the page.
    for (const n of ['gesturestart', 'gesturechange', 'gestureend']) el.addEventListener(n, (e) => e.preventDefault());
  }

  private slop(type: string) {
    return type === 'mouse' ? 4 : 10;
  }

  private clearLP() {
    if (this.lpTimer !== undefined) clearTimeout(this.lpTimer);
    this.lpTimer = undefined;
  }

  private down = (e: PointerEvent) => {
    this.el.setPointerCapture(e.pointerId);
    this.pts.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), type: e.pointerType, button: e.button });
    if (this.pts.size === 1) {
      this.mode = 'pending';
      if (e.pointerType !== 'mouse') {
        this.lpTimer = window.setTimeout(() => {
          if (this.mode === 'pending' && this.pts.size === 1) {
            this.mode = 'done';
            navigator.vibrate?.(15);
            this.h.longPress(e.clientX, e.clientY, e);
          }
        }, LONG_PRESS_MS);
      }
    } else if (this.pts.size === 2) {
      this.clearLP();
      if (this.mode === 'box') this.h.box(0, 0, 0, 0, 'cancel');
      if (this.mode === 'drag') this.h.drag?.(0, 0, 'cancel');
      this.mode = 'multi';
      const [a, b] = [...this.pts.values()];
      this.lastPinch = Math.hypot(a.x - b.x, a.y - b.y);
      this.lastMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    e.preventDefault();
  };

  private move = (e: PointerEvent) => {
    const p = this.pts.get(e.pointerId);
    if (!p) {
      if (e.pointerType === 'mouse') this.h.hover(e.clientX, e.clientY, e);
      return;
    }
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;

    if (this.mode === 'multi' && this.pts.size >= 2) {
      const [a, b] = [...this.pts.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      this.h.pan(mid.x - this.lastMid.x, mid.y - this.lastMid.y);
      if (this.lastPinch > 0 && dist > 0) this.h.zoom(this.lastPinch / dist, mid.x, mid.y);
      this.lastPinch = dist;
      this.lastMid = mid;
      return;
    }
    if (this.mode === 'pending') {
      if (Math.hypot(e.clientX - p.sx, e.clientY - p.sy) < this.slop(p.type)) {
        if (p.type === 'mouse') this.h.hover(e.clientX, e.clientY, e);
        return;
      }
      this.clearLP();
      const dragBtn = !e.shiftKey && (p.type === 'mouse' ? p.button === 2 : true);
      if (dragBtn && this.h.drag && this.h.wantsDrag?.(p.sx, p.sy, e)) {
        this.mode = 'drag';
        this.h.drag(p.sx, p.sy, 'start');
      } else if (p.button === 1 || p.button === 2 || e.shiftKey) this.mode = 'pan';
      else if (this.h.wantsBox(e)) this.mode = 'box';
      else this.mode = 'orbit';
    }
    if (this.mode === 'orbit') this.h.orbit(dx, dy);
    else if (this.mode === 'pan') this.h.pan(dx, dy);
    else if (this.mode === 'box') this.h.box(p.sx, p.sy, e.clientX, e.clientY, 'move');
    else if (this.mode === 'drag') this.h.drag?.(e.clientX, e.clientY, 'move');
  };

  private up = (e: PointerEvent) => {
    const p = this.pts.get(e.pointerId);
    if (!p) return;
    this.pts.delete(e.pointerId);
    this.clearLP();
    if (this.mode === 'pending' && this.pts.size === 0) {
      if (p.button === 2 && p.type === 'mouse') this.h.longPress(e.clientX, e.clientY, e);
      else if (p.button === 0 || p.type !== 'mouse') this.h.tap(e.clientX, e.clientY, e);
    } else if (this.mode === 'box') {
      this.h.box(p.sx, p.sy, e.clientX, e.clientY, 'end');
    } else if (this.mode === 'drag') {
      this.h.drag?.(e.clientX, e.clientY, 'end');
    }
    if (this.pts.size === 0) this.mode = 'idle';
    else if (this.mode === 'multi' && this.pts.size === 1) this.mode = 'done'; // wait for the last finger to lift
  };

  private cancel = (e: PointerEvent) => {
    this.pts.delete(e.pointerId);
    this.clearLP();
    if (this.mode === 'box') this.h.box(0, 0, 0, 0, 'cancel');
    if (this.mode === 'drag') this.h.drag?.(0, 0, 'cancel');
    if (this.pts.size === 0) this.mode = 'idle';
  };

  private wheel = (e: WheelEvent) => {
    e.preventDefault();
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 30;
    // trackpad pinch arrives as ctrl+wheel with small deltas
    const k = e.ctrlKey ? 0.01 : 0.0015;
    this.h.zoom(Math.exp(dy * k), e.clientX, e.clientY);
  };
}
