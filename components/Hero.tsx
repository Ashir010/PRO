import { site } from "@/data/services";

export function Hero() {
  return (
    <section
      id="top"
      className="shell flex min-h-[56svh] flex-col justify-center pb-10 pt-[clamp(2rem,7vh,4.5rem)]"
    >
      <p className="eyebrow text-muted">Creative production studio</p>

      <h1 className="font-display mt-6 max-w-[20ch] text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.025em] text-ink">
        {site.hero.headline}
      </h1>
    </section>
  );
}
