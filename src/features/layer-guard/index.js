/**
 * @file layui iframe 型弹窗的首帧守卫。
 *
 * 内层文档由独立脚本接管，而该脚本的注入晚于该文档的首次绘制，于是会先画出一张
 * 未美化的原生界面再被接管。此前靠「等内层报到」来回避，代价是一段肉眼可感的等待。
 *
 * 改为主动出击：弹窗的 iframe 一出现就先遮蔽（样式表按属性选择器匹配，第一帧即生效），
 * 同时尽早把宿主当前主题的底色写进内层文档。底色一落，就说明内层不会再有原生白底可看，
 * 立即放行。内层脚本注入后自然接管后续的完整美化。
 *
 * 因此等待只剩「iframe 文档创建 + 一次轮询」，而不是等脚本就绪。
 */

const DEFAULT_TARGET = 'menu-recommend';
const REVEAL_CLASS = 'urppp-layer-revealed';
const PREFLIGHT_ID = 'urppp-layer-preflight';
const POLL_INTERVAL = 10;
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

  // 把主题底色写进内层文档，填上内层脚本注入之前的空窗
  const injectPreflight = (iframe) => {
    let inner = null;
    try {
      inner = iframe.contentDocument;
    } catch (_) {
      return false;
    }
    if (!inner || !inner.documentElement) return false;

    // 文档必须已经是目标页面：src 刚设置时 contentDocument 仍指向旧的 about:blank，
    // 注入到那里会随新文档加载而丢失，放行也就白放了
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

  const reveal = (iframe) => {
    try { iframe.classList.add(REVEAL_CLASS); } catch (_) {}
  };

  const tracked = new WeakSet();

  const track = (iframe) => {
    if (!iframe || tracked.has(iframe)) return;
    tracked.add(iframe);

    let done = false;
    let timer = null;
    const finish = () => {
      if (done) return;
      done = true;
      if (timer) { clearInterval(timer); timer = null; }
      reveal(iframe);
    };

    // 底色一落即可放行；内层已是主题色，没有原生白底可看
    if (injectPreflight(iframe)) {
      finish();
      return;
    }
    timer = setInterval(() => {
      if (injectPreflight(iframe)) finish();
    }, POLL_INTERVAL);
    // 内层始终拿不到（跨域等）时兜底放行，避免把弹窗永久藏住
    win.setTimeout(finish, FALLBACK_TIMEOUT);
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
