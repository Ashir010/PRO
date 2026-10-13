# ProMotion

A premium, single-page marketing site for a creative video-production agency
with **six co-equal specialist teams**: 3D, SaaS & motion graphics, editing &
post-production, podcast production, UGC & social, and on-site videography. Its
signature feature is a **scroll-driven stacked-card showcase** — panels stack
like a deck, holding on each one before the next rises to cover it.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
Framer Motion (`motion`)**. See `CLAUDE.md` for the project map.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## The stacked showcase & how to tune it

A **pinned stage** drives the deck (not per-panel sticky — that gives no control
over timing). A tall runway holds one `sticky; top:0; height:100svh` stage;
panels are absolutely positioned and move via Framer Motion `useScroll` /
`useTransform`. Each panel gets a **hold phase** (stays docked and readable)
before the next **travels** up and covers it. Earlier panels stay docked — they
don't scale or fade — and a faint overlay dims covered panels. The peach runway
ends with rounded bottom corners over the black contact section.

**All timing/geometry is in one file — `config/stack.ts`:**

```ts
slotVh: 160,        // scroll distance per transition (in viewport heights)
holdRatio: 0.42,    // first 42% of a slot: current panel docked & readable
travelRatio: 0.58,  // remaining 58%: next panel rises
introHoldVh: 50,    // rest on panel 1 before the first transition
outroHoldVh: 70,    // rest on the last panel before release
peekPx: 26,         // visible top-edge strip of each covered panel
maxPeek: 3,         // cap on strips; older panels share the last position
dimCovered: 0.08,   // max black overlay on a covered panel
mobile: { slotVh: 120 },
```

- **Scroll length:** 5 transitions → runway ≈ `introHoldVh + 5·slotVh + outroHoldVh`
  = **920vh (~9.2 screens)** desktop, **720vh (~7.2 screens)** mobile. Lower
  `slotVh` for a snappier feel.
- **Mobile (<768px):** media stacks above text, `mobile.slotVh` timing.
- **Short viewports (< `minStageHeightPx`, default 640px), reduced-motion, and
  pre-hydration:** a clean vertical stack (no pinning), so tall content is never
  lost.
- **Anchors:** zero-height markers (`id={slug}`) sit at each panel's docked
  offset; nav, index cards and `#hash` smooth-scroll there with header offset.
- **Keyboard/SR:** all panel content stays in the DOM in reading order; focusing
  a control in a non-docked panel scrolls it into view so focus never rests on
  something covered.

## Editing content

Everything is in **`data/services.ts`**: per service `title`, `teamLabel`,
`description`, three `deliverables`, a `highlight` line (with the accent phrase),
`colors`, `mediaSide`, and the media slot. Site-wide copy (hero, teams intro,
contact) is the `site` export; form regions are `regions`. Nav, index cards,
panels and markers all derive from this file.

## Replacing placeholder assets

Media is rendered as intentional inline-SVG placeholders
(`components/media/ServiceArt.tsx`), clearly labelled, never shown as real work.
Each service has **one 4:5 slot**:

| Slot      | Aspect | Suggested real asset                                                        | Location                              |
| --------- | ------ | --------------------------------------------------------------------------- | ------------------------------------- |
| `primary` | 4:5    | 1600×2000 WebP (+ AVIF). Or `primary.mp4` 1080×1350 H.264 muted 6–10s ≤4 MB + `primary-poster.jpg` 1600×2000 | `public/media/<slug>/primary.<ext>` |

Slugs: `3d-videos`, `saas-motion-graphics`, `editing-post-production`,
`podcast-production`, `ugc-social`, `videography-on-site`.

To use a real image, in `components/services/ServicePanel.tsx` replace
`<ServiceArt … />` with a `next/image`:

```tsx
import Image from "next/image";
<Image src={`${service.media.path}.webp`} alt={service.media.alt} fill
  sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
```

The 4:5 box already prevents layout shift. Keep the `alt` text.

**Logo:** edit `components/ui/Logo.tsx`, or replace `public/brand/logo.svg` and
`public/brand/logo-mark.svg` (keep the mark square for the contact spinner).

## Contact form & email delivery

Fields: **Name, Email, Region, Message** (+ a hidden honeypot). Validation is
shared client+server (`lib/validation.ts`). The route
`app/api/contact/route.ts` validates server-side, rejects the honeypot, applies
a best-effort in-memory rate limit, and **never fakes a send** — until a provider
is configured it returns HTTP 503 `{ configured: false }` and the UI says so.

### Connect a provider (Resend, zero extra deps)

Copy `.env.example` → `.env.local`:

```bash
RESEND_API_KEY=...
CONTACT_TO_EMAIL=studio@example.com
CONTACT_FROM_EMAIL=ProMotion <hello@yourdomain.com>   # verified sender
```

Restart dev; submissions send. These are **server-only** vars (never
`NEXT_PUBLIC_`). Alternatives: **Formspree** (point the form `fetch` at your
endpoint), **SMTP** (add `nodemailer`, swap the Resend block).

### Production guidance

- **Rate limiting:** the in-memory limiter resets on redeploy and is per-instance
  — use a durable limiter (Upstash/Redis) or your platform WAF in production.
- **CAPTCHA:** add Cloudflare Turnstile/hCaptcha — render the widget, send the
  token, verify server-side before delivery.
- **Spam:** keep the honeypot; add Turnstile and logging on the 429/502 paths.

## Accessibility & performance

Semantic landmarks, labelled form controls with inline errors, visible
`:focus-visible`, focus management for the pinned stage, reduced-motion support,
AA-checked panel contrast. `next/image` for real media (fixed 4:5, no CLS), two
variable fonts (`swap`), minimal client JS.

## Project structure

See `CLAUDE.md`.
