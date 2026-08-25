import json, io
path = r'E:\Coder-WorkSpace\URP++-Repository\catalog.json'
d = json.load(io.open(path, encoding='utf-8'))

# 我自己的 4 个官方主题：卡片样式由主插件 settings.css 的 per-skin（亮+暗）控制，
# catalog 里不再带 cardCss，避免亮色 cardCss 注入后覆盖暗色变体（brutal 暗色白卡问题）。
for it in d.get('items', []):
    if it.get('type') == 'theme' and it.get('cardCss'):
        it.pop('cardCss', None)

js = json.dumps(d, ensure_ascii=False, indent=2)
io.open(path, 'w', encoding='utf-8').write(js + '\n')
print('catalog cardCss removed for themes:', [it['id'] for it in d.get('items', []) if it.get('type') == 'theme'])
