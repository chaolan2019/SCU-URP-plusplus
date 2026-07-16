# 新野兽派 · URP 适配摘要

- StyleKit: https://www.stylekit.top/zh/styles/neo-brutalist
- Registry: ../neo-brutalist.registry.json
- 官方完成度自评: C 65/100

## 核心理念
功能优先、诚实结构、粗犷直接；反对圆滑精致。

## 可映射到 Skin Token
| Token | 目标值 |
|-------|--------|
| radius | 0 |
| border | 2–4px solid #000（暗色改浅/强调色） |
| shadow | 4px 4px 0 #000（硬边，无 blur） |
| font-display | 极重无衬线 / 等宽正文可选 |
| hover | 位移 2px + 阴影压平 |
| colors | 高对比；强调色可用粉/青柠，主结构黑白 |

## 禁止
圆角（除装饰圆）、柔阴影、渐变、灰边框当主边框。

## 教务适配注意
- 表格边框会变「硬」：可接受，注意单元格 padding
- 长时间阅读课表可能视觉疲劳 → 提供一键回 utility
- 动态 seed 配色与本风格冲突：建议关闭 seed 或仅改 accent 块

## URP 优先级
P0 试点（验证 skin 架构）
