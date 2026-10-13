import type { MotifKind } from "@/data/services";

/**
 * Intentional, accent-tinted line compositions used as *placeholders* for each
 * service's media. These are deliberately diagrammatic — they never pretend to
 * be real footage. Replace the whole media slot with real assets per README.
 *
 * `index` lightly varies the composition across a service's three slots.
 */
export function ServicePlaceholder({
  motif,
  index = 0,
}: {
  motif: MotifKind;
  index?: number;
}) {
  return (
    <svg
      viewBox="0 0 160 120"
      role="presentation"
      aria-hidden="true"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ color: "var(--color-muted)" }}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {MOTIFS[motif](index)}
      </g>
    </svg>
  );
}

const ACCENT = "var(--accent)";

const MOTIFS: Record<MotifKind, (i: number) => React.ReactNode> = {
  // 3D — exploded / layered isometric volume
  exploded: (i) => {
    const gap = i === 1 ? 10 : 14;
    const layers = [0, 1, 2];
    return (
      <>
        {layers.map((l) => {
          const cy = 46 + l * gap;
          return (
            <g key={l} opacity={1 - l * 0.12}>
              <path d={`M80 ${cy - 12} L104 ${cy} L80 ${cy + 12} L56 ${cy} Z`} />
            </g>
          );
        })}
        <line x1="80" y1="40" x2="80" y2="30" strokeDasharray="2 3" />
        <line x1="80" y1="86" x2="80" y2="96" strokeDasharray="2 3" />
        <circle cx="80" cy="26" r="2.4" fill={ACCENT} stroke="none" />
        <path d="M108 44 L118 44 M118 44 L114 40 M118 44 L114 48" stroke={ACCENT} />
      </>
    );
  },

  // SaaS — animated interface walkthrough frame
  interface: (i) => (
    <>
      <rect x="30" y="26" width="100" height="68" rx="4" />
      <line x1="30" y1="38" x2="130" y2="38" />
      <circle cx="37" cy="32" r="1.6" />
      <circle cx="43" cy="32" r="1.6" />
      <circle cx="49" cy="32" r="1.6" fill={ACCENT} stroke="none" />
      <line x1="42" y1="48" x2="42" y2="86" opacity={0.6} />
      <line x1="52" y1="50" x2="68" y2="50" />
      <line x1="52" y1="58" x2="74" y2="58" opacity={0.7} />
      <line x1="52" y1="66" x2="64" y2="66" opacity={0.7} />
      {i === 2 ? (
        <rect x="92" y="50" width="28" height="30" rx="3" stroke={ACCENT} />
      ) : (
        <>
          <circle cx="104" cy="66" r="12" stroke={ACCENT} />
          <path d="M100 60 L111 66 L100 72 Z" fill={ACCENT} stroke="none" />
        </>
      )}
    </>
  ),

  // Editing — timeline with clips, playhead and waveform
  timeline: (i) => (
    <>
      <rect x="22" y="40" width="26" height="16" rx="2" />
      <rect x="52" y="40" width="40" height="16" rx="2" opacity={0.75} />
      <rect x="96" y="40" width="20" height="16" rx="2" opacity={0.75} />
      <rect x="120" y="40" width="18" height="16" rx="2" opacity={0.6} />
      <g opacity={0.8}>
        {Array.from({ length: 22 }).map((_, n) => {
          const x = 24 + n * 5.3;
          const h = 3 + ((n * 7 + i * 3) % 9);
          return <line key={n} x1={x} y1={70 - h} x2={x} y2={70 + h} />;
        })}
      </g>
      <line x1={i === 1 ? 70 : 60} y1="32" x2={i === 1 ? 70 : 60} y2="82" stroke={ACCENT} />
      <circle cx={i === 1 ? 70 : 60} cy="32" r="2.4" fill={ACCENT} stroke="none" />
    </>
  ),

  // Podcast — lit, multi-camera recording setup
  podcast: (i) => (
    <>
      {/* mic */}
      <rect x="72" y="34" width="16" height="30" rx="8" />
      <line x1="80" y1="64" x2="80" y2="80" />
      <line x1="70" y1="80" x2="90" y2="80" />
      <path d="M66 50 q-6 4 0 12" opacity={0.6} />
      <path d="M94 50 q6 4 0 12" opacity={0.6} />
      {/* cameras */}
      <rect x="28" y="54" width="20" height="14" rx="2" />
      <path d="M48 58 L54 55 L54 67 L48 64 Z" />
      <rect x="112" y="54" width="20" height="14" rx="2" />
      <path d="M112 58 L106 55 L106 67 L112 64 Z" />
      {/* light / rec */}
      <circle cx="80" cy="24" r="4" stroke={ACCENT} />
      {i !== 2 && <circle cx="38" cy="48" r="1.8" fill={ACCENT} stroke="none" />}
    </>
  ),

  // UGC — vertical phone-framed short-form
  shortform: (i) => (
    <>
      <rect x="62" y="22" width="36" height="76" rx="7" />
      <line x1="74" y1="26" x2="86" y2="26" />
      {/* story progress */}
      <line x1="66" y1="32" x2="78" y2="32" stroke={ACCENT} />
      <line x1="80" y1="32" x2="94" y2="32" opacity={0.4} />
      {i === 1 ? (
        <>
          <line x1="68" y1="84" x2="84" y2="84" opacity={0.7} />
          <line x1="68" y1="89" x2="78" y2="89" opacity={0.5} />
        </>
      ) : (
        <>
          <circle cx="80" cy="60" r="11" stroke={ACCENT} />
          <path d="M76 54 L87 60 L76 66 Z" fill={ACCENT} stroke="none" />
        </>
      )}
    </>
  ),

  // Videography — viewfinder with corner brackets + focus reticle
  onsite: (i) => (
    <>
      <path d="M30 34 L30 28 L36 28" />
      <path d="M130 34 L130 28 L124 28" />
      <path d="M30 86 L30 92 L36 92" />
      <path d="M130 86 L130 92 L124 92" />
      <line x1="80" y1="46" x2="80" y2="74" opacity={0.5} />
      <line x1="66" y1="60" x2="94" y2="60" opacity={0.5} />
      <circle cx="80" cy="60" r="10" />
      {i === 2 && <line x1="40" y1="70" x2="120" y2="70" opacity={0.35} />}
      <circle cx="40" cy="36" r="2.2" fill={ACCENT} stroke="none" />
      <path d="M45 36 h10" stroke={ACCENT} />
    </>
  ),
};
