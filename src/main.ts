import './ui/styles.css';
import { App } from './ui/app';

// Prevent iOS Safari double-tap zoom on UI chrome (the viewport canvas handles its own gestures).
let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  (e) => {
    const now = Date.now();
    const t = e.target as HTMLElement;
    if (now - lastTouchEnd < 350 && !t.closest('input, textarea, select')) e.preventDefault();
    lastTouchEnd = now;
  },
  { passive: false },
);

const root = document.getElementById('app');
if (!root) throw new Error('#app element missing');
const app = new App(root);
(window as unknown as { structApp: App }).structApp = app;
