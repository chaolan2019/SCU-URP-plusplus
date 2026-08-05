export function isLightInlineColor(value) {
  const color = String(value || '').trim().toLowerCase();
  if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') return false;
  if (/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(color)) return true;

  const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return false;
  const red = Number(match[1]);
  const green = Number(match[2]);
  const blue = Number(match[3]);
  return (red + green + blue) / 3 >= 200;
}

export function scrubLightInlineBackground(element) {
  if (!element?.style) return;
  const inlineStyle = element.getAttribute('style') || '';
  if (!inlineStyle || !/background/i.test(inlineStyle)) return;

  const background = element.style.backgroundColor || element.style.background || '';
  if (isLightInlineColor(background) || /background(-color|-image)?\s*:/i.test(inlineStyle)) {
    element.style.removeProperty('background');
    element.style.removeProperty('background-color');
    element.style.removeProperty('background-image');
  }

  ['borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach((property) => {
    const value = element.style[property];
    if (!value || !isLightInlineColor(value)) return;
    element.style.removeProperty(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`));
  });

  if (/border(-color)?\s*:/i.test(inlineStyle) && /#e6e6e6|#eee|#ddd|#ccc/i.test(inlineStyle)) {
    element.style.removeProperty('border-color');
    element.style.removeProperty('border-top-color');
    element.style.removeProperty('border-right-color');
    element.style.removeProperty('border-bottom-color');
    element.style.removeProperty('border-left-color');
  }
}

export function createTableInlineStyleScrubber({
  isNativePdfIsolationActive,
  documentRef = document,
  windowRef = window,
  MutationObserverRef = MutationObserver,
}) {
  function scrubTableHeaderInlineBg() {
    if (isNativePdfIsolationActive()) return;
    try {
      const htmlDark = documentRef.documentElement.classList.contains('urppp-theme-dark');
      const bodyDark = documentRef.body?.classList.contains('urppp-dark');
      if (!htmlDark && !bodyDark) return;

      documentRef.querySelectorAll(
        'table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th',
      ).forEach(scrubLightInlineBackground);
    } catch (_) { /* page DOM may be replaced during PJAX */ }
  }

  function scheduleScrubTableInlineBg() {
    [0, 200, 800, 1600].forEach((delay) => setTimeout(() => {
      try { scrubTableHeaderInlineBg(); } catch (_) { /* ignore */ }
    }, delay));

    try {
      const host = documentRef.querySelector('.page-content, #page-content-template, .main-content') || documentRef.body;
      if (!host) return;
      const current = windowRef.__urpppTableScrubObs;
      if (current && current.root === host && host.isConnected) return;
      if (current?.observer) current.observer.disconnect();

      const observer = new MutationObserverRef(() => {
        clearTimeout(windowRef.__urpppTableScrubTimer);
        windowRef.__urpppTableScrubTimer = setTimeout(() => {
          try { scrubTableHeaderInlineBg(); } catch (_) { /* ignore */ }
        }, 120);
      });
      observer.observe(host, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      windowRef.__urpppTableScrubObs = { root: host, observer };
    } catch (_) { /* page DOM may be replaced during PJAX */ }
  }

  return { scheduleScrubTableInlineBg, scrubTableHeaderInlineBg };
}
