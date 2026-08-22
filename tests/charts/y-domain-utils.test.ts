import { describe, expect, it } from "vitest";
import { Y_DOMAIN_TWEEN_SKIP_THRESHOLD } from "@/components/charts/chart-phase";
import {
  computeYDomainsByAxis,
  domainsEqual,
  isLoadingChromePhase,
  isLoadingGridChromePhase,
  isReferenceAreaVisiblePhase,
  isYDomainTweenPhase,
  mergeYDomainRecords,
  niceYDomain,
  resolveAnimatedYDestinationDomains,
  shouldTweenYDomain,
} from "@/components/charts/y-domain-utils";

describe("niceYDomain", () => {
  it("snaps raw endpoints to tick-friendly bounds", () => {
    expect(niceYDomain([3, 97])).toEqual([0, 100]);
  });

  it("keeps already-nice domains stable", () => {
    expect(niceYDomain([0, 100])).toEqual([0, 100]);
  });
});

describe("shouldTweenYDomain", () => {
  it("skips tweening for sub-threshold nudges", () => {
    expect(shouldTweenYDomain([0, 100], [0.0001, 100.0001])).toBe(false);
  });

  it("tweens once any endpoint moves past the threshold", () => {
    const bigShift: [number, number] = [0, 100 * (1 + Y_DOMAIN_TWEEN_SKIP_THRESHOLD * 2)];
    expect(shouldTweenYDomain([0, 100], bigShift)).toBe(true);
  });
});

describe("phase predicates", () => {
  it("loading chrome covers loading and revealingLoading only", () => {
    expect(isLoadingChromePhase("loading")).toBe(true);
    expect(isLoadingChromePhase("revealingLoading")).toBe(true);
    expect(isLoadingChromePhase("ready")).toBe(false);
  });

  it("grid chrome includes exiting", () => {
    expect(isLoadingGridChromePhase("exiting")).toBe(true);
    expect(isLoadingGridChromePhase("ready")).toBe(false);
  });

  it("y tween phases are the gridTween pair", () => {
    expect(isYDomainTweenPhase("gridTweenLoading")).toBe(true);
    expect(isYDomainTweenPhase("gridTweenReady")).toBe(true);
    expect(isYDomainTweenPhase("loading")).toBe(false);
  });

  it("reference areas show in ready-family phases", () => {
    expect(isReferenceAreaVisiblePhase("ready")).toBe(true);
    expect(isReferenceAreaVisiblePhase("gridTweenReady")).toBe(true);
    expect(isReferenceAreaVisiblePhase("exiting")).toBe(false);
  });
});

describe("resolveAnimatedYDestinationDomains", () => {
  const skeleton = { left: [0, 1] as [number, number] };
  const target = { left: [0, 200] as [number, number] };

  it("uses skeleton domains while loading/exiting", () => {
    expect(resolveAnimatedYDestinationDomains("loading", skeleton, target)).toBe(skeleton);
    expect(resolveAnimatedYDestinationDomains("exiting", skeleton, target)).toBe(skeleton);
    expect(resolveAnimatedYDestinationDomains("gridTweenLoading", skeleton, target)).toBe(skeleton);
  });

  it("uses target domains once ready", () => {
    expect(resolveAnimatedYDestinationDomains("ready", skeleton, target)).toBe(target);
    expect(resolveAnimatedYDestinationDomains("revealing", skeleton, target)).toBe(target);
    expect(resolveAnimatedYDestinationDomains("gridTweenReady", skeleton, target)).toBe(target);
  });
});

describe("computeYDomainsByAxis", () => {
  it("falls back to a default left domain when there are no lines", () => {
    const domains = computeYDomainsByAxis({ lines: [], resolveDomain: () => [0, 100] });
    expect(domains.left).toBeDefined();
  });
});

describe("merge + equality", () => {
  it("merges records without clobbering distinct axes", () => {
    const merged = mergeYDomainRecords(
      { left: [0, 1] },
      { right: [0, 2] }
    );
    expect(merged).toEqual({ left: [0, 1], right: [0, 2] });
  });

  it("domainsEqual is exact", () => {
    expect(domainsEqual({ left: [0, 1] }, { left: [0, 1] })).toBe(true);
    expect(domainsEqual({ left: [0, 1] }, { left: [0, 2] })).toBe(false);
    expect(domainsEqual({ left: [0, 1] }, {})).toBe(false);
  });
});
