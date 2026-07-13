import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const homeFiles = [
  "index.html", "en.html", "en/index.html", "zh.html", "zh/index.html", "ja.html", "ja/index.html",
  "ko.html", "ko/index.html", "th.html", "th/index.html", "ru.html", "ru/index.html",
];
const expectedSlugs = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet", "zhangjiajie"];
const expectedStopCounts = { yunnan: 5, xinjiang: 6, dunhuang: 7, "inner-mongolia": 4, sanya: 5, northeast: 4, xian: 3, tibet: 5, zhangjiajie: 5 };
const expectedPrices = { yunnan: "RMB 5,680", xinjiang: "RMB 14,800", dunhuang: "RMB 5,980", "inner-mongolia": "RMB 9,500", sanya: "RMB 14,200", northeast: "RMB 16,700", xian: "RMB 6,800", tibet: "RMB 18,800", zhangjiajie: "RMB 7,980" };
const expectedRoutePhotos = {
  yunnan: "/assets/real-yunnan/erhai-cangshan-editorial-web.jpg",
  xinjiang: "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg",
  dunhuang: "/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg",
  "inner-mongolia": "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg",
  sanya: "/assets/real-sanya/haitang-bay-cc-by-sa.jpg",
  northeast: "/assets/real-northeast/china-snow-town-cc-by.jpg",
  xian: "/assets/real-xian/xian-city-wall-night.jpg",
  tibet: "/assets/real-tibet/tibet-yamdrok-lake.jpg",
  zhangjiajie: "/assets/real-zhangjiajie/tianzi-mountain-panorama.jpg",
};

const findings = [];
let routeCount = 0;

for (const file of homeFiles) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  const section = html.match(/<!-- destination-map-start -->([\s\S]*?)<!-- destination-map-end -->/)?.[1] || "";
  if (!section) {
    findings.push(`${file}: illustrated map section missing`);
    continue;
  }
  if (/leaflet|openstreetmap|tileLayer|window\.L/i.test(html)) findings.push(`${file}: legacy map library or labelled tile source remains`);
  if (!html.includes("luxury-multilang.css?v=20260713-folio2")) findings.push(`${file}: illustrated map CSS cache version missing`);
  if (!section.includes("destination-map-legend") || !section.includes("data-map-stops")) findings.push(`${file}: route legend missing`);
  if (!section.includes("data-map-reset")) findings.push(`${file}: all-China reset control missing`);
  if (/aria-label="(?:China destination map|Destination choices)"/.test(section)) findings.push(`${file}: hard-coded English map label remains`);

  const jsonText = section.match(/<script type="application\/json">([\s\S]*?)<\/script>/)?.[1];
  if (!jsonText) {
    findings.push(`${file}: map data missing`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(jsonText);
  } catch (error) {
    findings.push(`${file}: map data is invalid JSON (${error.message})`);
    continue;
  }
  if (!data.mapAria?.trim()) findings.push(`${file}: localized map accessible name missing`);
  if (!Array.isArray(data.routes) || data.routes.length !== expectedSlugs.length) {
    findings.push(`${file}: expected ${expectedSlugs.length} map routes, found ${data.routes?.length ?? 0}`);
    continue;
  }

  const slugs = data.routes.map((route) => route.slug);
  if (slugs.join("|") !== expectedSlugs.join("|")) findings.push(`${file}: route order or destinations differ`);
  for (const route of data.routes) {
    routeCount += 1;
    if (route.price !== expectedPrices[route.slug]) findings.push(`${file}: ${route.slug} price ${route.price} does not match ${expectedPrices[route.slug]}`);
    if (!Array.isArray(route.stops) || route.stops.length !== expectedStopCounts[route.slug]) {
      findings.push(`${file}: ${route.slug} expected ${expectedStopCounts[route.slug]} stops, found ${route.stops?.length ?? 0}`);
      continue;
    }
    for (const [index, stop] of route.stops.entries()) {
      if (!stop.label?.trim() || !Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) {
        findings.push(`${file}: ${route.slug} stop ${index + 1} is incomplete`);
      }
    }
    const routeText = route.stops.map((stop) => stop.label).join(" → ");
    if (route.route !== routeText) findings.push(`${file}: ${route.slug} route text is not synchronized with its drawn stops`);
  }

  const yunnan = data.routes.find((route) => route.slug === "yunnan");
  if (yunnan) {
    const first = yunnan.stops[0];
    const last = yunnan.stops.at(-1);
    if (first.label !== last.label || first.lat !== last.lat || first.lng !== last.lng) findings.push(`${file}: Yunnan route is not a closed Kunming loop`);
  }
}

const script = await fs.readFile(path.join(root, "assets/destination-map.js"), "utf8");
if (/window\.L|tileLayer|openstreetmap|leaflet/i.test(script)) findings.push("assets/destination-map.js: legacy map implementation remains");
for (const marker of ["illustrated-map-land", "data-map-route-layer", "data-map-destination-layer", "route-atlas-photo", "is-route-focused"]) {
  if (!script.includes(marker)) findings.push(`assets/destination-map.js: missing ${marker}`);
}
for (const [slug, photo] of Object.entries(expectedRoutePhotos)) {
  if (!script.includes(photo)) findings.push(`assets/destination-map.js: ${slug} route photo mapping missing`);
  try {
    await fs.access(path.join(root, photo.slice(1)));
  } catch {
    findings.push(`${photo}: route photo asset missing`);
  }
}

if (findings.length) {
  console.error(`Illustrated destination map audit failed with ${findings.length} issue(s):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Illustrated destination map audit passed: ${homeFiles.length} home pages, ${routeCount} localized route records, ${expectedSlugs.length} destinations, 0 labelled map tiles, 0 route-data gaps.`);
