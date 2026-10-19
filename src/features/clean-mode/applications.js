/**
 * @file 可申请业务：从站点接口取「申请中」的业务。
 *
 * 数据源：POST /student/application/index/showApplication
 *   → { status, data: { todate, list: [...], zzykgcount, xjydcount, jxjcount, ... } }
 *
 * 注意：这个 list 是**全部业务**（含已关闭、含 url 为 null 的），页面上的
 * 「申请中 / 已关闭」是站点 JS 自己分的。这里照抄站点那套判断，不另发明：
 *
 *   普通项：qyf=='1' 且 kssj <= todate <= jssj 且 kg=='1'
 *           10006 / 10007 / 10012 不算业务入口（站点直接跳过）
 *   10008：单独一条「辅修方案注册/注销」，判断同上
 *   特殊项：转专业 / 异动 / 大类分流 / 专业分方向 / 奖学金 / 创新创业
 *           由响应里的计数字段决定，出现即表示申请中
 *
 * 为什么不再从 HTML 里抠：那页 #apply_body 是空的，内容全靠这个接口渲染。
 */

/** 站点对这几个 id 不走普通业务入口 */
const SKIP_IDS = new Set(['10006', '10007', '10012']);
const SUBSIDIARY_ID = '10008';

/**
 * @param {string|object} raw 接口响应（文本或已解析对象）
 * @returns {Array<{title: string, href: string}>} 申请中的业务
 */
export function parseApplicationJson(raw) {
  let payload = raw;
  if (typeof raw === 'string') {
    try { payload = JSON.parse(raw); } catch (_) { return []; }
  }
  const data = payload && payload.data;
  if (!data || !Array.isArray(data.list)) return [];

  const todate = String(data.todate || '');
  // 拿不到基准时间就无法判断开放窗口：宁可这一轮不出清单，也不把已关闭的混进来
  if (!todate) return [];

  const list = [];
  const seen = new Set();
  const push = (title, href) => {
    const name = String(title || '').trim();
    const url = String(href || '').trim();
    if (!name || !url || /^javascript:/i.test(url) || seen.has(name)) return;
    seen.add(name);
    list.push({ title: name.slice(0, 24), href: url });
  };

  // 站点按学院/校区开关的特殊入口（SCU 的 schoolId 是 100006），计数大于 0 即申请中
  if (Number(data.zzykgcount) === 1) push('转专业申请', '/student/ordertransfer/specialty/application/index');
  if (Number(data.xjydcount) > 0) push('异动申请', '/student/personalManagement/studentChange/index');
  if (Number(data.dlflkgcount) === 1 && Number(data.dlflcount) > 0) push('大类分流', '/student/personalManagement/largeClassDiversion/index');
  if (Number(data.zyffxkgcount) === 1 && Number(data.dlflcount) > 0) push('专业分方向', '/student/personalManagement/majorsSplitOther/index');
  if (Number(data.jxjcount) > 0) push('奖学金申请', '/student/personalManagement/individualApplication/scholarshipApplication/index');

  data.list.forEach((item) => {
    if (!item || String(item.qyf) !== '1') return;
    const id = String(item.id || '');
    const isSubsidiary = id === SUBSIDIARY_ID;
    if (!isSubsidiary && SKIP_IDS.has(id)) return;
    const title = isSubsidiary ? '辅修方案注册/注销' : String(item.ywsm || '');
    const active = String(item.kssj || '') <= todate
      && String(item.jssj || '') >= todate
      && String(item.kg) === '1';
    if (active) push(title, item.url);
  });

  // 站点把「创新/创业」放在列表之后追加，顺序也照样对齐
  if (Number(data.xsdkffcount) > 0) push('创新/创业', '/students/studentsInnovation/apply/countindex');

  return list;
}
