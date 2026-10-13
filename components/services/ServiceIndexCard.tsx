import Link from "next/link";
import type { Service } from "@/data/services";

/**
 * Compact index card that scrolls to a service panel's docked marker.
 * Identical size for all six; pure-CSS hover (no client JS).
 */
export function ServiceIndexCard({ service }: { service: Service }) {
  return (
    <Link
      href={`#${service.slug}`}
      aria-label={`${service.title} — jump to section`}
      className="group flex h-full flex-col rounded-xl border border-hairline bg-white/60 p-5 transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-signature)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_-26px_rgba(10,10,10,0.4)] focus-visible:-translate-y-1"
      style={{ ["--accent" as string]: service.colors.highlight }}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="font-display text-[0.8rem] font-semibold tabular-nums tracking-widest"
          style={{ color: service.colors.highlight }}
        >
          {service.number}
        </span>
        <span className="eyebrow text-muted">{service.teamLabel}</span>
      </div>

      <h3 className="font-display mt-4 text-[1.15rem] font-semibold leading-tight text-ink">
        {service.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[0.9rem] leading-snug text-muted">
        {service.description}
      </p>

      <span className="ul-link mt-auto pt-4 text-[0.85rem] font-semibold text-ink">
        View
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
