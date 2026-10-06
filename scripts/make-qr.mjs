import QRCode from "qrcode";
import { writeFileSync } from "node:fs";

const url = "https://apps.apple.com/app/id6819292116";
const svg = await QRCode.toString(url, {
  type: "svg",
  margin: 1,
  errorCorrectionLevel: "M",
  color: { dark: "#0c0e11", light: "#e9ecf0" },
});
writeFileSync("public/qr.svg", svg);
