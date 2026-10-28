/**
 * Hero background — flowing amber "liquid light" on near-black, recreated in
 * pure CSS from a reference loop. Soft, heavily-blurred warm blobs drift while a
 * brighter core ribbon weaves through, screen-blended for an additive glow.
 * Every layer animates with transforms only; the global reduced-motion rule in
 * globals.css freezes it to a static glow. Purely decorative.
 */
export function HeroGlow() {
  return (
    <div className="hero-glow" aria-hidden="true">
      <span className="hero-glow__blob hg1" />
      <span className="hero-glow__blob hg2" />
      <span className="hero-glow__blob hg3" />
      <span className="hero-glow__core hgCore" />
    </div>
  );
}
