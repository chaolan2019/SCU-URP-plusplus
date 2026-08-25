import json, io, re

# 1) package-lock.json 版本同步 package.json
pl = json.load(io.open('package-lock.json', encoding='utf-8'))
pl['version'] = '1.9.5'
pl.get('packages', {}).get('', {})['version'] = '1.9.5'
io.open('package-lock.json', 'w', encoding='utf-8').write(json.dumps(pl, ensure_ascii=False, indent=2) + '\n')
print('package-lock version -> 1.9.5')

# 2) 从 CHANGELOG.md 提取 [1.9.5] section（到下一个 `## [` 之前）
ch = io.open('CHANGELOG.md', encoding='utf-8').read()
m = re.search(r'(## \[1\.9\.5\][^\n]*\n(?:[^\n]*\n)*?)(?=\n## \[)', ch)
section = m.group(1).rstrip() if m else ''
print('changelog section len:', len(section))

# 3) 重建 version.json（UTF-8，不混入乱码）
mj = json.load(io.open('src/metadata/urppp.json', encoding='utf-8'))
asst = json.load(io.open('src/metadata/urpppp.json', encoding='utf-8'))
ver = {
  'version': mj['version'],
  'prevVersion': '1.9.4',
  'assist': asst['version'],
  'updated': '2026-08-25',
  'changelog': section,
}
io.open('version.json', 'w', encoding='utf-8').write(json.dumps(ver, ensure_ascii=False, indent=2) + '\n')
print('version.json rebuilt:', ver['version'], 'assist', ver['assist'], 'changelog head:', section.splitlines()[0][:40])
