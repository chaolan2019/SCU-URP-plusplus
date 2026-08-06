// 本地 OCR 验证：用训练好的质心模型识别一张验证码。
// 用法：node eval.mjs <zhjw|scu-id> <image-path> [--verbose]
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const TARGET = process.argv[2];
const IMG = process.argv[3];
const VERBOSE = process.argv.includes('--verbose');
if (!TARGET || !IMG || !['zhjw', 'scu-id'].includes(TARGET)) {
  console.error('用法：node eval.mjs <zhjw|scu-id> <image-path>');
  process.exit(1);
}

const model = JSON.parse(readFileSync(path.join(ROOT, 'model', TARGET + '.json'), 'utf8'));
const FEAT_W = model.size[0];
const FEAT_H = model.size[1];

const SITE = {
  zhjw: { mask: (r, g, b) => r > 90 && (r - g) > 40 && (r - b) > 40, split: 'projection' },
  'scu-id': {
    mask: (r, g, b) => {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return (max - min) > 60 || max < 130;
    },
    split: 'components',
  },
}[TARGET];

function maskOf(img) {
  const { width: w, height: h, data } = img.bitmap;
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    mask[y * w + x] = SITE.mask(data[i], data[i + 1], data[i + 2]) ? 1 : 0;
  }
  return { w, h, mask };
}

function connectedComponents({ w, h, mask }) {
  const label = new Int32Array(w * h).fill(-1);
  const areas = [];
  const stack = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const idx = y * w + x;
    if (mask[idx] !== 1 || label[idx] !== -1) continue;
    const comp = { minX: x, maxX: x, minY: y, maxY: y, count: 0 };
    label[idx] = areas.length;
    stack.push(idx);
    while (stack.length) {
      const cur = stack.pop();
      const cx = cur % w;
      const cy = (cur / w) | 0;
      comp.minX = Math.min(comp.minX, cx);
      comp.maxX = Math.max(comp.maxX, cx);
      comp.minY = Math.min(comp.minY, cy);
      comp.maxY = Math.max(comp.maxY, cy);
      comp.count++;
      for (const nb of [cur - w, cur + w, cur - 1, cur + 1]) {
        if (nb < 0 || nb >= w * h) continue;
        if (mask[nb] === 1 && label[nb] === -1) { label[nb] = areas.length; stack.push(nb); }
      }
    }
    areas.push(comp);
  }
  return areas;
}

function splitProjection(col, w, h, n) {
  const max = Math.max(...col);
  if (max <= 0 || !n) return [];
  const threshold = max * 0.2;
  const isLow = col.map((v) => v < threshold);
  const blocks = [];
  let start = -1;
  for (let x = 0; x <= w; x++) {
    const low = x < w && isLow[x];
    if (!low && start < 0) start = x;
    if (low && start >= 0) {
      if (x - start >= 2) blocks.push({ minX: start, maxX: x - 1, minY: 0, maxY: h - 1 });
      start = -1;
    }
  }
  if (start >= 0 && w - start >= 2) blocks.push({ minX: start, maxX: w - 1, minY: 0, maxY: h - 1 });
  while (blocks.length > n && blocks.length > 1) {
    let bi = 0;
    let best = Infinity;
    for (let i = 0; i < blocks.length - 1; i++) {
      const sum = (blocks[i].maxX - blocks[i].minX) + (blocks[i + 1].maxX - blocks[i + 1].minX);
      if (sum < best) { best = sum; bi = i; }
    }
    blocks[bi].maxX = blocks[bi + 1].maxX;
    blocks.splice(bi + 1, 1);
  }
  while (blocks.length < n && blocks.length > 0) {
    let bi = 0;
    let widest = -1;
    for (let i = 0; i < blocks.length; i++) {
      const wdt = blocks[i].maxX - blocks[i].minX;
      if (wdt > widest) { widest = wdt; bi = i; }
    }
    const b = blocks[bi];
    const need = n - blocks.length + 1;
    const seg = Math.round((b.maxX - b.minX + 1) / need);
    for (let k = need - 1; k >= 1; k--) {
      const cutAt = Math.min(b.maxX, b.minX + k * seg - 1);
      blocks.splice(bi + 1, 0, { minX: cutAt + 1, maxX: b.maxX, minY: 0, maxY: h - 1 });
      b.maxX = cutAt;
    }
  }
  return blocks.slice(0, n);
}

function split(img, maskData, n) {
  const { w, h, mask } = maskData;
  if (SITE.split === 'projection') {
    const col = new Array(w).fill(0);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) col[x] += mask[y * w + x];
    return splitProjection(col, w, h, n);
  }
  const comps = connectedComponents({ w, h, mask })
    .filter((c) => c.count >= 6)
    .sort((a, b) => b.count - a.count);
  return comps.slice(0, n).sort((a, b) => a.minX - b.minX);
}

function cropNormalize(img, comp) {
  const cw = comp.maxX - comp.minX + 1;
  const ch = comp.maxY - comp.minY + 1;
  const { data } = img.bitmap;
  const out = new Uint8Array(FEAT_W * FEAT_H);
  for (let ty = 0; ty < FEAT_H; ty++) {
    for (let tx = 0; tx < FEAT_W; tx++) {
      const sx = comp.minX + Math.min(cw - 1, Math.floor((tx / FEAT_W) * cw));
      const sy = comp.minY + Math.min(ch - 1, Math.floor((ty / FEAT_H) * ch));
      const i = (sy * img.bitmap.width + sx) * 4;
      out[ty * FEAT_W + tx] = SITE.mask(data[i], data[i + 1], data[i + 2]) ? 1 : 0;
    }
  }
  return out;
}

function recognize(feat) {
  let best = null;
  let bestD = Infinity;
  for (const m of model.chars) {
    for (const t of m.templates) {
      let d = 0;
      for (let k = 0; k < feat.length; k++) d += Math.abs(feat[k] * 255 - t[k]);
      if (d < bestD) { bestD = d; best = m.c; }
    }
  }
  return { c: best, d: bestD };
}

const img = await Jimp.read(IMG);
const maskData = maskOf(img);
// 位数：统一认证固定 4；教务 4/5 取平均距离最优
const LENGTHS = TARGET === 'scu-id' ? [4] : [4, 5];
let bestGuess = '';
let bestScore = Infinity;
for (const n of LENGTHS) {
  const comps = split(img, maskData, n);
  if (comps.length !== n) continue;
  let score = 0;
  let text = '';
  for (const comp of comps) {
    const r = recognize(cropNormalize(img, comp));
    text += r.c;
    score += r.d;
  }
  const avg = score / n;
  if (VERBOSE) console.log(`  n=${n}: ${text} (avg ${avg.toFixed(0)})`);
  if (avg < bestScore) { bestScore = avg; bestGuess = text; }
}
console.log(`识别结果: ${bestGuess}`);
