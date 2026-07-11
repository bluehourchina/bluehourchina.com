import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const groups = [
  {
    files: ["index.html", "en.html", "en/index.html"],
    replacements: [
      ["A private journey begins with three clear steps", "Three steps from an idea to a route"],
      ["Use the public itinerary to understand the pace, price level and places.", "See how the days flow and which places deserve more time."],
      ["Tell us the month, travellers, days, budget and what comfort means to you.", "Tell us the month, travellers, days and what comfort means to you."],
      ["Receive a route and starting quote", "Receive a route shaped around you"],
      ["A human planner replies within one business day with the fit, changes and next questions.", "A human planner replies within one business day with what fits, what to adjust and the clearest next step."],
    ],
  },
  {
    files: ["zh.html", "zh/index.html"],
    replacements: [
      ["把需求變成報價路線", "把想法整理成路線"],
      ["看懂每天怎麼走、價格在哪一層、哪些地方最值得留下。", "先看每天怎麼走，哪些地方值得多留一點時間。"],
      ["告訴我們月份、人數、天數、預算與舒適需求。", "告訴我們月份、人數、天數與在意的舒適細節。"],
      ["收到路線方向與起價", "收到適合你的路線"],
      ["人工旅策會在 1 個工作日內回覆適配度、調整建議與下一步。", "人工旅策會在 1 個工作日內回覆適合的走法、調整建議與下一步。"],
    ],
  },
  {
    files: ["ja.html", "ja/index.html"],
    replacements: [
      ["旅を具体的にします", "思いを旅のルートへ"],
      ["毎日の流れ、料金の目安、訪れる場所を確認します。", "毎日の流れと、ゆっくり過ごしたい場所を確認します。"],
      ["旅行月、人数、日数、予算、快適さを教えてください。", "旅行月、人数、日数と、大切にしたい快適さを教えてください。"],
      ["ルートと見積り目安を受け取る", "あなたに合うルートを受け取る"],
      ["担当者が1営業日以内に適合性と調整点をご連絡します。", "担当者が1営業日以内に、合う進み方と調整点をご連絡します。"],
    ],
  },
  {
    files: ["ko.html", "ko/index.html"],
    replacements: [
      ["여행을 구체화합니다", "생각을 여행 경로로 정리합니다"],
      ["매일의 흐름, 가격대와 방문 지역을 확인합니다.", "매일의 흐름과 더 오래 머물고 싶은 장소를 확인합니다."],
      ["여행 월, 인원, 일수, 예산, 편안함을 알려 주세요.", "여행 월, 인원, 일수와 중요하게 생각하는 편안함을 알려 주세요."],
      ["루트와 시작 견적 수신", "나에게 맞는 경로 받기"],
      ["담당자가 1영업일 이내에 적합성과 조정점을 답변합니다.", "담당자가 1영업일 이내에 어울리는 진행 방식과 조정점을 답변합니다."],
    ],
  },
  {
    files: ["th.html", "th/index.html"],
    replacements: [
      ["สามขั้นตอนสู่ทริปส่วนตัว", "สามขั้นตอน จากความคิดสู่เส้นทางที่เหมาะกับคุณ"],
      ["ดูจังหวะ ราคา และพื้นที่ที่อยากไป", "ดูจังหวะของแต่ละวันและสถานที่ที่อยากใช้เวลาให้นานขึ้น"],
      ["บอกเดือน จำนวนวัน งบ และความสบายที่ต้องการ", "บอกเดือน จำนวนวัน ผู้ร่วมทาง และความสบายที่สำคัญกับคุณ"],
      ["รับเส้นทางและราคาเริ่มต้น", "รับเส้นทางที่เหมาะกับคุณ"],
      ["ผู้วางแผนตอบภายใน 1 วันทำการพร้อมข้อเสนอปรับเส้นทาง", "ผู้วางแผนตอบภายใน 1 วันทำการ พร้อมแนวทางและจุดที่ควรปรับให้เข้ากับคุณ"],
    ],
  },
  {
    files: ["ru.html", "ru/index.html"],
    replacements: [
      ["Три шага до точного расчёта", "Три шага от идеи к маршруту"],
      ["Сначала посмотрите реальные дни, цену и переезды.", "Посмотрите, как проходит каждый день и где хочется задержаться дольше."],
      ["Нам нужны месяц, количество дней, бюджет и требования к комфорту.", "Расскажите о месяце, длительности, составе группы и важном для вас комфорте."],
      ["Получите направление и цену", "Получите маршрут, подходящий вам"],
      ["В течение одного рабочего дня ответит человек, а не автоматическая рассылка.", "В течение одного рабочего дня специалист предложит подходящий ритм и нужные изменения."],
      ["Оставить запрос", "Начать планирование"],
    ],
  },
];

let updated = 0;
for (const group of groups) {
  for (const file of group.files) {
    const absolute = path.join(root, file);
    let html = await fs.readFile(absolute, "utf8");
    const before = html;
    for (const [from, to] of group.replacements) html = html.replaceAll(from, to);
    if (html !== before) {
      await fs.writeFile(absolute, html);
      updated += 1;
    }
  }
}

const yunnan = path.join(root, "zh/yunnan/index.html");
let yunnanHtml = await fs.readFile(yunnan, "utf8");
const yunnanBefore = yunnanHtml;
yunnanHtml = yunnanHtml.replaceAll("索取路線報價", "開始規劃路線");
if (yunnanHtml !== yunnanBefore) {
  await fs.writeFile(yunnan, yunnanHtml);
  updated += 1;
}

console.log(`Refined traveller-first process copy in ${updated} files.`);
