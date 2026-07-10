import fs from "node:fs";

const yunnanPages = [
  {
    file: "yunnan.html",
    asideAlt: "Dali lakeside table",
    asideCaption: "Image notes · Dali lake table · Xizhou craft · Yulong Snow Mountain",
    asideNotes: [
      "The lake-table image explains the pace: the route protects arrival, meals and a room worth returning to.",
      "The lake and old-town days are not filler; they make Yunnan feel lived-in rather than consumed.",
      "Snow-mountain views are arranged with restraint so altitude and road time stay comfortable.",
    ],
    section: `
    <!-- yunnan-material-notes-start -->
    <section class="section material-notes-band" id="field-materials">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro">
          <p class="eyebrow">Field materials</p>
          <h2>Details that make Yunnan feel effortless</h2>
          <p>A calm Yunnan journey is built from small decisions: which lake morning to protect, which road to soften, and which mountain day needs a buffer before the traveller arrives.</p>
        </div>
        <div class="material-grid">
          <figure class="material-card large"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="Dali lakeside table"><figcaption><b>Dali</b><span>Lake-view meals and softer afternoons make the first two days feel like arrival, not recovery.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-field-train-11.jpg" alt="Dali field train"><figcaption><b>Fields</b><span>A light local ride can make a transfer day feel gentle instead of logistical.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg" alt="Yulong Snow Mountain meadow"><figcaption><b>Mountain day</b><span>Snow-line views should be planned around altitude, weather and the group’s walking comfort.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg" alt="Yunnan blue dye craft"><figcaption><b>Craft</b><span>A quiet handwork stop often converts better than another rushed viewpoint.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-spruce-boardwalk-03.jpg" alt="Yunnan spruce boardwalk"><figcaption><b>Forest</b><span>A shaded boardwalk is where the route slows down and the body catches up.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png" alt="Yunnan pagoda light"><figcaption><b>Extension</b><span>Pagoda light belongs in the longer route, where borderland culture has enough time.</span></figcaption></figure>
        </div>
      </div>
    </section>
    <!-- yunnan-material-notes-end -->
`,
  },
  {
    file: "en/yunnan/index.html",
    asideAlt: "Dali lakeside table",
    asideCaption: "Image notes · Dali lake table · Xizhou craft · Yulong Snow Mountain",
    asideNotes: null,
    section: null,
  },
  {
    file: "zh/yunnan/index.html",
    asideAlt: "大理湖邊餐桌",
    asideCaption: "圖片解說 · 大理湖邊 · 喜洲手作 · 玉龍雪山",
    asideNotes: [
      "這張湖邊餐桌說明的是節奏：先保護抵達、用餐，以及一間值得回去的房間。",
      "湖邊與古鎮日不是填空，而是讓雲南像生活，不像消費景點。",
      "雪山視野要克制安排，讓海拔、車程與同行者體力都舒服。",
    ],
    section: `
    <!-- yunnan-material-notes-start -->
    <section class="section material-notes-band" id="field-materials">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro">
          <p class="eyebrow">實地素材筆記</p>
          <h2 class="cjk-title"><span class="title-line">把風景整理成</span><span class="title-line">可以安心抵達的路線</span></h2>
          <p>高級感不是多塞景點，而是把湖邊、古鎮、雪山與手作安排到剛好的位置：哪天慢下來，哪段留白，哪個體驗先預約。</p>
        </div>
        <div class="material-grid">
          <figure class="material-card large"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="大理湖邊餐桌"><figcaption><b>大理</b><span>湖邊餐桌與下午的光，適合放在抵達後的前兩天，讓旅人先安定下來。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-field-train-11.jpg" alt="大理田野小火車"><figcaption><b>田野</b><span>輕巧的在地移動，能把轉場日變得柔和，而不是只剩交通。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg" alt="玉龍雪山草甸"><figcaption><b>雪山日</b><span>雪線、海拔與天氣要一起看，不能把雪山排成趕路清單。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg" alt="雲南藍染手作"><figcaption><b>手作</b><span>一個安靜的手作停留，常常比多塞一個景點更能打動高端客人。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-spruce-boardwalk-03.jpg" alt="雲南森林棧道"><figcaption><b>森林</b><span>一段陰涼棧道，讓路線慢下來，也讓同行者身體跟得上。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png" alt="雲南佛塔光線"><figcaption><b>延伸</b><span>邊地佛塔適合放在更長路線裡，讓文化與餐桌都有時間成立。</span></figcaption></figure>
        </div>
      </div>
    </section>
    <!-- yunnan-material-notes-end -->
`,
  },
  {
    file: "ja/yunnan/index.html",
    asideAlt: "大理の湖畔の食卓",
    asideCaption: "写真メモ · 大理湖畔 · 喜洲の手仕事 · 玉龍雪山",
    asideNotes: [
      "湖畔の食卓は、到着、食事、戻りたくなる部屋を守る旅のペースを示しています。",
      "湖と古い町の日は余白ではなく、雲南を生活として感じる時間です。",
      "雪山は控えめに組み込み、標高と移動を無理なく整えます。",
    ],
    section: `
    <!-- yunnan-material-notes-start -->
    <section class="section material-notes-band" id="field-materials">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro">
          <p class="eyebrow">現地素材メモ</p>
          <h2 class="cjk-title"><span class="title-line">風景を</span><span class="title-line">安心して歩ける旅程へ</span></h2>
          <p>上質さは、場所を増やすことではありません。湖畔、古い町、雪山、手仕事をちょうどよい位置に置くことです。</p>
        </div>
        <div class="material-grid">
          <figure class="material-card large"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="大理の湖畔の食卓"><figcaption><b>大理</b><span>湖畔の食卓は、到着後の二日間を落ち着かせるための合図です。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-field-train-11.jpg" alt="大理の田園列車"><figcaption><b>田園</b><span>軽いローカル移動が、移動日をやわらかくします。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg" alt="玉龍雪山の草原"><figcaption><b>山の日</b><span>標高、天候、歩く量を合わせて、雪山を急がせない日にします。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg" alt="雲南の藍染め"><figcaption><b>手仕事</b><span>静かなクラフト時間は、もう一つの観光地より記憶に残ります。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-spruce-boardwalk-03.jpg" alt="雲南の森の遊歩道"><figcaption><b>森</b><span>木陰の道は、旅の身体を整えるための余白です。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png" alt="雲南の塔の光"><figcaption><b>延長</b><span>塔の光は長いルートで、文化と食卓をゆっくり組み込みます。</span></figcaption></figure>
        </div>
      </div>
    </section>
    <!-- yunnan-material-notes-end -->
`,
  },
  {
    file: "ko/yunnan/index.html",
    asideAlt: "다리 호숫가 식탁",
    asideCaption: "이미지 메모 · 다리 호숫가 · 시저우 공예 · 위룽 설산",
    asideNotes: [
      "호숫가 식탁 이미지는 도착, 식사, 돌아가고 싶은 방을 지키는 속도를 보여 줍니다.",
      "호수와 옛 마을의 날은 빈 시간이 아니라 윈난을 생활처럼 느끼는 시간입니다.",
      "설산은 절제해서 넣어 고도와 이동 부담을 줄입니다.",
    ],
    section: `
    <!-- yunnan-material-notes-start -->
    <section class="section material-notes-band" id="field-materials">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro">
          <p class="eyebrow">현장 소재 메모</p>
          <h2 class="cjk-title"><span class="title-line">풍경을</span><span class="title-line">편안히 도착할 수 있는 일정으로</span></h2>
          <p>고급스러움은 장소를 더 넣는 것이 아니라, 호수와 옛 마을, 설산과 공예를 알맞은 위치에 두는 것입니다.</p>
        </div>
        <div class="material-grid">
          <figure class="material-card large"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="다리 호숫가 식탁"><figcaption><b>다리</b><span>호숫가 식사와 부드러운 오후가 첫 이틀을 안정시킵니다.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-field-train-11.jpg" alt="다리 들판 열차"><figcaption><b>들판</b><span>가벼운 현지 이동은 이동일을 더 부드럽게 만듭니다.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg" alt="위룽 설산 초원"><figcaption><b>산의 날</b><span>고도, 날씨, 걷는 양을 함께 보고 설산을 무리하게 넣지 않습니다.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg" alt="윈난 남염 공예"><figcaption><b>공예</b><span>조용한 손작업 시간은 빠른 명소 하나보다 더 오래 남습니다.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-spruce-boardwalk-03.jpg" alt="윈난 숲길"><figcaption><b>숲</b><span>그늘진 길은 일정의 속도를 낮추고 몸을 회복시킵니다.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png" alt="윈난 탑의 빛"><figcaption><b>확장</b><span>탑의 빛은 더 긴 루트에서 문화와 식탁을 천천히 담습니다.</span></figcaption></figure>
        </div>
      </div>
    </section>
    <!-- yunnan-material-notes-end -->
`,
  },
  {
    file: "th/yunnan/index.html",
    asideAlt: "โต๊ะอาหารริมทะเลสาบต้าหลี่",
    asideCaption: "บันทึกภาพ · ทะเลสาบต้าหลี่ · งานฝีมือซีโจว · ภูเขาหิมะ",
    asideNotes: [
      "The lake-table image explains the pace: arrival, meals and a room worth returning to.",
      "Lake and old-town days are not filler; they make Yunnan feel lived-in.",
      "Snow-mountain views are arranged with restraint so altitude and road time stay comfortable.",
    ],
    section: `
    <!-- yunnan-material-notes-start -->
    <section class="section material-notes-band" id="field-materials">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro">
          <p class="eyebrow">บันทึกภาพจากพื้นที่</p>
          <h2>Details that make Yunnan feel effortless</h2>
          <p>A calm route is built from small decisions: lake mornings, softer roads, mountain buffers and craft time arranged before the traveller arrives.</p>
        </div>
        <div class="material-grid">
          <figure class="material-card large"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="โต๊ะอาหารริมทะเลสาบต้าหลี่"><figcaption><b>Dali</b><span>Lake-view meals make the first two days feel soft and settled.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-field-train-11.jpg" alt="Dali field train"><figcaption><b>Fields</b><span>A light local ride makes a transfer day feel gentle.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg" alt="Yulong Snow Mountain meadow"><figcaption><b>Mountain day</b><span>Altitude, weather and walking comfort decide the snow-mountain day.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg" alt="งานย้อมครามยูนนาน"><figcaption><b>Craft</b><span>A quiet craft stop can be more memorable than one more viewpoint.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-spruce-boardwalk-03.jpg" alt="Yunnan spruce boardwalk"><figcaption><b>Forest</b><span>A shaded boardwalk slows the route down and lets the body catch up.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png" alt="Yunnan pagoda light"><figcaption><b>Extension</b><span>Pagoda light belongs in a longer route with enough cultural time.</span></figcaption></figure>
        </div>
      </div>
    </section>
    <!-- yunnan-material-notes-end -->
`,
  },
];

yunnanPages[1].section = yunnanPages[0].section;
yunnanPages[1].asideNotes = yunnanPages[0].asideNotes;

const grandLoopPages = [
  {
    file: "yunnan-grand-loop/index.html",
    section: `
    <!-- yunnan-material-notes-start -->
    <section class="section material-notes-band compact" id="field-materials">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro">
          <p class="eyebrow">Field material notes</p>
          <h2>Why the longer loop feels calmer</h2>
          <p>The route protects three kinds of value: lake-side softness, altitude-aware mountain timing, and enough days for Tengchong and Mangshi to feel like places, not add-ons.</p>
        </div>
        <div class="material-grid">
          <figure class="material-card large"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="Dali lakeside table"><figcaption><b>Dali</b><span>The route begins with a softer lake rhythm before longer moves begin.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg" alt="Yulong Snow Mountain meadow"><figcaption><b>Lijiang</b><span>Snow-mountain days need weather buffers and altitude-aware pacing.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-spruce-boardwalk-03.jpg" alt="Yunnan forest boardwalk"><figcaption><b>Tengchong</b><span>Hot springs, forest, wetland and recovery time belong in the middle, not the margin.</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png" alt="Yunnan pagoda light"><figcaption><b>Mangshi</b><span>Borderland pagoda light, fruit markets and warmer meals need their own days.</span></figcaption></figure>
        </div>
      </div>
    </section>
    <!-- yunnan-material-notes-end -->
`,
  },
  {
    file: "zh/yunnan-grand-loop/index.html",
    section: `
    <!-- yunnan-material-notes-start -->
    <section class="section material-notes-band compact" id="field-materials">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro">
          <p class="eyebrow">實地素材筆記</p>
          <h2 class="cjk-title"><span class="title-line">為什麼 13 天</span><span class="title-line">反而更安靜</span></h2>
          <p>這條路線保護三種價值：前段有湖邊安定，中段照顧雪山海拔，後段給騰衝與芒市真正成為目的地的時間。</p>
        </div>
        <div class="material-grid">
          <figure class="material-card large"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="大理湖邊餐桌"><figcaption><b>大理</b><span>先用湖邊節奏安定旅人，再進入更長距離的移動。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg" alt="玉龍雪山草甸"><figcaption><b>麗江</b><span>雪山日要看天氣、海拔與體力，不適合硬塞緊湊景點。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-spruce-boardwalk-03.jpg" alt="雲南森林棧道"><figcaption><b>騰衝</b><span>溫泉、森林、濕地與恢復時間應該放在路線中段，不是邊角料。</span></figcaption></figure>
          <figure class="material-card"><img loading="lazy" src="/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png" alt="雲南佛塔光線"><figcaption><b>芒市</b><span>邊地佛塔、熱帶水果與溫暖餐桌，需要自己的兩三天成立。</span></figcaption></figure>
        </div>
      </div>
    </section>
    <!-- yunnan-material-notes-end -->
`,
  },
];

function removeExisting(html) {
  return html.replace(/\n\s*<!-- yunnan-material-notes-start -->[\s\S]*?<!-- yunnan-material-notes-end -->\n?/g, "\n");
}

function updateAside(html, page) {
  return html.replace(
    /(<aside class="route-visual-panel" aria-label="[^"]*">\s*<figure>\s*)<img src="[^"]+" alt="[^"]+">\s*<figcaption>[^<]+<\/figcaption>/,
    `$1<img src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="${page.asideAlt}">\n              <figcaption>${page.asideCaption}</figcaption>`,
  );
}

function updateAsideNotes(html, page) {
  const notes = page.asideNotes
    .map((note, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${note}</span></li>`)
    .join("");
  return html.replace(/<ul class="route-visual-notes">[\s\S]*?<\/ul>/, `<ul class="route-visual-notes">${notes}</ul>`);
}

function insertBefore(html, anchor, section, file) {
  if (!html.includes(anchor)) {
    throw new Error(`Anchor not found in ${file}: ${anchor}`);
  }
  return html.replace(anchor, `${section}${anchor}`);
}

for (const page of yunnanPages) {
  let html = fs.readFileSync(page.file, "utf8");
  html = removeExisting(html);
  html = updateAside(html, page);
  html = updateAsideNotes(html, page);
  html = insertBefore(html, "    <!-- content-95-start -->", page.section, page.file);
  fs.writeFileSync(page.file, html);
  console.log(`updated ${page.file}`);
}

for (const page of grandLoopPages) {
  let html = fs.readFileSync(page.file, "utf8");
  html = removeExisting(html);
  html = insertBefore(html, "    <section class=\"section content-note-band\">", page.section, page.file);
  fs.writeFileSync(page.file, html);
  console.log(`updated ${page.file}`);
}
