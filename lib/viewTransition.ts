import { flushSync } from "react-dom";

type DocumentWithViewTransitions = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

/**
 * Runs a React state update inside a View Transition, so gallery cells glide to
 * their new place on the sheet instead of jumping. Falls back to a plain update
 * where the API is missing or the visitor prefers reduced motion.
 */
export function withViewTransition(update: () => void) {
  const doc = document as DocumentWithViewTransitions;
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
}
