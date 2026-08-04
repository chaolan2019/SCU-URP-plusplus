# URP++ 开发与发布指南

本文件是 URP++ 仓库的工程执行规范。适用于人工开发者与代码代理。
README 面向用户，`src/README.md` 说明源码结构，本文件负责约束开发、测试、合并和发布。

## 1. 项目边界

URP++ 是四川大学 URP 教务系统的 Tampermonkey 用户脚本项目，包含：

- `urppp.user.js`：主脚本，负责 UI 美化、清爽模式、隐私显示和课表导出。
- `urpppp.user.js`：可选辅助脚本，负责登录与评教自动化，具有更高的账号和误操作风险。
- `src/`：唯一可编辑源码目录。
- 根目录两个 `*.user.js`：由构建生成、需要提交的安装制品。

主脚本更新地址直接指向远端 `main/urppp.user.js`。因此：

> `main` 是生产分发源，只允许进入已经构建、测试、真实验收且版本信息完整的代码。

不要在 `main` 上试错，不要把未完成实验合并到 `main`，不要在正式版本发布后原地修改同版本制品。

## 2. 当前架构

```text
src/
├── assist/                    # 辅助脚本配置、存储、OCR 与工具
├── core/                      # HTML 转义、版本比较等共享纯函数
├── features/
│   └── schedule-export/       # 课表导出解析、布局与 PDF 支撑模块
├── metadata/                  # 用户脚本头部 metadata
├── styles/                    # 构建时内联的可读 CSS
└── userscripts/               # 浏览器入口与页面生命周期编排

tests/                         # Node 内置测试运行器测试
tools/build.mjs                # esbuild 单文件构建器
.github/workflows/validate.yml # PR/main 校验
.github/workflows/release.yml  # main 版本变更后创建 tag 与 GitHub Release
urppp.user.js                  # 生成制品，禁止手改
urpppp.user.js                 # 生成制品，禁止手改
```

当前模块化仍在进行中。`src/userscripts/urppp.entry.js` 和 `src/styles/internal.css` 体积较大；新功能应优先落在 `src/core/`、`src/features/` 或独立样式文件，避免继续扩大入口文件。

## 3. 不可破坏的工程约束

1. 只修改 `src/` 中的源码，根目录用户脚本必须通过 `npm run build` 生成。
2. 主脚本版本必须在以下位置一致：
   - `package.json`
   - `package-lock.json` 顶层及 `packages[""]`
   - `src/metadata/urppp.json`
   - `src/userscripts/urppp.entry.js` 的 `URPPP_VERSION`
   - `README.md` 首屏版本
   - `CHANGELOG.md` 最新正式版本
   - 生成脚本的 `@version`
3. 辅助脚本版本必须在 metadata、运行时常量、README 和生成制品中一致。
4. `npm run build:check` 必须证明生成制品未过期。
5. 生成制品保持单文件、可读、未混淆，并小于 Greasy Fork 的 2 MiB 限制。
6. 不提交账号、密码、Cookie、教务响应数据、真实学号姓名、访问令牌或临时调试文件。
7. 不删除或覆盖与当前任务无关的工作树改动。

## 4. 分支模型

### 4.1 分支命名

- `main`：生产与发布分支。
- `feat/<topic>`：向后兼容的新功能。
- `fix/<topic>`：缺陷修复。
- `refactor/<topic>`：不改变用户行为的结构调整。
- `experiment/<topic>`：长期验证，不直接发布。
- `release/vX.Y.Z`：整合多个已经验证的改动。
- `hotfix/vX.Y.Z`：线上严重缺陷的最小修复。

### 4.2 开始开发

```powershell
git switch main
git fetch origin
git pull --ff-only
git switch -c fix/example-topic
```

必须从最新远端 `main` 开分支。实验分支如果长期存在，应定期同步 `main`；实验结论稳定后，优先从最新 `main` 建干净分支，再迁移最终改动。

### 4.3 提交规范

使用短小、可解释的 Conventional Commit 风格：

```text
feat: add schedule export option
fix: isolate styles during native PDF export
refactor: extract schedule layout module
test: cover release metadata consistency
docs: update development workflow
chore: update build tooling
release: v1.6.0
```

一次提交只解决一个逻辑问题。不要把生成制品、临时截图、无关重构和功能修复混为一个不可审查的大提交。

## 5. 开发流程

### 5.1 先定义验收标准

开发前写清：

- 用户可见变化。
- 涉及页面、主题和设备尺寸。
- 正常路径、失败路径和恢复路径。
- 是否触及账号、隐私、自动提交或外部服务。
- 如何判断功能已经完成。

### 5.2 实现原则

- 优先沿用现有模块和辅助函数。
- 新增可纯函数化的逻辑时，从入口文件提取到 `src/core/` 或 `src/features/` 并编写行为测试。
- 不为一次性需求建立无收益抽象。
- 不依赖硬编码延时保证正确性；延时只能用于兼容站点异步渲染，并且必须有次数上限。
- 所有用户输入、服务器文本和远端文本在进入 `innerHTML` 前必须转义。
- 外部请求必须有超时、错误处理和明确的隐私说明。

### 5.3 DOM 与生命周期规则

教务系统包含 PJAX、jQuery、Bootstrap、Chosen、FullCalendar 和大量异步 DOM 写入。处理它们时：

- 事件绑定必须有单次绑定标记或可执行的解绑函数。
- `MutationObserver` 必须限定最小根节点和必要的 `attributeFilter`。
- 页面根节点可能被 PJAX 替换；观察器需要检测旧根是否仍连接，并在新根上重绑。
- `setInterval` 必须有明确停止条件；重试型 `setTimeout` 必须有次数上限。
- 高频事件使用节流、debounce 或 `requestAnimationFrame`，避免在每次鼠标移动或 DOM 变更时全页扫描。
- 修改 `history`、`window`、页面 jQuery、全局函数或原生导出函数时，必须保存原值并设计恢复路径。
- 临时隔离或导出事务必须使用单一 settle/cleanup 路径，成功、异常和超时都要恢复。
- 不用吞异常掩盖状态损坏；可预期兼容失败可以降级，同时保留带前缀的诊断日志。

### 5.4 样式规则

- 颜色、圆角和阴影优先使用主题变量。
- `!important` 只用于压过 ACE 内联样式或站点脚本回写；不要把它当默认写法。
- 修改表格的宽度、布局、边框合并、单元格 padding、行高前，必须验证原生业务表格和课表。
- 课程卡片样式不得改变课表单元格、表格几何或原生 PDF 捕获样式。
- UI 修改至少检查简约白、深邃暗，以及本次涉及的全部界面风格。
- 支持 `prefers-reduced-motion`，避免动画改变稳定布局尺寸。

## 6. 测试与验收

### 6.1 本地自动检查

安装依赖：

```powershell
npm ci
```

开发中执行针对性测试；交付前必须执行：

```powershell
npm run build
npm run check
git diff --check
git status --short
```

`npm run check` 当前覆盖：

- Node 单元与契约测试。
- metadata、运行时版本和 package 一致性。
- README 展示版本一致性。
- 生成制品是否最新。
- 两个用户脚本的 JavaScript 语法。
- 制品大小、许可证和单文件约束。

字符串契约测试只能防止结构被意外删除，不能替代真实 DOM 行为测试。新模块应优先测试输入输出、异常和边界条件。

### 6.2 真实教务环境验收

涉及 UI、路由、导出或自动化的变更必须在登录后的真实网站验证。

基础检查：

- 正常刷新与硬刷新。
- 从首页进入目标页，以及目标页直接刷新。
- 连续执行两次，确认没有重复绑定和残留状态。
- 设置窗口打开、关闭和导出期间的行为。
- 控制台没有新增异常。
- 操作完成后页面布局、主题和滚动位置可恢复。

PDF 专项检查：

- 与未安装插件时的原生 PDF 对照。
- 无主题背景、圆角、阴影和表格排版残留。
- 未安排课程、实验课等附加表格完整。
- 成功、失败、取消、超时后均恢复页面。
- 连续导出结果一致。

辅助脚本专项检查：

- 默认不向未配置的 OCR 服务发送请求。
- OCR 请求只包含验证码图片，不包含账号密码。
- 自动登录达到失败上限后停止自动提交。
- 自动评教保存属于不可逆操作，必须保留明显开关、等待时间和停止入口。

## 7. Changelog 与版本策略

`CHANGELOG.md` 只写用户可感知变化，不复制 Git 提交记录。开发期间写入 `[Unreleased]`，发布时转为正式版本段落。

版本遵循 SemVer：

- `PATCH`：向后兼容的缺陷修复、视觉修正和性能修正。
- `MINOR`：向后兼容的新功能或明显能力扩展。
- `MAJOR`：破坏配置、数据格式或用户工作流兼容性的变化。

同一版本发布后内容不可原地重写。线上问题使用新的 PATCH 版本解决。

## 8. 发布流程

发布分支必须包含源码、测试、生成制品、版本信息和 changelog。

### 8.1 发布前同步点

1. 确定 `X.Y.Z`，并确认 `CHANGELOG.md` 的 `[Unreleased]` 已包含本次用户可感知变化。
2. 执行发布准备工具：

```powershell
npm run release:prepare -- X.Y.Z
```

该工具会校验版本递增、把 `[Unreleased]` 提升为带日期的正式版本、同步 package/lockfile/metadata/运行时常量/README、重新构建两个用户脚本并执行 `npm run check`。任一步失败时会恢复全部被修改文件。

3. 再执行：

```powershell
git diff --check
git status --short
```

4. 检查 diff 中没有旧版本残留和无关文件。
5. 在真实教务环境完成最终验收。
6. 提交：

```powershell
git commit -m "release: vX.Y.Z"
```

### 8.2 合并与自动发布

- 通过 PR 合并到 `main`。
- PR 必须通过 `.github/workflows/validate.yml`。
- 不要在合并前手动创建正式 tag。
- 推送到 `main` 后，`.github/workflows/release.yml` 会读取主脚本 `@version`、运行检查、创建 `vX.Y.Z` tag 和 GitHub Release，并上传两个用户脚本。
- 若同名 tag 已存在，自动流程默认跳过，防止覆盖不可变版本。

### 8.3 发布后确认

按顺序核对：

1. 远端 `main` SHA 与本地一致。
2. GitHub Actions 的 validate/release 成功。
3. `raw.githubusercontent.com/.../urppp.user.js` 的 `@version` 正确。
4. README、CHANGELOG、metadata、package 和 lockfile 版本一致。
5. `vX.Y.Z` tag 指向发布提交。
6. GitHub Release 正文和附件正确。
7. Tampermonkey 更新检测能识别新版本。

完成后删除已合并开发分支。不要删除未合并实验分支或他人的工作。

## 9. Hotfix 流程

1. 从最新 `main` 创建 `hotfix/vX.Y.Z`。
2. 只做最小修复，不夹带重构。
3. 增加能覆盖事故原因的测试。
4. 完成真实页面回归。
5. 提升 PATCH 版本并更新 changelog。
6. 走正常 PR、CI 和自动 Release。

禁止强推覆盖已有 tag，禁止修改已经发布的同版本脚本。

## 10. 安全与隐私

- 主脚本和辅助脚本的权限分开维护，新增 `@grant`、`@connect` 或匹配域名必须解释原因。
- 账号密码只允许保存在脚本管理器存储中，不写日志、不进入 DOM 属性、不发送到 OCR 服务。
- 自定义 OCR 服务属于用户主动配置的外部服务，必须明确发送内容、超时和失败行为。
- 任何自动提交功能都要假设操作不可撤销，默认值必须保守。
- 更新检查只信任仓库配置的 HTTPS 地址，并对远端文本做解析和转义。
- 不引入来源不明的构建依赖；升级依赖后执行 `npm audit` 和完整构建检查。

## 11. 仓库卫生

- `node_modules/`、临时文件、个人分析文档和未采用设计稿不得提交。
- 用户截图若包含姓名、学号、课程或 Cookie，提交前必须脱敏。
- 生成制品必须提交；构建缓存和中间文件不得提交。
- `AGENTS.md`、工作流、测试和发布工具属于工程基础设施，应随规则变化同步维护。
- 对未跟踪文件先确认归属，禁止因为“清理工作树”而直接删除。

## 12. Definition of Done

一个任务只有同时满足以下条件才算完成：

- 需求和验收标准已满足。
- 正常、异常和恢复路径均处理。
- 新逻辑有与风险匹配的测试。
- `npm run check` 通过。
- 生成用户脚本与源码一致。
- 真实教务环境完成必要回归。
- 没有新增敏感信息、无限观察器或永久全局污染。
- changelog 已记录用户可感知变化。
- diff 中没有无关文件。
- 需要发布时，版本同步、PR、CI、tag、Release 和线上更新验证已闭环。
