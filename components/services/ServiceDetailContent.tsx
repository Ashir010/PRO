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
      style={{
        ["--accent" as string]: colors.highlight,
        background: colors.bg,
        color: colors.text,
      }}
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Text */}
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-2" style={{ color: colors.muted }}>
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: colors.highlight }}
            />
            {service.teamLabel} · {service.number} / 06
          </p>

          <h2 className="font-display mt-4 text-[length:var(--text-display)] font-semibold leading-[1.04] tracking-[-0.025em]">
            {service.title}
          </h2>

          {(service.longDescription ?? [service.description]).map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-5" : "mt-4"} max-w-[52ch] text-[length:var(--text-body-lg)]`}
              style={{ color: colors.muted }}
            >
              {para}
            </p>
          ))}

          <p className="eyebrow mt-10" style={{ color: colors.muted }}>What&apos;s included</p>
          <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2">
            {service.deliverables.map((d) => (
              <li key={d.label} className="flex gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border" style={{ borderColor: colors.line }}>
                  <Icon name={d.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold">
                    {d.label}
                  </span>
                  <span className="text-[0.85rem]" style={{ color: colors.muted }}>{d.caption}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="font-display mt-10 text-[length:var(--text-highlight)] font-medium leading-snug">
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
              className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition-opacity duration-300 hover:opacity-85"
              style={{ background: colors.dark ? "#FFFFFF" : "#171827", color: colors.dark ? colors.bg : "#FFFFFF" }}
            >
              Discuss this project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="lg:pt-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-[24px] lg:max-w-none" style={{ background: colors.dark ? "#171827" : "#FFFFFF" }}>
            <ServiceArt
              slug={service.slug}
              accent={colors.highlight}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>

      <p className="mt-14 border-t pt-8 text-caption" style={{ borderColor: colors.line, color: colors.muted }}>
        Scroll up or down to close · or press Esc
      </p>
    </div>
  );
}
