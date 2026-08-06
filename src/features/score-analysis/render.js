// 成绩分析面板 DOM 构建。所有教务数据（课程名/学期名）一律 escapeHtml。
// 面板外壳与内容分离：外壳随 feature mount 插入（折叠态），内容在首次展开后填充。

import { escapeHtml } from '../../core/html.js';
import { bandsChartSvg, donutSvg, trendChartSvg } from './charts.js';

export const DEFAULT_PALETTE = Object.freeze({
  gpaLine: 'var(--primary)',
  scoreLine: 'var(--text-secondary)',
  credit: 'var(--primary)',
  primary: 'var(--primary)',
  share: Object.freeze({
    required: 'var(--primary)',
    elective: 'var(--text-muted)',
    optional: 'var(--text-secondary)',
    other: 'var(--border)',
  }),
});

const ICON_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>';
const CHEVRON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

export function createScoreAnalysisRenderer({ deps }) {
  const palette = (deps && deps.palette) || DEFAULT_PALETTE;

  function panelShellHtml() {
    return `<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${ICON_SVG}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${CHEVRON_SVG}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`;
  }

  function loadingHtml() {
    return '<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>';
  }

  function errorHtml(message) {
    const detail = escapeHtml(String(message || '成绩数据加载失败'));
    return `<div class="urppp-sa-error">${detail}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`;
  }

  function metricCards(metrics) {
    const cards = [
      { label: '主修必修绩点', value: metrics.requiredGpa > 0 ? String(metrics.requiredGpa) : '—', hint: '必修课程加权' },
      { label: '平均绩点', value: metrics.avgGpa != null ? String(metrics.avgGpa) : '—', hint: '全部及格加权' },
      { label: '加权均分', value: metrics.avgScore != null ? String(metrics.avgScore) : '—', hint: '学分加权' },
      { label: '已修学分', value: metrics.totalCredit != null ? String(metrics.totalCredit) : '—', hint: '及格课程学分' },
      { label: '已修课程', value: String(metrics.courseCount || 0), hint: '含未评估' },
    ];
    return cards.map((card) => (
      `<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${escapeHtml(card.value)}</div>
  <div class="urppp-sa-metric-label">${escapeHtml(card.label)}</div>
  <div class="urppp-sa-metric-hint">${escapeHtml(card.hint)}</div>
</div>`
    )).join('');
  }

  function detailTable(trend) {
    const rows = (trend || []).map((item) => (
      `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.count)}</td><td>${escapeHtml(item.credit)}</td><td>${escapeHtml(item.avgScore)}</td><td>${escapeHtml(item.avgGpa)}</td></tr>`
    )).join('');
    return `<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${rows}</tbody></table>`;
  }

  function shareLegend(items) {
    return (items || []).map((item) => {
      const color = (palette.share && palette.share[item.key]) || palette.primary;
      return `<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${color}"></i>${escapeHtml(item.label)} ${escapeHtml(item.credit)} 学分 · ${escapeHtml(item.count)} 门</div>`;
    }).join('');
  }

  function analysisHtml(analysis) {
    if (!analysis || analysis.empty) {
      return '<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';
    }
    const share = analysis.share || { items: [], requiredRatio: 0 };
    return `<div class="urppp-sa-metrics">${metricCards(analysis.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    ${trendChartSvg({ trend: analysis.trend, palette })}
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${donutSvg({ items: share.items, requiredRatio: share.requiredRatio, palette })}</div>
      <div class="urppp-sa-legend">${shareLegend(share.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    ${bandsChartSvg({ bands: analysis.bands, palette })}
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${detailTable(analysis.trend)}
  </section>
</div>`;
  }

  return { panelShellHtml, loadingHtml, errorHtml, analysisHtml, palette };
}
