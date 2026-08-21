import type { JSX } from "react";

export type SponsorTier =
  | "osp"
  | "platinum"
  | "gold"
  | "silver"
  | "spark_supporter";

export interface Sponsor {
  id: string;
  name: string;
  url: string;
  logo?: (props: React.ComponentProps<"svg">) => JSX.Element;
  svgPath?: string;
  darkSvgPath?: string;
  invertInDark?: boolean;
  tier: SponsorTier;
  description?: string;
}

export const SPONSOR_TIERS = [
  { name: "osp", title: "Open Source Program" },
  { name: "platinum", title: "Platinum Sponsors" },
  { name: "gold", title: "Gold Sponsors" },
  { name: "silver", title: "Silver Sponsors" },
  { name: "spark_supporter", title: "Spark Supporters" },
] as const;

/**
 * Initially empty sponsor list for the portfolio, ready for community backers.
 */
export const SPONSORS: Sponsor[] = [];
