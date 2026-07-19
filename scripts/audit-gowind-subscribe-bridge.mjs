import { readFile } from "node:fs/promises";

const html = await readFile("g/start/index.html", "utf8");
const links = [...html.matchAll(/data-track="youtube(?:-mini)?" href="([^"]+)"/g)].map(
  (match) => match[1],
);

if (links.length !== 2) {
  throw new Error(`Expected two YouTube subscription links, found ${links.length}.`);
}

for (const href of links) {
  const url = new URL(href);
  if (url.hostname !== "www.youtube.com") throw new Error(`Unexpected host: ${url.hostname}`);
  if (url.pathname !== "/channel/UC6pYmEYrPBodC6BNTEq08Cg") {
    throw new Error(`Unexpected channel path: ${url.pathname}`);
  }
  if (url.searchParams.get("sub_confirmation") !== "1") {
    throw new Error("YouTube subscription confirmation is missing.");
  }

  url.searchParams.set("utm_source", "g_start");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "gowind_video_start");
  if (url.searchParams.get("sub_confirmation") !== "1") {
    throw new Error("UTM mutation removed the subscription confirmation parameter.");
  }
}

if (!html.includes('window.gtag("event", "social_follow_click"')) {
  throw new Error("The social follow analytics event is missing.");
}
if (!html.includes('window.gtag("event", "route_check_click"')) {
  throw new Error("The route check analytics event is missing.");
}
if (!html.includes('document.querySelectorAll("[data-route], [data-route-mini]")')) {
  throw new Error("Both route check CTA variants must be instrumented.");
}
if (html.includes('youtube.com/@gowithwindtw"')) {
  throw new Error("A non-confirming Go With Wind YouTube link remains.");
}

console.log(
  JSON.stringify({
    status: "PASS",
    youtube_links: links.length,
    channel_id: "UC6pYmEYrPBodC6BNTEq08Cg",
    sub_confirmation: "1",
    ga4_events: ["social_follow_click", "route_check_click"],
  }),
);
