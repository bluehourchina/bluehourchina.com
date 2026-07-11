import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const roots = [path.join(root, "before-china"), path.join(root, "zh", "before-china")];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

function copyFor(locale) {
  if (locale === "zh") {
    return `<div class="inline-lead-head">
              <div>
                <p class="eyebrow">私人路線初談</p>
                <h2 class="cjk-title"><span class="title-line">先看路線</span><span class="title-line">再談細節</span></h2>
                <p>留下月份、人數、目的地與舒適需求。我們回覆路線方向與參考起價。</p>
              </div>
              <div class="inline-lead-proof" aria-label="私人路線初談">
                <span>1 個工作日內人工回覆</span>
                <span>路線方向與參考起價</span>
              </div>
            </div>`;
  }
  return `<div class="inline-lead-head">
              <div>
                <p class="eyebrow">Private route check</p>
                <h2>See the route<br>before the details</h2>
                <p>Share the month, group size, destination and comfort needs. We reply with a route direction and starting estimate.</p>
              </div>
              <div class="inline-lead-proof" aria-label="Private route check">
                <span>Human reply within 1 working day</span>
                <span>Route direction and starting estimate</span>
              </div>
            </div>`;
}

let updated = 0;
for (const dir of roots) {
  for (const file of await walk(dir)) {
    let html = await fs.readFile(file, "utf8");
    if (!html.includes('class="inline-lead-head"')) continue;
    const locale = file.includes(`${path.sep}zh${path.sep}`) ? "zh" : "en";
    const before = html;
    html = html.replace(
      /<div class="inline-lead-head">[\s\S]*?<\/div>\s*(?=<form class="lead-form inline-lead-form")/,
      `${copyFor(locale)}\n            `,
    );
    if (locale === "zh") {
      html = html
        .replace(/data-lead-value="1200"/g, 'data-lead-value="8500"')
        .replace(/data-lead-currency="USD"/g, 'data-lead-currency="CNY"')
        .replace(/name="lead_currency" value="USD"/g, 'name="lead_currency" value="CNY"');
    }
    if (html !== before) {
      await fs.writeFile(file, html);
      updated += 1;
    }
  }
}

console.log(`Refined ${updated} inline route-intake sections.`);
