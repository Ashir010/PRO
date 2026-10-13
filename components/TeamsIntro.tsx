import { site, services } from "@/data/services";
import { ServiceIndexCard } from "@/components/services/ServiceIndexCard";

export function TeamsIntro() {
  return (
    <section
      aria-label="Our six specialist teams"
      className="shell pb-14 pt-6 sm:pb-20"
    >
      <div className="max-w-[48rem]">
        <h2 className="font-display text-[length:var(--text-title)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
          {site.teamsIntro.heading}
        </h2>
        <p className="mt-5 text-[length:var(--text-body-lg)] text-muted">
          {site.teamsIntro.support}
        </p>
      </div>

      <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id} className="flex">
            <ServiceIndexCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  );
}
