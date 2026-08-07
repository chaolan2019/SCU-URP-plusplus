// 教务系统验证码本地 OCR 模块（zhjw）v3
// - 预处理: HSV 红色掩码（免疫黑线涂抹）
// - 切割: 固定窗口切割（训练集统计字符中心）
// - 识别: 深度可分离微型 CNN（27 类，int16 量化）
// - 置信度: softmax 最大概率，低置信由调用方走线上 OCR 兜底
// 模型内嵌（zhjw-model.json，由 ocr-training/ 训练导出），零网络请求。

import modelJson from './zhjw-model.json' with { type: 'json' };

const W = 180;
const H = 60;

function dequant(b64, scale, zero, dtype) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  if (dtype === 'int16') {
    const n = Math.floor(buf.length / 2);
    const arr = new Int16Array(n);
    for (let i = 0; i < n; i++) arr[i] = buf[i * 2] | (buf[i * 2 + 1] << 8);
    return Array.from(arr, (v) => (v - zero) * scale);
  }
  return Array.from(new Int8Array(buf.buffer, 0, buf.length), (v) => (v - zero) * scale);
}

const MODEL = {
  chars: modelJson.chars,
  layers: modelJson.layers.map((L) => L.type === 'conv'
    ? {
        type: 'conv', name: L.name, out_c: L.out_c, in_c: L.in_c, k: L.k, groups: L.groups || 1,
        dtype: L.dtype || 'int8',
        w: dequant(L.w, L.w_scale, L.w_zero, L.dtype),
        b: dequant(L.b, L.b_scale, L.b_zero, L.dtype),
      }
    : { type: 'fc', name: L.name, in: L.in, out: L.out, dtype: L.dtype || 'int8', w: dequant(L.w, L.w_scale, L.w_zero, L.dtype), b: dequant(L.b, L.b_scale, L.b_zero, L.dtype) }),
};

// ---- HSV 红色掩码（复现 cv2 BGR2HSV：H uint8 截断 floor） ----
function hsvRedMask(pixels) {
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = pixels[i * 4] / 255, g = pixels[i * 4 + 1] / 255, b = pixels[i * 4 + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const diff = mx - mn;
    let h = 0;
    if (diff !== 0) {
      if (mx === r) h = ((g - b) / diff) % 6;
      else if (mx === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
      h *= 60;
      if (h < 0) h += 360;
      h = Math.floor(h / 2);
    }
    const s = mx === 0 ? 0 : Math.floor((diff / mx) * 255);
    const inRed = (h >= 170 && h <= 179 && s >= 50) || (h >= 0 && h <= 12 && s >= 50);
    mask[i] = inRed ? 1 : 0;
  }
  return mask;
}

// 固定窗口切割 → 改为 k-means 聚类切割（复现 Python eval cluster4）
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// 一维 k-means（KMEANS_PP 初始化 + Lloyd 迭代，attempts 取最优）
function kmeans1D(xs, K, rng, attempts = 10) {
  let bestCompact = Infinity, bestLabels = null, bestCenters = null;
  const n = xs.length;
  for (let a = 0; a < attempts; a++) {
    // KMEANS_PP 初始化
    const centers = [xs[(rng() * n) | 0]];
    while (centers.length < K) {
      const dists = new Float64Array(n);
      let total = 0;
      for (let i = 0; i < n; i++) {
        let bd = Infinity;
        for (const c of centers) { const d = (xs[i] - c) * (xs[i] - c); if (d < bd) bd = d; }
        dists[i] = bd;
        total += bd;
      }
      let r = rng() * total, pick = n - 1;
      for (let i = 0; i < n; i++) { r -= dists[i]; if (r <= 0) { pick = i; break; } }
      centers.push(xs[pick]);
    }
    // Lloyd 迭代
    const labels = new Int32Array(n);
    let c2 = centers.slice();
    for (let iter = 0; iter < 100; iter++) {
      let changed = false;
      for (let i = 0; i < n; i++) {
        let bi = 0, bd = Infinity;
        for (let k = 0; k < K; k++) {
          const d = (xs[i] - c2[k]) * (xs[i] - c2[k]);
          if (d < bd) { bd = d; bi = k; }
        }
        if (labels[i] !== bi) { labels[i] = bi; changed = true; }
      }
      if (!changed) break;
      for (let k = 0; k < K; k++) {
        let sum = 0, cnt = 0;
        for (let i = 0; i < n; i++) if (labels[i] === k) { sum += xs[i]; cnt++; }
        if (cnt) c2[k] = sum / cnt;
      }
    }
    // 紧凑度
    let comp = 0;
    for (let i = 0; i < n; i++) comp += (xs[i] - c2[labels[i]]) * (xs[i] - c2[labels[i]]);
    if (comp < bestCompact) { bestCompact = comp; bestLabels = labels; bestCenters = c2; }
  }
  return { labels: bestLabels, centers: bestCenters };
}

function segmentChars(mask) {
  const xs = [], ys = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (mask[y * W + x]) { xs.push(x); ys.push(y); }
  }
  if (xs.length < 20) return null;
  const { labels, centers } = kmeans1D(xs, 4, seededRandom(42));
  // 按中心排序，映射旧簇号 → 顺序号
  const order = centers.map((c, i) => i).sort((a, b) => centers[a] - centers[b]);
  const mapId = new Int32Array(4);
  order.forEach((oldId, newId) => { mapId[oldId] = newId; });
  // 每簇 bounds
  const bounds = [];
  for (let cid = 0; cid < 4; cid++) {
    let x1 = W, x2 = 0, y1 = H, y2 = 0, cnt = 0;
    for (let i = 0; i < xs.length; i++) {
      if (mapId[labels[i]] !== cid) continue;
      const x = xs[i], y = ys[i];
      if (x < x1) x1 = x;
      if (x > x2) x2 = x;
      if (y < y1) y1 = y;
      if (y > y2) y2 = y;
      cnt++;
    }
    if (cnt === 0) return null;
    const bw = x2 - x1;
    if (bw < 6 || bw > 50) return null; // 与 Python cluster4 一致
    bounds.push({ x1, x2, y1, y2 });
  }
  bounds.sort((a, b) => a.x1 - b.x1);
  return bounds;
}

// cv2 INTER_CUBIC 双三次插值（a=-0.5 三次卷积，中心对齐坐标）
function bicubicKernel(x) {
  x = Math.abs(x);
  if (x <= 1) return (1.5 * x - 2.5) * x * x + 1;
  if (x < 2) return ((-0.5 * x + 2.5) * x - 4) * x + 2;
  return 0;
}

// 对单通道（B/G/R 之一）双三次缩放到 32×32，返回 Float32Array(dw*dh)
function bicubicChannel(src, sw, sh, dw, dh, ch, srcBpp) {
  const out = new Float32Array(dw * dh);
  const scaleX = sw / dw, scaleY = sh / dh;
  for (let dy = 0; dy < dh; dy++) {
    const srcY = (dy + 0.5) * scaleY - 0.5;
    const y0 = Math.floor(srcY);
    for (let dx = 0; dx < dw; dx++) {
      const srcX = (dx + 0.5) * scaleX - 0.5;
      const x0 = Math.floor(srcX);
      let sum = 0, wsum = 0;
      for (let m = -1; m <= 2; m++) {
        const wy = bicubicKernel(srcY - (y0 + m));
        if (wy === 0) continue;
        const sy = Math.min(sh - 1, Math.max(0, y0 + m));
        for (let n = -1; n <= 2; n++) {
          const wx = bicubicKernel(srcX - (x0 + n));
          if (wx === 0) continue;
          const sx = Math.min(sw - 1, Math.max(0, x0 + n));
          sum += wx * wy * src[(sy * sw + sx) * srcBpp + ch];
          wsum += wx * wy;
        }
      }
      out[dy * dw + dx] = wsum ? sum / wsum : 0;
    }
  }
  return out;
}

function cropResize(imgData, box) {
  const { x1, x2, y1, y2 } = box;
  const padX = 4, padY = 5;
  const sx1 = Math.max(0, x1 - padX), sx2 = Math.min(W - 1, x2 + padX);
  const sy1 = Math.max(0, y1 - padY), sy2 = Math.min(H - 1, y2 + padY);
  const cw = sx2 - sx1 + 1, ch = sy2 - sy1 + 1;
  // 提取裁剪区域（RGBA）
  const crop = new Float32Array(cw * ch * 4);
  for (let y = sy1; y <= sy2; y++) for (let x = sx1; x <= sx2; x++) {
    const si = (y * W + x) * 4;
    const di = ((y - sy1) * cw + (x - sx1)) * 4;
    crop[di] = imgData[si]; crop[di + 1] = imgData[si + 1]; crop[di + 2] = imgData[si + 2]; crop[di + 3] = 255;
  }
  // 对 crop 双三次缩放到 32×32；RGBA 中 B=data[2], G=data[1], R=data[0]
  // 输出按 Python BGR 通道序：out[0..]=B, out[1024..]=G, out[2048..]=R
  const b = bicubicChannel(crop, cw, ch, 32, 32, 2, 4);
  const g = bicubicChannel(crop, cw, ch, 32, 32, 1, 4);
  const r = bicubicChannel(crop, cw, ch, 32, 32, 0, 4);
  const out = new Float32Array(3 * 32 * 32);
  for (let i = 0; i < 1024; i++) {
    out[i] = b[i] / 255;
    out[1024 + i] = g[i] / 255;
    out[2048 + i] = r[i] / 255;
  }
  return out;
}

function conv2d(x, L, inH, inW, doPool) {
  const { out_c, in_c, k, groups, w, b } = L;
  const outH = inH, outW = inW;
  const pad = k === 1 ? 0 : 1;
  const g = groups || 1;
  const out = new Float32Array(out_c * outH * outW);
  const isDepthwise = g > 1 && in_c === 1;
  const inPerG = isDepthwise ? 1 : in_c / g;
  const outPerG = isDepthwise ? 1 : out_c / g;
  for (let oc = 0; oc < out_c; oc++) {
    const gid = Math.floor(oc / outPerG);
    const icBase = gid * inPerG;
    for (let i = 0; i < outH; i++) {
      for (let j = 0; j < outW; j++) {
        let acc = b[oc];
        for (let ic = 0; ic < inPerG; ic++) {
          const icAbs = icBase + ic;
          for (let di = -pad; di <= pad; di++) {
            const si = i + di;
            if (si < 0 || si >= inH) continue;
            const xRowBase = (icAbs * inH + si) * inW;
            let wRowBase;
            if (g > 1) {
              wRowBase = (oc * k + (di + pad)) * k;
            } else {
              wRowBase = ((oc * in_c + icAbs) * k + (di + pad)) * k;
            }
            for (let dj = -pad; dj <= pad; dj++) {
              const sj = j + dj;
              if (sj < 0 || sj >= inW) continue;
              acc += x[xRowBase + sj] * w[wRowBase + (dj + pad)];
            }
          }
        }
        out[(oc * outH + i) * outW + j] = acc;
      }
    }
  }
  if (L.name === 'stem' || L.name.endsWith('_pw')) {
    for (let i = 0; i < out.length; i++) out[i] = Math.max(0, out[i]);
  }
  if (!doPool) {
    return { data: out, h: outH, w: outW };
  }
  const pH = Math.floor(outH / 2), pW = Math.floor(outW / 2);
  const pooled = new Float32Array(out_c * pH * pW);
  for (let oc = 0; oc < out_c; oc++) {
    for (let i = 0; i < pH; i++) {
      for (let j = 0; j < pW; j++) {
        let m = -Infinity;
        const base = (oc * outH + i * 2) * outW + j * 2;
        for (let di = 0; di < 2; di++) for (let dj = 0; dj < 2; dj++) {
          const v = out[base + di * outW + dj];
          if (v > m) m = v;
        }
        pooled[(oc * pH + i) * pW + j] = m;
      }
    }
  }
  return { data: pooled, h: pH, w: pW };
}

function fc(x, L, relu) {
  const { in: inDim, out: outDim, w, b } = L;
  const out = new Float32Array(outDim);
  for (let o = 0; o < outDim; o++) {
    let acc = b[o];
    const wRow = o * inDim;
    for (let i = 0; i < inDim; i++) acc += x[i] * w[wRow + i];
    out[o] = relu ? Math.max(0, acc) : acc;
  }
  return out;
}

const LAYER_POOL = {
  'stem': true, 'ds1_dw': false, 'ds1_pw': true,
  'ds2_dw': false, 'ds2_pw': true, 'ds3_dw': false, 'ds3_pw': true,
};

// 返回 { char, prob }，prob 为 softmax 最大概率（置信度）
function predictChar(pixels, box) {
  let x = cropResize(pixels, box);
  let h = 32, w = 32;
  for (const L of MODEL.layers) {
    if (L.type === 'conv') {
      const r = conv2d(x, L, h, w, LAYER_POOL[L.name] === true);
      x = r.data; h = r.h; w = r.w;
    } else {
      x = fc(x, L, L.out > MODEL.chars.length);
    }
  }
  let best = 0;
  let bestV = -Infinity;
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    const e = Math.exp(x[i]);
    sum += e;
    if (x[i] > bestV) { bestV = x[i]; best = i; }
  }
  return { char: MODEL.chars[best], prob: Math.exp(bestV) / sum };
}

// 识别教务验证码：imgData 为 ImageData（180×60）；返回 { code, conf }，失败返回 null
export function recognizeZhjwCaptchaData(imgData) {
  const mask = hsvRedMask(imgData.data);
  const boxes = segmentChars(mask);
  if (!boxes || boxes.length !== 4) return null;
  let code = '';
  let conf = 1;
  for (const box of boxes) {
    const r = predictChar(imgData.data, box);
    code += r.char;
    conf *= r.prob;
  }
  return { code, conf };
}

// 接收 HTMLImageElement（与统一认证一致的调用方式），内部绘制到 180×60 canvas
export function recognizeZhjwCaptcha(image) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(image, 0, 0, W, H);
    return recognizeZhjwCaptchaData(ctx.getImageData(0, 0, W, H));
  } catch (_) {
    return null;
  }
}
