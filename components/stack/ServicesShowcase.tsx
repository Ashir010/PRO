import { services } from "@/data/services";
import { ServicePanel } from "@/components/services/ServicePanel";
import { PANEL_COUNT, STACK } from "@/config/stack";

/**
 * Stacked-card showcase using pure CSS `position: sticky` (see globals.css).
 * Server component — no JS, no hydration gate, works on first paint at every
 * viewport and under reduced motion. Each panel pins and the next rises from
 * below to cover it; increasing z-index keeps later panels on top while earlier
 * ones stay pinned behind; each card is offset by `index * peek` for the deck.
 */
export function ServicesShowcase() {
  return (
    <div
      id="services"
      className="services-stack"
      style={
        {
          "--stack-peek": `${STACK.peekPx}px`,
          "--stack-bottom": `${STACK.bottomGapPx}px`,
          "--stack-count": PANEL_COUNT,
          "--stack-inset": `${STACK.sideInsetVw}vw`,
          "--stack-slot": `${STACK.slotVh}svh`,
        } as React.CSSProperties
      }
    >
      {services.map((service, i) => (
        <section
          key={service.id}
          id={service.slug}
          aria-label={`${service.title} — ${service.teamLabel}`}
          className="service-panel"
          style={
            {
              zIndex: i + 1,
              "--i": i,
              scrollMarginTop: "var(--header-h)",
            } as React.CSSProperties
          }
        >
          <div className="service-card">
            <ServicePanel service={service} />
          </div>
        </section>
      ))}
    </div>
  );
}
