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
      getPropertyPriority: () => '',
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

test('keeps inline backgrounds the site marked as !important', () => {
  // 站点显式加了 !important，等于在说「这个底色有用，别动」；
  // 选课页的网格就是靠它保住「已占用 / 空闲」的区分。
  const removed = [];
  const element = {
    getAttribute: () => 'background-color:#C8D2D8',
    style: {
      getPropertyPriority: () => 'important',
      background: '#C8D2D8',
      backgroundColor: '#C8D2D8',
      borderColor: '',
      borderTopColor: '',
      borderRightColor: '',
      borderBottomColor: '',
      borderLeftColor: '',
      removeProperty(property) { removed.push(property); },
    },
  };

  scrubLightInlineBackground(element);

  assert.equal(removed.length, 0);
});

test('keeps dark inline backgrounds so color-coded cells survive', () => {
  // 选课页的时间筛选器用内联背景色标出已占用时段，这类颜色不能在暗色模式下被抹掉，
  // 否则整张网格只剩空架子。
  const removed = [];
  const element = {
    getAttribute: () => 'background-color:#5b7fa6;color:#123456',
    style: {
      getPropertyPriority: () => '',
      background: '#5b7fa6',
      backgroundColor: '#5b7fa6',
      borderColor: '',
      borderTopColor: '',
      borderRightColor: '',
      borderBottomColor: '',
      borderLeftColor: '',
      removeProperty(property) { removed.push(property); },
    },
  };

  scrubLightInlineBackground(element);

  assert.equal(removed.length, 0);
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
