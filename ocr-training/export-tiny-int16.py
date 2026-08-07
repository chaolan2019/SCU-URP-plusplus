# -*- coding: utf-8 -*-
# 导出微型 CNN int16 量化（精度接近 float32，体积 ~73KB）
# per-tensor int16：权重范围 ±0.5，int16 下相对误差 ~0.004%，远小于 int8 的 1%
import base64
import json
import os
import sys

import numpy as np
import torch
import torch.nn as nn

ROOT = 'E:/Coder-WorkSpace/URP++/ocr-training'
SRC = sys.argv[sys.argv.index('--src') + 1] if '--src' in sys.argv else os.path.join(ROOT, 'model', 'zhjw-char-tiny-fixed.pt')
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(ROOT, 'model', 'zhjw-char-tiny-fixed-int16.json')

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
            nn.Conv2d(3, 16, 3, padding=1, bias=False), nn.BatchNorm2d(16), nn.ReLU(), nn.MaxPool2d(2))
        self.ds1 = SepConv(16, 32)
        self.ds2 = SepConv(32, 64)
        self.ds3 = SepConv(64, 64, pool=True)
        self.head = nn.Sequential(
            nn.Linear(64 * 2 * 2, 64), nn.ReLU(), nn.Dropout(0.3), nn.Linear(64, n_classes))
    def forward(self, x):
        f = self.stem(x)
        f = self.ds1(f)
        f = self.ds2(f)
        f = self.ds3(f)
        f = f.reshape(f.size(0), -1)
        return self.head(f)

def fold_bn(conv, bn):
    w = conv.weight.data
    b = conv.bias.data if conv.bias is not None else torch.zeros(w.size(0))
    gamma, beta = bn.weight.data, bn.bias.data
    mean, var, eps = bn.running_mean, bn.running_var, bn.eps
    scale = gamma / torch.sqrt(var + eps)
    w_folded = w * scale.view(-1, 1, 1, 1)
    b_folded = (b - mean) * scale + beta
    return w_folded, b_folded

def quantize_int16(arr):
    arr = arr.astype(np.float32)
    amin, amax = arr.min(), arr.max()
    if amin == amax:
        return np.zeros(arr.shape, dtype=np.int16), 0.0, 0
    qmin, qmax = -32768, 32767
    scale = (amax - amin) / (qmax - qmin)
    zero = np.clip(round(qmin - amin / scale), qmin, qmax)
    q = np.clip(np.round(arr / scale + zero), qmin, qmax).astype(np.int16)
    return q, float(scale), int(zero)

def add_conv(export, name, w, b, groups=1):
    wq, ws, wz = quantize_int16(w)
    bq, bs, bz = quantize_int16(b)
    export['layers'].append({
        'type': 'conv', 'name': name, 'dtype': 'int16',
        'out_c': w.shape[0], 'in_c': w.shape[1], 'k': w.shape[2],
        'groups': groups,
        'w': base64.b64encode(wq.tobytes()).decode(), 'w_scale': ws, 'w_zero': wz,
        'b': base64.b64encode(bq.tobytes()).decode(), 'b_scale': bs, 'b_zero': bz,
    })

def main():
    ckpt = torch.load(SRC, map_location='cpu')
    chars = ckpt['chars']
    model = TinyCharCNN(len(chars))
    model.load_state_dict(ckpt['state'])
    model.eval()

    export = {'chars': chars, 'arch': 'tiny-ds-int16', 'layers': []}
    total_bytes = 0

    conv, bn = model.stem[0], model.stem[1]
    w_f, b_f = fold_bn(conv, bn)
    add_conv(export, 'stem', w_f.detach().numpy(), b_f.detach().numpy())
    total_bytes += w_f.numel() * 2 + b_f.numel() * 2

    for name, ds in [('ds1', model.ds1), ('ds2', model.ds2), ('ds3', model.ds3)]:
        dw_w = ds.dw.weight.data
        pw_w, pw_b = fold_bn(ds.pw, ds.bn)
        add_conv(export, f'{name}_dw', dw_w.detach().numpy(), np.zeros(dw_w.shape[0], np.float32), groups=dw_w.shape[0])
        add_conv(export, f'{name}_pw', pw_w.detach().numpy(), pw_b.detach().numpy())
        total_bytes += dw_w.numel() * 2 + pw_w.numel() * 2 + pw_b.numel() * 2

    fc1, fc2 = model.head[0], model.head[3]
    for fname, fc in [('fc1', fc1), ('fc2', fc2)]:
        w_np, b_np = fc.weight.detach().numpy(), fc.bias.detach().numpy()
        wq, ws, wz = quantize_int16(w_np)
        bq, bs, bz = quantize_int16(b_np)
        total_bytes += w_np.size * 2 + b_np.size * 2
        export['layers'].append({
            'type': 'fc', 'name': fname, 'dtype': 'int16',
            'in': w_np.shape[1], 'out': w_np.shape[0],
            'w': base64.b64encode(wq.tobytes()).decode(), 'w_scale': ws, 'w_zero': wz,
            'b': base64.b64encode(bq.tobytes()).decode(), 'b_scale': bs, 'b_zero': bz,
        })

    with open(OUT, 'w') as f:
        json.dump(export, f)
    size = os.path.getsize(OUT)
    print(f'导出: {OUT}')
    print(f'权重字节: {total_bytes/1024:.1f}KB, JSON 大小: {size/1024:.1f} KB')

if __name__ == '__main__':
    main()
