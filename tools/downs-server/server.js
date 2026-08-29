// URP++ 下载计数服务（P3-4，方案A：假名上报 + 实时查询）
// 零依赖：任何装了 Node.js 的机器上 `node server.js` 直接跑。
//
//   GET  /downs/salt    → {"salt":"..."}          去重盐（首次启动自动生成，固定不变）
//   POST /downs         body {"id","uid"}          假名上报（(id,uid) 幂等，重复覆盖时间戳）
//   GET  /downs?ids=a,b → {"a":3,"b":0}            批量查计数（uid 去重后的数量）
//   GET  /downs/health  → "ok"                     探活
//
// 数据：JSON 文件原子落盘（tmp+rename，防抖 3s），进程退出时强制落盘。
// 存储：{ 主题id: { 假名: 时间戳 } }，只存假名不存学号。

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.DOWNS_PORT || 8787);
const DATA_DIR = process.env.DOWNS_DATA_DIR || __dirname;
const DB_FILE = path.join(DATA_DIR, 'downs-db.json');
const SALT_FILE = path.join(DATA_DIR, 'salt.txt');
const IP_LIMIT = Number(process.env.DOWNS_IP_LIMIT || 60); // 每 IP 每分钟最大请求数（防脚本兜底）

// ---- 盐：首次启动生成 32 字节 hex，之后固定（轮换会破坏终身去重） ----
let SALT = '';
try {
  SALT = fs.readFileSync(SALT_FILE, 'utf8').trim();
  if (!/^[0-9a-f]{64}$/.test(SALT)) throw new Error('bad salt');
} catch (_) {
  SALT = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SALT_FILE, SALT, { mode: 0o600 });
}

// ---- 数据库 ----
let DB = {};
try { DB = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) || {}; } catch (_) { DB = {}; }

let saveTimer = null;
let dirty = false;
function flushSync() {
  if (!dirty && !saveTimer) return;
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(DB));
  fs.renameSync(tmp, DB_FILE);
  dirty = false;
}
function scheduleSave() {
  dirty = true;
  if (saveTimer) return;
  saveTimer = setTimeout(() => { saveTimer = null; try { flushSync(); } catch (e) { console.error('[downs] save failed', e); } }, 3000);
}
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => { try { flushSync(); } catch (_) {} process.exit(0); });
}

// ---- IP 粗限频（NAT 友好：只兜底刷脚本，不参与去重） ----
const ipHits = new Map(); // ip -> [ts,...]
function ipLimited(ip) {
  const now = Date.now();
  const arr = (ipHits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  ipHits.set(ip, arr);
  if (ipHits.size > 5000) ipHits.clear(); // 粗暴防膨胀
  return arr.length > IP_LIMIT;
}

const ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;
const UID_RE = /^[0-9a-f]{8,64}$/;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const ip = (req.socket.remoteAddress || '').replace('::ffff:', '') || 'unknown';
  if (ipLimited(ip)) { res.writeHead(429); res.end('{"ok":false,"err":"rate"}'); return; }

  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch (_) { res.writeHead(400); res.end(); return; }

  if (req.method === 'GET' && url.pathname === '/downs/salt') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ salt: SALT }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/downs') {
    let body = '';
    let aborted = false;
    req.on('data', (c) => { body += c; if (body.length > 1024) { aborted = true; req.destroy(); } });
    req.on('end', () => {
      if (aborted) return;
      try {
        const { id, uid } = JSON.parse(body);
        if (!ID_RE.test(String(id)) || !UID_RE.test(String(uid))) throw new Error('bad fields');
        (DB[id] = DB[id] || {})[String(uid)] = Date.now(); // 幂等：重复上报仅刷新时间戳
        scheduleSave();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (_) { res.writeHead(400); res.end('{"ok":false}'); }
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/downs') {
    const ids = (url.searchParams.get('ids') || '').split(',').filter((s) => ID_RE.test(s)).slice(0, 200);
    const out = {};
    for (const id of ids) out[id] = DB[id] ? Object.keys(DB[id]).length : 0;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(out));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/downs/health') { res.writeHead(200); res.end('ok'); return; }

  res.writeHead(404); res.end();
});

server.listen(PORT, () => console.log(`[downs] listening on :${PORT}, data=${DB_FILE}`));
