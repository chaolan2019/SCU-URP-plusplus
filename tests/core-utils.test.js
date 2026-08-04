import test from 'node:test';
import assert from 'node:assert/strict';
import {
  alpha,
  darken,
  hexToRgb,
  lighten,
  mixHex,
  normalizeHexColor,
  rgbToHex,
} from '../src/core/color.js';
import { escapeHtml } from '../src/core/html.js';
import { compareVersions, parseUserscriptVersion } from '../src/core/version.js';
import { scheduleWeeks, scheduleWeeksFromDescription } from '../src/features/schedule-export/weeks.js';

test('escapes HTML-sensitive characters with existing empty-value semantics', () => {
  assert.equal(escapeHtml('<a title="x">Tom & Jerry\'s</a>'), '&lt;a title=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;');
  assert.equal(escapeHtml(0), '');
});

test('normalizes, blends, and adjusts shared colors deterministically', () => {
  assert.deepEqual(hexToRgb('#1e3a5f'), { r: 30, g: 58, b: 95 });
  assert.equal(rgbToHex(30.4, 58.4, 95.4), '#1e3a5f');
  assert.equal(normalizeHexColor('1e3a5f'), '#1E3A5F');
  assert.equal(normalizeHexColor('#xyz'), '');
  assert.equal(darken('#808080', 0.5), '#404040');
  assert.equal(lighten('#000000', 0.5), '#808080');
  assert.equal(alpha('#1E3A5F', 0.25), 'rgba(30,58,95,0.25)');
  assert.equal(mixHex('#000000', '#FFFFFF', 0.5), '#808080');
});

test('parses and compares userscript versions', () => {
  assert.equal(parseUserscriptVersion('// @version      1.5.1-beta'), '1.5.1-beta');
  assert.equal(compareVersions('1.5.1', '1.5.0'), 1);
  assert.equal(compareVersions('v1.5.1', '1.5.1'), 0);
  assert.equal(compareVersions('1.5.1-beta', '1.5.1-alpha'), 1);
  assert.equal(compareVersions('1.5', '1.5.0'), 0);
});

test('parses bitmap, range, parity, and descending week descriptions', () => {
  assert.deepEqual(scheduleWeeks('10101', ''), [1, 3, 5]);
  assert.deepEqual(scheduleWeeksFromDescription('1-8周（单）'), [1, 3, 5, 7]);
  assert.deepEqual(scheduleWeeksFromDescription('2至8周双周'), [2, 4, 6, 8]);
  assert.deepEqual(scheduleWeeksFromDescription('8-6周'), [6, 7, 8]);
  assert.deepEqual(scheduleWeeks('', '1,3,5周'), [1, 3, 5]);
});
