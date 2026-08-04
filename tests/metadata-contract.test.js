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
