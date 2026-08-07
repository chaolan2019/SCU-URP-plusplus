# -*- coding: utf-8 -*-
# 定位 JS/Python 差距主因：固定窗口切割 + 不同插值 vs k-means + CUBIC
import os, sys
import cv2, numpy as np, torch, torch.nn as nn

ROOT = 'E:/Coder-WorkSpace/URP++/ocr-training'
TEST_DIR = os.path.join(ROOT, 'zhjw-v4')
MODEL = os.path.join(ROOT, 'model', 'zhjw-char-tiny71.pt')
RES = 32
INTERP = {'nearest': cv2.INTER_NEAREST, 'cubic': cv2.INTER_CUBIC}[sys.argv[1] if len(sys.argv) > 1 else 'cubic']
USE_FIXED = len(sys.argv) > 2 and sys.argv[2] == 'fixed'
CHAR_CENTERS = [56, 80, 103, 127]
CHAR_HALF_W = 15

V10_LABELS = {
    '781': '45ew', '782': 'ea88', '784': 'p4b4', '785': 'eyae', '786': '28en',
    '787': 'dwb7', '788': 'fmy8', '789': 'ad2b', '790': 'ncdd', '791': 'dc87',
    '792': 'bya6', '794': 'dw2d', '795': '8wf4', '796': 'x8w6', '797': 'ypd4',
    '798': '3epb', '799': 'eb7m', '800': 'edrm', '801': '4p3b', '802': '64p7',
    '803': 'gax3', '804': 'bgf6', '806': 'pen2', '808': '2mgn', '809': '8ewp',
    '810': 'fefw', '811': 'wn8a', '812': 'dgm2', '814': '77da', '815': 'fecx',
    '816': 'n3ca', '817': '7dbn', '818': '4xge', '821': '28md', '823': 'ybyw',
    '824': '5w5m', '827': 'de34', '828': 'yc68', '829': '7cec', '831': 'a2an',
    '832': '7c42', '834': 'eny6', '836': 'ewnf', '837': '5d3g', '838': 'yxnf',
    '840': 'f48c', '841': 'cy54', '842': 'xe4e', '843': '44wg', '844': 'ng4p',
    '845': '5bgw', '846': 'ph43', '847': 'xgnn', '848': 'necd', '849': 'n6mw',
    '850': 'g27n', '851': 'mxc4', '852': 'x3bc', '853': 'x7f6', '856': 'ecn8',
    '857': '8bfe', '858': 'cafp', '859': 'y266', '860': 'ddx7', '861': '7m4y',
    '864': 'xpgg', '865': 'xy4g', '866': 'gbwg', '867': '3wpf', '868': '8635',
    '869': '2nm4', '870': 'm7np', '872': 'xp3y', '873': 'wb4n', '875': 'ccc6',
    '877': 'f6fd', '878': '5afw', '879': 'xcw6', '880': 'bbn5',
}

def hsv_mask(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    m1 = cv2.inRange(hsv, (170, 50, 0), (179, 255, 255))
    m2 = cv2.inRange(hsv, (0, 50, 0), (12, 255, 255))
    return cv2.bitwise_or(m1, m2)

def cluster4(mask):
    ys, xs = np.nonzero(mask)
    if len(xs) < 20: return None
    X = xs.astype(np.float32).reshape(-1, 1)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.1)
    _, labels, centers = cv2.kmeans(X, 4, None, criteria, 10, cv2.KMEANS_PP_CENTERS)
    centers = centers.flatten()
    order = np.argsort(centers)
    map_id = {old: new for new, old in enumerate(order)}
    labels_sorted = np.array([map_id[l] for l in labels.flatten()])
    bounds = []
    for cid in range(4):
        idx = labels_sorted == cid
        if idx.sum() == 0: return None
        cx, cy = xs[idx], ys[idx]
        bounds.append((int(cx.min()), int(cx.max()), int(cy.min()), int(cy.max())))
    bounds.sort()
    for x1, x2, _, _ in bounds:
        if x2 - x1 < 6 or x2 - x1 > 50: return None
    return bounds

def fixed_windows(mask):
    bounds = []
    for cx in CHAR_CENTERS:
        wx1, wx2 = max(0, cx - CHAR_HALF_W), min(179, cx + CHAR_HALF_W)
        cols = mask[:, wx1:wx2 + 1]
        ys, xs = np.nonzero(cols)
        if len(xs) == 0:
            bounds.append((wx1, wx2, 0, 59)); continue
        x1, x2 = wx1 + xs.min(), wx1 + xs.max()
        y1, y2 = ys.min(), ys.max()
        bounds.append((x1, x2, y1, y2))
    return bounds

class SepConv(nn.Module):
    def __init__(self, cin, cout, pool=True):
        super().__init__()
        self.dw = nn.Conv2d(cin, cin, 3, padding=1, groups=cin, bias=False)
        self.pw = nn.Conv2d(cin, cout, 1, bias=False)
        self.bn = nn.BatchNorm2d(cout)
        self.pool = nn.MaxPool2d(2) if pool else nn.Identity()
    def forward(self, x):
        x = self.pw(self.dw(x)); x = self.bn(x); x = torch.relu(x)
        return self.pool(x)

class TinyCharCNN(nn.Module):
    def __init__(self, n_classes):
        super().__init__()
        self.stem = nn.Sequential(nn.Conv2d(3, 16, 3, padding=1, bias=False), nn.BatchNorm2d(16), nn.ReLU(), nn.MaxPool2d(2))
        self.ds1 = SepConv(16, 32)
        self.ds2 = SepConv(32, 64)
        self.ds3 = SepConv(64, 64, pool=True)
        self.head = nn.Sequential(nn.Linear(64 * 2 * 2, 64), nn.ReLU(), nn.Dropout(0.3), nn.Linear(64, 27))
    def forward(self, x):
        f = self.stem(x); f = self.ds1(f); f = self.ds2(f); f = self.ds3(f)
        return self.head(f.reshape(f.size(0), -1))

ckpt = torch.load(MODEL, map_location='cpu')
chars = ckpt['chars']
model = TinyCharCNN(len(chars)); model.load_state_dict(ckpt['state']); model.eval()

img_hit = char_hit = 0
char_total = 0
seg_fail = 0
for sid, label in sorted(V10_LABELS.items()):
    img = cv2.imread(os.path.join(TEST_DIR, sid + '.jpg'))
    mask = hsv_mask(img)
    boxes = fixed_windows(mask) if USE_FIXED else cluster4(mask)
    if boxes is None:
        seg_fail += 1
        continue
    pred = ''
    for x1, x2, y1, y2 in boxes:
        pad_x, pad_y = 4, 5
        sx1, sx2 = max(0, x1 - pad_x), min(179, x2 + pad_x)
        sy1, sy2 = max(0, y1 - pad_y), min(59, y2 + pad_y)
        crop = img[sy1:sy2 + 1, sx1:sx2 + 1]
        resized = cv2.resize(crop, (RES, RES), interpolation=INTERP)
        x = torch.tensor(np.transpose(resized.astype(np.float32) / 255.0, (2, 0, 1))).unsqueeze(0)
        with torch.no_grad():
            ci = torch.argmax(model(x), dim=1).item()
        pred += chars[ci]
    if pred == label:
        img_hit += 1
    for k in range(4):
        char_total += 1
        if len(pred) == 4 and pred[k] == label[k]:
            char_hit += 1

n = len(V10_LABELS)
print(f'切割={"fixed" if USE_FIXED else "kmeans"} 插值={INTERP}')
print(f'整图: {img_hit}/{n} = {img_hit/n:.1%}  (seg_fail={seg_fail})')
print(f'字符: {char_hit}/{char_total} = {char_hit/char_total:.1%}')
