import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  { files: ["index.html", "en.html", "en/index.html"], forbidden: /quote|price/i, required: /route shaped around you/i },
  { files: ["zh.html", "zh/index.html"], forbidden: /報價|起價|價格/, required: /把想法整理成路線/ },
  { files: ["ja.html", "ja/index.html"], forbidden: /見積|料金/, required: /あなたに合うルート/ },
  { files: ["ko.html", "ko/index.html"], forbidden: /견적|가격/, required: /나에게 맞는 경로/ },
  { files: ["th.html", "th/index.html"], forbidden: /ราคา/, required: /เส้นทางที่เหมาะกับคุณ/ },
  { files: ["ru.html", "ru/index.html"], forbidden: /цен|расч[её]т/i, required: /маршрут, подходящий вам/i },
];

const issues = [];
for (const check of checks) {
  for (const file of check.files) {
    const html = await fs.readFile(path.join(root, file), "utf8");
    const section = html.match(/<section class="section conversion-band"[\s\S]*?<\/section>/)?.[0] || "";
    if (!section) issues.push(`${file}: conversion section missing`);
    else {
      if (check.forbidden.test(section)) issues.push(`${file}: sales-first wording remains in the process section`);
      if (!check.required.test(section)) issues.push(`${file}: traveller-first route promise missing`);
    }
  }
}

const yunnan = await fs.readFile(path.join(root, "zh/yunnan/index.html"), "utf8");
if (yunnan.includes("索取路線報價")) issues.push("zh/yunnan/index.html: sales-first navigation label remains");
if (!yunnan.includes("開始規劃路線")) issues.push("zh/yunnan/index.html: traveller-first navigation label missing");

console.log(`Traveller-first copy audit checked ${checks.flatMap((check) => check.files).length + 1} pages`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues) console.error(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
