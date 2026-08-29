#!/usr/bin/env node
/* ============================================================
 * URP++ 主题投稿自检脚本
 * 用法：node tools/contribute-check.mjs <你的-catalog.json> [主题css路径...]
 * 退出码：0 全部通过；1 存在错误
 * ============================================================ */
import { readFileSync } from 'node:fs';

const OFFICIAL_IDS = new Set(['flat', 'organic', 'brutal', 'neu', 'assist']);
const REQUIRED_VARS = [
  '--bg', '--bg-card-soft', '--bg-input', '--border', '--text', '--text-secondary',
  '--link', '--accent', '--accent-contrast', '--shadow', '--radius', '--nav-bg', '--panel-bg',
];
const ITEM_REQUIRED = ['id', 'type', 'name', 'description', 'version', 'author', 'entry'];
const errors = [];
const oks = [];
const bad = (msg) => errors.push(msg);
const good = (msg) => oks.push(msg);
const semver = (v) => /^\d+\.\d+\.\d+$/.test(String(v || ''));

const [, , catalogPath, ...cssPaths] = process.argv;
if (!catalogPath) {
  console.error('用法：node tools/contribute-check.mjs <你的-catalog.json> [主题css路径...]');
  process.exit(1);
}

// ---------- catalog ----------
let catalog;
try {
  catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  good(`catalog.json 可解析（${catalogPath}）`);
} catch (e) {
  console.error(`✗ catalog.json 无法解析：${e.message}`);
  process.exit(1);
}
if (!catalog.name) bad('缺少顶层 name');
else good(`顶层 name: ${catalog.name}`);
if (!semver(catalog.version)) console.log('  ⚠ 顶层 version 建议 x.y.z（当前：' + catalog.version + '）');
else good(`顶层 version: ${catalog.version}`);
if (!catalog.updated) bad('缺少顶层 updated（格式 YYYY-MM-DD）');
else good(`顶层 updated: ${catalog.updated}`);
if (!Array.isArray(catalog.items) || !catalog.items.length) bad('items 必须是非空数组');

const ids = new Set();
for (const [index, item] of (catalog.items || []).entries()) {
  const at = `items[${index}]`;
  for (const key of ITEM_REQUIRED) {
    if (item[key] === undefined || item[key] === '' || (Array.isArray(item[key]) && !item[key].length)) bad(`${at}.${key} 缺失或为空`);
  }
  if (!item.id) continue;
  if (!/^[a-z0-9][a-z0-9-]{1,31}$/.test(item.id)) bad(`${at}.id「${item.id}」不合规：仅小写字母/数字/连字符，2~32 位，字母或数字开头`);
  if (OFFICIAL_IDS.has(item.id)) bad(`${at}.id「${item.id}」与官方主题重名`);
  if (ids.has(item.id)) bad(`${at}.id「${item.id}」在你的 catalog 内重复`);
  ids.add(item.id);
  if (item.type !== 'theme') bad(`${at}.type 目前投稿仅支持 "theme"（当前：${item.type}）`);
  if (item.version && !semver(item.version)) bad(`${at}.version「${item.version}」必须是 x.y.z`);
  if (item.minAPP && !semver(item.minAPP)) bad(`${at}.minAPP「${item.minAPP}」必须是 x.y.z`);
  const isTheme = item.type === 'theme';
  if (item.type === 'plugin') {
    good(`${at} 为插件条目，跳过主题专项校验`);
  } else if (!isTheme) {
    bad(`${at}.type 目前投稿仅支持 "theme"（当前：${item.type}）`);
  }
  if (isTheme) {
    if (Array.isArray(item.entry)) {
      if (!item.entry.length) bad(`${at}.entry 为空`);
      item.entry.forEach((url, k) => {
        if (!/^https:\/\//.test(url)) bad(`${at}.entry[${k}] 必须 https（raw 页面为 http，浏览器会拦截）`);
        try { new URL(url); } catch { bad(`${at}.entry[${k}] 不是合法 URL：${url}`); }
      });
      if (item.entry.length) good(`${at}.entry 多源 ${item.entry.length} 条（建议 raw + jsdelivr 双源）`);
    }
    if (item.preview && (!Array.isArray(item.preview) || item.preview.some((c) => !/^#[0-9a-fA-F]{6}$/.test(String(c))))) {
      bad(`${at}.preview 必须是 6 位十六进制颜色数组，如 ["#FFFFFF","#000000","#4A4A4A"]`);
    }
    if (typeof item.cardCss !== 'string' || item.cardCss.length < 20) {
      bad(`${at}.cardCss 缺失：商店卡片样式必须由条目提供（参考官方条目）`);
    } else if (item.id && !item.cardCss.includes(`[data-skin="${item.id}"]`)) {
      bad(`${at}.cardCss 必须包含 [data-skin="${item.id}"] 选择器`);
    } else if (item.id) {
      good(`${at}.cardCss 前缀正确`);
    }
    for (const k of ['dark', 'dynamic', 'palettes']) {
      if (item[k] !== undefined && typeof item[k] !== 'boolean') bad(`${at}.${k} 必须是布尔`);
    }
    if (item.repo && !/^https:\/\/github\.com\//.test(item.repo)) bad(`${at}.repo 建议 GitHub 仓库链接`);
  }
}

// ---------- 主题 css ----------
for (const cssPath of cssPaths) {
  let css = '';
  try { css = readFileSync(cssPath, 'utf8'); } catch (e) { bad(`主题 css 无法读取：${cssPath}（${e.message}）`); continue; }
  const m = css.match(/html\[data-urppp-skin="([a-z0-9-]+)"\]/);
  if (!m) { bad(`${cssPath}：未找到 html[data-urppp-skin="<id>"] 前缀，所有规则必须挂该前缀`); continue; }
  const cssId = m[1];
  if (!ids.has(cssId)) bad(`${cssPath}：前缀 id「${cssId}」不在你的 catalog items 里`);
  const missing = REQUIRED_VARS.filter((v) => !new RegExp(`html\\[data-urppp-skin="${cssId}"\\][^{]*\\{[^}]*${v.replace('-', '\\-')}\\s*:`, 's').test(css));
  if (missing.length) bad(`${cssPath}：缺少必填变量 ${missing.join(' ')}`);
  else good(`${cssPath}：13 个必填变量齐全（前缀 ${cssId}）`);
  if (/{\s*\}/.test(css)) bad(`${cssPath}：存在空规则块`);
}

// ---------- 报告 ----------
for (const msg of oks) console.log('  ✓ ' + msg);
for (const msg of errors) console.log('  ✗ ' + msg);
console.log(errors.length ? `\n未通过：${errors.length} 项错误。修完再投。` : '\n全部通过 ✓ 可以投稿。');
process.exit(errors.length ? 1 : 0);
