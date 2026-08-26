#!/usr/bin/env node
/**
 * @file sign-catalog.mjs
 * @author ma
 * @date 2026-08-26
 * @version 0.1.0
 *
 * 给 catalog.json（自建仓库）打 Ed25519 签名，写入每个条目的 signature 与顶层 pubkey。
 *
 * 用法：
 *   node tools/sign-catalog.mjs [catalog.json] [私钥文件]
 *
 * - 首次运行：生成 Ed25519 密钥对（catalog 同目录 `catalog.signing-key`），打印并写入公钥。
 * - 再次运行：若私钥文件存在则复用（保持同一公钥，才可被已信任的公钥校验）。
 * - 输出：改写 catalog.json（每个条目带 signature，顶层带 pubkey 字段）。
 *
 * 签名算法：signature = base64( Ed25519.sign( SHA256( normalize(条目去 signature) ) ) )
 * normalize = 键排序 + 无空白紧凑 JSON（与主插件校验一致）。
 */
import { generateKeyPairSync, createPublicKey, createPrivateKey, sign as nodeSign, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const catalogPath = resolve(process.argv[2] || 'catalog.json');
const keyPath = resolve(process.argv[3] || dirname(catalogPath) + '/catalog.signing-key');

/** 归一化：键排序、去掉 signature、递归、紧凑 */
function normalize(obj) {
  if (Array.isArray(obj)) return obj.map(normalize);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj).filter((x) => x !== 'signature').sort()) out[k] = normalize(obj[k]);
    return out;
  }
  return obj;
}
function ed25519RawPub(pubKeyObj) {
  // 若传 private，则提取 public；public 直接 export SPKI DER，取末尾 32 字节（Ed25519 公钥）
  const pub = (pubKeyObj && pubKeyObj.type === 'private') ? createPublicKey(pubKeyObj) : pubKeyObj;
  const spki = pub.export({ type: 'spki', format: 'der' });
  return spki.subarray(spki.length - 32);
}
function b64(bytes) { return Buffer.from(bytes).toString('base64'); }

let privKey;
let pubRaw;
if (existsSync(keyPath)) {
  const jwk = JSON.parse(readFileSync(keyPath, 'utf8'));
  privKey = createPrivateKey({ key: jwk, format: 'jwk' });
  pubRaw = ed25519RawPub(createPublicKey(privKey));
  console.log('[sign-catalog] 复用已有密钥对');
} else {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  privKey = privateKey;
  pubRaw = ed25519RawPub(publicKey);
  const jwk = privateKey.export({ format: 'jwk' });
  writeFileSync(keyPath, JSON.stringify(jwk, null, 2));
  console.log(`[sign-catalog] 生成新密钥对，私钥已存：${keyPath}`);
}

const doc = JSON.parse((readFileSync(catalogPath, 'utf8') || '').replace(/^\uFEFF/, ''));
if (!doc || !Array.isArray(doc.items)) {
  console.error('[sign-catalog] catalog 非法：缺少 items 数组');
  process.exit(1);
}

for (const item of doc.items) {
  const norm = normalize(item);
  const hash = createHash('sha256').update(JSON.stringify(norm)).digest();
  const sig = nodeSign(null, hash, privKey);
  item.signature = b64(sig);
}
doc.pubkey = b64(pubRaw);
writeFileSync(catalogPath, JSON.stringify(doc, null, 2));
console.log(`[sign-catalog] 已签名 ${doc.items.length} 个条目，写入 pubkey`);
console.log(`[sign-catalog] pubkey (base64): ${b64(pubRaw)}`);
