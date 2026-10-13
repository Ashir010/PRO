import Link from "next/link";
import { site } from "@/data/services";

export function Hero() {
  return (
    <section
      id="top"
      className="shell flex min-h-[88svh] flex-col justify-center pb-16 pt-[clamp(3rem,10vh,7rem)]"
    >
      <p className="eyebrow text-muted">Creative production studio</p>

      <h1 className="font-display mt-6 max-w-[18ch] text-[length:var(--text-display)] font-medium leading-[1.04] tracking-[-0.02em] text-ink">
        {site.hero.headline}
      </h1>

      <p className="mt-7 max-w-[58ch] text-[length:var(--text-body-lg)] text-muted">
        {site.hero.support}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link
          href="#services"
          className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-medium text-bg transition-opacity duration-300 hover:opacity-85"
        >
          See the six teams
        </Link>
        <Link href="#contact" className="ul-link text-[0.95rem] text-ink">
          Start a project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
