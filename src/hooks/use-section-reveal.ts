import { useArcReveal } from "@/components/ruixen/arc-reveal-hero";
import { usePerformance } from "@/hooks/usePerformance";

/**
 * Shared reveal gate for home-page sections.
 *
 * Sections play their entrance animations only while the intro arc reveal is
 * still running for first-time visitors (`phase !== "done"`); once the visitor
 * has already seen the scroll animations (`hasSeenScrollAnimations`) or is on
 * a low-tier device (`isLowTier`), `skip` short-circuits them to visible.
 *
 * Replaces the `useArcReveal() + usePerformance() + skip = a || b` triplet
 * that was copy-pasted across every home section.
 */
export function useSectionReveal(hasSeenScrollAnimations = false) {
  const phase = useArcReveal();
  const { isLowTier } = usePerformance();
  const skip = hasSeenScrollAnimations || isLowTier;

  return { phase, isLowTier, skip };
}
