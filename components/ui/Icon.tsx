import type { ReactNode } from "react";

export type IconName =
  | "cube"
  | "gears"
  | "layers"
  | "window"
  | "spark"
  | "play"
  | "scissors"
  | "captions"
  | "motion"
  | "mic"
  | "upload"
  | "mobile"
  | "heart"
  | "tag"
  | "camera"
  | "pin"
  | "frame";

const GLYPHS: Record<IconName, ReactNode> = {
  cube: (
    <>
      <path d="M12 3 20 7.5V16.5L12 21 4 16.5V7.5Z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </>
  ),
  gears: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.3M12 18.2v2.3M3.5 12h2.3M18.2 12h2.3M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
    </>
  ),
  layers: (
    <>
      <path d="M12 4 21 9l-9 5-9-5 9-5Z" />
      <path d="M3 14l9 5 9-5" />
    </>
  ),
  window: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M3.5 9h17" />
      <circle cx="6.5" cy="7" r="0.5" />
    </>
  ),
  spark: <path d="M12 3c.6 4.3 1.7 5.4 6 6-4.3.6-5.4 1.7-6 6-.6-4.3-1.7-5.4-6-6 4.3-.6 5.4-1.7 6-6Z" />,
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.5 16 12l-6 3.5V8.5Z" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6.5" cy="7" r="2.3" />
      <circle cx="6.5" cy="17" r="2.3" />
      <path d="M8.6 8.4 20 17M8.6 15.6 20 7" />
    </>
  ),
  captions: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M9.5 11.2a2 2 0 1 0 0 3.6M15.5 11.2a2 2 0 1 0 0 3.6" />
    </>
  ),
  motion: (
    <>
      <path d="M8 7.5 14 12l-6 4.5V7.5Z" />
      <path d="M17 8.5v7M20 10v4" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15V4.5M8 8l4-3.5L16 8" />
      <path d="M5 14v3.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V14" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7-2.8c0 4.4-7 9.3-7 9.3Z" />
  ),
  tag: (
    <>
      <path d="M4 12.5V5a1 1 0 0 1 1-1h7.5L20 11.5a1.5 1.5 0 0 1 0 2.1L13.6 20a1.5 1.5 0 0 1-2.1 0L4 12.5Z" />
      <circle cx="8.5" cy="8.5" r="1.1" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.5h3l1.3-2h7.4L17 8.5h3a0 0 0 0 1 0 0v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Z" />
      <circle cx="12" cy="13" r="3.3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  frame: (
    <>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
};

export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[name]}
    </svg>
  );
}
