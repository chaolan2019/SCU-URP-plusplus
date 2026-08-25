import io

path = r'E:\Coder-WorkSpace\URP++\src\userscripts\urppp.entry.js'
s = io.open(path, encoding='utf-8').read()

# 1) 删除 FALLBACK_STORE_CARD_CSS 常量块
import re
s, n1 = re.subn(r'  // 官方 4 主题卡片样式兜底.*?\n  const FALLBACK_STORE_CARD_CSS = \{.*?\n  \};\n\n', '', s, flags=re.DOTALL)
print('removed FALLBACK const:', n1)

# 2) ensureStoreCardStyles 恢复纯 catalog
s = s.replace(
    "      if ((!it.cardCss && !FALLBACK_STORE_CARD_CSS[it.id]) || !it.id) return;",
    "      if (!it || !it.cardCss || !it.id) return;",
    1
)
s = s.replace(
    "      const css = it.cardCss || FALLBACK_STORE_CARD_CSS[it.id] || '';\n      if (el.textContent !== css) el.textContent = css;",
    "      if (el.textContent !== it.cardCss) el.textContent = it.cardCss;",
    1
)

# 3) 删除 init 里的 FALLBACK 兜底注入行
s, n3 = re.subn(
    r'    // 官方 4 主题卡片样式兜底：初始化即注入（catalog 拉取后可能被远程 cardCss 覆盖）\n    setTimeout\(\(\) => \{ try \{ ensureStoreCardStyles\(Object\.keys\(FALLBACK_STORE_CARD_CSS\)[^\n]*\} catch \(_\) \{\} \}, 0\);\n',
    '',
    s,
    flags=re.MULTILINE
)
print('removed init fallback inject:', n3)

# 校验
print('FALLBACK remaining:', s.count('FALLBACK_STORE_CARD_CSS'))
io.open(path, 'w', encoding='utf-8').write(s)
