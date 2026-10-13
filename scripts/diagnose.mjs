// Dense diagnostic: capture one transition at many scroll points to SEE the motion.
import { chromium } from "playwright";
import fs from "node:fs";
const SHOTS = process.env.SHOTS ?? "./.pw-diag";
fs.mkdirSync(SHOTS, { recursive: true });
const BASE = "http://localhost:3000";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

async function toVh(cv) {
  await page.evaluate((v) => {
    const m = document.getElementById("3d-videos");
    const y0 = m.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.round(y0 + (v / 100) * window.innerHeight));
  }, cv);
  await page.waitForTimeout(260);
}

// transition 1 is roughly currentVh 117 -> 210 (hold ends ~117, dock at 210)
// transition 3 is roughly currentVh 437 -> 530
const points = [];
for (let v = 110; v <= 220; v += 10) points.push(v);
for (const v of points) {
  await toVh(v);
  await page.screenshot({ path: `${SHOTS}/t1_vh${String(v).padStart(3, "0")}.png` });
  console.log("vh", v);
}
await browser.close();
console.log("DONE", SHOTS);
