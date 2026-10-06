// Builds the web icons from the app icon. The source PNG has an opaque white
// background around the rounded shape, so it is removed here (flood fill from the
// borders, then the anti-aliased fringe is converted to real alpha).
import sharp from "sharp";

const SRC = "../levelplaymonetization/Assets.xcassets/AppIcon.appiconset/LevelPlay.png";
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const idx = (x, y) => (y * W + x) * 4;
const isWhite = (i) => data[i] > 238 && data[i + 1] > 238 && data[i + 2] > 238;

const out = Buffer.from(data);
const gone = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push([x, 0], [x, H - 1]);
for (let y = 0; y < H; y++) stack.push([0, y], [W - 1, y]);
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H || gone[y * W + x]) continue;
  if (!isWhite(idx(x, y))) continue;
  gone[y * W + x] = 1;
  out[idx(x, y) + 3] = 0;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// Fringe: pixels within 3px of the removed area are a mix of icon colour and white.
const near = (x, y) => {
  for (let dy = -3; dy <= 3; dy++)
    for (let dx = -3; dx <= 3; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < W && yy < H && gone[yy * W + xx]) return true;
    }
  return false;
};
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    if (gone[y * W + x] || !near(x, y)) continue;
    const i = idx(x, y);
    const a = Math.min(1, Math.max(0.02, (255 - data[i]) / (255 - 12)));
    out[i + 3] = Math.round(a * 255);
    for (let c = 0; c < 3; c++) out[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - (1 - a) * 255) / a)));
  }

const clean = sharp(out, { raw: { width: W, height: H, channels: 4 } });
await clean.clone().resize(512).png().toFile("public/icon-512.png");
await clean.clone().resize(64).png().toFile("public/favicon.png");
// iOS masks the touch icon itself, so it needs a full square: crop into the rounded
// shape so it fills the frame, and flatten what is left of the corners onto navy.
const inset = Math.round(W * 0.09);
await clean
  .clone()
  .extract({ left: inset, top: inset, width: W - inset * 2, height: H - inset * 2 })
  .resize(180)
  .flatten({ background: "#0a1272" })
  .png()
  .toFile("public/apple-touch-icon.png");
console.log("icons written");
