import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  exportCourseColor,
  layoutScheduleDay,
  scheduleExportEvents,
  scheduleImageTextLines,
  wrapScheduleFooter,
} from '../src/features/schedule-export/image-layout.js';
import { scheduleCardLaneGeometry } from '../src/features/schedule-export/layout.js';
import { buildScheduleSvg } from '../src/features/schedule-export/schedule-image.js';
import {
  createScheduleExportUi,
  scheduleExportCompletionNotes,
} from '../src/features/schedule-export/ui.js';

const entryUrl = new URL('../src/userscripts/urppp.entry.js', import.meta.url);
const nativePdfUrl = new URL('../src/features/schedule-export/native-pdf.js', import.meta.url);
const scheduleImageUrl = new URL('../src/features/schedule-export/schedule-image.js', import.meta.url);
const scheduleExportUiUrl = new URL('../src/features/schedule-export/ui.js', import.meta.url);
const featureStylesUrl = new URL('../src/styles/features.css', import.meta.url);
const scheduleExportStylesUrl = new URL('../src/styles/schedule-export.css', import.meta.url);

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

test('native PDF export suspends beautification around the real site lifecycle', async () => {
  const [source, moduleSource, uiSource] = await Promise.all([
    readFile(entryUrl, 'utf8'),
    readFile(nativePdfUrl, 'utf8'),
    readFile(scheduleExportUiUrl, 'utf8'),
  ]);
  assert.match(moduleSource, /let nativePdfIsolationDepth = 0/);
  assert.match(source, /if \(isNativePdfIsolationActive\(\)\) return/);
  assert.match(moduleSource, /function isUrpppOwnedStyle\(style\)/);
  assert.match(moduleSource, /\(style\.textContent \|\| ''\)\.includes\('urppp-'\)/);
  assert.match(moduleSource, /style: element\.getAttribute\('style'\)/);
  assert.match(moduleSource, /style\.setAttribute\('media', 'not all'\)/);
  assert.match(moduleSource, /element\.setAttribute\('style', style\)/);
  assert.match(moduleSource, /page\.divBuild = nativeDivBuild/);
  assert.match(moduleSource, /timeout = setTimeout[\s\S]*60 \* 1000/);
  assert.match(moduleSource, /export function isolateScheduleForNativeExport\(options = \{\}\)/);
  assert.match(moduleSource, /export function exportNativePdfIsolated\(button, options = \{\}\)/);
  assert.match(source, /await exportNativePdfIsolated\(button, \{/);
  assert.match(source, /window\.__urpppPdfDiagnose = async \(\) =>/);
  assert.match(source, /__urpppOriginalDivBuild/);
  assert.match(uiSource, /await pdfHandler\(\)/);
  assert.doesNotMatch(source, /function runNativePdfWithCapture\(/);
  assert.doesNotMatch(source, /frame\.srcdoc/);
  assert.doesNotMatch(source, /frame\.contentDocument/);
});

test('PNG event layout assigns stable lanes and deterministic colors', () => {
  const courses = [{
    name: '课程 A',
    arrangements: [
      { day: 1, startSection: 1, endSection: 2 },
      { day: 1, startSection: 4, endSection: 4 },
    ],
  }, {
    name: '课程 B',
    arrangements: [{ day: 1, startSection: 2, endSection: 3 }],
  }];
  const events = scheduleExportEvents({ courses });
  const laidOut = layoutScheduleDay(events);

  assert.equal(laidOut.length, 3);
  assert.deepEqual(laidOut.slice(0, 2).map((item) => [item.lane, item.laneCount]), [[0, 2], [1, 2]]);
  assert.deepEqual([laidOut[2].lane, laidOut[2].laneCount], [0, 1]);
  assert.equal(exportCourseColor('课程 A'), exportCourseColor('课程 A'));
  assert.match(exportCourseColor('课程 A'), /^#[0-9A-F]{6}$/);
  assert.deepEqual(wrapScheduleFooter('1234567', 3), ['123', '456', '7']);
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

test('schedule export completion notes preserve format-specific omissions', () => {
  const data = {
    courses: [
      { arrangements: [] },
      { arrangements: [{ day: 1 }] },
    ],
  };
  assert.deepEqual(scheduleExportCompletionNotes('ics', data, {
    ics: { missingWeeks: 2, missingTimes: 1 },
  }), [
    '1 门未排定时间的课程未写入日历',
    '2 个上课安排缺少周次',
    '1 个上课安排缺少节次时间',
  ]);
  assert.deepEqual(scheduleExportCompletionNotes('json', data, {
    json: { unscheduledCourses: 1, missingWeeks: 2, invalidArrangements: 3 },
  }), [
    '1 门未排定时间的课程未写入 JSON',
    '2 个上课安排缺少周次',
    '3 个上课安排缺少日期或节次',
  ]);
});

test('schedule export UI orchestrates format execution and restores its trigger', async () => {
  const calls = [];
  const trigger = { disabled: false, innerHTML: '<i>export</i>' };
  const ui = createScheduleExportUi({
    document: {},
    window: {},
    ensureStyles: () => {},
    loadData: async (source) => {
      calls.push(['load', source]);
      return { courses: [{ arrangements: [] }] };
    },
    exportJson: async () => {
      calls.push(['json']);
      return { unscheduledCourses: 1 };
    },
    exportIcs: async () => {},
    exportPng: async () => {},
    showToast: (message, error) => calls.push(['toast', message, error]),
    nativePageUrl: '/schedule',
    navigate: () => {},
    logger: { warn: (...args) => calls.push(['warn', ...args]) },
  });

  await ui.run('json', 'clean', null, trigger);

  assert.deepEqual(calls, [
    ['load', 'clean'],
    ['json'],
    ['toast', '课表已导出：JSON；1 门未排定时间的课程未写入 JSON', undefined],
  ]);
  assert.equal(trigger.disabled, false);
  assert.equal(trigger.innerHTML, '<i>export</i>');
});

test('schedule export owns its menu and date dialog styles', async () => {
  const [sharedStyles, exportStyles] = await Promise.all([
    readFile(featureStylesUrl, 'utf8'),
    readFile(scheduleExportStylesUrl, 'utf8'),
  ]);
  assert.doesNotMatch(sharedStyles, /urppp-export|urppp-dialog/);
  assert.match(exportStyles, /\.urppp-export-menu/);
  assert.match(exportStyles, /\.urppp-dialog-mask/);
});

test('pure PNG renderer is deterministic, escaped, and lane-aware', () => {
  const data = {
    semester: { label: '2026 & <春季>' },
    courses: [{
      name: '算法 & <安全>',
      teacher: '张老师',
      arrangements: [{
        day: 1,
        startSection: 1,
        endSection: 2,
        weekDescription: '1-16周',
        campus: '江安',
        building: '一教',
        classroom: 'A101',
      }],
    }, {
      name: '并发课程',
      teacher: '李老师',
      arrangements: [{
        day: 1,
        startSection: 2,
        endSection: 3,
        weekDescription: '1-16周',
        campus: '江安',
        building: '二教',
        classroom: 'B202',
      }],
    }, {
      name: '待定 <课程>',
      teacher: '',
      arrangements: [],
    }],
  };
  const theme = {
    id: 'light',
    skin: 'apple',
    dark: false,
    label: '类 Apple & <浅色>',
    colors: {
      bg: '#F5F5F7',
      surface: '#FFFFFF',
      input: '#F5F5F7',
      text: '#1D1D1F',
      secondary: '#6E6E73',
      muted: '#86868B',
      border: '#D2D2D7',
      primary: '#0071E3',
    },
    shape: {
      frameRadius: 24,
      headerRadius: 13,
      gridRadius: 10,
      cardRadius: 12,
      frameStroke: 1,
      cardStroke: 1,
      shadow: 'soft',
    },
  };
  const options = { now: new Date('2026-03-01T04:05:06Z') };
  const first = buildScheduleSvg(data, theme, options);
  const second = buildScheduleSvg(data, theme, options);

  assert.deepEqual(first, second);
  assert.equal(first.width, 1960);
  assert.equal(first.background, theme.colors.bg);
  assert.equal(first.theme, theme);
  assert.match(first.svg, /2026 &amp; &lt;春季&gt;课表/);
  assert.match(first.svg, /算法 &amp;/);
  assert.match(first.svg, /类 Apple &amp; &lt;浅色&gt;/);
  assert.match(first.svg, /未排定时间的课程/);
  assert.match(first.svg, /待定 &lt;课程&gt;/);
  assert.doesNotMatch(first.svg, /算法 & <安全>/);

  const cards = [...first.svg.matchAll(/data-course-card="1"[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*width="([^"]+)"/g)];
  assert.equal(cards.length, 2);
  assert.notEqual(cards[0][1], cards[1][1]);
  assert.equal(cards[0][3], cards[1][3]);
});

test('PNG export delegates SVG rendering while retaining current theme ownership', async () => {
  const [source, imageSource, uiSource] = await Promise.all([
    readFile(entryUrl, 'utf8'),
    readFile(scheduleImageUrl, 'utf8'),
    readFile(scheduleExportUiUrl, 'utf8'),
  ]);
  for (const skin of ['apple', 'flat', 'organic', 'brutal', 'editorial', 'neu']) {
    assert.match(source, new RegExp(`\\b${skin}: \\{ frameRadius:`), skin);
  }
  assert.match(source, /function currentScheduleImageTheme\(\)/);
  assert.match(source, /return renderScheduleSvg\(data, themeOverride \|\| currentScheduleImageTheme\(\)\)/);
  assert.doesNotMatch(source, /function scheduleImageCourseStyle\(/);
  assert.doesNotMatch(source, /function exportOptionHtml\(/);
  assert.match(source, /const scheduleExportUi = createScheduleExportUi\(\{/);
  assert.match(uiSource, /function createMenu\(options = \{\}\)/);
  assert.match(imageSource, /const cardWidth = laneWidth;/);
  assert.match(imageSource, /line\.kind === 'title'/);
  assert.doesNotMatch(imageSource, /const gap = 3;/);
  assert.match(imageSource, /background: colors\.bg/);
  assert.match(source, /image:\s*\{\s*theme: currentScheduleImageTheme/);
});
