export function isNoticeBulletText(value) {
  const text = String(value || '').replace(/\s+/g, '');
  return /^[•·●○▪◆★\-–]$/.test(text) || /^\d{1,4}$/.test(text);
}

export function isNoticeDateText(value) {
  return /\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(value || ''));
}

export function isNoticePageContext({ pathname = '', href = '', title = '', headingText = '' } = {}) {
  if (/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${pathname} ${href}`)) return true;
  return /评估公告|通知公告|选课公告|公告|通知/.test(`${title} ${headingText}`);
}

export function isNoticeListTable(table, { noticePage = false } = {}) {
  if (!table) return false;

  const thead = table.querySelector('thead');
  const headText = (thead?.textContent || '').replace(/\s+/g, '');
  if (/标题/.test(headText) && /发布时间|发布日期|日期|时间/.test(headText)) return true;
  if (noticePage && /标题|公告|通知/.test(headText) && !/教室|教学楼|课程号|成绩|学号|座位数/.test(headText)) {
    return true;
  }

  const rows = table.querySelectorAll('tbody tr, tr');
  let hit = 0;
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 2 || cells.length > 4) return;
    if (isNoticeBulletText(cells[0].textContent) && row.querySelector('a') && isNoticeDateText(row.textContent)) {
      hit += 1;
    }
  });
  if (hit < 1) return false;
  if (noticePage || hit === rows.length) return true;

  const style = table.getAttribute('style') || '';
  return /dashed/i.test(style) || table.classList.contains('no-border-top') || Boolean(table.getAttribute('width'));
}

export function isBusinessDataTable(table, { noticePage = false } = {}) {
  if (!table) return true;
  if (table.classList?.contains('urppp-notice-table')) return false;
  if (isNoticeListTable(table, { noticePage })) return false;

  const identity = `${table.id || ''} ${table.getAttribute('class') || ''}`;
  if (/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(identity)) return true;
  if (table.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]')) {
    return true;
  }

  const sample = table.querySelector('tbody tr, tr');
  if (sample && sample.querySelectorAll('td,th').length >= 5) return true;

  const thead = table.querySelector('thead');
  const headText = (thead?.textContent || '').replace(/\s+/g, '');
  if (headText) {
    if (/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(headText)) return true;
    if (/序号/.test(headText) && !/标题|公告|通知|发布时间/.test(headText)) return true;
  }

  if (table.querySelector('a') && /课表|教室信息|查看/.test(table.textContent || '')) {
    if (!noticePage && /座位数|教学楼|教室号|校区名/.test(table.textContent || '')) return true;
  }
  return false;
}
