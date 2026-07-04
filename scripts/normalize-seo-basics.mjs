import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const origin = "https://bluehourchina.com";
const skipDirs = new Set([".git", "outputs", "node_modules"]);
const descriptionUpdates = new Map([
  ["ai/index.html", "AI-search reference for Bluehour China Journeys: private China travel advisory beyond Beijing and Shanghai, covering Yunnan, Xinjiang, Dunhuang, Sanya and Northeast China."],
  ["index.html", "Private China journey advisory beyond Beijing and Shanghai: Yunnan, Xinjiang, Dunhuang, Sanya and Northeast China with language support and local care."],
  ["en.html", "Private China journey advisory beyond Beijing and Shanghai: Yunnan, Xinjiang, Dunhuang, Sanya and Northeast China with language support and local care."],
  ["en/index.html", "Private China journey advisory beyond Beijing and Shanghai: Yunnan, Xinjiang, Dunhuang, Sanya and Northeast China with language support and local care."],
  ["yunnan/index.html", "A quiet Yunnan private journey for travellers returning to China: Dali lake light, Shaxi old town, Lijiang or Baisha snow mountains, with calm pacing and local care."],
  ["credits.html", "Image credits, source notes and licensing references for Bluehour China Journeys, including AI brand visuals and Yunnan travel photography."],
  ["credits/index.html", "Image credits, source notes and licensing references for Bluehour China Journeys, including AI brand visuals and Yunnan travel photography."],
  ["zh/interest/index.html", "雲南、新疆、敦煌、三亞，或北方的雪。留下季節、人數、舒適需求與語言偏好，若青中國旅策會回覆路線筆記與初步報價"],
  ["zh/consult/index.html", "若青中國旅策為外國旅人整理中國深度路線初談，人工判斷目的地、季節、舒適度、語言需求與在地照應方式。"],
  ["zh/stories/index.html", "用短篇故事認識雲南、新疆、敦煌、三亞與東北的中國風景，先感受地方氣息，再決定下一次中國旅行。"],
  ["ja/interest/index.html", "雲南、新疆、敦煌、三亜、北国の冬。季節、人数、安心したいこと、言語の希望を伝えて、最初の方向を整えます。"],
  ["ja/consult/index.html", "北京・上海の次に中国を深く旅したい方へ、季節、移動、宿、言葉の不安を読み、静かな初回相談で方向を整えます。"],
  ["ja/stories/index.html", "雲南、新疆、敦煌、三亜、東北の短い物語から、次の中国旅行が自分に合うかを静かに感じてください。"],
]);

async function walk(dir = root, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path.relative(root, full));
  }
  return files;
}

function hasNoIndex(html) {
  return /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

function canonicalFor(file) {
  if (file === "index.html") return `${origin}/`;
  if (file.endsWith("/index.html")) return `${origin}/${file.slice(0, -"index.html".length)}`;
  return `${origin}/${file}`;
}

const changed = [];

for (const file of await walk()) {
  const full = path.join(root, file);
  let html = await fs.readFile(full, "utf8");
  const before = html;

  if (descriptionUpdates.has(file)) {
    html = html.replace(
      /<meta name="description" content="[^"]*">/i,
      `<meta name="description" content="${descriptionUpdates.get(file)}">`
    );
  }

  if (!hasNoIndex(html) && !/<link\b[^>]*rel=["']canonical["']/i.test(html)) {
    const canonical = `  <link rel="canonical" href="${canonicalFor(file)}">`;
    if (/<meta name="description"[^>]*>\n/i.test(html)) {
      html = html.replace(/(<meta name="description"[^>]*>\n)/i, `$1${canonical}\n`);
    } else {
      html = html.replace(/(<title>[\s\S]*?<\/title>\n)/i, `$1${canonical}\n`);
    }
  }

  if (html !== before) {
    await fs.writeFile(full, html);
    changed.push(file);
  }
}

console.log(`normalized-seo-files ${changed.length}`);
for (const file of changed) console.log(file);
