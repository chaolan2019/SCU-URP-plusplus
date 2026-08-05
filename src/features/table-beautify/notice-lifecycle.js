export function createNoticeTableLifecycle({
  beautifyNoticeTables,
  pinNoticeRowSurface,
  documentRef = document,
  windowRef = window,
  MutationObserverRef = MutationObserver,
  requestAnimationFrameRef = requestAnimationFrame,
  setTimeoutRef = setTimeout,
  clearTimeoutRef = clearTimeout,
}) {
  function bindNoticeHoverScrub() {
    if (windowRef.__urpppNoticeHoverScrub) return;
    windowRef.__urpppNoticeHoverScrub = true;
    documentRef.addEventListener('mouseout', (event) => {
      const row = event.target?.closest
        ? event.target.closest('table.urppp-notice-table tr.urppp-notice-row')
        : null;
      if (!row) return;
      requestAnimationFrameRef(() => pinNoticeRowSurface(row));
    }, true);
  }

  function scheduleBeautifyNoticeTables() {
    [0, 400, 1500].forEach((delay) => setTimeoutRef(() => {
      try { beautifyNoticeTables(); } catch (_) { /* ignore */ }
    }, delay));

    try {
      const host = documentRef.getElementById('page-content-template')
        || documentRef.querySelector('.page-content, .main-content')
        || documentRef.body;
      if (!host) return;
      const current = windowRef.__urpppNoticeObs;
      if (current && current.root === host && host.isConnected) return;
      if (current?.observer) current.observer.disconnect();

      const observer = new MutationObserverRef(() => {
        clearTimeoutRef(windowRef.__urpppNoticeTimer);
        windowRef.__urpppNoticeTimer = setTimeoutRef(() => {
          try { beautifyNoticeTables(); } catch (_) { /* ignore */ }
        }, 180);
      });
      observer.observe(host, { childList: true, subtree: true });
      windowRef.__urpppNoticeObs = { root: host, observer };
    } catch (_) { /* page DOM may be replaced during PJAX */ }
  }

  return { bindNoticeHoverScrub, scheduleBeautifyNoticeTables };
}
