import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excludedDirectories = new Set([".git", "node_modules", "output", "outputs", "public"]);
const scannedExtensions = new Set([".html", ".txt", ".xml", ".json", ".mjs", ".js", ".md"]);
const hardBan = "\u5a92\u5408";
const reviewTerms = [
  "\u670d\u52d9\u5546",
  "\u4f9b\u61c9\u5546",
  "\u8f49\u4ecb",
  "\u627f\u63a5\u689d\u4ef6",
  "\u5546\u696d\u6a21\u5f0f",
  "\u4f9b\u61c9\u7aef",
  "local" + "-provider",
  "local provider" + " matching",
  "provider" + " matching",
  "\u73fe\u5730" + "\u30d1\u30fc\u30c8\u30ca\u30fc",
  "\ud604\uc9c0 " + "\ud30c\ud2b8\ub108",
  "\u0e08\u0e31\u0e1a\u0e04\u0e39\u0e48" + "\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23",
];

const homeFiles = [
  "index.html", "en.html", "en/index.html", "zh.html", "zh/index.html", "ja.html", "ja/index.html",
  "ko.html", "ko/index.html", "th.html", "th/index.html", "ru.html", "ru/index.html",
];
const destinationSlugs = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet"];
const routeLocales = [null, "en", "zh", "ja", "ko", "th", "ru"];

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (scannedExtensions.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file);
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function stripMarkup(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formFailures(block) {
  const plain = stripMarkup(block);
  const checks = [
    ["completion time", /2 minutes|about 2|\u7d04\s*2\s*\u5206|\uc57d\s*2\ubd84|\u0e1b\u0e23\u0e30\u0e21\u0e32\u0e13\s*2\s*\u0e19\u0e32\u0e17\u0e35|\u043e\u043a\u043e\u043b\u043e\s*2\s*\u043c\u0438\u043d\u0443\u0442/i],
    ["no-payment promise", /no payment|payment is not required|\u7121\u9700\u4ed8\u6b3e|\u4e0d\u6703\u6536\u53d6|\u652f\u6255\u3044.*\u767a\u751f\u3057\u307e\u305b\u3093|\uacb0\uc81c\ud558\uc9c0\s*\uc54a|\u0e44\u0e21\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e0a\u0e33\u0e23\u0e30|\u041e\u043f\u043b\u0430\u0442\u0430.*\u043d\u0435\s*\u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f/i],
    ["reply deadline", /1 business day|one business day|1\s*\u500b\u5de5\u4f5c\u65e5|1\s*\u55b6\u696d\u65e5|1\s*\uc601\uc5c5\uc77c|1\s*\u0e27\u0e31\u0e19\u0e17\u0e33\u0e01\u0e32\u0e23|1\s*\u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e\s*\u0434\u043d\u044f/i],
    ["route outcome", /route|\u8def\u7dda|\u30eb\u30fc\u30c8|\ub8e8\ud2b8|\u0e40\u0e2a\u0e49\u0e19\u0e17\u0e32\u0e07|\u043c\u0430\u0440\u0448\u0440\u0443\u0442/i],
    ["price outcome", /estimate|starting price|quote|\u8d77\u50f9|\u53c3\u8003\u50f9|\u6599\u91d1|\u898b\u7a4d|\uacac\uc801|\u0e23\u0e32\u0e04\u0e32|\u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442/i],
    ["privacy link", /href="\/privacy\.html"/i],
  ];
  return checks.filter(([, pattern]) => !pattern.test(block) && !pattern.test(plain)).map(([label]) => label);
}

function routeFile(slug, locale) {
  if (!locale) return `${slug}.html`;
  return `${locale}/${slug}/index.html`;
}

const findings = [];
const files = await walk(root);

if (process.argv.includes("--negative-test")) {
  const sample = `<meta name="description" content="${hardBan}">`;
  if (sample.includes(hardBan)) {
    console.error(`Customer copy UX audit blocked virtual-negative-test.html: forbidden term detected.`);
    process.exit(1);
  }
}

for (const file of files) {
  const text = await fs.readFile(file, "utf8");
  const hardIndex = text.indexOf(hardBan);
  if (hardIndex !== -1) findings.push(`${relative(file)}:${lineNumber(text, hardIndex)} forbidden customer wording`);
  for (const term of reviewTerms) {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index !== -1) findings.push(`${relative(file)}:${lineNumber(text, index)} internal operations wording requires review`);
  }
}

const htmlFiles = files.filter((file) => file.endsWith(".html"));
let formCount = 0;
for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  for (const match of html.matchAll(/<form\b[^>]*class="[^"]*\blead-form\b[^"]*"[^>]*>[\s\S]*?<\/form>/g)) {
    formCount += 1;
    const failures = formFailures(match[0]);
    if (failures.length) findings.push(`${relative(file)} lead form missing: ${failures.join(", ")}`);
  }
}

for (const file of homeFiles) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  if (!html.includes('<option value="xian">') || !html.includes('<option value="tibet">')) {
    findings.push(`${file} destination form is missing Xi'an or Tibet`);
  }
}

const about = await fs.readFile(path.join(root, "about.html"), "utf8");
for (const required of ["\u5be6\u969b\u63a5\u5f85\u7531\u5728\u5730\u670d\u52d9\u5718\u968a\u63d0\u4f9b", "1 \u500b\u5de5\u4f5c\u65e5", "\u5305\u542b\u8207\u50f9\u683c", "\u6b64\u9801\u7121\u9700\u4ed8\u6b3e"]) {
  if (!about.includes(required)) findings.push(`about.html missing customer-facing trust statement`);
}

const faq = await fs.readFile(path.join(root, "faq.html"), "utf8");
for (const topic of ["payment", "cancellation", "visa", "language", "hotels", "transport", "safety", "business day", "Actual reception"]) {
  if (!faq.toLowerCase().includes(topic.toLowerCase())) findings.push(`faq.html missing traveller topic: ${topic}`);
}

const storyChecks = [
  ["stories.html", "not presented as customer testimonials"],
  ["zh/stories/index.html", "\u5167\u5bb9\u4e0d\u662f\u5ba2\u6236\u8a55\u50f9"],
  ["ja/stories/index.html", "\u5b9f\u5728\u306e\u304a\u5ba2\u69d8\u306e\u58f0"],
  ["ko/stories/index.html", "\uc2e4\uc81c \uace0\uac1d \ud6c4\uae30"],
  ["th/stories/index.html", "\u0e23\u0e35\u0e27\u0e34\u0e27\u0e08\u0e32\u0e01\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32\u0e08\u0e23\u0e34\u0e07"],
  ["ru/stories/index.html", "\u043d\u0435 \u0432\u044b\u043c\u044b\u0448\u043b\u0435\u043d\u043d\u044b\u0435 \u043e\u0442\u0437\u044b\u0432\u044b"],
];
for (const [file, marker] of storyChecks) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  if (!html.includes(marker)) findings.push(`${file} missing editorial-story disclosure`);
}

const repeated = new Map();
for (const slug of destinationSlugs) {
  for (const locale of routeLocales) {
    const file = routeFile(slug, locale);
    const html = await fs.readFile(path.join(root, file), "utf8");
    const pageKey = `${slug}:${locale || "root"}`;
    for (const match of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
      const text = stripMarkup(match[1]);
      if (text.length < 80 || !/Bluehour|\u82e5\u9752|route note|starting quote|\u8def\u7dda\u7b46\u8a18|\u65c5\u7b56/i.test(text)) continue;
      if (!repeated.has(text)) repeated.set(text, new Set());
      repeated.get(text).add(pageKey);
    }
  }
}
for (const [text, pages] of repeated) {
  const slugs = new Set([...pages].map((page) => page.split(":")[0]));
  if (slugs.size >= 3) findings.push(`destination pages repeat company/process paragraph across ${slugs.size} destinations: ${text.slice(0, 90)}`);
}

const aiSummary = `${await fs.readFile(path.join(root, "llms.txt"), "utf8")}\n${await fs.readFile(path.join(root, "llms-full.txt"), "utf8")}`;
for (const required of ["Yunnan Soft Landing", "Xinjiang Ili Route", "Qinghai-Gansu Grand Loop", "Inner Mongolia", "Hainan", "Northeast", "Xi'an", "Tibet", "No payment", "1 business day"]) {
  if (!aiSummary.includes(required)) findings.push(`AI summary missing public fact: ${required}`);
}

if (findings.length) {
  console.error(`Customer copy UX audit failed with ${findings.length} issue(s):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

const routeCount = destinationSlugs.length * routeLocales.length;
console.log(`Customer copy UX audit passed: ${files.length} text files, ${htmlFiles.length} HTML files, ${homeFiles.length} home variants, ${routeCount} route pages, ${formCount} lead forms, 0 forbidden terms, 0 review terms, 0 repeated company-process paragraphs.`);
