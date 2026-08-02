// Native PDF capture stage for the SCU URP schedule export.
// 在顶层文档内构建视口外的原生课表克隆（stage），导出生命周期通过选择器重写
// 全部限定在 stage 内执行，html2canvas 直接捕获顶层 stage 节点。
// 这样教务 CSS、jQuery、全局变量与布局时序都与用户看到的页面完全一致。

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

function pinNativePdfHeaderBackgrounds(root) {
  root.querySelectorAll('th').forEach((cell) => {
    ['background-color', 'background'].forEach((property) => {
      const value = cell.style.getPropertyValue(property);
      if (value && cell.style.getPropertyPriority(property) !== 'important') {
        cell.style.setProperty(property, value, 'important');
      }
    });
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
  pinNativePdfHeaderBackgrounds(clone);
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
    card.css('top', cell.offset().top - page.offset().top - 12);
    if (card.siblings().size() > 0) {
      const left = cell.offset().left - page.offset().left + (card.next().size() > 0 ? 0 : width / 2);
      card.css('left', left + 'px');
    } else {
      card.css('left', cell.offset().left - page.offset().left + 'px');
    }
  });
}
