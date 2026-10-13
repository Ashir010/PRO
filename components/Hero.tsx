import Link from "next/link";
import { site } from "@/data/services";

export function Hero() {
  return (
    <section
      id="top"
      className="shell flex min-h-[86svh] flex-col justify-center pb-16 pt-[clamp(2.5rem,9vh,6rem)]"
    >
      <p className="eyebrow text-muted">Creative production studio</p>

      <h1 className="font-display mt-6 max-w-[20ch] text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.025em] text-ink">
        {site.hero.headline}
      </h1>

      <p className="mt-7 max-w-[60ch] text-[length:var(--text-body-lg)] text-muted">
        {site.hero.support}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link
          href="#services"
          className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-semibold text-peach transition-opacity duration-300 hover:opacity-85"
        >
          See the six teams
        </Link>
        <Link href="#contact" className="ul-link text-[0.95rem] font-semibold text-ink">
          Start a project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
