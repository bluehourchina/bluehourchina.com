import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const skipDirs = new Set([".git", "outputs", "node_modules"]);
const attrs = ["href", "src", "action", "poster"];
const skipPrefixes = ["#", "mailto:", "tel:", "javascript:", "data:", "sms:", "whatsapp:", "http://", "https://", "//", "/"];
const changed = [];

async function walk(dir = root, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path.relative(root, full));
  }
  return files;
}

async function exists(rel) {
  try {
    await fs.access(path.join(root, rel));
    return true;
  } catch {
    return false;
  }
}

function splitRef(ref) {
  const hashIndex = ref.indexOf("#");
  const beforeHash = hashIndex >= 0 ? ref.slice(0, hashIndex) : ref;
  const hash = hashIndex >= 0 ? ref.slice(hashIndex) : "";
  const queryIndex = beforeHash.indexOf("?");
  const pathPart = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  return { pathPart, query, hash };
}

async function resolvesFromFile(ref, file) {
  const { pathPart } = splitRef(ref);
  if (!pathPart) return true;
  const rel = path.posix.normalize(path.posix.join(path.posix.dirname(file), pathPart));
  return exists(rel) || (!path.posix.extname(rel) && (await exists(`${rel}.html`)) || await exists(path.posix.join(rel, "index.html")));
}

async function resolvesFromRoot(ref) {
  const { pathPart } = splitRef(ref);
  if (!pathPart) return false;
  const rel = pathPart.replace(/^\/+/, "");
  return exists(rel) || (!path.posix.extname(rel) && (await exists(`${rel}.html`)) || await exists(path.posix.join(rel, "index.html")));
}

for (const file of await walk()) {
  if (!file.includes("/")) continue;
  let html = await fs.readFile(path.join(root, file), "utf8");
  let next = html;
  const replacements = [];

  for (const attr of attrs) {
    const re = new RegExp(`\\b${attr}=([\"'])([^\"']+)\\1`, "g");
    const matches = [...next.matchAll(re)];
    for (const match of matches) {
      const [full, quote, ref] = match;
      const lower = ref.toLowerCase();
      if (!ref || skipPrefixes.some((prefix) => lower.startsWith(prefix))) continue;
      if (await resolvesFromFile(ref, file)) continue;
      if (!(await resolvesFromRoot(ref))) continue;

      const { pathPart, query, hash } = splitRef(ref);
      const fixed = `/${pathPart.replace(/^\/+/, "")}${query}${hash}`;
      replacements.push([full, `${attr}=${quote}${fixed}${quote}`]);
    }
  }

  for (const [from, to] of replacements) next = next.split(from).join(to);

  if (next !== html) {
    await fs.writeFile(path.join(root, file), next);
    changed.push({ file, replacements: replacements.length });
  }
}

console.log(`root-relative-link-fixes ${changed.length}`);
for (const item of changed) console.log(`${item.file}: ${item.replacements}`);
