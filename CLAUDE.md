# ProMotion — project guide

Premium single-page marketing site for a video-production agency with six
co-equal specialist teams. Signature interaction: scroll-driven stacked panels.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first config in `app/globals.css` via `@theme`)
- **motion** (Framer Motion v14) — `import ... from "motion/react"`
- No other runtime dependencies. Contact email uses a zero-dep `fetch` to Resend.

## Commands

```bash
npm run dev     # local dev (Turbopack)
npm run build   # production build
npm run start   # serve the build
npm run lint    # ESLint (eslint-config-next)
npx tsc --noEmit  # typecheck
```

## Where content & media live

- **All service copy, accents, slugs, team labels and media slots:**
  `data/services.ts` — the single source of truth. Nav links, cards and section
  IDs all derive from it. Edit copy here.
- **Site-wide copy** (hero, teams intro, contact): the `site` export in the same file.
- **Media:** placeholders are rendered as inline SVG (`components/media/ServicePlaceholder.tsx`).
  Real assets go in `public/media/<service-slug>/<slot>.<ext>` and are swapped in
  via `components/ui/MediaFrame.tsx`. See README → "Replacing placeholder assets".
- **Logo:** `components/ui/Logo.tsx` (inline, theme-aware) and `public/logo.svg`.

## Conventions

- **Server components by default.** Client components (`"use client"`) only where
  interactivity/motion is required: `Header`, `services/ServiceStack` +
  `ServicePanel` + `ProgressRail`, `contact/ContactForm` + `SpinningLogo`, and the
  hooks in `lib/hooks`. `ServiceSectionContent` is shared static markup reused by
  both the sticky and flow paths — keep it presentational.
- **Design tokens** (colors, fonts, type scale, easing) are CSS variables in
  `@theme` in `app/globals.css`. Per-service accent is passed as the `--accent`
  custom property via inline `style` and consumed with `var(--accent)`.
- **Motion rules:** transform/opacity only; respect `prefers-reduced-motion`
  (see `lib/hooks/usePrefersReducedMotion.ts`); never override cursor/selection.
- **Stacking:** sticky-per-panel + `useScroll`/`useTransform` for the cover depth
  only. Desktop (>=1024px) stacks; below that and under reduced motion it falls
  back to a natural-flow stacked reveal. Panels are `100svh`; keep section
  content able to fit one viewport at desktop widths.
- **Contact:** validation is shared client+server via `lib/validation.ts`. The
  route never claims success unless an email provider actually accepted the send.
```
