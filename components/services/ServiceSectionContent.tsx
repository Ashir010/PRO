import type { Service } from "@/data/services";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ArrowLink, SectionNumber, TeamLabel } from "@/components/ui/bits";

/**
 * The inner content of one service section. Identical structure for all six
 * services (only copy/accent/motif differ), and reused verbatim by both the
 * sticky desktop stack and the natural-flow fallback — so nothing is ever lost
 * and the two paths can't drift apart.
 *
 * Designed to fit within one viewport (100svh) at >=1024px.
 */
export function ServiceSectionContent({ service }: { service: Service }) {
  const [primary, ...details] = service.media;

  return (
    <div className="shell grid h-full grid-cols-1 items-center gap-x-12 gap-y-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Text column */}
      <div className="min-w-0">
        <div className="flex items-center gap-4">
          <SectionNumber>{service.number}</SectionNumber>
          <span className="h-px w-8" style={{ background: "var(--accent)" }} />
          <TeamLabel>{service.teamLabel}</TeamLabel>
        </div>

        <h2 className="font-display mt-5 text-[length:var(--text-h2)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
          {service.title}
        </h2>

        <p className="mt-4 max-w-[46ch] text-[length:var(--text-body-lg)] text-muted">
          {service.longDesc}
        </p>

        <p className="eyebrow mt-7 text-faint">{service.useCasesLabel}</p>
        <ul className="mt-3 grid list-none grid-cols-1 gap-y-1.5 p-0 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {service.useCases.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-[0.975rem] text-ink"
            >
              <span
                aria-hidden="true"
                className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <ArrowLink href="#contact" className="text-ink">
            Discuss a project
          </ArrowLink>
        </div>
      </div>

      {/* Media showcase */}
      <div className="min-w-0">
        <MediaFrame slot={primary} motif={service.motif} index={0} />
        <div className="mt-4 grid grid-cols-2 gap-4">
          {details.map((slot, i) => (
            <MediaFrame
              key={slot.key}
              slot={slot}
              motif={service.motif}
              index={i + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
