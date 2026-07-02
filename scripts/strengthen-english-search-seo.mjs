import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const today = "2026-07-02";

const englishCanonicals = {
  "index.html": "/",
  "en.html": "/",
  "en/index.html": "/",
  "stories.html": "/stories.html",
  "en/stories/index.html": "/stories.html",
  "yunnan.html": "/yunnan.html",
  "en/yunnan/index.html": "/yunnan.html",
  "xinjiang.html": "/xinjiang.html",
  "en/xinjiang/index.html": "/xinjiang.html",
  "dunhuang.html": "/dunhuang.html",
  "en/dunhuang/index.html": "/dunhuang.html",
  "sanya.html": "/sanya.html",
  "en/sanya/index.html": "/sanya.html",
  "northeast.html": "/northeast.html",
  "en/northeast/index.html": "/northeast.html",
  "interest.html": "/interest.html",
  "interest/index.html": "/interest.html",
  "en/interest/index.html": "/interest.html",
  "consult/index.html": "/consult/",
  "en/consult/index.html": "/consult/",
  "review/index.html": "/consult/",
  "journey-review/index.html": "/consult/",
  "apply/index.html": "/consult/",
  "ai/index.html": "/ai/",
};

const legacyChineseCampaignFiles = [
  "onepage/index.html",
  "yunnan-onepage.html",
  "budget/index.html",
  "yunnan-budget-fit.html",
  "compare/index.html",
  "yunnan-price-compare.html",
  "agency/index.html",
  "yunnan-agency-compare.html",
  "check/index.html",
  "itinerary/index.html",
  "yunnan-itinerary-check.html",
  "guide/index.html",
  "yunnan-first-trip-guide.html",
  "pilot/index.html",
  "yunnan-pilot.html",
  "quick/index.html",
  "start/index.html",
  "start.html",
  "quick.html",
  "yunnan-quick-start.html",
  "invite/index.html",
  "friend/index.html",
  "invite.html",
  "friend.html",
  "yunnan-referral-invite.html",
  "notes/index.html",
  "journal/index.html",
  "journal-yunnan.html",
  "wind-place/index.html",
  "meet-yourself/index.html",
  "yunnan-wind-place.html",
  "route/index.html",
  "yunnan-route-compare.html",
  "quiz/index.html",
  "yunnan-route-diagnosis.html",
  "video/index.html",
  "yunnan-trust-video.html",
  "fb/index.html",
  "ig/index.html",
  "line/index.html",
  "youtube/index.html",
  "social.html",
  "social-kit.html",
  "social-kit/index.html",
  "netlify-forms.html",
  "thanks.html",
  "thanks/index.html",
];

const sitemapPaths = [
  "/",
  "/yunnan.html",
  "/xinjiang.html",
  "/dunhuang.html",
  "/sanya.html",
  "/northeast.html",
  "/stories.html",
  "/interest.html",
  "/consult/",
  "/zh.html",
  "/zh/yunnan/",
  "/zh/xinjiang/",
  "/zh/dunhuang/",
  "/zh/sanya/",
  "/zh/northeast/",
  "/zh/stories/",
  "/zh/interest/",
  "/zh/consult/",
  "/ja.html",
  "/ja/yunnan/",
  "/ja/xinjiang/",
  "/ja/dunhuang/",
  "/ja/sanya/",
  "/ja/northeast/",
  "/ja/stories/",
  "/ja/interest/",
  "/ja/consult/",
  "/ko.html",
  "/ko/yunnan/",
  "/ko/xinjiang/",
  "/ko/dunhuang/",
  "/ko/sanya/",
  "/ko/northeast/",
  "/ko/stories/",
  "/ko/interest/",
  "/ko/consult/",
  "/th.html",
  "/th/yunnan/",
  "/th/xinjiang/",
  "/th/dunhuang/",
  "/th/sanya/",
  "/th/northeast/",
  "/th/stories/",
  "/th/interest/",
  "/th/consult/",
  "/ai/",
];

async function read(file) {
  return fs.readFile(path.join(root, file), "utf8");
}

async function write(file, content) {
  await fs.writeFile(path.join(root, file), content.replace(/[ \t]+$/gm, ""));
}

function upsertMetaName(html, name, content) {
  const tag = `<meta name="${name}" content="${content}">`;
  const regex = new RegExp(`<meta name="${name}" content="[^"]*">`);
  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', `<meta name="viewport" content="width=device-width, initial-scale=1">\n  ${tag}`);
}

function upsertHttpEquiv(html, name, content) {
  const tag = `<meta http-equiv="${name}" content="${content}">`;
  const regex = new RegExp(`<meta http-equiv="${name}" content="[^"]*">`);
  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', `<meta name="viewport" content="width=device-width, initial-scale=1">\n  ${tag}`);
}

function upsertCanonical(html, canonicalPath) {
  const tag = `<link rel="canonical" href="https://bluehourchina.com${canonicalPath}">`;
  if (/<link rel="canonical" href="[^"]*">/.test(html)) {
    return html.replace(/<link rel="canonical" href="[^"]*">/, tag);
  }
  return html.replace("</title>", `</title>\n  ${tag}`);
}

function addStructuredLanguage(html, language) {
  return html.replace(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g, (full, json) => {
    if (json.includes('"inLanguage"')) return full;
    const nextJson = json.replace(/("@type":\s*"[^"]+",)/, `$1\n  "inLanguage": "${language}",`);
    return `<script type="application/ld+json">\n  ${nextJson.trim()}\n  </script>`;
  });
}

function strengthenEnglishPage(html, canonicalPath) {
  html = upsertCanonical(html, canonicalPath);
  html = upsertHttpEquiv(html, "content-language", "en");
  html = upsertMetaName(html, "language", "English");
  html = upsertMetaName(html, "audience", "international travellers");
  html = upsertMetaName(html, "robots", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
  html = upsertMetaName(html, "googlebot", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
  html = addStructuredLanguage(html, "en");
  return html;
}

function noindexLegacyPage(html) {
  html = upsertMetaName(html, "robots", "noindex,follow");
  html = upsertMetaName(html, "googlebot", "noindex,follow");
  return html;
}

function priorityFor(urlPath) {
  if (urlPath === "/") return "1.0";
  if (urlPath.includes("consult") || urlPath.includes("interest")) return "0.9";
  if (urlPath === "/ai/") return "0.8";
  return "0.8";
}

async function updateSitemap() {
  const body = sitemapPaths.map((urlPath) => `  <url>
    <loc>https://bluehourchina.com${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priorityFor(urlPath)}</priority>
  </url>`).join("\n");
  await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}

for (const [file, canonicalPath] of Object.entries(englishCanonicals)) {
  try {
    await write(file, strengthenEnglishPage(await read(file), canonicalPath));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

for (const file of legacyChineseCampaignFiles) {
  try {
    await write(file, noindexLegacyPage(await read(file)));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

await updateSitemap();

console.log("English search SEO signals strengthened");
