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
  assert.match(entry, /st\.textContent = cleanModeStyles;/);

  assert.match(cleanModeStyles, /#urppp-clean-root\{/);
  assert.match(cleanModeStyles, /\.uc-lesson\{/);
  assert.match(cleanModeStyles, /\.uc-card\{/);
  assert.match(cleanModeStyles, /\.uc-score-cell/);
  assert.match(cleanModeStyles, /\.uc-modal-stack-hint/);
});
