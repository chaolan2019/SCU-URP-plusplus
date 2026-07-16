# Changelog

本文件记录 **SCU URP++ 主脚本**（`urppp.user.js`）的用户可见变更。  
辅助插件（`urpppp.user.js`）变更见文末「辅助插件」小节，以及 `README_.md`。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循语义化版本。

## [1.0.9] - 2026-07-17

### Added
- 界面风格 **极简扁平**（可应用）：直角硬边、无阴影；支持动态配色
- 界面风格 **自然有机**（可应用）：奶油大地色、温暖圆角；固定色板，不支持动态配色
- 类Apple **边缘线条**开关（主题设置，默认开）：淡细边提升层次

### Changed
- 默认皮肤命名为 **类Apple风格**；卡片以阴影分层为主，可选淡边
- 主题选择文案：明确「仅保证清爽模式完整适配」
- 不支持动态配色的风格：主题设置内动态配色相关控件划线禁用
- 设置「默认进入清爽」归入主题设置；关于页 Logo 内嵌，避免外链拦截

### Fixed
- 主题选择列表未渲染导致空白
- 极简扁平对清爽模式/首页按钮与业务方块覆盖不全
- 类Apple 下动态配色圆点显示异常

## [1.0.8] - 2026-07-17

### Changed
- 默认「简约白 / 深邃暗」向 Apple 风格精修：系统灰底、链接蓝主色、更大圆角、轻阴影、胶囊按钮
- 设置弹窗改为四选项卡：主题设置 / 主题选择 / 系统设置 / 关于
- 主题设置：主题模式、跟随系统、种子色与配色方案（默认进入此页）
- 主题选择：六种界面风格大卡片预览
- 系统设置：自动检测更新 / 检查更新；辅助插件入口挂载于此
- 关于：展示 Logo、主插件版本与作者

### Fixed
- 教学评估「查看」侧滑层 `#billContainer` 被当成普通卡片撑满整页
- 登录页右下角过期版本水印 `URP++ v0.7.2` 移除

### 辅助插件 [1.2.9]
- 设置入口改为挂到主脚本 **系统设置** 槽位 `#urppp-set-assist-slot`
- 兼容旧版整页 body 注入；入口展示辅助版本号

## [1.0.7] - 2026-07-16

### Fixed
- 更新日志弹窗：Markdown 预览（标题 / 列表 / 代码 / 链接）
- 关闭按钮应用主题按钮样式（覆盖 ACE 默认按钮）
- 更新日志遮罩与面板补齐出现 / 关闭动效

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
