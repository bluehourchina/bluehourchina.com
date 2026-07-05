import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = process.cwd();
const outDir = path.join(root, "assets", "social");

const cards = [
  {
    output: "bluehour-route-note-24h.png",
    source: "assets/ai/bluehour-china-hero-luxury-lake-v2.jpg",
    eyebrow: "BLUEHOUR CHINA JOURNEYS",
    title: ["A China route note", "before you book", "the wrong week"],
    lines: ["Send month, group, days and comfort needs.", "Receive a concise route direction and quote."],
    cta: "bluehourchina.com/route-note",
  },
  {
    output: "bluehour-referral-card.png",
    source: "assets/ai/bluehour-yunnan-luxury-dali-terrace.jpg",
    eyebrow: "WARM REFERRAL",
    title: ["Know someone", "planning China?"],
    lines: ["One quiet first step for travellers going", "beyond Beijing and Shanghai."],
    cta: "bluehourchina.com/refer",
  },
  {
    output: "bluehour-payment-2026-card.png",
    source: "assets/ai/bluehour-yunnan-luxury-shaxi-courtyard.jpg",
    eyebrow: "BEFORE CHINA",
    title: ["WeChat Pay,", "PayPal, Visa", "and Mastercard"],
    lines: ["Useful payment news is not a travel plan.", "Prepare layers before regional China."],
    cta: "bluehourchina.com/before-china",
  },
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textLines(lines, startY, size, weight, fill, lineGap) {
  return lines
    .map((line, index) => {
      const y = startY + index * lineGap;
      return `<text x="76" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function overlay(card) {
  return Buffer.from(`
<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#06130f" stop-opacity=".95"/>
      <stop offset=".56" stop-color="#06130f" stop-opacity=".68"/>
      <stop offset="1" stop-color="#06130f" stop-opacity=".18"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1">
      <stop offset=".35" stop-color="#06130f" stop-opacity="0"/>
      <stop offset="1" stop-color="#06130f" stop-opacity=".74"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#shade)"/>
  <rect width="1080" height="1350" fill="url(#floor)"/>
  <rect x="42" y="42" width="996" height="1266" fill="none" stroke="#fffaf0" stroke-opacity=".22" stroke-width="2"/>
  <text x="76" y="128" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" letter-spacing="7" fill="#c99a52">${escapeXml(card.eyebrow)}</text>
  <g font-family="Georgia, 'Times New Roman', serif">
    ${textLines(card.title, 370, 92, 500, "#fffaf0", 106)}
  </g>
  <g font-family="Arial, Helvetica, sans-serif">
    ${textLines(card.lines, 790, 35, 700, "rgba(255,250,240,.84)", 52)}
  </g>
  <rect x="76" y="1058" width="620" height="86" fill="#c99a52"/>
  <text x="108" y="1113" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="#13241f">${escapeXml(card.cta)}</text>
  <text x="76" y="1228" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" letter-spacing="4" fill="rgba(255,250,240,.72)">若青中國旅策</text>
</svg>`);
}

await fs.mkdir(outDir, { recursive: true });

for (const card of cards) {
  const source = path.join(root, card.source);
  const output = path.join(outDir, card.output);
  await sharp(source)
    .resize(1080, 1350, { fit: "cover" })
    .composite([{ input: overlay(card), left: 0, top: 0 }])
    .png({ quality: 92 })
    .toFile(output);
  console.log(output);
}
