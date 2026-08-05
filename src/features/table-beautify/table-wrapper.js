export function createTableWrapper({
  isNativePdfIsolationActive,
  isBusinessDataTable,
  documentRef = document,
  windowRef = window,
  MutationObserverRef = MutationObserver,
  getComputedStyleRef = getComputedStyle,
}) {
  function wrapTables() {
    if (isNativePdfIsolationActive()) return;
    documentRef.querySelectorAll('table.table, table.table-bordered, table.dataTable').forEach((table) => {
      if (!table || table.closest('.urppp-table-wrap')) return;
      if (table.id === 'courseTable') return;
      if (table.closest('.modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal')) return;
      if (table.classList.contains('urppp-wrs-table')) return;
      if (table.classList.contains('urppp-notice-table')) return;
      if (isBusinessDataTable(table)) { /* business tables use the same wrapper */ }

      const parent = table.parentElement;
      if (!parent) return;
      const parentOverflow = parent.style?.overflow || getComputedStyleRef(parent).overflow;
      const isScrollBox = parent.id?.endsWith('_scroll') || parentOverflow === 'auto' || parentOverflow === 'scroll';
      if (isScrollBox) {
        parent.classList.add('urppp-scroll-table-host');
        return;
      }

      const wrapper = documentRef.createElement('div');
      wrapper.className = 'urppp-table-wrap';
      parent.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function bindTableWrapObserver() {
    const host = documentRef.getElementById('page-content-template')
      || documentRef.querySelector('.page-content')
      || documentRef.body;
    if (!host) return;

    const currentRoot = windowRef.__urpppTableObsRoot;
    if (windowRef.__urpppTableObs && currentRoot === host && host.isConnected) return;
    if (windowRef.__urpppTableObs) windowRef.__urpppTableObs.disconnect();

    let wrapTimer = 0;
    const observer = new MutationObserverRef(() => {
      clearTimeout(wrapTimer);
      wrapTimer = setTimeout(wrapTables, 80);
    });
    observer.observe(host, { childList: true, subtree: true });
    windowRef.__urpppTableObs = observer;
    windowRef.__urpppTableObsRoot = host;
  }

  return { bindTableWrapObserver, wrapTables };
}
