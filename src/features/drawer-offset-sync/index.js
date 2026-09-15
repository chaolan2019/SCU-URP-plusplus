/**
 * @file 让站点的「收起位移」跟得上面板自己的高度。
 *
 * 时间筛选器的抽屉（#div_kbt，站点自己渲染）靠内联 top 收起：top = 面板高度的负值。
 * 但站点只在载入时量一次并把它记住；用户点查询后网格被填满、面板长高，它仍然按旧值
 * 收起，于是收起态底下会露出「新高度 − 旧高度」那一截（实测 107px，与用户截图一致）。
 * 站点不会因为 resize 重算（实测派发 resize 无反应）。
 *
 * 所以这里只做一件事：站点已经决定收起（top 为负）时，把位移补齐到当前高度。
 * 展开态（top 非负）一律不碰。
 *
 * 两条触发都必须立即校正，不能等防抖：站点那笔写入之后到下一次绘制之间若还留着旧值，
 * 用户就会看到「先露一下再收回」。立即写入不会造成跳变——top 带过渡，浏览器会把
 * 重设的终值平滑地滑过去；而 CSS 过渡只改计算值，内联里始终是终值，不会误触中间态。
 */

const PANEL_ID = 'div_kbt';
const CONTAINER_ID = 'div_kb';

function createDrawerOffsetSync({ doc, ResizeObserverRef, MutationObserverRef }) {
  let panel = null;
  let observer = null;
  let resizeObserver = null;
  let attempts = 0;

  function settle() {
    if (!panel || !panel.isConnected) return;
    const top = parseFloat(panel.style.top);
    // 展开态或没有位移：不碰
    if (!Number.isFinite(top) || top >= 0) return;
    const height = panel.offsetHeight;
    // 高度还没量出来，或已经对齐
    if (!height || Math.abs(top + height) < 1) return;
    panel.style.top = `${-height}px`;
  }

  function bind() {
    const next = doc.getElementById(PANEL_ID);
    const container = doc.getElementById(CONTAINER_ID);
    if (!next || !container) {
      // 抽屉由站点后置渲染，给它几次机会
      if (attempts < 10) {
        attempts += 1;
        setTimeout(bind, 300);
      }
      return;
    }
    if (panel === next && observer) return;
    attempts = 0;
    panel = next;
    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    // 站点改位移：收起 / 展开都从这里经过
    observer = new MutationObserverRef(settle);
    observer.observe(panel, { attributes: true, attributeFilter: ['style'] });
    // 内容长高：查询后网格被填满就发生在这里
    if (typeof ResizeObserverRef === 'function') {
      resizeObserver = new ResizeObserverRef(settle);
      resizeObserver.observe(container);
      resizeObserver.observe(panel);
    }
  }

  return { bind };
}

export function startDrawerOffsetSync(options = {}) {
  const win = options.win || window;
  if (!win.__urpppDrawerOffsetSync) {
    win.__urpppDrawerOffsetSync = createDrawerOffsetSync({
      doc: options.doc || document,
      ResizeObserverRef: options.ResizeObserverRef || win.ResizeObserver,
      MutationObserverRef: options.MutationObserverRef || MutationObserver,
    });
  }
  // 可重复调用：路由替换后重新绑定
  win.__urpppDrawerOffsetSync.bind();
}
