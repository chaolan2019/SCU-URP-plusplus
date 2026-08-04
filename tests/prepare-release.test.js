import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareVersions,
  parseReleaseArgs,
  parseVersion,
  promoteChangelog,
} from '../tools/prepare-release.mjs';

test('release versions accept strict SemVer cores and compare numerically', () => {
  assert.deepEqual(parseVersion('1.6.0'), [1, 6, 0]);
  assert.equal(compareVersions('1.10.0', '1.9.9'), 1);
  assert.equal(compareVersions('1.5.5', '1.5.5'), 0);
  assert.equal(compareVersions('1.5.4', '1.5.5'), -1);
  assert.throws(() => parseVersion('v1.6.0'), /无效版本号/);
  assert.throws(() => parseVersion('1.6'), /无效版本号/);
});

test('release arguments support an optional assistant version', () => {
  assert.deepEqual(parseReleaseArgs(['1.5.6']), { version: '1.5.6', assistVersion: '' });
  assert.deepEqual(parseReleaseArgs(['1.5.6', '--assist', '1.3.4']), {
    version: '1.5.6',
    assistVersion: '1.3.4',
  });
  assert.throws(() => parseReleaseArgs(['1.5.6', '--assist']), /未知或不完整/);
  assert.throws(() => parseReleaseArgs(['1.5.6', '--unknown', '1.3.4']), /未知或不完整/);
});

test('release preparation promotes non-empty Unreleased notes', () => {
  const changelog = `# Changelog

## [Unreleased]

### Fixed
- 修复导出

## [1.5.5] - 2026-08-03

### Fixed
- 上一版本
`;
  const promoted = promoteChangelog(changelog, '1.5.6', '2026-08-04');
  assert.match(promoted, /^## \[Unreleased\]\n\n## \[1\.5\.6\] - 2026-08-04$/m);
  assert.match(promoted, /## \[1\.5\.6\][\s\S]*### Fixed\n- 修复导出/);
  assert.equal((promoted.match(/- 修复导出/g) || []).length, 1);
});

test('release preparation rejects empty notes and duplicate versions', () => {
  const empty = '# Changelog\n\n## [Unreleased]\n\n## [1.5.5] - 2026-08-03\n';
  assert.throws(() => promoteChangelog(empty, '1.5.6', '2026-08-04'), /\[Unreleased\] 为空/);

  const duplicate = '# Changelog\n\n## [Unreleased]\n\n### Fixed\n- x\n\n## [1.5.6] - 2026-08-04\n';
  assert.throws(() => promoteChangelog(duplicate, '1.5.6', '2026-08-04'), /已存在 1\.5\.6/);
});
