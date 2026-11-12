"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { services, type Service } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useServiceExpand } from "@/components/services/ServiceExpand";

const TOTAL = services.length;

/**
 * Sticky stacking-card scroll section (below the service grid).
 * Inspired by Skiper16 / StickyCard_001, adapted to ProMotion:
 *  - uses the installed `motion` package (Framer Motion) on native scroll
 *    (no Lenis added, to avoid changing global scroll behaviour)
 *  - one card per service, same order/colours as the grid
 *  - ~100svh of scroll per card; earlier cards scale down slightly (min 0.75)
 *  - respects prefers-reduced-motion (plain stacked list, no scaling)
 */
export function StackedServices() {
  const reduced = usePrefersReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section
      aria-label="A closer look at each team"
      style={{ scrollMarginTop: "var(--header-h)" }}
    >
      <div className="shell pb-6 pt-4 lg:pt-8">
        <p className="eyebrow text-muted">A closer look</p>
        <h2 className="font-display mt-4 max-w-[20ch] text-[length:var(--text-title)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
          Each team, in focus.
        </h2>
      </div>

      {/* Sticky stacking runs on every device (it's layout, not an animation).
          Under reduced motion we keep the stack but drop the scroll-linked
          scale. */}
      <div ref={container} className="relative">
        {/* Zero-height anchor markers at each card's active scroll position, so
            the grid cards can jump to the matching stacked card. */}
        {services.map((service, i) => (
          <span
            key={`marker-${service.id}`}
            id={`stack-${service.slug}`}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 block h-0 w-0"
            style={{ top: `${i * 100}svh`, scrollMarginTop: "var(--header-h)" }}
          />
        ))}

        {services.map((service, i) => (
          <StickyCard
            key={service.id}
            i={i}
            service={service}
            progress={scrollYProgress}
            range={[i / TOTAL, 1]}
            targetScale={Math.max(0.75, 1 - (TOTAL - i - 1) * 0.05)}
            reduced={reduced}
          />
        ))}
      </div>
    </section>
  );
}

function StickyCard({
  i,
  service,
  progress,
  range,
  targetScale,
  reduced,
}: {
  i: number;
  service: Service;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  reduced: boolean;
}) {
  const scaleMV = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center px-4">
      <motion.div
        style={{
          scale: reduced ? 1 : scaleMV,
          // stepped offset for the peek, re-centred so the deck sits mid-viewport
          top: `calc(${i * 22}px - 50px)`,
          zIndex: i,
        }}
        className="relative w-full max-w-[1000px] origin-top"
      >
        <ServiceStackCard service={service} />
      </motion.div>
    </div>
  );
}

/**
 * The card visual — same dark style as the grid cards. The media area uses the
 * art-directed placeholder over a dark gradient (so there are no 404s). To use
 * real media, drop a file at public/images/services/<slug>.jpg (or .mp4) and
 * replace <ServiceArt> with a next/image / <video> here.
 */
function ServiceStackCard({ service }: { service: Service }) {
  const { colors } = service;
  const { open } = useServiceExpand();

  return (
    <article
      className="relative grid grid-cols-1 overflow-hidden rounded-[32px] shadow-[0_36px_70px_-34px_rgba(36,36,36,0.24)] md:h-[480px] md:grid-cols-2"
      style={{
        ["--accent" as string]: colors.highlight,
        background: colors.bg,
        color: colors.text,
        boxShadow: `inset 0 0 0 1px ${colors.line}, 0 36px 70px -34px rgba(36,36,36,0.24)`,
      }}
    >
      {/* Text */}
      <div className="relative z-10 flex flex-col justify-center gap-8 p-7 sm:p-9 md:p-10">
        <div className="flex items-center justify-between">
          <span
            className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border px-2 font-display text-[0.85rem] font-semibold tabular-nums"
            style={{
              background: colors.bg,
              color: colors.text,
              borderColor: colors.line,
            }}
          >
            {service.number}
          </span>
          <span className="eyebrow" style={{ color: colors.muted }}>
            {service.number} / {String(TOTAL).padStart(2, "0")}
          </span>
        </div>

        <div>
          <p className="eyebrow" style={{ color: colors.muted }}>{service.teamLabel}</p>
          <h3 className="font-display mt-2 text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-tight">
            {service.title}
          </h3>
          <p className="mt-3 max-w-[42ch] text-[0.975rem] leading-snug" style={{ color: colors.muted }}>
            {service.description}
          </p>
          <div className="mt-6 flex flex-col items-start gap-4">
            <button
              type="button"
              onClick={(e) => {
                const card = (e.currentTarget as HTMLElement).closest("article");
                open(service.slug, card ? card.getBoundingClientRect() : null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-opacity duration-300 hover:opacity-85"
              style={{
                background: colors.dark ? "#FFFFFF" : "#171827",
                color: colors.dark ? colors.bg : "#FFFFFF",
              }}
            >
              Read more
              <span aria-hidden="true">→</span>
            </button>
            <Link
              href="#contact"
              className="ul-link inline-flex items-center gap-1.5 text-[0.9rem] font-semibold"
              style={{ color: colors.text }}
            >
              Discuss this project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Media — dark tile inset in the light glossy card */}
      <div className="relative z-10 p-4 sm:p-5">
        <div
          className="relative h-full min-h-[220px] overflow-hidden rounded-[22px] md:min-h-0"
          style={{ background: colors.dark ? "#171827" : "#FFFFFF" }}
        >
          <ServiceArt
            slug={service.slug}
            accent={colors.highlight}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </article>
  );
}

/**
 * Skiper 16 — StickyCard_001 (inspiration for this component).
 * We respect the original creators. This is an inspired rebuild with our own
 * taste and does not claim any ownership.
 *
 * Author: @gurvinder-singh02 · https://gxuri.me · https://x.com/Gur__vi
 * Skiper UI — attribution required for the free version.
 */
