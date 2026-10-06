// Builds the web icons from the app icon (npm run icons).
//
// The App Store icon is a full square with no transparency, so for the web:
//  - favicon.png and icon-512.png get iOS-style rounded corners (transparent),
//  - apple-touch-icon.png stays a full square, because iOS applies its own mask.
// If a future icon ships with an opaque white surround instead, it is removed first.
import sharp from "sharp";

const SRC = "../levelplaymonetization/Assets.xcassets/AppIcon.appiconset/LevelPlay.png";
const RADIUS = 0.2237; // iOS app icon corner radius as a share of the side

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const idx = (x, y) => (y * W + x) * 4;
const isWhite = (i) => data[i] > 238 && data[i + 1] > 238 && data[i + 2] > 238;

let source = sharp(SRC).ensureAlpha();

if (isWhite(idx(2, 2))) {
  // Old icon style: rounded shape on an opaque white surround. Flood-fill the white away.
  const out = Buffer.from(data);
  const gone = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push([x, 0], [x, H - 1]);
  for (let y = 0; y < H; y++) stack.push([0, y], [W - 1, y]);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H || gone[y * W + x] || !isWhite(idx(x, y))) continue;
    gone[y * W + x] = 1;
    out[idx(x, y) + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  source = sharp(out, { raw: { width: W, height: H, channels: 4 } });
}

const rounded = async (size) => {
  const r = Math.round(size * RADIUS);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`,
  );
  return source
    .clone()
    .resize(size, size)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
};

await sharp(await rounded(512)).toFile("public/icon-512.png");
await sharp(await rounded(64)).toFile("public/favicon.png");
await source.clone().resize(180, 180).flatten({ background: "#000000" }).png().toFile("public/apple-touch-icon.png");
console.log("icons written");
