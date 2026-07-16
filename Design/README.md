# URP++ 多设计语言预研

> 来源：https://www.stylekit.top/zh/styles  
> 日期：2026-07-17  
> 范围：在**不重做布局**的前提下，用 skin token 切换卡片 / 按钮 / 背景 / 文字气质

## 你的目标（压缩版）

- 多套设计语言**并存**，用户可切换
- **不**大改信息架构、侧栏结构、页面网格
- 主要改：卡片、按钮、背景、文字、边框、阴影、圆角、少量交互反馈

## 总判断：可行，但有边界

### 可行部分（高）

当前 URP++ 已是 **CSS 变量驱动的 Soft Utility Flat**：

- `--bg / --surface / --text / --border / --primary / --radius / --shadow ...`
- 主题切换已有 default / dark / seed 动态配色

把「风格」做成 **Skin Layer**（在布局之上、配色之下）是自然扩展：

```
布局骨架（不动）
  └─ 组件选择器（.widget-box / .btn / input / table … 尽量不动结构）
       └─ Skin tokens（圆角、边框、阴影、字体、材质）
            └─ Palette tokens（颜色）
```

大多数目标风格都能映射为 token 包：

| Token 组 | 例子 |
|----------|------|
| shape | `--radius`, `--radius-sm`, 按钮是否 pill |
| stroke | `--border-w`, `--border-color`, 有无硬边 |
| elev | `--shadow`, 内外阴影、硬阴影、无阴影 |
| type | `--font-display`, `--font-body`, 字重 |
| surface | 纯色 / 奶油底 / 浅灰同色系 / 纸感噪点 |
| motion | hover 位移、压平、反色、内凹 |

### 不可行 / 成本陡增部分

| 风格完整要求 | 在「只换皮肤」约束下 |
|--------------|----------------------|
| 编辑杂志的杂志网格、超大留白 section | **做不到真 Editorial**；只能做「衬线标题 + 细边框 + 米色底」的弱化版 |
| 新野兽派完整 hard-crush 交互、超大字号节奏 | 可做边框/硬阴影/直角；**排版节奏**仍受教务表格密度限制 |
| 自然有机「手工纹理 + 不规则形状」 | 纹理可加；真正不规则布局不做 |
| Apple 的「大量留白」 | 教务信息密度高，只能做圆角/轻阴影/系统字体，**留白感有限** |
| 新拟物暗色 | 原生就弱；教务暗色页要单独校准，否则对比度翻车 |

**结论：**  
「多语言并存」在 **Skin 层**可行；若期待官网 Showcase 那种完整气质，**不可在不改布局的前提下 1:1 还原**。应明确做成：

> **URP++ 适配版（Admin Skin）**，不是营销落地页完整 StyleKit 复刻。

---

## 与当前 Soft Utility 的关系

当前风格 = 默认 Skin（可命名 `utility` / `soft-flat`）。  
新风格 = 额外 Skin，**共享同一 DOM/布局**，切换 `html[data-urppp-skin="..."]`。

推荐不要用「主题」一词混装：

- **Theme mode**：light / dark / follow system  
- **Palette**：seed 动态色 / 固定主色  
- **Skin**：neo-brutalist / editorial / …  

三者正交，避免 6 风格 × 3 明暗 × N 配色爆炸。

---

## 六套风格：教务场景适配评分

评分维度（每项 1–5）：

- **Skin 可映射度**：仅靠 token 能像几成  
- **教务可读性**：表格/表单/密集操作是否扛得住  
- **暗色可做性**  
- **与现架构贴合**  
- **推荐优先级**

### 1. 新野兽派 Neo-Brutalist

| 项 | 值 |
|----|----|
| StyleKit | 粗黑边、硬阴影 `Npx Npx 0 #000`、无圆角、高对比、hover 压平位移 |
| Skin 映射 | 5：几乎全是 border/radius/shadow/font-weight |
| 教务可读 | 3：冲击强，长时间看课表可能累；按钮辨识度高 |
| 暗色 | 3：可做，但「纯黑边」在暗底要改成浅/强调色硬边 |
| 贴合 | 5 |
| 推荐 | **P0 试点**（反差最大，最能验证 skin 架构） |

**URP 适配要点**

```css
--radius: 0;
--border-w: 2px;
--border: #000;
--shadow: 4px 4px 0 #000;
/* hover: translate + shadow 消失或压平 */
```

禁止：大圆角、柔阴影、渐变。

### 2. 编辑杂志风 Editorial

| 项 | 值 |
|----|----|
| StyleKit | 衬线标题、无阴影、细线、单色、大留白 |
| Skin 映射 | 3：字体/颜色/细边框可做；杂志网格与留白做不到 |
| 教务可读 | 4：安静、适合成绩/通知阅读 |
| 暗色 | 2：官方文档暗色覆盖弱，要自研 |
| 贴合 | 3 |
| 推荐 | **P1 弱化版**（`editorial-lite`） |

**URP 适配要点**

- 标题：`Noto Serif SC` / `Songti SC`（系统回退）
- 背景：`#F9F8F6` 类暖米
- 卡片：细 border、无 shadow、直角或微圆
- **不承诺**大留白首页

### 3. 新拟物派 Neumorphism

| 项 | 值 |
|----|----|
| StyleKit | 同色浅灰底、双阴影凸起/内凹、圆角、无粗边 |
| Skin 映射 | 4：阴影公式可 token 化 |
| 教务可读 | 2：**对比度是硬伤**，表格边线弱、障碍风险高 |
| 暗色 | 2 |
| 贴合 | 3 |
| 推荐 | **P2 实验** 或 **仅装饰控件**（开关/主题点），不要全站表格新拟物 |

**若做全站：** 必须加可读边框 fallback（`1px solid color-mix(...)`），否则评教/课表会糊。

### 4. 极简扁平风 Minimalist Flat

| 项 | 值 |
|----|----|
| StyleKit | 无阴影、纯色、硬边或统一圆角策略、hover 反色 |
| Skin 映射 | 5 |
| 教务可读 | 4：清晰，偏冷硬 |
| 暗色 | 3：可做反色体系 |
| 贴合 | 5（与当前最近，但是「去阴影 + 更硬」） |
| 推荐 | **P0**（低成本、最稳） |

与当前 Soft Utility 差异主要在：去掉柔阴影、边框更明确、圆角更克制。

### 5. 自然有机风 Natural Organic

| 项 | 值 |
|----|----|
| StyleKit | 大地色、大圆角/`rounded-[2rem]`、奶油底、衬线标题、轻纹理 |
| Skin 映射 | 4 |
| 教务可读 | 3–4：暖、舒服；主色偏棕绿时状态色要重映射 |
| 暗色 | 2–3：暖暗可做，非官方强项 |
| 贴合 | 4 |
| 推荐 | **P1**（消 AI 味最有效的「温度」方案之一） |

可选用极轻 SVG noise 纹理叠在 `--bg` 上（opacity ≤ 0.04）。

### 6. Apple 风格 Apple Style

| 项 | 值 |
|----|----|
| StyleKit | 大圆角、轻阴影、`#f5f5f7` 灰底、胶囊蓝按钮、系统字体 |
| Skin 映射 | 4–5 |
| 教务可读 | 4 |
| 暗色 | 4 |
| 贴合 | 5（**与当前 Soft Utility 最像**） |
| 推荐 | **P0 作为「精修当前」**，而不是「新风格」 |

注意：单独做 Apple Skin 容易和默认皮肤撞车。更合理是：

- 默认 Soft Utility → 收敛成 **Apple-leaning Utility**  
- 或明确：`apple` 与 `utility` 二选一，不并存六个里的近亲重复

---

## 推荐落地策略（少精力）

### 阶段 0：架构（必须先做）

1. 抽出 **Skin Token 表**（与颜色分离）  
2. `html[data-urppp-skin="utility|brutal|flat|organic|editorial|neu|apple"]`  
3. 组件选择器继续写语义属性：`background: var(--surface)` 等，**禁止**在组件里写死 `16px` 圆角  
4. 设置面板增加「界面风格」一行（与配色圆点分开）

### 阶段 1：先做 3 套（够用）

| Skin | 角色 |
|------|------|
| `utility` | 现状，微调为更干净的默认 |
| `brutal` | 性格极端，验证架构 |
| `organic` 或 `flat` | 一温一冷 |

Apple 并入 utility 精修，不必单独占坑。  
Editorial / Neu 后置。

### 阶段 2：再扩

- `flat`  
- `editorial-lite`  
- `neu`（若可读性验收通过）

### 明确不做

- StyleKit 的 Cursor Lab / 指针特效  
- Showcase 营销页布局  
- 每风格独立 DOM 模板  
- 全站新拟物表格

---

## 技术风险清单

1. **ACE / Bootstrap 内联样式**：皮肤要 `!important` 或继续 scrub，和现在一样  
2. **表格密度**：野兽/杂志在 dense table 上气质会打折  
3. **动态配色 seed**：与 brutal/editorial 单色哲学冲突 → seed 仅对 utility/apple/organic 开放  
4. **性能**：neu 双阴影 + 大面积卡片在低端机可接受，但别再加 blur  
5. **回归**：每加一 skin，至少验：登录、首页、课表、成绩、评教抽屉、设置面板

---

## 文档索引（本目录）

| 文件 | 说明 |
|------|------|
| `README.md` | 本预研 |
| `*-registry.json` | StyleKit 官方 shadcn theme 注册表（仅颜色 radius 级 token） |
| `skins/*.md` | 各风格 URP 适配摘要 + 硬性规则 |

官方完整 hard prompt 在线页：

- https://www.stylekit.top/zh/styles/neo-brutalist  
- https://www.stylekit.top/zh/styles/editorial  
- https://www.stylekit.top/zh/styles/neumorphism  
- https://www.stylekit.top/zh/styles/minimalist-flat  
- https://www.stylekit.top/zh/styles/natural-organic  
- https://www.stylekit.top/zh/styles/apple-style  

JSON registry：

- https://www.stylekit.top/r/{slug}.json  

---

## 一句话决策建议

**想法可行。**  
正确姿势不是「移植 6 个 StyleKit 完整设计系统」，而是：

> 在现有 Soft Utility 骨架上，增加 **3～5 个 Admin Skin 包**；  
> 用 token 改卡片/按钮/背景/字体/阴影；  
> 接受教务密度带来的气质折损，并在文档里写清「适配版」边界。

下一步若继续：先定 **阶段 1 的 3 个 skin 名单**，再画 token 对照表，最后动 `urppp.user.js`。
