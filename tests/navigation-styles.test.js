import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const internalStylesUrl = new URL('../src/styles/internal.css', import.meta.url);
const navigationStylesUrl = new URL('../src/styles/navigation.css', import.meta.url);

test('navigation owns navbar, sidebar, and breadcrumb shell styles', async () => {
  const [internalStyles, navigationStyles] = await Promise.all([
    readFile(internalStylesUrl, 'utf8'),
    readFile(navigationStylesUrl, 'utf8'),
  ]);

  assert.doesNotMatch(internalStyles, /#urppp-nav-theme/);
  assert.doesNotMatch(internalStyles, /urppp-nav-settings/);
  assert.doesNotMatch(internalStyles, /#urppp-menus/);
  assert.doesNotMatch(internalStyles, /\.sidebar\.menu-min/);
  assert.doesNotMatch(internalStyles, /#menu-toggler/);
  assert.doesNotMatch(internalStyles, /#clickdiv/);
  assert.doesNotMatch(internalStyles, /#form-search\.nav-search/);
  assert.doesNotMatch(internalStyles, /\.ace-nav/);
  assert.doesNotMatch(internalStyles, /\.urppp-sidebar-header/);
  assert.doesNotMatch(internalStyles, /\.urppp-nav-dot/);
  assert.doesNotMatch(internalStyles, /\.navbar\.navbar-default/);

  assert.match(navigationStyles, /#urppp-nav-theme/);
  assert.match(navigationStyles, /urppp-nav-settings/);
  assert.match(navigationStyles, /#urppp-menus/);
  assert.match(navigationStyles, /\.sidebar\.menu-min/);
  assert.match(navigationStyles, /#menu-toggler/);
  assert.match(navigationStyles, /\.ace-nav/);
  assert.match(navigationStyles, /\.urppp-sidebar-header/);
  assert.match(navigationStyles, /\.urppp-nav-dot/);
  assert.match(navigationStyles, /#breadcrumbs/);
  // apple/flat 侧边栏文字跟随主题黑/白，避免系统蓝
  assert.match(navigationStyles, /data-urppp-skin="apple"\] \.sidebar \.nav-list > li > a/);
  assert.match(navigationStyles, /data-urppp-skin="flat"\] \.sidebar \.nav-list > li > a/);
  assert.match(navigationStyles, /color: var\(--text\) !important;/);
});
