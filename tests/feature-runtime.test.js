import test from 'node:test';
import assert from 'node:assert/strict';
import { createFeatureRuntime, defineFeature } from '../src/core/feature-runtime.js';

test('feature definitions require explicit lifecycle functions', () => {
  assert.throws(() => defineFeature(), /definition must be an object/);
  assert.throws(() => defineFeature({ id: '' }), /feature id is required/);
  assert.throws(() => defineFeature({ id: 'x' }), /x\.matches must be a function/);
  assert.throws(() => createFeatureRuntime([
    { id: 'x', matches() {}, mount() {}, unmount() {} },
    { id: 'x', matches() {}, mount() {}, unmount() {} },
  ]), /duplicate feature id/);
});

test('feature runtime unmounts before route replacement and remounts idempotently', () => {
  const events = [];
  const schedule = defineFeature({
    id: 'schedule-export',
    matches: ({ path }) => path.startsWith('/schedule'),
    mount: ({ root }) => events.push(`mount:${root}`),
    unmount: ({ root }) => events.push(`unmount:${root}`),
  });
  const grades = defineFeature({
    id: 'grades',
    matches: ({ path }) => path.startsWith('/grades'),
    mount: ({ root }) => events.push(`mount:${root}`),
    unmount: ({ root }) => events.push(`unmount:${root}`),
  });
  const runtime = createFeatureRuntime([schedule, grades]);

  assert.equal(runtime.refresh({ path: '/schedule/index', root: 'schedule-a', lifecycleKey: 'a' }), 'schedule-export');
  assert.equal(runtime.refresh({ path: '/schedule/index', root: 'schedule-b', lifecycleKey: 'b' }), 'schedule-export');
  assert.equal(runtime.refresh({ path: '/schedule/index', root: 'schedule-b', lifecycleKey: 'b' }), 'schedule-export');
  assert.equal(runtime.refresh({ path: '/grades/index', root: 'grades-a', lifecycleKey: 'grades' }), 'grades');
  runtime.unmount();

  assert.deepEqual(events, [
    'mount:schedule-a',
    'unmount:schedule-a',
    'mount:schedule-b',
    'mount:schedule-b',
    'unmount:schedule-b',
    'mount:grades-a',
    'unmount:grades-a',
  ]);
  assert.equal(runtime.getActiveFeatureId(), null);
  assert.deepEqual(runtime.listFeatureIds(), ['schedule-export', 'grades']);
});

test('failed mounts execute cleanup and leave no active feature', () => {
  const events = [];
  const runtime = createFeatureRuntime([{
    id: 'broken',
    matches: () => true,
    mount() {
      events.push('mount');
      throw new Error('mount failed');
    },
    unmount() {
      events.push('unmount');
    },
  }]);

  assert.throws(() => runtime.refresh({}), /mount failed/);
  assert.deepEqual(events, ['mount', 'unmount']);
  assert.equal(runtime.getActiveFeatureId(), null);
});
