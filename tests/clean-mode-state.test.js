import test from 'node:test';
import assert from 'node:assert/strict';
import { createCleanModeState, resetCleanModeData } from '../src/features/clean-mode/state.js';

test('clean mode state starts closed with empty data buckets', () => {
  const state = createCleanModeState();
  assert.equal(state.open, false);
  assert.equal(state.mobileTab, 'home');
  assert.equal(state.profile, null);
  assert.equal(state.schedule, null);
  assert.equal(state.scores, null);
  assert.equal(state.catalog, null);
  assert.equal(state.occupancy, null);
  assert.equal(state.viewWeek, 0);
  assert.equal(state.weekLocked, false);
  assert.deepEqual(state.loading, { profile: false, schedule: false, scores: false, room: false });
  assert.ok(state.selected.passing instanceof Set);
  assert.ok(state.selected.scheme instanceof Set);
});

test('reset clears loaded data and selection flags while preserving UI state', () => {
  const state = createCleanModeState();
  state.open = true;
  state.mobileTab = 'schedule';
  state.profile = { name: '同学' };
  state.schedule = { courses: [] };
  state.scores = { passing: [] };
  state.catalog = {};
  state.occupancy = {};
  state._termWeekResolved = true;
  state._schemeUserSelected = true;
  state._schemeInited = true;

  resetCleanModeData(state);

  assert.equal(state.profile, null);
  assert.equal(state.schedule, null);
  assert.equal(state.scores, null);
  assert.equal(state.catalog, null);
  assert.equal(state.occupancy, null);
  assert.equal(state._termWeekResolved, false);
  assert.equal(state._schemeUserSelected, false);
  assert.equal(state._schemeInited, false);
  assert.equal(state.open, true);
  assert.equal(state.mobileTab, 'schedule');
});
