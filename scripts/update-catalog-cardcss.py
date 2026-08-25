import json, io
path = r'E:\Coder-WorkSpace\URP++-Repository\catalog.json'
d = json.load(io.open(path, encoding='utf-8'))

# cardCss：完整规范示例（亮/暗 + 主按钮 + is-current + hover 动画 + 名字/描述颜色）。
# 官方 4 主题主插件用内置样式兜底、不注入此 cardCss；此 cardCss 作为规范示例，第三方照此书写。
cards = {
    'flat':
      '.urppp-skin-card[data-skin="flat"]{background:#fff;color:#000;border:2px solid #000;border-radius:0;box-shadow:none!important;padding-bottom:52px}'
      '.urppp-skin-card[data-skin="flat"] .urppp-skin-name,.urppp-skin-card[data-skin="flat"] .urppp-skin-desc{color:inherit}'
      '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply{background:#000;color:#fff;border:2px solid #000;border-radius:0;box-shadow:none;transition:background 150ms,color 150ms}'
      '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply:hover{background:#fff;color:#000}'
      '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply.is-current{background:#333;color:#fff}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="flat"]{background:#111;color:#fff;border-color:#fff}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-desc{color:inherit}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-apply{background:#fff;color:#000;border-color:#fff}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-apply:hover{background:#e0e0e0}',
    'organic':
      '.urppp-skin-card[data-skin="organic"]{background:#FAF6F1;color:#5C4033;border:1px solid #E8DFD2;border-radius:22px;box-shadow:none!important;padding-bottom:52px}'
      '.urppp-skin-card[data-skin="organic"] .urppp-skin-name,.urppp-skin-card[data-skin="organic"] .urppp-skin-desc{color:inherit}'
      '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply{background:#5C4033;color:#fff;border:none;border-radius:999px;box-shadow:none;transition:background 150ms}'
      '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply:hover{background:#4A3329;transform:translateY(-1px)}'
      '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply.is-current{background:#4A3329}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="organic"]{background:#2A221B;color:#F5EDE4;border-color:#4A3B30}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-skin-desc{color:inherit}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-skin-apply{background:#6F7D5A;color:#1C1712;border-color:#8B9D77}',
    'brutal':
      '.urppp-skin-card[data-skin="brutal"]{background:#fff;color:#000;border:3px solid #000;border-radius:0;box-shadow:5px 5px 0 #000!important;padding-bottom:52px}'
      '.urppp-skin-card[data-skin="brutal"] .urppp-skin-name,.urppp-skin-card[data-skin="brutal"] .urppp-skin-desc{color:inherit}'
      '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply{background:#FF006E;color:#000;border:3px solid #000;border-radius:0;box-shadow:3px 3px 0 #000;transition:transform 150ms,box-shadow 150ms}'
      '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply:hover{background:#00D9FF;transform:translate(-2px,-2px);box-shadow:5px 5px 0 #000}'
      '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply.is-current{background:#CCFF00;color:#000}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"]{background:#000;color:#fff;border-color:#fff;box-shadow:5px 5px 0 #fff}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-skin-desc{color:inherit}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-skin-apply{background:#FF006E;color:#fff;border-color:#fff;box-shadow:3px 3px 0 #fff}',
    'neu':
      '.urppp-skin-card[data-skin="neu"]{background:#E0E5EC;color:#3D4450;border:none;border-radius:20px;box-shadow:5px 5px 10px #BEC3CA,-5px -5px 10px #F7F9FC!important;padding-bottom:52px}'
      '.urppp-skin-card[data-skin="neu"] .urppp-skin-name,.urppp-skin-card[data-skin="neu"] .urppp-skin-desc{color:inherit}'
      '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply{background:#E0E5EC;color:#3D4450;border:none;border-radius:14px;box-shadow:3px 3px 6px #BEC3CA,-3px -3px 6px #F7F9FC;transition:box-shadow 150ms}'
      '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply:hover{box-shadow:inset 2px 2px 4px #BEC3CA,inset -2px -2px 4px #F7F9FC}'
      '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply.is-current{color:#2563eb}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="neu"]{background:#262B33;color:#C9CDD6;box-shadow:5px 5px 10px #171A1F,-5px -5px 10px #343B46}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-desc{color:inherit}'
      'html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-apply{background:#262B33;color:#DFE3E9;box-shadow:3px 3px 6px #171A1F,-3px -3px 6px #343B46}',
}

for it in d.get('items', []):
    if it.get('type') == 'theme' and it['id'] in cards:
        it['cardCss'] = cards[it['id']]

js = json.dumps(d, ensure_ascii=False, indent=2)
io.open(path, 'w', encoding='utf-8').write(js + '\n')
print('cardCss(完整含hover) written:', [it['id'] for it in d.get('items', []) if it.get('type') == 'theme'])
