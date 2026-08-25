import json, io

# 从 catalog 提取官方 cardCss，作为主插件内置兜底
cat = json.load(io.open(r'E:\Coder-WorkSpace\URP++-Repository\catalog.json', encoding='utf-8'))
fallback = {}
for it in cat['items']:
    if it.get('type') == 'theme' and it.get('cardCss'):
        fallback[it['id']] = it['cardCss']

# 生成 JS 常量对象（JSON 编码，把 / 转义避免闭合干扰）
fallback_js = '{\n' + ',\n'.join(f'  {json.dumps(k)}: {json.dumps(v)}' for k, v in fallback.items()) + '\n}'

path = r'E:\Coder-WorkSpace\URP++\src\userscripts\urppp.entry.js'
s = io.open(path, encoding='utf-8').read()

# 1) 插入 FALLBACK_STORE_CARD_CSS 常量（ensureStoreCardStyles 之前）
anchor = '  function ensureStoreCardStyles(items) {'
const_block = (
    '  // 官方 4 主题卡片样式兜底（catalog 拉取失败/无 cardCss 时用，确保商店卡片不退化）\n'
    '  const FALLBACK_STORE_CARD_CSS = ' + fallback_js + ';\n\n'
)
if 'const FALLBACK_STORE_CARD_CSS' not in s:
    s = s.replace(anchor, const_block + anchor, 1)

# 2) ensureStoreCardStyles 用 (it.cardCss || 兜底)
s = s.replace(
    "      if (!it || !it.cardCss || !it.id) return;",
    "      if ((!it.cardCss && !FALLBACK_STORE_CARD_CSS[it.id]) || !it.id) return;",
    1
)
s = s.replace(
    "      if (el.textContent !== it.cardCss) el.textContent = it.cardCss;",
    "      const css = it.cardCss || FALLBACK_STORE_CARD_CSS[it.id] || '';\n      if (el.textContent !== css) el.textContent = css;",
    1
)

# 3) init 时注入官方兜底（不等 catalog，设置页/商店立即有官方卡片样式）
init_anchor = "    applyTheme(getCurrent());\n"
init_extra = (
    "    applyTheme(getCurrent());\n"
    "    // 官方 4 主题卡片样式兜底：初始化即注入（catalog 拉取后可能被远程 cardCss 覆盖）\n"
    "    setTimeout(() => { try { ensureStoreCardStyles(Object.keys(FALLBACK_STORE_CARD_CSS).map((id) => ({ id, cardCss: FALLBACK_STORE_CARD_CSS[id] }))); } catch (_) {} }, 0);\n"
)
# 只替换 init 里那一处（避免误伤其它 applyTheme）
if 'ensureStoreCardStyles(Object.keys(FALLBACK_STORE_CARD_CSS)' not in s:
    s = s.replace(init_anchor, init_extra, 1)

io.open(path, 'w', encoding='utf-8').write(s)
print('entry.js updated; fallback themes:', list(fallback.keys()))
