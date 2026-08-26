#!/usr/bin/env node
/**
 * @file test-signature.mjs
 * @author ma
 * @date 2026-08-26
 * @version 0.1.0
 *
 * 临时测试脚本：验证「签名工具 + 主插件校验链路」的完整性。
 *
 * 流程：
 *   1. 生成临时 catalog（含 plugin + theme 条目）。
 *   2. 调 tools/sign-catalog.mjs 打签名（Ed25519，写 pubkey + signature）。
 *   3. 用「主插件同一套算法」（normalize → SHA256 → Ed25519 verify）模拟校验：
 *      - 正常条目 → guard 应为 ok
 *      - 篡改条目 → guard 应为 fail（拦截）
 *      - 官方/无签名源 → guard 应为 trust
 *
 * 说明：node 24 的 globalThis.crypto.subtle 对 Ed25519 支持不完整，
 *       故本脚本用 node:crypto（与签名的 node 实现同源）模拟主插件 verify，
 *       验证的是「算法链路」正确性；浏览器 WebCrypto Ed25519 为 RFC8032 标准实现，同算法。
 *
 * 用法：node scripts/test-signature.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash, createPublicKey, verify as nodeVerify } from 'node:crypto';

const repoRoot = resolve(join(import.meta.dirname, '..'));

function normalizeEntry(o) {
  if (Array.isArray(o)) return o.map(normalizeEntry);
  if (o && typeof o === 'object') {
    const out = {};
    for (const k of Object.keys(o).filter((x) => x !== 'signature' && x !== '_srcPub').sort()) out[k] = normalizeEntry(o[k]);
    return out;
  }
  return o;
}

// 模拟主插件 verifyEntrySignature（node crypto 版，同一 normalize + SHA256 + Ed25519 verify）
function verifySignature(entry, pubkeyB64) {
  try {
    const raw = Buffer.from(pubkeyB64, 'base64');
    const der = Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), raw]);
    const pub = createPublicKey({ key: der, format: 'der', type: 'spki' });
    const data = createHash('sha256').update(JSON.stringify(normalizeEntry(entry))).digest();
    const sig = Buffer.from(entry.signature, 'base64');
    return nodeVerify(null, data, pub, sig);
  } catch (_) { return false; }
}

// 模拟主插件 guardEntrySignature
function guard(entry) {
  const pub = entry && entry._srcPub;
  if (!pub) return 'trust';
  return verifySignature(entry, pub) ? 'ok' : 'fail';
}

const dir = mkdtempSync(join(tmpdir(), 'urppp-sig-'));
const catPath = join(dir, 'catalog.json');
const catalog = {
  items: [
    { type: 'plugin', id: 'p-test', name: '测试插件', version: '1.0.0', repo: 'https://example.com/p' },
    { type: 'theme', id: 't-test', name: '测试主题', version: '1.0.0', author: 'tester' },
  ],
};
writeFileSync(catPath, JSON.stringify(catalog, null, 2));

try {
  // 1. 用工具签名
  execFileSync(process.execPath, ['tools/sign-catalog.mjs', catPath], { cwd: repoRoot, stdio: 'ignore' });
  // 2. 读签名后结果
  const doc = JSON.parse(readFileSync(catPath, 'utf8').replace(/^\uFEFF/, ''));
  if (!doc.pubkey || !Array.isArray(doc.items) || !doc.items[0].signature) {
    console.error('FAIL: 工具未写入 pubkey / signature');
    process.exit(1);
  }
  doc.items.forEach((it) => { it._srcPub = doc.pubkey; });

  let pass = 0, fail = 0;
  const t = (name, cond) => { if (cond) { pass += 1; console.log('  PASS', name); } else { fail += 1; console.error('  FAIL', name); } };

  console.log('签名链路校验：');
  t('正常条目 guard=ok（可通过）', guard(doc.items[0]) === 'ok');
  t('正常条目 guard=ok（theme）', guard(doc.items[1]) === 'ok');
  t('工具签名可被验证（verifySignature=true）', verifySignature(doc.items[0], doc.pubkey) === true);

  const tampered = { ...doc.items[0], name: '被篡改的名字', _srcPub: doc.pubkey };
  t('篡改条目 guard=fail（应拦截）', guard(tampered) === 'fail');

  const legit = { ...doc.items[0], _srcPub: '' };
  t('官方源(无_srcPub) guard=trust', guard(legit) === 'trust');

  const noSig = { ...doc.items[0], signature: '', _srcPub: doc.pubkey };
  t('无signature且带源pubkey guard=fail（应拦截）', guard(noSig) === 'fail');

  console.log(`\n${fail ? 'FAIL' : 'ALL PASS'}（${pass} pass, ${fail} fail）`);
  process.exit(fail ? 1 : 0);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
