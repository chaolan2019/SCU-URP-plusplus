import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const workflowsUrl = new URL('../.github/workflows/', import.meta.url);
const dependabotUrl = new URL('../.github/dependabot.yml', import.meta.url);

test('external GitHub Actions are pinned to immutable commit SHAs', async () => {
  const files = (await readdir(workflowsUrl)).filter((name) => /\.ya?ml$/i.test(name));
  assert.ok(files.length > 0, 'no GitHub Actions workflows found');

  for (const file of files) {
    const source = await readFile(new URL(file, workflowsUrl), 'utf8');
    const references = Array.from(source.matchAll(/^\s*uses:\s*([^\s#]+)/gm), (match) => match[1]);
    for (const reference of references) {
      if (reference.startsWith('./') || reference.startsWith('docker://')) continue;
      assert.match(
        reference,
        /^[^@\s]+@[0-9a-f]{40}$/,
        `${file} contains mutable or invalid action reference: ${reference}`,
      );
    }
  }
});

test('Dependabot opens reviewable weekly updates for Actions and npm', async () => {
  const source = await readFile(dependabotUrl, 'utf8');
  assert.match(source, /package-ecosystem:\s*github-actions/);
  assert.match(source, /package-ecosystem:\s*npm/);
  assert.equal((source.match(/interval:\s*weekly/g) || []).length, 2);
  assert.doesNotMatch(source, /automerge|auto-merge/i);
});
