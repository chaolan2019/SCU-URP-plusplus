// 用线上 OCR 服务自动标注教务验证码样本。
// POST {"image":"<base64>"} → 解析 code（4 位小写）。并发限速，失败重试。
// 用法：node annotate-zhjw-remote.mjs [--url https://...] [--start 1] [--end 600]
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const ARGS = process.argv.slice(2);
const OCR_URL = (ARGS.find((a) => a.startsWith('--url=')) || '').split('=')[1] || 'https://ocr.yanjiangrd.site/api/ocr';
const START = Number((ARGS.find((a) => a.startsWith('--start=')) || '').split('=')[1]) || 1;
const END = Number((ARGS.find((a) => a.startsWith('--end=')) || '').split('=')[1]) || 600;
const CONCURRENCY = 4;

const DIR = path.join(ROOT, 'zhjw');
const OUT = path.join(ROOT, 'labels-auto');
mkdirSync(OUT, { recursive: true });
const outFile = path.join(OUT, 'zhjw.json');
let labels = {};
try { labels = JSON.parse(readFileSync(outFile, 'utf8')); } catch (_) {}

function parseCode(respText) {
  let result;
  try { result = JSON.parse(respText || '{}'); } catch (_) { return ''; }
  const code = String(result.code || result.data || result.text || result.result || '').trim().toLowerCase();
  if (!/^[a-z0-9]{4}$/.test(code)) return '';
  return code;
}

async function recognize(file) {
  const imgBuf = readFileSync(file);
  const b64 = imgBuf.toString('base64');
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(OCR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: b64 }),
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const code = parseCode(await res.text());
      if (code) return code;
      throw new Error('invalid code');
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return '';
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.jpg')).sort()
  .filter((f) => { const n = Number(f.slice(0, 3)); return n >= START && n <= END; });

let idx = 0;
let okCount = 0;
let failCount = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function worker() {
  while (idx < files.length) {
    const f = files[idx++];
    const id = f.slice(0, 3);
    if (labels[id]) continue; // 已标注跳过
    try {
      const code = await recognize(path.join(DIR, f));
      if (code) {
        labels[id] = code;
        okCount++;
        if (okCount % 20 === 0) {
          writeFileSync(outFile, JSON.stringify(labels, null, 2));
          console.log(`已标注 ${okCount} 张`);
        }
      } else {
        failCount++;
      }
    } catch (e) {
      failCount++;
      console.warn(`#${id} 失败: ${e.message}`);
    }
    await sleep(200);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
writeFileSync(outFile, JSON.stringify(labels, null, 2));
console.log(`完成：成功 ${okCount}，失败 ${failCount}，总计 ${Object.keys(labels).length} -> ${outFile}`);
