// v3 模型评估：精确灰线预处理 + 质心匹配，独立 1000 张
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const TMP = path.join(ROOT, '.tmp-scu-test');
const { scuTestLabels2 } = await import(pathToFileURL(path.join(TMP, 'labels-1000-b2.mjs')).href);

const LINE_R = 111, LINE_G = 110, LINE_B = 112, LINE_TOL = 10;
const QUANT = 8, NUM_CHARS = 4, CHAR_THRESHOLD = 0.3;
const CHAR_H = 8, CHAR_W = 6;
const FEAT_DIM = 48, FEAT_DIM_WITH_AR = 49;
const AR_WEIGHT = 25, MAX_AR = 2;

function dist(a, b) {
  let pixelDist = 0;
  for (let i = 0; i < FEAT_DIM; i++) {
    const d = a[i] - b[i];
    pixelDist += d * d;
  }
  const arDiff = a[FEAT_DIM] - b[FEAT_DIM];
  return pixelDist + AR_WEIGHT * arDiff * arDiff;
}

function segmentAndExtract(img) {
  const { width: w, height: h, data } = img.bitmap;
  const len = w * h;
  const charPixels = [];
  for (let i = 0; i < len; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const isLine = Math.abs(r - LINE_R) <= LINE_TOL && Math.abs(g - LINE_G) <= LINE_TOL && Math.abs(b - LINE_B) <= LINE_TOL;
    if (isLine) continue;
    if (r > 250 || g > 250 || b > 250) continue;
    charPixels.push({ x: i % w, y: (i / w) | 0, r, g, b });
  }
  if (charPixels.length < 20) return [];
  const colorCounts = new Map();
  for (const cp of charPixels) {
    const key = `${Math.floor(cp.r / QUANT) * QUANT},${Math.floor(cp.g / QUANT) * QUANT},${Math.floor(cp.b / QUANT) * QUANT}`;
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
  }
  if (colorCounts.size < NUM_CHARS) return [];
  const top4Keys = [...colorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, NUM_CHARS).map((e) => e[0]);
  const top4Q = top4Keys.map((k) => k.split(',').map(Number));
  const labelMap = Array.from({ length: h }, () => new Int32Array(w).fill(-1));
  for (const cp of charPixels) {
    const q = [Math.floor(cp.r / QUANT) * QUANT, Math.floor(cp.g / QUANT) * QUANT, Math.floor(cp.b / QUANT) * QUANT];
    let best = 0, bestD = Infinity;
    for (let i = 0; i < NUM_CHARS; i++) {
      const dr = q[0] - top4Q[i][0], dg = q[1] - top4Q[i][1], db = q[2] - top4Q[i][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestD) { bestD = d; best = i; }
    }
    labelMap[cp.y][cp.x] = best;
  }
  const feats = [], centers = [];
  for (let c = 0; c < NUM_CHARS; c++) {
    const xs = [], ys = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (labelMap[y][x] === c) { xs.push(x); ys.push(y); }
    }
    if (xs.length < 5) continue;
    const x1 = Math.min(...xs), x2 = Math.max(...xs);
    const y1 = Math.min(...ys), y2 = Math.max(...ys);
    const bw = x2 - x1 + 1, bh = y2 - y1 + 1;
    const charBin = Array.from({ length: bh }, () => new Float64Array(bw));
    for (let py = y1; py <= y2; py++) for (let px = x1; px <= x2; px++) {
      if (labelMap[py][px] !== c) continue;
      const i = (py * w + px) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
      if (1.0 - gray <= CHAR_THRESHOLD) continue;
      charBin[py - y1][px - x1] = 1.0;
    }
    const feat = new Float64Array(FEAT_DIM_WITH_AR);
    for (let sy = 0; sy < CHAR_H; sy++) {
      const srcY = Math.min(bh - 1, Math.floor(sy * bh / CHAR_H));
      for (let sx = 0; sx < CHAR_W; sx++) {
        const srcX = Math.min(bw - 1, Math.floor(sx * bw / CHAR_W));
        feat[sy * CHAR_W + sx] = charBin[srcY][srcX];
      }
    }
    feat[FEAT_DIM] = Math.max(0, Math.min(1, (bw / Math.max(bh, 1)) / MAX_AR));
    feats.push(feat);
    centers.push(Math.round(xs.reduce((a, b) => a + b) / xs.length));
  }
  const order = centers.map((_, i) => i).sort((a, b) => centers[a] - centers[b]);
  return order.map((i) => feats[i]);
}

function recognize(model, feat) {
  let best = '?', bestD = Infinity;
  for (const m of model.chars) {
    for (const t of m.templates) {
      const d = dist(feat, t.map((v) => v / 255));
      if (d < bestD) { bestD = d; best = m.c; }
    }
  }
  return best;
}

const model = JSON.parse(readFileSync(path.join(ROOT, 'model', 'scu-id-v3.json'), 'utf8'));

const cleanLabels = {};
for (const [id, label] of Object.entries(scuTestLabels2)) {
  const clean = label.replace(/\s+/g, '').toLowerCase();
  if (clean.includes('?')) continue;
  if (clean.length !== 4) continue;
  cleanLabels[id] = clean;
}

let total = 0, imgHit = 0, charHit = 0, charTotal = 0, segFail = 0;
const segFailIds = [], errors = [];
for (const [id, label] of Object.entries(cleanLabels)) {
  const img = await Jimp.read(readFileSync(path.join(TMP, id.padStart(4, '0') + '.png')));
  const feats = segmentAndExtract(img);
  if (feats.length !== 4) { segFail++; segFailIds.push(id); continue; }
  let pred = '';
  for (const feat of feats) pred += recognize(model, feat);
  total++;
  if (pred === label) imgHit++;
  else errors.push({ id, label, pred });
  for (let k = 0; k < 4; k++) {
    charTotal++;
    if (pred[k] === label[k]) charHit++;
  }
}

console.log(`v3 模型（精确灰线预处理）独立评估（${total} 张有效, 分割失败 ${segFail}）:`);
console.log(`整图: ${(imgHit / total * 100).toFixed(2)}% (${imgHit}/${total})`);
console.log(`单字符: ${(charHit / charTotal * 100).toFixed(2)}% (${charHit}/${charTotal})`);
console.log(`全量成功率: ${(imgHit / 996 * 100).toFixed(1)}%`);
if (segFailIds.length) console.log(`分割失败: ${segFailIds.join(',')}`);
console.log(`\n整图错误 ${errors.length} 个（前 25）:`);
for (const e of errors.slice(0, 25)) console.log(`  ${e.id}: 标签=${e.label} 预测=${e.pred}`);
