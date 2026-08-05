import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTableInlineStyleScrubber,
  isLightInlineColor,
  scrubLightInlineBackground,
} from '../src/features/table-beautify/inline-style-scrub.js';

test('detects light inline colors without treating transparent or dark colors as light', () => {
  assert.equal(isLightInlineColor('#ffffff'), true);
  assert.equal(isLightInlineColor('#e6e6e6'), true);
  assert.equal(isLightInlineColor('rgb(210, 220, 230)'), true);
  assert.equal(isLightInlineColor('rgb(20, 30, 40)'), false);
  assert.equal(isLightInlineColor('transparent'), false);
});

test('removes inline backgrounds and pale borders while preserving unrelated styles', () => {
  const removed = [];
  const element = {
    getAttribute: () => 'background-color:#fff;border-color:#ddd;color:#123456',
    style: {
      background: '',
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderTopColor: '',
      borderRightColor: '',
      borderBottomColor: '',
      borderLeftColor: '',
      removeProperty(property) { removed.push(property); },
    },
  };

  scrubLightInlineBackground(element);

  assert.ok(removed.includes('background-color'));
  assert.ok(removed.includes('background-image'));
  assert.ok(removed.includes('border-color'));
  assert.equal(removed.includes('color'), false);
});

test('scrubs table nodes only in dark mode and outside native PDF isolation', () => {
  let dark = false;
  let isolated = false;
  let queries = 0;
  const element = {
    getAttribute: () => 'background:#fff',
    style: {
      background: '#fff',
      backgroundColor: '',
      removeProperty() {},
    },
  };
  const documentRef = {
    body: { classList: { contains: () => false } },
    documentElement: { classList: { contains: () => dark } },
    querySelectorAll() {
      queries += 1;
      return [element];
    },
  };
  const controller = createTableInlineStyleScrubber({
    documentRef,
    windowRef: {},
    MutationObserverRef: class {},
    isNativePdfIsolationActive: () => isolated,
  });

  controller.scrubTableHeaderInlineBg();
  assert.equal(queries, 0);

  dark = true;
  controller.scrubTableHeaderInlineBg();
  assert.equal(queries, 1);

  isolated = true;
  controller.scrubTableHeaderInlineBg();
  assert.equal(queries, 1);
});
