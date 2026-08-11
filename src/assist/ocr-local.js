// 本地验证码识别：统一认证（scu-id）v3 质心模板匹配。
// 管线：去灰线（固定色 (111,110,112)±10）→ 收集非白像素 → 颜色量化 top-4 分割 →
//       6×8 二值（灰度 <0.7）→ 49 维特征（48 像素 + 宽高比）→ 质心模板匹配。
// 模型由 ocr-training/ 训练生成（v3 compact 格式），内嵌于此，零网络请求。

import v3Model from './scu-id-v3-model.json' with { type: 'json' };

const CHAR_W = 6;
const CHAR_H = 8;
const FEAT_DIM = CHAR_W * CHAR_H;
const FEAT_DIM_WITH_AR = FEAT_DIM + 1;
const AR_WEIGHT = 25;
const MAX_ASPECT_RATIO = 2;

// 灰线固定色（验证码生成代码 fill="#6f6e70"），JPEG 压缩容差 ±10
const LINE_R = 111;
const LINE_G = 110;
const LINE_B = 112;
const LINE_TOL = 10;
const QUANT_STEP = 8;
const WHITE_THRESHOLD = 250;

const IMG_W = 80;
const IMG_H = 26;

// 解码 v3 compact 模型：32 类 × 49 字节（48 像素 + 1 AR），/255 归一化
const CHARS = v3Model.chars;
const TEMPLATES = (() => {
  const bin = Uint8Array.from(atob(v3Model.tpl), (c) => c.charCodeAt(0));
  const ts = [];
  for (let i = 0; i < CHARS.length; i++) {
    const t = [];
    for (let j = 0; j < 49; j++) t.push(bin[i * 49 + j] / 255);
    ts.push(t);
  }
  return ts;
})();

function loadRgb(image) {
  const canvas = document.createElement('canvas');
  canvas.width = IMG_W;
  canvas.height = IMG_H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, IMG_W, IMG_H);
  ctx.drawImage(image, 0, 0, IMG_W, IMG_H);
  return ctx.getImageData(0, 0, IMG_W, IMG_H).data;
}

function isLineColor(r, g, b) {
  return Math.abs(r - LINE_R) <= LINE_TOL && Math.abs(g - LINE_G) <= LINE_TOL && Math.abs(b - LINE_B) <= LINE_TOL;
}

// 1. 去灰线 + 2. 收集非白像素 + 3. 颜色量化 top-4 + 4. 归属
function segmentByColor(rgba) {
  const len = IMG_W * IMG_H;
  const pixels = [];
  for (let i = 0; i < len; i++) {
    const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2];
    if (isLineColor(r, g, b)) continue; // 灰线 → 白
    if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) continue; // 白背景
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
  // 5. 每色 bbox，x 中心排序
  const chars = [];
  for (let c = 0; c < centers.length; c++) {
    let x1 = IMG_W, y1 = IMG_H, x2 = 0, y2 = 0, n = 0;
    for (let i = 0; i < len; i++) {
      if (labels[i] !== c) continue;
      const x = i % IMG_W, y = (i / IMG_W) | 0;
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

// 6. 二值化（灰度 <0.7 → 1）+ 7. 6×8 缩放（最近邻，src = floor(dst*scale)）+ 8. 49 维特征
function extractFeature(rgba, box) {
  const cw = box.x2 - box.x1 + 1;
  const ch = box.y2 - box.y1 + 1;
  const feat = new Float64Array(FEAT_DIM_WITH_AR);
  for (let sy = 0; sy < CHAR_H; sy++) {
    const srcY = box.y1 + Math.min(ch - 1, Math.floor((sy / CHAR_H) * ch));
    for (let sx = 0; sx < CHAR_W; sx++) {
      const srcX = box.x1 + Math.min(cw - 1, Math.floor((sx / CHAR_W) * cw));
      const i = (srcY * IMG_W + srcX) * 4;
      const gray = (0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]) / 255;
      feat[sy * CHAR_W + sx] = gray < 0.7 ? 1 : 0;
    }
  }
  feat[FEAT_DIM] = Math.min(1, (cw / Math.max(ch, 1)) / MAX_ASPECT_RATIO);
  return feat;
}

// 9. 质心匹配：Σ(px_diff²) + 25×(ar_diff²)
function classify(feat) {
  let best = 0;
  let bestD = Infinity;
  for (let c = 0; c < TEMPLATES.length; c++) {
    const t = TEMPLATES[c];
    let d = 0;
    for (let i = 0; i < FEAT_DIM; i++) {
      const dd = feat[i] - t[i];
      d += dd * dd;
    }
    const ar = feat[FEAT_DIM] - t[FEAT_DIM];
    d += AR_WEIGHT * ar * ar;
    if (d < bestD) { bestD = d; best = c; }
  }
  return CHARS[best];
}

// 识别统一认证验证码：image 为已加载的 HTMLImageElement；成功返回小写文本，失败返回 null
export function recognizeLocalCaptcha(image) {
  try {
    const rgba = loadRgb(image);
    const chars = segmentByColor(rgba);
    if (chars.length !== 4) return null;
    let text = '';
    for (const box of chars) {
      const c = classify(extractFeature(rgba, box));
      if (!c) return null;
      text += c;
    }
    return text;
  } catch (_) {
    return null;
  }
}
