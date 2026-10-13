"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Service } from "@/data/services";
import { ServiceSectionContent } from "@/components/services/ServiceSectionContent";

/**
 * One sticky panel in the desktop stack. The *rise and cover* is produced by
 * native `position: sticky` + document flow (so scrolling, keyboard and anchor
 * links keep working). Framer Motion only adds the subtle depth of the panel
 * being covered: as the next panel rises over it, this one eases to 96% scale
 * and 90% opacity so a readable margin stays visible behind. The last panel
 * never recedes (nothing covers it). Transform + opacity only.
 */
export function ServicePanel({
  service,
  index,
  isLast,
}: {
  service: Service;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  // 0 when this panel pins at the top, 1 when it is fully covered by the next.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.9]);

  return (
    <motion.section
      ref={ref}
      id={service.slug}
      aria-label={`${service.title} — ${service.teamLabel}`}
      className="sticky top-0 flex h-[100svh] items-center overflow-hidden rounded-t-[1.75rem] border-t bg-bg will-change-transform"
      style={
        {
          "--accent": service.accent.hex,
          zIndex: index + 1,
          scale,
          opacity,
          transformOrigin: "center top",
          scrollMarginTop: "var(--header-h)",
          paddingTop: "var(--header-h)",
          borderTopColor:
            "color-mix(in srgb, var(--accent) 32%, var(--color-hairline))",
          boxShadow: "0 -14px 34px -26px rgba(26,25,23,0.55)",
        } as unknown as React.CSSProperties
      }
    >
      <ServiceSectionContent service={service} />
    </motion.section>
  );
}
