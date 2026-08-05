import test from 'node:test';
import assert from 'node:assert/strict';
import { createNoticeTableLifecycle } from '../src/features/table-beautify/notice-lifecycle.js';

test('binds one delegated notice hover scrub listener', () => {
  const listeners = [];
  const animationFrames = [];
  const scrubbedRows = [];
  const row = { id: 'notice-row' };
  const windowRef = {};
  const lifecycle = createNoticeTableLifecycle({
    beautifyNoticeTables() {},
    pinNoticeRowSurface: (value) => scrubbedRows.push(value),
    documentRef: {
      addEventListener(type, listener, capture) { listeners.push({ type, listener, capture }); },
    },
    windowRef,
    MutationObserverRef: class {},
    requestAnimationFrameRef: (callback) => animationFrames.push(callback),
    setTimeoutRef() {},
    clearTimeoutRef() {},
  });

  lifecycle.bindNoticeHoverScrub();
  lifecycle.bindNoticeHoverScrub();
  assert.equal(listeners.length, 1);
  assert.deepEqual({ type: listeners[0].type, capture: listeners[0].capture }, { type: 'mouseout', capture: true });

  listeners[0].listener({ target: { closest: () => row } });
  animationFrames[0]();
  assert.deepEqual(scrubbedRows, [row]);
  assert.equal(windowRef.__urpppNoticeHoverScrub, true);
});

test('schedules notice scans and replaces observers when the PJAX root changes', () => {
  const timers = [];
  const observed = [];
  const disconnected = [];
  class Observer {
    constructor(callback) { this.callback = callback; }
    observe(root, options) { observed.push({ observer: this, root, options }); }
    disconnect() { disconnected.push(this); }
  }

  const firstRoot = { isConnected: true };
  const secondRoot = { isConnected: true };
  let root = firstRoot;
  const windowRef = {};
  const lifecycle = createNoticeTableLifecycle({
    beautifyNoticeTables() {},
    pinNoticeRowSurface() {},
    documentRef: {
      body: firstRoot,
      getElementById: () => root,
      querySelector: () => null,
      addEventListener() {},
    },
    windowRef,
    MutationObserverRef: Observer,
    requestAnimationFrameRef() {},
    setTimeoutRef(callback, delay) { timers.push({ callback, delay }); return timers.length; },
    clearTimeoutRef() {},
  });

  lifecycle.scheduleBeautifyNoticeTables();
  assert.deepEqual(timers.slice(0, 3).map(({ delay }) => delay), [0, 400, 1500]);
  assert.equal(observed.length, 1);

  lifecycle.scheduleBeautifyNoticeTables();
  assert.equal(observed.length, 1);

  root = secondRoot;
  lifecycle.scheduleBeautifyNoticeTables();
  assert.equal(observed.length, 2);
  assert.equal(disconnected.length, 1);
  assert.equal(windowRef.__urpppNoticeObs.root, secondRoot);
});
