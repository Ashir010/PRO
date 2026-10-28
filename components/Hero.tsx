import { site } from "@/data/services";
import { HeroGlow } from "@/components/media/HeroGlow";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-[#0a0605] text-white"
    >
      <HeroGlow />

      {/* legibility scrim — keeps text crisp over the brightest glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35"
      />

      <div className="shell relative z-10 flex min-h-[clamp(30rem,84vh,52rem)] flex-col justify-end pb-[clamp(2.5rem,7vh,5rem)] pt-[clamp(5rem,16vh,10rem)]">
        <p className="eyebrow text-vermilion">Creative production studio</p>

        <h1 className="font-display mt-6 max-w-[20ch] text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.025em] text-white">
          {site.hero.headline}
        </h1>
      </div>
    </section>
  );
}
