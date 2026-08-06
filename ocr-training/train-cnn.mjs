// 教务验证码 CNN 训练：端到端整图识别（不做显式分割）。
// 网络：conv(8) → pool → conv(16) → pool → fc128 → fc(5×37 softmax)
// 输入：红色掩码缩放到 60×20；标签 5 位（4 位补空位，37 类/位）。
// 纯 JS 实现前向/反向传播 + Adam，留出验证整图准确率。
// 用法：node train-cnn.mjs [--epochs N] [--lr X]
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const ARGS = process.argv.slice(2);
const EPOCHS = Number((ARGS.find((a) => a.startsWith('--epochs=')) || '').split('=')[1]) || 120;
const LR = Number((ARGS.find((a) => a.startsWith('--lr=')) || '').split('=')[1]) || 0.01;
const CLEAN_ROUNDS = Number((ARGS.find((a) => a.startsWith('--clean=')) || '').split('=')[1]) || 0;
const SAVE_EVERY = 20;

const IW = 60, IH = 20;          // 输入
const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyz'; // 36
const NUM_CLASSES = CHARSET.length; // 36（固定 4 位，无空位）
const MAX_LEN = 4;                // 固定 4 位（教务验证码固定 4 位）

// ---- 随机 ----
let seed = 42;
function rand() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
function gauss() { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

// ---- 张量工具（扁平数组 + 形状） ----
function zeros(n) { return new Float64Array(n); }

// ---- 网络层 ----
class Conv2d {
  constructor(inC, outC, k) {
    this.inC = inC; this.outC = outC; this.k = k;
    const scale = Math.sqrt(2 / (inC * k * k));
    this.w = zeros(outC * inC * k * k).map(() => gauss() * scale);
    this.b = zeros(outC);
    this.mw = zeros(this.w.length); this.vw = zeros(this.w.length);
    this.mb = zeros(outC); this.vb = zeros(outC);
  }
  // x: Float64Array [inC*H*W], 返回 [outC*(H-k+1)*(W-k+1)]
  forward(x, H, W) {
    const { inC, outC, k } = this;
    const OH = H - k + 1, OW = W - k + 1;
    const out = zeros(outC * OH * OW);
    for (let oc = 0; oc < outC; oc++) {
      for (let oy = 0; oy < OH; oy++) {
        for (let ox = 0; ox < OW; ox++) {
          let sum = this.b[oc];
          for (let ic = 0; ic < inC; ic++) {
            for (let ky = 0; ky < k; ky++) {
              for (let kx = 0; kx < k; kx++) {
                sum += x[(ic * H + (oy + ky)) * W + (ox + kx)] * this.w[((oc * inC + ic) * k + ky) * k + kx];
              }
            }
          }
          out[(oc * OH + oy) * OW + ox] = sum;
        }
      }
    }
    return { out, H: OH, W: OW };
  }
  backward(gradOut, x, H, W, OH, OW) {
    const { inC, outC, k } = this;
    const dw = zeros(this.w.length);
    const db = zeros(outC);
    const dx = zeros(x.length);
    for (let oc = 0; oc < outC; oc++) {
      for (let oy = 0; oy < OH; oy++) {
        for (let ox = 0; ox < OW; ox++) {
          const g = gradOut[(oc * OH + oy) * OW + ox];
          db[oc] += g;
          for (let ic = 0; ic < inC; ic++) {
            for (let ky = 0; ky < k; ky++) {
              for (let kx = 0; kx < k; kx++) {
                const xi = (ic * H + (oy + ky)) * W + (ox + kx);
                dw[((oc * inC + ic) * k + ky) * k + kx] += g * x[xi];
                dx[xi] += g * this.w[((oc * inC + ic) * k + ky) * k + kx];
              }
            }
          }
        }
      }
    }
    return { dw, db, dx };
  }
  adam(lr, t) {
    const b1 = 0.9, b2 = 0.999, eps = 1e-8;
    for (let i = 0; i < this.w.length; i++) {
      this.mw[i] = b1 * this.mw[i] + (1 - b1) * this.dw[i];
      this.vw[i] = b2 * this.vw[i] + (1 - b2) * this.dw[i] * this.dw[i];
      this.w[i] -= lr * this.mw[i] / (1 - Math.pow(b1, t)) / (Math.sqrt(this.vw[i] / (1 - Math.pow(b2, t))) + eps);
    }
    for (let i = 0; i < this.b.length; i++) {
      this.mb[i] = b1 * this.mb[i] + (1 - b1) * this.db[i];
      this.vb[i] = b2 * this.vb[i] + (1 - b2) * this.db[i] * this.db[i];
      this.b[i] -= lr * this.mb[i] / (1 - Math.pow(b1, t)) / (Math.sqrt(this.vb[i] / (1 - Math.pow(b2, t))) + eps);
    }
  }
}

function maxPool2(x, H, W, pool = 2) {
  const OH = Math.floor(H / pool), OW = Math.floor(W / pool);
  const C = x.length / (H * W);
  const out = zeros(C * OH * OW);
  const idx = new Int32Array(C * OH * OW);
  for (let c = 0; c < C; c++) {
    for (let oy = 0; oy < OH; oy++) {
      for (let ox = 0; ox < OW; ox++) {
        let best = -Infinity, bi = 0;
        for (let py = 0; py < pool; py++) {
          for (let px = 0; px < pool; px++) {
            const i = (c * H + oy * pool + py) * W + ox * pool + px;
            if (x[i] > best) { best = x[i]; bi = i; }
          }
        }
        out[(c * OH + oy) * OW + ox] = best;
        idx[(c * OH + oy) * OW + ox] = bi;
      }
    }
  }
  return { out, idx, H: OH, W: OW, pool };
}

function relu(x) { const n = x.length; const o = new Float64Array(n); for (let i = 0; i < n; i++) o[i] = x[i] > 0 ? x[i] : 0; return o; }
function reluBack(g, x) { for (let i = 0; i < x.length; i++) if (x[i] <= 0) g[i] = 0; return g; }

class Linear {
  constructor(inDim, outDim) {
    this.inDim = inDim; this.outDim = outDim;
    const scale = Math.sqrt(2 / inDim);
    this.w = zeros(inDim * outDim).map(() => gauss() * scale);
    this.b = zeros(outDim);
    this.mw = zeros(this.w.length); this.vw = zeros(this.w.length);
    this.mb = zeros(outDim); this.vb = zeros(outDim);
  }
  forward(x) {
    const { inDim, outDim } = this;
    const out = zeros(outDim);
    for (let o = 0; o < outDim; o++) {
      let sum = this.b[o];
      for (let i = 0; i < inDim; i++) sum += x[i] * this.w[i * outDim + o];
      out[o] = sum;
    }
    return out;
  }
  backward(g, x) {
    const { inDim, outDim } = this;
    const dw = zeros(this.w.length);
    const db = zeros(outDim);
    const dx = zeros(inDim);
    for (let o = 0; o < outDim; o++) {
      db[o] += g[o];
      for (let i = 0; i < inDim; i++) {
        dw[i * outDim + o] += g[o] * x[i];
        dx[i] += g[o] * this.w[i * outDim + o];
      }
    }
    return { dw, db, dx };
  }
  adam(lr, t) {
    const b1 = 0.9, b2 = 0.999, eps = 1e-8;
    for (let i = 0; i < this.w.length; i++) {
      this.mw[i] = b1 * this.mw[i] + (1 - b1) * this.dw[i];
      this.vw[i] = b2 * this.vw[i] + (1 - b2) * this.dw[i] * this.dw[i];
      this.w[i] -= lr * this.mw[i] / (1 - Math.pow(b1, t)) / (Math.sqrt(this.vw[i] / (1 - Math.pow(b2, t))) + eps);
    }
    for (let i = 0; i < this.b.length; i++) {
      this.mb[i] = b1 * this.mb[i] + (1 - b1) * this.db[i];
      this.vb[i] = b2 * this.vb[i] + (1 - b2) * this.db[i] * this.db[i];
      this.b[i] -= lr * this.mb[i] / (1 - Math.pow(b1, t)) / (Math.sqrt(this.vb[i] / (1 - Math.pow(b2, t))) + eps);
    }
  }
}

// ---- 数据准备 ----
// 输入：红色显著性 (r - max(g,b))/255，字符红突出、背景/黑线为 0，全图缩放 60×20
function redGrayToInput(img, shiftX = 0, shiftY = 0, scale = 1) {
  const { width: w, height: h, data } = img.bitmap;
  const out = new Float64Array(IW * IH);
  for (let ty = 0; ty < IH; ty++) {
    const sy = Math.max(0, Math.min(h - 1, Math.round((ty / IH) * h * scale + shiftY)));
    for (let tx = 0; tx < IW; tx++) {
      const sx = Math.max(0, Math.min(w - 1, Math.round((tx / IW) * w * scale + shiftX)));
      const i = (sy * w + sx) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      out[ty * IW + tx] = Math.max(0, (r - Math.max(g, b)) / 255);
    }
  }
  return out;
}

function labelToTarget(label) {
  const target = new Float64Array(MAX_LEN * NUM_CLASSES);
  const chars = String(label || '').toLowerCase().split('');
  for (let i = 0; i < MAX_LEN; i++) {
    const cls = CHARSET.indexOf(i < chars.length ? chars[i] : '');
    if (cls >= 0) target[i * NUM_CLASSES + cls] = 1;
  }
  return target;
}

// ---- 网络 ----
class Net {
  constructor() {
    this.conv1 = new Conv2d(1, 8, 3);
    this.conv2 = new Conv2d(8, 16, 3);
    this.fc1 = new Linear(13 * 3 * 16, 64);
    this.fc2 = new Linear(64, MAX_LEN * NUM_CLASSES);
  }
  forward(input, train = false) {
    const a1 = this.conv1.forward(input, IH, IW);          // 58×18×8
    const r1 = relu(a1.out);
    const p1 = maxPool2(r1, a1.H, a1.W);                    // 29×9×8
    const a2 = this.conv2.forward(p1.out, p1.H, p1.W);     // 27×7×16
    const r2 = relu(a2.out);
    const p2 = maxPool2(r2, a2.H, a2.W);                    // 13×3×16
    const flat = p2.out;
    const h1 = this.fc1.forward(flat);                      // 128
    const rh1 = relu(h1);
    // dropout（仅训练）
    let dropMask = null;
    let dropOut = rh1;
    if (train) {
      dropMask = new Float64Array(rh1.length);
      for (let i = 0; i < rh1.length; i++) dropMask[i] = rand() < 0.3 ? 0 : 1.4286;
      dropOut = new Float64Array(rh1.length);
      for (let i = 0; i < rh1.length; i++) dropOut[i] = rh1[i] * dropMask[i];
    }
    const logits = this.fc2.forward(dropOut);               // 185
    return { a1, r1, p1, a2, r2, p2, flat, h1, rh1, dropMask, dropOut, logits };
  }
  // softmax 交叉熵损失 + 梯度
  loss(logits, target) {
    const probs = new Float64Array(logits.length);
    let lossVal = 0;
    const grad = new Float64Array(logits.length);
    for (let p = 0; p < MAX_LEN; p++) {
      const off = p * NUM_CLASSES;
      let max = -Infinity;
      for (let c = 0; c < NUM_CLASSES; c++) if (logits[off + c] > max) max = logits[off + c];
      let sum = 0;
      for (let c = 0; c < NUM_CLASSES; c++) sum += Math.exp(logits[off + c] - max);
      for (let c = 0; c < NUM_CLASSES; c++) {
        probs[off + c] = Math.exp(logits[off + c] - max) / sum;
        grad[off + c] = probs[off + c] - target[off + c];
        if (target[off + c] === 1) lossVal -= Math.log(Math.max(1e-9, probs[off + c]));
      }
    }
    return { loss: lossVal, grad, probs };
  }
  backward(gLogits, cache) {
    const { a1, r1, p1, a2, r2, p2, flat, h1, rh1, dropMask } = cache;
    // fc2
    const gFc2 = this.fc2.backward(gLogits, dropMask ? cache.dropOut : rh1);
    let gDrop = gFc2.dx;
    if (dropMask) { for (let i = 0; i < gDrop.length; i++) gDrop[i] *= dropMask[i]; }
    const gRh1 = reluBack(gDrop, h1);
    // fc1
    const gFc1 = this.fc1.backward(gRh1, flat);
    const gP2 = gFc1.dx;
    // pool2 反池化
    const gR2 = new Float64Array(r2.length);
    for (let i = 0; i < p2.idx.length; i++) gR2[p2.idx[i]] += gP2[i];
    const gA2 = reluBack(gR2, a2.out);
    const b2 = this.conv2.backward(gA2, p1.out, p1.H, p1.W, a2.H, a2.W);
    const gP1 = b2.dx;
    const gR1 = new Float64Array(r1.length);
    for (let i = 0; i < p1.idx.length; i++) gR1[p1.idx[i]] += gP1[i];
    const gA1 = reluBack(gR1, a1.out);
    const b1 = this.conv1.backward(gA1, cacheInputRef, IH, IW, a1.H, a1.W);
    this.fc2.dw = gFc2.dw; this.fc2.db = gFc2.db;
    this.fc1.dw = gFc1.dw; this.fc1.db = gFc1.db;
    this.conv2.dw = b2.dw; this.conv2.db = b2.db;
    this.conv1.dw = b1.dw; this.conv1.db = b1.db;
  }
  adam(lr, t) {
    this.conv1.adam(lr, t); this.conv2.adam(lr, t);
    this.fc1.adam(lr, t); this.fc2.adam(lr, t);
  }
  predict(input) {
    const { logits } = this.forward(input);
    let text = '';
    for (let p = 0; p < MAX_LEN; p++) {
      const off = p * NUM_CLASSES;
      let best = 0, bv = -Infinity;
      for (let c = 0; c < NUM_CLASSES; c++) if (logits[off + c] > bv) { bv = logits[off + c]; best = c; }
      text += CHARSET[best];
    }
    return text;
  }
}

let cacheInputRef = null;

// ---- 主流程 ----
const labels = JSON.parse(readFileSync(path.join(ROOT, 'labels/zhjw.json'), 'utf8'));
// 合并：人工标注优先（更准），线上 OCR 自动标注补充
const autoLabels = JSON.parse(readFileSync(path.join(ROOT, 'labels-auto/zhjw.json'), 'utf8'));
for (const [id, l] of Object.entries(autoLabels)) {
  const v = String(l || '').toLowerCase();
  if (v.length === 4 && !labels[id]) labels[id] = v;
}
// 教务验证码固定 4 位：仅保留长度 4 的标注（009/018 疑似误标，剔除）
for (const id of Object.keys(labels)) {
  if (String(labels[id]).length !== 4) delete labels[id];
}
const files = readdirSync(path.join(ROOT, 'zhjw')).filter((f) => f.endsWith('.jpg')).sort();
const labeledIds = Object.keys(labels).sort();
const validSet = new Set(labeledIds.slice(Math.floor(labeledIds.length * 0.8)));
const trainIds = labeledIds.filter((id) => !validSet.has(id));

const imgs = new Map();
for (const id of [...trainIds, ...validSet]) {
  imgs.set(id, await Jimp.read(path.join(ROOT, 'zhjw', id + '.jpg')));
}

function augment(id) {
  // 增强：平移 / 缩放 / 随机像素噪声 / 模拟黑线涂抹挖洞
  const sx = Math.round((rand() * 2 - 1) * 3);
  const sy = Math.round((rand() * 2 - 1) * 2);
  const sc = 0.92 + rand() * 0.16;
  const input = redGrayToInput(imgs.get(id), sx, sy, sc);
  // 随机挖洞（模拟黑线遮挡字符，让网络学会识别被涂抹的字符）
  const lines = 1 + Math.floor(rand() * 2);
  for (let li = 0; li < lines; li++) {
    const y = Math.floor(rand() * IH);
    const width = 1 + Math.floor(rand() * 3);
    const bend = (rand() * 2 - 1) * 4;
    for (let x = 0; x < IW; x++) {
      const yy = Math.max(0, Math.min(IH - 1, Math.round(y + bend * Math.sin(x / 8))));
      for (let w = 0; w < width; w++) {
        const i = Math.min(IH - 1, Math.max(0, yy + w - 1)) * IW + x;
        if (i >= 0 && i < input.length) input[i] = 0;
      }
    }
  }
  if (rand() < 0.3) {
    for (let i = 0; i < input.length; i++) if (rand() < 0.02) input[i] = rand() < 0.5 ? 1 : 0;
  }
  return input;
}

const net = new Net();
let step = 0;
let bestValid = 0;

async function trainEpochs(epochs, trainIds, labelFn) {
  for (let epoch = 1; epoch <= epochs; epoch++) {
    let lossSum = 0;
    let nBatch = 0;
    const order = [...trainIds].sort(() => rand() - 0.5);
    for (const id of order) {
      const input = augment(id);
      const target = labelToTarget(labelFn(id));
      cacheInputRef = input;
      const cache = net.forward(input, true);
      const { loss, grad } = net.loss(cache.logits, target);
      lossSum += loss;
      nBatch++;
      net.backward(grad, cache);
      step++;
      net.adam(LR, step);
    }
    let validHit = 0, validCharHit = 0, validCharTotal = 0;
    let trainHit = 0;
    for (const id of validSet) {
      const input = redGrayToInput(imgs.get(id));
      const pred = net.predict(input);
      if (pred === labelFn(id)) validHit++;
      for (let i = 0; i < labelFn(id).length; i++) {
        validCharTotal++;
        if (pred[i] === labelFn(id)[i]) validCharHit++;
      }
    }
    for (const id of trainIds) {
      if (net.predict(redGrayToInput(imgs.get(id))) === labelFn(id)) trainHit++;
    }
    const validAcc = validHit / validSet.size * 100;
    const validChar = validCharTotal ? validCharHit / validCharTotal * 100 : 0;
    if (validAcc > bestValid) bestValid = validAcc;
    if (epoch % 10 === 0 || epoch === 1) {
      console.log(`epoch ${epoch}: loss ${(lossSum / nBatch).toFixed(3)} 训练整图 ${(trainHit / trainIds.length * 100).toFixed(1)}% 验证整图 ${validAcc.toFixed(1)}% (${validHit}/${validSet.size}) 字符级 ${validChar.toFixed(1)}%`);
    }
  }
}

// 迭代标签清洗：训练 → 剔除网络预测与标注不符的样本 → 重训
let currentTrain = [...trainIds];
for (let round = 0; round <= CLEAN_ROUNDS; round++) {
  console.log(`=== 训练轮次 ${round + 1}（训练集 ${currentTrain.length} 张） ===`);
  await trainEpochs(EPOCHS, currentTrain, (id) => labels[id]);
  if (round < CLEAN_ROUNDS) {
    const keep = [];
    let removed = 0;
    for (const id of currentTrain) {
      const input = redGrayToInput(imgs.get(id));
      if (net.predict(input) === labels[id]) keep.push(id);
      else removed++;
    }
    console.log(`清洗: 保留 ${keep.length}，剔除 ${removed}`);
    currentTrain = keep;
  }
}

// 导出模型
const model = {
  arch: 'cnn-v1', charset: CHARSET, maxLen: MAX_LEN, iw: IW, ih: IH,
  conv1: { w: Array.from(net.conv1.w), b: Array.from(net.conv1.b) },
  conv2: { w: Array.from(net.conv2.w), b: Array.from(net.conv2.b) },
  fc1: { w: Array.from(net.fc1.w), b: Array.from(net.fc1.b) },
  fc2: { w: Array.from(net.fc2.w), b: Array.from(net.fc2.b) },
};
mkdirSync(path.join(ROOT, 'model'), { recursive: true });
writeFileSync(path.join(ROOT, 'model/zhjw-cnn.json'), JSON.stringify(model));
console.log(`模型已导出 model/zhjw-cnn.json（最佳验证 ${bestValid.toFixed(1)}%）`);
