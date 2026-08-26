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

/** @deprecated micro-dot pitch removed — now solid line (Ruixen margin). Kept for compat. */
export const DOT_MASK_VERTICAL = {
  maskImage: "none" as unknown as string,
  WebkitMaskImage: "none" as unknown as string,
} as const;

/** @deprecated micro-dot pitch removed — now solid line (Ruixen margin). Kept for compat. */
export const DOT_MASK_HORIZONTAL = {
  maskImage: "none" as unknown as string,
  WebkitMaskImage: "none" as unknown as string,
} as const;

/** 45-degree slanted dashed hatch fill matching portfolio-main (Ruixen). */
export const DIAGONAL_HATCH_PATTERN = {
  backgroundImage:
    "repeating-linear-gradient(45deg, var(--background) 0px, var(--background) 2px, rgb(225 225 225) 2px, rgb(225 225 225) 3px, var(--background) 3px, var(--background) 4px)",
} as const;
