import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const entry = readFileSync(resolve(root, 'src/userscripts/urppp.entry.js'), 'utf8');

const IDS = ['flat', 'organic', 'brutal', 'neu'];
const outDir = resolve(root, '.store-prep/themes');
mkdirSync(outDir, { recursive: true });

function extractThemeCss(id) {
  const marker = `else if (id === '${id}') {`;
  const start = entry.indexOf(marker);
  if (start < 0) return null;
  const chunked = entry.slice(start + marker.length);
  const lines = chunked.split('\n');
  let endAt = lines.length;
  for (let li = 0; li < lines.length; li += 1) {
    const line = lines[li];
    if (/^\s*\} else if \(id ===/.test(line) || /^\s*\} else if /.test(line) || /^\s*\}\s*$/.test(line)) {
      endAt = li;
      break;
    }
  }
  const block = lines.slice(0, endAt).join('\n');
  const css = [];
  const re = /'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const s = m[1] != null ? m[1] : m[2];
    if (!(/html\[data-urppp-skin/.test(s) || /^:root/.test(s) || /^@media/.test(s) || /^html\[/.test(s))) continue;
    css.push(s);
  }
  return css.length ? css.join('\n') : null;
}

for (const id of IDS) {
  const css = extractThemeCss(id);
  if (css) {
    writeFileSync(resolve(outDir, id + '.css'), css + '\n');
    console.log('extracted', id + '.css', css.length, 'chars');
  } else {
    console.log('WARN no css for', id);
  }
}
console.log('done ->', outDir);
