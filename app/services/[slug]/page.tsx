import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/data/services";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceArt } from "@/components/media/ServiceArt";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} — ProMotion`,
    description: service.description,
  };
}

/** Accent-highlighted phrase within a sentence. */
function Highlight({
  text,
  accent,
  color,
}: {
  text: string;
  accent: string;
  color: string;
}) {
  const i = text.indexOf(accent);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color }}>{accent}</span>
      {text.slice(i + accent.length)}
    </>
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const { colors } = service;

  return (
    <>
      <Header />
      <main className="flex-1 pt-[var(--header-h)]">
        <section
          className="shell py-14 lg:py-20"
          style={{ ["--accent" as string]: colors.highlight }}
        >
          <Link
            href="/#services"
            className="ul-link inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span> All services
          </Link>

          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Text */}
            <div className="min-w-0">
              <p className="eyebrow flex items-center gap-2 text-muted">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: colors.highlight }}
                />
                {service.teamLabel} · {service.number} / 06
              </p>

              <h1 className="font-display mt-4 text-[length:var(--text-display)] font-semibold leading-[1.04] tracking-[-0.025em] text-ink">
                {service.title}
              </h1>

              <p className="mt-5 max-w-[48ch] text-[length:var(--text-body-lg)] text-muted">
                {service.description}
              </p>

              <p className="eyebrow mt-10 text-faint">What&apos;s included</p>
              <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <li key={d.label} className="flex gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-hairline text-ink">
                      <Icon name={d.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-semibold text-ink">
                        {d.label}
                      </span>
                      <span className="text-[0.85rem] text-muted">
                        {d.caption}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="font-display mt-10 text-[length:var(--text-highlight)] font-medium leading-snug text-ink">
                <Highlight
                  text={service.highlight.text}
                  accent={service.highlight.accent}
                  color={colors.highlight}
                />
              </p>

              <div className="mt-8">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-3 text-[0.95rem] font-semibold text-peach transition-opacity duration-300 hover:opacity-85"
                >
                  Discuss this project
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="lg:pt-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1b1510] to-[#050505] lg:max-w-none">
                <ServiceArt
                  slug={service.slug}
                  accent={colors.highlight}
                  className="absolute inset-0 h-full w-full"
                />
                <span className="eyebrow absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.6rem] text-white/80">
                  Placeholder
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
