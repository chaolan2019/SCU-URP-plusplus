import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const internalStylesUrl = new URL('../src/styles/internal.css', import.meta.url);
const dashboardStylesUrl = new URL('../src/styles/dashboard.css', import.meta.url);

test('dashboard owns home reconstruction styles', async () => {
  const [internalStyles, dashboardStyles] = await Promise.all([
    readFile(internalStylesUrl, 'utf8'),
    readFile(dashboardStylesUrl, 'utf8'),
  ]);

  assert.doesNotMatch(internalStyles, /#urppp-dashboard/);
  assert.doesNotMatch(internalStyles, /\.urppp-stats-grid/);
  assert.doesNotMatch(internalStyles, /\.urppp-main-grid/);
  assert.doesNotMatch(internalStyles, /\.urppp-stat-card/);
  assert.doesNotMatch(internalStyles, /\.urppp-welcome/);

  assert.match(dashboardStyles, /#urppp-dashboard/);
  assert.match(dashboardStyles, /\.urppp-stats-grid/);
  assert.match(dashboardStyles, /\.urppp-main-grid/);
  assert.match(dashboardStyles, /\.urppp-stat-card/);
  assert.match(dashboardStyles, /\.urppp-welcome/);
  assert.match(dashboardStyles, /#urppp-dashboard \.btn-app/);
});
