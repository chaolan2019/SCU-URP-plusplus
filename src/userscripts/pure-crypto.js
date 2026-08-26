/**
 * @file pure-crypto.js
 * @author ma
 * @date 2026-08-26
 * @version 0.1.0
 *
 * 纯 JS 的 SHA-256 / SHA-512 / Ed25519 verify（RFC 8032）。
 * 用于 http 页面（无 window.crypto.subtle）下的签名校验。
 * 全部为确定性纯函数，不依赖 WebCrypto / Node crypto。
 */

const T = typeof TextEncoder !== 'undefined' ? new TextEncoder() : { encode: (s) => Uint8Array.from(Buffer.from(s, 'utf8')) };
function toBytes(data) {
  if (typeof data === 'string') return T.encode(data);
  if (data instanceof Uint8Array) return data;
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  return new Uint8Array(data);
}

/* ---------------- SHA-256 ---------------- */
const K256 = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
export function sha256Bytes(data) {
  const bytes = toBytes(data);
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const len = bytes.length;
  const bitLenHi = Math.floor(len / 0x20000000);
  const bitLenLo = (len << 3) >>> 0;
  const padLen = ((len + 8) >> 6 << 6) + 64;
  const msg = new Uint8Array(padLen);
  msg.set(bytes);
  msg[len] = 0x80;
  const dv = new DataView(msg.buffer);
  dv.setUint32(padLen - 8, bitLenHi);
  dv.setUint32(padLen - 4, bitLenLo);
  const w = new Uint32Array(64);
  for (let i = 0; i < padLen; i += 64) {
    for (let j = 0; j < 16; j += 1) w[j] = dv.getUint32(i + j * 4);
    for (let j = 16; j < 64; j += 1) {
      const s0 = rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (let j = 0; j < 64; j += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K256[j] + w[j]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 8; i += 1) { out[i * 4] = H[i] >>> 24; out[i * 4 + 1] = H[i] >>> 16; out[i * 4 + 2] = H[i] >>> 8; out[i * 4 + 3] = H[i]; }
  return out;
}

/* ---------------- SHA-512 ---------------- */
const K512 = [
  0x428a2f98d728ae22n, 0x7137449123ef65cdn, 0xb5c0fbcfec4d3b2fn,
  0xe9b5dba58189dbbcn, 0x3956c25bf348b538n, 0x59f111f1b605d019n,
  0x923f82a4af194f9bn, 0xab1c5ed5da6d8118n, 0xd807aa98a3030242n,
  0x12835b0145706fben, 0x243185be4ee4b28cn, 0x550c7dc3d5ffb4e2n,
  0x72be5d74f27b896fn, 0x80deb1fe3b1696b1n, 0x9bdc06a725c71235n,
  0xc19bf174cf692694n, 0xe49b69c19ef14ad2n, 0xefbe4786384f25e3n,
  0x0fc19dc68b8cd5b5n, 0x240ca1cc77ac9c65n, 0x2de92c6f592b0275n,
  0x4a7484aa6ea6e483n, 0x5cb0a9dcbd41fbd4n, 0x76f988da831153b5n,
  0x983e5152ee66dfabn, 0xa831c66d2db43210n, 0xb00327c898fb213fn,
  0xbf597fc7beef0ee4n, 0xc6e00bf33da88fc2n, 0xd5a79147930aa725n,
  0x06ca6351e003826fn, 0x142929670a0e6e70n, 0x27b70a8546d22ffcn,
  0x2e1b21385c26c926n, 0x4d2c6dfc5ac42aedn, 0x53380d139d95b3dfn,
  0x650a73548baf63den, 0x766a0abb3c77b2a8n, 0x81c2c92e47edaee6n,
  0x92722c851482353bn, 0xa2bfe8a14cf10364n, 0xa81a664bbc423001n,
  0xc24b8b70d0f89791n, 0xc76c51a30654be30n, 0xd192e819d6ef5218n,
  0xd69906245565a910n, 0xf40e35855771202an, 0x106aa07032bbd1b8n,
  0x19a4c116b8d2d0c8n, 0x1e376c085141ab53n, 0x2748774cdf8eeb99n,
  0x34b0bcb5e19b48a8n, 0x391c0cb3c5c95a63n, 0x4ed8aa4ae3418acbn,
  0x5b9cca4f7763e373n, 0x682e6ff3d6b2b8a3n, 0x748f82ee5defb2fcn,
  0x78a5636f43172f60n, 0x84c87814a1f0ab72n, 0x8cc702081a6439ecn,
  0x90befffa23631e28n, 0xa4506cebde82bde9n, 0xbef9a3f7b2c67915n,
  0xc67178f2e372532bn, 0xca273eceea26619cn, 0xd186b8c721c0c207n,
  0xeada7dd6cde0eb1en, 0xf57d4f7fee6ed178n, 0x06f067aa72176fban,
  0x0a637dc5a2c898a6n, 0x113f9804bef90daen, 0x1b710b35131c471bn,
  0x28db77f523047d84n, 0x32caab7b40c72493n, 0x3c9ebe0a15c9bebcn,
  0x431d67c49c100d4cn, 0x4cc5d4becb3e42b6n, 0x597f299cfc657e2an,
  0x5fcb6fab3ad6faecn, 0x6c44198c4a475817n,
].map((v) => BigInt(v));
function rotr64(x, n) { return ((x >> BigInt(n)) | (x << BigInt(64 - n))) & 0xffffffffffffffffn; }
export function sha512Bytes(data) {
  const bytes = toBytes(data);
  const H = [
    0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n,
    0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n,
  ];
  const len = bytes.length;
  const bitLen = BigInt(len) * 8n;
  const padLen = ((len + 8 + 15) >> 4 << 4);
  const msg = new Uint8Array(padLen + 16);
  msg.set(bytes);
  msg[len] = 0x80;
  const dv = new DataView(msg.buffer);
  dv.setBigUint64(msg.length - 8, bitLen);
  const w = new Array(80);
  for (let i = 0; i < msg.length; i += 128) {
    for (let j = 0; j < 16; j += 1) w[j] = dv.getBigUint64(i + j * 8);
    for (let j = 16; j < 80; j += 1) {
      const s0 = rotr64(w[j - 15], 1) ^ rotr64(w[j - 15], 8) ^ (w[j - 15] >> 7n);
      const s1 = rotr64(w[j - 2], 19) ^ rotr64(w[j - 2], 61) ^ (w[j - 2] >> 6n);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) & 0xffffffffffffffffn;
    }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (let j = 0; j < 80; j += 1) {
      const S1 = rotr64(e, 14) ^ rotr64(e, 18) ^ rotr64(e, 41);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K512[j] + w[j]) & 0xffffffffffffffffn;
      const S0 = rotr64(a, 28) ^ rotr64(a, 34) ^ rotr64(a, 39);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) & 0xffffffffffffffffn;
      h = g; g = f; f = e; e = (d + t1) & 0xffffffffffffffffn; d = c; c = b; b = a; a = (t1 + t2) & 0xffffffffffffffffn;
    }
    H[0] = (H[0] + a) & 0xffffffffffffffffn; H[1] = (H[1] + b) & 0xffffffffffffffffn; H[2] = (H[2] + c) & 0xffffffffffffffffn; H[3] = (H[3] + d) & 0xffffffffffffffffn;
    H[4] = (H[4] + e) & 0xffffffffffffffffn; H[5] = (H[5] + f) & 0xffffffffffffffffn; H[6] = (H[6] + g) & 0xffffffffffffffffn; H[7] = (H[7] + h) & 0xffffffffffffffffn;
  }
  const out = new Uint8Array(64);
  for (let i = 0; i < 8; i += 1) {
    const v = H[i] & 0xffffffffffffffffn;
    for (let j = 0; j < 8; j += 1) out[i * 8 + j] = Number((v >> BigInt(56 - j * 8)) & 0xffn);
  }
  return out;
}

/* ---------------- Ed25519 verify ---------------- */
const ED_P = 2n ** 255n - 19n;
const ED_L = 2n ** 252n + 27742317777372353535851937790883648493n;
function powmod(b, e, m) { let r = 1n; b %= m; for (; e; e >>= 1n) { if (e & 1n) r = r * b % m; b = b * b % m; } return r; }
const ED_D = (ED_P - 121665n) * powmod(121666n, ED_P - 2n, ED_P) % ED_P;
const ED_M1 = powmod(2n, (ED_P - 1n) / 4n, ED_P);
function fromLE(b) { let r = 0n; for (let i = 0; i < b.length; i += 1) r |= BigInt(b[i]) << BigInt(8 * i); return r; }
function toLE(v, len) { const a = new Uint8Array(len); for (let i = 0; i < len; i += 1) { a[i] = Number(v & 255n); v >>= 8n; } return a; }
function edDecompress(bytes) {
  if (bytes.length !== 32) return null;
  const sign = (bytes[31] & 128) !== 0;
  const y = fromLE(bytes) & ((1n << 255n) - 1n);
  if (y >= ED_P) return null;
  const yy = y * y % ED_P;
  const u = (yy - 1n + ED_P) % ED_P;
  const v = (ED_D * yy + 1n) % ED_P;
  const t = u * powmod(v, ED_P - 2n, ED_P) % ED_P;
  let x = powmod(t, (ED_P + 3n) / 8n, ED_P);
  if (x * x % ED_P !== t) x = x * ED_M1 % ED_P;
  if (x * x % ED_P !== t) return null;
  if (Boolean(x & 1n) !== sign) x = ED_P - x;
  return { X: x, Y: y };
}
function edAdd(p, q) {
  const x1 = p.X % ED_P, y1 = p.Y % ED_P, x2 = q.X % ED_P, y2 = q.Y % ED_P;
  const dxy = ED_D * x1 % ED_P * x2 % ED_P * y1 % ED_P * y2 % ED_P;
  const x3 = (x1 * y2 + x2 * y1) % ED_P * powmod((1n + dxy + ED_P) % ED_P, ED_P - 2n, ED_P) % ED_P;
  const y3 = (y1 * y2 % ED_P + x1 * x2 % ED_P) % ED_P * powmod((1n - dxy + ED_P) % ED_P, ED_P - 2n, ED_P) % ED_P;
  return { X: x3, Y: y3 };
}
function edMul(p, n) {
  let r = null; let q = { X: p.X % ED_P, Y: p.Y % ED_P };
  for (; n > 0n; n >>= 1n) { if (n & 1n) r = r ? edAdd(r, q) : q; q = edAdd(q, q); }
  return r;
}
const ED_B = edDecompress(toLE(46316835694926478169428394003475163141307993866256225615783033603165251855960n, 32));

export function ed25519Verify(sig, pub, msg) {
  if (!sig || !pub || !msg) return false;
  const s = toBytes(sig); const a = toBytes(pub); const m = toBytes(msg);
  if (s.length !== 64 || a.length !== 32) return false;
  const A = edDecompress(a);
  if (!A) return false;
  const R = edDecompress(s.slice(0, 32));
  if (!R) return false;
  const S = fromLE(s.slice(32));
  if (S >= ED_L) return false;
  const k = fromLE(sha512Bytes(concatBytes(s.slice(0, 32), a, m))) % ED_L;
  const sB = edMul(ED_B, S);
  const kA = edMul(A, k);
  const negK = kA ? { X: (ED_P - kA.X % ED_P) % ED_P, Y: kA.Y % ED_P } : null;
  const rhs = (sB && negK) ? edAdd(sB, negK) : (sB || negK);
  if (!rhs || !R) return false;
  return (rhs.X % ED_P) === (R.X % ED_P) && (rhs.Y % ED_P) === (R.Y % ED_P);
}
function concatBytes(...arrs) { let n = 0; for (const a of arrs) n += a.length; const out = new Uint8Array(n); let o = 0; for (const a of arrs) { out.set(a, o); o += a.length; } return out; }
