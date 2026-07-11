import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excluded = new Set([".git", "node_modules", "output", "outputs", "public"]);
const ignoredInputTypes = new Set(["hidden", "submit", "button", "reset", "image"]);

const labels = {
  en: {
    message: "Travel preferences and details",
    itinerary_text: "Current itinerary or route draft",
    feedback_consent: "I am willing to share honest feedback after the journey",
    photo_consent: "I am willing to discuss separate permission for journey photos or videos",
    pilot_understanding: "I understand that the early-access journey is confirmed only after checking whether it suits my needs",
  },
  zh: {
    message: "旅程偏好與需要留意的細節",
    itinerary_text: "正在比較的行程或路線草稿",
    feedback_consent: "我願意在旅後提供真實心得回饋",
    photo_consent: "我願意另行討論旅程照片或影片的使用授權",
    pilot_understanding: "我理解早鳥旅程需先確認是否適合本次需求",
  },
  ja: {
    message: "旅の希望と確認しておきたいこと",
    itinerary_text: "検討中の日程またはルート案",
    feedback_consent: "旅行後に率直な感想を共有することに同意します",
    photo_consent: "旅行写真や動画の利用許可について別途相談することに同意します",
    pilot_understanding: "先行プランは希望に合うか確認した後に確定することを理解しています",
  },
  ko: {
    message: "여행 선호와 미리 확인할 사항",
    itinerary_text: "검토 중인 일정 또는 루트 초안",
    feedback_consent: "여행 후 솔직한 후기를 공유하는 데 동의합니다",
    photo_consent: "여행 사진이나 영상 사용 허가는 별도로 협의하는 데 동의합니다",
    pilot_understanding: "얼리 액세스 여행은 제 요구에 맞는지 확인한 뒤 확정된다는 점을 이해합니다",
  },
  th: {
    message: "ความต้องการและรายละเอียดสำคัญของการเดินทาง",
    itinerary_text: "แผนการเดินทางหรือร่างเส้นทางที่กำลังพิจารณา",
    feedback_consent: "ฉันยินดีแบ่งปันความคิดเห็นตามจริงหลังการเดินทาง",
    photo_consent: "ฉันยินดีหารือเรื่องสิทธิ์การใช้ภาพหรือวิดีโอการเดินทางแยกต่างหาก",
    pilot_understanding: "ฉันเข้าใจว่าแผนทดลองจะยืนยันหลังจากตรวจสอบว่าเหมาะกับความต้องการของฉัน",
  },
  ru: {
    message: "Пожелания и важные детали поездки",
    itinerary_text: "Текущий план или черновик маршрута",
    feedback_consent: "Я готов(а) поделиться честным отзывом после поездки",
    photo_consent: "Я готов(а) отдельно обсудить разрешение на использование фото или видео поездки",
    pilot_understanding: "Я понимаю, что ранний формат поездки подтверждается после проверки соответствия моим пожеланиям",
  },
};

function localeFor(html) {
  const language = html.match(/<html\b[^>]*\blang=(?:"([^"]+)"|'([^']+)')/i)?.slice(1).find(Boolean)?.toLowerCase() || "en";
  if (language.startsWith("zh")) return "zh";
  if (language.startsWith("ja")) return "ja";
  if (language.startsWith("ko")) return "ko";
  if (language.startsWith("th")) return "th";
  if (language.startsWith("ru")) return "ru";
  return "en";
}

function attribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(new RegExp(`\\s${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match?.slice(1).find((value) => value !== undefined) || "";
}

function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function fallbackLabel(tag, name, locale) {
  const mapped = labels[locale][name];
  if (mapped) return mapped;
  const placeholder = attribute(tag, "placeholder").trim();
  if (placeholder) return placeholder;
  return name.replace(/[_-]+/g, " ").trim();
}

function normalizeForm(form, locale) {
  return form.replace(/<(input|select|textarea)\b[^>]*>/gi, (tag, rawTagName) => {
    const tagName = rawTagName.toLowerCase();
    const type = attribute(tag, "type").toLowerCase() || "text";
    const name = attribute(tag, "name");
    if (!name || name === "bot-field") return tag;
    if (tagName === "input" && ignoredInputTypes.has(type)) return tag;
    if (/\saria-label\s*=|\saria-labelledby\s*=/i.test(tag)) return tag;

    const value = fallbackLabel(tag, name, locale);
    if (!value) return tag;
    return tag.replace(/\s*\/?\>$/, (ending) => ` aria-label="${escapeAttribute(value)}"${ending}`);
  });
}

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

let changedFiles = 0;
let labelledControls = 0;
for (const file of await walk(root)) {
  const original = await fs.readFile(file, "utf8");
  if (!original.includes("lead-form")) continue;
  const locale = localeFor(original);
  const updated = original.replace(/<form\b[^>]*class=(?:"[^"]*\blead-form\b[^"]*"|'[^']*\blead-form\b[^']*')[^>]*>[\s\S]*?<\/form>/gi, (form) => {
    const normalized = normalizeForm(form, locale);
    const before = [...form.matchAll(/\saria-label\s*=/gi)].length;
    const after = [...normalized.matchAll(/\saria-label\s*=/gi)].length;
    labelledControls += after - before;
    return normalized;
  });
  if (updated !== original) {
    await fs.writeFile(file, updated);
    changedFiles += 1;
  }
}

console.log(`Normalized form accessibility in ${changedFiles} files; added ${labelledControls} programmatic labels.`);
