// 抓取第 6 批（061-120）
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'zhjw-v4');
const START = Number(process.argv[2]) || 61;
const COUNT = Number(process.argv[3]) || 60;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getSessionCookies() {
  const res = await fetch('http://zhjw.scu.edu.cn/login', {
    headers: { 'User-Agent': UA }, redirect: 'follow', cache: 'no-store',
  });
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
  return setCookies.map((c) => c.split(';')[0]).join('; ');
}

async function fetchCaptcha(cookies) {
  const res = await fetch('http://zhjw.scu.edu.cn/img/captcha.jpg', {
    headers: { 'User-Agent': UA, 'Cookie': cookies, 'Referer': 'http://zhjw.scu.edu.cn/login' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 300 || !(buf[0] === 0xff && buf[1] === 0xd8)) throw new Error(`bad payload ${buf.length}B`);
  return buf;
}

let ok = 0;
let cookies = await getSessionCookies().catch(() => '');
for (let i = START; i < START + COUNT; i++) {
  const file = path.join(OUT, String(i).padStart(3, '0') + '.jpg');
  if (existsSync(file)) { ok++; continue; }
  try {
    writeFileSync(file, await fetchCaptcha(cookies));
    ok++;
  } catch (e) {
    cookies = await getSessionCookies().catch(() => '');
    try { writeFileSync(file, await fetchCaptcha(cookies)); ok++; } catch (e2) { console.warn(`#${i}: ${e2.message}`); }
  }
  await sleep(250);
}
console.log(`done: ${ok}/${COUNT} -> ${OUT} (${START}-${START + COUNT - 1})`);
