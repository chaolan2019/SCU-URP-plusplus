import io, re

path = r'E:\Coder-WorkSpace\URP++\src\styles\settings.css'
s = io.open(path, encoding='utf-8').read()

# 删除 4 个独立主题（flat/organic/brutal/neu）的卡片预览规则：
# 形如  ...urppp-skin-card[data-skin="flat"]...{ ... }  的整块（含 卡/apply/hover/is-active/is-current/暗色变体）
pat = re.compile(
    r'[^{}]*urppp-skin-card\[data-skin="(flat|organic|brutal|neu)"\][^{}]*\{[^{}]*\}',
    re.MULTILINE
)
s2, n = pat.subn('', s)
print('removed 4 independent-theme card blocks:', n)

# 清理可能残留的空行/多余分隔
s2 = re.sub(r'\n{3,}', '\n\n', s2)
io.open(path, 'w', encoding='utf-8').write(s2)
print('braces now', s2.count('{'), s2.count('}'))

# 校验：不再有 4 主题的卡片规则残留
left = len(re.findall(r'urppp-skin-card\[data-skin="(flat|organic|brutal|neu)"\]', s2))
print('remaining 4-theme card selectors:', left)
