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
