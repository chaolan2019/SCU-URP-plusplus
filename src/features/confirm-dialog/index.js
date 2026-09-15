/**
 * @file 通用确认弹窗，用于接管教务页面自带的 urp.confirm。
 *
 * 退课页的 quitSel / applyForRefund 都走 urp.confirm，而它内部是 layer.confirm，
 * 实测在插件环境下不一定弹得出来 —— 结果就是点了退课直接执行，用户没有任何确认机会。
 * 这里不再依赖页面那套，改由插件自己弹：调用签名保持 (message, callback)，
 * 回调语义同样是 true / false，因此页面代码无需改动。
 */

const DIALOG_ID = 'urppp-confirm-dialog';
const TITLE_TEXT = '提示信息';

export function createConfirmDialog({ doc = document } = {}) {
  let root = null;
  let body = null;
  let okBtn = null;
  let pending = null;

  function close(answer) {
    const callback = pending;
    pending = null;
    if (root) root.hidden = true;
    if (typeof callback === 'function') {
      try { callback(answer); } catch (_) { /* 页面回调自身的问题不外抛 */ }
    }
  }

  function ensure() {
    if (root && root.isConnected) return root;

    root = doc.getElementById(DIALOG_ID);
    if (!root) {
      root = doc.createElement('div');
      root.id = DIALOG_ID;
      root.hidden = true;
      root.innerHTML = [
        '<div class="urppp-cd-mask"></div>',
        '<div class="urppp-cd-panel" role="dialog" aria-modal="true">',
        `<div class="urppp-cd-title">${TITLE_TEXT}</div>`,
        '<div class="urppp-cd-body"></div>',
        '<div class="urppp-cd-actions">',
        '<button type="button" class="urppp-cd-btn urppp-cd-cancel">取消</button>',
        '<button type="button" class="urppp-cd-btn urppp-cd-ok">确定</button>',
        '</div>',
        '</div>',
      ].join('');
      (doc.body || doc.documentElement).appendChild(root);
    }

    body = root.querySelector('.urppp-cd-body');
    okBtn = root.querySelector('.urppp-cd-ok');
    const cancelBtn = root.querySelector('.urppp-cd-cancel');
    const mask = root.querySelector('.urppp-cd-mask');

    if (okBtn) okBtn.addEventListener('click', () => close(true));
    if (cancelBtn) cancelBtn.addEventListener('click', () => close(false));
    if (mask) mask.addEventListener('click', () => close(false));
    doc.addEventListener('keydown', (event) => {
      if (!root || root.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close(false);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        close(true);
      }
    }, true);

    return root;
  }

  function ask(message, callback) {
    ensure();
    // 提示语可能带 <br> 等标记，与页面原实现保持一致
    if (body) body.innerHTML = String(message == null ? '' : message);
    pending = callback;
    root.hidden = false;
    try { okBtn.focus(); } catch (_) {}
  }

  return { ask };
}

/**
 * 接管页面的 urp.confirm。返回是否安装成功：页面脚本可能晚于插件执行，
 * 拿不到 urp 时应由调用方稍后重试，而不是在这里自己转圈。
 */
export function installConfirmDialog({ doc = document, win = window } = {}) {
  if (win.__urpppConfirmInstalled) return true;
  const urp = win.urp;
  if (!urp || typeof urp.confirm !== 'function') return false;

  const dialog = createConfirmDialog({ doc });
  win.__urpppConfirmInstalled = true;
  urp.confirm = (message, callback) => dialog.ask(message, callback);
  return true;
}
