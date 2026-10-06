import sharp from "sharp";
import { readdirSync } from "node:fs";

const names = {
  "shot-01": "overview",
  "shot-02": "attention",
  "shot-03": "breakdown",
  "shot-04": "apps",
  "shot-05": "app-detail",
  "shot-06": "countries-map",
  "shot-07": "countries-matrix",
  "shot-08": "networks",
  "shot-09": "report",
  "shot-10": "alert",
};

for (const f of readdirSync("raw-shots")) {
  const key = f.replace(".png", "");
  if (!names[key]) continue;
  await sharp(`raw-shots/${f}`)
    .resize({ width: 780 })
    .webp({ quality: 82 })
    .toFile(`public/shots/${names[key]}.webp`);
}
