/**
 * @file 给页面自带的确认框补上「退的是哪门课」。
 *
 * 退课页的 quitSel 只把提示语写成「是否确定要删除此门课程？」，不带课程信息，
 * 用户点确认时并不知道自己在退哪一门。这里包装 urp.confirm，在提示语前补一行课程名。
 *
 * 注意：弹窗本体仍由页面自己的 layui 渲染（其 dialog 样式已由 internal.css 接管），
 * 这里不替换弹窗机制，只增强内容。调用签名与回调语义保持不变。
 */

import { escapeHtml } from '../../core/html.js';

const COURSE_CLASS = 'urppp-confirm-course';

// 退课按钮位于课程行内，行内第一个非空单元格即课程名
function courseNameFromTarget(target) {
  const row = target && target.closest ? target.closest('tr') : null;
  if (!row) return '';
  const cells = Array.from(row.cells || []);
  for (const cell of cells) {
    const text = String(cell.textContent || '').replace(/\s+/g, ' ').trim();
    if (text) return text;
  }
  return '';
}

export function installConfirmDialog({ doc = document, win = window } = {}) {
  if (win.__urpppConfirmInstalled) return true;
  const urp = win.urp;
  if (!urp || typeof urp.confirm !== 'function') return false;

  // 记下触发元素：urp.confirm 只拿到提示语，课程信息要从点击的那一行取
  let lastTarget = null;
  doc.addEventListener('click', (event) => { lastTarget = event.target; }, true);

  const original = urp.confirm.bind(urp);
  urp.confirm = (message, callback) => {
    const course = courseNameFromTarget(lastTarget);
    const text = String(message == null ? '' : message);
    const enriched = course && !text.includes(course)
      ? `<div class="${COURSE_CLASS}">${escapeHtml(course)}</div>${text}`
      : text;
    return original(enriched, callback);
  };

  win.__urpppConfirmInstalled = true;
  return true;
}
