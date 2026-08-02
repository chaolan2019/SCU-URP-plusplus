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

test('package version follows the main userscript version', async () => {
  const [packageText, metadataText] = await Promise.all([
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/metadata/urppp.json', import.meta.url), 'utf8'),
  ]);
  assert.equal(JSON.parse(packageText).version, JSON.parse(metadataText).version);
});
