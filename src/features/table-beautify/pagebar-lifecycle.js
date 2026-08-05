export function createPagebarLifecycle({
  beautifyPagebar,
  documentRef = document,
  windowRef = window,
  MutationObserverRef = MutationObserver,
  setTimeoutRef = setTimeout,
  clearTimeoutRef = clearTimeout,
}) {
  function run() {
    beautifyPagebar();
    documentRef.querySelectorAll('#urppagebar').forEach((host) => {
      if (host.__urpppPagebarObs) return;
      host.__urpppPagebarObs = true;
      const observer = new MutationObserverRef(() => {
        clearTimeoutRef(windowRef.__urpppPagebarTimer);
        windowRef.__urpppPagebarTimer = setTimeoutRef(
          () => beautifyPagebar(host.parentElement || documentRef),
          150,
        );
      });
      observer.observe(host, { childList: true, subtree: true });
    });
  }

  function scheduleBeautifyPagebar() {
    if (windowRef.__urpppPagebarBound) {
      setTimeoutRef(run, 0);
      return;
    }
    windowRef.__urpppPagebarBound = true;
    [0, 300, 1000, 2500].forEach((delay) => setTimeoutRef(run, delay));
  }

  return { scheduleBeautifyPagebar };
}
