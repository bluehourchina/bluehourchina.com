import fs from "node:fs/promises";

const targets = {
  en: ["index.html", "en.html", "en/index.html"],
  zh: ["zh.html", "zh/index.html"],
  ja: ["ja.html", "ja/index.html"],
  ko: ["ko.html", "ko/index.html"],
  th: ["th.html", "th/index.html"],
  ru: ["ru.html", "ru/index.html"],
};

const replacements = {
  en: [
    ["Private China travel beyond Beijing and Shanghai: Yunnan, Xinjiang, the Qinghai-Gansu Grand Loop, Inner Mongolia, Hainan and Northeast China, with sample itineraries and clear starting prices.", "Private China travel beyond Beijing and Shanghai, with sample routes and starting prices for Yunnan, Xinjiang, Qinghai-Gansu, Inner Mongolia, Hainan and Northeast China."],
    ["Yunnan, Xinjiang, Dunhuang, Inner Mongolia, Sanya and Northeast China", "Yunnan, Xinjiang, the Qinghai-Gansu Grand Loop, Inner Mongolia, Hainan and Northeast China"],
    ["Yunnan, Xinjiang, the Qinghai-Gansu Grand Loop, Inner Mongolia, Sanya and Northeast China", "Yunnan, Xinjiang, the Qinghai-Gansu Grand Loop, Inner Mongolia, Hainan and Northeast China"],
    ['<option value="dunhuang">Dunhuang</option>', '<option value="dunhuang">Qinghai-Gansu Grand Loop</option>'],
    ['<option value="sanya">Sanya</option>', '<option value="sanya">Hainan &amp; Sanya</option>'],
  ],
  zh: [
    ["雲南、新疆、敦煌、內蒙古、三亞與中國東北", "雲南、新疆、青甘大環線、內蒙古、海南與東北"],
    ["雲南、新疆、青甘大環線、內蒙古、三亞與東北", "雲南、新疆、青甘大環線、內蒙古、海南與東北"],
    ["中國東北", "東北"],
    ['<option value="dunhuang">敦煌</option>', '<option value="dunhuang">青甘大環線</option>'],
    ['<option value="sanya">三亞</option>', '<option value="sanya">海南與三亞</option>'],
  ],
  ja: [
    ["雲南、新疆、敦煌、内モンゴル、三亜、中国東北", "雲南、新疆、青海・甘粛大環状線、内モンゴル、海南島、東北"],
    ["雲南、新疆、青海・甘粛大環状線、内モンゴル、三亜、東北", "雲南、新疆、青海・甘粛大環状線、内モンゴル、海南島、東北"],
    ['<option value="dunhuang">敦煌</option>', '<option value="dunhuang">青海・甘粛大環状線</option>'],
    ['<option value="sanya">三亜</option>', '<option value="sanya">海南島・三亜</option>'],
    ['<option value="northeast">中国東北</option>', '<option value="northeast">東北</option>'],
  ],
  ko: [
    ["윈난, 신장, 둔황, 내몽골, 싼야, 중국 동북", "윈난, 신장, 칭하이-간쑤 대순환, 내몽골, 하이난, 동북"],
    ["윈난, 신장, 칭하이-간쑤 대순환, 내몽골, 싼야, 동북", "윈난, 신장, 칭하이-간쑤 대순환, 내몽골, 하이난, 동북"],
    ['<option value="dunhuang">둔황</option>', '<option value="dunhuang">칭하이-간쑤 대순환</option>'],
    ['<option value="sanya">싼야</option>', '<option value="sanya">하이난·싼야</option>'],
    ['<option value="northeast">중국 동북</option>', '<option value="northeast">동북</option>'],
  ],
  th: [
    ["ยูนนาน ซินเจียง ตุนหวง มองโกเลียใน ซานย่า และภาคตะวันออกเฉียงเหนือ", "ยูนนาน ซินเจียง วงแหวนชิงไห่–กานซู่ มองโกเลียใน ไหหลำ และภาคตะวันออกเฉียงเหนือ"],
    ["ยูนนาน ซินเจียง วงแหวนชิงไห่–กานซู่ มองโกเลียใน ซานย่า และภาคตะวันออกเฉียงเหนือ", "ยูนนาน ซินเจียง วงแหวนชิงไห่–กานซู่ มองโกเลียใน ไหหลำ และภาคตะวันออกเฉียงเหนือ"],
    ['<option value="dunhuang">ตุนหวง</option>', '<option value="dunhuang">วงแหวนชิงไห่–กานซู่</option>'],
    ['<option value="sanya">ซานย่า</option>', '<option value="sanya">ไหหลำ–ซานย่า</option>'],
  ],
  ru: [
    ["Юньнань, Синьцзян, Дуньхуан, Внутренняя Монголия, Санья и Северо-Восточный Китай", "Юньнань, Синьцзян, Цинхай и Ганьсу, Внутренняя Монголия, Хайнань и Северо-Восток"],
    ['<option value="dunhuang">Дуньхуан</option>', '<option value="dunhuang">Цинхай — Ганьсу</option>'],
    ['<option value="sanya">Санья</option>', '<option value="sanya">Хайнань и Санья</option>'],
    ['<option value="northeast">Северо-Восточный Китай</option>', '<option value="northeast">Северо-Восток</option>'],
  ],
};

for (const [locale, files] of Object.entries(targets)) {
  for (const file of files) {
    let html = await fs.readFile(file, "utf8");
    for (const [from, to] of replacements[locale]) html = html.replaceAll(from, to);
    await fs.writeFile(file, html);
  }
}

const innerMongoliaZh = "zh/inner-mongolia/index.html";
let innerMongoliaHtml = await fs.readFile(innerMongoliaZh, "utf8");
innerMongoliaHtml = innerMongoliaHtml.replace(
  "<strong>Bluehour China</strong><span>若青中國旅策</span>",
  "<strong>若青中國</strong><span>BLUEHOUR CHINA</span>"
);
await fs.writeFile(innerMongoliaZh, innerMongoliaHtml);

console.log("Normalized destination naming across all localized homes and inquiry selectors.");
