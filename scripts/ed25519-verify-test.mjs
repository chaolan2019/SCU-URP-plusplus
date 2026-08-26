#!/usr/bin/env node
/**
 * @file ed25519-verify-test.mjs
 * @author ma
 * @date 2026-08-26
 * @version 0.1.0
 *
 * 纯 JS 的 Ed25519 verify（RFC 8032），用于 http 页面（无 crypto.subtle）下的验签。
 * 用 node:crypto 的 sha512 先验证「曲线/签名校验逻辑」正确性（读 sign-catalog.mjs 产出的签名）。
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// ---- Ed25519 参数 ----
const P = 2n ** 255n - 19n;
const L = 2n ** 252n + 27742317777372353535851937790883648493n;
// d = -121665 * inv(121666) mod P
function powmod(b, e, m) { let r = 1n; b %= m; for (; e; e >>= 1n) { if (e & 1n) r = r * b % m; b = b * b % m; } return r; }
function inv(x) { return powmod((x % P + P) % P, P - 2n, P); }
const D = (P - 121665n) * inv(121666n) % P;
const SQRT_M1 = powmod(2n, (P - 1n) / 4n, P); // sqrt(-1)

function fromLE(bytes) { let r = 0n; for (let i = 0; i < bytes.length; i++) r |= BigInt(bytes[i]) << BigInt(8 * i); return r; }
function toLE(v, len) { const a = new Uint8Array(len); for (let i = 0; i < len; i++) { a[i] = Number(v & 255n); v >>= 8n; } return a; }

function decompress(bytes) {
  if (bytes.length !== 32) return null;
  const sign = (bytes[31] & 128) !== 0;
  const y = fromLE(bytes) & ((1n << 255n) - 1n);
  if (y >= P) return null;
  const yy = y * y % P;
  const u = (yy - 1n + P) % P;
  const v = (D * yy + 1n) % P;
  let x = powmod(u * inv(v) % P, (P + 3n) / 8n, P);
  if (x * x % P !== u * inv(v) % P) x = x * SQRT_M1 % P;
  if (x * x % P !== u * inv(v) % P) return null;
  if (Boolean(x & 1n) !== sign) x = P - x;
  return { X: x, Y: y };
}

// 扭 Edwards 加法（affine，曲线 -x^2 + y^2 = 1 + d x^2 y^2）
function add(p, q) {
  const x1 = p.X % P, y1 = p.Y % P, x2 = q.X % P, y2 = q.Y % P;
  const dxy = D * x1 * x2 % P * y1 % P * y2 % P;
  // x3 = (x1y2 + x2y1) / (1 + d x1x2y1y2)
  const x3 = (x1 * y2 + x2 * y1) % P * inv((1n + dxy + P) % P) % P;
  // y3 = (y1y2 + x1x2) / (1 - d x1x2y1y2)   [曲线 a=-1]
  const y3 = (y1 * y2 % P + x1 * x2 % P) % P * inv((1n - dxy + P) % P) % P;
  return { X: x3, Y: y3 };
}
function mul(p, n) {
  let r = null, q = { X: p.X, Y: p.Y };
  for (; n > 0n; n >>= 1n) {
    if (n & 1n) r = r ? add(r, q) : q;
    q = add(q, q);
  }
  return r;
}
const B = decompress(toLE(46316835694926478169428394003475163141307993866256225615783033603165251855960n, 32));
if (!B) { console.error('BASE decompress failed'); process.exit(1); }

function sha512(...parts) {
  const h = createHash('sha512');
  for (const p of parts) h.update(p);
  return h.digest();
}

// verify(sig(64B), pub(32B), msg): SIG = R(32) || S(32)
function verify(sig, pub, msg) {
  if (sig.length !== 64 || pub.length !== 32) return false;
  const A = decompress(pub);
  if (!A) return false;
  const R = decompress(sig.slice(0, 32));
  if (!R) return false;
  const S = fromLE(sig.slice(32));
  if (S >= L) return false;
  const k = fromLE(sha512(sig.slice(0, 32), pub, msg)) % L;
  const sB = mul(B, S);
  const kA = mul(A, k);
  // [S]B = [k]A + R  →  R = [S]B − [k]A
  const negK = kA ? { X: (P - kA.X % P) % P, Y: kA.Y % P } : null;
  const rhs = (sB && negK) ? add(sB, negK) : (sB || negK);
  return pointEquals(rhs, R);
}
function rhsBase(p) { return p; }
function pointEquals(p, q) {
  if (!p || !q) return false;
  return p.X % P === q.X % P && (p.Y % P === q.Y % P || p.Y % P === (P - q.Y % P) % P);
}

// ---- 测试：读签名 catalog 验证 ----
const catPath = process.argv[2];
const doc = JSON.parse(readFileSync(catPath, 'utf8').replace(/^\uFEFF/, ''));
const norm = (o) => {
  if (Array.isArray(o)) return o.map(norm);
  if (o && typeof o === 'object') { const out = {}; for (const k of Object.keys(o).filter((x) => x !== 'signature' && x !== '_srcPub').sort()) out[k] = norm(o[k]); return out; }
  return o;
};
const pub = Buffer.from(doc.pubkey, 'base64');
let pass = 0, fail = 0;
for (const item of doc.items) {
  // 签名对象 = SHA256(规范化 JSON) 的摘要字节（与 sign-catalog.mjs 一致）
  const msg = createHash('sha256').update(JSON.stringify(norm(item))).digest();
  const sig = Buffer.from(item.signature, 'base64');
  const ok = verify(sig, pub, msg);
  // 正常
  if (ok) { pass++; console.log('PASS verify', item.id); } else { fail++; console.error('FAIL verify', item.id); }
  // 篡改
  const msg2 = createHash('sha256').update(JSON.stringify(norm({ ...item, name: item.name + 'x' }))).digest();
  const ok2 = verify(sig, pub, msg2);
  if (!ok2) { pass++; console.log('PASS tamper-reject', item.id); } else { fail++; console.error('FAIL tamper accepted!', item.id); }
}
console.log(`\n${fail ? 'FAIL' : 'ALL PASS'}（${pass} pass, ${fail} fail）`);
process.exit(fail ? 1 : 0);
