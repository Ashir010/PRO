# ProMotion — project guide

Premium single-page marketing site for a video-production agency with six
co-equal specialist teams. Signature interaction: a **scroll-driven stacked-card
showcase** built with CSS `position: sticky` — each panel pins and the next rises
from below and covers it like a deck.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first config in `app/globals.css` via `@theme`)
- **motion** (Framer Motion v14) — `import ... from "motion/react"`
- No other runtime dependencies. Contact email uses a zero-dep `fetch` to Resend.

## Commands

```bash
npm run dev          # local dev (Turbopack)
npm run build        # production build
npm run start        # serve the build
npm run lint         # ESLint (eslint-config-next)
npx tsc --noEmit     # typecheck
```

## Where content, media & timing live

- **Service copy, slugs, colours, team labels, deliverables, highlight lines,
  media slots:** `data/services.ts` — the single source of truth. Nav, index
  cards, panels and anchor markers all derive from it.
- **Site-wide copy** (hero, teams intro, contact): the `site` export there.
- **Stacking geometry:** `config/stack.ts` — the ONE file to tune the
  interaction (peek strip, bottom gap, side inset, radius, scroll slot per panel).
- **Media:** placeholders are inline SVG (`components/media/ServiceArt.tsx`, 4:5).
  Real assets go in `public/media/<slug>/primary.(webp|mp4)` and are swapped in
  `components/services/ServicePanel.tsx`. See README.
- **Logo:** `components/ui/Logo.tsx` (inline) + `public/brand/{logo,logo-mark}.svg`.

## Conventions

- **Server components by default.** Client components only where interactivity
  needs them: `Header`, `contact/{ContactForm,SpinningLogo}`, and
  `lib/hooks/usePrefersReducedMotion`. The stacking is pure CSS, so
  `ServicesShowcase`, `ServicePanel`, `ServiceIndexCard`, `ServiceArt`, `Icon`
  are all server/presentational.
- **Design tokens** (colours, fonts, type scale, easing) are CSS vars in `@theme`
  in `app/globals.css`. Each panel's accent is passed as `--accent` via inline
  `style` and read with `var(--accent)`.
- **Fonts:** Space Grotesk (display), Manrope (body) via `next/font`.
- **Stacking engine:** pure **CSS `position: sticky`** (no JS, no scroll
  listeners). `ServicesShowcase` (a server component) renders the six panels as
  siblings in `.services-stack`; each `.service-panel` is `sticky; top:0` with an
  increasing inline `z-index`, so each pins and the next rises from below to
  cover it while earlier panels stay pinned behind. Each card is offset down by
  `index * --stack-peek` for the accumulating deck. The `id={service.slug}` on
  each section is the anchor target. Geometry lives in `config/stack.ts` (injected
  as CSS vars) and the rules in `app/globals.css` (`.service-panel` / `.service-card`).
  Works on first paint, at every viewport, and under reduced motion (sticky
  stacking is layout, not animation).
- **Responsive:** `@media (min-width:768px)` turns on the sticky stacking; below
  768px the same panels are a natural-height vertical sequence (media over text),
  so mobile content is never clipped. No hydration gate or fallback component.
- **Motion rules:** transform/opacity only; respect `prefers-reduced-motion`
  (`lib/hooks/usePrefersReducedMotion.ts`); never override cursor/selection.
- **Contact:** validation shared client+server via `lib/validation.ts`; the route
  never claims success unless a provider actually accepted the send.
```
