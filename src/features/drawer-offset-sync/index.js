/**
 * @file 让站点的「收起位移」跟得上面板自己的高度。
 *
 * 时间筛选器的抽屉（#div_kbt，站点自己渲染）靠内联 top 收起：top = 抽屉高度的负值。
 * 但站点只量一次并记住；用户点查询后网格被填满、抽屉长高，它仍按旧值收起，
 * 于是收起态底下会露出「新高度 − 旧高度」那一截（实测 107px，逐帧记录里正好一帧）。
 *
 * 两条约束决定了这里的写法：
 *
 * 1. 必须等抽屉出现再接管。抽屉是用户点开面板时站点才渲染出来的，启动时并不存在；
 *    早前只在固定时刻找它，于是从未绑定，校正一次也没跑过。
 * 2. 校正必须落在绘制之前。ResizeObserver 的回调在布局之后，那一帧该露的已经画了；
 *    文档级的 MutationObserver 回调是微任务，落在布局之前，在那里读一次高度
 *    （强制布局）再写位移，本帧绘制用的就是修正后的值。
 *
 * 站点还可能整块替换抽屉节点，所以观察整个文档：节点换了就重新接管。
 * 展开态（top 非负）一律不碰。
 */

const PANEL_ID = 'div_kbt';
const CONTAINER_ID = 'div_kb';

function createDrawerOffsetSync({ doc, ResizeObserverRef, MutationObserverRef }) {
  let panel = null;
  let observer = null;
  let contentObserver = null;
  let resizeObserver = null;

  function settle() {
    if (!panel || !panel.isConnected) return false;
    const top = parseFloat(panel.style.top);
    // 展开态或没有位移：不碰
    if (!Number.isFinite(top) || top >= 0) return false;
    const height = panel.offsetHeight;
    // 高度还没量出来，或已经对齐
    if (!height || Math.abs(top + height) < 1) return false;
    panel.style.top = `${-height}px`;
    // 诊断用计数。用户脚本的 window 在页面控制台看不到（沙箱），
    // 所以写在 DOM 上：documentElement.dataset.urpppDrawerFixed
    const root = doc.documentElement;
    if (root) root.dataset.urpppDrawerFixed = String((Number(root.dataset.urpppDrawerFixed) || 0) + 1);
    return true;
  }

  function bind() {
    const next = doc.getElementById(PANEL_ID);
    const container = doc.getElementById(CONTAINER_ID);
    if (!next || !container) return;
    if (panel !== next) {
      panel = next;
      if (observer) observer.disconnect();
      observer = new MutationObserverRef(settle);
      observer.observe(panel, { attributes: true, attributeFilter: ['style'] });
      if (contentObserver) contentObserver.disconnect();
      // 网格就在这个容器里。childList 接住填格子，attributeFilter 接住「改内联高度
      // 把行撑高」这种不产生 childList 的路径——两者都在微任务里，落在布局之前。
      contentObserver = new MutationObserverRef(settle);
      contentObserver.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
      if (resizeObserver) resizeObserver.disconnect();
      // 兜底：字体、缩放等不由 DOM 变更引起的尺寸变化
      if (typeof ResizeObserverRef === 'function') {
        resizeObserver = new ResizeObserverRef(settle);
        resizeObserver.observe(container);
        resizeObserver.observe(panel);
      }
    }
    settle();
  }

  return { bind, settle };
}

export function startDrawerOffsetSync(options = {}) {
  const win = options.win || window;
  const doc = options.doc || document;
  if (!win.__urpppDrawerOffsetSync) {
    const instance = createDrawerOffsetSync({
      doc,
      ResizeObserverRef: options.ResizeObserverRef || win.ResizeObserver,
      MutationObserverRef: options.MutationObserverRef || MutationObserver,
    });
    // 文档级观察器：抽屉何时出现、是否被整块替换，都从这里知道。
    // childList 的回调是微任务，落在布局之前，正好用来赶在绘制前校正。
    if (doc.documentElement) {
      new MutationObserver(instance.bind).observe(doc.documentElement, { childList: true, subtree: true });
    }
    win.__urpppDrawerOffsetSync = instance;
  }
  win.__urpppDrawerOffsetSync.bind();
}
