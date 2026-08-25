import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const entry = readFileSync(resolve(root, 'src/userscripts/urppp.entry.js'), 'utf8');

const IDS = ['flat', 'organic', 'brutal', 'neu'];
const outDir = resolve(root, '.store-prep/themes');
mkdirSync(outDir, { recursive: true });

// 剔除含 ${...} 的 css 规则块（变量/调色板定义，留主插件内置）
function stripVarBlocks(css) {
  let out = '';
  let segStart = 0;
  let depth = 0;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth = Math.max(0, depth - 1);
      if (depth === 0) {
        const block = css.slice(segStart, i + 1);
        if (!block.includes('${')) out += block + '\n';
        segStart = i + 1;
      }
    }
  }
  return out;
}

function extractBacktickTheme(id) {
  const marker = `else if (id === '${id}') {`;
  const start = entry.indexOf(marker);
  if (start < 0) return null;
  const frac = entry.slice(start);
  const btOpen = frac.indexOf('css += `');
  if (btOpen < 0) return null;
  const open = frac.indexOf('`', btOpen);
  const end = frac.indexOf('`', open + 1);
  if (open < 0 || end <= open) return null;
  return stripVarBlocks(frac.slice(open + 1, end)) || null;
}

function extractArrayTheme(id) {
  const marker = `else if (id === '${id}') {`;
  const start = entry.indexOf(marker);
  if (start < 0) return null;
  const frac = entry.slice(start + marker.length);
  const lines = frac.split('\n');
  let endAt = lines.length;
  for (let li = 0; li < lines.length; li += 1) {
    const line = lines[li];
    if (/^\s*\} else if \(id ===/.test(line) || /^\s*\} else if /.test(line) || /^\s*\}\s*$/.test(line)) { endAt = li; break; }
  }
  const block = lines.slice(0, endAt).join('\n');
  const css = [];
  const re = /'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const s = m[1];
    if (!(/html\[data-urppp-skin/.test(s) || /^:root/.test(s) || /^@media/.test(s) || /^html\[/.test(s))) continue;
    if (s.includes('${')) continue;
    css.push(s);
  }
  return css.length ? css.join('\n') : null;
}

const BACKTICK = new Set(['brutal', 'neu']);
for (const id of IDS) {
  const css = BACKTICK.has(id) ? extractBacktickTheme(id) : extractArrayTheme(id);
  if (css) {
    writeFileSync(resolve(outDir, id + '.css'), css + '\n');
    console.log('extracted', id + '.css', css.length, 'chars');
  } else {
    console.log('WARN no css for', id);
  }
}
console.log('done ->', outDir);
