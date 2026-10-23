import Link from "next/link";
import type { Service } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";

/**
 * Grid service card: art + team label + title + a short info teaser, with a
 * "Read more" link to the service's detail page and a "Discuss this project"
 * link to the contact section.
 */
export function ServiceGridCard({ service }: { service: Service }) {
  const { colors } = service;

  return (
    <div
      className="group relative overflow-hidden rounded-[18px] transition-[transform,box-shadow] duration-300 ease-[var(--ease-signature)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-28px_rgba(10,10,10,0.5)]"
      style={{ ["--accent" as string]: colors.highlight }}
    >
      <div className="relative aspect-[3/2]">
        <ServiceArt
          slug={service.slug}
          accent={colors.highlight}
          className="absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-[1.05]"
        />

        {/* legibility scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,8,6,0) 36%, rgba(10,8,6,0.6) 66%, rgba(10,8,6,0.9) 100%)",
          }}
        />

        {/* branded number badge */}
        <span
          className="absolute left-4 top-4 inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full border px-2 font-display text-[0.8rem] font-semibold tabular-nums"
          style={{
            background: colors.bg,
            color: colors.text,
            borderColor: "rgba(255,255,255,0.18)",
          }}
        >
          {service.number}
        </span>

        {/* content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="eyebrow text-[0.65rem] text-white/70">
            {service.teamLabel}
          </p>
          <h3 className="font-display mt-1 text-[1.05rem] font-semibold leading-tight text-white">
            {service.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-snug text-white/65">
            {service.description}
          </p>
          <div className="mt-3">
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-[0.72rem] font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-[#0A0A0A]"
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
