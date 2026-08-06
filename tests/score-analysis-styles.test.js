import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const entryUrl = new URL('../src/userscripts/urppp.entry.js', import.meta.url);
const controllerUrl = new URL('../src/features/score-analysis/controller.js', import.meta.url);
const stylesUrl = new URL('../src/styles/score-analysis.css', import.meta.url);

test('score analysis owns its panel, chart and table styles', async () => {
  const [entry, controller, styles] = await Promise.all([
    readFile(entryUrl, 'utf8'),
    readFile(controllerUrl, 'utf8'),
    readFile(stylesUrl, 'utf8'),
  ]);

  // 样式归属：CSS 在独立文件，入口 import 后经 deps 注入 controller，controller 写入 style 节点
  assert.match(entry, /import scoreAnalysisStyles from '\.\.\/styles\/score-analysis\.css'/);
  assert.match(entry, /styles: scoreAnalysisStyles/);
  assert.match(controller, /style\.textContent = deps\.styles;/);

  assert.match(styles, /#urppp-score-analysis\.urppp-sa/);
  assert.match(styles, /\.urppp-sa-toggle\s*\{/);
  assert.match(styles, /\.urppp-sa-metrics\s*\{/);
  assert.match(styles, /\.urppp-sa-chart\s*\{/);
  assert.match(styles, /\.urppp-sa-table\s*\{/);
  assert.match(styles, /\.urppp-sa-error/);
  assert.match(styles, /@media \(max-width: 900px\)/);

  // 入口自身不内嵌成绩分析选择器（渐进迁移约束）
  assert.doesNotMatch(entry, /urppp-sa-metrics\{/);
  assert.doesNotMatch(entry, /urppp-sa-toggle\{/);
});
