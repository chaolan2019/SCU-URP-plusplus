# 新拟物派 · URP 适配摘要

- StyleKit: https://www.stylekit.top/zh/styles/neumorphism
- Registry: ../neumorphism.registry.json
- 官方完成度自评: D 52/100

## 核心理念
同色浅灰表面 + 双阴影（亮左上 / 暗右下）；凸起=可点，内凹=输入/按下。

## 可映射到 Skin Token
| Token | 目标值 |
|-------|--------|
| radius | 12–16px |
| border | 无（或极淡） |
| shadow | `6px 6px 12px #b8bcc2, -6px -6px 12px #fff` |
| shadow-inset | 内凹双阴影 |
| bg/surface | 同系 #e0e5ec |

## 禁止
纯黑/纯白大面、粗边框、直角、标准 soft drop-shadow、渐变。

## 教务适配注意
- **对比度风险最高**：表格线、禁用态、错误态易糊
- 全站新拟物不推荐；更适合按钮/开关/主题点
- 若全站：卡片必须额外 1px 语义边框保可读

## URP 优先级
P2 实验 / 局部
