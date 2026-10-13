import Link from "next/link";
import type { Service } from "@/data/services";
import { Icon } from "@/components/ui/Icon";
import { ServiceArt } from "@/components/media/ServiceArt";
import { STACK } from "@/config/stack";

/**
 * Presentational service panel — identical structure for all six services.
 * Used by the pinned stage (mode="stage", fits one screen) and the fallback
 * (mode="flow", natural height). Only colour, media and copy differ.
 */
export function ServicePanel({
  service,
  mode,
}: {
  service: Service;
  mode: "stage" | "flow";
}) {
  const { colors, mediaSide } = service;
  const total = 6;

  return (
    <div
      className={`relative w-full overflow-hidden ${
        mode === "stage" ? "h-full" : "min-h-[560px]"
      }`}
      style={
        {
          background: colors.bg,
          color: colors.text,
          borderRadius: STACK.radiusPx,
          "--accent": colors.highlight,
        } as React.CSSProperties
      }
    >
      <div
        className="grid h-full items-center gap-[clamp(1.5rem,3vw,3rem)] px-[clamp(1.5rem,3.2vw,3.25rem)] py-[clamp(1rem,2.2vh,2.5rem)] md:grid-cols-[42%_1fr]"
      >
        {/* Media */}
        <div
          className={`order-1 ${
            mediaSide === "left" ? "md:order-1" : "md:order-2"
          }`}
        >
          <figure className="relative m-0">
            <div
              className={`relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[10px] ${
                mode === "stage" ? "max-h-[56svh]" : ""
              }`}
              style={{ maxWidth: mode === "stage" ? "min(100%, 44svh)" : "26rem" }}
            >
              <ServiceArt
                slug={service.slug}
                accent={colors.highlight}
                className="h-full w-full"
              />
              <figcaption
                className="absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
                style={{ background: "rgba(0,0,0,0.55)", color: "#F4EEE8" }}
              >
                {service.media.caption}
              </figcaption>
            </div>
          </figure>
        </div>

        {/* Text */}
        <div
          className={`order-2 min-w-0 ${
            mediaSide === "left" ? "md:order-2" : "md:order-1"
          }`}
        >
          <p className="eyebrow flex items-center gap-2" style={{ color: colors.muted }}>
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: colors.highlight }}
            />
            {service.teamLabel} · {service.number} / {String(total).padStart(2, "0")}
          </p>

          <h2 className="font-display mt-4 text-[length:var(--text-title)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {service.title}
          </h2>

          <p
            className="mt-2.5 max-w-[46ch] text-[length:var(--text-body-lg)] leading-snug"
            style={{ color: colors.muted }}
          >
            {service.description}
          </p>

          <ul className="mt-4 grid list-none grid-cols-1 gap-x-4 gap-y-3 p-0 sm:grid-cols-3">
            {service.deliverables.map((d) => (
              <li key={d.label} className="min-w-0">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border"
                  style={{ borderColor: colors.line }}
                >
                  <Icon name={d.icon} className="h-5 w-5" />
                </span>
                <p className="mt-2.5 text-[0.95rem] font-semibold leading-tight">
                  {d.label}
                </p>
                <p className="text-[0.8rem]" style={{ color: colors.muted }}>
                  {d.caption}
                </p>
              </li>
            ))}
          </ul>

          <p className="font-display mt-4 text-[length:var(--text-highlight)] font-medium leading-snug">
            <Highlight text={service.highlight.text} accent={service.highlight.accent} color={colors.highlight} />
          </p>

          <div className="mt-4">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-opacity duration-300 hover:opacity-85"
              style={{
                background: colors.dark ? "#FDF2EC" : "#0A0A0A",
                color: colors.dark ? "#0A0A0A" : "#FDF2EC",
              }}
            >
              Discuss this project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Renders `text` with its `accent` substring in the highlight colour. */
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
