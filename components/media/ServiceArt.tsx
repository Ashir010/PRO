import type { ReactNode } from "react";

/**
 * Art-directed 4:5 service visuals. Each is a self-contained, accent-tinted
 * composition (gradient depth, soft glow, glossy fills, a drop shadow) built to
 * read as finished media rather than a wireframe — no external files, crisp at
 * any size. Swap for real media per README when assets are ready.
 *
 * IDs are prefixed with the slug so repeated instances of the same art don't
 * collide across the grid / stacked deck / detail view.
 */
export function ServiceArt({
  slug,
  accent,
  className = "",
}: {
  slug: string;
  accent: string;
  className?: string;
}) {
  const p = `art-${slug}`;
  const scene = SCENES[slug] ?? SCENES.default;

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        {/* warm charcoal base */}
        <linearGradient id={`${p}-bg`} x1="0" y1="0" x2="0.65" y2="1">
          <stop offset="0" stopColor="#241B14" />
          <stop offset="0.55" stopColor="#140E0A" />
          <stop offset="1" stopColor="#090605" />
        </linearGradient>
        {/* accent wash from the upper third */}
        <radialGradient id={`${p}-glow`} cx="0.52" cy="0.34" r="0.72">
          <stop offset="0" stopColor={accent} stopOpacity="0.5" />
          <stop offset="0.45" stopColor={accent} stopOpacity="0.14" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        {/* edge vignette for depth */}
        <radialGradient id={`${p}-vignette`} cx="0.5" cy="0.46" r="0.75">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
        {/* focal accent halo (fills a circle's bounding box) */}
        <radialGradient id={`${p}-focal`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.95" />
          <stop offset="0.35" stopColor={accent} stopOpacity="0.45" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        {/* neutral glossy slab */}
        <linearGradient id={`${p}-slab`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#4A3B2E" />
          <stop offset="0.5" stopColor="#2A2019" />
          <stop offset="1" stopColor="#120D09" />
        </linearGradient>
        {/* accent-tinted fill */}
        <linearGradient id={`${p}-accent`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.95" />
          <stop offset="1" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
        {/* top sheen */}
        <linearGradient id={`${p}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter
          id={`${p}-shadow`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="16"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>

      <rect width="400" height="500" fill={`url(#${p}-bg)`} />
      <rect width="400" height="500" fill={`url(#${p}-glow)`} />
      {scene(p, accent)}
      <rect width="400" height="500" fill={`url(#${p}-vignette)`} />
    </svg>
  );
}

type Scene = (p: string, accent: string) => ReactNode;

const SCENES: Record<string, Scene> = {
  // 3D — stacked glossy isometric slabs with a dropped focal node
  "3d-videos": (p, a) => (
    <>
      <g filter={`url(#${p}-shadow)`}>
        {[
          { cy: 316, s: 0.78, o: 0.5 },
          { cy: 258, s: 0.9, o: 0.72 },
          { cy: 200, s: 1, o: 1 },
        ].map(({ cy, s, o }, i) => {
          const w = 92 * s;
          const h = 52 * s;
          return (
            <g key={i} opacity={o}>
              <path
                d={`M200 ${cy - h} ${200 + w} ${cy} 200 ${cy + h} ${200 - w} ${cy}Z`}
                fill={`url(#${p}-slab)`}
                stroke="#F3ECE4"
                strokeOpacity={i === 2 ? 0.45 : 0.18}
                strokeWidth="2"
              />
              {/* lit upper-left face */}
              <path
                d={`M200 ${cy - h} 200 ${cy} ${200 - w} ${cy}Z`}
                fill="#FFFFFF"
                opacity="0.06"
              />
            </g>
          );
        })}
        {/* accent edge on the top slab */}
        <path
          d="M200 148 292 200 200 252"
          fill="none"
          stroke={a}
          strokeOpacity="0.9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* dropped focal node + line */}
      <path
        d="M200 150V118"
        stroke={a}
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
      <circle cx="200" cy="104" r="26" fill={`url(#${p}-focal)`} />
      <circle cx="200" cy="104" r="7" fill={a} />
    </>
  ),

  // SaaS — floating interface panel with a motion orb
  "saas-motion-graphics": (p, a) => (
    <>
      <g filter={`url(#${p}-shadow)`}>
        <rect
          x="92"
          y="150"
          width="216"
          height="200"
          rx="16"
          fill={`url(#${p}-slab)`}
          stroke="#F3ECE4"
          strokeOpacity="0.16"
          strokeWidth="2"
        />
        {/* sheen */}
        <rect
          x="92"
          y="150"
          width="216"
          height="90"
          rx="16"
          fill={`url(#${p}-sheen)`}
          opacity="0.12"
        />
        {/* top bar */}
        <path
          d="M92 186h216"
          stroke="#F3ECE4"
          strokeOpacity="0.16"
          strokeWidth="2"
        />
        <circle cx="112" cy="168" r="4" fill="#F3ECE4" opacity="0.45" />
        <circle cx="128" cy="168" r="4" fill="#F3ECE4" opacity="0.3" />
        <circle cx="144" cy="168" r="4" fill={a} />
        {/* content lines */}
        <g stroke="#F3ECE4" strokeOpacity="0.28" strokeWidth="6" strokeLinecap="round">
          <path d="M120 214h70" />
          <path d="M120 236h120" />
          <path d="M120 258h96" />
          <path d="M120 300h150" strokeOpacity="0.14" />
          <path d="M120 322h110" strokeOpacity="0.14" />
        </g>
      </g>
      {/* motion orb */}
      <circle cx="262" cy="300" r="46" fill={`url(#${p}-focal)`} />
      <circle
        cx="262"
        cy="300"
        r="30"
        fill="none"
        stroke={a}
        strokeWidth="2.5"
        strokeOpacity="0.9"
      />
      <path d="M253 285 281 300 253 315Z" fill="#FFFFFF" opacity="0.95" />
    </>
  ),

  // Editing — glossy timeline, waveform and a glowing playhead
  "editing-post-production": (p, a) => (
    <>
      <g filter={`url(#${p}-shadow)`}>
        {/* clip track */}
        {[
          { x: 70, w: 86, accent: false },
          { x: 164, w: 122, accent: true },
          { x: 294, w: 54, accent: false },
        ].map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y="196"
            width={c.w}
            height="46"
            rx="8"
            fill={c.accent ? `url(#${p}-accent)` : `url(#${p}-slab)`}
            stroke="#F3ECE4"
            strokeOpacity={c.accent ? 0 : 0.16}
            strokeWidth="2"
          />
        ))}
        {/* waveform as filled mirrored bars */}
        <g fill="#F3ECE4" opacity="0.5">
          {Array.from({ length: 26 }).map((_, n) => {
            const x = 80 + n * 9.6;
            const h = 8 + ((n * 17) % 40);
            return (
              <rect
                key={n}
                x={x}
                y={300 - h}
                width="4"
                height={h * 2}
                rx="2"
              />
            );
          })}
        </g>
      </g>
      {/* playhead */}
      <path d="M150 168V332" stroke={a} strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="168" r="22" fill={`url(#${p}-focal)`} />
      <circle cx="150" cy="168" r="7" fill={a} />
    </>
  ),

  // Podcast — microphone with sound rings and a record cue
  "podcast-production": (p, a) => (
    <>
      {/* sound rings */}
      <g fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round">
        <path d="M132 206q-26 44 0 88" strokeOpacity="0.5" />
        <path d="M110 188q-40 62 0 124" strokeOpacity="0.25" />
        <path d="M268 206q26 44 0 88" strokeOpacity="0.5" />
        <path d="M290 188q40 62 0 124" strokeOpacity="0.25" />
      </g>
      <g filter={`url(#${p}-shadow)`}>
        {/* mic body */}
        <rect
          x="172"
          y="150"
          width="56"
          height="118"
          rx="28"
          fill={`url(#${p}-slab)`}
          stroke="#F3ECE4"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        {/* grille sheen */}
        <rect
          x="172"
          y="150"
          width="56"
          height="60"
          rx="28"
          fill={`url(#${p}-sheen)`}
          opacity="0.14"
        />
        <g stroke="#F3ECE4" strokeOpacity="0.22" strokeWidth="2">
          <path d="M180 178h40M180 196h40M180 214h40M180 232h40" />
        </g>
        {/* yoke + stand */}
        <path
          d="M200 268v42M176 310h48"
          stroke="#F3ECE4"
          strokeOpacity="0.4"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      {/* record cue */}
      <circle cx="200" cy="128" r="22" fill={`url(#${p}-focal)`} />
      <circle cx="200" cy="128" r="7" fill={a} />
    </>
  ),

  // UGC — floating phone with a short-form reel
  "ugc-social": (p, a) => (
    <>
      <g filter={`url(#${p}-shadow)`}>
        <rect
          x="150"
          y="120"
          width="100"
          height="260"
          rx="22"
          fill={`url(#${p}-slab)`}
          stroke="#F3ECE4"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        {/* screen */}
        <rect
          x="160"
          y="134"
          width="80"
          height="232"
          rx="14"
          fill="#0E0A08"
        />
        <rect
          x="160"
          y="134"
          width="80"
          height="110"
          rx="14"
          fill={`url(#${p}-sheen)`}
          opacity="0.1"
        />
        {/* notch */}
        <rect x="186" y="126" width="28" height="5" rx="2.5" fill="#F3ECE4" opacity="0.3" />
        {/* caption lines */}
        <g stroke="#F3ECE4" strokeWidth="5" strokeLinecap="round">
          <path d="M172 336h44" strokeOpacity="0.5" />
          <path d="M172 350h28" strokeOpacity="0.28" />
        </g>
        <path d="M172 158h26" stroke={a} strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* play */}
      <circle cx="200" cy="240" r="40" fill={`url(#${p}-focal)`} />
      <circle
        cx="200"
        cy="240"
        r="26"
        fill="none"
        stroke={a}
        strokeWidth="2.5"
        strokeOpacity="0.9"
      />
      <path d="M192 227 216 240 192 253Z" fill="#FFFFFF" opacity="0.95" />
    </>
  ),

  // Videography — camera aperture / iris
  "videography-on-site": (p, a) => (
    <>
      <circle cx="200" cy="250" r="96" fill={`url(#${p}-focal)`} opacity="0.5" />
      <g filter={`url(#${p}-shadow)`}>
        <circle
          cx="200"
          cy="250"
          r="86"
          fill={`url(#${p}-slab)`}
          stroke="#F3ECE4"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        {/* aperture blades */}
        <g
          fill="none"
          stroke="#F3ECE4"
          strokeOpacity="0.4"
          strokeWidth="2.5"
          strokeLinejoin="round"
        >
          {Array.from({ length: 6 }).map((_, n) => {
            const ang = (n * Math.PI) / 3;
            const nx = (r: number, o = 0) =>
              (200 + r * Math.cos(ang + o)).toFixed(1);
            const ny = (r: number, o = 0) =>
              (250 + r * Math.sin(ang + o)).toFixed(1);
            return (
              <path
                key={n}
                d={`M${nx(78)} ${ny(78)} ${nx(30, 0.9)} ${ny(30, 0.9)} ${nx(30, -0.2)} ${ny(30, -0.2)}`}
              />
            );
          })}
        </g>
        {/* lens centre */}
        <circle cx="200" cy="250" r="30" fill="#0E0A08" />
        <circle
          cx="200"
          cy="250"
          r="30"
          fill="none"
          stroke={a}
          strokeWidth="2.5"
          strokeOpacity="0.9"
        />
        <circle cx="189" cy="239" r="7" fill="#FFFFFF" opacity="0.5" />
      </g>
      {/* record dot */}
      <circle cx="286" cy="168" r="16" fill={`url(#${p}-focal)`} />
      <circle cx="286" cy="168" r="6" fill={a} />
    </>
  ),

  default: (p) => (
    <circle cx="200" cy="250" r="70" fill={`url(#${p}-focal)`} />
  ),
};
