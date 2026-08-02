import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const stylesheetUrl = new URL('../src/styles/schedule-cards.css', import.meta.url);

async function scheduleCardStyles() {
  return readFile(stylesheetUrl, 'utf8');
}

test('schedule card styles cover every supported interface skin', async () => {
  const source = await scheduleCardStyles();
  for (const skin of ['apple', 'flat', 'organic', 'brutal', 'editorial', 'neu']) {
    assert.match(source, new RegExp(`data-urppp-skin=["']${skin}["']`), skin);
  }
  assert.match(source, /#courseTable \.class_div\.box_font::before/);
  assert.match(source, /pointer-events:\s*none/);
  assert.match(source, /prefers-reduced-motion:\s*reduce/);
});

test('schedule card styles cannot alter table cells or card geometry', async () => {
  const source = await scheduleCardStyles();
  assert.doesNotMatch(source, /#courseTable\s+(?:table|thead|tbody|tr|th|td)\b/i);
  assert.doesNotMatch(source, /#courseTable\s*\{[^}]*background\s*:/is);

  const cardBlocks = [...source.matchAll(/#courseTable \.class_div\.box_font\s*\{([^}]*)\}/g)];
  assert.ok(cardBlocks.length >= 1);
  for (const [, declarations] of cardBlocks) {
    assert.doesNotMatch(declarations, /(?:^|\n)\s*(?:width|height|inset|top|right|bottom|left|transform)\s*:/i);
  }
});
