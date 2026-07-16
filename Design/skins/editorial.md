# 编辑杂志风 · URP 适配摘要

- StyleKit: https://www.stylekit.top/zh/styles/editorial
- Registry: ../editorial.registry.json
- 官方完成度自评: D 59/100（暗色几乎无）

## 核心理念
内容为王；衬线标题 + 无衬线正文；单色；留白；无阴影。

## 可映射到 Skin Token
| Token | 目标值 |
|-------|--------|
| radius | 0 |
| border | 1px 细线 |
| shadow | none |
| font-display | 衬线（Noto Serif SC / Songti SC） |
| bg | 暖米 #F9F8F6 |
| text | #1C1C1C + 透明度层次 |
| hover | 下划线 / 细边框加深，无浮起 |

## 禁止
彩色强调主体系、粗边框、阴影、大圆角、强渐变。

## 教务适配注意
- **完整杂志网格不做** → 只做 `editorial-lite`
- 标题衬线即可带来气质，不必改列表结构
- 暗色需自研，不能照搬 light 反相

## URP 优先级
P1 弱化版
