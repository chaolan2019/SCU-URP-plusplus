/**
 * GM 存储安全包装：统一 try/catch，异常时返回 fallback / 静默。
 * 场景：@grant 缺失、存储满、隐私模式等不炸主流程。
 */

/** 读 GM 值，异常返回 fallback */
export function gmGet(key, fallback) {
  try { return GM_getValue(key, fallback); } catch (_) { return fallback; }
}

/** 写 GM 值，异常静默 */
export function gmSet(key, value) {
  try { GM_setValue(key, value); } catch (_) {}
}

/** 读 JSON 值：兼容旧版存对象/字符串两种形态，解析失败返回 fallback */
export function gmGetJson(key, fallback) {
  try {
    const raw = gmGet(key, '');
    if (raw && typeof raw === 'object') return raw;
    if (typeof raw === 'string' && raw.trim()) return JSON.parse(raw);
  } catch (_) {}
  return fallback;
}

/** 写 JSON 值 */
export function gmSetJson(key, value) {
  gmSet(key, JSON.stringify(value));
}

/** 删除 GM 键，异常静默 */
export function gmDelete(key) {
  try { GM_deleteValue(key); } catch (_) {}
}
