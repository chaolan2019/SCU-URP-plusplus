# Apple 风格 · URP 适配摘要

- StyleKit: https://www.stylekit.top/zh/styles/apple-style
- Registry: ../apple-style.registry.json
- 官方完成度自评: D 56/100

## 核心理念
极简、留白、精致圆角、轻阴影、系统字体、克制配色（黑白灰 + 链接蓝）。

## 可映射到 Skin Token
| Token | 目标值 |
|-------|--------|
| radius | 卡片 ~18px，按钮 pill |
| border | 少边框 |
| shadow | 0 4px 12px rgba(0,0,0,.08) |
| bg | #f5f5f7 |
| primary | #0071e3 |
| font | -apple-system / SF Pro 栈 |

## 禁止
花哨多色、重阴影、渐变堆砌、拥挤。

## 教务适配注意
- **与当前 Soft Utility 高度重合**
- 更适合作为默认皮肤的「精修方向」，而非第六套独立皮肤
- 教务密度限制真实「Apple 留白」，勿过度承诺

## URP 优先级
P0 作为默认精修；独立并存可选
