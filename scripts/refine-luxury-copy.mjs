import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const htmlFiles = [
  "index.html",
  "en.html",
  "en/index.html",
  "stories.html",
  "en/stories/index.html",
  "zh.html",
  "zh/index.html",
  "zh/stories/index.html",
  "ja.html",
  "ja/index.html",
  "ko.html",
  "ko/index.html",
  "th.html",
  "th/index.html",
  "yunnan.html",
  "en/yunnan/index.html",
  "zh/yunnan/index.html",
];

const replacements = [
  ["The next China is quieter.", "The next China arrives in a hush"],
  ["Five landscapes, five moods.", "Five landscapes, five moods"],
  ["Wind, old towns, snow mountains.", "Where wind keeps the old road"],
  ["Roads that make the sky feel larger.", "A road that widens the sky"],
  ["Sand, stone, silence.", "Sand, shrine, held silence"],
  ["China, softened by the sea.", "China softened by the sea"],
  ["Snow, trains, warm windows.", "Snowbound rails, windows alight"],
  [
    "For travellers who have already met the great cities. We open the lakes, deserts, snowfields, islands and old towns slowly, with language support, beautiful pacing and rooms that let the day exhale.",
    "For travellers who have already met the great cities. Lakes, deserts, snowfields, islands and old towns unfold with language support, graceful pacing and stays that let the day exhale."
  ],
  [
    "Dali, Shaxi and Lijiang in a slower week, where the Tea Horse Road still feels close to the stone.",
    "Dali, Shaxi and Lijiang in a slower week, where courtyards, market smoke and mountain light keep the old road near."
  ],
  [
    "Blue lakes, grasslands, bazaars and long horizons, paced with patience and good timing.",
    "Blue lakes, grasslands and bazaars beneath a sky that asks for patience, timing and quiet respect."
  ],
  [
    "Mogao shadows, desert dusk and an oasis night that makes the journey quieter.",
    "Mogao shadows, desert dusk and an oasis night that lowers the voice."
  ],
  [
    "Warm water, resort ease, slow mornings and a gentler island rhythm.",
    "Warm water, slow mornings and an island rhythm polished by the sea."
  ],
  [
    "A winter China of white forests, railways, borderland stories and rooms full of light.",
    "White forests, slow railways and borderland rooms where winter glows from within."
  ],
  [
    "Yunnan is not only scenery. It is the old Tea Horse Road, Bai courtyards, Naxi music, market smoke and the long habit of living with mountains rather than conquering them.",
    "Yunnan is more than scenery: old roads, Bai courtyards, Naxi music, market smoke and the quiet art of living beside mountains."
  ],
  [
    "Xinjiang carries oasis routes, Silk Road memory, many languages and the scale of inland Asia. It asks for cultural sensitivity, careful timing and a slower kind of curiosity.",
    "Xinjiang holds oasis routes, Silk Road memory, many languages and the scale of inland Asia. It asks for careful timing and a more respectful curiosity."
  ],
  [
    "Dunhuang is where Buddhist art, caravan routes and frontier imagination meet. The journey should protect that gravity instead of turning it into a photo stop.",
    "Dunhuang gathers Buddhist art, caravan roads and frontier imagination. The journey should protect its gravity, not flatten it into a photo stop."
  ],
  [
    "<span class=\"title-line\">五種風景，</span><span class=\"title-line\">五種心境。</span>",
    "<span class=\"title-line\">五種風景</span><span class=\"title-line\">五種心境</span>"
  ],
  [
    "<span class=\"title-line\">風、古鎮</span><span class=\"title-line\">與雪山。</span>",
    "<span class=\"title-line\">風起舊院</span><span class=\"title-line\">雪在遠山</span>"
  ],
  [
    "<span class=\"title-line\">讓天空</span><span class=\"title-line\">變大的路。</span>",
    "<span class=\"title-line\">天光放大</span><span class=\"title-line\">路也放慢</span>"
  ],
  [
    "<span class=\"title-line\">沙、石窟</span><span class=\"title-line\">與沉默。</span>",
    "<span class=\"title-line\">沙色沉下去</span><span class=\"title-line\">石窟仍亮</span>"
  ],
  [
    "<span class=\"title-line\">被海風柔化的</span><span class=\"title-line\">中國。</span>",
    "<span class=\"title-line\">海風把中國</span><span class=\"title-line\">放得更輕</span>"
  ],
  [
    "<span class=\"title-line\">雪、列車</span><span class=\"title-line\">與溫暖窗光。</span>",
    "<span class=\"title-line\">雪夜列車</span><span class=\"title-line\">窗裡有光</span>"
  ],
  ["下一次中國，應該更安靜。", "下一次中國，安靜一點就好"],
  [
    "給已經看過大城市的外國旅人。湖光、沙色、雪線、海風與古鎮的夜，用語言支援、舒適節奏與在地照應慢慢安排。",
    "給已經看過大城市的外國旅人。湖光、沙色、雪線、海風與古鎮的夜，都應該被慢慢安放。"
  ],
  [
    "不從擁擠清單開始。先選你想靠近的空氣，再讓路線慢慢長出形狀。",
    "不從擁擠清單開始。先選你想靠近的空氣，再讓路線自己長出形狀。"
  ],
  [
    "大理、沙溪、麗江，一週慢慢感受；茶馬古道的影子還在石板路邊。",
    "大理、沙溪、麗江，把一週放慢；風在院牆外，雪在遠山上。"
  ],
  [
    "湖泊、草原、巴扎與長長的地平線，需要耐心，也需要好的節奏。",
    "湖泊、草原、巴扎與遠到發藍的天，適合把腳步放得很輕。"
  ],
  [
    "莫高窟的暗影、沙丘的傍晚，和綠洲夜色裡少一點話的旅程。",
    "莫高窟的暗影、沙丘的暮色，會讓人自然把聲音放低。"
  ],
  [
    "暖水、度假感、慢慢開始的早晨，和更溫柔的島嶼節奏。",
    "暖水、長晨、細白的光，讓旅程像被海風鬆開。"
  ],
  [
    "白色森林、鐵路、邊地故事與有光的房間，構成冬天的中國。",
    "白色森林、緩慢列車、邊地故事，冬天在窗裡亮起來。"
  ],
  [
    "雲南不只是風景。它有茶馬古道、白族院落、納西古樂、市集煙火，也有一種與山共處而非征服山的生活習慣。",
    "雲南不只是一張風景照。它有茶馬古道、白族院落、納西古樂，也有市集煙火慢慢散開的日子。"
  ],
  [
    "新疆有綠洲道路、絲路記憶、多種語言與內陸亞洲的尺度。它需要文化敏感、節奏謹慎，也需要更慢的好奇心。",
    "新疆有綠洲道路、絲路記憶與內陸亞洲的尺度。它需要敬意，也需要把時間放寬。"
  ],
  [
    "敦煌是佛教藝術、商旅道路與邊塞想像交會的地方。旅程應該保護它的重量，而不是把它變成一個拍照點。",
    "敦煌把佛教藝術、商旅道路與邊塞想像收在一起。好的旅程，應該保護它的重量。"
  ],
  ["五つの風景、五つの余韻。", "五つの風景、五つの余韻"],
  ["風、古い町、雪をいただく山。", "風の中庭、遠い雪"],
  ["空が大きくなる道。", "空がひらく道"],
  ["砂、石窟、静けさ。", "砂と石窟、静けさの奥"],
  ["海にほどける中国。", "海にほどける中国"],
  ["雪、列車、あたたかな窓。", "雪の夜、汽車と灯り"],
  [
    "都市をすでに見た旅人へ。湖、砂漠、雪景色、島、古い町を、言語サポートと快適なペースで無理なく整えます。",
    "都市をすでに見た旅人へ。湖、砂漠、雪景色、島、古い町を、静かな余白と無理のない速度で整えます。"
  ],
  ["다섯 풍경, 다섯 마음.", "다섯 풍경, 다섯 마음"],
  ["바람, 옛 마을, 설산.", "바람 든 마당, 먼 설산"],
  ["하늘이 커지는 길.", "하늘이 넓어지는 길"],
  ["모래, 석굴, 침묵.", "모래와 석굴, 깊은 고요"],
  ["바다에 부드러워지는 중국.", "바다에 부드러워지는 중국"],
  ["눈, 기차, 따뜻한 창.", "눈 내리는 밤, 기차와 불빛"],
];

const cssReplacements = [
  [
    'h1,h2,h3{font-family:Georgia,"Times New Roman","Noto Serif TC",serif;font-weight:500;letter-spacing:0}',
    'h1,h2,h3{font-family:Georgia,"Times New Roman","Songti TC","STSong","Noto Serif TC","Source Han Serif TC",serif;font-weight:500;letter-spacing:0}'
  ],
  [
    ".destinations{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));grid-auto-rows:minmax(380px,auto);gap:12px}",
    ".destinations{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));grid-auto-rows:minmax(400px,auto);gap:18px}"
  ],
  [
    ".place{position:relative;overflow:hidden;display:flex;align-items:flex-end;color:var(--ivory);background:var(--deep);min-height:440px}",
    ".place{position:relative;overflow:hidden;display:flex;align-items:flex-end;color:var(--ivory);background:var(--deep);min-height:470px}"
  ],
  [
    ".place::after{content:\"\";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,17,15,.02),rgba(7,17,15,.82))}",
    ".place::after{content:\"\";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,17,15,.03),rgba(7,17,15,.28) 46%,rgba(7,17,15,.86))}"
  ],
  [
    ".place-copy{position:relative;z-index:1;padding:26px}",
    ".place-copy{position:relative;z-index:1;width:min(100%,720px);padding:clamp(30px,4vw,48px)}"
  ],
  [
    ".place-copy > span,.copy-block b,.promise b,.care b,.story-copy b{display:block;color:var(--gold);font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:850}",
    ".place-copy > span,.copy-block b,.promise b,.care b,.story-copy b{display:block;color:var(--gold);font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:850}"
  ],
  [
    ".place-copy h3{margin-top:12px;font-size:clamp(28px,3vw,46px);line-height:1.06}",
    ".place-copy h3{margin-top:14px;max-width:660px;font-size:clamp(34px,3.6vw,58px);line-height:1.02;text-shadow:0 10px 34px rgba(0,0,0,.34)}.place:first-child .place-copy h3{font-size:clamp(40px,4.6vw,68px)}"
  ],
  [
    ".place-copy h3{margin-top:14px;max-width:660px;font-size:clamp(34px,3.6vw,58px);line-height:1.02;text-shadow:0 10px 34px rgba(0,0,0,.34)}.place:first-child .place-copy h3{font-size:clamp(46px,5.6vw,86px)}",
    ".place-copy h3{margin-top:14px;max-width:660px;font-size:clamp(34px,3.6vw,58px);line-height:1.02;text-shadow:0 10px 34px rgba(0,0,0,.34)}.place:first-child .place-copy h3{font-size:clamp(40px,4.6vw,68px)}"
  ],
  [
    ".place-copy p{margin-top:14px;color:rgba(255,250,241,.78);line-height:1.65}",
    ".place-copy p{max-width:560px;margin-top:16px;color:rgba(255,250,241,.8);font-size:clamp(15px,1.15vw,17px);font-weight:650;line-height:1.74}"
  ],
  [
    ".place-copy a{display:inline-block;margin-top:20px;border-bottom:1px solid rgba(255,250,241,.48);padding-bottom:4px;font-weight:850}",
    ".place-copy a{display:inline-block;margin-top:24px;border-bottom:1px solid rgba(255,250,241,.48);padding-bottom:5px;font-size:13px;font-weight:850;letter-spacing:.06em}"
  ],
  [
    "@media(max-width:760px){.nav{position:absolute;",
    "@media(max-width:760px){.destinations{gap:16px}.place:first-child .place-copy h3,.place-copy h3{font-size:clamp(34px,10vw,48px)}.nav{position:absolute;"
  ],
  [
    ".sticky-review{position:fixed;left:50%;bottom:18px;z-index:40;transform:translateX(-50%);display:none;align-items:center;justify-content:center;min-height:48px;width:min(360px,calc(100% - 36px));padding:0 18px;background:var(--gold);color:#10231d;font-weight:850;box-shadow:0 16px 36px rgba(0,0,0,.28)}",
    ".sticky-review{position:fixed;left:50%;bottom:18px;z-index:40;transform:translateX(-50%);display:none;align-items:center;justify-content:center;min-height:46px;width:min(320px,calc(100% - 44px));padding:0 18px;border:1px solid rgba(255,250,241,.24);background:rgba(7,17,15,.78);backdrop-filter:blur(14px);color:var(--ivory);font-size:13px;font-weight:850;letter-spacing:.04em;box-shadow:0 16px 40px rgba(0,0,0,.22)}"
  ],
];

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

async function updateFile(file, pairs) {
  const fullPath = path.join(root, file);
  let text = await fs.readFile(fullPath, "utf8");
  const original = text;
  for (const [from, to] of pairs) {
    text = replaceAll(text, from, to);
  }
  text = text.replace(/。(<\/h[1-3]>)/g, "$1");
  if (text !== original) {
    await fs.writeFile(fullPath, text);
    return true;
  }
  return false;
}

async function main() {
  const changed = [];
  for (const file of htmlFiles) {
    if (await updateFile(file, replacements)) changed.push(file);
  }
  if (await updateFile("assets/luxury-multilang.css", cssReplacements)) changed.push("assets/luxury-multilang.css");
  console.log(`Refined luxury copy and destination cards in ${changed.length} file(s).`);
  changed.forEach((file) => console.log(file));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
