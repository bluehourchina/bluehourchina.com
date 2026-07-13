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
    sanya: [22, 30], northeast: [-22, -20], xian: [-24, -24], tibet: [-22, 30],
    zhangjiajie: [24, 34],
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
        <rect x="760" y="42" width="192" height="516"/>
      </clipPath>
      <linearGradient id="route-atlas-shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#071611" stop-opacity=".08"/>
        <stop offset=".58" stop-color="#071611" stop-opacity=".14"/>
        <stop offset="1" stop-color="#071611" stop-opacity=".56"/>
      </linearGradient>
    </defs>
    <rect class="illustrated-map-paper" x="0" y="0" width="1000" height="620"/>
    <g class="map-overview-layer" data-map-overview-layer>
      <path class="illustrated-map-sea-line" d="M744 510c42-18 73-13 112 8s72 25 112 5M758 538c33-13 63-8 96 9s62 18 96 5"/>
      <path class="illustrated-map-land" d="${outlinePath}"/>
      <path class="illustrated-map-texture" d="${outlinePath}"/>
      <g data-map-destination-layer></g>
    </g>
    <g class="route-atlas-layer" data-map-focus-layer aria-hidden="true">
      <rect class="route-atlas-card" x="48" y="42" width="904" height="516" filter="url(#atlas-paper-shadow)"/>
      <rect class="route-map-paper" x="48" y="42" width="712" height="516"/>
      <g class="route-map-grid" aria-hidden="true">
        <path d="M118 42v516M208 42v516M298 42v516M388 42v516M478 42v516M568 42v516M658 42v516"/>
        <path d="M48 126h712M48 210h712M48 294h712M48 378h712M48 462h712"/>
      </g>
      <g class="route-map-contours" aria-hidden="true">
        <path d="M42 171c92-61 151-51 215 7s142 62 224 9 161-46 294 24"/>
        <path d="M35 201c98-62 164-51 229 6s137 64 220 12 170-44 299 27"/>
        <path d="M42 431c96-51 179-44 246 8s144 52 218 5 147-48 272 13"/>
        <path d="M31 462c105-50 190-42 256 7s137 52 211 8 155-43 283 13"/>
      </g>
      <g data-map-scenery-layer aria-hidden="true"></g>
      <rect class="route-atlas-photo-shade" x="760" y="42" width="192" height="516"/>
      <line class="route-photo-divider" x1="760" y1="42" x2="760" y2="558"/>
      <g class="route-map-north" transform="translate(706 92)" aria-hidden="true">
        <text text-anchor="middle">N</text><path d="M0 11V39M0 11l-6 10M0 11l6 10"/>
      </g>
      <rect class="route-atlas-frame" x="48" y="42" width="904" height="516"/>
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
    const photo = photoBySlug[route.slug] || photoBySlug.yunnan;
    const clipId = `destination-photo-${route.slug.replace(/[^a-z0-9-]/g, "-")}`;
    destinationLayer.insertAdjacentHTML("beforeend", `<g class="map-destination" data-map-marker="${escapeMarkup(route.slug)}" role="button" tabindex="0" aria-label="${escapeMarkup(route.name)}" transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})">
      <defs><clipPath id="${clipId}"><circle r="17"/></clipPath></defs>
      <circle class="map-destination-halo" r="22"/>
      <image class="map-destination-photo" href="${escapeMarkup(photo)}" x="-17" y="-17" width="34" height="34" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>
      <circle class="map-destination-pin" r="17"/>
      <text class="map-destination-label" x="${labelX}" y="${labelY}" text-anchor="${labelX < 0 ? "end" : "start"}">${escapeMarkup(route.name)}</text>
    </g>`);
  }

  const markers = [...destinationLayer.querySelectorAll("[data-map-marker]")];

  function setViewBox(box) {
    svg.setAttribute("viewBox", `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`);
  }

  function focusedViewBox() {
    return window.matchMedia("(max-width: 620px)").matches
      ? { x: 35, y: 35, width: 800, height: 545 }
      : fullViewBox;
  }

  function geographicRoutePoints(stops) {
    const usable = stops.filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng));
    if (!usable.length) return [];
    const centreLatitude = usable.reduce((sum, stop) => sum + stop.lat, 0) / usable.length;
    const longitudeScale = Math.max(.45, Math.cos(centreLatitude * Math.PI / 180));
    const projected = usable.map((stop) => ({ x: stop.lng * longitudeScale, y: stop.lat }));
    const minX = Math.min(...projected.map((point) => point.x));
    const maxX = Math.max(...projected.map((point) => point.x));
    const minY = Math.min(...projected.map((point) => point.y));
    const maxY = Math.max(...projected.map((point) => point.y));
    const spanX = Math.max(maxX - minX, .32);
    const spanY = Math.max(maxY - minY, .32);
    const frame = { x: 118, y: 150, width: 552, height: 314 };
    const scale = Math.min(frame.width / spanX, frame.height / spanY);
    const centreX = (minX + maxX) / 2;
    const centreY = (minY + maxY) / 2;
    return projected.map((point) => ({
      x: frame.x + frame.width / 2 + (point.x - centreX) * scale,
      y: frame.y + frame.height / 2 - (point.y - centreY) * scale,
    }));
  }

  const routeLabelOffsets = {
    yunnan: [[-150, 22], [22, 22], [22, -62], [-150, -62]],
    xinjiang: [[18, 20], [-155, 22], [18, -65], [18, -62], [18, 20], [-150, 22]],
    dunhuang: [[18, 18], [18, -62], [-154, -62], [-154, 22], [-154, -62], [18, 20], [18, -58]],
    "inner-mongolia": [[18, -62], [18, 20], [-154, 20], [-154, -62]],
    sanya: [[18, -58], [-154, -58], [18, -58], [-154, 18], [18, 18]],
    northeast: [[-154, -58], [18, -58], [18, 20]],
    xian: [[-154, -58], [18, 18]],
    tibet: [[18, -58], [18, 18], [-154, 18], [-154, -58]],
    zhangjiajie: [[-170, -80], [26, -78], [24, 18], [-170, -52], [24, 18]],
  };

  function straightRoutePath(points) {
    if (!points.length) return "";
    return points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join("");
  }

  function drawRoute(route) {
    const stops = Array.isArray(route.stops) ? route.stops : [];
    if (!stops.length) {
      routeLayer.innerHTML = "";
      if (sceneryLayer) sceneryLayer.innerHTML = "";
      if (stopList) stopList.innerHTML = "";
      return;
    }
    const points = geographicRoutePoints(stops);
    const routePath = straightRoutePath(points);
    const uniqueStops = [];
    stops.forEach((stop, index) => {
      const key = `${stop.lat.toFixed(4)}|${stop.lng.toFixed(4)}`;
      const existing = uniqueStops.find((entry) => entry.key === key);
      if (existing) existing.indices.push(index + 1);
      else uniqueStops.push({ key, stop, point: points[index], indices: [index + 1] });
    });
    const offsets = routeLabelOffsets[route.slug] || [];
    const nodes = uniqueStops.map((entry, index) => {
      const [dx, dy] = offsets[index] || [entry.point.x > 410 ? -154 : 18, entry.point.y > 306 ? -58 : 18];
      const number = entry.indices.join("·");
      const sideClass = dx < 0 ? " is-left" : "";
      return `<g class="map-route-stop" transform="translate(${entry.point.x.toFixed(1)} ${entry.point.y.toFixed(1)})"><circle r="17"/><text y="5.5" text-anchor="middle">${number}</text></g><foreignObject class="map-route-label-object" x="${(entry.point.x + dx).toFixed(1)}" y="${(entry.point.y + dy).toFixed(1)}" width="136" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="map-route-label${sideClass}">${escapeMarkup(entry.stop.label)}</div></foreignObject>`;
    }).join("");
    if (sceneryLayer) {
      const photo = photoBySlug[route.slug] || photoBySlug.yunnan;
      sceneryLayer.innerHTML = `<image class="route-atlas-photo" href="${escapeMarkup(photo)}" x="760" y="42" width="192" height="516" preserveAspectRatio="xMidYMid slice" clip-path="url(#route-atlas-clip)"/>`;
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
      setViewBox(focusedViewBox());
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

  window.addEventListener("resize", () => {
    setViewBox(root.classList.contains("is-route-focused") ? focusedViewBox() : fullViewBox);
  }, { passive: true });

  activate(data.default || routes[0]?.slug, true);
})();
