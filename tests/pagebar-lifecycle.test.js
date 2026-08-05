import test from 'node:test';
import assert from 'node:assert/strict';
import { createPagebarLifecycle } from '../src/features/table-beautify/pagebar-lifecycle.js';

test('schedules pagebar retries once and binds one observer per host', () => {
  const timers = [];
  const observed = [];
  const beautifyCalls = [];
  const host = { parentElement: { id: 'parent' } };
  class Observer {
    constructor(callback) { this.callback = callback; }
    observe(target, options) {
      observed.push({ observer: this, target, options });
    }
  }
  const lifecycle = createPagebarLifecycle({
    beautifyPagebar: (root) => beautifyCalls.push(root || null),
    documentRef: { querySelectorAll: () => [host] },
    windowRef: {},
    MutationObserverRef: Observer,
    setTimeoutRef(callback, delay) {
      timers.push({ callback, delay });
      return timers.length;
    },
    clearTimeoutRef() {},
  });

  lifecycle.scheduleBeautifyPagebar();
  assert.deepEqual(timers.map(({ delay }) => delay), [0, 300, 1000, 2500]);

  timers[0].callback();
  assert.equal(beautifyCalls.length, 1);
  assert.equal(observed.length, 1);
  assert.equal(host.__urpppPagebarObs, true);

  timers[1].callback();
  assert.equal(observed.length, 1);

  observed[0].observer.callback();
  assert.equal(timers.at(-1).delay, 150);
  timers.at(-1).callback();
  assert.equal(beautifyCalls.at(-1), host.parentElement);
});

test('subsequent schedule requests trigger one immediate refresh', () => {
  const timers = [];
  const windowRef = { __urpppPagebarBound: true };
  const lifecycle = createPagebarLifecycle({
    beautifyPagebar() {},
    documentRef: { querySelectorAll: () => [] },
    windowRef,
    MutationObserverRef: class {},
    setTimeoutRef(callback, delay) { timers.push({ callback, delay }); },
    clearTimeoutRef() {},
  });

  lifecycle.scheduleBeautifyPagebar();
  assert.deepEqual(timers.map(({ delay }) => delay), [0]);
});
