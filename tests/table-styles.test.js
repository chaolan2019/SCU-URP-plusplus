import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const internalStylesUrl = new URL('../src/styles/internal.css', import.meta.url);
const tableBeautifyStylesUrl = new URL('../src/styles/table-beautify.css', import.meta.url);

test('table beautify owns notice card styles', async () => {
  const [internalStyles, tableBeautifyStyles] = await Promise.all([
    readFile(internalStylesUrl, 'utf8'),
    readFile(tableBeautifyStylesUrl, 'utf8'),
  ]);

  assert.doesNotMatch(internalStyles, /urppp-notice-table/);
  assert.doesNotMatch(internalStyles, /urppp-notice-card/);
  assert.doesNotMatch(internalStyles, /urppp-notice-time/);
  assert.doesNotMatch(internalStyles, /公告日期胶囊/);

  assert.match(tableBeautifyStyles, /table\.urppp-notice-table/);
  assert.match(tableBeautifyStyles, /urppp-notice-card/);
  assert.match(tableBeautifyStyles, /html\.urppp-theme-dark table\.urppp-notice-table/);
});
