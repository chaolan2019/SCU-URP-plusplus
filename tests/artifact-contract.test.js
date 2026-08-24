import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const artifacts = [
  {
    file: new URL('../urppp.user.js', import.meta.url),
    metadata: new URL('../src/metadata/urppp.json', import.meta.url),
  },
  {
    file: new URL('../urpppp.user.js', import.meta.url),
    metadata: new URL('../src/metadata/urpppp.json', import.meta.url),
  },
];

const readmeUrl = new URL('../README.md', import.meta.url);
const packageUrl = new URL('../package.json', import.meta.url);
const assistMetadataUrl = new URL('../src/metadata/urpppp.json', import.meta.url);

test('generated artifacts remain installable readable single files', async () => {
  for (const artifact of artifacts) {
    const [raw, info, metadataText] = await Promise.all([
      readFile(artifact.file, 'utf8'),
      stat(artifact.file),
      readFile(artifact.metadata, 'utf8'),
    ]);
    // 归一化换行：兼容 Git 在部分环境把产物转成 CRLF（不影响用户脚本可执行性）
    const source = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const version = JSON.parse(metadataText).version;
    assert.ok(source.startsWith('// ==UserScript==\n'));
    assert.match(source, new RegExp(`^// @version\\s+${version.replaceAll('.', '\\.')}$`, 'm'));
    assert.match(source, /^\/\/ @license\s+GPL-3\.0-only$/m);
    assert.match(source, /^\/\/ SPDX-License-Identifier: GPL-3\.0-only$/m);
    assert.match(source, /^\/\/ Copyright \(C\) 2026 Chao_Lan$/m);
    assert.doesNotMatch(source, /^\s*(?:import|export)\s/m);
    assert.ok(info.size < 2 * 1024 * 1024, `${info.size} bytes exceeds release limit`);
  }
});

test('README advertises the current main and assistant versions', async () => {
  const [readme, packageText, assistMetadataText] = await Promise.all([
    readFile(readmeUrl, 'utf8'),
    readFile(packageUrl, 'utf8'),
    readFile(assistMetadataUrl, 'utf8'),
  ]);
  const mainVersion = JSON.parse(packageText).version;
  const assistVersion = JSON.parse(assistMetadataText).version;
  assert.match(
    readme,
    new RegExp(`<strong>主脚本 v${mainVersion.replaceAll('.', '\\.')}<\\/strong> · 辅助插件 v${assistVersion.replaceAll('.', '\\.')}`),
  );
});
