import json, io
path = r'E:\Coder-WorkSpace\URP++-Repository\catalog.json'
d = json.load(io.open(path, encoding='utf-8'))

# 卡片样式：底 + 主按钮(.urppp-skin-apply) + 次要按钮(.urppp-set-btn.ghost 仓库/删除)，全部用 .urppp-skin-card[data-skin=id] 作用域
cards = {
    'flat': '.urppp-skin-card[data-skin="flat"]{background:#fff;color:#000;border-radius:0;border:none;box-shadow:none!important;padding-bottom:52px}'
            '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply{background:#000;color:#fff;border-radius:0;border:2px solid #000;box-shadow:none}'
            '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply.is-current{background:#333}'
            '.urppp-skin-card[data-skin="flat"] .urppp-set-btn.ghost{background:#000;color:#fff;border:2px solid #000;border-radius:0;box-shadow:none}',
    'organic': '.urppp-skin-card[data-skin="organic"]{background:#FAF6F1;color:#5C4033;border-radius:16px;border:1px solid #E8DFD2;box-shadow:none!important;padding-bottom:52px}'
            '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply{background:#8B9D77;color:#fff;border-radius:999px;border:none;box-shadow:none}'
            '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply.is-current{background:#5C4033}'
            '.urppp-skin-card[data-skin="organic"] .urppp-set-btn.ghost{background:#fff;color:#5C4033;border:1px solid #DCCFB8;border-radius:999px;box-shadow:none}',
    'brutal': '.urppp-skin-card[data-skin="brutal"]{background:#fff;color:#000;border-radius:0;border:3px solid #000;box-shadow:5px 5px 0 #000!important;padding-bottom:52px}'
            '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply{background:#000;color:#CCFF00;border-radius:0;border:2px solid #000;box-shadow:3px 3px 0 #000}'
            '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply.is-current{background:#CCFF00;color:#000}'
            '.urppp-skin-card[data-skin="brutal"] .urppp-set-btn.ghost{background:#fff;color:#000;border:2px solid #000;border-radius:0;box-shadow:2px 2px 0 #000}',
    'neu': '.urppp-skin-card[data-skin="neu"]{background:#E0E5EC;color:#4F5258;border-radius:18px;border:none;box-shadow:6px 6px 12px #B8BCC2,-6px -6px 12px #fff!important;padding-bottom:52px}'
            '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply{background:#E0E5EC;color:#4F5258;border-radius:14px;box-shadow:4px 4px 8px #B8BCC2,-4px -4px 8px #fff;border:none}'
            '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply.is-current{color:#2563eb;background:#EDF1F5}'
            '.urppp-skin-card[data-skin="neu"] .urppp-set-btn.ghost{background:#E0E5EC;color:#4F5258;border:none;border-radius:12px;box-shadow:3px 3px 6px #B8BCC2,-3px -3px 6px #fff}',
}

for it in d.get('items', []):
    if it.get('type') == 'theme' and it['id'] in cards:
        it['cardCss'] = cards[it['id']]

js = json.dumps(d, ensure_ascii=False, indent=2)
io.open(path, 'w', encoding='utf-8').write(js + '\n')
print('catalog cardCss(no-ops) updated:', [it['id'] for it in d.get('items', []) if it.get('type') == 'theme'])
