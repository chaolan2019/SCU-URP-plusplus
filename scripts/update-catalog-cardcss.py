import json, io
path = r'E:\Coder-WorkSpace\URP++-Repository\catalog.json'
d = json.load(io.open(path, encoding='utf-8'))

# 依据 f6f50ca 内置卡片标准样式重写 cardCss：卡(亮/暗) + 主按钮 .urppp-skin-apply(正确形状/圆角)
# + 次要按钮 .urppp-store-repo/.urppp-store-del = 完全复制主按钮(用户要求'直接复制下载按钮')
# + hover / is-current / dark。

def card(skin, card, name_desc, apply, hover, current, apply_dark, hover_dark, card_dark):
    return (
        f'.urppp-skin-card[data-skin="{skin}"]{{{card}}}'
        f'.urppp-skin-card[data-skin="{skin}"] .urppp-skin-name,.urppp-skin-card[data-skin="{skin}"] .urppp-skin-desc{{color:inherit}}'
        # 主按钮 + 仓库/删除（复制）
        f'.urppp-skin-card[data-skin="{skin}"] .urppp-skin-apply,'
        f'.urppp-skin-card[data-skin="{skin}"] .urppp-store-repo,'
        f'.urppp-skin-card[data-skin="{skin}"] .urppp-store-del{{{apply}}}'
        f'{hover}'
        f'{current}'
        f'html.urppp-theme-dark .urppp-skin-card[data-skin="{skin}"]{{{card_dark}}}'
        f'html.urppp-theme-dark .urppp-skin-card[data-skin="{skin}"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="{skin}"] .urppp-skin-desc{{color:inherit}}'
        f'html.urppp-theme-dark .urppp-skin-card[data-skin="{skin}"] .urppp-skin-apply,'
        f'html.urppp-theme-dark .urppp-skin-card[data-skin="{skin}"] .urppp-store-repo,'
        f'html.urppp-theme-dark .urppp-skin-card[data-skin="{skin}"] .urppp-store-del{{{apply_dark}}}'
        f'{hover_dark}'
    )

# 每个主题的精确值（取自 f6f50ca 内置卡片样式）
cards = {
  'flat': card(
    'flat',
    'background:#fff;color:#000;border:2px solid #000;border-radius:0;box-shadow:none!important;padding-bottom:52px',
    '',
    'background:#fff;color:#000;border:2px solid #000;border-radius:0;box-shadow:none;transition:background 150ms,color 150ms',
    '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply:hover,.urppp-skin-card[data-skin="flat"] .urppp-store-repo:hover,.urppp-skin-card[data-skin="flat"] .urppp-store-del:hover{background:#000;color:#fff}',
    '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply.is-current{background:#000;color:#fff}',
    'background:#fff;color:#000;border:2px solid #fff;border-radius:0;box-shadow:none',
    'html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-apply:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-store-repo:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-store-del:hover{background:#e0e0e0}',
    'background:#111;color:#fff;border-color:#fff;box-shadow:none!important',
  ),
  'organic': card(
    'organic',
    'background:#FAF6F1;color:#5C4033;border:1px solid #E8DFD2;border-radius:22px;box-shadow:none!important;padding-bottom:52px',
    '',
    'background:#FFFCF7;color:#5C4033;border:1px solid #8B9D77;border-radius:999px;box-shadow:none;transition:background 150ms',
    '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply:hover,.urppp-skin-card[data-skin="organic"] .urppp-store-repo:hover,.urppp-skin-card[data-skin="organic"] .urppp-store-del:hover{background:#5C4033;color:#fff}',
    '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply.is-current{background:#5C4033;color:#fff;border-color:#5C4033}',
    'background:#2B231D;color:#B9C99A;border:1px solid #6F8F52;border-radius:999px;box-shadow:none',
    'html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-skin-apply:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-store-repo:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-store-del:hover{background:#5C4033;color:#fff}',
    'background:#2A221B;color:#F5EDE4;border-color:#4A3B30;box-shadow:none!important',
  ),
  'brutal': card(
    'brutal',
    'background:#fff;color:#000;border:3px solid #000;border-radius:0;box-shadow:5px 5px 0 #000!important;padding-bottom:52px',
    '',
    'background:#FF006E;color:#000;border:3px solid #000;border-radius:0;box-shadow:3px 3px 0 #000;transition:transform 150ms,box-shadow 150ms',
    '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply:hover,.urppp-skin-card[data-skin="brutal"] .urppp-store-repo:hover,.urppp-skin-card[data-skin="brutal"] .urppp-store-del:hover{background:#00D9FF;color:#000;transform:translate(-2px,-2px);box-shadow:5px 5px 0 #000}',
    '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply.is-current{background:#FF006E;color:#000;border-color:#000;box-shadow:3px 3px 0 #000}',
    'background:#FF006E;color:#fff;border:3px solid #fff;border-radius:0;box-shadow:3px 3px 0 #fff',
    'html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-skin-apply:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-store-repo:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-store-del:hover{background:#00D9FF;color:#000;transform:translate(-2px,-2px);box-shadow:5px 5px 0 #fff}',
    'background:#000;color:#fff;border-color:#fff;box-shadow:5px 5px 0 #fff!important',
  ),
  'neu': card(
    'neu',
    'background:#E0E5EC;color:#3D4450;border:none;border-radius:20px;box-shadow:5px 5px 10px #BEC3CA,-5px -5px 10px #F7F9FC!important;padding-bottom:52px',
    '',
    'background:#E0E5EC;color:#3D4450;border:none;border-radius:14px;box-shadow:3px 3px 6px #BEC3CA,-3px -3px 6px #F7F9FC;transition:box-shadow 150ms',
    '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply:hover,.urppp-skin-card[data-skin="neu"] .urppp-store-repo:hover,.urppp-skin-card[data-skin="neu"] .urppp-store-del:hover{box-shadow:inset 2px 2px 4px #BEC3CA,inset -2px -2px 4px #F7F9FC}',
    '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply.is-current{color:#2563eb}',
    'background:#262B33;color:#DFE3E9;border:none;border-radius:14px;box-shadow:3px 3px 6px #171A1F,-3px -3px 6px #343B46',
    'html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-apply:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-store-repo:hover,html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-store-del:hover{box-shadow:inset 2px 2px 4px #171A1F,inset -2px -2px 4px #343B46}',
    'background:#262B33;color:#C9CDD6;box-shadow:5px 5px 10px #171A1F,-5px -5px 10px #343B46!important',
  ),
}

for it in d.get('items', []):
    if it.get('type') == 'theme' and it['id'] in cards:
        it['cardCss'] = cards[it['id']]

js = json.dumps(d, ensure_ascii=False, indent=2)
io.open(path, 'w', encoding='utf-8').write(js + '\n')
print('cardCss(基于内置标准, store-repo/del=apply) written:', [it['id'] for it in d.get('items', []) if it.get('type') == 'theme'])
