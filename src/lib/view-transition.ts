type TransitionListener = (active: boolean) => void;
const listeners = new Set<TransitionListener>();

export function notifyTransition(active: boolean) {
  listeners.forEach((fn) => {
    try {
      fn(active);
    } catch {}
  });
}

export function onTransitionChange(callback: TransitionListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
