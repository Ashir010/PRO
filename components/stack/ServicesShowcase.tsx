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
  // Tablet+ (>=768px) uses the two-column panel and fits; phones use the
  // natural-height flow stack (media over text) so nothing is clipped.
  const wideEnough = useMediaQuery("(min-width: 768px)");
  const reduced = usePrefersReducedMotion();

  const canPin = mounted && tallEnough && wideEnough && !reduced;

  if (canPin) return <StackStage />;
  return <StackFallback animate={mounted && !reduced} />;
}
