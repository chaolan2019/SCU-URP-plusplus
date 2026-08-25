import { readFileSync, writeFileSync } from 'node:fs';
const f = 'src/userscripts/urppp.entry.js';
let s = readFileSync(f, 'utf8');
const fM = "      } else if (id === 'flat') {";
const i = s.indexOf(fM);
const eM = "      else if (id === 'editorial') {";
const j = s.indexOf(eM, i);
if (i < 0 || j < 0) { console.log('marker not found', i, j); process.exit(1); }
// 删 flat + brutal 分支（保留 apple 尾 } + editorial marker）
s = s.slice(0, i) + "      }\n      " + s.slice(j);
writeFileSync(f, s);
console.log('deleted flat+brutal, saved', j - i, 'chars');
