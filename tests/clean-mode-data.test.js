import test from 'node:test';
import assert from 'node:assert/strict';
import { createCleanModeState } from '../src/features/clean-mode/state.js';
import { createCleanModeDataLoader } from '../src/features/clean-mode/data.js';

function loaderFixture(overrides = {}) {
  const state = createCleanModeState();
  const calls = { render: 0, scheduleRender: 0, reset: 0 };
  const deps = {
    ensureTermWeekResolved: async () => 3,
    enrichScoresWithEvaluation: async () => {},
    getCurrentWeekNumber: () => 0,
    loadClassroomCatalog: async () => [{ id: 'A' }],
    loadProfile: async () => ({ name: '同学' }),
    loadSchedule: async () => ({ courses: [{ name: '工程数学' }] }),
    loadScores: async () => ({ passing: [], schemes: [], evaluationReady: true }),
    readRememberedTermWeek: () => 0,
    reconcileProfileAndScores: () => {},
    render() { calls.render += 1; },
    scheduleRender() { calls.scheduleRender += 1; },
    ...overrides,
  };
  const loader = createCleanModeDataLoader({ state, deps });
  return { state, deps, calls, loader };
}

test('loadAll fills profile, schedule, and scores from entry adapters', async () => {
  const { state, calls, loader } = loaderFixture();
  await loader.loadAll(false);

  assert.deepEqual(state.profile, { name: '同学' });
  assert.deepEqual(state.schedule.courses, [{ name: '工程数学' }]);
  assert.equal(state.scores.evaluationReady, true);
  assert.equal(state.loading.profile, false);
  assert.equal(state.loading.schedule, false);
  assert.equal(state.loading.scores, false);
  assert.equal(state.viewWeek, 3);
  assert.ok(calls.render >= 1);
  assert.ok(calls.scheduleRender >= 1);
});

test('force reload clears cached data before loading again', async () => {
  const { state, loader } = loaderFixture();
  state.profile = { name: '旧' };
  state.schedule = { courses: [] };
  state.scores = { passing: [] };

  await loader.loadAll(true);

  assert.deepEqual(state.profile, { name: '同学' });
  assert.equal(state.schedule.courses.length, 1);
});

test('ensureRoomCatalogLoaded caches catalog and reports errors', async () => {
  const { state, loader } = loaderFixture();
  const first = await loader.ensureRoomCatalogLoaded();
  assert.equal(first.length, 1);
  const second = await loader.ensureRoomCatalogLoaded();
  assert.equal(second.length, 1);

  const failing = loaderFixture({ loadClassroomCatalog: async () => { throw new Error('网络'); } });
  await failing.loader.ensureRoomCatalogLoaded();
  assert.match(failing.state.roomError, /网络/);
  assert.equal(failing.state.loading.room, false);
});
