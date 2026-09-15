/**
 * @file 选课页的时间筛选器：这块网格由 coursetable 自己渲染，
 * 靠单元格的内联底色标出「已占用 / 空闲」。
 *
 * 美化、内联样式清洗、卡片不透明度改写都必须绕开它，否则标记会被抹掉，
 * 整片只剩一种颜色、看上去像没有数据。三处判断共用一个入口，
 * 免得各写各的锚点，站点换一次结构就要改三遍。
 */

const REGION_SELECTOR = '#div_kb, #myselectTable';
// 周课表的 #courseTable 在 #mycoursetable 里；不在里面的那块才是时间筛选器
const SCHEDULE_HOST = '#mycoursetable';

export function isCourseTimeGrid(element) {
  if (!element || !element.closest) return false;
  if (element.closest(REGION_SELECTOR)) return true;
  // 站点换了容器 id 时兜底：按网格表本身认
  const table = element.closest('table#courseTable');
  return !!table && !table.closest(SCHEDULE_HOST);
}

export function findCourseTimeGrid(doc = document) {
  if (!doc || !doc.querySelector) return null;
  return doc.querySelector(REGION_SELECTOR) || doc.querySelector(`table#courseTable:not(${SCHEDULE_HOST} *)`);
}
