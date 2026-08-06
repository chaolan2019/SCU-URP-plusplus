// 成绩分析图表：纯 SVG 字符串生成，零第三方依赖。
// 颜色通过 CSS 变量（var(--xxx)）透传，天然适配六套皮肤与暗色。
// 所有数据驱动文本一律 escapeHtml，课程/学期名来自教务页面，不得裸拼。

import { escapeHtml } from '../../core/html.js';

const TEXT_FILL = 'var(--text-secondary)';
const GRID_STROKE = 'var(--border)';

function escapeLabel(value) {
  return escapeHtml(String(value == null ? '' : value));
}

// 学期趋势组合图：绩点 + 均分双折线（各自独立量程），底部叠加每学期学分柱。
// 每列提供 hover 透明区域与原生 tooltip（学期/课程/学分/均分/绩点）。
export function trendChartSvg({ trend, palette }) {
  const width = 920;
  const height = 330;
  const pad = { top: 36, right: 30, bottom: 46, left: 30 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const items = (trend || []).filter((item) => item && item.avgScore != null);
  if (!items.length) {
    return `<svg viewBox="0 0 ${width} ${height}" class="urppp-sa-chart" role="img" aria-label="学期成绩趋势"></svg>`;
  }
  const n = items.length;

  const xAt = (index) => pad.left + (index + 0.5) * (plotW / n);

  const gpaValues = items.map((item) => Number(item.avgGpa) || 0);
  const scoreValues = items.map((item) => Number(item.avgScore) || 0);
  const creditValues = items.map((item) => Number(item.credit) || 0);
  const gpaMin = Math.max(0, Math.min(...gpaValues) - 0.2);
  const gpaMax = Math.min(5, Math.max(...gpaValues) + 0.2);
  const scoreMin = Math.max(0, Math.min(...scoreValues) - 4);
  const scoreMax = Math.min(100, Math.max(...scoreValues) + 4);
  const maxCredit = Math.max(1, ...creditValues);
  const gpaSpan = (gpaMax - gpaMin) || 1;
  const scoreSpan = (scoreMax - scoreMin) || 1;
  const yGpa = (value) => pad.top + plotH - ((value - gpaMin) / gpaSpan) * plotH;
  const yScore = (value) => pad.top + plotH - ((value - scoreMin) / scoreSpan) * plotH;
  const yCredit = (value) => pad.top + plotH - (value / maxCredit) * plotH * 0.9;

  const gpaPoints = items.map((item, i) => `${xAt(i)},${yGpa(item.avgGpa)}`).join(' ');
  const scorePoints = items.map((item, i) => `${xAt(i)},${yScore(item.avgScore)}`).join(' ');

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = pad.top + plotH - ratio * plotH;
    return `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="${GRID_STROKE}" stroke-width="1" stroke-dasharray="3 4"/>`;
  }).join('');

  const creditBars = items.map((item, i) => {
    const x = xAt(i);
    const barW = Math.min(26, (plotW / n) * 0.32);
    const y = yCredit(item.credit);
    return `<rect x="${(x - barW / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${(pad.top + plotH - y).toFixed(1)}" rx="3" fill="${palette.credit}" opacity="0.55"/>
<text x="${x.toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${TEXT_FILL}">${escapeLabel(item.credit)}</text>`;
  }).join('');

  const xLabels = items.map((item, i) => (
    `<text x="${xAt(i).toFixed(1)}" y="${height - 16}" text-anchor="middle" font-size="12" fill="${TEXT_FILL}">${escapeLabel(item.label)}</text>`
  )).join('');

  // 每列 hover 区域 + 原生 tooltip
  const hoverZones = items.map((item, i) => {
    const colW = plotW / n;
    const x = xAt(i) - colW / 2;
    const tip = [
      `学期 ${item.label}`,
      `课程 ${item.count} 门`,
      `修读学分 ${item.credit}`,
      `加权均分 ${item.avgScore}`,
      `平均绩点 ${item.avgGpa}`,
    ].join('\n');
    return `<rect class="urppp-sa-hover" x="${x.toFixed(1)}" y="${pad.top}" width="${colW.toFixed(1)}" height="${plotH.toFixed(1)}" fill="transparent"><title>${escapeLabel(tip)}</title></rect>`;
  }).join('');

  const gpaDots = items.map((item, i) => (
    `<circle cx="${xAt(i).toFixed(1)}" cy="${yGpa(item.avgGpa).toFixed(1)}" r="3.5" fill="${palette.gpaLine}"/><text x="${xAt(i).toFixed(1)}" y="${(yGpa(item.avgGpa) - 9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${palette.gpaLine}">${escapeLabel(item.avgGpa)}</text>`
  )).join('');

  const scoreDots = items.map((item, i) => (
    `<circle cx="${xAt(i).toFixed(1)}" cy="${yScore(item.avgScore).toFixed(1)}" r="3" fill="${palette.scoreLine}"/><text x="${xAt(i).toFixed(1)}" y="${(yScore(item.avgScore) + 17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${palette.scoreLine}">${escapeLabel(item.avgScore)}</text>`
  )).join('');

  return `<svg viewBox="0 0 ${width} ${height}" class="urppp-sa-chart" role="img" aria-label="学期成绩趋势">
${gridLines}
${creditBars}
<g>${hoverZones}</g>
<text x="${pad.left}" y="18" font-size="12" fill="${TEXT_FILL}">每学期修读学分（柱）</text>
<g stroke="${palette.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${gpaPoints}"/></g>
<g stroke="${palette.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${scorePoints}"/></g>
<g>${gpaDots}</g>
<g>${scoreDots}</g>
<g>${xLabels}</g>
<g font-size="12">
  <rect x="${width - pad.right - 176}" y="8" width="12" height="12" rx="3" fill="${palette.gpaLine}"/><text x="${width - pad.right - 158}" y="18" fill="${TEXT_FILL}">学期平均绩点</text>
  <rect x="${width - pad.right - 82}" y="8" width="12" height="12" rx="3" fill="${palette.scoreLine}"/><text x="${width - pad.right - 64}" y="18" fill="${TEXT_FILL}">加权均分</text>
</g>
</svg>`;
}

// 成绩分段分布：川大等级制 11 段（4.0 ~ 0），柱体跟随主题色，
// 档位越高越实、越低越淡；柱下两行标注成绩分段与对应绩点。
export function bandsChartSvg({ bands, palette }) {
  const width = 660;
  const height = 236;
  const pad = { top: 28, right: 14, bottom: 44, left: 14 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const items = bands || [];
  const n = items.length || 1;
  const maxCount = Math.max(1, ...items.map((item) => item.count));
  const barW = Math.min(40, (plotW / n) * 0.52);

  const bars = items.map((item, i) => {
    const x = pad.left + (i + 0.5) * (plotW / n);
    const h = item.count ? Math.max(8, (item.count / maxCount) * plotH) : 0;
    const y = pad.top + plotH - h;
    // 档位越高越实：4.0 档 1.0 → 0 档 0.4
    const opacity = (0.4 + (1 - i / (n - 1)) * 0.6).toFixed(2);
    const rangeText = item.range || (item.min === 0 ? '<60' : `${item.min}-${item.max === 100 ? '100' : item.max}`);
    const tip = [
      `${item.level || ''}（绩点 ${item.gpa}）`,
      `百分制 ${rangeText}`,
      `课程 ${item.count} 门`,
    ].join('\n');
    return `<rect class="urppp-sa-band" x="${(x - barW / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${palette.primary}" opacity="${opacity}"><title>${escapeLabel(tip)}</title></rect>
<text x="${x.toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${escapeLabel(item.count)}</text>
<text x="${x.toFixed(1)}" y="${height - 26}" text-anchor="middle" font-size="11" font-weight="600" fill="${TEXT_FILL}">${escapeLabel(rangeText)}</text>
<text x="${x.toFixed(1)}" y="${height - 12}" text-anchor="middle" font-size="12" fill="${TEXT_FILL}">${escapeLabel(item.gpa)}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${width} ${height}" class="urppp-sa-chart" role="img" aria-label="成绩分段分布">
<line x1="${pad.left}" y1="${(pad.top + plotH).toFixed(1)}" x2="${width - pad.right}" y2="${(pad.top + plotH).toFixed(1)}" stroke="${GRID_STROKE}" stroke-width="1"/>
${bars}
</svg>`;
}

// 课程类型构成环形图：按 items 顺序从 12 点方向顺时针排布，中心显示必修占比。
export function donutSvg({ items, requiredRatio, palette }) {
  const size = 150;
  const center = size / 2;
  const radius = 56;
  const stroke = 24;
  const circumference = 2 * Math.PI * radius;
  const segments = (items || []).filter((item) => item && item.ratio > 0);
  const ratio = Math.max(0, Math.min(100, Math.round(Number(requiredRatio) || 0)));
  if (!segments.length) {
    return `<svg viewBox="0 0 ${size} ${size}" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>`;
  }
  let cursor = -90;
  const arcs = segments.map((item) => {
    const length = (item.ratio / 100) * circumference;
    const color = (palette.share && palette.share[item.key]) || palette.required;
    const arc = `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${color}" stroke-width="${stroke}"
  stroke-dasharray="${length.toFixed(2)} ${circumference.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${cursor.toFixed(2)} ${center} ${center})"/>`;
    cursor += (item.ratio / 100) * 360;
    return arc;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${GRID_STROKE}" stroke-width="${stroke}"/>
${arcs}
<text x="${center}" y="${center - 6}" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${escapeLabel(ratio)}%</text>
<text x="${center}" y="${center + 16}" text-anchor="middle" font-size="11.5" fill="${TEXT_FILL}">必修学分占比</text>
</svg>`;
}
