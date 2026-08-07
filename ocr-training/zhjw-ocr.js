/**
 * 教务系统验证码本地 OCR 模块（zhjw）v3
 * - 预处理: HSV 红色掩码（免疫黑线）
 * - 切割: k-means 聚类切 4 字符
 * - 识别: 深度可分离微型 CNN（26 类，36KB int8）
 * 体积: 模型 36KB + 推理代码 ~4KB
 */
import modelJson from '../model/zhjw-char-tiny71-int16.json';

const W = 180, H = 60;

function dequant(b64, scale, zero, dtype) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  if (dtype === 'int16') {
    // 确保长度偶数，按小端读 int16
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

// ---- HSV 红色掩码（复现 cv2 BGR2HSV：H 保持浮点，inRange 直接比较） ----
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
      h = Math.floor(h / 2); // cv2 H 0-179，uint8 截断
    }
    const s = mx === 0 ? 0 : Math.floor((diff / mx) * 255); // cv2 S uint8 截断
    const inRed = (h >= 170 && h <= 179 && s >= 50) || (h >= 0 && h <= 12 && s >= 50);
    mask[i] = inRed ? 1 : 0;
  }
  return mask;
}

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// 固定窗口切割：训练集统计的字符中心（std < 5px），窗口宽 30px（含 padding）
const CHAR_CENTERS = [56, 80, 103, 127];
const CHAR_HALF_W = 15;

function segmentChars(mask) {
  const bounds = [];
  for (let k = 0; k < 4; k++) {
    const cx = CHAR_CENTERS[k];
    const wx1 = Math.max(0, cx - CHAR_HALF_W);
    const wx2 = Math.min(W - 1, cx + CHAR_HALF_W);
    let x1 = W, x2 = 0, y1 = H, y2 = 0;
    for (let y = 0; y < H; y++) for (let x = wx1; x <= wx2; x++) {
      if (mask[y * W + x]) {
        x1 = Math.min(x1, x); x2 = Math.max(x2, x);
        y1 = Math.min(y1, y); y2 = Math.max(y2, y);
      }
    }
    if (x2 < x1) { x1 = wx1; x2 = wx2; } // 窗口内无掩码时回退到固定窗口
    bounds.push({ x1, x2, y1, y2: Math.max(y2, y1) });
  }
  return bounds;
}

function cropResize(imgData, box) {
  const { x1, x2, y1, y2 } = box;
  const padX = 4, padY = 5;
  const sx1 = Math.max(0, x1 - padX), sx2 = Math.min(W - 1, x2 + padX);
  const sy1 = Math.max(0, y1 - padY), sy2 = Math.min(H - 1, y2 + padY);
  const cw = sx2 - sx1 + 1, ch = sy2 - sy1 + 1;
  const out = new Float32Array(3 * 32 * 32);
  for (let ty = 0; ty < 32; ty++) {
    // cv2 INTER_NEAREST: src = floor(dst * scale)，scale = src/dst
    const sy = sy1 + Math.min(ch - 1, Math.floor((ty * ch) / 32));
    for (let tx = 0; tx < 32; tx++) {
      const sx = sx1 + Math.min(cw - 1, Math.floor((tx * cw) / 32));
      const i = (sy * W + sx) * 4;
      const o = ty * 32 + tx;
      // BGR 通道序（训练用 cv2 读图，Jimp 是 RGB）
      out[o] = imgData[i + 2] / 255;
      out[1 * 1024 + o] = imgData[i + 1] / 255;
      out[2 * 1024 + o] = imgData[i] / 255;
    }
  }
  return out;
}

// 卷积: 支持 groups（depthwise）。权重布局: 标准 (out_c, in_c, k, k) 展平
// depthwise 时实际存的是 (out_c, 1, k, k)（每组单输入通道）
function conv2d(x, L, inH, inW, doPool) {
  const { out_c, in_c, k, groups, w, b } = L;
  const outH = inH, outW = inW;
  const pad = k === 1 ? 0 : 1; // 1x1 卷积无 padding
  const g = groups || 1;
  const out = new Float32Array(out_c * outH * outW);
  // depthwise 时 JSON 里 in_c=1（每组单输入），g>1 时按组一对一；标准卷积 in_c=全部输入
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
            // 权重索引: depthwise 时每输出通道只有 1 个输入通道核 (k x k)
            // 权重存储为 out_c x in_c x k x k，但 depthwise 的 w 数组只有 out_c*k*k 个元素（非零部分）
            let wRowBase;
            if (g > 1) {
              // depthwise: 权重 shape (out_c, 1, k, k)，索引只按 oc 和 k
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
        out[(oc * outH + i) * outW + j] = acc; // 不在此处 ReLU，由调用层控制
      }
    }
  }
  // ReLU: 仅 stem 和 pw 层（模型结构 dw->pw->bn->relu->pool）
  if (L.name === 'stem' || L.name.endsWith('_pw')) {
    for (let i = 0; i < out.length; i++) out[i] = Math.max(0, out[i]);
  }
  // 池化：仅 doPool 层池化
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
  let best = 0, bestV = -Infinity;
  for (let i = 0; i < x.length; i++) if (x[i] > bestV) { bestV = x[i]; best = i; }
  return MODEL.chars[best];
}

export function recognizeCaptcha(imgData) {
  const mask = hsvRedMask(imgData.data);
  const boxes = segmentChars(mask);
  if (!boxes || boxes.length !== 4) return null;
  let result = '';
  for (const box of boxes) result += predictChar(imgData.data, box);
  return result;
}

if (typeof window !== 'undefined') {
  window.zhjwOcr = { recognizeCaptcha };
}
