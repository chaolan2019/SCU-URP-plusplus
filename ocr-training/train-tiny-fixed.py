# -*- coding: utf-8 -*-
# 训练微型 CNN（固定窗口训练数据）
# 与 train-char-tiny.py 相同，仅数据目录换为 chars-fixed
import os
import random
import sys

import cv2
import numpy as np
import torch
import torch.nn as nn

ROOT = os.path.dirname(os.path.abspath(__file__))
CHARS_DIR = sys.argv[sys.argv.index('--data') + 1] if '--data' in sys.argv else os.path.join(ROOT, 'chars-fixed3')
W1 = int(sys.argv[sys.argv.index('--w1') + 1]) if '--w1' in sys.argv else 24
W2 = int(sys.argv[sys.argv.index('--w2') + 1]) if '--w2' in sys.argv else 48
W3 = int(sys.argv[sys.argv.index('--w3') + 1]) if '--w3' in sys.argv else 96
FC = int(sys.argv[sys.argv.index('--fc') + 1]) if '--fc' in sys.argv else 96
RES = int(sys.argv[sys.argv.index('--res') + 1]) if '--res' in sys.argv else 32
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

chars = sorted(os.listdir(CHARS_DIR))
char2idx = {c: i for i, c in enumerate(chars)}
samples = []
for ch in chars:
    cdir = os.path.join(CHARS_DIR, ch)
    for f in os.listdir(cdir):
        samples.append((os.path.join(cdir, f), char2idx[ch]))
print(f'类数 {len(chars)}, 样本 {len(samples)}')

random.shuffle(samples)
per_class = {}
for p, ci in samples:
    per_class.setdefault(ci, []).append((p, ci))
train_s, val_s = [], []
for ci, items in per_class.items():
    n_val = max(1, len(items) // 5)
    random.shuffle(items)
    val_s.extend(items[:n_val])
    train_s.extend(items[n_val:])

def load_batch_aug(samples_list):
    xs, ys = [], []
    for p, ci in samples_list:
        img = cv2.imread(p)
        # m/n/b/h 等易混类加强变形（更大幅度的旋转/缩放）
        hard = chars[ci] in 'mnbh'
        ang_rng = 12 if hard else 8
        scale_rng = (0.8, 1.2) if hard else (0.85, 1.15)
        dx, dy = random.randint(-3, 3), random.randint(-3, 3)
        M = np.float32([[1, 0, dx], [0, 1, dy]])
        img = cv2.warpAffine(img, M, (32, 32), borderValue=(255, 255, 255))
        ang = random.uniform(-ang_rng, ang_rng)
        R = cv2.getRotationMatrix2D((16, 16), ang, 1.0)
        img = cv2.warpAffine(img, R, (32, 32), borderValue=(255, 255, 255))
        s = random.uniform(*scale_rng)
        nw, nh = int(32*s), int(32*s)
        img = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_CUBIC)
        canvas = np.full((32, 32, 3), 255, np.uint8)
        x0, y0 = max(0, (32-nw)//2), max(0, (32-nh)//2)
        canvas[y0:y0+nh, x0:x0+nw] = img[:min(nh, 32-y0), :min(nw, 32-x0)]
        img = canvas
        if random.random() < 0.3:
            img = cv2.convertScaleAbs(img, alpha=random.uniform(0.9, 1.1), beta=random.randint(-10, 10))
        xs.append(np.transpose(img, (2, 0, 1)).astype(np.float32) / 255.0)
        ys.append(ci)
    return torch.tensor(np.stack(xs), dtype=torch.float32), torch.tensor(ys, dtype=torch.long)

def load_batch(samples_list):
    xs, ys = [], []
    for p, ci in samples_list:
        img = cv2.imread(p)
        xs.append(np.transpose(img, (2, 0, 1)).astype(np.float32) / 255.0)
        ys.append(ci)
    return torch.tensor(np.stack(xs), dtype=torch.float32), torch.tensor(ys, dtype=torch.long)

class SepConv(nn.Module):
    def __init__(self, cin, cout, pool=True):
        super().__init__()
        self.dw = nn.Conv2d(cin, cin, 3, padding=1, groups=cin, bias=False)
        self.pw = nn.Conv2d(cin, cout, 1, bias=False)
        self.bn = nn.BatchNorm2d(cout)
        self.pool = nn.MaxPool2d(2) if pool else nn.Identity()
    def forward(self, x):
        x = self.pw(self.dw(x))
        x = self.bn(x)
        x = torch.relu(x)
        return self.pool(x)

class TinyCharCNN(nn.Module):
    def __init__(self, n_classes):
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv2d(3, W1, 3, padding=1, bias=False), nn.BatchNorm2d(W1), nn.ReLU(), nn.MaxPool2d(2))
        self.ds1 = SepConv(W1, W2)
        self.ds2 = SepConv(W2, W3)
        self.ds3 = SepConv(W3, W3, pool=True)
        self.head = nn.Sequential(
            nn.Linear(W3 * 2 * 2, FC), nn.ReLU(), nn.Dropout(0.3), nn.Linear(FC, n_classes))
    def forward(self, x):
        f = self.stem(x)
        f = self.ds1(f)
        f = self.ds2(f)
        f = self.ds3(f)
        f = f.reshape(f.size(0), -1)
        return self.head(f)

model = TinyCharCNN(len(chars))
n_params = sum(p.numel() for p in model.parameters())
print(f'参数量: {n_params/1e3:.1f}K, int8 体积估算: {n_params/1024:.1f}KB')
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
epochs = 150
sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=epochs)

train_X, train_Y = load_batch_aug(train_s)
val_X, val_Y = load_batch(val_s)
best = 0
for epoch in range(1, epochs + 1):
    model.train()
    if epoch == 1 or epoch % 15 == 0:
        train_X, train_Y = load_batch_aug(train_s)
    perm = torch.randperm(len(train_s))
    loss_sum = 0
    for start in range(0, len(train_s), 64):
        idx = perm[start:start + 64]
        opt.zero_grad()
        loss = loss_fn(model(train_X[idx]), train_Y[idx])
        loss.backward()
        opt.step()
        loss_sum += loss.item()
    sched.step()
    model.eval()
    with torch.no_grad():
        acc = (torch.argmax(model(val_X), dim=1) == val_Y).float().mean().item()
        if acc > best: best = acc
    if epoch % 15 == 0:
        print(f'epoch {epoch:3d} loss {loss_sum:.2f} val {acc:.1%} best {best:.1%}')

os.makedirs(os.path.join(ROOT, 'model'), exist_ok=True)
out_name = 'zhjw-char-tiny-fixed.pt'
for a in sys.argv:
    if a.startswith('--out='):
        out_name = a.split('=', 1)[1]
if '--out' in sys.argv:
    out_name = sys.argv[sys.argv.index('--out') + 1]
torch.save({'state': model.state_dict(), 'chars': chars, 'arch': f'tiny-{W1}/{W2}/{W3}'},
           os.path.join(ROOT, 'model', out_name))
print(f'best: {best:.1%}, 保存 model/{out_name}')
