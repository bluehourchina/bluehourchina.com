import fs from "node:fs/promises";

const cards = [
  {
    image: "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg",
    title: "Qinghai Lake at Sunset",
    place: "青海湖",
    author: "Daniel Eriksson",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Qinghai_Lake_sunset_2018-07-30.jpg",
  },
  {
    image: "/assets/real-qinggan/chaka-salt-lake-cc-by.jpg",
    title: "Chaka Salt Lake",
    place: "青海茶卡鹽湖",
    author: "AkakiBalanchivadze",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Chaka_Salt_Lake_1.jpg",
  },
  {
    image: "/assets/wechat-qinggan/wechat-qinggan-dachaidan-emerald-lake-01.jpg",
    title: "Dachaidan Emerald Lake",
    place: "青海大柴旦翡翠湖",
    author: "若青內部素材庫",
    license: "使用權由專案方提供",
  },
  {
    image: "/assets/real-qinggan/jiayuguan-gatetower-cc-by-sa.jpg",
    title: "Jiayuguan Gate Tower",
    place: "甘肅嘉峪關",
    author: "N509FZ",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Jiayuguan_Gatetower_(20230919150124).jpg",
  },
  {
    image: "/assets/real-qinggan/zhangye-danxia-cc-by-sa.jpg",
    title: "Zhangye Danxia",
    place: "甘肅張掖丹霞",
    author: "Nyx Ning",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Zhangye%20Danxia%20Nyx%20Ning",
  },
  {
    image: "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg",
    title: "Sayram Lake Shoreline",
    place: "新疆賽里木湖",
    author: "Nyx Ning",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:%E6%96%B0%E7%96%86-%E8%B5%9B%E9%87%8C%E6%9C%A8%E6%B9%96-%E6%B9%96%E7%95%94_-_panoramio.jpg",
  },
  {
    image: "/assets/real-xinjiang/nalati-town-cc-by-sa.jpg",
    title: "Nalati Town",
    place: "新疆那拉提鎮",
    author: "Voidvector",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:%E9%82%A3%E6%8B%89%E6%8F%90%E9%95%87_(IMG_20170512_164224).jpg",
  },
  {
    image: "/assets/real-inner-mongolia/inner-mongolia-museum-cc-by-sa.jpg",
    title: "Inner Mongolia Museum",
    place: "內蒙古呼和浩特",
    author: "Cjsy2026",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:%E5%86%85%E8%92%99%E5%8F%A4%E5%8D%9A%E7%89%A9%E9%99%A2.jpg",
  },
  {
    image: "/assets/real-inner-mongolia/ordos-museum-cc-by-sa.jpg",
    title: "Ordos Museum",
    place: "內蒙古鄂爾多斯",
    author: "Popolon",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Ordos_Museum.jpg",
  },
  {
    image: "/assets/real-inner-mongolia/ordos-kangbashi-bridge-cc-by-sa.jpg",
    title: "Kangbashi Bridge",
    place: "內蒙古鄂爾多斯康巴什",
    author: "Popolon",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Ordos.Kang_Bashi_daqiao.2.jpg",
  },
  {
    image: "/assets/real-hainan/haikou-old-town-cc-by-sa.jpg",
    title: "Haikou Old Town",
    place: "海南海口騎樓老街",
    author: "Yolanda Yao",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Altstadt_von_Haikou_(Hainan).jpg",
  },
  {
    image: "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg",
    title: "Shimei Bay",
    place: "海南萬寧石梅灣",
    author: "Zhangmoon618",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Shimei_Bay_in_Wanning.jpg",
  },
  {
    image: "/assets/real-sanya/sanya-edition-01-cc-by.jpg",
    title: "Sanya Resort Morning",
    place: "海南三亞",
    author: "Jorge Cortell",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Dsc_(224924641).jpeg",
  },
  {
    image: "/assets/real-sanya/sanya-edition-02-cc-by.jpg",
    title: "Sanya Resort Coast",
    place: "海南三亞",
    author: "Jorge Cortell",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Dsc_(224924669).jpeg",
  },
  {
    image: "/assets/real-northeast/harbin-central-street-cc-by-sa.jpg",
    title: "Harbin Central Street",
    place: "東北·哈爾濱",
    author: "N509FZ",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Central_Street_at_West_9th_St_(20230721112914).jpg",
  },
  {
    image: "/assets/real-northeast/sun-mountain-yabuli-cc-by.jpg",
    title: "Sun Mountain Yabuli",
    place: "東北·亞布力",
    author: "Ski China",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Sun_Mountain_Yabuli.jpg",
  },
];

function creditCard(item) {
  const license = item.licenseUrl
    ? `<a href="${item.licenseUrl}" rel="license">${item.license}</a>`
    : item.license;
  const source = item.source
    ? `\n              <p><a href="${item.source}">查看原始來源</a></p>`
    : "";
  return `          <article class="credit-card">
            <img loading="lazy" src="${item.image}" alt="${item.place}實景">
            <div class="credit-copy">
              <h3>${item.title}</h3>
              <p>地點：${item.place}</p>
              <p>作者／來源：${item.author}</p>
              <p>授權：${license}</p>${source}
            </div>
          </article>`;
}

const supplemental = `<!-- expanded-real-photo-credits-start -->
        <div class="section-head">
          <div>
            <p class="eyebrow">Expanded Route Photography</p>
            <h2>新增路線實景授權</h2>
          </div>
          <p>青甘大環線、新疆、內蒙古、海南與三亞、東北的新增實景均對應每日路線；社群平台內來源不明、帶浮水印或未獲授權的圖片不公開使用。</p>
        </div>

        <div class="credit-grid">
${cards.map(creditCard).join("\n")}
        </div>
        <!-- expanded-real-photo-credits-end -->`;

const rootFile = new URL("../credits.html", import.meta.url);
let html = await fs.readFile(rootFile, "utf8");

html = html
  .replace(
    /<meta name="description" content="[^"]+">/,
    '<meta name="description" content="Image credits for Bluehour China Journeys, including AI brand visuals and licensed photography across six private China routes.">'
  )
  .replace(
    "雲南、新疆與內蒙古實景。",
    "雲南、新疆、青甘、內蒙古、海南與三亞、東北實景。"
  )
  .replace("Real Dunhuang Photos", "Real Qinghai-Gansu Photos")
  .replace("敦煌路線實景", "青甘大環線實景")
  .replace("莫高窟、玉門關與鳴沙山月牙泉分別對應六天路線的三個核心段落。", "莫高窟與甘肅西線實景用於青甘大環線的敦煌段；新增的青海湖、茶卡、大柴旦、嘉峪關與張掖照片列於下方授權區。")
  .replace("Real Sanya Photos", "Real Hainan and Sanya Photos")
  .replace("三亞路線實景", "海南東海岸與三亞路線實景")
  .replace("海棠灣、檳榔谷與亞龍灣對應五天四夜方案，不以泛用海島照片代替實際地點。", "海口、萬寧、海棠灣、檳榔谷與亞龍灣對應七天六夜方案，不以泛用海島照片代替實際地點。")
  .replace("Real Northeast China Photos", "Real Northeast Photos")
  .replace("中國東北冬季路線實景", "東北冬季路線實景");

if (!html.includes(".credit-grid + .section-head")) {
  html = html.replace(
    "    .credit-card {\n",
    "    .credit-grid + .section-head { margin-top: clamp(54px, 8vw, 92px); }\n    .credit-card {\n"
  );
}

if (/<!-- expanded-real-photo-credits-start -->[\s\S]*?<!-- expanded-real-photo-credits-end -->/.test(html)) {
  html = html.replace(
    /<!-- expanded-real-photo-credits-start -->[\s\S]*?<!-- expanded-real-photo-credits-end -->/,
    supplemental
  );
} else {
  const note = '        <p class="note">若日後加入若青自行拍攝、旅客授權照片，或購買 Getty、Adobe Stock、iStock 等商用圖庫照片，會另行標示拍攝／授權狀態。本站不會把概念氛圍圖標示成目的地實拍，也不直接轉載社群作者未授權的照片。</p>';
  if (!html.includes(note)) throw new Error("Could not find final credit note");
  html = html.replace(note, `${supplemental}\n\n${note}`);
}

await fs.writeFile(rootFile, html);

const nested = html
  .replace(/src="assets\//g, 'src="/assets/')
  .replace(/url\("assets\//g, 'url("/assets/')
  .replace(/href="index\.html"/g, 'href="/zh.html"')
  .replace(/href="stories\.html"/g, 'href="/stories.html"')
  .replace(/href="interest\.html"/g, 'href="/interest.html"')
  .replace(/href="credits\.html"/g, 'href="/credits.html"');

await fs.writeFile(new URL("../credits/index.html", import.meta.url), nested);

console.log(`Updated both credit pages with ${cards.length} additional route-photo records.`);
