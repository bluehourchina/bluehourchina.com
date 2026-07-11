import fs from "node:fs/promises";

const slugs = ["xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast"];
const locales = ["en", "zh", "ja", "ko", "th", "ru"];
const files = slugs.flatMap((slug) => [
  [slug === "dunhuang" ? "dunhuang.html" : `${slug}.html`, slug],
  ...locales.map((locale) => [`${locale}/${slug}/index.html`, slug]),
]);

const issues = [];
for (const [file, slug] of files) {
  const html = await fs.readFile(file, "utf8");
  const gallery = html.match(/(?:<!-- real-scenes-start -->)?[\s\S]*?<section class="section material-notes-band"[\s\S]*?<\/section>(?:[\s\S]*?<!-- real-scenes-end -->)?/)?.[0] || "";
  const cards = gallery.match(/class="material-card"/g)?.length || 0;
  const images = new Set([...gallery.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map((match) => match[1]));
  if (cards < 6) issues.push(`${file}: ${cards} photo cards; expected at least 6`);
  if (images.size < 6) issues.push(`${file}: ${images.size} unique gallery images; expected at least 6`);
  if (slug !== "dunhuang" && !gallery.includes("real-scenes-start")) issues.push(`${file}: gallery markers missing`);
}

console.log(`Photo-rich route audit checked ${files.length} pages`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
