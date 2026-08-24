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

/** Vertical dotted line (draws a horizontal border as dots) — for `border-r`/`border-l` edges. */
export const DOT_MASK_VERTICAL = {
  maskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
} as const;

/** Horizontal dotted line (draws a horizontal border as dots) — for `border-b`/`border-t` edges. */
export const DOT_MASK_HORIZONTAL = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
} as const;

/** Faint diagonal hatch fill used by blueprint spacer bands. */
export const DIAGONAL_HATCH_PATTERN = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(120, 120, 120, 0.15) 5px, rgba(120, 120, 120, 0.15) 6px)",
} as const;
