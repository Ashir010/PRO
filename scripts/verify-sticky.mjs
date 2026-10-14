// Verify the CSS sticky stacking by scrolling in viewport increments.
import { chromium } from "playwright";
import fs from "node:fs";
const SHOTS = process.env.SHOTS ?? "./.pw-sticky";
fs.mkdirSync(SHOTS, { recursive: true });
const BASE = "http://localhost:3000";

const browser = await chromium.launch();

async function scrollRun(label, viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

  // find the services section top and bottom
  const geo = await page.evaluate(() => {
    const el = document.getElementById("services");
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: el.offsetHeight };
  });

  const vh = viewport.height;
  // step ~0.5 viewport from just before the stack through its end
  let n = 0;
  for (let y = geo.top - vh * 0.1; y <= geo.top + geo.height - vh; y += vh * 0.5) {
    await page.evaluate((yy) => window.scrollTo(0, Math.round(yy)), y);
    await page.waitForTimeout(220);
    await page.screenshot({ path: `${SHOTS}/${label}_${String(n).padStart(2, "0")}.png` });
    n++;
  }
  // anchor landing
  await page.evaluate(() => (location.hash = "#podcast-production"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOTS}/${label}_anchor_podcast.png` });
  console.log(label, "captured", n, "scroll frames");
  await ctx.close();
}

await scrollRun("desk1366x700", { width: 1366, height: 700 });
await scrollRun("desk1280x720", { width: 1280, height: 720 });
await scrollRun("reduced1366x700", { width: 1366, height: 700 }, { reducedMotion: "reduce" });
await scrollRun("mobile390", { width: 390, height: 844 });

await browser.close();
console.log("DONE ->", SHOTS);
