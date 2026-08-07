import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAIN_FILES = {
  package: 'package.json',
  lockfile: 'package-lock.json',
  metadata: 'src/metadata/urppp.json',
  entry: 'src/userscripts/urppp.entry.js',
  readme: 'README.md',
  changelog: 'CHANGELOG.md',
};
const VERSION_JSON = 'version.json';
const ASSIST_FILES = {
  metadata: 'src/metadata/urpppp.json',
  entry: 'src/userscripts/urpppp.entry.js',
};
const GENERATED_FILES = ['urppp.user.js', 'urpppp.user.js'];
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function parseVersion(value) {
  const match = String(value || '').trim().match(SEMVER_PATTERN);
  if (!match) throw new Error(`无效版本号：${value || '(empty)'}，必须使用 X.Y.Z`);
  return match.slice(1).map(Number);
}

export function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
  }
  return 0;
}

export function extractChangelogSection(changelog, version) {
  const headingRe = /^## \[[^\]]+\] - \d{4}-\d{2}-\d{2}/gm;
  const headings = [...changelog.matchAll(headingRe)];
  const target = headings.findIndex((m) => m[0].includes(`## [${version}]`));
  if (target < 0) throw new Error(`无法从 CHANGELOG.md 提取 ${version} 段落`);
  const start = headings[target].index;
  const end = target + 1 < headings.length ? headings[target + 1].index : changelog.length;
  return changelog.slice(start, end).replace(/\n$/, '').trimEnd();
}

export async function purgeJsdelivr({ version, assistVersion }) {
  // jsDelivr 缓存刷新：发布后立即让 CDN 返回新内容，避免缓存延迟窗口误报旧版本
  const files = ['version.json', 'urppp.user.js', 'urpppp.user.js', 'CHANGELOG.md'];
  const paths = files.map((f) => `/gh/chaolan2019/SCU-URP-plusplus@main/${f}`);
  try {
    const res = await fetch('https://purge.jsdelivr.net/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: paths }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const body = await res.json();
    console.log(`jsDelivr purge: id=${body.id} status=${body.status}（${paths.length} 个文件）`);
  } catch (error) {
    console.warn(`jsDelivr purge 失败（不影响发布，缓存数分钟内自动同步）：${error instanceof Error ? error.message : error}`);
  }
}

export function parseReleaseArgs(args) {
  const values = Array.from(args || []);
  const version = values.shift();
  let assistVersion = '';
  while (values.length) {
    const flag = values.shift();
    if (flag !== '--assist' || assistVersion || !values.length) {
      throw new Error(`未知或不完整的发布参数：${flag || '(empty)'}`);
    }
    assistVersion = values.shift();
  }
  return { version, assistVersion };
}

export function promoteChangelog(changelog, version, date) {
  if (new RegExp(`^## \\[${version.replaceAll('.', '\\.')}\\](?:\\s|$)`, 'm').test(changelog)) {
    throw new Error(`CHANGELOG.md 已存在 ${version} 段落`);
  }
  const match = changelog.match(/(^## \[Unreleased\][ \t]*\r?\n)([\s\S]*?)(?=\r?\n## \[)/m);
  if (!match) throw new Error('CHANGELOG.md 缺少 [Unreleased] 段落');
  const notes = match[2].trim();
  if (!notes) throw new Error('CHANGELOG.md 的 [Unreleased] 为空，拒绝发布');
  const release = `${match[1]}\n## [${version}] - ${date}\n\n${notes}\n`;
  return changelog.slice(0, match.index) + release + changelog.slice(match.index + match[0].length);
}

function replaceOnce(source, pattern, replacement, label) {
  const matches = source.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`));
  if (!matches || matches.length !== 1) {
    throw new Error(`${label} 期望匹配 1 处，实际 ${matches ? matches.length : 0} 处`);
  }
  return source.replace(pattern, replacement);
}

function localDate() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function run(command, args) {
  execFileSync(command, args, { cwd: ROOT, stdio: 'inherit' });
}

function runNpm(args) {
  if (process.env.npm_execpath) {
    run(process.execPath, [process.env.npm_execpath, ...args]);
    return;
  }
  if (process.platform === 'win32') {
    run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm', ...args]);
    return;
  }
  run('npm', args);
}

async function readSnapshots(paths) {
  const entries = await Promise.all(paths.map(async (relativePath) => [
    relativePath,
    await readFile(path.join(ROOT, relativePath), 'utf8'),
  ]));
  return new Map(entries);
}

async function restoreSnapshots(snapshots) {
  await Promise.all(Array.from(snapshots, ([relativePath, content]) => (
    writeFile(path.join(ROOT, relativePath), content, 'utf8')
  )));
}

export async function prepareRelease(version, options = {}) {
  parseVersion(version);
  const date = options.date || localDate();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`无效发布日期：${date}`);

  const assistVersion = options.assistVersion || '';
  if (assistVersion) parseVersion(assistVersion);
  const trackedPaths = [...new Set([
    ...Object.values(MAIN_FILES),
    ...Object.values(ASSIST_FILES),
    ...GENERATED_FILES,
    VERSION_JSON,
  ])];
  const snapshots = await readSnapshots(trackedPaths);
  const packageData = JSON.parse(snapshots.get(MAIN_FILES.package));
  const lockfileData = JSON.parse(snapshots.get(MAIN_FILES.lockfile));
  const metadataData = JSON.parse(snapshots.get(MAIN_FILES.metadata));
  const assistMetadataData = JSON.parse(snapshots.get(ASSIST_FILES.metadata));
  const currentVersion = packageData.version;
  const currentAssistVersion = assistMetadataData.version;

  if (compareVersions(version, currentVersion) <= 0) {
    throw new Error(`目标版本 ${version} 必须高于当前版本 ${currentVersion}`);
  }
  if (metadataData.version !== currentVersion) {
    throw new Error(`metadata 版本 ${metadataData.version} 与 package 版本 ${currentVersion} 不一致`);
  }
  if (assistVersion && compareVersions(assistVersion, currentAssistVersion) <= 0) {
    throw new Error(`辅助插件目标版本 ${assistVersion} 必须高于当前版本 ${currentAssistVersion}`);
  }

  packageData.version = version;
  lockfileData.version = version;
  if (!lockfileData.packages?.['']) throw new Error('package-lock.json 缺少根包信息');
  lockfileData.packages[''].version = version;
  metadataData.version = version;

  const entry = replaceOnce(
    snapshots.get(MAIN_FILES.entry),
    /const URPPP_VERSION = ['"][^'"]+['"];/,
    `const URPPP_VERSION = '${version}';`,
    'URPPP_VERSION',
  );
  let readme = replaceOnce(
    snapshots.get(MAIN_FILES.readme),
    /<strong>主脚本 v[^<]+<\/strong>/,
    `<strong>主脚本 v${version}</strong>`,
    'README 主脚本版本',
  );
  const changelog = promoteChangelog(snapshots.get(MAIN_FILES.changelog), version, date);
  let assistEntry = snapshots.get(ASSIST_FILES.entry);
  if (assistVersion) {
    assistMetadataData.version = assistVersion;
    assistEntry = replaceOnce(
      assistEntry,
      /const URPPPP_VERSION = ['"][^'"]+['"];/,
      `const URPPPP_VERSION = '${assistVersion}';`,
      'URPPPP_VERSION',
    );
    readme = replaceOnce(
      readme,
      /辅助插件 v[^<\s]+/,
      `辅助插件 v${assistVersion}`,
      'README 辅助插件版本',
    );
  }

  const updates = new Map([
    [MAIN_FILES.package, `${JSON.stringify(packageData, null, 2)}\n`],
    [MAIN_FILES.lockfile, `${JSON.stringify(lockfileData, null, 2)}\n`],
    [MAIN_FILES.metadata, `${JSON.stringify(metadataData, null, 2)}\n`],
    [MAIN_FILES.entry, entry],
    [MAIN_FILES.readme, readme],
    [MAIN_FILES.changelog, changelog],
  ]);
  if (assistVersion) {
    updates.set(ASSIST_FILES.metadata, `${JSON.stringify(assistMetadataData, null, 2)}\n`);
    updates.set(ASSIST_FILES.entry, assistEntry);
  }
  // 生成 version.json：多源更新检测专用（只含最新版本段落，跨多版本时客户端拉 CHANGELOG.md 全文）
  const versionJson = {
    version,
    prevVersion: currentVersion,
    assist: assistVersion || currentAssistVersion,
    updated: date,
    changelog: extractChangelogSection(changelog, version),
  };
  updates.set(VERSION_JSON, `${JSON.stringify(versionJson, null, 2)}\n`);

  try {
    await Promise.all(Array.from(updates, ([relativePath, content]) => (
      writeFile(path.join(ROOT, relativePath), content, 'utf8')
    )));
    run(process.execPath, [path.join(ROOT, 'tools/build.mjs')]);
    runNpm(['run', 'check']);
    await purgeJsdelivr({ version, assistVersion });
  } catch (error) {
    await restoreSnapshots(snapshots);
    throw new Error(`发布准备失败，已恢复所有文件：${error instanceof Error ? error.message : error}`);
  }

  return {
    currentVersion,
    version,
    currentAssistVersion,
    assistVersion,
    date,
    files: Array.from(updates.keys()),
  };
}

async function main() {
  const { version, assistVersion } = parseReleaseArgs(process.argv.slice(2));
  if (!version) {
    throw new Error('用法：npm run release:prepare -- X.Y.Z [--assist A.B.C]');
  }
  const result = await prepareRelease(version, { assistVersion });
  console.log(`发布准备完成：${result.currentVersion} -> ${result.version} (${result.date})`);
  if (result.assistVersion) {
    console.log(`辅助插件版本：${result.currentAssistVersion} -> ${result.assistVersion}`);
  }
  console.log('下一步：检查 diff、完成真实教务验收，然后提交 release: v' + result.version);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
