import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { scheduleImageTextLines } from '../src/features/schedule-export/image-layout.js';
import { scheduleCardLaneGeometry } from '../src/features/schedule-export/layout.js';
import { rewriteNativePdfSelector } from '../src/features/schedule-export/native-pdf.js';

const entryUrl = new URL('../src/userscripts/urppp.entry.js', import.meta.url);

test('schedule card lanes exactly cover the cell without internal gaps', () => {
  const width = 144.453125;
  const edgeOffset = 0.5;
  const single = scheduleCardLaneGeometry(width, 1, 0, edgeOffset);
  assert.equal(single.left, -edgeOffset);
  assert.equal(single.width, width);

  const lanes = Array.from({ length: 3 }, (_, index) => scheduleCardLaneGeometry(width, 3, index, edgeOffset));
  for (let index = 1; index < lanes.length; index += 1) {
    assert.ok(Math.abs(lanes[index - 1].left + lanes[index - 1].width - lanes[index].left) < 1e-9);
  }
  assert.ok(Math.abs(lanes.at(-1).left + lanes.at(-1).width - (-edgeOffset + width)) < 1e-9);
});

test('native PDF stage rewrites selectors into the offscreen clone', () => {
  assert.equal(rewriteNativePdfSelector('#mycoursetable'), '#urppp-pdf-mycoursetable');
  assert.equal(rewriteNativePdfSelector('#mycoursetable td'), '#urppp-pdf-mycoursetable td');
  assert.equal(rewriteNativePdfSelector('#courseTableBody tr'), '#urppp-pdf-courseTableBody tr');
  assert.equal(rewriteNativePdfSelector('#courseTable'), '#urppp-pdf-courseTable');
  assert.equal(rewriteNativePdfSelector('div.class_div'), 'div.urppp-pdf-card');
  assert.equal(rewriteNativePdfSelector('div.printDiv'), 'div.urppp-pdf-card.printDiv');
  assert.equal(rewriteNativePdfSelector('#page-content-template'), '#urppp-pdf-page');
  assert.equal(rewriteNativePdfSelector('.course'), '.course');
  assert.equal(rewriteNativePdfSelector('#h4_id1,#h4_id2'), '#urppp-pdf-h4-1,#urppp-pdf-h4-2');
});

test('native PDF export suspends beautification around the real site lifecycle', async () => {
  const source = await readFile(entryUrl, 'utf8');
  assert.match(source, /let nativePdfIsolationDepth = 0/);
  assert.match(source, /if \(isNativePdfIsolationActive\(\)\) return/);
  assert.match(source, /function isUrpppOwnedStyle\(style\)/);
  assert.match(source, /\(style\.textContent \|\| ''\)\.includes\('urppp-'\)/);
  assert.match(source, /style: element\.getAttribute\('style'\)/);
  assert.match(source, /style\.setAttribute\('media', 'not all'\)/);
  assert.match(source, /element\.setAttribute\('style', style\)/);
  assert.match(source, /page\.divBuild = nativeDivBuild/);
  assert.match(source, /timeout = setTimeout[\s\S]*60 \* 1000/);
  assert.match(source, /function isolateScheduleForNativeExport\(\)/);
  assert.match(source, /function exportNativePdfIsolated\(button\)/);
  assert.match(source, /await exportNativePdfIsolated\(button\)/);
  assert.match(source, /window\.__urpppPdfDiagnose = async \(\) =>/);
  assert.match(source, /__urpppOriginalDivBuild/);
  assert.match(source, /await pdfHandler\(\)/);
  assert.doesNotMatch(source, /cloneNativePdfStage\(sourceHost\)/);
  assert.doesNotMatch(source, /function runNativePdfWithCapture\(/);
  assert.doesNotMatch(source, /await runNativePdfWithCapture\(button, context\)/);
  assert.doesNotMatch(source, /frame\.srcdoc/);
  assert.doesNotMatch(source, /frame\.contentDocument/);
});

test('PNG text layout preserves wrapped titles and reserves locations', () => {
  const lines = scheduleImageTextLines({
    name: '模拟电子技术基础实验（Ⅱ）',
    teacher: '测试教师',
    weekDescription: '4-18周双周',
    startSection: 3,
    endSection: 4,
    campus: '江安',
    building: '实验室',
    classroom: '二基楼A505',
  }, 6, 8);
  assert.equal(lines.length <= 8, true);
  assert.equal(lines[0].kind, 'title');
  assert.equal(lines[1].kind, 'title');
  assert.ok(lines.some((line) => line.kind === 'schedule'));
  assert.ok(lines.some((line) => line.kind === 'location'));
});

test('PNG export snapshots every skin into aligned standalone SVG colors', async () => {
  const source = await readFile(entryUrl, 'utf8');
  for (const skin of ['apple', 'flat', 'organic', 'brutal', 'editorial', 'neu']) {
    assert.match(source, new RegExp(`\\b${skin}: \\{ frameRadius:`), skin);
  }
  assert.match(source, /function currentScheduleImageTheme\(\)/);
  assert.match(source, /function buildScheduleSvg\(data, themeOverride\)/);
  assert.match(source, /const cardWidth = laneWidth;/);
  assert.match(source, /line\.kind === 'title'/);
  assert.doesNotMatch(source, /const gap = 3;/);
  assert.match(source, /background: colors\.bg/);
  assert.match(source, /image:\s*\{\s*theme: currentScheduleImageTheme/);
});
