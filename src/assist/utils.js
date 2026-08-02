export function log(...args) {
  console.log('[URP++ 辅助]', ...args);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Preserve the assistant script's original behavior: apostrophes are not escaped.
export function escapeAssistHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function setInputValue(input, value) {
  if (!input) return;
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  if (descriptor && descriptor.set) descriptor.set.call(input, value);
  else input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

export function setTextAreaValue(element, value) {
  if (!element) return;
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
  if (descriptor && descriptor.set) descriptor.set.call(element, value);
  else element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

export function randInt(min, max) {
  const lower = Math.ceil(Number(min));
  const upper = Math.floor(Number(max));
  if (!Number.isFinite(lower) || !Number.isFinite(upper)) return 0;
  if (upper <= lower) return lower;
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

export function pickRandom(values) {
  if (!values || !values.length) return null;
  return values[Math.floor(Math.random() * values.length)];
}

export function parseLetters(value) {
  const text = String(value || '').toUpperCase();
  const letters = new Set();
  (text.match(/[A-K]/g) || []).forEach((letter) => letters.add(letter));
  return Array.from(letters);
}

export function parsePerQuestionMap(value) {
  const map = {};
  String(value || '').split(/\r?\n/).forEach((line) => {
    const text = line.trim();
    if (!text || text.startsWith('#')) return;
    const match = text.match(/^(\d+)\s*[:：=]\s*(.+)$/);
    if (match) map[match[1]] = match[2].trim();
  });
  return map;
}

export function optionLetter(valueOrLabel) {
  const text = String(valueOrLabel || '');
  const match = text.match(/^\s*([A-K])\s*[_\.、:：\-\s]/i) || text.match(/^\s*([A-K])\s*$/i);
  return match ? match[1].toUpperCase() : '';
}

export function lettersForSingle(questionNumber, config) {
  const perQuestion = (config.singlePerQ
    && (config.singlePerQ[questionNumber] || config.singlePerQ[String(questionNumber)])) || '';
  const pool = parseLetters(perQuestion || config.singleLetters || 'A');
  return pool.length ? pool : ['A'];
}

export function lettersForMulti(questionNumber, config) {
  const perQuestion = (config.multiPerQ
    && (config.multiPerQ[questionNumber] || config.multiPerQ[String(questionNumber)])) || '';
  const pool = parseLetters(perQuestion || config.multiLetters || 'A,B,C');
  return pool.length ? pool : ['A'];
}
