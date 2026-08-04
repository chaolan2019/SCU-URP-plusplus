// Schedule export menu and format orchestration.

export function scheduleExportCompletionNotes(type, data, stats = {}) {
  const notes = [];
  const jsonStats = stats.json || null;
  const icsStats = stats.ics || null;
  const unscheduledCount = type === 'ics'
    ? data.courses.filter((course) => !course.arrangements.length).length
    : 0;
  if (unscheduledCount) notes.push(unscheduledCount + ' 门未排定时间的课程未写入日历');
  if (jsonStats && jsonStats.unscheduledCourses) notes.push(jsonStats.unscheduledCourses + ' 门未排定时间的课程未写入 JSON');
  if (jsonStats && jsonStats.missingWeeks) notes.push(jsonStats.missingWeeks + ' 个上课安排缺少周次');
  if (jsonStats && jsonStats.invalidArrangements) notes.push(jsonStats.invalidArrangements + ' 个上课安排缺少日期或节次');
  if (icsStats && icsStats.missingWeeks) notes.push(icsStats.missingWeeks + ' 个上课安排缺少周次');
  if (icsStats && icsStats.missingTimes) notes.push(icsStats.missingTimes + ' 个上课安排缺少节次时间');
  return notes;
}

function exportOptionHtml(type, icon, title, description, disabled) {
  return `<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${type}"${disabled ? ' disabled' : ''}><i class="fa ${icon}" aria-hidden="true"></i><span><strong>${title}</strong><small>${description}</small></span></button>`;
}

export function createScheduleExportUi(dependencies) {
  const {
    document,
    window,
    ensureStyles,
    loadData,
    exportJson,
    exportIcs,
    exportPng,
    showToast,
    nativePageUrl,
    navigate,
    logger = console,
  } = dependencies;

  function closeMenu(menu) {
    if (!menu) return;
    menu.classList.remove('open');
    menu.querySelector('.urppp-export-trigger')?.setAttribute('aria-expanded', 'false');
  }

  function bindDismiss() {
    if (window.__urpppExportDismissBound) return;
    window.__urpppExportDismissBound = true;
    document.addEventListener('click', (event) => {
      document.querySelectorAll('.urppp-export-wrap.open').forEach((menu) => {
        if (!menu.contains(event.target)) closeMenu(menu);
      });
    }, true);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') document.querySelectorAll('.urppp-export-wrap.open').forEach(closeMenu);
    });
  }

  async function run(type, source, pdfHandler, trigger) {
    if (trigger && trigger.disabled) return;
    const original = trigger && trigger.innerHTML;
    try {
      if (trigger) {
        trigger.disabled = true;
        trigger.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 准备中';
      }
      if (type === 'pdf') {
        if (typeof pdfHandler !== 'function') throw new Error('当前页面不提供原生 PDF 导出');
        await pdfHandler();
        return;
      }
      const data = await loadData(source);
      const stats = {};
      if (type === 'json') stats.json = await exportJson(data);
      else if (type === 'ics') stats.ics = await exportIcs(data);
      else if (type === 'png') await exportPng(data);
      else throw new Error('未知导出格式');
      const notes = scheduleExportCompletionNotes(type, data, stats);
      showToast('课表已导出：' + type.toUpperCase() + (notes.length ? '；' + notes.join('，') : ''));
    } catch (error) {
      if (error && error.message === '已取消导出') return;
      logger.warn('[URP++] schedule export', error);
      showToast(error && error.message || String(error), true);
    } finally {
      if (trigger) {
        trigger.disabled = false;
        trigger.innerHTML = original;
      }
    }
  }

  function createMenu(options = {}) {
    ensureStyles();
    const source = options.source || 'native';
    const pdfHandler = options.pdfHandler;
    const pdfAvailable = typeof pdfHandler === 'function';
    const wrap = document.createElement('span');
    const triggerLabel = source === 'native' ? '导出课表' : '导出';
    wrap.className = 'urppp-export-wrap';
    wrap.innerHTML = `<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${triggerLabel}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${exportOptionHtml('ics', 'fa-calendar', 'ICS 日历', '导入系统日历或日历应用', false)}${exportOptionHtml('json', 'fa-code', 'JSON 数据', '兼容小爱课程导入，可自定义格式', false)}${exportOptionHtml('png', 'fa-image', 'PNG 图片', '完整学期课表高清图片', false)}${exportOptionHtml('pdf', 'fa-file-pdf-o', 'PDF', pdfAvailable ? '使用教务系统原生导出' : '仅原教务课表页面可用', !pdfAvailable)}${pdfAvailable ? '' : '<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;
    const trigger = wrap.querySelector('.urppp-export-trigger');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = !wrap.classList.contains('open');
      document.querySelectorAll('.urppp-export-wrap.open').forEach(closeMenu);
      wrap.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    wrap.querySelectorAll('[data-export-type]:not(:disabled)').forEach((button) => {
      button.addEventListener('click', () => {
        closeMenu(wrap);
        run(button.getAttribute('data-export-type'), source, pdfHandler, trigger);
      });
    });
    const nativeLink = wrap.querySelector('[data-export-native]');
    if (nativeLink) nativeLink.addEventListener('click', () => navigate(nativePageUrl));
    bindDismiss();
    return wrap;
  }

  function bindHosts(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;
    root.querySelectorAll('[data-schedule-export-host]').forEach((host) => {
      if (host.querySelector('.urppp-export-wrap')) return;
      host.appendChild(createMenu({ source: host.getAttribute('data-schedule-export-host') || 'clean' }));
    });
  }

  return { bindHosts, closeMenu, createMenu, run };
}
