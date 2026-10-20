// Checks every language against English: same JSON shape, same HTML structure (tags, ids, links),
// and no string left untranslated.
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = (c) => resolve(web, "content", c);
const codes = readdirSync(resolve(web, "content"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "en")
  .map((d) => d.name);
const en = JSON.parse(readFileSync(resolve(dir("en"), "site.json"), "utf8"));
const ALLOWED_SAME = new Set([
  // brand/metric names and words that are the same in some languages (loanwords)
  "eCPM", "ARPDAU", "CTR", "Pro", "Banner", "iPhone", "Apps", "Support", "Legal", "Sections", "Privacy",
  "Impressions", "Interstitial", "Rewarded", "Fill rate", "Show rate",
]);
let problems = 0;
const bad = (c, msg) => { problems++; console.log(`  ✗ ${c}: ${msg}`); };

function walk(a, b, path, c) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return bad(c, `${path} length differs`);
    a.forEach((x, i) => walk(x, b[i], `${path}[${i}]`, c));
  } else if (a && typeof a === "object") {
    for (const k of Object.keys(a)) {
      if (!(k in (b || {}))) bad(c, `${path}.${k} missing`);
      else if (k === "img") { if (a[k] !== b[k]) bad(c, `${path}.img changed`); }
      else if (!["name", "htmlLang", "dir"].includes(k)) walk(a[k], b[k], `${path}.${k}`, c);
    }
    for (const k of Object.keys(b || {})) if (!(k in a)) bad(c, `${path}.${k} extra`);
  } else if (typeof a === "string") {
    if (typeof b !== "string" || !b.trim()) bad(c, `${path} empty`);
    else if (a === b && !ALLOWED_SAME.has(a) && /[a-z]{3}/i.test(a)) bad(c, `${path} identical to English: "${a.slice(0, 40)}"`);
  }
}

const sig = (html) => ({
  tags: ["h1","h2","p","ul","li","details","summary","strong","a","br"].map((t) => (html.match(new RegExp(`<${t}[\\s>/]`, "g")) || []).length).join(","),
  ids: [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]).join(","),
  hrefs: [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).join(","),
});

for (const c of codes) {
  console.log(c);
  const site = JSON.parse(readFileSync(resolve(dir(c), "site.json"), "utf8"));
  walk(en, site, "site", c);
  for (const p of ["privacy", "terms", "support"]) {
    const a = readFileSync(resolve(dir("en"), `${p}.html`), "utf8");
    const b = readFileSync(resolve(dir(c), `${p}.html`), "utf8");
    if (!/^---\ntitle: .+\ndescription: .+\n---\n/.test(b)) bad(c, `${p}: front matter`);
    const sa = sig(a), sb = sig(b);
    for (const k of Object.keys(sa)) {
      if (sa[k] !== sb[k]) bad(c, `${p}: ${k} differ\n      en: ${sa[k]}\n      ${c}: ${sb[k]}`);
    }
    if (a.split("\n").length > 10 && b === a) bad(c, `${p}: identical to English`);
  }
}
console.log(problems ? `\n${problems} problem(s)` : "\nAll languages match English structure and none are untranslated.");
process.exit(problems ? 1 : 0);
