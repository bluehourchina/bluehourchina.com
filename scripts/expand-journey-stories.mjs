import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const storyStyleVersion = "20260712-story3";
const storyFiles = {
  en: ["stories.html", "en/stories/index.html"],
  zh: ["zh/stories/index.html"],
  ja: ["ja/stories/index.html"],
  ko: ["ko/stories/index.html"],
  th: ["th/stories/index.html"],
};

const copy = {
  en: {
    eyebrow: "Journey journals",
    title: "What a private week can feel like",
    intro: "Editorial traveller scenarios based on the routes shown here. Names are fictional editorial personas, not customer testimonials.",
    link: "See this route",
    open: "Read the traveller perspective",
    persona: "Editorial traveller",
    stories: [
      ["Yunnan · 8 days", "Eight days remembered in small details", "The trip begins softly in Kunming, then gives Dali enough time for a lake sunrise, a village craft and an afternoon with nowhere else to be.", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg", "Aiko", "Tokyo, Japan", "In Aiko's imagined journey, the clearest memory is not a landmark but the pale morning light on Erhai Lake. Tea cooled beside the window while Cangshan slowly appeared, and for once the day did not ask her to hurry."],
      ["Xinjiang · 9 days", "The road was never treated as lost time", "Between Urumqi and the Ili valley, distance becomes part of the memory: Sayram Lake, a quiet night in Yining and two unhurried days near Nalati.", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg", "Daniel", "Seattle, United States", "Daniel's imagined route carries the scale he came for without turning every day into endurance. He remembers the silence after the car stopped by Sayram Lake, and how the sky seemed larger because nobody rushed him back inside."],
      ["Qinghai–Gansu · 9 days", "Where the horizon keeps changing", "Plateau lake, salt mirror, Gobi and old frontier towns unfold in one clear line from Xining to Zhangye.", "dunhuang", "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg", "Claire", "Lyon, France", "Claire's imagined route begins with the thin blue edge of Qinghai Lake and ends among Zhangye's layered colours. Between them, the Gobi teaches a slower kind of attention: wind against the window, long light, and silence with room to stay."],
      ["Zhangjiajie · 6 days", "When the mist finally lifts", "Peak forest, Tianmen Mountain, Furong and Fenghuang are given separate days so the mountains and old towns never compete for attention.", "zhangjiajie", "/assets/real-zhangjiajie/fenghuang-ancient-town.jpg", "Sophie", "Melbourne, Australia", "Sophie's imagined morning begins inside the mist. The stone pillars appear one by one, then disappear again. By the time she reaches Fenghuang, the memory has changed from a view into a feeling: quiet height, wet leaves and a river carrying evening light."],
      ["Inner Mongolia · 6 days", "The grassland keeps the evening light", "From Hohhot to Huitengxile and the Kubuqi Desert, city roofs give way to grass lines, open wind and dunes.", "inner-mongolia", "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Mina", "Singapore", "In Mina's imagined journey, the last hour on the grassland matters most. She once thought vastness meant emptiness; then distant herds crossed the horizon, the wind changed direction, and the sky held its colour long after dinner should have begun."],
      ["Hainan · 7 days", "The sea breeze makes the luggage lighter", "Haikou arcades, Wanning's coast and two slower days in Sanya bring island culture and a gentle resort ending into one route.", "sanya", "/assets/real-sanya/sanya-edition-02-cc-by.jpg", "Luca", "Milan, Italy", "Luca's imagined Hainan is remembered less as a list of beaches than as a change of pace. Rain passed before breakfast, palms shone beside the water, and the afternoon remained open enough for the sea breeze to decide what happened next."],
      ["Northeast · 7 days", "When snow falls, the town grows quiet", "Harbin's winter light, Yabuli's snow line and the smoke above Snow Town are allowed their own nights.", "northeast", "/assets/real-northeast/china-snow-town-cc-by.jpg", "Elena", "Barcelona, Spain", "Elena's imagined evening begins after the day visitors leave. Snow softens every roof, lanterns turn warm, and footsteps become the loudest sound on the lane. The cold is real, but so is the pleasure of returning to a warm room without another transfer ahead."],
      ["Xi'an · 5 days", "Night slows beneath the city wall", "The city wall, imperial collections and a full day in Lintong leave enough space for Xi'an to feel like a city, not a checklist.", "xian", "/assets/real-xian/xian-city-wall-night.jpg", "Marcus", "London, United Kingdom", "Marcus's imagined Xi'an stays brightest after dinner. The bell tower glows beyond the wall, bicycles pass in the dark, and centuries stop feeling like a museum label. History has become something the city carries into an ordinary night."],
      ["Tibet · 8 days", "The plateau teaches a slower breath", "Lhasa begins gently before the road turns toward Yamdrok Lake, Gyantse and Shigatse, with weather and altitude given honest room.", "tibet", "/assets/real-tibet/tibet-yamdrok-lake.jpg", "Hana", "Seoul, South Korea", "Hana's imagined route does not begin with a summit. It begins with warm tea, a short walk and one quiet day in Lhasa. At Yamdrok Lake, the blue arrives almost without scale; she remembers breathing slowly and letting the landscape remain larger than the photograph."],
    ],
  },
  zh: {
    eyebrow: "旅程紀行",
    title: "旅程結束後留下的是什麼",
    intro: "以下為依標準路線與不同旅人需求撰寫的情境紀行；人物是編輯角色，不是真實客戶評價。",
    link: "看這條路線",
    open: "展開旅人視角",
    persona: "情境旅人",
    stories: [
      ["雲南 · 8 天", "八天之後 記住的是那些小事", "旅程從昆明輕輕落地，大理留給湖邊日出、喜洲手作與一個沒有下一站的午後。", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg", "Aiko", "日本 · 東京", "Aiko 的情境旅程從洱海清晨開始。她沒有急著拍完所有風景，只記得蒼山在薄霧後慢慢顯出輪廓，窗邊的茶已經微涼，而這一天沒有任何人催她出發。"],
      ["新疆 · 9 天", "最珍貴的是 路沒有被趕過", "從烏魯木齊走向伊犁，長路成為記憶的一部分：賽里木湖、伊寧安靜的一晚，以及那拉提的兩個清晨。", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg", "Daniel", "美國 · 西雅圖", "Daniel 想像中的新疆保留了他期待的大尺度，卻沒有把每天變成耐力測驗。車停在賽里木湖邊時，四周忽然安靜；天空之所以顯得更大，是因為沒有人急著把他帶走。"],
      ["青甘 · 9 天", "風把路上的時間拉得很長", "高原湖、鹽湖、戈壁與古老關城，從西寧到張掖連成一條清楚而遼闊的線。", "dunhuang", "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg", "Claire", "法國 · 里昂", "Claire 的情境旅程從青海湖細細的藍線開始，在張掖層疊的色彩裡收尾。其間的戈壁教會她另一種觀看：窗邊的風、很長的光，以及一段不必立刻說話的安靜。"],
      ["張家界 · 6 天", "等山霧慢慢散開", "峰林、天門山、芙蓉鎮與鳳凰分開安排，山與古城不必在同一天爭奪你的注意。", "zhangjiajie", "/assets/real-zhangjiajie/fenghuang-ancient-town.jpg", "Sophie", "澳洲 · 墨爾本", "Sophie 的情境清晨從霧裡開始。石柱一座一座浮現，又悄悄藏回去。到了鳳凰，她記住的已經不是某個觀景台，而是一種感受：潮濕的樹葉、很高的安靜，以及沿著河水移動的晚光。"],
      ["內蒙古 · 6 天", "草原把黃昏留得很久", "從呼和浩特走向輝騰錫勒，再到庫布齊；城市屋簷慢慢退成草線、長風與沙丘。", "inner-mongolia", "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Mina", "新加坡", "Mina 的情境旅程裡，最重要的是草原最後一個小時。她原以為遼闊只是空無一物，直到遠處的牛群越過地平線，風換了方向，天色仍遲遲不肯暗下來。"],
      ["海南 · 7 天", "海風讓行李也變輕", "海口騎樓、萬寧海岸與三亞的兩個慢日，把島嶼文化與度假收在同一條路線。", "sanya", "/assets/real-sanya/sanya-edition-02-cc-by.jpg", "Luca", "義大利 · 米蘭", "Luca 的情境海南，留下的不是一張海灘清單，而是步調真的變慢了。早餐前的雨剛停，棕櫚樹在水邊發亮，午後沒有被排滿，下一件事可以交給海風決定。"],
      ["東北 · 7 天", "雪落下來 城市便安靜了", "哈爾濱的冬日光線、亞布力雪線與雪鄉炊煙各留一晚，不把寒冷趕成匆忙。", "northeast", "/assets/real-northeast/china-snow-town-cc-by.jpg", "Elena", "西班牙 · 巴塞隆納", "Elena 的情境夜晚從遊人散去之後開始。雪把每一座屋頂放柔，燈籠慢慢亮起，巷子裡最清楚的聲音只剩腳步。寒冷是真的，回到溫暖房間、明天也不用趕路的安心同樣是真的。"],
      ["西安 · 5 天", "城牆下 夜色慢了一步", "城牆、帝陵與盛唐收藏各有完整時間，讓西安像一座仍在生活的城市，而不是歷史清單。", "xian", "/assets/real-xian/xian-city-wall-night.jpg", "Marcus", "英國 · 倫敦", "Marcus 的情境西安，在晚餐後才顯得最明亮。鐘樓隔著城牆發光，自行車從夜色裡穿過，幾百年的時間不再只是博物館標籤，而是城市帶進尋常夜晚的一部分。"],
      ["西藏 · 8 天", "高原教人把呼吸放慢", "拉薩先用兩天安頓，再往羊卓雍錯、江孜與日喀則；天候與高度都被誠實地留進路線。", "tibet", "/assets/real-tibet/tibet-yamdrok-lake.jpg", "Hana", "韓國 · 首爾", "Hana 的情境旅程不是從山口開始，而是從熱茶、短短散步與拉薩安靜的一天開始。到了羊卓雍錯，藍色幾乎失去尺度；她只記得慢慢呼吸，讓風景比照片更大。"],
    ],
  },
  ja: {
    eyebrow: "旅の記録",
    title: "一週間の個人旅行が残すもの",
    intro: "掲載中のモデルルートをもとにした旅の情景です。登場人物は編集上のペルソナで、実在のお客様の声ではありません。",
    link: "この旅程を見る",
    open: "旅人の視点を読む",
    persona: "物語上の旅人",
    stories: [
      ["雲南 · 8日間", "八日後に残るのは 小さな場面", "昆明で静かに始まり、大理では湖の朝、喜洲の手仕事、次を急がない午後を守ります。", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg", "Aiko", "日本 · 東京", "Aikoの物語は洱海の朝から始まります。すべてを撮ろうとはせず、薄い霧の向こうに蒼山がゆっくり現れるのを待つ。窓辺のお茶が少し冷めても、次の予定は彼女を急かしません。"],
      ["新疆 · 9日間", "長い道を 急がせない旅", "ウルムチからイリへ向かう距離も旅の一部。サイラム湖、伊寧の夜、ナラティの二つの朝が残ります。", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg", "Daniel", "アメリカ · シアトル", "Danielが思い描く新疆には、期待していた大きな風景がありながら、毎日が耐久戦にはなりません。サイラム湖で車を降りた瞬間の静けさ。急いで戻る必要がないから、空はさらに広く見えます。"],
      ["青海・甘粛 · 9日間", "地平線が変わり続ける道", "高原の湖、塩湖、ゴビ、古い関城を西寧から張掖まで一本の線でたどります。", "dunhuang", "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg", "Claire", "フランス · リヨン", "Claireの物語は青海湖の細い青から始まり、張掖の重なる色で終わります。途中のゴビが教えるのは、窓を打つ風、長い光、そしてすぐに言葉にしなくてもよい静けさです。"],
      ["張家界 · 6日間", "霧の向こうに現れる峰林", "峰林、天門山、芙蓉鎮、鳳凰を別の日に置き、山と古城を競わせません。", "zhangjiajie", "/assets/real-zhangjiajie/fenghuang-ancient-town.jpg", "Sophie", "オーストラリア · メルボルン", "Sophieの朝は霧の中で始まります。石柱が一つずつ現れ、また静かに隠れていく。鳳凰に着く頃、記憶は景色の名前ではなく、濡れた葉、高い場所の静けさ、川を流れる夕方の光になっています。"],
      ["内モンゴル · 6日間", "草原に夕暮れが長く残る", "フフホトから輝騰錫勒、クブチ砂漠へ。街の屋根が草の線と風、砂丘へゆっくり変わります。", "inner-mongolia", "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Mina", "シンガポール", "Minaの物語で大切なのは、草原の最後の一時間です。広さは何もないことだと思っていた彼女の前を、遠い家畜の群れが横切ります。風向きが変わっても、空はなかなか暗くなりません。"],
      ["海南 · 7日間", "海風が荷物まで軽くする", "海口の騎楼、万寧の海岸、三亜のゆっくりした二日間を一つの島旅にまとめます。", "sanya", "/assets/real-sanya/sanya-edition-02-cc-by.jpg", "Luca", "イタリア · ミラノ", "Lucaの海南に残るのは、ビーチの数ではなく、時間が本当に遅くなった感覚です。朝食前の雨が上がり、水辺の椰子が光る。午後を埋めず、次の予定を海風に任せます。"],
      ["中国東北 · 7日間", "雪が降ると町は静かになる", "ハルビンの冬の光、ヤブリの雪線、雪郷の煙に、それぞれ一晩を残します。", "northeast", "/assets/real-northeast/china-snow-town-cc-by.jpg", "Elena", "スペイン · バルセロナ", "Elenaの夜は日帰り客が去ってから始まります。雪が屋根を柔らかくし、提灯が温かく灯る。路地で一番よく聞こえるのは足音で、次の移動を急がず暖かい部屋へ戻れます。"],
      ["西安 · 5日間", "城壁の下で夜が一歩遅くなる", "城壁、帝陵、盛唐の収蔵品にそれぞれ時間を置き、西安を歴史の一覧ではなく今の街として歩きます。", "xian", "/assets/real-xian/xian-city-wall-night.jpg", "Marcus", "イギリス · ロンドン", "Marcusの西安は夕食後に最も明るくなります。鐘楼は城壁の向こうで光り、自転車が夜を横切る。何百年もの時間が展示の説明ではなく、普通の夜に続く街の記憶になります。"],
      ["チベット · 8日間", "高原が呼吸をゆっくり教える", "ラサで二日間整えてから、ヤムドク湖、ギャンツェ、シガツェへ。天候と標高にも余白を残します。", "tibet", "/assets/real-tibet/tibet-yamdrok-lake.jpg", "Hana", "韓国 · ソウル", "Hanaの旅は峠からではなく、温かいお茶と短い散歩、ラサの静かな一日から始まります。ヤムドク湖の青には尺度がなく、彼女はゆっくり呼吸し、風景を写真より大きいままにしておきます。"],
    ],
  },
  ko: {
    eyebrow: "여행 기록",
    title: "개인 여행 한 주가 남기는 감각",
    intro: "사이트의 표준 루트를 바탕으로 쓴 여행 장면입니다. 등장인물은 편집용 페르소나이며 실제 고객 후기가 아닙니다.",
    link: "이 일정 보기",
    open: "여행자 시선 펼치기",
    persona: "에디토리얼 여행자",
    stories: [
      ["윈난 · 8일", "여덟 날 뒤에 남는 작은 장면", "쿤밍에서 천천히 시작하고 다리에서는 호수의 아침, 시저우의 손작업, 다음 장소를 서두르지 않는 오후를 지킵니다.", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg", "Aiko", "일본 · 도쿄", "Aiko의 장면은 얼하이의 아침에서 시작됩니다. 모든 풍경을 담으려 애쓰기보다 옅은 안개 뒤로 창산이 천천히 드러나는 시간을 기다립니다. 창가의 차가 조금 식어도 다음 일정은 그녀를 재촉하지 않습니다."],
      ["신장 · 9일", "긴 길을 재촉하지 않았던 여행", "우루무치에서 이리로 가는 거리도 여행의 일부입니다. 사이람호, 이닝의 밤, 나라티의 두 아침이 남습니다.", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg", "Daniel", "미국 · 시애틀", "Daniel이 상상한 신장은 거대한 풍경을 보여 주면서도 매일을 인내 시험으로 만들지 않습니다. 사이람호에서 차를 내린 순간의 고요, 그리고 서둘러 돌아갈 필요가 없어서 더 크게 보였던 하늘이 기억에 남습니다."],
      ["칭하이·간쑤 · 9일", "지평선이 계속 달라지는 길", "고원 호수와 소금호수, 고비와 오래된 관문을 시닝에서 장예까지 한 줄로 잇습니다.", "dunhuang", "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg", "Claire", "프랑스 · 리옹", "Claire의 장면은 칭하이호의 가느다란 푸른 선으로 시작해 장예의 겹친 색으로 끝납니다. 그 사이 고비는 창문을 스치는 바람과 긴 빛, 바로 말로 옮기지 않아도 되는 고요를 가르칩니다."],
      ["장자제 · 6일", "안개가 걷히기를 기다리는 아침", "봉우리 숲과 톈먼산, 푸룽진, 펑황을 다른 날에 두어 산과 옛 마을이 서로 경쟁하지 않게 합니다.", "zhangjiajie", "/assets/real-zhangjiajie/fenghuang-ancient-town.jpg", "Sophie", "호주 · 멜버른", "Sophie의 아침은 안개 속에서 시작됩니다. 돌기둥이 하나씩 나타났다가 다시 조용히 사라집니다. 펑황에 닿을 때 기억은 전망대 이름보다 젖은 잎, 높은 곳의 고요, 강을 따라 흐르는 저녁빛이 됩니다."],
      ["내몽골 · 6일", "초원에는 저녁빛이 오래 남는다", "후허하오터에서 후이텅시러와 쿠부치 사막으로, 도시의 지붕이 풀의 선과 바람, 모래언덕으로 바뀝니다.", "inner-mongolia", "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Mina", "싱가포르", "Mina의 장면에서 가장 중요한 시간은 초원의 마지막 한 시간입니다. 넓다는 것은 비어 있다는 뜻이라 생각했지만, 먼 가축 떼가 지평선을 건너고 바람이 방향을 바꾸는 동안 하늘은 좀처럼 어두워지지 않습니다."],
      ["하이난 · 7일", "바닷바람이 짐까지 가볍게 한다", "하이커우의 기루, 완닝 해안과 싼야의 느린 이틀을 한 번의 섬 여행으로 엮습니다.", "sanya", "/assets/real-sanya/sanya-edition-02-cc-by.jpg", "Luca", "이탈리아 · 밀라노", "Luca의 하이난에 남은 것은 해변 목록이 아니라 시간이 실제로 느려졌다는 감각입니다. 아침 식사 전 비가 그치고 물가의 야자수가 빛납니다. 오후를 비워 두면 다음 일은 바닷바람이 정합니다."],
      ["동북 · 7일", "눈이 내리면 마을은 조용해진다", "하얼빈의 겨울빛과 야부리의 설선, 설향의 굴뚝 연기에 각각 밤을 남깁니다.", "northeast", "/assets/real-northeast/china-snow-town-cc-by.jpg", "Elena", "스페인 · 바르셀로나", "Elena의 밤은 당일 방문객이 떠난 뒤 시작됩니다. 눈이 지붕을 부드럽게 덮고 등불이 따뜻해지면 골목에서 가장 선명한 소리는 발걸음뿐입니다. 추위도 진짜지만 다음 이동 없이 따뜻한 방으로 돌아가는 안도감도 진짜입니다."],
      ["시안 · 5일", "성벽 아래에서 밤이 한 걸음 느려진다", "성벽과 황릉, 성당 시대의 소장품에 온전한 시간을 두어 시안을 역사 목록이 아닌 살아 있는 도시로 만납니다.", "xian", "/assets/real-xian/xian-city-wall-night.jpg", "Marcus", "영국 · 런던", "Marcus의 시안은 저녁 식사 뒤 가장 환해집니다. 종루가 성벽 너머에서 빛나고 자전거가 어둠을 가릅니다. 수백 년의 시간은 전시 설명이 아니라 평범한 밤까지 이어지는 도시의 기억이 됩니다."],
      ["티베트 · 8일", "고원이 호흡을 천천히 가르친다", "라싸에서 이틀을 고른 뒤 얌드록초와 장쯔, 르카쩌로 향하며 날씨와 고도에도 여백을 둡니다.", "tibet", "/assets/real-tibet/tibet-yamdrok-lake.jpg", "Hana", "한국 · 서울", "Hana의 여정은 고개가 아니라 따뜻한 차와 짧은 산책, 라싸의 조용한 하루에서 시작됩니다. 얌드록초의 푸른빛은 크기를 가늠하기 어렵습니다. 그녀는 천천히 숨 쉬며 풍경을 사진보다 큰 채로 남겨 둡니다."],
    ],
  },
  th: {
    eyebrow: "บันทึกการเดินทาง",
    title: "หนึ่งสัปดาห์แบบส่วนตัวให้ความรู้สึกอย่างไร",
    intro: "เรื่องราวจำลองจากเส้นทางบนเว็บไซต์ ตัวละครเป็นบุคคลสมมติสำหรับงานบรรณาธิการ ไม่ใช่รีวิวจากลูกค้าจริง",
    link: "ดูเส้นทางนี้",
    open: "เปิดมุมมองของนักเดินทาง",
    persona: "นักเดินทางในเรื่อง",
    stories: [
      ["ยูนนาน · 8 วัน", "สิ่งที่จำได้คือช่วงเวลาเล็ก ๆ", "เริ่มอย่างนุ่มนวลที่คุนหมิง แล้วให้ต้าหลี่มีเช้าริมทะเลสาบ งานฝีมือที่ซีโจว และบ่ายที่ไม่ต้องรีบไปไหน", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg", "Aiko", "โตเกียว · ญี่ปุ่น", "เรื่องของ Aiko เริ่มในเช้าริมทะเลสาบเอ๋อร์ไห่ เธอไม่พยายามถ่ายทุกอย่าง เพียงรอให้ภูเขาชางซานค่อย ๆ ปรากฏหลังหมอกบาง ชาบนขอบหน้าต่างเย็นลงเล็กน้อย แต่ไม่มีตารางใดเร่งให้เธอลุกไป"],
      ["ซินเจียง · 9 วัน", "ถนนยาวไม่ใช่เวลาที่เสียไป", "ระยะทางจากอุรุมชีสู่อีหลีกลายเป็นส่วนหนึ่งของความทรงจำ ทั้งทะเลสาบไซหลี่มู่ คืนในอีหนิง และสองเช้าที่น่าลาถี", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg", "Daniel", "ซีแอตเทิล · สหรัฐอเมริกา", "ซินเจียงในเรื่องของ Daniel ยังมีภูมิประเทศกว้างใหญ่ที่เขาตามหา แต่ไม่เปลี่ยนทุกวันให้เป็นบททดสอบ เขาจำความเงียบหลังลงจากรถริมทะเลสาบ และท้องฟ้าที่ดูกว้างขึ้นเพราะไม่มีใครเร่งให้กลับ"],
      ["ชิงไห่–กานซู่ · 9 วัน", "เส้นขอบฟ้าที่เปลี่ยนไปเรื่อย ๆ", "ทะเลสาบบนที่สูง ทะเลสาบเกลือ โกบี และด่านโบราณเรียงเป็นเส้นทางเดียวจากซีหนิงถึงจางเย่", "dunhuang", "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg", "Claire", "ลียง · ฝรั่งเศส", "เรื่องของ Claire เริ่มจากเส้นสีน้ำเงินบาง ๆ ของทะเลสาบชิงไห่ และจบที่สีซ้อนชั้นของจางเย่ ระหว่างนั้นโกบีสอนให้เธอฟังลมข้างหน้าต่าง มองแสงยาว และอยู่กับความเงียบโดยไม่ต้องรีบอธิบาย"],
      ["จางเจียเจี้ย · 6 วัน", "รอให้หมอกค่อย ๆ เปิดทาง", "ป่าหินยอดเขา เทียนเหมินซาน ฝูหรงเจิ้น และเฟิ่งหวงอยู่คนละวัน เพื่อให้ภูเขากับเมืองเก่าไม่แย่งความสนใจ", "zhangjiajie", "/assets/real-zhangjiajie/fenghuang-ancient-town.jpg", "Sophie", "เมลเบิร์น · ออสเตรเลีย", "เช้าของ Sophie เริ่มในหมอก เสาหินปรากฏทีละต้นแล้วซ่อนกลับไป เมื่อถึงเฟิ่งหวง ความทรงจำไม่ใช่ชื่อจุดชมวิว แต่เป็นใบไม้เปียก ความเงียบเหนือพื้นดิน และแสงเย็นที่ไหลไปกับแม่น้ำ"],
      ["มองโกเลียใน · 6 วัน", "แสงเย็นอยู่บนทุ่งหญ้านานกว่าที่คิด", "จากฮูฮอตสู่ฮุยเถิงซีเล่อและทะเลทรายคูปู้ฉี หลังคาเมืองค่อย ๆ กลายเป็นเส้นหญ้า ลม และเนินทราย", "inner-mongolia", "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Mina", "สิงคโปร์", "ช่วงสำคัญที่สุดในเรื่องของ Mina คือหนึ่งชั่วโมงสุดท้ายบนทุ่งหญ้า เธอเคยคิดว่าความกว้างใหญ่คือความว่างเปล่า จนฝูงสัตว์ไกล ๆ เดินผ่านขอบฟ้า ลมเปลี่ยนทิศ และท้องฟ้ายังไม่ยอมมืด"],
      ["ไหหลำ · 7 วัน", "ลมทะเลทำให้สัมภาระเบาลง", "อาคารฉีโหลวในไหโข่ว ชายฝั่งว่านหนิง และสองวันช้า ๆ ที่ซานย่า รวมวัฒนธรรมเกาะกับการพักผ่อนไว้ในเส้นทางเดียว", "sanya", "/assets/real-sanya/sanya-edition-02-cc-by.jpg", "Luca", "มิลาน · อิตาลี", "ไหหลำในเรื่องของ Luca ไม่ได้เหลือเป็นรายชื่อชายหาด แต่เป็นความรู้สึกว่าเวลาช้าลงจริง ๆ ฝนหยุดก่อนอาหารเช้า ต้นปาล์มส่องแสงริมสระ และช่วงบ่ายว่างพอให้ลมทะเลเป็นคนตัดสินใจ"],
      ["ตะวันออกเฉียงเหนือ · 7 วัน", "เมื่อหิมะตก เมืองก็เงียบลง", "แสงฤดูหนาวของฮาร์บิน แนวหิมะที่ย่าปู้ลี่ และควันเหนือหมู่บ้านหิมะ ต่างมีค่ำคืนของตัวเอง", "northeast", "/assets/real-northeast/china-snow-town-cc-by.jpg", "Elena", "บาร์เซโลนา · สเปน", "ค่ำคืนของ Elena เริ่มหลังผู้มาเที่ยวรายวันกลับไปแล้ว หิมะทำให้หลังคาทุกหลังนุ่มลง โคมไฟค่อย ๆ อุ่นขึ้น และเสียงฝีเท้ากลายเป็นเสียงชัดที่สุดในตรอก ความหนาวมีจริง แต่ความสบายใจเมื่อกลับห้องอุ่นโดยไม่ต้องย้ายต่อก็จริงเช่นกัน"],
      ["ซีอาน · 5 วัน", "ค่ำคืนช้าลงใต้กำแพงเมือง", "กำแพงเมือง สุสานจักรพรรดิ และศิลปะยุคราชวงศ์ถังมีเวลาของตนเอง ทำให้ซีอานเป็นเมืองที่ยังมีชีวิต ไม่ใช่รายการประวัติศาสตร์", "xian", "/assets/real-xian/xian-city-wall-night.jpg", "Marcus", "ลอนดอน · สหราชอาณาจักร", "ซีอานในเรื่องของ Marcus สว่างที่สุดหลังอาหารเย็น หอระฆังเรืองแสงหลังกำแพง จักรยานผ่านความมืด และเวลาหลายร้อยปีก็ไม่ใช่คำอธิบายในพิพิธภัณฑ์ แต่เป็นสิ่งที่เมืองพกเข้าสู่ค่ำคืนธรรมดา"],
      ["ทิเบต · 8 วัน", "ที่ราบสูงสอนให้หายใจช้าลง", "เริ่มที่ลาซาสองวันก่อนเดินทางสู่ทะเลสาบยัมดร็อก เกียนเซ และชิกัตเซ โดยเผื่อพื้นที่ให้สภาพอากาศและระดับความสูง", "tibet", "/assets/real-tibet/tibet-yamdrok-lake.jpg", "Hana", "โซล · เกาหลีใต้", "เรื่องของ Hana ไม่ได้เริ่มที่ช่องเขา แต่เริ่มจากชาร้อน การเดินสั้น ๆ และวันเงียบ ๆ ในลาซา เมื่อถึงทะเลสาบยัมดร็อก สีน้ำเงินแทบไม่มีขนาด เธอจึงค่อย ๆ หายใจและปล่อยให้ภูมิทัศน์ใหญ่กว่าภาพถ่าย"],
    ],
  },
  ru: {
    eyebrow: "Дневники маршрутов",
    title: "Каким может быть частное путешествие",
    intro: "Это редакционные сценарии на основе опубликованных маршрутов. Персонажи вымышлены и не выдаются за отзывы реальных клиентов.",
    link: "Посмотреть маршрут",
    open: "Открыть взгляд путешественника",
    persona: "Редакционный персонаж",
    stories: [
      ["Юньнань · 8 дней", "После восьми дней остаются детали", "Куньмин мягко открывает поездку, а Дали оставляет место для рассвета у озера, ремесла в Сичжоу и свободного вечера.", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg", "Aiko", "Токио · Япония", "История Aiko начинается утром у озера Эрхай. Она не стремится снять всё сразу, а ждёт, пока горы Цаншань проявятся за лёгким туманом. Чай у окна успевает остыть, но следующий пункт не торопит её."],
      ["Синьцзян · 9 дней", "Дорогу не превращают в потерянное время", "Расстояние от Урумчи до долины Или становится частью памяти: Сайрам-Нур, ночь в Инине и два утра у Налати.", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg", "Daniel", "Сиэтл · США", "В истории Daniel остаётся масштаб Синьцзяна, но каждый день не превращается в испытание. Он помнит тишину после остановки у Сайрам-Нура и небо, которое кажется ещё шире, потому что никто не зовёт обратно в машину."],
      ["Цинхай–Ганьсу · 9 дней", "Горизонт всё время меняется", "Высокогорное озеро, солончак, Гоби и древние заставы складываются в одну линию от Синина до Чжанъе.", "dunhuang", "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg", "Claire", "Лион · Франция", "История Claire начинается тонкой синей линией озера Цинхай и заканчивается слоями цвета в Чжанъе. Между ними Гоби учит замечать ветер у окна, долгий свет и тишину, которую не нужно сразу превращать в слова."],
      ["Чжанцзяцзе · 6 дней", "Дождаться, пока рассеется туман", "Каменный лес, Тяньмэнь, Фужун и Фэнхуан получают отдельные дни, поэтому горы и старые города не спорят за внимание.", "zhangjiajie", "/assets/real-zhangjiajie/fenghuang-ancient-town.jpg", "Sophie", "Мельбурн · Австралия", "Утро Sophie начинается в тумане. Каменные башни появляются одна за другой и снова исчезают. К Фэнхуану память уже состоит не из названий площадок, а из мокрых листьев, тишины высоты и вечернего света на реке."],
      ["Внутренняя Монголия · 6 дней", "Вечерний свет долго остаётся в степи", "От Хух-Хото к Хуйтэн-Силэ и пустыне Кубуци: городские крыши постепенно сменяются линией трав, ветром и дюнами.", "inner-mongolia", "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Mina", "Сингапур", "Главным в истории Mina становится последний час в степи. Раньше ей казалось, что простор означает пустоту. Затем на горизонте проходит далёкое стадо, ветер меняет направление, а небо ещё долго не соглашается темнеть."],
      ["Хайнань · 7 дней", "Морской ветер облегчает даже багаж", "Аркады Хайкоу, побережье Ваньнина и два неспешных дня в Санье соединяют островную жизнь и мягкий курортный финал.", "sanya", "/assets/real-sanya/sanya-edition-02-cc-by.jpg", "Luca", "Милан · Италия", "Хайнань остаётся у Luca не списком пляжей, а ощущением, что время действительно замедлилось. Дождь закончился до завтрака, пальмы блестят у воды, а свободный день позволяет морскому ветру решить, что будет дальше."],
      ["Северо-Восток · 7 дней", "Когда идёт снег, город становится тише", "Зимний свет Харбина, снежная линия Ябули и дым над Снежной деревней получают собственные вечера.", "northeast", "/assets/real-northeast/china-snow-town-cc-by.jpg", "Elena", "Барселона · Испания", "Вечер Elena начинается после отъезда дневных гостей. Снег смягчает крыши, фонари становятся теплее, и шаги звучат громче всего. Холод настоящий, но не менее настоящее удовольствие — вернуться в тёплый номер без следующего переезда."],
      ["Сиань · 5 дней", "Под городской стеной ночь замедляется", "Стена, императорские мавзолеи и коллекции эпохи Тан получают достаточно времени, чтобы Сиань остался живым городом, а не списком дат.", "xian", "/assets/real-xian/xian-city-wall-night.jpg", "Marcus", "Лондон · Великобритания", "Сиань Marcus ярче всего после ужина. Колокольная башня светится за стеной, велосипеды пересекают темноту, и века перестают быть подписью в музее. История становится частью обычного городского вечера."],
      ["Тибет · 8 дней", "Высокогорье учит дышать медленнее", "Два спокойных дня в Лхасе предшествуют дороге к Ямдрок-Цо, Гьянце и Шигадзе; погода и высота получают честный запас времени.", "tibet", "/assets/real-tibet/tibet-yamdrok-lake.jpg", "Hana", "Сеул · Южная Корея", "История Hana начинается не на перевале, а с горячего чая, короткой прогулки и тихого дня в Лхасе. У Ямдрок-Цо синий цвет теряет масштаб; она дышит медленно и оставляет пейзаж больше любой фотографии."],
    ],
  },
};

const featureImages = {
  yunnan: "/assets/ai/bluehour-yunnan-luxury-dali-terrace.jpg",
  xinjiang: "/assets/ai/bluehour-xinjiang-luxury-lake-v1.jpg",
  dunhuang: "/assets/ai/bluehour-dunhuang-luxury-desert-v1.jpg",
  zhangjiajie: "/assets/real-zhangjiajie/tianzi-mountain-panorama.jpg",
};

const zhangjiajieFeature = {
  en: { label: "Zhangjiajie", title: "Mountains through the mist", body: "Peak forest, Tianmen Mountain, Furong and Fenghuang each receive their own light and their own day.", cta: "Enter Zhangjiajie" },
  zh: { label: "張家界", title: ["山霧散開", "峰林才現身"], body: "峰林、天門山、芙蓉鎮與鳳凰各有自己的光線；分開安排，山與古城不必搶同一天。", cta: "走進張家界" },
  ja: { label: "張家界", title: ["霧がほどけ", "峰林が現れる"], body: "峰林、天門山、芙蓉鎮、鳳凰を別の日に置き、山と古城それぞれの光を守ります。", cta: "張家界へ" },
  ko: { label: "장자제", title: ["안개가 걷히고", "봉우리 숲이 열린다"], body: "봉우리 숲과 톈먼산, 푸룽진, 펑황을 다른 날에 두어 산과 옛 마을의 시간을 지킵니다.", cta: "장자제로" },
  th: { label: "จางเจียเจี้ย", title: "เมื่อหมอกเปิดทางให้ภูเขา", body: "ป่าหินยอดเขา เทียนเหมินซาน ฝูหรงเจิ้น และเฟิ่งหวงถูกแยกวัน เพื่อให้แต่ละแห่งมีจังหวะของตัวเอง", cta: "เข้าสู่จางเจียเจี้ย" },
};

const qingganFeature = {
  en: { label: "Qinghai–Gansu", title: "Desert light, ancient doors", body: "Plateau lake, salt mirror, Gobi and old frontier towns form one clear grand loop through western China.", cta: "Enter Qinghai–Gansu" },
  zh: { label: "青甘大環線", title: ["高原湖泊", "接上戈壁長路"], body: "青海湖、鹽湖、戈壁與古老關城連成一條大環線，敦煌是其中重要的一站。", cta: "走進青甘" },
  ja: { label: "青海・甘粛", title: ["高原の湖から", "ゴビの道へ"], body: "青海湖、塩湖、ゴビ、古い関城を一つの大周遊ルートで結び、敦煌も大切な一地点として訪れます。", cta: "青海・甘粛へ" },
  ko: { label: "칭하이·간쑤", title: ["고원 호수에서", "고비의 길까지"], body: "칭하이호와 소금호수, 고비, 오래된 관문을 하나의 대환선으로 잇고 둔황은 그 안의 중요한 한 장면이 됩니다.", cta: "칭하이·간쑤로" },
  th: { label: "ชิงไห่–กานซู่", title: "จากทะเลสาบสูงสู่ทางโกบี", body: "ทะเลสาบชิงไห่ ทะเลสาบเกลือ โกบี และด่านโบราณเชื่อมเป็นเส้นทางวงใหญ่ โดยตุนหวงเป็นหนึ่งในจุดสำคัญ", cta: "เข้าสู่ชิงไห่–กานซู่" },
};

const russianFeatures = [
  { slug: "yunnan", label: "Юньнань", title: "Дворы, ветер и дальние горы", body: "Озеро Эрхай, старые дворы и дорога чайных караванов раскрываются без спешки.", cta: "Открыть Юньнань" },
  { slug: "xinjiang", label: "Синьцзян", title: "Дорога становится шире", body: "Сайрам-Нур, долина Или и Налати требуют честного времени и свободного горизонта.", cta: "Открыть Синьцзян" },
  { slug: "dunhuang", label: "Цинхай–Ганьсу", title: "Свет пустыни и древние ворота", body: "Высокогорное озеро, солончак, Гоби и старые заставы складываются в одну ясную линию.", cta: "Открыть маршрут" },
  { slug: "zhangjiajie", label: "Чжанцзяцзе", title: "Горы выходят из тумана", body: "Каменный лес, Тяньмэнь, Фужун и Фэнхуан получают отдельные дни и собственный свет.", cta: "Открыть Чжанцзяцзе" },
];

const localePaths = {
  en: { home: "/", stories: "/stories.html", interest: "/route-note/", route: (slug) => `/${slug}.html` },
  zh: { home: "/zh.html", stories: "/zh/stories/", interest: "/zh/interest/", route: (slug) => `/zh/${slug}/` },
  ja: { home: "/ja.html", stories: "/ja/stories/", interest: "/ja/interest/", route: (slug) => `/ja/${slug}/` },
  ko: { home: "/ko.html", stories: "/ko/stories/", interest: "/ko/interest/", route: (slug) => `/ko/${slug}/` },
  th: { home: "/th.html", stories: "/th/stories/", interest: "/th/interest/", route: (slug) => `/th/${slug}/` },
  ru: { home: "/ru.html", stories: "/ru/stories/", interest: "/ru/interest/", route: (slug) => `/ru/${slug}/` },
};

function featureTitle(title) {
  if (!Array.isArray(title)) return `<h2>${title}</h2>`;
  return `<h2 class="cjk-title">${title.map((line) => `<span class="title-line">${line}</span>`).join("")}</h2>`;
}

function featureCard(lang, feature) {
  return `<a class="story-card" href="${localePaths[lang].stories}#journal-${feature.slug}"><img loading="lazy" src="${featureImages[feature.slug]}" alt="${feature.label}"><div class="story-copy"><b>${feature.label}</b>${featureTitle(feature.title)}<p>${feature.body}</p><span>${feature.cta}</span></div></a>`;
}

function featuredStorySection(lang) {
  const cards = russianFeatures.map((feature) => featureCard(lang, feature)).join("");
  return `<section class="section" id="stories"><div class="wrap"><div class="story-grid">${cards}</div></div></section>`;
}

function normalizeFeaturedStories(html, lang) {
  const match = html.match(/<section class="section" id="stories">[\s\S]*?<\/section>/);
  if (!match) return html;
  let section = match[0].replace(/<a class="story-card" href="[^"]*\/(?:sanya|northeast)(?:\/|\.html)"[\s\S]*?<\/a>/g, "");
  section = section.replace(
    /<a class="story-card" href="[^"]*\/dunhuang(?:\/|\.html)"[\s\S]*?<\/a>/,
    featureCard(lang, { slug: "dunhuang", ...qingganFeature[lang] }),
  );
  if (!/href="[^"]*zhangjiajie/.test(section)) {
    section = section.replace(/<\/div><\/div><\/section>\s*$/, `${featureCard(lang, { slug: "zhangjiajie", ...zhangjiajieFeature[lang] })}</div></div></section>`);
  }
  for (const slug of ["yunnan", "xinjiang", "dunhuang", "zhangjiajie"]) {
    section = section.replace(
      new RegExp(`href="[^"]*(?:/${slug}/|/${slug}\\.html)"`),
      `href="${localePaths[lang].stories}#journal-${slug}"`,
    );
  }
  return html.replace(match[0], section);
}

function storySection(lang) {
  const locale = copy[lang];
  const links = localePaths[lang];
  const cards = locale.stories.map(([label, title, body, slug, image, traveller, origin, detail]) => `
      <article class="journey-journal-card" id="journal-${slug}">
        <figure><img loading="lazy" src="${image}" alt="${label}"></figure>
        <div class="journey-journal-copy"><p class="eyebrow">${label}</p><h3>${title}</h3><p>${body}</p><details class="journey-journal-details"><summary>${locale.open}</summary><div class="journey-journal-perspective"><p class="journal-traveller">${locale.persona} · ${traveller} · ${origin}</p><p>${detail}</p></div></details><a href="${links.route(slug)}">${locale.link}</a></div>
      </article>`).join("");
  return `<!-- journey-journals-start -->
    <section class="section journey-journals-band" id="journey-journals"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${locale.eyebrow}</p><h2>${locale.title}</h2></div><p>${locale.intro}</p></div><div class="journey-journal-grid">${cards}</div></div></section>
    <!-- journey-journals-end -->`;
}

for (const [lang, files] of Object.entries(storyFiles)) {
  for (const file of files) {
    const absolute = path.join(root, file);
    let html = await fs.readFile(absolute, "utf8");
    const section = storySection(lang);
    if (/<!-- journey-journals-start -->[\s\S]*?<!-- journey-journals-end -->/.test(html)) {
      html = html.replace(/<!-- journey-journals-start -->[\s\S]*?<!-- journey-journals-end -->/, section);
    } else {
      html = html.replace(/\s*<section class="next">/, `\n    ${section}\n    <section class="next">`);
    }
    if (lang === "zh") {
      html = html.replaceAll(
        "每個目的地都先用短短的故事打開，讓你判斷它是不是屬於你的下一次中國。",
        "用短短的故事打開每個目的地，先看它是否屬於你的下一次中國。",
      );
    }
    html = normalizeFeaturedStories(html, lang);
    html = html.replaceAll("20260712-story2", storyStyleVersion);
    html = html.replace('hreflang="ru" href="https://bluehourchina.com/ru.html"', 'hreflang="ru" href="https://bluehourchina.com/ru/stories/"');
    await fs.writeFile(absolute, html);
  }
}

function russianPage() {
  const locale = copy.ru;
  const links = localePaths.ru;
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><title>Истории путешествий | Bluehour China</title><meta name="description" content="Девять редакционных дневников частных маршрутов по Китаю: ритм, места и ощущения до отправки заявки."><link rel="canonical" href="https://bluehourchina.com/ru/stories/"><link rel="alternate" hreflang="en" href="https://bluehourchina.com/stories.html"><link rel="alternate" hreflang="zh-Hant" href="https://bluehourchina.com/zh/stories/"><link rel="alternate" hreflang="ja" href="https://bluehourchina.com/ja/stories/"><link rel="alternate" hreflang="ko" href="https://bluehourchina.com/ko/stories/"><link rel="alternate" hreflang="th" href="https://bluehourchina.com/th/stories/"><link rel="alternate" hreflang="ru" href="https://bluehourchina.com/ru/stories/"><link rel="alternate" hreflang="x-default" href="https://bluehourchina.com/stories.html"><link rel="icon" type="image/svg+xml" href="/assets/ruoqing-avatar.svg"><meta property="og:title" content="Истории путешествий | Bluehour China"><meta property="og:description" content="Почувствуйте ритм частного маршрута до отправки заявки."><meta property="og:type" content="website"><meta property="og:url" content="https://bluehourchina.com/ru/stories/"><meta property="og:image" content="https://bluehourchina.com/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg"><link rel="stylesheet" href="/assets/luxury-multilang.css?v=${storyStyleVersion}"><link rel="stylesheet" href="/assets/heading-polish.css?v=20260711-rhythm9"></head><body style="--hero-image:url('/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg')"><nav class="nav" aria-label="Основная навигация"><a class="brand" href="${links.home}"><img src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true"><span><strong>Bluehour China</strong><span>若青中國旅策</span></span></a><div class="nav-links"><a href="${links.home}#places">Маршруты</a><a href="${links.stories}">Истории</a><a href="/before-china/">Перед поездкой</a><a class="nav-cta" href="${links.interest}">Запросить маршрут</a></div></nav><main><section class="hero"><div class="wrap hero-inner"><p class="eyebrow">Истории путешествий</p><h1>Сначала почувствовать маршрут</h1><p class="lead">Короткие дневники показывают не только места, но и ритм частной поездки по Китаю.</p><div class="hero-actions"><a class="btn primary" href="#journey-journals">Читать истории</a><a class="btn" href="${links.interest}">Запросить маршрут</a></div></div></section>${featuredStorySection("ru")}${storySection("ru")}<section class="next"><div class="wrap"><p class="eyebrow">Начать спокойно</p><h2>Назовите даты, людей и желаемый ритм</h2><p>Мы ответим направлением маршрута и стартовой стоимостью.</p><div class="hero-actions"><a class="btn primary" href="${links.interest}">Запросить маршрут</a><a class="btn" href="${links.home}#places">Все маршруты</a></div></div></section></main><footer class="footer"><div class="wrap"><span>Bluehour China Journeys</span><span><a href="/credits.html">Источники изображений</a> · <a href="/privacy.html">Privacy</a></span></div></footer><a class="sticky-review" href="${links.interest}">Запросить маршрут</a><script src="/assets/language-menu.js" defer></script></body></html>`;
}

await fs.mkdir(path.join(root, "ru/stories"), { recursive: true });
await fs.writeFile(path.join(root, "ru/stories/index.html"), russianPage());

for (const file of ["ru.html", "ru/index.html", ...Object.values(routeFilesForRussian())]) {
  const absolute = path.join(root, file);
  try {
    let html = await fs.readFile(absolute, "utf8");
    if (!html.includes('href="/ru/stories/"')) {
      html = html.replace(/(<a href="\/ru\.html#care">[^<]+<\/a>)/, `$1<a href="/ru/stories/">Истории</a>`);
    }
    await fs.writeFile(absolute, html);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function routeFilesForRussian() {
  return {
    yunnan: "ru/yunnan/index.html",
    xinjiang: "ru/xinjiang/index.html",
    dunhuang: "ru/dunhuang/index.html",
    sanya: "ru/sanya/index.html",
    northeast: "ru/northeast/index.html",
    innerMongolia: "ru/inner-mongolia/index.html",
  };
}

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = await fs.readFile(sitemapPath, "utf8");
if (!sitemap.includes("https://bluehourchina.com/ru/stories/")) {
  sitemap = sitemap.replace("</urlset>", "  <url><loc>https://bluehourchina.com/ru/stories/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>");
  await fs.writeFile(sitemapPath, sitemap);
}

await import("./normalize-navigation-continuity.mjs");
await import("./bump-style-cache.mjs");

console.log("Added multilingual journey journals and a Russian stories page.");
