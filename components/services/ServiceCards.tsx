import { services } from "@/data/services";
import { ServiceGridCard } from "@/components/services/ServiceGridCard";

/**
 * Six service cards shown between the hero and contact. Image-forward cards
 * (art + overlaid title/team) with a short info teaser, a "Read more" that
 * reveals full info in place, and a "Discuss this project" link.
 */
export function ServiceCards() {
  return (
    <section
      id="services"
      aria-label="Our six specialist teams"
      className="shell pb-20 pt-8 lg:pb-28 lg:pt-10"
      style={{ scrollMarginTop: "var(--header-h)" }}
    >
      <p className="eyebrow text-white/55">What we do</p>
      <h2 className="font-display mt-4 max-w-[20ch] text-[length:var(--text-title)] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
        Each discipline, its own team.
      </h2>

      <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id}>
            <ServiceGridCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  );
}
