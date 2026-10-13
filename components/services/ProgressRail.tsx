"use client";

import Link from "next/link";
import { services } from "@/data/services";

/** Thin desktop-only rail marking the active panel; also keyboard jump links. */
export function ProgressRail({ active }: { active: number }) {
  return (
    <nav
      aria-label="Service sections"
      className="pointer-events-none fixed right-[max(1rem,2.5vw)] top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="m-0 flex list-none flex-col items-end gap-3 p-0">
        {services.map((service, i) => {
          const on = i === active;
          return (
            <li
              key={service.id}
              className="pointer-events-auto"
              style={{ "--accent": service.accent.hex } as React.CSSProperties}
            >
              <Link
                href={`#${service.slug}`}
                aria-current={on ? "true" : undefined}
                className="group flex items-center justify-end gap-2.5 rounded-sm py-0.5"
              >
                <span
                  className={`text-[0.7rem] tabular-nums transition-colors ${
                    on ? "" : "text-faint group-hover:text-muted"
                  }`}
                  style={on ? { color: "var(--accent)" } : undefined}
                >
                  {service.number}
                </span>
                <span
                  aria-hidden="true"
                  className="block h-px transition-all duration-300 ease-[var(--ease-signature)]"
                  style={{
                    width: on ? "28px" : "14px",
                    background: on ? "var(--accent)" : "var(--color-hairline)",
                  }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
