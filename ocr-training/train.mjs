// 验证码本地 OCR 训练 v2：复刻 scu-plus 的颜色量化分割 + 宽高比特征 + 质心模板。
// 专为「每字符独立颜色」的验证码（统一认证 scu-id）设计。
// 用法：node train.mjs <scu-id> [--full] [--k=N]
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const TARGET = process.argv[2];
const DRY = process.argv.includes('--dry');
const FULL = process.argv.includes('--full');
const K = Number((process.argv.find((a) => a.startsWith('--k=')) || '').split('=')[1]) || 1;
if (TARGET !== 'scu-id') {
  console.error('v2 仅支持 scu-id（颜色量化分割）；zhjw 请用旧版逻辑');
  process.exit(1);
}

const CHAR_H = 8;
const CHAR_W = 6;
const FEAT_DIM = CHAR_H * CHAR_W; // 48 像素
const FEAT_DIM_WITH_AR = FEAT_DIM + 1; // + 宽高比
const MAX_ASPECT_RATIO = 2.0;
const AR_WEIGHT = 25.0;
const QUANT_STEP = 8;
const WHITE_THRESHOLD = 250;
const NUM_CHARS = 4;

const SITE = { dir: 'scu-id', ext: '.png' };

function dist(a, b) {
  let pixelDist = 0;
  for (let i = 0; i < FEAT_DIM; i++) {
    const d = a[i] - b[i];
    pixelDist += d * d;
  }
  const arDiff = a[FEAT_DIM] - b[FEAT_DIM];
  return pixelDist + AR_WEIGHT * arDiff * arDiff;
}

// scu-plus 式颜色量化分割：非白像素 → 步长 8 量化 → top-4 颜色中心 → 逐像素归属 → bbox
function segmentByColor(img) {
  const { width: w, height: h, data } = img.bitmap;
  const len = w * h;
  const pixels = [];
  for (let i = 0; i < len; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) continue;
    // 排除灰色系（斜线/噪点：低饱和度），只保留彩色字符像素
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat < 10) continue;
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
  const centers = [...quant.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 4)
    .map((e) => ({ r: Math.round(e.r / e.n), g: Math.round(e.g / e.n), b: Math.round(e.b / e.n) }));
  const labels = new Int32Array(len).fill(-1);
  for (const px of pixels) {
    let bi = 0;
    let bd = Infinity;
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
      const x = i % w;
      const y = (i / w) | 0;
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

// 特征：48 像素（颜色蒙版 8×6，非白即字符）+ 宽高比归一化
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
  const ar = cw / Math.max(ch, 1);
  feat[FEAT_DIM] = Math.max(0, Math.min(1, ar / MAX_ASPECT_RATIO));
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
      const chars = segmentByColor(img);
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

  // 训练（跳过验证集）
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
  console.log(`模型已生成: ${outFile}（${model.chars.length} 类 × k=${K} 模板）`);

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
  // 训练自检
  let hit = 0;
  for (const ex of examples) { if (!ex.valid && recognize(ex.feat) === ex.ch) hit++; }
  const trainN = examples.filter((e) => !e.valid).length;
  console.log(`训练集自检: ${(hit / trainN * 100).toFixed(1)}% (${hit}/${trainN})`);

  // 留出验证
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
