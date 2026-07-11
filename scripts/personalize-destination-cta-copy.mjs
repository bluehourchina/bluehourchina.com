import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const copy = {
  yunnan: [
    "Shape a softer first journey into Yunnan",
    "Share your dates and whether lake mornings, old towns or a snow-mountain day matter most. We reply with the route and starting estimate.",
  ],
  xinjiang: [
    "Choose the Xinjiang road that fits your pace",
    "Share the month, travellers and comfort with long road days. We reply with the suitable Ili route and starting estimate.",
  ],
  dunhuang: [
    "See whether the Qinghai-Gansu loop fits your dates",
    "Share the month, travellers and comfort with altitude and long drives. We reply with the loop direction and starting estimate.",
  ],
  sanya: [
    "Balance local Hainan with time by the sea",
    "Share the month, travellers and the balance you want between local towns and resort time. We reply with the coast route and starting estimate.",
  ],
  northeast: [
    "Plan winter rail days around warmth and recovery",
    "Share your winter dates, travellers and cold-weather comfort. We reply with the rail-and-snow route and starting estimate.",
  ],
};

for (const [slug, [heading, body]] of Object.entries(copy)) {
  for (const file of [`${slug}.html`, `en/${slug}/index.html`]) {
    const absolute = path.join(root, file);
    let html = await fs.readFile(absolute, "utf8");
    html = html
      .replace(/<h2>Tell us the landscape you want\. We will help make it possible\.?<\/h2>/, `<h2>${heading}</h2>`)
      .replace(/<p>Share your season, travellers and the mood you are seeking\. We will reply with a route note, a starting quote and the next questions needed to refine the plan\.<\/p>/, `<p>${body}</p>`)
      .replace(/<p>Clear answers help you decide whether to ask for a route note, or whether another China landscape would fit better\.<\/p>/, "<p>These answers cover season, driving time, flights and who this route suits.</p>");
    await fs.writeFile(absolute, html);
  }
}

console.log("Destination CTA and FAQ copy personalized.");
