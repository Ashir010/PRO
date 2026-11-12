import { site } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden text-white">
      {/* subtle scrim so the headline stays crisp over the glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#1B0416]/70 via-transparent to-[#1B0416]/20"
      />

      {/* The art is a real service illustration, not a decorative mockup. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-8vw] top-[12%] z-0 hidden w-[min(48vw,42rem)] md:block"
      >
        <div className="absolute inset-x-[12%] top-[8%] aspect-square rotate-[7deg] rounded-[2rem] border border-[#E7B0DE]/20 bg-[#400849]/30 p-3 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm">
          <div className="relative h-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-[#521057] to-[#1B0416]">
            <ServiceArt
              slug="saas-motion-graphics"
              accent="#FF5A0A"
              className="h-full w-full scale-110"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,90,10,0.2),transparent_24%)]" />
          </div>
        </div>
        <div className="absolute bottom-[10%] left-[4%] h-24 w-24 rounded-full border border-[#E7B0DE]/25 bg-[#E7B0DE]/10 shadow-[0_0_70px_rgba(231,176,222,0.22)]" />
      </div>

      <div className="shell relative z-10 isolate flex min-h-[clamp(30rem,84vh,52rem)] flex-col justify-end pb-[clamp(2.5rem,7vh,5rem)] pt-[clamp(5rem,16vh,10rem)]">
        <p className="eyebrow text-vermilion">Creative production studio</p>

        <h1 className="font-display mt-6 max-w-[19ch] text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.025em] text-white">
          {site.hero.headline}
        </h1>
      </div>
    </section>
  );
}
