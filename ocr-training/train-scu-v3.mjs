// scu-id v3 重训：精确灰线去除预处理 + 颜色量化分割 + 灰度阈值特征
// 预处理复刻验证码生成规律（干扰线固定 RGB 111,110,112 ±10），自研质心模板训练
// 数据源：scu-id/（旧 500 张）+ .tmp-scu-test/（新 1000 张）
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const OUT_NAME = (process.argv.find((a) => a.startsWith('--out=')) || '').split('=')[1] || 'scu-id-v3.json';

// 预处理常量（验证码生成规律：干扰线固定色）
const LINE_R = 111, LINE_G = 110, LINE_B = 112, LINE_TOL = 10;
const QUANT = 8, NUM_CHARS = 4, CHAR_THRESHOLD = 0.3;
const CHAR_H = 8, CHAR_W = 6;
const FEAT_DIM = CHAR_H * CHAR_W; // 48
const FEAT_DIM_WITH_AR = FEAT_DIM + 1; // 49
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

// 分割：去灰线 → 颜色量化 top-4 → 像素归属 → 每色 bbox → 灰度二值特征
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
  const feats = [];
  const centers = [];
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
  // 按 x 中心排序
  const order = centers.map((_, i) => i).sort((a, b) => centers[a] - centers[b]);
  return order.map((i) => feats[i]);
}

function kmeans(feats, k) {
  const n = feats.length;
  if (n <= k) return feats.map((f) => Array.from(f));
  const centers = [...feats].sort(() => Math.random() - 0.5).slice(0, k).map((f) => Array.from(f));
  for (let iter = 0; iter < 40; iter++) {
    const assign = feats.map((f) => {
      let bi = 0, bd = Infinity;
      centers.forEach((c, i) => { const d = dist(f, c); if (d < bd) { bd = d; bi = i; } });
      return bi;
    });
    const sums = centers.map(() => new Float64Array(FEAT_DIM_WITH_AR));
    const counts = centers.map(() => 0);
    feats.forEach((f, i) => { const ci = assign[i]; for (let k2 = 0; k2 < FEAT_DIM_WITH_AR; k2++) sums[ci][k2] += f[k2]; counts[ci]++; });
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

// 加载标注
const oldLabels = JSON.parse(readFileSync(path.join(ROOT, 'labels', 'scu-id.json'), 'utf8'));
const { scuTestLabels2 } = await import(pathToFileURL(path.join(ROOT, '.tmp-scu-test', 'labels-1000-b2.mjs')).href);

const examples = [];
let loaded = 0, segFail = 0;

// 旧数据
for (const [id, label] of Object.entries(oldLabels)) {
  const f = path.join(ROOT, 'scu-id', id + '.png');
  try {
    const img = await Jimp.read(readFileSync(f));
    const feats = segmentAndExtract(img);
    if (feats.length !== label.length) { segFail++; continue; }
    for (let i = 0; i < feats.length; i++) {
      const ch = String(label[i]).toLowerCase();
      if (!ch) continue;
      examples.push({ ch, feat: feats[i] });
    }
    loaded++;
  } catch (e) { /* skip */ }
}

// 新数据
for (const [id, label] of Object.entries(scuTestLabels2)) {
  const clean = label.replace(/\s+/g, '').toLowerCase();
  if (clean.includes('?') || clean.length !== 4) continue;
  const f = path.join(ROOT, '.tmp-scu-test', id.padStart(4, '0') + '.png');
  try {
    const img = await Jimp.read(readFileSync(f));
    const feats = segmentAndExtract(img);
    if (feats.length !== clean.length) { segFail++; continue; }
    for (let i = 0; i < feats.length; i++) {
      const ch = clean[i];
      if (!ch) continue;
      examples.push({ ch, feat: feats[i] });
    }
    loaded++;
  } catch (e) { /* skip */ }
}

console.log(`加载标注图: ${loaded} 张, 有效字符样本: ${examples.length}, 分割失败: ${segFail}`);

const charSamples = new Map();
for (const ex of examples) {
  if (!charSamples.has(ex.ch)) charSamples.set(ex.ch, []);
  charSamples.get(ex.ch).push(ex.feat);
}

// 过滤稀有类
const MIN_SAMPLES = 5;
const filtered = [...charSamples.entries()].filter(([, feats]) => feats.length >= MIN_SAMPLES);
console.log(`类别数: ${filtered.length}（剔除 ${charSamples.size - filtered.length} 个稀有类）`);

const model = {
  site: 'scu-id', char_h: CHAR_H, char_w: CHAR_W, input_dim: FEAT_DIM_WITH_AR,
  k: 1, ar_weight: AR_WEIGHT, max_aspect_ratio: MAX_AR,
  charset: '0123456789abcdefghijklmnopqrstuvwxyz',
  chars: [],
};
for (const [ch, feats] of filtered.sort((a, b) => a[0].localeCompare(b[0]))) {
  const templates = kmeans(feats, 1).map((t) => Array.from(t, (v) => Math.round(v * 255)));
  model.chars.push({ c: ch, n: feats.length, templates });
}

mkdirSync(path.join(ROOT, 'model'), { recursive: true });
const outFile = path.join(ROOT, 'model', OUT_NAME);
writeFileSync(outFile, JSON.stringify(model));
const kb = (readFileSync(outFile).length / 1024).toFixed(1);
console.log(`模型已生成: ${outFile} (${kb}KB, ${model.chars.length} 类)`);

// 训练集自检
const recognize = (feat) => {
  let best = null, bestD = Infinity;
  for (const m of model.chars) {
    for (const t of m.templates) {
      const d = dist(feat, t.map((v) => v / 255));
      if (d < bestD) { bestD = d; best = m.c; }
    }
  }
  return best;
};
let hit = 0;
for (const ex of examples) if (recognize(ex.feat) === ex.ch) hit++;
console.log(`训练集自检: ${(hit / examples.length * 100).toFixed(1)}% (${hit}/${examples.length})`);
