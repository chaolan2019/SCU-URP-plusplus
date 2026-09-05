import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const targets = [
  {
    metadata: new URL('../src/metadata/urppp.json', import.meta.url),
    source: new URL('../src/userscripts/urppp.entry.js', import.meta.url),
    constant: 'URPPP_VERSION',
  },
  {
    metadata: new URL('../src/metadata/urpppp.json', import.meta.url),
    source: new URL('../src/userscripts/urpppp.entry.js', import.meta.url),
    constant: 'URPPPP_VERSION',
  },
];

test('metadata versions match runtime constants', async () => {
  for (const target of targets) {
    const [metadataText, source] = await Promise.all([
      readFile(target.metadata, 'utf8'),
      readFile(target.source, 'utf8'),
    ]);
    const metadata = JSON.parse(metadataText);
    const pattern = new RegExp(`const\\s+${target.constant}\\s*=\\s*['\"]([^'\"]+)['\"]`);
    assert.equal(source.match(pattern)?.[1], metadata.version, target.constant);
    assert.equal(metadata.license ?? 'GPL-3.0-only', 'GPL-3.0-only');
  }
});

test('main userscript keeps broad match but isolates runtime beautification hosts', async () => {
  const [metadataText, source] = await Promise.all([
    readFile(new URL('../src/metadata/urppp.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/userscripts/urppp.entry.js', import.meta.url), 'utf8'),
  ]);
  const metadata = JSON.parse(metadataText);
  assert.ok(metadata.match.includes('https://*.scu.edu.cn/*'), '保留 SCU 子域名 @match');
  assert.match(source, /MAIN_BEAUTIFY_HOSTS\s*=\s*new Set\(\['zhjw\.scu\.edu\.cn',\s*'202\.115\.47\.141'\]\)/);
  assert.match(source, /location\.protocol\s*===\s*['"]http:['"]/);
  assert.match(source, /if \(!isMainBeautifyTarget\) return;/);
  assert.ok(source.indexOf('if (/^id\\./i.test') < source.indexOf('if (!isMainBeautifyTarget) return;'), '登录辅助分支先于主站隔离');
  assert.ok(source.indexOf('if (!isMainBeautifyTarget) return;') < source.indexOf('function ensureBootLoader'), '隔离先于遮罩注入');
});

test('current main userscript version has a changelog release section', async () => {
  const [metadataText, changelog] = await Promise.all([
    readFile(new URL('../src/metadata/urppp.json', import.meta.url), 'utf8'),
    readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8'),
  ]);
  const version = JSON.parse(metadataText).version.replaceAll('.', '\\.');
  assert.match(changelog, new RegExp(`^## \\[${version}\\] - \\d{4}-\\d{2}-\\d{2}$`, 'm'));
});

test('package and lockfile versions follow the main userscript version', async () => {
  const [packageText, packageLockText, metadataText] = await Promise.all([
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
    readFile(new URL('../package-lock.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/metadata/urppp.json', import.meta.url), 'utf8'),
  ]);
  const packageVersion = JSON.parse(packageText).version;
  const lockfile = JSON.parse(packageLockText);
  const metadataVersion = JSON.parse(metadataText).version;
  assert.equal(packageVersion, metadataVersion);
  assert.equal(lockfile.version, packageVersion);
  assert.equal(lockfile.packages?.['']?.version, packageVersion);
});

test('version.json follows metadata versions and embeds changelog section', async () => {
  const [versionJsonText, mainMetadataText, assistMetadataText, changelog] = await Promise.all([
    readFile(new URL('../version.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/metadata/urppp.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/metadata/urpppp.json', import.meta.url), 'utf8'),
    readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8'),
  ]);
  const vj = JSON.parse(versionJsonText);
  const mainVersion = JSON.parse(mainMetadataText).version;
  const assistVersion = JSON.parse(assistMetadataText).version;
  assert.equal(vj.version, mainVersion, 'version.json.version');
  assert.equal(vj.assist, assistVersion, 'version.json.assist');
  assert.match(vj.updated, /^\d{4}-\d{2}-\d{2}$/, 'version.json.updated');
  assert.ok(vj.changelog && vj.changelog.includes(`## [${mainVersion}]`), 'version.json 内嵌当前版本 changelog');
  // 内嵌段落应与 CHANGELOG.md 中对应版本段落一致
  assert.ok(changelog.includes(vj.changelog.replace(/\n+$/, '')), 'version.json.changelog 与 CHANGELOG.md 段落一致');
  // prevVersion 应对应 CHANGELOG.md 中的上一个版本
  const versions = [...changelog.matchAll(/^## \[([0-9]+(?:\.[0-9]+){0,3})\]/gm)].map((m) => m[1]);
  const idx = versions.indexOf(mainVersion);
  assert.ok(idx >= 0 && idx < versions.length - 1, '当前版本在 CHANGELOG 中存在');
  assert.equal(vj.prevVersion, versions[idx + 1], 'version.json.prevVersion 为上一版本');
});
