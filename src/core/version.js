export function parseUserscriptVersion(source) {
  const match = String(source || '').match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);
  return match ? match[1] : '';
}

function normalizeVersionParts(version) {
  return String(version || '0')
    .replace(/^v/i, '')
    .split(/[.+\-]/)
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? parseInt(part, 10) : part));
}

export function compareVersions(first, second) {
  const firstParts = normalizeVersionParts(first);
  const secondParts = normalizeVersionParts(second);
  const length = Math.max(firstParts.length, secondParts.length);
  for (let index = 0; index < length; index += 1) {
    const left = firstParts[index] == null ? 0 : firstParts[index];
    const right = secondParts[index] == null ? 0 : secondParts[index];
    const leftIsNumber = typeof left === 'number';
    const rightIsNumber = typeof right === 'number';
    if (leftIsNumber && rightIsNumber) {
      if (left > right) return 1;
      if (left < right) return -1;
      continue;
    }
    const leftText = String(left);
    const rightText = String(right);
    if (leftText > rightText) return 1;
    if (leftText < rightText) return -1;
  }
  return 0;
}
