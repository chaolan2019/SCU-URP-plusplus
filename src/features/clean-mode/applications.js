/**
 * @file 可申请业务列表解析。
 *
 * 站点的「可申请业务」页把两类业务直接写在 HTML 里：
 *   - #apply_body  → 申请中（服务板块只认这一栏）
 *   - #close_body  → 已关闭（不得进服务板块）
 *
 * 为什么不写死入口：业务随学期开放变化。2026-2027 秋实测线上是 7 项，
 * 其中「免修申请」已落到「已关闭」，而补办学生证/火车票优惠卡的 ywid
 * 也从旧代码里的 11082/11083 变成了 11002/11003——写死就是把人送进错的业务页。
 *
 * 用正则而不是 DOMParser：这段逻辑要在 node 单测里跑，而且只需要取出 a[href]。
 */

const APPLY_START = /id=["']apply_body["']/i;
const APPLY_END = /id=["']close_body["']/i;

function decodeEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}

/**
 * @param {string} html 可申请业务页源码
 * @returns {Array<{title: string, href: string}>} 申请中的业务（可能为空）
 */
export function parseApplicationList(html) {
  const text = String(html || '');
  const startMatch = text.match(APPLY_START);
  if (!startMatch) return [];
  const rest = text.slice(startMatch.index);
  const endMatch = rest.match(APPLY_END);
  const scope = endMatch ? rest.slice(0, endMatch.index) : rest;

  const list = [];
  const seen = new Set();
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match = re.exec(scope);
  while (match) {
    const attrs = match[1] || '';
    const href = (attrs.match(/href=["']([^"']+)["']/i) || [])[1] || '';
    const titleAttr = decodeEntities((attrs.match(/title=["']([^"']*)["']/i) || [])[1] || '');
    // <br> 是站点的排版换行：直接删掉，不要变成空格（"补办火车<br>票优惠卡"）
    const inner = match[2]
      .replace(/<br\s*\/?>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const label = (titleAttr || decodeEntities(inner)).replace(/\s+/g, ' ').trim();
    const safeHref = String(href || '').trim();
    if (label && safeHref && !/^javascript:/i.test(safeHref) && !/^#/.test(safeHref)) {
      // 按文案去重：同一业务在页面上重复出现时只留一个（链接不同也不重复列）
      if (!seen.has(label)) {
        seen.add(label);
        list.push({ title: label.slice(0, 24), href: safeHref });
      }
    }
    match = re.exec(scope);
  }
  return list;
}
