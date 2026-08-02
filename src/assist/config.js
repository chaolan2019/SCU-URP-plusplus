import {
  DEFAULT_COMMENTS,
  EVALUATION_KEYS,
  LOGIN_FAILURE_LIMIT,
  LOGIN_KEYS,
  LOGIN_PENDING_TTL,
} from './constants.js';

export function createAssistConfig(storage, now = () => Date.now()) {
  const { getBool, getStr, getNum, getJSON, setVal, setJSON } = storage;

  function loginConf() {
    return {
      enabled: getBool(LOGIN_KEYS.enabled, true),
      autoSubmit: getBool(LOGIN_KEYS.autoSubmit, true),
      ocrUrl: getStr(LOGIN_KEYS.ocrUrl, ''),
      zhjwUser: getStr(LOGIN_KEYS.zhjwUser, ''),
      zhjwPass: getStr(LOGIN_KEYS.zhjwPass, ''),
      casUser: getStr(LOGIN_KEYS.casUser, ''),
      casPass: getStr(LOGIN_KEYS.casPass, ''),
      shareCred: getBool(LOGIN_KEYS.shareCred, true),
      submitDelay: Math.max(0, getNum(LOGIN_KEYS.submitDelay, 300)),
    };
  }

  function emptyLoginGuardState(identity) {
    return {
      identity: String(identity || ''),
      failures: 0,
      paused: false,
      pending: null,
      updatedAt: now(),
    };
  }

  function getLoginGuardState() {
    const raw = getJSON(LOGIN_KEYS.guardState, {}) || {};
    const failures = Math.max(0, Math.min(LOGIN_FAILURE_LIMIT, Number(raw.failures) || 0));
    const pending = raw.pending && typeof raw.pending === 'object'
      ? {
        kind: String(raw.pending.kind || ''),
        identity: String(raw.pending.identity || ''),
        createdAt: Number(raw.pending.createdAt) || 0,
      }
      : null;
    return {
      identity: String(raw.identity || ''),
      failures,
      paused: failures >= LOGIN_FAILURE_LIMIT || !!raw.paused,
      pending,
      updatedAt: Number(raw.updatedAt) || 0,
    };
  }

  function saveLoginGuardState(state) {
    const next = Object.assign(emptyLoginGuardState(''), state || {}, { updatedAt: now() });
    setJSON(LOGIN_KEYS.guardState, next);
    return next;
  }

  function resetLoginGuardState(identity) {
    return saveLoginGuardState(emptyLoginGuardState(identity));
  }

  function loginIdentity(_kind, username) {
    return String(username || '').trim();
  }

  function ensureLoginGuardIdentity(kind, username) {
    const identity = loginIdentity(kind, username);
    const state = getLoginGuardState();
    if (state.identity && state.identity !== identity) return resetLoginGuardState(identity);
    if (!state.identity) return saveLoginGuardState(Object.assign(state, { identity }));
    return state;
  }

  function beginLoginProcess(kind, username) {
    const identity = loginIdentity(kind, username);
    const state = getLoginGuardState();
    const pending = state.pending;
    const fresh = pending && pending.createdAt > 0 && now() - pending.createdAt <= LOGIN_PENDING_TTL;
    const continuesPreviousAttempt = fresh && pending.identity === identity;
    if (!continuesPreviousAttempt) return resetLoginGuardState(identity);
    state.identity = identity;
    state.pending = null;
    state.failures = Math.min(LOGIN_FAILURE_LIMIT, state.failures + 1);
    state.paused = state.failures >= LOGIN_FAILURE_LIMIT;
    return saveLoginGuardState(state);
  }

  function markPendingAutoLogin(kind, username) {
    const state = ensureLoginGuardIdentity(kind, username);
    state.pending = {
      kind: String(kind || ''),
      identity: state.identity,
      createdAt: now(),
    };
    return saveLoginGuardState(state);
  }

  function clearLoginGuardAfterSuccess() {
    const state = getLoginGuardState();
    if (state.failures || state.paused || state.pending) resetLoginGuardState('');
  }

  function evalConf() {
    return {
      enabled: getBool(EVALUATION_KEYS.enabled, true),
      waitSec: Math.max(0, getNum(EVALUATION_KEYS.waitSec, 100)),
      scoreMin: Math.max(1, Math.min(100, getNum(EVALUATION_KEYS.scoreMin, 92))),
      scoreMax: Math.max(1, Math.min(100, getNum(EVALUATION_KEYS.scoreMax, 98))),
      singleLetters: getStr(EVALUATION_KEYS.singleLetters, 'A') || 'A',
      singlePerQ: getJSON(EVALUATION_KEYS.singlePerQ, {}) || {},
      multiLetters: getStr(EVALUATION_KEYS.multiLetters, 'A,B,C') || 'A,B,C',
      multiPerQ: getJSON(EVALUATION_KEYS.multiPerQ, {}) || {},
      multiAvoidNone: getBool(EVALUATION_KEYS.multiAvoidNone, true),
      commentTemplates: getStr(EVALUATION_KEYS.commentTemplates, DEFAULT_COMMENTS),
      autoFill: getBool(EVALUATION_KEYS.autoFill, true),
      autoSave: getBool(EVALUATION_KEYS.autoSave, false),
      saveDelay: Math.max(0, getNum(EVALUATION_KEYS.saveDelay, 500)),
      batchGapSec: Math.max(0, getNum(EVALUATION_KEYS.batchGapSec, 2)),
    };
  }

  function getBatchState() {
    return {
      active: getBool(EVALUATION_KEYS.batchActive, false),
      queue: getJSON(EVALUATION_KEYS.batchQueue, []) || [],
      index: Math.max(0, getNum(EVALUATION_KEYS.batchIndex, 0)),
    };
  }

  function setBatchState(partial) {
    const current = getBatchState();
    const next = Object.assign({}, current, partial || {});
    setVal(EVALUATION_KEYS.batchActive, !!next.active);
    setJSON(EVALUATION_KEYS.batchQueue, Array.isArray(next.queue) ? next.queue : []);
    setVal(EVALUATION_KEYS.batchIndex, String(Math.max(0, Number(next.index) || 0)));
    return next;
  }

  function clearBatchState() {
    setBatchState({ active: false, queue: [], index: 0 });
  }

  return {
    loginConf,
    emptyLoginGuardState,
    getLoginGuardState,
    saveLoginGuardState,
    resetLoginGuardState,
    ensureLoginGuardIdentity,
    beginLoginProcess,
    markPendingAutoLogin,
    clearLoginGuardAfterSuccess,
    evalConf,
    getBatchState,
    setBatchState,
    clearBatchState,
  };
}
