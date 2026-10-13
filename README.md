# ProMotion

A premium, single-page marketing site for a creative video-production agency
with **six co-equal specialist teams**: 3D, SaaS & motion graphics, editing &
post-production, podcast production, UGC & social, and on-site videography.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
Framer Motion (`motion`)**. See `CLAUDE.md` for the project map.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build && npm run start
```

## Signature interaction — stacked panels

The six service sections stack like physical panels:

- **Desktop (≥1024px):** each panel is `position: sticky; top:0; height:100svh`.
  The next panel rises from the bottom (native scroll + document flow) and pins
  over the previous one; Framer Motion (`useScroll`/`useTransform`) eases the
  covered panel to 96% scale / 90% opacity so it stays readable behind. Scroll
  up to reverse. A thin right-hand rail marks the active panel and jumps between
  sections.
- **Mobile / tablet (<1024px):** a clean natural-flow stacked reveal (no pinning),
  so tall content is never lost.
- **`prefers-reduced-motion`:** the same natural-flow sequence with no scroll-linked
  motion, and the contact logo spin disabled.

Anchor links use each panel's `id` (from `data/services.ts`) plus `scroll-margin-top`
equal to the header height, so they land correctly in every mode.

## Editing content

Everything lives in **`data/services.ts`**:

- Per service: `title`, `teamLabel`, `shortDesc`, `longDesc`, `useCases`,
  `accent.hex`, `motif`, and the `media` slots.
- Site-wide copy (hero headline/support, teams intro, contact) is the `site` export.
- Contact form regions are the `regions` export.

Nav links, cards, section IDs and the rail are all derived from this file —
change copy in one place.

## Replacing placeholder assets

Media is currently rendered as intentional inline-SVG placeholders
(`components/media/ServicePlaceholder.tsx`) — clearly labelled, never presented
as real work. Each service has the **same three slots**:

| Slot      | Aspect | Suggested real asset                                   | File location                                  |
| --------- | ------ | ------------------------------------------------------ | ---------------------------------------------- |
| `primary` | 16:9   | 1600×900 WebP/AVIF (JPG fallback); video 1920×1080 MP4+WebM + poster | `public/media/<slug>/primary.<ext>`   |
| `detailA` | 4:3    | 1200×900 WebP/AVIF                                     | `public/media/<slug>/detailA.<ext>`            |
| `detailB` | 1:1    | 1000×1000 WebP/AVIF                                    | `public/media/<slug>/detailB.<ext>`            |

Slugs: `3d-videos`, `saas-motion-graphics`, `editing-post-production`,
`podcast-production`, `ugc-social`, `videography-on-site`.

To switch a slot to a real image, edit `components/ui/MediaFrame.tsx`: replace
the `<ServicePlaceholder>` with a `next/image`, e.g.

```tsx
import Image from "next/image";
// inside the aspect box:
<Image src={`${slot.path}.webp`} alt={slot.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
```

The aspect-ratio box already prevents layout shift. Keep the `alt` text.

**Logo:** edit `components/ui/Logo.tsx` (inline, theme-aware) or replace
`public/logo.svg` (keep the viewBox ratio).

## Contact form & email delivery

- Fields: **Name, Email, Region, Message** (+ a hidden honeypot). Validation is
  shared between client and server (`lib/validation.ts`).
- The API route `app/api/contact/route.ts` validates server-side, rejects the
  honeypot, applies a best-effort in-memory rate limit, and **never fakes a send**.
- **Until a provider is configured it returns HTTP 503 `{ configured: false }`**
  and the UI says plainly that nothing was delivered.

### Connect a provider

Default is **Resend** (zero extra dependencies — the route calls the Resend API
with `fetch`). Copy `.env.example` → `.env.local` and set:

```bash
RESEND_API_KEY=...                 # https://resend.com/api-keys
CONTACT_TO_EMAIL=studio@example.com
CONTACT_FROM_EMAIL=ProMotion <hello@yourdomain.com>  # verified sender
```

Restart dev; submissions now send. These are **server-only** env vars — never
prefixed `NEXT_PUBLIC_`, never exposed client-side.

**Alternatives:**

- **Formspree** — point the form `fetch` at your Formspree endpoint instead of
  `/api/contact` (no server route needed), or have the route forward to it.
- **SMTP** — add `nodemailer` and replace the Resend `fetch` block with an SMTP
  transport using `SMTP_HOST/PORT/USER/PASS` env vars.

### Production guidance

- **Rate limiting:** the in-memory limiter resets on redeploy and is per-instance.
  For production use a durable limiter (e.g. Upstash Ratelimit / Redis) or your
  platform's WAF.
- **CAPTCHA:** add **Cloudflare Turnstile** (or hCaptcha) — render the widget in
  `ContactForm`, send the token, and verify it server-side in the route before
  delivery.
- **Spam:** keep the honeypot; consider Turnstile, content heuristics, and
  logging/alerting on the 502/429 paths.

## Accessibility & performance

- Semantic landmarks, labelled form controls with inline errors, visible
  `:focus-visible` states, and reduced-motion support throughout.
- Two variable fonts (`next/font`, `display:swap`), fixed aspect-ratio media
  (no CLS), and minimal client JS (interactivity isolated to small components).

## Project structure

See `CLAUDE.md`.
