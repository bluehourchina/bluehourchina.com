import fs from "node:fs/promises";

const key = "bluehourchina-20260703-f7559af";
const host = "bluehourchina.com";
const sitemap = await fs.readFile("sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const response = await fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    urlList: urls,
  }),
});

console.log(JSON.stringify({
  submitted: urls.length,
  status: response.status,
  statusText: response.statusText,
  body: await response.text(),
}, null, 2));

if (![200, 202].includes(response.status)) {
  process.exitCode = 1;
}
