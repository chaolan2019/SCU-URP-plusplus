# URP++ 主题投稿指南

把你自己设计的教务主题投进 URP++ 主题商店，只需要三步：写主题 CSS、填一条 catalog 条目、跑自检脚本。

## 两条投稿渠道

| | 自建源 | 官方源（PR） |
|---|---|---|
| 生效速度 | 即时，无需审核 | 需要审核与合并 |
| 审核要求 | 无 | 设计质量、选择器规范、无恶意代码 |
| 适合谁 | 自用 / 小范围分享 / 快速迭代 | 想让全体用户在官方商店看到 |
| 上架方式 | 把你的 catalog.json 托管到任意 HTTPS 地址，主插件「设置 → 商店 → 仓库源」里添加该地址 | 向 [URP-plusplus-Repository](https://github.com/chaolan2019/URP-plusplus-Repository) 发起 PR |

两条渠道的条目格式完全一致，先用自建源验证效果，稳定后再 PR 官方源是推荐路径。

## 第一步：写主题 CSS

复制 [`theme-template.css`](./theme-template.css)，全局替换 `<your-theme-id>`。规则：

- 所有规则必须挂在 `html[data-urppp-skin="<your-theme-id>"]` 前缀下，**禁止无前缀的全局规则**（会污染未启用主题的用户）
- 13 个必填变量缺一不可（自检脚本会查）
- id 规范：小写字母/数字/连字符，2~32 位，不与官方主题重名（flat / organic / brutal / neu / assist）

## 第二步：填 catalog 条目

复制 [`catalog-item.template.json`](./catalog-item.template.json) 填入你的信息，合并进你的 catalog.json：

```json
{
  "name": "我的主题源",
  "version": "1.0.0",
  "updated": "2026-08-30",
  "items": [ { ...你的条目... } ]
}
```

字段说明：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✓ | 主题 id，与 CSS 前缀一致 |
| `type` | ✓ | 固定 `"theme"` |
| `name` / `description` | ✓ | 商店卡片展示 |
| `version` | ✓ | x.y.z 语义化 |
| `author` | ✓ | 你的署名 |
| `entry` | ✓ | CSS 下载地址数组，建议 raw + jsdelivr 双源；必须 https |
| `repo` | | 主题仓库主页 |
| `minAPP` | | 需要的最低主插件版本（用了 1.9.4+ 特性才需要升） |
| `preview` | | 三个颜色 `["底色","文字色","强调色"]`，卡片预览色条 |
| `cardCss` | ✓ | 商店卡片样式，必须含 `[data-skin="<id>"]` 选择器，写法参考官方条目 |
| `dark` / `dynamic` / `palettes` | | 能力声明：支持暗色 / 动态配色 / 调色盘；不支持就别声明 |

## 第三步：自检

```bash
node tools/contribute-check.mjs 你的-catalog.json 你的主题.css
```

全绿即可投稿。PR 官方源时把这个脚本的输出贴在 PR 描述里，审核更快。

## cardCss 最小示例

```css
.urppp-skin-card[data-skin="your-theme-id"] {
  background: #f6f4ef; color: #33302a;
  border: 1px solid #ddd6c8; border-radius: 10px;
  padding-bottom: 52px;
}
.urppp-skin-card[data-skin="your-theme-id"] .urppp-skin-name,
.urppp-skin-card[data-skin="your-theme-id"] .urppp-skin-desc { color: inherit; }
```

卡片内的按钮、徽标会自动继承主题变量，一般无需覆写；确需覆写时提高选择器精度并保持同前缀。
