"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/data/services";
import { ServiceArt } from "@/components/media/ServiceArt";

/**
 * Grid service card. Collapsed: art + team label + title + a short info teaser,
 * with "Read more" and "Discuss this project". Clicking "Read more" reveals a
 * full-info panel over the card (description + deliverables) without changing
 * the card's size, so the grid stays aligned.
 */
export function ServiceGridCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const { colors } = service;

  return (
    <div
      className="group relative overflow-hidden rounded-[18px] transition-[transform,box-shadow] duration-300 ease-[var(--ease-signature)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-28px_rgba(10,10,10,0.5)]"
      style={{ ["--accent" as string]: colors.highlight }}
    >
      <div className="relative aspect-[3/2]">
        <ServiceArt
          slug={service.slug}
          accent={colors.highlight}
          className="absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-[1.05]"
        />

        {/* legibility scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,8,6,0) 36%, rgba(10,8,6,0.6) 66%, rgba(10,8,6,0.9) 100%)",
          }}
        />

        {/* Collapsed content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="eyebrow text-[0.65rem] text-white/70">
            {service.teamLabel}
          </p>
          <h3 className="font-display mt-1 text-[1.05rem] font-semibold leading-tight text-white">
            {service.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[0.75rem] text-white/60">
            {service.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-[0.72rem] font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-[#0A0A0A]"
            >
              Read more
            </button>
            <Link
              href="#contact"
              className="ul-link inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white"
            >
              Discuss this project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Expanded full-info panel */}
        <div
          className={`absolute inset-0 flex flex-col bg-[#0A0A0A] p-4 transition-opacity duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!open}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="eyebrow inline-flex w-fit items-center gap-1 text-white/55 transition-colors hover:text-white"
          >
            <span aria-hidden="true">←</span> Show less
          </button>

          <div className="mt-2.5 min-h-0 flex-1 overflow-y-auto pr-1">
            <p className="eyebrow text-[0.65rem] text-white/60">
              {service.teamLabel}
            </p>
            <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-white">
              {service.title}
            </h3>
            <p className="mt-2 text-[0.8rem] leading-snug text-white/75">
              {service.description}
            </p>
            <ul className="mt-3 space-y-1.5">
              {service.deliverables.map((d) => (
                <li key={d.label} className="flex gap-2 text-[0.78rem] text-white/70">
                  <span
                    aria-hidden="true"
                    className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full"
                    style={{ background: colors.bg }}
                  />
                  <span>
                    <span className="font-semibold text-white">{d.label}</span>{" "}
                    — {d.caption}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="#contact"
            className="ul-link mt-3 inline-flex w-fit items-center gap-1.5 text-[0.8rem] font-semibold text-white"
          >
            Discuss this project
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* branded number badge (hidden while the full-info panel is open) */}
        {!open && (
          <span
            className="absolute left-4 top-4 inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full border px-2 font-display text-[0.8rem] font-semibold tabular-nums"
            style={{
              background: colors.bg,
              color: colors.text,
              borderColor: "rgba(255,255,255,0.18)",
            }}
          >
            {service.number}
          </span>
        )}
      </div>
    </div>
  );
}
