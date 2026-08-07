// 集成验证：用 src/assist/ocr-zhjw.js（浏览器版模块）跑 V10_LABELS 人工标注样本
// 验证 JS 移植（int16 反量化 + 前向）与 Python 训练模型等价
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';
import { recognizeZhjwCaptchaData } from '../src/assist/ocr-zhjw.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const TEST_DIR = path.join(ROOT, 'zhjw-v4');

const V10_LABELS = {
  '781': '45ew', '782': 'ea88', '784': 'p4b4', '785': 'eyae', '786': '28en',
  '787': 'dwb7', '788': 'fmy8', '789': 'ad2b', '790': 'ncdd', '791': 'dc87',
  '792': 'bya6', '794': 'dw2d', '795': '8wf4', '796': 'x8w6', '797': 'ypd4',
  '798': '3epb', '799': 'eb7m', '800': 'edrm', '801': '4p3b', '802': '64p7',
  '803': 'gax3', '804': 'bgf6', '806': 'pen2', '808': '2mgn', '809': '8ewp',
  '810': 'fefw', '811': 'wn8a', '812': 'dgm2', '814': '77da', '815': 'fecx',
  '816': 'n3ca', '817': '7dbn', '818': '4xge', '821': '28md', '823': 'ybyw',
  '824': '5w5m', '827': 'de34', '828': 'yc68', '829': '7cec', '831': 'a2an',
  '832': '7c42', '834': 'eny6', '836': 'ewnf', '837': '5d3g', '838': 'yxnf',
  '840': 'f48c', '841': 'cy54', '842': 'xe4e', '843': '44wg', '844': 'ng4p',
  '845': '5bgw', '846': 'ph43', '847': 'xgnn', '848': 'necd', '849': 'n6mw',
  '850': 'g27n', '851': 'mxc4', '852': 'x3bc', '853': 'x7f6', '856': 'ecn8',
  '857': '8bfe', '858': 'cafp', '859': 'y266', '860': 'ddx7', '861': '7m4y',
  '864': 'xpgg', '865': 'xy4g', '866': 'gbwg', '867': '3wpf', '868': '8635',
  '869': '2nm4', '870': 'm7np', '872': 'xp3y', '873': 'wb4n', '875': 'ccc6',
  '877': 'f6fd', '878': '5afw', '879': 'xcw6', '880': 'bbn5',
};

let imgHit = 0, charHit = 0, charTotal = 0;
const errors = [];
const confs = [];
for (const [sid, label] of Object.entries(V10_LABELS)) {
  const img = await Jimp.read(path.join(TEST_DIR, sid + '.jpg'));
  // Jimp 是 RGBA（180×60），构造 ImageData 兼容结构
  const data = new Uint8ClampedArray(img.bitmap.data.buffer, 0, img.bitmap.width * img.bitmap.height * 4);
  const r = recognizeZhjwCaptchaData({ data, width: 180, height: 60 });
  if (!r) {
    errors.push(`${sid}: ${label} -> SEG_FAIL`);
    continue;
  }
  confs.push(r.conf);
  if (r.code === label) imgHit++;
  else errors.push(`${sid}: ${label} -> ${r.code} (conf ${r.conf.toFixed(2)})`);
  for (let k = 0; k < 4; k++) {
    charTotal++;
    if (r.code[k] === label[k]) charHit++;
  }
}

const n = Object.keys(V10_LABELS).length;
console.log(`JS 集成验证（${n} 张人工标注）:`);
console.log(`整图: ${imgHit}/${n} = ${(imgHit / n * 100).toFixed(1)}%`);
console.log(`字符: ${charHit}/${charTotal} = ${(charHit / charTotal * 100).toFixed(1)}%`);
const avgConf = confs.reduce((a, b) => a + b, 0) / (confs.length || 1);
console.log(`平均置信度: ${avgConf.toFixed(3)}`);
console.log(`错误 ${errors.length} 个:`);
for (const e of errors.slice(0, 25)) console.log(' ', e);
