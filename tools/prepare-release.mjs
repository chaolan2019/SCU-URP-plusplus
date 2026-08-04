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

  const trackedPaths = [...Object.values(MAIN_FILES), ...GENERATED_FILES];
  const snapshots = await readSnapshots(trackedPaths);
  const packageData = JSON.parse(snapshots.get(MAIN_FILES.package));
  const lockfileData = JSON.parse(snapshots.get(MAIN_FILES.lockfile));
  const metadataData = JSON.parse(snapshots.get(MAIN_FILES.metadata));
  const currentVersion = packageData.version;

  if (compareVersions(version, currentVersion) <= 0) {
    throw new Error(`目标版本 ${version} 必须高于当前版本 ${currentVersion}`);
  }
  if (metadataData.version !== currentVersion) {
    throw new Error(`metadata 版本 ${metadataData.version} 与 package 版本 ${currentVersion} 不一致`);
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
  const readme = replaceOnce(
    snapshots.get(MAIN_FILES.readme),
    /<strong>主脚本 v[^<]+<\/strong>/,
    `<strong>主脚本 v${version}</strong>`,
    'README 主脚本版本',
  );
  const changelog = promoteChangelog(snapshots.get(MAIN_FILES.changelog), version, date);

  const updates = new Map([
    [MAIN_FILES.package, `${JSON.stringify(packageData, null, 2)}\n`],
    [MAIN_FILES.lockfile, `${JSON.stringify(lockfileData, null, 2)}\n`],
    [MAIN_FILES.metadata, `${JSON.stringify(metadataData, null, 2)}\n`],
    [MAIN_FILES.entry, entry],
    [MAIN_FILES.readme, readme],
    [MAIN_FILES.changelog, changelog],
  ]);

  try {
    await Promise.all(Array.from(updates, ([relativePath, content]) => (
      writeFile(path.join(ROOT, relativePath), content, 'utf8')
    )));
    run(process.execPath, [path.join(ROOT, 'tools/build.mjs')]);
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    run(npmCommand, ['run', 'check']);
  } catch (error) {
    await restoreSnapshots(snapshots);
    throw new Error(`发布准备失败，已恢复所有文件：${error instanceof Error ? error.message : error}`);
  }

  return { currentVersion, version, date, files: Array.from(updates.keys()) };
}

async function main() {
  const version = process.argv[2];
  if (!version) {
    throw new Error('用法：npm run release:prepare -- X.Y.Z');
  }
  const result = await prepareRelease(version);
  console.log(`发布准备完成：${result.currentVersion} -> ${result.version} (${result.date})`);
  console.log('下一步：检查 diff、完成真实教务验收，然后提交 release: v' + result.version);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
