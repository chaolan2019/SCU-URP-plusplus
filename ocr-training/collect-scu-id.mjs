// 统一身份认证验证码样本收集：
// GET https://id.scu.edu.cn/api/public/bff/v1.2/one_time_login/captcha?_enterprise_id=scdx
// 返回 JSON { data: { captcha: <base64 png> } }，解码保存；每张间隔 200ms。
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'scu-id');
const COUNT = Number(process.argv[2]) || 100;
const BASE = 'https://id.scu.edu.cn/api/public/bff/v1.2/one_time_login/captcha?_enterprise_id=scdx&timestamp=';

mkdirSync(OUT, { recursive: true });

async function fetchCaptcha() {
  const res = await fetch(BASE + Date.now(), { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const b64 = json && json.data && json.data.captcha;
  if (!b64) throw new Error('no captcha field in response');
  const buf = Buffer.from(b64, 'base64');
  if (buf.length < 200 || !(buf[0] === 0x89 && buf[1] === 0x50)) {
    throw new Error(`unexpected payload ${buf.length}B`);
  }
  return buf;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0;
let fail = 0;
let skip = 0;
for (let i = 1; i <= COUNT; i++) {
  const file = path.join(OUT, String(i).padStart(3, '0') + '.png');
  if (existsSync(file)) { skip++; continue; }
  try {
    const buf = await fetchCaptcha();
    writeFileSync(file, buf);
    ok++;
    if (i % 10 === 0) console.log(`collected ${i}/${COUNT}`);
  } catch (e) {
    fail++;
    console.warn(`#${i} failed: ${e.message}`);
  }
  await sleep(200);
}
console.log(`done: ${ok} ok, ${fail} fail, ${skip} skipped -> ${OUT}`);
