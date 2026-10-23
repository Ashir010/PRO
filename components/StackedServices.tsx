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
      className="bg-peach"
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
    <div className="sticky top-0 flex h-[100svh] items-start justify-center px-4">
      <motion.div
        style={{
          scale: reduced ? 1 : scaleMV,
          // small stepped offset so every card stays fully visible and peeks
          top: `calc(10svh + ${i * 24}px)`,
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

  return (
    <article
      className="relative grid grid-cols-1 overflow-hidden rounded-[32px] text-ink ring-1 ring-black/5 shadow-[0_36px_70px_-34px_rgba(90,60,40,0.38)] md:h-[520px] md:grid-cols-2"
      style={{
        ["--accent" as string]: colors.highlight,
        background:
          "linear-gradient(155deg,#FFFFFF 0%,#FBF3EC 52%,#F3E6DB 100%)",
      }}
    >
      {/* glossy top highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(255,255,255,0.8) 0%,rgba(255,255,255,0) 40%)",
        }}
      />

      {/* Text */}
      <div className="relative z-10 flex flex-col justify-center gap-8 p-7 sm:p-9 md:p-10">
        <div className="flex items-center justify-between">
          <span
            className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border px-2 font-display text-[0.85rem] font-semibold tabular-nums"
            style={{
              background: colors.bg,
              color: colors.text,
              borderColor: "rgba(10,10,10,0.08)",
            }}
          >
            {service.number}
          </span>
          <span className="eyebrow text-ink/40">
            {service.number} / {String(TOTAL).padStart(2, "0")}
          </span>
        </div>

        <div>
          <p className="eyebrow text-ink/55">{service.teamLabel}</p>
          <h3 className="font-display mt-2 text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-tight text-ink">
            {service.title}
          </h3>
          <p className="mt-3 max-w-[42ch] text-[0.975rem] leading-snug text-ink/65">
            {service.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[0.9rem] font-semibold text-peach transition-opacity duration-300 hover:opacity-85"
            >
              Read more
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="#contact"
              className="ul-link inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink"
            >
              Discuss this project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Media — dark tile inset in the light glossy card */}
      <div className="relative z-10 p-4 sm:p-5">
        <div className="relative h-full min-h-[220px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1b1510] to-[#050505] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:min-h-0">
          <ServiceArt
            slug={service.slug}
            accent={colors.highlight}
            className="absolute inset-0 h-full w-full"
          />
          <span className="eyebrow absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.6rem] text-white/80">
            Placeholder
          </span>
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
