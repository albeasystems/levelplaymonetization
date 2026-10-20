// Turns raw-shots/<code>/<name>.png (from scripts/capture-shots.sh) into public/shots/<folder>/<name>.webp.
// The folder is the language's URL slug, or "en" for English.
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { LANGUAGES } from "./build-pages.mjs";

const folder = Object.fromEntries(LANGUAGES.map((l) => [l.code, l.slug || "en"]));
let n = 0;
for (const code of readdirSync("raw-shots", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  if (!folder[code]) continue;
  mkdirSync(`public/shots/${folder[code]}`, { recursive: true });
  for (const f of readdirSync(`raw-shots/${code}`).filter((f) => f.endsWith(".png"))) {
    await sharp(`raw-shots/${code}/${f}`)
      .resize({ width: 780 })
      .webp({ quality: 82 })
      .toFile(`public/shots/${folder[code]}/${f.replace(".png", ".webp")}`);
    n++;
  }
}
console.log(`Wrote ${n} screenshots.`);
