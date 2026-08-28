"use client";

import { useEffect } from "react";
import { type UseEmblaCarouselType } from "embla-carousel-react";

type CarouselApi = UseEmblaCarouselType[1];

/**
 * Real-time height morphing hook for Embla Carousel.
 * Dynamically calculates and animates the container height in real-time
 * as the user drags horizontally between slides based on scrollProgress.
 */
export function useCarouselMorphHeight(api: CarouselApi | undefined) {
  useEffect(() => {
    if (!api) return;

    const root = api.rootNode();
    const slides = api.slideNodes();
    if (!root || slides.length === 0) return;

    let isPointerDown = false;
    let animFrame: number;

    const getSlideHeights = () => {
      return slides.map((slide) => {
        let totalH = slide.scrollHeight;
        if (slide.children.length > 0) {
          let sumH = 0;
          for (let i = 0; i < slide.children.length; i++) {
            const child = slide.children[i] as HTMLElement;
            sumH += child.offsetHeight || child.scrollHeight || 0;
          }
          totalH = Math.max(totalH, sumH, slide.offsetHeight);
        }
        return totalH;
      });
    };

    const updateHeight = () => {
      const heights = getSlideHeights();
      if (!heights[0] && !heights[1]) return;

      const progress = Math.max(0, Math.min(1, api.scrollProgress()));
      const h0 = heights[0] || 0;
      const h1 = heights[1] || h0;

      // Real-time linear interpolation between slide 0 and slide 1
      const currentH = h0 + (h1 - h0) * progress;

      if (isPointerDown) {
        root.style.transition = "none";
      } else {
        root.style.transition = "height 340ms cubic-bezier(0.33, 1, 0.68, 1)";
      }
      root.style.height = `${currentH}px`;
    };

    const onScroll = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(updateHeight);
    };

    const onPointerDown = () => {
      isPointerDown = true;
      root.style.transition = "none";
    };

    const onPointerUp = () => {
      isPointerDown = false;
      root.style.transition = "height 340ms cubic-bezier(0.33, 1, 0.68, 1)";
      const index = api.selectedScrollSnap();
      const heights = getSlideHeights();
      if (heights[index]) {
        root.style.height = `${heights[index]}px`;
      }
    };

    const onSettle = () => {
      isPointerDown = false;
      root.style.transition = "height 340ms cubic-bezier(0.33, 1, 0.68, 1)";
      const index = api.selectedScrollSnap();
      const heights = getSlideHeights();
      if (heights[index]) {
        root.style.height = `${heights[index]}px`;
      }
    };

    // Initial height sync
    updateHeight();

    api.on("scroll", onScroll);
    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);
    api.on("settle", onSettle);
    api.on("select", onSettle);
    api.on("reInit", updateHeight);

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    slides.forEach((slide) => {
      resizeObserver.observe(slide);
      for (let i = 0; i < slide.children.length; i++) {
        resizeObserver.observe(slide.children[i]);
      }
    });

    return () => {
      cancelAnimationFrame(animFrame);
      api.off("scroll", onScroll);
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
      api.off("settle", onSettle);
      api.off("select", onSettle);
      api.off("reInit", updateHeight);
      resizeObserver.disconnect();
    };
  }, [api]);
}
