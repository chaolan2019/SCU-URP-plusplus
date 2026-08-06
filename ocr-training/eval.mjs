// 本地 OCR 验证：用 v2 质心模板模型识别一张统一认证验证码。
// 用法：node eval.mjs <图片路径> [--verbose]
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const IMG = process.argv[2];
const VERBOSE = process.argv.includes('--verbose');
if (!IMG) { console.error('用法：node eval.mjs <image-path>'); process.exit(1); }

const model = JSON.parse(readFileSync(path.join(ROOT, 'model', 'scu-id.json'), 'utf8'));
const CHAR_H = model.char_h || 8;
const CHAR_W = model.char_w || 6;
const FEAT_DIM = CHAR_H * CHAR_W;
const FEAT_DIM_WITH_AR = FEAT_DIM + 1;
const AR_WEIGHT = model.ar_weight || 25;
const MAX_ASPECT_RATIO = model.max_aspect_ratio || 2;
const QUANT_STEP = 8;
const WHITE_THRESHOLD = 250;
const SAT_MIN = 10; // 与训练一致：排除灰色斜线

function dist(a, b) {
  let pixelDist = 0;
  for (let i = 0; i < FEAT_DIM; i++) {
    const d = a[i] - b[i];
    pixelDist += d * d;
  }
  const arDiff = a[FEAT_DIM] - b[FEAT_DIM];
  return pixelDist + AR_WEIGHT * arDiff * arDiff;
}

function segmentByColor(img) {
  const { width: w, height: h, data } = img.bitmap;
  const len = w * h;
  const pixels = [];
  for (let i = 0; i < len; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) continue;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat < SAT_MIN) continue;
    pixels.push({ r, g, b, idx: i });
  }
  if (pixels.length < 20) return [];
  const quant = new Map();
  for (const px of pixels) {
    const key = `${Math.floor(px.r / QUANT_STEP) * QUANT_STEP},${Math.floor(px.g / QUANT_STEP) * QUANT_STEP},${Math.floor(px.b / QUANT_STEP) * QUANT_STEP}`;
    const e = quant.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    e.r += px.r; e.g += px.g; e.b += px.b; e.n++;
    quant.set(key, e);
  }
  const centers = [...quant.values()].sort((a, b) => b.n - a.n).slice(0, 4)
    .map((e) => ({ r: Math.round(e.r / e.n), g: Math.round(e.g / e.n), b: Math.round(e.b / e.n) }));
  const labels = new Int32Array(len).fill(-1);
  for (const px of pixels) {
    let bi = 0, bd = Infinity;
    for (let c = 0; c < centers.length; c++) {
      const d = (px.r - centers[c].r) ** 2 + (px.g - centers[c].g) ** 2 + (px.b - centers[c].b) ** 2;
      if (d < bd) { bd = d; bi = c; }
    }
    labels[px.idx] = bi;
  }
  const chars = [];
  for (let c = 0; c < centers.length; c++) {
    let x1 = w, y1 = h, x2 = 0, y2 = 0, n = 0;
    for (let i = 0; i < len; i++) {
      if (labels[i] !== c) continue;
      const x = i % w, y = (i / w) | 0;
      if (x < x1) x1 = x;
      if (x > x2) x2 = x;
      if (y < y1) y1 = y;
      if (y > y2) y2 = y;
      n++;
    }
    if (n < 5) continue;
    chars.push({ x1, y1, x2, y2 });
  }
  chars.sort((a, b) => (a.x1 + a.x2) / 2 - (b.x1 + b.x2) / 2);
  return chars;
}

function extractFeature(img, box) {
  const { width: w, data } = img.bitmap;
  const cw = box.x2 - box.x1 + 1;
  const ch = box.y2 - box.y1 + 1;
  const feat = new Float64Array(FEAT_DIM_WITH_AR);
  for (let ty = 0; ty < CHAR_H; ty++) {
    const sy = box.y1 + Math.min(ch - 1, Math.floor((ty / CHAR_H) * ch));
    for (let tx = 0; tx < CHAR_W; tx++) {
      const sx = box.x1 + Math.min(cw - 1, Math.floor((tx / CHAR_W) * cw));
      const i = (sy * w + sx) * 4;
      feat[ty * CHAR_W + tx] = (data[i] > WHITE_THRESHOLD && data[i + 1] > WHITE_THRESHOLD && data[i + 2] > WHITE_THRESHOLD) ? 0 : 1;
    }
  }
  feat[FEAT_DIM] = Math.max(0, Math.min(1, (cw / Math.max(ch, 1)) / MAX_ASPECT_RATIO));
  return feat;
}

const img = await Jimp.read(IMG);
const chars = segmentByColor(img);
if (chars.length !== 4) {
  console.log(`分割失败（${chars.length} 块），无法识别`);
  process.exit(0);
}
let text = '';
for (const box of chars) {
  const feat = extractFeature(img, box);
  let best = '?';
  let bestD = Infinity;
  for (const m of model.chars) {
    for (const t of m.templates) {
      const d = dist(feat, t.map((v) => v / 255));
      if (d < bestD) { bestD = d; best = m.c; }
    }
  }
  if (VERBOSE) console.log(`  box [${box.x1},${box.y1},${box.x2},${box.y2}] -> ${best} (d=${bestD.toFixed(0)})`);
  text += best;
}
console.log(`识别结果: ${text}`);
