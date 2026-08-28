/**
 * Shared blueprint design tokens — the dotted/hatched divider system used
 * across section borders, spacers and page frames.
 *
 * Single source of truth for the `repeating-linear-gradient` mask strings
 * that were previously copy-pasted inline (~170 occurrences). Spread these
 * objects into `style` (they carry both the standard and `-webkit-` prefixed
 * mask properties), e.g.:
 *
 *   <div style={DOT_MASK_VERTICAL} className="border-r ..." />
 */

/** Vertical dotted line (draws a vertical border as crisp micro-dots) — for `border-r`/`border-l` edges. */
export const DOT_MASK_VERTICAL = {
  maskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 4px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 4px)",
} as const;

/** Horizontal dotted line (draws a horizontal border as crisp micro-dots) — for `border-b`/`border-t` edges. */
export const DOT_MASK_HORIZONTAL = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 4px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 4px)",
} as const;

/** 45-degree slanted dashed hatch fill matching blueprint technical drafting style. */
export const DIAGONAL_HATCH_PATTERN = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent 0px, transparent 7px, rgba(0, 0, 0, 0.075) 7px, rgba(0, 0, 0, 0.075) 8px)",
} as const;

/** 4-way smooth edge fade mask (tight smooth fade on top, bottom, left, and right edges). */
export const SMOOTH_EDGE_FADE_MASK = {
  maskImage:
    "linear-gradient(to right, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%), linear-gradient(to bottom, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%), linear-gradient(to bottom, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;
