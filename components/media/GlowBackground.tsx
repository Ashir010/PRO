/**
 * Site-wide background — flowing amber "liquid light" on near-black, recreated
 * in pure CSS from a reference loop. Fixed behind all page content; soft blurred
 * warm blobs drift while a brighter core ribbon weaves through, screen-blended
 * for an additive glow. Transform-only motion; the global reduced-motion rule in
 * globals.css freezes it to a static glow. Rendered once, purely decorative.
 */
export function GlowBackground() {
  return (
    <div className="site-glow" aria-hidden="true">
      <span className="site-glow__blob hg1" />
      <span className="site-glow__blob hg2" />
      <span className="site-glow__blob hg3" />
      <span className="site-glow__core hgCore" />
    </div>
  );
}
