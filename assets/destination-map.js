(() => {
  const root = document.querySelector("[data-destination-map]");
  if (!root) return;

  const mapNode = root.querySelector("[data-map-canvas]");
  const dataNode = root.querySelector("script[type='application/json']");
  const buttons = [...root.querySelectorAll("[data-map-destination]")];
  const stopList = root.querySelector("[data-map-stops]");
  if (!mapNode || !dataNode) return;

  let data;
  try {
    data = JSON.parse(dataNode.textContent || "{}");
  } catch {
    root.classList.add("map-data-failed");
    return;
  }

  const routes = Array.isArray(data.routes) ? data.routes : [];
  const routeBySlug = new Map(routes.map((route) => [route.slug, route]));
  const nameNode = root.querySelector("[data-map-name]");
  const durationNode = root.querySelector("[data-map-duration]");
  const priceNode = root.querySelector("[data-map-price]");
  const routeNode = root.querySelector("[data-map-route]");
  const linkNode = root.querySelector("[data-map-link]");
  const resetButton = root.querySelector("[data-map-reset]");

  const fullViewBox = { x: 35, y: 35, width: 930, height: 545 };
  // Simplified public-domain outline derived from Natural Earth 1:110m data.
  const outlinePath = "M570.3,562.0L558.7,558.4L558.3,548.4L565.3,543.2L580.7,539.9L588.8,540.2L592.0,544.6L585.8,549.7L582.5,556.4L570.3,562.0ZM157.6,251.8L156.4,243.4L166.1,239.5L153.4,213.0L181.4,206.8L188.6,203.3L198.8,174.9L226.8,180.2L234.7,172.9L235.4,156.5L247.1,154.9L257.9,143.8L263.4,142.5L267.1,154.1L279.0,162.8L299.1,169.0L308.9,182.0L303.4,200.5L308.5,207.3L325.3,209.9L344.3,212.1L361.4,221.7L370.1,223.4L376.6,237.4L384.9,246.3L400.4,245.9L429.6,249.2L448.4,247.2L462.3,249.4L483.2,258.4L500.3,258.4L506.6,262.9L523.0,255.0L545.8,249.9L567.0,249.3L583.5,244.1L593.7,236.0L603.5,231.0L601.3,225.9L596.7,220.1L604.2,210.1L612.1,211.5L626.6,214.7L640.7,206.4L662.2,200.4L672.6,189.9L682.5,185.4L703.1,183.3L714.2,185.1L715.8,179.4L703.0,168.1L691.6,162.9L680.8,168.9L666.8,166.4L658.8,168.4L655.2,161.7L665.2,145.2L672.0,132.5L689.0,138.9L708.9,128.1L708.8,120.6L721.5,102.1L729.4,96.4L729.2,86.5L721.5,82.2L733.1,73.2L750.7,69.9L769.4,69.4L790.6,74.8L803.0,81.5L811.7,99.6L817.0,107.2L821.9,117.9L827.1,134.7L851.7,140.1L868.5,151.9L874.2,167.4L895.7,167.4L907.9,161.0L931.2,156.1L923.8,170.8L918.3,176.8L913.5,194.2L904.0,209.5L886.8,206.7L874.7,212.2L878.4,225.4L876.4,243.2L869.2,243.6L869.3,251.2L860.2,242.4L854.5,250.7L832.7,257.1L834.9,264.8L822.7,264.3L816.0,259.7L806.3,270.1L790.7,277.9L779.2,287.1L759.5,291.2L749.1,297.8L733.9,301.7L741.4,295.1L738.4,289.6L749.6,280.0L742.1,272.4L729.8,277.5L713.9,287.5L705.2,296.7L691.3,297.3L684.1,303.9L691.6,313.4L703.1,315.6L703.6,321.8L714.8,325.9L730.6,316.0L743.1,321.4L752.3,321.8L754.6,329.0L734.6,332.8L728.0,340.1L714.2,346.9L707.0,356.3L722.2,363.6L727.7,376.6L736.3,388.5L745.9,398.5L745.7,408.0L736.8,411.5L740.2,418.2L748.5,422.2L746.4,432.4L742.8,442.3L734.9,443.4L724.6,456.8L713.1,472.8L700.0,487.3L680.6,498.3L660.9,508.4L645.0,509.7L636.4,515.0L631.5,511.1L623.5,517.0L603.7,522.9L588.8,524.7L584.0,537.1L576.1,537.8L572.4,529.3L575.8,524.8L556.8,521.0L550.2,522.9L535.9,519.8L529.2,515.0L531.4,508.2L518.5,506.0L511.7,501.6L499.7,507.9L485.9,509.3L474.7,509.2L467.1,512.1L459.8,513.9L461.9,527.4L454.4,527.0L453.1,524.3L452.7,519.4L442.3,522.8L436.2,520.7L425.7,516.2L429.8,506.4L420.9,504.1L417.5,493.1L402.6,495.1L404.3,480.8L417.7,470.7L418.2,460.6L417.8,451.2L411.7,448.2L406.9,440.9L398.7,441.8L383.4,440.0L388.2,434.7L381.6,426.9L371.5,432.2L359.7,429.1L343.4,437.1L330.5,446.4L319.1,447.9L312.9,444.6L305.5,444.3L295.4,441.4L287.8,444.6L278.4,453.7L277.2,444.0L268.6,446.6L252.1,445.4L236.2,442.6L224.7,437.1L213.7,434.6L209.0,428.6L201.0,426.8L186.8,418.6L175.4,414.7L169.6,417.7L150.0,408.8L136.1,400.7L132.1,386.5L142.3,388.2L142.7,381.6L137.1,374.9L138.5,364.1L123.3,348.5L100.1,343.0L95.9,332.6L85.5,326.2L83.0,322.2L80.9,314.4L81.3,308.9L72.8,305.8L68.1,307.2L64.5,294.1L68.6,290.9L66.6,287.5L80.1,280.8L89.9,278.0L104.8,279.9L110.2,270.7L128.3,268.9L133.3,263.1L155.6,255.2L157.6,251.8Z";

  const markerOffsets = {
    yunnan: [20, 31], xinjiang: [22, -20], dunhuang: [22, -20], "inner-mongolia": [24, -20],
    sanya: [22, 30], northeast: [-22, -20], xian: [22, 28], tibet: [-22, 30],
    zhangjiajie: [22, -20],
  };

  const iconPaths = {
    yunnan: '<circle cx="-5" cy="0" r="3"/><circle cx="5" cy="0" r="3"/><circle cx="0" cy="-5" r="3"/><circle cx="0" cy="5" r="3"/>',
    xinjiang: '<path d="M-8 6L-2-5l4 7 3-5 6 9z"/>',
    dunhuang: '<path d="M-9 5c5-8 10-8 18 0M-7 8c4-5 8-5 14 0"/>',
    "inner-mongolia": '<path d="M-7 7V0M0 7V-5M7 7V1M-10 7h20"/>',
    sanya: '<path d="M-10 1c4-4 7-4 11 0s7 4 11 0M-10 7c4-4 7-4 11 0s7 4 11 0"/>',
    northeast: '<path d="M0-9V9M-8-5L8 5M8-5L-8 5"/>',
    xian: '<path d="M-9-2h18M-7-2v9M7-2v9M-10 7h20M-6-6h12l3 4H-9z"/>',
    tibet: '<path d="M-10 7L-3-5l4 7 3-4 7 9z"/><circle cx="7" cy="-6" r="2"/>',
    zhangjiajie: '<path d="M-10 7L-6-4l4 7 3-8 3 6 2-4 5 10z"/>',
  };

  const escapeMarkup = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const mercatorY = (latitude) => Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));
  const minMercator = mercatorY(17.5);
  const maxMercator = mercatorY(54.5);
  function project(latitude, longitude) {
    return {
      x: 55 + (longitude - 73) / (136 - 73) * 890,
      y: 570 - (mercatorY(latitude) - minMercator) / (maxMercator - minMercator) * 520,
    };
  }

  mapNode.innerHTML = `<svg class="destination-map-svg" viewBox="${fullViewBox.x} ${fullViewBox.y} ${fullViewBox.width} ${fullViewBox.height}" role="group" aria-label="${escapeMarkup(data.mapAria || "Illustrated China journey map")}">
    <defs>
      <filter id="atlas-paper-shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#173e35" flood-opacity=".12"/>
      </filter>
      <pattern id="atlas-speckle" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="4" r=".8" fill="#173e35" opacity=".08"/>
        <circle cx="14" cy="12" r=".6" fill="#c48f3e" opacity=".09"/>
      </pattern>
      <clipPath id="route-atlas-clip">
        <rect x="48" y="42" width="904" height="516" rx="28"/>
      </clipPath>
      <linearGradient id="route-atlas-shade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#061713" stop-opacity=".68"/>
        <stop offset=".48" stop-color="#0b211c" stop-opacity=".42"/>
        <stop offset="1" stop-color="#071611" stop-opacity=".78"/>
      </linearGradient>
    </defs>
    <rect class="illustrated-map-paper" x="0" y="0" width="1000" height="620"/>
    <g class="map-overview-layer" data-map-overview-layer>
      <path class="illustrated-map-sea-line" d="M744 510c42-18 73-13 112 8s72 25 112 5M758 538c33-13 63-8 96 9s62 18 96 5"/>
      <path class="illustrated-map-land" d="${outlinePath}"/>
      <path class="illustrated-map-texture" d="${outlinePath}"/>
      <g class="illustrated-map-landmarks" aria-hidden="true">
        <path class="map-mountain" d="M116 335l33-54 27 43 22-31 33 50M175 405l25-39 20 31 16-23 27 38"/>
        <path class="map-dune" d="M222 239c30-25 64-25 101 0M249 257c24-18 49-18 76 0"/>
        <path class="map-grass" d="M574 211v-19m0 19l-11-12m11 12l12-13m22 24v-17m0 17l-9-10m9 10l10-11"/>
        <path class="map-snow" d="M820 132v30m-13-23l26 16m0-16l-26 16"/>
        <path class="map-river" d="M531 279c29 28 48 65 41 101s13 72 54 102"/>
        <path class="map-wave" d="M543 578c8-7 16-7 24 0s16 7 24 0"/>
      </g>
      <g data-map-destination-layer></g>
    </g>
    <g class="route-atlas-layer" data-map-focus-layer aria-hidden="true">
      <rect class="route-atlas-card" x="48" y="42" width="904" height="516" rx="28" filter="url(#atlas-paper-shadow)"/>
      <g data-map-scenery-layer aria-hidden="true"></g>
      <rect class="route-atlas-photo-shade" x="48" y="42" width="904" height="516" rx="28"/>
      <rect class="route-atlas-frame" x="48" y="42" width="904" height="516" rx="28"/>
      <g data-map-route-layer></g>
    </g>
  </svg>`;

  const svg = mapNode.querySelector("svg");
  const routeLayer = mapNode.querySelector("[data-map-route-layer]");
  const destinationLayer = mapNode.querySelector("[data-map-destination-layer]");
  const sceneryLayer = mapNode.querySelector("[data-map-scenery-layer]");
  const overviewLayer = mapNode.querySelector("[data-map-overview-layer]");
  const focusLayer = mapNode.querySelector("[data-map-focus-layer]");

  for (const route of routes) {
    const point = project(route.lat, route.lng);
    const [labelX, labelY] = markerOffsets[route.slug] || [20, -18];
    destinationLayer.insertAdjacentHTML("beforeend", `<g class="map-destination" data-map-marker="${escapeMarkup(route.slug)}" role="button" tabindex="0" aria-label="${escapeMarkup(route.name)}" transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})">
      <circle class="map-destination-halo" r="19"/>
      <circle class="map-destination-pin" r="15"/>
      <g class="map-destination-icon">${iconPaths[route.slug] || ""}</g>
      <text class="map-destination-label" x="${labelX}" y="${labelY}" text-anchor="${labelX < 0 ? "end" : "start"}">${escapeMarkup(route.name)}</text>
    </g>`);
  }

  const markers = [...destinationLayer.querySelectorAll("[data-map-marker]")];

  function setViewBox(box) {
    svg.setAttribute("viewBox", `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`);
  }

  function routePoints(count) {
    const total = Math.max(1, count);
    const startX = 132;
    const endX = 868;
    const yPattern = [352, 238, 338, 206, 322, 224, 354, 246];
    return Array.from({ length: total }, (_, index) => ({
      x: total === 1 ? 500 : startX + (endX - startX) * index / (total - 1),
      y: yPattern[index % yPattern.length],
    }));
  }

  function smoothRoutePath(points) {
    if (!points.length) return "";
    if (points.length === 1) return `M${points[0].x},${points[0].y}`;
    let path = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const previous = points[index - 1] || points[index];
      const current = points[index];
      const next = points[index + 1];
      const after = points[index + 2] || next;
      const firstControl = {
        x: current.x + (next.x - previous.x) / 6,
        y: current.y + (next.y - previous.y) / 6,
      };
      const secondControl = {
        x: next.x - (after.x - current.x) / 6,
        y: next.y - (after.y - current.y) / 6,
      };
      path += `C${firstControl.x.toFixed(1)},${firstControl.y.toFixed(1)} ${secondControl.x.toFixed(1)},${secondControl.y.toFixed(1)} ${next.x.toFixed(1)},${next.y.toFixed(1)}`;
    }
    return path;
  }

  const sceneryBySlug = {
    yunnan: `<circle class="atlas-sun" cx="825" cy="132" r="44"/><path class="atlas-mountain-fill" d="M52 390L190 176l78 112 59-79 116 181z"/><path class="atlas-mountain-line" d="M52 390L190 176l78 112 59-79 116 181"/><path class="atlas-water" d="M566 448c70-42 173-40 280 2s77 79-23 73H595c-91-2-102-38-29-75z"/><path class="atlas-roof" d="M676 420h132m-111 0v55m90-55v55m-107-55l61-46 78 46m-120 18h87"/><g class="atlas-blossom"><circle cx="119" cy="458" r="11"/><circle cx="143" cy="474" r="8"/><circle cx="164" cy="449" r="7"/></g>`,
    xinjiang: `<circle class="atlas-sun" cx="822" cy="128" r="48"/><path class="atlas-mountain-fill" d="M50 398L169 202l67 88 83-125 78 121 61-72 93 184z"/><path class="atlas-mountain-line" d="M50 398L169 202l67 88 83-125 78 121 61-72 93 184"/><path class="atlas-water" d="M491 438c86-39 218-35 333 12s75 73-35 72H545c-106-2-139-44-54-84z"/><path class="atlas-meadow" d="M83 477c91-36 181-34 269 6M109 502c83-25 161-22 234 8"/>`,
    dunhuang: `<circle class="atlas-moon" cx="807" cy="132" r="48"/><path class="atlas-dune-fill" d="M48 458c117-107 244-97 367 0 118-92 255-101 407 0 47 28 92 45 134 51H48z"/><path class="atlas-dune-line" d="M48 458c117-107 244-97 367 0 118-92 255-101 407 0"/><path class="atlas-gate" d="M132 395V258h112v137m-132 0h153m-116-137l39-47 41 47m-62 73h42"/>`,
    "inner-mongolia": `<circle class="atlas-sun" cx="810" cy="128" r="48"/><path class="atlas-grass-fill" d="M48 420c139-66 269-43 388 4 139 55 281 65 516-3v137H48z"/><path class="atlas-meadow" d="M48 423c139-66 269-43 388 4 139 55 281 65 516-3M67 482c133-39 264-29 391 12"/><path class="atlas-yurt" d="M699 432c4-71 126-71 132 0m-148 0h164m-132 0v60m98-60v60m-113-79h131"/>`,
    sanya: `<circle class="atlas-sun" cx="807" cy="130" r="54"/><path class="atlas-island" d="M69 410c95-53 180-44 247 17 84 77 190 65 302 3 107-60 216-59 337 11v117H48V430z"/><path class="atlas-water-line" d="M48 454c77-39 151-39 223 0s148 39 226 0 154-39 229 0 151 39 229 0M48 494c77-39 151-39 223 0s148 39 226 0 154-39 229 0 151 39 229 0"/><path class="atlas-palm" d="M198 417c17-80 23-135 17-210m0 2c-47-22-74-20-95 0m95 0c37-38 75-45 114-22m-114 22c-7-46-27-76-60-91m60 91c26-42 54-62 88-58"/>`,
    northeast: `<circle class="atlas-winter-sun" cx="810" cy="128" r="45"/><path class="atlas-snow-fill" d="M48 423l126-215 73 103 75-138 94 155 59-91 118 186z"/><path class="atlas-mountain-line" d="M48 423l126-215 73 103 75-138 94 155 59-91 118 186"/><path class="atlas-pine" d="M720 458l42-102h-26l37-79 39 79h-27l43 102m-55-1v53"/><path class="atlas-snow-line" d="M73 489c91-27 177-22 259 14m253-19c114-31 221-25 321 18"/>`,
    xian: `<circle class="atlas-sun" cx="821" cy="126" r="44"/><path class="atlas-hill-fill" d="M48 434c164-111 316-102 456 0 135 98 277 98 448-7v131H48z"/><path class="atlas-city-wall" d="M128 449V298h238v151m-270 0h302m-244-151l93-75 94 75m-149 52h110m-55-127v-46"/>`,
    tibet: `<circle class="atlas-sun" cx="816" cy="126" r="48"/><path class="atlas-mountain-fill" d="M48 428L183 178l73 118 74-151 103 172 77-111 138 222z"/><path class="atlas-mountain-line" d="M48 428L183 178l73 118 74-151 103 172 77-111 138 222"/><path class="atlas-water" d="M570 455c74-35 169-31 266 9s58 65-35 64H621c-84-1-119-40-51-73z"/><path class="atlas-flags" d="M662 228l210 54m-184-47v58m45-46v58m44-47v58m45-47v58"/>`,
    zhangjiajie: `<circle class="atlas-sun" cx="816" cy="128" r="43"/><path class="atlas-pillar-fill" d="M62 470l55-233 52 22 45-127 48 132 53-91 48 166 58-212 51 174 54-92 52 261z"/><path class="atlas-pillar-line" d="M62 470l55-233 52 22 45-127 48 132 53-91 48 166 58-212 51 174 54-92 52 261"/><path class="atlas-cloud" d="M86 384c44-37 83-29 116 8 38-25 78-18 117 20M486 390c52-41 105-35 158 18 43-31 86-26 128 14"/>`,
  };

  const photoBySlug = {
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

  function drawRoute(route) {
    const stops = Array.isArray(route.stops) ? route.stops : [];
    if (!stops.length) {
      routeLayer.innerHTML = "";
      if (sceneryLayer) sceneryLayer.innerHTML = "";
      if (stopList) stopList.innerHTML = "";
      return;
    }
    const points = routePoints(stops.length);
    const routePath = smoothRoutePath(points);
    const nodes = points.map((point, index) => {
      const labelAbove = index % 2 === 1;
      const labelY = labelAbove ? point.y - 78 : point.y + 28;
      return `<g class="map-route-stop" transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})"><circle r="17"/><text y="5.5" text-anchor="middle">${index + 1}</text></g><foreignObject class="map-route-label-object" x="${(point.x - 70).toFixed(1)}" y="${labelY.toFixed(1)}" width="140" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="map-route-label">${escapeMarkup(stops[index].label)}</div></foreignObject>`;
    }).join("");
    if (sceneryLayer) {
      const photo = photoBySlug[route.slug] || photoBySlug.yunnan;
      sceneryLayer.innerHTML = `<image class="route-atlas-photo" href="${escapeMarkup(photo)}" x="48" y="42" width="904" height="516" preserveAspectRatio="xMidYMid slice" clip-path="url(#route-atlas-clip)"/>`;
    }
    routeLayer.innerHTML = `<path class="map-route-shadow" d="${routePath}"/><path class="map-route-line" d="${routePath}"/>${nodes}`;
    if (stopList) {
      stopList.innerHTML = stops.map((stop, index) => `<li><b>${index + 1}</b><span>${escapeMarkup(stop.label)}</span></li>`).join("");
    }
  }

  function activate(slug, focus = true) {
    const route = routeBySlug.get(slug);
    if (!route) return;
    if (nameNode) nameNode.textContent = route.name;
    if (durationNode) durationNode.textContent = route.duration;
    if (priceNode) priceNode.textContent = route.price;
    if (routeNode) routeNode.textContent = route.route;
    if (linkNode) linkNode.href = route.href;
    for (const button of buttons) {
      const active = button.dataset.mapDestination === slug;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    for (const marker of markers) marker.classList.toggle("is-active", marker.dataset.mapMarker === slug);
    for (const className of [...root.classList]) {
      if (className.startsWith("map-theme-")) root.classList.remove(className);
    }
    root.classList.add(`map-theme-${slug}`);
    drawRoute(route);
    if (focus && route.stops?.length) {
      root.classList.add("is-route-focused");
      overviewLayer?.setAttribute("aria-hidden", "true");
      focusLayer?.setAttribute("aria-hidden", "false");
      setViewBox(fullViewBox);
    }
  }

  for (const button of buttons) {
    button.addEventListener("click", () => activate(button.dataset.mapDestination, true));
  }
  for (const marker of markers) {
    const choose = () => activate(marker.dataset.mapMarker, true);
    marker.addEventListener("click", choose);
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose();
      }
    });
  }
  resetButton?.addEventListener("click", () => {
    root.classList.remove("is-route-focused");
    overviewLayer?.setAttribute("aria-hidden", "false");
    focusLayer?.setAttribute("aria-hidden", "true");
    setViewBox(fullViewBox);
  });

  activate(data.default || routes[0]?.slug, true);
})();
