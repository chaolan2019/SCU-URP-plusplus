/**
 * @file 给页面自带的确认框补上「退的是哪门课」。
 *
 * 退课页的 quitSel 只把提示语写成「是否确定要删除此门课程？」，用户点确认时并不知道
 * 自己在退哪一门。弹窗本体仍由页面自己的 layui 渲染（其 dialog 样式已由 internal.css
 * 接管），这里既不替换弹窗机制，也不碰回调语义，只在消息前补一行课程名。
 *
 * 挂的是 layui 的弹窗入口，不是 urp.confirm：后者是页面脚本自己的对象，插件能拿到的
 * 时机与引用都不确定（拿不到就静默失效，弹窗照旧没有课程名）；layui 一定是全局的，
 * 而且 urp.confirm 最终还是走它。confirm 与 open 都挂，靠内容里已有的标记做幂等。
 *
 * 课程名按表头的「课程名」列取。退课表首列是操作（图标无文字），按「第一个非空单元格」
 * 取会拿到培养方案。
 */

import { escapeHtml } from '../../core/html.js';

const HINT_CLASS = 'urppp-confirm-course';
const COURSE_HEADER = '课程名';
// 点下操作到弹窗出现是同步的，留点余量即可
const CLICK_TTL = 2000;
// 只增强「确定要删/退」这类确认框，别把别处的提示语也改了
const CONFIRM_TEXT = /是否确定|确定要|删除|退课/;

function textOf(element) {
  return String((element && element.textContent) || '').replace(/\s+/g, ' ').trim();
}

function courseColumnIndex(table) {
  const head = table && (table.tHead || table.querySelector('thead'));
  if (!head) return -1;
  for (const row of Array.from(head.rows || [])) {
    const index = Array.from(row.cells || []).findIndex((cell) => textOf(cell).includes(COURSE_HEADER));
    if (index >= 0) return index;
  }
  return -1;
}

function courseNameFromRow(row) {
  if (!row || !row.cells || !row.cells.length) return '';
  const index = courseColumnIndex(row.closest ? row.closest('table') : null);
  if (index >= 0) {
    const text = textOf(row.cells[index]);
    if (text) return text;
  }
  // 表头没写课程名时退回第一个有文字的单元格
  for (const cell of Array.from(row.cells)) {
    const text = textOf(cell);
    if (text) return text;
  }
  return '';
}

export function installConfirmDialog({ doc = document, win = window } = {}) {
  if (win.__urpppConfirmInstalled) return true;
  const layer = win.layer;
  if (!layer || typeof layer.open !== 'function') return false;
  win.__urpppConfirmInstalled = true;

  // 记下触发元素所在的行：弹窗只拿到提示语，课程信息要从点的那一行取
  let course = '';
  let courseAt = 0;
  doc.addEventListener('click', (event) => {
    const target = event.target;
    const row = target && target.closest ? target.closest('tr') : null;
    if (!row) return;
    const name = courseNameFromRow(row);
    if (name) {
      course = name;
      courseAt = Date.now();
    }
  }, true);

  function enrich(content) {
    if (typeof content !== 'string' || !content) return content;
    if (content.includes(HINT_CLASS)) return content;
    if (!course || Date.now() - courseAt > CLICK_TTL) return content;
    if (!CONFIRM_TEXT.test(content.replace(/<[^>]*>/g, ''))) return content;
    if (content.includes(course)) return content;
    return `<div class="${HINT_CLASS}">${escapeHtml(course)}</div>${content}`;
  }

  const originalOpen = layer.open.bind(layer);
  layer.open = (...args) => {
    const options = args[0];
    if (options && typeof options === 'object' && 'content' in options) {
      const content = enrich(options.content);
      if (content !== options.content) args[0] = { ...options, content };
    }
    return originalOpen(...args);
  };

  if (typeof layer.confirm === 'function') {
    // layui 1.x 的签名是 confirm(content, yes, cancel)，原样透传即可
    const originalConfirm = layer.confirm.bind(layer);
    layer.confirm = (content, options, yes, cancel) => originalConfirm(enrich(content), options, yes, cancel);
  }

  return true;
}
