import io

path = r'E:\Coder-WorkSpace\URP++\src\styles\settings.css'
s = io.open(path, encoding='utf-8').read()

lines = s.split('\n')
out = []
changed = 0
for ln in lines:
    if '.urppp-set-btn.ghost' in ln and '.urppp-skin-card[data-skin=' in ln:
        # 加前缀提升 specificity，压过 brutal.css 的 button:not(...) 覆盖（含暗色变体）
        if ln.strip().startswith('html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card['):
            nl = ln.replace('html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[',
                            'html[data-urppp-skin].urppp-theme-dark #urppp-settings-panel .urppp-skin-card[')
            out.append(nl); changed += 1
        elif ln.strip().startswith('#urppp-settings-panel .urppp-skin-card['):
            nl = ln.replace('#urppp-settings-panel .urppp-skin-card[',
                            'html[data-urppp-skin] #urppp-settings-panel .urppp-skin-card[')
            out.append(nl); changed += 1
        else:
            out.append(ln)
    else:
        out.append(ln)

io.open(path, 'w', encoding='utf-8').write('\n'.join(out))
print('prefixed ghost rules:', changed, '| braces', ''.join(out).count('{'), ''.join(out).count('}'))
