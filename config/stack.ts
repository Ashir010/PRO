/**
 * Stacked-showcase geometry — the one place to tune the sticky stacking.
 *
 * Mechanism (CSS `position: sticky`, no JS): the six panels are siblings in a
 * tall relative container. Each panel is `sticky; top: 0` with an increasing
 * `z-index`, so as you scroll each one pins and the next rises from below and
 * covers it, while earlier panels stay pinned behind it. Each panel's card is
 * offset down by `index * peekPx`, so every previous panel leaves a visible
 * top-edge strip — an accumulating deck.
 *
 * These values are injected as CSS custom properties by ServicesShowcase and
 * consumed in app/globals.css (`.services-stack` / `.service-panel`).
 */
export const PANEL_COUNT = 6;

export const STACK = {
  peekPx: 18, // visible top-edge strip of each covered panel (the deck)
  bottomGapPx: 20, // gap below the docked card
  sideInsetVw: 2, // horizontal inset of the full-width cards
  radiusPx: 14,
  slotVh: 100, // scroll distance per panel (section height), in svh
} as const;
