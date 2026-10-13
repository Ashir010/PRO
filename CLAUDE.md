# ProMotion — project guide

Premium single-page marketing site for a video-production agency with six
co-equal specialist teams. Signature interaction: a **scroll-driven stacked-card
showcase** (pinned stage) that deliberately holds on each panel before the next
rises and covers it like a deck.

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
- **Stacking timing & geometry:** `config/stack.ts` — the ONE file to tune the
  interaction (hold/travel ratios, slot length, peek, dim, gaps, mobile slot).
- **Media:** placeholders are inline SVG (`components/media/ServiceArt.tsx`, 4:5).
  Real assets go in `public/media/<slug>/primary.(webp|mp4)` and are swapped in
  `components/services/ServicePanel.tsx`. See README.
- **Logo:** `components/ui/Logo.tsx` (inline) + `public/brand/{logo,logo-mark}.svg`.

## Conventions

- **Server components by default.** Client components only where motion/
  interactivity needs them: `Header`, `stack/*` (ServicesShowcase, StackStage,
  StackFallback), `contact/{ContactForm,SpinningLogo}`, and `lib/hooks`.
  `ServicePanel`, `ServiceIndexCard`, `ServiceArt`, `Icon` are presentational.
- **Design tokens** (colours, fonts, type scale, easing) are CSS vars in `@theme`
  in `app/globals.css`. Each panel's accent is passed as `--accent` via inline
  `style` and read with `var(--accent)`.
- **Fonts:** Space Grotesk (display), Manrope (body) via `next/font`.
- **Stacking engine:** a **pinned stage** (NOT per-panel `position: sticky`). A
  tall runway (`#services`, height from `config/stack.ts`) holds one
  `sticky; top:0; height:100svh` stage; panels are absolutely positioned and
  driven by `useScroll`/`useTransform` (translateY %, + an overlay opacity for
  the covered dim). Earlier panels stay docked — no scale/fade. Zero-height
  markers (`id={slug}`) anchor each panel's docked offset.
- **Fallback:** `ServicesShowcase` renders `StackFallback` (plain vertical stack,
  media above text) when the viewport is narrower than 1024px, shorter than
  `STACK.minStageHeightPx`, under reduced motion, or before hydration. Both paths
  render identical `ServicePanel`s, so nothing is lost and anchors work either way.
- **Motion rules:** transform/opacity only; respect `prefers-reduced-motion`
  (`lib/hooks/usePrefersReducedMotion.ts`); never override cursor/selection.
- **Contact:** validation shared client+server via `lib/validation.ts`; the route
  never claims success unless a provider actually accepted the send.
```
