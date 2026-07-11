# URP++ 开发文档

## 项目概述

URP++ 是四川大学 URP 教务系统的油猴脚本（Tampermonkey 用户脚本），对整个教务系统进行全面的 UI 美化与交互优化。采用自建主题系统（简约白 · 深邃暗 · 川大红），支持实时切换。

- **版本**：0.3.14
- **运行方式**：Tampermonkey / Greasemonkey，`@run-at document-start`
- **匹配域名**：`http://zhjw.scu.edu.cn/*`、`http://202.115.47.141/*`

---

## 文件结构

```
E:\Coder-WorkSpace\URP++\
├── urppp.user.js          # 主脚本（唯一运行文件）
├── AGENTS.md              # 本文档
└── docs/                  # 截图、笔记等辅助材料
```

---

## 架构总览

### 入口流程

```
document-start
  └── GM_addStyle(基础背景色 + body opacity:0)
  └── init()
       ├── applyTheme(current)
       ├── 登录页 → rebuild()          # 完全重建登录 UI
       └── 其他页面 → beautifyInternal()
            ├── 注入 urppp-internal-style（全站 CSS）
            ├── rebuildDashboard()         # 首页仪表板重构
            ├── rebuildSidebarCompletely() # 侧边栏 Hanako 风格重构
            ├── rebuildNavbar()            # 顶栏强制对齐 + 搜索框
            ├── rebuildCourseTable()       # 课表透明度调整
            └── setTimeout → body.urppp-ready（淡入）
```

### 路由变化监听

`watchRouteChanges()` 劫持 `popstate`、`hashchange`、`history.pushState/replaceState`，PJAX 跳转后自动重新执行侧边栏和顶栏重建，并重新计算顶栏高度。

---

## 核心模块

### 1. 主题系统

**位置**：`THEMES` 对象（脚本开头）

三个主题各维护一套 CSS 变量：

| 变量 | 说明 |
|------|------|
| `--bg` | 页面背景色 |
| `--surface` | 卡片/面板背景 |
| `--text` / `--text-secondary` / `--text-muted` | 文字色阶 |
| `--border` / `--border-focus` | 边框色 |
| `--input-bg` | 输入框背景 |
| `--primary` / `--primary-hover` | 主题色 |
| `--ring` | focus 光环色 |
| `--shadow` | 卡片阴影 |
| `--radius`（16px）/ `--radius-sm`（10px） | 统一圆角 |

主题存储在 `GM_getValue('urppp_theme_v3')`，登录页底部有主题切换点。

**强调色**：`GM_getValue('urppp_accent_v1')` 可自定义主题色，通过 `applyAccent(hex)` 设置。

---

### 2. 登录页重建

**函数**：`rebuild()`

完全替换原始登录表单，注入全新 HTML/CSS：
- 校徽 SVG 从原页面提取
- SSO 统一认证跳转链接保留
- 验证码自动刷新
- 三个主题色圆点切换按钮
- 表单提交逻辑保留原生 form 行为

---

### 3. 顶栏（Navbar）

**函数**：`rebuildNavbar()`（调用 `force()` 设置 `!important` 内联样式）

主要工作：
- 所有 `li` / `a` 统一 flex 居中，高度 36px
- 图标颜色统一，去除 ACE 原始偏移
- 搜索框：`#form-search` 定位到 `#clickdiv` 按钮左侧展开/折叠，无背景卡片
- 客服图标宽度 28px，用户名微调对齐
- 用户名区域 flex 对齐，头像保留

**搜索框交互**：
- `navbarClickBound` 单次绑定标志，避免重复绑定事件
- 点击按钮展开 160px 宽度搜索框，点击外部收起
- `#intellegenceUDiv` 宽度限制 32px
- 位置：`right: 34px; top: 50%; transform: translateY(-50%)`

---

### 4. 侧边栏（Sidebar）

**函数**：`rebuildSidebarCompletely()`

完全替换 ACE 原生的 `#menus`，生成 Hanako 风格的 `#urppp-menus`。

**解析流程**：
1. 读取原始 `#menus` DOM → `parseMenu()` 递归解析
2. 提取每个 `<li>` 的文字、图标、`href`、`onclick`、子菜单
3. 单叶子子菜单提升：父子节点合并为跳转节点
4. 空壳子节点过滤
5. `origMenus` 隐藏（`display:none`，不删除以保留 ACE 面包屑数据）

**构建流程**：
1. 创建 toggle 按钮 + MutationObserver 监听折叠状态
2. `buildItem()` 递归构建菜单树
3. 父节点（无真实 href）→ `div`，点击 toggle 展开/收起
4. 叶子节点 → `a`，点击跳转
5. 清除所有 `open` class，禁止默认展开

**CSS**：侧边栏宽度 260px，折叠 50px，圆角菜单项，箭头旋转动画。

---

### 5. 首页仪表板

**函数**：`rebuildDashboard()`

仅在首页（`widget-box` ≥ 6 个）执行：
- 学业信息转为统计卡片（`urppp-stats-grid`）
- 日程安排（FullCalendar）移到左侧 2/3 区域
- 通知公告、待办任务、可申请业务、常用下载移到右侧 1/3 区域
- 可申请业务卡片设为 80×80 正方形网格
- Dashboard 骨架屏：500ms 延迟加载数据

---

### 6. 课表透明度

**函数**：`courseTableOpacity()`

MutationObserver 监听 `#courseTable` 变化，修改背景单元格 alpha 值：
- 段落 td 背景 → alpha 0.5
- 课程卡片 div → alpha 0.8

---

### 7. 全站 CSS（`urppp-internal-style`）

**注入位置**：`beautifyInternal()`，仅注入一次（通过 `urppp-internal-style` id 检测）

覆盖范围：
- 全局背景/文字色
- 顶栏、侧边栏
- 面包屑（已隐藏）
- 卡片/面板、个人信息
- 表格、按钮、表单
- 标签页、分页、下拉菜单
- 弹窗、时间轴
- FullCalendar 课表
- 课程表主页（`#courseTable`）
- 课程标签（`.label.arrowed-in`）
- 日程悬停弹窗（`#schedule-hover`）

---

## 设计规范

### 颜色

- 主色：`var(--primary)` — 深蓝灰（简约白）/ 浅蓝灰（深邃暗）/ 川大红（川大红）
- 语义色：成功绿 `#22c55e`，警告橙 `#f59e0b`，危险红 `#ef4444`
- 层次：bg（页面）→ surface（卡片）→ input-bg（输入区）→ border（分割）

### 圆角

- 大组件：`var(--radius)` = 16px
- 小组件：`var(--radius-sm)` = 10px
- 微小元素：6-8px

### 阴影

- 卡片：`0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)`
- 弹窗：`0 10px 40px rgba(0,0,0,0.15)`
- 暗色模式相应加深

### 过渡

- 统一 `transition: .15s ease`
- 按钮 hover：`translateY(-1px) + box-shadow`

---

## 已知问题

1. **面包屑隐藏**：ACE 原生面包屑依赖 `#menus` DOM 生成路径。`origMenus` 改为隐藏而非删除后仍未恢复完整路径，当前方案为直接隐藏 `.breadcrumbs`。

2. **`body opacity:0` 闪烁**：`@run-at document-start` 时注入 `body{opacity:0}` 并在 600ms 后淡入，仍有概率闪现原始 ACE UI。减小延迟会加剧闪烁，增大延迟影响体验。

3. **课表下拉文字截断**：`.select` 元素的 `width:auto` 处理不够彻底，部分页面内联 `width:100px` 覆盖了样式。

4. **"全部理论课安排"表格**：课程详情表格未特别美化。

5. **课程卡片高度**：部分卡片底部与单元格底部不对齐（1-3px 缝隙）。

6. **全站美化 CSS 范围**：当前 `urppp-internal-style` 覆盖较为全面，但某些页面特有组件（如分页下拉 `.dataTables_length`）未完全覆盖。

---

## 开发规范

### 修改原则

- **非必要不碰布局属性**：padding、margin、font-size、width、height、border-collapse 等容易导致页面错位的属性，必须确保与原 ACE 布局兼容
- **优先使用 CSS 变量**：所有颜色、圆角、阴影统一走主题变量，不要硬编码色值
- **`!important` 是常态**：ACE 有大量内联样式和 JS 后设样式，普通 CSS 优先级不够
- **改完必 commit**：每次修改后 `git commit`，commit message 用英文，格式 `type(scope): description`

### Git 规范

- `feat(ui):` — 新增美化项
- `fix(ui):` / `fix(sidebar):` — 修复 bug
- `style(ui):` — 纯样式调整
- `refactor:` — 重构
- `revert:` — 回退
- `chore:` — 杂项

### 测试流程

1. 修改代码 → `node --check` 语法检查
2. `git add` + `git commit`
3. `stage_files` 交付
4. 在教务系统中实际测试首页和至少 2 个不同页面

---

## 参考

- **ACE 框架**：教务系统基于 Ace Admin（Bootstrap 3 主题），大量使用 `.widget-box`、`.table`、`.nav-tabs` 等组件
- **SCU URP Assistant**：王兆基的同功能油猴脚本，功能更全面（一键评教、GPA 计算、教材辅助等），本项目侧重视觉美化
- **FullCalendar v3**：首页日程安排组件，事件 popover 通过 `#schedule-hover` 定位

---

## 版本历史

详见 `git log --oneline`
