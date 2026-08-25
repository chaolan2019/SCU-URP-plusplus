# SCU URP++ 主题与插件仓库

本仓库是 **SCU URP++ 主插件**的「主题 / 插件商店」内容源。主插件从这里的 `catalog.json` 拉取可下载的主题与插件。

## 目录结构

```
.
├── catalog.json       # 商店清单（核心，主插件从这里拉列表）
├── urpppp.plugin.js   # 辅助插件（主插件装载式）
├── themes/
│   ├── flat.css       # 极简扁平主题
│   └── organic.css    # 自然有机主题
└── README.md          # 本说明 + 投稿规范
```

## catalog.json 条目字段

```jsonc
{
  "id": "flat",            // 唯一 id（与主插件 SKIN_CATALOG 一致）
  "type": "theme",         // theme | plugin
  "name": "极简扁平",
  "description": "…",
  "version": "1.0.0",      // 用于「检查更新」对比
  "author": "Chao_Lan",
  "minAPP": "1.9.4",       // 最低主插件版本
  "entry": [               // 可下载产物（多源，主插件按序降级）
    "https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/themes/flat.css",
    "https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/themes/flat.css",
    "https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/themes/flat.css"
  ],
  "preview": ["#FFFFFF", "#000000", "#4A4A4A"]  // 主题预览色（卡片展示）
}
```

## 投稿 / 更新主题（第三方）

1. 主题产物放 `themes/<id>.css`（纯 CSS，作用范围用 `html[data-urppp-skin="<id>"]` 前缀）。
2. 在 `catalog.json` 按上面的字段加一条（或更新 version）。
3. 提 PR 到本仓库，审核后合并。

> 说明：主题只允许注入 CSS（不执行任意 JS）；需要脚本能力的主题须走 plugin 类型并声明 `allowJS`。
