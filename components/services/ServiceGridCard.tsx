import Link from "next/link";
import type { Service } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";

/**
 * Grid service card: art + team label + title + a short info teaser. The whole
 * card links to the service's detail page.
 */
export function ServiceGridCard({ service }: { service: Service }) {
  const { colors } = service;

  return (
    <Link
      href={`#stack-${service.slug}`}
      aria-label={`${service.title} — jump to card`}
      className="group relative block overflow-hidden rounded-[18px] outline-none ring-1 ring-[#DC4D01]/15 ring-offset-2 ring-offset-white transition-[transform,box-shadow] duration-300 ease-[var(--ease-signature)] hover:-translate-y-1.5 hover:shadow-[0_26px_60px_-24px_rgba(105,44,11,0.32)] focus-visible:-translate-y-1.5"
      style={{ ["--accent" as string]: colors.highlight }}
    >
      <div className="relative aspect-[3/2]">
        <ServiceArt
          slug={service.slug}
          accent={colors.highlight}
          className="absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-[1.05]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.5),transparent_32%,transparent_70%,rgba(220,77,1,0.12))] opacity-70"
        />

        {/* legibility scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 36%, rgba(255,255,255,0.78) 66%, rgba(255,255,255,0.96) 100%)",
          }}
        />

        {/* branded number badge */}
        <span
          className="absolute left-4 top-4 inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full border px-2 font-display text-[0.8rem] font-semibold tabular-nums"
          style={{
            background: colors.bg,
            color: colors.text,
            borderColor: "rgba(27,21,16,0.1)",
          }}
        >
          {service.number}
        </span>

        {/* content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="eyebrow text-[0.65rem] text-muted">
            {service.teamLabel}
          </p>
          <h3 className="font-display mt-1 text-[1.05rem] font-semibold leading-tight text-ink">
            {service.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-snug text-muted">
            {service.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
