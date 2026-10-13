"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { services } from "@/data/services";
import { ServicePanel } from "@/components/services/ServicePanel";
import { ServiceSectionContent } from "@/components/services/ServiceSectionContent";
import { ProgressRail } from "@/components/services/ProgressRail";
import { useMediaQuery, useMounted } from "@/lib/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * Chooses the presentation for the six service sections:
 *  - Desktop (>=1024px) + motion allowed  -> sticky stacked panels.
 *  - Otherwise (mobile/tablet OR reduced-motion OR pre-hydration) -> a clean
 *    natural-flow vertical sequence. Both render identical content, so nothing
 *    is lost and anchor links land correctly in either mode.
 */
export function ServiceStack() {
  const mounted = useMounted();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();

  const sticky = mounted && isDesktop && !reduced;

  if (sticky) return <StickyStack />;
  return <FlowStack animate={mounted && !reduced} />;
}

function StickyStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      services.length - 1,
      Math.max(0, Math.round(v * (services.length - 1))),
    );
    setActive(idx);
  });

  return (
    <div ref={containerRef} className="relative">
      <ProgressRail active={active} />
      {services.map((service, i) => (
        <ServicePanel
          key={service.id}
          service={service}
          index={i}
          isLast={i === services.length - 1}
        />
      ))}
    </div>
  );
}

function FlowStack({ animate }: { animate: boolean }) {
  return (
    <div>
      {services.map((service) => (
        <section
          key={service.id}
          id={service.slug}
          aria-label={`${service.title} — ${service.teamLabel}`}
          className="border-t py-14 sm:py-16"
          style={
            {
              "--accent": service.accent.hex,
              scrollMarginTop: "var(--header-h)",
              borderTopColor:
                "color-mix(in srgb, var(--accent) 30%, var(--color-hairline))",
            } as React.CSSProperties
          }
        >
          {animate ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ServiceSectionContent service={service} />
            </motion.div>
          ) : (
            <ServiceSectionContent service={service} />
          )}
        </section>
      ))}
    </div>
  );
}
