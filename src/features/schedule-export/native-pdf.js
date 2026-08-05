// Native PDF diagnostics and real-page isolation for the SCU URP schedule export.
// 诊断路径可构建视口外克隆；正式导出在真实课表 DOM 上临时暂停 URP++ 样式，
// 并通过统一事务在成功、异常和超时后恢复页面。

const NATIVE_PDF_ID_MAP = {
  'page-content-template': 'urppp-pdf-page',
  mycoursetable: 'urppp-pdf-mycoursetable',
  courseTable: 'urppp-pdf-courseTable',
  courseTableBody: 'urppp-pdf-courseTableBody',
  h4_id1: 'urppp-pdf-h4-1',
  h4_id2: 'urppp-pdf-h4-2',
  infoTable: 'urppp-pdf-info-table',
  'rwskxxbg-course': 'urppp-pdf-rwskxxbg',
  'other-course': 'urppp-pdf-other-course',
  temp_title: 'urppp-pdf-temp-title',
  temp_subtitle: 'urppp-pdf-temp-subtitle',
};

const NATIVE_PDF_SELECTOR_REWRITES = [
  ['#page-content-template', '#urppp-pdf-page'],
  ['#mycoursetable', '#urppp-pdf-mycoursetable'],
  ['#courseTableBody', '#urppp-pdf-courseTableBody'],
  ['#courseTable', '#urppp-pdf-courseTable'],
  ['div.class_div', 'div.urppp-pdf-card'],
  ['div.printDiv', 'div.urppp-pdf-card.printDiv'],
  ['#h4_id1', '#urppp-pdf-h4-1'],
  ['#h4_id2', '#urppp-pdf-h4-2'],
  ['#infoTable', '#urppp-pdf-info-table'],
  ['.breadcrumb', '.urppp-pdf-breadcrumb'],
  ['#rwskxxbg-course', '#urppp-pdf-rwskxxbg'],
  ['#temp_title', '#urppp-pdf-temp-title'],
  ['#temp_subtitle', '#urppp-pdf-temp-subtitle'],
];

export function rewriteNativePdfSelector(selector) {
  if (typeof selector !== 'string') return selector;
  let rewritten = selector;
  for (const [from, to] of NATIVE_PDF_SELECTOR_REWRITES) {
    rewritten = rewritten.split(',').map((part) => {
      const trimmed = part.trim();
      if (trimmed === from) return to;
      if (trimmed.startsWith(from + ' ')) return to + trimmed.slice(from.length);
      return part;
    }).join(',');
  }
  return rewritten;
}

function sanitizeNativePdfClone(root) {
  root.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach((element) => element.remove());
  [root, ...root.querySelectorAll('*')].forEach((element) => {
    Array.from(element.classList || []).forEach((name) => {
      if (/^urppp(?:-|$)/.test(name)) element.classList.remove(name);
    });
    Array.from(element.attributes || []).forEach((attribute) => {
      if (/^data-urppp(?:-|$)/.test(attribute.name)) element.removeAttribute(attribute.name);
    });
    if (!element.style) return;
    Array.from(element.style).forEach((property) => {
      if (element.style.getPropertyPriority(property) === 'important') element.style.removeProperty(property);
    });
  });
  return root;
}

function renameNativePdfClone(root) {
  [root, ...root.querySelectorAll('*')].forEach((element) => {
    if (element.id && NATIVE_PDF_ID_MAP[element.id]) element.id = NATIVE_PDF_ID_MAP[element.id];
    if (element.classList.contains('class_div')) {
      element.classList.remove('class_div');
      element.classList.remove('box_font');
      element.classList.add('urppp-pdf-card');
    }
    if (element.classList.contains('course')) {
      element.classList.remove('course');
      element.classList.add('urppp-pdf-course');
    }
  });
  return root;
}

export function measureNativeScheduleWidth() {
  const styles = [];
  document.querySelectorAll('style[id^="urppp-"]').forEach((style) => {
    if (style.sheet && !style.sheet.disabled) {
      styles.push(style);
      style.sheet.disabled = true;
    }
  });
  let width = 0;
  const host = document.getElementById('mycoursetable');
  if (host) width = host.getBoundingClientRect().width;
  styles.forEach((style) => { style.sheet.disabled = false; });
  return width;
}

const NATIVE_PDF_RESET_STYLE = `
  #urppp-pdf-stage table.table,
  #urppp-pdf-stage table.table-bordered,
  #urppp-pdf-stage table.table-striped,
  #urppp-pdf-stage table.table-hover {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
    color: #000000 !important;
  }
  #urppp-pdf-stage .table > thead > tr > th,
  #urppp-pdf-stage .table-bordered > thead > tr > th,
  #urppp-pdf-stage .table-striped > thead > tr > th,
  #urppp-pdf-stage .table-hover > thead > tr > th {
    background: #dddddd !important;
    background-color: #dddddd !important;
    color: #000000 !important;
    font-weight: normal !important;
    white-space: normal !important;
    border: 1px solid #dddddd !important;
  }
  #urppp-pdf-stage .table > tbody > tr > td,
  #urppp-pdf-stage .table > tbody > tr > th,
  #urppp-pdf-stage .table-bordered > tbody > tr > td,
  #urppp-pdf-stage .table-bordered > tbody > tr > th,
  #urppp-pdf-stage .table-striped > tbody > tr > td,
  #urppp-pdf-stage .table-striped > tbody > tr > th,
  #urppp-pdf-stage .table-hover > tbody > tr > td,
  #urppp-pdf-stage .table-hover > tbody > tr > th {
    background: transparent !important;
    background-color: transparent !important;
    color: #000000 !important;
    border: 1px solid #dddddd !important;
  }
  #urppp-pdf-stage .table-striped > tbody > tr:nth-of-type(odd) > td,
  #urppp-pdf-stage .table-striped > tbody > tr:nth-of-type(odd) > th {
    background: transparent !important;
    background-color: transparent !important;
  }
`;

function normalizeNativePdfStage(root) {
  root.querySelectorAll('td, th').forEach((cell) => {
    cell.style.removeProperty('background');
    cell.style.removeProperty('background-color');
  });
  root.querySelectorAll('th[rowspan]').forEach((cell) => {
    cell.style.removeProperty('width');
    cell.style.setProperty('white-space', 'nowrap');
    cell.style.setProperty('text-align', 'center');
  });
  root.querySelectorAll('table').forEach((table) => {
    table.style.setProperty('background', '#ffffff', 'important');
    table.style.setProperty('background-color', '#ffffff', 'important');
    table.style.setProperty('border', 'none', 'important');
    table.style.setProperty('color', '#000000', 'important');
  });
  root.querySelectorAll('th').forEach((cell) => {
    cell.style.setProperty('color', '#000000', 'important');
    cell.style.setProperty('border', '1px solid #dddddd', 'important');
    cell.style.setProperty('font-weight', 'normal', 'important');
    if (cell.childNodes.length === 1 && cell.firstChild && cell.firstChild.nodeType === 3) {
      const span = document.createElement('span');
      span.textContent = cell.textContent;
      cell.textContent = '';
      cell.appendChild(span);
    }
  });
  root.querySelectorAll('thead th').forEach((cell) => {
    cell.style.setProperty('background', '#dddddd', 'important');
    cell.style.setProperty('background-color', '#dddddd', 'important');
  });
  root.querySelectorAll('tbody th').forEach((cell) => {
    cell.style.setProperty('background', 'transparent', 'important');
    cell.style.setProperty('background-color', 'transparent', 'important');
  });
  root.querySelectorAll('td').forEach((cell) => {
    cell.style.setProperty('background', 'transparent', 'important');
    cell.style.setProperty('background-color', 'transparent', 'important');
    cell.style.setProperty('color', '#000000', 'important');
    cell.style.setProperty('border', '1px solid #dddddd', 'important');
  });
}

export function cloneNativePdfStage(sourceHost) {
  const nativeWidth = measureNativeScheduleWidth();
  const stage = document.createElement('div');
  stage.id = 'urppp-pdf-stage';
  stage.style.cssText = 'position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:' + (nativeWidth || window.innerWidth || 1440) + 'px;';
  const page = document.createElement('div');
  page.id = 'urppp-pdf-page';
  page.style.cssText = 'position:relative;width:100%;box-sizing:border-box;';
  const clone = sourceHost.cloneNode(true);
  sanitizeNativePdfClone(clone);
  renameNativePdfClone(clone);
  page.appendChild(clone);
  stage.appendChild(page);
  normalizeNativePdfStage(clone);
  const resetStyle = document.createElement('style');
  resetStyle.id = 'urppp-pdf-reset-style';
  resetStyle.textContent = NATIVE_PDF_RESET_STYLE;
  document.head.appendChild(resetStyle);
  document.body.appendChild(stage);
  const target = stage.querySelector('#urppp-pdf-mycoursetable');
  const pageRef = stage.querySelector('#urppp-pdf-page') || stage;
  if (!target) {
    stage.remove();
    throw new Error('无法建立原生课表捕获节点');
  }
  return { stage, target, page: pageRef, sourceHost };
}

// 按教务系统原始 divBuild 算法在捕获舞台内重排课程块。
export function runNativeScheduleDivBuild($) {
  $('div.class_div').removeAttr('style');
  $('div.class_div').css('position', 'absolute');
  let tdWidth = $('#mycoursetable td').css('width');
  $('div.class_div').each(function (_, element) {
    const width = parseFloat(tdWidth) || 0;
    $(element).css('width', $(element).siblings().size() > 0 ? width / 2 + 'px' : tdWidth);
  });
  let rowHeight = 0;
  $('#courseTableBody tr').each(function (_, row) {
    if ($(row).height() > rowHeight) rowHeight = $(row).height();
  });
  $('div.class_div').each(function (_, element) {
    const span = Number($(element).attr('classNum')) || 1;
    if ($(element).height() / span > rowHeight) rowHeight = $(element).height() / span;
  });
  $('#courseTableBody tr').height(rowHeight + 'px');
  tdWidth = $('#mycoursetable td').css('width');
  $('div.class_div').each(function (_, element) {
    const card = $(element);
    const cell = card.parent('td');
    const page = $('#page-content-template');
    const width = parseFloat(tdWidth) || 0;
    card.css('height', $('#courseTableBody tr').height() * (Number(card.attr('classNum')) || 1) + 'px');
    card.css('top', cell.offset().top - page.offset().top);
    if (card.siblings().size() > 0) {
      const left = cell.offset().left - page.offset().left + (card.next().size() > 0 ? 0 : width / 2);
      card.css('left', left + 'px');
    } else {
      card.css('left', cell.offset().left - page.offset().left + 'px');
    }
  });
}

let nativePdfIsolationDepth = 0;

export function isNativePdfIsolationActive() {
  return nativePdfIsolationDepth > 0;
}

export function isUrpppOwnedStyle(style) {
  if (!style || style.tagName !== 'STYLE') return false;
  if (/^urppp(?:-|$)/.test(style.id || '')) return true;
  if (style.hasAttribute('data-urppp-style')) return true;
  return (style.textContent || '').includes('urppp-');
}

function defaultPage() {
  try {
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow) return unsafeWindow;
  } catch (_) {}
  return typeof window !== 'undefined' ? window : null;
}

function scheduleFrame(page, callback) {
  const raf = page && typeof page.requestAnimationFrame === 'function'
    ? page.requestAnimationFrame.bind(page)
    : (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null);
  if (raf) return raf(callback);
  return setTimeout(callback, 0);
}

export function isolateScheduleForNativeExport(options = {}) {
  const doc = options.document || (typeof document !== 'undefined' ? document : null);
  const page = options.page || defaultPage();
  if (!doc) throw new Error('原生 PDF 隔离缺少 document');
  const host = doc.getElementById('mycoursetable');
  if (!host) throw new Error('当前页面没有课表节点');

  nativePdfIsolationDepth += 1;
  // 周课表布局链与页面定位锚点：导出期间回到站点原生布局，
  // 避免 URP++ 残留内联导致 divBuild 的 offset 测量与 html2canvas 渲染不一致。
  const layoutScope = [host, ...host.querySelectorAll('*')];
  const extra = [];
  const soliderBox = doc.getElementById('soliderbox');
  if (soliderBox) extra.push(soliderBox);
  let ancestor = host.parentElement;
  while (ancestor && ancestor !== doc.documentElement) {
    const cls = ancestor.classList;
    if (ancestor.id === 'page-content-template'
      || (cls && (cls.contains('page-content') || cls.contains('profile-info-row') || cls.contains('profile-info-value')))) {
      extra.push(ancestor);
    }
    ancestor = ancestor.parentElement;
  }
  const pageAnchor = doc.getElementById('page-content-template') || doc.querySelector('.page-content');
  if (pageAnchor && !extra.includes(pageAnchor)) extra.push(pageAnchor);
  const elements = [...layoutScope, ...extra];
  const inlineStates = elements.map((element) => ({
    element,
    style: element.getAttribute('style'),
  }));
  const styleStates = Array.from(doc.querySelectorAll('style'))
    .filter(isUrpppOwnedStyle)
    .map((style) => ({
      style,
      disabled: style.sheet ? style.sheet.disabled : false,
      media: style.getAttribute('media'),
    }));
  const injected = Array.from(host.querySelectorAll('[id^="urppp-"], [data-urppp]'));
  const patchedDivBuild = page && page.divBuild;
  const nativeDivBuild = page && page.__urpppOriginalDivBuild;
  let restored = false;

  const restore = () => {
    if (restored) return;
    restored = true;
    if (page && page.divBuild === nativeDivBuild && typeof patchedDivBuild === 'function') {
      page.divBuild = patchedDivBuild;
    }
    inlineStates.forEach(({ element, style }) => {
      if (!element.isConnected) return;
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    });
    injected.forEach((element) => element.removeAttribute('data-urppp-pdf-hidden'));
    styleStates.forEach(({ style, disabled, media }) => {
      try {
        if (media === null) style.removeAttribute('media');
        else style.setAttribute('media', media);
        if (style.sheet) style.sheet.disabled = disabled;
      } catch (_) {}
    });
    nativePdfIsolationDepth = Math.max(0, nativePdfIsolationDepth - 1);
    scheduleFrame(page, () => {
      try { if (typeof options.onAfterRestore === 'function') options.onAfterRestore(); } catch (_) {}
    });
  };

  try {
    styleStates.forEach(({ style }) => {
      try {
        style.setAttribute('media', 'not all');
        if (style.sheet) style.sheet.disabled = true;
      } catch (_) {}
    });
    elements.forEach((element) => {
      if (!element.style || !element.style.length) return;
      Array.from(element.style).forEach((property) => {
        if (element.style.getPropertyPriority(property) !== 'important') return;
        if (property === 'height' && element.matches('td, th')) return;
        element.style.removeProperty(property);
      });
    });
    host.querySelectorAll('td').forEach((cell) => {
      cell.style.removeProperty('background');
      cell.style.removeProperty('background-color');
    });
    // 固定定位上下文：卡片包含块必须回到 #page-content-template。
    // 若 td / #mycoursetable 的 position:relative 来自站点 CSS，原生 divBuild 按整页坐标算出的
    // left 会相对它们定位，整列卡片偏移。
    if (pageAnchor) pageAnchor.style.setProperty('position', 'relative', 'important');
    host.style.setProperty('position', 'static', 'important');
    host.querySelectorAll('td').forEach((cell) => {
      cell.style.setProperty('position', 'static', 'important');
    });
    injected.forEach((element) => {
      element.setAttribute('data-urppp-pdf-hidden', '1');
      element.style.setProperty('display', 'none', 'important');
    });
    if (page && typeof nativeDivBuild === 'function') page.divBuild = nativeDivBuild;
    return restore;
  } catch (error) {
    restore();
    throw error;
  }
}

export function exportNativePdfIsolated(button, options = {}) {
  return new Promise((resolve, reject) => {
    const page = options.page || defaultPage();
    const originalBack = page && page.back;
    const originalHtml2Canvas = page && page.html2canvas;
    if (!button || typeof originalBack !== 'function') {
      reject(new Error('教务原生导出依赖未就绪'));
      return;
    }

    let restore = null;
    try { restore = isolateScheduleForNativeExport(options); }
    catch (error) { reject(error); return; }

    let timeout = 0;
    let finished = false;
    let wrappedBack = null;
    let scopedCanvas = null;
    const settle = (error) => {
      if (finished) return;
      finished = true;
      if (timeout) clearTimeout(timeout);
      if (page && wrappedBack && page.back === wrappedBack) page.back = originalBack;
      if (scopedCanvas && page.html2canvas === scopedCanvas) page.html2canvas = originalHtml2Canvas;
      try { if (restore) restore(); } catch (_) {}
      if (error) reject(error);
      else resolve();
    };
    const fail = (error) => settle(error instanceof Error ? error : new Error(String(error)));

    if (typeof originalHtml2Canvas === 'function') {
      scopedCanvas = function () {
        const result = originalHtml2Canvas.apply(this, arguments);
        if (result && typeof result.catch === 'function') result.catch(fail);
        return result;
      };
      page.html2canvas = scopedCanvas;
    }
    wrappedBack = function () {
      try { return originalBack.apply(this, arguments); }
      finally { setTimeout(() => settle(), 0); }
    };
    page.back = wrappedBack;
    timeout = setTimeout(() => {
      try { originalBack.call(page); } catch (_) {}
      fail(new Error('原生 PDF 生成超时'));
    }, options.timeoutMs || 60 * 1000);
    scheduleFrame(page, () => {
      try { button.click(); }
      catch (error) { fail(error); }
    });
  });
}
