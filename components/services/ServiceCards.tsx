import Link from "next/link";
import { services } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";

/**
 * Six service cards shown between the hero and contact. Image-forward portrait
 * cards (art + overlaid title/team), each a branded number badge, with a hover
 * lift and media zoom. The whole card links to the contact section.
 */
export function ServiceCards() {
  return (
    <section
      id="services"
      aria-label="Our six specialist teams"
      className="shell pb-20 pt-8 lg:pb-28 lg:pt-10"
      style={{ scrollMarginTop: "var(--header-h)" }}
    >
      <p className="eyebrow text-muted">What we do</p>
      <h2 className="font-display mt-4 max-w-[20ch] text-[length:var(--text-title)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
        Each discipline, its own team.
      </h2>

      <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const { colors } = service;
          return (
            <li key={service.id}>
              <Link
                href="#contact"
                aria-label={`${service.title} — ${service.teamLabel}. Start a project.`}
                className="group relative block overflow-hidden rounded-[18px] outline-none ring-offset-2 ring-offset-peach transition-[transform,box-shadow] duration-300 ease-[var(--ease-signature)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-28px_rgba(10,10,10,0.5)] focus-visible:-translate-y-1.5"
                style={{ ["--accent" as string]: colors.highlight }}
              >
                <div className="relative aspect-[16/9]">
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
                        "linear-gradient(180deg, rgba(10,8,6,0) 42%, rgba(10,8,6,0.55) 72%, rgba(10,8,6,0.85) 100%)",
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

                  {/* title + team label */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="eyebrow text-[0.65rem] text-white/70">
                      {service.teamLabel}
                    </p>
                    <h3 className="font-display mt-1 text-[1.05rem] font-semibold leading-tight text-white">
                      {service.title}
                    </h3>
                    <span className="ul-link mt-2 inline-flex text-[0.8rem] font-semibold text-white">
                      Discuss this project
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
