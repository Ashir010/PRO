/**
 * Replaceable logo placeholder.
 *  - LogoMark: square glyph (also used by the spinning contact mark).
 *  - Logo: mark + "ProMotion" wordmark lockup.
 *
 * To swap in a real logo: replace the SVG below, or drop files at
 * public/brand/logo.svg and public/brand/logo-mark.svg and render with
 * next/image. Keep the mark square so the contact spinner stays balanced.
 */

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="ProMotion logo mark"
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M24 3a21 21 0 0 1 21 21"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M19 16 34 24 19 32Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className = "",
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "light";
}) {
  const color = tone === "light" ? "#FDF2EC" : "#0A0A0A";
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ color }}
    >
      <LogoMark className="h-7 w-7" />
      <span className="font-display text-[1.2rem] font-semibold tracking-tight">
        ProMotion
      </span>
    </span>
  );
}
