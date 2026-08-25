import io
path = r'E:\Coder-WorkSpace\URP++\src\userscripts\urppp.entry.js'
s = io.open(path, encoding='utf-8').read()
lines = s.split('\n')
out = []
for ln in lines:
    out.append(ln)
    if 'querySelectorAll(\'[data-repo]\')' in ln and 'forEach' in ln:
        if 'downloadPane.' in ln:
            out.append('    styleStoreGhostBtns(downloadPane);')
        elif 'host.' in ln:
            out.append('    styleStoreGhostBtns(host);')
io.open(path, 'w', encoding='utf-8').write('\n'.join(out))
print('inserted styleStoreGhostBtns calls:', sum(1 for l in out if 'styleStoreGhostBtns(' in l))
