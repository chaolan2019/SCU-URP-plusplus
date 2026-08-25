import io, re

path = r'E:\Coder-WorkSpace\URP++\src\styles\settings.css'
s = io.open(path, encoding='utf-8').read()

# 删除所有「某主题卡的 .urppp-set-btn.ghost」定制（多行或单行块），改为统一克制
# 匹配形如： ...data-skin="X"] .urppp-set-btn.ghost { ... }  （含跨行）
pat = re.compile(
    r'[^{}]*\[data-skin="[a-z]+"\][^{}]*\.urppp-set-btn\.ghost\s*\{[^{}]*\}',
    re.MULTILINE
)
s2, n = pat.subn('', s)
print('removed per-skin ghost blocks:', n)

# 在文件末尾追加统一克制次要按钮（亮/暗各一套）
unified = """

/* 次要按钮（仓库/删除）统一克制：细边+透明底+面板灰字，随面板明暗，不随卡片主题 */
#urppp-settings-panel .urppp-skin-card .urppp-set-btn.ghost {
  background: transparent !important; color: #6b7280 !important; border: 1px solid rgba(107,114,128,.45) !important;
  border-radius: 999px !important; box-shadow: none !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card .urppp-set-btn.ghost {
  background: transparent !important; color: #a6adbb !important; border-color: rgba(166,173,187,.38) !important;
}
"""
s2 = s2.rstrip() + '\n' + unified
io.open(path, 'w', encoding='utf-8').write(s2)
print('unified ghost appended; braces now', s2.count('{'), s2.count('}'))
