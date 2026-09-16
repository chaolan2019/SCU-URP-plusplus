import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// 宿主的 pluginManager 会暴露两个对象：
//   - 外观（createPluginManager 的返回值）：只导出 api / install / update / bootFromCache 等少数成员
//   - api：完整的插件协议面（register / get / list / loaded / install ...）
// 把 api 上的成员当成外观成员调用，会抛 "X.loaded is not a function"，
// 而且只在对应分支真被执行时才暴露（例如辅助插件确实有新版本时），平时静默。
// 这类错误靠人眼 review 会漏，所以用静态契约测试兜住。

const entryUrl = new URL('../src/userscripts/urppp.entry.js', import.meta.url);
const managerUrl = new URL('../src/features/plugin-manager/index.js', import.meta.url);
const metadataUrl = new URL('../src/metadata/urppp.json', import.meta.url);

function keysOf(code, header) {
  const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`\\n${escaped}\\n([\\s\\S]*?)\\n  \\};`).exec(code);
  assert.ok(match, `在 plugin-manager 里找不到代码块：${header.trim()}`);
  return new Set(
    match[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//'))
      .map((line) => line.replace(/,$/, '').split(':')[0].trim())
      .filter(Boolean),
  );
}

function callsOn(code, prefix) {
  const pattern = new RegExp(`\\b${prefix}\\??\\.\\s*([A-Za-z_$][\\w$]*)\\s*\\(`, 'g');
  return [...code.matchAll(pattern)].map((m) => m[1]);
}

test('entry 调用的 pluginManager / authPlugin 成员必须真实存在于外观或 api 上', async () => {
  const [entry, manager] = await Promise.all([
    readFile(entryUrl, 'utf8'),
    readFile(managerUrl, 'utf8'),
  ]);

  const facadeKeys = keysOf(manager, '  return {');
  const apiKeys = keysOf(manager, '  const api = {');

  const violations = [];
  for (const prefix of ['pluginManager', 'authPlugin']) {
    // 外观直接调用（排除 .api 这一跳本身）
    for (const name of callsOn(entry, prefix)) {
      if (name === 'api') continue;
      if (!facadeKeys.has(name)) {
        violations.push(`${prefix}.${name}()：外观未导出（应走 ${prefix}.api.${name}() 或补进外观）`);
      }
    }
    // api 上的调用
    for (const name of callsOn(entry, `${prefix}.api`)) {
      if (!apiKeys.has(name)) {
        violations.push(`${prefix}.api.${name}()：api 未定义`);
      }
    }
  }

  assert.deepEqual(violations, [], `发现不存在的宿主成员调用：\n${violations.join('\n')}`);
});

// 宿主注入插件时，GM_* 是以形参形式传进去的（new Function(...gmNames, js)）。
// 形参名没写进主脚本 @grant，它在宿主里就是 undefined：typeof 守卫不报错，
// 插件的该能力静默失效。
// GM_registerMenuCommand 就是这样漏的——插件形态下的辅助插件，那几条右键菜单命令
// 一直没注册上，被插件自己的 try/catch 吞掉，页面上看不出任何异常。
// 这类漏项靠 review 发现不了，所以钉成断言。
function injectedGmNames(code) {
  const block = /const gmNames = \[([\s\S]*?)\];/.exec(code);
  assert.ok(block, '在 plugin-manager 里找不到 gmNames 列表');
  return [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

test('注入给插件的 GM_* 形参必须都在主脚本 grant 里', async () => {
  const [manager, metadataText] = await Promise.all([
    readFile(managerUrl, 'utf8'),
    readFile(metadataUrl, 'utf8'),
  ]);
  const granted = new Set(JSON.parse(metadataText).grant || []);

  const missing = injectedGmNames(manager).filter((name) => !granted.has(name));
  assert.deepEqual(
    missing,
    [],
    `以下 GM 能力作为形参传给了插件，但主脚本没 grant，插件侧会静默失效：\n${missing.join('\n')}`,
  );
});
