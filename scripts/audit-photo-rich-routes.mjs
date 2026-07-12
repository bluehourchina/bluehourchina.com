import fs from "node:fs/promises";

const slugs = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet", "zhangjiajie"];
const locales = ["en", "zh", "ja", "ko", "th", "ru"];
const files = slugs.flatMap((slug) => [
  [slug === "dunhuang" ? "dunhuang.html" : `${slug}.html`, slug],
  ...locales.map((locale) => [`${locale}/${slug}/index.html`, slug]),
]);

const issues = [];
for (const [file, slug] of files) {
  const html = await fs.readFile(file, "utf8");
  const body = html.split(/<body\b/i)[1] || html;
  const images = [...body.matchAll(/<img\b[^>]*src="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((src) => !/ruoqing-(avatar|logo|mark)|bluehourchina-(logo|avatar|icon)/.test(src));
  const unique = new Set(images);
  if (unique.size < 6) issues.push(`${file}: ${unique.size} unique route images; expected at least 6`);
  if (images.length !== unique.size) issues.push(`${file}: ${images.length - unique.size} repeated route image reference(s)`);
}

console.log(`Photo-rich route audit checked ${files.length} pages`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
