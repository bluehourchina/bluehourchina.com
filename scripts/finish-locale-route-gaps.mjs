import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

function replaceMarked(html, marker, rendered) {
  const pattern = new RegExp(`<!-- ${marker}-start -->[\\s\\S]*?<!-- ${marker}-end -->`);
  if (!pattern.test(html)) throw new Error(`Missing ${marker}`);
  return html.replace(pattern, rendered);
}

function replaceOrInsertScenes(html, rendered, anchorPattern) {
  const existing = /<!-- real-scenes-start -->[\s\S]*?<!-- real-scenes-end -->/;
  if (existing.test(html)) return html.replace(existing, rendered);
  if (!anchorPattern.test(html)) throw new Error("Missing scene insertion anchor");
  return html.replace(anchorPattern, (match) => `${rendered}${match}`);
}

function extractMarked(html, marker) {
  const match = html.match(new RegExp(`<!-- ${marker}-start -->[\\s\\S]*?<!-- ${marker}-end -->`));
  if (!match) throw new Error(`Missing source ${marker}`);
  return match[0];
}

const xinjiang = {
  ja: {
    price: "JPY 300,000", currency: "JPY", number: "300000", lang: "ja", name: "新疆イリ・プライベートルート", duration: "9日間・8泊", group: "2名様から · おすすめは2–6名様",
    summary: "ウルムチ、サイラム湖、イーニン、テケス、ナラティを実際の宿泊地に沿って9日で結びます。",
    route: "ウルムチ → クイトゥン → サイラム湖 → イーニン → テケス → ナラティ",
    pace: "長い移動日を明示し、ナラティは2連泊", best: "大きな景観、専用車、部屋の快適さを重視する方", season: "主に5月下旬〜9月。道路、草原、宿の状況による",
    labels: ["標準プライベートルート", "ルート", "旅のペース", "おすすめ", "季節", "ルート概要", "この9日間を相談する", "日ごとのルート", "日数", "1名様料金", "人数", "ルートの要点", "基本料金に含むもの", "別途見積り", "実景で見るルート", "9日間の移動が見える旅程"],
    shape: ["1–2日目 ウルムチ・S101", "3–4日目 サイラム湖・イーニン", "5–7日目 テケス・ナラティ", "8–9日目 イーニン・出発"],
    days: [
      ["1日目", "ウルムチ到着と国際大バザール", "専用車でお迎えし、チェックインとルート説明。到着時間が合えば夜に国際大バザールを軽く歩きます。", "宿泊：ウルムチ"],
      ["2日目", "S101天山北麓景観道路でクイトゥンへ", "最初の長距離日はS101を進みます。立ち寄りは天候と体力に合わせ、数を競いません。", "宿泊：クイトゥン"],
      ["3日目", "クイトゥンからサイラム湖へ", "昼前に湖へ到着し、午後は湖岸と遊歩道に使います。果子溝とイーニンは翌日に分けます。", "宿泊：サイラム湖または清水河"],
      ["4日目", "果子溝・霍城・イーニン", "果子溝大橋を渡り、花の季節は霍城へ。イーニンではカザンチまたは六星街の時間を残します。", "宿泊：イーニン"],
      ["5日目", "イーニンからテケス、カラジュンへ", "テケスへ進み、条件が合えばカラジュン方面へ。テケス泊で同じ道の往復を避けます。", "宿泊：テケス"],
      ["6日目", "テケスからナラティへ", "ナラティへ移動し、午後は軽くします。2連泊にして翌朝の荷造りをなくします。", "宿泊：ナラティ"],
      ["7日目", "ナラティ草原を丸一日", "同じ宿を拠点に空中草原、河谷草原、軽い散策から選びます。遠い観光地は追加しません。", "宿泊：ナラティ"],
      ["8日目", "ナラティからイーニンへ", "無理のない速度で戻り、午後は部屋、地元の夕食、荷造りに使います。", "宿泊：イーニン"],
      ["9日目", "イーニン出発", "空港へ専用車で送ります。イーニン発またはウルムチ経由の実際の便に合わせます。", "出発日"],
    ],
    notes: ["2日目のS101が最長の移動日です。", "サイラム湖とナラティは通過せず、時間を確保します。", "ナラティ2連泊が天候と休息の余裕になります。"],
    included: ["9日間のルート設計と現地手配", "2–6名様用の専用車とドライバー", "2名1室を基準に8泊", "主要入場料と英語サポートを見積書に明記"],
    separate: ["新疆までの航空券・鉄道", "1名1室追加料金と客室アップグレード", "記載外の食事と任意の乗馬", "ビザ、保険、個人的費用"],
    cta: "/ja/interest/", noPayment: "お問い合わせの送信にお支払いは不要です。",
    scenesIntro: "ウルムチ、サイラム湖、ナラティ、果子溝の実景です。道路と草原の状況は旅行月に合わせて確認します。",
    gallery: [
      ["/assets/real-xinjiang/urumqi-grand-bazaar-cc-by-sa.jpg", "ウルムチ国際大バザールの実景", "1–2日目 · ウルムチとS101", "到着、バザール、S101の長距離移動を一つの段階として考えます。"],
      ["/assets/real-xinjiang/sayram-lake-cc0.jpg", "新疆サイラム湖の実景", "3–4日目 · サイラム湖", "湖を通過地点にせず、午後を湖岸に残します。"],
      ["/assets/real-xinjiang/nalati-grassland-cc0.jpg", "新疆ナラティ草原の実景", "5–7日目 · テケスとナラティ", "ナラティ2連泊で一日を草原に使えます。"],
      ["/assets/real-xinjiang/guozigou-bridge-cc-by.jpg", "新疆果子溝大橋の実景", "8–9日目 · イーニンへ", "戻りの移動とフライト接続に余裕を持たせます。"],
    ],
  },
  ko: {
    price: "KRW 2,850,000", currency: "KRW", number: "2850000", lang: "ko", name: "신장 이리 프라이빗 루트", duration: "9일 8박", group: "2인부터 · 권장 2–6인",
    summary: "우루무치, 싸이리무호, 이닝, 터커스, 날라티를 실제 숙박 흐름에 따라 9일로 잇습니다.",
    route: "우루무치 → 쿠이툰 → 싸이리무호 → 이닝 → 터커스 → 날라티",
    pace: "긴 이동일을 공개하고 날라티는 2연박", best: "큰 풍경, 전용차, 객실 편의를 중시하는 여행자", season: "주로 5월 말–9월, 도로와 초원·숙소 상황에 따름",
    labels: ["표준 프라이빗 여정", "경로", "여행 속도", "추천 대상", "계절", "한눈에 보는 경로", "이 9일 여정 문의", "일자별 경로", "기간", "1인 시작가", "인원", "경로 포인트", "시작가 포함 사항", "별도 견적", "실제 사진으로 보는 경로", "9일 이동을 한눈에 확인하세요"],
    shape: ["1–2일 우루무치·S101", "3–4일 싸이리무호·이닝", "5–7일 터커스·날라티", "8–9일 이닝·출발"],
    days: [
      ["1일 차", "우루무치 도착과 국제대바자", "전용 픽업, 체크인, 경로 설명. 항공편 시간이 맞으면 국제대바자를 가볍게 걷습니다.", "숙박: 우루무치"],
      ["2일 차", "S101 톈산 북사면 도로로 쿠이툰 이동", "첫 장거리 이동은 S101을 따릅니다. 정차 지점은 날씨와 체력에 맞춥니다.", "숙박: 쿠이툰"],
      ["3일 차", "쿠이툰에서 싸이리무호로", "정오 전 호수에 도착해 오후를 호숫가에 둡니다. 궈쯔거우와 이닝은 다음 날로 분리합니다.", "숙박: 싸이리무호 또는 칭수이허"],
      ["4일 차", "궈쯔거우, 훠청, 이닝", "궈쯔거우 대교를 지나 꽃철에는 훠청에 들릅니다. 이닝에서 카잔치 또는 류싱제 시간을 둡니다.", "숙박: 이닝"],
      ["5일 차", "이닝에서 터커스와 카라쥔으로", "터커스로 이동해 조건이 맞으면 카라쥔 방향을 봅니다. 터커스 숙박으로 같은 길 왕복을 피합니다.", "숙박: 터커스"],
      ["6일 차", "터커스에서 날라티로", "날라티로 이동하고 오후는 가볍게 둡니다. 2연박으로 다음 날 짐을 싸지 않습니다.", "숙박: 날라티"],
      ["7일 차", "온전한 날라티 초원 하루", "같은 숙소를 기준으로 공중초원, 계곡초원, 가벼운 걷기 중 고릅니다. 먼 명소는 더하지 않습니다.", "숙박: 날라티"],
      ["8일 차", "날라티에서 이닝으로", "편한 속도로 돌아와 오후는 객실, 현지 저녁, 짐 정리에 씁니다.", "숙박: 이닝"],
      ["9일 차", "이닝 출발", "공항으로 전용 이동합니다. 실제 이닝 출발편 또는 우루무치 연결 시간에 맞춥니다.", "출발일"],
    ],
    notes: ["2일 차 S101이 가장 긴 이동일입니다.", "싸이리무호와 날라티는 사진 정차가 아니라 시간을 확보합니다.", "날라티 2연박이 날씨와 휴식의 여유가 됩니다."],
    included: ["9일 경로 설계와 현지 조정", "2–6인용 전용 차량과 기사", "2인 1실 기준 8박", "핵심 입장권과 영어 지원을 견적서에 명시"],
    separate: ["신장 왕복 항공·철도", "1인실 추가금과 객실 업그레이드", "표기되지 않은 식사와 선택 승마", "비자, 보험, 개인 지출"],
    cta: "/ko/interest/", noPayment: "문의 제출에는 결제가 필요하지 않습니다.",
    scenesIntro: "우루무치, 싸이리무호, 날라티, 궈쯔거우의 실제 풍경입니다. 도로와 초원 상태는 여행 월에 맞춰 확인합니다.",
    gallery: [
      ["/assets/real-xinjiang/urumqi-grand-bazaar-cc-by-sa.jpg", "우루무치 국제대바자 실제 풍경", "1–2일 차 · 우루무치와 S101", "도착, 바자, S101 장거리 이동을 한 단계로 봅니다."],
      ["/assets/real-xinjiang/sayram-lake-cc0.jpg", "신장 싸이리무호 실제 풍경", "3–4일 차 · 싸이리무호", "호수를 통과 지점으로 만들지 않고 오후를 남깁니다."],
      ["/assets/real-xinjiang/nalati-grassland-cc0.jpg", "신장 날라티 초원 실제 풍경", "5–7일 차 · 터커스와 날라티", "날라티 2연박으로 초원에 온전한 하루를 씁니다."],
      ["/assets/real-xinjiang/guozigou-bridge-cc-by.jpg", "신장 궈쯔거우 대교 실제 풍경", "8–9일 차 · 이닝 귀환", "귀환 이동과 항공 연결에 여유를 둡니다."],
    ],
  },
  th: {
    price: "THB 62,000", currency: "THB", number: "62000", lang: "th", name: "เส้นทางส่วนตัวซินเจียงอีหลี", duration: "9 วัน 8 คืน", group: "เริ่มที่ 2 คน · เหมาะที่สุด 2–6 คน",
    summary: "เก้าวันเชื่อมอุรุมชี คุยถุน ทะเลสาบไซหลี่มู่ อีหนิง เท่อเค่อซือ และน่าลาถีตามเมืองที่พักจริง",
    route: "อุรุมชี → คุยถุน → ทะเลสาบไซหลี่มู่ → อีหนิง → เท่อเค่อซือ → น่าลาถี",
    pace: "เปิดเผยวันเดินทางไกล และพักน่าลาถีต่อเนื่อง 2 คืน", best: "ผู้ที่ให้ความสำคัญกับวิวใหญ่ รถส่วนตัว และห้องพักสบาย", season: "หลัก ๆ ปลายพฤษภาคม–กันยายน ขึ้นกับถนน ทุ่งหญ้า และที่พัก",
    labels: ["เส้นทางส่วนตัวมาตรฐาน", "เส้นทาง", "จังหวะการเดินทาง", "เหมาะสำหรับ", "ฤดูกาล", "ภาพรวมเส้นทาง", "สอบถามเส้นทาง 9 วันนี้", "เส้นทางรายวัน", "ระยะเวลา", "ราคาเริ่มต้นต่อคน", "กลุ่ม", "จุดสำคัญของเส้นทาง", "รวมในราคาเริ่มต้น", "เสนอราคาแยก", "เส้นทางผ่านภาพสถานที่จริง", "เห็นการเดินทางทั้ง 9 วันอย่างชัดเจน"],
    shape: ["วันที่ 1–2 อุรุมชี·S101", "วันที่ 3–4 ไซหลี่มู่·อีหนิง", "วันที่ 5–7 เท่อเค่อซือ·น่าลาถี", "วันที่ 8–9 อีหนิง·ออกเดินทาง"],
    days: [
      ["วันที่ 1", "ถึงอุรุมชีและตลาดนานาชาติ", "รถส่วนตัวรับส่ง เช็กอิน และอธิบายเส้นทาง หากเวลาเที่ยวบินเหมาะจะเดินตลาดนานาชาติช่วงเย็น", "พัก: อุรุมชี"],
      ["วันที่ 2", "ถนน S101 เชิงเขาเทียนซานสู่คุยถุน", "วันเดินทางไกลวันแรกใช้ถนน S101 จุดแวะเลือกตามอากาศและกำลังของกลุ่ม", "พัก: คุยถุน"],
      ["วันที่ 3", "คุยถุนสู่ทะเลสาบไซหลี่มู่", "ถึงทะเลสาบก่อนเที่ยงและเก็บช่วงบ่ายไว้ริมทะเลสาบ กั่วจื่อโกวและอีหนิงแยกไว้วันถัดไป", "พัก: ไซหลี่มู่หรือชิงสุ่ยเหอ"],
      ["วันที่ 4", "กั่วจื่อโกว ฮั่วเฉิง และอีหนิง", "ข้ามสะพานกั่วจื่อโกว แวะฮั่วเฉิงเมื่อเป็นฤดูดอกไม้ แล้วมีเวลาที่คาซานฉีหรือถนนลิ่วซิงในอีหนิง", "พัก: อีหนิง"],
      ["วันที่ 5", "อีหนิงสู่เท่อเค่อซือและคาลาจวิ้น", "เดินทางสู่เท่อเค่อซือและไปทิศคาลาจวิ้นเมื่อสภาพเหมาะ พักที่เท่อเค่อซือเพื่อลดการย้อนทาง", "พัก: เท่อเค่อซือ"],
      ["วันที่ 6", "เท่อเค่อซือสู่น่าลาถี", "เดินทางสู่น่าลาถีและปล่อยช่วงบ่ายให้เบา พักต่อเนื่องสองคืนเพื่อไม่ต้องย้ายกระเป๋าวันถัดไป", "พัก: น่าลาถี"],
      ["วันที่ 7", "หนึ่งวันเต็มในทุ่งหญ้าน่าลาถี", "ใช้โรงแรมเดิมเป็นฐาน เลือกทุ่งหญ้าบนฟ้า หุบเขา หรือเดินเบา ๆ โดยไม่เพิ่มจุดไกล", "พัก: น่าลาถี"],
      ["วันที่ 8", "น่าลาถีกลับอีหนิง", "กลับด้วยจังหวะสบาย เก็บช่วงบ่ายไว้พัก รับประทานอาหารท้องถิ่น และจัดกระเป๋า", "พัก: อีหนิง"],
      ["วันที่ 9", "ออกเดินทางจากอีหนิง", "รถส่วนตัวไปสนามบิน จัดตามเที่ยวบินจริงจากอีหนิงหรือเชื่อมต่อผ่านอุรุมชี", "วันเดินทางกลับ"],
    ],
    notes: ["วันที่ 2 บน S101 เป็นวันเดินทางไกลที่สุด", "ไซหลี่มู่และน่าลาถีมีเวลาจริง ไม่ใช่จุดถ่ายรูปผ่านทาง", "พักน่าลาถีสองคืนเพื่อเผื่ออากาศและพักผ่อน"],
    included: ["ออกแบบเส้นทาง 9 วันและประสานงานท้องถิ่น", "รถส่วนตัวพร้อมคนขับสำหรับ 2–6 คน", "ที่พัก 8 คืน พักห้องคู่", "ระบุค่าเข้าหลักและการสนับสนุนภาษาอังกฤษในใบเสนอราคา"],
    separate: ["เที่ยวบินหรือรถไฟไปกลับซินเจียง", "ค่าห้องเดี่ยวและอัปเกรดห้อง", "อาหารที่ไม่ระบุและการขี่ม้าเสริม", "วีซ่า ประกัน และค่าใช้จ่ายส่วนตัว"],
    cta: "/th/interest/", noPayment: "ส่งคำขอได้โดยยังไม่ต้องชำระเงิน",
    scenesIntro: "ภาพจริงของอุรุมชี ไซหลี่มู่ น่าลาถี และกั่วจื่อโกว เราจะตรวจสอบถนนและทุ่งหญ้าตามเดือนเดินทางอีกครั้ง",
    gallery: [
      ["/assets/real-xinjiang/urumqi-grand-bazaar-cc-by-sa.jpg", "ภาพจริงตลาดนานาชาติอุรุมชี", "วันที่ 1–2 · อุรุมชีและ S101", "รวมการมาถึง ตลาด และวันเดินทางไกล S101 เป็นช่วงแรกของเส้นทาง"],
      ["/assets/real-xinjiang/sayram-lake-cc0.jpg", "ภาพจริงทะเลสาบไซหลี่มู่", "วันที่ 3–4 · ไซหลี่มู่", "เก็บช่วงบ่ายไว้ริมทะเลสาบ ไม่ทำให้เป็นจุดแวะถ่ายรูป"],
      ["/assets/real-xinjiang/nalati-grassland-cc0.jpg", "ภาพจริงทุ่งหญ้าน่าลาถี", "วันที่ 5–7 · เท่อเค่อซือและน่าลาถี", "พักน่าลาถีสองคืนเพื่อมีหนึ่งวันเต็มในทุ่งหญ้า"],
      ["/assets/real-xinjiang/guozigou-bridge-cc-by.jpg", "ภาพจริงสะพานกั่วจื่อโกว", "วันที่ 8–9 · กลับอีหนิง", "เผื่อเวลาสำหรับทางกลับและการต่อเที่ยวบิน"],
    ],
  },
};

function renderXinjiangStandard(data) {
  const l = data.labels;
  return `<!-- standard-route-start --><section class="section standard-route-band" id="standard-route"><div class="wrap route-showcase"><div class="route-copy"><p class="eyebrow">${l[0]}</p><h2 class="cjk-title">${data.name}</h2><p>${data.summary}</p><div class="route-price"><span>${data.duration}</span><strong>${data.price}</strong><small>${data.group}</small></div><div class="route-points"><div><b>${l[1]}</b><span>${data.route}</span></div><div><b>${l[2]}</b><span>${data.pace}</span></div><div><b>${l[3]}</b><span>${data.best}</span></div><div><b>${l[4]}</b><span>${data.season}</span></div></div><p class="route-note">${data.noPayment}</p><div class="hero-actions"><a class="btn primary dark-gold" href="${data.cta}?utm_source=standard_route&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=xinjiang">${l[6]}</a></div></div><div class="route-card"><div class="route-image"><img src="/assets/real-xinjiang/sayram-lake-cc0.jpg" alt="${data.name}"></div><div class="route-map"><h3>${l[5]}</h3><div class="map-line">${data.shape.map((item) => `<span>${item}</span>`).join("")}</div></div></div></div></section><!-- standard-route-end -->`;
}

function renderXinjiangDay(data) {
  const l = data.labels;
  const days = data.days.map(([index, title, body, stay]) => `<article class="route-day-item"><div class="route-day-index">${index}</div><div class="route-day-copy"><h3>${title}</h3><p>${body}</p><span>${stay}</span></div></article>`).join("");
  return `<!-- route-day-plan-start --><section class="section route-day-plan-band" id="day-plan"><div class="wrap route-day-plan-wrap"><div class="route-day-head"><div><p class="eyebrow">${l[7]}</p><h2 class="cjk-title">${data.name}</h2><p>${data.summary}</p></div><div class="route-terms"><div><b>${l[8]}</b><span>${data.duration}</span></div><div><b>${l[9]}</b><span>${data.price}</span></div><div><b>${l[10]}</b><span>${data.group}</span></div></div></div><div class="route-day-layout"><div class="route-day-list">${days}</div><aside class="route-visual-panel"><figure><img src="/assets/real-xinjiang/nalati-grassland-cc0.jpg" alt="${data.name}"><figcaption>${data.gallery[2][2]}</figcaption></figure><ul class="route-visual-notes">${data.notes.map((note, index) => `<li><b>0${index + 1}</b><span>${note}</span></li>`).join("")}</ul><div class="route-inclusion-grid"><section><h3>${l[12]}</h3><ul>${data.included.map((item) => `<li>${item}</li>`).join("")}</ul></section><section><h3>${l[13]}</h3><ul>${data.separate.map((item) => `<li>${item}</li>`).join("")}</ul></section></div><p class="route-note">${data.noPayment}</p><a class="btn primary dark-gold" href="${data.cta}?utm_source=route_day_plan&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=xinjiang">${l[6]}</a></aside></div></div></section><!-- route-day-plan-end -->`;
}

function renderXinjiangScenes(data) {
  const cards = data.gallery.map(([src, alt, label, body]) => `<figure class="material-card"><img loading="lazy" src="${src}" alt="${alt}"><figcaption><b>${label}</b><span>${body}</span></figcaption></figure>`).join("");
  return `<!-- real-scenes-start --><section class="section material-notes-band" id="real-scenes"><div class="wrap material-notes-wrap"><div class="material-notes-intro"><div><p class="eyebrow">${data.labels[14]}</p><h2 class="cjk-title">${data.labels[15]}</h2></div><p>${data.scenesIntro}</p></div><div class="material-grid four-up">${cards}</div></div></section><!-- real-scenes-end -->`;
}

function updateXinjiangSchema(html, data, locale) {
  const canonical = `https://bluehourchina.com/${locale}/xinjiang/`;
  const schema = {
    "@context": "https://schema.org", "@type": "Product", name: data.name,
    brand: { "@type": "Brand", name: "Bluehour China Journeys" }, category: "Private China travel planning", inLanguage: locale,
    description: `${data.summary} ${data.price}. ${data.group}.`, image: "https://bluehourchina.com/assets/real-xinjiang/sayram-lake-cc0.jpg", url: canonical,
    offers: { "@type": "Offer", priceCurrency: data.currency, price: data.number, url: canonical, availability: "https://schema.org/InStock" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Duration", value: data.duration },
      { "@type": "PropertyValue", name: "Route", value: data.route },
      { "@type": "PropertyValue", name: "Minimum private group", value: data.group },
      { "@type": "PropertyValue", name: "Best for", value: data.best },
    ],
  };
  return replaceMarked(html, "route-product-schema", `<!-- route-product-schema-start --><script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script><!-- route-product-schema-end -->`);
}

const rootXinjiang = await fs.readFile(path.join(root, "xinjiang.html"), "utf8");
let englishXinjiang = await fs.readFile(path.join(root, "en/xinjiang/index.html"), "utf8");
englishXinjiang = replaceMarked(englishXinjiang, "standard-route", extractMarked(rootXinjiang, "standard-route"));
englishXinjiang = replaceMarked(englishXinjiang, "route-day-plan", extractMarked(rootXinjiang, "route-day-plan"));
englishXinjiang = replaceMarked(englishXinjiang, "route-product-schema", extractMarked(rootXinjiang, "route-product-schema").replaceAll("https://bluehourchina.com/xinjiang.html", "https://bluehourchina.com/en/xinjiang/"));
englishXinjiang = englishXinjiang.replace(/<meta property="og:image" content="[^"]+">/, '<meta property="og:image" content="https://bluehourchina.com/assets/real-xinjiang/sayram-lake-cc0.jpg">');
await fs.writeFile(path.join(root, "en/xinjiang/index.html"), englishXinjiang);

for (const [locale, data] of Object.entries(xinjiang)) {
  const file = path.join(root, `${locale}/xinjiang/index.html`);
  let html = await fs.readFile(file, "utf8");
  html = replaceMarked(html, "standard-route", renderXinjiangStandard(data));
  html = replaceMarked(html, "route-day-plan", renderXinjiangDay(data));
  html = replaceOrInsertScenes(html, renderXinjiangScenes(data), /<!-- content-95-start -->/);
  html = updateXinjiangSchema(html, data, locale);
  html = html.replace(/8-9\s*(日間|일|วัน)/g, locale === "ja" ? "9日間" : locale === "ko" ? "9일" : "9 วัน");
  html = html.replace(/<meta property="og:image" content="[^"]+">/, '<meta property="og:image" content="https://bluehourchina.com/assets/real-xinjiang/sayram-lake-cc0.jpg">');
  await fs.writeFile(file, html);
}

const innerScenes = {
  en: ["Real scenes along the route", "Hohhot, grassland and desert", "Real Inner Mongolia locations matched to the six-day route. Grass conditions, room standard and activities are reconfirmed for the travel month.", [
    ["Days 1–2 · Hohhot", "Begin with Dazhao and the city's history before the long landscapes."], ["Days 3–4 · Grassland", "Protect sunset and morning; bathroom, heating and quiet are checked before booking."], ["Day 5 · Kubuqi", "Dune time follows light and temperature; activities are optional and priced separately."],
  ]],
  ja: ["実景で見るルート", "フフホト、草原、砂漠", "6日間の実際の場所です。草の状態、部屋水準、活動の可否は旅行月に合わせて確認します。", [
    ["1–2日目 · フフホト", "大召と街の歴史を知ってから、大きな風景へ進みます。"], ["3–4日目 · 草原", "夕方と朝を守り、浴室、暖房、静けさを予約前に確認します。"], ["5日目 · クブチ", "砂丘は光と気温に合わせ、追加体験は任意で別料金です。"],
  ]],
  ko: ["실제 사진으로 보는 경로", "후허하오터, 초원, 사막", "6일 경로의 실제 장소입니다. 초원 상태, 객실 수준, 활동 가능 여부를 여행 월에 맞춰 확인합니다.", [
    ["1–2일 차 · 후허하오터", "다자오와 도시 역사로 지역을 이해한 뒤 큰 풍경으로 이동합니다."], ["3–4일 차 · 초원", "해질녘과 아침을 지키고 욕실, 난방, 조용함을 예약 전에 확인합니다."], ["5일 차 · 쿠부치", "사구 시간은 빛과 기온에 맞추며 추가 활동은 선택·별도 가격입니다."],
  ]],
  th: ["เส้นทางผ่านภาพสถานที่จริง", "ฮูฮอต ทุ่งหญ้า และทะเลทราย", "สถานที่จริงตามเส้นทางหกวัน เราจะยืนยันสภาพทุ่งหญ้า ห้องพัก และกิจกรรมตามเดือนเดินทาง", [
    ["วันที่ 1–2 · ฮูฮอต", "เริ่มจากวัดต้าเจาและประวัติศาสตร์เมืองก่อนเข้าสู่ภูมิทัศน์กว้าง"], ["วันที่ 3–4 · ทุ่งหญ้า", "เก็บช่วงเย็นและเช้า พร้อมตรวจห้องน้ำ ความอุ่น และความเงียบก่อนจอง"], ["วันที่ 5 · คูปู้ฉี", "เวลาเนินทรายเลือกตามแสงและอุณหภูมิ กิจกรรมเสริมเป็นตัวเลือกและคิดแยก"],
  ]],
};

function renderInnerScenes(locale) {
  const [eyebrow, title, intro, captions] = innerScenes[locale];
  const images = [
    ["/assets/real-inner-mongolia/dazhao-temple-cc-by.jpg", "Dazhao Temple in Hohhot"],
    ["/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Inner Mongolia grassland sunset"],
    ["/assets/real-inner-mongolia/kubuqi-desert-cc-by-sa.jpg", "Kubuqi Desert"],
  ];
  const cards = images.map(([src, alt], index) => `<figure class="material-card"><img loading="lazy" src="${src}" alt="${alt}"><figcaption><b>${captions[index][0]}</b><span>${captions[index][1]}</span></figcaption></figure>`).join("");
  return `<!-- real-scenes-start --><section class="section material-notes-band" id="real-scenes"><div class="wrap material-notes-wrap"><div class="material-notes-intro"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div><p>${intro}</p></div><div class="material-grid">${cards}</div></div></section><!-- real-scenes-end -->`;
}

for (const locale of ["en", "ja", "ko", "th"]) {
  const file = path.join(root, `${locale}/inner-mongolia/index.html`);
  let html = await fs.readFile(file, "utf8");
  html = html.replace(/(<aside class="route-visual-panel">[\s\S]*?<img src=")\/assets\/ai\/bluehour-inner-mongolia-grassland-v1\.jpg("[^>]*>)/, `$1/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg$2`);
  html = replaceOrInsertScenes(html, renderInnerScenes(locale), /<section class="section service-band"/);
  await fs.writeFile(file, html);
}

const yunnanThaiDays = [
  ["วันที่ 1", "เดินทางถึงคุนหมิง", "รถส่วนตัวรับส่ง เช็กอิน และช่วงเย็นแรกที่เงียบสบาย", "พัก: คุนหมิง"],
  ["วันที่ 2", "ตลาดดอกไม้โต่วหนาน พื้นที่ชุ่มน้ำเหลาหยูเหอ และรถไฟไปต้าหลี่", "ชมตลาดดอกไม้ แสงริมน้ำใกล้ทะเลสาบเตียนฉือ แล้วนั่งรถไฟไปต้าหลี่", "พัก: ต้าหลี่"],
  ["วันที่ 3", "พระอาทิตย์ขึ้นหลงคาน โค้ง S เอ๋อร์ไห่ และสี่โจว", "เช้าริมทะเลสาบ ถนนเอ๋อร์ไห่ และงานย้อมผ้าของสี่โจว", "พัก: ต้าหลี่"],
  ["วันที่ 4", "เมืองเก่าต้าหลี่ สวนพักผ่อน และพระอาทิตย์ตกหยุนเซียง", "เมืองเก่า บรรยากาศสวนรีสอร์ต และพระอาทิตย์ตกบนเขาหยุนเซียง", "พัก: ต้าหลี่"],
  ["วันที่ 5", "ต้าหลี่สู่ลี่เจียง", "พื้นที่ชุ่มน้ำโหวเหนี่ยววานและหุบเขาทิงฮวาเป็นช่วงเปลี่ยนสบาย ๆ สู่ลี่เจียง", "พัก: ลี่เจียง"],
  ["วันที่ 6", "หยุนซานผิง หุบเขาพระจันทร์สีน้ำเงิน และซูเหอ", "พื้นที่ภูเขาหิมะ น้ำสีฟ้า และเย็นแบบน่าซีที่เงียบกว่าในซูเหอ", "พัก: ลี่เจียง"],
  ["วันที่ 7", "ไป๋ซา หมู่บ้านอวี้หู และรถไฟกลับคุนหมิง", "เมืองเก่าไป๋ซา หมู่บ้านอวี้หูใต้ภูเขา แล้วนั่งรถไฟกลับคุนหมิง", "พัก: คุนหมิง"],
  ["วันที่ 8", "ออกเดินทางแบบส่วนตัว", "ตื่นอย่างไม่เร่งรีบ แล้วรถส่วนตัวไปสนามบินตามเวลาเที่ยวบิน", "วันเดินทางกลับ"],
];
const thaiDayItems = yunnanThaiDays.map(([index, title, body, stay]) => `<article class="route-day-item"><div class="route-day-index">${index}</div><div class="route-day-copy"><h3>${title}</h3><p>${body}</p><span>${stay}</span></div></article>`).join("");
const thaiYunnanBlock = `<!-- route-day-plan-start --><section class="section route-day-plan-band" id="day-plan"><div class="wrap route-day-plan-wrap"><div class="route-day-head"><div><p class="eyebrow">เส้นทางรายวัน</p><h2>คุนหมิง · ต้าหลี่ · ลี่เจียง 8 วัน</h2><p>เส้นทางมาตรฐานที่ชัดเจน ปรับตามวันที่ ห้องพัก การเดิน และภาษาที่ต้องการ</p></div><div class="route-terms"><div><b>ระยะเวลา</b><span>8 วัน 7 คืน</span></div><div><b>ราคาเริ่มต้นต่อคน</b><span>THB 17,700</span></div><div><b>กลุ่มส่วนตัว</b><span>เริ่มที่ 2 คน · เหมาะที่สุด 2–6 คน</span></div></div></div><div class="route-day-layout"><div class="route-day-list">${thaiDayItems}</div><aside class="route-visual-panel"><figure><img src="/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" alt="เส้นทางคุนหมิง ต้าหลี่ ลี่เจียง"><figcaption>คุนหมิง · เอ๋อร์ไห่ · หมู่บ้านลี่เจียงและภูเขาหิมะ</figcaption></figure><ul class="route-visual-notes"><li><b>01</b><span>คุนหมิง ถนนเก่า ดอกไม้ และพื้นที่ชุ่มน้ำ</span></li><li><b>02</b><span>พระอาทิตย์ขึ้นเอ๋อร์ไห่และงานฝีมือสี่โจว</span></li><li><b>03</b><span>หมู่บ้านลี่เจียงและพื้นที่ภูเขาหิมะ</span></li></ul><div class="route-inclusion-grid"><section><h3>รวมในราคาเริ่มต้น</h3><ul><li>รถส่วนตัวในวันหลัก</li><li>ที่พัก 7 คืน ห้องคู่</li><li>ค่าเข้าหลักและการจอง</li><li>การประสานงานท้องถิ่น</li></ul></section><section><h3>เสนอราคาแยก</h3><ul><li>เที่ยวบินและรถไฟไปกลับยูนนาน</li><li>ค่าห้องเดี่ยวและอัปเกรด</li><li>อาหารและกิจกรรมที่ไม่ระบุ</li><li>วีซ่า ประกัน และค่าใช้จ่ายส่วนตัว</li></ul></section></div><p class="route-note">ส่งคำขอได้โดยยังไม่ต้องชำระเงิน</p><a class="btn primary dark-gold" href="/th/interest/?utm_source=route_day_plan&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan">สอบถามวันเดินทางและใบเสนอราคา</a></aside></div></div></section><!-- route-day-plan-end -->`;
const thaiYunnanFile = path.join(root, "th/yunnan/index.html");
let thaiYunnan = await fs.readFile(thaiYunnanFile, "utf8");
thaiYunnan = replaceMarked(thaiYunnan, "route-day-plan", thaiYunnanBlock);
await fs.writeFile(thaiYunnanFile, thaiYunnan);

console.log("Localized Xinjiang, Inner Mongolia real scenes and Thai Yunnan day plan.");
await import("./expand-destination-photo-galleries.mjs");
await import("./apply-retail-margin-prices.mjs");
