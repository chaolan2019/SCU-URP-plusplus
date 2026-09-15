/**
 * @file layui iframe 型弹窗的首帧守卫。
 *
 * 内层文档由独立脚本接管，而该脚本的注入晚于该文档的首次绘制。此前试过两条路：
 * 等内层脚本报到（稳定，但等待可感），或提前放行（快，但把内层从初始态走到最终态
 * 的过程露给了用户——字号跳变、内容闪空）。两者都只解决一半。
 *
 * 现在合成一条：等待照旧以内层脚本报到的「内容已是最终形态」为准，但等待期间不再是
 * 空白——主文档先把宿主当前主题的底色写进内层文档，用户看到的是主题色，不是原生白底。
 *
 * 也就是说：慢的部分交给信号，难看的中间态交给打底。
 */

const DEFAULT_TARGET = 'menu-recommend';
const REVEAL_CLASS = 'urppp-layer-revealed';
const PREFLIGHT_ID = 'urppp-layer-preflight';
const STYLED_MESSAGE = 'urppp-layer-styled';
const POLL_INTERVAL = 50;
const FALLBACK_TIMEOUT = 1500;

export function startLayerGuard(options = {}) {
  const target = options.target || DEFAULT_TARGET;
  const doc = options.doc || document;
  const win = doc.defaultView || (typeof window !== 'undefined' ? window : null);
  if (!win || !doc.documentElement) return;

  // 只在宿主文档安装：内层文档不需要这套逻辑
  try {
    if (win !== win.top) return;
  } catch (_) { return; }
  if (win.__urpppLayerGuardReady) return;
  win.__urpppLayerGuardReady = true;

  const selector = `.layui-layer-iframe iframe[src*="${target}"]`;
  const root = doc.documentElement;

  // 取宿主当前主题的字面色值：内层此刻还没有变量，只能用算好的值
  const themeColors = () => {
    let bg = '';
    let text = '';
    try {
      const cs = win.getComputedStyle(root);
      bg = String(cs.getPropertyValue('--bg') || '').trim();
      text = String(cs.getPropertyValue('--text') || '').trim();
    } catch (_) {}
    return { bg: bg || '#F5F5F7', text: text || '#1D1D1F' };
  };

  // 把主题底色写进内层文档，填上内层脚本就绪之前的空窗
  const injectPreflight = (iframe) => {
    let inner = null;
    try {
      inner = iframe.contentDocument;
    } catch (_) {
      return false;
    }
    if (!inner || !inner.documentElement) return false;

    // 文档必须已经是目标页面：src 刚设置时 contentDocument 仍指向旧的 about:blank，
    // 注入到那里会随新文档加载而丢失
    let href = '';
    try {
      href = String(inner.location.href || '');
    } catch (_) {
      return false;
    }
    if (!href.includes(target)) return false;

    const host = inner.head || inner.documentElement;
    if (!host) return false;

    let style = null;
    try { style = inner.getElementById(PREFLIGHT_ID); } catch (_) {}
    if (!style) {
      try {
        style = inner.createElement('style');
        style.id = PREFLIGHT_ID;
        host.appendChild(style);
      } catch (_) {
        return false;
      }
    }
    const { bg, text } = themeColors();
    const css = `html,body{background:${bg} !important;color:${text} !important;}`;
    try {
      if (style.textContent !== css) style.textContent = css;
    } catch (_) {
      return false;
    }
    return true;
  };

  const marked = new WeakSet();
  const reveal = (iframe) => {
    if (marked.has(iframe)) return;
    marked.add(iframe);
    try { iframe.classList.add(REVEAL_CLASS); } catch (_) {}
  };

  // 内层脚本就绪后主动报到。这是「内容已是最终形态」的可靠信号，
  // 早一步放行就会看到内层的字号跳变与内容闪烁。
  win.addEventListener('message', (event) => {
    if (!event.data || event.data.urppp !== STYLED_MESSAGE) return;
    try {
      doc.querySelectorAll(selector).forEach((iframe) => {
        if (iframe.contentWindow === event.source) reveal(iframe);
      });
    } catch (_) {}
  });

  const tracked = new WeakSet();

  const track = (iframe) => {
    if (!iframe || tracked.has(iframe)) return;
    tracked.add(iframe);

    injectPreflight(iframe);
    // 持续打底而不是只做一次：内层文档可能被替换（重定向、刷新）。
    // 这里不重新遮蔽——已经显示之后再藏一次会突然白一下。
    const timer = win.setInterval(() => injectPreflight(iframe), POLL_INTERVAL);
    // 内层脚本迟迟不报到（未生效、跨域等）时兜底放行，避免把弹窗永久藏住
    win.setTimeout(() => {
      clearInterval(timer);
      reveal(iframe);
    }, FALLBACK_TIMEOUT);
  };

  const scan = () => {
    try { doc.querySelectorAll(selector).forEach(track); } catch (_) {}
  };

  scan();
  try {
    new MutationObserver(scan).observe(root, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['src'],
    });
  } catch (_) {}
  // 类名后补等场景观察器盖不到，低频轮询兜底
  try { win.setInterval(scan, 500); } catch (_) {}
}
