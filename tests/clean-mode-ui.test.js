import test from 'node:test';
import assert from 'node:assert/strict';
import { createCleanModeState } from '../src/features/clean-mode/state.js';
import { createCleanModeUI } from '../src/features/clean-mode/ui.js';

function uiFixture() {
  const state = createCleanModeState();
  const ui = createCleanModeUI({
    state,
    deps: {
      DAY_NAMES: ['日', '一', '二', '三', '四', '五', '六'],
      applyPersonalDisplay() {},
      bindScheduleExportHosts() {},
      closeCleanMode() {},
      ensureRoomCatalogLoaded: async () => [{ id: 'A' }],
      enrichOccupancyWithCurriculum: async (pack) => pack,
      ensureRoot: () => ({
        querySelector: () => ({
          classList: { add() {}, remove() {} },
          textContent: '',
          innerHTML: '',
          querySelector: () => null,
          querySelectorAll: () => [],
          setAttribute() {},
          removeAttribute() {},
          addEventListener() {},
        }),
      }),
      escapeHtml: (value) => String(value || ''),
      fetchText: async () => '{}',
      getCurrentWeekNumber: () => 0,
      getViewWeekNumber: () => 3,
      inferMaxWeek: () => 20,
      isUnevaluatedScore: () => false,
      isValidOfficialGpa: () => false,
      loadBuildingOccupancy: async () => ({ rooms: [] }),
      metricHtml: () => '',
      occupancyHtml: () => '<div class="uc-empty">空</div>',
      render() {},
      rootEl: () => null,
      roomPickerHtml: () => '<div class="uc-empty">未读到教学楼列表</div>',
      scoreToGpa: () => null,
      scoreToNumber: (value) => (typeof value === 'number' ? value : Number(value)),
      summarizeCourses: () => ({}),
      summarizeCoursesPreferOfficial: () => ({ totalCredit: 0, avgScore: 0, avgGpa: 0 }),
    },
  });
  return { state, ui };
}

test('clean mode UI exposes modal and room interactions', () => {
  const { ui } = uiFixture();
  assert.equal(typeof ui.bindUI, 'function');
  assert.equal(typeof ui.openModal, 'function');
  assert.equal(typeof ui.closeModal, 'function');
  assert.equal(typeof ui.openScoreModal, 'function');
  assert.equal(typeof ui.openRoomModal, 'function');
  assert.equal(typeof ui.showBuilding, 'function');
});

test('openRoomModal falls back to the empty catalog state', async () => {
  const { state, ui } = uiFixture();
  state.catalog = [];
  await ui.openRoomModal();
  assert.equal(state.loading.room, false);
});
