// 生成标注联络图：把样本横向拼接成图，便于逐张标注。
// 用法：node contact.mjs <zhjw|scu-id> <start> <end> [--out file]
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const SITE = process.argv[2];
const START = Number(process.argv[3]) || 1;
const END = Number(process.argv[4]) || START;
const SCALE = Number(process.argv[5]) || 2;
if (!SITE || !['zhjw', 'scu-id'].includes(SITE)) { console.error('用法：node contact.mjs <zhjw|scu-id> <start> <end> [scale]'); process.exit(1); }

const dir = path.join(ROOT, SITE);
const ext = SITE === 'zhjw' ? '.jpg' : '.png';
const files = readdirSync(dir).filter((f) => f.endsWith(ext)).sort();

const picked = files.filter((f) => {
  const n = Number(f.slice(0, 3));
  return n >= START && n <= END;
});

const PER_ROW = 5;
const GAP = 14;
const imgs = [];
let w = 0, h = 0;
for (const f of picked) {
  const img = await Jimp.read(path.join(dir, f));
  // 放大便于标注（默认 2 倍）
  img.resize({ w: img.bitmap.width * SCALE, h: img.bitmap.height * SCALE });
  imgs.push(img);
  w = Math.max(w, img.bitmap.width);
  h = Math.max(h, img.bitmap.height);
}
if (!imgs.length) { console.error('no files'); process.exit(1); }

const cols = Math.min(PER_ROW, imgs.length);
const rows = Math.ceil(imgs.length / cols);
const pad = 10;
const sheet = new Jimp({ width: cols * (w + GAP) + pad, height: rows * (h + GAP) + pad, color: 0xffffffff });
imgs.forEach((img, i) => {
  const cx = pad + (i % cols) * (w + GAP);
  const cy = pad + Math.floor(i / cols) * (h + GAP);
  sheet.composite(img, cx, cy);
});
mkdirSync(path.join(ROOT, 'contact'), { recursive: true });
const out = path.join(ROOT, 'contact', `${SITE}-${START}-${END}.png`);
await sheet.write(out);
console.log(`contact sheet: ${out} (${imgs.length} imgs, order: ${picked.map((f) => f.slice(0, 3)).join(',')})`);
