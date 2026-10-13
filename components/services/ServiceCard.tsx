import Link from "next/link";
import type { Service } from "@/data/services";
import { ServicePlaceholder } from "@/components/media/ServicePlaceholder";
import { SectionNumber, TeamLabel } from "@/components/ui/bits";

/**
 * One service card. Identical structure/size for every service so no team
 * dominates. Hover interaction is pure CSS (group-hover) — no client JS.
 * The whole card is a link that smooth-scrolls to the matching section.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`#${service.slug}`}
      aria-label={`${service.title} — jump to section`}
      className="group flex h-full flex-col rounded-xl border bg-surface p-6 transition-[transform,box-shadow] duration-300 ease-[var(--ease-signature)] hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(26,25,23,0.35)] focus-visible:-translate-y-1"
      style={{ ["--accent" as string]: service.accent.hex }}
    >
      <div className="flex items-center justify-between">
        <SectionNumber>{service.number}</SectionNumber>
        <TeamLabel>{service.teamLabel}</TeamLabel>
      </div>

      <div
        className="mt-5 flex items-center justify-center overflow-hidden rounded-md border p-5"
        style={{
          aspectRatio: "16 / 9",
          background:
            "color-mix(in srgb, var(--accent) 6%, var(--color-surface))",
          borderColor:
            "color-mix(in srgb, var(--accent) 16%, var(--color-hairline))",
        }}
      >
        <div className="h-full w-full opacity-80 transition-opacity duration-300 group-hover:opacity-100">
          <ServicePlaceholder motif={service.motif} />
        </div>
      </div>

      <h3 className="font-display mt-5 text-[1.4rem] font-medium leading-tight text-ink">
        {service.title}
      </h3>
      <p className="mt-2 text-[0.975rem] text-muted">{service.shortDesc}</p>

      <span className="ul-link mt-auto pt-5 text-[0.9rem] font-medium text-ink">
        Explore
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
