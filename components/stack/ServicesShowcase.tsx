"use client";

import { StackStage } from "@/components/stack/StackStage";
import { StackFallback } from "@/components/stack/StackFallback";
import { STACK } from "@/config/stack";
import { useMediaQuery, useMounted } from "@/lib/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * Chooses the showcase presentation:
 *  - pinned stage when mounted, the viewport is tall enough, and motion is allowed
 *  - otherwise the natural-flow fallback (reduced-motion / short screens / SSR)
 * Both render identical panel content, so nothing is lost and anchors work in
 * either mode.
 */
export function ServicesShowcase() {
  const mounted = useMounted();
  const tallEnough = useMediaQuery(`(min-height: ${STACK.minStageHeightPx}px)`);
  // Pinned stacking needs room for a full content-rich panel in one viewport.
  // Narrow viewports (mobile/portrait tablet) can't fit it without clipping, so
  // they use the natural-height flow stack — per the brief's narrow fallback.
  const wideEnough = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();

  const canPin = mounted && tallEnough && wideEnough && !reduced;

  if (canPin) return <StackStage />;
  return <StackFallback animate={mounted && !reduced} />;
}
