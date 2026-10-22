import { site } from "@/data/services";

export function Hero() {
  return (
    <section
      id="top"
      className="shell flex flex-col pt-[clamp(2.5rem,10vh,6.5rem)] pb-[clamp(1.5rem,4vh,3rem)]"
    >
      <p className="eyebrow text-muted">Creative production studio</p>

      <h1 className="font-display mt-6 max-w-[20ch] text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.025em] text-ink">
        {site.hero.headline}
      </h1>
    </section>
  );
}
