/**
 * Stacked-showcase timing & geometry — the ONE place to tune the interaction.
 *
 * Model (per the brief): a pinned stage. Panel 0 starts docked. Each later
 * panel rises during its "slot". A slot is split into a HOLD (current panel
 * stays docked and readable) then a TRAVEL (next panel rises). `introHoldVh`
 * and `outroHoldVh` are extra rests on the first/last panels.
 *
 * Units: *Vh values are in viewport heights (100 = one screen). px values are px.
 */
export const STACK = {
  slotVh: 160, // scroll distance per transition (hold + travel)
  holdRatio: 0.42, // first 42% of a slot: current panel docked & readable
  travelRatio: 0.58, // remaining 58%: next panel rises
  introHoldVh: 50, // rest on panel 1 before the first transition
  outroHoldVh: 70, // rest on the last panel before the stage releases
  peekPx: 26, // visible top-edge strip of each covered panel
  maxPeek: 3, // cap on visible strips; older panels share the last position
  ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  dimCovered: 0.08, // max black overlay on a covered panel (0 disables)
  topGapPx: 72, // gap from viewport top to the first docked panel (clears header)
  bottomGapPx: 24, // gap below the docked panel
  minStageHeightPx: 640, // below this viewport height -> flow fallback
  sideInsetVw: 2, // horizontal inset of the full-width cards
  radiusPx: 14,
  mobile: { slotVh: 120 },
} as const;

/** Slot distance in use for a given mode. */
export function slotVhFor(isMobile: boolean): number {
  return isMobile ? STACK.mobile.slotVh : STACK.slotVh;
}

/** Total runway height, in vh, for `count` panels. */
export function runwayVh(count: number, slotVh: number): number {
  const transitions = Math.max(0, count - 1);
  return STACK.introHoldVh + transitions * slotVh + STACK.outroHoldVh;
}

/**
 * Scroll offset (vh from runway start) at which panel `j` is fully docked —
 * i.e. the start of its hold. Used to place anchor markers.
 */
export function markerVh(j: number, slotVh: number): number {
  return j === 0 ? 0 : STACK.introHoldVh + j * slotVh;
}

/** Docked top offset (px) of panel `j` within the stage. */
export function dockedOffsetPx(j: number): number {
  return STACK.topGapPx + Math.min(j, STACK.maxPeek) * STACK.peekPx;
}

/** Travel window [startVh, endVh] during which panel `j` (j>=1) rises. */
export function travelWindowVh(j: number, slotVh: number): [number, number] {
  const slotStart = STACK.introHoldVh + (j - 1) * slotVh;
  return [slotStart + STACK.holdRatio * slotVh, STACK.introHoldVh + j * slotVh];
}

/** CSS height shared by every panel so the deck lines up and fits one screen. */
export const PANEL_HEIGHT_CSS = `calc(100svh - ${
  STACK.topGapPx + STACK.bottomGapPx + STACK.maxPeek * STACK.peekPx
}px)`;
