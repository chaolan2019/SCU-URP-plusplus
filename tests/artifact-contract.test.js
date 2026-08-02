import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const artifacts = [
  { file: new URL('../urppp.user.js', import.meta.url), version: '1.5.3' },
  { file: new URL('../urpppp.user.js', import.meta.url), version: '1.3.2' },
];

test('generated artifacts remain installable readable single files', async () => {
  for (const artifact of artifacts) {
    const [source, info] = await Promise.all([
      readFile(artifact.file, 'utf8'),
      stat(artifact.file),
    ]);
    assert.ok(source.startsWith('// ==UserScript==\n'));
    assert.match(source, new RegExp(`^// @version\\s+${artifact.version.replaceAll('.', '\\.')}$`, 'm'));
    assert.match(source, /^\/\/ @license\s+GPL-3\.0-only$/m);
    assert.match(source, /^\/\/ SPDX-License-Identifier: GPL-3\.0-only$/m);
    assert.match(source, /^\/\/ Copyright \(C\) 2026 Chao_Lan$/m);
    assert.doesNotMatch(source, /^\s*(?:import|export)\s/m);
    assert.ok(info.size < 2 * 1024 * 1024, `${info.size} bytes exceeds release limit`);
  }
});
