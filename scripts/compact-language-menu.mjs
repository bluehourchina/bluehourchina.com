import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet", "zhangjiajie"];
const localeNames = {
  en: { short: "EN", full: "English" },
  zh: { short: "中", full: "繁體中文" },
  ja: { short: "日", full: "日本語" },
  ko: { short: "한", full: "한국어" },
  th: { short: "ไทย", full: "ไทย" },
  ru: { short: "RU", full: "Русский" },
};

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "outputs" || entry.name === ".git") continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

function localeFor(html, relative) {
  const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)/i)?.[1]?.toLowerCase() || "";
  if (lang.startsWith("zh") || relative.startsWith("zh/") || relative === "zh.html") return "zh";
  if (lang.startsWith("ja") || relative.startsWith("ja/") || relative === "ja.html") return "ja";
  if (lang.startsWith("ko") || relative.startsWith("ko/") || relative === "ko.html") return "ko";
  if (lang.startsWith("th") || relative.startsWith("th/") || relative === "th.html") return "th";
  if (lang.startsWith("ru") || relative.startsWith("ru/") || relative === "ru.html") return "ru";
  return "en";
}

function contentType(relative) {
  const destination = destinations.find((slug) =>
    relative === `${slug}.html` || relative.endsWith(`/${slug}/index.html`),
  );
  if (destination) return { kind: "destination", slug: destination };
  if (/^(?:en\/|zh\/|ja\/|ko\/|th\/|ru\/)?(?:interest|consult)\/index\.html$/.test(relative) || relative === "interest.html") return { kind: "interest" };
  if (/^(?:en\/|zh\/|ja\/|ko\/|th\/)?stories\/index\.html$/.test(relative) || relative === "stories.html") return { kind: "stories" };
  if (relative.includes("yunnan-grand-loop")) return { kind: "grand-loop" };
  const beforeChina = relative.match(/^(?:zh\/)?before-china\/(.*)$/);
  if (beforeChina) return { kind: "before-china", tail: beforeChina[1] };
  return { kind: "home" };
}

function hrefsFor(type) {
  const home = { en: "/", zh: "/zh.html", ja: "/ja.html", ko: "/ko.html", th: "/th.html", ru: "/ru.html" };
  if (type.kind === "destination") {
    return {
      en: `/${type.slug}.html`,
      zh: `/zh/${type.slug}/`,
      ja: `/ja/${type.slug}/`,
      ko: `/ko/${type.slug}/`,
      th: `/th/${type.slug}/`,
      ru: `/ru/${type.slug}/`,
    };
  }
  if (type.kind === "interest") {
    return { en: "/interest.html", zh: "/zh/interest/", ja: "/ja/interest/", ko: "/ko/interest/", th: "/th/interest/", ru: "/ru/interest/" };
  }
  if (type.kind === "stories") {
    return { en: "/en/stories/", zh: "/zh/stories/", ja: "/ja/stories/", ko: "/ko/stories/", th: "/th/stories/", ru: "/ru/stories/" };
  }
  if (type.kind === "grand-loop") {
    return { en: "/yunnan-grand-loop/", zh: "/zh/yunnan-grand-loop/", ja: "/ja/yunnan/", ko: "/ko/yunnan/", th: "/th/yunnan/", ru: "/ru/yunnan/" };
  }
  if (type.kind === "before-china") {
    const article = type.tail === "index.html" ? "" : type.tail;
    return {
      en: `/before-china/${article}`,
      zh: `/zh/before-china/${article}`,
      ja: home.ja,
      ko: home.ko,
      th: home.th,
      ru: home.ru,
    };
  }
  return home;
}

function languageMenu(locale, hrefs) {
  const links = Object.entries(localeNames).map(([code, label]) => {
    const current = code === locale ? ' aria-current="page"' : "";
    return `<a href="${hrefs[code]}" lang="${code}"${current}><span>${label.full}</span><small>${label.short}</small></a>`;
  }).join("");
  return `<details class="language-menu"><summary aria-label="Choose language"><span>${localeNames[locale].short}</span></summary><div class="language-options">${links}</div></details>`;
}

function russianAlternate(type) {
  return `<link rel="alternate" hreflang="ru" href="https://bluehourchina.com${hrefsFor(type).ru}">`;
}

const files = await walk(root);
let changed = 0;
let skipped = 0;

for (const absolute of files) {
  const relative = path.relative(root, absolute).split(path.sep).join("/");
  let html = await fs.readFile(absolute, "utf8");
  const type = contentType(relative);
  const hasLegacyDesktop = html.includes('class="language-switch"');
  const hasLegacyMobile = html.includes('class="mobile-lang"') && !html.includes('class="language-menu"');
  const needsDestinationMenu = type.kind === "destination" && !html.includes('class="language-menu"') && html.includes('class="nav-links"');
  if (!hasLegacyDesktop && !hasLegacyMobile && !needsDestinationMenu) continue;

  const locale = localeFor(html, relative);
  const menu = languageMenu(locale, hrefsFor(type));
  const before = html;

  html = html.replace(/<span class="language-switch"[^>]*>[\s\S]*?<\/span>/g, menu);
  if (hasLegacyMobile || !html.match(/<div class="mobile-lang"[^>]*>\s*<details class="language-menu"/)) {
    html = html.replace(/<div class="mobile-lang"([^>]*)>[\s\S]*?<\/div>/g, `<div class="mobile-lang"$1>${menu}</div>`);
  }
  if (needsDestinationMenu) {
    html = html.replace(/(<a class="nav-cta")/, `${menu}$1`);
    if (!html.includes('class="mobile-lang"')) {
      html = html.replace(/<\/nav>/, `</nav><div class="mobile-lang" aria-label="Mobile language switcher">${menu}</div>`);
    }
  }

  if (!html.includes('hreflang="ru"')) {
    const alternate = russianAlternate(type);
    if (/<link rel="alternate" hreflang="x-default"/i.test(html)) {
      html = html.replace(/(<link rel="alternate" hreflang="x-default")/i, `${alternate}\n  $1`);
    } else if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `  ${alternate}\n</head>`);
    }
  }

  if (!html.includes('/assets/language-menu.js')) {
    html = html.replace(/<\/body>/i, '<script src="/assets/language-menu.js" defer></script>\n</body>');
  }

  if (html !== before) {
    await fs.writeFile(absolute, html);
    changed += 1;
  } else {
    skipped += 1;
  }
}

console.log(`Compact language menu updated ${changed} pages; skipped ${skipped}.`);
