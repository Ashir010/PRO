import Link from "next/link";
import { site } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#F7F5F0] text-[#242424]">
      {/* subtle scrim so the headline stays crisp over the glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#F7F5F0]/80"
      />

      {/* The art is a real service illustration, not a decorative mockup. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-8vw] top-[12%] z-0 hidden w-[min(48vw,42rem)] md:block"
      >
        <div className="absolute inset-x-[12%] top-[8%] aspect-square rotate-[7deg] rounded-[2rem] border border-[#E5E1DA] bg-white p-3 shadow-[0_40px_100px_-40px_rgba(36,36,36,0.16)]">
          <div className="relative h-full overflow-hidden rounded-[1.4rem] border border-[#E5E1DA] bg-white">
            <ServiceArt
              slug="saas-motion-graphics"
              accent="#E66B4B"
              className="h-full w-full scale-110"
            />
          </div>
        </div>
        <div className="absolute bottom-[10%] left-[4%] h-24 w-24 rounded-full border border-[#E66B4B]/25 bg-[#E66B4B]/10" />
      </div>

      <div className="shell relative z-10 isolate flex min-h-[clamp(34rem,70vh,44rem)] flex-col justify-start pb-20 pt-[calc(var(--header-h)+3rem)]">
        <p className="eyebrow text-[#E66B4B]">Creative production studio</p>

        <h1 className="font-display mt-6 max-w-[19ch] text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#242424]">
          {site.hero.headline}
        </h1>
        <p className="mt-5 max-w-[54ch] text-[length:var(--text-body-lg)] text-[#242424]">
          {site.hero.support}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="#contact" className="inline-flex rounded-full bg-[#171827] px-6 py-3 text-[0.95rem] font-semibold text-white transition-opacity hover:opacity-90">
            Start a project
          </Link>
          <Link href="#services" className="inline-flex rounded-full border border-[#242424] px-6 py-3 text-[0.95rem] font-semibold text-[#242424] transition-colors hover:border-[#E66B4B] hover:text-[#E66B4B]">
            Explore services
          </Link>
        </div>
      </div>
    </section>
  );
}
