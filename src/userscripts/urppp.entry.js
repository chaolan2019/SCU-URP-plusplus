import {
  alpha,
  darken,
  hexToRgb,
  lighten,
  mixHex,
  normalizeHexColor,
  rgbToHex,
} from '../core/color.js';
import { createFeatureRuntime, defineFeature } from '../core/feature-runtime.js';
import { escapeHtml } from '../core/html.js';
import { compareVersions, parseUserscriptVersion } from '../core/version.js';
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
import {
  cloneNativePdfStage,
  exportNativePdfIsolated,
  isNativePdfIsolationActive,
} from '../features/schedule-export/native-pdf.js';
import featureStyles from '../styles/features.css';
import internalStyles from '../styles/internal.css';
import scheduleCardStyles from '../styles/schedule-cards.css';
import scheduleExportStyles from '../styles/schedule-export.css';

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

(function () {
  'use strict';

  // 与脚本头 @version 保持同步
  const URPPP_VERSION = '1.5.5';
  const URPPP_UPDATE = {
    mainRaw: 'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js',
    assistRaw: 'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js',
    changelogRaw: 'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/CHANGELOG.md',
    repo: 'https://github.com/chaolan2019/SCU-URP-plusplus',
    changelogPage: 'https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md',
    greasySearch: 'https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B'
  };
  const AUTO_UPDATE_KEY = 'urppp_auto_update_check_v1';
  const SKIN_KEY = 'urppp_skin_v1';
  const SKIN_CATALOG = [
    { id: 'apple', name: '类Apple风格', desc: '系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。', ready: true, dark: true, dynamic: true },
    { id: 'flat', name: '极简扁平', desc: '无阴影、硬边与纯色层次，冷硬清晰。', ready: true, dark: true, dynamic: true },
    { id: 'organic', name: '自然有机', desc: '奶油底与大地色，温暖圆角。不支持动态配色。', ready: true, dark: true, dynamic: false },
    { id: 'brutal', name: '新野兽派', desc: '高对比画布、粗边框与硬阴影。不支持暗色和动态配色。', ready: true, dark: false, dynamic: false, palettes: true },
    { id: 'editorial', name: '编辑杂志', desc: '衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。', ready: true, dark: true, dynamic: false },
    { id: 'neu', name: '新拟物', desc: '同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。', ready: true, dark: true, dynamic: false },
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
  const APPLE_EDGE_KEY = 'urppp_apple_edge_line_v1';
  const FOLLOW_DYNAMIC_KEY = 'urppp_follow_use_dynamic_v1';
  const BRUTAL_PALETTE_KEY = 'urppp_brutal_palette_v1';
  const BRUTAL_ACTIVE_PALETTE_KEY = 'urppp_brutal_active_palette_v1';
  const PRIVACY_SETTINGS_KEY = 'urppp_privacy_v1';
  const CUSTOM_IDENTITY_KEY = 'urppp_custom_identity_v1';
  const SCHEDULE_FIRST_MONDAY_KEY = 'urppp_schedule_first_monday_v1';
  const SCHEDULE_JSON_FORMAT_KEY = 'urppp_schedule_json_format_v1';
  const PRIVACY_MASK_TEXT = '••••';
  const CUSTOM_AVATAR_MAX_LENGTH = 3 * 1024 * 1024;
  const PRIVACY_FIELD_DEFAULTS = {
    name: { enabled: false, replacement: '同学' },
    identity: { enabled: true, replacement: '已隐藏' },
    organization: { enabled: true, replacement: '已隐藏' },
    contact: { enabled: true, replacement: '已隐藏' },
    grade: { enabled: true, replacement: '已隐藏' },
    gpa: { enabled: true, replacement: '••••' },
    credit: { enabled: true, replacement: '••••' },
    other: { enabled: true, replacement: '已隐藏' },
    avatar: { enabled: true, replacement: '' },
    schedule: { enabled: false, replacement: '课表已隐藏' }
  };
  const DIRECT_EDIT_KEYS = [
    'completedCourses', 'failedCourses', 'majorGpa', 'majorPlan', 'remainingCourses',
    'passingTotalCredit', 'passingAvgScore', 'passingAvgGpa',
    'passingRequiredCredit', 'passingRequiredAvg', 'passingRequiredGpa',
    'schemeTotalCredit', 'schemeAvgScore', 'schemeAvgGpa',
    'schemeRequiredCredit', 'schemeRequiredAvg', 'schemeRequiredGpa'
  ];
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

  // 兼容旧调用名
  function buildAccentSurfaceTheme(hex) {
    return buildMaterialSchemeVars(hex, getScheme());
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

  function removeAccentPreset(hex) {
    const h = (hex || '').toLowerCase();
    const list = getAccentPresets().filter((x) => x.toLowerCase() !== h);
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

  function normalizePrivacySettings(value) {
    const raw = value && typeof value === 'object' ? value : {};
    const mode = ['off', 'one', 'custom'].includes(raw.mode) ? raw.mode : 'off';
    const fields = {};
    const rawFields = raw.fields && typeof raw.fields === 'object' ? raw.fields : {};
    const legacyScore = rawFields.score && typeof rawFields.score === 'object' ? rawFields.score : null;
    Object.keys(PRIVACY_FIELD_DEFAULTS).forEach((key) => {
      const base = PRIVACY_FIELD_DEFAULTS[key];
      const migratedScore = ['grade', 'gpa', 'credit'].includes(key) ? legacyScore : null;
      const migratedOther = key === 'other' && rawFields.grade && typeof rawFields.grade === 'object' ? rawFields.grade : null;
      const item = rawFields[key] && typeof rawFields[key] === 'object' ? rawFields[key] : (migratedScore || migratedOther || {});
      fields[key] = {
        enabled: key === 'name' ? false : (item.enabled == null ? base.enabled : !!item.enabled),
        replacement: String(item.replacement == null ? base.replacement : item.replacement).slice(0, 80)
      };
    });
    const legacyHomepage = raw.homepage && typeof raw.homepage === 'object' ? raw.homepage : {};
    const rawDirectEdit = raw.directEdit && typeof raw.directEdit === 'object' ? raw.directEdit : legacyHomepage;
    const rawDirectValues = rawDirectEdit.values && typeof rawDirectEdit.values === 'object' ? rawDirectEdit.values : {};
    const directValues = {};
    DIRECT_EDIT_KEYS.forEach((key) => {
      directValues[key] = String(rawDirectValues[key] == null ? '' : rawDirectValues[key]).trim().slice(0, 80);
    });
    return {
      mode,
      mask: PRIVACY_MASK_TEXT,
      fields,
      directEdit: { enabled: !!rawDirectEdit.enabled, values: directValues }
    };
  }

  function getPrivacySettings() {
    return normalizePrivacySettings(readJsonSetting(PRIVACY_SETTINGS_KEY, null));
  }

  function setPrivacySettings(value) {
    return writeJsonSetting(PRIVACY_SETTINGS_KEY, normalizePrivacySettings(value));
  }

  function normalizeCustomIdentity(value) {
    const raw = value && typeof value === 'object' ? value : {};
    const avatar = String(raw.avatar || '').trim();
    return {
      nameEnabled: !!raw.nameEnabled,
      name: String(raw.name || '').trim().slice(0, 40),
      avatarEnabled: !!raw.avatarEnabled,
      avatar: avatar.length <= CUSTOM_AVATAR_MAX_LENGTH ? avatar : '',
      avatarName: String(raw.avatarName || '').trim().slice(0, 120)
    };
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

  function getSkin() {
    const id = GM_getValue(SKIN_KEY, 'apple');
    const hit = SKIN_CATALOG.find((s) => s.id === id);
    return hit && hit.ready ? id : 'apple';
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
      };
    }
    if (id === 'neu') {
      return {
        '--radius': '16px',
        '--radius-sm': '12px',
        '--shadow': '5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC',
        '--border-w': '0px',
        '--urppp-card-border': 'none',
        '--urppp-input-border': 'none',
      };
    }
    // apple / default：轻阴影、大圆角；卡片几乎无描边
    return {
      '--radius': '18px',
      '--radius-sm': '12px',
      '--shadow': '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
      '--border-w': '0px',
      '--urppp-card-border': id === 'apple' && isAppleEdgeLine() ? '1px solid rgba(0,0,0,0.08)' : 'none',
      '--urppp-input-border': '1px solid var(--border)',
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
      } else if (id === 'flat') {
        css += [
          'html[data-urppp-skin="flat"]{--radius:0px!important;--radius-sm:0px!important;--shadow:none!important;}',
          // 大容器：直角硬边
          'html[data-urppp-skin="flat"] .widget-box,html[data-urppp-skin="flat"] .widget-box.transparent,html[data-urppp-skin="flat"] .panel,html[data-urppp-skin="flat"] .panel-default,html[data-urppp-skin="flat"] .well,html[data-urppp-skin="flat"] .thumbnail,html[data-urppp-skin="flat"] .infobox,html[data-urppp-skin="flat"] .profile-user-info,html[data-urppp-skin="flat"] .profile-user-info-striped,html[data-urppp-skin="flat"] .modal-content,html[data-urppp-skin="flat"] fieldset,html[data-urppp-skin="flat"] .urppp-stat-card,html[data-urppp-skin="flat"] .urppp-db-card,html[data-urppp-skin="flat"] .urppp-db-panel,html[data-urppp-skin="flat"] #urppp-dashboard .widget-box,html[data-urppp-skin="flat"] .page-content .widget-box,html[data-urppp-skin="flat"] #page-content-template .widget-box,html[data-urppp-skin="flat"] #urppp-root .uc,html[data-urppp-skin="flat"] #urppp-settings-panel,html[data-urppp-skin="flat"] #urppp-clean-root .uc-card,html[data-urppp-skin="flat"] #urppp-clean-root .uc-modal,html[data-urppp-skin="flat"] #urppp-clean-root .uc-top,html[data-urppp-skin="flat"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc{border-radius:0!important;box-shadow:none!important;border:2px solid var(--text)!important;}',
          // 课表细控件：轻边，别画满 2px 黑框
          'html[data-urppp-skin="flat"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="flat"] #urppp-clean-root .uc-grid-cell,html[data-urppp-skin="flat"] #urppp-clean-root .uc-course-sub,html[data-urppp-skin="flat"] #urppp-clean-root .uc-attr-pill,html[data-urppp-skin="flat"] #urppp-clean-root .uc-gpa,html[data-urppp-skin="flat"] #urppp-clean-root .uc-cd-chip,html[data-urppp-skin="flat"] #urppp-clean-root .uc-avatar{border-radius:0!important;box-shadow:none!important;border:1px solid color-mix(in srgb,var(--text) 28%,var(--border))!important;}',
          'html[data-urppp-skin="flat"] #urppp-clean-root .uc-avatar img{border-radius:0!important;}',
          'html[data-urppp-skin="flat"] #urppp-clean-root .uc-lesson{border:1px solid color-mix(in srgb,var(--primary) 35%,var(--text))!important;}',
          // 按钮/输入矩形
          'html[data-urppp-skin="flat"] .btn,html[data-urppp-skin="flat"] .btn-default,html[data-urppp-skin="flat"] .btn-white,html[data-urppp-skin="flat"] .btn-primary,html[data-urppp-skin="flat"] .btn-info,html[data-urppp-skin="flat"] .btn-success,html[data-urppp-skin="flat"] .btn-warning,html[data-urppp-skin="flat"] .btn-danger,html[data-urppp-skin="flat"] .btn-purple,html[data-urppp-skin="flat"] .btn-app,html[data-urppp-skin="flat"] a.btn,html[data-urppp-skin="flat"] button.btn,html[data-urppp-skin="flat"] input.btn,html[data-urppp-skin="flat"] .btn-group>.btn,html[data-urppp-skin="flat"] .btn-xs,html[data-urppp-skin="flat"] .btn-sm,html[data-urppp-skin="flat"] .btn-minier,html[data-urppp-skin="flat"] #urppp-root .ubtn,html[data-urppp-skin="flat"] #urppp-root .ut button,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-set-btn,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-set-mode,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-set-follow,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-set-scheme,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-set-tab,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-set-close,html[data-urppp-skin="flat"] #urppp-nav-theme .urppp-nav-settings,html[data-urppp-skin="flat"] #uc-settings,html[data-urppp-skin="flat"] #uc-exit,html[data-urppp-skin="flat"] #uc-refresh,html[data-urppp-skin="flat"] #urppp-clean-entry,html[data-urppp-skin="flat"] button.urppp-clean-entry,html[data-urppp-skin="flat"] .urppp-clean-entry,html[data-urppp-skin="flat"] #urppp-clean-root .uc-btn,html[data-urppp-skin="flat"] #urppp-clean-root .uc-top-actions .uc-btn,html[data-urppp-skin="flat"] #urppp-clean-root .uc-tabbar button,html[data-urppp-skin="flat"] #urppp-clean-root button.uc-btn,html[data-urppp-skin="flat"] .chosen-container-single .chosen-single,html[data-urppp-skin="flat"] .chosen-container-multi .chosen-choices,html[data-urppp-skin="flat"] .form-control,html[data-urppp-skin="flat"] input[type="text"],html[data-urppp-skin="flat"] input[type="password"],html[data-urppp-skin="flat"] input[type="number"],html[data-urppp-skin="flat"] input[type="search"],html[data-urppp-skin="flat"] select,html[data-urppp-skin="flat"] textarea,html[data-urppp-skin="flat"] #urppp-root .ui{border-radius:0!important;box-shadow:none!important;border:2px solid var(--text)!important;}',
          'html[data-urppp-skin="flat"] #navbar button:not(.urppp-nav-dot),html[data-urppp-skin="flat"] .navbar button:not(.urppp-nav-dot),html[data-urppp-skin="flat"] #urppp-nav-theme button:not(.urppp-nav-dot),html[data-urppp-skin="flat"] #urppp-nav-theme .urppp-nav-settings,html[data-urppp-skin="flat"] #urppp-nav-clean{border-radius:0!important;box-shadow:none!important;border:2px solid var(--text)!important;background:var(--surface)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="flat"] .btn-primary,html[data-urppp-skin="flat"] .btn-info,html[data-urppp-skin="flat"] #urppp-clean-root .uc-btn.primary,html[data-urppp-skin="flat"] #urppp-root .ubtn{background:var(--primary)!important;color:#fff!important;border:2px solid var(--text)!important;}',
          'html[data-urppp-skin="flat"] .btn-default,html[data-urppp-skin="flat"] .btn-white,html[data-urppp-skin="flat"] #urppp-clean-root .uc-btn:not(.primary){background:var(--surface)!important;color:var(--text)!important;border:2px solid var(--text)!important;}',
          'html[data-urppp-skin="flat"] .btn:hover,html[data-urppp-skin="flat"] #urppp-clean-root .uc-btn:hover{transform:none!important;box-shadow:none!important;}',
          'html[data-urppp-skin="flat"] .btn-primary:hover,html[data-urppp-skin="flat"] .btn-info:hover{background:var(--surface)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="flat"] .table,html[data-urppp-skin="flat"] table,html[data-urppp-skin="flat"] .table-bordered{border:1px solid var(--text)!important;box-shadow:none!important;border-radius:0!important;}',
          'html[data-urppp-skin="flat"] .table>thead>tr>th,html[data-urppp-skin="flat"] .table>tbody>tr>td,html[data-urppp-skin="flat"] .table-bordered>thead>tr>th,html[data-urppp-skin="flat"] .table-bordered>tbody>tr>td{border-color:color-mix(in srgb,var(--text) 35%,transparent)!important;border-width:1px!important;}',
          'html[data-urppp-skin="flat"] .nav-tabs>li>a,html[data-urppp-skin="flat"] .nav-tabs,html[data-urppp-skin="flat"] .urppp-nav-link,html[data-urppp-skin="flat"] .urppp-nav-item{border-radius:0!important;}',
          'html[data-urppp-skin="flat"] #urppp-clean-root .uc-card:hover,html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc:hover,html[data-urppp-skin="flat"] #urppp-clean-root .uc-lesson:hover,html[data-urppp-skin="flat"] .urppp-stat-card:hover{transform:none!important;box-shadow:none!important;}',
          // 主题点保持圆形
          'html[data-urppp-skin="flat"] .urppp-nav-dot,html[data-urppp-skin="flat"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="flat"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="flat"] .urppp-set-swatch,html[data-urppp-skin="flat"] .nav-user-photo,html[data-urppp-skin="flat"] #urppp-dots span{border-radius:50%!important;border-width:2px!important;box-shadow:none!important;}',
          // 首页/清爽 内层卡片与漏网按钮：外框加粗加黑
          'html[data-urppp-skin="flat"] .urppp-card,html[data-urppp-skin="flat"] .urppp-card-header,html[data-urppp-skin="flat"] #urppp-dashboard .urppp-card,html[data-urppp-skin="flat"] #urppp-left .fc-toolbar .fc-center h2,html[data-urppp-skin="flat"] #urppp-left .fc-toolbar h2,html[data-urppp-skin="flat"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="flat"] #urppp-clean-root #uc-score-wrap,html[data-urppp-skin="flat"] #urppp-clean-root .uc-score-grid > *,html[data-urppp-skin="flat"] #urppp-clean-root .uc-metric,html[data-urppp-skin="flat"] #urppp-clean-root .uc-profile,html[data-urppp-skin="flat"] #urppp-clean-root .uc-bd > div,html[data-urppp-skin="flat"] #urppp-clean-root .uc-hd{border-radius:0!important;box-shadow:none!important;}',
          'html[data-urppp-skin="flat"] .urppp-card,html[data-urppp-skin="flat"] #urppp-dashboard .urppp-card,html[data-urppp-skin="flat"] #urppp-left .fc-toolbar .fc-center h2,html[data-urppp-skin="flat"] #urppp-left .fc-toolbar h2,html[data-urppp-skin="flat"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="flat"] #urppp-clean-root #uc-score-wrap{border:2px solid var(--text)!important;background:var(--surface)!important;}',
          // 成绩总览小卡（全部及格/方案）强制 2px 黑框
          'html[data-urppp-skin="flat"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="flat"] #urppp-clean-root [data-score]{border:2px solid var(--text)!important;border-radius:0!important;box-shadow:none!important;}',
          // 首页「开放的可申请」等可能是 .infobox / 自定义卡
          'html[data-urppp-skin="flat"] .infobox,html[data-urppp-skin="flat"] .infobox-container .infobox,html[data-urppp-skin="flat"] .page-content .infobox,html[data-urppp-skin="flat"] #urppp-dashboard .infobox{border:2px solid var(--text)!important;border-radius:0!important;box-shadow:none!important;}',
          // 漏网按钮：侧栏折叠、菜单切换、顶栏清爽、header 操作钮、分页
          'html[data-urppp-skin="flat"] #menu-toggler,html[data-urppp-skin="flat"] .menu-toggler,html[data-urppp-skin="flat"] .navbar-toggle,html[data-urppp-skin="flat"] button.menu-toggler,html[data-urppp-skin="flat"] .ace-nav>li>a,html[data-urppp-skin="flat"] .navbar .btn,html[data-urppp-skin="flat"] .navbar button,html[data-urppp-skin="flat"] .header .right_top_oper .btn,html[data-urppp-skin="flat"] .header .right_top_oper a,html[data-urppp-skin="flat"] h4.header .right_top_oper .btn,html[data-urppp-skin="flat"] h4.header .right_top_oper a,html[data-urppp-skin="flat"] .pagination>li>a,html[data-urppp-skin="flat"] .pagination>li>span,html[data-urppp-skin="flat"] .pagebar a,html[data-urppp-skin="flat"] .pagebar button,html[data-urppp-skin="flat"] .urppp-pagebar a,html[data-urppp-skin="flat"] .urppp-pagebar button,html[data-urppp-skin="flat"] .widget-toolbar a,html[data-urppp-skin="flat"] .widget-toolbar button,html[data-urppp-skin="flat"] a.btn-link,html[data-urppp-skin="flat"] .btn-link{border-radius:0!important;box-shadow:none!important;}',
          'html[data-urppp-skin="flat"] #menu-toggler,html[data-urppp-skin="flat"] .menu-toggler,html[data-urppp-skin="flat"] .navbar-toggle,html[data-urppp-skin="flat"] .header .right_top_oper .btn,html[data-urppp-skin="flat"] .header .right_top_oper a.btn,html[data-urppp-skin="flat"] h4.header .right_top_oper .btn,html[data-urppp-skin="flat"] .pagination>li>a,html[data-urppp-skin="flat"] .pagination>li>span,html[data-urppp-skin="flat"] .widget-toolbar a,html[data-urppp-skin="flat"] .widget-toolbar button{border:2px solid var(--text)!important;background:var(--surface)!important;color:var(--text)!important;}',
          // 顶栏清爽入口（文本按钮）
          'html[data-urppp-skin="flat"] #navbar a,html[data-urppp-skin="flat"] .navbar a.btn,html[data-urppp-skin="flat"] .ace-nav>li>a.btn,html[data-urppp-skin="flat"] #urppp-nav-theme + button,html[data-urppp-skin="flat"] button[title*="清爽"],html[data-urppp-skin="flat"] a[title*="清爽"]{border-radius:0!important;}',
          // 侧栏折叠图标按钮
          'html[data-urppp-skin="flat"] .urppp-sidebar-toggle,html[data-urppp-skin="flat"] button.urppp-sidebar-toggle,html[data-urppp-skin="flat"] button[title*="收起侧边栏"],html[data-urppp-skin="flat"] button[title*="展开侧边栏"]{border-radius:0!important;border:1px solid var(--border)!important;background:var(--input-bg)!important;color:var(--text-secondary)!important;box-shadow:none!important;}',
          // 红框强制：搜索 / 可申请 / 课表工具（最高优先级）
          'html[data-urppp-skin="flat"] input#search-input.nav-search-input,html[data-urppp-skin="flat"] #form-search input.nav-search-input,html[data-urppp-skin="flat"] #form-search.nav-search .nav-search-input{border-radius:0!important;border:2px solid #000!important;box-shadow:none!important;background:#fff!important;color:#000!important;height:32px!important;}',
          'html.urppp-theme-dark[data-urppp-skin="flat"] input#search-input.nav-search-input,html.urppp-theme-dark[data-urppp-skin="flat"] #form-search.nav-search .nav-search-input{border-color:var(--text)!important;background:var(--input-bg)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="flat"] a.btn.btn-app.btn-info,html[data-urppp-skin="flat"] button.btn.btn-app.btn-info,html[data-urppp-skin="flat"] .btn.btn-app.btn-info,html[data-urppp-skin="flat"] a.btn-app,html[data-urppp-skin="flat"] .btn-app{border-radius:0!important;border:2px solid #000!important;box-shadow:none!important;background:#fff!important;color:#000!important;transform:none!important;}',
          'html.urppp-theme-dark[data-urppp-skin="flat"] a.btn.btn-app.btn-info,html.urppp-theme-dark[data-urppp-skin="flat"] .btn-app{border-color:var(--text)!important;background:var(--surface)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="flat"] a.btn.btn-app.btn-info:hover,html[data-urppp-skin="flat"] .btn-app:hover{background:#000!important;color:#fff!important;border-color:#000!important;transform:none!important;box-shadow:none!important;}',
          'html[data-urppp-skin="flat"] a.btn.btn-app.btn-info:hover .fa,html[data-urppp-skin="flat"] .btn-app:hover .fa,html[data-urppp-skin="flat"] .btn-app:hover .ace-icon{color:#fff!important;}',
          'html[data-urppp-skin="flat"] #urppp-left .fc-toolbar h2,html[data-urppp-skin="flat"] #urppp-left .fc .fc-toolbar h2,html[data-urppp-skin="flat"] #urppp-left h2.fc-center,html[data-urppp-skin="flat"] .fc-toolbar h2{border-radius:0!important;border:2px solid #000!important;box-shadow:none!important;background:#fff!important;color:#000!important;padding:6px 14px!important;}',
          'html.urppp-theme-dark[data-urppp-skin="flat"] #urppp-left .fc-toolbar h2,html.urppp-theme-dark[data-urppp-skin="flat"] .fc-toolbar h2{border-color:var(--text)!important;background:var(--surface)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="flat"] #urppp-left .fc-button,html[data-urppp-skin="flat"] #urppp-left button.fc-button,html[data-urppp-skin="flat"] #urppp-left .fc-state-default,html[data-urppp-skin="flat"] #urppp-left .fc-prev-button,html[data-urppp-skin="flat"] #urppp-left .fc-next-button,html[data-urppp-skin="flat"] #urppp-left .fc-today-button,html[data-urppp-skin="flat"] .fc .fc-button,html[data-urppp-skin="flat"] .fc button{border-radius:0!important;border:2px solid #000!important;box-shadow:none!important;background:#fff!important;color:#000!important;}',
          // 最终压过：dashboard btn-app / 搜索 / 卡片标题栏刷新（蓝框）
          'html[data-urppp-skin="flat"] #urppp-dashboard .btn-app,html[data-urppp-skin="flat"] #urppp-dashboard a.btn-app,html[data-urppp-skin="flat"] #urppp-dashboard button.btn-app,html[data-urppp-skin="flat"] #urppp-dashboard a.btn.btn-app.btn-info,html[data-urppp-skin="flat"] #personalApplication .btn-app,html[data-urppp-skin="flat"] #personalApplication a.btn-app,html[data-urppp-skin="flat"] body #urppp-dashboard .btn.btn-app{border-radius:0!important;border:2px solid #000!important;background:#fff!important;color:#000!important;box-shadow:none!important;transform:none!important;}',
          'html[data-urppp-skin="flat"] #urppp-dashboard .btn-app:hover,html[data-urppp-skin="flat"] #urppp-dashboard a.btn-app:hover,html[data-urppp-skin="flat"] #personalApplication .btn-app:hover{background:#000!important;color:#fff!important;border-color:#000!important;transform:none!important;box-shadow:none!important;}',
          'html[data-urppp-skin="flat"] #urppp-dashboard .btn-app:hover .fa,html[data-urppp-skin="flat"] #urppp-dashboard .btn-app:hover .ace-icon,html[data-urppp-skin="flat"] #personalApplication .btn-app:hover .fa{color:#fff!important;}',
          'html[data-urppp-skin="flat"] #form-search.nav-search input#search-input,html[data-urppp-skin="flat"] #form-search.nav-search input.nav-search-input,html[data-urppp-skin="flat"] input#search-input.nav-search-input{border-radius:0!important;border:2px solid #000!important;box-shadow:none!important;background:#fff!important;}',
          'html[data-urppp-skin="flat"] .urppp-card-tools .widget-toolbar a,html[data-urppp-skin="flat"] .urppp-card-header .widget-toolbar a,html[data-urppp-skin="flat"] .urppp-card .widget-toolbar a,html[data-urppp-skin="flat"] #urppp-dashboard .widget-toolbar a,html[data-urppp-skin="flat"] #urppp-dashboard .urppp-card-tools a,html[data-urppp-skin="flat"] .widget-header .widget-toolbar a,html[data-urppp-skin="flat"] .widget-toolbar > a{border:none!important;box-shadow:none!important;background:transparent!important;border-radius:0!important;outline:none!important;}'

,
          // 红框漏网：搜索框、可申请 btn-app、课表日期块与工具条按钮（蓝框折叠钮不强制）
          'html[data-urppp-skin="flat"] #form-search.nav-search .nav-search-input,html[data-urppp-skin="flat"] #search-input,html[data-urppp-skin="flat"] input.nav-search-input,html[data-urppp-skin="flat"] .nav-search .nav-search-input{border-radius:0!important;border:2px solid var(--text)!important;box-shadow:none!important;background:var(--surface)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="flat"] #form-search.nav-search .nav-search-input:focus,html[data-urppp-skin="flat"] #search-input:focus{box-shadow:none!important;border-color:var(--text)!important;outline:2px solid var(--primary)!important;outline-offset:0!important;}',
          'html[data-urppp-skin="flat"] .btn-app,html[data-urppp-skin="flat"] .btn.btn-app,html[data-urppp-skin="flat"] a.btn-app,html[data-urppp-skin="flat"] button.btn-app,html[data-urppp-skin="flat"] .btn.btn-app.btn-info,html[data-urppp-skin="flat"] .btn.btn-app.btn-primary,html[data-urppp-skin="flat"] a.btn.btn-app.btn-info,html[data-urppp-skin="flat"] a.btn.btn-app.btn-primary,html[data-urppp-skin="flat"] button.btn.btn-app.btn-info{border-radius:0!important;border:2px solid var(--text)!important;box-shadow:none!important;background:var(--surface)!important;color:var(--text)!important;transform:none!important;}',
          'html[data-urppp-skin="flat"] .btn-app:hover,html[data-urppp-skin="flat"] .btn.btn-app:hover,html[data-urppp-skin="flat"] a.btn-app:hover,html[data-urppp-skin="flat"] .btn.btn-app.btn-info:hover{background:var(--text)!important;color:var(--surface)!important;border-color:var(--text)!important;transform:none!important;box-shadow:none!important;}',
          'html[data-urppp-skin="flat"] .btn-app:hover > .ace-icon,html[data-urppp-skin="flat"] .btn-app:hover > .fa,html[data-urppp-skin="flat"] .btn.btn-app:hover > .fa{color:var(--surface)!important;}',
          'html[data-urppp-skin="flat"] #urppp-left .fc-toolbar .fc-center h2,html[data-urppp-skin="flat"] #urppp-left .fc-toolbar h2,html[data-urppp-skin="flat"] .fc .fc-toolbar h2,html[data-urppp-skin="flat"] .fc-toolbar h2{border-radius:0!important;border:2px solid var(--text)!important;box-shadow:none!important;background:var(--surface)!important;}',
          'html[data-urppp-skin="flat"] .fc-button,html[data-urppp-skin="flat"] .fc-state-default,html[data-urppp-skin="flat"] .fc-button-group > *,html[data-urppp-skin="flat"] #urppp-left .fc-button,html[data-urppp-skin="flat"] #urppp-left .fc-state-default,html[data-urppp-skin="flat"] #urppp-left .fc-toolbar button,html[data-urppp-skin="flat"] #urppp-left .fc-toolbar .fc-button,html[data-urppp-skin="flat"] .fc-prev-button,html[data-urppp-skin="flat"] .fc-next-button,html[data-urppp-skin="flat"] .fc-today-button,html[data-urppp-skin="flat"] button.fc-button{border-radius:0!important;border:2px solid var(--text)!important;box-shadow:none!important;background:var(--surface)!important;color:var(--text)!important;}'


        ,
          'html[data-urppp-skin="flat"] #urppp-clean-root .uc-build-grid button,html[data-urppp-skin="flat"] #urppp-clean-root .uc-build-grid > button{border-radius:0!important;border:2px solid var(--text)!important;box-shadow:none!important;background:var(--surface)!important;color:var(--text)!important;transform:none!important;}',
          'html[data-urppp-skin="flat"] #urppp-clean-root .uc-build-grid button:hover{background:var(--text)!important;color:var(--surface)!important;border-color:var(--text)!important;transform:none!important;box-shadow:none!important;}'].join('');
        css += `
          html[data-urppp-skin="flat"] .widget-header,
          html[data-urppp-skin="flat"] .panel-heading,
          html[data-urppp-skin="flat"] .urppp-card-header,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-hd{
            background:var(--surface)!important;color:var(--text)!important;
            border-bottom:2px solid var(--text)!important;
          }
          html[data-urppp-skin="flat"] .widget-title,
          html[data-urppp-skin="flat"] .urppp-card-title,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-brand,
          html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-set-title{
            color:var(--text)!important;font-weight:800!important;letter-spacing:0!important;
          }
          html[data-urppp-skin="flat"] .btn:not(.btn-link):not(:disabled),
          html[data-urppp-skin="flat"] a.btn,
          html[data-urppp-skin="flat"] .btn-app,
          html[data-urppp-skin="flat"] #navbar button:not(.urppp-nav-dot):not(:disabled),
          html[data-urppp-skin="flat"] #urppp-nav-clean,
          html[data-urppp-skin="flat"] #urppp-settings-panel button:not(.urppp-nav-dot):not(.urppp-skin-apply):not(.urppp-set-swatch):not(:disabled),
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-btn:not(:disabled),
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-build-grid button:not(:disabled),
          html[data-urppp-skin="flat"] .fc-button:not(.fc-state-disabled),
          html[data-urppp-skin="flat"] .pagination>li>a,
          html[data-urppp-skin="flat"] .nav-list>li>a,
          html[data-urppp-skin="flat"] .urppp-nav-link,
          html[data-urppp-skin="flat"] .urppp-stat-card,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc{
            transition:background-color 150ms ease-out,color 150ms ease-out,border-color 150ms ease-out,outline-color 150ms ease-out!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="flat"] .btn:not(.btn-link):not(:disabled):hover,
          html[data-urppp-skin="flat"] a.btn:hover,
          html[data-urppp-skin="flat"] .btn-app:hover,
          html[data-urppp-skin="flat"] #navbar button:not(.urppp-nav-dot):not(:disabled):hover,
          html[data-urppp-skin="flat"] #urppp-nav-clean:hover,
          html[data-urppp-skin="flat"] #urppp-settings-panel button:not(.urppp-nav-dot):not(.urppp-skin-apply):not(.urppp-set-swatch):not(:disabled):hover,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-btn:not(:disabled):hover,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-build-grid button:not(:disabled):hover,
          html[data-urppp-skin="flat"] .fc-button:not(.fc-state-disabled):hover,
          html[data-urppp-skin="flat"] .pagination>li>a:hover,
          html[data-urppp-skin="flat"] .nav-list>li>a:hover,
          html[data-urppp-skin="flat"] .urppp-nav-link:hover,
          html[data-urppp-skin="flat"] .urppp-stat-card:hover,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc:hover{
            background:var(--text)!important;color:var(--surface)!important;
            border-color:var(--text)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="flat"] .btn:not(.btn-link):hover *,
          html[data-urppp-skin="flat"] a.btn:hover *,
          html[data-urppp-skin="flat"] .btn-app:hover *,
          html[data-urppp-skin="flat"] #navbar button:not(.urppp-nav-dot):hover *,
          html[data-urppp-skin="flat"] #urppp-settings-panel button:not(.urppp-skin-apply):not(.urppp-set-swatch):hover *,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-btn:hover *,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-build-grid button:hover *,
          html[data-urppp-skin="flat"] .fc-button:hover *,
          html[data-urppp-skin="flat"] .pagination>li>a:hover *,
          html[data-urppp-skin="flat"] .nav-list>li>a:hover *,
          html[data-urppp-skin="flat"] .urppp-nav-link:hover *,
          html[data-urppp-skin="flat"] .urppp-stat-card:hover *,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc:hover *{
            color:var(--surface)!important;
          }
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc:hover svg{
            color:var(--surface)!important;transform:none!important;
          }
          html[data-urppp-skin="flat"] #urppp-dashboard .btn-app,
          html[data-urppp-skin="flat"] #personalApplication .btn-app,
          html[data-urppp-skin="flat"] body #urppp-dashboard .btn.btn-app{
            background:var(--surface)!important;color:var(--text)!important;
            border-color:var(--text)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="flat"] #urppp-dashboard .btn-app:hover,
          html[data-urppp-skin="flat"] #personalApplication .btn-app:hover,
          html[data-urppp-skin="flat"] body #urppp-dashboard .btn.btn-app:hover{
            background:var(--text)!important;color:var(--surface)!important;
            border-color:var(--text)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="flat"] #urppp-dashboard .btn-app:hover *,
          html[data-urppp-skin="flat"] #personalApplication .btn-app:hover *{
            color:var(--surface)!important;
          }
          html[data-urppp-skin="flat"] #urppp-left .fc-button,
          html[data-urppp-skin="flat"] #urppp-left button.fc-button,
          html[data-urppp-skin="flat"] #urppp-left .fc-state-default{
            background:var(--surface)!important;color:var(--text)!important;
            border-color:var(--text)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="flat"] #urppp-left .fc-button:not(.fc-state-disabled):hover,
          html[data-urppp-skin="flat"] #urppp-left button.fc-button:not(.fc-state-disabled):hover,
          html[data-urppp-skin="flat"] #urppp-left .fc-state-default:not(.fc-state-disabled):hover{
            background:var(--text)!important;color:var(--surface)!important;
            border-color:var(--text)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="flat"] .btn:focus-visible,
          html[data-urppp-skin="flat"] a.btn:focus-visible,
          html[data-urppp-skin="flat"] button:focus-visible,
          html[data-urppp-skin="flat"] .urppp-stat-card:focus-visible,
          html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc:focus-visible,
          html[data-urppp-skin="flat"] .nav-list>li>a:focus-visible{
            outline:2px solid var(--primary)!important;outline-offset:2px!important;
          }
          @media (prefers-reduced-motion:reduce){
            html[data-urppp-skin="flat"] .btn,
            html[data-urppp-skin="flat"] button,
            html[data-urppp-skin="flat"] a,
            html[data-urppp-skin="flat"] .urppp-stat-card,
            html[data-urppp-skin="flat"] #urppp-clean-root .uc-svc{transition:none!important;}
          }
        `;
      }
      else if (id === 'brutal') {
        const palette = getBrutalActivePalette();
        css += `
          html[data-urppp-skin="brutal"]{
            --radius:0px!important;--radius-sm:0px!important;--shadow:6px 6px 0 #000!important;
            --bg:${palette.accent}!important;--surface:#fff!important;--input-bg:#fff!important;
            --text:#000!important;--text-secondary:#000!important;--text-muted:#000!important;
            --border:#000!important;--border-focus:#000!important;
            --primary:${palette.accent}!important;--primary-hover:${palette.secondary}!important;
            --ring:transparent!important;--success:${palette.secondary}!important;
            --info:${palette.info}!important;--warning:${palette.warning}!important;--danger:#FF006E!important;
            --brutal-accent:${palette.accent};--brutal-secondary:${palette.secondary};
            --brutal-info:${palette.info};--brutal-warning:${palette.warning};
          }
          html[data-urppp-skin="brutal"] body,
          html[data-urppp-skin="brutal"] .main-container,
          html[data-urppp-skin="brutal"] .main-content,
          html[data-urppp-skin="brutal"] .main-content-inner,
          html[data-urppp-skin="brutal"] .page-content,
          html[data-urppp-skin="brutal"] #urppp-clean-root{
            background:var(--bg)!important;background-image:none!important;color:#000!important;
            font-family:"JetBrains Mono","Cascadia Mono","Microsoft YaHei UI",monospace!important;
          }
          html[data-urppp-skin="brutal"] a,
          html[data-urppp-skin="brutal"] a:link,
          html[data-urppp-skin="brutal"] a:visited,
          html[data-urppp-skin="brutal"] a:hover,
          html[data-urppp-skin="brutal"] a:focus{color:#000!important;}
          html[data-urppp-skin="brutal"] h1,html[data-urppp-skin="brutal"] h2,
          html[data-urppp-skin="brutal"] h3,html[data-urppp-skin="brutal"] h4,
          html[data-urppp-skin="brutal"] h5,html[data-urppp-skin="brutal"] .page-header,
          html[data-urppp-skin="brutal"] .widget-title,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-brand,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-name,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-title{
            font-family:"Arial Black","Microsoft YaHei UI",sans-serif!important;font-weight:900!important;letter-spacing:0!important;color:#000!important;
          }
          html[data-urppp-skin="brutal"] #navbar,
          html[data-urppp-skin="brutal"] .navbar{
            background:#fff!important;border-bottom:3px solid #000!important;box-shadow:none!important;
          }
          html[data-urppp-skin="brutal"] #sidebar,
          html[data-urppp-skin="brutal"] .sidebar{
            background:#fff!important;border-right:3px solid #000!important;box-shadow:none!important;
          }
          html[data-urppp-skin="brutal"] .widget-box,
          html[data-urppp-skin="brutal"] .panel,
          html[data-urppp-skin="brutal"] .well,
          html[data-urppp-skin="brutal"] .thumbnail,
          html[data-urppp-skin="brutal"] .infobox,
          html[data-urppp-skin="brutal"] .profile-user-info,
          html[data-urppp-skin="brutal"] .profile-user-info-striped,
          html[data-urppp-skin="brutal"] .modal-content,
          html[data-urppp-skin="brutal"] fieldset,
          html[data-urppp-skin="brutal"] .urppp-stat-card,
          html[data-urppp-skin="brutal"] .urppp-db-card,
          html[data-urppp-skin="brutal"] .urppp-db-panel,
          html[data-urppp-skin="brutal"] .urppp-card,
          html[data-urppp-skin="brutal"] #urppp-dashboard .widget-box,
          html[data-urppp-skin="brutal"] #urppp-root .uc,
          html[data-urppp-skin="brutal"] #urppp-settings-panel,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-card,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-modal,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-top,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-tabbar,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-score-pane,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-svc{
            border:3px solid #000!important;border-radius:0!important;background:#fff!important;
            box-shadow:6px 6px 0 #000!important;box-sizing:border-box!important;
          }
          html[data-urppp-skin="brutal"] .widget-header,
          html[data-urppp-skin="brutal"] .page-content .widget-box .widget-header,
          html[data-urppp-skin="brutal"] .panel-heading,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-head,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-hd,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-modal-hd{
            background:var(--brutal-accent)!important;color:#000!important;border:0!important;border-bottom:3px solid #000!important;border-radius:0!important;
          }
          html[data-urppp-skin="brutal"] .btn,
          html[data-urppp-skin="brutal"] a.btn,
          html[data-urppp-skin="brutal"] button.btn,
          html[data-urppp-skin="brutal"] .btn-app,
          html[data-urppp-skin="brutal"] #urppp-root .ubtn,
          html[data-urppp-skin="brutal"] #urppp-nav-clean,
          html[data-urppp-skin="brutal"] #urppp-nav-theme button:not(.urppp-nav-dot),
          html[data-urppp-skin="brutal"] #urppp-settings-panel button:not(.urppp-nav-dot),
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-btn,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-tabbar button,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-build-grid button{
            border:3px solid #000!important;border-radius:0!important;background:#fff!important;color:#000!important;
            box-shadow:4px 4px 0 #000!important;transform:none!important;
            transition:background-color 150ms ease-out,box-shadow 150ms ease-out,transform 150ms ease-out!important;
          }
          html[data-urppp-skin="brutal"] .btn-primary,
          html[data-urppp-skin="brutal"] button.btn.btn-primary,
          html[data-urppp-skin="brutal"] a.btn.btn-primary,
          html[data-urppp-skin="brutal"] .btn-info,
          html[data-urppp-skin="brutal"] button.btn.btn-info,
          html[data-urppp-skin="brutal"] a.btn.btn-info,
          html[data-urppp-skin="brutal"] .btn-success,
          html[data-urppp-skin="brutal"] button.btn.btn-success,
          html[data-urppp-skin="brutal"] #urppp-root .ubtn,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-btn.primary,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-btn:not(.ghost){
            background:var(--brutal-accent)!important;color:#000!important;border-color:#000!important;
          }
          html[data-urppp-skin="brutal"] .btn:hover,
          html[data-urppp-skin="brutal"] a.btn:hover,
          html[data-urppp-skin="brutal"] button.btn:hover,
          html[data-urppp-skin="brutal"] .btn-app:hover,
          html[data-urppp-skin="brutal"] #urppp-root .ubtn:hover,
          html[data-urppp-skin="brutal"] #urppp-nav-clean:hover,
          html[data-urppp-skin="brutal"] #urppp-settings-panel button:hover:not(:disabled),
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-btn:hover,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-tabbar button:hover,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-build-grid button:hover{
            background:var(--brutal-secondary)!important;color:#000!important;box-shadow:6px 6px 0 #000!important;transform:translate(-2px,-2px)!important;
          }
          html[data-urppp-skin="brutal"] .btn:active,
          html[data-urppp-skin="brutal"] a.btn:active,
          html[data-urppp-skin="brutal"] button.btn:active,
          html[data-urppp-skin="brutal"] .btn-app:active,
          html[data-urppp-skin="brutal"] #urppp-root .ubtn:active,
          html[data-urppp-skin="brutal"] #urppp-settings-panel button:active:not(:disabled),
          html[data-urppp-skin="brutal"] #urppp-clean-root button:active{
            box-shadow:none!important;transform:translate(4px,4px)!important;
          }
          html[data-urppp-skin="brutal"] input.form-control,
          html[data-urppp-skin="brutal"] select.form-control,
          html[data-urppp-skin="brutal"] textarea.form-control,
          html[data-urppp-skin="brutal"] input[type="text"],
          html[data-urppp-skin="brutal"] input[type="search"],
          html[data-urppp-skin="brutal"] input[type="number"],
          html[data-urppp-skin="brutal"] select,
          html[data-urppp-skin="brutal"] textarea,
          html[data-urppp-skin="brutal"] #urppp-root .ui,
          html[data-urppp-skin="brutal"] .chosen-container-single .chosen-single{
            border:2px solid #000!important;border-radius:0!important;background:#fff!important;color:#000!important;box-shadow:none!important;
          }
          html[data-urppp-skin="brutal"] input:focus,
          html[data-urppp-skin="brutal"] select:focus,
          html[data-urppp-skin="brutal"] textarea:focus{
            border-color:#000!important;outline:3px solid var(--brutal-accent)!important;outline-offset:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="brutal"] .table,
          html[data-urppp-skin="brutal"] table,
          html[data-urppp-skin="brutal"] .table-bordered{
            border:2px solid #000!important;border-radius:0!important;border-collapse:collapse!important;box-shadow:none!important;background:#fff!important;color:#000!important;
          }
          html[data-urppp-skin="brutal"] .table>thead>tr>th,
          html[data-urppp-skin="brutal"] .table>tbody>tr>td,
          html[data-urppp-skin="brutal"] .table-bordered>thead>tr>th,
          html[data-urppp-skin="brutal"] .table-bordered>tbody>tr>td,
          html[data-urppp-skin="brutal"] table th,
          html[data-urppp-skin="brutal"] table td{
            border:2px solid #000!important;background:#fff!important;color:#000!important;
          }
          html[data-urppp-skin="brutal"] .table>thead>tr>th,
          html[data-urppp-skin="brutal"] table thead th{
            background:var(--brutal-accent)!important;font-weight:900!important;text-transform:uppercase!important;
          }
          html[data-urppp-skin="brutal"] .nav-tabs,
          html[data-urppp-skin="brutal"] .nav-tabs>li>a,
          html[data-urppp-skin="brutal"] .pagination>li>a,
          html[data-urppp-skin="brutal"] .pagination>li>span{
            border:2px solid #000!important;border-radius:0!important;background:#fff!important;color:#000!important;box-shadow:none!important;
          }
          html[data-urppp-skin="brutal"] .nav-tabs>li.active>a,
          html[data-urppp-skin="brutal"] .pagination>.active>a{
            background:var(--brutal-accent)!important;color:#000!important;
          }
          html[data-urppp-skin="brutal"] .label,
          html[data-urppp-skin="brutal"] .badge,
          html[data-urppp-skin="brutal"] .urppp-stat-card .label{
            border:0!important;border-radius:0!important;background:transparent!important;color:#000!important;box-shadow:none!important;padding:0!important;
          }
          html[data-urppp-skin="brutal"] .nav-list>li>a{
            background:#fff!important;color:#000!important;border-bottom:2px solid #000!important;border-radius:0!important;
          }
          html[data-urppp-skin="brutal"] .nav-list>li.active>a,
          html[data-urppp-skin="brutal"] .nav-list>li>a:hover{
            background:var(--brutal-accent)!important;color:#000!important;
          }
          html[data-urppp-skin="brutal"] .urppp-nav-dot,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-top-theme .urppp-nav-dot{
            width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;
            padding:0!important;border:3px solid #000!important;border-radius:50%!important;box-shadow:none!important;
          }
          html[data-urppp-skin="brutal"] .urppp-nav-dot.ac,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{
            outline:3px solid var(--brutal-accent)!important;outline-offset:2px!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-close{
            display:inline-flex!important;align-items:center!important;justify-content:center!important;
            width:32px!important;height:32px!important;padding:0!important;line-height:1!important;
            font-family:Arial,sans-serif!important;font-size:22px!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel #urppp-set-clean-default{
            margin-bottom:10px!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel #urppp-set-clean-default + .urppp-set-tip,
          html[data-urppp-skin="brutal"] #urppp-settings-panel #urppp-set-auto-update + .urppp-set-tip,
          html[data-urppp-skin="brutal"] #urppp-settings-panel #urppp-set-check-update + #urppp-set-update-status,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urpppp-entry-grid + .urpppp-tip,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urpppp-actions + .urpppp-status,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urpppp-switches + .urpppp-sub,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urpppp-switches + .urpppp-grid{
            margin-top:14px!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-tabs{
            background:#fff!important;border-bottom:3px solid #000!important;gap:6px!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-tab.ac,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-mode.ac,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-follow.ac{
            background:var(--brutal-accent)!important;color:#000!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-tab.ac::after{display:none!important;}
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-sec{
            border-bottom:3px solid #000!important;padding-bottom:20px!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-modes,
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-follow-row{
            gap:12px!important;margin-bottom:8px!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-schemes{
            gap:14px!important;padding:0 6px 6px 0!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-scheme{
            border:3px solid #000!important;border-radius:0!important;background:#fff!important;box-shadow:4px 4px 0 #000!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-scheme.ac{
            background:var(--brutal-accent)!important;outline:none!important;
          }
          html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-set-scheme-preview span{
            border:2px solid #000!important;border-radius:0!important;
          }
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-lesson,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-course-sub,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-attr-pill,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-cd-chip,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-score-cell{
            border:2px solid #000!important;border-radius:0!important;box-shadow:none!important;background:#fff!important;color:#000!important;
          }
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-grid-cell{
            border:1px solid #E7E7E7!important;border-radius:0!important;box-shadow:none!important;background:#FCFCFC!important;
          }
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-lesson{
            background:color-mix(in srgb,var(--uc-course-color,var(--brutal-accent)) 11%,#fff)!important;
            border-left:7px solid var(--uc-course-color,var(--brutal-accent))!important;
          }
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-gpa{
            border:3px solid #000!important;border-radius:0!important;background:var(--brutal-secondary)!important;color:#000!important;box-shadow:4px 4px 0 #000!important;
          }
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-avatar,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-avatar img{
            border-radius:0!important;
          }
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-avatar{
            border:3px solid #000!important;box-shadow:4px 4px 0 #000!important;
          }
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-score-pane:nth-child(3n+1),
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-svc:nth-child(4n+1){background:var(--brutal-secondary)!important;}
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-score-pane:nth-child(3n+2),
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-svc:nth-child(4n+2){background:var(--brutal-info)!important;}
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-score-pane:nth-child(3n),
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-svc:nth-child(4n+3){background:var(--brutal-warning)!important;}
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-sub,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-score-pane h5,
          html[data-urppp-skin="brutal"] #urppp-clean-root .uc-svc *{color:#000!important;}

        `;
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
          html[data-urppp-skin="editorial"] #urppp-nav-clean,
          html[data-urppp-skin="editorial"] #urppp-root .ut button,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar button{
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
          html[data-urppp-skin="editorial"] #urppp-nav-clean:hover,
          html[data-urppp-skin="editorial"] #urppp-root .ut button:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn:hover{
            background:transparent!important;color:var(--text)!important;text-decoration-color:currentColor!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] .btn:active,
          html[data-urppp-skin="editorial"] a.btn:active,
          html[data-urppp-skin="editorial"] button.btn:active,
          html[data-urppp-skin="editorial"] #urppp-nav-clean:active,
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
            background:var(--editorial-hover)!important;border-bottom-color:var(--text)!important;
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
      else if (id === 'organic') {
        // 自然有机：奶油底/大地色/大圆角；完整适配清爽模式
        css += [
          'html[data-urppp-skin="organic"]{--radius:22px!important;--radius-sm:14px!important;--shadow:0 2px 10px rgba(92,64,51,.06)!important;--bg:#FAF6F1!important;--surface:#FFFCF7!important;--input-bg:#F3EDE4!important;--text:#3F2E24!important;--text-secondary:#6B5346!important;--text-muted:#8A7364!important;--border:#E7E0D6!important;--border-focus:#8B9D77!important;--primary:#5C4033!important;--primary-hover:#4A3329!important;--ring:rgba(92,64,51,.16)!important;}',
          'html[data-urppp-skin="organic"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="organic"]{--bg:#1C1712!important;--surface:#2A221B!important;--input-bg:#342A22!important;--text:#F5EDE4!important;--text-secondary:#D2C0B0!important;--text-muted:#A89080!important;--border:#4A3B30!important;--border-focus:#A3B58A!important;--primary:#C4A484!important;--primary-hover:#D4B896!important;--ring:rgba(196,164,132,.22)!important;--shadow:0 8px 24px rgba(0,0,0,.4)!important;}',
          'html[data-urppp-skin="organic"] body,html[data-urppp-skin="organic"] #urppp-clean-root{background-color:var(--bg)!important;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E")!important;background-attachment:fixed!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-card,html[data-urppp-skin="organic"] #urppp-clean-root .uc-modal,html[data-urppp-skin="organic"] #urppp-clean-root .uc-top,html[data-urppp-skin="organic"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="organic"] #urppp-clean-root .uc-svc,html[data-urppp-skin="organic"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="organic"] #urppp-clean-root #uc-score-wrap,html[data-urppp-skin="organic"] #urppp-clean-root .uc-course-sub{border-radius:var(--radius)!important;border:1px solid var(--border)!important;box-shadow:var(--shadow)!important;background:var(--surface)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-btn,html[data-urppp-skin="organic"] #urppp-clean-root .uc-top-actions .uc-btn,html[data-urppp-skin="organic"] #urppp-clean-root .uc-tabbar button,html[data-urppp-skin="organic"] #urppp-clean-root button.uc-btn{border-radius:999px!important;border:1px solid var(--border)!important;box-shadow:none!important;background:var(--input-bg)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-btn.primary{background:var(--primary)!important;border-color:var(--primary)!important;color:#fff!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-lesson{border-radius:8px!important;border:1px solid color-mix(in srgb,var(--primary) 22%,var(--border))!important;box-shadow:none!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-grid-cell{border-radius:6px!important;border:1px solid color-mix(in srgb,var(--border) 80%,transparent)!important;box-shadow:none!important;background:var(--input-bg)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-avatar{border-radius:16px!important;border:1px solid var(--border)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-gpa,html[data-urppp-skin="organic"] #urppp-clean-root .uc-cd-chip,html[data-urppp-skin="organic"] #urppp-clean-root .uc-attr-pill,html[data-urppp-skin="organic"] #urppp-clean-root .uc-score-cell{border-radius:10px!important;border:1px solid var(--border)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-hd{color:var(--text)!important;border-bottom-color:var(--border)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-brand,html[data-urppp-skin="organic"] #urppp-clean-root .uc-name{color:var(--text)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-sub{color:var(--text-secondary)!important;}',
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-score-pane h5{color:var(--primary)!important;}',
          'html[data-urppp-skin="organic"] .widget-box,html[data-urppp-skin="organic"] .panel,html[data-urppp-skin="organic"] .well,html[data-urppp-skin="organic"] .profile-user-info,html[data-urppp-skin="organic"] .modal-content,html[data-urppp-skin="organic"] .urppp-card,html[data-urppp-skin="organic"] .urppp-stat-card,html[data-urppp-skin="organic"] #urppp-dashboard .urppp-card,html[data-urppp-skin="organic"] #urppp-settings-panel,html[data-urppp-skin="organic"] #urppp-root .uc{border-radius:var(--radius)!important;border:1px solid var(--border)!important;box-shadow:var(--shadow)!important;background:var(--surface)!important;}',
          'html[data-urppp-skin="organic"] .btn:not(.btn-app),html[data-urppp-skin="organic"] .btn-primary:not(.btn-app),html[data-urppp-skin="organic"] .btn-info:not(.btn-app),html[data-urppp-skin="organic"] .btn-default,html[data-urppp-skin="organic"] .btn-white,html[data-urppp-skin="organic"] #urppp-root .ubtn,html[data-urppp-skin="organic"] #urppp-nav-clean,html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-set-btn,html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-set-follow,html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-set-mode{border-radius:999px!important;}',
          'html[data-urppp-skin="organic"] .btn-app,html[data-urppp-skin="organic"] #urppp-dashboard .btn-app,html[data-urppp-skin="organic"] a.btn-app{border-radius:18px!important;border:1px solid var(--border)!important;background:var(--input-bg)!important;color:var(--text)!important;box-shadow:none!important;}',
          'html[data-urppp-skin="organic"] .btn-primary:not(.btn-app),html[data-urppp-skin="organic"] .btn-info:not(.btn-app),html[data-urppp-skin="organic"] #urppp-root .ubtn{background:var(--primary)!important;border-color:var(--primary)!important;color:#fff!important;}',
          'html[data-urppp-skin="organic"] input.form-control,html[data-urppp-skin="organic"] select.form-control,html[data-urppp-skin="organic"] textarea.form-control,html[data-urppp-skin="organic"] #urppp-root .ui,html[data-urppp-skin="organic"] #form-search .nav-search-input,html[data-urppp-skin="organic"] input#search-input{border-radius:999px!important;border:1px solid var(--border)!important;background:var(--input-bg)!important;color:var(--text)!important;}',
          'html[data-urppp-skin="organic"] h1,html[data-urppp-skin="organic"] h2,html[data-urppp-skin="organic"] h3,html[data-urppp-skin="organic"] h4,html[data-urppp-skin="organic"] .page-header,html[data-urppp-skin="organic"] #urppp-clean-root .uc-brand,html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-set-title{font-family:Georgia,"Noto Serif SC","Songti SC","Times New Roman",serif!important;}',
          'html[data-urppp-skin="organic"] .urppp-nav-dot,html[data-urppp-skin="organic"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="organic"] #urppp-clean-root .uc-top-theme .urppp-nav-dot{border-radius:50%!important;}'
        ,
          'html[data-urppp-skin="organic"] #urppp-clean-root .uc-build-grid button{border-radius:14px!important;border:1px solid var(--border)!important;box-shadow:none!important;background:var(--input-bg)!important;color:var(--text)!important;}'].join('');
      }
      else if (id === 'neu') {
        css += `
          html[data-urppp-skin="neu"]{
            --radius:16px!important;--radius-sm:12px!important;--border-w:0px!important;
            --bg:#E0E5EC!important;--surface:#E0E5EC!important;--input-bg:#E0E5EC!important;
            --text:#263142!important;--text-secondary:#4F5968!important;--text-muted:#5A6372!important;
            --border:rgba(38,49,66,.12)!important;--border-focus:#5B4CE2!important;
            --primary:#5B4CE2!important;--primary-hover:#4F41C9!important;--primary-foreground:#FFF!important;
            --ring:rgba(91,76,226,.24)!important;--shadow:5px 5px 10px #BEC3CA,-5px -5px 10px #F7F9FC!important;
            --success:#246E57!important;--info:#3F668E!important;--warning:#806000!important;--danger:#A94444!important;
            --neu-base:#E0E5EC;--neu-shadow-dark:#B8BCC2;--neu-shadow-light:#FFF;
            --neu-raised-dark:#BEC3CA;--neu-raised-light:#F7F9FC;
            --neu-raised:5px 5px 10px var(--neu-raised-dark),-5px -5px 10px var(--neu-raised-light);
            --neu-raised-sm:3px 3px 6px var(--neu-raised-dark),-3px -3px 6px var(--neu-raised-light);
            --neu-raised-xs:2px 2px 4px var(--neu-raised-dark),-2px -2px 4px var(--neu-raised-light);
            --neu-hover:2px 2px 4px var(--neu-raised-dark),-2px -2px 4px var(--neu-raised-light);
            --neu-inset:inset 4px 4px 8px var(--neu-shadow-dark),inset -4px -4px 8px var(--neu-shadow-light);
            --neu-inset-soft:inset 2px 2px 4px var(--neu-shadow-dark),inset -2px -2px 4px var(--neu-shadow-light);
            --neu-inset-deep:inset 6px 6px 12px var(--neu-shadow-dark),inset -6px -6px 12px var(--neu-shadow-light);
            --neu-line:rgba(38,49,66,.10);--neu-line-strong:rgba(38,49,66,.16);--neu-overlay:rgba(38,49,66,.38);
            --neu-success-bg:#D4E7DF;--neu-success-text:#286B56;
            --neu-info-bg:#D5E0EA;--neu-info-text:#365F85;
            --neu-warning-bg:#E8E0C8;--neu-warning-text:#735900;
            --neu-danger-bg:#E9D5D5;--neu-danger-text:#984242;
            --pagination-active-bg:var(--surface);--pagination-active-border:transparent;--pagination-active-foreground:var(--primary);color-scheme:light!important;
          }
          html.urppp-theme-dark[data-urppp-skin="neu"],
          html[data-urppp-skin="neu"].urppp-theme-dark,
          body.urppp-dark[data-urppp-skin="neu"]{
            --bg:#232830!important;--surface:#232830!important;--input-bg:#232830!important;
            --text:#F1F4F8!important;--text-secondary:#C7CED8!important;--text-muted:#A2ACB9!important;
            --border:rgba(241,244,248,.12)!important;--border-focus:#A99EFF!important;
            --primary:#A99EFF!important;--primary-hover:#BEB6FF!important;--primary-foreground:#232830!important;
            --ring:rgba(169,158,255,.28)!important;--shadow:5px 5px 10px #181D23,-5px -5px 10px #303742!important;
            --success:#8FD2B8!important;--info:#9ABFE2!important;--warning:#E1C779!important;--danger:#E1A0A5!important;
            --neu-base:#232830;--neu-shadow-dark:#15191F;--neu-shadow-light:#343B47;
            --neu-raised-dark:#181D23;--neu-raised-light:#303742;
            --neu-line:rgba(241,244,248,.10);--neu-line-strong:rgba(241,244,248,.16);--neu-overlay:rgba(5,7,11,.68);
            --neu-success-bg:#293A35;--neu-success-text:#8FD2B8;
            --neu-info-bg:#293541;--neu-info-text:#9ABFE2;
            --neu-warning-bg:#3A3425;--neu-warning-text:#E1C779;
            --neu-danger-bg:#3B2B2E;--neu-danger-text:#E1A0A5;
            color-scheme:dark!important;
          }
          html[data-urppp-skin="neu"] body,
          html[data-urppp-skin="neu"] .main-container,
          html[data-urppp-skin="neu"] .main-content,
          html[data-urppp-skin="neu"] .main-content-inner,
          html[data-urppp-skin="neu"] .page-content,
          html[data-urppp-skin="neu"] #page-content-template,
          html[data-urppp-skin="neu"] #urppp-clean-root,
          html[data-urppp-skin="neu"] #urppp-root{
            background:var(--neu-base)!important;background-image:none!important;color:var(--text)!important;
          }
          html[data-urppp-skin="neu"] #navbar,
          html[data-urppp-skin="neu"] .navbar{
            background:var(--neu-base)!important;border:0!important;border-radius:0!important;box-shadow:var(--neu-raised-sm)!important;
          }
          html[data-urppp-skin="neu"] #sidebar,
          html[data-urppp-skin="neu"] .sidebar{
            background:var(--neu-base)!important;border:0!important;border-radius:0 16px 16px 0!important;box-shadow:var(--neu-raised-sm)!important;
          }
          html[data-urppp-skin="neu"] .breadcrumbs,
          html[data-urppp-skin="neu"] #breadcrumbs{
            background:var(--neu-base)!important;border:0!important;border-radius:12px!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] .widget-box,
          html[data-urppp-skin="neu"] .panel,
          html[data-urppp-skin="neu"] .well,
          html[data-urppp-skin="neu"] .modal-content,
          html[data-urppp-skin="neu"] .urppp-card,
          html[data-urppp-skin="neu"] .urppp-stat-card,
          html[data-urppp-skin="neu"] .infobox,
          html[data-urppp-skin="neu"] #urppp-settings-panel,
          html[data-urppp-skin="neu"] #urppp-root .uc,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-card,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-modal{
            background:var(--neu-base)!important;border:0!important;border-radius:var(--radius)!important;box-shadow:var(--neu-raised)!important;
          }
          html[data-urppp-skin="neu"] #urppp-settings-panel,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-card{
            box-shadow:var(--neu-raised-sm)!important;
          }
          html[data-urppp-skin="neu"] .widget-header,
          html[data-urppp-skin="neu"] .panel-heading,
          html[data-urppp-skin="neu"] .urppp-card-header,
          html[data-urppp-skin="neu"] .modal-header,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-hd,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-modal-hd{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--neu-line)!important;border-radius:var(--radius) var(--radius) 0 0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .widget-main,
          html[data-urppp-skin="neu"] .panel-body,
          html[data-urppp-skin="neu"] .urppp-card-body,
          html[data-urppp-skin="neu"] .modal-body{
            background:transparent!important;border:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .urppp-card:hover{
            background:var(--neu-base)!important;border:0!important;box-shadow:var(--neu-raised)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-card:hover{
            background:var(--neu-base)!important;border:0!important;box-shadow:var(--neu-raised-sm)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-root .ut{
            background:var(--neu-base)!important;border:0!important;border-radius:var(--radius-sm)!important;box-shadow:var(--neu-inset)!important;
          }
          html[data-urppp-skin="neu"] .profile-user-info,
          html[data-urppp-skin="neu"] .profile-user-info-striped,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-course-sub,
          html[data-urppp-skin="neu"] #urppp-clean-root #uc-score-wrap{
            background:var(--neu-base)!important;border:0!important;border-radius:var(--radius-sm)!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] .profile-info-row,
          html[data-urppp-skin="neu"] .profile-info-name,
          html[data-urppp-skin="neu"] .profile-info-value{
            background:transparent!important;color:var(--text)!important;border-color:var(--neu-line)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .btn:not(.btn-app),
          html[data-urppp-skin="neu"] a.btn:not(.btn-app),
          html[data-urppp-skin="neu"] button.btn:not(.btn-app),
          html[data-urppp-skin="neu"] #urppp-nav-clean,
          html[data-urppp-skin="neu"] #urppp-root .ubtn,
          html[data-urppp-skin="neu"] #urppp-root .ut button,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-btn,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-tabbar button,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-build-grid button,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-btn,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-mode,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-follow,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-scheme,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-close,
          html[data-urppp-skin="neu"] .urppp-sidebar-toggle,
          html[data-urppp-skin="neu"] #urppp-nav-theme .urppp-nav-settings,
          html[data-urppp-skin="neu"] #urppp-update-toast .uut-btn,
          html[data-urppp-skin="neu"] #urppp-update-changelog .uut-btn,
          html[data-urppp-skin="neu"] #urppp-left .fc-button,
          html[data-urppp-skin="neu"] #urppp-left .fc-state-default{
            background:var(--neu-base)!important;color:var(--text)!important;border:0!important;border-radius:var(--radius-sm)!important;
            box-shadow:var(--neu-raised-sm)!important;transform:none!important;background-image:none!important;
            transition:box-shadow 280ms ease-in-out,color 280ms ease-in-out,opacity 280ms ease-in-out!important;
          }
          html[data-urppp-skin="neu"] .btn:not(.btn-app):hover,
          html[data-urppp-skin="neu"] a.btn:not(.btn-app):hover,
          html[data-urppp-skin="neu"] button.btn:not(.btn-app):hover,
          html[data-urppp-skin="neu"] #urppp-nav-clean:hover,
          html[data-urppp-skin="neu"] #urppp-root .ubtn:hover,
          html[data-urppp-skin="neu"] #urppp-root .ut button:hover,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-btn:hover,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-tabbar button:hover,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-build-grid button:hover,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-btn:hover:not(:disabled),
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-mode:hover:not(:disabled),
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-follow:hover:not(:disabled),
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-scheme:hover,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-close:hover,
          html[data-urppp-skin="neu"] .urppp-sidebar-toggle:hover,
          html[data-urppp-skin="neu"] #urppp-nav-theme .urppp-nav-settings:hover,
          html[data-urppp-skin="neu"] #urppp-update-toast .uut-btn:hover,
          html[data-urppp-skin="neu"] #urppp-update-changelog .uut-btn:hover,
          html[data-urppp-skin="neu"] #urppp-left .fc-button:hover{
            background:var(--neu-base)!important;color:var(--text)!important;box-shadow:var(--neu-hover)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .btn:not(.btn-app):active,
          html[data-urppp-skin="neu"] .btn:not(.btn-app).active,
          html[data-urppp-skin="neu"] #urppp-nav-clean:active,
          html[data-urppp-skin="neu"] #urppp-root .ubtn:active,
          html[data-urppp-skin="neu"] #urppp-root .ut button.ac,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-btn:active,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-tabbar button.ac,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-build-grid button.ac,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-mode.ac,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-follow.ac,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-scheme.ac,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-close:active,
          html[data-urppp-skin="neu"] .urppp-sidebar-toggle:active,
          html[data-urppp-skin="neu"] #urppp-nav-theme .urppp-nav-settings:active,
          html[data-urppp-skin="neu"] #urppp-update-toast .uut-btn:active,
          html[data-urppp-skin="neu"] #urppp-update-changelog .uut-btn:active,
          html[data-urppp-skin="neu"] #urppp-left .fc-state-active{
            background:var(--neu-base)!important;color:var(--primary)!important;border:0!important;box-shadow:var(--neu-inset)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .btn.btn-primary:not(.btn-app),
          html[data-urppp-skin="neu"] button.btn.btn-primary:not(.btn-app),
          html[data-urppp-skin="neu"] a.btn.btn-primary:not(.btn-app),
          html[data-urppp-skin="neu"] .btn.btn-info:not(.btn-app),
          html[data-urppp-skin="neu"] button.btn.btn-info:not(.btn-app),
          html[data-urppp-skin="neu"] a.btn.btn-info:not(.btn-app),
          html[data-urppp-skin="neu"] #urppp-root .ubtn,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-btn.primary,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-btn:not(.ghost),
          html[data-urppp-skin="neu"] #urppp-update-toast .uut-btn.primary,
          html[data-urppp-skin="neu"] #urppp-update-changelog .uut-btn.primary{
            background:var(--neu-base)!important;color:var(--primary)!important;border:0!important;box-shadow:var(--neu-raised-sm)!important;
          }
          html[data-urppp-skin="neu"] .btn.btn-success,
          html[data-urppp-skin="neu"] button.btn.btn-success,
          html[data-urppp-skin="neu"] a.btn.btn-success{background:var(--neu-base)!important;color:var(--success)!important;border:0!important;box-shadow:var(--neu-raised-sm)!important;}
          html[data-urppp-skin="neu"] .btn.btn-warning,
          html[data-urppp-skin="neu"] button.btn.btn-warning,
          html[data-urppp-skin="neu"] a.btn.btn-warning{background:var(--neu-base)!important;color:var(--warning)!important;border:0!important;box-shadow:var(--neu-raised-sm)!important;}
          html[data-urppp-skin="neu"] .btn.btn-danger,
          html[data-urppp-skin="neu"] button.btn.btn-danger,
          html[data-urppp-skin="neu"] a.btn.btn-danger{background:var(--neu-base)!important;color:var(--danger)!important;border:0!important;box-shadow:var(--neu-raised-sm)!important;}
          html[data-urppp-skin="neu"] .btn.btn-primary:not(.btn-app):hover,
          html[data-urppp-skin="neu"] .btn.btn-info:not(.btn-app):hover,
          html[data-urppp-skin="neu"] #urppp-root .ubtn:hover,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-btn.primary:hover,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-btn:not(.ghost):hover,
          html[data-urppp-skin="neu"] #urppp-update-toast .uut-btn.primary:hover,
          html[data-urppp-skin="neu"] #urppp-update-changelog .uut-btn.primary:hover{
            background:var(--neu-base)!important;color:var(--primary)!important;box-shadow:var(--neu-hover)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .btn.btn-primary:not(.btn-app):active,
          html[data-urppp-skin="neu"] .btn.btn-info:not(.btn-app):active,
          html[data-urppp-skin="neu"] #urppp-root .ubtn:active,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-btn.primary:active,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-btn:not(.ghost):active,
          html[data-urppp-skin="neu"] #urppp-update-toast .uut-btn.primary:active,
          html[data-urppp-skin="neu"] #urppp-update-changelog .uut-btn.primary:active{
            background:var(--neu-base)!important;color:var(--primary)!important;box-shadow:var(--neu-inset)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .btn.btn-success:hover,
          html[data-urppp-skin="neu"] button.btn.btn-success:hover,
          html[data-urppp-skin="neu"] a.btn.btn-success:hover,
          html[data-urppp-skin="neu"] .btn.btn-warning:hover,
          html[data-urppp-skin="neu"] button.btn.btn-warning:hover,
          html[data-urppp-skin="neu"] a.btn.btn-warning:hover,
          html[data-urppp-skin="neu"] .btn.btn-danger:hover,
          html[data-urppp-skin="neu"] button.btn.btn-danger:hover,
          html[data-urppp-skin="neu"] a.btn.btn-danger:hover{background:var(--neu-base)!important;box-shadow:var(--neu-hover)!important;transform:none!important;}
          html[data-urppp-skin="neu"] .btn.btn-success:hover,
          html[data-urppp-skin="neu"] button.btn.btn-success:hover,
          html[data-urppp-skin="neu"] a.btn.btn-success:hover{color:var(--success)!important;}
          html[data-urppp-skin="neu"] .btn.btn-warning:hover,
          html[data-urppp-skin="neu"] button.btn.btn-warning:hover,
          html[data-urppp-skin="neu"] a.btn.btn-warning:hover{color:var(--warning)!important;}
          html[data-urppp-skin="neu"] .btn.btn-danger:hover,
          html[data-urppp-skin="neu"] button.btn.btn-danger:hover,
          html[data-urppp-skin="neu"] a.btn.btn-danger:hover{color:var(--danger)!important;}
          html[data-urppp-skin="neu"] .btn.btn-success:active,
          html[data-urppp-skin="neu"] button.btn.btn-success:active,
          html[data-urppp-skin="neu"] a.btn.btn-success:active,
          html[data-urppp-skin="neu"] button.btn.btn-success.active,
          html[data-urppp-skin="neu"] a.btn.btn-success.active,
          html[data-urppp-skin="neu"] .btn.btn-warning:active,
          html[data-urppp-skin="neu"] button.btn.btn-warning:active,
          html[data-urppp-skin="neu"] a.btn.btn-warning:active,
          html[data-urppp-skin="neu"] button.btn.btn-warning.active,
          html[data-urppp-skin="neu"] a.btn.btn-warning.active,
          html[data-urppp-skin="neu"] .btn.btn-danger:active,
          html[data-urppp-skin="neu"] button.btn.btn-danger:active,
          html[data-urppp-skin="neu"] a.btn.btn-danger:active,
          html[data-urppp-skin="neu"] button.btn.btn-danger.active,
          html[data-urppp-skin="neu"] a.btn.btn-danger.active{background:var(--neu-base)!important;box-shadow:var(--neu-inset)!important;transform:none!important;}
          html[data-urppp-skin="neu"] .btn.btn-success:active,
          html[data-urppp-skin="neu"] button.btn.btn-success:active,
          html[data-urppp-skin="neu"] a.btn.btn-success:active,
          html[data-urppp-skin="neu"] .btn.btn-success.active,
          html[data-urppp-skin="neu"] button.btn.btn-success.active,
          html[data-urppp-skin="neu"] a.btn.btn-success.active{color:var(--success)!important;}
          html[data-urppp-skin="neu"] .btn.btn-warning:active,
          html[data-urppp-skin="neu"] button.btn.btn-warning:active,
          html[data-urppp-skin="neu"] a.btn.btn-warning:active,
          html[data-urppp-skin="neu"] .btn.btn-warning.active,
          html[data-urppp-skin="neu"] button.btn.btn-warning.active,
          html[data-urppp-skin="neu"] a.btn.btn-warning.active{color:var(--warning)!important;}
          html[data-urppp-skin="neu"] .btn.btn-danger:active,
          html[data-urppp-skin="neu"] button.btn.btn-danger:active,
          html[data-urppp-skin="neu"] a.btn.btn-danger:active,
          html[data-urppp-skin="neu"] .btn.btn-danger.active,
          html[data-urppp-skin="neu"] button.btn.btn-danger.active,
          html[data-urppp-skin="neu"] a.btn.btn-danger.active{color:var(--danger)!important;}
          html[data-urppp-skin="neu"] button:disabled,
          html[data-urppp-skin="neu"] .btn.disabled,
          html[data-urppp-skin="neu"] .urppp-theme-disabled{
            background:var(--neu-base)!important;color:var(--text-muted)!important;box-shadow:none!important;opacity:.48!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] input.form-control,
          html[data-urppp-skin="neu"] select.form-control,
          html[data-urppp-skin="neu"] textarea.form-control,
          html[data-urppp-skin="neu"] input[type="text"],
          html[data-urppp-skin="neu"] input[type="search"],
          html[data-urppp-skin="neu"] input[type="number"],
          html[data-urppp-skin="neu"] input[type="password"],
          html[data-urppp-skin="neu"] input[type="email"],
          html[data-urppp-skin="neu"] input[type="tel"],
          html[data-urppp-skin="neu"] input[type="url"],
          html[data-urppp-skin="neu"] select,
          html[data-urppp-skin="neu"] textarea,
          html[data-urppp-skin="neu"] #form-search .nav-search-input,
          html[data-urppp-skin="neu"] #urppp-root .ui,
          html[data-urppp-skin="neu"] .chosen-container-single .chosen-single,
          html[data-urppp-skin="neu"] .chosen-container-multi .chosen-choices{
            background:var(--neu-base)!important;color:var(--text)!important;border:0!important;border-radius:var(--radius-sm)!important;
            box-shadow:var(--neu-inset)!important;background-image:none!important;
            transition:box-shadow 280ms ease-in-out,outline-color 280ms ease-in-out!important;
          }
          html[data-urppp-skin="neu"] input::placeholder,
          html[data-urppp-skin="neu"] textarea::placeholder{color:var(--text-muted)!important;opacity:1!important;}
          html[data-urppp-skin="neu"] input.form-control:focus,
          html[data-urppp-skin="neu"] select.form-control:focus,
          html[data-urppp-skin="neu"] textarea.form-control:focus,
          html[data-urppp-skin="neu"] input[type="text"]:focus,
          html[data-urppp-skin="neu"] input[type="search"]:focus,
          html[data-urppp-skin="neu"] input[type="number"]:focus,
          html[data-urppp-skin="neu"] input[type="password"]:focus,
          html[data-urppp-skin="neu"] #urppp-root .ui:focus,
          html[data-urppp-skin="neu"] .chosen-container-active .chosen-single{
            border:0!important;box-shadow:var(--neu-inset-deep)!important;outline:2px solid var(--primary)!important;outline-offset:2px!important;
          }
          html[data-urppp-skin="neu"] .dropdown-menu,
          html[data-urppp-skin="neu"] .popover,
          html[data-urppp-skin="neu"] .chosen-container .chosen-drop,
          html[data-urppp-skin="neu"] .select2-drop,
          html[data-urppp-skin="neu"] #urppp-update-toast,
          html[data-urppp-skin="neu"] #urppp-update-changelog .uuc-panel{
            background:var(--neu-base)!important;color:var(--text)!important;border:0!important;border-radius:var(--radius)!important;box-shadow:var(--neu-raised)!important;
          }
          html[data-urppp-skin="neu"] .dropdown-menu>li>a,
          html[data-urppp-skin="neu"] .chosen-container .chosen-results li{
            background:transparent!important;color:var(--text)!important;border-radius:8px!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .dropdown-menu>li>a:hover,
          html[data-urppp-skin="neu"] .chosen-container .chosen-results li.highlighted,
          html[data-urppp-skin="neu"] .chosen-container .chosen-results li.result-selected{
            background:color-mix(in srgb,var(--primary) 5%,var(--neu-base))!important;color:var(--primary)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-settings-mask,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-mask,
          html[data-urppp-skin="neu"] #urppp-update-changelog.open{
            background:var(--neu-overlay)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
          }
          html[data-urppp-skin="neu"] .urppp-table-wrap,
          html[data-urppp-skin="neu"] .table-responsive{
            background:var(--neu-base)!important;border:0!important;border-radius:var(--radius)!important;box-shadow:var(--neu-raised-sm)!important;
          }
          html[data-urppp-skin="neu"] .table,
          html[data-urppp-skin="neu"] table,
          html[data-urppp-skin="neu"] .table-bordered,
          html[data-urppp-skin="neu"] .dataTable{
            background:transparent!important;border:0!important;border-collapse:collapse!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .table>thead>tr>th,
          html[data-urppp-skin="neu"] .table>thead>tr>td,
          html[data-urppp-skin="neu"] .table-bordered>thead>tr>th,
          html[data-urppp-skin="neu"] .dataTable>thead>tr>th{
            background:var(--neu-base)!important;color:var(--text-secondary)!important;border:0!important;
            border-bottom:1px solid var(--neu-line-strong)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .table>tbody>tr>td,
          html[data-urppp-skin="neu"] .table>tbody>tr>th,
          html[data-urppp-skin="neu"] .table-bordered>tbody>tr>td,
          html[data-urppp-skin="neu"] .dataTable>tbody>tr>td{
            background:transparent!important;color:var(--text)!important;border:0!important;border-bottom:1px solid var(--neu-line)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .table-hover>tbody>tr:hover>td,
          html[data-urppp-skin="neu"] .table>tbody>tr:hover>td,
          html[data-urppp-skin="neu"] .dataTable>tbody>tr:hover>td{
            background:color-mix(in srgb,var(--primary) 5%,var(--neu-base))!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] body .table>tbody>tr>td.green_background,
          html[data-urppp-skin="neu"] body .table-bordered>tbody>tr>td.green_background,
          html[data-urppp-skin="neu"] body .table-hover>tbody>tr:hover>td.green_background,
          html[data-urppp-skin="neu"] body .dataTable>tbody>tr>td.green_background,
          html[data-urppp-skin="neu"] body td.green_background,
          html[data-urppp-skin="neu"] body .green_background{
            background:var(--neu-success-bg)!important;color:var(--neu-success-text)!important;
          }
          html[data-urppp-skin="neu"] body .table>tbody>tr>td.red_background,
          html[data-urppp-skin="neu"] body .table-bordered>tbody>tr>td.red_background,
          html[data-urppp-skin="neu"] body .table-hover>tbody>tr:hover>td.red_background,
          html[data-urppp-skin="neu"] body .dataTable>tbody>tr>td.red_background,
          html[data-urppp-skin="neu"] body td.red_background,
          html[data-urppp-skin="neu"] body .red_background{
            background:var(--neu-danger-bg)!important;color:var(--neu-danger-text)!important;
          }
          html[data-urppp-skin="neu"] .alert{
            background:var(--neu-base)!important;border:0!important;border-left:4px solid currentColor!important;
            border-radius:var(--radius-sm)!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] .alert-success{color:var(--success)!important;}
          html[data-urppp-skin="neu"] .alert-info{color:var(--info)!important;}
          html[data-urppp-skin="neu"] .alert-warning{color:var(--warning)!important;}
          html[data-urppp-skin="neu"] .alert-danger{color:var(--danger)!important;}
          html[data-urppp-skin="neu"] .label,
          html[data-urppp-skin="neu"] .badge{
            background:var(--neu-base)!important;color:var(--text)!important;border:0!important;border-radius:10px!important;box-shadow:var(--neu-raised-xs)!important;
          }
          html[data-urppp-skin="neu"] .label-success,html[data-urppp-skin="neu"] .badge-success{color:var(--success)!important;}
          html[data-urppp-skin="neu"] .label-info,html[data-urppp-skin="neu"] .badge-info{color:var(--info)!important;}
          html[data-urppp-skin="neu"] .label-warning,html[data-urppp-skin="neu"] .badge-warning{color:var(--warning)!important;}
          html[data-urppp-skin="neu"] .label-danger,html[data-urppp-skin="neu"] .badge-danger{color:var(--danger)!important;}
          html[data-urppp-skin="neu"] #urppp-dashboard .urppp-stats-grid,
          html[data-urppp-skin="neu"] #urppp-dashboard .urppp-main-grid{
            gap:24px!important;
          }
          html[data-urppp-skin="neu"] #urppp-dashboard .urppp-stat-card{
            background:var(--neu-base)!important;border:0!important;box-shadow:var(--neu-raised-sm)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-dashboard .urppp-stat-card:hover{
            box-shadow:var(--neu-hover)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-dashboard .urppp-stat-card:active{
            box-shadow:var(--neu-inset)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-dashboard .urppp-stat-card .label{
            background:transparent!important;color:var(--text-secondary)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] body table.urppp-notice-table>tbody>tr,
          html[data-urppp-skin="neu"] body table.urppp-notice-table.table-striped>tbody>tr:nth-of-type(odd),
          html[data-urppp-skin="neu"] body table.urppp-notice-table.table-striped>tbody>tr:nth-of-type(even),
          html[data-urppp-skin="neu"] body .urppp-notice-card{
            background:transparent!important;background-color:transparent!important;border:0!important;
            border-bottom:1px solid var(--neu-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] body table.urppp-notice-table>tbody>tr.urppp-notice-row:hover,
          html[data-urppp-skin="neu"] body table.urppp-notice-table>tbody>tr.urppp-notice-row.hover{
            background:color-mix(in srgb,var(--primary) 5%,var(--neu-base))!important;
            background-color:color-mix(in srgb,var(--primary) 5%,var(--neu-base))!important;
          }
          html[data-urppp-skin="neu"] .btn-app,
          html[data-urppp-skin="neu"] .btn.btn-app,
          html[data-urppp-skin="neu"] #urppp-dashboard .btn-app,
          html[data-urppp-skin="neu"] #personalApplication .btn-app{
            background:var(--neu-base)!important;color:var(--text)!important;border:0!important;border-radius:var(--radius)!important;
            box-shadow:var(--neu-raised-sm)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .btn-app:hover,
          html[data-urppp-skin="neu"] #urppp-dashboard .btn-app:hover,
          html[data-urppp-skin="neu"] #personalApplication .btn-app:hover{
            background:var(--neu-base)!important;color:var(--primary)!important;box-shadow:var(--neu-hover)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .btn-app:active,
          html[data-urppp-skin="neu"] #urppp-dashboard .btn-app:active,
          html[data-urppp-skin="neu"] #personalApplication .btn-app:active{
            background:var(--neu-base)!important;color:var(--primary)!important;box-shadow:var(--neu-inset)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .nav-list>li>a,
          html[data-urppp-skin="neu"] .urppp-nav-link{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;border-radius:12px!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .nav-list>li>a:hover,
          html[data-urppp-skin="neu"] .urppp-nav-link:hover{
            background:var(--neu-base)!important;color:var(--text)!important;box-shadow:var(--neu-raised-xs)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] .nav-list>li.active>a,
          html[data-urppp-skin="neu"] .urppp-nav-item.active>.urppp-nav-link,
          html[data-urppp-skin="neu"] .urppp-nav-item.open>.urppp-nav-link{
            background:var(--neu-base)!important;color:var(--primary)!important;border-left:3px solid var(--primary)!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] .pagination>li>a,
          html[data-urppp-skin="neu"] .pagination>li>span,
          html[data-urppp-skin="neu"] .urppp-page-chip{
            background:var(--neu-base)!important;color:var(--text)!important;border:0!important;border-radius:10px!important;box-shadow:var(--neu-raised-xs)!important;
          }
          html[data-urppp-skin="neu"] .pagination>li.active>a,
          html[data-urppp-skin="neu"] .pagination>li.active>span,
          html[data-urppp-skin="neu"] .urppp-page-chip-active{
            background:var(--neu-base)!important;color:var(--primary)!important;border:0!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] #courseTable,
          html[data-urppp-skin="neu"] #urppp-left .fc,
          html[data-urppp-skin="neu"] #urppp-left #main-calendar,
          html[data-urppp-skin="neu"] #urppp-left .fc-view{
            background:transparent!important;border:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #courseTable th,
          html[data-urppp-skin="neu"] #urppp-left .fc-widget-header{
            background:var(--neu-base)!important;color:var(--text-secondary)!important;border-color:var(--neu-line)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-left .fc-bg,
          html[data-urppp-skin="neu"] #urppp-left .fc-bg table,
          html[data-urppp-skin="neu"] #urppp-left .fc-bg td,
          html[data-urppp-skin="neu"] #urppp-left .fc-bg th,
          html[data-urppp-skin="neu"] #urppp-left .fc-slats td,
          html[data-urppp-skin="neu"] #urppp-left .fc-axis{
            background:var(--neu-base)!important;background-color:var(--neu-base)!important;
          }
          html[data-urppp-skin="neu"] #urppp-left .fc-today{
            background:color-mix(in srgb,var(--neu-shadow-dark) 8%,var(--neu-base))!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #courseTable td,
          html[data-urppp-skin="neu"] #urppp-left .fc-widget-content{
            background:transparent!important;color:var(--text)!important;border-color:var(--neu-line)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #courseTable .class_div.box_font,
          html[data-urppp-skin="neu"] #courseTable div[class*="div-kcb"],
          html[data-urppp-skin="neu"] #urppp-left .fc-event{
            border-radius:10px!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-left .fc-toolbar h2{
            background:var(--neu-base)!important;color:var(--text)!important;border:0!important;border-radius:var(--radius-sm)!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-head,
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-tabs,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-top,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-tabbar{
            background:var(--neu-base)!important;border:0!important;border-radius:var(--radius)!important;box-shadow:var(--neu-raised-sm)!important;
          }
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-tab{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;border-radius:10px!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-tab:hover{
            color:var(--text)!important;box-shadow:var(--neu-raised-xs)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-tab.ac{
            background:var(--neu-base)!important;color:var(--primary)!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html.urppp-theme-default[data-urppp-skin="neu"]:not(.urppp-theme-follow) body #urppp-settings-panel .urppp-set-mode[data-theme="default"],
          html.urppp-theme-dark[data-urppp-skin="neu"]:not(.urppp-theme-follow) body #urppp-settings-panel .urppp-set-mode[data-theme="dark"]{
            background:var(--neu-base)!important;color:var(--primary)!important;border:0!important;box-shadow:var(--neu-inset)!important;
          }
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-tab.ac::after{display:none!important;}
          html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-set-sec{
            border-color:var(--neu-line)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-shell-inner{
            padding:10px!important;box-sizing:border-box!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-desktop,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-col{
            gap:20px!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-grid{gap:16px!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-services{gap:12px!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-avatar,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-gpa,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-grid-cell,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-pane,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-svc,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-metric{
            background:var(--neu-base)!important;border:0!important;border-radius:var(--radius-sm)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-avatar,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-pane,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-svc{
            box-shadow:var(--neu-raised-sm)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-gpa,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-grid-cell,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-metric{
            box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-pane:hover,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-svc:hover{
            background:var(--neu-base)!important;border:0!important;box-shadow:var(--neu-hover)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-pane:active,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-svc:active{
            box-shadow:var(--neu-inset)!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-lesson{
            border-radius:10px!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-course-sub{
            background:var(--neu-base)!important;border:0!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-cd-chip,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-attr-pill{
            background:var(--neu-base)!important;color:var(--text-secondary)!important;border:0!important;border-radius:10px!important;box-shadow:var(--neu-raised-xs)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-cell{
            border:0!important;border-left:3px solid currentColor!important;border-radius:8px!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-cell.pass{background:var(--neu-success-bg)!important;color:var(--neu-success-text)!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-cell.fail{background:var(--neu-danger-bg)!important;color:var(--neu-danger-text)!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-cell.uneval{background:var(--neu-info-bg)!important;color:var(--neu-info-text)!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-cell.uneval-fail{background:var(--neu-warning-bg)!important;color:var(--neu-warning-text)!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root table.uc-table th,
          html[data-urppp-skin="neu"] #urppp-clean-root table.uc-table td{
            background:transparent!important;color:var(--text)!important;border:0!important;border-bottom:1px solid var(--neu-line)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root table.uc-table thead th{
            background:var(--neu-base)!important;color:var(--text-secondary)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root table.uc-table tbody tr:nth-child(even) td{background:transparent!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root table.uc-table tbody tr:hover td{background:color-mix(in srgb,var(--primary) 5%,var(--neu-base))!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root table.uc-table tbody tr.is-on td{background:color-mix(in srgb,var(--primary) 9%,var(--neu-base))!important;}
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-occ-table th{
            background:var(--neu-base)!important;color:var(--text-secondary)!important;box-shadow:var(--neu-inset-soft)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-slot,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-legend i{
            border-radius:8px!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-slot.free{
            background:var(--neu-base)!important;border-color:var(--neu-line-strong)!important;color:var(--text-muted)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-slot.kind-course,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-slot.busy{
            background:var(--neu-info-bg)!important;border-color:var(--info)!important;color:var(--neu-info-text)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-slot.kind-exam{
            background:var(--neu-danger-bg)!important;border-color:var(--danger)!important;color:var(--neu-danger-text)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-slot.kind-lab{
            background:var(--neu-warning-bg)!important;border-color:var(--warning)!important;color:var(--neu-warning-text)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-slot.kind-borrow{
            background:var(--neu-success-bg)!important;border-color:var(--success)!important;color:var(--neu-success-text)!important;
          }
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-modal-ft{
            background:transparent!important;border:0!important;border-top:1px solid var(--neu-line)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="neu"] .urppp-nav-dot,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,
          html[data-urppp-skin="neu"] #urppp-dots span{
            border:0!important;border-radius:50%!important;box-shadow:var(--neu-raised-xs)!important;
          }
          html[data-urppp-skin="neu"] .urppp-nav-dot.ac,
          html[data-urppp-skin="neu"] #urppp-nav-theme .urppp-nav-dot.ac,
          html[data-urppp-skin="neu"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{
            border:0!important;box-shadow:var(--neu-inset-soft),0 0 0 2px var(--primary)!important;
          }
          html[data-urppp-skin="neu"] a:focus-visible,
          html[data-urppp-skin="neu"] button:focus-visible,
          html[data-urppp-skin="neu"] [tabindex]:focus-visible{
            outline:2px solid var(--primary)!important;outline-offset:3px!important;
          }
          html[data-urppp-skin="neu"] #urppp-update-changelog .uuc-head{
            background:var(--neu-base)!important;border-bottom-color:var(--neu-line)!important;
          }
          html[data-urppp-skin="neu"] #urppp-update-changelog .uuc-body code{
            background:var(--neu-base)!important;border:0!important;border-radius:8px!important;box-shadow:var(--neu-inset-soft)!important;
          }
          @media (max-width:900px){
            html[data-urppp-skin="neu"] #sidebar,
            html[data-urppp-skin="neu"] .sidebar{border-radius:0 12px 12px 0!important;}
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-shell{padding:16px 14px 90px!important;overflow-x:hidden!important;}
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-desktop,
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-col{gap:18px!important;}
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-grid,
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-services{gap:10px!important;}
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-card,
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-score-pane,
            html[data-urppp-skin="neu"] #urppp-clean-root .uc-svc{box-shadow:var(--neu-raised-sm)!important;}
          }
          @media (prefers-reduced-motion:reduce){
            html[data-urppp-skin="neu"] *,
            html[data-urppp-skin="neu"] *::before,
            html[data-urppp-skin="neu"] *::after{transition:none!important;animation-duration:.01ms!important;}
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
    const hit = SKIN_CATALOG.find((s) => s.id === id && s.ready);
    if (!hit) return false;
    GM_setValue(SKIN_KEY, hit.id);
    try {
      if (!hit.dynamic) setFollowUseDynamic(false);
      if (!hit.dark && isThemeFollowSystem()) setThemeFollowSystem(false);
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

  // 面包屑：恢复显示并清洗/重建路径
  function cleanMenuLabel(raw) {
    return String(raw || '')
      .replace(/[\u00a0\s]+/g, ' ')
      .replace(/^[>\u25b8\u203a·•\u00bb]+/, '')
      .replace(/^\s*[\u25b8>]\s*/, '')
      .trim();
  }

  function getMenuLiLabel(li) {
    if (!li) return '';
    const a = li.querySelector(':scope > a');
    if (!a) return '';
    const textEl = a.querySelector('.menu-text, .urppp-nav-text');
    if (textEl) return cleanMenuLabel(textEl.textContent);
    // 去掉图标后的纯文本
    const clone = a.cloneNode(true);
    clone.querySelectorAll('i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow').forEach(n => n.remove());
    return cleanMenuLabel(clone.textContent);
  }

  function walkMenuAncestors(li) {
    const stack = [];
    let node = li;
    const root = document.getElementById('menus') || document.getElementById('urppp-menus');
    while (node && node !== root) {
      if (node.tagName === 'LI') {
        const label = getMenuLiLabel(node);
        if (label && !/^(首页|一级菜单|二级菜单|三级菜单)$/.test(label)) {
          stack.unshift(label);
        }
      }
      node = node.parentElement;
    }
    // 去重相邻
    return stack.filter((t, i) => t && t !== stack[i - 1]);
  }

  function findMenuLiByPath() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const search = location.search || '';
    const candidates = [];
    const roots = [document.getElementById('menus'), document.getElementById('urppp-menus')].filter(Boolean);
    roots.forEach(root => {
      root.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (!href || href === '#' || href.startsWith('javascript')) return;
        try {
          const u = new URL(href, location.origin);
          const p = u.pathname.replace(/\/+$/, '') || '/';
          if (p === '/' && path !== '/') return;
          let score = 0;
          if (path === p) score = 1000 + p.length;
          else if (path.startsWith(p + '/')) score = 500 + p.length;
          else if (path.includes(p) && p.length > 8) score = 200 + p.length;
          if (score && search && u.search && search.indexOf(u.search.slice(1)) >= 0) score += 50;
          if (score > 0) candidates.push({ score, li: a.closest('li') });
        } catch (_) {}
      });
    });
    candidates.sort((a, b) => b.score - a.score);
    return candidates.length ? candidates[0].li : null;
  }

  function getBreadcrumbTrail() {
    // 1) 当前 URL 匹配菜单（最稳）
    const byPath = findMenuLiByPath();
    if (byPath) {
      const t = walkMenuAncestors(byPath);
      if (t.length) return t;
    }

    // 2) cookie selectionBar + 原始 #menus
    let bar = '';
    try {
      const m = document.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);
      if (m) bar = decodeURIComponent(m[1]);
    } catch (_) {}
    if (bar && bar !== '0') {
      const node = document.getElementById(bar);
      if (node) {
        const t = walkMenuAncestors(node);
        if (t.length) return t;
      }
    }

    // 3) 原始 #menus / #urppp-menus 上的 .active
    let activeLi = null;
    const menuActives = Array.from(document.querySelectorAll('#menus li.active'));
    if (menuActives.length) {
      activeLi = menuActives[menuActives.length - 1];
      for (let i = menuActives.length - 1; i >= 0; i--) {
        if (!menuActives[i].querySelector('li.active')) { activeLi = menuActives[i]; break; }
      }
    }
    if (!activeLi) {
      const urpActives = Array.from(document.querySelectorAll('#urppp-menus .urppp-nav-item.active'));
      if (urpActives.length) {
        activeLi = urpActives[urpActives.length - 1];
        for (let i = urpActives.length - 1; i >= 0; i--) {
          if (!urpActives[i].querySelector('.urppp-nav-item.active')) { activeLi = urpActives[i]; break; }
        }
      }
    }
    if (activeLi) {
      const t = walkMenuAncestors(activeLi);
      if (t.length) return t;
    }

    // 4) 已有 DOM（ACE 可能已填）
    const box = document.getElementById('breadcrumbs') || document.querySelector('.breadcrumbs');
    const ul = box && (box.querySelector('ul.breadcrumb') || box.querySelector('.breadcrumb'));
    if (ul) {
      const trail = [];
      Array.from(ul.children).forEach((li, idx) => {
        if (idx === 0) return;
        const t = cleanMenuLabel(li.textContent);
        if (!t || /^(首页|一级菜单|二级菜单|三级菜单)$/.test(t)) return;
        if (trail[trail.length - 1] === t) return;
        trail.push(t);
      });
      if (trail.length) return trail;
    }
    return [];
  }

  function beautifyBreadcrumbs() {
    const box = document.getElementById('breadcrumbs') || document.querySelector('.breadcrumbs');
    if (!box) return;
    box.classList.remove('hide');
    box.style.removeProperty('display');
    box.style.setProperty('display', 'flex', 'important');

    let ul = box.querySelector('ul.breadcrumb') || box.querySelector('.breadcrumb');
    if (!ul) {
      ul = document.createElement('ul');
      ul.className = 'breadcrumb';
      box.appendChild(ul);
    }

    const trail = getBreadcrumbTrail();
    // trail 为空时不覆盖已有真实路径，避免和 ACE 竞态把内容清空
    if (!trail.length) {
      const existing = Array.from(ul.children).map(li => cleanMenuLabel(li.textContent)).filter(Boolean);
      const hasReal = existing.some(t => t !== '首页' && !/^(一级菜单|二级菜单|三级菜单)$/.test(t));
      if (hasReal) return;
    }

    ul.innerHTML = '';

    const home = document.createElement('li');
    home.style.cursor = 'pointer';
    home.innerHTML = '<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>';
    home.addEventListener('click', () => { window.location.href = '/'; });
    ul.appendChild(home);

    trail.forEach((label, i) => {
      const li = document.createElement('li');
      const isLast = i === trail.length - 1;
      if (isLast) li.classList.add('active');
      const span = document.createElement('span');
      span.className = 'urppp-bc-label';
      span.textContent = label;
      li.appendChild(span);
      ul.appendChild(li);
    });
  }
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
    delays.forEach((ms) => setTimeout(() => { ensureQueryChosen(); }, ms));
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const ok = ensureQueryChosen();
      // jQuery/chosen 就绪后多试几次，不必无限跑
      if ((ok && tries > 3) || tries > 15) clearInterval(timer);
    }, 500);
  }

  // 空闲教室：楼栋列表轻量标记（校区标题 / 楼栋项 / 当前高亮）

  // 分页条：urp.pagebar 注入后常带 absolute/float，强制流式防重叠
  // 分页：基于 pagination.js 真实结构
  // ul.pagination > li.paginate_button > span(padding:3px 7px)
  // 当前页: li.active；确定: #btn_turnpageto_* (absolute, focus 才 display)
  function beautifyPagebar(root) {
    try {
      const bars = (root && root.querySelectorAll)
        ? root.querySelectorAll('#urppagebar')
        : document.querySelectorAll('#urppagebar');
      bars.forEach((bar) => {
        if (!bar) return;
        bar.classList.add('urppp-pagebar');

        // 容器：不要写 line-height:36，会把「共x条」撑成竖排碎字
        bar.style.setProperty('display', 'block', 'important');
        bar.style.setProperty('width', '100%', 'important');
        bar.style.setProperty('line-height', '1.5', 'important');
        const wrap = bar.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]') || bar;

        // 默认按「滚动/无页码」安全布局处理，避免重建瞬间误判成跳转页：
        // 误判会套 flex，把「第 / 输入 / 页」拆成三行，并在左右之间闪。
        // 只有明确「转到」+ 非 readonly + pageSize 无 _ 才走跳转美化。
        const pageTxt = Array.from(bar.querySelectorAll('[id^="span_page_txt_"]'))
          .map((el) => String(el.textContent || '').trim()).join('');
        const pageSizeSel = bar.querySelector('select[id^="pagination_pageSize_"]');
        const pageSizeVal = pageSizeSel ? String(pageSizeSel.value || '') : '';
        const jumpInp = bar.querySelector('[id^="turnpageto_"]');
        const jumpReadonly = !!(jumpInp && (jumpInp.readOnly || jumpInp.hasAttribute('readonly')));
        const isJumpMode =
          pageTxt.indexOf('转到') >= 0 &&
          !jumpReadonly &&
          pageSizeVal.indexOf('_') < 0;

        if (!isJumpMode) {
          bar.classList.add('urppp-pagebar-scroll');
          bar.classList.remove('urppp-pagebar-jump');
          bar.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach((ul) => {
            ul.style.setProperty('display', 'none', 'important');
          });
          // 拆掉误挂的 Chosen，恢复原生 select
          bar.querySelectorAll('select').forEach((sel) => {
            destroyPagebarChosen(sel);
            sel.style.setProperty('width', '128px', 'important');
            sel.style.setProperty('min-width', '128px', 'important');
            sel.style.setProperty('max-width', '128px', 'important');
          });
          bar.querySelectorAll('.chosen-container').forEach((c) => {
            try { c.style.setProperty('display', 'none', 'important'); } catch (_) { /* ignore */ }
          });
          return;
        }
        bar.classList.add('urppp-pagebar-jump');
        bar.classList.remove('urppp-pagebar-scroll');

        wrap.style.setProperty('display', 'flex', 'important');
        wrap.style.setProperty('align-items', 'center', 'important');
        wrap.style.setProperty('flex-wrap', 'wrap', 'important');
        wrap.style.setProperty('gap', '8px', 'important');
        wrap.style.setProperty('position', 'relative', 'important');
        wrap.style.setProperty('line-height', '1.5', 'important');

        // ul.pagination
        bar.querySelectorAll('ul.pagination').forEach((ul) => {
          ul.classList.add('urppp-pagination');
          ul.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'flex-wrap:wrap !important',
            'gap:4px !important',
            'margin:0 !important',
            'padding:0 !important',
            'list-style:none !important',
            'float:none !important',
            'position:static !important'
          ].join(';');
        });

        // 每个 li.paginate_button 是整颗按钮；内层 span 铺满且无边框
        bar.querySelectorAll('ul.pagination > li').forEach((li) => {
          const active = li.classList.contains('active');
          const disabled = li.classList.contains('disabled');
          const prev = li.classList.contains('previous') || /previous/i.test(li.getAttribute('name') || '');
          const next = li.classList.contains('next') || /next/i.test(li.getAttribute('name') || '');
          li.classList.add('urppp-page-li');
          if (active) li.classList.add('urppp-page-li-active');
          if (disabled) li.classList.add('urppp-page-li-disabled');
          if (prev) li.classList.add('urppp-page-li-prev');
          if (next) li.classList.add('urppp-page-li-next');

          li.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'justify-content:center !important',
            'float:none !important',
            'position:static !important',
            'margin:0 !important',
            'padding:0 !important',
            'list-style:none !important',
            'border:none !important',
            'background:transparent !important',
            'height:auto !important',
            'min-height:0 !important'
          ].join(';');

          const span = li.querySelector(':scope > span, :scope > a') || li.firstElementChild;
          if (!span) return;
          span.classList.add('urppp-page-chip');
          if (active) span.classList.add('urppp-page-chip-active');
          if (disabled) span.classList.add('urppp-page-chip-disabled');
          if (prev || next) span.classList.add('urppp-page-chip-nav');

          const minW = (prev || next) ? '72px' : '40px';
          const bg = active ? 'var(--pagination-active-bg, var(--primary))' : 'var(--surface)';
          const bd = active ? 'var(--pagination-active-border, var(--primary))' : 'var(--border)';
          const fg = active ? 'var(--pagination-active-foreground, var(--primary-foreground, #fff))' : (disabled ? 'var(--text-muted)' : 'var(--text)');
          span.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'justify-content:center !important',
            'box-sizing:border-box !important',
            'float:none !important',
            'position:static !important',
            'width:auto !important',
            'min-width:' + minW + ' !important',
            'height:36px !important',
            'min-height:36px !important',
            'max-height:36px !important',
            'padding:0 12px !important',
            'margin:0 !important',
            'line-height:36px !important',
            'font-size:14px !important',
            'font-weight:600 !important',
            'border-radius:8px !important',
            'border:1px solid ' + bd + ' !important',
            'background:' + bg + ' !important',
            'color:' + fg + ' !important',
            'box-shadow:none !important',
            'text-decoration:none !important',
            'cursor:' + (disabled ? 'default' : 'pointer') + ' !important',
            'white-space:nowrap !important',
            'overflow:hidden !important'
          ].join(';');
        });

        // 跳转区：取消 absolute 叠层，确定默认隐藏、focus 显示（交给站点 + CSS）
        bar.querySelectorAll('[id^="btn_turnpageto_"]').forEach((btn) => {
          btn.classList.add('urppp-page-confirm');
          // 不要强制 display；站点 turnpagetoFocus/Blur 控制
          // 但去掉 absolute，避免和文字重叠
          btn.style.setProperty('position', 'static', 'important');
          btn.style.setProperty('left', 'auto', 'important');
          btn.style.setProperty('top', 'auto', 'important');
          btn.style.setProperty('float', 'none', 'important');
          btn.style.setProperty('height', '32px', 'important');
          btn.style.setProperty('min-width', '52px', 'important');
          btn.style.setProperty('padding', '0 12px', 'important');
          btn.style.setProperty('margin', '0 4px', 'important');
          btn.style.setProperty('font-size', '13px', 'important');
          btn.style.setProperty('line-height', '1', 'important');
          btn.style.setProperty('vertical-align', 'middle', 'important');
        });

        // 跳转输入框的 relative 包裹：改为 inline-flex，避免 42x26 裁切
        bar.querySelectorAll('[id^="turnpageto_"]').forEach((inp) => {
          inp.classList.add('urppp-page-goto');
          inp.style.setProperty('position', 'static', 'important');
          inp.style.setProperty('display', 'inline-block', 'important');
          inp.style.setProperty('height', '32px', 'important');
          inp.style.setProperty('width', '48px', 'important');
          inp.style.setProperty('margin', '0 4px', 'important');
          inp.style.setProperty('padding', '4px 8px', 'important');
          inp.style.setProperty('font-size', '14px', 'important');
          inp.style.setProperty('line-height', '1.2', 'important');
          inp.style.setProperty('box-sizing', 'border-box', 'important');
          inp.style.setProperty('vertical-align', 'middle', 'important');
          const wrapSpan = inp.parentElement;
          if (wrapSpan && wrapSpan.tagName === 'SPAN') {
            wrapSpan.style.setProperty('position', 'static', 'important');
            wrapSpan.style.setProperty('display', 'inline-flex', 'important');
            wrapSpan.style.setProperty('align-items', 'center', 'important');
            wrapSpan.style.setProperty('width', 'auto', 'important');
            wrapSpan.style.setProperty('height', 'auto', 'important');
            wrapSpan.style.setProperty('min-height', '0', 'important');
            wrapSpan.style.setProperty('vertical-align', 'middle', 'important');
          }
        });

        // 统计文字区
        bar.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach((el) => {
          el.style.setProperty('display', 'inline', 'important');
          el.style.setProperty('border', 'none', 'important');
          el.style.setProperty('background', 'transparent', 'important');
          el.style.setProperty('padding', '0', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('height', 'auto', 'important');
          el.style.setProperty('line-height', '1.5', 'important');
          el.style.setProperty('font-size', '13px', 'important');
          el.style.setProperty('color', 'var(--text-secondary, var(--text-muted))', 'important');
        });
      });
    } catch (err) {
      console.warn('[URP++] pagebar beautify failed', err);
    }
  }

  function scheduleBeautifyPagebar() {
    const run = () => {
      beautifyPagebar();
      // 分页条可能晚注入：补挂 observer
      document.querySelectorAll('#urppagebar').forEach((host) => {
        if (host.__urpppPagebarObs) return;
        host.__urpppPagebarObs = true;
        const obs = new MutationObserver(() => {
          clearTimeout(window.__urpppPagebarTimer);
          window.__urpppPagebarTimer = setTimeout(() => beautifyPagebar(host.parentElement || document), 150);
        });
        obs.observe(host, { childList: true, subtree: true });
      });
    };
    if (window.__urpppPagebarBound) {
      setTimeout(run, 0);
      return;
    }
    window.__urpppPagebarBound = true;
    ;[0, 300, 1000, 2500].forEach((ms) => setTimeout(run, ms));
  }
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
        const n = Math.max(pairs.length, 1);
        const cols = getFormQueryCols(row);
        row.classList.add('urppp-query-row');
        row.style.setProperty('display', 'grid', 'important');
        row.style.setProperty('grid-template-columns', 'repeat(' + cols + ', minmax(0, 1fr))', 'important');
        row.style.setProperty('column-gap', '14px', 'important');
        row.style.setProperty('row-gap', '10px', 'important');
        row.style.setProperty('align-items', 'center', 'important');
        row.style.setProperty('width', '100%', 'important');
        row.style.setProperty('max-width', '100%', 'important');
        row.style.setProperty('box-sizing', 'border-box', 'important');
        row.dataset.urpppQueryCols = String(cols);
        // 字段只占前 n 格，其余留空，与上行同宽对齐
        pairs.forEach((pair, i) => {
          pair.style.setProperty('grid-column', String(i + 1), 'important');
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
            name.style.setProperty('flex', '0 0 84px', 'important');
            name.style.setProperty('width', '84px', 'important');
            name.style.setProperty('min-width', '84px', 'important');
            name.style.setProperty('max-width', '96px', 'important');
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

      // 已处理过则跳过（避免重复插横幅）
      if (body.dataset.urpppWrsDone === '1') {
        // 仍允许刷新 class
      }

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
      host.style.setProperty('position', 'relative', 'important');
      host.style.setProperty('width', '100%', 'important');

      // 不把课程块改 static 测高（会闪）；用估算 + 已有高度
      let unitH = 72;
      host.querySelectorAll('#courseTableBody tr, table tbody tr').forEach((tr) => {
        const h = tr.offsetHeight || 0;
        if (h > unitH) unitH = h;
      });
      // 若行还没内容高度，保持 72
      if (unitH < 56) unitH = 72;

      // 先按 classNum 内容需要抬高 unitH（用 scrollHeight 但不改 position）
      host.querySelectorAll('div.class_div').forEach((div) => {
        const n = parseInt(div.getAttribute('classNum') || '1', 10) || 1;
        // 当前若已有宽度，scrollHeight 可用
        const h = div.scrollHeight || 0;
        if (h > 0) unitH = Math.max(unitH, Math.ceil(h / n));
      });
      if (unitH < 64) unitH = 72;
      if (unitH > 160) unitH = 120; // 防止异常撑爆

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
    if (weekScheduleObserverEntry) weekScheduleObserverEntry.observer.disconnect();
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
      weekScheduleObserverEntry = { root: host, observer: obs };
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

  function noticeSurfaceColor() {
    // 直接读计算后的主题 surface，避免 var() 在内联里偶发不生效
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim();
      return v || (getCurrent() === 'dark' ? '#151A24' : '#FFFFFF');
    } catch (_) {
      return getCurrent() === 'dark' ? '#151A24' : '#FFFFFF';
    }
  }

  function pinNoticeRowSurface(tr) {
    if (!tr || !tr.classList || !tr.classList.contains('urppp-notice-row')) return;
    const surface = noticeSurfaceColor();
    tr.classList.remove('hover');
    // 用具体色 + important 钉死，压过 ACE jQuery 写回的 #fff
    tr.style.setProperty('background', surface, 'important');
    tr.style.setProperty('background-color', surface, 'important');
    tr.querySelectorAll('td, th').forEach((cell) => {
      cell.classList.remove('hover');
      cell.style.setProperty('background', 'transparent', 'important');
      cell.style.setProperty('background-color', 'transparent', 'important');
    });
  }

  function isLightInlineColor(val) {
    const s = String(val || '').trim().toLowerCase();
    if (!s || s === 'transparent' || s === 'inherit' || s === 'initial') return false;
    // 常见评教/ACE 浅色：#EDF3F4 / #e6e6e6 / #fff / rgb 高亮
    if (/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(s)) return true;
    const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
      const r = +m[1], g = +m[2], b = +m[3];
      // 浅灰/浅青底：平均亮度高
      return (r + g + b) / 3 >= 200;
    }
    return false;
  }

  function scrubLightInlineBg(el) {
    if (!el || !el.style) return;
    const st = el.getAttribute('style') || '';
    if (!st || !/background/i.test(st)) return;
    const bg = el.style.backgroundColor || el.style.background || '';
    // 有 background 内联且偏浅 / 或显式写了 background* 属性，一律清掉交给主题
    if (isLightInlineColor(bg) || /background(-color|-image)?\s*:/i.test(st)) {
      el.style.removeProperty('background');
      el.style.removeProperty('background-color');
      el.style.removeProperty('background-image');
    }
    // 边框浅色也清
    ;['borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach((k) => {
      const v = el.style[k];
      if (v && isLightInlineColor(v)) el.style.removeProperty(k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()));
    });
    // 简化：统一清 border-color 系列
    if (/border(-color)?\s*:/i.test(st) && /#e6e6e6|#eee|#ddd|#ccc/i.test(st)) {
      el.style.removeProperty('border-color');
      el.style.removeProperty('border-top-color');
      el.style.removeProperty('border-right-color');
      el.style.removeProperty('border-bottom-color');
      el.style.removeProperty('border-left-color');
    }
  }

  function scrubTableHeaderInlineBg() {
    if (isNativePdfIsolationActive()) return;
    try {
      if (!document.documentElement.classList.contains('urppp-theme-dark') &&
          !(document.body && document.body.classList.contains('urppp-dark'))) return;
      // 表头 + 评教 table-box 整表浅色内联
      document.querySelectorAll(
        'table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th'
      ).forEach(scrubLightInlineBg);
    } catch (_) {}
  }

  function scheduleScrubTableInlineBg() {
    ;[0, 200, 800, 1600].forEach((ms) => setTimeout(() => {
      try { scrubTableHeaderInlineBg(); } catch (_) {}
    }, ms));
    try {
      const host = document.querySelector('.page-content, #page-content-template, .main-content') || document.body;
      if (!host) return;
      const current = window.__urpppTableScrubObs;
      if (current && current.root === host && host.isConnected) return;
      if (current && current.observer) current.observer.disconnect();
      const observer = new MutationObserver(() => {
        clearTimeout(window.__urpppTableScrubTimer);
        window.__urpppTableScrubTimer = setTimeout(() => {
          try { scrubTableHeaderInlineBg(); } catch (_) {}
        }, 120);
      });
      observer.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
      window.__urpppTableScrubObs = { root: host, observer };
    } catch (_) {}
  }

  function scrubNoticeInlineBg(root) {
    try {
      const scope = root || document;
      if (scope.matches && scope.matches('tr.urppp-notice-row')) {
        pinNoticeRowSurface(scope);
        return;
      }
      scope.querySelectorAll('table.urppp-notice-table tr.urppp-notice-row').forEach(pinNoticeRowSurface);
    } catch (_) {}
  }

  function disarmNoticeTableHover(table) {
    if (!table) return;
    // CSS 已覆盖 table-hover；只摘 class + 钉背景，避免 jQuery 全量 off
    table.classList.remove('table-hover', 'table-striped');
    table.classList.add('urppp-notice-nohover');
    table.querySelectorAll('tr.urppp-notice-row').forEach((tr) => {
      tr.classList.remove('hover');
      pinNoticeRowSurface(tr);
    });
  }

  function bindNoticeHoverScrub() {
    if (window.__urpppNoticeHoverScrub) return;
    window.__urpppNoticeHoverScrub = true;
    // 轻量：仅 leave 后清一次，不做 document Observer / mousemove（会卡死页面）
    document.addEventListener('mouseout', (e) => {
      const tr = e.target && e.target.closest ? e.target.closest('table.urppp-notice-table tr.urppp-notice-row') : null;
      if (!tr) return;
      requestAnimationFrame(() => pinNoticeRowSurface(tr));
    }, true);
  }
  function stripMistakenNoticeTable(table) {
    if (!table) return;
    table.classList.remove('urppp-notice-table');
    delete table.dataset.urpppNoticeScan;
    table.style.removeProperty('border');
    table.style.removeProperty('border-left');
    table.style.removeProperty('background');
    const wrap = table.closest('.urppp-table-wrap.urppp-notice-wrap');
    if (wrap) {
      wrap.classList.remove('urppp-notice-wrap');
      wrap.style.removeProperty('border');
      wrap.style.removeProperty('background');
      wrap.style.removeProperty('box-shadow');
      wrap.style.removeProperty('overflow');
      wrap.style.removeProperty('border-radius');
    }
    table.querySelectorAll('tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card').forEach((el) => {
      el.classList.remove(
        'urppp-notice-row',
        'urppp-notice-title-cell',
        'urppp-notice-date-cell',
        'urppp-notice-bullet-cell',
        'urppp-notice-link',
        'urppp-notice-time',
        'urppp-notice-card',
        'urppp-notice-card-row',
        'urppp-notice-main',
        'urppp-notice-meta',
        'urppp-notice-title',
        'urppp-notice-body'
      );
      if (el.tagName === 'TR' || el.tagName === 'TD') {
        ['display', 'border', 'background', 'padding', 'margin', 'width', 'box-shadow', 'border-radius', 'float', 'position'].forEach((p) => {
          if (el.style.getPropertyPriority(p) === 'important') el.style.removeProperty(p);
        });
      }
      delete el.dataset.urpppNoticeDone;
    });
  }

  function isNoticeBulletText(s) {
    const t = String(s || '').replace(/\s+/g, '');
    return /^[•·●○▪◆★\-–]$/.test(t) || /^\d{1,4}$/.test(t);
  }

  function isNoticeDateText(s) {
    return /\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(s || ''));
  }

  function isNoticePageContext() {
    try {
      const path = String(location.pathname || '') + ' ' + String(location.href || '');
      if (/courseSelectNotice|evaluationNotice|notice\/index/i.test(path)) return true;
      const hint = (
        (document.title || '') + ' ' +
        ((document.querySelector('h4.header, h3.header, h4, h3, .breadcrumb, .page-header') || {}).textContent || '')
      );
      return /评估公告|通知公告|选课公告|公告|通知/.test(hint);
    } catch (_) {
      return false;
    }
  }

  function isNoticeListTable(table) {
    if (!table) return false;
    const headText = ((table.querySelector('thead') && table.querySelector('thead').textContent) || '').replace(/\s+/g, '');
    if (/标题/.test(headText) && /发布时间|发布日期|日期|时间/.test(headText)) return true;
    if (isNoticePageContext() && /标题|公告|通知/.test(headText) && !/教室|教学楼|课程号|成绩|学号|座位数/.test(headText)) return true;
    // 无 thead：●/序号 + a + 日期
    const rows = table.querySelectorAll('tbody tr, tr');
    let hit = 0;
    rows.forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      if (tds.length < 2 || tds.length > 4) return;
      if (isNoticeBulletText(tds[0].textContent) && tr.querySelector('a') && isNoticeDateText(tr.textContent)) hit += 1;
    });
    if (hit < 1) return false;
    if (isNoticePageContext() || hit === rows.length) return true;
    const st = table.getAttribute('style') || '';
    return /dashed/i.test(st) || table.classList.contains('no-border-top') || !!table.getAttribute('width');
  }

  function isBusinessDataTable(table) {
    if (!table) return true;
    if (table.classList && table.classList.contains('urppp-notice-table')) return false;
    // 公告列表（含「标题 + 发布时间」）优先，避免被「序号」误判成业务表
    if (isNoticeListTable(table)) return false;
    const id = (table.id || '') + ' ' + ((table.getAttribute('class') || ''));
    if (/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(id)) return true;
    if (table.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]')) return true;
    // 多列表格（>=5 列）几乎一定是业务表
    const sample = table.querySelector('tbody tr, tr');
    if (sample && sample.querySelectorAll('td,th').length >= 5) return true;
    // 仅用 thead 判业务表；无 thead 时不要拿第一行正文当表头（公告行会被误杀）
    const headText = ((table.querySelector('thead') && table.querySelector('thead').textContent) || '').replace(/\s+/g, '');
    if (headText) {
      if (/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(headText)) return true;
      if (/序号/.test(headText) && !/标题|公告|通知|发布时间/.test(headText)) return true;
    }
    // 行内操作链接：排除公告页；“评估”单独不能当业务表信号（评估公告正文里常见）
    if (table.querySelector('a') && /课表|教室信息|查看/.test(table.textContent || '')) {
      if (!isNoticePageContext() && /座位数|教学楼|教室号|校区名/.test(table.textContent || '')) return true;
    }
    return false;
  }

  function beautifyNoticeTables() {
    if (isNativePdfIsolationActive()) return;
    try {
      bindNoticeHoverScrub();
      scrubNoticeInlineBg();
      // 先清理误伤业务表
      document.querySelectorAll('table.urppp-notice-table, table.table').forEach((table) => {
        if (isBusinessDataTable(table) && (table.classList.contains('urppp-notice-table') || table.querySelector('.urppp-notice-row, .urppp-notice-title-cell'))) {
          stripMistakenNoticeTable(table);
        }
      });

      // 候选表：常规容器 + 公告页/结构兜底
      const tableSet = new Set(document.querySelectorAll(
        '.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'
      ));
      if (isNoticePageContext()) {
        document.querySelectorAll('table').forEach((tb) => tableSet.add(tb));
      } else {
        document.querySelectorAll('table').forEach((tb) => {
          if (isNoticeListTable(tb)) tableSet.add(tb);
        });
      }
      Array.from(tableSet).forEach((table) => {
        if (!table || isBusinessDataTable(table)) return;
        // 跳过真正业务数据表（有 thead 多列表头）；公告「标题+发布时间」放行
        if (table.querySelector('thead th') && table.querySelectorAll('thead th').length >= 3) {
          const thText = (table.querySelector('thead')?.textContent || '');
          if (!isNoticeListTable(table) && /序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(thText) && !/标题|公告|通知/.test(thText)) return;
        }
        const rows = Array.from(table.querySelectorAll('tbody > tr, tr')).filter((tr) => tr.querySelector('td'));
        if (!rows.length) return;

        // 判定是否公告列表
        // 评估公告链接常是 <a onclick=...> 没有 href，不能只查 a[href]
        let noticeLike = 0;
        rows.slice(0, 12).forEach((tr) => {
          const tds = Array.from(tr.children).filter((c) => c.tagName === 'TD' || c.tagName === 'TH');
          if (tds.length >= 5) return;
          const text = (tr.textContent || '').replace(/\s+/g, ' ').trim();
          const hasLink = !!tr.querySelector('a[href], a[onclick], a');
          const hasDate = /\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(text);
          const hasBullet = tds.some((td) => isNoticeBulletText(td.textContent));
          if ((hasLink && hasDate) || (hasBullet && hasLink) || (hasBullet && hasDate)) {
            noticeLike += 1;
          }
        });
        const looksDashedNotice =
          table.classList.contains('no-border-top') ||
          /dashed|border-left-style/.test(table.getAttribute('style') || '');
        const inNoticePage = isNoticePageContext();
        if (noticeLike < 1) {
          if (inNoticePage) {
            // 公告页兜底：2~3 列且含 a/日期 的行
            const loose = rows.slice(0, 8).filter((tr) => {
              const tds = Array.from(tr.children).filter((c) => c.tagName === 'TD' || c.tagName === 'TH');
              if (tds.length < 1 || tds.length > 4) return false;
              const text = (tr.textContent || '').replace(/\s+/g, ' ').trim();
              return !!tr.querySelector('a') || /\d{4}/.test(text);
            }).length;
            if (loose < 1 && !looksDashedNotice) return;
          } else if (!(looksDashedNotice && /公告|通知/.test(document.title || ''))) {
            return;
          }
        }
        if (isBusinessDataTable(table)) return;
        table.classList.add('urppp-notice-table');
        table.dataset.urpppNoticeScan = '1';
        disarmNoticeTableHover(table);
        table.style.setProperty('border', 'none', 'important');
        table.style.setProperty('border-left', 'none', 'important');
        table.style.setProperty('background', 'transparent', 'important');
        table.style.setProperty('width', '100%', 'important');

        const wrap = table.closest('.urppp-table-wrap');
        if (wrap) {
          wrap.classList.add('urppp-notice-wrap');
          wrap.style.setProperty('border', 'none', 'important');
          wrap.style.setProperty('background', 'transparent', 'important');
          wrap.style.setProperty('box-shadow', 'none', 'important');
          wrap.style.setProperty('overflow', 'visible', 'important');
          wrap.style.setProperty('border-radius', '0', 'important');
        }

        rows.forEach((tr) => {
          if (tr.dataset.urpppNoticeDone === '1') return;
          const tds = Array.from(tr.children).filter((c) => c.tagName === 'TD' || c.tagName === 'TH');
          if (!tds.length) return;

          const clean = (s) => (s || '')
            .replace(/\u00AD/g, '')
            .replace(/\u200B/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          // ---- 形态 A：多列（圆点 / 标题 / 日期）----
          if (tds.length >= 2) {
            let bulletTd = null;
            let titleTd = null;
            let dateTd = null;

            tds.forEach((td, i) => {
              const t = clean(td.textContent);
              const hasA = !!td.querySelector('a');
              // 序号列 / 圆点列
              if (!bulletTd && isNoticeBulletText(t) && (i === 0 || tds.length >= 2)) {
                bulletTd = td;
                return;
              }
              // 发布时间：2026-07-10 11:10:21
              if (!dateTd && (
                /\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(t) ||
                /\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(t) ||
                /text-align\s*:\s*right/i.test(td.getAttribute('style') || '') ||
                (i === tds.length - 1 && t.length <= 28 && /\d{4}/.test(t))
              )) {
                if (/\d{4}/.test(t) && t.length <= 32) {
                  dateTd = td;
                  return;
                }
              }
              if (!titleTd && (hasA || t.length > 4)) {
                titleTd = td;
              }
            });
            if (!titleTd) titleTd = tds.find((td) => td !== bulletTd && td !== dateTd) || tds[0];
            if (!dateTd && tds.length >= 2) {
              const last = tds[tds.length - 1];
              if (last !== titleTd && last !== bulletTd) dateTd = last;
            }

            tr.classList.add('urppp-notice-row');
            pinNoticeRowSurface(tr);
            // 站点 width="88%" 等属性会在 hover 时把 flex 行挤换行
            tr.removeAttribute('width');
            tr.style.setProperty('flex-wrap', 'nowrap', 'important');
            tds.forEach((td) => {
              td.removeAttribute('width');
              td.removeAttribute('height');
              td.removeAttribute('align');
              td.style.setProperty('border', 'none', 'important');
              td.style.setProperty('background', 'transparent', 'important');
              td.style.setProperty('vertical-align', 'middle', 'important');
              td.style.removeProperty('width');
              td.style.setProperty('width', 'auto', 'important');
            });

            // 隐藏原始 bullet 列，改用 CSS ::before
            if (bulletTd) {
              bulletTd.classList.add('urppp-notice-bullet-cell');
              bulletTd.style.setProperty('display', 'none', 'important');
              bulletTd.style.setProperty('width', '0', 'important');
              bulletTd.style.setProperty('padding', '0', 'important');
            }
            if (titleTd) {
              titleTd.classList.add('urppp-notice-title-cell');
              titleTd.removeAttribute('width');
              titleTd.style.setProperty('width', 'auto', 'important');
              titleTd.style.setProperty('max-width', '100%', 'important');
              titleTd.style.setProperty('min-width', '0', 'important');
              titleTd.style.setProperty('flex', '1 1 0%', 'important');
              titleTd.style.setProperty('overflow', 'hidden', 'important');
              titleTd.style.setProperty('padding', '0', 'important');
              titleTd.style.setProperty('pointer-events', 'auto', 'important');
              titleTd.style.setProperty('white-space', 'nowrap', 'important');
              // 链接可能不在 titleTd 内（误分类时），整行找
              let a = titleTd.querySelector('a[href], a[onclick], a');
              if (!a) a = tr.querySelector('a[href], a[onclick], a');
              if (a) {
                // 若链接不在标题格，挪进标题格，避免点不到
                if (!titleTd.contains(a)) {
                  titleTd.innerHTML = '';
                  titleTd.appendChild(a);
                }
                a.classList.add('urppp-notice-link');
                // 只清文本节点，保留 href/onclick/target
                const href = a.getAttribute('href');
                const onclick = a.getAttribute('onclick');
                const target = a.getAttribute('target');
                const label = clean(a.textContent);
                a.textContent = label;
                if (href != null) a.setAttribute('href', href);
                if (onclick != null) a.setAttribute('onclick', onclick);
                if (target != null) a.setAttribute('target', target);
                a.style.setProperty('color', 'var(--text)', 'important');
                a.style.setProperty('text-decoration', 'none', 'important');
                a.style.setProperty('font-size', '14px', 'important');
                a.style.setProperty('font-weight', '500', 'important');
                a.style.setProperty('line-height', '1.5', 'important');
                a.style.setProperty('pointer-events', 'auto', 'important');
                a.style.setProperty('cursor', 'pointer', 'important');
                a.style.setProperty('position', 'relative', 'important');
                a.style.setProperty('z-index', '2', 'important');
                a.style.setProperty('display', 'block', 'important');
                a.style.setProperty('white-space', 'nowrap', 'important');
                a.style.setProperty('overflow', 'hidden', 'important');
                a.style.setProperty('text-overflow', 'ellipsis', 'important');
                // 整行可点：点卡片任意处触发链接
                if (tr.dataset.urpppNoticeClickBound !== '1') {
                  tr.dataset.urpppNoticeClickBound = '1';
                  tr.style.setProperty('cursor', 'pointer', 'important');
                  tr.addEventListener('click', (e) => {
                    if (e.target && e.target.closest && e.target.closest('a,button,input,select,textarea,label')) return;
                    // 优先原生跳转
                    if (a.getAttribute('onclick')) {
                      a.click();
                      return;
                    }
                    const h = a.getAttribute('href');
                    if (!h || h === '#' || h.indexOf('javascript:') === 0) {
                      a.click();
                      return;
                    }
                    if (a.target === '_blank') window.open(h, '_blank');
                    else window.location.href = h;
                  });
                }
              } else {
                // 无 a 时保留原 td 内容与事件，只做文本清理
                const rawHtml = titleTd.innerHTML;
                const onlyText = clean(titleTd.textContent);
                if (onlyText && !titleTd.querySelector('button, input, select')) {
                  // 若原本只有文字，保留文字；若有复杂结构不动
                  if (!titleTd.querySelector('*') || titleTd.children.length === 0) {
                    titleTd.textContent = onlyText;
                  }
                }
                void rawHtml;
              }
            }
            if (dateTd) {
              dateTd.classList.add('urppp-notice-date-cell');
              dateTd.style.cssText = [
                'display:flex !important',
                'align-items:center !important',
                'justify-content:flex-end !important',
                'flex:0 0 auto !important',
                'width:auto !important',
                'max-width:none !important',
                'white-space:nowrap !important',
                'text-align:right !important',
                'padding:0 !important',
                'margin:0 0 0 auto !important',
                'border:none !important',
                'background:transparent !important',
                'float:none !important',
                'position:static !important',
                'right:auto !important',
                'left:auto !important',
                'top:auto !important'
              ].join(';');
              const dateText = clean(dateTd.textContent);
              dateTd.innerHTML = '';
              const badge = document.createElement('span');
              badge.className = 'urppp-notice-time';
              badge.textContent = dateText;
              dateTd.appendChild(badge);
            }
            // 标题列吃满剩余空间，日期贴卡内右侧
            if (titleTd) {
              titleTd.style.setProperty('flex', '1 1 auto', 'important');
              titleTd.style.setProperty('min-width', '0', 'important');
              titleTd.style.setProperty('margin', '0', 'important');
              titleTd.style.setProperty('float', 'none', 'important');
              titleTd.style.setProperty('position', 'static', 'important');
            }
            tr.style.setProperty('display', 'flex', 'important');
            tr.style.setProperty('align-items', 'center', 'important');
            tr.style.setProperty('justify-content', 'space-between', 'important');
            tr.style.setProperty('gap', '16px', 'important');
            tr.style.setProperty('max-width', '100%', 'important');
            tr.style.setProperty('box-sizing', 'border-box', 'important');
            tr.style.setProperty('overflow', 'hidden', 'important');
            tr.dataset.urpppNoticeDone = '1';
            return;
          }

          // ---- 形态 B：单 td 内多层 span（旧逻辑）----
          const td = tds[0];
          const parts = Array.from(td.querySelectorAll(':scope > span'));
          if (parts.length < 2) {
            // 单格但有 a + 日期文本
            const a = td.querySelector('a');
            const full = clean(td.textContent);
            const dateMatch = full.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);
            if (a || dateMatch) {
              tr.classList.add('urppp-notice-row');
              const card = document.createElement('div');
              card.className = 'urppp-notice-card urppp-notice-card-row';
              const left = document.createElement('div');
              left.className = 'urppp-notice-main';
              if (a) {
                // 移动原节点，保留事件与属性，避免 clone 丢监听
                const link = a;
                link.classList.add('urppp-notice-link');
                const href = link.getAttribute('href');
                const onclick = link.getAttribute('onclick');
                const label = clean(link.textContent);
                link.textContent = label;
                if (href != null) link.setAttribute('href', href);
                if (onclick != null) link.setAttribute('onclick', onclick);
                link.style.setProperty('pointer-events', 'auto', 'important');
                link.style.setProperty('cursor', 'pointer', 'important');
                left.appendChild(link);
                if (tr.dataset.urpppNoticeClickBound !== '1') {
                  tr.dataset.urpppNoticeClickBound = '1';
                  tr.style.setProperty('cursor', 'pointer', 'important');
                  tr.addEventListener('click', (e) => {
                    if (e.target && e.target.closest && e.target.closest('a,button,input,select')) return;
                    if (link.getAttribute('onclick') || !link.getAttribute('href') || link.getAttribute('href') === '#') {
                      link.click();
                      return;
                    }
                    window.location.href = link.getAttribute('href');
                  });
                }
              } else {
                const title = document.createElement('div');
                title.className = 'urppp-notice-title';
                title.textContent = dateMatch ? full.replace(dateMatch[0], '').trim() : full;
                left.appendChild(title);
              }
              card.appendChild(left);
              if (dateMatch) {
                const meta = document.createElement('div');
                meta.className = 'urppp-notice-meta';
                const tEl = document.createElement('span');
                tEl.className = 'urppp-notice-time';
                tEl.textContent = dateMatch[1];
                meta.appendChild(tEl);
                card.appendChild(meta);
              }
              td.innerHTML = '';
              td.appendChild(card);
              td.dataset.urpppNoticeDone = '1';
              tr.dataset.urpppNoticeDone = '1';
            }
            return;
          }

          // multi-span body notice
          let titleEl = null;
          let timeEl = null;
          const bodyEls = [];
          parts.forEach((sp) => {
            const st = (sp.getAttribute('style') || '') + ' ' + (sp.style.cssText || '');
            const txt = clean(sp.textContent);
            if (!txt) return;
            if (/font-size\s*:\s*18/i.test(st) || (!titleEl && /font-size\s*:\s*1[6-9]/i.test(st))) {
              titleEl = sp; return;
            }
            if (/font-size\s*:\s*12/i.test(st) || /float\s*:\s*right/i.test(st) || /^\d{4}-\d{2}-\d{2}/.test(txt)) {
              timeEl = sp; return;
            }
            bodyEls.push(sp);
          });
          if (!titleEl) titleEl = parts[0];
          if (!timeEl) {
            const last = parts[parts.length - 1];
            if (last !== titleEl) timeEl = last;
          }
          const card = document.createElement('div');
          card.className = 'urppp-notice-card';
          if (titleEl) {
            const h = document.createElement('div');
            h.className = 'urppp-notice-title';
            h.textContent = clean(titleEl.textContent);
            card.appendChild(h);
          }
          (bodyEls.length ? bodyEls : parts.filter((sp) => sp !== titleEl && sp !== timeEl)).forEach((b) => {
            const p = document.createElement('div');
            p.className = 'urppp-notice-body';
            p.textContent = clean(b.textContent);
            if (p.textContent) card.appendChild(p);
          });
          if (timeEl) {
            const meta = document.createElement('div');
            meta.className = 'urppp-notice-meta';
            const tEl = document.createElement('span');
            tEl.className = 'urppp-notice-time';
            tEl.textContent = clean(timeEl.textContent);
            meta.appendChild(tEl);
            card.appendChild(meta);
          }
          td.innerHTML = '';
          td.appendChild(card);
          td.dataset.urpppNoticeDone = '1';
          tr.dataset.urpppNoticeDone = '1';
          tr.classList.add('urppp-notice-row');
        });
      });
    } catch (err) {
      console.warn('[URP++] notice table beautify failed', err);
    }
  }
  function wrapTables() {
    if (isNativePdfIsolationActive()) return;
    document.querySelectorAll('table.table, table.table-bordered, table.dataTable').forEach((table) => {
      if (!table || table.closest('.urppp-table-wrap')) return;
      if (table.id === 'courseTable') return;
      if (table.closest('.modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal')) return;
      if (table.classList.contains('urppp-wrs-table')) return;
      if (table.classList.contains('urppp-notice-table')) return;
      if (isBusinessDataTable(table)) { /* keep wrap for business tables */ }
      const parent = table.parentElement;
      if (!parent) return;
      const parentOverflow = (parent.style && parent.style.overflow) || getComputedStyle(parent).overflow;
      const isScrollBox = (parent.id && parent.id.endsWith('_scroll')) || parentOverflow === 'auto' || parentOverflow === 'scroll';
      if (isScrollBox) {
        // 滚动分页容器：只做标记，不要用 table-wrap 的 overflow/margin 干扰 fixedheader
        parent.classList.add('urppp-scroll-table-host');
        return;
      }
      const wrap = document.createElement('div');
      wrap.className = 'urppp-table-wrap';
      parent.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function bindTableWrapObserver() {
    const host = document.getElementById('page-content-template')
      || document.querySelector('.page-content')
      || document.body;
    if (!host) return;
    const currentRoot = window.__urpppTableObsRoot;
    if (window.__urpppTableObs && currentRoot === host && host.isConnected) return;
    if (window.__urpppTableObs) window.__urpppTableObs.disconnect();
    let wrapTimer = 0;
    window.__urpppTableObs = new MutationObserver(() => {
      clearTimeout(wrapTimer);
      wrapTimer = setTimeout(wrapTables, 80);
    });
    window.__urpppTableObs.observe(host, { childList: true, subtree: true });
    window.__urpppTableObsRoot = host;
  }

  function scheduleBeautifyNoticeTables() {
    ;[0, 400, 1500].forEach((ms) => setTimeout(() => {
      try { beautifyNoticeTables(); } catch (_) {}
    }, ms));
    try {
      const host = document.getElementById('page-content-template') || document.querySelector('.page-content, .main-content') || document.body;
      if (!host) return;
      const current = window.__urpppNoticeObs;
      if (current && current.root === host && host.isConnected) return;
      if (current && current.observer) current.observer.disconnect();
      const observer = new MutationObserver(() => {
        clearTimeout(window.__urpppNoticeTimer);
        window.__urpppNoticeTimer = setTimeout(() => {
          try { beautifyNoticeTables(); } catch (_) {}
        }, 180);
      });
      observer.observe(host, { childList: true, subtree: true });
      window.__urpppNoticeObs = { root: host, observer };
    } catch (_) {}
  }


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
    let scheduleCardStyle = document.getElementById('urppp-schedule-card-style');
    if (!scheduleCardStyle) {
      scheduleCardStyle = document.createElement('style');
      scheduleCardStyle.id = 'urppp-schedule-card-style';
      document.head.appendChild(scheduleCardStyle);
    }
    scheduleCardStyle.textContent = scheduleCardStyles;
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
    // 强制内容区内边距（ACE 偶发内联样式覆盖）
    document.querySelectorAll('.page-content, #page-content-template').forEach((el) => {
      el.style.setProperty('padding', '16px 64px 40px', 'important');
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

  function syncThemeDotGroup(wrap) {
    if (!wrap) return;
    const skinId = getSkin();
    const brutal = skinSupportsFixedPalettes(skinId);
    const currentTheme = getCurrent();
    const brutalActive = brutal ? getBrutalActivePalette() : null;
    const brutalSelected = brutal ? getBrutalSelectedPalette() : null;
    wrap.querySelectorAll('.urppp-nav-dot[data-theme]').forEach((dot) => {
      const theme = dot.dataset.theme;
      const isDark = theme === 'dark';
      const isDynamic = theme === 'scu-red';
      const disabled = (isDark && !skinSupportsDark(skinId)) || (isDynamic && !skinSupportsDynamic(skinId) && !brutal);
      let active = theme === currentTheme;
      if (brutal) {
        active = (theme === 'default' && brutalActive.id === BRUTAL_DEFAULT_PALETTE)
          || (isDynamic && brutalActive.id !== BRUTAL_DEFAULT_PALETTE);
      }
      dot.disabled = disabled;
      dot.classList.toggle('urppp-theme-disabled', disabled);
      dot.classList.toggle('ac', active && !disabled);
      dot.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      if (theme === 'default') {
        dot.style.background = brutal ? getBrutalPaletteById(BRUTAL_DEFAULT_PALETTE).accent : '#F1F3F5';
        dot.title = brutal ? '默认高能粉' : '简约白';
      } else if (isDark) {
        dot.style.background = disabled ? '#A7A7A7' : '#0B0F14';
        dot.title = disabled ? '当前界面风格不支持暗色模式' : '深邃暗';
      } else if (isDynamic) {
        if (disabled) {
          dot.style.background = '#A7A7A7';
          dot.title = '当前界面风格不支持动态配色';
        } else if (brutal) {
          dot.style.background = brutalSelected.accent;
          dot.title = '高对比配色：' + brutalSelected.name;
        } else {
          const seed = getAccent() || DEFAULT_SEED;
          try {
            const prev = buildSchemePreview(seed, getScheme());
            dot.style.background = 'linear-gradient(135deg, ' + prev.primary + ' 0 55%, ' + prev.surface + ' 55% 100%)';
          } catch (_) {
            dot.style.background = seed;
          }
          dot.title = '动态配色';
        }
      }
    });
  }

  function handleThemeDotClick(theme) {
    const skinId = getSkin();
    if (skinSupportsFixedPalettes(skinId)) {
      if (theme === 'dark') return;
      if (getCurrent() !== 'default') applyTheme('default', { manual: true });
      if (theme === 'default') setBrutalPalette(BRUTAL_DEFAULT_PALETTE);
      if (theme === 'scu-red') setBrutalPalette(getBrutalSelectedPalette().id);
      return;
    }
    if (!isThemeModeAvailable(theme, skinId)) return;
    applyTheme(theme, { manual: true });
  }

  function syncNavbarThemeUI() {
    syncThemeDotGroup(document.getElementById('urppp-nav-theme'));
  }

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

  function syncDirectEditPrivacyUI(panel, privacy) {
    const customMode = privacy.mode === 'custom';
    const control = panel.querySelector('.urppp-direct-edit-control');
    const button = panel.querySelector('#urppp-set-direct-edit-toggle');
    if (control) control.style.display = customMode ? 'flex' : 'none';
    if (!button) return;
    button.dataset.enabled = privacy.directEdit.enabled ? '1' : '0';
    button.classList.toggle('ac', privacy.directEdit.enabled);
    button.setAttribute('aria-pressed', privacy.directEdit.enabled ? 'true' : 'false');
    button.textContent = '页面内修改：' + (privacy.directEdit.enabled ? '开' : '关');
  }

  function syncPrivacySettingsUI(panel) {
    if (!panel) return;
    const privacy = getPrivacySettings();
    panel.querySelectorAll('[data-privacy-mode]').forEach((button) => {
      const on = button.getAttribute('data-privacy-mode') === privacy.mode;
      button.classList.toggle('ac', on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const customBox = panel.querySelector('#urppp-set-privacy-custom');
    if (customBox) customBox.style.display = privacy.mode === 'custom' ? 'grid' : 'none';
    Object.keys(privacy.fields).forEach((field) => {
      const item = privacy.fields[field];
      const toggle = panel.querySelector('[data-privacy-field="' + field + '"]');
      const input = panel.querySelector('[data-privacy-value="' + field + '"]');
      if (toggle) toggle.checked = !!item.enabled;
      if (input) {
        input.value = item.replacement || '';
        input.disabled = !item.enabled;
      }
    });
    syncDirectEditPrivacyUI(panel, privacy);
    const identity = getCustomIdentity();
    const nameEnabled = panel.querySelector('#urppp-set-name-enabled');
    const nameInput = panel.querySelector('#urppp-set-custom-name');
    const avatarEnabled = panel.querySelector('#urppp-set-avatar-enabled');
    const avatarUrl = panel.querySelector('#urppp-set-custom-avatar-url');
    const preview = panel.querySelector('#urppp-set-avatar-preview');
    if (nameEnabled) nameEnabled.checked = identity.nameEnabled;
    if (nameInput) { nameInput.value = identity.name; nameInput.disabled = !identity.nameEnabled; }
    if (avatarEnabled) avatarEnabled.checked = identity.avatarEnabled;
    if (avatarUrl) {
      avatarUrl.value = /^data:image\//i.test(identity.avatar) ? '' : identity.avatar;
      avatarUrl.disabled = !identity.avatarEnabled;
    }
    panel.__urpppAvatarSource = identity.avatar;
    if (preview) {
      const src = validCustomAvatar(identity.avatar);
      preview.style.display = src ? 'block' : 'none';
      if (src) preview.src = src;
      else preview.removeAttribute('src');
    }
  }

  function collectPrivacySettings(panel) {
    const next = getPrivacySettings();
    Object.keys(next.fields).forEach((field) => {
      const toggle = panel.querySelector('[data-privacy-field="' + field + '"]');
      const input = panel.querySelector('[data-privacy-value="' + field + '"]');
      if (toggle) next.fields[field].enabled = !!toggle.checked;
      if (input) next.fields[field].replacement = String(input.value || '').trim().slice(0, 80);
    });
    const directEditToggle = panel.querySelector('#urppp-set-direct-edit-toggle');
    next.directEdit.enabled = !!(directEditToggle && directEditToggle.dataset.enabled === '1');
    return next;
  }

  function setPrivacySettingsStatus(panel, message, error) {
    const status = panel && panel.querySelector('#urppp-set-privacy-status');
    if (!status) return;
    status.textContent = message || '';
    status.style.color = error ? '#b91c1c' : 'var(--text-muted)';
  }

  function readAvatarFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\/(png|jpeg|webp|gif)$/i.test(file.type || '')) return reject(new Error('请选择 PNG、JPG、WebP 或 GIF 图片'));
      if (file.size > 2 * 1024 * 1024) return reject(new Error('本地头像不能超过 2MB'));
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('读取头像失败'));
      reader.readAsDataURL(file);
    });
  }

  function bindPrivacySettingsUI(panel) {
    if (!panel || panel.__urpppPrivacyBound) return;
    panel.__urpppPrivacyBound = true;
    panel.querySelectorAll('[data-privacy-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = getPrivacySettings();
        next.mode = button.getAttribute('data-privacy-mode') || 'off';
        setPrivacySettings(next);
        syncPrivacySettingsUI(panel);
        applyPersonalDisplay(document);
      });
    });
    panel.querySelectorAll('[data-privacy-field]').forEach((toggle) => {
      toggle.addEventListener('change', () => {
        const field = toggle.getAttribute('data-privacy-field');
        const input = panel.querySelector('[data-privacy-value="' + field + '"]');
        if (input) input.disabled = !toggle.checked;
      });
    });
    const directEditToggle = panel.querySelector('#urppp-set-direct-edit-toggle');
    if (directEditToggle) directEditToggle.addEventListener('click', () => {
      const enabled = directEditToggle.dataset.enabled !== '1';
      directEditToggle.dataset.enabled = enabled ? '1' : '0';
      directEditToggle.classList.toggle('ac', enabled);
      directEditToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      directEditToggle.textContent = '页面内修改：' + (enabled ? '开' : '关');
    });
    const nameEnabled = panel.querySelector('#urppp-set-name-enabled');
    const avatarEnabled = panel.querySelector('#urppp-set-avatar-enabled');
    if (nameEnabled) nameEnabled.addEventListener('change', () => {
      const input = panel.querySelector('#urppp-set-custom-name');
      if (input) input.disabled = !nameEnabled.checked;
    });
    if (avatarEnabled) avatarEnabled.addEventListener('change', () => {
      const input = panel.querySelector('#urppp-set-custom-avatar-url');
      if (input) input.disabled = !avatarEnabled.checked;
    });
    const fileInput = panel.querySelector('#urppp-set-custom-avatar-file');
    if (fileInput) fileInput.addEventListener('change', async () => {
      try {
        const source = await readAvatarFile(fileInput.files && fileInput.files[0]);
        panel.__urpppAvatarSource = source;
        const preview = panel.querySelector('#urppp-set-avatar-preview');
        if (preview) { preview.src = source; preview.style.display = 'block'; }
        if (avatarEnabled) avatarEnabled.checked = true;
        setPrivacySettingsStatus(panel, '本地头像已读取，点击保存后生效');
      } catch (e) {
        setPrivacySettingsStatus(panel, e && e.message || String(e), true);
      }
    });
    const clearAvatar = panel.querySelector('#urppp-set-avatar-clear');
    if (clearAvatar) clearAvatar.addEventListener('click', () => {
      try {
        const identity = getCustomIdentity();
        identity.avatarEnabled = false;
        identity.avatar = '';
        identity.avatarName = '';
        setCustomIdentity(identity);
        panel.__urpppAvatarSource = '';
        syncPrivacySettingsUI(panel);
        applyPersonalDisplay(document);
        refreshCleanPersonalDisplay();
        setPrivacySettingsStatus(panel, '已清除自定义头像');
      } catch (e) {
        setPrivacySettingsStatus(panel, e && e.message || '清除自定义头像失败', true);
      }
    });
    const save = panel.querySelector('#urppp-set-privacy-save');
    if (save) save.addEventListener('click', () => {
      const previousPrivacy = getPrivacySettings();
      const previousIdentity = getCustomIdentity();
      try {
        const draftPrivacy = collectPrivacySettings(panel);
        const current = previousIdentity;
        const urlInput = panel.querySelector('#urppp-set-custom-avatar-url');
        const typedUrl = String(urlInput && urlInput.value || '').trim();
        const source = typedUrl || panel.__urpppAvatarSource || '';
        const draftIdentity = normalizeCustomIdentity({
          nameEnabled: !!(nameEnabled && nameEnabled.checked),
          name: String(panel.querySelector('#urppp-set-custom-name')?.value || '').trim(),
          avatarEnabled: !!(avatarEnabled && avatarEnabled.checked),
          avatar: source,
          avatarName: current.avatarName
        });
        if (draftIdentity.avatarEnabled && !validCustomAvatar(draftIdentity.avatar)) throw new Error('头像地址必须是 http(s) 图片或已选择的本地图片');
        if (previousPrivacy.directEdit.enabled && !draftPrivacy.directEdit.enabled && activeDirectEditInput?.__finish) {
          activeDirectEditInput.__finish(true);
        }
        try {
          setCustomIdentity(draftIdentity);
          setPrivacySettings(draftPrivacy);
        } catch (writeError) {
          try { setCustomIdentity(previousIdentity); setPrivacySettings(previousPrivacy); } catch (_) {}
          throw writeError;
        }
        applyPersonalDisplay(document);
        refreshCleanPersonalDisplay();
        syncPrivacySettingsUI(panel);
        setPrivacySettingsStatus(panel, '隐私与显示设置已保存');
      } catch (e) {
        setPrivacySettingsStatus(panel, e && e.message || String(e), true);
      }
    });
  }

  function setScheduleJsonSettingsStatus(panel, message, error) {
    const status = panel && panel.querySelector('#urppp-set-json-status');
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('urppp-status-error', !!error);
    status.style.color = error ? 'var(--danger,#b91c1c)' : 'var(--text-muted)';
  }

  function syncScheduleJsonSettingsUI(panel, force) {
    if (!panel) return;
    const settings = getScheduleJsonFormatSettings();
    const toggle = panel.querySelector('#urppp-set-json-custom');
    const editor = panel.querySelector('#urppp-set-json-editor');
    const textarea = panel.querySelector('#urppp-set-json-mapping');
    if (toggle) {
      toggle.classList.toggle('ac', settings.enabled);
      toggle.setAttribute('aria-pressed', settings.enabled ? 'true' : 'false');
      toggle.textContent = '自定义 JSON：' + (settings.enabled ? '开' : '关');
    }
    if (editor) editor.style.display = settings.enabled ? 'grid' : 'none';
    if (textarea && (force || (!panel.__urpppJsonMappingDirty && document.activeElement !== textarea))) {
      textarea.value = JSON.stringify(settings.mapping, null, 2);
      panel.__urpppJsonMappingDirty = false;
    }
    if (scheduleJsonFormatRecoveryMessage) setScheduleJsonSettingsStatus(panel, scheduleJsonFormatRecoveryMessage, true);
  }

  function bindScheduleJsonSettingsUI(panel) {
    if (!panel || panel.__urpppJsonSettingsBound) return;
    panel.__urpppJsonSettingsBound = true;
    const toggle = panel.querySelector('#urppp-set-json-custom');
    const textarea = panel.querySelector('#urppp-set-json-mapping');
    const save = panel.querySelector('#urppp-set-json-save');
    const reset = panel.querySelector('#urppp-set-json-reset');
    if (textarea) textarea.addEventListener('input', () => { panel.__urpppJsonMappingDirty = true; });
    if (toggle) toggle.addEventListener('click', () => {
      const settings = getScheduleJsonFormatSettings();
      settings.enabled = !settings.enabled;
      const hadDraft = !!panel.__urpppJsonMappingDirty;
      setScheduleJsonFormatSettings(settings);
      syncScheduleJsonSettingsUI(panel, false);
      const message = settings.enabled ? '已启用自定义 JSON 格式' : '已恢复小爱课程兼容格式';
      setScheduleJsonSettingsStatus(panel, hadDraft ? message + '；未保存草稿已保留' : message);
    });
    if (save) save.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(String(textarea && textarea.value || '').trim());
        const settings = getScheduleJsonFormatSettings();
        settings.mapping = validateScheduleJsonMapping(parsed);
        setScheduleJsonFormatSettings(settings);
        panel.__urpppJsonMappingDirty = false;
        syncScheduleJsonSettingsUI(panel, true);
        setScheduleJsonSettingsStatus(panel, '自定义 JSON 映射已保存');
      } catch (error) {
        setScheduleJsonSettingsStatus(panel, error && error.message || String(error), true);
      }
    });
    if (reset) reset.addEventListener('click', () => {
      const settings = getScheduleJsonFormatSettings();
      settings.mapping = validateScheduleJsonMapping(DEFAULT_SCHEDULE_JSON_MAPPING);
      setScheduleJsonFormatSettings(settings);
      panel.__urpppJsonMappingDirty = false;
      syncScheduleJsonSettingsUI(panel, true);
      setScheduleJsonSettingsStatus(panel, '已恢复默认字段映射');
    });
  }

  function syncSettingsPanelUI() {
    const panel = document.getElementById('urppp-settings-panel');
    if (!panel) return;
    const seed = getAccent() || DEFAULT_SEED;
    const scheme = getScheme();
    const ct = getCurrent();
    const follow = isThemeFollowSystem();
    const colorInput = panel.querySelector('#urppp-set-color');
    const hexInput = panel.querySelector('#urppp-set-hex');
    if (colorInput) colorInput.value = seed;
    if (hexInput) hexInput.value = seed;

    const skinId = getSkin();
    const darkOk = skinSupportsDark(skinId);
    const dynOk = skinSupportsDynamic(skinId);
    const hasFixedPalettes = skinSupportsFixedPalettes(skinId);
    panel.querySelectorAll('.urppp-set-mode').forEach((btn) => {
      const theme = btn.dataset.theme;
      const available = isThemeModeAvailable(theme, skinId);
      const on = !follow && theme === ct && available;
      btn.disabled = !available;
      btn.classList.toggle('ac', on);
      btn.classList.toggle('urppp-dyn-disabled', !available);
      btn.setAttribute('aria-disabled', available ? 'false' : 'true');
      if (!available) {
        btn.title = theme === 'dark'
          ? '当前界面风格不支持暗色模式'
          : '当前界面风格不支持动态配色';
      } else {
        btn.removeAttribute('title');
      }
    });
    const followBtn = panel.querySelector('#urppp-set-follow');
    if (followBtn) {
      followBtn.disabled = !darkOk;
      followBtn.classList.toggle('ac', follow && darkOk);
      followBtn.classList.toggle('urppp-dyn-disabled', !darkOk);
      followBtn.setAttribute('aria-pressed', follow && darkOk ? 'true' : 'false');
      followBtn.textContent = follow && darkOk ? '跟随系统：开' : '跟随系统：关';
      followBtn.title = darkOk ? '' : '当前界面风格不支持暗色模式';
    }
    const dynFollowBtn = panel.querySelector('#urppp-set-follow-dynamic');
    const useDyn = isFollowUseDynamic();
    if (dynFollowBtn) {
      dynFollowBtn.classList.toggle('ac', useDyn && dynOk);
      dynFollowBtn.setAttribute('aria-pressed', (useDyn && dynOk) ? 'true' : 'false');
      dynFollowBtn.textContent = useDyn ? '浅色用动态配色：开' : '浅色用动态配色：关';
      dynFollowBtn.disabled = !follow || !dynOk;
      dynFollowBtn.classList.toggle('urppp-dyn-disabled', !dynOk);
      dynFollowBtn.style.opacity = (!dynOk) ? '0.5' : (follow ? '1' : '0.5');
      dynFollowBtn.title = dynOk ? '' : '当前界面风格不支持动态配色';
    }
    const dynSec = panel.querySelector('#urppp-set-dynamic');
    if (dynSec) {
      dynSec.style.display = hasFixedPalettes ? 'none' : '';
      dynSec.classList.toggle('urppp-dyn-disabled', !dynOk);
      dynSec.querySelectorAll('button, input, .urppp-set-scheme, .urppp-set-swatch').forEach((el) => {
        el.disabled = !dynOk;
        el.classList.toggle('urppp-dyn-disabled', !dynOk);
      });
      dynSec.querySelectorAll('h3, .urppp-set-tip, label').forEach((el) => {
        el.classList.toggle('urppp-dyn-disabled', !dynOk);
      });
    }
    const brutalSec = panel.querySelector('#urppp-set-brutal');
    if (brutalSec) brutalSec.style.display = hasFixedPalettes ? '' : 'none';
    if (hasFixedPalettes) renderBrutalPaletteCards(panel);
    const cleanDefBtn = panel.querySelector('#urppp-set-clean-default');
    if (cleanDefBtn) {
      const on = isCleanDefault();
      cleanDefBtn.classList.toggle('ac', on);
      cleanDefBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      cleanDefBtn.textContent = on ? '默认进入清爽模式：开' : '默认进入清爽模式：关';
    }
    const appleEdgeBtn = panel.querySelector('#urppp-set-apple-edge');
    const appleEdgeTip = panel.querySelector('#urppp-set-apple-edge-tip');
    if (appleEdgeBtn) {
      const isApple = getSkin() === 'apple';
      appleEdgeBtn.style.display = isApple ? '' : 'none';
      if (appleEdgeTip) appleEdgeTip.style.display = isApple ? '' : 'none';
      if (isApple) {
        const on = isAppleEdgeLine();
        appleEdgeBtn.classList.toggle('ac', on);
        appleEdgeBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        appleEdgeBtn.textContent = on ? '类Apple边缘线条：开' : '类Apple边缘线条：关';
      }
    }
    const autoUpBtn = panel.querySelector('#urppp-set-auto-update');
    if (autoUpBtn) {
      const on = isAutoUpdateCheck();
      autoUpBtn.classList.toggle('ac', on);
      autoUpBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      autoUpBtn.textContent = on ? '自动检测更新：开' : '自动检测更新：关';
    }
    try { syncPrivacySettingsUI(panel); } catch (_) {}
    try { syncScheduleJsonSettingsUI(panel); } catch (_) {}
    // 跟随系统时动态区仍可配置（浅色会用到）
    const dyn = panel.querySelector('#urppp-set-dynamic');
    if (dyn) dyn.style.opacity = '1';

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

  function openSettingsPanel() {
    return settingsPanelController.open();
  }

  function closeSettingsPanel() {
    settingsPanelController.close();
  }


  const URPPP_ABOUT_LOGO_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=';
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
    try { applySkinAttr(); } catch (_) {}
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
    panel.querySelectorAll('.urppp-set-mode').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!isThemeModeAvailable(btn.dataset.theme)) return;
        applyTheme(btn.dataset.theme, { manual: true });
        syncSettingsPanelUI();
      });
    });
    const followBtn = panel.querySelector('#urppp-set-follow');
    if (followBtn) {
      followBtn.addEventListener('click', () => {
        if (!skinSupportsDark()) return;
        const next = !isThemeFollowSystem();
        setThemeFollowSystem(next);
        if (next) applyTheme(resolveFollowThemeName(), { system: true });
        else applyTheme(getCurrent(), { manual: true });
        syncSettingsPanelUI();
        syncNavbarThemeUI();
      });
    }
    const dynFollowBtn = panel.querySelector('#urppp-set-follow-dynamic');
    if (dynFollowBtn) {
      dynFollowBtn.addEventListener('click', () => {
        if (!skinSupportsDynamic()) return;
        if (!isThemeFollowSystem()) {
          setThemeFollowSystem(true);
          setFollowUseDynamic(true);
        } else {
          setFollowUseDynamic(!isFollowUseDynamic());
        }
        applyTheme(resolveFollowThemeName(), { system: true });
        syncSettingsPanelUI();
        syncNavbarThemeUI();
      });
    }
    const cleanDefBtn = panel.querySelector('#urppp-set-clean-default');
    if (cleanDefBtn) {
      cleanDefBtn.addEventListener('click', () => {
        setCleanDefault(!isCleanDefault());
        syncSettingsPanelUI();
      });
    }
    const appleEdgeBtn = panel.querySelector('#urppp-set-apple-edge');
    if (appleEdgeBtn) {
      appleEdgeBtn.addEventListener('click', () => {
        setAppleEdgeLine(!isAppleEdgeLine());
        try { applySkinAttr(); } catch (_) {}
        syncSettingsPanelUI();
      });
    }
    const autoUpBtn = panel.querySelector('#urppp-set-auto-update');
    if (autoUpBtn) {
      autoUpBtn.addEventListener('click', () => {
        setAutoUpdateCheck(!isAutoUpdateCheck());
        syncSettingsPanelUI();
      });
    }
    const checkUpdateBtn = panel.querySelector('#urppp-set-check-update');
    if (checkUpdateBtn && !checkUpdateBtn.__urpppBound) {
      checkUpdateBtn.__urpppBound = true;
      checkUpdateBtn.addEventListener('click', () => { checkForUpdates(); });
    }
    const colorInput = panel.querySelector('#urppp-set-color');
    const hexInput = panel.querySelector('#urppp-set-hex');
    colorInput.addEventListener('input', () => {
      hexInput.value = colorInput.value.toUpperCase();
    });
    hexInput.addEventListener('change', () => {
      const h = normalizeHexColor(hexInput.value);
      if (h) {
        hexInput.value = h;
        colorInput.value = h;
      }
    });
    panel.querySelector('#urppp-set-gen').addEventListener('click', () => {
      const h = normalizeHexColor(hexInput.value) || colorInput.value;
      if (!h) return;
      GM_setValue(ACCENT_KEY, normalizeHexColor(h));
      if (isThemeFollowSystem()) applyTheme(resolveFollowThemeName(), { system: true });
      else applyTheme('scu-red', { manual: true });
      syncSettingsPanelUI();
    });
    panel.querySelector('#urppp-set-save').addEventListener('click', () => {
      const h = normalizeHexColor(hexInput.value) || colorInput.value;
      if (!h) return;
      saveAccentPreset(h);
      GM_setValue(ACCENT_KEY, normalizeHexColor(h));
      if (isThemeFollowSystem()) applyTheme(resolveFollowThemeName(), { system: true });
      else applyTheme('scu-red', { manual: true });
      syncSettingsPanelUI();
    });
    colorInput.addEventListener('change', () => {
      const h = normalizeHexColor(colorInput.value);
      if (!h) return;
      hexInput.value = h;
      const schemes = panel.querySelector('#urppp-set-schemes');
      if (!schemes) return;
      const curScheme = getScheme();
      schemes.innerHTML = '';
      listSchemePreviews(h).forEach((item) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'urppp-set-scheme' + (item.id === curScheme ? ' ac' : '');
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
          GM_setValue(ACCENT_KEY, h);
          setScheme(item.id);
          if (isThemeFollowSystem()) applyTheme(resolveFollowThemeName(), { system: true });
          else applyTheme('scu-red', { manual: true });
          syncSettingsPanelUI();
        });
        schemes.appendChild(card);
      });
    });
  }

  function renderSkinCards(panel) {
    if (!panel) return;
    const list = panel.querySelector('#urppp-skin-list');
    if (!list) return;
    const cur = getSkin();
    list.innerHTML = '';
    if (!SKIN_CATALOG || !SKIN_CATALOG.length) {
      list.innerHTML = '<p class="urppp-set-tip">暂无可用风格</p>';
      return;
    }
    SKIN_CATALOG.forEach((skin) => {
      const card = document.createElement('div');
      card.className = 'urppp-skin-card' + (skin.id === cur ? ' is-active' : '');
      card.dataset.skin = skin.id;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'urppp-skin-apply';
      if (skin.id === cur && skin.ready) {
        btn.classList.add('is-current');
        btn.textContent = '使用中';
        btn.disabled = true;
      } else if (!skin.ready) {
        btn.classList.add('is-disabled');
        btn.textContent = '应用主题';
      } else {
        btn.textContent = '应用主题';
      }
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!skin.ready) {
          try {
            if (window.__urpppUpdate && typeof window.__urpppUpdate.showUpdateToast === 'function') {
              /* noop */
            }
          } catch (_) {}
          const old = btn.textContent;
          btn.textContent = '开发中';
          setTimeout(() => { btn.textContent = old; }, 1200);
          return;
        }
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
      list.appendChild(card);
    });
  }

  // ===================== 检查更新（主插件 + 可扩展） =====================
  const __urpppUpdateCheckers = [];
  let __urpppUpdateBusy = false;

  function fetchTextForUpdate(url) {
    return new Promise((resolve, reject) => {
      const done = (ok, val) => (ok ? resolve(val) : reject(new Error(val || 'fetch failed')));
      try {
        if (typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest({
            method: 'GET',
            url,
            timeout: 15000,
            headers: { 'Cache-Control': 'no-cache' },
            onload: (r) => {
              if (r.status >= 200 && r.status < 400) done(true, r.responseText || '');
              else done(false, 'HTTP ' + r.status);
            },
            onerror: () => done(false, 'network error'),
            ontimeout: () => done(false, 'timeout')
          });
          return;
        }
      } catch (_) {}
      fetch(url, { cache: 'no-store' })
        .then((r) => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        })
        .then((t) => done(true, t))
        .catch((e) => done(false, e && e.message));
    });
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
    const remoteSource = await fetchTextForUpdate(URPPP_UPDATE.mainRaw);
    const remote = parseUserscriptVersion(remoteSource);
    if (!remote) throw new Error('无法解析远程主插件版本');
    const cmp = compareVersions(remote, local);
    return {
      id: 'main',
      name: '主插件',
      local,
      remote,
      status: cmp > 0 ? 'update' : (cmp === 0 ? 'latest' : 'ahead'),
      updateUrl: URPPP_UPDATE.mainRaw,
      pageUrl: URPPP_UPDATE.greasySearch
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
              md = await fetchTextForUpdate(URPPP_UPDATE.changelogRaw);
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
    // 仅限制“同一次页面生命周期”不重复请求；刷新 / 重新进入会再检再弹
    if (window.__urpppAutoUpdateTried) return;
    window.__urpppAutoUpdateTried = true;
    try {
      const r = await checkMainUpdate();
      if (r && r.status === 'update') {
        showUpdateToast(r);
      }
    } catch (e) {
      // 静默失败，不打扰
      try { console.debug('[URP++] auto update check failed', e); } catch (_) {}
    }
  }

  async function checkForUpdates() {
    if (__urpppUpdateBusy) return;
    __urpppUpdateBusy = true;
    const btn = document.getElementById('urppp-set-check-update');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '检查中…';
    }
    setUpdateStatus('正在从 GitHub 检查更新…');
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
          const link = r.updateUrl
            ? ` <a href="${escapeHtml(r.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`
            : '';
          const page = r.pageUrl
            ? ` <a href="${escapeHtml(r.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`
            : '';
          return `• <b>${escapeHtml(r.name)}</b>：发现新版本 <b>${escapeHtml(r.remote)}</b>（当前 ${escapeHtml(r.local)}）${link}${page}`;
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

  function injectNavbarThemeSwitch() {
    try {
      const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
      if (!navbar) return;
      if (document.getElementById('urppp-nav-theme')) {
        syncNavbarThemeUI();
        return;
      }
      const brand =
        navbar.querySelector('.navbar-header .navbar-brand') ||
        navbar.querySelector('.navbar-brand') ||
        navbar.querySelector('.navbar-header');
      if (!brand) return;

      const wrap = document.createElement('div');
      wrap.id = 'urppp-nav-theme';
      wrap.innerHTML = [
        '<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>',
        '<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>',
        '<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>',
        '<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">',
        '  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
        '    <circle cx="12" cy="12" r="3"></circle>',
        '    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
        '  </svg>',
        '</button>'
      ].join('');

      if (brand.parentElement) {
        brand.parentElement.style.setProperty('display', 'flex', 'important');
        brand.parentElement.style.setProperty('align-items', 'center', 'important');
        if (brand.nextSibling) brand.parentElement.insertBefore(wrap, brand.nextSibling);
        else brand.parentElement.appendChild(wrap);
      } else {
        brand.appendChild(wrap);
      }
      wrap.style.setProperty('display', 'inline-flex', 'important');
      wrap.style.setProperty('align-items', 'center', 'important');
      wrap.style.setProperty('height', '36px', 'important');

      wrap.querySelectorAll('.urppp-nav-dot[data-theme]').forEach((dot) => {
        dot.addEventListener('click', () => {
          handleThemeDotClick(dot.dataset.theme);
          syncNavbarThemeUI();
          try { syncSettingsPanelUI(); } catch (_) {}
        });
      });
      wrap.querySelector('#urppp-nav-settings').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSettingsPanel();
      });

      ensureSettingsPanel();
      syncNavbarThemeUI();
      try { if (window.__urpppCleanMode) window.__urpppCleanMode.inject(); } catch (_) {}
    } catch (err) {
      console.warn('[URP++] navbar theme switch inject failed', err);
    }
  }

  function rebuildNavbar() {
    const navbar = document.getElementById('navbar');
    const aceNav = navbar?.querySelector('.ace-nav');
    // 主题切换不依赖 ace-nav，尽早注入
    try { injectNavbarThemeSwitch(); } catch (_) {}
    if (!aceNav) return;

    function force(el, styles) {
      Object.entries(styles).forEach(([k, v]) => el.style.setProperty(k, v, 'important'));
    }

    // 1. 统一所有 li 和 a 的容器样式；移除 ace-nav 中的空白文本节点消除 inline 间距
    Array.from(aceNav.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
        node.remove();
      }
    });
    aceNav.querySelectorAll(':scope > li').forEach(li => {
      force(li, {
        display: 'inline-flex',
        'align-items': 'center',
        'vertical-align': 'middle',
        margin: '0',
        padding: '0',
        'text-align': 'left'
      });
    });

    aceNav.querySelectorAll(':scope > li > a').forEach(a => {
      force(a, {
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        height: '36px',
        padding: '0 4px',
        'flex-wrap': 'nowrap',
        'vertical-align': 'middle',
        'text-decoration': 'none'
      });
      a.style.lineHeight = '1';
    });

    // 2. 图标统一
    aceNav.querySelectorAll(':scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa').forEach(icon => {
      force(icon, { top: 'auto', 'vertical-align': 'middle', 'line-height': '1', 'margin-top': '0' });
    });

    // 客服图标所在的 a 标签保持最小宽度
    const serviceLink = aceNav.querySelector(':scope > li > a[href*="customerServiceCenter"]');
    if (serviceLink) {
      force(serviceLink, { width: '28px', 'justify-content': 'center' });
      serviceLink.style.padding = '0 4px';
    }

    // 3. 搜索区域（事件只绑定一次）
    const clickDiv = document.getElementById('clickdiv');
    const formSearch = document.getElementById('form-search');
    const searchInput = document.getElementById('search-input');
    const intelDiv = document.getElementById('intellegenceUDiv');
    if (intelDiv) {
      intelDiv.style.setProperty('position', 'relative', 'important');
      intelDiv.style.setProperty('z-index', '30', 'important');
      intelDiv.style.setProperty('display', 'inline-flex', 'important');
      intelDiv.style.setProperty('align-items', 'center', 'important');
      intelDiv.style.setProperty('justify-content', 'center', 'important');
      intelDiv.style.setProperty('width', '32px', 'important');
      intelDiv.style.setProperty('height', '36px', 'important');
      intelDiv.style.setProperty('vertical-align', 'middle', 'important');
      intelDiv.style.setProperty('margin', '0', 'important');
      intelDiv.style.setProperty('padding', '0', 'important');
    }

    if (clickDiv && formSearch) {
      clickDiv.removeAttribute('onclick');
      force(clickDiv, {
        'background-color': 'transparent',
        position: 'relative',
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        width: '32px',
        height: '32px',
        'border-radius': '8px',
        'line-height': '1',
        'z-index': '30'
      });

      const clicki = document.getElementById('clicki');
      if (clicki) force(clicki, { color: 'var(--text-secondary)', 'margin-top': '0' });

      if (!clickDiv.__urpppNavbarClickBound) {
        clickDiv.__urpppNavbarClickBound = true;
        clickDiv.addEventListener('mouseenter', () => clickDiv.style.setProperty('background-color', 'var(--input-bg)', 'important'));
        clickDiv.addEventListener('mouseleave', () => clickDiv.style.setProperty('background-color', 'transparent', 'important'));

        clickDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = formSearch.dataset.open === '1';
          if (isOpen) {
            formSearch.style.width = '0px';
            formSearch.style.opacity = '0';
            formSearch.dataset.open = '0';
          } else {
            formSearch.style.width = '180px';
            formSearch.style.opacity = '1';
            formSearch.dataset.open = '1';
            if (searchInput) setTimeout(() => searchInput.focus(), 50);
          }
        });
      }

      if (!window.__urpppNavbarOutsideClickBound) {
        window.__urpppNavbarOutsideClickBound = true;
        document.addEventListener('click', (e) => {
          const activeClickDiv = document.getElementById('clickdiv');
          const activeFormSearch = document.getElementById('form-search');
          if (!activeClickDiv || !activeFormSearch || activeFormSearch.dataset.open !== '1') return;
          if (!activeClickDiv.contains(e.target) && !activeFormSearch.contains(e.target)) {
            activeFormSearch.style.width = '0px';
            activeFormSearch.style.opacity = '0';
            activeFormSearch.dataset.open = '0';
          }
        });
      }

      // 定位：紧贴搜索按钮左侧，按钮本身 32px，搜索框 160px
      force(formSearch, {
        position: 'absolute',
        right: '34px',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 'auto',
        margin: '0',
        'z-index': '10',
        background: 'transparent',
        border: 'none',
        'box-shadow': 'none',
        overflow: 'hidden',
        padding: '0',
        transition: 'width .2s ease, opacity .2s ease'
      });
      // 注意：不要在 force 里覆盖 width/opacity，否则会打断正在进行的 transition
      const targetWidth = formSearch.dataset.open === '1' ? '160px' : '0px';
      if (formSearch.style.width !== targetWidth) {
        formSearch.style.width = targetWidth;
        formSearch.style.opacity = formSearch.dataset.open === '1' ? '1' : '0';
      }

      if (searchInput) {
        force(searchInput, {
          'background-color': 'var(--input-bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          'border-radius': '8px',
          height: '32px',
          padding: '0 12px',
          'line-height': '32px',
          width: '100%'
        });
      }

      const innerIcon = formSearch.querySelector('.input-icon > .ace-icon.fa-search');
      if (innerIcon) innerIcon.style.display = 'none';
    }

    // 4. 用户项强制对齐
    const userLink = aceNav.querySelector(':scope > li.light-blue > a');
    if (userLink) {
      force(userLink, { display: 'inline-flex', 'align-items': 'center', gap: '6px' });
      const info = userLink.querySelector('.user-info');
      if (info) {
        force(info, {
          display: 'inline-flex',
          'align-items': 'center',
          gap: '4px',
          'max-width': 'none',
          'white-space': 'nowrap',
          'vertical-align': 'middle',
          'line-height': '1',
          'margin-top': '-12px'
        });
        // 移除文本节点中的多余空白
        Array.from(info.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\s+/g, '').trim();
        });
        Array.from(info.children).forEach(child => {
          force(child, { display: 'inline', 'white-space': 'nowrap', 'vertical-align': 'middle', 'line-height': '1', margin: '0', padding: '0' });
          if (child.tagName === 'SMALL') child.style.setProperty('font-size', 'inherit', 'important');
        });
      }
      const photo = userLink.querySelector('.nav-user-photo');
      if (photo) {
        photo.alt = (photo.alt || '').replace(/\s+/g, '').trim();
        force(photo, { 'vertical-align': 'middle', display: 'inline-block', width: '30px', height: '30px' });
      }
    }
  }

  // ============================================================
  // 侧边栏完全重构（Hanako 风格）
  // ============================================================



  function syncMobileContentOffset() {
    try {
      const sidebar = document.getElementById('sidebar');
      const mains = document.querySelectorAll('.main-content');
      if (!mains.length) return;
      const narrow = window.matchMedia && window.matchMedia('(max-width: 991px)').matches;
      let ml = '260px';
      if (narrow) {
        // 小屏侧栏是覆盖层，内容始终贴左
        ml = '0px';
      } else if (sidebar) {
        // 桌面：只跟 menu-min / 展开走
        ml = sidebar.classList.contains('menu-min') ? '50px' : '260px';
      }
      mains.forEach((el) => el.style.setProperty('margin-left', ml, 'important'));
    } catch (_) { /* ignore */ }
  }
  function syncSidebarUnderNavbar() {
    try {
      const sidebar = document.getElementById('sidebar');
      const navbar = document.querySelector('#navbar, .navbar.navbar-default, .navbar-fixed-top');
      if (!sidebar || !navbar) return;
      // 用底边实测，避免 min-height 与真实高度不一致
      const rect = navbar.getBoundingClientRect();
      const nh = Math.max(45, Math.round(rect.height || navbar.offsetHeight || 45));
      document.documentElement.style.setProperty('--urppp-navbar-height', nh + 'px');
      sidebar.style.setProperty('top', nh + 'px', 'important');
      sidebar.style.setProperty('height', 'calc(100vh - ' + nh + 'px)', 'important');
      sidebar.style.setProperty('margin-top', '0', 'important');
      // 顶栏压过侧栏
      navbar.style.setProperty('z-index', '1100', 'important');
      sidebar.style.setProperty('z-index', '1030', 'important');
      syncMobileContentOffset();
    } catch (_) { /* ignore */ }
  }
  function rebuildSidebarCompletely() {
    const sidebar = document.getElementById('sidebar');
    const origMenus = document.getElementById('menus');
    if (!sidebar || !origMenus) return;

    if (window.__urpppSidebarMenuObserver) {
      try { window.__urpppSidebarMenuObserver.disconnect(); } catch (_) {}
      window.__urpppSidebarMenuObserver = null;
    }

    // 先清理旧的（可能从 PJAX 残留）
    const oldMenus = document.getElementById('urppp-menus');
    const oldHeader = sidebar.querySelector('.urppp-sidebar-header');
    if (oldMenus) oldMenus.remove();
    if (oldHeader) oldHeader.remove();

    // 读取顶栏高度并同步：侧栏顶边紧贴顶栏底边
    syncSidebarUnderNavbar();

    // 记录原 active 状态
    const activeIds = new Set();
    origMenus.querySelectorAll('li.active').forEach(li => { if (li.id) activeIds.add(li.id); });

    function parseMenu(ul) {
      return Array.from(ul.children).filter(li => li.tagName === 'LI').map(li => {
        const a = li.querySelector(':scope > a');
        const textEl = a?.querySelector('.menu-text');
        const text = textEl
          ? textEl.textContent.trim()
          : (a ? Array.from(a.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim() : '');
        const iconEl = a?.querySelector('.menu-icon');
        const iconClass = iconEl ? Array.from(iconEl.classList).filter(c => c !== 'menu-icon').join(' ') : '';
        const submenu = li.querySelector(':scope > .submenu');
        let children = submenu ? parseMenu(submenu) : [];
        // 过滤空壳子节点（无文字且无有效 href）
        children = children.filter(c => c.text && (c.text.trim() || (c.href && c.href !== '#')));
        const href = a?.getAttribute('href') || '#';
        const onclick = li.getAttribute('onclick') || a?.getAttribute('onclick') || '';
        const id = li.id;
        // 有真实 href 的节点：忽略子菜单，直接当叶子
        if (href !== '#' && !href.startsWith('javascript')) {
          return { id, text, iconClass, children: [], href, onclick };
        }

        // 单叶子子菜单提升：父节点直接变成跳转节点，不再展开
        if (children.length === 1 && children[0].children.length === 0) {
          return {
            id: id || children[0].id,
            text,
            iconClass: iconClass || children[0].iconClass,
            children: [],
            href: children[0].href || href,
            onclick: children[0].onclick || onclick
          };
        }
        return { id, text, iconClass, children, href, onclick };
      });
    }

    const menuData = parseMenu(origMenus);
    origMenus.style.display = 'none';

    // Header + toggle
    const header = document.createElement('div');
    header.className = 'urppp-sidebar-header';
    header.style.cssText = 'position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)';
    const toggle = document.createElement('div');
    toggle.className = 'urppp-sidebar-toggle';
    toggle.innerHTML = '<i class="fa fa-angle-left"></i>';
    toggle.title = '收起侧边栏';
    const doToggle = () => {
      const origToggle = document.getElementById('sidebar-collapse');
      if (origToggle) origToggle.click();
    };
    toggle.addEventListener('click', doToggle);
    header.appendChild(toggle);

    // 监听折叠状态，切换箭头
    const observer = new MutationObserver(() => {
      const isMin = document.body.classList.contains('menu-min') || sidebar.classList.contains('menu-min');
      toggle.innerHTML = isMin ? '<i class="fa fa-angle-right"></i>' : '<i class="fa fa-angle-left"></i>';
      toggle.title = isMin ? '展开侧边栏' : '收起侧边栏';
      if (isMin) {
        header.style.justifyContent = 'center';
        header.style.padding = '12px 0';
      } else {
        header.style.justifyContent = 'flex-end';
        header.style.padding = '';
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    window.__urpppSidebarMenuObserver = observer;

    const newMenus = document.createElement('ul');
    newMenus.id = 'urppp-menus';
    newMenus.style.cssText = 'margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)';

    function setActiveBranch(li) {
      document.querySelectorAll('#urppp-menus .urppp-nav-item').forEach(el => el.classList.remove('active'));
      let p = li;
      while (p && p.id !== 'urppp-menus') {
        if (p.classList.contains('urppp-nav-item')) p.classList.add('active');
        p = p.parentElement;
      }
    }

    function openActiveBranch(li) {
      let p = li.parentElement;
      while (p && p.id !== 'urppp-menus') {
        if (p.classList.contains('urppp-nav-item')) p.classList.add('open');
        p = p.parentElement;
      }
    }

    function buildItem(item, container) {
      const li = document.createElement('li');
      li.className = 'urppp-nav-item';
      if (item.id) li.id = item.id;

      const hasSub = item.children.length > 0;
      const href = item.href || '#';
      const hasRealHref = href !== '#' && !href.startsWith('javascript');
      // 有真实 href 或有子菜单时都用 a 标签
      const link = document.createElement('a');
      link.className = 'urppp-nav-link';
      link.href = hasRealHref ? href : 'javascript:void(0)';

      if (item.iconClass) {
        const icon = document.createElement('i');
        item.iconClass.split(' ').forEach(c => { if (c) icon.classList.add(c); });
        link.appendChild(icon);
      }

      const text = document.createElement('span');
      text.className = 'urppp-nav-text';
      text.textContent = item.text;
      text.title = item.text;
      link.appendChild(text);

      if (hasSub) {
        const arrow = document.createElement('i');
        arrow.className = 'urppp-nav-arrow fa fa-angle-down';
        arrow.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('open');
        });
        link.appendChild(arrow);
      }

      li.appendChild(link);

      link.addEventListener('click', (e) => {
        setActiveBranch(li);
        if (!hasRealHref && hasSub) {
          // 无真实 href 的父节点：点击 toggle
          e.preventDefault();
          li.classList.toggle('open');
        } else if (hasRealHref) {
          // 有真实 href 且点击的不是箭头：跳转
          return;
        }
      });

      if (hasSub) {
        const sub = document.createElement('ul');
        sub.className = 'urppp-nav-submenu';
        item.children.forEach(child => buildItem(child, sub));
        li.appendChild(sub);
      }

      if (item.id && activeIds.has(item.id)) {
        li.classList.add('active');
        // 不再默认展开 active 分支，保持侧边栏整洁
      }

      container.appendChild(li);
    }

    menuData.forEach(item => buildItem(item, newMenus));
    // 强制清除所有 open 状态，避免默认展开
    newMenus.querySelectorAll('.urppp-nav-item.open').forEach(li => li.classList.remove('open'));

    sidebar.insertBefore(header, sidebar.firstChild);
    sidebar.appendChild(newMenus);
  }

  // ============================================================
  // 首页仪表板重构
  // ============================================================



  function bindScheduleHoverNearCursor() {
    if (window.__urpppScheduleHoverNear) return;
    window.__urpppScheduleHoverNear = true;

    // 固定右下偏移，不做左右翻转，避免「闪一下从左跳到右」
    const OFFSET_X = 12;
    const OFFSET_Y = 16;
    let lastX = 0;
    let lastY = 0;
    let visible = false;
    let raf = 0;

    const hoverEl = () => document.getElementById('schedule-hover');

    const isShown = (el) => {
      if (!el) return false;
      // 站点用 display 控制显隐；不要读 getBoundingClientRect 宽高做翻转
      if (el.style && el.style.display === 'none') return false;
      const st = window.getComputedStyle(el);
      return st.display !== 'none' && st.visibility !== 'hidden';
    };

    const place = () => {
      const el = hoverEl();
      if (!el || !isShown(el)) {
        visible = false;
        return;
      }
      visible = true;
      const vw = window.innerWidth || 1200;
      const vh = window.innerHeight || 800;
      // 只 clamp，不翻边，位置连续
      let left = lastX + OFFSET_X;
      let top = lastY + OFFSET_Y;
      // 用预估宽高 clamp，避免首次 width=0 再变大导致跳变
      const estW = Math.min(320, el.offsetWidth || 280);
      const estH = Math.min(220, el.offsetHeight || 160);
      if (left + estW > vw - 8) left = vw - estW - 8;
      if (top + estH > vh - 8) top = vh - estH - 8;
      if (left < 8) left = 8;
      if (top < 8) top = 8;

      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('left', Math.round(left) + 'px', 'important');
      el.style.setProperty('top', Math.round(top) + 'px', 'important');
      el.style.setProperty('right', 'auto', 'important');
      el.style.setProperty('bottom', 'auto', 'important');
      el.style.setProperty('margin', '0', 'important');
      el.style.setProperty('z-index', '3000', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
      // 不要强制改 display，交给站点显隐
    };

    const schedulePlace = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        place();
      });
    };

    document.addEventListener('mousemove', (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!visible) {
        // 轻量探测，避免每帧 getComputedStyle
        const el = hoverEl();
        if (el && el.style && el.style.display && el.style.display !== 'none') visible = true;
      }
      if (visible) schedulePlace();
    }, true);

    document.addEventListener('mouseover', (e) => {
      const ev = e.target && e.target.closest
        ? e.target.closest('.fc-event, .fc-time-grid-event')
        : null;
      if (!ev) return;
      lastX = e.clientX;
      lastY = e.clientY;
      // 站点通常在 mouseover 后同步显示弹层
      setTimeout(() => {
        visible = true;
        place();
      }, 0);
      setTimeout(place, 40);
    }, true);

    document.addEventListener('mouseout', (e) => {
      const ev = e.target && e.target.closest
        ? e.target.closest('.fc-event, .fc-time-grid-event')
        : null;
      if (!ev) return;
      // 延后检查，避免移入子节点误判
      setTimeout(() => {
        const el = hoverEl();
        if (!isShown(el)) visible = false;
      }, 50);
    }, true);
  }
  // FullCalendar：迁入首页卡片后只做「一次性」尺寸修复。
  // 绝不能在用户滚动时反复 render/updateSize，否则滚动条会弹回顶部。
  function refreshHomeFullCalendar(opts) {
    try {
      const force = !!(opts && opts.force);
      const $ = (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery)
        ? unsafeWindow.jQuery
        : (window.jQuery || null);
      if (!$ || !$.fn || !$.fn.fullCalendar) return false;

      const host = document.getElementById('main-calendar')
        || document.querySelector('#urppp-left .fc, #urppp-dashboard .fc');
      if (!host) return false;

      // 已完成首测且非强制：直接跳过（保证滚动不被打断）
      if (!force && host.dataset.urpppFcSized === '1') return true;

      const $el = $(host);
      if (!($el.data('fullCalendar') || $el.hasClass('fc'))) return false;

      const scrollers = Array.from(host.querySelectorAll('.fc-scroller'));
      const saved = scrollers.map((s) => ({ el: s, top: s.scrollTop, left: s.scrollLeft }));

      // remount 后只需 render 一次；后续若必须补测只用 updateSize
      if (force || host.dataset.urpppFcRendered !== '1') {
        try { $el.fullCalendar('render'); } catch (_) {}
        host.dataset.urpppFcRendered = '1';
      } else {
        try { $el.fullCalendar('updateSize'); } catch (_) {}
      }

      requestAnimationFrame(() => {
        saved.forEach((s) => {
          try {
            s.el.scrollTop = s.top;
            s.el.scrollLeft = s.left;
          } catch (_) {}
        });
      });

      const h = host.getBoundingClientRect().height || 0;
      // 高度达标后永久停止自动刷新
      if (h >= 300) host.dataset.urpppFcSized = '1';
      return true;
    } catch (err) {
      console.warn('[URP++] fullCalendar refresh failed', err);
      return false;
    }
  }

  function scheduleHomeFullCalendarRefresh() {
    // 每个页面生命周期最多调度一轮，且次数极少
    if (window.__urpppFcRefreshBound) return;
    window.__urpppFcRefreshBound = true;
    // 0ms: DOM 刚迁入；300ms: 布局基本稳定。够了，不要 6~8 次。
    setTimeout(() => refreshHomeFullCalendar({ force: true }), 0);
    setTimeout(() => refreshHomeFullCalendar({ force: false }), 300);
  }

  function rebuildDashboard() {
    try { bindScheduleHoverNearCursor(); } catch (_) {}
    if (document.getElementById('urppp-dashboard')) return;

    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    const widgets = Array.from(pageContent.querySelectorAll('.widget-box'));
    if (widgets.length < 6) return;

    const studyWidget = widgets[4];
    const infoboxes = studyWidget ? Array.from(studyWidget.querySelectorAll('.infobox')) : [];

    const dashboard = document.createElement('div');
    dashboard.id = 'urppp-dashboard';
    dashboard.innerHTML = `
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `;

    pageContent.appendChild(dashboard);

    // 提取 modal 到 body，避免隐藏原始 row 后弹窗失效
    const warningModal = pageContent.querySelector('#warningInfo');
    if (warningModal) document.body.appendChild(warningModal);

    // 隐藏原始 widget 所在的容器列
    widgets.forEach(w => {
      const col = w.closest('.widget-container-col, [class*="col-"]');
      if (col) col.style.display = 'none';
    });
    // 兜底：隐藏 page-content 下直接的一级 row
    pageContent.querySelectorAll(':scope > .row').forEach(row => {
      row.style.display = 'none';
    });

    // 生成学业概览卡片（骨架屏 → 真实数据）
    const statsGrid = dashboard.querySelector('#urppp-stats');
    const skeletonCount = Math.max(infoboxes.length, 5);
    for (let i = 0; i < skeletonCount; i++) {
      const sk = document.createElement('div');
      sk.className = 'urppp-stat-card urppp-stat-skeleton';
      sk.innerHTML = '<div class="value">-</div><div class="label">加载中</div>';
      statsGrid.appendChild(sk);
    }

    function updateStats() {
      const boxes = studyWidget ? Array.from(studyWidget.querySelectorAll('.infobox')) : [];
      if (boxes.length === 0) return;
      statsGrid.innerHTML = '';
      boxes.forEach(box => {
        const lines = box.innerText.trim().split(/\n+/).map(l => l.trim()).filter(l => l);
        const value = lines[0] || '';
        const label = lines.slice(1).join(' ').replace(/更多\.\.\./g, '').trim();
        const isTextValue = /[\u4e00-\u9fa5]/.test(value) || value.length > 5;
        const valueClass = isTextValue ? 'value urppp-stat-value-text' : 'value';
        const link = box.closest('a');
        const card = document.createElement(link ? 'a' : 'div');
        if (link) {
          card.href = link.href || 'javascript:void(0)';
          card.onclick = link.onclick;
          card.style.textDecoration = 'none';
        }
        card.className = 'urppp-stat-card';
        const privacyMarkup = statCardPrivacyMarkup(value, label);
        card.innerHTML = `<div class="${valueClass}">${privacyMarkup.valueHtml}</div><div class="label">${privacyMarkup.labelHtml}</div>`;
        statsGrid.appendChild(card);
      });
    }

    updateStats();

    // 监听学业信息数据异步加载
    if (studyWidget) {
      const statsObserver = new MutationObserver(() => updateStats());
      statsObserver.observe(studyWidget, { childList: true, subtree: true });
      setTimeout(() => statsObserver.disconnect(), 5000);
    }

    // 包装并移动 widget
    const left = dashboard.querySelector('#urppp-left');
    const right = dashboard.querySelector('#urppp-right');

    wrapWidget(widgets[5], left, '我的日程安排');
    wrapWidget(widgets[0], right, '通知公告');
    wrapWidget(widgets[1], right, '我的待办任务');
    wrapWidget(widgets[2], right, '可申请业务');
    wrapWidget(widgets[3], right, '常用下载');

    if (studyWidget) studyWidget.style.display = 'none';

    // FullCalendar 迁入 urppp-card 后补测尺寸（内部会限频，避免滚动弹回）
    scheduleHomeFullCalendarRefresh();

    console.log('[URP++] 首页仪表板已重构');
  }

  function wrapWidget(widget, container, title) {
    const header = widget.querySelector('.widget-header');
    const toolbar = header ? header.querySelector('.widget-toolbar') : null;

    const card = document.createElement('div');
    card.className = 'urppp-card';
    card.innerHTML = `
      <div class="urppp-card-header">
        <h4>${title}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `;

    if (toolbar) {
      toolbar.style.display = 'inline-block';
      card.querySelector('.urppp-card-tools').appendChild(toolbar);
    }
    card.querySelector('.urppp-card-body').appendChild(widget);
    container.appendChild(card);
  }

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

  function validCustomAvatar(value) {
    const src = String(value || '').trim();
    if (src.length > CUSTOM_AVATAR_MAX_LENGTH) return '';
    return /^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(src) ? src : '';
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
    scope.querySelectorAll('#navbar img.nav-user-photo, img#avatar, .profile-picture img').forEach((img) => {
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

  function patchNativeScheduleExport() {
    if (!isPersonalSchedulePage()) return;
    if (document.getElementById('urppp-native-schedule-export')) return;
    const heading = document.querySelector('#h4_id1')?.closest('h4') || document.querySelector('h4.header');
    const actionHost = heading?.querySelector('.right_top_oper') || document.querySelector('#mainDIV .right_top_oper, .page-content .right_top_oper');
    const buttons = Array.from((actionHost || document).querySelectorAll('button, a'));
    const original = buttons.find((button) => {
      const signature = [button.textContent, button.getAttribute('title'), button.getAttribute('onclick')].filter(Boolean).join(' ').replace(/\s+/g, ' ');
      return /导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(signature);
    });
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
  }

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

  function getViewWeekNumber() {
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

  // 若接口带官方绩点，汇总时优先使用
  function summarizeCoursesPreferOfficial(list) {
    // 未评估/-999 一律不计入学分/均分/绩点
    return summarizeCourses(list);
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
        g.summary = summarizeCoursesPreferOfficial(g.courses);
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
      scorePack.passing[0].summary = summarizeCoursesPreferOfficial(scorePack.passing[0].courses);
    }
    scorePack.schemes = (scorePack.schemes || []).map((group) => {
      group.summary = summarizeCoursesPreferOfficial(group.courses);
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

  async function loadScores() {
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
        summary: summarizeCoursesPreferOfficial(allPass),
        groups: passGroups
      }];
      out.schemes = schemeGroups;
      if (!out.schemes.length && allPass.length) {
        out.schemes = [{ title: '方案成绩', courses: allPass, summary: summarizeCoursesPreferOfficial(allPass) }];
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

  function parseOccupancyDoc(doc) {
    const table = doc.getElementById('classroomInfoTable') || doc.querySelector('table.table');
    if (!table) return { rooms: [], dateLabel: '' };
    const dateLabel = ((doc.body.innerText || '').match(/\d{4}-\d{2}-\d{2}[（(][^)）]+[)）]/) || [])[0] || '';
    const rooms = [];
    Array.from(table.rows).forEach((tr) => {
      const ths = tr.querySelectorAll('th');
      if (ths.length < 1) return;
      const roomName = (ths[0].textContent || '').trim();
      if (!/^B?\d|[A-Z]?\d{2,}/.test(roomName) && !/^[A-Za-z]?\d{2,4}/.test(roomName)) {
        // still allow Chinese? skip header rows
        if (/教室|座位数|类型/.test(roomName)) return;
      }
      if (/教室|座位数|类型/.test(roomName)) return;
      const seats = ths[1] ? (ths[1].textContent || '').trim() : '';
      const type = ths[2] ? (ths[2].textContent || '').trim() : '';
      const slots = [];
      tr.querySelectorAll('td.td-b, td[id]').forEach((td) => {
        const idm = String(td.id || '').match(/_(\d+)$/);
        const sec = idm ? parseInt(idm[1], 10) : slots.length + 1;
        const bg = (td.getAttribute('style') || '') + ' ' + (td.style && td.style.backgroundColor || '');
        const busy = /background|rgb\(|#/i.test(bg) && !/transparent|rgba\(0,\s*0,\s*0,\s*0\)/i.test(bg) && td.style.backgroundColor !== '';
        // also check computed from inline style attribute
        const styleAttr = td.getAttribute('style') || '';
        const isBusy = /background-color\s*:\s*(?!transparent)(?!rgba\(0)/i.test(styleAttr);
        slots.push({ section: sec, busy: isBusy || (styleAttr.includes('background') && /rgb|#/i.test(styleAttr)), color: (td.style && td.style.backgroundColor) || '' });
      });
      if (roomName) rooms.push({ name: roomName, seats, type, slots });
    });
    return { rooms, dateLabel };
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

  const state = {
    open: false,
    mobileTab: 'home',
    profile: null,
    schedule: null,
    scores: null,
    catalog: null,
    occupancy: null,
    currentBuilding: null,
    loading: { profile: false, schedule: false, scores: false, room: false },
    roomError: '',
    roomDateOffset: 0, // 0今天 1明天 2后天
    selected: { passing: new Set(), scheme: new Set() },
    activeSchemeIdx: 0,
    _schemeUserSelected: false,
    viewWeek: 0, // 0 = 跟随系统当前周
    weekLocked: false, // 用户手动切周后锁定
    _termWeek: 0,
    _termWeekResolved: false,
    uiReady: false
  };

  function ensureStyle() {
    if (document.getElementById('urppp-clean-style')) return;
    const st = document.createElement('style');
    st.id = 'urppp-clean-style';
    st.textContent = `
#urppp-clean-root{position:fixed;inset:0;z-index:12000;display:none;background:var(--bg,#F4F6F9);color:var(--text,#111);font-family:inherit;opacity:0;transform:translateY(8px);transition:opacity .28s ease,transform .32s cubic-bezier(.22,1,.36,1)}
#urppp-clean-root.open{display:flex;flex-direction:column;opacity:1;transform:none}
#urppp-clean-root *{box-sizing:border-box}
#urppp-clean-root .uc-top{flex:0 0 60px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;border-bottom:1px solid var(--border);background:var(--surface,#fff);animation:ucTopIn .36s cubic-bezier(.22,1,.36,1) both}
#urppp-clean-root .uc-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px}
#urppp-clean-root .uc-top-actions{display:flex;gap:8px}
#urppp-clean-root .uc-btn{height:32px;padding:0 12px;border-radius:10px;border:1px solid var(--border);background:var(--input-bg,#f7f7f8);color:var(--text);font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease,color .18s ease}
#urppp-clean-root .uc-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.06)}
#urppp-clean-root .uc-btn:active{transform:translateY(0) scale(.98);box-shadow:none}
#urppp-clean-root .uc-btn.primary{background:var(--primary);border-color:var(--primary);color:#fff}
#urppp-clean-root .uc-shell{flex:1;min-height:0;overflow:auto;padding:20px 28px 28px;display:flex;align-items:center;justify-content:center}
#urppp-clean-root .uc-shell-inner{max-width:1520px;margin:0 auto;width:100%;max-height:100%;overflow:auto}
#urppp-clean-root .uc-desktop{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr;gap:16px;min-height:640px}
#urppp-clean-root .uc-col{display:flex;flex-direction:column;gap:16px;min-height:0}
#urppp-clean-root .uc-card{background:var(--surface,#fff);border:1px solid var(--border,#e7e7ea);border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04);opacity:0;transform:translateY(14px) scale(.985);animation:ucCardIn .42s cubic-bezier(.22,1,.36,1) forwards;transition:box-shadow .22s ease,transform .22s ease,border-color .22s ease}
#urppp-clean-root .uc-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.06),0 0 0 1px color-mix(in srgb,var(--primary) 8%,var(--border))}
#urppp-clean-root .uc-desktop > .uc-col:first-child > .uc-card:nth-child(1){animation-delay:.04s}
#urppp-clean-root .uc-desktop > .uc-col:first-child > .uc-card:nth-child(2){animation-delay:.1s}
#urppp-clean-root .uc-desktop > .uc-col:last-child > .uc-card:nth-child(1){animation-delay:.07s}
#urppp-clean-root .uc-desktop > .uc-col:last-child > .uc-card:nth-child(2){animation-delay:.13s}
#urppp-clean-root .uc-mobile > .uc-card{animation-delay:.05s}
#urppp-clean-root .uc-mobile > .uc-card:nth-child(2){animation-delay:.1s}
#urppp-clean-root .uc-card.grow{flex:1;min-height:0;display:flex;flex-direction:column}
#urppp-clean-root .uc-hd{padding:12px 14px;border-bottom:1px solid var(--border);font-weight:700;font-size:16px;display:flex;justify-content:space-between;align-items:center}
#urppp-clean-root .uc-bd{padding:14px}
#urppp-clean-root .uc-card.grow .uc-bd{flex:1;overflow:auto}
#urppp-clean-root .uc-profile{display:flex;gap:14px;align-items:center}
#urppp-clean-root .uc-avatar{width:auto;height:72px;max-width:96px;min-width:56px;border-radius:12px;background:var(--input-bg);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:var(--primary);flex:0 0 auto}
#urppp-clean-root .uc-avatar img{height:72px;width:auto;max-width:96px;object-fit:contain;display:block;border-radius:12px}
#urppp-clean-root .uc-name{font-size:18px;font-weight:700;margin:0 0 4px}
#urppp-clean-root .uc-sub{font-size:12px;color:var(--text-secondary,#667085);line-height:1.5}
#urppp-clean-root .uc-gpa{margin-top:6px;display:inline-flex;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,var(--primary) 12%,var(--input-bg));font-weight:700;font-size:13px}
#urppp-clean-root .uc-week{min-width:720px}
#urppp-clean-root .uc-week-head{display:grid;grid-template-columns:36px repeat(7,minmax(0,1fr));gap:6px;margin-bottom:6px}
#urppp-clean-root .uc-week-head .h{font-size:11px;text-align:center;color:var(--text-secondary)}
#urppp-clean-root .uc-week-body{display:grid;grid-template-columns:36px repeat(7,minmax(0,1fr));gap:6px;align-items:start}
#urppp-clean-root .uc-sec-col .s{height:56px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-muted,#98a2b3)}
#urppp-clean-root .uc-day-col{position:relative;height:calc(56px * 12);background:transparent}
#urppp-clean-root .uc-grid-cell{position:absolute;left:0;right:0;height:52px;border-radius:10px;background:var(--input-bg);border:1px solid color-mix(in srgb,var(--border) 65%,transparent)}
#urppp-clean-root .uc-grid-cell:nth-child(n){/* placed via top below in inline? use sequential */}
#urppp-clean-root .uc-day-col .uc-grid-cell{width:100%}
#urppp-clean-root .uc-lesson{position:absolute;left:0;right:0;z-index:2;border:1px solid color-mix(in srgb,var(--primary) 24%,var(--border));border-radius:10px;padding:6px 7px 16px;cursor:pointer;overflow:hidden;box-sizing:border-box;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease;will-change:transform}
#urppp-clean-root .uc-lesson:hover{transform:translateY(-1px) scale(1.01);box-shadow:0 6px 16px rgba(0,0,0,.08);z-index:12!important}
#urppp-clean-root .uc-lesson:active{transform:scale(.99)}
#urppp-clean-root .uc-lesson.is-fade{filter:saturate(.4);z-index:2!important}
#urppp-clean-root .uc-lesson:not(.is-fade){z-index:8}
#urppp-clean-root .uc-lesson b{display:block;font-size:12px;line-height:1.25;font-weight:700}
#urppp-clean-root .uc-lesson i{display:block;font-style:normal;font-size:10px;color:var(--text-secondary);margin-top:3px}
#urppp-clean-root .uc-course-detail{position:relative;padding:4px 2px 8px}
#urppp-clean-root .uc-course-detail .uc-cd-name{font-size:16px;font-weight:700;line-height:1.35;margin:0 0 8px;color:var(--text)}
#urppp-clean-root .uc-course-detail .uc-cd-meta{font-size:13px;color:var(--text-secondary);line-height:1.55;margin:0 0 6px}
#urppp-clean-root .uc-course-detail .uc-cd-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:var(--input-bg);border:1px solid var(--border);font-size:12px;color:var(--text-secondary);margin-top:4px}
#urppp-clean-root .uc-course-sub{margin-top:10px;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--input-bg)}
#urppp-clean-root .uc-course-sub .uc-cd-name{font-size:14px;margin-bottom:4px}
#urppp-clean-root .uc-course-sub.is-fade{opacity:.72}
#urppp-clean-root .uc-week-nav{display:inline-flex;align-items:center;gap:6px}
#urppp-clean-root .uc-week-nav .uc-btn{height:28px;padding:0 10px;font-size:12px}
#urppp-clean-root .uc-week-nav .uc-week-label{min-width:64px;text-align:center;font-size:13px;font-weight:700;color:var(--text)}
#urppp-clean-root .uc-week-nav .uc-week-cur{font-size:11px;color:var(--text-muted);font-weight:500}
#urppp-clean-root .uc-badge{position:absolute;right:5px;bottom:4px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:var(--primary);color:#fff;font-size:10px;line-height:16px;text-align:center;font-weight:700}
#urppp-clean-root .uc-part-line{position:absolute;left:0;right:0;height:0;border-top:2px dashed color-mix(in srgb,var(--primary) 35%,var(--border));z-index:1;pointer-events:none;opacity:.9}
#urppp-clean-root .uc-score-cell{display:inline-flex;align-items:center;justify-content:center;min-width:52px;padding:3px 8px;border-radius:8px;font-weight:700;line-height:1.3}
#urppp-clean-root .uc-score-cell.pass{background:rgba(34,197,94,.18);color:#15803d}
#urppp-clean-root .uc-score-cell.fail{background:rgba(239,68,68,.16);color:#b91c1c}
#urppp-clean-root .uc-score-cell.uneval{background:rgba(59,130,246,.18);color:#1d4ed8;cursor:pointer;text-decoration:none}
#urppp-clean-root .uc-score-cell.uneval-fail{background:rgba(249,115,22,.18);color:#c2410c;cursor:pointer}
#urppp-clean-root .uc-score-cell.uneval:hover,#urppp-clean-root .uc-score-cell.uneval-fail:hover{filter:brightness(1.05);box-shadow:0 0 0 1px color-mix(in srgb,currentColor 35%,transparent)}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.pass,body.urppp-dark #urppp-clean-root .uc-score-cell.pass{background:rgba(34,197,94,.28);color:#86efac}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.fail,body.urppp-dark #urppp-clean-root .uc-score-cell.fail{background:rgba(239,68,68,.28);color:#fca5a5}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.uneval,body.urppp-dark #urppp-clean-root .uc-score-cell.uneval{background:rgba(59,130,246,.28);color:#93c5fd}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.uneval-fail,body.urppp-dark #urppp-clean-root .uc-score-cell.uneval-fail{background:rgba(249,115,22,.28);color:#fdba74}
#urppp-clean-root .uc-namecell{position:relative;padding-left:22px!important}
#urppp-clean-root .uc-selmark{position:absolute;left:6px;top:50%;transform:translateY(-50%);width:14px;height:14px;line-height:14px;text-align:center;font-size:12px;font-weight:700;color:var(--primary);opacity:0}
#urppp-clean-root table.uc-table tbody tr.is-on .uc-selmark{opacity:1}
#urppp-clean-root .uc-cname{display:inline}
#urppp-clean-root .uc-calc{font-size:16px;font-weight:600;color:var(--text);line-height:1.55}
#urppp-clean-root .uc-calc b{font-size:18px;font-weight:800;color:var(--primary);margin:0 2px}
#urppp-clean-root .uc-slot.kind-course{background:#7be0f6;border-color:#4ec8e0;color:#0b3b4a}
#urppp-clean-root .uc-slot.kind-exam{background:#fbb9e1;border-color:#f472b6;color:#831843}
#urppp-clean-root .uc-slot.kind-lab{background:#f5f67b;border-color:#eab308;color:#713f12}
#urppp-clean-root .uc-slot.kind-borrow{background:#90feaa;border-color:#4ade80;color:#14532d}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-course,body.urppp-dark #urppp-clean-root .uc-slot.kind-course{background:#2dd4bf;border-color:#14b8a6;color:#042f2e}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-exam,body.urppp-dark #urppp-clean-root .uc-slot.kind-exam{background:#f472b6;border-color:#db2777;color:#4c0519}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-lab,body.urppp-dark #urppp-clean-root .uc-slot.kind-lab{background:#facc15;border-color:#eab308;color:#422006}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-borrow,body.urppp-dark #urppp-clean-root .uc-slot.kind-borrow{background:#4ade80;border-color:#22c55e;color:#052e16}
#urppp-clean-root .uc-modal-stack-hint{font-size:12px;color:var(--text-muted)}

#urppp-clean-root .uc-card.grow.services{flex:0 0 auto}
#urppp-clean-root .uc-top-theme{display:inline-flex;align-items:center;gap:8px;margin-left:12px}
#urppp-clean-root .uc-top-theme .urppp-nav-dot{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);padding:0;cursor:pointer}
#urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary);box-shadow:0 0 0 3px var(--ring)}
#urppp-clean-root .uc-top-theme .urppp-nav-settings{width:26px;height:26px;border:0;background:transparent;color:var(--text-secondary);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
#urppp-clean-root .uc-top-theme .urppp-nav-settings svg{width:16px;height:16px}
#urppp-clean-root .uc-top-left{display:flex;align-items:center;gap:10px}
#urppp-clean-root .uc-score-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#urppp-clean-root .uc-score-pane{border:1px solid var(--border);border-radius:14px;padding:12px;cursor:pointer;background:var(--input-bg);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease}
#urppp-clean-root .uc-score-pane:hover{border-color:var(--primary);transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.06);background:color-mix(in srgb,var(--primary) 5%,var(--input-bg))}
#urppp-clean-root .uc-score-pane:active{transform:translateY(0) scale(.99)}
#urppp-clean-root .uc-score-pane h5{margin:0 0 10px;font-size:16px;font-weight:700}
#urppp-clean-root .uc-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
#urppp-clean-root .uc-metric{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
#urppp-clean-root .uc-metric:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--primary) 30%,var(--border));box-shadow:0 4px 12px rgba(0,0,0,.04)}
#urppp-clean-root .uc-metric em{display:block;font-style:normal;font-size:13px;color:var(--text-muted);margin-bottom:3px}
#urppp-clean-root .uc-metric b{font-size:20px;display:inline-block;transition:transform .2s ease}
#urppp-clean-root .uc-metric:hover b{transform:scale(1.04)}
#urppp-clean-root .uc-services{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;align-items:stretch}
#urppp-clean-root .uc-svc{width:100%;min-width:0;aspect-ratio:1/1;height:auto;border-radius:12px;border:1px solid var(--border);background:var(--input-bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;color:var(--text);padding:8px 4px;text-align:center;margin:0;box-sizing:border-box;opacity:0;transform:translateY(10px) scale(.96);animation:ucSvcIn .36s cubic-bezier(.22,1,.36,1) forwards;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease,background .18s ease}
#urppp-clean-root .uc-svc:nth-child(1){animation-delay:.12s}
#urppp-clean-root .uc-svc:nth-child(2){animation-delay:.15s}
#urppp-clean-root .uc-svc:nth-child(3){animation-delay:.18s}
#urppp-clean-root .uc-svc:nth-child(4){animation-delay:.21s}
#urppp-clean-root .uc-svc:nth-child(5){animation-delay:.24s}
#urppp-clean-root .uc-svc:nth-child(6){animation-delay:.27s}
#urppp-clean-root .uc-svc:nth-child(7){animation-delay:.3s}
#urppp-clean-root .uc-svc:hover{border-color:var(--primary);background:color-mix(in srgb,var(--primary) 8%,var(--input-bg));transform:translateY(-3px) scale(1.03);box-shadow:0 10px 22px rgba(0,0,0,.08)}
#urppp-clean-root .uc-svc:active{transform:translateY(-1px) scale(.98)}
#urppp-clean-root .uc-svc svg{width:26px;height:26px;color:var(--primary);flex:0 0 auto;transition:transform .2s ease}
#urppp-clean-root .uc-svc:hover svg{transform:scale(1.08) rotate(-3deg)}
#urppp-clean-root .uc-svc strong{font-size:12px;line-height:1.15;font-weight:700;max-width:100%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#urppp-clean-root .uc-empty,#urppp-clean-root .uc-loading{padding:18px;text-align:center;color:var(--text-secondary);font-size:13px}
#urppp-clean-root .uc-note{font-size:12px;color:var(--text-muted);margin-top:8px;line-height:1.55}
#urppp-clean-root .uc-mobile{display:none}
#urppp-clean-root .uc-tabbar{display:none}
#urppp-clean-root .uc-mask{position:fixed;inset:0;background:rgba(15,23,42,.36);z-index:12010;display:block;opacity:0;pointer-events:none;transition:opacity .22s ease;backdrop-filter:blur(0px)}
#urppp-clean-root .uc-mask.open{opacity:1;pointer-events:auto;backdrop-filter:blur(2px)}
#urppp-clean-root .uc-modal{position:fixed;z-index:12020;left:50%;top:50%;transform:translate(-50%,-46%) scale(.96);width:min(980px,92vw);max-height:86vh;background:var(--surface);border:1px solid var(--border);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.2);opacity:0;pointer-events:none;transition:opacity .24s cubic-bezier(.22,1,.36,1),transform .28s cubic-bezier(.22,1,.36,1)}
#urppp-clean-root .uc-modal.open{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
#urppp-clean-root .uc-modal-hd{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:17px;flex:0 0 auto}
#urppp-clean-root .uc-modal-bd{padding:12px 14px;overflow:auto;flex:1 1 auto;min-height:0}
#urppp-clean-root .uc-modal-ft{padding:10px 14px;border-top:1px solid var(--border);background:var(--input-bg);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;flex:0 0 auto;position:relative;z-index:2}
#urppp-clean-root .uc-modal-ft #uc-calc{flex:1 1 auto;min-width:0;font-size:14px}
#urppp-clean-root .uc-modal-ft #uc-clear{flex:0 0 auto}
#urppp-clean-root #uc-score-wrap{position:relative!important;isolation:isolate;overflow:auto;max-height:min(46vh,420px);margin-top:10px;border:1px solid var(--border);border-radius:14px;background:var(--surface);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--border) 50%,transparent)}
#urppp-clean-root #uc-score-wrap table.uc-table{position:relative;width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px;background:transparent}
#urppp-clean-root table.uc-table{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px;background:transparent}
#urppp-clean-root table.uc-table th,#urppp-clean-root table.uc-table td{padding:10px 12px;border-bottom:1px solid color-mix(in srgb,var(--border) 85%,transparent);text-align:left;vertical-align:middle;background:var(--surface);color:var(--text);line-height:1.45;white-space:normal;word-break:break-word}
#urppp-clean-root table.uc-table thead th{position:sticky;top:0;z-index:6;background:color-mix(in srgb,var(--input-bg) 88%,var(--surface))!important;color:var(--text-secondary);font-weight:700;font-size:12px;letter-spacing:.02em;box-shadow:0 1px 0 var(--border)}
#urppp-clean-root table.uc-table tbody td{background:var(--surface)}
#urppp-clean-root table.uc-table tbody tr{cursor:pointer;user-select:none;transition:background .12s ease}
#urppp-clean-root table.uc-table tbody tr:nth-child(even) td{background:color-mix(in srgb,var(--input-bg) 45%,var(--surface))}
#urppp-clean-root table.uc-table tbody tr:hover td{background:color-mix(in srgb,var(--primary) 8%,var(--surface))!important}
#urppp-clean-root table.uc-table tbody tr.is-on td{background:color-mix(in srgb,var(--primary) 14%,var(--surface))!important}
#urppp-clean-root table.uc-table tbody tr.is-on{box-shadow:inset 3px 0 0 var(--primary)}
#urppp-clean-root table.uc-table tbody tr:last-child td{border-bottom:0}
#urppp-clean-root table.uc-table th:nth-child(2),#urppp-clean-root table.uc-table td:nth-child(2){width:72px;text-align:center;white-space:nowrap}
#urppp-clean-root table.uc-table th:nth-child(3),#urppp-clean-root table.uc-table td:nth-child(3){width:56px;text-align:center;font-variant-numeric:tabular-nums}
#urppp-clean-root table.uc-table th:nth-child(4),#urppp-clean-root table.uc-table td:nth-child(4){width:88px;text-align:center}
#urppp-clean-root table.uc-table th:nth-child(5),#urppp-clean-root table.uc-table td:nth-child(5){width:64px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600;color:var(--text-secondary)}
#urppp-clean-root .uc-namecell{padding-left:28px!important;position:relative}
#urppp-clean-root .uc-cname{display:inline;position:relative;z-index:0;font-weight:600}
#urppp-clean-root .uc-selmark{z-index:1;left:8px}
#urppp-clean-root .uc-attr-pill{display:inline-flex;align-items:center;justify-content:center;min-width:40px;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--primary) 10%,var(--input-bg));color:var(--text-secondary);font-size:11px;font-weight:600;line-height:1.4}
#urppp-clean-root .uc-score-cell{min-width:48px;padding:3px 9px;border-radius:999px;font-size:12px}
#urppp-clean-root .uc-select-box{position:absolute;border:1.5px solid var(--primary);background:color-mix(in srgb,var(--primary) 16%,transparent);pointer-events:none;z-index:20;display:none;border-radius:6px;box-sizing:border-box}
html.urppp-theme-dark #urppp-clean-root table.uc-table th,
html.urppp-theme-dark #urppp-clean-root table.uc-table td,
body.urppp-dark #urppp-clean-root table.uc-table th,
body.urppp-dark #urppp-clean-root table.uc-table td{background:var(--surface)!important;color:var(--text)!important;border-color:var(--border)!important}
html.urppp-theme-dark #urppp-clean-root table.uc-table tbody tr:hover td,
body.urppp-dark #urppp-clean-root table.uc-table tbody tr:hover td{background:var(--input-bg)!important}
html.urppp-theme-dark #urppp-clean-root table.uc-table tbody tr.is-on td,
body.urppp-dark #urppp-clean-root table.uc-table tbody tr.is-on td{background:color-mix(in srgb,var(--primary) 22%,var(--surface))!important}
#urppp-clean-root .uc-build-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
#urppp-clean-root .uc-build-grid button{border:1px solid var(--border);background:var(--input-bg);border-radius:12px;padding:10px;cursor:pointer;color:var(--text);font-size:12px;text-align:left}
#urppp-clean-root .uc-build-grid button:hover{border-color:var(--primary)}
#urppp-clean-root .uc-occ{overflow:auto;border:1px solid var(--border);border-radius:14px;background:var(--surface);padding:8px}
#urppp-clean-root .uc-occ-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
#urppp-clean-root .uc-occ-title{font-size:16px;font-weight:700}
#urppp-clean-root .uc-room-days{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#urppp-clean-root .uc-room-days .uc-btn{height:28px;padding:0 10px;font-size:12px}
#urppp-clean-root .uc-occ-table{border-collapse:separate;border-spacing:4px;font-size:11px;min-width:760px}
#urppp-clean-root .uc-occ-table th{background:var(--input-bg);color:var(--text);z-index:1;padding:6px 8px;text-align:left;white-space:nowrap;border-radius:8px}
#urppp-clean-root .uc-occ-table th.sticky{position:sticky;left:0;z-index:3}
#urppp-clean-root .uc-occ-table th.sticky2{position:sticky;left:64px;z-index:3}
#urppp-clean-root .uc-occ-table .sec{min-width:30px;text-align:center;color:var(--text-secondary);font-weight:600;background:transparent}
#urppp-clean-root .uc-slot{width:30px;height:26px;border-radius:7px;border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;padding:0;cursor:default}
#urppp-clean-root .uc-slot.free{background:color-mix(in srgb,var(--input-bg) 88%,var(--surface));color:transparent}
#urppp-clean-root .uc-slot.busy{cursor:pointer;color:#0b3b4a;background:#7be0f6;border-color:#4ec8e0}
#urppp-clean-root .uc-slot.busy:hover{filter:brightness(1.05);transform:scale(1.04)}
#urppp-clean-root .uc-legend{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:4px 0 10px;font-size:12px;color:var(--text-secondary)}
#urppp-clean-root .uc-legend i{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:middle;margin-right:4px;border:1px solid var(--border)}
#urppp-clean-root .uc-legend .lg-busy{background:#7be0f6;border-color:#4ec8e0}
#urppp-clean-root .uc-legend .lg-exam{background:#fbbf24;border-color:#f59e0b}
#urppp-clean-root .uc-legend .lg-lab{background:#a78bfa;border-color:#8b5cf6}
#urppp-clean-root .uc-legend .lg-borrow{background:#fb7185;border-color:#f43f5e}
#urppp-clean-root .uc-legend .lg-free{background:var(--input-bg)}
html.urppp-theme-dark #urppp-clean-root .uc-slot.free,
body.urppp-dark #urppp-clean-root .uc-slot.free{background:#1c2330;border-color:#2a3548}
html.urppp-theme-dark #urppp-clean-root .uc-slot.busy,
body.urppp-dark #urppp-clean-root .uc-slot.busy{background:#2dd4bf;border-color:#14b8a6;color:#042f2e}
html.urppp-theme-dark #urppp-clean-root .uc-occ,
body.urppp-dark #urppp-clean-root .uc-occ{background:var(--surface);border-color:var(--border)}
html.urppp-theme-dark #urppp-clean-root .uc-occ-table th,
body.urppp-dark #urppp-clean-root .uc-occ-table th{background:var(--input-bg);color:var(--text)}
html.urppp-clean-lock,html.urppp-clean-lock body{overflow:hidden!important}
#urppp-clean-root .uc-loading{position:relative}
#urppp-clean-root .uc-loading::after{content:'';display:inline-block;width:1.1em;margin-left:2px;animation:ucDots 1s steps(4,end) infinite}
#urppp-clean-root .uc-week-label.uc-pop{animation:ucPop .28s cubic-bezier(.22,1,.36,1)}
#urppp-clean-root .uc-build-grid button{transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease}
#urppp-clean-root .uc-build-grid button:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.05)}
#urppp-clean-root .uc-slot.busy{transition:transform .15s ease,filter .15s ease}
#urppp-clean-root .uc-avatar{transition:transform .22s ease,box-shadow .22s ease}
#urppp-clean-root .uc-card:hover .uc-avatar{transform:scale(1.02)}
#urppp-clean-root.uc-settled .uc-top,
#urppp-clean-root.uc-settled .uc-card,
#urppp-clean-root.uc-settled .uc-svc{animation:none!important;opacity:1!important;transform:none!important}
#urppp-clean-root.uc-settled .uc-svc:hover{transform:translateY(-3px) scale(1.03)!important}
#urppp-clean-root.uc-settled .uc-card:hover{transform:none}
@keyframes ucTopIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@keyframes ucCardIn{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
@keyframes ucSvcIn{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
@keyframes ucPop{0%{transform:scale(.92);opacity:.7}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
@keyframes ucDots{0%{content:''}25%{content:'.'}50%{content:'..'}75%{content:'...'}}
@media (prefers-reduced-motion:reduce){
  #urppp-clean-root,#urppp-clean-root *{animation:none!important;transition:none!important}
  #urppp-clean-root,#urppp-clean-root .uc-card,#urppp-clean-root .uc-svc,#urppp-clean-root .uc-top,#urppp-clean-root .uc-mask,#urppp-clean-root .uc-modal{opacity:1!important;transform:none!important;pointer-events:auto}
  #urppp-clean-root .uc-mask{display:none}
  #urppp-clean-root .uc-mask.open{display:block}
  #urppp-clean-root .uc-modal{display:none}
  #urppp-clean-root .uc-modal.open{display:flex}
}
html body #navbar #urppp-nav-clean,html body #urppp-nav-theme #urppp-nav-clean,#urppp-nav-clean{
  margin-left:8px!important;height:28px!important;min-height:28px!important;max-height:28px!important;
  padding:0 10px!important;border-radius:8px!important;border:1px solid var(--border)!important;
  background:var(--input-bg)!important;color:var(--text)!important;font-size:12px!important;
  display:inline-flex!important;align-items:center!important;gap:6px!important;width:auto!important;
  box-shadow:none!important;line-height:26px!important;cursor:pointer!important;float:none!important
}
#urppp-nav-clean svg{width:14px!important;height:14px!important;display:block!important}
@media (max-width:900px){
  #urppp-clean-root .uc-top{flex:0 0 52px;padding:0 12px}
  #urppp-clean-root .uc-top-actions .uc-btn span{display:none}
  #urppp-clean-root .uc-top-actions .uc-btn{width:34px;padding:0;justify-content:center}
  #urppp-clean-root .uc-shell{padding:10px 10px 90px;align-items:stretch;justify-content:flex-start}
  #urppp-clean-root .uc-desktop{display:none}
  #urppp-clean-root .uc-mobile{display:block}
  #urppp-clean-root .uc-tabbar{display:flex;position:fixed;left:0;right:0;bottom:0;height:68px;background:var(--surface);border-top:1px solid var(--border);z-index:12005;padding:4px 0 calc(4px + env(safe-area-inset-bottom))}
  #urppp-clean-root .uc-tabbar button{flex:1;border:0;background:transparent;color:var(--text-secondary);font-size:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}
  #urppp-clean-root .uc-tabbar button svg{width:28px!important;height:28px!important;display:block;flex:0 0 auto}
  #urppp-clean-root .uc-tabbar button.ac{color:var(--primary);font-weight:700}
  #urppp-clean-root .uc-score-grid{grid-template-columns:1fr}
  #urppp-clean-root .uc-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}
  #urppp-clean-root .uc-services{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
  #urppp-clean-root .uc-svc{width:100%;height:auto}
  #urppp-clean-root .uc-modal{inset:0;left:0;top:0;right:0;bottom:0;width:100%;height:100%;max-height:none;border-radius:0;transform:translateY(16px)}
  #urppp-clean-root .uc-modal.open{transform:translateY(0) scale(1)}
  #urppp-clean-root .uc-modal-hd{padding:12px 12px;padding-top:calc(12px + env(safe-area-inset-top))}
  #urppp-clean-root .uc-modal-bd{padding:10px 12px;flex:1 1 auto;min-height:0}
  #urppp-clean-root .uc-modal-ft{padding:10px 12px;padding-bottom:calc(12px + env(safe-area-inset-bottom));position:sticky;bottom:0;background:var(--input-bg);box-shadow:0 -6px 16px rgba(0,0,0,.06)}
  #urppp-clean-root .uc-modal-ft #uc-calc{font-size:13px;line-height:1.4}
  #urppp-clean-root #uc-score-wrap{max-height:none;flex:1 1 auto;min-height:180px}
  #urppp-clean-root .uc-modal-bd{display:flex;flex-direction:column}
  #urppp-clean-root .uc-modal-bd > #uc-score-wrap{flex:1 1 auto}
  /* 小屏课表：更紧凑 */
  #urppp-clean-root .uc-week{min-width:0;width:100%}
  #urppp-clean-root .uc-week-head{grid-template-columns:24px repeat(7,minmax(0,1fr));gap:3px;margin-bottom:4px}
  #urppp-clean-root .uc-week-head .h{font-size:10px}
  #urppp-clean-root .uc-week-body{grid-template-columns:24px repeat(7,minmax(0,1fr));gap:3px}
  #urppp-clean-root .uc-sec-col .s{font-size:9px}
  #urppp-clean-root .uc-grid-cell{border-radius:7px}
  #urppp-clean-root .uc-lesson{padding:3px 3px 12px;border-radius:7px}
  #urppp-clean-root .uc-lesson b{font-size:10px;line-height:1.15}
  #urppp-clean-root .uc-lesson i{font-size:8px;margin-top:1px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  #urppp-clean-root .uc-badge{right:2px;bottom:2px;min-width:14px;height:14px;font-size:9px;line-height:14px;padding:0 3px}
  #urppp-clean-root .uc-week-nav{gap:4px;flex-wrap:wrap;justify-content:flex-end}
  #urppp-clean-root .uc-week-nav .uc-btn{height:26px;padding:0 8px;font-size:11px}
  #urppp-clean-root .uc-week-nav .uc-week-label{min-width:52px;font-size:12px}
  #urppp-clean-root .uc-card .uc-hd{padding:10px 10px;font-size:14px}
  #urppp-clean-root .uc-card .uc-bd{padding:10px}
  #urppp-clean-root .uc-profile{gap:10px}
  #urppp-clean-root .uc-avatar,#urppp-clean-root .uc-avatar img{height:56px;max-width:72px}
  #urppp-clean-root .uc-name{font-size:16px}
}
`;
    (document.head || document.documentElement).appendChild(st);
  }

  function rootEl() { return document.getElementById('urppp-clean-root'); }

  function ensureRoot() {
    ensureStyle();
    let el = rootEl();
    if (el) return el;
    el = document.createElement('div');
    el.id = 'urppp-clean-root';
    el.innerHTML = `
      <div class="uc-top">
        <div class="uc-top-left">
          <div class="uc-top-theme" id="uc-top-theme">
            <button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>
            <button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>
            <button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>
            <button type="button" class="urppp-nav-settings" id="uc-settings" title="设置" aria-label="设置">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
          </div>
        </div>
        <div class="uc-top-actions">
          <button type="button" class="uc-btn" id="uc-refresh">${ico('refresh')}<span>刷新</span></button>
          <button type="button" class="uc-btn primary" id="uc-exit">${ico('exit')}<span>退出</span></button>
        </div>
      </div>
      <div class="uc-shell"><div class="uc-shell-inner" id="uc-body"></div></div>
      <div class="uc-tabbar" id="uc-tabbar">
        <button type="button" data-tab="home" class="ac">${ico('home')}<span>首页</span></button>
        <button type="button" data-tab="scores">${ico('score')}<span>成绩</span></button>
        <button type="button" data-tab="room">${ico('room')}<span>教室</span></button>
        <button type="button" data-tab="more">${ico('more')}<span>其他</span></button>
      </div>
      <div class="uc-mask" id="uc-mask"></div>
      <div class="uc-modal" id="uc-modal">
        <div class="uc-modal-hd"><span id="uc-modal-title">详情</span><button type="button" class="uc-btn" id="uc-modal-close">${ico('close')}</button></div>
        <div class="uc-modal-bd" id="uc-modal-body"></div>
        <div class="uc-modal-ft" id="uc-modal-ft"></div>
      </div>`;
    document.documentElement.appendChild(el);
    el.querySelector('#uc-exit').onclick = closeCleanMode;
    el.querySelector('#uc-refresh').onclick = () => openCleanMode(true);
    el.querySelector('#uc-mask').onclick = closeModal;
    el.querySelector('#uc-modal-close').onclick = closeModal;
    const syncCleanThemeDots = () => {
      syncThemeDotGroup(el.querySelector('#uc-top-theme'));
    };
    el.querySelectorAll('#uc-top-theme .urppp-nav-dot[data-theme]').forEach((dot) => {
      dot.addEventListener('click', () => {
        handleThemeDotClick(dot.dataset.theme);
        syncCleanThemeDots();
        try { syncNavbarThemeUI(); } catch (_) {}
        try { syncSettingsPanelUI(); } catch (_) {}
      });
    });
    const setBtn = el.querySelector('#uc-settings');
    if (setBtn) setBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try { openSettingsPanel(); } catch (_) {}
    });
    el.__syncCleanThemeDots = syncCleanThemeDots;
    try { applySkinAttr(); } catch (_) {}
    syncCleanThemeDots();
    el.querySelectorAll('#uc-tabbar button').forEach((btn) => {
      btn.onclick = () => {
        state.mobileTab = btn.dataset.tab;
        el.querySelectorAll('#uc-tabbar button').forEach((b) => b.classList.toggle('ac', b === btn));
        render();
        // 小屏「教室」页需要主动拉 catalog；桌面是弹窗路径才加载
        if (state.mobileTab === 'room') ensureRoomCatalogLoaded();
      };
    });
    return el;
  }

  async function ensureRoomCatalogLoaded(force) {
    if (!force && state.catalog && state.catalog.length) return state.catalog;
    if (state.loading.room) return state.catalog;
    state.loading.room = true;
    try { render(); } catch (_) {}
    try {
      state.catalog = await loadClassroomCatalog();
      state.roomError = '';
    } catch (e) {
      state.catalog = state.catalog || [];
      state.roomError = String(e && e.message || e);
      console.warn('[URP++] room catalog', e);
    } finally {
      state.loading.room = false;
      try { scheduleRender(); } catch (_) {}
    }
    return state.catalog;
  }

  function metricHtml(s, scope) {
    s = s || summarizeCourses([]);
    // 与教务成绩单习惯对齐：学分 → 成绩 → 绩点；必修同序
    const items = [
      ['TotalCredit', '总学分', s.totalCredit],
      ['AvgScore', '平均成绩', s.avgScore],
      ['AvgGpa', '平均绩点', s.avgGpa],
      ['RequiredCredit', '必修学分', s.requiredCredit],
      ['RequiredAvg', '必修平均', s.requiredAvg],
      ['RequiredGpa', '必修绩点', s.requiredGpa]
    ];
    return `<div class="uc-metrics">${items.map(([suffix, label, value]) => {
      const field = classifyPrivacyLabel(label) || 'grade';
      const editKey = scope && DIRECT_EDIT_LABELS[scope + suffix] ? ` data-urppp-edit-key="${scope + suffix}"` : '';
      return `<div class="uc-metric"><em>${label}</em><b data-urppp-private="${field}"${editKey}>${value}</b></div>`;
    }).join('')}</div>`;
  }

  function getScheduleRowHeight() {
    try {
      // 手机/窄屏用更矮行高，整表更紧凑
      if (window.matchMedia && window.matchMedia('(max-width:900px)').matches) return 40;
    } catch (_) {}
    return 56;
  }

  function renderScheduleBoard(courses) {
    const weekNo = getViewWeekNumber();
    const ROW = getScheduleRowHeight();
    const CELL = Math.max(ROW - 4, 28);
    const list = (courses || []).map((c) => Object.assign({}, c, {
      thisWeek: weekBitActive(c.classWeek, weekNo) || (!c.classWeek && String(c.week || '').indexOf(String(weekNo)) >= 0),
      span: Math.max(1, c.span || 1),
      color: c.color || courseColor(c.name)
    }));
    // group by day+startSection
    const byStart = {};
    list.forEach((c) => {
      const k = c.day + '_' + c.section;
      (byStart[k] || (byStart[k] = [])).push(c);
    });
    // mark cells that are only continuations (for empty look still show grid)
    let html = `<div class="uc-week" data-urppp-private="schedule" data-week="${weekNo}" data-row="${ROW}">`;
    html += '<div class="uc-week-head"><div class="h"></div>';
    for (let d = 0; d < 7; d++) html += `<div class="h">${DAY_NAMES[d]}</div>`;
    html += '</div><div class="uc-week-body">';
    // left section labels
    html += '<div class="uc-sec-col">';
    for (let s = 1; s <= 12; s++) html += `<div class="s" style="height:${ROW}px">${s}</div>`;
    html += '</div>';
    // 7 day columns
    for (let d = 0; d < 7; d++) {
      html += `<div class="uc-day-col" data-day="${d}" style="height:${ROW * 12}px">`;
      // background grid cells: fixed equal height, full column width
      for (let s = 1; s <= 12; s++) html += `<div class="uc-grid-cell" data-sec="${s}" style="top:${(s - 1) * ROW}px;height:${CELL}px"></div>`;
      // 4|5 与 9|10 之间分割线（上午/下午/晚上）
      html += `<div class="uc-part-line" style="top:${4 * ROW - 2}px"></div>`;
      html += `<div class="uc-part-line" style="top:${9 * ROW - 2}px"></div>`;
      // place courses absolutely
      for (let s = 1; s <= 12; s++) {
        const starters = (byStart[d + '_' + s] || []).slice().sort((a, b) => {
          // 本周永远优先
          if (a.thisWeek !== b.thisWeek) return (b.thisWeek ? 1 : 0) - (a.thisWeek ? 1 : 0);
          return (b.span || 1) - (a.span || 1);
        });
        if (!starters.length) continue;
        // 若本格同时有本周与非本周，外显本周；非本周进角标
        const weekOnes = starters.filter((c) => c.thisWeek);
        const primary = weekOnes[0] || starters[0];
        const rest = starters.filter((c) => c !== primary);
        const span = primary.span;
        const top = (s - 1) * ROW + 1;
        const height = span * ROW - 6;
        const z = primary.thisWeek ? 8 : 2;
        const style = primary.thisWeek
          ? `--uc-course-color:${primary.color};top:${top}px;height:${height}px;z-index:${z};background:${primary.color}26;border-color:${primary.color}80`
          : `--uc-course-color:${primary.color};top:${top}px;height:${height}px;z-index:${z};background:color-mix(in srgb,${primary.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`;
        const badge = rest.length ? `<span class="uc-badge">+${rest.length}</span>` : '';
        const payload = escapeHtml(JSON.stringify({
          name: primary.name, teacher: primary.teacher, place: primary.place, week: primary.week,
          day: primary.day, section: primary.section, span: primary.span, thisWeek: primary.thisWeek,
          others: rest.map((r) => ({ name: r.name, teacher: r.teacher, place: r.place, week: r.week, thisWeek: r.thisWeek, section: r.section, span: r.span }))
        }));
        html += `<div class="uc-lesson${primary.thisWeek ? '' : ' is-fade'}" style="${style}" data-course='${payload}'>
          <b>${escapeHtml(primary.name)}</b>
          <i>${escapeHtml([primary.place, primary.week].filter(Boolean).join(' · '))}</i>
          ${badge}
        </div>`;
      }
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  function servicesHtml() {
    const items = [
      { t: '空闲教室', i: 'room', a: 'room' },
      { t: '教学评估', i: 'eval', h: '/student/teachingEvaluation/newEvaluation/index' },
      { t: '培养方案', i: 'plan', h: '/student/integratedQuery/planCompletion/index' },
      // 路径以首页 #personalApplication 真实 a[href] 为准
      { t: '补办学生证', i: 'apply', h: '/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082' },
      { t: '免修申请', i: 'apply', h: '/student/personalManagement/individualApplication/exemptionApplication/index' },
      { t: '替代课申请', i: 'apply', h: '/student/personalManagement/personalApplication/curriculumReplacement/index' },
      { t: '火车票优惠卡', i: 'apply', h: '/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083' }
    ];
    return `<div class="uc-services">${items.map((it) => `
      <button type="button" class="uc-svc" data-action="${it.a || ''}" data-href="${it.h || ''}">
        ${ico(it.i)}<strong>${it.t}</strong>
      </button>`).join('')}</div>`;
  }

  function renderDesktop() {
    const p = personalizedProfile(state.profile || {});
    const courses = (state.schedule && state.schedule.courses) || [];
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { summary: summarizeCourses([]) };
    const schemes = (state.scores && state.scores.schemes) || [];
    if (state.scores && state.scores.majorIdx != null && state._schemeInited !== true) {
      state.activeSchemeIdx = state.scores.majorIdx || 0;
      state._schemeInited = true;
    }
    const scheme = schemes[state.activeSchemeIdx] || schemes[0] || { summary: summarizeCourses([]), title: '方案成绩' };
    const av = p.avatar ? `<img src="${escapeHtml(p.avatar)}" alt="">` : `<span>${escapeHtml((p.name || '同')[0])}</span>`;
    const scoreBody = state.loading.scores
      ? '<div class="uc-loading">成绩加载中</div>'
      : (state.scores && state.scores.error
        ? `<div class="uc-empty">${escapeHtml(state.scores.error)}</div>`
        : `<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${metricHtml(pass.summary, 'passing')}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${escapeHtml((scheme.title || '方案成绩').split(/通过|获得|不通过/)[0].trim() || '方案成绩')}</h5>${metricHtml(scheme.summary, 'scheme')}</div>
          </div>`);

    return `<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${av}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${escapeHtml(p.name || '同学')}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${escapeHtml(p.majorPlan || '—')}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${escapeHtml(String(p.majorGpa || '—'))}</span></div>
          </div>
        </div></div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${courses.length ? (courses.length + ' 课次') : ((state.schedule && state.schedule.error) || '')}</span>
            </div>
          </div>
          <div class="uc-bd">${state.loading.schedule ? '<div class="uc-loading">课表加载中…</div>' : (courses.length ? renderScheduleBoard(courses) : `<div class="uc-empty">${escapeHtml((state.schedule && state.schedule.error) || '暂无课表数据')}</div>`)}</div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          <div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
          <div class="uc-bd">${scoreBody}</div>
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${servicesHtml()}</div>
        </div>
      </div>
    </div>`;
  }

  function renderMobile() {
    const p = personalizedProfile(state.profile || {});
    const courses = (state.schedule && state.schedule.courses) || [];
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { summary: summarizeCourses([]) };
    const scheme = ((state.scores && state.scores.schemes) || [])[state.activeSchemeIdx] || { summary: summarizeCourses([]) };
    const av = p.avatar ? `<img src="${escapeHtml(p.avatar)}" alt="">` : `<span>${escapeHtml((p.name || '同')[0])}</span>`;
    if (state.mobileTab === 'scores') {
      return `<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${metricHtml(pass.summary, 'passing')}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${metricHtml(scheme.summary, 'scheme')}</div>
      </div></div></div>`;
    }
    if (state.mobileTab === 'room') {
      return `<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${roomPickerHtml()}</div></div></div>`;
    }
    if (state.mobileTab === 'more') {
      return `<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${servicesHtml()}</div></div></div>`;
    }
    return `<div class="uc-mobile">
      <div class="uc-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${av}</div>
        <div><div class="uc-name" data-urppp-private="name">${escapeHtml(p.name || '同学')}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${escapeHtml(p.majorPlan || '—')}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${escapeHtml(String(p.majorGpa || '—'))}</span></div></div>
      </div></div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd">
        <div style="overflow:auto">${state.loading.schedule ? '<div class="uc-loading">课表加载中…</div>' : (courses.length ? renderScheduleBoard(courses) : `<div class="uc-empty">${escapeHtml((state.schedule && state.schedule.error) || '暂无课表数据')}</div>`)}</div>
      </div></div>
    </div>`;
  }

  function roomPickerHtml() {
    if (state.loading.room) return '<div class="uc-loading">教学楼加载中…</div>';
    const groups = state.catalog || [];
    if (!groups.length) {
      return `<div class="uc-empty">${escapeHtml(state.roomError || '未读到教学楼列表')}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`;
    }
    // prefer 江安 first
    const ordered = groups.slice().sort((a, b) => (/江安/.test(a.campus) ? -1 : 0) - (/江安/.test(b.campus) ? -1 : 0));
    return ordered.map((g) => `
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${escapeHtml(g.campus)}</div>
        <div class="uc-build-grid">
          ${g.buildings.map((b) => `<button type="button" data-build-path="${escapeHtml(b.path)}" data-cn="${escapeHtml(b.campusNumber || '')}" data-bn="${escapeHtml(b.buildingNumber || '')}">${escapeHtml(b.name)}</button>`).join('')}
        </div>
      </div>`).join('');
  }

  function occupancyHtml(pack, buildingName) {
    if (!pack || !pack.rooms || !pack.rooms.length) return '<div class="uc-empty">该楼暂无教室占用数据</div>';
    let head = '<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';
    for (let i = 1; i <= 12; i++) head += `<th class="sec">${i}</th>`;
    head += '</tr>';
    const body = pack.rooms.map((r) => {
      let row = `<tr><th class="sticky">${escapeHtml(r.name)}</th><th class="sticky2">${escapeHtml(r.seats)}</th>`;
      for (let i = 1; i <= 12; i++) {
        const slot = (r.slots || []).find((s) => s.section === i) || { busy: false };
        if (slot.busy) {
          const reason = slot.reason || slot.typeLabel || '占用';
          const typeLabel = slot.typeLabel || occupancyTypeLabel({ occupancymoduleId: slot.module });
          const ch = slot.displayChar || firstContentChar(reason) || firstContentChar(typeLabel) || '占';
          const detailObj = Object.assign({}, slot.detail || { room: r.name, section: i, reason }, {
            reason,
            typeLabel,
            contentName: slot.contentName || (slot.detail && slot.detail.contentName) || ''
          });
          const detail = escapeHtml(JSON.stringify(detailObj));
          row += `<td><button type="button" class="uc-slot busy ${occupancyKindClass(typeLabel)}" data-occ='${detail}' title="${escapeHtml(r.name)} 第${i}节 · ${escapeHtml(reason)}">${escapeHtml(ch)}</button></td>`;
        } else {
          row += `<td><div class="uc-slot free" title="${escapeHtml(r.name)} 第${i}节 · 空闲"></div></td>`;
        }
      }
      return row + '</tr>';
    }).join('');
    const off = Number(pack.dateOffset != null ? pack.dateOffset : state.roomDateOffset) || 0;
    const dayBtn = (v, label) =>
      `<button type="button" class="uc-btn${off === v ? ' primary' : ''}" data-room-day="${v}">${label}</button>`;
    return `
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${escapeHtml(buildingName || '')}</div>
          <div class="uc-sub">${escapeHtml(pack.dateLabel || '')}${pack.jxzc ? (' · 教学第' + pack.jxzc + '周') : ''}</div>
          <div class="uc-room-days">
            ${dayBtn(0, '今天')}
            ${dayBtn(1, '明天')}
            ${dayBtn(2, '后天')}
          </div>
        </div>
        <button type="button" class="uc-btn" id="uc-room-back">返回楼栋</button>
      </div>
      <div class="uc-legend">
        <span><i class="lg-busy"></i>有课</span>
        <span><i class="lg-exam"></i>考试</span>
        <span><i class="lg-lab"></i>实验</span>
        <span><i class="lg-borrow"></i>借用</span>
        <span><i class="lg-free"></i>空闲</span>
        <span class="uc-sub">色块为首字：有课/考试显示课程或考试名首字，点击查看详情</span>
      </div>
      <div class="uc-occ"><table class="uc-occ-table">${head}${body}</table></div>`;
  }

  let cleanRenderFrame = 0;

  function render() {
    const el = ensureRoot();
    const body = el.querySelector('#uc-body');
    const mobile = window.matchMedia && window.matchMedia('(max-width:900px)').matches;
    // 渲染前同步系统教学周，防止小屏首屏误落第1周
    getViewWeekNumber();
    // 仅首次进入播放卡片入场；后续数据刷新不再重播，避免闪烁
    const firstPaint = !state.uiReady;
    body.innerHTML = mobile ? renderMobile() : renderDesktop();
    if (!firstPaint) {
      el.classList.add('uc-settled');
    } else {
      state.uiReady = true;
      el.classList.remove('uc-settled');
      clearTimeout(el.__ucSettleTimer);
      el.__ucSettleTimer = setTimeout(() => {
        if (state.open) el.classList.add('uc-settled');
      }, 480);
    }
    bindUI(body);
    applyPersonalDisplay(body);
  }

  function scheduleRender() {
    if (!state.open || cleanRenderFrame) return;
    const run = () => {
      cleanRenderFrame = 0;
      if (state.open) render();
    };
    cleanRenderFrame = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame(run)
      : setTimeout(run, 0);
  }

  function markCleanUiBound(node, key) {
    if (!node) return false;
    if (!node.__urpppCleanUiBindings) node.__urpppCleanUiBindings = new Set();
    if (node.__urpppCleanUiBindings.has(key)) return false;
    node.__urpppCleanUiBindings.add(key);
    return true;
  }

  function bindUI(scope) {
    if (!scope) return;
    try { bindScheduleExportHosts(scope); } catch (e) { console.warn('[URP++] schedule export menu', e); }
    scope.querySelectorAll('[data-score]').forEach((n) => {
      if (!markCleanUiBound(n, 'score')) return;
      n.addEventListener('click', () => openScoreModal(n.getAttribute('data-score')));
    });
    scope.querySelectorAll('[data-href]').forEach((n) => {
      if (!markCleanUiBound(n, 'href')) return;
      n.addEventListener('click', (e) => {
        const href = n.getAttribute('data-href');
        if (!href) return;
        e.preventDefault();
        closeCleanMode();
        location.href = href;
      });
    });
    scope.querySelectorAll('[data-eval-url]').forEach((n) => {
      if (!markCleanUiBound(n, 'eval')) return;
      n.addEventListener('click', (e) => {
        const href = n.getAttribute('data-eval-url');
        if (!href) return;
        e.preventDefault();
        e.stopPropagation();
        closeCleanMode();
        location.href = href;
      });
    });
    scope.querySelectorAll('[data-action="room"]').forEach((n) => {
      if (!markCleanUiBound(n, 'room')) return;
      n.addEventListener('click', () => openRoomModal());
    });
    scope.querySelectorAll('[data-room-reload]').forEach((n) => {
      if (!markCleanUiBound(n, 'roomReload')) return;
      n.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ensureRoomCatalogLoaded(true);
      });
    });
    scope.querySelectorAll('[data-build-path]').forEach((n) => {
      if (!markCleanUiBound(n, 'building')) return;
      n.addEventListener('click', async () => {
        const path = n.getAttribute('data-build-path');
        const name = (n.textContent || '').trim();
        const cn = n.getAttribute('data-cn') || '';
        const bn = n.getAttribute('data-bn') || '';
        // 优先在按钮所在面板渲染，避免小屏教室页写到隐藏的 modal body
        const host = n.closest('#uc-room-panel') || n.closest('#uc-modal-body') || null;
        state.roomDateOffset = 0; // 新选楼栋默认今天
        await showBuilding({ path, name, campusNumber: cn, buildingNumber: bn, dateOffset: 0 }, name, host);
      });
    });
    scope.querySelectorAll('[data-room-day]').forEach((n) => {
      if (!markCleanUiBound(n, 'roomDay')) return;
      n.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const off = parseInt(n.getAttribute('data-room-day') || '0', 10) || 0;
        if (!state.currentBuilding) return;
        state.roomDateOffset = off;
        const b = Object.assign({}, state.currentBuilding, { dateOffset: off });
        const host = n.closest('#uc-room-panel') || n.closest('#uc-modal-body') || null;
        await showBuilding(b, b.name || '', host);
      });
    });
    const back = scope.querySelector('#uc-room-back');
    if (back) back.onclick = () => {
      state.occupancy = null;
      state.currentBuilding = null;
      const panel = back.closest('#uc-room-panel') || document.querySelector('#uc-room-panel') || document.querySelector('#uc-modal-body');
      if (panel && panel.id === 'uc-modal-body') {
        panel.innerHTML = roomPickerHtml();
        bindUI(panel);
      } else if (panel && panel.id === 'uc-room-panel') {
        panel.innerHTML = roomPickerHtml();
        bindUI(panel);
      } else {
        render();
      }
    };
    // 教室占用详情
    scope.querySelectorAll('.uc-slot.busy[data-occ]').forEach((el) => {
      if (!markCleanUiBound(el, 'occupancy')) return;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const d = JSON.parse(el.getAttribute('data-occ') || '{}');
          openModal('占用详情', `
            <div class="uc-occ-detail">
              <div class="uc-name">${escapeHtml(d.room || '')}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${escapeHtml(String(d.section || d.start || ''))}${(d.span > 1) ? ('-' + (Number(d.start || d.section) + Number(d.span) - 1)) : ''}节</div>
              <div class="uc-sub">占用类型：${escapeHtml(d.typeLabel || d.reason || '占用')}</div>
              <div class="uc-sub">具体内容：${escapeHtml(d.contentName || d.reason || '—')}</div>
              ${d.teacher ? `<div class="uc-sub">教师：${escapeHtml(d.teacher)}</div>` : ''}
              ${d.weeks ? `<div class="uc-sub">周次：${escapeHtml(d.weeks)}</div>` : ''}
              ${d.courseNo ? `<div class="uc-sub">课程号：${escapeHtml(d.courseNo)}</div>` : ''}
            </div>
          `, '', { stack: true });
        } catch (_) {}
      });
    });
    // 课表：点击看详情（勿复用 .uc-lesson 绝对定位样式，否则弹窗叠字）
    scope.querySelectorAll('.uc-lesson[data-course]').forEach((el) => {
      if (!markCleanUiBound(el, 'course')) return;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          const data = JSON.parse(el.getAttribute('data-course') || '{}');
          const secText = `第${data.section || '?'}${data.span > 1 ? '-' + (Number(data.section) + Number(data.span) - 1) : ''}节`;
          const others = (data.others || []).map((o) =>
            `<div class="uc-course-sub ${o.thisWeek ? '' : 'is-fade'}">
              <div class="uc-cd-name">${escapeHtml(o.name || '')}</div>
              <div class="uc-cd-meta">${escapeHtml([o.place, o.week, o.teacher].filter(Boolean).join(' · ')) || '—'}</div>
              <div class="uc-cd-chip">${o.thisWeek ? '当前周有课' : '当前周无课'}</div>
            </div>`
          ).join('');
          openModal('课程详情', `
            <div class="uc-course-detail">
              <div class="uc-cd-name">${escapeHtml(data.name || '')}</div>
              <div class="uc-cd-meta">${escapeHtml([data.place, data.teacher, data.week].filter(Boolean).join(' · ')) || '—'}</div>
              <div class="uc-cd-chip">${data.thisWeek ? '当前周有课' : '当前周无课'} · ${escapeHtml(secText)} · ${escapeHtml(DAY_NAMES[data.day] || '')}</div>
            </div>
            ${others ? '<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>' + others : ''}
          `, '');
        } catch (_) {}
      });
    });
    // 课表周次切换
    scope.querySelectorAll('[data-week-delta]').forEach((btn) => {
      if (!markCleanUiBound(btn, 'weekDelta')) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = parseInt(btn.getAttribute('data-week-delta') || '0', 10) || 0;
        const courses = (state.schedule && state.schedule.courses) || [];
        const maxW = inferMaxWeek(courses);
        const cur = getViewWeekNumber();
        state.weekLocked = true; // 手动切周后锁定，避免后续渲染被系统周覆盖
        state.viewWeek = Math.min(maxW, Math.max(1, cur + delta));
        render();
        const label = document.querySelector('#urppp-clean-root .uc-week-label');
        if (label) {
          label.classList.remove('uc-pop');
          void label.offsetWidth;
          label.classList.add('uc-pop');
        }
      });
    });
    scope.querySelectorAll('[data-week-reset]').forEach((btn) => {
      if (!markCleanUiBound(btn, 'weekReset')) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.weekLocked = false; // 回本周：重新跟随系统教学周
        const sys = getCurrentWeekNumber() || state._termWeek || 1;
        state.viewWeek = sys;
        render();
        const label = document.querySelector('#urppp-clean-root .uc-week-label');
        if (label) {
          label.classList.remove('uc-pop');
          void label.offsetWidth;
          label.classList.add('uc-pop');
        }
      });
    });
  }

  const modalStack = [];
  function openModal(title, body, ft, opts) {
    opts = opts || {};
    const el = ensureRoot();
    const mask = el.querySelector('#uc-mask');
    let modal = el.querySelector('#uc-modal');
    // 栈式弹窗：保留下层（如教室列表），上层详情关闭后回到下层
    if (opts.stack && modal.classList.contains('open')) {
      modalStack.push({
        title: el.querySelector('#uc-modal-title').textContent,
        body: el.querySelector('#uc-modal-body').innerHTML,
        ft: el.querySelector('#uc-modal-ft').innerHTML
      });
    } else if (!opts.stack) {
      modalStack.length = 0;
    }
    mask.classList.add('open');
    modal.classList.add('open');
    el.querySelector('#uc-modal-title').textContent = title;
    el.querySelector('#uc-modal-body').innerHTML = body;
    el.querySelector('#uc-modal-ft').innerHTML = ft || '';
    bindUI(el.querySelector('#uc-modal-body'));
    bindUI(el.querySelector('#uc-modal-ft'));
    applyPersonalDisplay(el.querySelector('#uc-modal'));
  }
  function closeModal() {
    const el = rootEl();
    if (!el) return;
    if (modalStack.length) {
      const prev = modalStack.pop();
      el.querySelector('#uc-modal-title').textContent = prev.title;
      el.querySelector('#uc-modal-body').innerHTML = prev.body;
      el.querySelector('#uc-modal-ft').innerHTML = prev.ft || '';
      bindUI(el.querySelector('#uc-modal-body'));
      bindUI(el.querySelector('#uc-modal-ft'));
      return;
    }
    el.querySelector('#uc-mask').classList.remove('open');
    el.querySelector('#uc-modal').classList.remove('open');
  }

  function openScoreModal(kind) {
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { courses: [], summary: summarizeCourses([]) };
    const schemes = (state.scores && state.scores.schemes) || [];
    if (kind === 'scheme' && state.scores && state.scores.majorIdx != null && state._schemeInited !== true) {
      state.activeSchemeIdx = state.scores.majorIdx || 0;
      state._schemeInited = true;
    }
    const scheme = schemes[state.activeSchemeIdx] || schemes[0] || { courses: [], summary: summarizeCourses([]), title: '方案成绩' };
    const pack = kind === 'scheme' ? scheme : pass;
    const key = kind === 'scheme' ? 'scheme' : 'passing';
    if (!state.selected[key]) state.selected[key] = new Set();
    const switcher = kind === 'scheme' && schemes.length > 1
      ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${schemes.map((s, i) =>
        `<button type="button" class="uc-btn ${i === state.activeSchemeIdx ? 'primary' : ''}" data-scheme-idx="${i}"><span data-urppp-private="organization">${escapeHtml((s.title || '方案').slice(0, 28))}</span></button>`).join('')}</div>`
      : '';
    const scoreCellHtml = (c) => {
      const uneval = !!(c && (c.unevaluated || isUnevaluatedScore(c.score)));
      const sc = scoreToNumber(c && c.score);
      let cls = '';
      if (uneval) {
        cls = (sc != null && sc < 60) ? 'uneval-fail' : 'uneval';
      } else if (sc != null) {
        cls = sc >= 60 ? 'pass' : 'fail';
      } else if (/不及格|不合格|不通过/.test(String(c && c.score || ''))) {
        cls = 'fail';
      } else if (c && c.score) {
        cls = 'pass';
      }
      const label = escapeHtml((c && c.score) || '—');
      const jump = uneval ? (c.evalUrl || '/student/teachingEvaluation/newEvaluation/index') : '';
      if (jump) {
        return `<span class="uc-score-cell ${cls}" data-eval-url="${escapeHtml(jump)}" title="未评教，点击前往评教">${label}</span>`;
      }
      return `<span class="uc-score-cell ${cls}">${label}</span>`;
    };
    const rows = (pack.courses || []).map((c, idx) => {
      const on = state.selected[key].has(idx);
      const gp = (isValidOfficialGpa(c.officialGpa) ? c.officialGpa : scoreToGpa(c.score));
      const uneval = !!(c.unevaluated || isUnevaluatedScore(c.score));
      return `<tr class="${on ? 'is-on' : ''}${uneval ? ' is-uneval' : ''}" data-idx="${idx}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${on ? '✓' : ''}</span><span class="uc-cname">${escapeHtml(c.name)}</span></td>
        <td><span class="uc-attr-pill">${escapeHtml(c.attr || '—')}</span></td>
        <td data-urppp-private="credit">${c.credit}</td>
        <td data-urppp-private="grade">${scoreCellHtml(c)}</td>
        <td data-urppp-private="gpa">${uneval || gp == null ? '—' : gp}</td>
      </tr>`;
    }).join('');
    openModal(kind === 'scheme' ? ('方案成绩 · ' + (scheme.title || '')) : '全部及格成绩', `
      ${switcher}${metricHtml(pack.summary, kind === 'scheme' ? 'scheme' : 'passing')}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`, `<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>`);
    const modalTitle = document.querySelector('#uc-modal-title');
    if (modalTitle) {
      if (kind === 'scheme') modalTitle.setAttribute('data-urppp-private', 'organization');
      else modalTitle.removeAttribute('data-urppp-private');
      applyPersonalDisplay(modalTitle.parentElement || modalTitle);
    }
    const body = document.querySelector('#uc-modal-body');
    const calc = document.getElementById('uc-calc');
    const table = document.getElementById('uc-score-table');
    const wrap = document.getElementById('uc-score-wrap');
    const box = document.getElementById('uc-select-box');

    const paint = () => {
      table.querySelectorAll('tbody tr[data-idx]').forEach((tr) => {
        const i = parseInt(tr.getAttribute('data-idx'), 10);
        const on = state.selected[key].has(i);
        tr.classList.toggle('is-on', on);
        const mark = tr.querySelector('.uc-selmark');
        if (mark) mark.textContent = on ? '✓' : '';
      });
      const selected = [];
      state.selected[key].forEach((i) => { if (pack.courses[i]) selected.push(pack.courses[i]); });
      const sum = summarizeCoursesPreferOfficial(selected);
      if (calc) {
        calc.className = 'uc-calc';
        calc.innerHTML = selected.length
          ? `已选 <b>${selected.length}</b> 门 · 学分 <b data-urppp-private="credit">${sum.totalCredit}</b> · 均分 <b data-urppp-private="grade">${sum.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${sum.avgGpa}</b>`
          : '已选 0 门';
      }
    };

    const toggleIdx = (i, force) => {
      if (force === true) state.selected[key].add(i);
      else if (force === false) state.selected[key].delete(i);
      else if (state.selected[key].has(i)) state.selected[key].delete(i);
      else state.selected[key].add(i);
    };

    // 点击行选择
    let suppressClick = false;
    table.querySelectorAll('tbody tr[data-idx]').forEach((tr) => {
      tr.addEventListener('click', (e) => {
        if (suppressClick) { suppressClick = false; return; }
        const i = parseInt(tr.getAttribute('data-idx'), 10);
        toggleIdx(i);
        paint();
      });
    });

    // 拖拽框选：选择框相对 wrap 绝对定位，避免被 modal transform 造成漂移
    let dragging = false, x0 = 0, y0 = 0;
    let baseSet = null;
    const rowsEls = () => Array.from(table.querySelectorAll('tbody tr[data-idx]'));
    const placeBox = (x1, y1) => {
      if (!box || !wrap) return { left: 0, top: 0, right: 0, bottom: 0, w: 0, h: 0 };
      const wr = wrap.getBoundingClientRect();
      const leftV = Math.min(x0, x1);
      const topV = Math.min(y0, y1);
      const rightV = Math.max(x0, x1);
      const bottomV = Math.max(y0, y1);
      const w = rightV - leftV;
      const h = bottomV - topV;
      // 相对 wrap 内容区（含滚动）
      const left = leftV - wr.left + wrap.scrollLeft;
      const top = topV - wr.top + wrap.scrollTop;
      box.style.display = (w > 3 || h > 3) ? 'block' : 'none';
      box.style.left = left + 'px';
      box.style.top = top + 'px';
      box.style.width = w + 'px';
      box.style.height = h + 'px';
      return { left: leftV, top: topV, right: rightV, bottom: bottomV, w, h };
    };
    const onMoveSel = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const sel = placeBox(e.clientX, e.clientY);
      if (sel.w <= 3 && sel.h <= 3) return;
      state.selected[key] = new Set(baseSet);
      rowsEls().forEach((tr) => {
        const r = tr.getBoundingClientRect();
        const hit = !(r.right < sel.left || r.left > sel.right || r.bottom < sel.top || r.top > sel.bottom);
        if (!hit) return;
        const i = parseInt(tr.getAttribute('data-idx'), 10);
        if (baseSet.has(i)) state.selected[key].delete(i);
        else state.selected[key].add(i);
      });
      paint();
    };
    const onUpSel = (e) => {
      const moved = Math.abs(e.clientX - x0) > 3 || Math.abs(e.clientY - y0) > 3;
      dragging = false;
      if (box) box.style.display = 'none';
      document.removeEventListener('mousemove', onMoveSel, true);
      document.removeEventListener('mouseup', onUpSel, true);
      if (moved) suppressClick = true;
      paint();
    };
    wrap.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      x0 = e.clientX;
      y0 = e.clientY;
      baseSet = new Set(state.selected[key]);
      placeBox(x0, y0);
      document.addEventListener('mousemove', onMoveSel, true);
      document.addEventListener('mouseup', onUpSel, true);
    });

    body.querySelectorAll('[data-scheme-idx]').forEach((btn) => btn.addEventListener('click', () => {
      state.activeSchemeIdx = parseInt(btn.getAttribute('data-scheme-idx'), 10) || 0;
      state._schemeUserSelected = true;
      openScoreModal('scheme');
    }));
    const clear = document.getElementById('uc-clear');
    if (clear) clear.onclick = () => { state.selected[key] = new Set(); paint(); };
    paint();
  }

  async function openRoomModal() {
    openModal('空闲教室', '<div class="uc-loading">加载教学楼…</div>', '');
    try {
      await ensureRoomCatalogLoaded(false);
      openModal('空闲教室', roomPickerHtml(), `<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>`);
    } catch (e) {
      openModal('空闲教室', `<div class="uc-empty">${escapeHtml(e && e.message || e)}</div>`, '');
    }
  }

  function getRoomHost(preferred) {
    // 小屏教室页优先 #uc-room-panel；桌面弹窗用 #uc-modal-body
    if (preferred && preferred.isConnected) return preferred;
    const panel = document.querySelector('#uc-room-panel');
    if (panel && panel.offsetParent !== null) return panel;
    if (panel && state.mobileTab === 'room') return panel;
    const modalBody = document.querySelector('#uc-modal-body');
    const modal = document.querySelector('#uc-modal');
    if (modal && modal.classList.contains('open') && modalBody) return modalBody;
    return panel || modalBody || null;
  }

  async function showBuilding(building, name, preferredHost) {
    const body = getRoomHost(preferredHost);
    if (!body) {
      console.warn('[URP++] no room host');
      return;
    }
    body.innerHTML = '<div class="uc-loading">加载占用网格…</div>';
    try {
      let pack = await loadBuildingOccupancy(building);
      body.innerHTML = '<div class="uc-loading">匹配课程名称…</div>';
      let plan = pack.planNumber || '';
      if (!plan) {
        try {
          const raw = await fetchText('/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback');
          const j = JSON.parse(raw);
          plan = (j && (j.zxjxjhh || j.xnxq || (j.dateList && j.dateList[0] && j.dateList[0].zxjxjhh))) || '';
          if (!plan && j && j.xkxx && j.xkxx[0]) {
            const k = Object.keys(j.xkxx[0] || {})[0];
            const one = k ? j.xkxx[0][k] : null;
            plan = (one && (one.zxjxjhh || one.executiveEducationPlanNumber)) || '';
          }
        } catch (_) {}
      }
      if (!plan) plan = '2025-2026-2-1';
      pack.planNumber = plan;
      try {
        pack = await enrichOccupancyWithCurriculum(pack, typeof building === 'object' ? building : {}, plan);
      } catch (e) {
        console.warn('[URP++] enrich occupancy', e);
      }
      state.occupancy = pack;
      state.roomDateOffset = Number(pack.dateOffset != null ? pack.dateOffset : state.roomDateOffset) || 0;
      const baseBuilding = typeof building === 'object' ? building : { path: building, name };
      state.currentBuilding = Object.assign({}, baseBuilding, {
        name: name || baseBuilding.name || '',
        dateOffset: state.roomDateOffset
      });
      name = name || (building && building.name) || '';
      // 加载过程中 host 可能被 render 重建，重新取一次
      const host = getRoomHost(body) || body;
      host.innerHTML = occupancyHtml(pack, name);
      bindUI(host);
    } catch (e) {
      const host = getRoomHost(body) || body;
      if (host) host.innerHTML = `<div class="uc-empty">${escapeHtml(e && e.message || e)}</div>`;
    }
  }

  async function loadAll(force) {
    if (force) {
      state.profile = null; state.schedule = null; state.scores = null; state.catalog = null; state.occupancy = null;
      state._termWeekResolved = false;
      state._schemeUserSelected = false;
      state._schemeInited = false;
    }
    state.loading.profile = state.loading.schedule = state.loading.scores = true;
    // 先解析教学周，再画界面，避免小屏首帧落到第1周
    try {
      const tw = await ensureTermWeekResolved();
      if (!state.weekLocked && tw >= 1) state.viewWeek = tw;
    } catch (_) {}
    render();
    await Promise.all([
      (async () => {
        try {
          if (!(state.profile && !force)) state.profile = await loadProfile();
          reconcileProfileAndScores();
        } catch (e) {
          state.profile = { name: '同学', majorPlan: '主修方案', majorGpa: '—', avatar: '' };
          console.warn(e);
        } finally {
          state.loading.profile = false;
          scheduleRender();
        }
      })(),
      (async () => {
        try { if (!(state.schedule && !force)) state.schedule = await loadSchedule(); }
        catch (e) { state.schedule = { courses: [], error: String(e && e.message || e) }; }
        finally {
          state.loading.schedule = false;
          // 课表加载后若周次仍可疑，再纠一次
          if (!state.weekLocked) {
            const tw = getCurrentWeekNumber() || readRememberedTermWeek();
            if (tw >= 1) state.viewWeek = tw;
          }
          scheduleRender();
        }
      })(),
      (async () => {
        let scorePack = null;
        try {
          if (!(state.scores && !force)) state.scores = await loadScores();
          scorePack = state.scores;
          reconcileProfileAndScores();
          if (scorePack && !scorePack.error && !scorePack.evaluationReady) {
            enrichScoresWithEvaluation(scorePack).then(() => {
              if (state.scores !== scorePack) return;
              reconcileProfileAndScores();
              scheduleRender();
            }).catch((e) => {
              console.warn('[URP++] attach evaluation', e);
            });
          }
        } catch (e) {
          state.scores = { passing: [], schemes: [], error: String(e && e.message || e) };
        } finally {
          state.loading.scores = false;
          scheduleRender();
        }
      })()
    ]);
    reconcileProfileAndScores();
    if (!state.weekLocked) {
      const tw = getCurrentWeekNumber() || readRememberedTermWeek();
      if (tw >= 1) state.viewWeek = tw;
    }
    scheduleRender();
  }

  function openCleanMode(force) {
    ensureRoot();
    state.open = true;
    state.uiReady = false;
    state.weekLocked = false;
    const curWeek = getCurrentWeekNumber() || readRememberedTermWeek();
    // 每次进入都按教学周重置；读不到时先用缓存，别默认 1
    state.viewWeek = curWeek >= 1 ? curWeek : (state.viewWeek >= 1 ? state.viewWeek : 0);
    document.documentElement.classList.add('urppp-clean-lock', CLEAN_FLAG);
    const el = rootEl();
    el.classList.remove('uc-settled', 'open');
    void el.offsetWidth; // 重触发根层进入动画
    el.classList.add('open');
    try { if (el.__syncCleanThemeDots) el.__syncCleanThemeDots(); } catch (_) {}
    loadAll(!!force);
  }
  function closeCleanMode() {
    state.open = false;
    state.uiReady = false;
    closeModal();
    document.documentElement.classList.remove('urppp-clean-lock', CLEAN_FLAG);
    const el = rootEl();
    if (el) {
      el.classList.remove('open', 'uc-settled');
      clearTimeout(el.__ucSettleTimer);
    }
  }

  function injectCleanEntry() {
    try {
      let btn = document.getElementById('urppp-nav-clean');
      // 仅首页展示清爽入口；业务页移除残留按钮
      if (!isHomePage()) {
        if (btn) btn.remove();
        return;
      }
      const host = document.getElementById('urppp-nav-theme') ||
        document.querySelector('#navbar .navbar-header') ||
        document.querySelector('#navbar');
      if (!host) return;
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'urppp-nav-clean';
        btn.title = '清爽模式';
        btn.innerHTML = `${ico('clean')}<span>清爽</span>`;
        btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openCleanMode(false); });
        host.appendChild(btn);
      }
      const skin = (typeof getSkin === 'function' ? getSkin() : 'apple');
      const isFlat = skin === 'flat';
      Object.entries({
        display: 'inline-flex', 'align-items': 'center', height: '28px', 'min-height': '28px',
        padding: '0 10px',
        border: isFlat ? '2px solid var(--text)' : '1px solid transparent',
        'border-radius': isFlat ? '0' : '999px',
        background: isFlat ? 'var(--surface)' : 'var(--input-bg)',
        color: 'var(--text)', 'font-size': '12px', gap: '6px',
        width: 'auto', 'box-shadow': isFlat ? 'none' : '0 1px 2px rgba(0,0,0,.05)',
        margin: '0 0 0 8px', float: 'none'
      }).forEach(([k, v]) => btn.style.setProperty(k, v, 'important'));
    } catch (e) {
      console.warn('[URP++] clean entry', e);
    }
  }

  window.__urpppCleanMode = {
    open: openCleanMode,
    close: closeCleanMode,
    inject: injectCleanEntry,
    refresh: refreshCleanPersonalDisplay,
    scoreToGpa,
    summarizeCourses
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(injectCleanEntry, 200));
  } else setTimeout(injectCleanEntry, 200);
  ;[600, 1500, 3000].forEach((ms) => setTimeout(injectCleanEntry, ms));

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    if (!document.body) { setTimeout(init, 10); return; }
    applyTheme(getCurrent());

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
    } else {
      beautifyInternal();
      try { ensureFeatureStyles(); } catch (_) {}
      try { refreshRouteFeatures(); } catch (e) { console.warn('[URP++] route feature refresh', e); }
      try { applyPersonalDisplay(document); } catch (_) {}
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
      clearTimeout(routeRefreshTimer);
      routeRefreshTimer = setTimeout(() => {
        state._termWeekResolved = false;
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        syncSidebarUnderNavbar();
        rebuildSidebarCompletely();
        rebuildNavbar();
        patchSchoolCalendarLink();
        wrapTables();
        bindTableWrapObserver();
        scheduleWeekScheduleFix();
        bindCourseTableOpacityObserver();
        scheduleBeautifyNoticeTables();
        scheduleScrubTableInlineBg();
        document.querySelectorAll('.page-content, #page-content-template').forEach((el) => {
          el.style.setProperty('padding', '16px 64px 40px', 'important');
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
