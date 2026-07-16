# Changelog

本文件记录 **SCU URP++ 主脚本**（`urppp.user.js`）的用户可见变更。  
辅助插件（`urpppp.user.js`）变更见其脚本头版本与 `README_.md`。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循语义化版本。

## [1.0.6] - 2026-07-16

### Fixed
- 自动检测更新：去掉 sessionStorage 同会话只弹一次限制；每次进入页面（刷新）有更新都会再提示

### Changed
- 更新弹窗：补齐出现 / 关闭动效（上浮缩放 + 淡入淡出）

## [1.0.5] - 2026-07-16

### Changed
- 设置面板：将「自动检测更新」「检查更新」整组移到「配色方案」下方，独立为「更新」区块

## [1.0.4] - 2026-07-16

### Fixed
- 清爽模式「其他服务」四个申请入口跳转：对齐首页真实链接
  - 补办学生证 → `/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082`
  - 免修申请 → `/student/personalManagement/individualApplication/exemptionApplication/index`
  - 替代课申请 → `/student/personalManagement/personalApplication/curriculumReplacement/index`
  - 火车票优惠卡 → `/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083`

### Added
- 仓库新增 `CHANGELOG.md`
- 设置项「自动检测更新」：开启后每次进入教务页静默检查主插件；有新版本时左下角弹窗
- 更新弹窗支持「更新日志」（当前版本 → 最新版本区间）与「去更新」（打开脚本更新源）

## [1.0.3] - 2026-07-16

### Fixed
- 检查更新扩展点挂到 `unsafeWindow`，辅助插件可正确注册
- 设置面板移动端可完整滚动
- 检查更新按钮全宽

### Changed
- 主插件状态文案不再提示「未检测到辅助插件」

## [1.0.2] - 2026-07-16

### Added
- 设置面板「检查更新」
- 主插件更新检查扩展点（供辅助插件注册）
- `@updateURL` / `@downloadURL`

## [1.0.1] - 2026-07-15

### Fixed
- 「未评估」仅依据期末评教（`flag=kt`），有可展示成绩时不再误标

### Added
- `@license MIT` 与仓库 `LICENSE`

## [1.0.0] - 2026-07

### Added
- 全站 UI 美化、主题 / 动态配色
- 清爽模式：课表、成绩、空闲教室、其他服务
- Greasy Fork / GitHub 发布基线
