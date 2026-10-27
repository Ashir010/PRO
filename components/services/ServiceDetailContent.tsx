import Link from "next/link";
import type { Service } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";
import { Icon } from "@/components/ui/Icon";

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

/**
 * Full service info, shared by the /services/[slug] route page and the expand
 * overlay. `onDiscuss` lets the overlay close itself before jumping to contact.
 */
export function ServiceDetailContent({
  service,
  onDiscuss,
}: {
  service: Service;
  onDiscuss?: () => void;
}) {
  const { colors } = service;

  return (
    <div
      className="shell py-12 lg:py-16"
      style={{ ["--accent" as string]: colors.highlight }}
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
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

          <h2 className="font-display mt-4 text-[length:var(--text-display)] font-semibold leading-[1.04] tracking-[-0.025em] text-ink">
            {service.title}
          </h2>

          {(service.longDescription ?? [service.description]).map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-5" : "mt-4"} max-w-[52ch] text-[length:var(--text-body-lg)] text-muted`}
            >
              {para}
            </p>
          ))}

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
                  <span className="text-[0.85rem] text-muted">{d.caption}</span>
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
              onClick={onDiscuss}
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

      <p className="mt-14 border-t border-hairline pt-8 text-caption text-faint">
        Scroll up or down to close · or press Esc
      </p>
    </div>
  );
}
