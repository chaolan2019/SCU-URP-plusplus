// 教务系统验证码样本收集：
// 1. GET http://zhjw.scu.edu.cn/login 拿 session cookie（student.urpSoft.cn / XUANKE_LB）
// 2. GET http://zhjw.scu.edu.cn/img/captcha.jpg 带 cookie 抓图（JPEG）
// 每张间隔 250ms，失败重试 3 次，已存在自动跳过（支持续拉）。
// 用法：node collect-zhjw.mjs [数量=600]
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'zhjw');
const COUNT = Number(process.argv[2]) || 600;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getSessionCookies() {
  const res = await fetch('http://zhjw.scu.edu.cn/login', {
    headers: { 'User-Agent': UA },
    redirect: 'follow',
    cache: 'no-store',
  });
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
  return setCookies.map((c) => c.split(';')[0]).join('; ');
}

async function fetchCaptcha(cookies) {
  const res = await fetch('http://zhjw.scu.edu.cn/img/captcha.jpg', {
    headers: {
      'User-Agent': UA,
      'Cookie': cookies,
      'Referer': 'http://zhjw.scu.edu.cn/login',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('image')) throw new Error(`unexpected content-type ${ct}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 300 || !(buf[0] === 0xff && buf[1] === 0xd8)) {
    throw new Error(`unexpected payload ${buf.length}B`);
  }
  return buf;
}

let ok = 0, fail = 0, skip = 0;
let cookies = await getSessionCookies().catch(() => '');
for (let i = 1; i <= COUNT; i++) {
  const file = path.join(OUT, String(i).padStart(3, '0') + '.jpg');
  if (existsSync(file)) { skip++; continue; }
  let buf = null;
  for (let attempt = 1; attempt <= 3 && !buf; attempt++) {
    try {
      buf = await fetchCaptcha(cookies);
    } catch (e) {
      if (attempt === 3) {
        cookies = await getSessionCookies().catch(() => '');
        try { buf = await fetchCaptcha(cookies); } catch (e2) { console.warn(`#${i} failed: ${e.message} / ${e2.message}`); }
      } else {
        await sleep(500);
      }
    }
  }
  if (buf) {
    writeFileSync(file, buf);
    ok++;
    if (i % 25 === 0) console.log(`collected ${i}/${COUNT}`);
  } else {
    fail++;
  }
  await sleep(250);
}
console.log(`done: ${ok} ok, ${fail} fail, ${skip} skipped -> ${OUT}`);
