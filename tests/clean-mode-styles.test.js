import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const entryUrl = new URL('../src/userscripts/urppp.entry.js', import.meta.url);
const cleanModeStylesUrl = new URL('../src/styles/clean-mode.css', import.meta.url);

test('clean mode owns its root, card, and lesson styles', async () => {
  const [entry, cleanModeStyles] = await Promise.all([
    readFile(entryUrl, 'utf8'),
    readFile(cleanModeStylesUrl, 'utf8'),
  ]);

  assert.doesNotMatch(entry, /st\.textContent = `\n#urppp-clean-root/);
  assert.doesNotMatch(entry, /uc-top-actions\{/);
  assert.match(entry, /import cleanModeStyles from '\.\.\/styles\/clean-mode\.css'/);
  // 2.0.0 P1：ensureStyle 工厂化后注入点改为 ensureStyleOnce('urppp-clean-style', cleanModeStyles)
  assert.match(entry, /ensureStyleOnce\('urppp-clean-style', cleanModeStyles\)/);

  assert.match(cleanModeStyles, /#urppp-clean-root\{/);
  assert.match(cleanModeStyles, /\.uc-lesson\{/);
  assert.match(cleanModeStyles, /\.uc-card\{/);
  assert.match(cleanModeStyles, /\.uc-score-cell/);
  assert.match(cleanModeStyles, /\.uc-modal-stack-hint/);
});

test('clean mode css has no BOM (BOM drops the first rule in browsers)', async () => {
  const [bundle, cleanModeStyles] = await Promise.all([
    readFile(new URL('../urppp.user.js', import.meta.url), 'utf8'),
    readFile(cleanModeStylesUrl, 'utf8'),
  ]);
  // 源码 CSS 不以 BOM 开头；构建产物中 root 定位规则前也不允许残留 U+FEFF
  assert.equal(cleanModeStyles.charCodeAt(0) === 0xFEFF, false, 'clean-mode.css must not start with BOM');
  const idx = bundle.indexOf('#urppp-clean-root{position');
  assert.ok(idx > 0);
  assert.equal(bundle.charCodeAt(idx - 1) === 0xFEFF, false, 'bundle css must not carry U+FEFF before root rule');
});
