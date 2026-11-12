import { analyzeAll } from './analyze';
import type { ModelData } from '../model/types';

self.onmessage = (e: MessageEvent<{ id: number; data: ModelData }>) => {
  const { id, data } = e.data;
  try {
    const results = analyzeAll(data);
    (self as unknown as Worker).postMessage({ id, ok: true, results });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
