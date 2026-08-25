import json, io
path = r'E:\Coder-WorkSpace\URP++-Repository\catalog.json'
d = json.load(io.open(path, encoding='utf-8'))

def apply_pair(sel, bg, fg, border, dark):
    # 生成 button 规则（亮/暗共用一套色值）
    if border == 'none':
        b = 'border:none'
    elif border == 'inherit':
        b = 'border:inherit'
    else:
        b = 'border:' + border
    return f'{sel}{{background:{bg};color:{fg};{b};transition:background 150ms,color 150ms,transform 150ms,box-shadow 150ms}}'

cards = {
  'flat': (
    '.urppp-skin-card[data-skin="flat"]{background:#fff;color:#000;border:2px solid #000;border-radius:0;box-shadow:none!important;padding-bottom:52px}'
    '.urppp-skin-card[data-skin="flat"] .urppp-skin-name,.urppp-skin-card[data-skin="flat"] .urppp-skin-desc{color:inherit}'
    + apply_pair('.urppp-skin-card[data-skin="flat"] .urppp-skin-apply', '#000', '#fff', '2px solid #000', False)
    + '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply:hover{background:#fff;color:#000}'
    + '.urppp-skin-card[data-skin="flat"] .urppp-skin-apply.is-current{background:#333}'
    # 仓库 / 删除按钮（复用 apply 样式，但统一以定位类覆盖）
    + apply_pair('.urppp-skin-card[data-skin="flat"] .urppp-store-repo,.urppp-skin-card[data-skin="flat"] .urppp-store-del', '#000', '#fff', '2px solid #000', False)
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="flat"]{background:#111;color:#fff;border-color:#fff}'
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-desc{color:inherit}'
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-skin-apply', '#fff', '#000', '2px solid #fff', True)
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-store-repo,html.urppp-theme-dark .urppp-skin-card[data-skin="flat"] .urppp-store-del', '#fff', '#000', '2px solid #fff', True)
  ),
  'organic': (
    '.urppp-skin-card[data-skin="organic"]{background:#FAF6F1;color:#5C4033;border:1px solid #E8DFD2;border-radius:22px;box-shadow:none!important;padding-bottom:52px}'
    '.urppp-skin-card[data-skin="organic"] .urppp-skin-name,.urppp-skin-card[data-skin="organic"] .urppp-skin-desc{color:inherit}'
    + apply_pair('.urppp-skin-card[data-skin="organic"] .urppp-skin-apply', '#5C4033', '#fff', 'none', False)
    + '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply:hover{background:#4A3329;transform:translateY(-1px)}'
    + '.urppp-skin-card[data-skin="organic"] .urppp-skin-apply.is-current{background:#4A3329}'
    + apply_pair('.urppp-skin-card[data-skin="organic"] .urppp-store-repo,.urppp-skin-card[data-skin="organic"] .urppp-store-del', '#5C4033', '#fff', 'none', False)
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="organic"]{background:#2A221B;color:#F5EDE4;border-color:#4A3B30}'
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-skin-desc{color:inherit}'
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-skin-apply', '#6F7D5A', '#1C1712', 'none', True)
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-store-repo,html.urppp-theme-dark .urppp-skin-card[data-skin="organic"] .urppp-store-del', '#6F7D5A', '#1C1712', 'none', True)
  ),
  'brutal': (
    '.urppp-skin-card[data-skin="brutal"]{background:#fff;color:#000;border:3px solid #000;border-radius:0;box-shadow:5px 5px 0 #000!important;padding-bottom:52px}'
    '.urppp-skin-card[data-skin="brutal"] .urppp-skin-name,.urppp-skin-card[data-skin="brutal"] .urppp-skin-desc{color:inherit}'
    + apply_pair('.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply', '#FF006E', '#000', '3px solid #000', False)
    + '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply:hover{background:#00D9FF;transform:translate(-2px,-2px);box-shadow:5px 5px 0 #000}'
    + '.urppp-skin-card[data-skin="brutal"] .urppp-skin-apply.is-current{background:#CCFF00;color:#000}'
    + apply_pair('.urppp-skin-card[data-skin="brutal"] .urppp-store-repo,.urppp-skin-card[data-skin="brutal"] .urppp-store-del', '#FF006E', '#000', '3px solid #000', False)
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"]{background:#000;color:#fff;border-color:#fff;box-shadow:5px 5px 0 #fff}'
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-skin-desc{color:inherit}'
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-skin-apply', '#FF006E', '#fff', '3px solid #fff', True)
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-store-repo,html.urppp-theme-dark .urppp-skin-card[data-skin="brutal"] .urppp-store-del', '#FF006E', '#fff', '3px solid #fff', True)
  ),
  'neu': (
    '.urppp-skin-card[data-skin="neu"]{background:#E0E5EC;color:#3D4450;border:none;border-radius:20px;box-shadow:5px 5px 10px #BEC3CA,-5px -5px 10px #F7F9FC!important;padding-bottom:52px}'
    '.urppp-skin-card[data-skin="neu"] .urppp-skin-name,.urppp-skin-card[data-skin="neu"] .urppp-skin-desc{color:inherit}'
    + apply_pair('.urppp-skin-card[data-skin="neu"] .urppp-skin-apply', '#E0E5EC', '#3D4450', 'none', False)
    + '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply{box-shadow:3px 3px 6px #BEC3CA,-3px -3px 6px #F7F9FC}'
    + '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply:hover{box-shadow:inset 2px 2px 4px #BEC3CA,inset -2px -2px 4px #F7F9FC}'
    + '.urppp-skin-card[data-skin="neu"] .urppp-skin-apply.is-current{color:#2563eb}'
    + apply_pair('.urppp-skin-card[data-skin="neu"] .urppp-store-repo,.urppp-skin-card[data-skin="neu"] .urppp-store-del', '#E0E5EC', '#3D4450', 'none', False)
    + '.urppp-skin-card[data-skin="neu"] .urppp-store-repo,.urppp-skin-card[data-skin="neu"] .urppp-store-del{box-shadow:3px 3px 6px #BEC3CA,-3px -3px 6px #F7F9FC}'
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="neu"]{background:#262B33;color:#C9CDD6;box-shadow:5px 5px 10px #171A1F,-5px -5px 10px #343B46}'
    + 'html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-name,html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-desc{color:inherit}'
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-apply', '#262B33', '#DFE3E9', 'none', True)
    + '.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-skin-apply{box-shadow:3px 3px 6px #171A1F,-3px -3px 6px #343B46}'
    + apply_pair('html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-store-repo,html.urppp-theme-dark .urppp-skin-card[data-skin="neu"] .urppp-store-del', '#262B33', '#DFE3E9', 'none', True)
  ),
}

for it in d.get('items', []):
    if it.get('type') == 'theme' and it['id'] in cards:
        it['cardCss'] = cards[it['id']]

js = json.dumps(d, ensure_ascii=False, indent=2)
io.open(path, 'w', encoding='utf-8').write(js + '\n')
print('cardCss(含store-repo/del+hover) written:', [it['id'] for it in d.get('items', []) if it.get('type') == 'theme'])
