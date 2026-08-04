// Shared deterministic color helpers.

export function hexToRgb(hex) {
  const match = String(hex).replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return { r: 30, g: 58, b: 95 };
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((channel) => {
    const value = Math.max(0, Math.min(255, Math.round(channel)));
    return value.toString(16).padStart(2, '0');
  }).join('');
}

export function normalizeHexColor(value) {
  let color = String(value || '').trim();
  if (!color) return '';
  if (color[0] !== '#') color = '#' + color;
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color.toUpperCase() : '';
}

export function darken(hex, proportion) {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - proportion;
  return rgbToHex(r * factor, g * factor, b * factor);
}

export function lighten(hex, proportion) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * proportion,
    g + (255 - g) * proportion,
    b + (255 - b) * proportion,
  );
}

export function alpha(hex, opacity) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function mixHex(left, right, proportion) {
  const a = hexToRgb(normalizeHexColor(left) || '#FFFFFF');
  const b = hexToRgb(normalizeHexColor(right) || '#FFFFFF');
  const factor = Math.max(0, Math.min(1, Number(proportion) || 0));
  return rgbToHex(
    a.r + (b.r - a.r) * factor,
    a.g + (b.g - a.g) * factor,
    a.b + (b.b - a.b) * factor,
  );
}
