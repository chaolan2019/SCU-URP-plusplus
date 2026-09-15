/**
 * @file 给页面自带的确认框补上「退的是哪门课」。
 *
 * 退课页的 quitSel 只把提示语写成「是否确定要删除此门课程？」，用户点确认时并不知道
 * 自己在退哪一门。弹窗本体仍由页面自己的 layui 渲染（其样式由 internal.css 接管），
 * 这里不替换弹窗机制、不碰回调语义，只在消息前补一行课程名。
 *
 * 不挂 urp.confirm，也不挂 layer：这个页面的弹窗是页面自己的 Urp.prototype.confirm
 * 拼出来的 layui 1.x DOM，内容节点只有 id 没有 class；urp 与 layer 都不保证挂在全局。
 * 挂不上的表现是静默失效，弹窗照旧没有课程名。所以改成等弹窗出现后再补，
 * 谁把它创建出来的都不影响。
 *
 * 课程名按表头的「课程名」列取。退课表首列是操作（图标无文字），按「第一个非空
 * 单元格」取会拿到培养方案。
 */

import { escapeHtml } from '../../core/html.js';

const HINT_CLASS = 'urppp-confirm-course';
// layui 1.x 的内容节点是 id，2.x 是 class，两种都认
const CONTENT_SELECTOR = '.layui-layer-content, #layui-layer-content';
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

export function installConfirmDialog({
  doc = document,
  win = window,
  MutationObserverRef = MutationObserver,
} = {}) {
  if (win.__urpppConfirmInstalled) return true;
  const root = doc.documentElement;
  if (!root) return false;
  win.__urpppConfirmInstalled = true;

  // 记下被点的那一行：弹窗只拿到提示语，课程信息要从这里取
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

  function addHint(dialog) {
    const content = dialog.querySelector(CONTENT_SELECTOR);
    if (!content || content.querySelector(`.${HINT_CLASS}`)) return;
    if (!course || Date.now() - courseAt > CLICK_TTL) return;
    const text = textOf(content);
    if (!CONFIRM_TEXT.test(text) || text.includes(course)) return;

    // layui 在创建时按内容高度定位，补一行会让整块往下长；把 top 抬回一半抵消
    const before = dialog.offsetHeight;
    content.insertAdjacentHTML('afterbegin', `<div class="${HINT_CLASS}">${escapeHtml(course)}</div>`);
    const grown = dialog.offsetHeight - before;
    const top = parseFloat(dialog.style.top);
    if (grown > 0 && Number.isFinite(top)) dialog.style.top = `${top - grown / 2}px`;
  }

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches('.layui-layer-dialog')) addHint(node);
    node.querySelectorAll('.layui-layer-dialog').forEach(addHint);
  }

  const observer = new MutationObserverRef((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) scan(node);
    }
  });
  // 观察 documentElement 而不是 body：路由替换 body 后仍继续生效
  observer.observe(root, { childList: true, subtree: true });

  return true;
}
