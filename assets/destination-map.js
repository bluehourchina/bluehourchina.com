(() => {
  const root = document.querySelector("[data-destination-map]");
  if (!root) return;

  const mapNode = root.querySelector("[data-map-canvas]");
  const dataNode = root.querySelector("script[type='application/json']");
  const buttons = [...root.querySelectorAll("[data-map-destination]")];
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

  let map;
  const markers = new Map();
  const chinaBounds = [[17.4, 73], [54.3, 135.2]];

  if (window.L) {
    map = window.L.map(mapNode, {
      scrollWheelZoom: false,
      zoomControl: true,
      minZoom: 3,
      maxZoom: 7,
      zoomSnap: 0.25,
      maxBounds: [[12, 67], [58, 142]],
      maxBoundsViscosity: 0.85,
    });
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 7,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    map.fitBounds(chinaBounds, { padding: [18, 18] });

    for (const route of routes) {
      const marker = window.L.circleMarker([route.lat, route.lng], {
        radius: 8,
        color: "#fffaf1",
        weight: 2,
        fillColor: "#c99a49",
        fillOpacity: 1,
      }).addTo(map);
      marker.bindTooltip(route.name, { direction: "top", offset: [0, -5] });
      marker.on("click", () => activate(route.slug, true));
      markers.set(route.slug, marker);
    }
  } else {
    root.classList.add("map-library-failed");
    mapNode.innerHTML = `<p>${data.fallback || "Choose a destination below."}</p>`;
  }

  function updateMarkerState(slug) {
    for (const [markerSlug, marker] of markers) {
      const active = markerSlug === slug;
      marker.setStyle({
        radius: active ? 11 : 8,
        color: active ? "#c99a49" : "#fffaf1",
        fillColor: active ? "#10231f" : "#c99a49",
      });
      if (active) marker.bringToFront();
    }
  }

  function activate(slug, moveMap = false) {
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
    updateMarkerState(slug);
    if (moveMap && map) map.flyTo([route.lat, route.lng], 5.25, { duration: 0.65 });
  }

  for (const button of buttons) {
    button.addEventListener("click", () => activate(button.dataset.mapDestination, true));
  }
  resetButton?.addEventListener("click", () => map?.fitBounds(chinaBounds, { padding: [18, 18] }));

  activate(data.default || routes[0]?.slug, false);
  if (map && "ResizeObserver" in window) {
    new ResizeObserver(() => map.invalidateSize({ pan: false })).observe(mapNode);
  }
})();
