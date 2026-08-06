// 验证码本地 OCR 训练：读取样本 + labels.json → 质心模板模型。
// 用法：node train.mjs <zhjw|scu-id> [--dry]   （--dry 只做预处理/分割统计，不生成模型）
// 依赖：jimp（开发依赖）。模型输出 model/<site>.json，内嵌进辅助插件。
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const FEAT_W = 16;
const FEAT_H = 10;
const TARGET = process.argv[2];
const DRY = process.argv.includes('--dry');
const FULL = process.argv.includes('--full'); // --full 用全部标注样本训练并输出最终模型
const K = Number((process.argv.find((a) => a.startsWith('--k=')) || '').split('=')[1]) || 3; // 每类质心数（多模板）
if (!TARGET || !['zhjw', 'scu-id'].includes(TARGET)) {
  console.error('用法：node train.mjs <zhjw|scu-id> [--dry] [--full] [--k=N]');
  process.exit(1);
}

const SITE = {
  zhjw: {
    dir: 'zhjw',
    ext: '.jpg',
    split: 'projection',
    // 红字：R 高且与 G/B 差异大；黑曲线被颜色过滤掉
    mask: (r, g, b) => r > 90 && (r - g) > 40 && (r - b) > 40,
  },
  'scu-id': {
    dir: 'scu-id',
    ext: '.png',
    split: 'components',
    // 彩色字符：与浅灰背景差异大（灰背景 RGB 接近且偏亮）
    mask: (r, g, b) => {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return (max - min) > 60 || max < 130; // 彩色或深色像素
    },
  },
}[TARGET];

function loadSample(file) {
  return Jimp.read(file);
}

function extractMask(img) {
  const { width: w, height: h, data } = img.bitmap;
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      mask[y * w + x] = SITE.mask(data[i], data[i + 1], data[i + 2]) ? 1 : 0;
    }
  }
  return { w, h, mask };
}

// 教务：红字可能被黑线切成碎块且字符粘连，连通域不可靠；
// 垂直投影找低谷切分，块数不匹配目标时用等分补足/合并。
function splitByVerticalProjection({ w, h, mask }, n) {
  const col = new Array(w).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) col[x] += mask[y * w + x];
  }
  const max = Math.max(...col);
  if (max <= 0 || !n) return [];
  const threshold = max * 0.2;
  // 低谷切分：col 低于阈值且是局部极小
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
  // 块数多于目标：合并相邻最窄的两块
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
  // 块数少于目标：把最宽的块按缺口数量等分
  while (blocks.length < n && blocks.length > 0) {
    let bi = 0;
    let widest = -1;
    for (let i = 0; i < blocks.length; i++) {
      const wdt = blocks[i].maxX - blocks[i].minX;
      if (wdt > widest) { widest = wdt; bi = i; }
    }
    const b = blocks[bi];
    const need = n - blocks.length + 1; // 该块要切成几段
    const seg = Math.round((b.maxX - b.minX + 1) / need);
    for (let k = need - 1; k >= 1; k--) {
      const cutAt = Math.min(b.maxX, b.minX + k * seg - 1);
      blocks.splice(bi + 1, 0, { minX: cutAt + 1, maxX: b.maxX, minY: 0, maxY: h - 1 });
      b.maxX = cutAt;
    }
  }
  return blocks.slice(0, n);
}

function connectedComponents({ w, h, mask }) {
  const label = new Int32Array(w * h).fill(-1);
  const areas = [];
  const stack = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (mask[idx] !== 1 || label[idx] !== -1) continue;
      // flood fill
      const comp = { minX: x, maxX: x, minY: y, maxY: y, count: 0, pixels: [] };
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
        comp.pixels.push(cur);
        const nb = [cur - w, cur + w, cur - 1, cur + 1];
        for (const n of nb) {
          if (n < 0 || n >= w * h) continue;
          if (mask[n] === 1 && label[n] === -1) {
            label[n] = areas.length;
            stack.push(n);
          }
        }
      }
      areas.push(comp);
    }
  }
  return areas;
}

function dist(a, b) {
  let d = 0;
  for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - b[k]);
  return d;
}

// k-means：每类字符聚成多个原型，覆盖旋转/粗细等形变
function kmeans(feats, k, dim) {
  const n = feats.length;
  if (n <= k) return feats.map((f) => Array.from(f));
  const centers = [...feats]
    .sort(() => Math.random() - 0.5)
    .slice(0, k)
    .map((f) => Array.from(f));
  for (let iter = 0; iter < 40; iter++) {
    const assign = feats.map((f) => {
      let bi = 0;
      let bd = Infinity;
      centers.forEach((c, i) => { const d = dist(f, c); if (d < bd) { bd = d; bi = i; } });
      return bi;
    });
    const sums = centers.map(() => new Float64Array(dim));
    const counts = centers.map(() => 0);
    feats.forEach((f, i) => {
      const ci = assign[i];
      for (let k2 = 0; k2 < dim; k2++) sums[ci][k2] += f[k2];
      counts[ci]++;
    });
    let moved = false;
    for (let i = 0; i < k; i++) {
      if (!counts[i]) continue;
      const nc = Array.from(sums[i], (v) => v / counts[i]);
      if (dist(nc, centers[i]) > 0.0001) moved = true;
      centers[i] = nc;
    }
    if (!moved) break;
  }
  return centers;
}

function cropNormalize(img, comp, targetW = FEAT_W, targetH = FEAT_H) {
  const cw = comp.maxX - comp.minX + 1;
  const ch = comp.maxY - comp.minY + 1;
  const { data } = img.bitmap;
  // 8×6 最近邻缩放（保持字符内容，不保持宽高比）
  const out = new Uint8Array(targetW * targetH);
  for (let ty = 0; ty < targetH; ty++) {
    for (let tx = 0; tx < targetW; tx++) {
      const sx = comp.minX + Math.min(cw - 1, Math.floor((tx / targetW) * cw));
      const sy = comp.minY + Math.min(ch - 1, Math.floor((ty / targetH) * ch));
      const i = (sy * img.bitmap.width + sx) * 4;
      const on = SITE.mask(data[i], data[i + 1], data[i + 2]) ? 1 : 0;
      out[ty * targetW + tx] = on;
    }
  }
  return out;
}

async function main() {
  const labelsFile = path.join(ROOT, 'labels', TARGET + '.json');
  let labels = {};
  try {
    labels = JSON.parse(readFileSync(labelsFile, 'utf8'));
  } catch (_) {
    if (DRY) console.warn(`[dry] 无 labels/${TARGET}.json，仅做分割统计`);
    else { console.error(`缺少 labels/${TARGET}.json（先标注样本）`); process.exit(1); }
  }
  const files = readdirSync(path.join(ROOT, SITE.dir))
    .filter((f) => f.endsWith(SITE.ext))
    .sort();
  const stats = { total: files.length, chars: 0, failed: 0, compHist: {} };
  const labeledIds = Object.keys(labels).sort();
  const VALIDATE = !FULL && labeledIds.length >= 10;
  const validSet = VALIDATE ? new Set(labeledIds.slice(Math.floor(labeledIds.length * 0.8))) : new Set();
  const examples = []; // { ch, feat, valid }
  const charCentroids = new Map(); // char -> { sum: Float64Array, count }

  for (const f of files) {
    const id = f.slice(0, 3);
    const label = labels[id];
    try {
      const img = await loadSample(path.join(ROOT, SITE.dir, f));
      const { w, h, mask } = extractMask(img);
      const n = label ? label.length : 0;
      let comps;
      if (SITE.split === 'projection') {
        comps = splitByVerticalProjection({ w, h, mask }, n);
      } else {
        // 面积过滤去噪点，按面积取前 N 个字符连通域，再按 x 排序
        const compsAll = connectedComponents({ w, h, mask })
          .filter((c) => c.count >= 6)
          .sort((a, b) => b.count - a.count);
        comps = compsAll.slice(0, n).sort((a, b) => a.minX - b.minX);
        stats.compRaw = (stats.compRaw || {});
        stats.compRaw[compsAll.length] = (stats.compRaw[compsAll.length] || 0) + 1;
      }
      stats.compHist[n] = (stats.compHist[n] || 0) + 1;
      if (label) {
        const picked = comps.slice(0, n);
        if (picked.length < n) { stats.failed++; continue; }
        for (let i = 0; i < n; i++) {
          const feat = cropNormalize(img, picked[i]);
          const ch = String(label[i] || '').toLowerCase();
          if (!ch) continue;
          stats.chars++;
          const valid = validSet.has(id);
          examples.push({ ch, feat, valid, sampleId: id });
          if (!valid) {
            if (!charCentroids.has(ch)) {
              charCentroids.set(ch, { sum: new Float64Array(FEAT_W * FEAT_H), count: 0 });
            }
            const c = charCentroids.get(ch);
            for (let k = 0; k < feat.length; k++) c.sum[k] += feat[k];
            c.count++;
          }
        }
      }
    } catch (e) {
      stats.failed++;
      console.warn(`[${id}] error: ${e.message}`);
    }
  }
  console.log(`样本 ${stats.total}，标注字符 ${stats.chars}，失败 ${stats.failed}`);
  console.log('原始连通域数分布:', stats.compRaw || {});
  console.log('取前N后分布:', stats.compHist);

  if (DRY || !labels || Object.keys(labels).length === 0) {
    console.log('[dry] 预处理与分割验证通过，标注后运行 node train.mjs ' + TARGET);
    return;
  }

  const charSamples = new Map(); // char -> Float64Array[]
  for (const ex of examples) {
    if (ex.valid) continue;
    if (!charSamples.has(ex.ch)) charSamples.set(ex.ch, []);
    charSamples.get(ex.ch).push(ex.feat);
  }
  // 聚合质心（每类 k 个模板）并输出模型
  const model = { site: TARGET, size: [FEAT_W, FEAT_H], k: K, chars: [] };
  for (const [ch, feats] of [...charSamples.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const templates = kmeans(feats, Math.min(K, feats.length), FEAT_W * FEAT_H).map((t) =>
      Array.from(t, (v) => Math.round(v * 255)));
    model.chars.push({ c: ch, n: feats.length, templates });
  }
  mkdirSync(path.join(ROOT, 'model'), { recursive: true });
  const outFile = path.join(ROOT, 'model', TARGET + '.json');
  writeFileSync(outFile, JSON.stringify(model));
  console.log(`模型已生成: ${outFile}（${model.chars.length} 类）`);

  // 训练集自检 + 留出验证：最近模板距离识别
  const recognize = (feat) => {
    let best = null;
    let bestD = Infinity;
    for (const m of model.chars) {
      for (const t of m.templates) {
        let d = 0;
        for (let k = 0; k < feat.length; k++) d += Math.abs(feat[k] * 255 - t[k]);
        if (d < bestD) { bestD = d; best = m.c; }
      }
    }
    return best;
  };
  if (examples.length) {
    let hit = 0;
    for (const ex of examples) {
      if (recognize(ex.feat) === ex.ch) hit++;
    }
    console.log(`训练集自检识别率: ${(hit / examples.length * 100).toFixed(1)}% (${hit}/${examples.length})`);
  }

  // 留出验证：后 20% 标注样本未参与训练，报告字符级与整图准确率
  const validEx = examples.filter((ex) => ex.valid);
  if (VALIDATE && validEx.length) {
    const bySample = new Map();
    let charHit = 0;
    let charTotal = 0;
    for (const ex of validEx) {
      const pred = recognize(ex.feat);
      charTotal++;
      if (pred === ex.ch) charHit++;
      const arr = bySample.get(ex.sampleId) || { label: '', pred: '' };
      arr.label += ex.ch;
      arr.pred += pred || '';
      bySample.set(ex.sampleId, arr);
    }
    let imgHit = 0;
    let imgTotal = 0;
    for (const arr of bySample.values()) {
      imgTotal++;
      if (arr.label === arr.pred) imgHit++;
    }
    console.log(`留出验证（${validSet.size} 张，未参与训练）: 字符级 ${(charHit / charTotal * 100).toFixed(1)}% (${charHit}/${charTotal})，整图 ${(imgHit / imgTotal * 100).toFixed(1)}% (${imgHit}/${imgTotal})`);
  } else if (VALIDATE) {
    console.log('[validate] 标注样本不足，无验证集');
  } else if (!FULL && labeledIds.length) {
    console.log('[note] 使用 --full 用全部标注样本训练；默认模式留出后 20% 作验证');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
