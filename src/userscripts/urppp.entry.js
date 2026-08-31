import {
  alpha,
  darken,
  hexToRgb,
  mixHex,
  normalizeHexColor,
  rgbToHex,
} from '../core/color.js';
import { createFeatureRuntime, defineFeature } from '../core/feature-runtime.js';
import { escapeHtml } from '../core/html.js';
import { compareVersions, parseUserscriptVersion } from '../core/version.js';
import { sha256Bytes, ed25519Verify } from './pure-crypto.js';
import {
  DEFAULT_SCHEDULE_JSON_MAPPING,
  buildCustomScheduleJson,
  buildScheduleJsonSource,
  buildXiaoAiScheduleJson,
  validateScheduleJsonMapping,
} from '../features/schedule-export/json-format.js';
import {
  buildScheduleIcs,
  defaultSemesterMonday,
  localDateIso,
  mondayOfDate,
  parseLocalIsoDate,
  scheduleIcsOmissionStats,
} from '../features/schedule-export/ics.js';
import {
  normalizeScheduleExportData,
  schedulePlanCodeFromData,
} from '../features/schedule-export/data-normalize.js';
import { scheduleCardLaneGeometry } from '../features/schedule-export/layout.js';
import { buildScheduleSvg as renderScheduleSvg } from '../features/schedule-export/schedule-image.js';
import { createScheduleExportUi } from '../features/schedule-export/ui.js';
import {
  bindSettingsTabs,
  createSettingsPanelController,
} from '../features/settings/panel-controller.js';
import { buildSettingsPanelHtml } from '../features/settings/panel-template.js';
import { createPluginManager } from '../features/plugin-manager/index.js';
import { createJsonSettingsController } from '../features/settings/json-settings.js';
import {
  DIRECT_EDIT_KEYS,
  PRIVACY_FIELD_DEFAULTS,
  PRIVACY_MASK_TEXT,
  normalizeCustomIdentity,
  normalizePrivacySettings,
  validCustomAvatar,
} from '../features/settings/privacy-model.js';
import { createPrivacySettingsController } from '../features/settings/privacy-settings.js';
import { createThemeSettingsController } from '../features/settings/theme-controller.js';
import { syncThemeSettingsControls } from '../features/settings/theme-settings.js';
import {
  isBusinessDataTable as classifyBusinessDataTable,
  isNoticeBulletText,
  isNoticeDateText,
  isNoticeListTable as classifyNoticeListTable,
  isNoticePageContext as detectNoticePageContext,
} from '../features/table-beautify/table-classification.js';
import { createTableWrapper } from '../features/table-beautify/table-wrapper.js';
import { createTableInlineStyleScrubber } from '../features/table-beautify/inline-style-scrub.js';
import { createPagebarLifecycle } from '../features/table-beautify/pagebar-lifecycle.js';
import { createPagebarBeautifier } from '../features/table-beautify/pagebar.js';
import { createNoticeTableLifecycle } from '../features/table-beautify/notice-lifecycle.js';
import { createNoticeTableSurface } from '../features/table-beautify/notice-surface.js';
import { createNoticeTableBeautifier } from '../features/table-beautify/notice-tables.js';
import {
  cloneNativePdfStage,
  exportNativePdfIsolated,
  isNativePdfIsolationActive,
} from '../features/schedule-export/native-pdf.js';
import featureStyles from '../styles/features.css';
import internalStyles from '../styles/internal.css';
import scheduleCardStyles from '../styles/schedule-cards.css';
import scheduleExportStyles from '../styles/schedule-export.css';
import settingsStyles from '../styles/settings.css';
import tableBeautifyStyles from '../styles/table-beautify.css';
import navigationStyles from '../styles/navigation.css';
import cleanModeStyles from '../styles/clean-mode.css';
import dashboardStyles from '../styles/dashboard.css';
import scoreAnalysisStyles from '../styles/score-analysis.css';
import mobileStyles from '../styles/mobile.css';
import { createCleanModeState, resetCleanModeData } from '../features/clean-mode/state.js';
import { createCleanModeDataLoader } from '../features/clean-mode/data.js';
import { createCleanModeRenderer } from '../features/clean-mode/render.js';
import { createCleanModeUI } from '../features/clean-mode/ui.js';
import { createCleanModeController } from '../features/clean-mode/controller.js';
import { ensureCalendarData } from '../features/interactive-calendar/index.js';
import { createDashboardController } from '../features/dashboard/dashboard.js';
import { createScoreAnalysisController } from '../features/score-analysis/controller.js';
import { createScoreAnalysisData } from '../features/score-analysis/data.js';
import { bandsChartSvg as renderScoreBandsChart, trendChartSvg as renderScoreTrendChart } from '../features/score-analysis/charts.js';
import { createBreadcrumbController } from '../features/navigation/breadcrumb.js';
import { createSidebarController } from '../features/navigation/sidebar.js';
import { createNavbarController } from '../features/navigation/navbar.js';

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

(function () {
  'use strict';

  // ===== 移动端早期适配（UA 检测，document-start 阶段执行） =====
  // 教务系统部分页面无 viewport meta：手机浏览器默认按 980px 布局渲染再整体缩放，
  // 叠加插件媒体查询后布局错乱。UA 命中移动端时注入 viewport 让视口等于真实设备宽度，
  // 并给 <html> 打 urppp-mobile 标记供后续功能（如移动端清爽模式）引用。
  try {
    const UA = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(UA)) {
      if (document.documentElement) {
        document.documentElement.classList.add('urppp-mobile');
      }
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1';
        (document.head || document.documentElement || document).appendChild(viewportMeta);
      }
    }
  } catch (_) { /* viewport 注入失败不影响插件其余功能 */ }

  // 与脚本头 @version 保持同步
  const URPPP_VERSION = '1.9.9';

  // 统一认证页(id.scu)：主插件不做任何美化，仅作为宿主注入辅助插件(登录助手/2FA/会话保持)
  // 避免主插件的样式/布局污染统一认证网站界面，同时保留辅助插件的登录相关功能
  if (/^id\./i.test(String(location.hostname || ''))) {
    try {
      const authPlugin = createPluginManager({
        GM: {
          getValue: typeof GM_getValue === 'function' ? GM_getValue : null,
          setValue: typeof GM_setValue === 'function' ? GM_setValue : null,
          xmlHttp: typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null,
          addStyle: typeof GM_addStyle === 'function' ? GM_addStyle : null,
        },
        doc: document,
        hostInfo: { version: URPPP_VERSION },
        uiDeps: { openSubpanel: () => {} },
      });
      const boot = () => { try { authPlugin.bootFromCache('assist'); } catch (_) { /* ignore */ } };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
      else boot();
    } catch (_) { /* ignore */ }
    return;
  }
  const URPPP_UPDATE = {
    mainRaw: 'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js',
    assistRaw: 'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js',
    repo: 'https://github.com/chaolan2019/SCU-URP-plusplus',
    changelogPage: 'https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md',
    greasySearch: 'https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B',
    // 多源探测：GitHub（权威）优先，Gitee 次之（国内直连），jsDelivr 兑底
    versionJson: 'version.json',
    sourceUrls: (file) => [
      `https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${file}`,
      `https://gitee.com/chaolan2026/SCU-URP-plusplus/raw/main/${file}`,
      `https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${file}`,
    ],
  };
  const AUTO_UPDATE_KEY = 'urppp_auto_update_check_v1';
  const PRELOAD_KEY = 'urppp_global_preload_v1';
  const SKIN_KEY = 'urppp_skin_v1';
  const SKIN_CATALOG = [
    { id: 'apple', name: '类Apple风格', desc: '系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。', ready: true, dark: true, dynamic: true, installed: true, builtin: true, version: '1.0.0', author: 'Chao_Lan', repo: 'https://github.com/chaolan2019/SCU-URP-plusplus', caps: { scope: 'app', allowJS: false } },
    { id: 'editorial', name: '编辑杂志', desc: '衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。', ready: true, dark: true, dynamic: false, installed: true, builtin: true, version: '1.0.0', author: 'Chao_Lan', repo: 'https://github.com/chaolan2019/SCU-URP-plusplus', caps: { scope: 'app', allowJS: false } },
    { id: 'flat', name: '极简扁平', desc: '无阴影、硬边与纯色层次，冷硬清晰。', ready: true, dark: true, dynamic: true, installed: false, version: '1.0.0', author: 'Chao_Lan', repo: 'https://github.com/chaolan2019/SCU-URP-plusplus', caps: { scope: 'app', allowJS: false } },
    { id: 'organic', name: '自然有机', desc: '奶油底与大地色，温暖圆角。不支持动态配色。', ready: true, dark: true, dynamic: false, installed: false, version: '1.0.0', author: 'Chao_Lan', repo: 'https://github.com/chaolan2019/SCU-URP-plusplus', caps: { scope: 'app', allowJS: false } },
    { id: 'brutal', name: '新野兽派', desc: '高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。', ready: true, dark: true, dynamic: false, palettes: true, installed: false, version: '1.0.0', author: 'Chao_Lan', repo: 'https://github.com/chaolan2019/SCU-URP-plusplus', caps: { scope: 'app', allowJS: false } },
    { id: 'neu', name: '新拟物', desc: '同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。', ready: true, dark: true, dynamic: false, installed: false, version: '1.0.0', author: 'Chao_Lan', repo: 'https://github.com/chaolan2019/SCU-URP-plusplus', caps: { scope: 'app', allowJS: false } },
  ];

  // 最早阶段：最高优先级遮罩盖住未美化界面，完成后淡入
  const earlyStyle = GM_addStyle(`
    html, body { background: var(--bg, #F5F5F7) !important; color: var(--text, #1D1D1F) !important; }
    /* 未就绪时隐藏页面主体，避免 ACE 原样式闪现 */
    html:not(.urppp-ready) body {
      opacity: 0 !important;
      pointer-events: none !important;
    }
    html.urppp-ready body,
    body.urppp-ready {
      opacity: 1 !important;
      pointer-events: auto !important;
      transition: opacity .2s ease !important;
    }
    #urppp-boot-loader {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-direction: column !important;
      gap: 14px !important;
      margin: 0 !important;
      padding: 0 !important;
      background: var(--bg, #F5F5F7) !important;
      color: var(--text, #0F172A) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif !important;
      transition: opacity .25s ease, visibility .25s ease, background-color .2s ease !important;
      pointer-events: all !important;
    }
    #urppp-boot-loader.urppp-boot-hide {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    #urppp-boot-loader .urppp-boot-text {
      font-size: 13px !important;
      color: var(--text-secondary, #64748B) !important;
      letter-spacing: 0.4px !important;
    }
    /* 立方体旋转 loading：浅色、扁平 */
    .urppp-cube-scene {
      width: 48px;
      height: 48px;
      perspective: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .urppp-cube {
      width: 26px;
      height: 26px;
      position: relative;
      transform-style: preserve-3d;
      animation: urppp-cube-spin 1.35s linear infinite;
    }
    .urppp-cube-face {
      position: absolute;
      inset: 0;
      border: 1.5px solid var(--border, #E2E8F0);
      background: var(--surface, #FFFFFF);
      border-radius: 2px;
      box-sizing: border-box;
      box-shadow: none;
      opacity: 0.95;
    }
    .urppp-cube-face.front  { transform: translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--text-muted, #94A3B8); }
    .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(13px); background: var(--surface, #FFFFFF); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(13px); background: var(--surface, #FFFFFF); border-color: var(--text-muted, #94A3B8); }
    .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(13px); background: var(--bg, #F5F5F7); border-color: var(--border, #E2E8F0); }
    #urppp-boot-loader .urppp-cube-scene { width: 64px; height: 64px; perspective: 280px; }
    #urppp-boot-loader .urppp-cube { width: 34px; height: 34px; }
    #urppp-boot-loader .urppp-cube-face {
      border-width: 1.5px;
      border-color: var(--border, #E2E8F0);
    }
    #urppp-boot-loader .urppp-cube-face.front  { transform: translateZ(17px); background: var(--input-bg, #F8FAFC); border-color: var(--text-muted, #94A3B8); }
    #urppp-boot-loader .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(17px); background: var(--surface, #FFFFFF); }
    #urppp-boot-loader .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(17px); background: var(--input-bg, #F8FAFC); }
    #urppp-boot-loader .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(17px); background: var(--input-bg, #F8FAFC); }
    #urppp-boot-loader .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(17px); background: var(--surface, #FFFFFF); border-color: var(--text-muted, #94A3B8); }
    #urppp-boot-loader .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(17px); background: var(--bg, #F5F5F7); }
    @keyframes urppp-cube-spin {
      0%   { transform: rotateX(-12deg) rotateY(0deg); }
      100% { transform: rotateX(-12deg) rotateY(360deg); }
    }
    @keyframes urppp-spin {
      to { transform: rotate(360deg); }
    }
    /* 原生 loading 图：先藏起来，JS 会替换成 SVG */
    img[src*="pageloading" i],
    img[src*="page-loading" i],
    img[src*="/loading" i],
    img[src*="Loading.gif"],
    .view-pre-loading,
    .pageloading,
    .pre-loading {
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
      position: absolute !important;
      pointer-events: none !important;
    }
    .urppp-inline-loader {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      min-height: 64px;
      color: #64748B !important;
      font-size: 13px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif !important;
      box-sizing: border-box !important;
    }
    /* 分页/表格遮罩：绝不注入 DOM；只在可见时用 CSS 转圈，站点 display:none 即可彻底消失 */
    [id^="div_page_loading"],
    [id*="page_loading"],
    [id$="_loading"],
    div[id*="page_loading"] {
      background: transparent !important;
      background-image: none !important;
    }
    [id^="div_page_loading"] img,
    [id*="page_loading"] img {
      display: none !important;
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
    }
    /* 清掉我们误注入的节点视觉 */
    [id^="div_page_loading"] .urppp-inline-loader,
    [id*="page_loading"] .urppp-inline-loader,
    [id^="div_page_loading"] svg,
    [id*="page_loading"] svg {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
    }
    /* 分页遮罩：不注入、不伪元素转圈，只藏原生 gif，避免卡住/卡死 */
    [id^="div_page_loading"]::before,
    [id*="page_loading"]::before {
      content: none !important;
      display: none !important;
    }
    .urppp-inline-loader .urppp-cube-scene {
      width: 40px !important;
      height: 40px !important;
      perspective: 200px !important;
    }
    .urppp-inline-loader .urppp-cube {
      width: 20px !important;
      height: 20px !important;
    }
    .urppp-inline-loader .urppp-cube-face {
      border-color: var(--border, #E2E8F0) !important;
      border-width: 1.5px !important;
      background: var(--surface, #FFFFFF) !important;
    }
    .urppp-inline-loader .urppp-cube-face.front  { transform: translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; border-color: var(--text-muted, #94A3B8) !important; }
    .urppp-inline-loader .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(10px) !important; background: var(--surface, #FFFFFF) !important; }
    .urppp-inline-loader .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; }
    .urppp-inline-loader .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; }
    .urppp-inline-loader .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(10px) !important; background: var(--surface, #FFFFFF) !important; border-color: var(--text-muted, #94A3B8) !important; }
    .urppp-inline-loader .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(10px) !important; background: var(--bg, #F5F5F7) !important; }
    .center:has(> img[src*="pageloading" i]),
    .center:has(> .urppp-inline-loader),
    .modal-content .center {
      min-height: 80px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
    }
    /* layui-layer 原生 loading（背景图 loading-0.gif） */
    .layui-layer-loading,
    .layui-layer-loading0,
    .layui-layer-loading1,
    .layui-layer-loading2,
    .layui-layer-dialog.layui-layer-loading,
    .layui-layer-content.layui-layer-loading0,
    .layui-layer-content.layui-layer-loading1,
    .layui-layer-content.layui-layer-loading2 {
      background: transparent !important;
      background-image: none !important;
      background-color: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }
    .layui-layer-dialog.layui-layer-loading,
    .layui-layer.layui-layer-loading {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    .layui-layer-loading .layui-layer-content,
    .layui-layer-content.layui-layer-loading0,
    .layui-layer-content.layui-layer-loading1,
    .layui-layer-content.layui-layer-loading2 {
      width: 72px !important;
      height: 72px !important;
      background: transparent !important;
      background-image: none !important;
      position: relative !important;
    }
    /* 未注入时，伪元素兜底：旋转方块 */
    .layui-layer-content.layui-layer-loading0:not(:has(.urppp-inline-loader))::before,
    .layui-layer-content.layui-layer-loading1:not(:has(.urppp-inline-loader))::before,
    .layui-layer-content.layui-layer-loading2:not(:has(.urppp-inline-loader))::before,
    .layui-layer-loading .layui-layer-content:not(:has(.urppp-inline-loader))::before {
      content: '' !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 20px !important;
      height: 20px !important;
      margin: -10px 0 0 -10px !important;
      border: 1.5px solid var(--border, #E2E8F0) !important;
      border-radius: 2px !important;
      background: var(--input-bg, #F8FAFC) !important;
      box-sizing: border-box !important;
      animation: urppp-cube-spin 1.15s linear infinite !important;
      transform-style: preserve-3d !important;
    }
    .layui-layer-loading .urppp-inline-loader,
    .layui-layer-content .urppp-inline-loader {
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      padding: 0 !important;
      gap: 0 !important;
    }
  `);
  if (earlyStyle) earlyStyle.id = 'urppp-early-style';

  const URPPP_LOADER_CUBE = `
    <div class="urppp-cube-scene" aria-hidden="true">
      <div class="urppp-cube">
        <div class="urppp-cube-face front"></div>
        <div class="urppp-cube-face back"></div>
        <div class="urppp-cube-face right"></div>
        <div class="urppp-cube-face left"></div>
        <div class="urppp-cube-face top"></div>
        <div class="urppp-cube-face bottom"></div>
      </div>
    </div>
  `;

  function makeInlineLoader(text) {
    const wrap = document.createElement('div');
    wrap.className = 'urppp-inline-loader';
    wrap.innerHTML = URPPP_LOADER_CUBE + (text ? `<div>${text}</div>` : '');
    return wrap;
  }

  function isPageLoadingOverlay(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]');
  }

  // 安全清理：只删我们注入的节点，绝不改 display / 不挂全局 observer
  function cleanupPageLoadingOverlays(scope) {
    try {
      const root = scope && scope.querySelectorAll ? scope : document;
      root.querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach((el) => {
        el.querySelectorAll('.urppp-inline-loader').forEach((n) => {
          try { n.remove(); } catch (_) {}
        });
        el.classList.remove('urppp-loading-active');
      });
    } catch (_) {}
  }

  function replaceNativeLoaders(root) {
    try {
      const scope = root && root.querySelectorAll ? root : document;

      // 分页遮罩：只清误注入，不碰显隐
      cleanupPageLoadingOverlays(scope);

      // 1) 替换普通 loading gif（跳过分页遮罩）
      scope.querySelectorAll('img').forEach((img) => {
        try {
          if (!img || img.dataset.urpppReplaced === '1') return;
          if (isPageLoadingOverlay(img)) return;
          const src = (img.getAttribute('src') || img.src || '').toLowerCase();
          if (!src) return;
          if (!(src.includes('pageloading') || src.includes('page-loading') || src.includes('loading.gif') || src.includes('loading-0') || src.includes('loading-1'))) return;
          // 避免匹配普通 /loading 路径过宽
          if (src.includes('/loading') && !src.includes('pageloading') && !src.includes('loading.gif') && !src.includes('loading-0')) return;
          img.dataset.urpppReplaced = '1';
          const loader = makeInlineLoader('');
          loader.style.minHeight = '0';
          loader.style.padding = '0';
          if (img.parentElement) img.parentElement.replaceChild(loader, img);
        } catch (_) {}
      });

      // 2) layui-layer loading：只去背景 + 注入一次 SVG
      scope.querySelectorAll(
        '.layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content'
      ).forEach((el) => {
        try {
          if (!el || el.dataset.urpppReplaced === '1') return;
          el.dataset.urpppReplaced = '1';
          el.style.setProperty('background', 'transparent', 'important');
          el.style.setProperty('background-image', 'none', 'important');
          if (!el.querySelector('.urppp-inline-loader')) {
            const loader = makeInlineLoader('');
            loader.style.minHeight = '0';
            loader.style.padding = '0';
            el.appendChild(loader);
          }
        } catch (_) {}
      });
    } catch (_) {}
  }

  // 低频扫描替换 loading（只 childList，强节流，避免卡死页面）
  if (!window.__urpppLoaderObs) {
    window.__urpppLoaderObs = true;
    let running = false;
    const run = () => {
      if (running) return;
      running = true;
      try { replaceNativeLoaders(document); } catch (_) {}
      running = false;
    };
    if (document.body) setTimeout(run, 0);
    document.addEventListener('DOMContentLoaded', () => setTimeout(run, 0), { once: true });
    const startObs = () => {
      const obs = new MutationObserver(() => {
        clearTimeout(window.__urpppLoaderTimer);
        window.__urpppLoaderTimer = setTimeout(run, 200);
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    };
    if (document.body) startObs();
    else document.addEventListener('DOMContentLoaded', startObs, { once: true });
  }

  const THEME_KEY = 'urppp_theme_v3';
  const ACCENT_KEY = 'urppp_accent_v1';
  const ACCENT_PRESETS_KEY = 'urppp_accent_presets_v1';
  const SCHEME_KEY = 'urppp_scheme_v1';
  const THEME_FOLLOW_KEY = 'urppp_theme_follow_system_v1';
  const CLEAN_DEFAULT_KEY = 'urppp_clean_default_v1';
  const CLEAN_ANALYSIS_KEY = 'urppp_clean_analysis_v1'; // tab | direct
  const APPLE_EDGE_KEY = 'urppp_apple_edge_line_v1';
  const FOLLOW_DYNAMIC_KEY = 'urppp_follow_use_dynamic_v1';
  const BRUTAL_PALETTE_KEY = 'urppp_brutal_palette_v1';
  const BRUTAL_ACTIVE_PALETTE_KEY = 'urppp_brutal_active_palette_v1';
  const PRIVACY_SETTINGS_KEY = 'urppp_privacy_v1';
  const CUSTOM_IDENTITY_KEY = 'urppp_custom_identity_v1';
  const SCHEDULE_FIRST_MONDAY_KEY = 'urppp_schedule_first_monday_v1';
  const SCHEDULE_JSON_FORMAT_KEY = 'urppp_schedule_json_format_v1';
  const DIRECT_EDIT_LABELS = {
    completedCourses: '已修课程', failedCourses: '未及格课程', majorGpa: '主修绩点',
    majorPlan: '主修方案', remainingCourses: '待修课程',
    passingTotalCredit: '全部及格总学分', passingAvgScore: '全部及格平均成绩', passingAvgGpa: '全部及格平均绩点',
    passingRequiredCredit: '全部及格必修学分', passingRequiredAvg: '全部及格必修平均', passingRequiredGpa: '全部及格必修绩点',
    schemeTotalCredit: '方案总学分', schemeAvgScore: '方案平均成绩', schemeAvgGpa: '方案平均绩点',
    schemeRequiredCredit: '方案必修学分', schemeRequiredAvg: '方案必修平均', schemeRequiredGpa: '方案必修绩点'
  };
  let scheduleJsonFormatRecoveryMessage = '';
  const DEFAULT_ACCENT_PRESETS = ['#1E3A5F', '#B53434', '#0F766E', '#7C3AED', '#C2410C', '#0369A1', '#BE185D', '#365314'];
  const DEFAULT_SEED = '#B53434';
  const BRUTAL_DEFAULT_PALETTE = 'pink';
  const BRUTAL_PALETTES = [
    { id: 'pink', name: '高能粉', desc: '默认配色，热粉强调与酸性绿辅助', accent: '#FF006E', secondary: '#CCFF00', info: '#00D9FF', warning: '#FF9500' },
    { id: 'acid', name: '酸性绿', desc: '酸性绿强调与热粉辅助', accent: '#CCFF00', secondary: '#FF006E', info: '#00D9FF', warning: '#FF9500' },
    { id: 'cyan', name: '电子蓝', desc: '电子蓝强调与亮橙辅助', accent: '#00D9FF', secondary: '#FF9500', info: '#CCFF00', warning: '#FF006E' },
    { id: 'orange', name: '亮橙', desc: '亮橙强调与电子蓝辅助', accent: '#FF9500', secondary: '#00D9FF', info: '#CCFF00', warning: '#FF006E' },
  ];
  const DEFAULT_SCHEME = 'tonal'; // 默认就有可见卡片染色；要白卡选 paper

  // Material You 风格方案：同一 seed 派生多套角色色
  // 约定：仅「纯白卡片」接近白卡；其余方案卡片必须可见染色
  const SCHEME_DEFS = [
    { id: 'paper', name: '纯白卡片', desc: '卡片保持白，仅强调色跟种子' },
    { id: 'tonal', name: '色调点缀', desc: '背景轻染，卡片带同色相浅底' },
    { id: 'soft', name: '柔和粉彩', desc: '卡片明显粉彩/浅色，低对比' },
    { id: 'vibrant', name: '鲜艳', desc: '背景与卡片都更有色，主色更饱和' },
    { id: 'expressive', name: '表现力', desc: '双色拼色：卡片跟主色，背景走协调次色' }
  ];

  // 顶栏导航：主题圆点、设置入口、搜索对齐与用户项（navigation/navbar.js）
  const {
    handleThemeDotClick,
    injectNavbarThemeSwitch,
    rebuildNavbar,
    syncNavbarThemeUI,
    syncThemeDotGroup,
  } = createNavbarController({
    theme: {
      BRUTAL_DEFAULT_PALETTE,
      DEFAULT_SEED,
      applyTheme,
      buildSchemePreview,
      getAccent,
      getBrutalActivePalette,
      getBrutalPaletteById,
      getBrutalSelectedPalette,
      getCurrent,
      getScheme,
      getSkin,
      isThemeModeAvailable,
      setBrutalPalette,
      skinSupportsDark,
      skinSupportsDynamic,
      skinSupportsFixedPalettes,
    },
    settings: {
      ensureSettingsPanel,
      openSettingsPanel,
      syncSettingsPanelUI,
    },
  });

  function bindDesktopNavbarSearch() {
    try {
      const narrow = !!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches);
      if (narrow) return;
      const navbar = document.getElementById('navbar');
      const aceNav = navbar?.querySelector('.ace-nav');
      if (!navbar || !aceNav) return;

      let host = document.getElementById('intellegenceUDiv');
      let button = document.getElementById('clickdiv');
      let formSearch = document.getElementById('form-search');
      if (!host) {
        const item = document.createElement('li');
        item.className = 'green urppp-search-item';
        host = document.createElement('div');
        host.id = 'intellegenceUDiv';
        item.appendChild(host);
        aceNav.appendChild(item);
      }
      // 无论新建还是已有，搜索项都紧贴“帮助/客服”按钮左边；找不到则放到用户项前靠右
      const searchItem = host.closest('li') || host.parentElement;
      const helpItem = Array.from(aceNav.children).find((li) => {
        const a = li.querySelector(':scope > a');
        if (!a) return false;
        const href = a.getAttribute('href') || '';
        const title = (a.getAttribute('title') || '') + ' ' + (a.textContent || '');
        return href.includes('customerServiceCenter')
          || /help|service|support/i.test(href)
          || !!a.querySelector('.glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring')
          || /帮助|客服|服务|帮助中心/i.test(title);
      });
      const userItem = Array.from(aceNav.children).find((li) => li.classList.contains('light-blue'));
      const anchor = helpItem || userItem || null;
      if (anchor && searchItem && anchor !== searchItem) {
        const isBefore = (searchItem.compareDocumentPosition(anchor) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
        if (!isBefore) {
          aceNav.insertBefore(searchItem, anchor);
        }
      }
      if (searchItem && !searchItem.classList.contains('urppp-search-item')) searchItem.classList.add('urppp-search-item');
      const hostItem = searchItem;
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.id = 'clickdiv';
        button.setAttribute('aria-label', '搜索功能');
        button.innerHTML = '<i class="fa fa-search" id="clicki" aria-hidden="true"></i>';
        host.appendChild(button);
      } else {
        button.removeAttribute('onclick');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', '搜索功能');
      }
      // 按钮水平位置：原生 left:-32px 会重叠进输入框区域，调到 8px 靠右贴帮助按钮
      button.style.setProperty('left', '8px', 'important');
      button.style.setProperty('position', 'relative', 'important');
      button.style.setProperty('z-index', '31', 'important');
      if (!formSearch) {
        formSearch = document.createElement('div');
        formSearch.id = 'form-search';
        formSearch.className = 'nav-search';
        formSearch.innerHTML = '<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>';
      }
      // 保持 form-search 在按钮所在 li 内，随按钮定位；不拖到 navbar 右侧
      if (hostItem && formSearch.parentElement !== hostItem) hostItem.appendChild(formSearch);
      if (hostItem) hostItem.style.setProperty('position', 'relative', 'important');
      formSearch.classList.add('urppp-desktop-search');
      formSearch.style.setProperty('position', 'absolute', 'important');
      formSearch.style.setProperty('top', '50%', 'important');
      formSearch.style.setProperty('right', '24px', 'important');
      formSearch.style.setProperty('left', 'auto', 'important');
      formSearch.style.setProperty('transform', 'translateY(-50%)', 'important');
      formSearch.style.setProperty('width', formSearch.dataset.open === '1' ? 'min(240px, calc(100vw - 24px))' : '0px', 'important');
      formSearch.style.setProperty('max-width', 'calc(100vw - 24px)', 'important');
      formSearch.style.setProperty('opacity', formSearch.dataset.open === '1' ? '1' : '0', 'important');
      formSearch.style.setProperty('pointer-events', formSearch.dataset.open === '1' ? 'auto' : 'none', 'important');
      formSearch.style.setProperty('z-index', '1200', 'important');
      formSearch.style.setProperty('margin', '0', 'important');
      // 只保留原生搜索框本身，外围不再包面板背景
      formSearch.style.setProperty('background', 'transparent', 'important');
      formSearch.style.setProperty('border', '0 solid transparent', 'important');
      formSearch.style.setProperty('box-shadow', 'none', 'important');
      formSearch.style.setProperty('overflow', 'visible', 'important');
      formSearch.style.setProperty('transition', 'width .2s ease, opacity .2s ease', 'important');

      const input = formSearch.querySelector('#search-input');
      const innerForm = formSearch.querySelector('form');
      if (!input || !innerForm) return;
      innerForm.style.setProperty('display', 'block', 'important');
      innerForm.style.setProperty('margin', '0', 'important');
      innerForm.style.setProperty('padding', '10px', 'important');
      const icon = formSearch.querySelector('.input-icon');
      if (icon) {
        icon.style.setProperty('display', 'block', 'important');
        icon.style.setProperty('position', 'relative', 'important');
      }
      input.style.setProperty('display', 'block', 'important');
      input.style.setProperty('width', '100%', 'important');
      input.style.setProperty('height', '36px', 'important');
      input.style.setProperty('box-sizing', 'border-box', 'important');
      input.style.setProperty('padding', '0 12px', 'important');
      input.style.setProperty('border', '1px solid var(--border)', 'important');
      input.style.setProperty('border-radius', 'var(--radius-sm)', 'important');
      input.style.setProperty('background', 'var(--input-bg)', 'important');
      input.style.setProperty('color', 'var(--text)', 'important');

      const setOpen = (open) => {
        formSearch.dataset.open = open ? '1' : '0';
        formSearch.style.setProperty('width', open ? 'min(240px, calc(100vw - 24px))' : '0px', 'important');
        formSearch.style.setProperty('opacity', open ? '1' : '0', 'important');
        formSearch.style.setProperty('pointer-events', open ? 'auto' : 'none', 'important');
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          setTimeout(() => input.focus(), 30);
        }
      };
      if (!button.__urpppSearchBound) {
        button.__urpppSearchBound = true;
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          setOpen(formSearch.dataset.open !== '1');
        }, true);
      }
      if (!document.__urpppDesktopSearchOutsideBound) {
        document.__urpppDesktopSearchOutsideBound = true;
        document.addEventListener('click', (event) => {
          const panel = document.getElementById('form-search');
          const searchButton = document.getElementById('clickdiv');
          if (!panel || panel.dataset.open !== '1') return;
          // 同一 form-search 会临时移入移动/清爽侧边栏；此时状态归搜索面板所有。
          if (panel.classList.contains('urppp-mobile-form-search') || panel.closest('#urppp-mobile-search-panel')) return;
          if (panel.contains(event.target) || searchButton?.contains(event.target)) return;
          setOpen(false);
        }, true);
      }
    } catch (error) {
      console.warn('[URP++] desktop search bind failed', error);
    }
  }

  function ensureBootLoader() {
    if (document.getElementById('urppp-boot-loader')) return;
    const el = document.createElement('div');
    el.id = 'urppp-boot-loader';
    el.setAttribute('aria-busy', 'true');
    el.innerHTML = `
      <div class="urppp-cube-scene" aria-hidden="true">
        <div class="urppp-cube">
          <div class="urppp-cube-face front"></div>
          <div class="urppp-cube-face back"></div>
          <div class="urppp-cube-face right"></div>
          <div class="urppp-cube-face left"></div>
          <div class="urppp-cube-face top"></div>
          <div class="urppp-cube-face bottom"></div>
        </div>
      </div>
      <div class="urppp-boot-text">URP++ 加载中</div>
    `;
    const host = document.documentElement || document.body;
    if (host) host.appendChild(el);
  }
  function hideBootLoader() {
    try {
      document.documentElement.classList.add('urppp-ready');
      if (document.body) {
        document.body.classList.add('urppp-ready');
        document.body.style.removeProperty('opacity');
      }
      const el = document.getElementById('urppp-boot-loader');
      if (!el) return;
      el.classList.add('urppp-boot-hide');
      setTimeout(() => { try { el.remove(); } catch (_) {} }, 280);
    } catch (_) {}
  }
  // 立刻挂遮罩（document-start 阶段 html 已存在）
  try { ensureBootLoader(); } catch (_) {}
  // 兜底：最多 2.5s 必须进入
  if (!window.__urpppBootSafety) {
    window.__urpppBootSafety = setTimeout(() => { try { hideBootLoader(); } catch (_) {} }, 2500);
  }
  const THEMES = {
    'default': {
      name: '简约白',
      vars: {
        /* Apple-leaning Soft Utility：#f5f5f7 底 + 链接蓝 + 轻阴影 + 大圆角 */
        '--bg': '#F5F5F7', '--surface': '#FFFFFF',
        '--text': '#1D1D1F', '--text-secondary': '#6E6E73', '--text-muted': '#86868B',
        '--border': '#D2D2D7', '--border-focus': '#0071E3',
        '--input-bg': '#F5F5F7', '--primary': '#0071E3', '--primary-hover': '#0077ED',
        '--ring': 'rgba(0,113,227,0.28)',
        '--success': '#15803D', '--danger': '#B53434', '--warning': '#B45309', '--info': '#0A84FF',
        '--shadow': '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        '--radius': '18px', '--radius-sm': '12px',
        '--border-w': '0px',
      },
      font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif',
    },
    'dark': {
      name: '深邃暗',
      vars: {
        /* Apple Dark 向：近黑底 + 系统蓝 */
        '--bg': '#000000', '--surface': '#1C1C1E',
        '--text': '#F5F5F7', '--text-secondary': '#A1A1A6', '--text-muted': '#8E8E93',
        '--border': '#38383A', '--border-focus': '#0A84FF',
        '--input-bg': '#2C2C2E', '--primary': '#0A84FF', '--primary-hover': '#409CFF',
        '--ring': 'rgba(10,132,255,0.32)',
        '--success': '#4ADE80', '--danger': '#F87171', '--warning': '#FBBF24', '--info': '#60A5FA',
        '--shadow': '0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
        '--radius': '18px', '--radius-sm': '12px',
      },
      font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif',
    },
    'scu-red': {
      name: '动态配色',
      vars: {
        '--bg': '#F5F5F7', '--surface': '#FFFFFF',
        '--text': '#1D1D1F', '--text-secondary': '#6E6E73', '--text-muted': '#86868B',
        '--border': '#D2D2D7', '--border-focus': 'var(--urppp-accent, #B53434)',
        '--input-bg': '#F5F5F7',
        '--primary': 'var(--urppp-accent, #B53434)',
        '--primary-hover': 'var(--urppp-accent-hover, #962929)',
        '--ring': 'var(--urppp-accent-ring, rgba(181,52,52,0.18))',
        '--success': '#15803D', '--danger': 'var(--urppp-accent, #B53434)', '--warning': '#B45309', '--info': '#0A84FF',
        '--shadow': '0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        '--radius': '18px', '--radius-sm': '12px',
      },
      font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif',
    },
  };

  // ============================================================
  // 颜色工具 + Material You 风格动态配色
  // 说明：完整 HCT 在浏览器内过重；这里用 HSL 近似 MD3 角色映射
  // seed → primary/secondary/neutral tonal steps → scheme roles
  // ============================================================


  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s, l };
  }

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  function hslHex(h, s, l) {
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
  }

  function seedHsl(hex) {
    const { r, g, b } = hexToRgb(normalizeHexColor(hex) || DEFAULT_SEED);
    const hsl = rgbToHsl(r, g, b);
    // 过灰种子抬一点饱和，避免整套发死
    if (hsl.s < 0.12) hsl.s = 0.18;
    return hsl;
  }

  // tone：0 黑 → 100 白。浅色表面用绝对饱和度，避免再被 satMul 洗白
  function tone(h, s, toneVal) {
    const t = Math.max(0, Math.min(100, toneVal)) / 100;
    const sat = Math.max(0, Math.min(0.95, s));
    return hslHex(h, sat, t);
  }

  function schemeProfile(id) {
    // surfaceSeed / bgSeed：直接混入种子色的比例（0=白，0.18=明显浅色卡）
    // 只有 paper 保持纯白卡片
    switch (id) {
      case 'paper':
      case 'neutral':
        return {
          chroma: 1.0, secShift: 0, primaryTone: 38,
          whiteCard: true,
          bgSeed: 0.05, surfaceSeed: 0, borderSeed: 0.08
        };
      case 'soft':
        return {
          chroma: 1.0, secShift: 10, primaryTone: 42,
          bgSeed: 0.14, surfaceSeed: 0.16, borderSeed: 0.18
        };
      case 'vibrant':
        return {
          chroma: 1.15, secShift: 14, primaryTone: 36,
          bgSeed: 0.2, surfaceSeed: 0.22, borderSeed: 0.26
        };
      case 'expressive':
        // 双色拼色：卡片 = 主色浅染；背景 = 协调次色浅染（不是随机脏偏色）
        return {
          chroma: 1.08, secShift: 0, primaryTone: 36,
          duo: true,
          bgSeed: 0.12, surfaceSeed: 0.15, borderSeed: 0.18
        };
      case 'tonal':
      default:
        return {
          chroma: 1.0, secShift: 18, primaryTone: 40,
          bgSeed: 0.12, surfaceSeed: 0.13, borderSeed: 0.16
        };
    }
  }

  // 白底直接掺色：mix=0.15 量级肉眼可见，又不会脏
  function tintFromHex(hex, mix) {
    const c = normalizeHexColor(hex) || DEFAULT_SEED;
    const m = Math.max(0, Math.min(0.45, Number(mix) || 0));
    if (m <= 0.001) return '#FFFFFF';
    return mixHex('#FFFFFF', c, m);
  }

  // 协调次色：固定走「同色相邻色 / 柔和互补」，避免脏黄脏绿
  // 红 → 暖杏/浅陶；蓝 → 青灰；绿 → 薄荷；紫 → 藕粉
  function companionHue(h) {
    // 分段选和谐偏移，而不是死板 +40°
    if (h < 25 || h >= 345) return (h + 28) % 360;      // 红系 → 暖橙杏
    if (h < 55) return (h + 22) % 360;                  // 橙 → 琥珀
    if (h < 90) return (h + 160) % 360;                 // 黄绿 → 蓝绿对比
    if (h < 160) return (h + 40) % 360;                 // 绿 → 青绿
    if (h < 210) return (h + 35) % 360;                 // 青 → 蓝
    if (h < 265) return (h + 48) % 360;                 // 蓝 → 靛紫
    if (h < 310) return (h + 40) % 360;                 // 紫 → 品红
    return (h + 24) % 360;                              // 品红 → 玫红偏暖
  }

  function companionColor(seedHex) {
    const seed = normalizeHexColor(seedHex) || DEFAULT_SEED;
    const { h, s } = seedHsl(seed);
    const ch = companionHue(h);
    // 次色饱和略降、明度抬高，浅染时干净
    const sat = Math.min(0.72, Math.max(0.28, s * 0.78));
    return tone(ch, sat, 42);
  }

  /**
   * 从 seed 生成 light roles
   * - 多数方案：同色相染色
   * - expressive：双色拼色（卡=主色浅染，底=次色浅染）
   */
  function buildMaterialSchemeVars(seedHex, schemeId) {
    const seed = normalizeHexColor(seedHex) || DEFAULT_SEED;
    const { h, s } = seedHsl(seed);
    const sid = schemeId || DEFAULT_SCHEME;
    const p = schemeProfile(sid);
    const cs = Math.min(0.92, Math.max(0.35, s * p.chroma));
    const secondaryHex = companionColor(seed);
    const { h: sh } = seedHsl(secondaryHex);

    const primary = tone(h, cs, p.primaryTone);
    const primaryHover = tone(h, cs, Math.max(24, p.primaryTone - 10));
    const primaryContainer = mixHex('#FFFFFF', seed, 0.18);

    let bg;
    let surface;
    let border;
    if (p.whiteCard) {
      bg = mixHex('#F1F5F9', mixHex('#FFFFFF', seed, 0.08), 0.5);
      surface = '#FFFFFF';
      border = '#E5E7EB';
    } else if (p.duo) {
      // 拼色：背景走次色，卡片走主色 —— 预览三块应能分清
      bg = mixHex(tintFromHex(secondaryHex, p.bgSeed + 0.04), '#EEF1F4', 0.1);
      surface = mixHex(tintFromHex(seed, p.surfaceSeed), '#FFFFFF', 0.1);
      border = mixHex('#E5E7EB', secondaryHex, 0.16);
    } else {
      bg = mixHex(tintFromHex(seed, p.bgSeed), '#E8EBEF', 0.12);
      surface = mixHex(tintFromHex(seed, p.surfaceSeed), '#FFFFFF', 0.12);
      border = mixHex('#E5E7EB', seed, Math.max(0.08, p.borderSeed * 0.7));
    }

    const inputBg = p.whiteCard
      ? '#F8FAFC'
      : mixHex(surface, tintFromHex(p.duo ? secondaryHex : seed, Math.max(0.05, (p.surfaceSeed || 0.1) * 0.55)), 0.35);
    const text = tone(h, Math.min(0.45, cs * 0.55), 14);
    const textSecondary = alpha(tone(h, cs * 0.3, 34), 0.88);
    const textMuted = alpha(tone(h, cs * 0.22, 46), 0.76);
    const ring = alpha(primary, 0.18);
    const shadow = '0 4px 12px ' + alpha(primary, 0.1) + ', 0 1px 2px ' + alpha(primary, 0.05);

    return {
      '--bg': bg,
      '--surface': surface,
      '--text': text,
      '--text-secondary': textSecondary,
      '--text-muted': textMuted,
      '--border': border,
      '--border-focus': primary,
      '--input-bg': inputBg,
      '--primary': primary,
      '--primary-hover': primaryHover,
      '--ring': ring,
      '--shadow': shadow,
      '--radius': '18px',
      '--radius-sm': '12px',
      '--primary-container': primaryContainer,
      '--secondary': secondaryHex,
    };
  }

  function buildSchemePreview(seedHex, schemeId) {
    const v = buildMaterialSchemeVars(seedHex, schemeId);
    return {
      id: schemeId,
      primary: v['--primary'],
      bg: v['--bg'],
      surface: v['--surface'],
      border: v['--border'],
      text: v['--text']
    };
  }

  function listSchemePreviews(seedHex) {
    const seed = normalizeHexColor(seedHex) || getAccent() || DEFAULT_SEED;
    return SCHEME_DEFS.map((d) => Object.assign({}, d, buildSchemePreview(seed, d.id)));
  }

  // ============================================================
  // 主题管理
  // ============================================================

  function clearInlinePrimaryOverrides() {
    const root = document.documentElement;
    ;[
      '--primary', '--primary-hover', '--border-focus', '--ring',
      '--bg', '--surface', '--text', '--text-secondary', '--text-muted',
      '--border', '--input-bg', '--shadow', '--primary-container', '--secondary'
    ].forEach((k) => root.style.removeProperty(k));
  }

  function getAccent() {
    return normalizeHexColor(GM_getValue(ACCENT_KEY, '')) || '';
  }

  function getScheme() {
    const s = String(GM_getValue(SCHEME_KEY, DEFAULT_SCHEME) || DEFAULT_SCHEME);
    return SCHEME_DEFS.some((d) => d.id === s) ? s : DEFAULT_SCHEME;
  }

  function setScheme(id) {
    const sid = SCHEME_DEFS.some((d) => d.id === id) ? id : DEFAULT_SCHEME;
    GM_setValue(SCHEME_KEY, sid);
    return sid;
  }

  function applyAccent(hex, opts) {
    if (!hex) return;
    const h = normalizeHexColor(hex);
    if (!h) return;
    GM_setValue(ACCENT_KEY, h);
    if (opts && opts.scheme) setScheme(opts.scheme);
    if (opts && opts.skipTheme) {
      const hover = darken(h, 0.15);
      const ring = alpha(h, 0.15);
      document.documentElement.style.setProperty('--urppp-accent', h);
      document.documentElement.style.setProperty('--urppp-accent-hover', hover);
      document.documentElement.style.setProperty('--urppp-accent-ring', ring);
      try { syncNavbarThemeUI(); } catch (_) {}
      try { syncSettingsPanelUI(); } catch (_) {}
      return;
    }
    applyTheme('scu-red');
    try { syncNavbarThemeUI(); } catch (_) {}
    try { syncSettingsPanelUI(); } catch (_) {}
  }

  function getAccentPresets() {
    try {
      const raw = GM_getValue(ACCENT_PRESETS_KEY, '');
      if (!raw) return DEFAULT_ACCENT_PRESETS.slice();
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return DEFAULT_ACCENT_PRESETS.slice();
      return arr.filter((x) => typeof x === 'string' && /^#?[0-9a-fA-F]{6}$/i.test(x.replace('#','')) )
        .map((x) => x.startsWith('#') ? x.toUpperCase() : ('#' + x.toUpperCase()));
    } catch (_) {
      return DEFAULT_ACCENT_PRESETS.slice();
    }
  }

  function saveAccentPreset(hex) {
    const h = normalizeHexColor(hex || getAccent() || DEFAULT_SEED);
    if (!h) return getAccentPresets();
    let list = getAccentPresets();
    list = [h].concat(list.filter((x) => x.toLowerCase() !== h.toLowerCase()));
    list = list.slice(0, 12);
    GM_setValue(ACCENT_PRESETS_KEY, JSON.stringify(list));
    return list;
  }

  function isThemeFollowSystem() {
    try { return !!GM_getValue(THEME_FOLLOW_KEY, false); } catch (_) { return false; }
  }

  function setThemeFollowSystem(on) {
    GM_setValue(THEME_FOLLOW_KEY, !!on);
    return !!on;
  }

  function isCleanDefault() {
    try { return !!GM_getValue(CLEAN_DEFAULT_KEY, false); } catch (_) { return false; }
  }
  function setCleanDefault(on) {
    GM_setValue(CLEAN_DEFAULT_KEY, !!on);
    return !!on;
  }
  /** 清爽模式成绩分析展示方式：tab（选项卡）| direct（直接显示） */
  function isCleanAnalysisDirect() {
    try { return GM_getValue(CLEAN_ANALYSIS_KEY, 'tab') === 'direct'; } catch (_) { return false; }
  }
  function setCleanAnalysis(mode) {
    GM_setValue(CLEAN_ANALYSIS_KEY, mode === 'direct' ? 'direct' : 'tab');
    return mode === 'direct' ? 'direct' : 'tab';
  }
  /** 类Apple 卡片淡边线：默认开 */
  function isAppleEdgeLine() {
    try {
      const v = GM_getValue(APPLE_EDGE_KEY, true);
      return v !== false && v !== 0 && v !== '0';
    } catch (_) { return true; }
  }
  function setAppleEdgeLine(on) {
    GM_setValue(APPLE_EDGE_KEY, !!on);
    return !!on;
  }
  function isAutoUpdateCheck() {
    try { return !!GM_getValue(AUTO_UPDATE_KEY, false); } catch (_) { return false; }
  }
  function setAutoUpdateCheck(on) {
    GM_setValue(AUTO_UPDATE_KEY, !!on);
    return !!on;
  }
  function isGlobalPreload() { try { return !!GM_getValue(PRELOAD_KEY, false); } catch (_) { return false; } }
  function setGlobalPreload(on) { GM_setValue(PRELOAD_KEY, !!on); return !!on; }

  function readJsonSetting(key, fallback) {
    try {
      const raw = GM_getValue(key, '');
      if (raw && typeof raw === 'object') return raw;
      if (typeof raw === 'string' && raw.trim()) return JSON.parse(raw);
    } catch (_) {}
    return fallback;
  }

  function writeJsonSetting(key, value) {
    GM_setValue(key, JSON.stringify(value));
    return value;
  }

  function getPrivacySettings() {
    return normalizePrivacySettings(readJsonSetting(PRIVACY_SETTINGS_KEY, null));
  }

  function setPrivacySettings(value) {
    return writeJsonSetting(PRIVACY_SETTINGS_KEY, normalizePrivacySettings(value));
  }

  function getCustomIdentity() {
    return normalizeCustomIdentity(readJsonSetting(CUSTOM_IDENTITY_KEY, null));
  }

  function setCustomIdentity(value) {
    return writeJsonSetting(CUSTOM_IDENTITY_KEY, normalizeCustomIdentity(value));
  }

  function getScheduleFirstMondayMap() {
    const raw = readJsonSetting(SCHEDULE_FIRST_MONDAY_KEY, {});
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  }

  function rememberScheduleFirstMonday(planCode, isoDate) {
    if (!planCode || !/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate || ''))) return;
    const map = getScheduleFirstMondayMap();
    map[String(planCode)] = String(isoDate);
    writeJsonSetting(SCHEDULE_FIRST_MONDAY_KEY, map);
  }

  function getScheduleJsonFormatSettings() {
    let stored = '';
    try { stored = GM_getValue(SCHEDULE_JSON_FORMAT_KEY, ''); } catch (_) {}
    const hasStored = !!(stored && (typeof stored !== 'string' || stored.trim()));
    const raw = readJsonSetting(SCHEDULE_JSON_FORMAT_KEY, null);
    try {
      if (hasStored && (!raw || typeof raw !== 'object' || Array.isArray(raw))) throw new Error('配置不是 JSON 对象');
      const input = raw && typeof raw === 'object' ? raw : {};
      const settings = { enabled: !!input.enabled, mapping: validateScheduleJsonMapping(input.mapping || DEFAULT_SCHEDULE_JSON_MAPPING) };
      scheduleJsonFormatRecoveryMessage = '';
      return settings;
    } catch (_) {
      scheduleJsonFormatRecoveryMessage = hasStored ? 'JSON 映射配置损坏，已回退小爱课程兼容格式' : '';
      return { enabled: false, mapping: validateScheduleJsonMapping(DEFAULT_SCHEDULE_JSON_MAPPING) };
    }
  }

  function setScheduleJsonFormatSettings(value) {
    const input = value && typeof value === 'object' ? value : {};
    const normalized = { enabled: !!input.enabled, mapping: validateScheduleJsonMapping(input.mapping || DEFAULT_SCHEDULE_JSON_MAPPING) };
    scheduleJsonFormatRecoveryMessage = '';
    return writeJsonSetting(SCHEDULE_JSON_FORMAT_KEY, normalized);
  }

  // 清爽模式自动进入仅首页；其它业务页不自动弹出
  function isHomePage() {
    try {
      const p = String(location.pathname || '').replace(/\/+$/, '') || '/';
      return p === '/' || p === '/index' || /\/index\.html?$/i.test(p);
    } catch (_) {
      return false;
    }
  }

  function isFollowUseDynamic() {
    try { return !!GM_getValue(FOLLOW_DYNAMIC_KEY, false); } catch (_) { return false; }
  }

  function setFollowUseDynamic(on) {
    GM_setValue(FOLLOW_DYNAMIC_KEY, !!on);
    return !!on;
  }

  function systemPrefersDark() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (_) {
      return false;
    }
  }

  // 跟随系统时的实际主题：仅在当前风格支持对应模式时启用。
  function resolveFollowThemeName() {
    if (systemPrefersDark() && skinSupportsDark()) return 'dark';
    if (isFollowUseDynamic() && skinSupportsDynamic()) return 'scu-red';
    return 'default';
  }

  function isThemeModeAvailable(name, skinId) {
    if (name === 'dark') return skinSupportsDark(skinId);
    if (name === 'scu-red') return skinSupportsDynamic(skinId);
    return name === 'default';
  }

  function applyTheme(name, opts) {
    opts = opts || {};
    if (!skinSupportsDark() && isThemeFollowSystem()) setThemeFollowSystem(false);
    if (!skinSupportsDynamic() && isFollowUseDynamic()) setFollowUseDynamic(false);
    // manual: 用户点击主题模式 → 关闭跟随并应用所选
    // system: 跟随系统刷新
    if (opts.manual) setThemeFollowSystem(false);
    let finalName;
    if (opts.system || (isThemeFollowSystem() && !opts.manual)) {
      finalName = resolveFollowThemeName();
    } else {
      finalName = THEMES[name] ? name : (getCurrent() || 'default');
      if (!THEMES[finalName]) finalName = 'default';
    }
    if (!isThemeModeAvailable(finalName)) finalName = 'default';
    const t = THEMES[finalName] || THEMES['default'];
    if (!opts.skipPersist) GM_setValue(THEME_KEY, finalName);
    clearInlinePrimaryOverrides();
    const el = document.getElementById('urppp-theme-vars') || (() => {
      const e = document.createElement('style'); e.id = 'urppp-theme-vars';
      const host = document.head || document.documentElement;
      host.appendChild(e); return e;
    })();

    const acc = getAccent();
    let vars = Object.assign({}, t.vars);
    // 只有动态配色 (scu-red) 吃 seed + scheme 算法
    if (finalName === 'scu-red') {
      const color = acc || DEFAULT_SEED;
      const scheme = getScheme();
      vars = Object.assign(vars, buildMaterialSchemeVars(color, scheme));
      const primary = vars['--primary'] || color;
      const hover = vars['--primary-hover'] || darken(primary, 0.12);
      document.documentElement.style.setProperty('--urppp-accent', primary);
      document.documentElement.style.setProperty('--urppp-accent-hover', hover);
      document.documentElement.style.setProperty('--urppp-accent-ring', vars['--ring'] || alpha(primary, 0.15));
      document.documentElement.style.setProperty('--urppp-seed', color);
      document.documentElement.style.setProperty('--urppp-scheme', scheme);
    } else if (finalName === 'default') {
      document.documentElement.style.setProperty('--urppp-accent', '#0071E3');
      document.documentElement.style.setProperty('--urppp-accent-hover', '#0077ED');
      document.documentElement.style.setProperty('--urppp-accent-ring', 'rgba(0,113,227,0.28)');
      document.documentElement.style.removeProperty('--urppp-seed');
      document.documentElement.style.removeProperty('--urppp-scheme');
    } else {
      document.documentElement.style.removeProperty('--urppp-accent');
      document.documentElement.style.removeProperty('--urppp-accent-hover');
      document.documentElement.style.removeProperty('--urppp-accent-ring');
      document.documentElement.style.removeProperty('--urppp-seed');
      document.documentElement.style.removeProperty('--urppp-scheme');
    }

    let css = ':root {';
    for (const [k, v] of Object.entries(vars)) css += `${k}:${v};`;
    css += '}';
    el.textContent = css;
    if (document.body) document.body.style.fontFamily = t.font;
    try {
      const root = document.documentElement;
      root.dataset.urpppTheme = finalName;
      root.classList.remove('urppp-theme-default', 'urppp-theme-dark', 'urppp-theme-scu-red');
      root.classList.add('urppp-theme-' + finalName);
      root.classList.toggle('urppp-theme-follow', isThemeFollowSystem());
      if (document.body) {
        document.body.dataset.urpppTheme = finalName;
        document.body.classList.toggle('urppp-dark', finalName === 'dark');
        document.body.classList.toggle('urppp-theme-follow', isThemeFollowSystem());
      }
    } catch (_) {}
    try { applySkinAttr(); } catch (_) {}
    try { syncNavbarThemeUI(); } catch (_) {}
    try { syncSettingsPanelUI(); } catch (_) {}
    try { scrubNoticeInlineBg(); } catch (_) {}
    try { scrubTableHeaderInlineBg(); } catch (_) {}
    const boot = document.getElementById('urppp-boot-loader');
    if (boot) boot.style.fontFamily = t.font;
  }

  function getCurrent() { return GM_getValue(THEME_KEY, 'default'); }

  // 主题是否已下载（商店下载后存在 css 缓存即视为已装）
  function themeDownloaded(id) {
    try { return !!GM_getValue('urppp_theme_css_' + id, ''); } catch (_) { return false; }
  }

  // 本地主题（开发者调试 / 本地导入）：存于 GM，可加入主题管理/选择并应用
  function localThemes() {
    try {
      const raw = GM_getValue('urppp_local_themes', '');
      return raw ? (JSON.parse(raw) || {}) : {};
    } catch (_) { return {}; }
  }
  function saveLocalTheme(id, meta) {
    try {
      const all = localThemes();
      all[id] = meta;
      GM_setValue('urppp_local_themes', JSON.stringify(all));
    } catch (_) {}
  }
  function removeLocalTheme(id) {
    try {
      const all = localThemes();
      delete all[id];
      GM_setValue('urppp_local_themes', JSON.stringify(all));
    } catch (_) {}
  }
  // 迁移：扫描所有已下载主题（urppp_theme_css_<id> 存在），对不在 SKIN_CATALOG 且无 meta 的补登记，
  // 否则旧版下载的主题（只写 css 未登记 meta）在主题管理/皮肤选择里会消失、卡无样式
  function migrateDownloadedThemes() {
    try {
      if (typeof GM_listValues !== 'function') return;
      const locals = localThemes();
      let changed = false;
      GM_listValues().forEach((key) => {
        const m = /^urppp_theme_css_(.+)$/.exec(key);
        if (!m) return;
        const id = m[1];
        // 只有 css 非空才算已下载（删除只是清成空串，键仍在——空串不能触发补登记）
        let css = ''; try { css = GM_getValue(key, '') || ''; } catch (_) {}
        if (!css) return;
        if (SKIN_CATALOG.some((s) => s.id === id) || locals[id]) return;
        locals[id] = { name: id, desc: '下载主题', author: '', version: '1.0.0' };
        changed = true;
      });
      if (changed) GM_setValue('urppp_local_themes', JSON.stringify(locals));
    } catch (_) {}
  }

  // 下载主题 CSS 存储（带 id 的 style，便于刷新重注入 / 删除清理）
  function storeThemeStyleEl(id) {
    let el = document.getElementById('urppp-store-theme-' + id);
    if (!el) {
      el = document.createElement('style');
      el.id = 'urppp-store-theme-' + id;
      el.dataset.urpppStoreTheme = id;
      (document.head || document.documentElement).appendChild(el);
    }
    return el;
  }

  function removeStoreThemeStyle(id) {
    const el = document.getElementById('urppp-store-theme-' + id);
    if (el) el.remove();
  }

  // 初始注入所有已下载主题的 CSS（刷新后仍生效，否则独立主题会丢大半）
  function injectAllStoreThemeStyles() {
    migrateDownloadedThemes();
    const seen = new Set();
    const injectOne = (id) => {
      if (seen.has(id)) return; seen.add(id);
      let css = '';
      try { css = GM_getValue('urppp_theme_css_' + id, '') || ''; } catch (_) {}
      if (css) storeThemeStyleEl(id).textContent = css;
      // 初始化即注入本地缓存的 cardCss（下载主题时缓存），皮肤卡/商店立即有卡样式，不依赖线上拉取
      let cc = '';
      try { cc = GM_getValue('urppp_card_css_' + id, '') || ''; } catch (_) {}
      if (cc) ensureStoreCardStyles([{ id, cardCss: cc }]);
    };
    SKIN_CATALOG.forEach((s) => injectOne(s.id));
    // 本地导入 / 下载的自定义主题（不在 SKIN_CATALOG）也要注入，否则刷新后丢失
    Object.keys(localThemes()).forEach((id) => injectOne(id));
    try { applySkinAttr(); } catch (_) {}
  }

  function getSkin() {
    const id = GM_getValue(SKIN_KEY, 'apple');
    const hit = SKIN_CATALOG.find((s) => s.id === id);
    const ok = hit && hit.ready && (hit.installed !== false || themeDownloaded(hit.id));
    if (ok) return id;
    // 本地主题（开发者调试）也可作为当前皮肤
    if (localThemes()[id] && themeDownloaded(id)) return id;
    return 'apple';
  }
  function getSkinCapability(skinId, key) {
    const id = skinId || getSkin();
    const hit = SKIN_CATALOG.find((s) => s.id === id);
    return !!(hit && hit[key]);
  }
  function skinSupportsDark(skinId) {
    return getSkinCapability(skinId, 'dark');
  }
  function skinSupportsDynamic(skinId) {
    return getSkinCapability(skinId, 'dynamic');
  }
  function skinSupportsFixedPalettes(skinId) {
    return getSkinCapability(skinId, 'palettes');
  }
  function getBrutalPaletteById(id) {
    return BRUTAL_PALETTES.find((item) => item.id === id) || BRUTAL_PALETTES[0];
  }
  function getBrutalSelectedPalette() {
    const raw = String(GM_getValue(BRUTAL_PALETTE_KEY, 'acid') || 'acid');
    const palette = getBrutalPaletteById(raw);
    return palette.id === BRUTAL_DEFAULT_PALETTE ? getBrutalPaletteById('acid') : palette;
  }
  function getBrutalActivePalette() {
    const raw = String(GM_getValue(BRUTAL_ACTIVE_PALETTE_KEY, BRUTAL_DEFAULT_PALETTE) || BRUTAL_DEFAULT_PALETTE);
    return getBrutalPaletteById(raw);
  }
  function setBrutalPalette(paletteId, options) {
    const opts = options || {};
    const palette = getBrutalPaletteById(paletteId);
    if (opts.select && palette.id !== BRUTAL_DEFAULT_PALETTE) GM_setValue(BRUTAL_PALETTE_KEY, palette.id);
    GM_setValue(BRUTAL_ACTIVE_PALETTE_KEY, palette.id);
    try { applySkinAttr(); } catch (_) {}
    try { syncNavbarThemeUI(); } catch (_) {}
    try { syncSettingsPanelUI(); } catch (_) {}
    try {
      const clean = document.getElementById('urppp-clean-root');
      if (clean && typeof clean.__syncCleanThemeDots === 'function') clean.__syncCleanThemeDots();
    } catch (_) {}
  }

  /** 界面风格对形状/边框/阴影等 token 的覆盖（不改配色主题本身） */
  function getSkinShapeOverrides(skinId) {
    const id = skinId || getSkin();
    if (id === 'flat') {
      return {
        '--radius': '0px',
        '--radius-sm': '0px',
        '--shadow': 'none',
        '--border-w': '2px',
        '--urppp-card-border': '2px solid var(--text)',
        '--urppp-input-border': '2px solid var(--text)',
        '--urppp-action-radius': '0px',
        '--urppp-action-border': '2px solid var(--text)',
        '--urppp-action-shadow': 'none',
        '--urppp-action-bg': 'var(--surface)',
        '--urppp-action-color': 'var(--text)',
        '--urppp-menu-radius': '0px',
        '--urppp-menu-border': '2px solid var(--text)',
        '--urppp-menu-shadow': 'none',
        '--urppp-menu-bg': 'var(--surface)',
        '--urppp-menu-color': 'var(--text)',
      };
    }
    if (id === 'organic') {
      return {
        '--radius': '22px',
        '--radius-sm': '14px',
        '--shadow': '0 2px 10px rgba(92,64,51,0.06)',
        '--border-w': '1px',
        '--urppp-card-border': '1px solid #E7E0D6',
        '--urppp-input-border': '1px solid var(--border)',
        '--urppp-action-radius': '999px',
        '--urppp-action-border': '1px solid var(--border)',
        '--urppp-action-shadow': 'none',
        '--urppp-action-bg': 'var(--input-bg)',
        '--urppp-action-color': 'var(--primary)',
        '--urppp-menu-radius': '14px',
        '--urppp-menu-border': '1px solid var(--border)',
        '--urppp-menu-shadow': 'none',
        '--urppp-menu-bg': 'var(--input-bg)',
        '--urppp-menu-color': 'var(--text)',
      };
    }
    if (id === 'editorial') {
      return {
        '--radius': '0px',
        '--radius-sm': '0px',
        '--shadow': 'none',
        '--border-w': '0px',
        '--urppp-card-border': 'none',
        '--urppp-input-border': 'none',
        '--urppp-action-radius': '0px',
        '--urppp-action-border': 'none',
        '--urppp-action-shadow': 'none',
        '--urppp-action-bg': 'transparent',
        '--urppp-action-color': 'var(--text)',
        '--urppp-menu-radius': '0px',
        '--urppp-menu-border': '1px solid var(--text)',
        '--urppp-menu-shadow': 'none',
        '--urppp-menu-bg': 'transparent',
        '--urppp-menu-color': 'var(--text)',
      };
    }
    if (id === 'brutal') {
      return {
        '--radius': '0px',
        '--radius-sm': '0px',
        '--shadow': '6px 6px 0 #000',
        '--border-w': '3px',
        '--urppp-card-border': '3px solid #000',
        '--urppp-input-border': '2px solid #000',
        '--urppp-action-radius': '0px',
        '--urppp-action-border': '2px solid var(--text)',
        '--urppp-action-shadow': '3px 3px 0 var(--text)',
        '--urppp-action-bg': 'var(--surface)',
        '--urppp-action-color': 'var(--text)',
        '--urppp-menu-radius': '0px',
        '--urppp-menu-border': '2px solid var(--text)',
        '--urppp-menu-shadow': '3px 3px 0 var(--text)',
        '--urppp-menu-bg': 'var(--surface)',
        '--urppp-menu-color': 'var(--text)',
      };
    }
    if (id === 'neu') {
      return {
        '--radius': '16px',
        '--radius-sm': '12px',
        '--shadow': '5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC',
        '--border-w': '0px',
        '--urppp-card-border': 'none',
        '--urppp-input-border': '1px solid rgba(38,49,66,.16)',
        '--urppp-input-shadow': 'inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)',
        '--urppp-action-radius': '12px',
        '--urppp-action-border': 'none',
        '--urppp-action-shadow': 'var(--shadow)',
        '--urppp-action-bg': 'var(--bg)',
        '--urppp-action-color': 'var(--text)',
        '--urppp-menu-radius': '12px',
        '--urppp-menu-border': 'none',
        '--urppp-menu-shadow': 'var(--shadow)',
        '--urppp-menu-bg': 'var(--bg)',
        '--urppp-menu-color': 'var(--text)',
      };
    }
    // apple / default：胶囊主按钮，菜单按钮为轻灰圆角面板
    return {
      '--radius': '18px',
      '--radius-sm': '12px',
      '--shadow': '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
      '--border-w': '0px',
      '--urppp-card-border': id === 'apple' && isAppleEdgeLine() ? '1px solid rgba(0,0,0,0.08)' : 'none',
      '--urppp-input-border': '1px solid var(--border)',
      '--urppp-action-radius': '999px',
      '--urppp-action-border': 'none',
      '--urppp-action-shadow': '0 2px 6px var(--ring)',
      '--urppp-action-bg': 'var(--primary)',
      '--urppp-action-color': 'var(--surface)',
      '--urppp-menu-radius': '12px',
      '--urppp-menu-border': id === 'apple' && isAppleEdgeLine() ? '1px solid var(--border)' : 'none',
      '--urppp-menu-shadow': '0 1px 3px rgba(0,0,0,.08)',
      '--urppp-menu-bg': 'var(--input-bg)',
      '--urppp-menu-color': 'var(--text)',
    };
  }


  function urpppCardBorderValue() {
    // 类Apple：可选淡边线；极简扁平：硬边；其它默认浅边
    try {
      const skin = getSkin();
      if (skin === 'apple') {
        return isAppleEdgeLine()
          ? '1px solid rgba(0,0,0,0.08)'
          : 'none';
      }
      if (skin === 'flat') return '2px solid var(--text)';
      if (skin === 'organic') return '1px solid #E7E0D6';
      if (skin === 'brutal') return '3px solid var(--text)';
      if (skin === 'editorial' || skin === 'neu') return 'none';
    } catch (_) {}
    return '1px solid var(--border)';
  }

  function applySkinAttr() {
    const id = getSkin();
    try { document.documentElement.setAttribute('data-urppp-skin', id); } catch (_) {}
    try {
      if (document.body) document.body.setAttribute('data-urppp-skin', id);
    } catch (_) {}
    try {
      const edgeOn = id === 'apple' && isAppleEdgeLine();
      document.documentElement.setAttribute('data-urppp-apple-edge', edgeOn ? '1' : '0');
      if (document.body) document.body.setAttribute('data-urppp-apple-edge', edgeOn ? '1' : '0');
    } catch (_) {}
    try {
      const el = document.getElementById('urppp-skin-vars') || (() => {
        const e = document.createElement('style');
        e.id = 'urppp-skin-vars';
        (document.head || document.documentElement).appendChild(e);
        return e;
      })();
      const o = getSkinShapeOverrides(id);
      let css = ':root, html[data-urppp-skin] {';
      Object.keys(o).forEach((k) => { css += k + ':' + o[k] + ';'; });
      css += '}';
      css += '.urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}';

      // 独立主题（flat/organic/brutal/neu）：皮肤由商店下载注入，主插件不内建；仅保留 brutal 调色板变量(内置接口)
      if (id === 'flat' || id === 'organic' || id === 'brutal' || id === 'neu') {
        if (id === 'brutal') {
          const pal = getBrutalActivePalette();
          css += 'html[data-urppp-skin="brutal"]{--brutal-accent:' + pal.accent + ';--brutal-secondary:' + pal.secondary + ';--brutal-info:' + pal.info + ';--brutal-warning:' + pal.warning + ';}';
        }
        el.textContent = css;
        return;
      }

      if (id === 'apple') {
        const edge = isAppleEdgeLine();
        const cardBorder = edge
          ? '1px solid rgba(0,0,0,0.08)'
          : 'none';
        const cardBorderDark = edge
          ? '1px solid rgba(255,255,255,0.10)'
          : 'none';
        const softBorder = edge
          ? '1px solid rgba(0,0,0,0.06)'
          : 'none';
        css += [
          'html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:' + (edge ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)') + ';}',
          'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:' + (edge ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)') + ';}',
          'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:' + cardBorder + '!important;box-shadow:var(--shadow)!important;}',
          'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:' + cardBorderDark + '!important;}',
          'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:' + cardBorder + '!important;box-shadow:var(--shadow)!important;}',
          'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}',
          'html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}',
          'html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}',
          'html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}',
          'html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}',
          'html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}',
          'html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:' + (edge ? 'rgba(0,0,0,0.06)' : 'transparent') + '!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}',
          'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:' + softBorder + '!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}',
          'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}',
          'html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}',
          'html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'
        ].join('');
      }
            else if (id === 'editorial') {
        css += `
          html[data-urppp-skin="editorial"]{
            --radius:0px!important;--radius-sm:0px!important;--shadow:none!important;
            --bg:#F9F8F6!important;--surface:#F5F4F1!important;--input-bg:#EFEEEA!important;
            --text:#1C1C1C!important;--text-secondary:#56534F!important;--text-muted:#73706A!important;
            --border:rgba(28,28,28,.08)!important;--border-focus:rgba(28,28,28,.35)!important;
            --primary:#1C1C1C!important;--primary-hover:#000!important;--primary-foreground:var(--bg)!important;--ring:rgba(28,28,28,.12)!important;
            --success:#4A7C5F!important;--info:#5A7A8F!important;--warning:#B8924B!important;--danger:#A05E5C!important;
            --editorial-line:rgba(28,28,28,.08);--editorial-line-strong:rgba(28,28,28,.15);
            --editorial-hover-soft:rgba(28,28,28,.025);--editorial-hover:rgba(28,28,28,.035);
            --editorial-active:rgba(28,28,28,.055);--editorial-overlay:rgba(28,28,28,.30);
            --editorial-on-status:#FFF;--editorial-on-warning:#1C1C1C;--editorial-warning-text:#735D32;
            --editorial-alert-success-bg:rgba(74,124,95,.08);--editorial-alert-info-bg:rgba(90,122,143,.08);
            --editorial-alert-warning-bg:rgba(184,146,75,.10);--editorial-alert-danger-bg:rgba(160,94,92,.08);
            --editorial-pass-bg:#E5ECE6;--editorial-pass-text:#3F644D;
            --editorial-fail-bg:#F1E5E3;--editorial-fail-text:#8A4E4C;
            --editorial-info-bg:#E4EAED;--editorial-info-text:#506A78;
            --editorial-warn-bg:#EFE8D8;--editorial-warn-text:#735D32;
            --editorial-slot-course-bg:#DDE8E7;--editorial-slot-course-border:#A8C0BC;--editorial-slot-course-text:#31534F;
            --editorial-slot-exam-bg:#EADDE5;--editorial-slot-exam-border:#C7AAB9;--editorial-slot-exam-text:#684352;
            --editorial-slot-lab-bg:#EEE9D6;--editorial-slot-lab-border:#CFC59C;--editorial-slot-lab-text:#675F35;
            --editorial-slot-borrow-bg:#DDE9DF;--editorial-slot-borrow-border:#AFC5B3;--editorial-slot-borrow-text:#355D3C;
            --editorial-paper:#F9F8F6;--editorial-display:Georgia,"Noto Serif SC","Songti SC",STSong,SimSun,"Times New Roman",serif;
            --editorial-body:"Microsoft YaHei UI","PingFang SC","Segoe UI",Arial,sans-serif;color-scheme:light!important;
          }
          html.urppp-theme-dark[data-urppp-skin="editorial"],
          html[data-urppp-skin="editorial"].urppp-theme-dark,
          body.urppp-dark[data-urppp-skin="editorial"]{
            --bg:#11110F!important;--surface:#181714!important;--input-bg:#201F1B!important;
            --text:#F3F0EA!important;--text-secondary:#C4BFB6!important;--text-muted:#A39D93!important;
            --border:rgba(243,240,234,.08)!important;--border-focus:rgba(243,240,234,.38)!important;
            --primary:#F3F0EA!important;--primary-hover:#FFF!important;--primary-foreground:var(--bg)!important;--ring:rgba(243,240,234,.14)!important;
            --success:#8FB19A!important;--info:#91AAB9!important;--warning:#C8A76C!important;--danger:#C9908D!important;
            --editorial-line:rgba(243,240,234,.08);--editorial-line-strong:rgba(243,240,234,.14);
            --editorial-hover-soft:rgba(243,240,234,.035);--editorial-hover:rgba(243,240,234,.05);
            --editorial-active:rgba(243,240,234,.075);--editorial-overlay:rgba(0,0,0,.66);
            --editorial-on-status:#11110F;--editorial-on-warning:#11110F;--editorial-warning-text:#D6BD89;
            --editorial-alert-success-bg:rgba(143,177,154,.13);--editorial-alert-info-bg:rgba(145,170,185,.13);
            --editorial-alert-warning-bg:rgba(200,167,108,.14);--editorial-alert-danger-bg:rgba(201,144,141,.13);
            --editorial-pass-bg:#1F2A22;--editorial-pass-text:#A3C5AD;
            --editorial-fail-bg:#2C2120;--editorial-fail-text:#D9A39F;
            --editorial-info-bg:#1E282D;--editorial-info-text:#A9BFCA;
            --editorial-warn-bg:#2B271D;--editorial-warn-text:#D4BD88;
            --editorial-slot-course-bg:#24302F;--editorial-slot-course-border:#526A67;--editorial-slot-course-text:#B8CFCC;
            --editorial-slot-exam-bg:#30262D;--editorial-slot-exam-border:#745C69;--editorial-slot-exam-text:#D8BEC9;
            --editorial-slot-lab-bg:#302D22;--editorial-slot-lab-border:#736D50;--editorial-slot-lab-text:#D8D0A7;
            --editorial-slot-borrow-bg:#243028;--editorial-slot-borrow-border:#576D5D;--editorial-slot-borrow-text:#BDD1C2;
            --editorial-paper:#181714;color-scheme:dark!important;
          }
          html[data-urppp-skin="editorial"] ::selection{
            background:var(--text)!important;color:var(--bg)!important;
          }
          html[data-urppp-skin="editorial"] body,
          html[data-urppp-skin="editorial"] .main-container,
          html[data-urppp-skin="editorial"] .main-content,
          html[data-urppp-skin="editorial"] .main-content-inner,
          html[data-urppp-skin="editorial"] .page-content,
          html[data-urppp-skin="editorial"] #page-content-template,
          html[data-urppp-skin="editorial"] #urppp-clean-root{
            background:var(--bg)!important;background-image:none!important;color:var(--text)!important;
            font-family:var(--editorial-body)!important;-webkit-font-smoothing:antialiased!important;
            -moz-osx-font-smoothing:grayscale!important;
          }
          html[data-urppp-skin="editorial"] h1,
          html[data-urppp-skin="editorial"] h2,
          html[data-urppp-skin="editorial"] h3,
          html[data-urppp-skin="editorial"] h4,
          html[data-urppp-skin="editorial"] h5,
          html[data-urppp-skin="editorial"] .page-header,
          html[data-urppp-skin="editorial"] .widget-title,
          html[data-urppp-skin="editorial"] .urppp-card-title,
          html[data-urppp-skin="editorial"] #urppp-root .ub h1,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-brand,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-name,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-hd,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-title,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-sec h3{
            font-family:var(--editorial-display)!important;font-weight:500!important;
            color:var(--text)!important;letter-spacing:0!important;
          }
          html[data-urppp-skin="editorial"] #navbar,
          html[data-urppp-skin="editorial"] .navbar{
            background:var(--surface)!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #sidebar,
          html[data-urppp-skin="editorial"] .sidebar{
            background:var(--surface)!important;border:0!important;border-right:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .breadcrumbs,
          html[data-urppp-skin="editorial"] #breadcrumbs{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-mask,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-mask,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-mask.open,
          html[data-urppp-skin="editorial"] #urppp-update-changelog.open{
            background:var(--editorial-overlay)!important;backdrop-filter:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uuc-panel{
            background:var(--surface)!important;color:var(--text)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uuc-head{
            background:var(--surface)!important;border-bottom:1px solid var(--editorial-line-strong)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uuc-body code{
            background:var(--input-bg)!important;border:0!important;border-bottom:1px solid var(--editorial-line-strong)!important;border-radius:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast .uut-btn,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uut-btn{
            background:transparent!important;color:var(--text)!important;border:0!important;border-bottom:1px solid transparent!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast .uut-btn:hover,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uut-btn:hover{
            border-bottom-color:currentColor!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast .uut-btn.primary,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uut-btn.primary{
            background:var(--text)!important;color:var(--bg)!important;border:1px solid var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .page-content p a,
          html[data-urppp-skin="editorial"] .page-content td a,
          html[data-urppp-skin="editorial"] .page-content .profile-info-value a,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-course-detail a{
            color:var(--text)!important;text-decoration-line:underline!important;
            text-decoration-color:transparent!important;text-underline-offset:3px!important;
            text-decoration-thickness:1px!important;transition:text-decoration-color 180ms ease-out!important;
          }
          html[data-urppp-skin="editorial"] .page-content p a:hover,
          html[data-urppp-skin="editorial"] .page-content td a:hover,
          html[data-urppp-skin="editorial"] .page-content .profile-info-value a:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-course-detail a:hover{
            text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] .widget-box,
          html[data-urppp-skin="editorial"] .widget-box.transparent,
          html[data-urppp-skin="editorial"] .panel,
          html[data-urppp-skin="editorial"] .panel-default,
          html[data-urppp-skin="editorial"] .well,
          html[data-urppp-skin="editorial"] .thumbnail,
          html[data-urppp-skin="editorial"] .infobox,
          html[data-urppp-skin="editorial"] .profile-user-info,
          html[data-urppp-skin="editorial"] .profile-user-info-striped,
          html[data-urppp-skin="editorial"] fieldset,
          html[data-urppp-skin="editorial"] .urppp-card,
          html[data-urppp-skin="editorial"] .urppp-stat-card,
          html[data-urppp-skin="editorial"] .urppp-db-card,
          html[data-urppp-skin="editorial"] .urppp-db-panel,
          html[data-urppp-skin="editorial"] #urppp-dashboard .widget-box{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] body .page-content .widget-box,
          html[data-urppp-skin="editorial"] body #page-content-template .widget-box,
          html[data-urppp-skin="editorial"] body .page-content .profile-user-info.setLabelWidth,
          html[data-urppp-skin="editorial"] body .page-content .profile-user-info-striped.setLabelWidth,
          html[data-urppp-skin="editorial"] #urppp-dashboard .urppp-card,
          html[data-urppp-skin="editorial"] #urppp-left .urppp-card{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .profile-info-row{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] .profile-info-name,
          html[data-urppp-skin="editorial"] .profile-info-value{
            background:transparent!important;color:var(--text)!important;border:0!important;
          }
          html[data-urppp-skin="editorial"] .modal-content,
          html[data-urppp-skin="editorial"] #urppp-settings-panel,
          html[data-urppp-skin="editorial"] #urppp-root .uc{
            background:var(--surface)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .dropdown-menu,
          html[data-urppp-skin="editorial"] .popover,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-drop{
            background:var(--surface)!important;color:var(--text)!important;border:0!important;
            border-top:1px solid var(--editorial-line)!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #drag-ul>li.ui-selecting,
          html[data-urppp-skin="editorial"] #drag-ul>li.ui-selected,
          html[data-urppp-skin="editorial"] #drag-ul>li.urppp-building-active,
          html[data-urppp-skin="editorial"] #drag-ol>li.ui-selecting,
          html[data-urppp-skin="editorial"] #drag-ol>li.ui-selected,
          html[data-urppp-skin="editorial"] #drag-ol>li.current-week,
          html[data-urppp-skin="editorial"] #test-drag>li.ui-selecting,
          html[data-urppp-skin="editorial"] #test-drag>li.ui-selected,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.highlighted,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.result-selected,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.highlighted em,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.result-selected em{
            background:var(--text)!important;color:var(--bg)!important;border-color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .dropdown-menu>li>a:hover,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li{
            background:var(--surface)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.highlighted{
            background:var(--input-bg)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .alert{
            border:0!important;border-left:2px solid currentColor!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .alert-success{background:var(--editorial-alert-success-bg)!important;color:var(--success)!important;}
          html[data-urppp-skin="editorial"] .alert-info{background:var(--editorial-alert-info-bg)!important;color:var(--info)!important;}
          html[data-urppp-skin="editorial"] .alert-warning{background:var(--editorial-alert-warning-bg)!important;color:var(--editorial-warning-text)!important;}
          html[data-urppp-skin="editorial"] .alert-danger{background:var(--editorial-alert-danger-bg)!important;color:var(--danger)!important;}
          html[data-urppp-skin="editorial"] .label,
          html[data-urppp-skin="editorial"] .badge{
            background:var(--text)!important;color:var(--bg)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .label-success,
          html[data-urppp-skin="editorial"] .badge-success{background:var(--success)!important;color:var(--editorial-on-status)!important;}
          html[data-urppp-skin="editorial"] .label-info,
          html[data-urppp-skin="editorial"] .badge-info{background:var(--info)!important;color:var(--editorial-on-status)!important;}
          html[data-urppp-skin="editorial"] .label-warning,
          html[data-urppp-skin="editorial"] .badge-warning{background:var(--warning)!important;color:var(--editorial-on-warning)!important;}
          html[data-urppp-skin="editorial"] .label-danger,
          html[data-urppp-skin="editorial"] .badge-danger{background:var(--danger)!important;color:var(--editorial-on-status)!important;}
          html[data-urppp-skin="editorial"] .page-header,
          html[data-urppp-skin="editorial"] .page-header h1{
            font-size:24px!important;line-height:1.25!important;
          }
          html[data-urppp-skin="editorial"] .widget-title,
          html[data-urppp-skin="editorial"] .urppp-card-title,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd{
            font-size:18px!important;line-height:1.3!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-title{
            font-size:24px!important;line-height:1.2!important;
          }
          html[data-urppp-skin="editorial"] .widget-header,
          html[data-urppp-skin="editorial"] .page-content .widget-box .widget-header,
          html[data-urppp-skin="editorial"] .panel-heading,
          html[data-urppp-skin="editorial"] .urppp-card-header,
          html[data-urppp-skin="editorial"] .modal-header{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .btn,
          html[data-urppp-skin="editorial"] a.btn,
          html[data-urppp-skin="editorial"] button.btn,
          html[data-urppp-skin="editorial"] .btn-default,
          html[data-urppp-skin="editorial"] .btn.btn-default,
          html[data-urppp-skin="editorial"] button.btn.btn-default,
          html[data-urppp-skin="editorial"] a.btn.btn-default,
          html[data-urppp-skin="editorial"] .btn-white,
          html[data-urppp-skin="editorial"] .btn.btn-white,
          html[data-urppp-skin="editorial"] button.btn.btn-white,
          html[data-urppp-skin="editorial"] a.btn.btn-white,
          html[data-urppp-skin="editorial"] #urppp-nav-clean,#urppp-nav-cal,
          html[data-urppp-skin="editorial"] #urppp-root .ut button,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar button,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd-tabs .uc-sa-tab,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab{
            border:0!important;border-radius:0!important;background:transparent!important;color:var(--text)!important;
            box-shadow:none!important;transform:none!important;text-decoration-line:underline!important;
            text-decoration-color:transparent!important;text-underline-offset:3px!important;text-decoration-thickness:1px!important;
            transition:color 180ms ease-out,text-decoration-color 180ms ease-out,opacity 120ms ease-out!important;
          }
          html[data-urppp-skin="editorial"] .btn:hover,
          html[data-urppp-skin="editorial"] a.btn:hover,
          html[data-urppp-skin="editorial"] button.btn:hover,
          html[data-urppp-skin="editorial"] .btn-default:hover,
          html[data-urppp-skin="editorial"] .btn.btn-default:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-default:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-default:hover,
          html[data-urppp-skin="editorial"] .btn-white:hover,
          html[data-urppp-skin="editorial"] .btn.btn-white:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-white:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-white:hover,
          html[data-urppp-skin="editorial"] #urppp-nav-clean:hover,#urppp-nav-cal:hover,
          html[data-urppp-skin="editorial"] #urppp-root .ut button:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn:hover{
            background:transparent!important;color:var(--primary-hover)!important;text-decoration-color:currentColor!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] .btn:active,
          html[data-urppp-skin="editorial"] a.btn:active,
          html[data-urppp-skin="editorial"] button.btn:active,
          html[data-urppp-skin="editorial"] #urppp-nav-clean:active,#urppp-nav-cal:active,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn:active{
            opacity:.65!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] .btn.btn-primary,
          html[data-urppp-skin="editorial"] button.btn.btn-primary,
          html[data-urppp-skin="editorial"] a.btn.btn-primary,
          html[data-urppp-skin="editorial"] .btn.btn-info,
          html[data-urppp-skin="editorial"] button.btn.btn-info,
          html[data-urppp-skin="editorial"] a.btn.btn-info,
          html[data-urppp-skin="editorial"] #urppp-root .ubtn,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn.primary,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn:not(.ghost){
            background:var(--text)!important;color:var(--surface)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;text-decoration:none!important;
          }
          html[data-urppp-skin="editorial"] .btn.btn-primary:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-primary:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-primary:hover,
          html[data-urppp-skin="editorial"] .btn.btn-info:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-info:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-info:hover,
          html[data-urppp-skin="editorial"] #urppp-root .ubtn:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn.primary:hover,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn:not(.ghost):hover{
            background:var(--primary-hover)!important;color:var(--bg)!important;border:0!important;box-shadow:none!important;
            transform:none!important;text-decoration:none!important;opacity:1!important;
          }
          html[data-urppp-skin="editorial"] .btn.btn-success{background:var(--success)!important;color:var(--editorial-on-status)!important;border:0!important;text-decoration:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-warning{background:var(--warning)!important;color:var(--editorial-on-warning)!important;border:0!important;text-decoration:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-danger{background:var(--danger)!important;color:var(--editorial-on-status)!important;border:0!important;text-decoration:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-success:hover,
          html[data-urppp-skin="editorial"] .btn.btn-success:focus{background:color-mix(in srgb,var(--success) 88%,var(--bg))!important;box-shadow:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-warning:hover,
          html[data-urppp-skin="editorial"] .btn.btn-warning:focus{background:color-mix(in srgb,var(--warning) 88%,var(--bg))!important;box-shadow:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-danger:hover,
          html[data-urppp-skin="editorial"] .btn.btn-danger:focus{background:color-mix(in srgb,var(--danger) 88%,var(--bg))!important;box-shadow:none!important;}
          html[data-urppp-skin="editorial"] .btn-app,
          html[data-urppp-skin="editorial"] .btn.btn-app.btn-info,
          html[data-urppp-skin="editorial"] #urppp-dashboard .btn-app,
          html[data-urppp-skin="editorial"] #personalApplication .btn-app{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] .btn-app:hover,
          html[data-urppp-skin="editorial"] .btn.btn-app.btn-info:hover,
          html[data-urppp-skin="editorial"] #urppp-dashboard .btn-app:hover,
          html[data-urppp-skin="editorial"] #personalApplication .btn-app:hover{
            background:var(--input-bg)!important;color:var(--text)!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] input.form-control,
          html[data-urppp-skin="editorial"] select.form-control,
          html[data-urppp-skin="editorial"] textarea.form-control,
          html[data-urppp-skin="editorial"] input[type="text"],
          html[data-urppp-skin="editorial"] input[type="search"],
          html[data-urppp-skin="editorial"] input[type="number"],
          html[data-urppp-skin="editorial"] input[type="password"],
          html[data-urppp-skin="editorial"] input[type="email"],
          html[data-urppp-skin="editorial"] input[type="tel"],
          html[data-urppp-skin="editorial"] input[type="url"],
          html[data-urppp-skin="editorial"] select,
          html[data-urppp-skin="editorial"] textarea,
          html[data-urppp-skin="editorial"] #urppp-root .ui,
          html[data-urppp-skin="editorial"] .chosen-container-single .chosen-single{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] input.form-control:focus,
          html[data-urppp-skin="editorial"] input[type="text"]:focus,
          html[data-urppp-skin="editorial"] input[type="search"]:focus,
          html[data-urppp-skin="editorial"] input[type="number"]:focus,
          html[data-urppp-skin="editorial"] input[type="password"]:focus,
          html[data-urppp-skin="editorial"] input[type="email"]:focus,
          html[data-urppp-skin="editorial"] input[type="tel"]:focus,
          html[data-urppp-skin="editorial"] input[type="url"]:focus,
          html[data-urppp-skin="editorial"] select:focus,
          html[data-urppp-skin="editorial"] textarea:focus,
          html[data-urppp-skin="editorial"] .chosen-container-active .chosen-single{
            border:0!important;border-bottom:1px solid var(--border-focus)!important;outline:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-root .ut{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;padding:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-root .ut button.ac{
            background:transparent!important;color:var(--text)!important;border-bottom:1px solid var(--text)!important;
            box-shadow:none!important;text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] .urppp-table-wrap,
          html[data-urppp-skin="editorial"] .table-responsive{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .table,
          html[data-urppp-skin="editorial"] table,
          html[data-urppp-skin="editorial"] .table-bordered,
          html[data-urppp-skin="editorial"] .dataTable{
            background:transparent!important;border:0!important;border-radius:0!important;border-collapse:collapse!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .table>thead>tr>th,
          html[data-urppp-skin="editorial"] .table>tbody>tr>th,
          html[data-urppp-skin="editorial"] .table>tbody>tr>td,
          html[data-urppp-skin="editorial"] .table>tfoot>tr>th,
          html[data-urppp-skin="editorial"] .table>tfoot>tr>td,
          html[data-urppp-skin="editorial"] .table-bordered>thead>tr>th,
          html[data-urppp-skin="editorial"] .table-bordered>tbody>tr>td,
          html[data-urppp-skin="editorial"] .dataTable>thead>tr>th,
          html[data-urppp-skin="editorial"] .dataTable>tbody>tr>td{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] .table>thead>tr>th,
          html[data-urppp-skin="editorial"] .table-bordered>thead>tr>th,
          html[data-urppp-skin="editorial"] .dataTable>thead>tr>th{
            background:transparent!important;color:var(--text-secondary)!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;font-weight:500!important;font-size:13px!important;
          }
          html[data-urppp-skin="editorial"] .table-hover>tbody>tr:hover>td,
          html[data-urppp-skin="editorial"] .table>tbody>tr:hover>td,
          html[data-urppp-skin="editorial"] .dataTable>tbody>tr:hover>td{
            background:var(--editorial-hover-soft)!important;
          }
          html[data-urppp-skin="editorial"] body .table>tbody>tr>td.green_background,
          html[data-urppp-skin="editorial"] body .table-bordered>tbody>tr>td.green_background,
          html[data-urppp-skin="editorial"] body .dataTable>tbody>tr>td.green_background,
          html[data-urppp-skin="editorial"] body td.green_background{
            background:var(--editorial-pass-bg)!important;color:var(--editorial-pass-text)!important;
          }
          html[data-urppp-skin="editorial"] body .table-hover>tbody>tr:hover>td.green_background{
            background:var(--editorial-pass-bg)!important;color:var(--editorial-pass-text)!important;
          }
          html[data-urppp-skin="editorial"] body .table>tbody>tr>td.red_background,
          html[data-urppp-skin="editorial"] body .table-bordered>tbody>tr>td.red_background,
          html[data-urppp-skin="editorial"] body .dataTable>tbody>tr>td.red_background,
          html[data-urppp-skin="editorial"] body td.red_background{
            background:var(--editorial-fail-bg)!important;color:var(--editorial-fail-text)!important;
          }
          html[data-urppp-skin="editorial"] body .table-hover>tbody>tr:hover>td.red_background{
            background:var(--editorial-fail-bg)!important;color:var(--editorial-fail-text)!important;
          }
          html[data-urppp-skin="editorial"] .list-group{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .list-group-item{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .list-group-item:hover{
            background:var(--input-bg)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .list-group-item.active{
            background:var(--editorial-active)!important;color:var(--text)!important;border-color:var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] .nav-tabs{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .nav-tabs>li>a{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;
            border-bottom:1px solid transparent!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .nav-tabs>li.active>a,
          html[data-urppp-skin="editorial"] .nav-tabs>li>a:hover{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .pagination>li>a,
          html[data-urppp-skin="editorial"] .pagination>li>span{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .pagination>.active>a,
          html[data-urppp-skin="editorial"] .pagination>li>a:hover{
            background:var(--text)!important;color:var(--surface)!important;
          }
          html[data-urppp-skin="editorial"] .nav-list>li>a,
          html[data-urppp-skin="editorial"] .urppp-nav-link{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .nav-list>li.active>a,
          html[data-urppp-skin="editorial"] .nav-list>li>a:hover,
          html[data-urppp-skin="editorial"] .urppp-nav-link:hover{
            background:var(--editorial-hover)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .urppp-stat-card{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            padding-top:18px!important;padding-bottom:18px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .urppp-stat-card .label{
            background:transparent!important;color:var(--text-secondary)!important;
          }
          html[data-urppp-skin="editorial"] .urppp-stat-card:hover{
            background:var(--editorial-hover-soft)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .tabContent h3::before{
            background:transparent!important;color:var(--text-muted)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;font-family:var(--editorial-display)!important;font-size:13px!important;font-weight:500!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .tabContent h3 a,
          html[data-urppp-skin="editorial"] #urppp-dashboard #notices h3 a,
          html[data-urppp-skin="editorial"] #notices h3 a{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .tabContent h3 a:hover,
          html[data-urppp-skin="editorial"] #urppp-dashboard #notices h3 a:hover,
          html[data-urppp-skin="editorial"] #notices h3 a:hover{
            background:var(--editorial-hover-soft)!important;border-bottom-color:var(--editorial-line-strong)!important;
          }
          html[data-urppp-skin="editorial"] body table.urppp-notice-table>tbody>tr,
          html[data-urppp-skin="editorial"] body table.urppp-notice-table.table-striped>tbody>tr:nth-of-type(odd),
          html[data-urppp-skin="editorial"] body table.urppp-notice-table.table-striped>tbody>tr:nth-of-type(even),
          html[data-urppp-skin="editorial"] body .urppp-notice-card{
            background:transparent!important;background-color:transparent!important;
            border:0!important;border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] body table.urppp-notice-table>tbody>tr.urppp-notice-row:hover,
          html[data-urppp-skin="editorial"] body table.urppp-notice-table>tbody>tr.urppp-notice-row.hover{
            background:var(--editorial-hover-soft)!important;background-color:var(--editorial-hover-soft)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable{
            background:transparent!important;border:0!important;border-collapse:collapse!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #courseTable th{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable td{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable td:first-child{
            background:transparent!important;color:var(--text-secondary)!important;
            border-right:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable .class_div.box_font,
          html[data-urppp-skin="editorial"] #courseTable div[class*="div-kcb"]{
            border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc,
          html[data-urppp-skin="editorial"] #urppp-left #main-calendar,
          html[data-urppp-skin="editorial"] #urppp-left .fc-view{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-widget-header,
          html[data-urppp-skin="editorial"] #urppp-left .fc-widget-content{
            background:transparent!important;border-color:var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-button,
          html[data-urppp-skin="editorial"] #urppp-left button.fc-button,
          html[data-urppp-skin="editorial"] #urppp-left .fc-state-default{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;text-decoration-line:underline!important;text-decoration-color:transparent!important;
            text-underline-offset:3px!important;text-decoration-thickness:1px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-button:hover,
          html[data-urppp-skin="editorial"] #urppp-left .fc-state-active{
            background:transparent!important;color:var(--text)!important;text-decoration-color:currentColor!important;
            box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-toolbar .fc-center h2,
          html[data-urppp-skin="editorial"] #urppp-left .fc-toolbar h2{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;font-family:var(--editorial-display)!important;font-weight:500!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-head,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tabs{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab:hover{
            background:transparent!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac::after{
            height:1px!important;background:var(--text)!important;border-radius:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-sec{
            border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            padding-bottom:22px!important;margin-bottom:22px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn.ghost{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode:hover:not(:disabled),
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow:hover:not(:disabled),
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn.ghost:hover:not(:disabled){
            background:var(--editorial-hover)!important;border-bottom-color:var(--text)!important;color:var(--primary-hover)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode.ac,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow.ac{
            background:var(--editorial-active)!important;color:var(--text)!important;
            border-bottom:1px solid var(--text)!important;
          }
          html.urppp-theme-dark[data-urppp-skin="editorial"] body #urppp-settings-panel .urppp-set-mode.ac,
          html.urppp-theme-dark[data-urppp-skin="editorial"] body #urppp-settings-panel .urppp-set-mode[data-theme="dark"]{
            background:var(--editorial-active)!important;color:var(--text)!important;
            border:0!important;border-bottom:1px solid var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme:hover,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme.ac{
            background:var(--editorial-hover-soft)!important;border-bottom-color:var(--text)!important;outline:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme-preview span{
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-top,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar{
            background:var(--surface)!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar{
            border-bottom:0!important;border-top:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar button.ac{
            text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd-tabs .uc-sa-tab.ac,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac{
            color:var(--primary)!important;text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd-tabs .uc-sa-tab.ac::after,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac::after{display:none!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-shell{
            padding:28px 36px 36px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-desktop,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-col{
            gap:24px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-card{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          /* 编辑杂志：分析图表卡去掉背景框，融入版面 */
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-sa-chart-card,
          html[data-urppp-skin="editorial"] #urppp-score-analysis .urppp-sa-card{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          /* 编辑杂志：跳转按钮去背景块，改细线文字链接 */
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-sa-more{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
            color:var(--primary)!important;text-decoration:underline!important;text-underline-offset:3px!important;text-decoration-thickness:1px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-sa-more:hover{
            background:transparent!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-card:hover{
            border:0!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-hd,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-ft{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-ft{
            border-bottom:0!important;border-top:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-avatar,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-avatar img{
            border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-card:hover .uc-avatar{transform:none!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-gpa{
            background:var(--text)!important;color:var(--surface)!important;border:0!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-grid-cell{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-lesson{
            border:0!important;border-left:3px solid var(--uc-course-color,var(--text))!important;
            border-radius:0!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-lesson:hover{
            box-shadow:none!important;transform:none!important;filter:contrast(1.02)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-course-sub{
            background:transparent!important;border:0!important;border-top:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-cd-chip,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-attr-pill{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-badge{
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-badge{
            background:var(--text)!important;color:var(--bg)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.pass{
            background:var(--editorial-pass-bg)!important;color:var(--editorial-pass-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.fail{
            background:var(--editorial-fail-bg)!important;color:var(--editorial-fail-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.uneval{
            background:var(--editorial-info-bg)!important;color:var(--editorial-info-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.uneval-fail{
            background:var(--editorial-warn-bg)!important;color:var(--editorial-warn-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-grid{gap:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
            padding:16px!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane:nth-child(even){
            border-left:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane:hover{
            background:var(--editorial-hover-soft)!important;border-color:var(--editorial-line)!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane h5{
            font-family:var(--editorial-display)!important;font-weight:500!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metrics{gap:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
            padding:8px 12px!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric+.uc-metric{
            border-left:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric:hover b{
            border-color:var(--editorial-line)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric b{
            font-family:var(--editorial-display)!important;font-weight:500!important;
          }
          html[data-urppp-skin="editorial"] .urppp-stat-card .value,
          html[data-urppp-skin="editorial"] .table td,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric b,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell{
            font-variant-numeric:tabular-nums!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-services{gap:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-left:1px solid var(--editorial-line)!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:nth-child(7n+1){border-left:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:hover{
            background:var(--editorial-hover)!important;color:var(--text)!important;
            border-color:var(--editorial-line)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc svg,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:hover svg{
            color:var(--text)!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal{
            background:var(--surface)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root #uc-score-wrap,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-occ{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table th,
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table td{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table thead th{
            background:var(--bg)!important;color:var(--text-secondary)!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table tbody tr:nth-child(even) td{
            background:transparent!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table tbody tr:hover td{
            background:var(--editorial-hover-soft)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table tbody tr.is-on td{
            background:var(--editorial-active)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-build-grid button{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-build-grid button:hover{
            background:var(--editorial-hover)!important;border-bottom-color:var(--text)!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-occ-table th{
            background:transparent!important;border-radius:0!important;border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-legend i{
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.free{
            background:var(--input-bg)!important;border-color:var(--editorial-line-strong)!important;color:var(--text-muted)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-course,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.busy{
            background:var(--editorial-slot-course-bg)!important;border-color:var(--editorial-slot-course-border)!important;color:var(--editorial-slot-course-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-exam{
            background:var(--editorial-slot-exam-bg)!important;border-color:var(--editorial-slot-exam-border)!important;color:var(--editorial-slot-exam-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-lab{
            background:var(--editorial-slot-lab-bg)!important;border-color:var(--editorial-slot-lab-border)!important;color:var(--editorial-slot-lab-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-borrow{
            background:var(--editorial-slot-borrow-bg)!important;border-color:var(--editorial-slot-borrow-border)!important;color:var(--editorial-slot-borrow-text)!important;
          }
          html[data-urppp-skin="editorial"] .urppp-nav-dot,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-top-theme .urppp-nav-dot{
            border-radius:50%!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .urppp-nav-dot.ac,
          html[data-urppp-skin="editorial"] #urppp-nav-theme .urppp-nav-dot.ac,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{
            border-color:var(--text)!important;outline:1px solid var(--text)!important;outline-offset:2px!important;
          }
          html[data-urppp-skin="editorial"] a:focus-visible,
          html[data-urppp-skin="editorial"] button:focus-visible,
          html[data-urppp-skin="editorial"] [tabindex]:focus-visible{
            outline:1px solid var(--text)!important;outline-offset:3px!important;
          }
          @media (max-width:900px){
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-shell{
              padding:14px 12px 88px!important;
            }
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-desktop,
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-col{
              gap:18px!important;
            }
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane:nth-child(even){
              border-left:0!important;border-top:1px solid var(--editorial-line)!important;
            }
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:nth-child(7n+1){border-left:1px solid var(--editorial-line)!important;}
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:nth-child(4n+1){border-left:0!important;}
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-ft{box-shadow:none!important;}
          }
          @media (prefers-reduced-motion:reduce){
            html[data-urppp-skin="editorial"] *,
            html[data-urppp-skin="editorial"] *::before,
            html[data-urppp-skin="editorial"] *::after{transition:none!important;}
          }
        `;
      }

      el.textContent = css;
      const host = document.head || document.documentElement;
      if (el.parentNode === host && host.lastElementChild !== el) host.appendChild(el);
    } catch (e) {
      try { console.warn('[URP++] applySkinAttr', e); } catch (_) {}
    }
    setTimeout(() => {
      try { applyPersonalDisplay(document); } catch (_) {}
    }, 0);
  }

  function setSkin(id) {
    const hit = SKIN_CATALOG.find((s) => s.id === id && s.ready && (s.installed !== false || themeDownloaded(s.id)));
    const localHit = (!hit && localThemes()[id] && themeDownloaded(id)) ? { id, ready: true, installed: false } : null;
    const skin = hit || localHit;
    if (!skin) return false;
    GM_setValue(SKIN_KEY, skin.id);
    try {
      if (!skin.dynamic) setFollowUseDynamic(false);
      if (!skin.dark && isThemeFollowSystem()) setThemeFollowSystem(false);
      const following = isThemeFollowSystem();
      const requested = following ? resolveFollowThemeName() : getCurrent();
      const theme = isThemeModeAvailable(requested, hit.id) ? requested : 'default';
      applySkinAttr();
      applyTheme(theme, { system: following });
    } catch (_) {
      try { applySkinAttr(); } catch (__) {}
    }
    try { syncSettingsPanelUI(); } catch (_) {}
    try { syncNavbarThemeUI(); } catch (_) {}
    try {
      const clean = document.getElementById('urppp-clean-root');
      if (clean && typeof clean.__syncCleanThemeDots === 'function') clean.__syncCleanThemeDots();
    } catch (_) {}
    return true;
  }

  function bindSystemThemeListener() {
    if (window.__urpppSystemThemeBound) return;
    if (!window.matchMedia) return;
    window.__urpppSystemThemeBound = true;
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => {
        if (!isThemeFollowSystem()) return;
        try { applyTheme(resolveFollowThemeName(), { system: true }); } catch (_) {}
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    } catch (_) {}
  }

  // 尽早应用主题，让启动遮罩/立方体颜色跟主题一致
  try {
    if (isThemeFollowSystem()) applyTheme(resolveFollowThemeName(), { system: true });
    else applyTheme(getCurrent());
  } catch (_) {}
  try { applySkinAttr(); } catch (_) {}
  try { bindSystemThemeListener(); } catch (_) {}

  // ============================================================
  // 登录页重建
  // ============================================================

  function extractLoginErrorMessage(scope) {
    const text = String((document.body && document.body.innerText) || (scope && scope.innerText) || '')
      .replace(/\s+/g, ' ')
      .trim();
    const patterns = [
      /token\s*校验失败[！!]?/i,
      /令牌\s*校验失败[！!]?/i,
      /验证码.{0,12}(?:错误|失败|过期)[！!]?/i,
      /(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,
      /登录.{0,12}(?:错误|失败)[！!]?/i
    ];
    for (const pattern of patterns) {
      const hit = text.match(pattern);
      if (hit) return hit[0].trim();
    }
    return '';
  }

  function rebuild() {
    const path = location.pathname;
    const formContent = document.getElementById('formContent');
    const originalForm = document.querySelector('.form-signin');
    if (!formContent || !originalForm) {
      setTimeout(rebuild, 50); return;
    }
    if (formContent.querySelector(':scope > #urppp-root')) return;

    const loginErrorMessage = extractLoginErrorMessage(formContent);
    const originalForgotLink = originalForm.querySelector('a[onclick*="toModifyPwd"]');

    // 提取原始校徽 SVG
    const originalSvg = (() => {
      const svg = formContent.querySelector('.fadeIn.first svg');
      return svg ? svg.outerHTML : '';
    })();

    // 提取 SSO 链接
    const ssoHref = (() => {
      const a = document.querySelector('#tocas a');
      return a ? a.href : 'https://id.scu.edu.cn/';
    })();

    // 隐藏原始内容
    for (const c of formContent.children) c.style.display = 'none';
    formContent.style.cssText = 'max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;';

    const isEn = location.pathname === '/loginEn';
    const t = (zh, en) => isEn ? en : zh;

    // 注入新 UI
    formContent.insertAdjacentHTML('afterbegin', `
    <div id="urppp-root">
      <style>
        #urppp-root,#urppp-root *{box-sizing:border-box;}
        #urppp-root *{border:0;outline:0;}

        /* 全局背景同步主题 */
        html,body{background:var(--bg)!important;min-height:100vh}
        .wrapper{background:transparent!important}

        /* 卡片入场 */
        @keyframes uf{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .uc{animation:uf .4s ease-out}

        .uc{
          background:var(--surface);
          border-radius:var(--radius);
          box-shadow:var(--shadow);
          padding:48px 44px 36px;
        }

        /* === Brand === */
        .ub-logo{
          width:80px;height:80px;margin:0 auto 24px;
          display:none;
        }
        .ub-logo.show{display:flex;align-items:center;justify-content:center}
        .ub-logo svg{width:100%!important;height:100%!important;display:block}
        .ub h1{
          font-size:22px;font-weight:600;color:var(--text);
          text-align:center;letter-spacing:2px;line-height:1.4;margin:0;
        }
        .ub p{
          font-size:13px;color:var(--text-secondary);
          text-align:center;margin-top:6px;letter-spacing:1px;
        }

        /* === Tabs === */
        .ut{
          display:flex;margin:36px 0 32px;
          background:var(--input-bg);border-radius:var(--radius-sm);
          padding:4px;gap:4px;
        }
        .ut button{
          flex:1;padding:10px 0;
          border-radius:8px;cursor:pointer;
          font-size:14px;font-weight:500;
          color:var(--text-secondary);
          background:transparent;transition:all .2s;
          font-family:inherit;
        }
        .ut button.ac{
          background:var(--surface);color:var(--text);
          font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.05);
        }
        .ut button:hover:not(.ac){color:var(--text)}

        #urppp-root .urppp-login-error{
          margin:-16px 0 22px;padding:11px 13px;
          border:1px solid color-mix(in srgb,var(--danger,#b42318) 34%,var(--border));
          border-radius:var(--radius-sm);
          background:color-mix(in srgb,var(--danger,#b42318) 8%,var(--surface));
          color:var(--danger,#b42318);font-size:13px;line-height:1.5;text-align:center;
        }

        /* === Form === */
        .ufg{margin-bottom:20px}
        .ufg:last-of-type{margin-bottom:0}
        .ufl{
          display:block;font-size:13px;font-weight:500;
          color:var(--text);margin-bottom:8px;letter-spacing:.5px;
        }
        #urppp-root .ui{
          display:block;width:100%;height:46px;padding:0 14px;
          background:var(--input-bg) !important;
          border:1.5px solid var(--border) !important;
          border-radius:var(--radius-sm);
          font-size:15px;color:var(--text) !important;
          font-family:inherit;
          transition:border-color .2s,box-shadow .2s;
        }
        #urppp-root .ui:focus{
          border-color:var(--border-focus) !important;
          box-shadow:0 0 0 3px var(--ring) !important;
        }
        #urppp-root .ui::placeholder{color:var(--text-muted)}

        /* 验证码行：图片放在输入框内部右侧，确保总长度与其他输入框一致 */
        #urppp-root .ucr{
          width:100% !important;
          margin-bottom:0 !important;
        }
        #urppp-root .ufg-cap{
          margin-bottom:0 !important;
        }
        #urppp-root .ucap-input-wrap{
          position:relative !important;
          width:100% !important;
        }
        #urppp-root .ucap-input-wrap .ui{
          padding-right:148px !important;
        }
        #urppp-root .uci-wrap{
          position:absolute !important;
          right:-2px !important;
          top:50% !important;
          transform:translateY(-50%) !important;
          width:144px !important;
          height:41px !important;
          border-radius:var(--radius-sm) !important;
          overflow:hidden !important;
          background:var(--input-bg) !important;
          cursor:pointer !important;
          box-shadow:0 0 0 1px var(--border) !important;
        }
        #urppp-root .uci{
          display:block !important;
          width:100% !important;
          height:100% !important;
          object-fit:cover !important;
          transform:scale(1.16) !important;
        }

        /* === Button（Apple 胶囊主按钮）===
         */
        .ubtn{
          display:flex;align-items:center;justify-content:center;
          width:100%;height:48px;margin-top:28px;
          background:var(--primary);color:#fff;
          border-radius:999px;
          font-size:15px;font-weight:500;
          font-family:inherit;
          cursor:pointer;letter-spacing:0.2px;
          transition:background .2s ease,transform .15s ease,box-shadow .2s ease;
        }
        .ubtn:hover{
          background:var(--primary-hover);
          box-shadow:0 4px 14px var(--ring);
        }
        .ubtn:active{transform:scale(.98)}

        /* === Footer === */
        .uft{
          display:flex;justify-content:center;gap:20px;
          margin-top:20px;font-size:13px;
        }
        .uft a{
          color:var(--text-secondary);text-decoration:none;
          transition:color .2s;
        }
        .uft a:hover{color:var(--primary)}

        /* === 主题 === */
        .us{
          display:flex;justify-content:center;gap:8px;margin-top:24px;
          padding-top:20px;border-top:1px solid var(--border);
        }
        .us span{
          width:22px;height:22px;border-radius:50%;
          cursor:pointer;border:2px solid var(--border);
          transition:all .2s;
        }
        .us span.ac{
          border-color:var(--primary);
          transform:scale(1.15);
        }
        .us span:hover{border-color:var(--text-secondary)}
      </style>

      <div class="uc">
        <div class="ub" id="urppp-brand">
          <div class="ub-logo">${originalSvg || ''}</div>
          <h1>${t('四川大学教务管理系统','SCU Academic System')}</h1>
          <p>${t('学生端 · 欢迎登录','Student Portal · Welcome')}</p>
        </div>

        <div class="ut" id="urppp-tabs">
          <button class="ac" data-mode="account">${t('账号登录','Account')}</button>
          <button data-mode="sso">${t('统一认证','SSO')}</button>
        </div>

        ${loginErrorMessage ? `<div class="urppp-login-error" role="alert">${escapeHtml(loginErrorMessage)}</div>` : ''}

        <div class="ufb" id="urppp-form">
          <div class="ufg">
            <label class="ufl" for="urppp-user">${t('学号','Student ID')}</label>
            <input class="ui" id="urppp-user" type="text" placeholder="${t('请输入学号','Enter student ID')}" autocomplete="username">
          </div>
          <div class="ufg">
            <label class="ufl" for="urppp-pass">${t('密码','Password')}</label>
            <input class="ui" id="urppp-pass" type="password" placeholder="${t('请输入密码','Enter password')}" autocomplete="current-password">
          </div>
          <div class="ucr">
            <div class="ufg ufg-cap">
              <label class="ufl" for="urppp-cap">${t('验证码','Captcha')}</label>
              <div class="ucap-input-wrap">
                <input class="ui" id="urppp-cap" type="text" placeholder="${t('请输入','Enter')}" maxlength="4" autocomplete="off">
                <div class="uci-wrap" id="urppp-capwrap" title="${t('点击刷新','Refresh')}">
                  <img class="uci" id="urppp-capimg" src="" alt="Captcha">
                </div>
              </div>
            </div>
          </div>
          <button class="ubtn" id="urppp-submit">${t('登 录','Sign In')}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="urppp-forgot">${t('忘记密码？','Forgot password?')}</a>
          <a href="${isEn?'/login':'/loginEn'}">${isEn?'中文':'EN'}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F5F5F7;box-shadow:inset 0 0 0 1px #D2D2D7"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="动态配色" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);

    // ---- 事件绑定 ----

    const root = formContent.querySelector('#urppp-root');

    // 输入同步
    [
      ['#urppp-user', '#input_username'],
      ['#urppp-pass', '#input_password'],
      ['#urppp-cap', '#input_checkcode'],
    ].forEach(([ns, os]) => {
      const ni = root.querySelector(ns), oi = document.querySelector(os);
      if (ni && oi) {
        if (oi.value) ni.value = oi.value;
        ni.addEventListener('input', () => { oi.value = ni.value; });
      }
    });

    // 验证码
    const capImg = root.querySelector('#urppp-capimg');
    const capWrap = root.querySelector('#urppp-capwrap');
    const origCapImg = document.querySelector('.form-signin img');
    if (capImg && origCapImg) {
      capImg.src = origCapImg.src;
      const refreshCap = () => {
        const u = origCapImg.src.replace(/\?.*/, '') + '?' + Date.now();
        origCapImg.src = u; capImg.src = u;
      };
      if (capWrap) capWrap.addEventListener('click', refreshCap);
      else capImg.addEventListener('click', refreshCap);
    }

    // Tab：账号登录显示表单；统一认证直接跳转
    root.querySelectorAll('.ut button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.mode === 'sso') {
          location.href = ssoHref;
          return;
        }
        root.querySelectorAll('.ut button').forEach(b => b.classList.remove('ac'));
        btn.classList.add('ac');
        const formEl = root.querySelector('#urppp-form');
        const ssoEl = root.querySelector('#urppp-sso');
        if (formEl) formEl.style.display = 'block';
        if (ssoEl) ssoEl.style.display = 'none';
      });
    });

    // 登录
    const submitBtn = root.querySelector('#urppp-submit');
    submitBtn.addEventListener('click', () => {
      if (submitBtn.dataset.submitting === '1') return;
      submitBtn.dataset.submitting = '1';
      submitBtn.disabled = true;
      const origBtn = document.getElementById('loginButton');
      if (origBtn) origBtn.click();
      else if (typeof originalForm.requestSubmit === 'function') originalForm.requestSubmit();
      else originalForm.submit();
      setTimeout(() => {
        submitBtn.dataset.submitting = '0';
        submitBtn.disabled = false;
      }, 1500);
    });
    root.querySelectorAll('.ui').forEach(i => {
      i.addEventListener('keydown', e => { if (e.key === 'Enter') submitBtn.click(); });
    });

    // 忘记密码
    root.querySelector('#urppp-forgot').addEventListener('click', e => {
      e.preventDefault();
      if (originalForgotLink) originalForgotLink.click();
    });

    // 主题：仅三圆点（简约白 / 深邃暗 / 动态配色），登录页不提供设置入口
    const dots = root.querySelector('#urppp-dots');
    const syncLoginDots = () => {
      if (!dots) return;
      const ct = getCurrent();
      dots.querySelectorAll('span').forEach((d) => {
        d.classList.toggle('ac', d.dataset.theme === ct);
      });
      const dyn = dots.querySelector('span[data-theme="scu-red"]');
      if (dyn) {
        const seed = getAccent() || DEFAULT_SEED;
        try {
          const prev = buildSchemePreview(seed, getScheme());
          dyn.style.background = 'linear-gradient(135deg, ' + prev.primary + ' 0 55%, ' + prev.surface + ' 55% 100%)';
        } catch (_) {
          dyn.style.background = seed;
        }
      }
    };
    if (dots) {
      dots.querySelectorAll('span').forEach((d) => {
        d.addEventListener('click', () => {
          applyTheme(d.dataset.theme, { manual: true });
          syncLoginDots();
        });
      });
      syncLoginDots();
    }

    console.log('[URP++] 登录界面已重建');
    setTimeout(() => { document.body.classList.add('urppp-ready'); hideBootLoader(); }, 100);
  }

  // ============================================================
  // 正式页面全局美化
  // ============================================================

  const { beautifyBreadcrumbs } = createBreadcrumbController({});

  // 学籍页：不改 DOM 结构。仅清理列 gutter，让「基本信息」与上方全宽标题同左缘

  // 个人信息修改等单对表单：若被误标查询表单，清掉并恢复横排
  function fixSinglePairProfileForms() {
    try {
      document.querySelectorAll('.profile-user-info, .profile-user-info-striped').forEach((root) => {
        if (root.classList.contains('setLabelWidth')) return;
        if (root.classList.contains('urppp-query-form')) return;
        if (root.querySelector('.urppp-query-pair')) return;
        const rows = Array.from(root.querySelectorAll(':scope > .profile-info-row, .profile-info-row'));
        if (!rows.length) return;
        const multi = rows.some((row) =>
          Array.from(row.children).filter((el) => el.classList && el.classList.contains('profile-info-name')).length >= 2
        );
        if (multi) return;
        // 单对信息表
        root.classList.remove('urppp-query-form');
        root.style.setProperty('width', '100%', 'important');
        root.style.setProperty('max-width', '100%', 'important');
        root.style.setProperty('display', 'block', 'important');
        ensureProfileCardShell(root);
        rows.forEach((row) => {
          row.classList.remove('urppp-query-row', 'urppp-dual-pair');
          delete row.dataset.urpppQueryDone;
          delete row.dataset.urpppQueryCols;
          // 拆 pair
          const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
          if (pairs.length) {
            const items = [];
            pairs.forEach((p) => Array.from(p.children).forEach((c) => items.push(c)));
            while (row.firstChild) row.removeChild(row.firstChild);
            items.forEach((el) => row.appendChild(el));
          }
          row.style.setProperty('display', 'grid', 'important');
          row.style.setProperty('grid-template-columns', '140px minmax(0,1fr)', 'important');
          row.style.setProperty('align-items', 'stretch', 'important');
          row.style.setProperty('width', '100%', 'important');
          Array.from(row.children).forEach((el) => {
            if (!el.classList) return;
            el.style.setProperty('float', 'none', 'important');
            el.style.setProperty('margin-left', '0', 'important');
            el.style.setProperty('width', 'auto', 'important');
            el.style.setProperty('max-width', 'none', 'important');
            el.style.setProperty('display', 'flex', 'important');
            el.style.setProperty('align-items', 'center', 'important');
            el.style.setProperty('box-sizing', 'border-box', 'important');
          });
        });
      });
    } catch (err) {
      console.warn('[URP++] single pair profile fix failed', err);
    }
  }
  function alignRollInfoLayout() {
    const page = document.querySelector('.page-content') || document.getElementById('page-content-template');
    if (!page) return;

    // 学籍双栏：标题只做文字条（与个人信息页标题层级一致，但不做第二张卡）
    page.querySelectorAll('.col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8').forEach((col) => {
      if (!col.querySelector('.setLabelWidth')) return;
      const card = col.querySelector('.setLabelWidth');
      if (!card) return;
      col.querySelectorAll('h4.header, h3.header, .header.smaller, .header').forEach((h) => {
        if (card.contains(h)) return;
        // 只要标题在信息卡前面（文档顺序）
        if (!(h.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
        h.classList.add('urppp-section-label');
        ['background','background-color','background-image','border','box-shadow','border-radius','padding','margin','min-height'].forEach((p) => {
          h.style.removeProperty(p);
        });
        h.style.setProperty('background', 'transparent', 'important');
        h.style.setProperty('background-color', 'transparent', 'important');
        h.style.setProperty('background-image', 'none', 'important');
        h.style.setProperty('border', '0 none transparent', 'important');
        h.style.setProperty('box-shadow', 'none', 'important');
        h.style.setProperty('border-radius', '0', 'important');
        h.style.setProperty('padding', '4px 2px 10px', 'important');
        h.style.setProperty('margin', '0 0 8px 0', 'important');
        h.style.setProperty('min-height', '0', 'important');
      });
      // 信息卡本身：与个人信息内容卡一样，无内边距
      card.classList.remove('urppp-query-form');
      card.style.setProperty('padding', '0', 'important');
      card.style.setProperty('overflow', 'hidden', 'important');
      card.style.setProperty('background', 'var(--surface)', 'important');
      card.style.setProperty('border', urpppCardBorderValue(), 'important');
      card.style.setProperty('border-radius', '12px', 'important');
      card.style.setProperty('box-shadow', 'none', 'important');
    });

    // 学籍卡若被误标成查询表单，清掉，恢复 ACE 横排
    page.querySelectorAll('.profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth').forEach((root) => {
      root.classList.remove('urppp-query-form');
      root.querySelectorAll('.profile-info-row').forEach((row) => {
        row.classList.remove('urppp-query-row');
        delete row.dataset.urpppQueryDone;
        delete row.dataset.urpppQueryCols;
        // 若曾被包成 pair，拆回 name/value 平铺
        const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
        if (pairs.length) {
          const items = [];
          pairs.forEach((pair) => {
            Array.from(pair.children).forEach((c) => items.push(c));
          });
          while (row.firstChild) row.removeChild(row.firstChild);
          items.forEach((el) => row.appendChild(el));
        }
      });
    });

    // 学籍一行两对：标记 + 强制 4 列 grid，清掉站点 width:34% / float 内联
    page.querySelectorAll('.setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row').forEach((row) => {
      // 先拆 pair 残留
      const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
      if (pairs.length) {
        const items = [];
        pairs.forEach((pair) => {
          Array.from(pair.children).forEach((c) => items.push(c));
        });
        while (row.firstChild) row.removeChild(row.firstChild);
        items.forEach((el) => row.appendChild(el));
      }
      row.classList.remove('urppp-query-row');
      delete row.dataset.urpppQueryDone;
      delete row.dataset.urpppQueryCols;

      const kids = Array.from(row.children).filter((el) =>
        el.classList && (el.classList.contains('profile-info-name') || el.classList.contains('profile-info-value'))
      );
      const names = kids.filter((el) => el.classList.contains('profile-info-name'));
      if (names.length >= 2) {
        row.classList.add('urppp-dual-pair');
        row.style.setProperty('display', 'grid', 'important');
        row.style.setProperty('grid-template-columns', '112px minmax(140px,1fr) 112px minmax(140px,1fr)', 'important');
        row.style.setProperty('align-items', 'stretch', 'important');
        row.style.setProperty('width', '100%', 'important');
        row.style.setProperty('max-width', '100%', 'important');
        row.style.setProperty('float', 'none', 'important');
        kids.forEach((el) => {
          el.style.setProperty('float', 'none', 'important');
          el.style.setProperty('clear', 'none', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('margin-left', '0', 'important');
          el.style.setProperty('width', 'auto', 'important');
          el.style.setProperty('max-width', 'none', 'important');
          el.style.setProperty('min-width', '0', 'important');
          el.style.setProperty('box-sizing', 'border-box', 'important');
          el.style.setProperty('display', 'flex', 'important');
          el.style.setProperty('align-items', 'center', 'important');
          // 去掉站点 style="width:34%" 等
          if (el.classList.contains('profile-info-value')) {
            el.style.removeProperty('width');
            el.style.setProperty('width', 'auto', 'important');
            el.style.setProperty('justify-content', 'flex-start', 'important');
            el.style.setProperty('white-space', 'normal', 'important');
            el.style.setProperty('word-break', 'normal', 'important');
          } else {
            el.style.setProperty('justify-content', 'flex-end', 'important');
            el.style.setProperty('white-space', 'nowrap', 'important');
          }
        });
      } else {
        row.classList.remove('urppp-dual-pair');
      }
    });
    // 学籍信息卡：对齐左侧基本信息——标题无壳，表 padding:0
    page.querySelectorAll('.profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth').forEach((card) => {
      card.classList.remove('urppp-query-form');
      card.style.cssText = (card.getAttribute('style') || '').replace(/padding\s*:[^;]+;?/gi, '');
      card.style.setProperty('background', 'var(--surface)', 'important');
      card.style.setProperty('border-radius', '12px', 'important');
      card.style.setProperty('overflow', 'hidden', 'important');
      card.style.setProperty('border', urpppCardBorderValue(), 'important');
      card.style.setProperty('box-shadow', 'none', 'important');
      card.style.setProperty('width', '100%', 'important');
      card.style.setProperty('max-width', '100%', 'important');
      card.style.setProperty('box-sizing', 'border-box', 'important');
      card.style.setProperty('margin', '0 0 16px 0', 'important');
      card.style.setProperty('padding', '0', 'important');
      const col = card.closest('.col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8') || card.parentElement;
      if (!col) return;
      // 标题：同列内、在 card 之前的 h4/header
      Array.from(col.querySelectorAll('h4.header, h3.header, .header.smaller')).forEach((h) => {
        if (card.contains(h)) return;
        if (!(h.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
        h.classList.add('urppp-section-label');
        h.style.setProperty('background', 'transparent', 'important');
        h.style.setProperty('background-color', 'transparent', 'important');
        h.style.setProperty('background-image', 'none', 'important');
        h.style.setProperty('border', '0 none transparent', 'important');
        h.style.setProperty('box-shadow', 'none', 'important');
        h.style.setProperty('border-radius', '0', 'important');
        h.style.setProperty('padding', '4px 2px 10px', 'important');
        h.style.setProperty('margin', '0 0 8px 0', 'important');
        h.style.setProperty('min-height', '0', 'important');
      });
    });
    // 还原此前可能写过的 flex/宽度内联，避免破坏 col-xs-4 / col-xs-8
    page.querySelectorAll('.urppp-col-row').forEach((el) => {
      el.classList.remove('urppp-col-row');
      ['display','flex-wrap','gap','align-items','width','box-sizing'].forEach((p) => el.style.removeProperty(p));
    });
    page.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach((col) => {
      ['float','flex','width','max-width','padding-left','padding-right','box-sizing'].forEach((p) => {
        // 只清我们可能写过的强制布局，保留页面原有 inline 尺寸需求
        if (col.style.getPropertyPriority(p) === 'important') col.style.removeProperty(p);
      });
      col.style.setProperty('padding-left', '0', 'important');
      col.style.setProperty('box-sizing', 'border-box', 'important');
    });
    // 左列右侧留缝，右列不再额外左缩进
    page.querySelectorAll('.col-xs-4, .col-sm-4, .col-md-4').forEach((col) => {
      col.style.setProperty('padding-right', '16px', 'important');
    });
    page.querySelectorAll('.col-xs-8, .col-sm-8, .col-md-8').forEach((col) => {
      col.style.setProperty('padding-left', '0', 'important');
      col.style.setProperty('padding-right', '0', 'important');
    });
    // 学籍双栏：凡列内有 setLabelWidth，标题一律去卡壳
    page.querySelectorAll('.col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8').forEach((col) => {
      if (!col.querySelector('.setLabelWidth')) return;
      col.querySelectorAll(':scope > h4.header, :scope > .header, :scope > .header.smaller').forEach((h) => {
        h.style.cssText += ';background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;';
      });
    });
    // 若之前 hoist 过标题，刷新后会恢复；运行时若还挂在 wrap 里则放回原列顶部
    page.querySelectorAll('.urppp-section-title-wrap').forEach((wrap) => {
      const header = wrap.querySelector('h4.header, h3.header, h5.header, .header.smaller');
      if (!header) { wrap.remove(); return; }
      // 找后面的多列容器里的第一个 col，把标题塞回去
      let sib = wrap.nextElementSibling;
      while (sib && !sib.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]')) {
        sib = sib.nextElementSibling;
      }
      const leftCol = sib && (sib.querySelector('.col-xs-4, .col-sm-4, .col-md-4') || Array.from(sib.children).find((c) => /col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(c.className || '')));
      if (leftCol) {
        leftCol.insertBefore(header, leftCol.firstChild);
        delete header.dataset.urpppHoisted;
        header.style.removeProperty('width');
        header.style.removeProperty('max-width');
        header.style.removeProperty('margin-left');
        header.style.removeProperty('margin-right');
        header.style.removeProperty('box-sizing');
        header.style.removeProperty('position');
        header.style.removeProperty('left');
      }
      wrap.remove();
    });
  }
  // 查询条件：把 ACE 同行多对 name/value 包成 pair；按本行列数动态布局
  // 查询区原生 select 统一升级为 Chosen（与「学年学期」一致）
  // 注意：脚本有 @grant，页面 jQuery/Chosen 在 unsafeWindow 上
  function pageJQuery() {
    const g = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    return g.jQuery || g.$ || window.jQuery || window.$ || null;
  }

  function isPagebarSelect(sel) {
    if (!sel) return false;
    if (sel.id && String(sel.id).indexOf('pagination_pageSize_') === 0) return true;
    return !!(sel.closest && sel.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]'));
  }

  function destroyPagebarChosen(sel) {
    if (!sel) return;
    try {
      const $ = pageJQuery();
      if ($ && $.fn && $(sel).data('chosen')) $(sel).chosen('destroy');
    } catch (_) { /* ignore */ }
    try {
      if (sel.parentElement) {
        sel.parentElement.querySelectorAll(':scope > .chosen-container').forEach((c) => {
          try { c.remove(); } catch (_) { /* ignore */ }
        });
      }
      if (sel.nextElementSibling && sel.nextElementSibling.classList.contains('chosen-container')) {
        try { sel.nextElementSibling.remove(); } catch (_) { /* ignore */ }
      }
    } catch (_) { /* ignore */ }
    sel.classList.remove('urppp-chosen-hidden', 'chzn-done', 'chosen');
    try { delete sel.dataset.urpppChosen; } catch (_) { /* ignore */ }
    sel.style.setProperty('display', 'inline-block', 'important');
  }

  // 防穿透：下拉选项的 mousedown/click 冒泡到容器即停，
  // 不影响 Chosen 内部选项处理器，但不会继续冒泡触发下层控件。
  // click 额外 preventDefault：Chosen 在 mousedown 选择并关闭下拉后，
  // 浏览器会重新命中测试派发 click；若位置落到下层控件上会误触发它，
  // 因此把容器内派生的 click 一并拦截。
  let chosenPickGuardUntil = 0;
  let chosenPickGuardBound = false;

  // 穿透根因（Chosen 1.1.0）：选项选择由 mouseup/touchend 触发，选择后
  // 立即 results_hide() 关闭下拉；浏览器随后合成的 mousedown/mouseup/click
  // 会重新命中测试到关闭后露出的下层控件（如另一个选择框），触发它打开。
  // 修复：选择事件后设保护窗口，document 捕获阶段拦截窗口内的 mousedown/mouseup/click。
  // 捕获阶段先于任意目标执行，无论事件重定向到哪个下层元素都能拦住；
  // Chosen 自身的选择已完成，不受影响。
  function bindChosenPickGuard() {
    if (chosenPickGuardBound) return;
    chosenPickGuardBound = true;
    const guard = (event) => {
      if (Date.now() < chosenPickGuardUntil) {
        try { event.preventDefault(); } catch (_) { /* ignore */ }
        try { event.stopPropagation(); } catch (_) { /* ignore */ }
      }
    };
    document.addEventListener('mousedown', guard, true);
    document.addEventListener('mouseup', guard, true);
    document.addEventListener('click', guard, true);
  }

  function bindChosenNoPierce(cont) {
    if (!cont || cont.__urpppChosenNoPierce) return;
    cont.__urpppChosenNoPierce = true;
    bindChosenPickGuard();
    const drop = cont.querySelector('.chosen-drop');
    // Chosen 用 mouseup/touchend 选择选项（search_results_mouseup / touchend）。
    // 选项被点选后立即设保护窗口，覆盖浏览器随后合成的鼠标事件。
    const onPick = (event) => {
      const t = event.target;
      if (!t || !t.closest || !t.closest('.chosen-results li')) return;
      chosenPickGuardUntil = Date.now() + 350;
    };
    cont.addEventListener('mouseup', onPick, false);
    cont.addEventListener('touchend', onPick, false);
    if (drop) {
      drop.addEventListener('mouseup', onPick, false);
      drop.addEventListener('touchend', onPick, false);
    }
  }

  // 扫描页面所有 Chosen 容器绑定防穿透（覆盖站点自带/插件初始化的所有情况）
  function bindAllChosenNoPierce(root = document) {
    try {
      root.querySelectorAll('.chosen-container').forEach(bindChosenNoPierce);
    } catch (_) { /* ignore */ }
  }

  function ensureQueryChosen() {
    try {
      const $ = pageJQuery();
      if (!$ || !$.fn || typeof $.fn.chosen !== 'function') return false;

      const roots = document.querySelectorAll(
        '.profile-user-info, .urppp-query-form, .profile-info-row, form'
      );
      const seen = new Set();
      const sels = [];
      roots.forEach((root) => {
        root.querySelectorAll('select').forEach((sel) => {
          if (seen.has(sel)) return;
          seen.add(sel);
          sels.push(sel);
        });
      });
      // 兜底：独立 value_element
      document.querySelectorAll('select.value_element, .profile-info-value > select').forEach((sel) => {
        if (seen.has(sel)) return;
        seen.add(sel);
        sels.push(sel);
      });

      sels.forEach((sel) => {
        if (!sel || sel.multiple || sel.disabled) return;
        if (sel.size && sel.size > 1) return; // 列表多选框跳过
        // 分页条「每页显示」绝不能 Chosen
        if (isPagebarSelect(sel)) {
          destroyPagebarChosen(sel);
          return;
        }
        const $sel = $(sel);
        const already =
          !!$sel.data('chosen') ||
          sel.classList.contains('chzn-done') ||
          !!(sel.nextElementSibling && sel.nextElementSibling.classList.contains('chosen-container')) ||
          !!(sel.parentElement && sel.parentElement.querySelector(':scope > .chosen-container'));
        if (already) {
          sel.dataset.urpppChosen = '1';
          sel.classList.add('urppp-chosen-hidden');
          sel.style.setProperty('display', 'none', 'important');
          const existingCont =
            sel.nextElementSibling && sel.nextElementSibling.classList.contains('chosen-container')
              ? sel.nextElementSibling
              : (sel.parentElement && sel.parentElement.querySelector(':scope > .chosen-container'));
          if (existingCont) bindChosenNoPierce(existingCont);
          return;
        }
        try {
          if (!sel.classList.contains('select')) sel.classList.add('select');
          // destroy 半残状态再 init
          try { if ($sel.data('chosen')) $sel.chosen('destroy'); } catch (_) { /* ignore */ }
          $sel.chosen({
            allow_single_deselect: true,
            search_contains: true,
            width: '100%',
            no_results_text: '无匹配项',
            disable_search_threshold: 0
          });
          sel.dataset.urpppChosen = '1';
          sel.classList.add('urppp-chosen-hidden');
          sel.style.setProperty('display', 'none', 'important');
          const cont =
            sel.nextElementSibling && sel.nextElementSibling.classList.contains('chosen-container')
              ? sel.nextElementSibling
              : (sel.parentElement && sel.parentElement.querySelector('.chosen-container'));
          if (cont) {
            cont.style.setProperty('width', '100%', 'important');
            cont.style.setProperty('min-width', '0', 'important');
            cont.style.setProperty('display', 'block', 'important');
          }
          if (cont) bindChosenNoPierce(cont);
        } catch (e) {
          console.warn('[URP++] chosen init failed', sel, e);
        }
      });

      // 校区→教学楼→教室 会用 .html() 重写 option，需同步 Chosen
      if (!window.__urpppChosenHtmlPatch) {
        window.__urpppChosenHtmlPatch = true;
        const oldHtml = $.fn.html;
        $.fn.html = function () {
          const ret = oldHtml.apply(this, arguments);
          if (arguments.length) {
            try {
              this.filter('select').add(this.find('select')).each(function () {
                const $el = $(this);
                if ($el.data('chosen') || $el.next('.chosen-container').length) {
                  try { $el.trigger('chosen:updated'); } catch (_) { /* ignore */ }
                }
              });
            } catch (_) { /* ignore */ }
          }
          return ret;
        };
      }
      return true;
    } catch (err) {
      console.warn('[URP++] ensureQueryChosen failed', err);
      return false;
    }
  }

  function scheduleEnsureQueryChosen() {
    if (window.__urpppChosenScheduleBound) return;
    window.__urpppChosenScheduleBound = true;
    const delays = [0, 200, 600, 1500, 3000];
    delays.forEach((ms) => setTimeout(() => {
      ensureQueryChosen();
      bindAllChosenNoPierce();
    }, ms));
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const ok = ensureQueryChosen();
      bindAllChosenNoPierce();
      // jQuery/chosen 就绪后多试几次，不必无限跑
      if ((ok && tries > 3) || tries > 15) clearInterval(timer);
    }, 500);
  }

  // 空闲教室：楼栋列表轻量标记（校区标题 / 楼栋项 / 当前高亮）

  const { beautifyPagebar } = createPagebarBeautifier({ destroyPagebarChosen });
  const { scheduleBeautifyPagebar } = createPagebarLifecycle({ beautifyPagebar });
  function beautifyFreeClassroomList() {
    try {
      document.querySelectorAll('#drag-ul, ul#drag-ul').forEach((ul) => {
        if (!ul) return;
        const items = Array.from(ul.children).filter((n) => n.tagName === 'LI');
        if (!items.length) {
          ul.classList.add('urppp-empty');
          ul.style.setProperty('display', 'none', 'important');
          const host = ul.closest('#xq-section, .widget-main, .widget-body');
          // 仅当容器里没有任何 li 时隐藏外框，避免误伤
          if (host && !host.querySelector('li')) {
            host.classList.add('urppp-empty');
            host.style.setProperty('display', 'none', 'important');
          }
          return;
        }
        ul.classList.remove('urppp-empty');
        ul.classList.add('urppp-drag-ul');
        ul.style.removeProperty('display');
        ul.style.setProperty('height', 'auto', 'important');
        ul.style.setProperty('min-height', '0', 'important');

        items.forEach((li) => {
          const txt = (li.textContent || '').replace(/\s+/g, ' ').trim();
          const hasClick =
            (li.getAttribute('onclick') || '').includes('goDetail') ||
            li.classList.contains('ui-selectee') ||
            li.classList.contains('jc-future') ||
            !!li.querySelector('a');
          if (!hasClick && /校区/.test(txt) && txt.length <= 12) {
            li.classList.add('xq-section');
            li.classList.remove('ui-selectee', 'jc-future', 'urppp-building-active');
          } else if (hasClick && !li.classList.contains('jc-future')) {
            li.classList.add('ui-selectee');
          }
        });
      });

      if (!window.__urpppBuildingActiveBound) {
        window.__urpppBuildingActiveBound = true;
        document.addEventListener('click', (e) => {
          const li = e.target && e.target.closest ? e.target.closest('#drag-ul > li') : null;
          if (!li || li.classList.contains('xq-section') || li.classList.contains('jc-future')) return;
          const ul = li.parentElement;
          if (!ul) return;
          ul.querySelectorAll('li.urppp-building-active, li.ui-selected').forEach((x) => {
            x.classList.remove('urppp-building-active', 'ui-selected');
          });
          li.classList.add('urppp-building-active', 'ui-selected');
        }, true);
      }
    } catch (err) {
      console.warn('[URP++] free classroom list beautify failed', err);
    }
  }
  function ensureProfileCardShell(root) {
    if (!root || !root.style) return;
    // 学籍信息卡：固定信息表形态，与个人信息页内容卡一致
    if (root.classList.contains('setLabelWidth')) {
      root.classList.remove('urppp-query-form');
      root.style.setProperty('width', '100%', 'important');
      root.style.setProperty('max-width', '100%', 'important');
      root.style.setProperty('box-sizing', 'border-box', 'important');
      root.style.setProperty('float', 'none', 'important');
      root.style.setProperty('display', 'block', 'important');
      root.style.setProperty('background', 'var(--surface)', 'important');
      root.style.setProperty('border', urpppCardBorderValue(), 'important');
      root.style.setProperty('border-radius', '12px', 'important');
      root.style.setProperty('box-shadow', 'none', 'important');
      root.style.setProperty('margin', '0 0 16px 0', 'important');
      root.style.setProperty('padding', '0', 'important');
      root.style.setProperty('overflow', 'hidden', 'important');
      return;
    }
    const inWidget = !!(root.closest && root.closest('.widget-box, .widget-main, .widget-body, .panel'));
    root.style.setProperty('width', '100%', 'important');
    root.style.setProperty('max-width', '100%', 'important');
    root.style.setProperty('min-width', '0', 'important');
    root.style.setProperty('box-sizing', 'border-box', 'important');
    root.style.setProperty('float', 'none', 'important');
    root.style.setProperty('display', 'block', 'important');
    root.style.setProperty('clear', 'both', 'important');
    // 父级 form / tab-pane 拉满（空闲教室 tab 内独立卡）
    const form = root.parentElement && root.parentElement.tagName === 'FORM' ? root.parentElement : null;
    if (form) {
      form.style.setProperty('width', '100%', 'important');
      form.style.setProperty('max-width', '100%', 'important');
      form.style.setProperty('display', 'block', 'important');
      form.style.setProperty('float', 'none', 'important');
      form.style.setProperty('box-sizing', 'border-box', 'important');
      form.style.setProperty('margin', '0', 'important');
    }
    const pane = root.closest && root.closest('.tab-pane, .tab-content');
    if (pane) {
      pane.style.setProperty('width', '100%', 'important');
      pane.style.setProperty('max-width', '100%', 'important');
      pane.style.setProperty('box-sizing', 'border-box', 'important');
    }
    if (inWidget) {
      root.style.setProperty('background', 'transparent', 'important');
      root.style.setProperty('border', 'none', 'important');
      root.style.setProperty('border-radius', '0', 'important');
      root.style.setProperty('padding', '0', 'important');
      root.style.setProperty('margin', '0', 'important');
      root.style.setProperty('box-shadow', 'none', 'important');
      return;
    }
    // 与 h4.header 同一套卡片语言：surface + 1px border + 12px 圆角
    root.style.setProperty('background', 'var(--surface)', 'important');
    root.style.setProperty('border', urpppCardBorderValue(), 'important');
    root.style.setProperty('border-radius', '12px', 'important');
    root.style.setProperty('box-shadow', 'none', 'important');
    root.style.setProperty('margin', '0 0 18px 0', 'important');
    // 学籍 setLabelWidth：信息表，绝不当查询卡（否则 14px 内边距会像套娃）
    // 查询卡：urppp-query-form / query-pair / chosen
    const isRollInfo = root.classList.contains('setLabelWidth');
    const isQuery =
      !isRollInfo && (
        root.classList.contains('urppp-query-form') ||
        !!root.querySelector('.urppp-query-pair, .chosen-container')
      );
    if (isQuery) {
      root.style.setProperty('padding', '14px 16px', 'important');
      root.style.setProperty('overflow', 'visible', 'important');
    } else {
      // 学籍/个人信息等：内容贴边，由行自己 padding
      root.style.setProperty('padding', '0', 'important');
      root.style.setProperty('overflow', 'hidden', 'important');
    }
  }
  function beautifyQueryForms() {
    try {
      ensureQueryChosen();
      // 所有 profile 卡统一外壳（含个人信息单列表单）
      document.querySelectorAll('.page-content .profile-user-info, #page-content-template .profile-user-info').forEach((el) => {
        ensureProfileCardShell(el);
      });
      // 同一查询卡内，所有行共用「最密一行」的列数，避免第二行只有 1 项时被拉满整行
      const getFormQueryCols = (row) => {
        const form = row.closest('.profile-user-info, .urppp-query-form') || row.parentElement;
        if (!form) return Math.min(Math.max(row.querySelectorAll(':scope > .urppp-query-pair').length, 1), 4);
        let maxPairs = 0;
        form.querySelectorAll(':scope > .profile-info-row, .profile-info-row').forEach((r) => {
          const c = r.querySelectorAll(':scope > .urppp-query-pair').length;
          if (c > maxPairs) maxPairs = c;
        });
        // 至少 1；查询卡常见 4 列，单字段行也占第一格宽度
        return Math.min(Math.max(maxPairs, 1), 4);
      };
      const applyRowLayout = (row) => {
        const pairs = Array.from(row.querySelectorAll(':scope > .urppp-query-pair'));
        const cols = getFormQueryCols(row);
        row.classList.add('urppp-query-row');
        row.style.setProperty('display', 'grid', 'important');
        row.style.removeProperty('grid-template-columns');
        row.style.setProperty('column-gap', '14px', 'important');
        row.style.setProperty('row-gap', '10px', 'important');
        row.style.setProperty('align-items', 'center', 'important');
        row.style.setProperty('width', '100%', 'important');
        row.style.setProperty('max-width', '100%', 'important');
        row.style.setProperty('box-sizing', 'border-box', 'important');
        row.dataset.urpppQueryCols = String(cols);
        // 由 CSS Grid 自动放置，媒体查询可在移动端安全换列。
        pairs.forEach((pair) => {
          pair.style.removeProperty('grid-column');
        });

        pairs.forEach((pair) => {
          pair.style.setProperty('display', 'flex', 'important');
          pair.style.setProperty('align-items', 'center', 'important');
          pair.style.setProperty('width', '100%', 'important');
          pair.style.setProperty('min-width', '0', 'important');
          pair.style.setProperty('max-width', '100%', 'important');
          pair.style.setProperty('box-sizing', 'border-box', 'important');
          pair.style.removeProperty('flex');

          const name = pair.querySelector('.profile-info-name');
          const value = pair.querySelector('.profile-info-value');
          if (name) {
            name.style.setProperty('float', 'none', 'important');
            name.style.setProperty('display', 'flex', 'important');
            name.style.setProperty('align-items', 'center', 'important');
            name.style.setProperty('justify-content', 'flex-end', 'important');
            // 标签宽度走 CSS 变量，媒体查询可在窄视口收窄，控件拿到更多空间
            name.style.setProperty('flex', '0 0 var(--urppp-qlabel, 84px)', 'important');
            name.style.setProperty('width', 'var(--urppp-qlabel, 84px)', 'important');
            name.style.setProperty('min-width', 'var(--urppp-qlabel, 84px)', 'important');
            name.style.setProperty('max-width', 'var(--urppp-qlabel-max, 96px)', 'important');
            name.style.setProperty('margin', '0', 'important');
            name.style.setProperty('margin-left', '0', 'important');
            name.style.setProperty('padding', '0 8px 0 0', 'important');
            name.style.setProperty('background', 'transparent', 'important');
            name.style.setProperty('border', 'none', 'important');
            name.style.setProperty('border-right', 'none', 'important');
          }
          if (value) {
            value.style.setProperty('float', 'none', 'important');
            value.style.setProperty('display', 'flex', 'important');
            value.style.setProperty('align-items', 'center', 'important');
            value.style.setProperty('flex', '1 1 auto', 'important');
            value.style.setProperty('width', 'auto', 'important');
            value.style.setProperty('min-width', '0', 'important');
            value.style.setProperty('max-width', 'none', 'important');
            value.style.setProperty('margin', '0', 'important');
            value.style.setProperty('margin-left', '0', 'important');
            value.style.setProperty('padding', '0', 'important');
            value.style.setProperty('background', 'transparent', 'important');
            value.style.setProperty('border', 'none', 'important');
            value.querySelectorAll('input, select, .chosen-container, .form-control').forEach((el) => {
              el.style.setProperty('width', '100%', 'important');
              el.style.setProperty('min-width', '0', 'important');
              el.style.setProperty('max-width', 'none', 'important');
            });
          }
          // Chosen 隐藏原生 select，并拉满宽度
          pair.querySelectorAll('.chosen-container').forEach((c) => {
            const prev = c.previousElementSibling;
            if (prev && prev.tagName === 'SELECT') {
              prev.style.setProperty('display', 'none', 'important');
              prev.classList.add('urppp-chosen-hidden');
            }
            const sel = c.parentElement && c.parentElement.querySelector('select');
            if (sel) {
              sel.style.setProperty('display', 'none', 'important');
              sel.classList.add('urppp-chosen-hidden');
            }
            c.style.setProperty('width', '100%', 'important');
            c.style.setProperty('min-width', '0', 'important');
            c.style.setProperty('max-width', 'none', 'important');
            const single = c.querySelector('.chosen-single');
            if (single) {
              single.style.setProperty('width', '100%', 'important');
              single.style.setProperty('max-width', 'none', 'important');
              single.style.setProperty('display', 'flex', 'important');
              single.style.setProperty('align-items', 'center', 'important');
              single.style.setProperty('height', '34px', 'important');
              single.style.setProperty('line-height', 'normal', 'important');
              const sp = single.querySelector(':scope > span, span');
              if (sp) {
                sp.style.setProperty('line-height', 'normal', 'important');
                sp.style.setProperty('height', 'auto', 'important');
                sp.style.setProperty('margin-top', '0', 'important');
                sp.style.setProperty('padding-top', '0', 'important');
              }
              const ab = single.querySelector('div');
              if (ab) {
                ab.style.setProperty('display', 'flex', 'important');
                ab.style.setProperty('align-items', 'center', 'important');
                ab.style.setProperty('justify-content', 'center', 'important');
                ab.style.setProperty('top', '0', 'important');
                ab.style.setProperty('bottom', '0', 'important');
                ab.style.setProperty('height', 'auto', 'important');
                const bb = ab.querySelector('b');
                if (bb) {
                  bb.style.setProperty('margin', '0', 'important');
                  bb.style.setProperty('background-position', 'center center', 'important');
                  bb.style.setProperty('background-size', '12px 12px', 'important');
                  bb.style.setProperty('width', '14px', 'important');
                  bb.style.setProperty('height', '14px', 'important');
                }
              }
            }
          });
        });
      };

      const roots = document.querySelectorAll(
        '.profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)'
      );
      roots.forEach((root) => {
        // 学籍 setLabelWidth 不当查询表单
        if (root.classList.contains('setLabelWidth')) return;
        // 培养方案抽屉详情（学年学期/课组）不当查询表单
        if (root.closest && root.closest('#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa')) return;
        // 个人信息修改等：每行只有一对 name/value，不当查询表单
        const multiPair = Array.from(root.querySelectorAll('.profile-info-row')).some((row) => {
          return Array.from(row.children).filter((el) => el.classList && el.classList.contains('profile-info-name')).length >= 2;
        });
        const hasChosenQuery = !!root.querySelector('select.chosen, select.select, .chosen-container');
        if (!multiPair && !hasChosenQuery) {
          root.classList.remove('urppp-query-form');
          return;
        }
        // 没有可编辑控件也不当查询表单
        if (!root.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')) {
          return;
        }
        root.classList.add('urppp-query-form');
        ensureProfileCardShell(root);

        root.querySelectorAll('.profile-info-row').forEach((row) => {
          if (row.dataset.urpppQueryDone === '1') {
            // 已打包：只校正列数，不要拆重建（防闪烁）
            if (row.querySelector(':scope > .urppp-query-pair')) applyRowLayout(row);
            return;
          }
          const kids = Array.from(row.children).filter((el) =>
            el.classList && (el.classList.contains('profile-info-name') || el.classList.contains('profile-info-value'))
          );
          // 查询卡内：1 对或多对都要包成 pair，否则单字段行会吃到 140px 灰底信息表样式
          const nameValuePairs = [];
          for (let i = 0; i < kids.length; ) {
            const a = kids[i];
            const b = kids[i + 1];
            if (
              a && b &&
              a.classList.contains('profile-info-name') &&
              b.classList.contains('profile-info-value')
            ) {
              nameValuePairs.push([a, b]);
              i += 2;
            } else {
              i += 1;
            }
          }
          if (!nameValuePairs.length) {
            row.dataset.urpppQueryDone = '1';
            return;
          }

          const frag = document.createDocumentFragment();
          // 先放已识别的 pair
          const used = new Set();
          nameValuePairs.forEach(([a, b]) => {
            const pair = document.createElement('div');
            pair.className = 'urppp-query-pair';
            pair.appendChild(a);
            pair.appendChild(b);
            used.add(a);
            used.add(b);
            frag.appendChild(pair);
          });
          // 其余节点（空 name 等）保持顺序追加
          kids.forEach((el) => {
            if (!used.has(el)) frag.appendChild(el);
          });
          while (row.firstChild) row.removeChild(row.firstChild);
          row.appendChild(frag);
          row.dataset.urpppQueryDone = '1';
          applyRowLayout(row);
        });
      });
      ensureQueryChosen();
    } catch (err) {
      console.warn('[URP++] query form beautify failed', err);
    }
  }

  // Chosen 下拉对齐：禁止全量 MutationObserver（会 style 回写死循环卡死页面）
  function patchChosenDropdownAlign() {
    if (window.__urpppChosenAlignBound) return;
    window.__urpppChosenAlignBound = true;
    let busy = false;

    const apply = (root) => {
      if (busy) return;
      busy = true;
      try {
        const scope = root && root.querySelectorAll ? root : document;
        // 选项垂直居中：flex + 内联，并注入最高优先级样式
        let st = document.getElementById('urppp-chosen-li-style');
        if (!st) {
          st = document.createElement('style');
          st.id = 'urppp-chosen-li-style';
          document.documentElement.appendChild(st);
        }
        st.textContent = [
          '.self div.profile-info-value a.chosen-single > span,',
          'body .self div.profile-info-value a.chosen-single > span {',
          '  line-height: normal !important;',
          '  height: auto !important;',
          '  margin-top: 0 !important;',
          '  padding-top: 0 !important;',
          '}',
          '.self div.profile-info-value a.chosen-single,',
          'body .self div.profile-info-value a.chosen-single {',
          '  display: flex !important;',
          '  align-items: center !important;',
          '  height: 34px !important;',
          '  line-height: normal !important;',
          '}',
          'body .chosen-container .chosen-results li,',
          'body .chosen-with-drop .chosen-results li,',
          'html body .chosen-container .chosen-results li.active-result {',
          '  display:flex !important;',
          '  align-items:center !important;',
          '  justify-content:flex-start !important;',
          '  height:36px !important;',
          '  min-height:36px !important;',
          '  max-height:36px !important;',
          '  line-height:1 !important;',
          '  padding:0 12px !important;',
          '  margin:0 !important;',
          '  box-sizing:border-box !important;',
          '}',
          'body .chosen-container .chosen-results li.highlighted,',
          'body .chosen-container .chosen-results li.result-selected {',
          '  display:flex !important;',
          '  align-items:center !important;',
          '  height:36px !important;',
          '  line-height:1 !important;',
          '  padding:0 12px !important;',
          '}'
        ].join('');
        scope.querySelectorAll('.chosen-results li').forEach((li) => {
          li.style.cssText = [
            'display:flex !important',
            'align-items:center !important',
            'justify-content:flex-start !important',
            'height:36px !important',
            'min-height:36px !important',
            'max-height:36px !important',
            'line-height:1 !important',
            'padding:0 12px !important',
            'margin:0 !important',
            'box-sizing:border-box !important'
          ].join(';');
        });
        // 搜索框：只设一次必要样式；图标交给 CSS（相对 input 同高盒子）
        // 关闭态/打开态：强制 chosen-single > span 的 line-height 为 normal
        scope.querySelectorAll('a.chosen-single').forEach((a) => {
          a.style.setProperty('display', 'flex', 'important');
          a.style.setProperty('align-items', 'center', 'important');
          a.style.setProperty('height', '34px', 'important');
          a.style.setProperty('min-height', '34px', 'important');
          a.style.setProperty('line-height', 'normal', 'important');
          a.style.setProperty('padding-top', '0', 'important');
          a.style.setProperty('padding-bottom', '0', 'important');
          const sp = a.querySelector(':scope > span');
          if (sp) {
            sp.style.setProperty('line-height', 'normal', 'important');
            sp.style.setProperty('height', 'auto', 'important');
            sp.style.setProperty('margin-top', '0', 'important');
            sp.style.setProperty('margin-bottom', '0', 'important');
            sp.style.setProperty('padding-top', '0', 'important');
            sp.style.setProperty('padding-bottom', '0', 'important');
          }
        });
        scope.querySelectorAll('.chosen-search').forEach((search) => {
          // 不在打开时改 input padding，避免光标前闪
          // 图标与尺寸交给 CSS 固定规则
          if (!search.querySelector('.urppp-chosen-search-icon')) {
            const icon = document.createElement('i');
            icon.className = 'fa fa-search urppp-chosen-search-icon';
            icon.setAttribute('aria-hidden', 'true');
            search.appendChild(icon);
          }
        });
      } finally {
        // 下一帧再放行，避免同步重入
        setTimeout(() => { busy = false; }, 0);
      }
    };

    // 只在用户打开下拉时跑，不做 body 级 style 观察
    document.addEventListener('mousedown', (e) => {
      const c = e.target && e.target.closest ? e.target.closest('.chosen-container') : null;
      if (!c) return;
      setTimeout(() => apply(c), 0);
      setTimeout(() => apply(c), 30);
      setTimeout(() => apply(c), 100);
      setTimeout(() => apply(c), 200);
    }, true);

    try {
      const $ = window.jQuery || window.$;
      if ($ && $.fn) {
        $(document)
          .off('chosen:showing_dropdown.urppp chosen:updated.urppp')
          .on('chosen:showing_dropdown.urppp chosen:updated.urppp', (e) => {
            const host = e.target && e.target.parentElement ? e.target.parentElement : document;
            setTimeout(() => apply(host), 0);
            setTimeout(() => apply(host), 60);
          });
      }
    } catch (_) {}
  }

  // 作息时间表：轻量美化（不改数据；标题提出为整行居中横幅）
  function beautifyWorkRestSchedule() {
    try {
      const modal = document.getElementById('work_rest_schedule_modal');
      if (!modal) return;
      if (modal.classList.contains('in') || modal.classList.contains('show')) {
        modal.style.setProperty('display', 'block', 'important');
      }
      const body = modal.querySelector('.modal-body') || modal;
      const tables = Array.from(body.querySelectorAll('table'));
      if (!tables.length) return;

      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

      // 已处理过则跳过（避免重复插横幅/重复移出 wrap 造成视觉叠加）
      if (body.dataset.urpppWrsDone === '1') {
        return;
      }
      body.dataset.urpppWrsDone = '1';

      tables.forEach((table) => {
        const wrap = table.closest('.urppp-table-wrap');
        if (wrap && modal.contains(wrap) && wrap.parentElement) {
          wrap.parentElement.insertBefore(table, wrap);
          wrap.remove();
        }

        table.classList.add('urppp-wrs-table');
        table.style.setProperty('width', '100%', 'important');

        const rows = Array.from(table.rows || []);
        if (!rows.length) return;

        // 用“有时间的数据行”估算真实列数，避免被残缺标题行误导
        let colCount = 0;
        rows.forEach((tr) => {
          const rt = norm(tr.textContent);
          if (!/\d{1,2}:\d{2}/.test(rt)) return;
          let n = 0;
          Array.from(tr.cells || []).forEach((c) => { n += (c.colSpan || 1); });
          if (n > colCount) colCount = n;
        });
        if (colCount < 4) {
          // 回退：所有行最大
          rows.forEach((tr) => {
            let n = 0;
            Array.from(tr.cells || []).forEach((c) => { n += (c.colSpan || 1); });
            if (n > colCount) colCount = n;
          });
        }
        if (colCount < 1) colCount = 1;

        // 标题行：提出为表格上方/段前横幅，或改写成单格满宽
        Array.from(table.rows || []).forEach((tr) => {
          const cells = Array.from(tr.cells || []);
          if (!cells.length) return;
          const rowText = norm(tr.textContent);
          const hasTime = /\d{1,2}:\d{2}/.test(rowText);
          const isTitleRow = !hasTime && (
            /作息时间|学年/.test(rowText) ||
            (/(望江|华西|江安)/.test(rowText) && /校区|时间|安排|作息/.test(rowText))
          );

          if (isTitleRow) {
            const titleText = rowText;
            // 直接重写整行：一个满宽单元格（最稳）
            tr.className = 'urppp-wrs-title-row';
            tr.innerHTML = '<td class="urppp-wrs-title" colspan="' + colCount + '" align="center">' + esc(titleText) + '</td>';
            return;
          }

          cells.forEach((cell) => {
            ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'textAlign', 'verticalAlign', 'width']
              .forEach((k) => { try { cell.style[k] = ''; } catch (_) {} });
            cell.classList.remove('urppp-wrs-title', 'urppp-wrs-period', 'urppp-wrs-time', 'urppp-wrs-head');
            const t = norm(cell.textContent);
            if (!t) return;
            if (/^(上午|下午|晚上|中午)$/.test(t) || ((cell.rowSpan || 1) > 1 && /上午|下午|晚上|中午/.test(t))) {
              cell.classList.add('urppp-wrs-period');
            } else if (/节次|大节|时间|校区/.test(t) && !/\d{1,2}:\d{2}/.test(t) && !/第\d/.test(t)) {
              if (/节次|时间|大节|校区/.test(rowText) && !/\d{1,2}:\d{2}/.test(rowText)) {
                cell.classList.add('urppp-wrs-head');
              }
            } else if (/\d{1,2}:\d{2}/.test(t)) {
              cell.classList.add('urppp-wrs-time');
            }
            cell.style.setProperty('text-align', 'center', 'important');
            cell.style.setProperty('vertical-align', 'middle', 'important');
          });
        });
      });

      // 弹窗标题也强制居中
      const mt = modal.querySelector('.modal-title');
      if (mt) {
        mt.style.setProperty('text-align', 'center', 'important');
        mt.style.setProperty('width', '100%', 'important');
      }
      body.dataset.urpppWrsDone = '1';
    } catch (_) {}
  }

  // 学校校历：重定向到教务处新页面
  const SCHOOL_CALENDAR_URL = 'https://jwc.scu.edu.cn/cdxl.htm';
  function patchSchoolCalendarLink() {
    const selectors = [
      'a[onclick*="jwc.scu.edu.cn/article/206"]',
      'a[href*="jwc.scu.edu.cn/article/206"]',
      '.cdsj a',
      '.ace-nav a'
    ];
    const seen = new Set();
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((a) => {
        if (seen.has(a)) return;
        seen.add(a);
        const text = (a.textContent || '').replace(/\s+/g, '');
        const onclick = a.getAttribute('onclick') || '';
        const href = a.getAttribute('href') || '';
        const isCalendar =
          text.includes('学校校历') ||
          onclick.includes('article/206') ||
          href.includes('article/206') ||
          (onclick.includes('jwc.scu.edu.cn') && text.includes('校历'));
        if (!isCalendar) return;
        a.setAttribute('href', SCHOOL_CALENDAR_URL);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.setAttribute('onclick', `window.open('${SCHOOL_CALENDAR_URL}');return false;`);
      });
    });
  }
  // 方案成绩等页：ACE 用 navbar-static 包 nav-tabs，清内联背景/负 margin
  function patchAceTabNavbars() {
    document.querySelectorAll('#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static').forEach((nav) => {
      if (!nav.querySelector('.nav-tabs')) return;
      // 外壳透明，避免与 nav-tabs 叠出第二条
      ['background', 'background-color', 'background-image', 'border', 'border-radius', 'box-shadow'].forEach((p) => {
        nav.style.setProperty(p, p.startsWith('background') || p === 'box-shadow' ? (p === 'box-shadow' ? 'none' : 'transparent') : (p === 'border' ? 'none' : '0'), 'important');
      });
      nav.style.setProperty('background', 'transparent', 'important');
      nav.style.setProperty('background-color', 'transparent', 'important');
      nav.style.setProperty('border', 'none', 'important');
      nav.style.setProperty('border-radius', '0', 'important');
      nav.style.setProperty('box-shadow', 'none', 'important');
      nav.style.setProperty('width', '100%', 'important');
      nav.style.setProperty('margin', '0 0 14px 0', 'important');
      nav.style.setProperty('padding', '0', 'important');
      nav.style.setProperty('min-height', '0', 'important');
      nav.style.setProperty('box-sizing', 'border-box', 'important');
      const inner = nav.querySelector('.navbar-inner');
      if (inner) {
        inner.style.setProperty('background', 'transparent', 'important');
        inner.style.setProperty('border', 'none', 'important');
        inner.style.setProperty('box-shadow', 'none', 'important');
        inner.style.setProperty('padding', '0', 'important');
        inner.style.setProperty('min-height', '0', 'important');
        inner.style.setProperty('filter', 'none', 'important');
        inner.style.setProperty('width', '100%', 'important');
      }
      nav.querySelectorAll('.container, .container-fluid').forEach((c) => {
        c.style.setProperty('width', '100%', 'important');
        c.style.setProperty('max-width', '100%', 'important');
        c.style.setProperty('margin', '0', 'important');
        c.style.setProperty('margin-left', '0', 'important');
        c.style.setProperty('padding', '0', 'important');
        c.style.setProperty('background', 'transparent', 'important');
        c.style.setProperty('box-sizing', 'border-box', 'important');
      });
      const tabs = nav.querySelector('.nav-tabs');
      if (tabs) {
        tabs.style.setProperty('width', '100%', 'important');
        tabs.style.setProperty('margin', '0', 'important');
        tabs.style.setProperty('padding', '8px 10px', 'important');
        tabs.style.setProperty('background', 'var(--surface)', 'important');
        tabs.style.setProperty('background-color', 'var(--surface)', 'important');
        tabs.style.setProperty('border', urpppCardBorderValue(), 'important');
        tabs.style.setProperty('border-radius', '12px', 'important');
        tabs.style.setProperty('box-sizing', 'border-box', 'important');
      }
    });
  }
  // 培养方案等页：百分比放在主文字下方；粗细适中；0% 仅空轨道
  function restyleInfoboxPercentages() {
    const readPct = (box) => {
      let pct = NaN;
      const list = [
        box.getAttribute('data-percent'),
        box.querySelector('[data-percent]')?.getAttribute('data-percent'),
        box.querySelector('.percent')?.textContent,
        box.querySelector('.urppp-pct-text')?.textContent,
      ];
      for (const c of list) {
        if (c == null || c === '') continue;
        const n = parseFloat(String(c).replace(/[^\d.]/g, ''));
        if (!Number.isNaN(n)) { pct = n; break; }
      }
      if (Number.isNaN(pct)) {
        const m = (box.textContent || '').match(/(\d+(?:\.\d+)?)\s*%/);
        if (m) pct = parseFloat(m[1]);
      }
      if (Number.isNaN(pct)) {
        const wEl = box.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');
        if (wEl) {
          const m = String(wEl.style.width || '').match(/([\d.]+)%/);
          if (m) pct = parseFloat(m[1]);
        }
      }
      if (Number.isNaN(pct)) return null;
      return Math.max(0, Math.min(100, pct));
    };

    document.querySelectorAll('.infobox').forEach((box) => {
      const pct = readPct(box);
      if (pct == null) return;

      // 清 ACE 原生进度结构
      box.querySelectorAll('canvas').forEach((c) => c.remove());
      box.querySelectorAll('.easy-pie-chart, .percentage, .infobox-progress').forEach((el) => {
        if (el.classList.contains('urppp-pct-bar')) return;
        el.remove();
      });
      // 清旧注入，避免重复
      box.querySelectorAll('.urppp-pct-text, .urppp-pct-bar').forEach((el) => el.remove());

      // 主文字容器：进度放在主文字上面
      const data = box.querySelector('.infobox-data') || box;

      const textEl = document.createElement('div');
      textEl.className = 'urppp-pct-text';
      textEl.textContent = Math.round(pct) + '%';

      const bar = document.createElement('div');
      bar.className = 'urppp-pct-bar' + (pct <= 0 ? ' is-empty' : '');
      if (pct > 0) {
        const fill = document.createElement('span');
        fill.className = 'urppp-pct-fill';
        fill.style.width = pct + '%';
        bar.appendChild(fill);
      }

      // 插到最前：百分比 -> 进度条 -> 原主文字
      data.insertBefore(bar, data.firstChild);
      data.insertBefore(textEl, data.firstChild);
      box.dataset.urpppPctDone = '1';
    });
  }
  // 培养方案展示：zTree 安静可读版（防闪 + 分片美化 + 全开不卡）
  function beautifyPlanTree(opts) {
    const tree = document.getElementById('treeDemo');
    if (!tree) return;
    const force = !!(opts && opts.force);
    if (tree.dataset.urpppBusy === '1' && !(opts && opts.ignoreBusy)) return;

    const shell = tree.closest('div[style*="border"]') || tree.closest('#tree_div')?.parentElement || tree.parentElement;
    if (shell) shell.classList.add('urppp-plan-tree-shell');
    tree.classList.add('urppp-ztree');

    const pageWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const getZTree = () => {
      try {
        const $ = pageWin.jQuery || pageWin.$ || window.jQuery || window.$;
        return $?.fn?.zTree?.getZTreeObj?.('treeDemo') || null;
      } catch (_) {
        return null;
      }
    };
    const collapseAllDom = () => {
      // 自底向上点 open switch，避免父先收导致子 switch 找不到
      const opens = Array.from(tree.querySelectorAll('span.button.switch[class*="_open"]'))
        .filter((sw) => !/_docu\b/.test(sw.className));
      opens.reverse().forEach((sw) => {
        try { sw.click(); } catch (_) {}
      });
      return opens.length > 0;
    };
    const collapseAll = () => {
      const zTree = getZTree();
      if (zTree) {
        try { zTree.expandAll(false); } catch (_) {}
      }
      // API 失败或未完全收起时，DOM 兜底
      if (tree.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')) {
        collapseAllDom();
      }
      return true;
    };

    if (!window.__urpppExpandKzPatched) {
      window.__urpppExpandKzPatched = true;
      const patch = () => {
        const g = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        try { g.expandKzByRule = function () { if (!tree.dataset.urpppUserExpanded) collapseAll(); }; } catch (_) {}
      };
      patch();
      setTimeout(patch, 0);
      setTimeout(patch, 200);
    }
    if (!tree.dataset.urpppCollapsedOnce) {
      tree.dataset.urpppCollapsedOnce = '1';
      [0, 80, 200, 500, 1000].forEach((ms) => setTimeout(() => {
        if (!tree.dataset.urpppUserExpanded) collapseAll();
      }, ms));
    }

    // 标题图例只做一次
    const header = document.querySelector('#two h4.header, #two .header');
    if (header && !header.dataset.urpppLegendDone) {
      const font = header.querySelector('font');
      if (font) {
        const legend = document.createElement('div');
        legend.className = 'urppp-plan-legend';
        legend.innerHTML = [
          '<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>',
          '<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>',
          '<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>',
          '<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>',
          '<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>',
        ].join('');
        font.replaceWith(legend);
      }
      header.classList.add('urppp-plan-header');
      header.dataset.urpppLegendDone = '1';
    }

    const pauseObs = () => {
      tree.dataset.urpppBusy = '1';
      if (window.__urpppPlanTreeObs) {
        try { window.__urpppPlanTreeObs.disconnect(); } catch (_) {}
      }
    };
    const resumeObs = () => {
      tree.dataset.urpppBusy = '0';
      const host = document.getElementById('tree_div') || tree;
      if (window.__urpppPlanTreeObs && host) {
        try { window.__urpppPlanTreeObs.observe(host, { childList: true, subtree: true }); } catch (_) {}
      }
    };

    const formatNodeHtml = (raw) => {
      let html = raw;
      html = html.replace(/\((最低修读学分:[^)]+)\)/g, (_, body) => {
        const parts = body.split(',').map((p) => p.trim()).filter(Boolean);
        const keep = [];
        parts.forEach((p) => {
          if (/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(p)) keep.push(p);
        });
        const list = (keep.length ? keep : parts).map((p) => {
          const m = p.match(/^([^:：]+)[:：]\s*(.+)$/);
          if (!m) return p;
          const key = m[1].trim();
          const val = m[2].trim();
          let cls = 'neutral';
          if (/通过|已及格/.test(key)) cls = 'ok';
          else if (/未修读|未及格/.test(key)) cls = Number(val) > 0 ? 'warn' : 'muted';
          else if (/最低/.test(key)) cls = 'req';
          return `<span class="urppp-kv ${cls}"><em>${key}</em><b>${val}</b></span>`;
        }).join('');
        return `<span class="urppp-sub">${list}</span>`;
      });
      html = html.replace(/\[(\d{6,})\]/g, '<span class="urppp-code">$1</span>');
      html = html.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g, '<span class="urppp-meta">$1</span>');
      html = html.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g, (_, type, body) => {
        const sc = String(body).trim();
        const m = sc.match(/^(.+?)(?:\((\d{6,8})\))?$/);
        const grade = (m ? m[1] : sc).trim();
        const date = m && m[2] ? m[2] : '';
        const num = parseFloat(grade);
        let pass = false;
        if (!Number.isNaN(num)) pass = num >= 60;
        else if (/不及格|未通过|不通过/.test(grade)) pass = false;
        else if (/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(grade)) pass = true;
        else pass = true;
        const dateHtml = date ? `<i>${date}</i>` : '';
        return `<span class="urppp-score ${pass ? 'pass' : 'fail'}"><b>${type}</b><em>${grade}</em>${dateHtml}</span>`;
      });
      html = html.replace(
        /(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,
        '$1<span class="urppp-title">$2</span>'
      );
      // 课组名：图标后到 sub 前；去掉 &nbsp; 残留，避免双行撑高
      html = html.replace(
        /(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,
        '$1 <span class="urppp-gname">$2</span>'
      );
      // 若 gname 已存在仍残留纯文本，清掉
      html = html.replace(
        /(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,
        '$1 '
      );
      return html;
    };

    const markStatus = (a) => {
      const icon = a.querySelector('i.fa, i.ace-icon');
      const li = a.closest('li');
      if (!li) return;
      li.classList.remove('urppp-node-done', 'urppp-node-todo', 'urppp-node-pass', 'urppp-node-fail', 'urppp-node-pending');
      if (!icon) return;
      if (icon.classList.contains('fa-check-square-o')) li.classList.add('urppp-node-done');
      else if (icon.classList.contains('fa-smile-o')) li.classList.add('urppp-node-pass');
      else if (icon.classList.contains('fa-frown-o')) li.classList.add('urppp-node-fail');
      else if (icon.classList.contains('fa-meh-o')) li.classList.add('urppp-node-pending');
      else if (icon.classList.contains('fa-kz')) li.classList.add('urppp-node-todo');
    };

    const paintOne = (a) => {
      if (!a || (!force && a.dataset.urpppNodeDone === '1')) return false;
      markStatus(a);
      const span = a.querySelector('span.node_name') || a;
      if (!span) return false;
      if (!force && span.querySelector('.urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname')) {
        a.dataset.urpppNodeDone = '1';
      } else {
        let raw = span.dataset.urpppRaw;
        if (!raw) {
          // 已格式化过就别再当 raw
          if (span.querySelector('.urppp-score, .urppp-code, .urppp-sub')) {
            a.dataset.urpppNodeDone = '1';
            raw = null;
          } else {
            raw = span.innerHTML;
            if (raw) span.dataset.urpppRaw = raw;
          }
        }
        if (raw) {
          span.innerHTML = formatNodeHtml(raw);
          a.dataset.urpppNodeDone = '1';
        }
      }
      const sw = a.parentElement && a.parentElement.querySelector(':scope > span.button.switch');
      if (sw) {
        if (!sw.dataset.urpppSw) {
          sw.dataset.urpppSw = '1';
          if (/_docu\b/.test(sw.className)) {
            sw.classList.add('urppp-switch-leaf');
            sw.style.setProperty('display', 'none', 'important');
          }
        }
        if (/_docu\b/.test(sw.className) || sw.classList.contains('urppp-switch-leaf')) {
          a.classList.remove('urppp-expandable');
        } else {
          a.classList.add('urppp-expandable');
        }
      }
      return true;
    };

    const paintList = (list, done) => {
      const arr = Array.from(list || []);
      let i = 0;
      const step = () => {
        const end = Math.min(i + 48, arr.length);
        for (; i < end; i++) paintOne(arr[i]);
        if (i < arr.length) {
          if (window.requestIdleCallback) requestIdleCallback(step, { timeout: 120 });
          else setTimeout(step, 0);
        } else if (done) {
          done();
        }
      };
      step();
    };

    const paintScopeSync = (rootEl) => {
      const scope = rootEl || tree;
      scope.querySelectorAll('span.button.switch:not([data-urppp-sw])').forEach((sw) => {
        sw.dataset.urpppSw = '1';
        if (/_docu\b/.test(sw.className)) {
          sw.classList.add('urppp-switch-leaf');
          sw.style.setProperty('display', 'none', 'important');
        }
      });
      scope.querySelectorAll('li > a').forEach((a) => paintOne(a));
    };

    pauseObs();
    try {
      // 首次/增量：只处理未完成节点
      paintScopeSync(tree);

      // 整行点击：同步美化子节点，避免首帧闪未美化样式
      if (!tree.dataset.urpppExpandClick) {
        tree.dataset.urpppExpandClick = '1';
        tree.addEventListener('click', (e) => {
          if (e.target.closest && e.target.closest('span.button.switch')) {
            // 点小三角：同样同步美化，防闪
            const sw0 = e.target.closest('span.button.switch');
            const li0 = sw0 && sw0.parentElement;
            if (!li0 || /_docu\b/.test(sw0.className)) return;
            tree.dataset.urpppUserExpanded = '1';
            tree.dataset.urpppBusy = '1';
            if (window.__urpppPlanTreeObs) {
              try { window.__urpppPlanTreeObs.disconnect(); } catch (_) {}
            }
            // 让原生先展开，再在同一事件循环末尾同步上色
            setTimeout(() => {
              paintScopeSync(li0);
              tree.dataset.urpppBusy = '0';
              const host = document.getElementById('tree_div') || tree;
              if (window.__urpppPlanTreeObs && host) {
                try { window.__urpppPlanTreeObs.observe(host, { childList: true, subtree: true }); } catch (_) {}
              }
            }, 0);
            return;
          }
          const a = e.target && e.target.closest ? e.target.closest('li > a') : null;
          if (!a || !tree.contains(a)) return;
          const li = a.parentElement;
          if (!li) return;
          const sw = li.querySelector(':scope > span.button.switch');
          if (!sw || /_docu\b/.test(sw.className) || sw.classList.contains('urppp-switch-leaf')) return;
          if (!a.classList.contains('urppp-expandable') && !/_open|_close/.test(sw.className)) return;

          e.preventDefault();
          e.stopImmediatePropagation();
          tree.dataset.urpppUserExpanded = '1';
          tree.dataset.urpppBusy = '1';
          if (window.__urpppPlanTreeObs) {
            try { window.__urpppPlanTreeObs.disconnect(); } catch (_) {}
          }
          sw.click();
          // 同步美化刚展开子节点（单课组量小，不卡；且无首帧闪烁）
          paintScopeSync(li);
          tree.dataset.urpppBusy = '0';
          const host = document.getElementById('tree_div') || tree;
          if (window.__urpppPlanTreeObs && host) {
            try { window.__urpppPlanTreeObs.observe(host, { childList: true, subtree: true }); } catch (_) {}
          }
        }, true);
      }

      // 打开/关闭全部：接管按钮；关闭必须可靠（API + DOM 兜底）
      const bindAll = (id, expand) => {
        const btn = document.getElementById(id);
        if (!btn || btn.dataset.urpppBound === '1') return false;
        btn.dataset.urpppBound = '1';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          tree.dataset.urpppUserExpanded = '1';
          pauseObs();
          try {
            const zTree = getZTree();
            if (expand) {
              if (zTree) zTree.expandAll(true);
              else {
                tree.querySelectorAll('span.button.switch[class*="_close"]').forEach((sw) => {
                  if (!/_docu\b/.test(sw.className)) sw.click();
                });
              }
              const pending = tree.querySelectorAll('li > a:not([data-urppp-node-done="1"])');
              paintList(pending, resumeObs);
            } else {
              // 关闭：优先 API，再 DOM 兜底，确保一定收起
              if (zTree) {
                try { zTree.expandAll(false); } catch (_) {}
              }
              collapseAllDom();
              // 再保险一次，部分 zTree 版本 expandAll(false) 不完全
              setTimeout(() => {
                if (tree.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')) {
                  collapseAllDom();
                }
                resumeObs();
              }, 0);
            }
          } catch (_) {
            if (!expand) collapseAllDom();
            resumeObs();
          }
        }, true);
        return true;
      };
      // 按钮可能在 tab 切换后才出现，允许重复尝试绑定
      bindAll('expandAllBtn', true);
      bindAll('collapseAllBtn', false);
      if (!tree.dataset.urpppAllBtnsRetry) {
        tree.dataset.urpppAllBtnsRetry = '1';
        setTimeout(() => { bindAll('expandAllBtn', true); bindAll('collapseAllBtn', false); }, 300);
        setTimeout(() => { bindAll('expandAllBtn', true); bindAll('collapseAllBtn', false); }, 1000);
      }
    } finally {
      requestAnimationFrame(() => {
        requestAnimationFrame(resumeObs);
      });
    }
  }
  // 表格外框 wrapper：圆角 + 完整四边线

  // 评估公告 / 通知列表：
  // 真实结构多为 3 列 tr: 圆点 | 标题链接 | 日期（也可能单 td 多 span）

  // 本学期周课表：收束周次滑条；课程块相对父 td（拦截站点 divBuild，避免右闪）
  function fixWeekScheduleLayout() {
    if (isNativePdfIsolationActive()) return;
    try {
      const box = document.getElementById('soliderbox');
      if (box) {
        box.style.setProperty('width', '100%', 'important');
        box.style.setProperty('max-width', '720px', 'important');
        box.style.setProperty('min-width', '0', 'important');
        box.classList.remove('container');
        const row = box.closest('.profile-info-row');
        if (row) {
          row.style.setProperty('display', 'flex', 'important');
          row.style.setProperty('align-items', 'center', 'important');
          row.style.setProperty('width', '100%', 'important');
          row.style.setProperty('max-width', '100%', 'important');
        }
        const val = box.closest('.profile-info-value');
        if (val) {
          val.style.setProperty('width', 'auto', 'important');
          val.style.setProperty('max-width', '100%', 'important');
          val.style.setProperty('flex', '1 1 auto', 'important');
          val.style.setProperty('min-width', '0', 'important');
        }
      }

      const host = document.getElementById('mycoursetable');
      if (!host) return;
      const mobileSchedule = !!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches);
      host.classList.toggle('urppp-mobile-schedule-scroll', mobileSchedule);
      host.style.setProperty('position', 'relative', 'important');
      host.style.setProperty('width', '100%', 'important');

      // 移动端先给课表稳定列宽，避免窄列换行反向抬高整张课表。
      let unitH = 72;
      if (!mobileSchedule) {
        host.querySelectorAll('#courseTableBody tr, table tbody tr').forEach((tr) => {
          const h = tr.offsetHeight || 0;
          if (h > unitH) unitH = h;
        });
      }
      // 若行还没内容高度，保持 72
      if (unitH < 56) unitH = 72;

      // 先按 classNum 内容需要抬高 unitH（用 scrollHeight 但不改 position）
      host.querySelectorAll('div.class_div').forEach((div) => {
        const n = parseInt(div.getAttribute('classNum') || '1', 10) || 1;
        // 当前若已有宽度，scrollHeight 可用
        const h = div.scrollHeight || 0;
        if (h > 0) {
          const required = Math.ceil(h / n);
          unitH = mobileSchedule
            ? Math.max(unitH, Math.min(required, 88))
            : Math.max(unitH, required);
        }
      });
      if (mobileSchedule) {
        unitH = Math.min(Math.max(unitH, 72), 88);
      } else {
        if (unitH < 64) unitH = 72;
        if (unitH > 160) unitH = 120; // 防止异常撑爆
      }

      host.querySelectorAll('#courseTableBody tr, table tbody tr').forEach((tr) => {
        tr.style.setProperty('height', unitH + 'px', 'important');
      });

      host.querySelectorAll('td').forEach((td) => {
        const blocks = Array.from(td.querySelectorAll(':scope > div.class_div'));
        if (!blocks.length) return;
        td.style.setProperty('position', 'relative', 'important');
        td.style.setProperty('vertical-align', 'top', 'important');
        td.style.setProperty('overflow', 'visible', 'important');

        const tdWidth = td.getBoundingClientRect().width || td.offsetWidth || td.clientWidth || 0;
        const tdStyle = getComputedStyle(td);
        const table = td.closest('table');
        const tableStyle = table ? getComputedStyle(table) : null;
        const borderWidth = parseFloat(tdStyle.borderLeftWidth) || 0;
        const leftEdgeOffset = tableStyle && tableStyle.borderCollapse === 'collapse' ? borderWidth / 2 : borderWidth;
        const laneCount = Math.max(1, blocks.length);
        blocks.forEach((div, idx) => {
          const n = parseInt(div.getAttribute('classNum') || '1', 10) || 1;
          const geometry = scheduleCardLaneGeometry(tdWidth, laneCount, idx, leftEdgeOffset);
          const left = geometry.left;
          const width = geometry.width;
          // 直接写最终几何；最后一栏与单元格右边界严格重合，不预留视觉缝隙。
          div.style.setProperty('position', 'absolute', 'important');
          div.style.setProperty('top', '0px', 'important');
          div.style.setProperty('left', left + 'px', 'important');
          div.style.setProperty('right', 'auto', 'important');
          div.style.setProperty('bottom', 'auto', 'important');
          div.style.setProperty('transform', 'none', 'important');
          div.style.setProperty('width', width + 'px', 'important');
          div.style.setProperty('max-width', 'none', 'important');
          div.style.setProperty('height', (unitH * n) + 'px', 'important');
          div.style.setProperty('margin', '0', 'important');
          div.style.setProperty('box-sizing', 'border-box', 'important');
          div.style.setProperty('z-index', '2', 'important');
          div.style.setProperty('overflow', 'hidden', 'important');
        });
      });
    } catch (err) {
      console.warn('[URP++] week schedule fix failed', err);
    }
  }

  function patchSiteDivBuild() {
    try {
      const g = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
      if (!g || g.__urpppDivBuildPatched) return;
      // 可能尚未定义，稍后重试
      if (typeof g.divBuild !== 'function') return;
      g.__urpppDivBuildPatched = true;
      const orig = g.divBuild;
      g.__urpppOriginalDivBuild = orig;
      g.divBuild = function () {
        // 站点原逻辑用整页 offset，会把课先甩到右侧再被我们纠正 → 闪烁
        // 直接走我们的相对 td 布局
        try {
          fixWeekScheduleLayout();
        } catch (e) {
          try { return orig.apply(this, arguments); } catch (_) { /* ignore */ }
        }
      };
      // jQuery resize 也会调 divBuild；保持函数名
      try { g.divBuild._urppp = true; } catch (_) { /* ignore */ }
    } catch (err) {
      console.warn('[URP++] patch divBuild failed', err);
    }
  }

  let weekScheduleObserverEntry = null;
  let weekScheduleGlobalBound = false;

  function scheduleWeekScheduleFix() {
    const host = document.getElementById('mycoursetable') || document.getElementById('page-content-template') || document.body;
    if (weekScheduleObserverEntry && weekScheduleObserverEntry.root === host && host?.isConnected) {
      fixWeekScheduleLayout();
      return;
    }
    if (weekScheduleObserverEntry) weekScheduleObserverEntry.disconnect();
    weekScheduleObserverEntry = null;
    const bindGlobals = !weekScheduleGlobalBound;
    weekScheduleGlobalBound = true;
    let busy = false;
    const run = () => {
      if (busy || isNativePdfIsolationActive()) return;
      if (!document.getElementById('soliderbox') && !document.getElementById('mycoursetable')) return;
      busy = true;
      try {
        patchSiteDivBuild();
        fixWeekScheduleLayout();
      } finally {
        setTimeout(() => { busy = false; }, 40);
      }
    };
    // 尽早 patch，减少首帧错位
    patchSiteDivBuild();
    ;[0, 50, 150, 400, 1000, 2000].forEach((ms) => setTimeout(() => {
      patchSiteDivBuild();
      run();
    }, ms));

    if (bindGlobals) window.addEventListener('resize', () => {
      clearTimeout(window.__urpppWeekSchedResize);
      window.__urpppWeekSchedResize = setTimeout(run, 120);
    });

    // 新 class_div 一插入立刻钉到 left:0，避免先显示站点大 offset
    const pinNew = (node) => {
      if (!node || isNativePdfIsolationActive()) return;
      const list = [];
      if (node.nodeType === 1) {
        if (node.matches && node.matches('div.class_div')) list.push(node);
        if (node.querySelectorAll) node.querySelectorAll('div.class_div').forEach((el) => list.push(el));
      }
      list.forEach((div) => {
        const td = div.parentElement;
        if (td && td.tagName === 'TD') {
          td.style.setProperty('position', 'relative', 'important');
        }
        // 先钉在格内左上，稍后 run 再算半宽/高度
        div.style.setProperty('position', 'absolute', 'important');
        div.style.setProperty('top', '0px', 'important');
        div.style.setProperty('left', '0px', 'important');
        div.style.setProperty('right', 'auto', 'important');
        div.style.setProperty('transform', 'none', 'important');
        div.style.setProperty('width', '100%', 'important');
        div.style.setProperty('margin', '0', 'important');
        div.style.setProperty('box-sizing', 'border-box', 'important');
      });
    };

    const obs = new MutationObserver((muts) => {
      if (isNativePdfIsolationActive()) return;
      let need = false;
      muts.forEach((m) => {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            pinNew(n);
            need = true;
          });
        }
        // 站点 divBuild 会改 style left/top —— 立刻打回相对定位
        if (m.type === 'attributes' && m.attributeName === 'style' && m.target && m.target.classList && m.target.classList.contains('class_div')) {
          const div = m.target;
          const left = div.style.left || '';
          // 若 left 是很大的页坐标（如 800px+）或含异常值，立即钉回
          const px = parseFloat(left);
          if (!left || left === 'auto' || (Number.isFinite(px) && px > 200)) {
            div.style.setProperty('left', '0px', 'important');
            div.style.setProperty('top', '0px', 'important');
            div.style.setProperty('position', 'absolute', 'important');
          }
          need = true;
        }
      });
      if (!need) return;
      clearTimeout(window.__urpppWeekSchedMut);
      // 用 rAF 尽快布局，减少可见闪烁
      window.__urpppWeekSchedMut = setTimeout(() => {
        requestAnimationFrame(run);
      }, 16);
    });
    if (host) {
      obs.observe(host, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      let resizeObserver = null;
      let resizeFrame = 0;
      let resizeSettleTimer = 0;
      if (host.id === 'mycoursetable' && typeof window.ResizeObserver === 'function') {
        let observedWidth = host.getBoundingClientRect().width || 0;
        resizeObserver = new window.ResizeObserver((entries) => {
          const width = entries[0]?.contentRect?.width || host.getBoundingClientRect().width || 0;
          if (!width || Math.abs(width - observedWidth) < 0.5) return;
          observedWidth = width;
          if (!resizeFrame) {
            resizeFrame = requestAnimationFrame(() => {
              resizeFrame = 0;
              run();
            });
          }
          clearTimeout(resizeSettleTimer);
          resizeSettleTimer = setTimeout(run, 80);
        });
        resizeObserver.observe(host);
      }

      weekScheduleObserverEntry = {
        root: host,
        observer: obs,
        disconnect() {
          obs.disconnect();
          if (resizeObserver) resizeObserver.disconnect();
          if (resizeFrame) cancelAnimationFrame(resizeFrame);
          clearTimeout(resizeSettleTimer);
        },
      };
    }
    if (bindGlobals) document.addEventListener('mouseup', () => {
      if (!document.getElementById('soliderbox')) return;
      setTimeout(run, 200);
      setTimeout(run, 500);
    }, true);
  }

  // 学籍页培养方案抽屉：强制左树 / 右详情，每次打开都归位，禁止交错
  function beautifyCurriculumDrawer() {
    try {
      // 仅学籍页 #curriculumInfo-divcon2 做左右栏重组。
      // 培养方案查询页是 #curriculumInfo-divcon（无 2），结构不同，重组会毁掉主列表页。
      const panel = document.getElementById('curriculumInfo-divcon2');
      if (!panel) return;
      const w = parseFloat(panel.style.width || getComputedStyle(panel).width || '0');
      if (!w || w < 40) return;
      panel.classList.add('urppp-curriculum-drawer');

      const body = panel.querySelector('.modal-body');
      if (!body) return;
      // 真实结构：.modal-body > .col-xs-12 > .row
      const host =
        body.querySelector(':scope > .col-xs-12 > .row') ||
        body.querySelector('.col-xs-12 > .row') ||
        body.querySelector('.row');
      if (!host) return;
      host.classList.add('urppp-drawer-layout');

      // 工具条
      let toolbar = host.querySelector(':scope > .urppp-drawer-toolbar, :scope > p');
      if (toolbar && toolbar.tagName === 'P') toolbar.classList.add('urppp-drawer-toolbar');

      // 确保外壳
      let bodyWrap = host.querySelector(':scope > .urppp-drawer-body');
      let left = host.querySelector('.urppp-drawer-left');
      let right = host.querySelector('.urppp-drawer-right');
      if (!bodyWrap) {
        bodyWrap = document.createElement('div');
        bodyWrap.className = 'urppp-drawer-body';
      }
      if (!left) {
        left = document.createElement('div');
        left.className = 'urppp-drawer-left';
      }
      if (!right) {
        right = document.createElement('div');
        right.className = 'urppp-drawer-right';
      }
      if (!bodyWrap.contains(left)) bodyWrap.appendChild(left);
      if (!bodyWrap.contains(right)) bodyWrap.appendChild(right);
      if (bodyWrap.parentElement !== host) {
        // 插到 toolbar 后
        if (toolbar && toolbar.parentElement === host) host.insertBefore(bodyWrap, toolbar.nextSibling);
        else host.appendChild(bodyWrap);
      }
      // toolbar 置顶
      if (toolbar && host.firstElementChild !== toolbar) host.insertBefore(toolbar, host.firstElementChild);

      // 找树列：含 #treeDemo / .ztree 的最近 col
      const treeEl = host.querySelector('#treeDemo, .ztree') || panel.querySelector('#treeDemo, .ztree');
      let treeCol = null;
      if (treeEl) {
        treeCol = treeEl.closest('.col-xs-6, .col-sm-6, .widget-box') || treeEl.parentElement;
        // 若点到 widget-box，用外层 col
        const col = treeEl.closest('.col-xs-6, .col-sm-6');
        if (col) treeCol = col;
      }

      // 详情块按 id 强制收集（最稳）
      const detailIds = ['fajh', 'xnxq', 'kz', 'kc', 'kcfa'];
      const details = detailIds
        .map((id) => document.getElementById(id))
        .filter((el) => el && panel.contains(el));

      // 左栏只保留树
      if (treeCol && treeCol.parentElement !== left) left.appendChild(treeCol);
      // 清掉左栏里误入的详情
      Array.from(left.children).forEach((child) => {
        if (detailIds.includes(child.id) || (child.id && detailIds.includes(child.id))) {
          right.appendChild(child);
        } else if (child !== treeCol && child.querySelector && !child.querySelector('#treeDemo, .ztree')) {
          // 非树节点挪到右栏（避免脏节点）
          if (child.classList && child.classList.contains('col-xs-6')) right.appendChild(child);
        }
      });

      // 右栏按固定顺序放详情，全部 100% 宽一列
      detailIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el || !panel.contains(el)) return;
        if (el.parentElement !== right) right.appendChild(el);
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('max-width', '100%', 'important');
        el.style.setProperty('float', 'none', 'important');
        el.style.setProperty('margin', '0', 'important');
        el.style.setProperty('padding', '0', 'important');
        el.style.setProperty('box-sizing', 'border-box', 'important');
        if (el.style.display !== 'none') {
          const cs = getComputedStyle(el);
          if (cs.display !== 'none') el.style.setProperty('display', 'block', 'important');
        }
      });

      // 首次打开：#fajh 常异步填充，先预留右栏占位，避免“只有树再闪出详情”
      const fajh = document.getElementById('fajh');
      if (fajh && panel.contains(fajh)) {
        if (fajh.parentElement !== right) right.appendChild(fajh);
        // 若还是空壳，放一个轻量骨架，等 fillFajh 覆盖
        const empty = !fajh.innerHTML || !fajh.innerHTML.trim();
        if (empty && !fajh.querySelector('.urppp-drawer-skeleton, .profile-user-info, .widget-box')) {
          fajh.innerHTML = [
            "<div class='widget-box transparent urppp-drawer-skeleton'>",
            "  <div class='widget-header widget-header-small'>",
            "    <h4 class='widget-title smaller grey'>方案计划信息</h4>",
            "  </div>",
            "</div>",
            "<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>",
            "  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>",
            "</div>"
          ].join('');
          fajh.style.setProperty('display', 'block', 'important');
          fajh.dataset.urpppSkeleton = '1';
        }
        // 站点 fillFajh 写入后清 skeleton 标记
        if (fajh.dataset.urpppSkeleton === '1' && fajh.querySelector('.profile-info-value') && /方案名称|计划名称|年级|院系/.test(fajh.textContent || '')) {
          delete fajh.dataset.urpppSkeleton;
          fajh.querySelectorAll('.urppp-drawer-skeleton, .urppp-drawer-skeleton-card').forEach((n) => n.remove());
        }
        if (fajh.innerHTML && fajh.innerHTML.trim() && fajh.style.display === 'none') {
          // 有内容却被 none：首开闪烁场景，直接显示
          if (fajh.dataset.urpppSkeleton === '1' || fajh.querySelector('.profile-user-info')) {
            fajh.style.setProperty('display', 'block', 'important');
          }
        }
      }
      // 右栏始终占位，避免左树先独大再缩回去
      right.style.setProperty('min-height', '240px', 'important');
      left.style.setProperty('min-height', '240px', 'important');

      // 树列样式
      if (treeCol) {
        treeCol.style.setProperty('width', '100%', 'important');
        treeCol.style.setProperty('max-width', '100%', 'important');
        treeCol.style.setProperty('float', 'none', 'important');
        treeCol.style.setProperty('margin', '0', 'important');
        treeCol.style.setProperty('padding', '0', 'important');
        treeCol.style.setProperty('border', 'none', 'important');
        treeCol.style.setProperty('box-sizing', 'border-box', 'important');
      }
      const treeBox = left.querySelector('.widget-box');
      if (treeBox) {
        treeBox.style.setProperty('width', '100%', 'important');
        treeBox.style.setProperty('margin', '0', 'important');
        treeBox.style.setProperty('border', urpppCardBorderValue(), 'important');
        treeBox.style.setProperty('border-radius', '12px', 'important');
        treeBox.style.setProperty('overflow', 'hidden', 'important');
        treeBox.style.setProperty('background', 'var(--surface)', 'important');
      }

      // 信息卡
      panel.querySelectorAll('.profile-info-row').forEach((r) => {
        r.classList.remove('urppp-query-row', 'urppp-dual-pair');
        r.style.setProperty('display', 'grid', 'important');
        r.style.setProperty('grid-template-columns', '112px minmax(0,1fr)', 'important');
        r.style.setProperty('width', '100%', 'important');
        Array.from(r.children).forEach((el) => {
          if (!el.classList) return;
          el.style.setProperty('float', 'none', 'important');
          el.style.setProperty('margin-left', '0', 'important');
          el.style.setProperty('width', 'auto', 'important');
          el.style.setProperty('max-width', 'none', 'important');
        });
      });
      panel.querySelectorAll('.profile-user-info, .profile-user-info-striped').forEach((card) => {
        card.classList.remove('urppp-query-form');
        try { ensureProfileCardShell(card); } catch (_) {}
        card.querySelectorAll('.profile-info-value, .profile-info-value span, span.editable').forEach((el) => {
          el.style.setProperty('color', 'var(--text)', 'important');
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
        });
        card.style.setProperty('border-radius', '12px', 'important');
        card.style.setProperty('overflow', 'hidden', 'important');
        card.style.setProperty('width', '100%', 'important');
        card.style.setProperty('max-width', '100%', 'important');
        card.style.setProperty('display', 'block', 'important');
        card.style.setProperty('box-sizing', 'border-box', 'important');
      });
    } catch (err) {
      console.warn('[URP++] curriculum drawer beautify failed', err);
    }
  }
  function scheduleCurriculumDrawerBeautify() {
    if (window.__urpppCurriculumDrawerBound) return;
    window.__urpppCurriculumDrawerBound = true;
    const run = () => beautifyCurriculumDrawer();
    ;[0, 50, 150, 350, 800, 1600].forEach((ms) => setTimeout(run, ms));
    const obs = new MutationObserver((muts) => {
      // 面板宽度变化或 fajh 内容写入时立刻归位
      const hot = muts.some((m) => {
        if (m.type === 'childList') return true;
        if (m.type === 'attributes' && m.target && (m.target.id === 'curriculumInfo-divcon2' || m.target.id === 'fajh')) return true;
        return false;
      });
      if (!hot) return;
      clearTimeout(window.__urpppCurriculumDrawerTimer);
      window.__urpppCurriculumDrawerTimer = setTimeout(() => requestAnimationFrame(run), 16);
    });
    const el2 = document.getElementById('curriculumInfo-divcon2');
    if (el2) obs.observe(el2, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    // 点击“培养方案/与我相关”后尽快布局，减少首开只见树
    document.addEventListener('click', (e) => {
      // 只在 divcon2 存在（学籍培养方案抽屉）时重组
      if (!document.getElementById('curriculumInfo-divcon2')) return;
      const t = e.target && e.target.closest ? e.target.closest('a,button,span,div') : null;
      const txt = ((t && t.textContent) || '').replace(/\s+/g, '');
      if (/培养方案|与我相关|方案计划|自动化培养/.test(txt) || (t && t.closest && t.closest('#curriculumInfo-divcon2'))) {
        setTimeout(run, 0);
        setTimeout(run, 50);
        setTimeout(run, 150);
        setTimeout(run, 400);
      }
    }, true);
  }
  // 撤销误套在业务表上的公告样式（如空闲教室）

  const { scheduleScrubTableInlineBg, scrubTableHeaderInlineBg } = createTableInlineStyleScrubber({
    isNativePdfIsolationActive,
  });
  const {
    disarmNoticeTableHover,
    pinNoticeRowSurface,
    scrubNoticeInlineBg,
    stripMistakenNoticeTable,
  } = createNoticeTableSurface({ getCurrentTheme: getCurrent });

  function isNoticePageContext() {
    try {
      const heading = document.querySelector('h4.header, h3.header, h4, h3, .breadcrumb, .page-header');
      return detectNoticePageContext({
        pathname: location.pathname,
        href: location.href,
        title: document.title,
        headingText: heading?.textContent || '',
      });
    } catch (_) {
      return false;
    }
  }

  function isNoticeListTable(table) {
    return classifyNoticeListTable(table, { noticePage: isNoticePageContext() });
  }

  function isBusinessDataTable(table) {
    return classifyBusinessDataTable(table, { noticePage: isNoticePageContext() });
  }

  // 公告渲染：渲染器与生命周期互相引用，先建生命周期（延迟回调），再建渲染器
  let beautifyNoticeTables;
  const { bindNoticeHoverScrub, scheduleBeautifyNoticeTables } = createNoticeTableLifecycle({
    beautifyNoticeTables: (root) => beautifyNoticeTables(root),
    pinNoticeRowSurface,
  });
  ({ beautifyNoticeTables } = createNoticeTableBeautifier({
    isNativePdfIsolationActive,
    bindNoticeHoverScrub,
    scrubNoticeInlineBg,
    stripMistakenNoticeTable,
    disarmNoticeTableHover,
    pinNoticeRowSurface,
    isBusinessDataTable,
    isNoticeListTable,
    isNoticePageContext,
    isNoticeBulletText,
  }));

  const { wrapTables, bindTableWrapObserver } = createTableWrapper({
    isNativePdfIsolationActive,
    isBusinessDataTable,
  });


  // 清理被错误强制显示的空白 modal（无 .in/.show 却 display:block）
  function cleanupStuckModals() {
    try {
      // 1) 清掉我们写在 .modal 上的 display:!important 残留
      // 2) 无 .in/.show 的 modal 一律隐藏
      // 3) 无打开 modal 时清 backdrop / modal-open
      // 不要改抽屉 width/right
      document.querySelectorAll('.modal').forEach((m) => {
        if (!m || !m.style) return;
        if (m.style.getPropertyPriority('display') === 'important') {
          m.style.removeProperty('display');
        }
        const open = m.classList.contains('in') || m.classList.contains('show');
        if (!open) {
          // 站点偶发留下 display:block 且无 in/show → 关不掉的假弹窗
          if (m.style.display === 'block' || getComputedStyle(m).display !== 'none') {
            m.style.setProperty('display', 'none', 'important');
            // 下一帧再去掉 important，避免长期锁死；CSS 关闭态选择器继续兜底
            setTimeout(() => {
              try {
                if (!m.classList.contains('in') && !m.classList.contains('show')) {
                  if (m.style.getPropertyPriority('display') === 'important') m.style.removeProperty('display');
                  m.style.display = 'none';
                }
              } catch (_) {}
            }, 0);
          }
        } else {
          // 打开态：清掉可能错误的 display:none
          if (m.style.display === 'none') m.style.removeProperty('display');
        }
      });
      const anyOpen = !!document.querySelector('.modal.in, .modal.show');
      if (!anyOpen) {
        document.querySelectorAll('.modal-backdrop').forEach((b) => {
          try { if (b.parentElement) b.parentElement.removeChild(b); } catch (_) {}
        });
        if (document.body) {
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
        }
      }
    } catch (_) { /* ignore */ }
  }
  function patchModalOpenPath() {
    if (window.__urpppModalOpenPatched) return;
    window.__urpppModalOpenPatched = true;
    const unlock = (el) => {
      if (!el || !el.style) return;
      if (el.style.getPropertyPriority('display') === 'important') el.style.removeProperty('display');
      if (el.style.getPropertyPriority('opacity') === 'important') el.style.removeProperty('opacity');
      if (el.style.getPropertyPriority('pointer-events') === 'important') el.style.removeProperty('pointer-events');
      if (el.style.getPropertyPriority('visibility') === 'important') el.style.removeProperty('visibility');
    };
    const forceHide = (m) => {
      if (!m || !m.classList) return;
      try {
        m.classList.remove('in', 'show');
        m.setAttribute('aria-hidden', 'true');
        // 先清再写，确保能压过任何残留
        m.style.removeProperty('display');
        m.style.setProperty('display', 'none', 'important');
        // 下一帧降级为普通 none，避免长期 important 锁死后续打开
        setTimeout(() => {
          try {
            if (!m.classList.contains('in') && !m.classList.contains('show')) {
              if (m.style.getPropertyPriority('display') === 'important') m.style.removeProperty('display');
              m.style.display = 'none';
            }
          } catch (_) {}
        }, 30);
      } catch (_) {}
    };
    const clearBackdrops = () => {
      document.querySelectorAll('.modal-backdrop').forEach((b) => {
        try { if (b.parentElement) b.parentElement.removeChild(b); } catch (_) {}
      });
      if (document.body) {
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');
      }
    };
    const hideModalEl = (m) => {
      if (!m) return;
      // 允许传入 backdrop：找到当前打开 modal
      if (m.classList && m.classList.contains('modal-backdrop')) {
        m = document.querySelector('.modal.in, .modal.show') || m;
      }
      if (!m || !m.classList || !m.classList.contains('modal')) {
        clearBackdrops();
        return;
      }
      unlock(m);
      // 空白关闭要“一定关得掉”：先硬关，再尝试触发站点回调
      forceHide(m);
      clearBackdrops();
      try {
        const $ = (typeof pageJQuery === 'function' && pageJQuery())
          || (typeof unsafeWindow !== 'undefined' && (unsafeWindow.jQuery || unsafeWindow.$))
          || window.jQuery || window.$;
        if ($ && $.fn && typeof $.fn.modal === 'function') {
          try { $(m).trigger('hide.bs.modal'); } catch (_) {}
          try { $(m).modal('hide'); } catch (_) {}
          try { $(m).trigger('hidden.bs.modal'); } catch (_) {}
        }
      } catch (_) {}
      // 双保险
      setTimeout(() => {
        forceHide(m);
        if (!document.querySelector('.modal.in, .modal.show')) clearBackdrops();
        try { cleanupStuckModals(); } catch (_) {}
      }, 0);
    };
    document.addEventListener('show.bs.modal', (e) => {
      const m = e.target;
      if (!m || !m.classList || !m.classList.contains('modal')) return;
      unlock(m);
      // 打开前清掉关闭态 display:none，交给 Bootstrap
      if (m.style.display === 'none') m.style.removeProperty('display');
      // 允许点遮罩关闭（站点有时写 data-backdrop=static 导致空白处关不掉）
      try {
        if (m.getAttribute('data-backdrop') === 'static') m.setAttribute('data-backdrop', 'true');
        if (m.dataset) m.dataset.backdrop = 'true';
      } catch (_) {}
    }, true);
    document.addEventListener('hide.bs.modal', (e) => {
      const m = e.target;
      if (!m || !m.classList || !m.classList.contains('modal')) return;
      // 关闭过程中必须解锁 display:!important，否则永远关不掉
      unlock(m);
    }, true);
    document.addEventListener('hidden.bs.modal', (e) => {
      const m = e.target;
      if (!m || !m.classList || !m.classList.contains('modal')) return;
      forceHide(m);
      // 若已无打开弹窗，清 backdrop
      if (!document.querySelector('.modal.in, .modal.show')) {
        document.querySelectorAll('.modal-backdrop').forEach((b) => {
          try { if (b.parentElement) b.parentElement.removeChild(b); } catch (_) {}
        });
        if (document.body) {
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
        }
      }
    }, true);
    // 点击遮罩 / 弹窗空白关闭（硬关，不依赖 Bootstrap 是否吃到事件）
    const onBlankClose = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      // 点在内容区内部：不关
      if (t.closest('.modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer')) {
        // 但关闭按钮继续走下面逻辑
        if (!t.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]')) return;
      }
      // backdrop
      if (t.classList && t.classList.contains('modal-backdrop')) {
        const open = document.querySelector('.modal.in, .modal.show') || document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          hideModalEl(open);
        } else {
          // 没有 open class 也清掉残留遮罩
          e.preventDefault();
          clearBackdrops();
          cleanupStuckModals();
        }
        return;
      }
      // modal shell / outside dialog by geometry
      let shell = null;
      if (t.classList && t.classList.contains('modal')) shell = t;
      else shell = t.closest('.modal.in, .modal.show, .modal');
      if (!shell || !shell.classList.contains('modal')) return;
      const openLike = shell.classList.contains('in') || shell.classList.contains('show') || getComputedStyle(shell).display !== 'none';
      if (!openLike) return;
      const dialog = shell.querySelector('.modal-dialog');
      if (dialog) {
        const r = dialog.getBoundingClientRect();
        const x = e.clientX, y = e.clientY;
        const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        if (inside && !t.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]')) return;
      } else if (t.closest('.modal-content')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      hideModalEl(shell);
    };
    document.addEventListener('pointerdown', onBlankClose, true);
    document.addEventListener('mousedown', onBlankClose, true);
    document.addEventListener('click', onBlankClose, true);
    // 关闭按钮：立即硬关，避免只靠 Bootstrap
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]') : null;
      if (!t) return;
      const m = t.closest('.modal');
      if (m) {
        e.preventDefault();
        e.stopPropagation();
        hideModalEl(m);
      }
      setTimeout(() => { try { cleanupStuckModals(); } catch (_) {} }, 50);
      setTimeout(() => { try { cleanupStuckModals(); } catch (_) {} }, 220);
    }, true);
    // 侧栏抽屉打开：站点 animate width，清理我们可能写过的锁
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('a,button,td,span,div,i') : null;
      if (!t) return;
      // 解锁所有侧栏/modal，避免历史 !important 残留
      ;['curriculumInfo-divcon', 'curriculumInfo-divcon1', 'curriculumInfo-divcon2', 'calssInfo-divcon', 'classroomInfo-divcon', 'billContainer'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        unlock(el);
        // 清掉我们可能写过的 opacity/pointer-events 普通属性
        if (el.style.opacity === '0') el.style.removeProperty('opacity');
        if (el.style.pointerEvents === 'none') el.style.removeProperty('pointer-events');
      });
      document.querySelectorAll('.modal').forEach((m) => unlock(m));
      const sel = t.getAttribute && (t.getAttribute('data-target') || t.getAttribute('href') || '');
      if (sel && sel.charAt(0) === '#') {
        const m = document.querySelector(sel);
        if (m) unlock(m);
      }
    }, true);
  }

  let courseOpacityObserverEntry = null;
  let courseOpacityTimer = 0;

  function applyCourseTableOpacity() {
    if (isNativePdfIsolationActive()) return;
    const table = document.getElementById('courseTable');
    if (!table) return;
    table.querySelectorAll('td').forEach((cell) => {
      const background = cell.style.backgroundColor;
      if (!background || !background.includes('rgba')) return;
      const match = background.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
      if (match) cell.style.backgroundColor = `rgba(${match[1]},${match[2]},${match[3]},0.5)`;
    });
  }

  function bindCourseTableOpacityObserver() {
    const host = document.getElementById('mycoursetable') || document.getElementById('courseTable');
    if (courseOpacityObserverEntry && courseOpacityObserverEntry.root === host && host?.isConnected) {
      applyCourseTableOpacity();
      return;
    }
    clearTimeout(courseOpacityTimer);
    if (courseOpacityObserverEntry) courseOpacityObserverEntry.observer.disconnect();
    courseOpacityObserverEntry = null;
    if (!host) return;
    const observer = new MutationObserver(() => {
      clearTimeout(courseOpacityTimer);
      courseOpacityTimer = setTimeout(applyCourseTableOpacity, 60);
    });
    observer.observe(host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    });
    courseOpacityObserverEntry = { root: host, observer };
    applyCourseTableOpacity();
  }

  function beautifyInternal() {
    // body 晚于首屏 applyTheme 时补挂暗色 class
    try {
      const n = getCurrent();
      document.documentElement.dataset.urpppTheme = n;
      document.documentElement.classList.remove('urppp-theme-default', 'urppp-theme-dark', 'urppp-theme-scu-red');
      document.documentElement.classList.add('urppp-theme-' + n);
      if (document.body) {
        document.body.dataset.urpppTheme = n;
        document.body.classList.toggle('urppp-dark', n === 'dark');
      }
    } catch (_) {}
    let styleEl = document.getElementById('urppp-internal-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'urppp-internal-style';
      document.head.appendChild(styleEl);
    }
    {
      const style = styleEl;
      style.textContent = internalStyles;
    }
    // 表格美化样式紧跟在 internal 之后注入，覆盖关系与原先同文件内保持一致
    let tableBeautifyStyle = document.getElementById('urppp-table-beautify-style');
    if (!tableBeautifyStyle) {
      tableBeautifyStyle = document.createElement('style');
      tableBeautifyStyle.id = 'urppp-table-beautify-style';
      document.head.appendChild(tableBeautifyStyle);
    }
    tableBeautifyStyle.textContent = tableBeautifyStyles;
    // 导航样式紧随其后：与 internal 的覆盖关系保持不变
    let navigationStyle = document.getElementById('urppp-navigation-style');
    if (!navigationStyle) {
      navigationStyle = document.createElement('style');
      navigationStyle.id = 'urppp-navigation-style';
      document.head.appendChild(navigationStyle);
    }
    navigationStyle.textContent = navigationStyles;
    // 首页仪表板样式：仅首页需要（路由切换到首页时 ensureRouteStyles 立即补注；空闲预载兜底）
    if (isHomePage()) ensureDashboardStyles();
    let scheduleCardStyle = document.getElementById('urppp-schedule-card-style');
    if (!scheduleCardStyle) {
      if (isPersonalSchedulePage(location)) ensureScheduleCardStyles();
    }
    // 移动端兑底样式：裸规则桌面也生效，不能按视口省略——移动 UA 启动即注，桌面空闲预载（零行为变化，仅错峰解析）
    try { if (window.__urpppIsMobileUA) ensureMobileStyles(); } catch (_) {}
    try { applySkinAttr(); } catch (_) {}

    // 给表格包一层 wrapper：圆角 + 完整外框，绕过 Bootstrap thead border-top:0 和 overflow 裁剪
    cleanupStuckModals();
    patchModalOpenPath();
    // 启动时清掉侧栏/modal 上可能残留的锁定样式
    ;['curriculumInfo-divcon','curriculumInfo-divcon1','curriculumInfo-divcon2','calssInfo-divcon','classroomInfo-divcon'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el || !el.style) return;
      ['display','opacity','pointer-events','visibility'].forEach((p) => {
        if (el.style.getPropertyPriority(p) === 'important') el.style.removeProperty(p);
      });
      if (el.style.opacity === '0') el.style.removeProperty('opacity');
      if (el.style.pointerEvents === 'none') el.style.removeProperty('pointer-events');
    });
    document.querySelectorAll('.modal').forEach((m) => {
      if (m.style && m.style.getPropertyPriority('display') === 'important') m.style.removeProperty('display');
    });
    wrapTables();
    scheduleBeautifyNoticeTables();
    scheduleScrubTableInlineBg();
setTimeout(() => document.querySelectorAll('table').forEach((tb) => { if (isBusinessDataTable(tb)) stripMistakenNoticeTable(tb); }), 500);
    scheduleWeekScheduleFix();
    fixWeekScheduleLayout();
    scheduleCurriculumDrawerBeautify();
    beautifyCurriculumDrawer();
    bindTableWrapObserver();
    // 首页进行组件级重构
    const pageContent = document.querySelector('.page-content');
    const hasWidgets = pageContent && pageContent.querySelectorAll('.widget-box').length >= 4;
    if (hasWidgets) {
      setTimeout(rebuildDashboard, 500);
    }

    // 完全重构侧边栏为 Hanako 风格
    rebuildSidebarCompletely();
    syncSidebarUnderNavbar();
    setupMobileNavbar();

    function setupMobileNavbar() {
      const mobileQuery = '(max-width: 640px)';
      const isNarrow = () => !!(window.matchMedia && window.matchMedia(mobileQuery).matches);

      const syncMobileSidebarMode = (sidebar, narrow) => {
        if (!sidebar || !document.body) return;
        if (narrow) {
          if (!Object.hasOwn(sidebar.dataset, 'urpppDesktopSidebarMin')) {
            sidebar.dataset.urpppDesktopSidebarMin = sidebar.classList.contains('menu-min') ? '1' : '0';
            sidebar.dataset.urpppDesktopBodyMin = document.body.classList.contains('menu-min') ? '1' : '0';
          }
          sidebar.classList.remove('menu-min');
          document.body.classList.remove('menu-min');
          return;
        }
        if (Object.hasOwn(sidebar.dataset, 'urpppDesktopSidebarMin')) {
          sidebar.classList.toggle('menu-min', sidebar.dataset.urpppDesktopSidebarMin === '1');
          document.body.classList.toggle('menu-min', sidebar.dataset.urpppDesktopBodyMin === '1');
          delete sidebar.dataset.urpppDesktopSidebarMin;
          delete sidebar.dataset.urpppDesktopBodyMin;
        }
      };

      const drawerAnimations = new WeakMap();
      const stopDrawerAnimation = (sidebar) => {
        const frame = drawerAnimations.get(sidebar);
        if (frame) cancelAnimationFrame(frame);
        drawerAnimations.delete(sidebar);
      };
      const animateDrawer = (sidebar, open) => {
        stopDrawerAnimation(sidebar);
        const rect = sidebar.getBoundingClientRect();
        const width = Math.max(rect.width, sidebar.offsetWidth || 0, 260);
        const startX = Math.max(-width, Math.min(0, rect.left));
        const endX = open ? 0 : -width;
        const distance = Math.abs(endX - startX);
        const duration = Math.max(140, Math.round(260 * distance / width));
        const startAt = performance.now();
        const cleanMode = sidebar.classList.contains('urppp-clean-sidebar');
        const activeZ = cleanMode ? '12030' : '1200';
        const hiddenZ = cleanMode ? '12030' : '1030';

        sidebar.style.setProperty('display', 'block', 'important');
        sidebar.style.setProperty('transition', 'none', 'important');
        sidebar.style.setProperty('visibility', 'visible', 'important');
        sidebar.style.setProperty('pointer-events', open ? 'auto' : 'none', 'important');
        sidebar.style.setProperty('z-index', activeZ, 'important');
        sidebar.style.setProperty('transform', `translate3d(${startX}px, 0, 0)`, 'important');
        sidebar.classList.toggle('urppp-drawer-closing', !open);
        sidebar.classList.add('display');

        const finish = () => {
          sidebar.style.setProperty('transform', `translate3d(${endX}px, 0, 0)`, 'important');
          if (open) {
            sidebar.classList.remove('urppp-drawer-closing');
            sidebar.style.setProperty('pointer-events', 'auto', 'important');
          } else {
            sidebar.classList.remove('display', 'urppp-drawer-closing');
            sidebar.style.setProperty('visibility', 'hidden', 'important');
            sidebar.style.setProperty('z-index', hiddenZ, 'important');
          }
          drawerAnimations.delete(sidebar);
        };
        if (distance < 1) {
          finish();
          return;
        }

        const step = (now) => {
          if (!sidebar.isConnected) {
            drawerAnimations.delete(sidebar);
            return;
          }
          const progress = Math.min(1, (now - startAt) / duration);
          const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          const x = startX + (endX - startX) * eased;
          sidebar.style.setProperty('transform', `translate3d(${x}px, 0, 0)`, 'important');
          if (progress >= 1) {
            finish();
            return;
          }
          drawerAnimations.set(sidebar, requestAnimationFrame(step));
        };
        drawerAnimations.set(sidebar, requestAnimationFrame(step));
      };
      const setDrawerOpen = (sidebar, toggler, open) => {
        if (!sidebar) return;
        animateDrawer(sidebar, open);
        if (toggler) {
          toggler.setAttribute('aria-expanded', open ? 'true' : 'false');
          toggler.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
        }
        try { syncMobileContentOffset(); } catch (_) { /* ignore */ }
      };

      const closeDrawer = () => {
        setDrawerOpen(
          document.getElementById('sidebar'),
          document.getElementById('urppp-mobile-menu-button'),
          false,
        );
      };

      const syncMobileSearchLayout = () => {
        const panel = document.getElementById('urppp-mobile-search-panel');
        const formSearch = panel?.querySelector('#form-search');
        if (!formSearch) return;
        Object.entries({
          position: 'relative', right: 'auto', top: 'auto', left: 'auto',
          transform: 'none', width: '100%', 'min-width': '0', 'max-width': 'none',
          height: '36px', opacity: '1', margin: '0', overflow: 'visible', 'z-index': '1',
        }).forEach(([key, value]) => formSearch.style.setProperty(key, value, 'important'));
        [formSearch.querySelector('form'), formSearch.querySelector('.input-icon')].forEach((element) => {
          if (!element) return;
          Object.entries({
            display: 'block', position: 'relative', width: '100%', 'min-width': '0', 'max-width': 'none',
            height: '36px', margin: '0', padding: '0', 'box-sizing': 'border-box',
          }).forEach(([key, value]) => element.style.setProperty(key, value, 'important'));
        });
        const input = formSearch.querySelector('#search-input');
        if (input) {
          input.style.setProperty('display', 'block', 'important');
          input.style.setProperty('width', '100%', 'important');
          input.style.setProperty('min-width', '0', 'important');
          input.style.setProperty('max-width', 'none', 'important');
          input.style.setProperty('height', '36px', 'important');
          input.style.setProperty('box-sizing', 'border-box', 'important');
        }
      };

      const restoreMobileSearch = () => {
        const formSearch = document.getElementById('form-search');
        if (!formSearch || !formSearch.__urpppMobileParent) return;
        const parent = formSearch.__urpppMobileParent;
        const next = formSearch.__urpppMobileNext;
        if (parent.isConnected) {
          if (next && next.parentElement === parent) parent.insertBefore(formSearch, next);
          else parent.appendChild(formSearch);
        }
        formSearch.classList.remove('urppp-mobile-form-search');
        formSearch.dataset.open = '0';
        // 清除移动端残留内联，避免桌面搜索框/结果被 width:0/opacity:0/z-index:10/overflow:hidden 污染
        formSearch.removeAttribute('style');
        delete formSearch.__urpppMobileParent;
        delete formSearch.__urpppMobileNext;
        // 重新初始化桌面搜索（恢复 urppp-desktop-search 样式与点击行为）
        try { bindDesktopNavbarSearch(); } catch (_) { /* ignore */ }
      };

      const restoreNativeMenuToggler = () => {
        const nativeToggler = document.querySelector('#navbar .menu-toggler');
        if (!nativeToggler || nativeToggler.dataset.urpppMobileHidden !== '1') return;
        nativeToggler.style.removeProperty('display');
        nativeToggler.removeAttribute('aria-hidden');
        if (nativeToggler.dataset.urpppPreviousTabindex) {
          nativeToggler.setAttribute('tabindex', nativeToggler.dataset.urpppPreviousTabindex);
        } else {
          nativeToggler.removeAttribute('tabindex');
        }
        delete nativeToggler.dataset.urpppPreviousTabindex;
        delete nativeToggler.dataset.urpppMobileHidden;
      };

      const ensureMenuToggler = () => {
        const existing = document.getElementById('urppp-mobile-menu-button');
        if (!isNarrow()) {
          existing?.remove();
          restoreNativeMenuToggler();
          return null;
        }
        if (existing) return existing;
        const navbar = document.getElementById('navbar');
        const sidebar = document.getElementById('sidebar');
        if (!navbar || !sidebar) return null;

        const nativeToggler = navbar.querySelector('.menu-toggler');
        if (nativeToggler) {
          nativeToggler.dataset.urpppMobileHidden = '1';
          nativeToggler.dataset.urpppPreviousTabindex = nativeToggler.getAttribute('tabindex') || '';
          nativeToggler.style.setProperty('display', 'none', 'important');
          nativeToggler.setAttribute('aria-hidden', 'true');
          nativeToggler.setAttribute('tabindex', '-1');
        }

        const toggler = document.createElement('button');
        toggler.type = 'button';
        toggler.id = 'urppp-mobile-menu-button';
        toggler.className = 'urppp-mobile-menu-button';
        toggler.setAttribute('aria-label', '打开菜单');
        toggler.setAttribute('aria-expanded', 'false');
        const host = navbar.querySelector('.navbar-container') || navbar;
        host.insertBefore(toggler, host.firstChild);
        return toggler;
      };

      const ensureMenuButtonIcon = (toggler) => {
        if (!toggler || toggler.dataset.urpppIconReady) return;
        toggler.dataset.urpppIconReady = '1';
        toggler.innerHTML = [
          '<span class="urppp-menu-icon" aria-hidden="true">',
          '<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">',
          '<path d="M5 8h14"></path><path d="M5 16h10"></path>',
          '</svg>',
          '<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">',
          '<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',
          '</svg>',
          '</span>',
        ].join('');
      };

      const bindDrawerControls = () => {
        const toggler = ensureMenuToggler();
        const sidebar = document.getElementById('sidebar');
        if (toggler) ensureMenuButtonIcon(toggler);
        if (toggler && sidebar && !toggler.__urpppToggleHandler) {
          toggler.setAttribute('aria-label', '打开菜单');
          toggler.setAttribute('aria-expanded', sidebar.classList.contains('display') ? 'true' : 'false');
          toggler.__urpppToggleHandler = (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (isNarrow()) syncMobileSidebarMode(sidebar, true);
            const open = toggler.getAttribute('aria-expanded') !== 'true';
            setDrawerOpen(sidebar, toggler, open);
          };
          toggler.addEventListener('click', toggler.__urpppToggleHandler, true);
        }
        if (!document.__urpppMobileDrawerOutsideBound) {
          document.__urpppMobileDrawerOutsideBound = true;
          document.addEventListener('click', (event) => {
            // 仅移动端视口生效：桌面端 ACE 自身管理 sidebar 折叠，插件不介入
            if (!isNarrow() || !event.target.closest) return;
            const activeSidebar = document.getElementById('sidebar');
            if (!activeSidebar || !activeSidebar.classList.contains('display')) return;
            // 清爽模式自管侧边栏开合（含汉堡），避免捕获阶段先收回再展开
            const cleanRoot = document.getElementById('urppp-clean-root');
            if (cleanRoot && cleanRoot.classList.contains('open')) return;
            if (event.target.closest('#sidebar, #urppp-mobile-menu-button')) return;
            closeDrawer();
          }, true);
        }
        if (!document.__urpppMobileRouteCloseBound) {
          document.__urpppMobileRouteCloseBound = true;
          document.addEventListener('click', (event) => {
            if (!isNarrow() || !event.target.closest) return;
            // 清爽模式自管侧边栏开合（含点击快捷区），避免 animateDrawer 残留内联样式
            const cleanRoot = document.getElementById('urppp-clean-root');
            if (cleanRoot && cleanRoot.classList.contains('open')) return;
            const link = event.target.closest('#sidebar a[href]');
            if (!link) return;
            const href = String(link.getAttribute('href') || '').trim();
            if (!href || href === '#' || href.startsWith('javascript')) return;
            closeDrawer();
          });
        }
      };

      const createActionLink = (source, fallback) => {
        const link = source ? source.cloneNode(true) : document.createElement('a');
        link.className = 'urppp-mobile-user-action';
        link.removeAttribute('style');
        link.removeAttribute('id');
        if (!source && fallback) {
          link.href = fallback.href;
          if (fallback.onclick) link.setAttribute('onclick', fallback.onclick);
          link.innerHTML = '<i class="ace-icon fa ' + fallback.icon + '" aria-hidden="true"></i><span>' + fallback.label + '</span>';
        }
        return link;
      };

      const ensureMobileUser = (btns, sidebar) => {
        if (document.getElementById('urppp-mobile-user')) return;
        const userLi = btns.querySelector(':scope > li.light-blue')
          || Array.from(btns.children).find((li) => li.querySelector && li.querySelector('.nav-user-photo, .user-menu, .dropdown-menu'));
        const area = document.createElement('section');
        area.id = 'urppp-mobile-user';
        area.className = 'urppp-mobile-user';

        const identity = document.createElement('div');
        identity.className = 'urppp-mobile-user-identity';
        const sourcePhoto = userLi?.querySelector('.nav-user-photo') || document.querySelector('#navbar .nav-user-photo');
        const photo = sourcePhoto ? sourcePhoto.cloneNode(true) : document.createElement('img');
        photo.className = 'nav-user-photo';
        photo.removeAttribute('style');
        if (!photo.getAttribute('src')) photo.setAttribute('src', '/main/queryStudent/img');
        photo.setAttribute('data-urppp-private', 'avatar');
        photo.alt = sourcePhoto?.alt?.replace(/\s+/g, ' ').trim() || '用户头像';

        const sourceInfo = userLi?.querySelector('.user-info') || document.querySelector('#navbar .user-info');
        const copy = document.createElement('span');
        copy.className = 'urppp-mobile-user-copy';
        const welcome = document.createElement('small');
        welcome.className = 'urppp-mobile-user-welcome';
        welcome.textContent = '欢迎您，';
        const name = document.createElement('span');
        name.className = 'user-info urppp-user-name-value';
        name.setAttribute('data-urppp-private', 'name');
        name.textContent = sourceInfo?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g, '').replace(/\s+/g, ' ').trim()
          || sourcePhoto?.alt?.replace(/\s+/g, ' ').trim()
          || '我的账户';
        copy.append(welcome, name);
        identity.append(photo, copy);
        area.appendChild(identity);

        const actions = document.createElement('div');
        actions.className = 'urppp-mobile-user-actions';
        const sourceActions = userLi ? Array.from(userLi.querySelectorAll('.user-menu a, .dropdown-menu a')) : [];
        const fallbacks = [
          { label: '首页', href: '/', icon: 'fa-home' },
          { label: '在线反馈', href: '/main/systemQuestion/index', icon: 'fa-question-circle' },
          { label: '修改密码', href: "javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')", icon: 'fa-user' },
          { label: '注销', href: '/logout', icon: 'fa-power-off' },
        ];
        if (sourceActions.length) sourceActions.forEach((link) => actions.appendChild(createActionLink(link)));
        else fallbacks.forEach((item) => actions.appendChild(createActionLink(null, item)));
        area.appendChild(actions);

        const header = sidebar.querySelector('.urppp-sidebar-header');
        if (header && header.nextSibling) sidebar.insertBefore(area, header.nextSibling);
        else if (header) sidebar.appendChild(area);
        else sidebar.insertBefore(area, sidebar.firstChild);
        try { applyPersonalDisplay(area); } catch (_) { /* ignore */ }
      };

      const ensureMobileQuick = (btns, sidebar, menus, opts = {}) => {
        if (!menus || document.getElementById('urppp-mobile-quick')) return;
        const quick = document.createElement('section');
        quick.id = 'urppp-mobile-quick';
        quick.className = 'urppp-mobile-quick';
        quick.innerHTML = '<div class="urppp-mobile-quick-title">快捷功能</div>';

        const toolRow = document.createElement('div');
        toolRow.className = 'urppp-mobile-tool-row';
        const helpSource = btns.querySelector(':scope > li > a[href*="customerServiceCenter"]');
        const help = helpSource ? helpSource.cloneNode(true) : document.createElement('a');
        help.className = 'urppp-mobile-tool-button urppp-mobile-help-button';
        help.removeAttribute('style');
        help.removeAttribute('onclick');
        help.removeAttribute('data-toggle');
        help.removeAttribute('target');
        help.querySelectorAll('[style]').forEach((element) => element.removeAttribute('style'));
        const helpHref = String(help.getAttribute('href') || '').trim();
        if (!helpHref || helpHref === '#' || helpHref.startsWith('javascript')) help.href = '/main/customerServiceCenter';
        if (!help.querySelector('i')) help.innerHTML = '<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>';
        help.querySelectorAll('span').forEach((span) => span.remove());
        help.insertAdjacentHTML('beforeend', '<span>帮助</span>');
        toolRow.appendChild(help);

        const searchButton = document.createElement('button');
        searchButton.type = 'button';
        searchButton.id = 'urppp-mobile-search-button';
        searchButton.className = 'urppp-mobile-tool-button';
        searchButton.setAttribute('aria-expanded', 'false');
        searchButton.innerHTML = '<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>';
        toolRow.appendChild(searchButton);
        quick.appendChild(toolRow);

        const links = document.createElement('div');
        links.className = 'urppp-mobile-quick-links';
        Array.from(btns.querySelectorAll(':scope > li > a')).forEach((anchor) => {
          const owner = anchor.closest('li');
          if (owner?.classList.contains('light-blue')) return;
          if (owner?.querySelector('#intellegenceUDiv, #form-search')) return;
          if (anchor === helpSource || anchor.classList.contains('dropdown-toggle')) return;
          if (!anchor.getAttribute('href') && !anchor.getAttribute('onclick')) return;
          const clone = anchor.cloneNode(true);
          clone.className = 'urppp-mobile-quick-link';
          clone.removeAttribute('style');
          // 保留可交互项的 onclick（作息时间表等），只移除会触发侧边栏收回的无关 onclick
          const rawOnclick = String(anchor.getAttribute('onclick') || '');
          const keepOnclick = /openWorkRestSchedule|open\w*Schedule/i.test(rawOnclick);
          if (!keepOnclick) clone.removeAttribute('onclick');
          // 假期状态等静态项：清爽模式下完全不可点（删 href 变纯文本）
          if (opts.cleanMode) {
            const href = String(anchor.getAttribute('href') || '');
            const isStatic = href === '/holiday' || /holiday/i.test(href) || /假期/.test(anchor.textContent || '');
            if (isStatic) {
              clone.removeAttribute('href');
              clone.removeAttribute('target');
              clone.style.cursor = 'default';
              clone.style.pointerEvents = 'none';
            }
          }
          links.appendChild(clone);
        });
        const searchPanel = document.createElement('div');
        searchPanel.id = 'urppp-mobile-search-panel';
        searchPanel.className = 'urppp-mobile-search-panel';
        searchPanel.hidden = true;
        // 复用站点 form-search（含 Bootstrap typeahead 关键词检索）：清爽模式同样走移动端面板逻辑，
        // 输入关键词弹出原生搜索结果框；退出时 restoreMobileSearch 移回 navbar 并重建桌面搜索
        {
          const formSearch = document.getElementById('form-search');
          if (formSearch) {
            if (!formSearch.__urpppMobileParent) {
              formSearch.__urpppMobileParent = formSearch.parentElement;
              formSearch.__urpppMobileNext = formSearch.nextSibling;
            }
            formSearch.classList.add('urppp-mobile-form-search');
            formSearch.dataset.open = '0';
            searchPanel.appendChild(formSearch);
            syncMobileSearchLayout();
          }
        }
        quick.appendChild(searchPanel);
        if (links.children.length) quick.appendChild(links);
        searchButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const open = searchPanel.hidden;
          if (open) {
            // 每次打开都重置 form-search 布局并聚焦，确保 typeahead 输入态稳定
            syncMobileSearchLayout();
            const fs = searchPanel.querySelector('#form-search');
            if (fs) {
              // data-open 只属于桌面顶栏搜索；移动面板以 hidden/aria-expanded 管理开合。
              fs.dataset.open = '0';
              fs.style.setProperty('pointer-events', 'auto', 'important');
              fs.style.setProperty('opacity', '1', 'important');
              // 站点桌面搜索可能残留 width:0（关闭态），面板内强制全宽
              fs.style.setProperty('width', '100%', 'important');
              fs.style.setProperty('min-width', '0', 'important');
            }
            searchPanel.hidden = false;
            searchPanel.classList.add('open');
            setTimeout(() => searchPanel.querySelector('#search-input')?.focus(), 30);
            searchButton.setAttribute('aria-expanded', 'true');
          } else {
            searchPanel.hidden = true;
            searchPanel.classList.remove('open');
            searchButton.setAttribute('aria-expanded', 'false');
          }
        });
        sidebar.insertBefore(quick, menus);
      };

      const apply = () => {
        const narrow = isNarrow();
        const btns = document.querySelector('#navbar .navbar-buttons .ace-nav');
        const sidebar = document.getElementById('sidebar');
        const menus = document.getElementById('urppp-menus');
        if (sidebar) syncMobileSidebarMode(sidebar, narrow);
        bindDrawerControls();
        if (!narrow) {
          // 清爽模式打开期间不恢复移动端搜索（form-search 留在侧边栏面板供 typeahead 使用）
          const cleanOpen = document.documentElement.classList.contains('urppp-clean-open');
          if (!cleanOpen) restoreMobileSearch();
          if (!cleanOpen) {
            document.getElementById('urppp-mobile-quick')?.remove();
            document.getElementById('urppp-mobile-user')?.remove();
          }
          const cleanBtn = document.getElementById('urppp-nav-clean');
          const desktopHost = document.getElementById('urppp-nav-theme');
          if (cleanBtn && desktopHost && cleanBtn.parentElement !== desktopHost) desktopHost.appendChild(cleanBtn);
          if (desktopHost) desktopHost.style.setProperty('display', 'inline-flex', 'important');
          return;
        }
        if (!btns || !sidebar) return;
        try {
          const cleanBtn = document.getElementById('urppp-nav-clean');
          const brandHost = document.querySelector('#navbar .navbar-header');
          const themeHost = document.getElementById('urppp-nav-theme');
          if (cleanBtn && brandHost && cleanBtn.parentElement !== brandHost) brandHost.appendChild(cleanBtn);
          if (themeHost) themeHost.style.setProperty('display', 'inline-flex', 'important');
          // 移动端只保留清爽入口，移除校历按钮（inline important 无法被 CSS @media 覆盖）
          document.getElementById('urppp-nav-cal')?.remove();
        } catch (_) { /* ignore */ }
        ensureMobileUser(btns, sidebar);
        ensureMobileQuick(btns, sidebar, menus);
        syncMobileSearchLayout();
      };

      window.__urpppRefreshMobileNavbar = apply;
      window.__urpppCloseMobileDrawer = closeDrawer;
      // 清爽模式复用移动端首页同一套动画，并在接管/退出时显式停止旧帧循环。
      window.__urpppSetDrawerOpen = (sidebar, toggler, open) => { setDrawerOpen(sidebar, toggler, open); };
      window.__urpppStopDrawerAnimation = (sidebar) => { if (sidebar) stopDrawerAnimation(sidebar); };
      // 清爽模式打开时按需注入移动端侧边栏区块（用户卡/快捷区），桌面清爽模式也用移动端样式
      window.__urpppInjectCleanSidebarSections = (sidebar) => {
        const btns = document.querySelector('#navbar .navbar-buttons .ace-nav') || document.querySelector('#navbar .ace-nav');
        const menus = document.getElementById('urppp-menus');
        if (!btns || !sidebar) return;
        try { ensureMobileUser(btns, sidebar); } catch (_) { /* ignore */ }
        // 清爽模式强制使用独立搜索框版本：移除站点版 quick（含被移动的 form-search），重建 cleanMode 版
        const existing = document.getElementById('urppp-mobile-quick');
        if (existing) {
          const panel = existing.querySelector('#urppp-mobile-search-panel');
          if (panel && panel.querySelector('#form-search')) {
            try { restoreMobileSearch(); } catch (_) { /* ignore */ }
          }
          existing.remove();
        }
        try { ensureMobileQuick(btns, sidebar, menus, { cleanMode: true }); } catch (_) { /* ignore */ }
      };
      try { apply(); } catch (_) { /* ignore */ }
      setTimeout(apply, 300);
      setTimeout(apply, 900);
      setTimeout(apply, 1800);
      if (window.matchMedia) {
        const mq = window.matchMedia(mobileQuery);
        const onChange = () => apply();
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
        else if (typeof mq.addListener === 'function') mq.addListener(onChange);
      }
      try {
        if (window.__urpppMobileNavbarObserver) window.__urpppMobileNavbarObserver.disconnect();
        let timer = 0;
        const observer = new MutationObserver(() => {
          clearTimeout(timer);
          timer = setTimeout(() => { try { apply(); } catch (_) { /* ignore */ } }, 40);
        });
        const navbar = document.getElementById('navbar');
        const sidebar = document.getElementById('sidebar');
        if (navbar) observer.observe(navbar, { childList: true, subtree: true });
        if (sidebar) observer.observe(sidebar, { childList: true });
        window.__urpppMobileNavbarObserver = observer;
      } catch (_) { /* ignore */ }
    }
    // 强制内容区内边距（ACE 偶发内联样式覆盖）；移动端用紧凑内距
    const urpppMobileLayout = !!(window.matchMedia && window.matchMedia('(max-width: 991px)').matches);
    const urpppContentPadding = urpppMobileLayout ? '8px 8px 24px' : '16px 64px 40px';
    document.querySelectorAll('.page-content, #page-content-template').forEach((el) => {
      el.style.setProperty('padding', urpppContentPadding, 'important');
      el.style.setProperty('box-sizing', 'border-box', 'important');
    });
    alignRollInfoLayout();
    fixSinglePairProfileForms();
    patchAceTabNavbars();
    restyleInfoboxPercentages();
    beautifyFreeClassroomList();
    setTimeout(() => { restyleInfoboxPercentages(); beautifyFreeClassroomList(); }, 300);
    setTimeout(() => { restyleInfoboxPercentages(); beautifyFreeClassroomList(); }, 1000);
    scheduleBeautifyPagebar();
    beautifyPagebar();
    // 查询表：首屏立刻布局（CSS 已预横排）；延迟只补 Chosen / 漏网行，次数收敛防闪
    scheduleEnsureQueryChosen();
    ensureQueryChosen();
    bindAllChosenNoPierce();
    beautifyQueryForms();
    patchChosenDropdownAlign();
    setTimeout(() => { ensureQueryChosen(); beautifyQueryForms(); }, 200);
    setTimeout(() => { ensureQueryChosen(); beautifyQueryForms(); }, 800);
    // 单对信息表与查询表互斥；略延后，避免抢在查询打包前拆行
    setTimeout(fixSinglePairProfileForms, 350);
    setTimeout(fixSinglePairProfileForms, 1000);
    beautifyPlanTree();
    setTimeout(() => beautifyPlanTree(), 400);
    if (!window.__urpppPlanTreeObs) {
      let planTimer = 0;
      window.__urpppPlanTreeObs = new MutationObserver(() => {
        const t = document.getElementById('treeDemo');
        if (!t || t.dataset.urpppBusy === '1') return;
        // 没有未处理节点就不动
        if (!t.querySelector('li > a:not([data-urppp-node-done="1"])')) return;
        clearTimeout(planTimer);
        planTimer = setTimeout(() => beautifyPlanTree(), 220);
      });
      const treeHost = document.getElementById('tree_div') || document.getElementById('treeDemo');
      if (treeHost) {
        window.__urpppPlanTreeObs.observe(treeHost, { childList: true, subtree: true });
      }
    }
    // 作息时间表：仅轻量样式，不改内容
    if (!window.__urpppWrsBound) {
      window.__urpppWrsBound = true;
      document.addEventListener('shown.bs.modal', (e) => {
        if (e.target && (e.target.id === 'work_rest_schedule_modal' || e.target.querySelector?.('#work_rest_schedule_modal'))) {
          setTimeout(beautifyWorkRestSchedule, 30);
        }
      }, true);
      document.addEventListener('click', (e) => {
        const a = e.target && e.target.closest ? e.target.closest('a,button') : null;
        if (!a) return;
        const onclick = a.getAttribute('onclick') || '';
        const txt = (a.textContent || '').trim();
        if (onclick.includes('openWorkRestSchedule') || txt.includes('作息时间表')) {
          setTimeout(beautifyWorkRestSchedule, 80);
          setTimeout(beautifyWorkRestSchedule, 300);
        }
      }, true);
    }
    beautifyBreadcrumbs();
    rebuildNavbar();
    bindDesktopNavbarSearch();
    patchSchoolCalendarLink();

    // 非查询/公告关键路径：合并延迟波，减少重复 DOM 扫描（不改最终样式）
    const layoutWave = () => {
      alignRollInfoLayout();
      patchAceTabNavbars();
      beautifyBreadcrumbs();
    };
    setTimeout(layoutWave, 200);
    setTimeout(layoutWave, 800);

    if (!window.__urpppLoadBound) {
      window.__urpppLoadBound = true;
      window.addEventListener('load', () => {
        rebuildNavbar();
        bindDesktopNavbarSearch();
        injectNavbarThemeSwitch();
        patchSchoolCalendarLink();
        beautifyBreadcrumbs();
        alignRollInfoLayout();
        patchAceTabNavbars();
      });
    }

    setTimeout(() => { document.body.classList.add('urppp-ready'); hideBootLoader(); }, 600);

    console.log('[URP++] style applied apple-leaning');
    try { bindScheduleHoverNearCursor(); } catch (_) {}

    // 课表背景段落不透明度 50%（卡片用 CSS opacity 处理）
    bindCourseTableOpacityObserver();

    // 课表背景卡片高度对齐（CSS translateY 处理）
  }

  // ============================================================
  // 顶栏重建（JS 强制对齐）
  // ============================================================


  function renderBrutalPaletteCards(panel) {
    if (!panel) return;
    const list = panel.querySelector('#urppp-set-brutal-palettes');
    if (!list) return;
    const selected = getBrutalSelectedPalette();
    list.innerHTML = '';
    BRUTAL_PALETTES.filter((palette) => palette.id !== BRUTAL_DEFAULT_PALETTE).forEach((palette) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'urppp-set-scheme' + (palette.id === selected.id ? ' ac' : '');
      card.dataset.palette = palette.id;
      card.innerHTML = [
        '<div class="urppp-set-scheme-preview">',
        '  <span style="background:#000"></span>',
        '  <span style="background:' + palette.accent + '"></span>',
        '  <span style="background:' + palette.secondary + '"></span>',
        '</div>',
        '<div class="urppp-set-scheme-meta">',
        '  <strong>' + palette.name + '</strong>',
        '  <em>' + palette.desc + '</em>',
        '</div>'
      ].join('');
      card.addEventListener('click', () => setBrutalPalette(palette.id, { select: true }));
      list.appendChild(card);
    });
  }

  const privacySettingsController = createPrivacySettingsController({
    getPrivacySettings,
    setPrivacySettings,
    getCustomIdentity,
    setCustomIdentity,
    applyDisplay: () => applyPersonalDisplay(document),
    refreshCleanDisplay: refreshCleanPersonalDisplay,
    finishActiveDirectEdit: (cancel) => {
      if (activeDirectEditInput?.__finish) activeDirectEditInput.__finish(cancel);
    },
  });

  const syncPrivacySettingsUI = privacySettingsController.sync;
  const collectPrivacySettings = privacySettingsController.collect;
  const setPrivacySettingsStatus = privacySettingsController.setStatus;
  const bindPrivacySettingsUI = privacySettingsController.bind;

  const jsonSettingsController = createJsonSettingsController({
    document,
    getSettings: getScheduleJsonFormatSettings,
    setSettings: setScheduleJsonFormatSettings,
    validateMapping: validateScheduleJsonMapping,
    defaultMapping: DEFAULT_SCHEDULE_JSON_MAPPING,
    getRecoveryMessage: () => scheduleJsonFormatRecoveryMessage,
  });

  const setScheduleJsonSettingsStatus = jsonSettingsController.setStatus;
  const syncScheduleJsonSettingsUI = jsonSettingsController.sync;
  const bindScheduleJsonSettingsUI = jsonSettingsController.bind;

  function syncSettingsPanelUI() {
    const panel = document.getElementById('urppp-settings-panel');
    if (!panel) return;
    const seed = getAccent() || DEFAULT_SEED;
    const scheme = getScheme();
    const currentTheme = getCurrent();
    const followSystem = isThemeFollowSystem();
    const skinId = getSkin();
    const darkSupported = skinSupportsDark(skinId);
    const dynamicSupported = skinSupportsDynamic(skinId);
    const fixedPalettes = skinSupportsFixedPalettes(skinId);
    const modeAvailability = {};
    panel.querySelectorAll('.urppp-set-mode').forEach((button) => {
      modeAvailability[button.dataset.theme] = isThemeModeAvailable(button.dataset.theme, skinId);
    });
    syncThemeSettingsControls(panel, {
      seed,
      currentTheme,
      followSystem,
      skinId,
      darkSupported,
      dynamicSupported,
      fixedPalettes,
      followUseDynamic: isFollowUseDynamic(),
      cleanDefault: isCleanDefault(),
      cleanAnalysis: isCleanAnalysisDirect() ? 'direct' : 'tab',
      appleEdge: isAppleEdgeLine(),
      autoUpdate: isAutoUpdateCheck(),
      globalPreload: isGlobalPreload(),
      modeAvailability,
    });
    if (fixedPalettes) renderBrutalPaletteCards(panel);
    try { syncPrivacySettingsUI(panel); } catch (_) {}
    try { syncScheduleJsonSettingsUI(panel); } catch (_) {}

    // 设置变更后即时刷新清爽模式（成绩分析展示方式等）
    try {
      if (window.__urpppCleanMode && typeof window.__urpppCleanMode.refreshRender === 'function') {
        window.__urpppCleanMode.refreshRender();
      }
    } catch (_) { /* ignore */ }

    // 预设种子
    const presets = panel.querySelector('#urppp-set-presets');
    if (presets) {
      presets.innerHTML = '';
      getAccentPresets().forEach((hex) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'urppp-set-swatch' + (hex.toLowerCase() === seed.toLowerCase() ? ' ac' : '');
        b.title = hex;
        b.style.background = hex;
        b.addEventListener('click', () => {
          GM_setValue(ACCENT_KEY, hex);
          if (isThemeFollowSystem()) applyTheme(resolveFollowThemeName(), { system: true });
          else applyTheme('scu-red', { manual: true });
          syncSettingsPanelUI();
        });
        presets.appendChild(b);
      });
    }

    // 方案卡
    const schemes = panel.querySelector('#urppp-set-schemes');
    if (schemes) {
      schemes.innerHTML = '';
      listSchemePreviews(seed).forEach((item) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'urppp-set-scheme' + (item.id === scheme ? ' ac' : '');
        card.dataset.scheme = item.id;
        card.innerHTML = [
          '<div class="urppp-set-scheme-preview">',
          '  <span style="background:' + item.bg + '"></span>',
          '  <span style="background:' + item.surface + ';border-color:' + item.border + '"></span>',
          '  <span style="background:' + item.primary + '"></span>',
          '</div>',
          '<div class="urppp-set-scheme-meta">',
          '  <strong>' + item.name + '</strong>',
          '  <em>' + item.desc + '</em>',
          '</div>'
        ].join('');
        card.addEventListener('click', () => {
          setScheme(item.id);
          GM_setValue(ACCENT_KEY, seed);
          if (isThemeFollowSystem()) applyTheme(resolveFollowThemeName(), { system: true });
          else applyTheme('scu-red', { manual: true });
          syncSettingsPanelUI();
        });
        schemes.appendChild(card);
      });
    }

    try { renderSkinCards(panel); } catch (e) { try { console.warn('[URP++] renderSkinCards', e); } catch (_) {} }
    try {
      const ver = panel.querySelector('.urppp-about-ver, #urppp-about-ver');
      if (ver) {
        ver.textContent = 'SCU URP++ v' + URPPP_VERSION;
        if (ver.tagName === 'A') {
          ver.setAttribute('href', URPPP_UPDATE.repo);
          ver.setAttribute('target', '_blank');
          ver.setAttribute('rel', 'noopener noreferrer');
        }
      }
    } catch (_) {}
    try { ensureAboutLogo(panel); } catch (_) {}
  }

  const settingsPanelController = createSettingsPanelController({
    document,
    ensurePanel: ensureSettingsPanel,
    syncPanel: syncSettingsPanelUI,
    refreshUpdateStatus: refreshUpdateStatusHint,
  });

  const themeSettingsController = createThemeSettingsController({
    document,
    theme: {
      isModeAvailable: isThemeModeAvailable,
      apply: applyTheme,
      supportsDark: skinSupportsDark,
      supportsDynamic: skinSupportsDynamic,
      getFollowSystem: isThemeFollowSystem,
      setFollowSystem: setThemeFollowSystem,
      resolveFollowTheme: resolveFollowThemeName,
      getCurrent,
      getFollowDynamic: isFollowUseDynamic,
      setFollowDynamic: setFollowUseDynamic,
      syncNavbar: syncNavbarThemeUI,
    },
    preferences: {
      getCleanDefault: isCleanDefault,
      setCleanDefault,
      getCleanAnalysis: () => (isCleanAnalysisDirect() ? 'direct' : 'tab'),
      setCleanAnalysis,
      getAppleEdge: isAppleEdgeLine,
      setAppleEdge: setAppleEdgeLine,
      applySkin: applySkinAttr,
      getAutoUpdate: isAutoUpdateCheck,
      setAutoUpdate: setAutoUpdateCheck,
      getGlobalPreload: isGlobalPreload,
      setGlobalPreload,
      checkUpdates: checkForUpdates,
    },
    accent: {
      normalize: normalizeHexColor,
      setAccent: (color) => GM_setValue(ACCENT_KEY, color),
      savePreset: saveAccentPreset,
      getScheme,
      setScheme,
      listSchemePreviews,
    },
    syncPanel: syncSettingsPanelUI,
  });

  const pluginManager = createPluginManager({
    GM: {
      getValue: typeof GM_getValue === 'function' ? GM_getValue : null,
      setValue: typeof GM_setValue === 'function' ? GM_setValue : null,
      xmlHttp: typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null,
      addStyle: typeof GM_addStyle === 'function' ? GM_addStyle : null,
    },
    doc: document,
    hostInfo: { version: URPPP_VERSION },
    uiDeps: { openSubpanel: (kind) => { if (kind === 'plugin-store') openStoreSubPanel('plugin'); } },
  });

  // 启动时自动装载已缓存插件（含登录页：让辅助登录/2FA 在 id.scu 也生效）
  // 必须在 DOM 就绪后注入，避免辅助脚本在 body 未生成时读 DOM 报错
  (function bootstrapPlugins() {
    const run = () => { try { pluginManager.bootFromCache('assist'); } catch (_) { /* ignore */ } };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
  })();

  function openSettingsPanel() {
    return settingsPanelController.open();
  }

  function closeSettingsPanel() {
    settingsPanelController.close();
  }


  const URPPP_ABOUT_LOGO_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=';
  // 品牌 favicon：标签页图标换为 URP++ CLI icon（64px，3.3KB data URI）
  const URPPP_FAVICON_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAJTElEQVR4nORbfWxbVxW/7773/J6f7SRO07VNGydpkjbJ2qbQURioEkgI/gBpgICpg8EfqIIhxMeAfzoE0gBpoK2D7g8QZRQxxDQhMYkPIYQ0PrQhbaxlS5u0adPEbUKWLEkdO87ze35fO+faz3FcO7Edx7G9n/Ry/T6u43Pu+brnnEfJ2xwC2WK0te0/oDTL36GEDnIcCXIcbSKEUzhKJY7jeHzGcRzLsW0dPqmOY8cch0RsYo8mYvqj8/M3xskWgiNbgI6ug/fxvPgQz9P3Ul4IAKGkHABjiGWZy7ZlvWiaxlPTN6/9lVQYFWVA5/67fy+K4scoz2ckC1aUGIZBbMsktm2zAwlzbIuN7EcAgzjKs5FSCiMlvCASQRQJzWIeMMIwzeTz4Ruj95MKoRIM4ELd/T8RPTKsOC/iBcs0GNEmHvCZ28R/wa9ERoiiB5iS4qtlm0bSMM5O3Rj9Npw6ZBPYFAM6Ovsf9sjS92HBFTxHYhNqHFeKbAVQsGTFRwSB8ZmYlrli6trpW+Gxs6RMlMsAuav30EWPRxrAEwsI1hIrsOJJUg0IIA2yVyGupiV1/VL4xuV3wUedlIiSGbBnT9+AElBeBnEMoD7rmgqHtikxLxceSSaSrDC7YZpmTI3pQ7OzV8OlfAdfysOh0MFPev2+F3iBl3HVV5ajTN+3g3gEeAiwNTqzEYIgSKIkfEXxBUZi0dtXiv2OohnQ0T34uKwoZ4DbFHUdid+k/akMwJOACjC7AFJJQT0+7Q+0+KJLC38vZnpRDOjcP3AGdO5hcFOcridIYmWZ1BqMpM5UARjBgUS8Twm0NMciC3/baN6GDOjo6jspe/2P42ctAfoOR62CGWHQR5QGURDvVXzN12JLC5fXm7Ou9u4O9Q76laZhSjkeOazW4MrnA9gBInokDLqsuLp8ZPbW+GihZ2mhGzt37vT7vb5XkHjU+XohHoG/1TJNVAkeaHi5vb1dKfRsQQYEWvaMQBzvQ1enxmOk1nFyRzP548EuNiJW4lEWdgMNfsnfdqnQvLwMCPUM/hgMSQhjdfwiN2avJ2T/drAH+zu7Bx7N91w+G0B7+4+qID0ShrVJXSO1jB927CKHFe8d1y+pCfLI1BwES17ihfDZtuzE+Nj//HDLzn7uDgno6jl0BokH+1HzxBeDJLjtlCpQb3fPoR/l3l8jAb29vRInBGKQrPCgIUHLXy9A3T/ZFiTPLkTIs4vRNffQI6BngKRL8vpVClJwwXDvrZEAg3ifQuIxzK0n4jcC0oJhM9LW1af/NPveWgnof4cGrkPCMBddXyNBEDzEF2hybUHGLWYkYG/XwHuQeNT9RiMeAZmkjC0IhfqPudczDBAF/us4GlXa028HcOeI4DzCN9xrmdwdT+kH2UPJjRnw+iure4yfnXuG/Pzcb0u+l4uh4x8u6v+VMi8XJtAmgVvkuRStCCYBd3V374KIqZVlYetU/HMjwXxA1UYaYdt8F3i8JrzGGKBw3q/hVheTmI2OVJKW4yxH/CqeMxUA93AvjugqqoX/XnydvHphOHP+pVOfzXzG669eHC5q3vnjR8iO6OpeBWMBPNxIMBeYnofAgDic8AE4/UHKBnDcbhwwh18tIBEFbQd5piADcud94r4PES1a/GbNttO1CNjw4piSAI40p25WjwGVwq5HvsnG6B/+RJae/3PeSDAbLo2gBUEcUwwgXADHakrAdsFxFzm96GkbwMs4blVBIx8eOvUgO1wU687KnefCXWTKUUZzWgUyVVrS6MBIl4FyrLzE3CCUKlN7gsan/w4amQQ4tmNAfljkKFc1KaiUGywV4PLZyGgmLgMcJwGDiCVqp0qxQKXcYKnARUakaU6rgGPHsm82MmjK3GVoTsmD7URSNylpdLgqABxYxMHdDWLMeJgrgwG5bikb9xw7Qsg5UlOgrgrYDouTGcWwB3gJR0HY8p6pbQdNNbGAAJgvsnP8sxxNPglGwcHGg0aHCKV0pPXm5PITeM6WPBKZiAZ3HpmDouJubE7aKCeArsjFzMwcmXljddfFxD6Nf/zzP2vmYYLERa4rK/deKcC8IDZiQRF1Fn45q/JmzH6o5+5fy5L8eez20BJx0ojwKn7WVaJriV/dnBj9Al7LWD3eNs/gKHoaVw1c2iziPOZeyzBgcnJsGOoBKjYZiA1oCwSPh/UfWrYZn564ct29vsbvmbb5NI6y10caDd40TYZp/zL7em7oJ0BxJApSoNRbaWw9oN6j/kMyJDF+dW2BNDfyMS3D+B5+aCQpwFY6BKTFT5Oc6nDe4L/34NAipsmx+REsJqlnIPHYVAnJnsXxsdfacu/njX2TlvFFdzLlS2olrClgJ6kkp3oHDFM/le+Zgtu/7r7D/wZvcAKTiPFYpO6yRRjw+JuCrHUObNm/Jscvvz/vc+t8B+05MDQDVZRdq42R9QN/oIV1l4NRm50YG24nBfJd623/7Oht7Z0gAQb23WGDQb1A8TUx4iH/l4xHlo+SdZJ96+5/FxbGZnRN/RQWE7DLwrWmtQwJvBdGfDZkf7WE+vE335ycW+/5DS1cbGlxLNAc9IAUnMCmZB6MYq2W0FFKJfD5aK8MTfvuVHjs6Y3mFGXio5H5F3yBYBCs6rtBtDgMld1aey0AQ1x/oJm9R4BbXV3Xzt6avHK6qLmkBHR29j8ger2/wQ5MzK+vxGNVLabkA7o6xd/ErD22xuraymemwteeK3Z+yVnQvV19R2XZ9xJPeQWrLNhKp21TA7Uk++CQmcuDrFZc09UT/w9ff62U7ygrDdza2trUsmPfZbAJHXjO3hzBTnK9Om+OZL8pgjANY2p56Y3B+fn5khMZZYV5iURCj9yee9IXaJWB3uM8vi4Gljfdob1afqogWMurRwZxDzAGpFddT2raE+GJkY+oqlqWZa7EeomhnsFfiKL0IA+2AS9gnyH27rPDTG7i3zgsjYV7eRz5dFju2JaZ1I3zNydHvgynm6rkVExg9+3b5xXk5ufAEn+UZlVYMIbAHKNlGZkXJwl7cdJmvhojFJrnxUlBFCAxI635HzDXBob+xdSi909PT1dkl1ZxjW1vP6aIivoAdcTPUZ7ewwu8l2wClmklbMu+YHPmec5UfxcOhyvawLzlJmvv3gNDgiR8C1Z1ABY2CGtc1MvTMF7R1eRjs7PjI2QL0fjFwA3wFgAAAP//9xCJogAAAAZJREFUAwAJZkVSj1sY7gAAAABJRU5ErkJggg==';
  function applyBrandFavicon() { // 移除站方 icon link 后注入品牌 favicon（浏览器 data URI 支持良好）
    try {
      const head = document.head || document.documentElement;
      head.querySelectorAll('link[rel]').forEach((link) => {
        const rel = (link.getAttribute('rel') || '').toLowerCase();
        if (rel.includes('icon') && !rel.includes('apple-touch')) link.remove();
      });
      const link = document.createElement('link');
      link.rel = 'shortcut icon';
      link.href = URPPP_FAVICON_DATA;
      head.appendChild(link);
    } catch (_) {}
  }

  function ensureAboutLogo(panel) {
    const img = panel && panel.querySelector ? panel.querySelector('#urppp-about-logo') : document.getElementById('urppp-about-logo');
    if (!img) return;
    // 教务页常拦外链图：直接用内嵌 data URI，不依赖 GitHub/CDN
    if (img.getAttribute('src') !== URPPP_ABOUT_LOGO_DATA) {
      img.setAttribute('src', URPPP_ABOUT_LOGO_DATA);
    }
    img.removeAttribute('referrerpolicy');
    img.alt = 'SCU URP++';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
  }

  function ensureSettingsPanel() {
    if (document.getElementById('urppp-settings-panel')) return;
    ensureSettingsStyles();
    try { applySkinAttr(); } catch (_) {}
    // 打开设置前先注入已缓存的 catalog cardCss，避免下载主题皮肤卡先残缺再变正常
    try { if (__catalogCache && __catalogCache.length) ensureStoreCardStyles(__catalogCache); } catch (_) {}
    const mask = document.createElement('div');
    mask.id = 'urppp-settings-mask';
    mask.addEventListener('click', closeSettingsPanel);
    const panel = document.createElement('div');
    panel.id = 'urppp-settings-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'URP++ 设置');
    const logoCdn = URPPP_ABOUT_LOGO_DATA;
    panel.innerHTML = buildSettingsPanelHtml({
      logoData: URPPP_ABOUT_LOGO_DATA,
      repositoryUrl: URPPP_UPDATE.repo,
      version: URPPP_VERSION,
    });
    document.documentElement.appendChild(mask);
    document.documentElement.appendChild(panel);

    bindSettingsTabs(panel);

    panel.querySelector('#urppp-set-close').addEventListener('click', closeSettingsPanel);
    try { bindPrivacySettingsUI(panel); } catch (e) { console.warn('[URP++] privacy settings', e); }
    try { bindScheduleJsonSettingsUI(panel); } catch (e) { console.warn('[URP++] JSON settings', e); }
    try { ensureAboutLogo(panel); } catch (_) {}
    const aboutLogo = panel.querySelector('#urppp-about-logo');
    if (aboutLogo && !aboutLogo.__urpppFallback) {
      aboutLogo.__urpppFallback = true;
      aboutLogo.addEventListener('error', () => {
        if (aboutLogo.dataset.fallback === '1') return;
        aboutLogo.dataset.fallback = '1';
        aboutLogo.src = logoCdn;
      });
    }
    themeSettingsController.bind(panel);

    // P0：辅助插件装载区（在系统设置→辅助插件位置渲染装载/商店入口）
    try { pluginManager.renderAssistUi(panel.querySelector('#urppp-set-assist-slot')); } catch (e) { console.warn('[URP++] plugin manager', e); }
  }

  // 主题商店 / 插件商店：二级页（铺满设置面板，带返回按钮）
  function openStoreSubPanel(kind) {
    const main = document.getElementById('urppp-settings-panel');
    if (!main) return;
    // 每次打开重建 subpanel：彻底清除上次的残留状态（监听/定时器/DOM）
    const oldSub = document.getElementById('urppp-store-subpanel');
    if (oldSub) { try { oldSub.remove(); } catch (_) {} }
    try { if (window.__urpppSrcAutoRefreshTimer) { clearTimeout(window.__urpppSrcAutoRefreshTimer); window.__urpppSrcAutoRefreshTimer = null; } } catch (_) {}
    const sub = document.createElement('div');
    sub.id = 'urppp-store-subpanel';
    sub.className = 'urppp-store-subpanel';
    sub.innerHTML = `
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
          <button type="button" class="urppp-store-sub-refresh" id="urppp-store-sub-refresh" aria-label="刷新">↻</button>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`;
    main.appendChild(sub);
    sub.querySelector('#urppp-store-sub-back').onclick = closeStoreSubPanel;
    const title = sub.querySelector('#urppp-store-sub-title');
    const body = sub.querySelector('#urppp-store-sub-body');
    title.textContent = kind === 'theme' ? '主题商店' : '插件商店';
    body.innerHTML = '';
    const refreshBtn = sub.querySelector('#urppp-store-sub-refresh');
    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        if (refreshBtn.disabled) return;
        refreshBtn.disabled = true; refreshBtn.textContent = '…';
        try {
          await fetchCatalogList(true); // 强制重拉全部源并写缓存
          const downloadPane = body.querySelector('[data-pane="download"]');
          if (kind === 'theme') { try { fetchCatalogThemes(body); } catch (_) {} }
          else if (downloadPane) { try { fetchCatalogPlugins(downloadPane); } catch (_) {} }
                  } catch (_) {}
        refreshBtn.disabled = false; refreshBtn.textContent = '↻';
      };
    }
    if (kind === 'theme') renderThemeStoreBody(body);
    else renderPluginStoreBody(body);
    // 强制可见：内联样式优先级最高，绕过任何 CSS 覆盖（动画/opacity/z-index 问题）导致的隐形
    sub.style.cssText = 'display:flex !important;opacity:1 !important;visibility:visible !important;position:absolute;top:0;left:0;width:100%;height:100%;z-index:6;background:var(--surface,#fff);flex-direction:column;';
    sub.classList.add('open');
  }

  function closeStoreSubPanel() {
    try { if (window.__urpppSrcAutoRefreshTimer) { clearTimeout(window.__urpppSrcAutoRefreshTimer); window.__urpppSrcAutoRefreshTimer = null; } } catch (_) {}
    const sub = document.getElementById('urppp-store-subpanel');
    if (!sub) return;
    sub.classList.remove('open');
    sub.style.display = 'none'; // 强制隐藏，防动画中断残留遮挡
    try { sub.remove(); } catch (_) {} // 彻底移除，下次打开重建
  }

  function bindStoreTabs(root) {
    root.querySelectorAll('.urppp-store-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        root.querySelectorAll('.urppp-store-tab').forEach((t) => t.className = 'urppp-store-tab');
        tab.className = 'urppp-store-tab ac';
        root.querySelectorAll('.urppp-store-pane').forEach((p) => p.style.display = 'none');
        const pane = root.querySelector('.urppp-store-pane[data-pane="' + tab.dataset.tab + '"]');
        if (pane) pane.style.display = '';
      });
    });
  }

  // 主题下载列表（未安装主题，4 个）
  // 主题商店：下载 tab 从 catalog 拉主题列表（卡片式）+ 下载注入 css
  // 注入第三方主题卡片样式：每个主题可在 catalog 提供 cardCss，卡片展示时按 data-skin 生效
  function ensureStoreCardStyles(items) {
    if (!Array.isArray(items)) return;
    items.forEach((it) => {
      if (!it || !it.id) return;
      // 本地已存 cardCss（下载主题时缓存）优先，避免依赖线上拉取导致皮肤卡残缺/闪烁
      let local = '';
      try { local = GM_getValue('urppp_card_css_' + it.id, '') || ''; } catch (_) {}
      const css = local || it.cardCss || '';
      if (!css) return;
      let el = document.getElementById('urppp-store-card-css-' + it.id);
      if (!el) { el = document.createElement('style'); el.id = 'urppp-store-card-css-' + it.id; (document.head || document.documentElement).appendChild(el); }
      if (el.textContent !== css) el.textContent = css;
    });
  }

  function themeStoreCard(item, downloaded) {
    const srep = (SKIN_CATALOG.find((s) => s.id === item.id) || {}).repo;
    const repo = item.repo || srep;
    const repoBtn = repo ? `<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${escapeHtml(repo)}">仓库</button>` : '';
    const ccIn = item.cardCss || '';
    const cardCssInline = ccIn ? `<style>${ccIn}</style>` : '';
    return `<div class="urppp-skin-card" data-skin="${escapeHtml(item.id)}">
      ${cardCssInline}
      <div class="urppp-skin-name">${escapeHtml(item.name || item.id)}</div>
      <div class="urppp-skin-meta">${escapeHtml(item.author || '')}${item.author && item.version ? ' · ' : ''}v${escapeHtml(item.version || '')}<span class="urppp-dows" data-dows-id="${escapeHtml(item.id)}"></span></div>
      <p class="urppp-skin-desc">${escapeHtml(item.description || '')}</p>
      <button type="button" class="urppp-skin-apply" data-store-theme="${escapeHtml(item.id)}"${downloaded ? ' disabled' : ''}>${downloaded ? '已安装' : '下载'}</button>
      ${repoBtn}
    </div>`;
  }

  async function fetchCatalogThemes(body) {
    const downloadPane = body.querySelector('[data-pane="download"]');
    if (!downloadPane) return;
    const render = (themes) => {
      if (!themes.length) { downloadPane.innerHTML = '<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载主题</p><p class="urppp-store-sub">已安装的主题不会再显示在这里。</p></div>'; return; }
      ensureStoreCardStyles(themes);
      downloadPane.innerHTML = `<div class="urppp-store-theme-grid">${themes.map((it) => themeStoreCard(it, false)).join('')}</div>`;
      downloadPane.querySelectorAll('[data-store-theme]').forEach((b) => { b.addEventListener('click', () => downloadStoreTheme(b.dataset.storeTheme, b)); });
      downloadPane.querySelectorAll('[data-repo]').forEach((b) => b.addEventListener('click', () => { try { window.open(b.dataset.repo, '_blank', 'noopener'); } catch (_) {} }));
    };
    // 先用缓存立即渲染（GM urppp_catalog_cache），网络只在后台刷新，避免等 catalog 才出现主题
    render((__catalogCache || []).filter((it) => it.type === 'theme' && !themeDownloaded(it.id)));
    try {
      const catalog = await fetchCatalogList(true);
      __catalogCache = catalog; catalogCacheWrite(catalog);
      if (downloadPane.isConnected) render(catalog.filter((it) => it.type === 'theme' && !themeDownloaded(it.id))); // 面板挂 documentElement 下，不能用 body.contains
    } catch (_) {}
  }

  async function downloadStoreTheme(id, btn) {
    if (!btn || btn.disabled) return;
    // 先立即反馈，避免等待 catalog 期间无响应
    btn.disabled = true; btn.textContent = '下载中…';
    const item = (await fetchCatalogList()).find((it) => it.id === id);
    if (!item || !Array.isArray(item.entry) || !item.entry.length) { btn.disabled = false; btn.textContent = '下载'; return; }
    // 签名校验（自建源安全）：官方源信任；失败拦截；无法校验(未签名源)提示自担风险
    const g = await guardEntrySignature(item);
    if (g === 'fail') { const go = await confirmBottom('签名校验失败：该条目可能被篡改。是否仍要安装？'); if (!go) { btn.disabled = false; btn.textContent = '下载'; return; } }
    if (g === 'unknown' && item._srcPub) { const go = await confirmBottom('该源无有效签名校验，可能被篡改。是否自担风险继续下载？'); if (!go) { btn.disabled = false; btn.textContent = '下载'; return; } }
    const dl = showDownloadProgress('正在下载「' + (item.name || id) + '」');
    let css = '';
    const total = item.entry.length;
    for (let i = 0; i < total; i += 1) {
      const url = item.entry[i];
      const basePct = Math.round((i / total) * 100);
      dl.set(basePct, '正在从镜像 ' + (i + 1) + '/' + total + ' 下载…');
      const t = await fetchRemoteCatalog(url, 6000); // GM 优先：绕开页面 fetch 的 PNA/CORS 限制（catalog 已走此通道）
      if (t) { css = t; dl.set(100, '下载完成，正在处理…'); break; }
      if (i < total - 1) dl.set(basePct + 5, '镜像 ' + (i + 1) + ' 不可用，切换下一镜像…');
    }
    if (!css) { dl.fail('下载失败：所有源均不可达'); toast('下载失败：所有源均不可达（本地测试源已关/网络不通）', 'error'); btn.textContent = '下载失败'; setTimeout(() => { btn.textContent = '下载'; btn.disabled = false; }, 1400); return; }
    try { GM_setValue('urppp_theme_css_' + id, css); } catch (_) {}
    // 下载的自定义主题（不在内置 SKIN_CATALOG）需登记为本地主题，否则主题管理/皮肤列表不显示、也无法应用
    if (!SKIN_CATALOG.some((s) => s.id === id)) {
      saveLocalTheme(id, { name: item.name || id, desc: item.desc || '下载主题', author: item.author || '', version: item.version || '1.0.0' });
    }
    // 下载时也缓存 cardCss 到本地，皮肤卡/商店直接用本地卡样式（不再依赖线上拉取，避免残缺闪烁）
    // catalog 无 cardCss 时自动从主题 CSS 变量生成，保证卡不裸奔
    if (item.cardCss) { try { GM_setValue('urppp_card_css_' + id, item.cardCss); } catch (_) {} }
    else { const cc = autoCardCssFromVars(css, id); if (cc) { try { GM_setValue('urppp_card_css_' + id, cc); } catch (_) {} } }
    try { storeThemeStyleEl(id).textContent = css; } catch (_) {}
    try { ensureStoreCardStyles([{ id, cardCss: item.cardCss || '' }]); } catch (_) {}
    try { dl.done('下载完成，已安装'); } catch (_) {}
    btn.textContent = '已安装'; btn.disabled = true;
    // 即时刷新：主题管理能看到刚下的主题 + 下载列表排除它
    const inline = (btn.closest && btn.closest('.urppp-store-inline'));
    if (inline) {
      try { const manage = inline.querySelector('#urppp-theme-manage'); if (manage) await fetchThemeManage(manage); } catch (_) {}
      try { fetchCatalogThemes(inline); } catch (_) {}
    }
    try { syncSettingsPanelUI(); } catch (_) {}
  }

  // 主题管理卡片（已装主题，卡片式，含仓库/删除管理按钮）
  function themeManageCardHtml(s, item) {
    const built = s.installed !== false;
    // 次要按钮复用 .urppp-skin-apply（跟下载/使用同款 per-skin 样式，且 brutal.css 的 button:not 会排除含 apply 类的按钮，天然防污染）
    const delBtn = built ? '' : `<button type="button" class="urppp-skin-apply urppp-store-del" data-theme-del="${escapeHtml(s.id)}">删除</button>`;
    const repo = (item && item.repo) || s.repo;
    const repoBtn = repo ? `<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${escapeHtml(repo)}">仓库</button>` : '';
    const cur = (getSkin() === s.id);
    // 卡样式直接内嵌随卡渲染（优先已下载缓存），避免依赖独立 style 注入时序造成延迟/闪烁
    let ccIn = (item && item.cardCss) || '';
    if (!ccIn) { try { ccIn = GM_getValue('urppp_card_css_' + s.id, '') || ''; } catch (_) {} }
    const cardCssInline = ccIn ? `<style>${ccIn}</style>` : '';
    // 版本号：优先 catalog 条目（随商店更新走），fallback 内置 SKIN_CATALOG 硬编码
    const ver = (item && item.version) || s.version || '';
    return `<div class="urppp-skin-card${cur ? ' is-active' : ''}" data-skin="${escapeHtml(s.id)}">
      ${cardCssInline}
      <div class="urppp-skin-name">${escapeHtml(s.name)}</div>
      <div class="urppp-skin-meta">${escapeHtml((item && item.author) || '')}${(item && item.author && ver) ? ' · ' : ''}v${escapeHtml(ver)}<span class="urppp-dows" data-dows-id="${escapeHtml(s.id)}"></span></div>
      <p class="urppp-skin-desc">${escapeHtml(s.desc || '')}</p>
      <button type="button" class="urppp-skin-apply${cur ? ' is-current' : ''}" data-theme-use="${escapeHtml(s.id)}"${cur ? ' disabled' : ''}>${cur ? '使用中' : '使用'}</button>
      ${delBtn}${repoBtn}
    </div>`;
  }

  async function fetchThemeManage(host) {
    if (!host) return;
    let catalog = __catalogCache || []; // 先本地已加载 cache（不等线上，避免已下载主题延迟展示）
    const locals = localThemes();
    const localItems = Object.keys(locals).map((id) => ({
      id, name: locals[id].name || id, desc: locals[id].desc || '本地主题',
      version: locals[id].version || '1.0.0', author: locals[id].author || '本地', installed: false,
    }));
    const items = SKIN_CATALOG.filter((s) => s.installed !== false || themeDownloaded(s.id))
      .concat(localItems.filter((l) => !SKIN_CATALOG.some((s) => s.id === l.id)));
    if (!items.length) { host.innerHTML = '<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无已装主题</p></div>'; return; }
    // 卡样式优先从已下载缓存（GM cardCss）注入，不等 catalog
    ensureStoreCardStyles(items.map((s) => { let cc = ''; try { cc = GM_getValue('urppp_card_css_' + s.id, '') || ''; } catch (_) {} return { id: s.id, cardCss: cc || ((catalog.find((c) => c.id === s.id) || {}).cardCss || '') }; }));
    host.innerHTML = `<div class="urppp-store-theme-grid">${items.map((s) => themeManageCardHtml(s, catalog.find((c) => c.id === s.id))).join('')}</div>`;
    host.querySelectorAll('[data-theme-use]').forEach((b) => b.addEventListener('click', () => {
      if (setSkin(b.dataset.themeUse)) {
        try { syncSettingsPanelUI(); } catch (_) {}
        // 同步就地更新状态（不重拉 catalog，避免延迟），让「使用中」即时切换
        host.querySelectorAll('.urppp-skin-card').forEach((card) => {
          const cid = card.dataset.skin;
          const ap = card.querySelector('.urppp-skin-apply');
          const isCur = (getSkin() === cid);
          card.classList.toggle('is-active', isCur);
          if (ap) {
            ap.classList.toggle('is-current', isCur);
            ap.disabled = isCur;
            ap.textContent = isCur ? '使用中' : '使用';
          }
        });
      }
    }));
    host.querySelectorAll('[data-theme-del]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.themeDel;
      // 先判断是否为当前皮肤（必须在清理前，否则清理后 getSkin 已回退到默认，永远不等）
      const wasCurrent = (getSkin() === id);
      try { GM_setValue('urppp_theme_css_' + id, ''); } catch (_) {}
      try { GM_setValue('urppp_card_css_' + id, ''); } catch (_) {}
      removeLocalTheme(id);
      removeStoreThemeStyle(id);
      // 若删除的是当前正在应用的主题→重置为默认（内置），完全清掉被删主题的皮肤/配色残留
      try {
        if (wasCurrent) {
          GM_setValue(SKIN_KEY, 'apple');
          try { document.documentElement.removeAttribute('data-urppp-skin'); } catch (_) {}
          try { if (document.body) document.body.removeAttribute('data-urppp-skin'); } catch (_) {}
          applySkinAttr();
          // 保留原有主题模式：跟随系统 → 仍跟随系统；手动暗色/主题色 → 保持 getCurrent()
          const following = isThemeFollowSystem();
          const requested = following ? resolveFollowThemeName() : getCurrent();
          applyTheme(requested, { system: following });
        }
      } catch (_) {}
      try { syncSettingsPanelUI(); } catch (_) {}
      const inline = host.closest('.urppp-store-inline');
      if (inline) {
        try { fetchThemeManage(host); } catch (_) {}
        try { fetchCatalogThemes(inline); } catch (_) {}
      }
    }));
    host.querySelectorAll('[data-repo]').forEach((b) => b.addEventListener('click', () => { try { window.open(b.dataset.repo, '_blank', 'noopener'); } catch (_) {} }));
    // 不再后台拉 catalog 去补下载量/仓库——主题管理纯用本地缓存（避免抢网络/造成等待感）
  }

  // 管理界面设置：自动检测更新（全宽开关按钮）+ 检查更新
  function storeManageSettingsHtml() {
    return `<div class="urppp-store-settings">
      <button type="button" class="urppp-set-follow" data-store-auto-update>自动检测更新：关</button>
      <button type="button" class="urppp-set-btn" data-store-check-update>检查更新</button>
    </div>`;
  }

  // 商店清单（新仓库）多源：GitHub 权威 → Gitee 国内直连 → jsDelivr 兑底
  const OFFICIAL_CATALOG_URLS = [
    'https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json',
    'https://gitee.com/chaolan2026/URP-plusplus-Repository/raw/main/catalog.json',
    'https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json',
  ];
  // 官方收录的第三方源目录（仓库源界面一键添加）：GitHub → Gitee → jsDelivr
  const OFFICIAL_SOURCES_URLS = [
    'https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/sources.json',
    'https://gitee.com/chaolan2026/URP-plusplus-Repository/raw/main/sources.json',
    'https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/sources.json',
  ];
  // 远程文本拉取：GM 优先（免 CORS/PNA），页面 fetch 兑底
  function fetchRemoteCatalog(url, timeoutMs = 5000) {
    return new Promise((resolve) => {
      try {
        if (typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest({ method: 'GET', url, timeout: timeoutMs, cache: 'no-store',
            onload: (res) => resolve((res && res.responseText) || ''),
            onerror: () => resolve(''), ontimeout: () => resolve('') });
          return;
        }
        fetch(url, { cache: 'no-store' }).then((r) => (r && r.ok ? r.text() : '')).then((t) => resolve(t || '')).catch(() => resolve(''));
      } catch (_) { resolve(''); }
    });
  }
  function parseCatalogDoc(text) {
    try { const j = JSON.parse(text); return (j && Array.isArray(j.items)) ? j : null; } catch (_) { return null; }
  }
  let __officialSourcesCache = null;
  async function fetchOfficialSources(force) { // 官方收录的第三方源列表（会话内缓存）
    if (__officialSourcesCache && !force) return __officialSourcesCache;
    const results = await Promise.allSettled(OFFICIAL_SOURCES_URLS.map((url) => fetchRemoteCatalog(url)));
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value) continue;
      try {
        const j = JSON.parse(r.value);
        if (j && Array.isArray(j.sources)) { __officialSourcesCache = j; return j; }
      } catch (_) {}
    }
    return null;
  }

  // 自定义仓库源（多 catalog，含官方条目）：{name,url,mirrors?,enabled,pubkey}
  const OFFICIAL_SOURCE_URL = OFFICIAL_CATALOG_URLS[0];
  function getCustomSources() {
    try {
      const r = JSON.parse(GM_getValue('urppp_store_sources', '[]'));
      const arr = Array.isArray(r) ? r : [];
      let dirty = false;
      for (const s of arr) { if (s && 'hidden' in s) { delete s.hidden; dirty = true; } } // hidden 已废弃，归一为 enabled
      // 首次迁移：官方条目自动置首（三镜像冗余）；只迁一次，删除后不回注，可从收录列表重新添加
      if (!GM_getValue('urppp_sources_migrated', false)) {
        if (!arr.some((s) => s && s.url === OFFICIAL_SOURCE_URL)) {
          arr.unshift({ name: 'SCU URP++ 官方商店仓库', url: OFFICIAL_SOURCE_URL, mirrors: OFFICIAL_CATALOG_URLS.slice(), enabled: true });
        }
        GM_setValue('urppp_sources_migrated', true);
        dirty = true;
      }
      if (dirty) { try { GM_setValue('urppp_store_sources', JSON.stringify(arr)); } catch (_) {} }
      return arr;
    } catch (_) { return []; }
  }
  function saveCustomSources(arr) {
    try { GM_setValue('urppp_store_sources', JSON.stringify(arr)); } catch (_) {}
  }

  // catalog 持久缓存到 GM：启动时先读缓存立即渲染（不抢网络），网络只在后台刷新
  function catalogCacheRead() {
    try { const raw = GM_getValue('urppp_catalog_cache', ''); return raw ? (JSON.parse(raw) || null) : null; } catch (_) { return null; }
  }
  function catalogCacheWrite(items) {
    try { if (Array.isArray(items) && items.length) GM_setValue('urppp_catalog_cache', JSON.stringify(items)); } catch (_) {}
  }
  let __catalogCache = catalogCacheRead();
  async function fetchCatalogList(force) {
    if (__catalogCache && !force) return __catalogCache;
    const fetchCatalogDoc = async (url) => parseCatalogDoc(await fetchRemoteCatalog(url));

    // 全部源平级拉取（官方条目已置首，同 id 顺序优先）：仅 enabled，逐源 mirrors 依次回退
    const customs = getCustomSources().filter((s) => s && s.url && s.enabled !== false);
    const customsRes = await Promise.allSettled(customs.map(async (s) => {
      const mirrors = Array.isArray(s.mirrors) && s.mirrors.length ? s.mirrors : [s.url];
      if (!mirrors.includes(s.url)) mirrors.unshift(s.url);
      let j = null;
      for (const u of mirrors) { j = await fetchCatalogDoc(u); if (j) break; }
      return { doc: j, pubkey: (j && j.pubkey) || '', srcUrl: s.url };
    }));

    // 合并：先到先得（列表顺序即优先级，官方条目在首位）
    const merged = [];
    const seen = new Set();
    for (const r of customsRes) {
      if (!(r.status === 'fulfilled' && r.value && r.value.doc)) continue;
      const srcPub = r.value.pubkey || '';
      const srcUrl = r.value.srcUrl || '';
      for (const it of r.value.doc.items) {
        if (!it || !it.id || seen.has(it.id)) continue;
        seen.add(it.id);
        if (srcPub) it._srcPub = srcPub; // 记住来源公钥，安装前签名校验用
        if (srcUrl) it._srcUrl = srcUrl; // 记住来源源 URL（计数只算官方收录源）
        merged.push(it);
      }
    }

    __catalogCache = merged;
    catalogCacheWrite(merged);
    return merged;
  }

  // ---- 签名校验（Ed25519，自建源安全） ----
  // @grant 沙箱下 globalThis.crypto.subtle 可能不可用，回退到页面上下文（unsafeWindow/window）。
  // 每次动态取，避免脚本加载早于页面 crypto 就绪时恒为 null。
  function getWebCrypto() {
    try {
      if (typeof crypto !== 'undefined' && crypto && crypto.subtle) return crypto.subtle;
      const g = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : (typeof window !== 'undefined' ? window : null);
      if (g && g.crypto && g.crypto.subtle) return g.crypto.subtle;
    } catch (_) {}
    return null;
  }
  function normalizeEntry(obj) {
    if (Array.isArray(obj)) return obj.map(normalizeEntry);
    if (obj && typeof obj === 'object') {
      const out = {};
      for (const k of Object.keys(obj).filter((x) => x !== 'signature' && x !== '_srcPub').sort()) out[k] = normalizeEntry(obj[k]);
      return out;
    }
    return obj;
  }
  function b64ToU8(s) {
    try {
      const bin = atob(s);
      const u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i += 1) u[i] = bin.charCodeAt(i);
      return u;
    } catch (_) { return null; }
  }
  // 返回：true=校验通过；false=校验失败(应拦截)；null=无法校验(未签名源/无webcrypto，交给调用方提示)
  async function verifyEntrySignature(entry, pubkeyB64) {
    const _wc = getWebCrypto();
    if (!_wc) {
      // http 页面（无 crypto.subtle）：纯 JS Ed25519 verify（不依赖 WebCrypto）
      try {
        if (!pubkeyB64 || !entry || !entry.signature) return false;
        const pub = b64ToU8(pubkeyB64); const sig = b64ToU8(entry.signature);
        if (!pub || !sig) return false;
        const json = JSON.stringify(normalizeEntry(entry));
        return ed25519Verify(sig, pub, sha256Bytes(json));
      } catch (_) { return null; }
    }
    if (!pubkeyB64 || !entry || !entry.signature) return false;
    try {
      const raw = b64ToU8(pubkeyB64);
      if (!raw) return null;
      const key = await _wc.importKey('raw', raw, { name: 'Ed25519' }, false, ['verify']);
      const sig = b64ToU8(entry.signature);
      if (!sig) return false;
      const json = JSON.stringify(normalizeEntry(entry));
      const hash = await _wc.digest('SHA-256', new TextEncoder().encode(json));
      const data = new Uint8Array(hash); // 签名输入 = SHA256(规范化 JSON) 字节（与签名工具一致）
      return await _wc.verify({ name: 'Ed25519' }, key, sig, data);
    } catch (_) { return null; }
  }

  // 下载进度浮窗（主题/插件下载时展示）：返回 { set(pct, text), done(text), fail(text) } 控制器
  function showDownloadProgress(title) {
    let el = document.getElementById('urppp-dl-progress');
    if (!el) {
      el = document.createElement('div');
      el.id = 'urppp-dl-progress';
      el.className = 'urppp-dl-progress';
      el.innerHTML = '<div class="urppp-dl-title"></div><div class="urppp-dl-track"><div class="urppp-dl-bar"></div></div><div class="urppp-dl-text"></div>';
      (document.body || document.documentElement).appendChild(el);
    }
    const titleEl = el.querySelector('.urppp-dl-title');
    const bar = el.querySelector('.urppp-dl-bar');
    const text = el.querySelector('.urppp-dl-text');
    titleEl.textContent = title;
    el.classList.remove('urppp-dl-error');
    el.style.display = '';
    el.style.pointerEvents = 'auto';
    el.style.opacity = '0'; el.style.transform = 'translateY(14px)';
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'none'; });
    const hide = () => {
      try { el.style.pointerEvents = 'none'; el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; setTimeout(() => { el.style.display = 'none'; }, 260); } catch (_) {}
    };
    return {
      set(pct, msg) {
        try {
          const p = Math.max(0, Math.min(100, pct || 0));
          bar.style.width = p + '%';
          if (msg) text.textContent = msg;
        } catch (_) {}
      },
      done(msg) {
        try { if (msg) text.textContent = msg; } catch (_) {}
        setTimeout(hide, 650);
      },
      fail(msg) {
        try {
          el.classList.add('urppp-dl-error');
          if (msg) text.textContent = msg;
        } catch (_) {}
        setTimeout(hide, 2200);
      },
    };
  }

  // 底部浮动提示（替代原生 alert，随主题）、底部确认条（替代原生 confirm）
  function toast(msg, type) {
    try {
      let c = document.getElementById('urppp-toast');
      if (!c) { c = document.createElement('div'); c.id = 'urppp-toast'; c.className = 'urppp-toast'; (document.body || document.documentElement).appendChild(c); }
      c.textContent = msg;
      c.className = 'urppp-toast' + (type === 'error' ? ' error' : '');
      c.style.display = '';
      c.style.pointerEvents = 'auto';
      c.style.transition = 'opacity .22s, transform .22s';
      c.style.opacity = '0'; c.style.transform = 'translateY(14px)';
      requestAnimationFrame(() => { c.style.opacity = '1'; c.style.transform = 'none'; });
      clearTimeout(c._t);
      c._t = setTimeout(() => { c.style.pointerEvents = 'none'; c.style.opacity = '0'; c.style.transform = 'translateY(20px)'; setTimeout(() => { c.style.display = 'none'; }, 260); }, 3200);
    } catch (_) { try { window.alert(msg); } catch (__) {} }
  }
  function confirmBottom(msg) {
    return new Promise((resolve) => {
      try {
        let c = document.getElementById('urppp-confirm');
        if (!c) {
          c = document.createElement('div'); c.id = 'urppp-confirm'; c.className = 'urppp-confirm';
          c.innerHTML = '<div class="urppp-confirm-card"><div class="urppp-confirm-txt"></div><div class="urppp-confirm-ops"><button type="button" class="urppp-set-btn ghost" data-cac>取消</button><button type="button" class="urppp-set-btn" data-ok>继续</button></div></div>';
          const h = document.body || document.documentElement;
          h.appendChild(c);
        }
        c.style.display = ''; // 复用实例时重新显示
        c.querySelector('.urppp-confirm-txt').textContent = msg;
        c.style.pointerEvents = 'auto';
        c.style.transition = 'opacity .22s, transform .22s';
        c.style.opacity = '0'; c.style.transform = 'translateY(14px)';
        requestAnimationFrame(() => { c.style.opacity = '1'; c.style.transform = 'none'; });
        const done = (ok) => { c.querySelector('[data-ok]').onclick = c.querySelector('[data-cac]').onclick = null; c.style.pointerEvents = 'none'; c.style.opacity = '0'; c.style.transform = 'translateY(20px)'; setTimeout(() => { c.style.display = 'none'; }, 260); resolve(ok); };
        c.querySelector('[data-ok]').onclick = () => done(true);
        c.querySelector('[data-cac]').onclick = () => done(false);
      } catch (_) { try { resolve(window.confirm(msg)); } catch (__) { resolve(false); } }
    });
  }
  // 安装前验签：source=源的pubkey(或''=官方/未签名源)。返回 {ok, fail} 请调用方决定拦截
  async function guardEntrySignature(entry) {
    const pub = entry && entry._srcPub;
    // 官方源（无 _srcPub）信任；无法校验(null)交给调用方提示
    if (!pub) return 'trust';
    const r = await verifyEntrySignature(entry, pub);
    if (r === true) return 'ok';
    if (r === false) return 'fail';
    return 'unknown';
  }

  function versionGt(va, vb) {
    const a = String(va || '0').split('.').map(Number);
    const b = String(vb || '0').split('.').map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
      const x = a[i] || 0, y = b[i] || 0;
      if (x !== y) return x > y;
    }
    return false;
  }

  // 检查后：在已装卡片右侧加上「有新更新」徽标按钮
  function applyStoreUpdateBadges(root, catalog) {
    let updated = 0;
    catalog.forEach((item) => {
      if (!item.id) return;
      // 主题：已装且版本落后
      const themeEl = root.querySelector('[data-theme-use="' + item.id + '"]');
      if (themeEl && versionGt(item.version, SKIN_CATALOG.find((s) => s.id === item.id) && SKIN_CATALOG.find((s) => s.id === item.id).version)) {
        addUpdateBadge(themeEl.closest('.urppp-skin-card'), '主题');
        updated += 1;
      }
      // 插件：已注册且版本落后
      const pluginEl = root.querySelector('[data-plugin-id="' + item.id + '"]');
      if (pluginEl) {
        const cur = (pluginManager && pluginManager.api && pluginManager.api.get && pluginManager.api.get(item.id));
        if (cur && versionGt(item.version, cur.version)) { addUpdateBadge(pluginEl.closest('.urppp-store-item'), '插件'); updated += 1; }
      }
    });
    return updated;
  }

  function addUpdateBadge(itemEl, label) {
    if (!itemEl || itemEl.querySelector('.urppp-store-update')) return;
    const ops = itemEl.querySelector('.urppp-store-ops');
    if (!ops) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'urppp-set-btn urppp-store-update';
    b.textContent = '有新更新';
    b.addEventListener('click', () => { try { b.textContent = '更新中…'; } catch (_) {} });
    ops.appendChild(b);
  }

  function bindStoreManageSettings(root) {
    const auto = root.querySelector('[data-store-auto-update]');
    const check = root.querySelector('[data-store-check-update]');
    if (!auto || !check) return;
    let on = GM_getValue('urppp_store_auto_update', false);
    const sync = () => { auto.textContent = '自动检测更新：' + (on ? '开' : '关'); };
    const runCheck = async () => {
      let updated = 0;
      try {
        const catalog = await fetchCatalogList();
        for (const item of catalog) {
          if (!item || !item.id || !item.entry || !item.entry.length) continue;
          if (item.type === 'theme') {
            // 已装且版本落后
            const cur = SKIN_CATALOG.find((s) => s.id === item.id);
            // 已下载（GM 有 CSS）或内置已装（apple/editorial）才算已安装；官方未下载主题不参与更新
            const installed = themeDownloaded(item.id) || !!(cur && cur.installed !== false);
            if (!installed) continue;
            if (!cur || !versionGt(item.version, cur.version)) continue;
            // 热更新：下载新版 CSS 覆盖缓存（自动场景跳过签名确认，签名失败则跳过该主题）
            try {
              const g = await guardEntrySignature(item);
              if (g === 'fail') continue;
              if (g === 'unknown' && item._srcPub) continue; // 无法验证签名：不自动更新，避免风险
              let css = '';
              for (const url of item.entry) {
                const t = await fetchRemoteCatalog(url, 6000);
                if (t) { css = t; break; }
              }
              if (!css) continue;
              try { GM_setValue('urppp_theme_css_' + item.id, css); } catch (_) {}
              try { storeThemeStyleEl(item.id).textContent = css; } catch (_) {} // 正在使用则即时换新
              try { ensureStoreCardStyles([{ id: item.id, cardCss: item.cardCss || '' }]); } catch (_) {}
              updated += 1;
            } catch (_) {}
          } else if (item.type === 'plugin') {
            // 已注册且版本落后
            const cur = (pluginManager && pluginManager.api && pluginManager.api.get && pluginManager.api.get(item.id));
            if (!cur || !versionGt(item.version, cur.version)) continue;
            try {
              await pluginManager.api.update(item.id, item.entry);
              updated += 1;
            } catch (_) {}
          }
        }
      } catch (_) {}
      // 有更新则刷新主题管理列表（版本号/卡样式即时更新），无更新保持现状
      if (updated > 0) {
        try {
          const inline = document.querySelector('.urppp-store-inline');
          const manage = inline && inline.querySelector('#urppp-theme-manage');
          if (manage) fetchThemeManage(manage);
          try { syncSettingsPanelUI(); } catch (_) {}
        } catch (_) {}
      }
      return updated;
    };
    // 加载（打开商店）时若已开启自动检测，检查一次（不设定时器，减少后台占用）
    sync();
    if (on) { try { runCheck(); } catch (_) {} }
    auto.addEventListener('click', () => { on = !on; GM_setValue('urppp_store_auto_update', on); sync(); if (on) { try { runCheck(); } catch (_) {} } });
    check.addEventListener('click', async () => {
      check.disabled = true; const old = check.textContent; check.textContent = '检查中…';
      try {
        const n = await runCheck();
        check.textContent = n ? ('已更新 ' + n + ' 项') : '已是最新';
      } catch (_) { check.textContent = '检查失败'; }
      setTimeout(() => { check.textContent = old; check.disabled = false; }, 1600);
    });
  }

  function renderThemeStoreBody(body) {
    body.innerHTML = `
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">主题下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">主题管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${storeManageSettingsHtml()}<button type="button" class="urppp-set-btn ghost" data-add-local-theme style="width:100%;margin:0 0 10px">＋ 添加本地主题</button><input type="file" accept=".css,.txt" data-local-theme-file style="display:none"><div class="urppp-store-bd"><div id="urppp-theme-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${storeSourcesHtml()}</div>
        </div>
      </div>`;
    bindStoreTabs(body);
    bindStoreManageSettings(body);
    bindLocalThemeImport(body);
    bindStoreSources(body);
    fetchCatalogThemes(body);
    fetchThemeManage(body.querySelector('#urppp-theme-manage'));
  }

  function storeSourcesHtml() {
    const customs = getCustomSources();
    const rows = customs.length ? customs.map((s, i) => `
      <div class="urppp-src-item">
        <div class="urppp-src-meta"><strong>${escapeHtml(s.name || '未命名')}</strong><span class="urppp-src-url">${escapeHtml(s.url)}</span></div>
        <div class="urppp-src-ops">
          <button type="button" class="urppp-set-btn ghost" data-src-toggle="${i}">${s.enabled !== false ? '禁用' : '启用'}</button>
          <button type="button" class="urppp-set-btn ghost" data-src-del="${i}">删除</button>
        </div>
      </div>`).join('') : '<div class="urppp-store-empty"><p>暂无仓库源</p></div>';
    return `<div class="urppp-src-manage">
      <div class="urppp-src-official">
        <p class="urppp-src-hint"><strong>官方收录源</strong>（点击添加；收录申请见 <a class="urppp-src-link" href="https://github.com/chaolan2019/URP-plusplus-Repository/tree/main/contribute" target="_blank" rel="noopener noreferrer">商店仓库投稿指南</a>）</p>
        <div data-src-official-list><div class="urppp-store-empty"><p>正在加载收录列表…</p></div></div>
      </div>
      <div class="urppp-src-mine">
        <p class="urppp-src-hint"><strong>我的仓库源</strong></p>
        ${rows}
        <div class="urppp-src-add">
          <input type="text" class="urppp-input" data-src-url placeholder="catalog.json 地址">
          <input type="text" class="urppp-input" data-src-name placeholder="源名称（可选）">
          <button type="button" class="urppp-set-btn" data-src-add>添加仓库源</button>
        </div>
      </div>
    </div>`;
  }

  function bindStoreAutoRefresh(body) { // 仓库源 pane 内任何按钮操作后，自动重拉 catalog 并刷新下载列表
    if (body.dataset.srcAutoRefresh) return;
    body.dataset.srcAutoRefresh = '1';
    body.addEventListener('click', (e) => {
      const t = e.target;
      const btn = t && t.closest ? t.closest('button') : null;
      if (!btn || !btn.closest('[data-pane="sources"]')) return;
      clearTimeout(window.__urpppSrcAutoRefreshTimer);
      window.__urpppSrcAutoRefreshTimer = setTimeout(() => {
        try { fetchCatalogThemes(body); } catch (_) {}
      }, 400);
    });
  }

  async function renderOfficialSources(body) {
    const box = body.querySelector('[data-src-official-list]');
    if (!box) return;
    const doc = await fetchOfficialSources();
    if (!doc || !box.isConnected) return;
    const customs = getCustomSources();
    const sources = (doc.sources || []).filter((s) => s && s.url && !customs.some((c) => c.url === s.url)); // 只显示未添加的收录源
    if (!sources.length) { box.innerHTML = '<div class="urppp-store-empty"><p>已收录全部可用源</p></div>'; return; }
    box.innerHTML = sources.map((s, i) => `
      <div class="urppp-src-item">
        <div class="urppp-src-meta"><strong>${escapeHtml(s.name || s.id || '未命名')}</strong><span class="urppp-src-url">${escapeHtml(s.author ? s.author + ' · ' : '')}${escapeHtml(s.url)}</span>${s.description ? `<span class="urppp-src-url">${escapeHtml(s.description)}</span>` : ''}</div>
        <div class="urppp-src-ops"><button type="button" class="urppp-set-btn ghost" data-src-official="${i}">添加</button></div>
      </div>`).join('');
    box.querySelectorAll('[data-src-official]').forEach((b) => b.addEventListener('click', async () => {
      const src = sources[Number(b.dataset.srcOfficial)];
      if (!src || !src.url) return;
      b.disabled = true;
      const arr = getCustomSources();
      if (arr.some((c) => c.url === src.url)) { toast('该源已存在'); return; }
      const entry = Object.assign({ name: src.name || src.id || src.url, url: src.url, enabled: true }, Array.isArray(src.mirrors) && src.mirrors.length ? { mirrors: src.mirrors.slice() } : {});
      if (src.url === OFFICIAL_SOURCE_URL) arr.unshift(entry); else arr.push(entry);
      saveCustomSources(arr);
      __catalogCache = null;
      toast('已添加仓库源：' + (src.name || src.url));
      refreshStoreSources(body);
    }));
  }

  function bindStoreSources(body) {
    const add = body.querySelector('[data-src-add]');
    if (add) {
      const urlInput = body.querySelector('[data-src-url]');
      const nameInput = body.querySelector('[data-src-name]');
      add.addEventListener('click', async () => {
        const url = (urlInput.value || '').trim();
        if (!url) return;
        add.disabled = true; const old = add.textContent; add.textContent = '验证中…';
        try {
          // GM 通道验证：页面 fetch 会被 Chrome PNA 拦截（公网页面 → loopback/私网）
          const j = parseCatalogDoc(await fetchRemoteCatalog(url, 8000));
          if (!j) throw new Error('无法访问或不是合法 catalog（无 items）');
          const arr = getCustomSources();
          if (arr.some((s) => s.url === url)) { toast('该源已存在'); return; }
          arr.push({ name: (nameInput.value || '').trim() || url, url, enabled: true });
          saveCustomSources(arr);
          __catalogCache = null;
          refreshStoreSources(body);
        } catch (e) { toast('添加失败：' + (e && e.message ? e.message : e), 'error'); }
        finally { add.disabled = false; add.textContent = old; }
      });
    }
    body.querySelectorAll('[data-src-toggle]').forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.srcToggle);
      const arr = getCustomSources();
      if (arr[i]) { arr[i].enabled = arr[i].enabled !== false ? false : true; saveCustomSources(arr); __catalogCache = null; refreshStoreSources(body); }
    }));
    body.querySelectorAll('[data-src-del]').forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.srcDel);
      const arr = getCustomSources();
      if (arr[i]) { arr.splice(i, 1); saveCustomSources(arr); __catalogCache = null; refreshStoreSources(body); }
    }));
    try { renderOfficialSources(body); } catch (_) {} // 官方收录源异步填充
    bindStoreAutoRefresh(body);
  }

  function refreshStoreSources(body) {
    const pane = body.querySelector('[data-pane="sources"]');
    if (pane) { const b = body; pane.innerHTML = storeSourcesHtml(); bindStoreSources(b); renderOfficialSources(b); }
  }

  function bindLocalThemeImport(body) {
    const btn = body.querySelector('[data-add-local-theme]');
    const file = body.querySelector('[data-local-theme-file]');
    if (!btn || !file) return;
    btn.addEventListener('click', () => file.click());
    file.addEventListener('change', async () => {
      const f = file.files && file.files[0];
      if (!f) return;
      const text = await f.text();
      const m = text.match(/html\[data-urppp-skin="([\w-]+)"\]/);
      if (!m) { toast('未能从 CSS 中识别主题 id（需要 html[data-urppp-skin="…"]）', 'error'); file.value = ''; return; }
      const id = m[1];
      try { GM_setValue('urppp_theme_css_' + id, text); } catch (_) {}
      saveLocalTheme(id, { name: id, desc: '本地主题', author: '本地', version: '1.0.0' });
      try { storeThemeStyleEl(id).textContent = text; } catch (_) {}
      // 卡片样式：优先提取 CSS 内自带的 cardCss 段（.urppp-skin-card[data-skin="<id>"]）
      // 没有则从主题变量自动生成默认卡样式，保证皮肤卡/商店不裸奔
      let cc = extractLocalCardCss(text, id);
      if (!cc) cc = autoCardCssFromVars(text, id);
      if (cc) { try { GM_setValue('urppp_card_css_' + id, cc); } catch (_) {} try { ensureStoreCardStyles([{ id, cardCss: cc }]); } catch (_) {} }
      file.value = '';
      try { fetchThemeManage(body.querySelector('#urppp-theme-manage')); } catch (_) {}
    });
  }

  // 从本地主题 CSS 中提取 cardCss 段（.urppp-skin-card[data-skin="<id>"]）
  function extractLocalCardCss(css, id) {
    try {
      const parts = [];
      const re = /([^{}]+)\{([^{}]*)\}/g;
      const needle = '.urppp-skin-card[data-skin="' + id + '"]';
      let m;
      while ((m = re.exec(css)) !== null) {
        const sel = m[1];
        const body = m[2];
        if (sel.indexOf(needle) !== -1) {
          parts.push(sel.trim() + '{' + body.trim() + '}');
        }
      }
      // 去掉混入的 CSS 注释（/* */ 或 // 或缩进空白行）
      return parts.join('\n').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').trim();
    } catch (_) { return ''; }
  }

  // 从主题 CSS 变量自动生成默认 cardCss（保证皮肤卡/商店不裸奔，用户可后续覆盖）
  function autoCardCssFromVars(css, id) {
    try {
      const pick = (block, name) => {
        const mm = block.match(new RegExp('--' + name + '\\s*:\\s*([^!;]+)'));
        return mm ? String(mm[1]).trim() : '';
      };
      // 亮色变量块：优先 html[data-urppp-skin="<id>"]，否则任意 :root/顶层块
      let lightBlock = '';
      const lm = css.match(new RegExp('html\\[data-urppp-skin="' + id + '\\"\\][^{]*\\{([^}]*)\\}'));
      if (lm) lightBlock = lm[1]; else { const r = css.match(/:root[^{]*\\{([^}]*)\\}/); if (r) lightBlock = r[1]; }
      // 暗色变量块
      let darkBlock = '';
      const dm = css.match(new RegExp('html\\[data-urppp-skin="' + id + '\\"\\]\.urppp-theme-dark[^{]*\\{([^}]*)\\}'));
      if (!dm) { const d2 = css.match(new RegExp('html\\.urppp-theme-dark\\[data-urppp-skin="' + id + '\\"\\][^{]*\\{([^}]*)\\}')); if (d2) darkBlock = d2[1]; }
      const L = (n) => pick(lightBlock, n) || (n === 'surface' ? '#fff' : n === 'bg' ? '#f5f5f5' : n === 'primary' ? '#2563eb' : n === 'text' ? '#111' : n === 'border' ? '#e5e5e5' : '');
      const D = (n) => pick(darkBlock, n) || (n === 'surface' ? '#1f2937' : n === 'bg' ? '#111827' : n === 'primary' ? '#60a5fa' : n === 'text' ? '#f3f4f6' : n === 'border' ? '#374151' : '');
      const hasDark = darkBlock !== '' || css.includes('urppp-theme-dark');
      const cc = ''
        + '.urppp-skin-card[data-skin="' + id + '"]{background:' + L('surface') + ';color:' + L('text') + ';border:1px solid ' + L('border') + ';border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);padding-bottom:52px}'
        + '.urppp-skin-card[data-skin="' + id + '"] .urppp-skin-name,.urppp-skin-card[data-skin="' + id + '"] .urppp-skin-desc{color:inherit}'
        + '.urppp-skin-card[data-skin="' + id + '"] .urppp-skin-apply,.urppp-skin-card[data-skin="' + id + '"] .urppp-store-repo,.urppp-skin-card[data-skin="' + id + '"] .urppp-store-del{background:' + L('surface') + ';color:' + L('primary') + ';border:1px solid ' + L('primary') + ';border-radius:8px;box-shadow:none;transition:background 150ms,color 150ms}'
        + '.urppp-skin-card[data-skin="' + id + '"] .urppp-skin-apply:hover,.urppp-skin-card[data-skin="' + id + '"] .urppp-store-repo:hover,.urppp-skin-card[data-skin="' + id + '"] .urppp-store-del:hover{background:' + L('primary') + ';color:#fff}'
        + '.urppp-skin-card[data-skin="' + id + '"] .urppp-skin-apply.is-current{background:' + L('primary') + ';color:#fff}'
        + (hasDark
          ? 'html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"]{background:' + D('surface') + ';color:' + D('text') + ';border-color:' + D('border') + '}'
            + 'html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-skin-desc{color:inherit}'
            + 'html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-skin-apply,html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-store-repo,html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-store-del{background:' + D('surface') + ';color:' + D('primary') + ';border-color:' + D('primary') + '}'
            + 'html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-skin-apply:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-store-repo:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="' + id + '"] .urppp-store-del:hover{background:' + D('primary') + ';color:#fff}'
          : '');
      return cc;
    } catch (_) { return ''; }
  }

  function pluginStoreCard(item) {
    const repoBtn = item.repo ? `<button type="button" class="urppp-store-repo" data-repo="${escapeHtml(item.repo)}">仓库</button>` : '';
    return `<div class="urppp-store-item" data-plugin-card="${escapeHtml(item.id)}">
      <div class="urppp-store-info">
        <div><strong>${escapeHtml(item.name || item.id)}</strong><span class="urppp-store-meta">${escapeHtml(item.author || '')}${item.author && item.version ? ' · ' : ''}v${escapeHtml(item.version || '')}<span class="urppp-dows" data-dows-id="${escapeHtml(item.id)}"></span></span></div>
        <div class="urppp-store-item-desc">${escapeHtml(item.description || '')}</div>
      </div>
      <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-apply="${escapeHtml(item.id)}">安装</button>${repoBtn}</div>
    </div>`;
  }

  // 插件下载：从 catalog 拉插件列表（排除已装）
  async function fetchCatalogPlugins(host) {
    if (!host) return;
    const render = (plugins) => {
      if (!plugins.length) { host.innerHTML = '<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载插件</p><p class="urppp-store-sub">已安装的插件不会再显示在这里。</p></div>'; return; }
      host.innerHTML = `${plugins.map((it) => pluginStoreCard(it)).join('')}`;
      host.querySelectorAll('[data-plugin-apply]').forEach((b) => b.addEventListener('click', async () => {
        b.disabled = true; const old = b.textContent; b.textContent = '下载中…';
        try {
          const cat = (await fetchCatalogList()).find((it) => it.id === b.dataset.pluginApply);
          const g = cat ? await guardEntrySignature(cat) : 'trust';
          if (g === 'fail') { const go = await confirmBottom('签名校验失败：该插件可能被篡改。是否仍要装载？'); if (!go) { b.textContent = '下载'; b.disabled = false; return; } }
          if (g === 'unknown' && cat && cat._srcPub) { const go = await confirmBottom('该源无有效签名校验，可能被篡改。是否自担风险继续装载？'); if (!go) { b.textContent = '下载'; b.disabled = false; return; } }
          if (pluginManager && pluginManager.api && pluginManager.api.install) {
            const dlp = showDownloadProgress('正在下载「' + (cat && cat.name ? cat.name : b.dataset.pluginApply) + '」');
            try {
              await pluginManager.api.install(b.dataset.pluginApply, null, (p) => {
                try {
                  if (p.stage === 'downloading') dlp.set(Math.round((p.index / p.total) * 100), '正在从镜像 ' + p.index + '/' + p.total + ' 下载…');
                  else if (p.stage === 'source_failed') dlp.set(Math.round((p.index / p.total) * 100), '镜像 ' + p.index + ' 不可用，切换下一镜像…');
                  else if (p.stage === 'downloaded') dlp.set(100, '下载完成，正在注入…');
                  else if (p.stage === 'injecting') dlp.set(100, '正在注入…');
                } catch (_) {}
              });
              dlp.done('已安装');
            } catch (_) { dlp.fail('安装失败'); }
          }
          b.textContent = '已安装'; try { syncSettingsPanelUI(); } catch (_) {} } 
        catch (_) { b.textContent = '失败'; }
        setTimeout(() => { b.textContent = old; b.disabled = false; }, 1200);
      }));
      host.querySelectorAll('[data-repo]').forEach((b) => b.addEventListener('click', () => { try { window.open(b.dataset.repo, '_blank', 'noopener'); } catch (_) {} }));
    };
    const filter = (c) => (c || []).filter((it) => it.type === 'plugin' && !(pluginManager && pluginManager.api && pluginManager.api.isEnabled && pluginManager.api.isEnabled(it.id)));
    // 先用缓存立即渲染，网络只在后台刷新
    render(filter(__catalogCache));
    try {
      const catalog = await fetchCatalogList(true);
      __catalogCache = catalog; catalogCacheWrite(catalog);
      if (document.body.contains(host)) render(filter(catalog));
    } catch (_) {}
  }

  // 插件管理：已装插件，行内右侧按钮（作者/版本/下载量/仓库）
  async function fetchPluginManage(host) {
    if (!host) return;
    let catalog = [];
    try { catalog = await fetchCatalogList(); } catch (_) {}
    const items = (pluginManager && pluginManager.api && pluginManager.api.list && pluginManager.api.list()) || [];
    if (!items.length) { host.innerHTML = '<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>'; return; }
    host.innerHTML = items.map((p) => {
      const cat = catalog.find((c) => c.id === p.id);
      const dl = (cat && cat.downloads != null) ? `<span class="urppp-store-dl">↓ ${escapeHtml(String(cat.downloads))}</span>` : '';
      const repoBtn = (p.repo || (cat && cat.repo)) ? `<button type="button" class="urppp-set-btn ghost" data-repo="${escapeHtml(p.repo || cat.repo)}">仓库</button>` : '';
      return `<div class="urppp-store-item">
        <div class="urppp-store-row">
          <div class="urppp-store-info"><strong>${escapeHtml(p.name || p.id)}</strong>${p.author ? `<span class="urppp-store-author">${escapeHtml(p.author)}</span>` : ''}<span class="urppp-store-ver">${p.version ? 'v' + escapeHtml(p.version) : ''}</span><span class="urppp-store-state ok">已装</span>${dl}</div>
          <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-op="reload" data-plugin-id="${escapeHtml(p.id)}">重新装载</button><button type="button" class="urppp-set-btn ghost" data-plugin-op="unload" data-plugin-id="${escapeHtml(p.id)}">卸载</button>${repoBtn}</div>
        </div>
        ${p.description ? `<p class="urppp-store-item-desc">${escapeHtml(p.description)}</p>` : ''}
      </div>`;
    }).join('');
    host.querySelectorAll('[data-plugin-op="reload"]').forEach((b) => b.addEventListener('click', async () => {
      b.disabled = true; const old = b.textContent; b.textContent = '装载中…';
      try { if (pluginManager && pluginManager.api && pluginManager.api.install) {
        const dlp = showDownloadProgress('正在装载「' + b.dataset.pluginId + '」');
        try { await pluginManager.api.install(b.dataset.pluginId, null); dlp.done('已装载'); } catch (_) { dlp.fail('装载失败'); }
      } b.textContent = '已装载'; try { syncSettingsPanelUI(); } catch (_) {} }
      catch (_) { b.textContent = '失败'; }
      setTimeout(() => { b.textContent = old; b.disabled = false; }, 1200);
    }));
    host.querySelectorAll('[data-plugin-op="unload"]').forEach((b) => b.addEventListener('click', () => {
      try { if (pluginManager && pluginManager.api && pluginManager.api.unregister) pluginManager.api.unregister(b.dataset.pluginId); } catch (_) {}
      try { syncSettingsPanelUI(); } catch (_) {}
      const wrap = host.closest('.urppp-store-inline');
      try { renderPluginStoreBody(wrap); } catch (_) {}
    }));
    host.querySelectorAll('[data-repo]').forEach((b) => b.addEventListener('click', () => { try { window.open(b.dataset.repo, '_blank', 'noopener'); } catch (_) {} }));
  }

  // 插件商店：下载 + 管理
  function renderPluginStoreBody(body) {
    body.innerHTML = `
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${storeManageSettingsHtml()}<button type="button" class="urppp-set-btn ghost" data-add-local-plugin style="width:100%;margin:0 0 10px">＋ 添加本地插件</button><input type="file" accept=".js,.txt" data-local-plugin-file style="display:none"><div class="urppp-store-bd" id="urppp-plugin-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${storeSourcesHtml()}</div>
        </div>
      </div>`;
    bindStoreTabs(body);
    bindStoreManageSettings(body);
    bindLocalPluginImport(body);
    bindStoreSources(body);
    fetchCatalogPlugins(body.querySelector('[data-pane="download"]'));
    fetchPluginManage(body.querySelector('#urppp-plugin-manage'));
  }

  function bindLocalPluginImport(body) {
    const btn = body.querySelector('[data-add-local-plugin]');
    const file = body.querySelector('[data-local-plugin-file]');
    if (!btn || !file) return;
    btn.addEventListener('click', () => file.click());
    file.addEventListener('change', async () => {
      const f = file.files && file.files[0];
      if (!f) return;
      const text = await f.text();
      file.value = '';
      try {
        // 执行插件（IIFE），插件内部调用 window.__urpppPlugin.register 完成装载
        (new Function(text))();
      } catch (e) { toast('本地插件加载失败：' + (e && e.message ? e.message : e), 'error'); }
      try { fetchPluginManage(body.querySelector('#urppp-plugin-manage')); } catch (_) {}
    });
  }

  function renderSkinCards(panel) {
    if (!panel) return;
    const storeBarBtn = panel.querySelector('#urppp-theme-store');
    if (storeBarBtn && !storeBarBtn.dataset.bound) {
      storeBarBtn.dataset.bound = '1';
      storeBarBtn.addEventListener('click', () => openStoreSubPanel('theme'));
    }
    const list = panel.querySelector('#urppp-skin-list');
    if (!list) return;
    const cur = getSkin();
    list.innerHTML = '';
    if (!SKIN_CATALOG || !SKIN_CATALOG.length) {
      list.innerHTML = '<p class="urppp-set-tip">暂无可用风格</p>';
      return;
    }
    const locals = localThemes();
    const skinList = SKIN_CATALOG.filter((s) => s.installed !== false || themeDownloaded(s.id))
      .concat(Object.keys(locals).filter((id) => !SKIN_CATALOG.some((s) => s.id === id)).map((id) => ({
        id, name: locals[id].name || id, desc: locals[id].desc || '本地主题', version: locals[id].version || '1.0.0', installed: false,
      })));
    skinList.forEach((skin) => {
      const isLoc = !!locals[skin.id];
      const card = document.createElement('div');
      card.className = 'urppp-skin-card' + (skin.id === cur ? ' is-active' : '');
      card.dataset.skin = skin.id;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'urppp-skin-apply';
      const skinInstalled = skin.installed !== false || themeDownloaded(skin.id) || isLoc;
      if (!skinInstalled) {
        btn.classList.add('is-disabled');
        btn.textContent = '去下载';
      } else if (skin.id === cur && (skin.ready || isLoc)) {
        btn.classList.add('is-current');
        btn.textContent = '使用中';
        btn.disabled = true;
      } else {
        btn.textContent = '应用主题';
      }
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!skinInstalled) {
          // 未安装：打开主题商店
          openStoreSubPanel('theme');
          return;
        }
        if (skin.id === cur && skin.ready) return;
        if (setSkin(skin.id)) {
          syncSettingsPanelUI();
          try { if (window.__urpppCleanMode && window.__urpppCleanMode.inject) window.__urpppCleanMode.inject(); } catch (_) {}
        }
      });
      card.innerHTML = [
        '<div class="urppp-skin-name"></div>',
        '<p class="urppp-skin-desc"></p>'
      ].join('');
      card.querySelector('.urppp-skin-name').textContent = skin.name;
      card.querySelector('.urppp-skin-desc').textContent = skin.desc;
      card.appendChild(btn);
      // 卡样式直接内嵌随卡渲染（已下载缓存优先），避免独立 style 注入时序延迟
      try { let cc2 = ''; try { cc2 = GM_getValue('urppp_card_css_' + skin.id, '') || ''; } catch (_) {} if (cc2) { const st = document.createElement('style'); st.textContent = cc2; card.appendChild(st); } } catch (_) {}
      list.appendChild(card);
    });
    // 主题选择卡样式：全部从已下载缓存（GM urppp_card_css_<id>）读，不走线上 catalog
    try {
      const ccItems = skinList.map((s) => {
        let cc = ''; try { cc = GM_getValue('urppp_card_css_' + s.id, '') || ''; } catch (_) {}
        return { id: s.id, cardCss: cc };
      });
      ensureStoreCardStyles(ccItems);
    } catch (_) {}
  }

  // ===================== 检查更新（主插件 + 可扩展） =====================
  const __urpppUpdateCheckers = [];
  let __urpppUpdateBusy = false;

  // fetch 优先（CORS 机制，无需 GM 跨域授权弹窗）；失败再降级 GM_xmlhttpRequest（@connect 白名单兜底）
  function fetchWithTimeout(url, headers, timeoutMs) {
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    return fetch(url, { cache: 'no-store', headers, signal: ctrl ? ctrl.signal : undefined })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .finally(() => { if (timer) clearTimeout(timer); });
  }

  function gmRequestForUpdate(url, headers) {
    return new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          timeout: 12000,
          headers,
          onload: (r) => {
            if (r.status >= 200 && r.status < 400) resolve(r.responseText || '');
            else reject(new Error('HTTP ' + r.status));
          },
          onerror: () => reject(new Error('network error')),
          ontimeout: () => reject(new Error('timeout'))
        });
      } catch (e) { reject(e); }
    });
  }

  function fetchTextForUpdate(url, opts) {
    const headers = { 'Cache-Control': 'no-cache' };
    if (opts && opts.range) headers.Range = opts.range;
    // GM 优先：无 CORS/PNA/preflight，避免页面 fetch 对 http 页面的必现报错（raw PNA 拦截 / gh-proxy 无CORS头 / jsdelivr 不允许cache-control头）
    if (typeof GM_xmlhttpRequest === 'function') {
      return gmRequestForUpdate(url, headers).catch(() => fetchWithTimeout(url, headers, 12000));
    }
    return fetchWithTimeout(url, headers, 12000);
  }

  // 多源探测：主源（GitHub 权威）优先，primaryTimeout 内未响应则并发切换加速源；主源稍后返回也参与竞争
  async function fetchFirstAvailable(urls, opts, primaryTimeout = 1000) {
    const details = [];
    const primary = urls[0];
    const fallbacks = urls.slice(1);
    const grab = (url) => fetchTextForUpdate(url, opts)
      .then((text) => ({ url, text }))
      .catch((e) => { details.push((url.split('/')[2] || url) + ': ' + (e && e.message || e)); return null; });

    const primaryJob = grab(primary);
    const timeoutMark = new Promise((resolve) => setTimeout(() => resolve('__TIMEOUT__'), primaryTimeout));
    const first = await Promise.race([primaryJob, timeoutMark]);
    if (first !== '__TIMEOUT__') {
      if (first && first.text && first.text.length > 0) return first.text;
      // 主源返回但内容无效：直接走加速源
      const fb = await Promise.all(fallbacks.map(grab));
      const ok = fb.find((r) => r && r.text && r.text.length > 0);
      if (ok) return ok.text;
      throw new Error('所有更新源均不可用（' + details.join('; ') + '）');
    }
    // 主源超时：加速源并发；主源迟到成功才参与竞争（失败/无效不影响 fallback，避免抢先 reject）
    const fallbackJob = Promise.all(fallbacks.map(grab)).then((results) => {
      const ok = results.find((r) => r && r.text && r.text.length > 0);
      if (ok) return ok.text;
      throw new Error('所有更新源均不可用（' + details.join('; ') + '）');
    });
    const latePrimary = primaryJob
      .then((r) => {
        if (r && r.text && r.text.length > 0) return r.text;
        throw new Error('主源内容无效');
      })
      .catch(() => new Promise(() => {})); // 主源失败/无效：让位给 fallback
    return Promise.race([latePrimary, fallbackJob]);
  }

  function setUpdateStatus(html, type) {
    const el = document.getElementById('urppp-set-update-status');
    if (!el) return;
    el.dataset.locked = html ? '1' : '';
    el.innerHTML = html || '';
    el.style.color = type === 'err'
      ? '#b91c1c'
      : (type === 'ok' ? '#15803d' : 'var(--text-muted)');
  }

  async function checkMainUpdate() {
    const local = URPPP_VERSION;
    let remote = '';
    let singleStep = false; // 本地与远程相邻：version.json 内嵌日志可直接展示
    let changelogMd = '';
    try {
      const text = await fetchFirstAvailable(URPPP_UPDATE.sourceUrls(URPPP_UPDATE.versionJson));
      const j = JSON.parse(text);
      remote = String((j && j.version) || '').trim();
      if (j && String(j.prevVersion || '').trim() === local) singleStep = true;
      if (j && typeof j.changelog === 'string' && j.changelog.trim()) changelogMd = j.changelog;
    } catch (_) { /* version.json 失败，走 Range 回退 */ }
    if (!remote) {
      // 回退：Range 只拉脚本头解析 @version（约 2KB，避免全量 1.2MB），同样多源探测
      const head = await fetchFirstAvailable(URPPP_UPDATE.sourceUrls('urppp.user.js'), { range: 'bytes=0-2048' });
      remote = parseUserscriptVersion(head);
    }
    if (!remote) throw new Error('无法解析远程主插件版本');
    const cmp = compareVersions(remote, local);
    return {
      id: 'main',
      name: '主插件',
      local,
      remote,
      status: cmp > 0 ? 'update' : (cmp === 0 ? 'latest' : 'ahead'),
      updateUrl: URPPP_UPDATE.mainRaw,
      pageUrl: URPPP_UPDATE.greasySearch,
      // 单版本更新直接带内嵌日志；跨多版本留空，点击「更新日志」时拉全文
      changelogMd: singleStep ? changelogMd : '',
    };
  }

  // 从 CHANGELOG.md 截取 local(不含) → remote(含) 的更新日志
  function extractChangelogRange(md, fromVer, toVer) {
    const text = String(md || '').replace(/\r\n/g, '\n');
    if (!text.trim()) return '';
    // 支持 ## [1.0.4] 或 ## 1.0.4
    const re = /^##\s*\[?v?([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)\]?[^\n]*$/gim;
    const hits = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      hits.push({ ver: m[1], index: m.index, headEnd: re.lastIndex });
    }
    if (!hits.length) return '';
    // 段落结束到下一条 heading 或文末
    for (let i = 0; i < hits.length; i++) {
      const end = i + 1 < hits.length ? hits[i + 1].index : text.length;
      hits[i].body = text.slice(hits[i].index, end).trim();
    }
    const parts = [];
    for (const h of hits) {
      // 取 <= toVer 且 > fromVer 的条目
      if (compareVersions(h.ver, toVer) > 0) continue;
      if (compareVersions(h.ver, fromVer) <= 0) continue;
      parts.push(h.body);
    }
    return parts.join('\n\n').trim();
  }

  function ensureUpdateToastStyles() {
    // 允许热更新样式（开发迭代时覆盖旧 style 节点）
    const old = document.getElementById('urppp-update-toast-style');
    if (old) old.remove();
    const st = document.createElement('style');
    st.id = 'urppp-update-toast-style';
    st.textContent = `
      #urppp-update-toast{
        position:fixed!important;left:16px!important;bottom:16px!important;z-index:14080!important;
        width:min(360px,calc(100vw - 32px))!important;
        background:var(--surface,#fff)!important;color:var(--text,#0f172a)!important;
        border:1px solid var(--border,#e2e8f0)!important;border-radius:14px!important;
        box-shadow:0 16px 40px rgba(15,23,42,.18)!important;
        padding:14px 14px 12px!important;box-sizing:border-box!important;
        font:13px/1.45 system-ui,-apple-system,Segoe UI,sans-serif!important;
        opacity:0;transform:translateY(18px) scale(.96);
        pointer-events:none;visibility:hidden;
        transition:
          opacity .28s cubic-bezier(.22,1,.36,1),
          transform .34s cubic-bezier(.22,1,.36,1),
          visibility 0s linear .34s;
        will-change:opacity,transform;
      }
      #urppp-update-toast.open{
        opacity:1;transform:translateY(0) scale(1);
        pointer-events:auto;visibility:visible;
        transition:
          opacity .28s cubic-bezier(.22,1,.36,1),
          transform .34s cubic-bezier(.22,1,.36,1),
          visibility 0s linear 0s;
      }
      #urppp-update-toast.closing{
        opacity:0;transform:translateY(14px) scale(.97);
        pointer-events:none;visibility:visible;
      }
      #urppp-update-toast .uut-title{font-weight:700!important;font-size:14px!important;margin:0 0 4px!important;padding-right:28px!important;color:var(--text)!important}
      #urppp-update-toast .uut-sub{color:var(--text-muted,#64748b)!important;font-size:12px!important;margin:0 0 10px!important}
      #urppp-update-toast .uut-actions{display:flex!important;gap:8px!important;flex-wrap:wrap!important}
      #urppp-update-toast .uut-btn,
      #urppp-update-changelog .uut-btn{
        appearance:none!important;-webkit-appearance:none!important;
        border:1px solid var(--border,#e2e8f0)!important;
        background:var(--input-bg,#f8fafc)!important;
        color:var(--text,#0f172a)!important;
        border-radius:10px!important;padding:7px 12px!important;cursor:pointer!important;
        font-size:12px!important;font-weight:600!important;line-height:1.2!important;
        box-shadow:none!important;margin:0!important;min-height:0!important;
        transition:transform .15s ease,opacity .15s ease,background .15s ease,border-color .15s ease!important;
      }
      #urppp-update-toast .uut-btn:hover,
      #urppp-update-changelog .uut-btn:hover{
        transform:translateY(-1px);border-color:var(--primary,#b53434)!important;
      }
      #urppp-update-toast .uut-btn.primary,
      #urppp-update-changelog .uut-btn.primary{
        background:var(--primary,#b53434)!important;border-color:var(--primary,#b53434)!important;color:#fff!important;
      }
      #urppp-update-toast .uut-btn.ghost,
      #urppp-update-changelog .uut-btn.ghost{
        background:transparent!important;
      }
      #urppp-update-toast .uut-close{
        position:absolute!important;top:8px!important;right:8px!important;width:28px!important;height:28px!important;border:none!important;
        background:transparent!important;color:var(--text-muted,#64748b)!important;border-radius:8px!important;cursor:pointer!important;font-size:16px!important;
      }
      #urppp-update-toast .uut-close:hover{background:var(--input-bg,#f8fafc)!important;color:var(--text,#0f172a)!important}
      #urppp-update-changelog{
        position:fixed!important;inset:0!important;z-index:14090!important;
        display:flex!important;align-items:center!important;justify-content:center!important;
        background:rgba(15,23,42,0)!important;padding:16px!important;box-sizing:border-box!important;
        opacity:0;pointer-events:none;visibility:hidden;
        transition:opacity .26s ease,background .26s ease,visibility 0s linear .26s;
      }
      #urppp-update-changelog.open{
        opacity:1;pointer-events:auto;visibility:visible;background:rgba(15,23,42,.42)!important;
        transition:opacity .26s ease,background .26s ease,visibility 0s linear 0s;
      }
      #urppp-update-changelog.closing{
        opacity:0;pointer-events:none;visibility:visible;background:rgba(15,23,42,0)!important;
      }
      #urppp-update-changelog .uuc-panel{
        width:min(520px,100%)!important;max-height:min(72vh,640px)!important;overflow:auto!important;
        background:var(--surface,#fff)!important;color:var(--text,#0f172a)!important;
        border:1px solid var(--border,#e2e8f0)!important;border-radius:14px!important;
        box-shadow:0 20px 50px rgba(15,23,42,.24)!important;padding:16px!important;box-sizing:border-box!important;
        transform:translateY(16px) scale(.96);opacity:0;
        transition:transform .32s cubic-bezier(.22,1,.36,1),opacity .26s ease;
      }
      #urppp-update-changelog.open .uuc-panel{transform:translateY(0) scale(1);opacity:1}
      #urppp-update-changelog.closing .uuc-panel{transform:translateY(12px) scale(.97);opacity:0}
      #urppp-update-changelog .uuc-head{
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin-bottom:12px!important;
        position:sticky!important;top:0!important;background:var(--surface,#fff)!important;z-index:1!important;padding-bottom:8px!important;
        border-bottom:1px solid var(--border,#e2e8f0)!important;
      }
      #urppp-update-changelog .uuc-head h3{margin:0!important;font-size:15px!important;font-weight:700!important;color:var(--text)!important}
      #urppp-update-changelog .uuc-body{
        font-size:13px!important;line-height:1.6!important;color:var(--text,#0f172a)!important;
        white-space:normal!important;
      }
      #urppp-update-changelog .uuc-body h2{
        margin:0 0 10px!important;font-size:16px!important;font-weight:700!important;color:var(--text)!important;
        border:none!important;padding:0!important;
      }
      #urppp-update-changelog .uuc-body h3{
        margin:14px 0 8px!important;font-size:13px!important;font-weight:700!important;
        color:var(--primary,#b53434)!important;letter-spacing:.02em!important;
      }
      #urppp-update-changelog .uuc-body p{
        margin:0 0 8px!important;color:var(--text)!important;
      }
      #urppp-update-changelog .uuc-body ul{
        margin:0 0 10px!important;padding:0 0 0 1.15em!important;list-style:disc!important;
      }
      #urppp-update-changelog .uuc-body li{
        margin:0 0 6px!important;color:var(--text)!important;
      }
      #urppp-update-changelog .uuc-body code{
        font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;
        font-size:12px!important;background:var(--input-bg,#f1f5f9)!important;
        border:1px solid var(--border,#e2e8f0)!important;border-radius:6px!important;
        padding:1px 5px!important;color:var(--text)!important;
      }
      #urppp-update-changelog .uuc-body a{color:var(--primary,#b53434)!important;text-decoration:underline!important}
      #urppp-update-changelog .uuc-body .uuc-meta{
        color:var(--text-muted,#64748b)!important;font-size:12px!important;margin-bottom:12px!important;
      }
      @media (prefers-reduced-motion: reduce) {
        #urppp-update-toast,#urppp-update-toast.open,#urppp-update-toast.closing,
        #urppp-update-changelog,#urppp-update-changelog.open,#urppp-update-changelog.closing,
        #urppp-update-changelog .uuc-panel{transition:none!important;transform:none!important}
      }
    `;
    document.documentElement.appendChild(st);
  }

  // 轻量 Markdown → HTML（仅覆盖 CHANGELOG 常用语法）
  function renderChangelogMarkdown(md) {
    const src = String(md || '').replace(/\r\n/g, '\n').trim();
    if (!src) return '<p class="uuc-meta">暂无更新日志</p>';

    const inline = (s) => {
      let t = escapeHtml(s);
      // code
      t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
      // bold
      t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // links [text](url)
      t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      // bare path-ish backticks already handled; auto-link plain http
      t = t.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g,
        '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
      return t;
    };

    const lines = src.split('\n');
    const out = [];
    let listOpen = false;
    const closeList = () => {
      if (listOpen) { out.push('</ul>'); listOpen = false; }
    };

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.replace(/\s+$/, '');
      if (!line.trim()) {
        closeList();
        continue;
      }
      // heading ## / ###
      let hm = line.match(/^(#{2,3})\s+(.+)$/);
      if (hm) {
        closeList();
        const level = hm[1].length; // 2 or 3
        const text = hm[2];
        out.push(level === 2 ? `<h2>${inline(text)}</h2>` : `<h3>${inline(text)}</h3>`);
        continue;
      }
      // list item
      let lm = line.match(/^[-*]\s+(.+)$/);
      if (lm) {
        if (!listOpen) { out.push('<ul>'); listOpen = true; }
        out.push(`<li>${inline(lm[1])}</li>`);
        continue;
      }
      // paragraph
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
    closeList();
    return out.join('') || '<p class="uuc-meta">暂无更新日志</p>';
  }

  function hideUpdateToast(toast) {
    const el = toast || document.getElementById('urppp-update-toast');
    if (!el || !el.classList.contains('open')) {
      if (el) {
        el.classList.remove('open', 'closing');
      }
      return;
    }
    if (el.__closing) return;
    el.__closing = true;
    el.classList.add('closing');
    el.classList.remove('open');
    const done = () => {
      el.classList.remove('closing');
      el.__closing = false;
      el.removeEventListener('transitionend', onEnd);
    };
    const onEnd = (e) => {
      if (e && e.target !== el) return;
      if (e && e.propertyName && e.propertyName !== 'opacity' && e.propertyName !== 'transform') return;
      done();
    };
    el.addEventListener('transitionend', onEnd);
    // 兜底：无 transition / 被打断时也能收干净
    setTimeout(done, 380);
  }

  function hideChangelogModal(wrap) {
    const el = wrap || document.getElementById('urppp-update-changelog');
    if (!el) return;
    if (!el.classList.contains('open') && !el.classList.contains('closing')) return;
    if (el.__closing) return;
    el.__closing = true;
    el.classList.add('closing');
    el.classList.remove('open');
    const done = () => {
      el.classList.remove('closing');
      el.__closing = false;
      el.removeEventListener('transitionend', onEnd);
    };
    const onEnd = (e) => {
      if (e && e.target !== el) return;
      if (e && e.propertyName && e.propertyName !== 'opacity' && e.propertyName !== 'background-color' && e.propertyName !== 'background') return;
      done();
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(done, 360);
  }

  function openChangelogModal(title, bodyHtml) {
    ensureUpdateToastStyles();
    let wrap = document.getElementById('urppp-update-changelog');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'urppp-update-changelog';
      wrap.innerHTML = `
        <div class="uuc-panel" role="dialog" aria-modal="true" aria-label="更新日志">
          <div class="uuc-head">
            <h3></h3>
            <button type="button" class="uut-btn ghost" data-close="1">关闭</button>
          </div>
          <div class="uuc-body"></div>
        </div>`;
      wrap.addEventListener('click', (e) => {
        if (e.target === wrap || (e.target && e.target.getAttribute && e.target.getAttribute('data-close') === '1')) {
          hideChangelogModal(wrap);
        }
      });
      document.documentElement.appendChild(wrap);
    }
    wrap.querySelector('h3').textContent = title || '更新日志';
    wrap.querySelector('.uuc-body').innerHTML = bodyHtml || '<p class="uuc-meta">暂无更新日志</p>';
    // 重触发入场动效
    wrap.__closing = false;
    wrap.classList.remove('open', 'closing');
    void wrap.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => wrap.classList.add('open'));
    });
  }

  function showUpdateToast(info) {
    ensureUpdateToastStyles();
    let toast = document.getElementById('urppp-update-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'urppp-update-toast';
      toast.innerHTML = `
        <button type="button" class="uut-close" aria-label="关闭">×</button>
        <div class="uut-title"></div>
        <div class="uut-sub"></div>
        <div class="uut-actions">
          <button type="button" class="uut-btn" data-act="log">更新日志</button>
          <button type="button" class="uut-btn primary" data-act="go">去更新</button>
          <button type="button" class="uut-btn ghost" data-act="later">稍后</button>
        </div>`;
      toast.querySelector('.uut-close').addEventListener('click', () => hideUpdateToast(toast));
      toast.addEventListener('click', async (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
        if (!btn) return;
        const act = btn.getAttribute('data-act');
        const pack = toast.__pack || {};
        if (act === 'later') {
          hideUpdateToast(toast);
          return;
        }
        if (act === 'go') {
          // 优先油猴安装/更新地址（@downloadURL / raw），新窗口打开便于 Tampermonkey 接管
          const url = pack.updateUrl || URPPP_UPDATE.mainRaw;
          try { window.open(url, '_blank', 'noopener,noreferrer'); } catch (_) { location.href = url; }
          return;
        }
        if (act === 'log') {
          btn.disabled = true;
          btn.textContent = '加载中…';
          try {
            let md = pack.changelogMd;
            if (!md) {
              md = await fetchFirstAvailable(URPPP_UPDATE.sourceUrls('CHANGELOG.md'));
              pack.changelogMd = md;
            }
            const range = extractChangelogRange(md, pack.local, pack.remote);
            const pretty = range
              ? renderChangelogMarkdown(range)
              : ('<p class="uuc-meta">未找到区间日志。</p><p><a href="' + URPPP_UPDATE.changelogPage + '" target="_blank" rel="noopener noreferrer">打开完整 CHANGELOG</a></p>');
            openChangelogModal('更新日志 ' + pack.local + ' → ' + pack.remote, pretty);
          } catch (err) {
            openChangelogModal('更新日志',
              '<p>加载失败：' + escapeHtml(err && err.message || err) + '</p>' +
              '<p><a href="' + URPPP_UPDATE.changelogPage + '" target="_blank" rel="noopener noreferrer">打开 GitHub CHANGELOG</a></p>');
          } finally {
            btn.disabled = false;
            btn.textContent = '更新日志';
          }
        }
      });
      document.documentElement.appendChild(toast);
    }
    toast.__pack = info || {};
    toast.querySelector('.uut-title').textContent = '发现新版本 ' + (info && info.remote || '');
    toast.querySelector('.uut-sub').textContent = '当前 ' + (info && info.local || '') + ' · 主插件可更新';
    // 每次显示都重播入场动效
    toast.__closing = false;
    toast.classList.remove('open', 'closing');
    void toast.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('open'));
    });
  }

  async function maybeAutoCheckUpdate() {
    if (!isAutoUpdateCheck()) return;
    // 仅限制"同一次页面生命周期"不重复请求；刷新 / 重新进入会再检再弹
    if (window.__urpppAutoUpdateTried) return;
    window.__urpppAutoUpdateTried = true;
    try {
      const r = await checkMainUpdate();
      if (r && r.status === 'update') {
        showUpdateToast(r);
      }
      // 辅助插件热更新：检测到有新版自动覆盖缓存（下次进页生效），无需用户操作
      const assistR = await hotUpdateAssist();
      if (assistR) { try { console.log('[URP++] 辅助插件热更新到', assistR.version); } catch (_) {} }
    } catch (e) {
      // 静默失败，不打扰
      try { console.debug('[URP++] auto update check failed', e); } catch (_) {}
    }
  }

  function hotUpdateAssist() {
    const checker = (window.__urpppUpdateCheckers || __urpppUpdateCheckers || []).find((c) => c && c.id === 'assist');
    if (!checker || typeof checker.check !== 'function') return Promise.resolve(null);
    return Promise.resolve().then(() => checker.check()).then((r) => {
      if (r && r.status === 'update') {
        return pluginManager.update('assist');
      }
      return null;
    }).catch(() => null);
  }

  async function checkForUpdates() {
    if (__urpppUpdateBusy) return;
    __urpppUpdateBusy = true;
    const btn = document.getElementById('urppp-set-check-update');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '检查中…';
    }
    setUpdateStatus('正在从多源检查更新…');
    try {
      const jobs = [checkMainUpdate()];
      // 副插件注册的额外检查项
      (__urpppUpdateCheckers || []).forEach((c) => {
        if (c && typeof c.check === 'function') {
          jobs.push(Promise.resolve().then(() => c.check()).then((r) => r || {
            id: c.id || 'extra',
            name: c.name || '扩展',
            status: 'err',
            message: '无结果'
          }).catch((e) => ({
            id: c.id || 'extra',
            name: c.name || '扩展',
            status: 'err',
            message: String(e && e.message || e)
          })));
        }
      });
      const results = await Promise.all(jobs);
      const lines = results.map((r) => {
        if (!r) return '';
        if (r.status === 'err') {
          return `• <b>${escapeHtml(r.name || r.id)}</b>：检查失败（${escapeHtml(r.message || 'unknown')}）`;
        }
        if (r.status === 'update') {
          let action = '';
          if (r.id === 'assist' && pluginManager && pluginManager.loaded('assist')) {
            // 主插件装载式：提供「重新装载」按钮（重新下载注入）
            action = ' <a class="urppp-update-relaunch" href="javascript:void(0)" data-urppp-relaunch="assist" rel="nofollow">重新装载</a>';
          } else {
            const link = r.updateUrl
              ? ` <a href="${escapeHtml(r.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`
              : '';
            const page = r.pageUrl
              ? ` <a href="${escapeHtml(r.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`
              : '';
            action = link + page;
          }
          return `• <b>${escapeHtml(r.name)}</b>：发现新版本 <b>${escapeHtml(r.remote)}</b>（当前 ${escapeHtml(r.local)}）${action}`;
        }
        if (r.status === 'ahead') {
          return `• <b>${escapeHtml(r.name)}</b>：本地 ${escapeHtml(r.local)} 新于远程 ${escapeHtml(r.remote)}`;
        }
        return `• <b>${escapeHtml(r.name)}</b>：已是最新（${escapeHtml(r.local)}）`;
      }).filter(Boolean);

      const hasUpdate = results.some((r) => r && r.status === 'update');
      const hasErr = results.some((r) => r && r.status === 'err');
      const head = hasUpdate ? '检查完成：发现更新' : (hasErr ? '检查完成：部分失败' : '检查完成：全部最新');
      setUpdateStatus(
        `${head}<br>${lines.join('<br>')}<br><span style="opacity:.85">仓库：<a href="${URPPP_UPDATE.repo}" target="_blank" rel="noopener noreferrer">SCU-URP-plusplus</a></span>`,
        hasErr ? 'err' : (hasUpdate ? 'ok' : 'ok')
      );

      // 主插件装载式的辅助插件更新：绑定「重新装载」动作
      const relaunch = document.querySelector('#urppp-set-update-status .urppp-update-relaunch[data-urppp-relaunch="assist"]');
      if (relaunch) {
        relaunch.addEventListener('click', () => {
          try {
            setUpdateStatus('正在重新装载辅助插件…', '');
            pluginManager.install('assist').then(() => {
              setUpdateStatus('辅助插件已重新装载，刷新页面后生效。', 'ok');
            }).catch((e) => {
              setUpdateStatus('重新装载失败：' + (e && e.message ? e.message : e), 'err');
            });
          } catch (e) {
            setUpdateStatus('重新装载失败：' + (e && e.message ? e.message : e), 'err');
          }
        });
      }
    } catch (e) {
      setUpdateStatus('检查失败：' + escapeHtml(e && e.message || e), 'err');
    } finally {
      __urpppUpdateBusy = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = '检查更新';
      }
    }
  }

  function refreshUpdateStatusHint() {
    const el = document.getElementById('urppp-set-update-status');
    if (!el || el.dataset.locked === '1') return;
    // 主插件只展示自己；辅助版本仅在副脚本主动注册后追加，不写“未检测到”
    let text = '当前主插件：' + URPPP_VERSION;
    const assistVer = el.getAttribute('data-assist-version') || '';
    if (assistVer) text += '；辅助插件：' + assistVer;
    el.textContent = text;
    el.style.color = 'var(--text-muted)';
  }

  // 给辅助插件扩展：registerChecker({ id, name, check: async () => result, localVersion? })
  function registerUpdateChecker(checker) {
    if (!checker || typeof checker.check !== 'function') return false;
    const id = String(checker.id || checker.name || '').trim();
    if (!id) return false;
    const idx = __urpppUpdateCheckers.findIndex((c) => c && c.id === id);
    const item = {
      id,
      name: checker.name || id,
      check: checker.check,
      localVersion: checker.localVersion || ''
    };
    if (idx >= 0) __urpppUpdateCheckers[idx] = item;
    else __urpppUpdateCheckers.push(item);
    try {
      const el = document.getElementById('urppp-set-update-status');
      if (el && item.localVersion && id === 'assist') {
        el.setAttribute('data-assist-version', String(item.localVersion));
      }
    } catch (_) {}
    try { refreshUpdateStatusHint(); } catch (_) {}
    return true;
  }

  function publishUpdateApi() {
    const api = {
      version: URPPP_VERSION,
      urls: URPPP_UPDATE,
      check: checkForUpdates,
      checkMain: checkMainUpdate,
      registerChecker: registerUpdateChecker,
      compareVersions,
      parseUserscriptVersion,
      extractChangelogRange,
      showUpdateToast,
      maybeAutoCheckUpdate,
      listCheckers: () => __urpppUpdateCheckers.slice()
    };
    try { window.__urpppUpdate = api; } catch (_) {}
    // @grant 沙箱：副脚本读页面 window 时需要挂到 unsafeWindow
    try {
      if (typeof unsafeWindow !== 'undefined' && unsafeWindow) unsafeWindow.__urpppUpdate = api;
    } catch (_) {}
    return api;
  }
  publishUpdateApi();

  const { rebuildSidebarCompletely, syncMobileContentOffset, syncSidebarUnderNavbar } = createSidebarController({});

  const { rebuildDashboard } = createDashboardController({
    deps: {
      statCardPrivacyMarkup,
    },
  });

  // ============================================================
  // 清爽模式 Clean Mode v1.0.0
  // 桌面居中一页 1:1；手机底栏；数据按真实 URP DOM/路径解析
  // 绩点：川大现行百分制对照表；教室：classroomUseStatus 网格
  // ============================================================
  const CLEAN_FLAG = 'urppp-clean-open';

  // 川大现行百分制绩点对照（成绩单）
  const SCU_SCORE_GPA_TABLE = {
    100:4.0,99:4.0,98:4.0,97:4.0,96:4.0,95:4.0,
    94:3.9,93:3.8,92:3.7,91:3.6,90:3.5,
    89:3.4,88:3.3,87:3.2,86:3.1,85:3.0,
    84:2.9,83:2.8,82:2.7,81:2.6,80:2.5,
    79:2.4,78:2.3,77:2.2,76:2.1,75:2.0,
    74:1.9,73:1.8,72:1.7,71:1.6,70:1.5,
    69:1.4,68:1.3,67:1.2,66:1.1,65:1.0,
    64:0.9,63:0.8,62:0.7,61:0.6,60:0.5
  };


  function isUnevaluatedScore(raw) {
    if (raw == null || raw === '') return false;
    const s = String(raw).trim();
    if (!s) return false;
    if (/未评估|未评教|待评估|待评教/.test(s)) return true;
    const n = Number(s);
    if (!Number.isNaN(n) && n < 0) return true;
    return false;
  }

  function isValidOfficialGpa(v) {
    if (v == null || v === '') return false;
    const n = Number(v);
    return !Number.isNaN(n) && n >= 0 && n <= 5;
  }

  function firstContentChar(text) {
    const s = String(text || '').trim();
    if (!s) return '';
    const m = s.match(/[\u4e00-\u9fffA-Za-z0-9]/);
    return m ? m[0] : s.charAt(0);
  }

  function weekBitmapActive(bitmap, week) {
    const s = String(bitmap || '');
    const w = Number(week) || 0;
    if (!s || w <= 0 || w > s.length) return false;
    return s.charAt(w - 1) === '1';
  }

  function scoreToGpa(raw) {
    if (raw == null || raw === '') return null;
    const s = String(raw).trim();
    if (!s) return null;
    if (isUnevaluatedScore(s)) return null;
    if (/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(s)) return null;
    if (/^A\+$/i.test(s) || /^A$/i.test(s)) return 4.0;
    if (/^A-$/i.test(s)) return 3.7;
    if (/^B\+$/i.test(s)) return 3.3;
    if (/^B$/i.test(s)) return 3.0;
    if (/^B-$/i.test(s)) return 2.7;
    if (/^C\+$/i.test(s)) return 2.3;
    if (/^C$/i.test(s)) return 2.0;
    if (/^C-$/i.test(s)) return 1.7;
    if (/^D$/i.test(s)) return 1.3;
    if (/^F$/i.test(s)) return 0;
    if (/优秀/.test(s)) return 4.0;
    if (/良好/.test(s)) return 3.0;
    if (/中等/.test(s)) return 2.0;
    if (/及格/.test(s) && !/不及格/.test(s)) return 1.0;
    if (/不及格|不合格|不通过/.test(s)) return 0;
    if (/合格/.test(s)) return 1.0;
    const n = parseFloat(s.replace(/[^\d.]/g, ''));
    if (Number.isNaN(n) || n < 0) return null;
    const score = Math.round(n);
    if (score < 60) return 0;
    if (score > 100) return 4.0;
    if (SCU_SCORE_GPA_TABLE[score] != null) return SCU_SCORE_GPA_TABLE[score];
    return SCU_SCORE_GPA_TABLE[Math.max(60, Math.min(100, Math.floor(n)))] || 0;
  }

  function scoreToNumber(raw) {
    const s = String(raw || '').trim();
    if (!s || isUnevaluatedScore(s)) return null;
    if (/优秀/.test(s)) return 95;
    if (/良好/.test(s)) return 85;
    if (/中等/.test(s)) return 75;
    if (/及格/.test(s) && !/不及格/.test(s)) return 65;
    if (/不及格|不合格|不通过/.test(s)) return 0;
    if (/合格/.test(s)) return 70;
    if (/^A/i.test(s)) return 95;
    if (/^B/i.test(s)) return 85;
    if (/^C/i.test(s)) return 75;
    if (/^D/i.test(s)) return 65;
    if (/^F/i.test(s)) return 0;
    const n = parseFloat(s.replace(/[^\d.]/g, ''));
    if (Number.isNaN(n) || n < 0) return null;
    return n;
  }

  function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }
  function isRequiredAttr(attr) { return /必修/.test(String(attr || '')); }

  function summarizeCourses(list) {
    let creditSum = 0, scoreW = 0, gpaW = 0, gpaCredit = 0;
    let reqCredit = 0, reqScoreW = 0, reqGpaW = 0, reqGpaCredit = 0;
    (list || []).forEach((c) => {
      if (c && (c.unevaluated || isUnevaluatedScore(c.score))) return;
      const cr = Number(c.credit) || 0;
      const sc = scoreToNumber(c.score);
      const gp = (isValidOfficialGpa(c.officialGpa) ? Number(c.officialGpa) : scoreToGpa(c.score));
      if (sc == null || cr <= 0) return;
      creditSum += cr;
      scoreW += sc * cr;
      if (gp != null) { gpaW += gp * cr; gpaCredit += cr; }
      if (c.required) {
        reqCredit += cr;
        reqScoreW += sc * cr;
        if (gp != null) { reqGpaW += gp * cr; reqGpaCredit += cr; }
      }
    });
    return {
      totalCredit: round2(creditSum),
      avgScore: round2(creditSum ? scoreW / creditSum : 0),
      avgGpa: round2(gpaCredit ? gpaW / gpaCredit : 0),
      requiredCredit: round2(reqCredit),
      requiredGpa: round2(reqGpaCredit ? reqGpaW / reqGpaCredit : 0),
      requiredAvg: round2(reqCredit ? reqScoreW / reqCredit : 0),
      count: (list || []).length
    };
  }

  function absUrl(url) {
    const u = String(url || '');
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('//')) return location.protocol + u;
    if (u.startsWith('/')) return location.origin + u;
    return location.origin + '/' + u.replace(/^\.\//, '');
  }

  // 注意：不要带 X-Requested-With，否则部分 URP 页只回片段、没有完整 table
  function fetchText(url, opts) {
    const full = absUrl(url);
    const method = (opts && opts.method) || 'GET';
    const data = (opts && opts.data) || null;
    return new Promise((resolve, reject) => {
      const done = (ok, val) => (ok ? resolve(val) : reject(new Error(val || 'fetch failed')));
      try {
        if (typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest({
            method,
            url: full,
            data: data || undefined,
            headers: opts && opts.headers ? opts.headers : {},
            withCredentials: true,
            onload: (r) => {
              if (r.status >= 200 && r.status < 400) done(true, r.responseText || '');
              else done(false, 'HTTP ' + r.status);
            },
            onerror: () => done(false, 'network error')
          });
          return;
        }
      } catch (_) {}
      fetch(full, {
        method,
        credentials: 'include',
        cache: 'no-store',
        headers: opts && opts.headers ? opts.headers : {},
        body: data || undefined
      }).then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      }).then((txt) => done(true, txt)).catch((e) => done(false, e && e.message));
    });
  }

  function parseHtml(html) {
    return new DOMParser().parseFromString(String(html || ''), 'text/html');
  }

  function ensureFeatureStyles() {
    if (document.getElementById('urppp-feature-style')) return;
    const style = document.createElement('style');
    style.id = 'urppp-feature-style';
    style.textContent = featureStyles;
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureScheduleExportStyles() {
    if (document.getElementById('urppp-schedule-export-style')) return;
    const style = document.createElement('style');
    style.id = 'urppp-schedule-export-style';
    style.textContent = scheduleExportStyles;
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureSettingsStyles() {
    if (document.getElementById('urppp-settings-style')) return;
    const style = document.createElement('style');
    style.id = 'urppp-settings-style';
    style.textContent = settingsStyles;
    (document.head || document.documentElement).appendChild(style);
  }

  // ---- 条件性样式分组：命中即注 + 空闲预载（最终与全量注入等价，仅首屏解析错峰）----
  function ensureDashboardStyles() {
    if (document.getElementById('urppp-dashboard-style')) return;
    const style = document.createElement('style');
    style.id = 'urppp-dashboard-style';
    style.textContent = dashboardStyles;
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureScheduleCardStyles() {
    if (document.getElementById('urppp-schedule-card-style')) return;
    const style = document.createElement('style');
    style.id = 'urppp-schedule-card-style';
    style.textContent = scheduleCardStyles;
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureMobileStyles() {
    if (document.getElementById('urppp-mobile-style')) return;
    const style = document.createElement('style');
    style.id = 'urppp-mobile-style';
    style.textContent = mobileStyles;
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureRouteStyles() { // 路由切换到目标页时立即补注，不等空闲
    try { if (isHomePage()) ensureDashboardStyles(); } catch (_) {}
    try { if (isPersonalSchedulePage(location)) ensureScheduleCardStyles(); } catch (_) {}
  }

  function scheduleDeferredStyles() { // 首屏完成后空闲预载剩余分组
    if (window.__urpppDeferredStylesDone) return;
    window.__urpppDeferredStylesDone = true;
    const runAll = () => {
      try { ensureMobileStyles(); } catch (_) {}
      try { ensureDashboardStyles(); } catch (_) {}
      try { ensureScheduleCardStyles(); } catch (_) {}
    };
    try {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(runAll, { timeout: 4000 });
      else setTimeout(runAll, 2200);
    } catch (_) { setTimeout(runAll, 2200); }
  }

  function ensureNavNameTarget(root) {
    const scope = root && root.querySelector ? root : document;
    const user = scope.querySelector('#navbar .user-info, .ace-nav .user-info, .user-info');
    if (!user) return null;
    const existing = user.querySelector('.urppp-user-name-value');
    if (existing) return existing;
    const clone = user.cloneNode(true);
    clone.querySelectorAll('small, i, img, b, .badge').forEach((node) => node.remove());
    const original = (clone.textContent || '').replace(/^\s*欢迎您[，,]?\s*/g, '').replace(/\s+/g, ' ').trim();
    Array.from(user.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.remove();
    });
    const target = document.createElement('span');
    target.className = 'urppp-user-name-value';
    target.textContent = original || '同学';
    target.__urpppOriginalText = target.textContent;
    user.appendChild(target);
    return target;
  }

  function classifyPrivacyLabel(label) {
    const text = String(label || '').replace(/[\s:：]/g, '');
    if (!text) return '';
    if (/姓名|英文姓名|姓名拼音/.test(text)) return 'name';
    if (/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(text)) return 'identity';
    if (/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(text)) return 'organization';
    if (/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(text)) return 'contact';
    if (/绩点|GPA/.test(text)) return 'gpa';
    if (/学分/.test(text)) return 'credit';
    if (/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(text)) return 'grade';
    if (/课表|日程安排/.test(text)) return 'schedule';
    return '';
  }

  function classifyHomeDataKey(value, label) {
    const text = String(value || '') + ' ' + String(label || '');
    if (/绩点|GPA/.test(text)) return 'majorGpa';
    if (/主修为|培养方案|方案/.test(text)) return 'majorPlan';
    if (/尚不及格|未及格/.test(text)) return 'failedCourses';
    if (/待修读课程/.test(text)) return 'remainingCourses';
    if (/已修读课程/.test(text)) return 'completedCourses';
    return '';
  }

  function homePrivateValueSpan(field, homeKey, content) {
    const editAttr = homeKey ? ` data-urppp-edit-key="${homeKey}"` : '';
    return `<span class="urppp-private-value" data-urppp-private="${field}"${editAttr}>${content}</span>`;
  }

  function statCardPrivacyMarkup(value, label) {
    const safeValue = escapeHtml(value);
    const safeLabel = escapeHtml(label);
    const homeKey = classifyHomeDataKey(value, label);
    const homeField = {
      completedCourses: 'other',
      failedCourses: 'other',
      majorGpa: 'gpa',
      majorPlan: 'organization',
      remainingCourses: 'other'
    }[homeKey];
    const field = homeField || classifyPrivacyLabel(String(value || '') + ' ' + String(label || ''));
    if (field === 'organization') {
      return label
        ? { valueHtml: safeValue, labelHtml: homePrivateValueSpan('organization', homeKey, safeLabel) }
        : { valueHtml: homePrivateValueSpan('organization', homeKey, safeValue), labelHtml: safeLabel };
    }
    if (!['grade', 'gpa', 'credit', 'other'].includes(field)) return { valueHtml: safeValue, labelHtml: safeLabel };
    const numericLabel = String(label || '').match(/-?\d+(?:\.\d+)?/);
    const valueIsDirect = /^-?\d+(?:\.\d+)?$/.test(String(value || '').trim()) || /^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(value || '').trim());
    if (!valueIsDirect && numericLabel) {
      const index = numericLabel.index || 0;
      const before = String(label).slice(0, index);
      const after = String(label).slice(index + numericLabel[0].length);
      return {
        valueHtml: safeValue,
        labelHtml: `${escapeHtml(before)}${homePrivateValueSpan(field, homeKey, escapeHtml(numericLabel[0]))}${escapeHtml(after)}`
      };
    }
    return { valueHtml: homePrivateValueSpan(field, homeKey, safeValue), labelHtml: safeLabel };
  }

  function privacyReplacement(config, field) {
    if (!config || config.mode === 'off') return '';
    if (config.mode === 'one') return config.mask || PRIVACY_MASK_TEXT;
    if (field === 'name') return '';
    const item = config.fields && config.fields[field];
    if (!item || !item.enabled) return '';
    return String(item.replacement || config.mask || PRIVACY_MASK_TEXT);
  }

  function markPrivateText(element, replacement) {
    if (!element || !replacement) return;
    if (element.querySelector && element.querySelector('input,select,textarea,button')) return;
    if (!element.classList.contains('urppp-private-text')) {
      const fontSize = getComputedStyle(element).fontSize;
      if (fontSize && fontSize !== '0px') element.style.setProperty('--urppp-private-font-size', fontSize);
    }
    element.classList.add('urppp-private-text');
    element.setAttribute('data-urppp-private-mask', replacement);
  }

  function markPrivateAvatar(image, replacement) {
    if (!image || !image.parentElement) return;
    const host = image.parentElement;
    image.classList.add('urppp-private-avatar');
    host.classList.add('urppp-private-avatar-host');
    host.setAttribute('data-urppp-private-mask', replacement || PRIVACY_MASK_TEXT);
    const rect = image.getBoundingClientRect();
    host.style.setProperty('--urppp-avatar-left', image.offsetLeft + 'px');
    host.style.setProperty('--urppp-avatar-top', image.offsetTop + 'px');
    host.style.setProperty('--urppp-avatar-width', Math.max(1, rect.width) + 'px');
    host.style.setProperty('--urppp-avatar-height', Math.max(1, rect.height) + 'px');
    host.style.setProperty('--urppp-avatar-radius', getComputedStyle(image).borderRadius || '50%');
  }

  function markPrivateBlock(element, replacement) {
    if (!element || !replacement) return;
    const host = element.matches('table') ? (element.closest('.table-responsive, .urppp-table-wrap') || element) : element;
    host.classList.add('urppp-private-block');
    host.setAttribute('data-urppp-private-mask', replacement);
  }

  function markDirectEditable(element, key) {
    if (!element || !DIRECT_EDIT_LABELS[key]) return;
    if (!element.hasAttribute('data-urppp-direct-tabindex')) {
      const tabindex = element.getAttribute('tabindex');
      element.setAttribute('data-urppp-direct-tabindex', tabindex == null ? '__none__' : tabindex);
      element.__urpppDirectTitle = element.getAttribute('title');
      element.__urpppDirectAriaLabel = element.getAttribute('aria-label');
    }
    element.classList.add('urppp-direct-editable');
    element.setAttribute('tabindex', '0');
    element.setAttribute('data-urppp-edit-key', key);
    element.setAttribute('aria-label', '修改' + DIRECT_EDIT_LABELS[key] + '显示值');
    element.title = '点击修改显示值';
  }

  let activeDirectEditInput = null;

  function openDirectEditInput(target) {
    const key = target && target.getAttribute('data-urppp-edit-key');
    if (!key || !DIRECT_EDIT_LABELS[key]) return;
    if (activeDirectEditInput && activeDirectEditInput.__finish) activeDirectEditInput.__finish(false);
    const config = getPrivacySettings();
    if (config.mode !== 'custom' || !config.directEdit.enabled) return;
    const directValue = String(config.directEdit.values[key] || '');
    const visibleValue = directValue || target.getAttribute('data-urppp-private-mask') || String(target.textContent || '').trim();
    const ownRect = target.getBoundingClientRect();
    const parentRect = target.parentElement?.getBoundingClientRect();
    const rect = ownRect.height >= 8 || !parentRect ? ownRect : {
      left: ownRect.left,
      top: parentRect.top,
      width: Math.max(ownRect.width, 40),
      height: parentRect.height
    };
    const input = document.createElement('input');
    const computed = getComputedStyle(target);
    const width = Math.min(Math.max(rect.width + 64, 140), Math.max(140, window.innerWidth - 24));
    const left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - width - 12));
    const top = Math.min(Math.max(12, rect.top + (rect.height - 36) / 2), Math.max(12, window.innerHeight - 48));
    input.type = 'text';
    input.maxLength = 80;
    input.className = 'urppp-direct-edit-input';
    input.value = visibleValue;
    input.setAttribute('aria-label', '修改' + DIRECT_EDIT_LABELS[key] + '显示值');
    input.style.left = left + 'px';
    input.style.top = top + 'px';
    input.style.setProperty('--urppp-direct-edit-width', width + 'px');
    input.style.fontFamily = computed.fontFamily;
    input.style.fontSize = (window.innerWidth <= 520 ? 16 : Math.min(18, Math.max(13, parseFloat(computed.fontSize) || 14))) + 'px';
    let finished = false;
    const finish = (cancel) => {
      if (finished) return;
      finished = true;
      input.remove();
      if (activeDirectEditInput === input) activeDirectEditInput = null;
      if (cancel) return;
      const next = getPrivacySettings();
      if (next.mode !== 'custom' || !next.directEdit.enabled) return;
      next.directEdit.values[key] = String(input.value || '').trim().slice(0, 80);
      setPrivacySettings(next);
      applyPersonalDisplay(document);
      showFeatureToast(next.directEdit.values[key] ? '显示值已更新' : '已恢复分类设置');
    };
    input.__finish = finish;
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('blur', () => finish(false));
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); finish(false); }
      if (event.key === 'Escape') { event.preventDefault(); finish(true); }
    });
    document.documentElement.appendChild(input);
    activeDirectEditInput = input;
    input.focus();
    input.select();
  }

  function bindDirectEditInteraction() {
    if (document.__urpppDirectEditBound) return;
    document.__urpppDirectEditBound = true;
    document.addEventListener('click', (event) => {
      const target = event.target?.closest?.('.urppp-direct-editable');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      openDirectEditInput(target);
    }, true);
    document.addEventListener('keydown', (event) => {
      if (!['Enter', ' '].includes(event.key)) return;
      const target = event.target?.closest?.('.urppp-direct-editable');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      openDirectEditInput(target);
    }, true);
  }

  function clearPrivacyDisplay(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('.urppp-direct-editable').forEach((el) => {
      const tabindex = el.getAttribute('data-urppp-direct-tabindex');
      el.classList.remove('urppp-direct-editable');
      el.removeAttribute('data-urppp-direct-tabindex');
      if (tabindex === '__none__') el.removeAttribute('tabindex');
      else if (tabindex != null) el.setAttribute('tabindex', tabindex);
      if (el.__urpppDirectTitle == null) el.removeAttribute('title');
      else el.setAttribute('title', el.__urpppDirectTitle);
      if (el.__urpppDirectAriaLabel == null) el.removeAttribute('aria-label');
      else el.setAttribute('aria-label', el.__urpppDirectAriaLabel);
      delete el.__urpppDirectTitle;
      delete el.__urpppDirectAriaLabel;
    });
    scope.querySelectorAll('.urppp-private-text').forEach((el) => {
      el.classList.remove('urppp-private-text');
      el.removeAttribute('data-urppp-private-mask');
      el.style.removeProperty('--urppp-private-font-size');
    });
    scope.querySelectorAll('.urppp-private-avatar').forEach((el) => el.classList.remove('urppp-private-avatar'));
    scope.querySelectorAll('.urppp-private-avatar-host').forEach((el) => {
      el.classList.remove('urppp-private-avatar-host');
      el.removeAttribute('data-urppp-private-mask');
      ['--urppp-avatar-left', '--urppp-avatar-top', '--urppp-avatar-width', '--urppp-avatar-height', '--urppp-avatar-radius'].forEach((name) => el.style.removeProperty(name));
    });
    scope.querySelectorAll('.urppp-private-avatar-block').forEach((el) => {
      el.classList.remove('urppp-private-avatar-block');
      el.removeAttribute('data-urppp-private-mask');
    });
    scope.querySelectorAll('.urppp-private-block').forEach((el) => {
      el.classList.remove('urppp-private-block');
      el.removeAttribute('data-urppp-private-mask');
    });
  }

  function applyCustomText(element, enabled, value) {
    if (!element || element.matches?.('input,select,textarea,button') || element.querySelector?.('input,select,textarea,button')) return;
    if (element.__urpppOriginalText == null) {
      if (!enabled) return;
      element.__urpppOriginalText = element.textContent || '';
    }
    const next = enabled && value ? value : element.__urpppOriginalText;
    if (element.textContent !== next) element.textContent = next;
  }

  function applyCustomIdentityDisplay(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const custom = getCustomIdentity();
    const existingNavName = scope.querySelector?.('.urppp-user-name-value');
    const navName = existingNavName || (custom.nameEnabled ? ensureNavNameTarget(scope) : null);
    applyCustomText(navName, custom.nameEnabled, custom.name);
    scope.querySelectorAll('.profile-info-row').forEach((row) => {
      const label = row.querySelector('.profile-info-name');
      const value = row.querySelector('.profile-info-value');
      if (!label || !value || String(label.textContent || '').replace(/[\s:：]/g, '') !== '姓名') return;
      applyCustomText(value, custom.nameEnabled, custom.name);
    });
    const avatar = validCustomAvatar(custom.avatar);
    const avatarActive = custom.avatarEnabled && !!avatar;
    scope.querySelectorAll('#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img').forEach((img) => {
      const current = img.getAttribute('src') || '';
      if (current && current !== img.__urpppAppliedCustomSrc) img.__urpppOriginalSrc = current;
      if (avatarActive) {
        if (img.__urpppOriginalSrc == null) img.__urpppOriginalSrc = current;
        if (current !== avatar) img.setAttribute('src', avatar);
        img.__urpppAppliedCustomSrc = avatar;
      } else if (img.__urpppAppliedCustomSrc != null) {
        if (img.__urpppOriginalSrc) img.setAttribute('src', img.__urpppOriginalSrc);
        delete img.__urpppAppliedCustomSrc;
      }
    });
  }

  function applyProfilePrivacy(root, config) {
    root.querySelectorAll('.profile-info-row').forEach((row) => {
      const label = row.querySelector('.profile-info-name, th, label');
      const value = row.querySelector('.profile-info-value, td:last-child');
      if (!label || !value || label === value) return;
      const field = classifyPrivacyLabel(label.textContent);
      const replacement = privacyReplacement(config, field);
      if (replacement) markPrivateText(value, replacement);
    });
  }

  function applyScoreTablePrivacy(root, config) {
    root.querySelectorAll('table').forEach((table) => {
      const headers = Array.from(table.querySelectorAll('thead th, thead td, tr:first-child th, tr:first-child td'));
      if (!headers.length) return;
      const fields = headers.map((header) => {
        const field = classifyPrivacyLabel(header.textContent);
        return ['grade', 'gpa', 'credit'].includes(field) ? field : '';
      });
      if (!fields.some(Boolean)) return;
      table.querySelectorAll('tbody tr').forEach((row) => {
        const cells = row.querySelectorAll('td');
        fields.forEach((field, index) => {
          const replacement = privacyReplacement(config, field);
          if (field && replacement) markPrivateText(cells[index], replacement);
        });
      });
    });
  }

  function applyPrivacyDisplay(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const config = getPrivacySettings();
    if (config.mode === 'off') return;
    const nameMask = privacyReplacement(config, 'name');
    const avatarMask = privacyReplacement(config, 'avatar');
    const scheduleMask = privacyReplacement(config, 'schedule');
    const navName = nameMask ? ensureNavNameTarget(scope) : scope.querySelector?.('.urppp-user-name-value');
    if (nameMask) markPrivateText(navName, nameMask);
    const directAcademicTargets = [
      ['#courseNum, #coursePas, #xy_kcms', 'other'],
      ['#gpa', 'gpa'],
      ['#bottom', 'organization']
    ];
    directAcademicTargets.forEach(([selector, field]) => {
      const replacement = privacyReplacement(config, field);
      if (replacement) scope.querySelectorAll(selector).forEach((el) => markPrivateText(el, replacement));
    });
    applyScoreTablePrivacy(scope, config);
    const directEditEnabled = config.mode === 'custom' && config.directEdit.enabled;
    scope.querySelectorAll('[data-urppp-private]').forEach((el) => {
      const field = el.getAttribute('data-urppp-private');
      const editKey = el.getAttribute('data-urppp-edit-key');
      const directValue = directEditEnabled && editKey ? String(config.directEdit.values[editKey] || '').trim() : '';
      const replacement = directValue || privacyReplacement(config, field);
      if (!['avatar', 'schedule'].includes(field) && replacement) markPrivateText(el, replacement);
      if (directEditEnabled && editKey) markDirectEditable(el, editKey);
    });
    if (directEditEnabled) bindDirectEditInteraction();
    applyProfilePrivacy(scope, config);
    if (avatarMask) {
      scope.querySelectorAll('[data-urppp-private="avatar"]').forEach((el) => {
        const image = el.matches('img') ? el : el.querySelector('img');
        if (image) markPrivateAvatar(image, avatarMask);
        else {
          el.classList.add('urppp-private-avatar-block');
          el.setAttribute('data-urppp-private-mask', avatarMask);
        }
      });
      scope.querySelectorAll('#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img').forEach((img) => markPrivateAvatar(img, avatarMask));
    }
    if (scheduleMask) {
      const targets = Array.from(scope.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));
      targets.filter((target) => !targets.some((other) => other !== target && other.contains(target))).forEach((target) => markPrivateBlock(target, scheduleMask));
    }
  }

  let personalDisplayTimer = 0;
  let personalObserverEntries = [];

  function personalDisplayIsEnabled() {
    const privacy = getPrivacySettings();
    const custom = getCustomIdentity();
    return privacy.mode !== 'off' || custom.nameEnabled || custom.avatarEnabled;
  }

  function resumePersonalDisplayObservers() {
    personalObserverEntries = personalObserverEntries.filter(({ root }) => root && root.isConnected);
    personalObserverEntries.forEach(({ root, observer }) => observer.observe(root, { childList: true, subtree: true }));
  }

  function applyPersonalDisplay(root) {
    const scope = root || document;
    personalObserverEntries.forEach(({ observer }) => observer.disconnect());
    try { ensureFeatureStyles(); } catch (_) {}
    try { clearPrivacyDisplay(scope); } catch (_) {}
    try { applyCustomIdentityDisplay(scope); } catch (e) { console.warn('[URP++] custom identity', e); }
    try { applyPrivacyDisplay(scope); } catch (e) { console.warn('[URP++] privacy', e); }
    if (personalDisplayIsEnabled()) {
      resumePersonalDisplayObservers();
      bindPersonalDisplayObservers();
    } else {
      clearTimeout(personalDisplayTimer);
      personalObserverEntries = [];
    }
  }

  function schedulePersonalDisplay(root) {
    clearTimeout(personalDisplayTimer);
    personalDisplayTimer = setTimeout(() => applyPersonalDisplay(root || document), 140);
  }

  function refreshCleanPersonalDisplay() {
    try { if (state && state.open) render(); } catch (_) {}
  }

  function bindPersonalDisplayObservers() {
    if (!personalDisplayIsEnabled()) {
      personalObserverEntries.forEach(({ observer }) => observer.disconnect());
      personalObserverEntries = [];
      return;
    }
    [document.getElementById('navbar'), document.getElementById('page-content-template'), document.getElementById('urppp-clean-root')]
      .filter(Boolean)
      .forEach((root) => {
        if (personalObserverEntries.some((entry) => entry.root === root)) return;
        const observer = new MutationObserver(() => schedulePersonalDisplay(document));
        personalObserverEntries.push({ root, observer });
        observer.observe(root, { childList: true, subtree: true });
      });
  }

  function personalizedProfile(profile) {
    const result = Object.assign({}, profile || {});
    const custom = getCustomIdentity();
    if (custom.nameEnabled && custom.name) result.name = custom.name;
    const avatar = validCustomAvatar(custom.avatar);
    if (custom.avatarEnabled && avatar) result.avatar = avatar;
    return result;
  }

  const SCHEDULE_EXPORT_API = '/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback';
  const SCHEDULE_RESULT_API = '/student/courseSelect/thisSemesterCurriculum/callback';
  const SCHEDULE_PAGE_URL = '/student/courseSelect/thisSemesterCurriculum/index';

  async function resolveSchedulePlanCode() {
    const select = document.querySelector('#planCode, #zxjxjhh');
    if (select && select.value && select.value !== 'no') return String(select.value);
    try {
      const params = new URLSearchParams(location.search);
      const queryPlan = params.get('planCode') || params.get('zxjxjhh');
      if (queryPlan) return queryPlan;
    } catch (_) {}
    if (state && state.schedule && state.schedule.exportData) {
      const cached = state.schedule.exportData.semester && state.schedule.exportData.semester.planCode;
      if (cached) return cached;
    }
    if (/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname)) {
      try {
        const resultRaw = await fetchText(SCHEDULE_RESULT_API);
        const resultData = JSON.parse(resultRaw);
        const resultPlan = schedulePlanCodeFromData(resultData);
        if (resultPlan) return resultPlan;
      } catch (_) {}
    }
    return '';
  }

  async function loadScheduleExportData(source) {
    let planCode = await resolveSchedulePlanCode();
    const options = planCode ? {
      method: 'POST',
      data: 'planCode=' + encodeURIComponent(planCode),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    } : null;
    const raw = await fetchText(SCHEDULE_EXPORT_API, options);
    let data;
    try { data = JSON.parse(raw); }
    catch (_) { throw new Error('课表接口返回了非 JSON 内容，请刷新教务页面后重试'); }
    if (!planCode) planCode = schedulePlanCodeFromData(data);
    if ((!data.jcsjbs || !data.jcsjbs.length) && planCode) {
      data = JSON.parse(await fetchText(SCHEDULE_EXPORT_API, {
        method: 'POST',
        data: 'planCode=' + encodeURIComponent(planCode),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      }));
    }
    const normalized = normalizeScheduleDataForPage(data, planCode, source);
    if (!normalized.courses.length) throw new Error('没有读取到可导出的课表数据');
    return normalized;
  }

  function safeScheduleFilename(value) {
    return String(value || '学生课表').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '').slice(0, 80) || '学生课表';
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function exportScheduleJson(data) {
    const source = buildScheduleJsonSource(data);
    const settings = getScheduleJsonFormatSettings();
    const payload = settings.enabled ? buildCustomScheduleJson(source, settings.mapping) : buildXiaoAiScheduleJson(source);
    const text = JSON.stringify(payload, null, 2) + '\n';
    downloadBlob(new Blob([text], { type: 'application/json;charset=utf-8' }), safeScheduleFilename(data.semester.label) + '.json');
    return Object.assign({ customFormat: settings.enabled }, source.stats);
  }


  function deriveCurrentSemesterMonday(planCode) {
    const text = (Array.from(document.querySelectorAll('.span_bbzx')).map((el) => el.textContent || '').join(' ') + ' ' + (document.querySelector('#navbar')?.textContent || '')).replace(/\s+/g, ' ');
    const match = text.match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);
    if (!match) return '';
    const expectedTerm = match[3] === '秋' ? '1' : '2';
    if (planCode && !String(planCode).startsWith(match[1] + '-' + match[2] + '-' + expectedTerm)) return '';
    const currentWeek = Number(match[4]);
    if (currentWeek < 1 || currentWeek > 30) return '';
    const monday = mondayOfDate(new Date());
    monday.setDate(monday.getDate() - (currentWeek - 1) * 7);
    return localDateIso(monday);
  }


  function normalizeScheduleDataForPage(data, requestedPlanCode, source) {
    const planCode = requestedPlanCode || schedulePlanCodeFromData(data);
    const firstMonday = deriveCurrentSemesterMonday(planCode) || getScheduleFirstMondayMap()[planCode] || '';
    return normalizeScheduleExportData(data, planCode, source, { firstMonday });
  }

  function requestScheduleFirstMonday(data) {
    const planCode = data.semester.planCode;
    const stored = getScheduleFirstMondayMap()[planCode];
    const derived = deriveCurrentSemesterMonday(planCode);
    if (derived) {
      rememberScheduleFirstMonday(planCode, derived);
      return Promise.resolve(derived);
    }
    if (parseLocalIsoDate(stored)) return Promise.resolve(stored);
    return new Promise((resolve, reject) => {
      document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();
      const mask = document.createElement('div');
      mask.className = 'urppp-dialog-mask';
      mask.dataset.dialog = 'schedule-date';
      mask.innerHTML = `<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${escapeHtml(data.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${escapeHtml(stored || defaultSemesterMonday(planCode))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`;
      document.documentElement.appendChild(mask);
      const close = (error, value) => { mask.remove(); error ? reject(error) : resolve(value); };
      mask.querySelector('[data-action="cancel"]').addEventListener('click', () => close(new Error('已取消导出')));
      mask.querySelector('[data-action="ok"]').addEventListener('click', () => {
        const value = mask.querySelector('input').value;
        if (!parseLocalIsoDate(value)) return;
        rememberScheduleFirstMonday(planCode, value);
        close(null, value);
      });
      mask.addEventListener('click', (event) => { if (event.target === mask) close(new Error('已取消导出')); });
    });
  }

  async function exportScheduleIcs(data) {
    const firstMonday = await requestScheduleFirstMonday(data);
    const ics = buildScheduleIcs(data, firstMonday);
    downloadBlob(new Blob([ics], { type: 'text/calendar;charset=utf-8' }), safeScheduleFilename(data.semester.label) + '.ics');
    return scheduleIcsOmissionStats(data);
  }

  const SCHEDULE_IMAGE_SKIN_NAMES = {
    apple: '类 Apple',
    flat: '极简扁平',
    organic: '自然有机',
    brutal: '新野兽派',
    editorial: '编辑杂志',
    neu: '新拟物',
  };

  function resolvedScheduleImageColor(property, fallback, background) {
    if (typeof document === 'undefined') return normalizeHexColor(fallback) || '#000000';
    const probe = document.createElement('span');
    probe.style.cssText = 'position:fixed;left:-9999px;visibility:hidden;color:var(' + property + ',' + fallback + ')';
    (document.body || document.documentElement).appendChild(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    const components = String(value || '').match(/[\d.]+/g)?.map(Number) || [];
    if (components.length >= 3) {
      const color = rgbToHex(components[0], components[1], components[2]);
      const opacity = components.length > 3 ? Math.max(0, Math.min(1, components[3])) : 1;
      return opacity < 1 ? mixHex(background || fallback, color, opacity) : color;
    }
    return normalizeHexColor(value) || normalizeHexColor(fallback) || '#000000';
  }

  function currentScheduleImageTheme() {
    const themeId = getCurrent();
    const skinId = getSkin();
    const dark = themeId === 'dark';
    const fallback = dark
      ? { bg: '#000000', surface: '#1C1C1E', input: '#2C2C2E', text: '#F5F5F7', secondary: '#A1A1A6', muted: '#8E8E93', border: '#38383A', primary: '#0A84FF' }
      : { bg: '#F5F5F7', surface: '#FFFFFF', input: '#F5F5F7', text: '#1D1D1F', secondary: '#6E6E73', muted: '#86868B', border: '#D2D2D7', primary: '#0071E3' };
    const colors = {
      bg: resolvedScheduleImageColor('--bg', fallback.bg),
      surface: resolvedScheduleImageColor(skinId === 'neu' ? '--neu-base' : '--surface', fallback.surface),
      input: resolvedScheduleImageColor('--input-bg', fallback.input),
      text: resolvedScheduleImageColor('--text', fallback.text),
      secondary: resolvedScheduleImageColor('--text-secondary', fallback.secondary),
      muted: resolvedScheduleImageColor('--text-muted', fallback.muted),
      border: resolvedScheduleImageColor('--border', fallback.border, resolvedScheduleImageColor(skinId === 'neu' ? '--neu-base' : '--surface', fallback.surface)),
      primary: resolvedScheduleImageColor('--primary', fallback.primary),
    };
    const shapes = {
      apple: { frameRadius: 24, headerRadius: 13, gridRadius: 10, cardRadius: 12, frameStroke: 1, cardStroke: 1, shadow: 'soft' },
      flat: { frameRadius: 0, headerRadius: 0, gridRadius: 0, cardRadius: 0, frameStroke: 2, cardStroke: 2, shadow: 'none' },
      organic: { frameRadius: 30, headerRadius: 18, gridRadius: 14, cardRadius: 18, frameStroke: 1, cardStroke: 1, shadow: 'warm' },
      brutal: { frameRadius: 0, headerRadius: 0, gridRadius: 0, cardRadius: 0, frameStroke: 3, cardStroke: 3, shadow: 'hard' },
      editorial: { frameRadius: 0, headerRadius: 0, gridRadius: 0, cardRadius: 0, frameStroke: 1, cardStroke: 1, shadow: 'none', serif: true },
      neu: { frameRadius: 22, headerRadius: 14, gridRadius: 10, cardRadius: 14, frameStroke: 0, cardStroke: 0, shadow: 'neu' },
    };
    return {
      id: themeId,
      skin: skinId,
      dark,
      label: (SCHEDULE_IMAGE_SKIN_NAMES[skinId] || skinId) + ' · ' + ((THEMES[themeId] && THEMES[themeId].name) || themeId),
      colors,
      shape: shapes[skinId] || shapes.apple,
    };
  }

  function buildScheduleSvg(data, themeOverride) {
    return renderScheduleSvg(data, themeOverride || currentScheduleImageTheme());
  }

  function svgToPngBlob(svgInfo) {
    return new Promise((resolve, reject) => {
      const source = new Blob([svgInfo.svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(source);
      const image = new Image();
      image.onload = () => {
        try {
          const maxPixels = 15 * 1000 * 1000;
          const scale = Math.min(2, Math.sqrt(maxPixels / (svgInfo.width * svgInfo.height)));
          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(svgInfo.width * scale);
          canvas.height = Math.floor(svgInfo.height * scale);
          const context = canvas.getContext('2d');
          context.scale(canvas.width / svgInfo.width, canvas.height / svgInfo.height);
          context.fillStyle = svgInfo.background || '#F8FAFC';
          context.fillRect(0, 0, svgInfo.width, svgInfo.height);
          context.drawImage(image, 0, 0, svgInfo.width, svgInfo.height);
          canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('无法生成课表图片')), 'image/png');
        } catch (e) {
          reject(e);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('课表图片渲染失败')); };
      image.src = url;
    });
  }

  async function exportSchedulePng(data) {
    const blob = await svgToPngBlob(buildScheduleSvg(data));
    downloadBlob(blob, safeScheduleFilename(data.semester.label) + '.png');
  }

  function showFeatureToast(message, error) {
    document.getElementById('urppp-feature-toast')?.remove();
    const toast = document.createElement('div');
    toast.id = 'urppp-feature-toast';
    toast.textContent = String(message || '');
    toast.className = error ? 'error' : '';
    document.documentElement.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('open'));
    setTimeout(() => { toast.classList.remove('open'); setTimeout(() => toast.remove(), 220); }, error ? 4200 : 2400);
  }

  const scheduleExportUi = createScheduleExportUi({
    document,
    window,
    ensureStyles: ensureScheduleExportStyles,
    loadData: loadScheduleExportData,
    exportJson: exportScheduleJson,
    exportIcs: exportScheduleIcs,
    exportPng: exportSchedulePng,
    showToast: showFeatureToast,
    nativePageUrl: SCHEDULE_PAGE_URL,
    navigate: (url) => { location.href = url; },
    logger: console,
  });

  function runScheduleExport(type, source, pdfHandler, trigger) {
    return scheduleExportUi.run(type, source, pdfHandler, trigger);
  }

  function createScheduleExportMenu(options) {
    return scheduleExportUi.createMenu(options);
  }

  function disposeNativePdfCapture(entry) {
    if (!entry) return;
    try { entry.stage.remove(); } catch (_) {}
    try { document.getElementById('urppp-pdf-reset-style')?.remove(); } catch (_) {}
  }

  function bindNativePdfDiagnose() {
    if (window.__urpppPdfDiagnose) return;
    window.__urpppPdfDiagnose = async () => {
      const result = { time: new Date().toISOString() };
      const host = document.getElementById('mycoursetable');
      const pageSource = document.getElementById('page-content-template');
      result.host = !!host;
      result.pageSource = !!pageSource;
      result.hostCards = host ? host.querySelectorAll('div.class_div').length : -1;
      result.hostHasCourseTable = host ? !!host.querySelector('#courseTable') : false;
      result.hostHasCourseTableBody = host ? !!host.querySelector('#courseTableBody') : false;
      result.hostTableId = host && host.querySelector('table') ? host.querySelector('table').id : 'none';
      try {
        const context = cloneNativePdfStage(host);
        result.stage = 'ok';
        result.stageCards = context.target.querySelectorAll('.urppp-pdf-card').length;
        result.stageTableId = context.target.querySelector('table') ? context.target.querySelector('table').id : 'none';
        disposeNativePdfCapture(context);
      } catch (error) {
        result.stage = 'failed';
        result.stageError = error && error.message || String(error);
      }
      const page = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
      result.deps = {
        dollar: typeof page.$,
        loadFileList: typeof (page.Import && page.Import.LoadFileList),
        back: typeof page.back,
        html2canvas: typeof page.html2canvas,
        originalDivBuild: typeof page.__urpppOriginalDivBuild,
      };
      return result;
    };
  }

  function pagePdfExportHandler(button) {
    if (!button) return null;
    bindNativePdfDiagnose();
    return async () => {
      const panel = document.getElementById('urppp-settings-panel');
      const mask = document.getElementById('urppp-settings-mask');
      if (panel && panel.classList.contains('open')) panel.classList.remove('open');
      if (mask && mask.classList.contains('open')) mask.classList.remove('open');
      try {
        const page = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        await exportNativePdfIsolated(button, {
          document,
          page,
          onAfterRestore: fixWeekScheduleLayout,
        });
      } catch (error) {
        console.warn('[URP++] isolated native PDF export failed', error);
        showFeatureToast('原生 PDF 隔离导出失败：' + (error && error.message || String(error)) + '，请重试', true);
      }
    };
  }

  function isPersonalSchedulePage(targetLocation = location) {
    return /\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(targetLocation.pathname);
  }

  function isScoreQueryPage(targetLocation = location) {
    // 成绩查询模块内页面均挂分析面板：全部及格 / 方案成绩 / 历年成绩
    return /\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(targetLocation.pathname);
  }

  function patchNativeScheduleExport() {
    if (!isPersonalSchedulePage()) return;
    const heading = document.querySelector('#h4_id1')?.closest('h4') || document.querySelector('h4.header');
    const actionHost = heading?.querySelector('.right_top_oper') || document.querySelector('#mainDIV .right_top_oper, .page-content .right_top_oper');
    const buttons = Array.from((actionHost || document).querySelectorAll('button, a'));
    const signatureOf = (button) => (
      [button.textContent, button.getAttribute('title'), button.getAttribute('onclick')]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
    );
    buttons.forEach((button) => {
      if (/打印.*课表|\bdy\s*\(/i.test(signatureOf(button))) {
        button.setAttribute('data-urppp-native-print-source', '1');
      }
    });
    if (document.getElementById('urppp-native-schedule-export')) return;
    const original = buttons.find((button) => (
      /导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(signatureOf(button))
    ));
    const menu = createScheduleExportMenu({ source: 'native', pdfHandler: pagePdfExportHandler(original) });
    menu.id = 'urppp-native-schedule-export';
    if (original && original.parentElement) {
      if (!original.__urpppNativeExportState) {
        original.__urpppNativeExportState = {
          display: original.style.getPropertyValue('display'),
          displayPriority: original.style.getPropertyPriority('display'),
          ariaHidden: original.getAttribute('aria-hidden'),
          tabIndex: original.getAttribute('tabindex'),
        };
      }
      original.setAttribute('data-urppp-native-export-source', '1');
      original.style.setProperty('display', 'none', 'important');
      original.setAttribute('aria-hidden', 'true');
      original.setAttribute('tabindex', '-1');
      original.parentElement.insertBefore(menu, original.nextSibling);
      return;
    }
    if (actionHost) actionHost.appendChild(menu);
    else if (heading) heading.appendChild(menu);
    else {
      const content = document.getElementById('page-content-template') || document.querySelector('.page-content');
      if (content) {
        const fallback = document.createElement('div');
        fallback.className = 'urppp-export-fallback';
        fallback.appendChild(menu);
        content.prepend(fallback);
      }
    }
  }

  let nativeScheduleObserverEntry = null;
  let nativeSchedulePatchTimer = 0;

  function disconnectNativeScheduleExportObserver() {
    clearTimeout(nativeSchedulePatchTimer);
    nativeSchedulePatchTimer = 0;
    if (nativeScheduleObserverEntry) nativeScheduleObserverEntry.observer.disconnect();
    nativeScheduleObserverEntry = null;
  }

  function bindNativeScheduleExportObserver() {
    if (!isPersonalSchedulePage()) {
      disconnectNativeScheduleExportObserver();
      return;
    }
    const root = document.getElementById('page-content-template') || document.querySelector('.page-content') || document.body;
    if (!root) return;
    if (nativeScheduleObserverEntry && nativeScheduleObserverEntry.root === root && root.isConnected) return;
    disconnectNativeScheduleExportObserver();
    const observer = new MutationObserver(() => {
      clearTimeout(nativeSchedulePatchTimer);
      nativeSchedulePatchTimer = setTimeout(() => patchNativeScheduleExport(), 80);
    });
    observer.observe(root, { childList: true, subtree: true });
    nativeScheduleObserverEntry = { root, observer };
  }

  function restoreOptionalAttribute(element, name, value) {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  function removeNativeScheduleExport(scope = document) {
    const root = scope && scope.querySelectorAll ? scope : document;
    const menu = root.matches?.('#urppp-native-schedule-export')
      ? root
      : root.querySelector('#urppp-native-schedule-export');
    if (menu) {
      const fallback = menu.closest('.urppp-export-fallback');
      menu.remove();
      if (fallback && !fallback.children.length) fallback.remove();
    }
    root.querySelectorAll('[data-urppp-native-export-source]').forEach((original) => {
      const state = original.__urpppNativeExportState;
      if (state) {
        if (state.display) original.style.setProperty('display', state.display, state.displayPriority);
        else original.style.removeProperty('display');
        restoreOptionalAttribute(original, 'aria-hidden', state.ariaHidden);
        restoreOptionalAttribute(original, 'tabindex', state.tabIndex);
      }
      original.removeAttribute('data-urppp-native-export-source');
      try { delete original.__urpppNativeExportState; } catch (_) {}
    });
    root.querySelectorAll('[data-urppp-native-print-source]').forEach((button) => {
      button.removeAttribute('data-urppp-native-print-source');
    });
  }

  const scoreAnalysisApi = createScoreAnalysisController({
    deps: {
      styles: scoreAnalysisStyles,
      loadScores,
      loadProfile,
      scoreToNumber,
      scoreToGpa,
      getInsertHost: () => document.querySelector('.page-content')
        || document.getElementById('page-content-template')
        || null,
      shouldAutoExpand: () => {
        // 清爽模式「详细分析」跳转携带 ?urppp=sa，展开后清除标记避免刷新重复展开
        const match = /[?&]urppp=sa(?:&|$)/.test(window.location.search);
        if (match) {
          try { history.replaceState(null, '', window.location.pathname + window.location.hash); } catch (_) { /* ignore */ }
        }
        return match;
      },
    },
  });

  const routeFeatureRuntime = createFeatureRuntime([
    defineFeature({
      id: 'schedule-export',
      matches: (context) => isPersonalSchedulePage(context.location),
      mount: () => {
        patchNativeScheduleExport();
        bindNativeScheduleExportObserver();
      },
      unmount: (context) => {
        disconnectNativeScheduleExportObserver();
        removeNativeScheduleExport(context?.lifecycleKey);
      },
    }),
    defineFeature({
      id: 'score-analysis',
      matches: (context) => isScoreQueryPage(context.location),
      mount: () => {
        try { scoreAnalysisApi.mount(); } catch (error) { console.warn('[URP++] score analysis mount', error); }
      },
      unmount: () => {
        try { scoreAnalysisApi.unmount(); } catch (_) { /* ignore */ }
      },
    }),
  ]);

  function refreshRouteFeatures() {
    const lifecycleKey = document.getElementById('page-content-template') || document.querySelector('.page-content') || document.body;
    return routeFeatureRuntime.refresh({
      document,
      location,
      window,
      lifecycleKey,
    });
  }

  function bindScheduleExportHosts(scope) {
    scheduleExportUi.bindHosts(scope);
  }

  // ---- profile ----
  function normalizeProfileValue(value) {
    return String(value || '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[\s:：]+|[\s:：]+$/g, '')
      .trim();
  }

  function readLabeledProfileValue(root, labels) {
    if (!root || !root.querySelectorAll) return '';
    const keys = (labels || []).map((label) => normalizeProfileValue(label).replace(/[：:]/g, ''));
    const rows = root.querySelectorAll('.profile-info-row, tr');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const labelEl = row.querySelector('.profile-info-name, th, label');
      const valueEl = row.querySelector('.profile-info-value, td:last-child');
      if (!labelEl || !valueEl || labelEl === valueEl) continue;
      const label = normalizeProfileValue(labelEl.textContent).replace(/[：:]/g, '');
      if (!keys.some((key) => label === key || label.endsWith(key))) continue;
      const value = normalizeProfileValue(valueEl.textContent);
      if (value && value !== '—' && value !== '-') return value;
    }
    return '';
  }

  function cleanMajorPlanName(value) {
    return normalizeProfileValue(value)
      .replace(/^主修为\s*/, '')
      .replace(/培养方案概况.*$/, '')
      .replace(/…+/g, '')
      .split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0]
      .trim();
  }

  function extractAcademicOverview(root) {
    const result = { majorPlan: '', majorGpa: '' };
    if (!root || !root.querySelectorAll) return result;
    root.querySelectorAll('.infobox, .widget-box, .urppp-stat-card').forEach((box) => {
      const raw = (box.innerText || box.textContent || '').trim();
      const text = normalizeProfileValue(raw);
      if (/主修必修GPA/.test(text)) {
        const match = text.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)
          || text.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);
        if (match) {
          const gpa = Number(match[1]);
          const current = Number(result.majorGpa);
          if (Number.isFinite(gpa) && gpa >= 0 && gpa <= 5
            && (!result.majorGpa || current === 0 || gpa > 0)) {
            result.majorGpa = match[1];
          }
        }
      }
      if (/主修为|培养方案/.test(text)) {
        const match = text.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)
          || text.match(/^(.{2,60}?)\s*主修为/)
          || text.match(/主修为\s*(.{2,60})$/);
        const plan = cleanMajorPlanName(match && match[1]);
        if (plan && !/GPA|已修读|尚不及格|本学期/.test(plan)) {
          const detailed = /培养方案|教学计划/.test(plan);
          if (!result.majorPlan || detailed) result.majorPlan = plan;
        }
      }
    });
    return result;
  }

  async function loadProfile() {
    const profile = { name: '', avatar: '', majorPlan: '', majorGpa: '', studentId: '' };
    try {
      const user = document.querySelector('#navbar .user-info, .ace-nav .user-info, .user-info');
      if (user) {
        // 真实 DOM: <small>欢迎您，</small>\n姓名 —— 只读 clone，不改 live DOM
        const customTarget = user.querySelector('.urppp-user-name-value');
        const originalName = customTarget && customTarget.__urpppOriginalText;
        if (originalName) profile.name = String(originalName).trim();
        const raw = (user.innerText || user.textContent || '').replace(/\s+/g, ' ').trim();
        let m = profile.name ? null : raw.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);
        if (!profile.name && !m) {
          const clone = user.cloneNode(true);
          clone.querySelectorAll('small, i, img, b, .badge').forEach((n) => n.remove());
          let text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
          text = text.replace(/^欢迎您[，,]\s*/g, '').replace(/\d{8,}/g, '').trim();
          m = text.match(/([\u4e00-\u9fa5·]{2,12})/);
        }
        if (m && m[1] && !/欢迎|同学|首页|反馈|密码|注销/.test(m[1])) profile.name = m[1];
      }
      const img = document.querySelector('#navbar img.nav-user-photo, .ace-nav img.nav-user-photo');
      if (img) profile.avatar = img.__urpppOriginalSrc || img.src || img.getAttribute('src') || '';
      const overview = extractAcademicOverview(document);
      profile.majorPlan = overview.majorPlan;
      profile.majorGpa = overview.majorGpa;
    } catch (_) {}

    try {
      const html = await fetchText('/student/rollManagement/rollInfo/index');
      const doc = parseHtml(html);
      const text = (doc.body && (doc.body.innerText || doc.body.textContent)) || '';
      if (!profile.name) {
        profile.name = readLabeledProfileValue(doc, ['姓名']);
        if (!profile.name) {
          const match = text.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);
          if (match) profile.name = match[1].trim();
        }
      }
      const plan = readLabeledProfileValue(doc, ['主修方案名称']);
      const major = readLabeledProfileValue(doc, ['专业']);
      profile.studentId = readLabeledProfileValue(doc, ['学号']);
      if (plan) profile.majorPlan = cleanMajorPlanName(plan);
      else if (!profile.majorPlan && major) profile.majorPlan = cleanMajorPlanName(major);
      const photo = doc.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');
      if (photo && photo.getAttribute('src') && !profile.avatar) {
        const src = photo.getAttribute('src');
        profile.avatar = /^https?:/i.test(src) ? src : absUrl(src);
      }
    } catch (_) {}

    const gpa = Number(profile.majorGpa);
    if (!profile.name) profile.name = '同学';
    if (!profile.majorPlan) profile.majorPlan = '主修方案';
    // 首页学业信息异步加载期间会短暂出现 0.0，交给方案成绩完成后确认。
    if (!Number.isFinite(gpa) || gpa <= 0 || gpa > 5) profile.majorGpa = '—';
    return profile;
  }

  // ---- schedule: #courseTable td#d_s .class_div ----
  const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  function parseScheduleFromDoc(doc) {
    const courses = [];
    const body = doc.querySelector('#courseTableBody') || doc.querySelector('#courseTable tbody');
    if (!body) return courses;
    body.querySelectorAll('td[id]').forEach((td) => {
      const idm = String(td.id || '').match(/^(\d+)_(\d+)$/);
      if (!idm) return;
      const d = parseInt(idm[1], 10);
      const section = parseInt(idm[2], 10);
      // 站点 1=周一..6=周六,7=周日 → JS getDay 0=周日
      const day = d === 7 ? 0 : d;
      const blocks = td.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]');
      const list = blocks.length ? blocks : [];
      if (!list.length && (td.textContent || '').trim()) {
        // text-only fallback
        const raw = (td.textContent || '').replace(/\s+/g, ' ').trim();
        if (raw) courses.push({ name: raw.slice(0, 40), teacher: '', place: '', week: '', day, section });
        return;
      }
      list.forEach((b) => {
        const ps = Array.from(b.querySelectorAll('p')).map((p) => (p.textContent || '').trim()).filter(Boolean);
        const title = (b.querySelector('.p-kcm-1, .p-kcm') || {}).textContent || ps[0] || '';
        const place = (b.querySelector('.p-jxl-1, [class*="jxl"]') || {}).textContent || '';
        const teacher = ps.find((x, i) => i > 0 && !/周|节/.test(x) && x !== place) || '';
        const week = ps.find((x) => /周/.test(x)) || '';
        const name = String(title).replace(/_\d+\s*$/, '').trim();
        if (!name || name.length < 2) return;
        courses.push({
          name,
          teacher: String(teacher).trim(),
          place: String(place || '').trim(),
          week: String(week).trim(),
          day,
          section
        });
      });
    });
    // dedupe
    const seen = new Set();
    return courses.filter((c) => {
      const k = [c.day, c.section, c.name, c.place].join('|');
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  // 课表真实数据在 JSON callback，index 页只是壳
  const TERM_WEEK_KEY = 'urppp_term_week_v1';
  function rememberTermWeek(n) {
    const w = Number(n) || 0;
    if (w < 1 || w > 30) return 0;
    state._termWeek = w;
    state._termWeekResolved = true;
    try { GM_setValue(TERM_WEEK_KEY, w); } catch (_) {}
    return w;
  }
  function readRememberedTermWeek() {
    if (state && state._termWeek >= 1) {
      state._termWeekResolved = true;
      return state._termWeek;
    }
    try {
      const w = Number(GM_getValue(TERM_WEEK_KEY, 0)) || 0;
      if (w >= 1 && w <= 30) return rememberTermWeek(w);
    } catch (_) {}
    return 0;
  }
  function extractTermWeekFromText(text) {
    const s = String(text || '').replace(/\s+/g, ' ');
    if (!s) return 0;
    // 只认「学年/季节 + 第N周」，绝不单独吃课程描述里的「第1周」
    const patterns = [
      /(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,
      /20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,
      /(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,
      // 顶栏常见：2025-2026 春 第19周 星期三
      /第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/
    ];
    for (let i = 0; i < patterns.length; i++) {
      const m = s.match(patterns[i]);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n >= 1 && n <= 30) return n;
      }
    }
    return 0;
  }

  function getCurrentWeekNumber() {
    if (state._termWeekResolved && state._termWeek >= 1 && state._termWeek <= 30) {
      return state._termWeek;
    }
    try {
      // 1) 顶栏/页头：同时扫 text + HTML（小屏时 text 可能被折叠，HTML 仍在）
      const headNodes = [
        document.querySelector('#navbar'),
        document.querySelector('.navbar-fixed-top'),
        document.querySelector('.navbar'),
        document.querySelector('#navbar .navbar-header'),
        document.querySelector('#navbar .navbar-buttons'),
        document.querySelector('.ace-nav'),
        document.querySelector('#breadcrumbs'),
        document.querySelector('#page-content-header'),
        document.querySelector('.page-header'),
        document.querySelector('header')
      ].filter(Boolean);
      for (let i = 0; i < headNodes.length; i++) {
        const node = headNodes[i];
        const n = extractTermWeekFromText(node.innerText || node.textContent || '')
          || extractTermWeekFromText(node.innerHTML || '');
        if (n) return rememberTermWeek(n);
      }
      // 2) 全页 HTML（比 innerText 更稳，小屏折叠文字也能扫到）
      const html = (document.documentElement && document.documentElement.innerHTML) || '';
      const nHtml = extractTermWeekFromText(html);
      if (nHtml) return rememberTermWeek(nHtml);
      // 3) 正文（带上下文）
      const body = (document.body && document.body.innerText) || '';
      const n2 = extractTermWeekFromText(body);
      if (n2) return rememberTermWeek(n2);
      // 4) 持久化缓存（跨桌面/小屏）
      const cached = readRememberedTermWeek();
      if (cached) return cached;
    } catch (_) {}
    return 0;
  }

  /* 课表时间状态（季节相位）：term 学期中 / summer 暑假 / winter 寒假 / springfestival 春节（正月初一 +7天） */
  let _calPhaseOverride = null;
  function calTodayStr() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  function calAddDays(dateStr, days) {
    const d = new Date(`${dateStr}T00:00:00`);
    d.setDate(d.getDate() + days);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  /* 当前课表相位：默认按日期判断；debug 覆盖优先级最高 */
  function calVacation(today) {
    if (_calPhaseOverride) return _calPhaseOverride;
    const t = today || calTodayStr();
    // 春节：农历正月初一（2027-02-06）起 7 天，覆盖在寒假第 0 周遮罩上
    if (t >= '2027-02-06' && t <= calAddDays('2027-02-06', 6)) return 'springfestival';
    // 寒假：放寒假（1/18）到春季开学前（3/1）
    if (t >= '2027-01-18' && t < '2027-03-01') return 'winter';
    // 暑假：春季结束（7/4）到秋季开学前（8/31）；含 2026 暑假末
    if (t >= '2027-07-04' && t < '2027-08-31') return 'summer';
    if (t >= '2026-07-04' && t < '2026-08-31') return 'summer';
    return 'term';
  }
  /* 控制台调试：调整当前课表时间相位（只影响清爽课表遮罩/第0周视图），传入 null 恢复按日期 */
  /* 全局春节挂饰：顶部两侧垂挂小灯笼（pointer-events 穿透，不影响阅读与操作） */
  function festiveDecorHtml() {
    const lantern = '<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';
    return `<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${lantern}</div><div class="ufd ufd-right">${lantern}</div></div>`;
  }
  function syncFestiveDecor() {
    const doc = (typeof document !== 'undefined') ? document : null;
    if (!doc) return;
    const show = calVacation() === 'springfestival';
    const el = doc.getElementById('urppp-festive-decor');
    if (show && !el) {
      const host = doc.documentElement;
      host.insertAdjacentHTML('beforeend', festiveDecorHtml());
    } else if (!show && el) {
      el.remove();
    }
  }

  function setCalendarPhase(phase) {
    _calPhaseOverride = (phase === 'summer' || phase === 'winter' || phase === 'springfestival' || phase === 'term')
      ? phase
      : null;
    // 切到假期相位时回到第 0 周（显示遮罩）；学期中/复位则跟随系统周
    if (_calPhaseOverride && _calPhaseOverride !== 'term') {
      state.weekLocked = false;
      state.viewWeek = 0;
    }
    // 同步全局春节挂饰
    try { syncFestiveDecor(); } catch (_) { /* ignore */ }
    // 重新渲染清爽课表，让遮罩/第0周立即生效
    try { if (typeof render === 'function') render(); } catch (_) { /* ignore */ }
    return _calPhaseOverride;
  }
  function getCalendarPhase() { return calVacation(); }

  function getViewWeekNumber() {
    // 寒暑假：默认第 0 周；用户手动切周后锁定跟随
    if (calVacation() !== 'term') {
      if (!state.weekLocked) state.viewWeek = 0;
      else if (!state.viewWeek || state.viewWeek < 0) state.viewWeek = 0;
      return state.viewWeek;
    }
    const sys = getCurrentWeekNumber() || readRememberedTermWeek() || 0;
    // 用户手动切周后锁定；未锁定时始终跟随系统教学周
    if (!state.weekLocked) {
      if (sys >= 1) state.viewWeek = sys;
      else if (!state.viewWeek || state.viewWeek < 1) state.viewWeek = 1;
    } else if (!state.viewWeek || state.viewWeek < 1) {
      state.viewWeek = sys >= 1 ? sys : 1;
    }
    // 保险：未锁定时若仍是 1 且系统周更大，强制纠正（修小屏误判）
    if (!state.weekLocked && sys > 1 && state.viewWeek === 1) state.viewWeek = sys;
    return state.viewWeek;
  }

  async function ensureTermWeekResolved() {
    let w = getCurrentWeekNumber();
    if (w >= 1) return w;
    // 主动拉首页 HTML 解析顶栏周次（小屏/清爽遮罩下 DOM 可能读不全）
    try {
      const html = await fetchText('/index');
      w = extractTermWeekFromText(html);
      if (w) return rememberTermWeek(w);
    } catch (_) {}
    // 再试教室占用接口的教学周 jxzc
    try {
      const today = new Date();
      const date = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
      const body = 'xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate=' + encodeURIComponent(date);
      const raw = await fetchText('/student/teachingResources/classroomUseStatus/jasInfo', {
        method: 'POST',
        data: body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const data = JSON.parse(raw);
      const tw = Number(data && data.jxzc);
      if (tw >= 1 && tw <= 30) return rememberTermWeek(tw);
    } catch (_) {}
    return readRememberedTermWeek() || 0;
  }

  function inferMaxWeek(courses) {
    let maxW = getCurrentWeekNumber() || 20;
    (courses || []).forEach((c) => {
      const s = String(c.classWeek || '');
      if (s.length > maxW) maxW = s.length;
      const m = String(c.week || '').match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);
      if (m) maxW = Math.max(maxW, parseInt(m[2], 10) || 0);
      const ms = String(c.week || '').match(/\d{1,2}/g);
      if (ms) ms.forEach((n) => { maxW = Math.max(maxW, parseInt(n, 10) || 0); });
    });
    return Math.min(Math.max(maxW, 1), 30);
  }

  function weekBitActive(classWeek, weekNo) {
    if (!weekNo || !classWeek) return false;
    const s = String(classWeek);
    // 常见 24 位：第 n 周对应 index n-1，'1' 表示有课
    if (s.length >= weekNo) return s.charAt(weekNo - 1) === '1';
    return false;
  }

  const COURSE_PALETTE = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#EC4899','#84CC16','#F97316','#6366F1'];

  function courseColor(name) {
    let h = 0;
    const s = String(name || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return COURSE_PALETTE[h % COURSE_PALETTE.length];
  }

  function parseScheduleFromJson(data) {
    const courses = [];
    const weekNo = getCurrentWeekNumber();
    const packs = (data && data.xkxx) || [];
    packs.forEach((pack) => {
      Object.keys(pack || {}).forEach((key) => {
        const c = pack[key];
        if (!c) return;
        const name = c.courseName || c.englishCourseName || key;
        const teacher = c.attendClassTeacher || '';
        const list = c.timeAndPlaceList || [];
        list.forEach((tp) => {
          const d = Number(tp.classDay) || 0;
          const day = d === 7 ? 0 : d; // 1=周一..7=周日
          const start = Number(tp.classSessions) || 1;
          const span = Math.max(1, Number(tp.continuingSession) || 1);
          const place = [tp.campusName, tp.teachingBuildingName, tp.classroomName].filter(Boolean).join('');
          const week = tp.weekDescription || c.skzcs || '';
          const thisWeek = weekBitActive(tp.classWeek, weekNo) || (weekNo && week.indexOf(String(weekNo)) >= 0);
          courses.push({
            name: String(name).trim(),
            teacher: String(teacher).trim(),
            place: String(place).trim(),
            week: String(week).trim(),
            classWeek: String(tp.classWeek || ''),
            day,
            section: start,
            span,
            thisWeek: !!thisWeek,
            color: courseColor(name)
          });
        });
      });
    });
    // 合并同一 day/start/name/place 的重复
    const seen = new Set();
    return courses.filter((c) => {
      const k = [c.day, c.section, c.span, c.name, c.place, c.week].join('|');
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  async function loadSchedule() {
    try {
      // 优先 JSON（与页面 $.get 一致）
      const raw = await fetchText('/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback');
      let courses = [];
      let data = null;
      try {
        data = JSON.parse(raw);
        // 部分学期接口会带当前教学周
        const tw = Number(data && (data.jxzc || data.zc || data.currentWeek));
        // 注意：data.week 在教室接口里常是星期，不能当教学周
        if (tw >= 1 && tw <= 30) {
          state._termWeek = Math.max(state._termWeek || 0, tw);
          if (!state.weekLocked) state.viewWeek = state._termWeek;
        }
        courses = parseScheduleFromJson(data);
      } catch (_) {
        courses = parseScheduleFromDoc(parseHtml(raw));
      }
      if (!courses.length) {
        // 兜底：已渲染页的 DOM（用户若已打开过课表页）
        courses = parseScheduleFromDoc(document);
      }
      const exportData = data ? normalizeScheduleDataForPage(data, schedulePlanCodeFromData(data), 'clean') : null;
      return { courses, exportData, rawOk: courses.length > 0, error: courses.length ? '' : '课表 JSON 无 timeAndPlaceList' };
    } catch (e) {
      try {
        const courses = parseScheduleFromDoc(document);
        if (courses.length) return { courses, rawOk: true, error: '' };
      } catch (_) {}
      return { courses: [], rawOk: false, error: String(e && e.message || e) };
    }
  }

  // ---- scores: index 壳 + $.get(callback) JSON ----
  function extractScoreCallback(html, hint) {
    const h = String(html || '');
    // var url = "/student/integratedQuery/scoreQuery/xxx/allPassingScores/callback";
    const re = new RegExp('url\\s*=\\s*["\']([^"\']*' + hint + '[^"\']*)["\']', 'i');
    const m = h.match(re);
    if (m && m[1]) return m[1];
    const re2 = new RegExp('(\\/student\\/integratedQuery\\/scoreQuery\\/[^"\'\\s]+' + hint + ')', 'i');
    const m2 = h.match(re2);
    return m2 ? m2[1] : '';
  }

  function parseScoreJson(data) {
    const groups = [];
    const lnList = (data && data.lnList) || [];
    lnList.forEach((ln) => {
      const title = ln.cjlx || ln.cjbh || ln.famc || ln.zxjxjhh || '成绩';
      const courses = [];
      (ln.cjList || []).forEach((cj) => {
        const name = cj.courseName || cj.englishCourseName || '';
        if (!name) return;
        // 展示分：优先百分制 cj / courseScore；等级 gradeName
        let score = cj.cj != null && cj.cj !== '' ? String(cj.cj) : '';
        if (!score && cj.courseScore != null) score = String(cj.courseScore);
        if (!score && cj.gradeName) score = String(cj.gradeName);
        if (!score && cj.zscj != null) score = String(cj.zscj);
        const attr = cj.courseAttributeName || cj.xkcsxmc || '';
        const credit = parseFloat(cj.credit) || 0;
        const code = (cj.id && (cj.id.courseNumber || cj.id.kch_zj)) || '';
        const seq = (cj.id && (cj.id.coureSequenceNumber || cj.id.courseSequenceNumber || cj.id.kxh)) || cj.classNo || '';
        const rawGpa = cj.gradePointScore != null ? Number(cj.gradePointScore) : null;
        const unevaluated = isUnevaluatedScore(score) || isUnevaluatedScore(cj.gradeName) || (rawGpa != null && rawGpa < 0);
        const displayScore = unevaluated ? '未评估' : score;
        courses.push({
          code,
          seq: String(seq || ''),
          name,
          attr,
          credit,
          score: displayScore,
          unevaluated,
          required: isRequiredAttr(attr),
          // 官方绩点：负值（-999）视为无效
          officialGpa: isValidOfficialGpa(rawGpa) ? rawGpa : null,
          evalUrl: ''
        });
      });
      if (courses.length) {
        groups.push({
          title: String(title).slice(0, 100),
          courses,
          summary: summarizeCourses(courses),
          meta: {
            zxf: ln.zxf, tgms: ln.tgms, zms: ln.zms, famc: ln.famc
          }
        });
      }
    });
    return groups;
  }

  async function loadScoreByIndex(indexPath, callbackHint) {
    const indexHtml = await fetchText(indexPath);
    // 先试壳内表（少数情况）
    let groups = parseScoreTables(parseHtml(indexHtml));
    if (groups.length) return groups;
    const cb = extractScoreCallback(indexHtml, callbackHint);
    if (!cb) return [];
    // 页面使用 $.get(url) —— 必须 GET JSON
    const raw = await fetchText(cb);
    try {
      const data = JSON.parse(raw);
      groups = parseScoreJson(data).map((g) => {
        g.summary = summarizeCourses(g.courses);
        return g;
      });
    } catch (_) {
      groups = parseScoreTables(parseHtml(raw));
    }
    return groups;
  }

  // 保留 HTML 表解析作兜底
  function parseScoreTables(doc) {
    const groups = [];
    doc.querySelectorAll('table').forEach((table) => {
      const headCells = Array.from((table.tHead && table.tHead.rows[0] ? table.tHead.rows[0].cells : (table.rows[0] && table.rows[0].cells) || []))
        .map((c) => (c.textContent || '').replace(/\s+/g, ''));
      if (!headCells.length) return;
      const headJoined = headCells.join('|');
      if (!/课程名/.test(headJoined) || !/成绩/.test(headJoined)) return;
      const idx = {
        code: headCells.findIndex((h) => h === '课程号'),
        name: headCells.findIndex((h) => h === '课程名'),
        attr: headCells.findIndex((h) => /课程属性|属性/.test(h)),
        credit: headCells.findIndex((h) => h === '学分'),
        score: headCells.findIndex((h) => h === '成绩')
      };
      if (idx.name < 0 || idx.score < 0) return;
      let title = '成绩';
      let el = table.previousElementSibling;
      for (let i = 0; i < 8 && el; i++, el = el.previousElementSibling) {
        if (/^H[1-4]$/.test(el.tagName) || (el.classList && el.classList.contains('header'))) {
          title = (el.textContent || '').replace(/\s+/g, ' ').trim();
          break;
        }
      }
      const courses = [];
      const rows = table.tBodies.length ? table.tBodies[0].rows : Array.from(table.rows).slice(1);
      Array.from(rows).forEach((tr) => {
        const tds = Array.from(tr.cells || tr.querySelectorAll('td'));
        if (tds.length < 4) return;
        const get = (i) => (i >= 0 && tds[i] ? (tds[i].textContent || '').replace(/\s+/g, ' ').trim() : '');
        const name = get(idx.name);
        const score = get(idx.score);
        if (!name || !score || /课程名|序号/.test(name)) return;
        const attr = get(idx.attr);
        const unevaluated = isUnevaluatedScore(score);
        courses.push({ code: get(idx.code), name, attr, credit: parseFloat(get(idx.credit)) || 0, score: unevaluated ? '未评估' : score, unevaluated, required: isRequiredAttr(attr), officialGpa: null, evalUrl: '' });
      });
      if (courses.length) groups.push({ title: title.slice(0, 100), courses, summary: summarizeCourses(courses) });
    });
    return groups;
  }

  function schemePlanName(group) {
    return cleanMajorPlanName((group && group.meta && group.meta.famc) || (group && group.title) || '');
  }

  function pickMajorSchemeIndex(schemes, majorPlan) {
    if (!schemes || !schemes.length) return 0;
    const plan = cleanMajorPlanName(majorPlan);
    // 1) 标题或接口 famc 含「培养方案」，且不是微专业/辅修。
    let idx = schemes.findIndex((group) => {
      const name = schemePlanName(group);
      return /培养方案/.test(name) && !/微专业|辅修|双学位/.test(name);
    });
    if (idx >= 0 && (!plan || schemePlanName(schemes[idx]).includes(plan.slice(0, 4)))) return idx;
    // 2) 与资料卡主修方案名匹配。
    if (plan) {
      idx = schemes.findIndex((group) => {
        const name = schemePlanName(group);
        return name.includes(plan.replace(/培养方案.*/, '培养方案'))
          || plan.includes(name.slice(0, 4))
          || name.includes(plan.slice(0, 4));
      });
      if (idx >= 0) return idx;
    }
    // 3) 课程数最多的非微专业。
    let best = 0, bestN = -1;
    schemes.forEach((group, i) => {
      if (/微专业|辅修/.test(schemePlanName(group))) return;
      const count = (group.courses || []).length;
      if (count > bestN) { bestN = count; best = i; }
    });
    return best;
  }

  async function loadEvaluationMap() {
    // 成绩「未评估」只认期末评教（flag=kt）。
    // 课堂及时评教（flag=ktjs）不影响成绩是否显示，不能用来打未评估标签。
    const map = {}; // courseNumber -> { ktid, kxh, kcm, done, url }
    try {
      const raw = await fetchText('/student/teachingAssessment/evaluation/queryAll', {
        method: 'POST',
        data: 'pageNum=1&pageSize=200&flag=kt',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      let data;
      try { data = JSON.parse(raw); } catch (_) { data = null; }
      const recs = (data && data.data && data.data.records) || [];
      recs.forEach((r) => {
        const kch = String(r.KCH || '').trim();
        if (!kch) return;
        const done = String(r.SFPG) === '1';
        const ktid = String(r.KTID || '').trim();
        // 同一课程多条问卷：全部完成才算 done
        if (!map[kch]) {
          map[kch] = {
            ktid,
            kxh: String(r.KXH || ''),
            kcm: r.KCM || '',
            done,
            pending: done ? 0 : 1,
            total: 1,
            url: (!done && ktid)
              ? ('/student/teachingEvaluation/newEvaluation/evaluation/' + ktid)
              : '/student/teachingEvaluation/newEvaluation/index'
          };
          return;
        }
        map[kch].total += 1;
        if (!done) {
          map[kch].pending += 1;
          map[kch].done = false;
          if (ktid) {
            map[kch].ktid = ktid;
            map[kch].url = '/student/teachingEvaluation/newEvaluation/evaluation/' + ktid;
          }
        }
      });
      Object.keys(map).forEach((k) => {
        const it = map[k];
        it.done = !(it.pending > 0);
      });
    } catch (e) {
      console.warn('[URP++] evaluation map', e);
    }
    return map;
  }

  function hasDisplayableScore(c) {
    if (!c) return false;
    if (c.officialGpa != null && isValidOfficialGpa(c.officialGpa)) return true;
    const raw = c.score;
    if (raw == null || raw === '') return false;
    if (isUnevaluatedScore(raw)) return false;
    // 有可解析分数/等级，即视为成绩已出
    if (scoreToNumber(raw) != null) return true;
    if (scoreToGpa(raw) != null) return true;
    // 非空且不是“未评估”类文案，也当作已有展示成绩
    return !/未评估|未评教|待评估|待评教/.test(String(raw));
  }

  function attachEvaluationLinks(scorePack, evalMap) {
    if (!scorePack || !evalMap) return scorePack;
    const apply = (courses) => (courses || []).forEach((c) => {
      if (!c || !c.code) return;
      const hit = evalMap[c.code];
      if (!hit) return;

      // 成绩接口已给出有效成绩时：不再标未评估（期末评教完成后成绩会放出）
      if (hasDisplayableScore(c)) {
        c.unevaluated = false;
        // 若期末评教仍未完成，仅保留跳转入口，不改分数展示
        if (!hit.done) c.evalUrl = hit.url || '/student/teachingEvaluation/newEvaluation/index';
        else c.evalUrl = c.evalUrl || '';
        return;
      }

      // 无有效成绩 + 期末评教未完成：标未评估并可跳转
      if (!hit.done) {
        c.unevaluated = true;
        c.evalUrl = hit.url || '/student/teachingEvaluation/newEvaluation/index';
        if (!c.score || c.score === '' || isUnevaluatedScore(c.score)) c.score = '未评估';
      }
    });
    (scorePack.passing || []).forEach((g) => apply(g.courses));
    (scorePack.schemes || []).forEach((g) => apply(g.courses));
    return scorePack;
  }

  function refreshScoreSummaries(scorePack) {
    if (!scorePack) return scorePack;
    if (scorePack.passing && scorePack.passing[0]) {
      scorePack.passing[0].summary = summarizeCourses(scorePack.passing[0].courses);
    }
    scorePack.schemes = (scorePack.schemes || []).map((group) => {
      group.summary = summarizeCourses(group.courses);
      return group;
    });
    return scorePack;
  }

  async function enrichScoresWithEvaluation(scorePack) {
    if (!scorePack || scorePack.evaluationLoading) return scorePack;
    scorePack.evaluationLoading = true;
    try {
      const evalMap = await loadEvaluationMap();
      attachEvaluationLinks(scorePack, evalMap);
      scorePack.evalMap = evalMap;
      scorePack.evaluationReady = true;
      return refreshScoreSummaries(scorePack);
    } finally {
      scorePack.evaluationLoading = false;
    }
  }

  function reconcileProfileAndScores() {
    if (!state.scores || !state.scores.schemes) return;
    const schemes = state.scores.schemes;
    const majorPlan = state.profile && state.profile.majorPlan;
    const majorIdx = pickMajorSchemeIndex(schemes, majorPlan);
    state.scores.majorIdx = majorIdx;
    if (!state._schemeUserSelected) {
      state.activeSchemeIdx = majorIdx;
      state._schemeInited = true;
    }

    const scheme = schemes[majorIdx];
    if (!scheme || !state.profile) return;
    const plan = schemePlanName(scheme);
    const currentPlan = cleanMajorPlanName(state.profile.majorPlan);
    if (/培养方案|教学计划/.test(plan)
      && (!/培养方案|教学计划/.test(currentPlan) || currentPlan === '主修方案')) {
      state.profile.majorPlan = plan;
    }

    const summary = scheme.summary || {};
    const requiredCredit = Number(summary.requiredCredit);
    const requiredGpa = Number(summary.requiredGpa);
    const currentGpa = Number(state.profile.majorGpa);
    if (requiredCredit > 0 && Number.isFinite(requiredGpa) && requiredGpa >= 0 && requiredGpa <= 5
      && (!Number.isFinite(currentGpa) || currentGpa <= 0)) {
      state.profile.majorGpa = String(round2(requiredGpa));
    }
  }

  // 成绩数据内存缓存：同一页面生命周期内复用，避免清爽模式/成绩分析重复拉 4 次接口；force 强制重拉
  let cachedScorePack = null;
  async function loadScores(force) {
    if (force) cachedScorePack = null;
    if (cachedScorePack && !cachedScorePack.error) return cachedScorePack;
    cachedScorePack = await loadScoresImpl();
    return cachedScorePack;
  }

  async function loadScoresImpl() {
    const out = {
      passing: [], schemes: [], error: '', majorIdx: 0,
      evaluationReady: false, evaluationLoading: false
    };
    try {
      const [passGroups, schemeGroups] = await Promise.all([
        loadScoreByIndex('/student/integratedQuery/scoreQuery/allPassingScores/index', 'allPassingScores/callback'),
        loadScoreByIndex('/student/integratedQuery/scoreQuery/schemeScores/index', 'schemeScores/callback')
      ]);
      const allPass = [];
      passGroups.forEach((group) => group.courses.forEach((course) => {
        allPass.push(Object.assign({ term: group.title }, course));
      }));
      out.passing = [{
        title: '全部及格成绩',
        courses: allPass,
        summary: summarizeCourses(allPass),
        groups: passGroups
      }];
      out.schemes = schemeGroups;
      if (!out.schemes.length && allPass.length) {
        out.schemes = [{ title: '方案成绩', courses: allPass, summary: summarizeCourses(allPass) }];
      }
      refreshScoreSummaries(out);
      out.majorIdx = pickMajorSchemeIndex(out.schemes, state.profile && state.profile.majorPlan);
      if (!allPass.length && !out.schemes.length) out.error = '成绩 callback 无数据';
    } catch (e) {
      out.error = String(e && e.message || e);
    }
    return out;
  }

  // ---- classroom: 页面内嵌 xqList/jxlList JSON，再拼路径 ----
  function parseJsonArrayLoose(raw) {
    if (!raw) return [];
    let s = String(raw).trim();
    if (!s) return [];
    // 处理 HTML entity / 多余引号
    s = s.replace(/^['"]|['"]$/g, '');
    try { return JSON.parse(s); } catch (_) {}
    try { return JSON.parse(s.replace(/&quot;/g, '"').replace(/&#34;/g, '"')); } catch (_) {}
    return [];
  }

  function extractBalancedArray(html, needle) {
    const i = html.indexOf(needle);
    if (i < 0) return '';
    const start = html.indexOf('[', i);
    if (start < 0) return '';
    let depth = 0;
    for (let k = start; k < html.length && k < start + 300000; k++) {
      const ch = html[k];
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) return html.slice(start, k + 1);
      }
    }
    return '';
  }

  async function loadClassroomCatalog() {
    const html = await fetchText('/student/teachingResources/classroomUseStatus/index');
    // 会话失效时会回到登录页
    if (/欢迎登录|name=["']j_username["']|loginEn/i.test(html) && !/jxlList|teachingBuildingName|classroomUseStatus/i.test(html)) {
      throw new Error('登录已失效，请刷新页面后重试');
    }
    let xqList = [];
    let jxlList = [];
    try {
      // 1) hidden input value
      const xqVal = (html.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i) || html.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i) || [])[1];
      const jxlVal = (html.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i) || html.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i) || [])[1];
      if (xqVal) xqList = parseJsonArrayLoose(xqVal);
      if (jxlVal) jxlList = parseJsonArrayLoose(jxlVal);

      // 2) JS 赋值：xqList = [...] / jxlList = [...]
      if (!xqList.length) {
        const xqM = html.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);
        if (xqM) xqList = parseJsonArrayLoose(xqM[1]);
      }
      if (!jxlList.length) {
        const jxlM = html.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);
        if (jxlM) jxlList = parseJsonArrayLoose(jxlM[1]);
      }

      // 3) JSON.parse($("#jxlList").val()) 场景：值在 input
      if (!jxlList.length) {
        const bal = extractBalancedArray(html, 'teachingBuildingName');
        if (bal) jxlList = parseJsonArrayLoose(bal);
      }
      if (!xqList.length) {
        const bal = extractBalancedArray(html, 'campusName');
        if (bal) xqList = parseJsonArrayLoose(bal);
      }
    } catch (e) {
      console.warn('[URP++] classroom json parse', e);
    }

    // 4) 兜底：教室课表接口 teachingBuildingJson
    if (!jxlList.length) {
      const campuses = [
        { campusNumber: '01', campusName: '望江' },
        { campusNumber: '02', campusName: '华西' },
        { campusNumber: '03', campusName: '江安' }
      ];
      xqList = campuses;
      const all = [];
      for (const c of campuses) {
        try {
          const raw = await fetchText('/student/teachingResources/classroomCurriculum/' + c.campusNumber + '/teachingBuildingJson');
          const arr = parseJsonArrayLoose(raw);
          arr.forEach((b) => {
            all.push({
              id: {
                campusNumber: c.campusNumber,
                teachingBuildingNumber: String((b.id && b.id.teachingBuildingNumber) || b.teachingBuildingNumber || '')
              },
              teachingBuildingName: b.teachingBuildingName || b.name || ''
            });
          });
        } catch (e) {
          console.warn('[URP++] building json', c.campusNumber, e);
        }
      }
      jxlList = all;
    }

    // campus map
    if (!xqList.length) {
      xqList = [
        { campusNumber: '01', campusName: '望江' },
        { campusNumber: '02', campusName: '华西' },
        { campusNumber: '03', campusName: '江安' }
      ];
    }
    const groups = xqList.map((xq) => ({
      campus: xq.campusName || xq.campusNumber,
      campusNumber: String(xq.campusNumber || (xq.id && xq.id.campusNumber) || ''),
      buildings: []
    }));
    jxlList.forEach((j) => {
      const cn = String((j.id && j.id.campusNumber) || j.campusNumber || '');
      const bn = String((j.id && j.id.teachingBuildingNumber) || j.teachingBuildingNumber || '');
      const name = j.teachingBuildingName || j.name || bn;
      if (!cn || !bn || !name) return;
      let g = groups.find((x) => x.campusNumber === cn);
      if (!g) {
        g = { campus: cn, campusNumber: cn, buildings: [] };
        groups.push(g);
      }
      const path = '/student/teachingResources/classroomUseStatus/' +
        cn + '/' + bn + '/' +
        encodeURI(encodeURI(g.campus || cn)) + '/' +
        encodeURI(encodeURI(name));
      g.buildings.push({ name, path, campusNumber: cn, buildingNumber: bn });
    });
    const out = groups.filter((g) => g.buildings.length);
    if (!out.length) throw new Error('未解析到教学楼，请刷新后重试');
    return out;
  }

  function occupancyTypeLabel(ct) {
    // 站点 classroomStatusLayout 着色：
    // 06 有课(#7be0f6) 07 考试(#fbb9e1) 14 实验(#f5f67b) room 借用(#90feaa)
    const mod = String((ct && ct.occupancymoduleId) || '');
    const map = { '06': '有课', '07': '考试', '14': '实验', 'room': '借用' };
    if (map[mod]) return map[mod];
    if (ct && ct.remark) {
      const r = String(ct.remark).trim();
      if (r) return r;
    }
    return '占用';
  }
  function occupancyReason(ct) {
    if (ct && ct.contentName) return String(ct.contentName).trim();
    if (ct && ct.remark) {
      const r = String(ct.remark).trim();
      if (r) return r;
    }
    return occupancyTypeLabel(ct);
  }

  async function fetchClassroomCurriculum(planNumber, campusNumber, buildingNumber, classroomNumber) {
    const q = new URLSearchParams({
      planNumber: String(planNumber || ''),
      campusNumber: String(campusNumber || ''),
      teachingBuildingNumber: String(buildingNumber || ''),
      classroomNumber: String(classroomNumber || '')
    });
    const raw = await fetchText('/student/teachingResources/classroomCurriculum/searchCurriculum/callback?' + q.toString());
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        if (data.length && Array.isArray(data[0])) return data[0];
        return data.filter((x) => x && typeof x === 'object' && (x.kcm || (x.id && x.id.kch)));
      }
      if (data && Array.isArray(data.list)) return data.list;
      return [];
    } catch (_) {
      return [];
    }
  }

  function matchCurriculumCourse(courses, slotMeta, jxzc) {
    const list = courses || [];
    const xq = Number(slotMeta.xq) || 0;
    const start = Number(slotMeta.start) || 0;
    const week = Number(jxzc) || 0;
    const hits = [];
    list.forEach((c) => {
      const id = c.id || {};
      const cxq = Number(id.skxq != null ? id.skxq : c.skxq) || 0;
      const skjc = Number(id.skjc != null ? id.skjc : c.skjc) || 0;
      const cxjc = Math.max(1, Number(c.cxjc) || 1);
      const skzc = id.skzc || c.skzc || '';
      if (xq && cxq && xq !== cxq) return;
      if (start && (start < skjc || start >= skjc + cxjc)) return;
      if (week && skzc && !weekBitmapActive(skzc, week)) return;
      hits.push(c);
    });
    if (!hits.length) return null;
    hits.sort((a, b) => {
      const aw = weekBitmapActive((a.id && a.id.skzc) || a.skzc, week) ? 0 : 1;
      const bw = weekBitmapActive((b.id && b.id.skzc) || b.skzc, week) ? 0 : 1;
      return aw - bw;
    });
    return hits[0];
  }

  async function enrichOccupancyWithCurriculum(pack, building, planNumber) {
    if (!pack || !pack.rooms || !pack.rooms.length) return pack;
    const xqh = String(building.campusNumber || '');
    const jxlh = String(building.buildingNumber || '');
    const plan = planNumber || pack.planNumber || '';
    if (!xqh || !jxlh || !plan) return pack;
    const busyRooms = pack.rooms.filter((r) => (r.slots || []).some((s) => s.busy));
    const cache = {};
    const queue = async (roomName) => {
      if (cache[roomName]) return cache[roomName];
      try {
        cache[roomName] = await fetchClassroomCurriculum(plan, xqh, jxlh, roomName);
      } catch (_) {
        cache[roomName] = [];
      }
      return cache[roomName];
    };
    const concurrency = 4;
    let idx = 0;
    const workers = new Array(Math.min(concurrency, Math.max(busyRooms.length, 1))).fill(0).map(async () => {
      while (idx < busyRooms.length) {
        const i = idx++;
        const room = busyRooms[i];
        const courses = await queue(room.name);
        (room.slots || []).forEach((slot) => {
          if (!slot.busy) return;
          const meta = {
            xq: (slot.detail && slot.detail.xq) || slot.xq || 0,
            start: slot.section,
            week: pack.jxzc
          };
          if (slot.detail && slot.detail.xq != null) meta.xq = slot.detail.xq;
          const hit = matchCurriculumCourse(courses, meta, pack.jxzc);
          if (hit && hit.kcm) {
            const content = String(hit.kcm).trim();
            slot.contentName = content;
            slot.reason = content;
            slot.displayChar = firstContentChar(content);
            if (slot.detail) {
              slot.detail.contentName = content;
              slot.detail.reason = content;
              slot.detail.teacher = hit.jsm || '';
              slot.detail.weeks = hit.zcsm || '';
              slot.detail.courseNo = (hit.id && hit.id.kch) || '';
              slot.detail.typeLabel = occupancyTypeLabel({ occupancymoduleId: slot.module });
            }
          } else {
            slot.displayChar = firstContentChar(slot.reason || '占用');
            if (slot.detail) slot.detail.typeLabel = occupancyTypeLabel({ occupancymoduleId: slot.module });
          }
        });
      }
    });
    await Promise.all(workers);
    return pack;
  }

  function occupancyKindClass(reason) {
    if (reason === '有课') return 'kind-course';
    if (reason === '考试') return 'kind-exam';
    if (reason === '实验') return 'kind-lab';
    if (reason === '借用') return 'kind-borrow';
    return 'kind-busy';
  }

  async function loadBuildingOccupancy(building) {
    // building: {path, campusNumber, buildingNumber, name} or legacy path string
    let xqh = '', jxlh = '', name = '', pagePath = '';
    if (building && typeof building === 'object') {
      xqh = String(building.campusNumber || '');
      jxlh = String(building.buildingNumber || '');
      name = building.name || '';
      pagePath = building.path || '';
    } else {
      pagePath = String(building || '');
      const m = pagePath.match(/classroomUseStatus\/(\d+)\/(\d+)\//);
      if (m) { xqh = m[1]; jxlh = m[2]; }
    }
    if (!xqh || !jxlh) throw new Error('缺少校区/楼栋编号');
    const offset = Number(building && building.dateOffset != null ? building.dateOffset : state.roomDateOffset) || 0;
    const date = formatLocalDate(addDays(new Date(), offset));
    // 与页面 $("#searchCondition").serialize() 对齐
    const body = 'xqh=' + encodeURIComponent(xqh)
      + '&jxlh=' + encodeURIComponent(jxlh)
      + '&jslx=&jasm=&zwFrom=&zwTo=&searchDate=' + encodeURIComponent(date);
    const raw = await new Promise((resolve, reject) => {
      const full = absUrl('/student/teachingResources/classroomUseStatus/jasInfo');
      if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
          method: 'POST', url: full, data: body, withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: (r) => r.status >= 200 && r.status < 400 ? resolve(r.responseText || '') : reject(new Error('HTTP ' + r.status)),
          onerror: () => reject(new Error('network'))
        });
      } else {
        fetch(full, { method: 'POST', credentials: 'include', headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        }, body }).then(r => r.text()).then(resolve).catch(reject);
      }
    });
    let data;
    try { data = JSON.parse(raw); } catch (_) { throw new Error('jasInfo 非 JSON'); }
    const rooms = (data.classrooms || []).map((c) => {
      const rname = c.classroomName || (c.id && c.id.classroomNumber) || '';
      const seats = c.placeNum || '';
      const type = c.remark || '';
      const slots = [];
      for (let s = 1; s <= 12; s++) slots.push({ section: s, busy: false });
      return { name: rname, seats, type, slots, map: {} };
    });
    const byName = {};
    rooms.forEach((r) => { byName[r.name] = r; });
    (data.classroomTime || []).forEach((ct) => {
      const id = ct.id || {};
      const rname = id.classroomNumber || '';
      const start = Number(id.sessionstart) || 1;
      const cont = Math.max(1, Number(ct.continuingsession) || 1);
      const room = byName[rname];
      if (!room) return;
      const typeLabel = occupancyTypeLabel(ct);
      const reason = occupancyReason(ct);
      for (let s = start; s < start + cont && s <= 12; s++) {
        const slot = room.slots.find((x) => x.section === s);
        if (slot) {
          slot.busy = true;
          slot.kind = ct.timestatenumber || ct.occupancymoduleId || '';
          slot.module = ct.occupancymoduleId || '';
          slot.reason = reason;
          slot.typeLabel = typeLabel;
          slot.displayChar = firstContentChar(reason);
          slot.xq = id.xq;
          slot.weekBitmap = id.week || '';
          slot.detail = {
            room: rname,
            section: s,
            start,
            span: cont,
            reason,
            typeLabel,
            week: id.week || '',
            xq: id.xq || '',
            state: ct.timestatenumber || '',
            module: ct.occupancymoduleId || ''
          };
        }
      }
    });
    let plan = '';
    try {
      const rawPlan = data.jhZxjxjhb;
      if (typeof rawPlan === 'string' && /\d{4}-\d{4}-\d-\d/.test(rawPlan)) plan = rawPlan;
      else if (rawPlan && typeof rawPlan === 'object') {
        plan = String(rawPlan.zxjxjhh || rawPlan.jhxnxq || rawPlan.executiveEducationPlanNumber || rawPlan.planNumber || '');
      }
    } catch (_) {}
    if (!plan && data.classrooms && data.classrooms[0] && data.classrooms[0].id) {
      plan = data.classrooms[0].id.executiveEducationPlanNumber || '';
    }
    if (data.jxzc != null && Number(data.jxzc) >= 1) {
      const tw = Number(data.jxzc);
      state._termWeek = Math.max(state._termWeek || 0, tw);
      if (!state.weekLocked) state.viewWeek = state._termWeek;
    }
    const weekNames = ['日', '一', '二', '三', '四', '五', '六'];
    const dObj = parseLocalDate(data.date || date) || addDays(new Date(), offset);
    const weekday = data.week != null ? Number(data.week) : dObj.getDay();
    const dayTag = offset === 1 ? '明天' : (offset === 2 ? '后天' : '今天');
    return {
      rooms,
      dateLabel: (data.date || date) + '（周' + (weekNames[weekday] || weekday) + ' · ' + dayTag + '）',
      jxzc: data.jxzc,
      planNumber: plan,
      week: data.week != null ? data.week : weekday,
      searchDate: data.date || date,
      dateOffset: offset
    };
  }

  function addDays(base, days) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    d.setDate(d.getDate() + (Number(days) || 0));
    return d;
  }
  function formatLocalDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function parseLocalDate(str) {
    const m = String(str || '').match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  // ---- icons ----
  const ICO = {
    clean: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',
    exit: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',
    schedule: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',
    score: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',
    room: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',
    eval: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',
    plan: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',
    apply: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',
    more: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  function ico(n) { return ICO[n] || ICO.more; }

  const state = createCleanModeState();

  function ensureStyle() {
    if (document.getElementById('urppp-clean-style')) return;
    const st = document.createElement('style');
    st.id = 'urppp-clean-style';
    st.textContent = cleanModeStyles;
    (document.head || document.documentElement).appendChild(st);
  }

  const cleanAnalysisData = createScoreAnalysisData({
    deps: { scoreToNumber, scoreToGpa },
  });

  const { metricHtml, occupancyHtml, render, renderScheduleBoard, roomPickerHtml, scheduleRender } = createCleanModeRenderer({
    state,
    deps: {
      DIRECT_EDIT_LABELS,
      DAY_NAMES,
      analyzeScores: (payload) => cleanAnalysisData.analyzeScores(payload),
      applyPersonalDisplay,
      bandsChartSvg: renderScoreBandsChart,
      bindUI: (scope) => bindUI(scope),
      classifyPrivacyLabel,
      courseColor,
      ensureRoot: () => ensureRoot(),
      escapeHtml,
      firstContentChar,
      getViewWeekNumber,
      ico,
      isCleanAnalysisDirect,
      occupancyKindClass,
      occupancyTypeLabel,
      personalizedProfile,
      scoreChartLayout: () => {
        try {
          return window.matchMedia && window.matchMedia('(max-width: 900px)').matches ? { variant: 'mobile' } : null;
        } catch (_) { return null; }
      },
      scoreToNumber,
      summarizeCourses,
      trendChartSvg: renderScoreTrendChart,
      weekBitActive,
      calVacation,
      setCalendarPhase,
    },
  });

  const { ensureRoomCatalogLoaded, loadAll } = createCleanModeDataLoader({
    state,
    deps: {
      ensureTermWeekResolved,
      enrichScoresWithEvaluation,
      getCurrentWeekNumber,
      loadClassroomCatalog,
      loadProfile,
      loadSchedule,
      loadScores,
      readRememberedTermWeek,
      reconcileProfileAndScores,
      render,
      scheduleRender,
    },
  });

  const {
    bindUI,
    closeModal,
    getRoomHost,
    openModal,
    openRoomModal,
    openScoreModal,
    showBuilding,
  } = createCleanModeUI({
    state,
    deps: {
      DAY_NAMES,
      applyPersonalDisplay,
      bindScheduleExportHosts,
      closeCleanMode: () => closeCleanMode(),
      ensureRoomCatalogLoaded,
      enrichOccupancyWithCurriculum,
      ensureRoot: () => ensureRoot(),
      escapeHtml,
      fetchText,
      getCurrentWeekNumber,
      getViewWeekNumber,
      inferMaxWeek,
      isUnevaluatedScore,
      isValidOfficialGpa,
      loadBuildingOccupancy,
      metricHtml,
      occupancyHtml,
      render,
      rootEl: () => rootEl(),
      roomPickerHtml,
      scoreToGpa,
      scoreToNumber,
      summarizeCourses,
      summarizeCoursesPreferOfficial: summarizeCourses,
    },
  });

  const {
    cleanModeApi,
    closeCleanMode,
    ensureRoot,
    injectCleanEntry,
    openCleanMode,
    rootEl,
  } = createCleanModeController({
    state,
    deps: {
      CLEAN_FLAG,
      applySkinAttr,
      closeModal,
      ensureRoomCatalogLoaded,
      ensureStyle,
      getCurrentWeekNumber,
      getSkin,
      handleThemeDotClick,
      ico,
      injectCleanSidebarSections: (sidebar) => { try { window.__urpppInjectCleanSidebarSections?.(sidebar); } catch (_) { /* ignore */ } },
      refreshMobileNavbar: () => { try { window.__urpppRefreshMobileNavbar?.(); } catch (_) { /* ignore */ } },
      setDrawerOpen: (sidebar, toggler, open) => { try { window.__urpppSetDrawerOpen?.(sidebar, toggler, open); } catch (_) { /* ignore */ } },
      stopDrawerAnimation: (sidebar) => { try { window.__urpppStopDrawerAnimation?.(sidebar); } catch (_) { /* ignore */ } },
      isHomePage,
      loadAll,
      openSettingsPanel,
      readRememberedTermWeek,
      refreshCleanPersonalDisplay,
      render,
      scoreToGpa,
      summarizeCourses,
      syncNavbarThemeUI,
      syncSettingsPanelUI,
      syncThemeDotGroup,
    },
  });

  window.__urpppCleanMode = cleanModeApi;

  // 校历时间线：异步加载远程 JSON（多源回退 + GM 缓存 + 内置兜底），完成后刷新清爽模式渲染
  try {
    ensureCalendarData(() => {
      try { if (window.__urpppCleanMode && window.__urpppCleanMode.refreshRender) window.__urpppCleanMode.refreshRender(); } catch (_) {}
      try { if (window.__urpppCleanMode && window.__urpppCleanMode.refresh) window.__urpppCleanMode.refresh(); } catch (_) {}
    });
  } catch (_) {}

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    if (!document.body) { setTimeout(init, 10); return; }
    injectAllStoreThemeStyles();
    applyTheme(getCurrent());

    // 官方 4 主题卡片样式已脱离主插件内置，统一由 catalog cardCss 提供——初始化即异步拉取注入（设置页/商店皮肤卡可用）
    setTimeout(() => { try { fetchCatalogList().then((t) => ensureStoreCardStyles(t)); } catch (_) {} }, 0);

    // 阻止 Chosen 搜索框聚焦时自动滚动页面/容器，避免下拉展开后内容被抬高
    document.addEventListener('focusin', (e) => {
      const t = e.target;
      if (!t || !t.matches || !t.matches('.chosen-search input')) return;
      const scrollers = [];
      let p = t.parentElement;
      while (p) {
        const st = p.scrollTop;
        const sl = p.scrollLeft;
        if (st || sl || p.scrollHeight > p.clientHeight || p.scrollWidth > p.clientWidth) {
          scrollers.push({ el: p, top: st, left: sl });
        }
        p = p.parentElement;
      }
      requestAnimationFrame(() => {
        scrollers.forEach(s => { s.el.scrollTop = s.top; s.el.scrollLeft = s.left; });
      });
    }, true);

    // 根据是否存在登录表单判断页面类型
    const isLoginPage = !!document.getElementById('formContent') && !!document.querySelector('.form-signin');
    if (isLoginPage) {
      rebuild();
      try { applyBrandFavicon(); } catch (_) {}
      try { scheduleGlobalPreload(); } catch (_) {}
    } else {
      try { applyBrandFavicon(); } catch (_) {}
      try { scheduleGlobalPreload(); } catch (_) {}
      beautifyInternal();
      try { ensureFeatureStyles(); } catch (_) {}
      try { refreshRouteFeatures(); } catch (e) { console.warn('[URP++] route feature refresh', e); }
      try { scheduleDeferredStyles(); } catch (_) {}
      try { applyPersonalDisplay(document); } catch (_) {}
      try { syncFestiveDecor(); } catch (_) {}
      ;[350, 900, 1800].forEach((ms) => setTimeout(() => {
        try { refreshRouteFeatures(); } catch (_) {}
        try { applyPersonalDisplay(document); } catch (_) {}
      }, ms));
      try { if (window.__urpppCleanMode) window.__urpppCleanMode.inject(); } catch (_) {}
      ;[400, 1200, 2500].forEach((ms) => setTimeout(() => {
        try { if (window.__urpppCleanMode) window.__urpppCleanMode.inject(); } catch (_) {}
      }, ms));
      // 默认进入清爽模式：仅首页
      try {
        if (isCleanDefault() && isHomePage() && window.__urpppCleanMode) {
          setTimeout(() => { try { window.__urpppCleanMode.open(false); } catch (_) {} }, 700);
        }
      } catch (_) {}
    }
  }

  // 监听 PJAX/AJAX 路由变化，重新执行美化

  if (!window.__urpppSidebarSyncBound) {
    window.__urpppSidebarSyncBound = true;
    window.addEventListener('resize', () => {
      clearTimeout(window.__urpppSidebarSyncTimer);
      window.__urpppSidebarSyncTimer = setTimeout(syncSidebarUnderNavbar, 50);
    });
    window.addEventListener('load', () => {
      syncSidebarUnderNavbar();
      syncMobileContentOffset();
      setTimeout(syncSidebarUnderNavbar, 100);
      setTimeout(syncSidebarUnderNavbar, 400);
    });
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest
        ? e.target.closest('#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse')
        : null;
      if (!t) return;
      // 等 ACE / 我们自己的 class 切换完成后再同步
      setTimeout(syncMobileContentOffset, 0);
      setTimeout(syncMobileContentOffset, 50);
      setTimeout(syncMobileContentOffset, 200);
    }, true);
    // 侧栏 class（menu-min / display）变化时同步内容边距
    const side = document.getElementById('sidebar');
    if (side && !side.__urpppMarginObs) {
      side.__urpppMarginObs = new MutationObserver(() => {
        clearTimeout(window.__urpppMarginObsTimer);
        window.__urpppMarginObsTimer = setTimeout(syncMobileContentOffset, 30);
      });
      side.__urpppMarginObs.observe(side, { attributes: true, attributeFilter: ['class', 'style'] });
    }
  }
  function watchRouteChanges() {
    if (window.__urpppRouteWatchBound) return;
    window.__urpppRouteWatchBound = true;
    let routeRefreshTimer = 0;
    const run = () => {
      // 仅移动端视口且非清爽模式时关闭抽屉；桌面端 hashchange（如点击 href=# 链接）不应触发 animateDrawer
      try {
        const narrow = !!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches);
        const cleanOpen = !!(document.getElementById('urppp-clean-root') && document.getElementById('urppp-clean-root').classList.contains('open'));
        if (narrow && !cleanOpen && window.__urpppCloseMobileDrawer) window.__urpppCloseMobileDrawer();
      } catch (_) { /* ignore */ }
      clearTimeout(routeRefreshTimer);
      routeRefreshTimer = setTimeout(() => {
        state._termWeekResolved = false;
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        syncSidebarUnderNavbar();
        rebuildSidebarCompletely();
        rebuildNavbar();
        syncSidebarUnderNavbar();
        try { if (window.__urpppRefreshMobileNavbar) window.__urpppRefreshMobileNavbar(); } catch (_) { /* ignore */ }
        bindDesktopNavbarSearch();
        [250, 700].forEach((delay) => setTimeout(() => {
          try { if (window.__urpppRefreshMobileNavbar) window.__urpppRefreshMobileNavbar(); } catch (_) { /* ignore */ }
        }, delay));
        patchSchoolCalendarLink();
        wrapTables();
        bindTableWrapObserver();
        scheduleWeekScheduleFix();
        bindCourseTableOpacityObserver();
        scheduleBeautifyNoticeTables();
        scheduleScrubTableInlineBg();
        document.querySelectorAll('.page-content, #page-content-template').forEach((el) => {
          const urpppMobileLayout = !!(window.matchMedia && window.matchMedia('(max-width: 991px)').matches);
          el.style.setProperty('padding', urpppMobileLayout ? '8px 8px 24px' : '16px 64px 40px', 'important');
          el.style.setProperty('box-sizing', 'border-box', 'important');
        });
        alignRollInfoLayout();
        patchAceTabNavbars();
        restyleInfoboxPercentages();
        setTimeout(restyleInfoboxPercentages, 300);
        setTimeout(restyleInfoboxPercentages, 1000);
        scheduleEnsureQueryChosen();
        ensureQueryChosen();
        beautifyQueryForms();
        patchChosenDropdownAlign();
        setTimeout(beautifyQueryForms, 300);
        beautifyPlanTree();
        setTimeout(() => beautifyPlanTree(), 500);
        beautifyBreadcrumbs();
        scheduleBeautifyPagebar();
        try { ensureRouteStyles(); } catch (_) {}
        try { refreshRouteFeatures(); } catch (_) {}
        try { applyPersonalDisplay(document); } catch (_) {}
        setTimeout(() => {
          try { refreshRouteFeatures(); } catch (_) {}
          try { applyPersonalDisplay(document); } catch (_) {}
        }, 500);
      }, 100);
    };
    window.addEventListener('popstate', run);
    window.addEventListener('hashchange', run);
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      const result = origPush.apply(this, args);
      run();
      return result;
    };
    history.replaceState = function (...args) {
      const result = origReplace.apply(this, args);
      run();
      return result;
    };
  }

  // 全局 API
  const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  // 控制台调试接口：切换课表时间相位（寒暑假/春节/学期中）
  global.__urpppDebug = global.__urpppDebug || {};
  global.__urpppDebug.setCalendarPhase = (p) => setCalendarPhase(p);
  global.__urpppDebug.getCalendarPhase = () => getCalendarPhase();
  global.__urpppDebug.calVacation = (d) => calVacation(d);
  global.urppp = {
    version: URPPP_VERSION,
    showLogo(show) {
      const el = document.querySelector('#urppp-brand .ub-logo');
      if (el) el.classList.toggle('show', show);
    },
    theme: {
      apply: (n) => { applyTheme(n); },
      setAccent: applyAccent,
      getAccent,
      getCurrent,
      list: () => Object.entries(THEMES).map(([k, v]) => ({ name: k, displayName: v.name, current: k === getCurrent() })),
    },
    update: {
      check: checkForUpdates,
      auto: maybeAutoCheckUpdate,
      showToast: showUpdateToast
    },
    privacy: {
      get: getPrivacySettings,
      set(value) { setPrivacySettings(value); applyPersonalDisplay(document); return getPrivacySettings(); },
      apply: () => applyPersonalDisplay(document),
      identity: { get: getCustomIdentity, set(value) { setCustomIdentity(value); applyPersonalDisplay(document); refreshCleanPersonalDisplay(); return getCustomIdentity(); } }
    },
    scheduleExport: {
      load: () => loadScheduleExportData('api'),
      run: (format) => runScheduleExport(format, 'api', null, null),
      patch: patchNativeScheduleExport,
      image: {
        theme: currentScheduleImageTheme,
        build: (data, theme) => buildScheduleSvg(data, theme),
      },
      jsonFormat: {
        get: getScheduleJsonFormatSettings,
        set: setScheduleJsonFormatSettings,
        validate: validateScheduleJsonMapping,
        build(data, mapping) {
          const source = buildScheduleJsonSource(data);
          if (mapping) return buildCustomScheduleJson(source, validateScheduleJsonMapping(mapping));
          const settings = getScheduleJsonFormatSettings();
          return settings.enabled ? buildCustomScheduleJson(source, settings.mapping) : buildXiaoAiScheduleJson(source);
        },
        buildDefault(data) {
          return buildXiaoAiScheduleJson(buildScheduleJsonSource(data));
        }
      }
    }
  };

  // 自动检测更新：进入页面后延迟触发，避免抢首屏
  function scheduleAutoUpdateCheck() {
    setTimeout(() => { try { maybeAutoCheckUpdate(); } catch (_) {} }, 1800);
  }

  // 全局预加载：预拉取"用户暂未看到但会用到"的联网内容。
  // 原则：不抢关键加载——清爽模式数据（课表/成绩/教室列表）由清爽模式自身 open 时加载，此处不预拉；
  // 预加载只做"进页面即可见的视觉内容"与"商店等次要内容"，且全部错峰延后，避免与首屏/清爽模式抢带宽。
  function scheduleGlobalPreload() {
    try {
      if (!isGlobalPreload()) return;
      // P0（0ms）：当前主题样式 + catalog（进页面即可见的视觉内容）。
      // 用缓存优先：内存/GM 有缓存就直接用，避免进页面为预加载发起额外网络请求抢带宽；仅缓存缺失才拉取。
      try {
        if (__catalogCache && __catalogCache.length) {
          try { ensureStoreCardStyles(__catalogCache); } catch (_) {}
        } else {
          fetchCatalogList().then((items) => { try { ensureStoreCardStyles(items); } catch (_) {} });
        }
      } catch (_) {}
      // P1（3s）：主题/插件商店列表（等首屏与清爽模式加载完成后，错峰预拉）
      setTimeout(() => {
        try {
          const inline = document.querySelector('.urppp-store-inline');
          if (inline) { try { fetchCatalogThemes(inline); } catch (_) {} }
          const pluginPane = document.querySelector('[data-pane="download"]');
          if (pluginPane) { try { fetchCatalogPlugins(pluginPane); } catch (_) {} }
        } catch (_) {}
      }, 3000);
      // P2（4s/5s）：更新检查 + 下载计数（非关键路径，最后）
      setTimeout(() => { try { maybeAutoCheckUpdate(); } catch (_) {} }, 4000);
      } catch (_) {}
  }



  // 尽早注入已下载主题CSS并应用皮肤（刷新时 body 构建前即设 data-urppp-skin，避免先白后暖黄/主题色迟载）
  try { injectAllStoreThemeStyles(); } catch (_) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      watchRouteChanges();
      scheduleAutoUpdateCheck();
    });
  } else {
    init();
    watchRouteChanges();
    scheduleAutoUpdateCheck();
  }
})();
