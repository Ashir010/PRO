"use client";

import { useCallback, useRef } from "react";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { services } from "@/data/services";
import { ServicePanel } from "@/components/services/ServicePanel";
import {
  PANEL_HEIGHT_CSS,
  STACK,
  dockedOffsetPx,
  markerVh,
  runwayVh,
  travelWindowVh,
} from "@/config/stack";

const EASE = cubicBezier(...STACK.ease);

/**
 * Pinned-stage stacked showcase. A tall runway holds one sticky 100svh stage;
 * panels are absolutely positioned and rise via scroll-linked transforms with a
 * hold phase before each rise. Earlier panels stay docked (no scale/fade); a
 * faint overlay dims covered panels. Zero-height markers anchor each panel.
 */
export function StackStage() {
  // Pinned stage only runs at >=1024px (see ServicesShowcase), so desktop slot.
  const slotVh = STACK.slotVh;
  const count = services.length;
  const R = runwayVh(count, slotVh);

  const runwayRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // Track which panel is docked (ref only — no re-render needed).
  const activeRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const currentVh = p * R;
    let a = 0;
    for (let j = 1; j < count; j++) {
      if (currentVh >= markerVh(j, slotVh)) a = j;
    }
    activeRef.current = a;
  });

  // Keyboard/SR: if focus enters a panel that isn't docked, scroll to it so
  // focus never rests on a visually-covered control. All panels stay in the DOM
  // in reading order.
  const onFocusCapture = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const panel = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-panel-index]",
    );
    if (!panel) return;
    const idx = Number(panel.dataset.panelIndex);
    if (idx === activeRef.current) return;
    document.getElementById(services[idx].slug)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div
      ref={runwayRef}
      id="services"
      className="relative"
      style={{ height: `calc(${R}svh + 100svh)` }}
    >
      {services.map((s, j) => (
        <span
          key={s.id}
          id={s.slug}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 block h-0 w-0"
          style={{
            top: `${markerVh(j, slotVh)}svh`,
            scrollMarginTop: "var(--header-h)",
          }}
        />
      ))}

      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        onFocusCapture={onFocusCapture}
      >
        {services.map((_, j) => (
          <StagePanel
            key={services[j].id}
            index={j}
            count={count}
            slotVh={slotVh}
            runway={R}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

function StagePanel({
  index,
  count,
  slotVh,
  runway,
  progress,
}: {
  index: number;
  count: number;
  slotVh: number;
  runway: number;
  progress: MotionValue<number>;
}) {
  const service = services[index];

  const [tStart, tEnd] = index === 0 ? [0, 0] : travelWindowVh(index, slotVh);
  const yInput = index === 0 ? [0, 1] : [0, tStart / runway, tEnd / runway, 1];
  const yOutput = index === 0 ? ["0%", "0%"] : ["112%", "112%", "0%", "0%"];
  const y = useTransform(progress, yInput, yOutput, { ease: EASE });

  const covered = index < count - 1;
  const [nStart, nEnd] = covered ? travelWindowVh(index + 1, slotVh) : [0, 1];
  const dim = useTransform(
    progress,
    covered ? [nStart / runway, nEnd / runway] : [0, 1],
    covered ? [0, STACK.dimCovered] : [0, 0],
  );

  return (
    <motion.div
      data-panel-index={index}
      className="absolute will-change-transform"
      style={{
        y,
        top: dockedOffsetPx(index),
        left: `${STACK.sideInsetVw}vw`,
        right: `${STACK.sideInsetVw}vw`,
        height: PANEL_HEIGHT_CSS,
        zIndex: index,
      }}
    >
      <ServicePanel service={service} mode="stage" />
      {covered && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ opacity: dim, background: "#000", borderRadius: STACK.radiusPx }}
        />
      )}
    </motion.div>
  );
}
