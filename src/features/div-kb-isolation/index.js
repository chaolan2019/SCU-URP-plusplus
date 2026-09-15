/**
 * @file #div_kb 整块隔离：选课页的时间筛选器。
 *
 * 这块网格由站点自己的 coursetable 渲染，靠**内联背景色**标出「已占用 / 空闲」。
 * 美化层为暗色适配给所有表格单元格写了 `background: var(--surface) !important`，
 * 这类声明会把占用标记一并抹平——网格看上去永远是空的，与有没有数据无关。
 *
 * 让样式表「不匹配」需要给整个美化层逐个选择器加排除，代价是几十处补丁；
 * 而内联 `!important` 是唯一能压过样式表 `!important` 的通道（已实测）。
 * 所以这里只做一件事：把该区域自己写下的内联底色提权，最终解释权还给站点。
 * 该区域的 DOM 同样不再被插件改写（见 isBusinessDataTable / inline-style-scrub）。
 */

const REGION_ID = 'div_kb';
// 站点可能把标记写在行上而不是格子上，一并接管
const MARKED_SELECTOR = 'table, thead, tbody, tr, th, td';
// 网格由站点脚本后置渲染，给它几次机会
const RETRY_INTERVAL = 300;
const RETRY_LIMIT = 10;

function createDivKbIsolation({ doc, MutationObserverRef }) {
  // 记下「上一次被我们提权过的值」，用来辨认哪些写入是自己的，避免自激
  const locked = new WeakMap();
  let observed = null;
  let observer = null;
  let pending = 0;
  let attempts = 0;

  function lockElement(element) {
    if (!element.style) return;
    const background = element.style.getPropertyValue('background-color');
    if (background === (locked.get(element) || '')) return;
    if (!background) {
      // 站点自己清掉的，跟着放开
      element.style.removeProperty('background-color');
      locked.delete(element);
      return;
    }
    element.style.setProperty('background-color', background, 'important');
    locked.set(element, background);
  }

  function flush() {
    pending = 0;
    const region = doc.getElementById(REGION_ID);
    if (!region) return;
    try {
      region.querySelectorAll(MARKED_SELECTOR).forEach(lockElement);
    } catch (_) { /* 路由切换时区域可能正在被替换 */ }
  }

  function scheduleLock() {
    if (pending) return;
    pending = setTimeout(flush, 0);
  }

  function start() {
    const region = doc.getElementById(REGION_ID);
    if (!region) {
      if (attempts < RETRY_LIMIT) {
        attempts += 1;
        setTimeout(start, RETRY_INTERVAL);
      }
      return;
    }
    attempts = 0;
    if (observed !== region || !observed.isConnected) {
      if (observer) observer.disconnect();
      observer = new MutationObserverRef(scheduleLock);
      observer.observe(region, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });
      observed = region;
    }
    flush();
  }

  return { start };
}

export function startDivKbIsolation(options = {}) {
  const win = options.win || window;
  if (!win.__urpppDivKbIsolation) {
    win.__urpppDivKbIsolation = createDivKbIsolation({
      doc: options.doc || document,
      MutationObserverRef: options.MutationObserverRef || MutationObserver,
    });
  }
  // 可重复调用：路由替换掉区域后重新绑定
  win.__urpppDivKbIsolation.start();
}
