import { expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const USERSCRIPT_PATH = path.join(ROOT, 'urppp.user.js');
export const FIXTURE_URLS = {
  home: 'http://zhjw.scu.edu.cn/index',
  'mobile-home': 'http://zhjw.scu.edu.cn/index',
  schedule: 'http://zhjw.scu.edu.cn/student/courseSelect/thisSemesterCurriculum/index',
  grades: 'http://zhjw.scu.edu.cn/student/integratedQuery/scoreQuery/allTermScores/index',
  evaluation: 'http://zhjw.scu.edu.cn/student/teachingEvaluation/teachingEvaluation/search',
  'free-classroom': 'http://zhjw.scu.edu.cn/student/teachingResources/freeClassroom/index',
};

const DEFAULT_VALUES = {
  urppp_auto_update_check_v1: false,
  urppp_theme_v3: 'default',
  urppp_skin_v1: 'apple',
  urppp_clean_default_v1: false,
};

async function installUserscriptMocks(page, values) {
  await page.addInitScript(({ entries }) => {
    const store = new Map(entries);
    const NativeMutationObserver = window.MutationObserver;
    const nativeAddEventListener = EventTarget.prototype.addEventListener;
    const nativeRemoveEventListener = EventTarget.prototype.removeEventListener;
    const observerRecords = [];
    const listenerRecords = [];

    window.MutationObserver = class TrackedMutationObserver extends NativeMutationObserver {
      constructor(callback) {
        const record = { active: false, callbackCount: 0, targets: [] };
        super((mutations, observer) => {
          record.callbackCount += 1;
          callback(mutations, observer);
        });
        record.observer = this;
        observerRecords.push(record);
      }

      observe(target, options) {
        const record = observerRecords.find((item) => item.observer === this);
        if (record && !record.targets.includes(target)) record.targets.push(target);
        if (record) record.active = true;
        return super.observe(target, options);
      }

      disconnect() {
        const record = observerRecords.find((item) => item.observer === this);
        if (record) record.active = false;
        return super.disconnect();
      }
    };

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      const capture = options === true || !!(options && options.capture);
      const duplicate = listenerRecords.some((item) => (
        item.active && item.target === this && item.type === type && item.listener === listener && item.capture === capture
      ));
      if (!duplicate) listenerRecords.push({ active: true, target: this, type, listener, capture });
      return nativeAddEventListener.call(this, type, listener, options);
    };

    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      const capture = options === true || !!(options && options.capture);
      const record = listenerRecords.find((item) => (
        item.active && item.target === this && item.type === type && item.listener === listener && item.capture === capture
      ));
      if (record) record.active = false;
      return nativeRemoveEventListener.call(this, type, listener, options);
    };

    window.__urpFixtureDiagnosticsSnapshot = () => {
      const activeObservers = observerRecords.filter((item) => item.active);
      const detachedObserverTargets = activeObservers
        .map((item) => item.targets.filter((target) => (
          target && target.nodeType === Node.ELEMENT_NODE && !target.isConnected
        )))
        .filter((targets) => targets.length)
        .map((targets) => targets.map((target) => ({
          tag: target.tagName,
          id: target.id || '',
          className: typeof target.className === 'string' ? target.className : '',
        })));
      return {
        activeObservers: activeObservers.length,
        detachedObservers: detachedObserverTargets.length,
        detachedObserverTargets,
        observerCallbacks: observerRecords.reduce((sum, item) => sum + item.callbackCount, 0),
        activeWindowListeners: listenerRecords.filter((item) => item.active && item.target === window).length,
        activeDocumentListeners: listenerRecords.filter((item) => item.active && item.target === document).length,
      };
    };

    window.__urpFixtureStore = store;
    window.unsafeWindow = window;
    window.GM_getValue = (key, fallback) => (store.has(key) ? store.get(key) : fallback);
    window.GM_setValue = (key, value) => store.set(key, value);
    window.GM_addStyle = (css) => {
      const style = document.createElement('style');
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
      return style;
    };
    window.GM_xmlhttpRequest = (options) => {
      if (options && typeof options.onerror === 'function') {
        options.onerror(new Error('network disabled in fixture'));
      }
    };
  }, { entries: Object.entries({ ...DEFAULT_VALUES, ...values }) });
}

export async function loadUrpFixture(page, options = {}) {
  const fixture = options.fixture || 'schedule';
  const fixturePath = path.join(ROOT, 'tests/fixtures', `${fixture}.html`);
  const fixtureUrl = options.url || FIXTURE_URLS[fixture];
  if (!fixtureUrl) throw new Error(`Unknown URP fixture: ${fixture}`);

  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  // 预装非内置主题的 css：若测试指定了非内置皮肤（flat/organic/brutal/editorial/neu），
  // getSkin() 依赖 themeDownloaded(id)（读 urppp_theme_css_<id>）才不回落 apple。
  const fixtureValues = { ...(options.values || {}) };
  const skinId = fixtureValues.urppp_skin_v1;
  const BUILTIN_SKINS = new Set(['apple', 'editorial']);
  if (skinId && !BUILTIN_SKINS.has(skinId)) {
    const cssKey = `urppp_theme_css_${skinId}`;
    if (fixtureValues[cssKey] == null) fixtureValues[cssKey] = '/* fixture mock theme */';
  }
  await installUserscriptMocks(page, fixtureValues);
  await page.route('http://zhjw.scu.edu.cn/**', (route) => route.fulfill({
    path: fixturePath,
    contentType: 'text/html; charset=utf-8',
  }));
  if (options.viewport) await page.setViewportSize(options.viewport);
  await page.goto(fixtureUrl);

  const pageRoot = page.locator('#page-content-template, .page-content').first();
  const nativePageHtml = await pageRoot.evaluate((element) => element.outerHTML);
  if (options.beforeUserscript) await options.beforeUserscript(page);
  await page.addScriptTag({ path: USERSCRIPT_PATH });
  await expect(page.locator('html')).toHaveClass(/urppp-ready/);

  return { fixtureUrl, nativePageHtml, pageErrors };
}
