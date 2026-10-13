import Link from "next/link";
import type { ComponentProps } from "react";

/** Accent-dotted team label used on cards and section headers. */
export function TeamLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow inline-flex items-center gap-2 text-muted">
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--accent)" }}
      />
      {children}
    </span>
  );
}

/** Understated section numeral, e.g. "01". */
export function SectionNumber({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-display text-[0.9rem] tabular-nums tracking-widest"
      style={{ color: "var(--accent)" }}
    >
      {children}
    </span>
  );
}

/** Text link with an arrow and the animated underline. */
export function ArrowLink({
  children,
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`ul-link text-[0.95rem] font-medium ${className}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
