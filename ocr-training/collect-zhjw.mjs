// 教务系统验证码样本收集：http://zhjw.scu.edu.cn/img/captcha.jpg
// 免登录直抓；每次请求带时间戳防缓存；每张间隔 200ms 避免触发限流。
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'zhjw');
const COUNT = Number(process.argv[2]) || 100;
const BASE = 'http://zhjw.scu.edu.cn/img/captcha.jpg';

mkdirSync(OUT, { recursive: true });

function fetchCaptcha() {
  return new Promise((resolve, reject) => {
    const url = `${BASE}?t=${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const req = fetch(url, { cache: 'no-store' });
    req.then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 200 || !(buf[0] === 0xFF && buf[1] === 0xD8)) {
        throw new Error(`unexpected payload ${buf.length}B`);
      }
      resolve(buf);
    }).catch(reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0;
let fail = 0;
for (let i = 1; i <= COUNT; i++) {
  try {
    const buf = await fetchCaptcha();
    writeFileSync(path.join(OUT, String(i).padStart(3, '0') + '.jpg'), buf);
    ok++;
    if (i % 10 === 0) console.log(`collected ${i}/${COUNT}`);
  } catch (e) {
    fail++;
    console.warn(`#${i} failed: ${e.message}`);
  }
  await sleep(200);
}
console.log(`done: ${ok} ok, ${fail} fail -> ${OUT}`);
