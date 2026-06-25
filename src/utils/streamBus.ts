export type StreamAction = 'togglePause';

type Listener = (action: StreamAction) => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function emit(action: StreamAction): void {
  for (const fn of listeners) fn(action);
}
