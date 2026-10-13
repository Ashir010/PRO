/** Small accent label framed by corner brackets, e.g. "START A PROJECT". */
export function CornerLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Bracket />
      <span className="eyebrow" style={{ color: "var(--accent)" }}>
        {children}
      </span>
      <Bracket flip />
    </span>
  );
}

function Bracket({ flip = false }: { flip?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 border-current"
      style={{
        color: "var(--accent)",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: flip ? 0 : 1,
        borderRightWidth: flip ? 1 : 0,
        opacity: 0.8,
      }}
    />
  );
}
