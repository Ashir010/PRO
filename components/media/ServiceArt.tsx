import type { ReactNode } from "react";

/**
 * Intentional 4:5 placeholder art per service — clearly diagrammatic, never
 * posing as real footage. Each has its own charcoal media-tile background so it
 * reads as a media slot on any panel colour. Replace the whole slot with real
 * media per README (next/image / <video>).
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
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-hidden="true"
      style={{ ["--art-accent" as string]: accent }}
    >
      <rect width="400" height="500" fill="#17130F" />
      <g
        fill="none"
        stroke="#EDE7E1"
        strokeOpacity="0.85"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SCENES[slug] ?? SCENES.default}
      </g>
    </svg>
  );
}

const A = "var(--art-accent)";

const SCENES: Record<string, ReactNode> = {
  // 3D — exploded isometric layers
  "3d-videos": (
    <>
      {[0, 1, 2].map((l) => {
        const cy = 210 + l * 52;
        return (
          <path
            key={l}
            d={`M200 ${cy - 46} 272 ${cy} 200 ${cy + 46} 128 ${cy}Z`}
            opacity={1 - l * 0.14}
          />
        );
      })}
      <path d="M200 150v-26" strokeDasharray="4 7" />
      <circle cx="200" cy="112" r="6" fill={A} stroke="none" />
      <path d="M284 196h34m0 0-11-11m11 11-11 11" stroke={A} />
    </>
  ),
  // SaaS — interface walkthrough
  "saas-motion-graphics": (
    <>
      <rect x="86" y="150" width="228" height="200" rx="10" />
      <path d="M86 184h228" />
      <circle cx="104" cy="167" r="4" />
      <circle cx="120" cy="167" r="4" />
      <circle cx="136" cy="167" r="4" fill={A} stroke="none" />
      <path d="M118 210v108M140 214h44M140 236h64M140 258h40" strokeOpacity="0.6" />
      <circle cx="248" cy="260" r="30" stroke={A} />
      <path d="M239 246 266 260 239 274Z" fill={A} stroke="none" />
    </>
  ),
  // Editing — timeline, waveform, playhead
  "editing-post-production": (
    <>
      <rect x="70" y="196" width="78" height="40" rx="5" />
      <rect x="156" y="196" width="118" height="40" rx="5" strokeOpacity="0.7" />
      <rect x="282" y="196" width="54" height="40" rx="5" strokeOpacity="0.55" />
      <g strokeOpacity="0.8">
        {Array.from({ length: 24 }).map((_, n) => {
          const x = 78 + n * 10.6;
          const h = 10 + ((n * 13) % 34);
          return <path key={n} d={`M${x} ${300 - h}V${300 + h}`} />;
        })}
      </g>
      <path d="M150 170v160" stroke={A} />
      <circle cx="150" cy="170" r="6" fill={A} stroke="none" />
    </>
  ),
  // Podcast — mic, cameras, light
  "podcast-production": (
    <>
      <rect x="176" y="176" width="48" height="92" rx="24" />
      <path d="M200 268v40M176 308h48" />
      <path d="M150 214q-16 12 0 36M250 214q16 12 0 36" strokeOpacity="0.6" />
      <rect x="70" y="252" width="56" height="40" rx="5" />
      <path d="M126 262 150 250v44l-24-12Z" />
      <rect x="274" y="252" width="56" height="40" rx="5" />
      <path d="M274 262 250 250v44l24-12Z" />
      <circle cx="200" cy="138" r="11" stroke={A} />
      <circle cx="96" cy="232" r="5" fill={A} stroke="none" />
    </>
  ),
  // UGC — vertical phone short-form
  "ugc-social": (
    <>
      <rect x="150" y="128" width="100" height="244" rx="18" />
      <path d="M184 142h32" />
      <path d="M160 160h36" stroke={A} />
      <path d="M200 160h40" strokeOpacity="0.4" />
      <circle cx="200" cy="250" r="30" stroke={A} />
      <path d="M191 236 218 250 191 264Z" fill={A} stroke="none" />
      <path d="M168 330h64M168 346h40" strokeOpacity="0.6" />
    </>
  ),
  // Videography — viewfinder
  "videography-on-site": (
    <>
      <path d="M96 180v-20a14 14 0 0 1 14-14h20M270 146h20a14 14 0 0 1 14 14v20M304 320v20a14 14 0 0 1-14 14h-20M130 354h-20a14 14 0 0 1-14-14v-20" />
      <path d="M200 214v72M164 250h72" strokeOpacity="0.5" />
      <circle cx="200" cy="250" r="26" />
      <circle cx="124" cy="168" r="6" fill={A} stroke="none" />
      <path d="M136 168h30" stroke={A} />
    </>
  ),
  default: <circle cx="200" cy="250" r="60" />,
};
