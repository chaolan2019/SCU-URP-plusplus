export function createNoticeTableSurface({
  getCurrentTheme,
  documentRef = document,
  getComputedStyleRef = getComputedStyle,
}) {
  function noticeSurfaceColor() {
    try {
      const value = getComputedStyleRef(documentRef.documentElement).getPropertyValue('--surface').trim();
      return value || (getCurrentTheme() === 'dark' ? '#151A24' : '#FFFFFF');
    } catch (_) {
      return getCurrentTheme() === 'dark' ? '#151A24' : '#FFFFFF';
    }
  }

  function pinNoticeRowSurface(row) {
    if (!row?.classList?.contains('urppp-notice-row')) return;
    const surface = noticeSurfaceColor();
    row.classList.remove('hover');
    row.style.setProperty('background', surface, 'important');
    row.style.setProperty('background-color', surface, 'important');
    row.querySelectorAll('td, th').forEach((cell) => {
      cell.classList.remove('hover');
      cell.style.setProperty('background', 'transparent', 'important');
      cell.style.setProperty('background-color', 'transparent', 'important');
    });
  }

  function scrubNoticeInlineBg(root) {
    try {
      const scope = root || documentRef;
      if (scope.matches?.('tr.urppp-notice-row')) {
        pinNoticeRowSurface(scope);
        return;
      }
      scope.querySelectorAll('table.urppp-notice-table tr.urppp-notice-row').forEach(pinNoticeRowSurface);
    } catch (_) { /* page DOM may be replaced during PJAX */ }
  }

  function disarmNoticeTableHover(table) {
    if (!table) return;
    table.classList.remove('table-hover', 'table-striped');
    table.classList.add('urppp-notice-nohover');
    table.querySelectorAll('tr.urppp-notice-row').forEach((row) => {
      row.classList.remove('hover');
      pinNoticeRowSurface(row);
    });
  }

  function stripMistakenNoticeTable(table) {
    if (!table) return;
    table.classList.remove('urppp-notice-table');
    delete table.dataset.urpppNoticeScan;
    table.style.removeProperty('border');
    table.style.removeProperty('border-left');
    table.style.removeProperty('background');

    const wrapper = table.closest('.urppp-table-wrap.urppp-notice-wrap');
    if (wrapper) {
      wrapper.classList.remove('urppp-notice-wrap');
      wrapper.style.removeProperty('border');
      wrapper.style.removeProperty('background');
      wrapper.style.removeProperty('box-shadow');
      wrapper.style.removeProperty('overflow');
      wrapper.style.removeProperty('border-radius');
    }

    table.querySelectorAll(
      'tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card',
    ).forEach((element) => {
      element.classList.remove(
        'urppp-notice-row',
        'urppp-notice-title-cell',
        'urppp-notice-date-cell',
        'urppp-notice-bullet-cell',
        'urppp-notice-link',
        'urppp-notice-time',
        'urppp-notice-card',
        'urppp-notice-card-row',
        'urppp-notice-main',
        'urppp-notice-meta',
        'urppp-notice-title',
        'urppp-notice-body',
      );
      if (element.tagName === 'TR' || element.tagName === 'TD') {
        ['display', 'border', 'background', 'padding', 'margin', 'width', 'box-shadow', 'border-radius', 'float', 'position']
          .forEach((property) => {
            if (element.style.getPropertyPriority(property) === 'important') {
              element.style.removeProperty(property);
            }
          });
      }
      delete element.dataset.urpppNoticeDone;
    });
  }

  return {
    disarmNoticeTableHover,
    pinNoticeRowSurface,
    scrubNoticeInlineBg,
    stripMistakenNoticeTable,
  };
}
