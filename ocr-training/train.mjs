// 验证码本地 OCR 训练 v3：双站点。
// scu-id：颜色量化分割（每字符一色）+ 饱和度过滤。
// zhjw：红色掩码 + 连通域聚类合并（黑线碎片）+ 粘连等分。
// 共同：48 像素 8×6 二值 + 宽高比特征，质心模板匹配（k-means 多模板）。
// 用法：node train.mjs <zhjw|scu-id> [--full] [--k=N]
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const TARGET = process.argv[2];
const DRY = process.argv.includes('--dry');
const FULL = process.argv.includes('--full');
const K = Number((process.argv.find((a) => a.startsWith('--k=')) || '').split('=')[1]) || 1;
if (!TARGET || !['zhjw', 'scu-id'].includes(TARGET)) {
  console.error('用法：node train.mjs <zhjw|scu-id> [--full] [--k=N]');
  process.exit(1);
}

const CHAR_H = 8;
const CHAR_W = 6;
const FEAT_DIM = CHAR_H * CHAR_W;
const FEAT_DIM_WITH_AR = FEAT_DIM + 1;
const MAX_ASPECT_RATIO = 2.0;
const AR_WEIGHT = 25.0;

const SITE = {
  'scu-id': { dir: 'scu-id', ext: '.png', method: 'color-quant' },
  zhjw: { dir: 'zhjw', ext: '.jpg', method: 'red-projection' },
}[TARGET];

function dist(a, b) {
  let pixelDist = 0;
  for (let i = 0; i < FEAT_DIM; i++) {
    const d = a[i] - b[i];
    pixelDist += d * d;
  }
  const arDiff = a[FEAT_DIM] - b[FEAT_DIM];
  return pixelDist + AR_WEIGHT * arDiff * arDiff;
}

function connectedComponents(w, h, mask) {
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
      const cx = cur % w, cy = (cur / w) | 0;
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

// scu-id：颜色量化分割（每字符一色，饱和度过滤排除灰色斜线）
function segmentColorQuant(img) {
  const { width: w, height: h, data } = img.bitmap;
  const len = w * h;
  const pixels = [];
  for (let i = 0; i < len; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    if (r > 250 && g > 250 && b > 250) continue;
    if (Math.max(r, g, b) - Math.min(r, g, b) < 10) continue;
    pixels.push({ r, g, b, idx: i });
  }
  if (pixels.length < 20) return [];
  const quant = new Map();
  for (const px of pixels) {
    const key = `${Math.floor(px.r / 8) * 8},${Math.floor(px.g / 8) * 8},${Math.floor(px.b / 8) * 8}`;
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

// zhjw：红色掩码 → 垂直投影低谷切分 → 块数调整到 n（合并窄块 / 等分宽块）
function segmentRedProjection(img, n) {
  const { width: w, height: h, data } = img.bitmap;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    mask[i] = (r > 100 && r - g > 50 && r - b > 50) ? 1 : 0;
  }
  const col = new Array(w).fill(0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) col[x] += mask[y * w + x];
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
      if (x - start >= 2) blocks.push({ x1: start, x2: x - 1, y1: 0, y2: h - 1 });
      start = -1;
    }
  }
  if (start >= 0 && w - start >= 2) blocks.push({ x1: start, x2: w - 1, y1: 0, y2: h - 1 });
  // 块数多于目标：合并相邻最窄的两块
  while (blocks.length > n && blocks.length > 1) {
    let bi = 0;
    let best = Infinity;
    for (let i = 0; i < blocks.length - 1; i++) {
      const sum = (blocks[i].x2 - blocks[i].x1) + (blocks[i + 1].x2 - blocks[i + 1].x1);
      if (sum < best) { best = sum; bi = i; }
    }
    blocks[bi].x2 = blocks[bi + 1].x2;
    blocks.splice(bi + 1, 1);
  }
  // 块数少于目标：把最宽的块按缺口数量等分
  while (blocks.length < n && blocks.length > 0) {
    let bi = 0;
    let widest = -1;
    for (let i = 0; i < blocks.length; i++) {
      const wdt = blocks[i].x2 - blocks[i].x1;
      if (wdt > widest) { widest = wdt; bi = i; }
    }
    const b = blocks[bi];
    const need = n - blocks.length + 1;
    const seg = Math.round((b.x2 - b.x1 + 1) / need);
    for (let k = need - 1; k >= 1; k--) {
      const cutAt = Math.min(b.x2, b.x1 + k * seg - 1);
      blocks.splice(bi + 1, 0, { x1: cutAt + 1, x2: b.x2, y1: 0, y2: h - 1 });
      b.x2 = cutAt;
    }
  }
  return blocks.slice(0, n);
}

function extractFeature(img, box) {
  const { width: w, data } = img.bitmap;
  const cw = box.x2 - box.x1 + 1;
  const ch = box.y2 - box.y1 + 1;
  const feat = new Float64Array(FEAT_DIM_WITH_AR);
  const isChar = SITE.method === 'color-quant'
    ? (i) => !(data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250)
    : (i) => data[i] > 100 && data[i] - data[i + 1] > 50 && data[i] - data[i + 2] > 50;
  for (let ty = 0; ty < CHAR_H; ty++) {
    const sy = box.y1 + Math.min(ch - 1, Math.floor((ty / CHAR_H) * ch));
    for (let tx = 0; tx < CHAR_W; tx++) {
      const sx = box.x1 + Math.min(cw - 1, Math.floor((tx / CHAR_W) * cw));
      const i = (sy * w + sx) * 4;
      feat[ty * CHAR_W + tx] = isChar(i) ? 1 : 0;
    }
  }
  feat[FEAT_DIM] = Math.max(0, Math.min(1, (cw / Math.max(ch, 1)) / MAX_ASPECT_RATIO));
  return feat;
}

function kmeans(feats, k, dim) {
  const n = feats.length;
  if (n <= k) return feats.map((f) => Array.from(f));
  const centers = [...feats].sort(() => Math.random() - 0.5).slice(0, k).map((f) => Array.from(f));
  for (let iter = 0; iter < 40; iter++) {
    const assign = feats.map((f) => {
      let bi = 0, bd = Infinity;
      centers.forEach((c, i) => { const d = dist(f, c); if (d < bd) { bd = d; bi = i; } });
      return bi;
    });
    const sums = centers.map(() => new Float64Array(dim));
    const counts = centers.map(() => 0);
    feats.forEach((f, i) => { const ci = assign[i]; for (let k2 = 0; k2 < dim; k2++) sums[ci][k2] += f[k2]; counts[ci]++; });
    let moved = false;
    for (let i = 0; i < k; i++) {
      if (!counts[i]) continue;
      const nc = Array.from(sums[i], (v) => v / counts[i]);
      if (dist(nc, centers[i]) > 1e-9) moved = true;
      centers[i] = nc;
    }
    if (!moved) break;
  }
  return centers;
}

async function main() {
  const labelsFile = path.join(ROOT, 'labels', TARGET + '.json');
  let labels = {};
  try { labels = JSON.parse(readFileSync(labelsFile, 'utf8')); } catch (_) {
    console.error(`缺少 labels/${TARGET}.json`); process.exit(1);
  }
  const files = readdirSync(path.join(ROOT, SITE.dir)).filter((f) => f.endsWith(SITE.ext)).sort();
  const labeledIds = Object.keys(labels).sort();
  const VALIDATE = !FULL && labeledIds.length >= 10;
  const validSet = VALIDATE ? new Set(labeledIds.slice(Math.floor(labeledIds.length * 0.8))) : new Set();
  const examples = [];
  let failed = 0;
  let segFail = 0;
  for (const f of files) {
    const id = f.slice(0, 3);
    const label = labels[id];
    if (!label) continue;
    try {
      const img = await Jimp.read(path.join(ROOT, SITE.dir, f));
      const chars = SITE.method === 'color-quant'
        ? segmentColorQuant(img)
        : segmentRedProjection(img, label.length);
      if (chars.length !== label.length) { segFail++; continue; }
      for (let i = 0; i < chars.length; i++) {
        const ch = String(label[i] || '').toLowerCase();
        if (!ch) continue;
        examples.push({ ch, feat: extractFeature(img, chars[i]), valid: validSet.has(id), sampleId: id });
      }
    } catch (e) {
      failed++;
      console.warn(`[${id}] ${e.message}`);
    }
  }
  console.log(`标注样本 ${labeledIds.length}，有效字符 ${examples.length}，分割失败 ${segFail}，错误 ${failed}`);
  if (DRY) return;

  const charSamples = new Map();
  for (const ex of examples) {
    if (ex.valid) continue;
    if (!charSamples.has(ex.ch)) charSamples.set(ex.ch, []);
    charSamples.get(ex.ch).push(ex.feat);
  }
  const model = {
    site: TARGET, char_h: CHAR_H, char_w: CHAR_W, input_dim: FEAT_DIM_WITH_AR,
    k: K, ar_weight: AR_WEIGHT, max_aspect_ratio: MAX_ASPECT_RATIO,
    charset: '0123456789abcdefghijklmnopqrstuvwxyz',
    chars: [],
  };
  for (const [ch, feats] of [...charSamples.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const templates = kmeans(feats, Math.min(K, feats.length), FEAT_DIM_WITH_AR)
      .map((t) => Array.from(t, (v) => Math.round(v * 255)));
    model.chars.push({ c: ch, n: feats.length, templates });
  }
  mkdirSync(path.join(ROOT, 'model'), { recursive: true });
  const outFile = path.join(ROOT, 'model', TARGET + '.json');
  writeFileSync(outFile, JSON.stringify(model));
  console.log(`模型已生成: ${outFile}（${model.chars.length} 类 × k=${K}）`);

  const recognize = (feat) => {
    let best = null;
    let bestD = Infinity;
    for (const m of model.chars) {
      for (const t of m.templates) {
        const d = dist(feat, t.map((v) => v / 255));
        if (d < bestD) { bestD = d; best = m.c; }
      }
    }
    return best;
  };
  const trainEx = examples.filter((e) => !e.valid);
  let hit = 0;
  for (const ex of trainEx) if (recognize(ex.feat) === ex.ch) hit++;
  console.log(`训练集自检: ${(hit / trainEx.length * 100).toFixed(1)}% (${hit}/${trainEx.length})`);

  const validEx = examples.filter((e) => e.valid);
  if (VALIDATE && validEx.length) {
    const bySample = new Map();
    let charHit = 0;
    for (const ex of validEx) {
      const pred = recognize(ex.feat);
      if (pred === ex.ch) charHit++;
      const arr = bySample.get(ex.sampleId) || { label: '', pred: '' };
      arr.label += ex.ch;
      arr.pred += pred || '';
      bySample.set(ex.sampleId, arr);
    }
    let imgHit = 0;
    for (const arr of bySample.values()) if (arr.label === arr.pred) imgHit++;
    console.log(`留出验证（${validSet.size} 张）: 字符级 ${(charHit / validEx.length * 100).toFixed(1)}% (${charHit}/${validEx.length})，整图 ${(imgHit / bySample.size * 100).toFixed(1)}% (${imgHit}/${bySample.size})`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
