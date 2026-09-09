import sharp from "sharp";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const iconsDir = join(publicDir, "icons");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#134e4a"/>
  <text x="256" y="340" font-size="220" fill="#fbbf24" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700">PA</text>
</svg>`;

const buf = Buffer.from(svg);

await sharp(buf).resize(192, 192).png().toFile(join(publicDir, "icon-192.png"));
await sharp(buf).resize(512, 512).png().toFile(join(publicDir, "icon-512.png"));
await sharp(buf).resize(192, 192).png().toFile(join(iconsDir, "icon-192.png"));
await sharp(buf).resize(512, 512).png().toFile(join(iconsDir, "icon-512.png"));
await sharp(buf).resize(180, 180).png().toFile(join(iconsDir, "apple-touch-icon.png"));
