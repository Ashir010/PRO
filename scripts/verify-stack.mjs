// Visual verification of the stacked showcase via Playwright.
// Usage: SHOTS=<dir> node scripts/verify-stack.mjs  (dev/start server on :3000)
//
// Scroll is directly linked to the pinned stage, so a given scroll position
// always renders the same frame — we drive window.scrollTo to exact offsets
// computed from config/stack.ts and screenshot each phase.

import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SHOTS = process.env.SHOTS ?? "./.pw-shots";
fs.mkdirSync(SHOTS, { recursive: true });

// MUST match config/stack.ts
const STACK = { slotVh: 160, holdRatio: 0.42, introHoldVh: 50, mobileSlotVh: 120 };
const SLUGS = [
  "3d-videos",
  "saas-motion-graphics",
  "editing-post-production",
  "podcast-production",
  "ugc-social",
  "videography-on-site",
];

const markerVh = (j, slot) => (j === 0 ? 0 : STACK.introHoldVh + j * slot);

async function prep(page) {
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
}

// scroll so the stage shows `currentVh` (0..runway) of progress
async function toVh(page, currentVh) {
  await page.evaluate((cv) => {
    const m = document.getElementById("3d-videos"); // marker 0 == runway top
    const y0 = m.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.round(y0 + (cv / 100) * window.innerHeight));
  }, currentVh);
  await page.waitForTimeout(380);
}

async function shot(page, name) {
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
  console.log("  shot", name);
}

const browser = await chromium.launch();

async function pinnedRun(label, viewport, slot) {
  console.log(`[${label}] ${viewport.width}x${viewport.height} slot=${slot}`);
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await prep(page);

  await shot(page, `${label}_00_hero`);

  // Panel 0 docked + hold-static proof (two frames across its hold → identical)
  await toVh(page, 0);
  await shot(page, `${label}_01_p0_docked`);
  await toVh(page, 10);
  await shot(page, `${label}_02_p0_hold_a`);
  const holdEnd = STACK.introHoldVh + STACK.holdRatio * slot - 4;
  await toVh(page, holdEnd);
  await shot(page, `${label}_03_p0_hold_b`);

  // Transition 1 mid-travel (panel 1 covering panel 0)
  const t1mid = STACK.introHoldVh + STACK.holdRatio * slot + 0.5 * (slot - STACK.holdRatio * slot);
  await toVh(page, t1mid);
  await shot(page, `${label}_04_t1_mid_travel`);

  // Each panel docked (peek strips grow)
  for (let j = 1; j < SLUGS.length; j++) {
    await toVh(page, markerVh(j, slot));
    await shot(page, `${label}_1${j}_p${j}_docked`);
  }

  // Anchor: hash nav to panel 3 (podcast) should land it docked
  await page.evaluate(() => {
    location.hash = "#podcast-production";
  });
  await page.waitForTimeout(500);
  await shot(page, `${label}_20_anchor_podcast`);

  // Reverse: jump to end, then back to a mid-travel (frame must match forward)
  await toVh(page, markerVh(5, slot));
  await toVh(page, markerVh(2, slot) + STACK.holdRatio * slot + 20);
  await shot(page, `${label}_21_reverse_midtravel`);

  // Contact revealed under the peach rounded bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await shot(page, `${label}_22_contact`);

  await ctx.close();
}

async function flowRun(label, viewport, opts = {}) {
  console.log(`[${label}] flow ${viewport.width}x${viewport.height}`);
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await prep(page);
  // scroll to the services section and down a bit
  await page.evaluate(() => {
    document.getElementById("services")?.scrollIntoView();
  });
  await page.waitForTimeout(300);
  await shot(page, `${label}_services_top`);
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(300);
  await shot(page, `${label}_services_next`);
  // anchor landing in flow mode
  await page.evaluate(() => {
    location.hash = "#ugc-social";
  });
  await page.waitForTimeout(400);
  await shot(page, `${label}_anchor_ugc`);
  await ctx.close();
}

// --- desktop (pinned) ---
await pinnedRun("d1280", { width: 1280, height: 720 }, STACK.slotVh);
await pinnedRun("d1440x900", { width: 1440, height: 900 }, STACK.slotVh);

// short desktop (still pinned, fit check)
async function fitRun(label, viewport) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await prep(page);
  await toVh(page, markerVh(2, STACK.slotVh)); // a dark panel, docked
  await shot(page, `${label}_p2_docked_fit`);
  await ctx.close();
}
await fitRun("d1440x700", { width: 1440, height: 700 });

// tablet (pinned at >=768px; two-column panel)
await pinnedRun("t768", { width: 768, height: 1024 }, STACK.slotVh);
await pinnedRun("t1024land", { width: 1024, height: 768 }, STACK.slotVh);
await pinnedRun("ipad834", { width: 834, height: 1112 }, STACK.slotVh);

// mobile portrait (<768 -> flow fallback, media over text)
await flowRun("m390", { width: 390, height: 844 });

// mobile landscape (short -> flow fallback)
await flowRun("m844land", { width: 844, height: 390 });

// reduced motion (flow fallback)
await flowRun("reduced", { width: 1280, height: 720 }, { reducedMotion: "reduce" });

await browser.close();
console.log("DONE -> ", SHOTS);
