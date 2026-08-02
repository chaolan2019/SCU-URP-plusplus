export function createAssistStorage(getValue, setValue) {
  function getBool(key, fallback) {
    try {
      return !!getValue(key, fallback);
    } catch (_) {
      return !!fallback;
    }
  }

  function getStr(key, fallback) {
    const defaultValue = fallback == null ? '' : fallback;
    try {
      const value = getValue(key, defaultValue);
      return value == null ? '' : String(value);
    } catch (_) {
      return String(defaultValue);
    }
  }

  function getNum(key, fallback) {
    const value = Number(getStr(key, String(fallback)));
    return Number.isFinite(value) ? value : fallback;
  }

  function getJSON(key, fallback) {
    try {
      const raw = getValue(key, '');
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function setVal(key, value) {
    try {
      setValue(key, value);
    } catch (_) {}
  }

  function setJSON(key, value) {
    setVal(key, JSON.stringify(value == null ? {} : value));
  }

  return { getBool, getStr, getNum, getJSON, setVal, setJSON };
}
