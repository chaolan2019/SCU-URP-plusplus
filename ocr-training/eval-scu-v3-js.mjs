// scu-id v3 集成验证：用 src/assist/scu-id-v3-model.json + v3 管线跑 210 张标注
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const modelJson = JSON.parse(readFileSync(path.join(ROOT, '../src/assist/scu-id-v3-model.json'), 'utf8'));
const labels = JSON.parse(readFileSync(path.join(ROOT, 'labels/scu-id.json'), 'utf8'));

const LINE_R = 111, LINE_G = 110, LINE_B = 112, LINE_TOL = 10;
const QUANT = 8, WHITE = 250;
const CHAR_H = 8, CHAR_W = 6;
const AR_WEIGHT = 25, MAX_AR = 2;

const CHARS = modelJson.chars;
const bin = Uint8Array.from(Buffer.from(modelJson.tpl, 'base64'));
const TEMPLATES = [];
for (let i = 0; i < CHARS.length; i++) {
  const t = [];
  for (let j = 0; j < 49; j++) t.push(bin[i * 49 + j] / 255);
  TEMPLATES.push(t);
}

function segmentAndExtract(img) {
  const { width: w, height: h, data } = img.bitmap;
  const len = w * h;
  const charPixels = [];
  for (let i = 0; i < len; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const isLine = Math.abs(r - LINE_R) <= LINE_TOL && Math.abs(g - LINE_G) <= LINE_TOL && Math.abs(b - LINE_B) <= LINE_TOL;
    if (isLine) continue;
    if (r > WHITE && g > WHITE && b > WHITE) continue;
    charPixels.push({ x: i % w, y: (i / w) | 0, r, g, b });
  }
  if (charPixels.length < 20) return [];
  const quant = new Map();
  for (const px of charPixels) {
    const key = `${Math.floor(px.r / QUANT) * QUANT},${Math.floor(px.g / QUANT) * QUANT},${Math.floor(px.b / QUANT) * QUANT}`;
    const e = quant.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    e.r += px.r; e.g += px.g; e.b += px.b; e.n++;
    quant.set(key, e);
  }
  const centers = [...quant.values()].sort((a, b) => b.n - a.n).slice(0, 4)
    .map((e) => ({ r: Math.round(e.r / e.n), g: Math.round(e.g / e.n), b: Math.round(e.b / e.n) }));
  const labelsArr = new Int32Array(len).fill(-1);
  for (const px of charPixels) {
    let bi = 0, bd = Infinity;
    for (let c = 0; c < centers.length; c++) {
      const d = (px.r - centers[c].r) ** 2 + (px.g - centers[c].g) ** 2 + (px.b - centers[c].b) ** 2;
      if (d < bd) { bd = d; bi = c; }
    }
    labelsArr[px.y * w + px.x] = bi;
  }
  const chars = [];
  for (let c = 0; c < centers.length; c++) {
    let x1 = w, y1 = h, x2 = 0, y2 = 0, n = 0;
    for (const px of charPixels) {
      if (labelsArr[px.y * w + px.x] !== c) continue;
      if (px.x < x1) x1 = px.x;
      if (px.x > x2) x2 = px.x;
      if (px.y < y1) y1 = px.y;
      if (px.y > y2) y2 = px.y;
      n++;
    }
    if (n < 5) continue;
    chars.push({ x1, y1, x2, y2 });
  }
  chars.sort((a, b) => (a.x1 + a.x2) / 2 - (b.x1 + b.x2) / 2);
  if (chars.length !== 4) return [];
  const feats = [];
  for (const box of chars) {
    const cw = box.x2 - box.x1 + 1, ch = box.y2 - box.y1 + 1;
    const feat = new Float64Array(49);
    for (let sy = 0; sy < CHAR_H; sy++) {
      const srcY = box.y1 + Math.min(ch - 1, Math.floor((sy / CHAR_H) * ch));
      for (let sx = 0; sx < CHAR_W; sx++) {
        const srcX = box.x1 + Math.min(cw - 1, Math.floor((sx / CHAR_W) * cw));
        const i = (srcY * w + srcX) * 4;
        const gray = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        feat[sy * CHAR_W + sx] = gray < 0.7 ? 1 : 0;
      }
    }
    feat[48] = Math.min(1, (cw / Math.max(ch, 1)) / MAX_AR);
    feats.push(feat);
  }
  return feats;
}

function classify(feat) {
  let best = 0, bestD = Infinity;
  for (let c = 0; c < TEMPLATES.length; c++) {
    const t = TEMPLATES[c];
    let d = 0;
    for (let i = 0; i < 48; i++) { const dd = feat[i] - t[i]; d += dd * dd; }
    const ar = feat[48] - t[48];
    d += AR_WEIGHT * ar * ar;
    if (d < bestD) { bestD = d; best = c; }
  }
  return CHARS[best];
}

let imgHit = 0, charHit = 0, charTotal = 0, segFail = 0;
const errs = [];
for (const [id, label] of Object.entries(labels)) {
  const img = await Jimp.read(path.join(ROOT, 'scu-id', id + '.png'));
  const feats = segmentAndExtract(img);
  if (feats.length !== 4) { segFail++; errs.push(`${id}: ${label} -> SEG_FAIL`); continue; }
  let pred = '';
  for (const f of feats) pred += classify(f);
  if (pred === label) imgHit++;
  else errs.push(`${id}: ${label} -> ${pred}`);
  for (let k = 0; k < 4; k++) { charTotal++; if (pred[k] === label[k]) charHit++; }
}
const n = Object.keys(labels).length;
console.log(`scu-id v3 集成验证（${n} 张标注）:`);
console.log(`整图: ${imgHit}/${n} = ${(imgHit / n * 100).toFixed(1)}%  (seg_fail=${segFail})`);
console.log(`字符: ${charHit}/${charTotal} = ${(charHit / charTotal * 100).toFixed(1)}%`);
if (errs.length) { console.log(`错误 ${errs.length}:`); for (const e of errs.slice(0, 15)) console.log(' ', e); }
