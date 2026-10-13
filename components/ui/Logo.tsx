/**
 * Replaceable logo placeholder.
 *
 * `mark` is a standalone glyph (also used by the spinning contact logo);
 * the full lockup pairs it with the "ProMotion" wordmark.
 *
 * To swap in a real logo: replace the SVG paths below, or drop a file at
 * public/logo.svg and render it with next/image. Keep the mark roughly square
 * so the contact spinner stays balanced.
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
        opacity="0.35"
      />
      <path
        d="M24 3 a21 21 0 0 1 21 21"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M19 16 L34 24 L19 32 Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-7 text-ink" />
      <span className="font-display text-[1.25rem] font-medium tracking-tight text-ink">
        ProMotion
      </span>
    </span>
  );
}
