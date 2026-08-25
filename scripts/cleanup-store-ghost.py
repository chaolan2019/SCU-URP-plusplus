import io

# ---- entry.js: 删掉 STORE_GHOST_MAP / isDarkMode / styleStoreGhostBtns 及 5 处调用 ----
p = r'E:\Coder-WorkSpace\URP++\src\userscripts\urppp.entry.js'
s = io.open(p, encoding='utf-8').read()

# 删除定义块：从 "  // 各主题卡次要按钮样式（用于 JS 内联注入" 到 styleStoreGhostBtns 的收尾 "  }\n"
start_marker = '  // 各主题卡次要按钮样式（用于 JS 内联注入'
idx = s.find(start_marker)
if idx != -1:
    # 找到 styleStoreGhostBtns 函数闭合（其后是 storeManageSettingsHtml）
    end_marker = '  function storeManageSettingsHtml() {'
    end = s.find(end_marker, idx)
    if end != -1:
        s = s[:idx] + s[end:]
        print('removed STORE_GHOST_MAP/styleStoreGhostBtns/isDarkMode block')

# 删除调用行
before = s.count('styleStoreGhostBtns(')
lines = s.split('\n')
lines = [ln for ln in lines if 'styleStoreGhostBtns(' not in ln]
s = '\n'.join(lines)
print('call lines removed:', before, '->', s.count('styleStoreGhostBtns('))
io.open(p, 'w', encoding='utf-8').write(s)

# ---- settings.css: 删掉 per-skin ghost 定制 + 统一克制 ghost（仓库/删除现已复用 apply） ----
p2 = r'E:\Coder-WorkSpace\URP++\src\styles\settings.css'
c = io.open(p2, encoding='utf-8').read()

import re
# 删除所有含 .urppp-set-btn.ghost 的规则行（单行）或多行块
c2, n = re.subn(
    r'[^{}]*\.urppp-set-btn\.ghost[^{}]*\{[^{}]*\}',
    '',
    c,
    flags=re.MULTILINE
)
print('removed .urppp-set-btn.ghost css blocks:', n)
io.open(p2, 'w', encoding='utf-8').write(c2)
print('braces now', c2.count('{'), c2.count('}'))
