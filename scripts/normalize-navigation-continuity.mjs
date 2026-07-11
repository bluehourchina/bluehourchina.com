import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excluded = new Set([".git", "node_modules", "output", "outputs", "public"]);
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet"];
const languages = ["en", "zh", "ja", "ko", "th", "ru"];

const ui = {
  en: { html: "en", short: "EN", language: "English", home: "/", stories: "/stories.html", before: "/before-china/", interest: "/interest.html", aria: "Choose language", menuAria: "Open navigation", nav: ["Destinations", "Care", "Stories", "Before China"], cta: "Plan a private journey" },
  zh: { html: "zh", short: "中", language: "繁體中文", home: "/zh.html", stories: "/zh/stories/", before: "/zh/before-china/", interest: "/zh/interest/", aria: "選擇語言", menuAria: "開啟導覽", nav: ["目的地", "照應", "故事", "出發準備"], cta: "規劃私人旅程" },
  ja: { html: "ja", short: "日", language: "日本語", home: "/ja.html", stories: "/ja/stories/", before: "/before-china/", interest: "/ja/interest/", aria: "言語を選択", menuAria: "ナビゲーションを開く", nav: ["旅先", "旅のサポート", "旅の物語", "中国へ行く前に"], cta: "旅を相談する" },
  ko: { html: "ko", short: "한", language: "한국어", home: "/ko.html", stories: "/ko/stories/", before: "/before-china/", interest: "/ko/interest/", aria: "언어 선택", menuAria: "탐색 메뉴 열기", nav: ["여행지", "여행 지원", "이야기", "중국 출발 전"], cta: "맞춤 여행 상담" },
  th: { html: "th", short: "ไทย", language: "ไทย", home: "/th.html", stories: "/th/stories/", before: "/before-china/", interest: "/th/interest/", aria: "เลือกภาษา", menuAria: "เปิดเมนูนำทาง", nav: ["จุดหมาย", "การดูแล", "เรื่องราว", "ก่อนเดินทางไปจีน"], cta: "วางแผนทริปส่วนตัว" },
  ru: { html: "ru", short: "RU", language: "Русский", home: "/ru.html", stories: "/ru/stories/", before: "/before-china/", interest: "/ru/interest/", aria: "Выбрать язык", menuAria: "Открыть навигацию", nav: ["Маршруты", "Поддержка", "Истории", "Перед поездкой"], cta: "Спланировать поездку" },
};

async function collectHtml(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

function localeFor(html) {
  const value = html.match(/<html\s+[^>]*lang="([^"]+)"/i)?.[1]?.toLowerCase() || "en";
  if (value.startsWith("zh")) return "zh";
  return languages.find((language) => value.startsWith(language)) || "en";
}

function destinationFor(relative) {
  return destinations.find((slug) => new RegExp(`(?:^|/)${slug}(?:\\.html|/index\\.html)$`).test(relative));
}

function roleFor(relative) {
  if (destinationFor(relative)) return "destinations";
  if (/(?:^|\/)stories(?:\.html|\/index\.html)$/.test(relative)) return "stories";
  if (relative.includes("before-china/")) return "before";
  if (/(?:^|\/)interest(?:\.html|\/index\.html)$/.test(relative)) return "interest";
  if (/^(?:index\.html|(?:en|zh|ja|ko|th|ru)\.html|(?:en|zh|ja|ko|th|ru)\/index\.html)$/.test(relative)) return "home";
  return "other";
}

function routeHref(slug, locale) {
  return locale === "en" ? `/${slug}.html` : `/${locale}/${slug}/`;
}

function contextualHref(relative, locale) {
  const slug = destinationFor(relative);
  if (slug) return routeHref(slug, locale);
  const role = roleFor(relative);
  if (role === "stories") return ui[locale].stories;
  if (role === "interest") return ui[locale].interest;
  if (role === "before") {
    const article = relative.match(/(?:^|\/)(?:zh\/)?before-china\/(.+)\/index\.html$/)?.[1];
    if (locale === "en") return article ? `/before-china/${article}/` : "/before-china/";
    if (locale === "zh") return article ? `/zh/before-china/${article}/` : "/zh/before-china/";
  }
  return ui[locale].home;
}

function languageMenu(relative, locale) {
  const links = languages.map((code) => {
    const current = code === locale ? ' aria-current="page"' : "";
    return `<a href="${contextualHref(relative, code)}" lang="${code}"${current}><span>${ui[code].language}</span><small>${ui[code].short}</small></a>`;
  }).join("");
  return `<details class="language-menu"><summary aria-label="${ui[locale].aria}"><span>${ui[locale].short}</span></summary><div class="language-options">${links}</div></details>`;
}

function navLinks(relative, locale, ctaHref, mobile = false) {
  const labels = ui[locale];
  const role = roleFor(relative);
  const links = [
    ["destinations", `${labels.home}#places`, labels.nav[0]],
    ["care", `${labels.home}#care`, labels.nav[1]],
    ["stories", labels.stories, labels.nav[2]],
    ["before", labels.before, labels.nav[3]],
  ].map(([linkRole, href, label]) => `<a href="${href}"${role === linkRole ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const cta = `<a class="nav-cta" href="${ctaHref}"${role === "interest" ? ' aria-current="page"' : ""}>${labels.cta}</a>`;
  if (!mobile) return `${links}${languageMenu(relative, locale)}${cta}`;
  return `<details class="site-menu"><summary aria-label="${labels.menuAria}"><span class="site-menu-icon" aria-hidden="true"></span></summary><div class="site-options">${links}${cta}</div></details>${languageMenu(relative, locale)}`;
}

function replaceDivByClass(html, className, replacement) {
  const opening = new RegExp(`<div\\s+class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, "i");
  const match = opening.exec(html);
  if (!match) return { html, replaced: false };
  const start = match.index;
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let tag;
  while ((tag = tags.exec(html))) {
    depth += tag[0].startsWith("</") ? -1 : 1;
    if (depth === 0) {
      return { html: `${html.slice(0, start)}${replacement}${html.slice(tags.lastIndex)}`, replaced: true };
    }
  }
  throw new Error(`Unclosed .${className} block`);
}

let updated = 0;
let checked = 0;
for (const file of await collectHtml(root)) {
  let html = await fs.readFile(file, "utf8");
  if (!html.includes('<nav class="nav"')) continue;
  checked += 1;
  const before = html;
  const relative = path.relative(root, file).split(path.sep).join("/");
  const locale = localeFor(html);
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/i)?.[0] || "";
  const navHrefs = [...nav.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
  const ctaHref = nav.match(/<a\s+class="nav-cta"\s+href="([^"]+)"/i)?.[1] || navHrefs.at(-1) || ui[locale].interest;
  const brandName = locale === "zh" ? "若青中國" : "Bluehour China";
  const brandLine = locale === "zh" ? "BLUEHOUR CHINA" : "若青中國旅策";
  html = html.replace(
    /<a\s+class="brand"[^>]*>[\s\S]*?<\/a>/i,
    `<a class="brand" href="${ui[locale].home}"><img class="brand-mark" src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true"><span class="brand-text"><strong>${brandName}</strong><span>${brandLine}</span></span></a>`,
  );

  const desktop = replaceDivByClass(html, "nav-links", `<div class="nav-links">${navLinks(relative, locale, ctaHref)}</div>`);
  html = desktop.html;
  if (!desktop.replaced) {
    const currentNav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/i)?.[0] || "";
    const navOpening = currentNav.match(/^<nav\b[^>]*>/i)?.[0] || '<nav class="nav">';
    const brand = currentNav.match(/<a\s+class="brand"[\s\S]*?<\/a>/i)?.[0] || "";
    html = html.replace(currentNav, `${navOpening}${brand}<div class="nav-links">${navLinks(relative, locale, ctaHref)}</div></nav>`);
  }
  const mobileMarkup = `<div class="mobile-lang" aria-label="${ui[locale].menuAria}">${navLinks(relative, locale, ctaHref, true)}</div>`;
  const mobile = replaceDivByClass(html, "mobile-lang", mobileMarkup);
  html = mobile.replaced ? mobile.html : html.replace(/<\/nav>/i, `</nav>${mobileMarkup}`);
  if (!html.includes('/assets/navigation-continuity.css')) {
    html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="/assets/navigation-continuity.css?v=20260711-nav1"></head>');
  }
  if (!html.includes('/assets/language-menu.js')) html = html.replace(/<\/body>/i, '<script src="/assets/language-menu.js" defer></script></body>');

  if (html !== before) {
    await fs.writeFile(file, html);
    updated += 1;
  }
}

console.log(`Navigation continuity normalized: ${updated} changed of ${checked} navigation pages.`);
