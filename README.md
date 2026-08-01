![SCU URP++](./docs/scu-urppp-logo.png)

四川大学 URP 教务系统油猴脚本：全站 UI 美化 + 清爽模式聚合页。

| 脚本 | 文件 | 当前版本 |
|------|------|----------|
| 主脚本 | `urppp.user.js` | **1.5.0** |
| 辅助插件（可选） | `urpppp.user.js` | **1.3.1** |

作者：`Chao_Lan, Hanako`

> 可选辅助插件（登录 / 评教）说明见 **[README_.md](./README_.md)**。  
> 辅助插件可能存在风险，请谨慎安装；使用中出现的一切问题请自负。

---

## 效果展示

### 主站美化

![主站美化](./docs/Main-Page.jpg)

### 清爽模式 · 类Apple（桌面）

![清爽模式类Apple](./docs/Clean-Mode.jpg)

### 清爽模式 · 极简扁平（桌面）

![清爽模式极简扁平](./docs/Clean-Mode-Flat.jpg)

### 清爽模式 · 自然有机（桌面）

![清爽模式自然有机](./docs/Clean-Mode-Organic.jpg)

### 清爽模式（手机）

![清爽模式手机](./docs/Clean-Mode-Mobile.jpg)

---

## 功能概览

### 主脚本 `urppp.user.js`

- **全站美化**：登录页、顶栏、侧栏、表格、表单、弹窗、分页等统一主题
- **默认视觉**：**类Apple风格**（系统灰底、链接蓝、大圆角、轻阴影、胶囊按钮）；可选淡细边缘线条
- **配色模式**：简约白 / 深邃暗 / 动态配色；界面会按当前风格能力自动禁用不支持的模式
- **界面风格（主题选择）**：类Apple / 极简扁平 / 自然有机 / 新野兽派 / 编辑杂志 / 新拟物（均已启用）
  - 因适配规模大，**重点保证清爽模式完整适配**；主站异常时可回类Apple并开启边缘线条
  - 类Apple：系统灰、链接蓝、大圆角和轻阴影；支持暗色与动态配色
  - 极简扁平：直角硬边、无阴影；支持暗色与动态配色，交互表面悬停时自动黑白反转
  - 自然有机：奶油大地色、温暖圆角；支持暗色，动态配色入口禁用
  - 新野兽派：高对比画布、粗黑边和硬阴影；不支持暗色与种子动态配色，可切换高能粉、酸性绿、电子蓝、亮橙预设色板
  - 编辑杂志：暖米纸面、衬线标题、无框组件与极淡分割线；支持暖黑暗色和跟随系统，不支持动态配色
  - 新拟物：同色表面、双向柔和阴影与内凹交互；支持独立暗色和跟随系统，不支持动态配色
- **清爽模式**（首页）：
  - 个人资料（自动校正主修方案与必修绩点）、本周课表（可切周）、成绩总览、服务入口
  - 成绩明细：核心成绩优先展示，期末评教状态后台补齐；支持点选 / 框选，绩点按川大现行对照表计算
  - 空闲教室：楼栋网格、今天/明天/后天、占用首字与详情
  - 手机底栏：首页 / 成绩 / 教室 / 其他
- **课表导出**：清爽模式和个人课表页面统一支持 ICS 日历、小爱课程导入兼容 JSON 与 PNG 图片；原教务课表页面继续使用教务系统原生 PDF
- **隐私与身份显示**：一键统一遮罩或按字段自定义显示内容，可隐藏个人信息、成绩、绩点、学分、其他数据、头像和课表；开启页面内修改后可直接编辑首页与清爽模式中的已探测数据，隐私遮罩始终优先
- **设置面板（四选项卡）**：
  - **主题设置**：配色模式、跟随系统、默认进入清爽、类Apple边缘线条、种子色方案或新野兽派高对比预设（默认打开此页）
  - **主题选择**：界面风格大卡片；每张卡使用独立按钮、悬停和选中效果，不受当前风格污染
  - **系统设置**：隐私模式、自定义姓名与头像、自定义 JSON 导出格式、自动/手动检查更新；辅助插件入口挂载于此
  - **关于**：Logo、版本（可点进仓库）、作者、QQ 与反馈文案
- **注意**：开发过程没有将选课界面纳入考虑范围，选课界面只有通用美化样式，考虑到选课界面对速度的要求，建议在选课期间禁用此插件；此外部分界面可能存在某些适配问题，若影响操作也请禁用此插件，见谅。

---

## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey）
2. 安装主脚本，任选其一：
   - **Greasy Fork**：打开 [Greasy Fork](https://greasyfork.org)，搜索 **`SCU URP++`** 安装
   - 本地：打开仓库中的 `urppp.user.js` 导入 / 安装
3. 访问 [四川大学教务](http://zhjw.scu.edu.cn/login) 硬刷新

匹配域名：

- `http://zhjw.scu.edu.cn/*`
- `http://202.115.47.141/*`

---

## 使用

### 主题与设置

- 顶栏主题圆点切换配色模式；齿轮打开设置
- 设置默认进入 **主题设置**：跟随系统、默认清爽、类Apple边缘线条、动态种子色与方案
- **主题选择** 切换界面风格（类Apple / 极简扁平 / 自然有机 / 新野兽派 / 编辑杂志 / 新拟物均可用）
- 自然有机不支持动态配色，第三个主题圆点会变灰并禁用
- 新野兽派不支持暗色和种子动态配色：第二个圆点禁用；第一个圆点恢复默认高能粉，第三个圆点应用设置中选定的酸性绿 / 电子蓝 / 亮橙备用色板
- 编辑杂志支持暗色和跟随系统，动态配色入口禁用
- 新拟物支持暗色和跟随系统，动态配色入口禁用；外层卡片与控件使用拟物阴影，表格、课表和状态数据保持扁平
- **系统设置** 中可管理隐私遮罩、自定义姓名与头像、JSON 导出格式、自动检测更新及辅助插件
- **关于** 查看版本（点标题进仓库）、作者、QQ 与反馈文案

### 清爽模式

- 仅在**首页**显示顶栏「清爽」入口；也可在设置中默认进入
- 桌面约 1:1 双栏；窄屏切换底栏布局
- 成绩卡点进明细，可点行或拖拽框选后看学分 / 均分 / 绩点
- 空闲教室：选楼栋 → 看占用；支持今天 / 明天 / 后天
- 课表标题旁的「导出」可生成 ICS、小爱课程导入兼容 JSON 或完整学期 PNG；PDF 需前往原教务本学期课表页面使用原生导出

### JSON 课表导出

默认 JSON 使用“小爱课程导入”兼容结构，每个上课安排独立生成一条课程记录：

```json
{
  "courses": [
    {
      "name": "课程名称",
      "teacher": "教师姓名",
      "position": "校区 教学楼 教室",
      "day": 1,
      "sections": "1,2",
      "weeks": "1,2,3,4"
    }
  ],
  "schedule": {
    "morningNum": 4,
    "afternoonNum": 5,
    "nightNum": 3,
    "sections": "[{\"i\":1,\"s\":\"08:15\",\"e\":\"09:00\"}]"
  }
}
```

- 课程、教师、周次、节次和地点来自教务课表接口；导出文件不包含姓名、学号或证件号
- 官方接口中的每个上课安排独立生成一个课程对象，该安排包含的周次合并为逗号字符串；缺周次和未排时间的课程会跳过并显示提示
- `schedule.sections` 按目标工具要求保存为转义后的 JSON 字符串；上午、下午、晚上节数仅在真实节次连续、时间完整且三个时段均可判定时生成
- 该 JSON 可配合课程导入工具写入手机系统课程表，例如小爱课程表；可使用酷安用户 **@Mercury_me** 制作的“小爱课程导入”软件
- @Mercury_me 后续还制作了操作更直接的新工具，不一定需要手动中转 JSON；JSON 仍适合数据备份、调试及其他导入器

在 **系统设置 → JSON 导出格式** 中可以开启自定义映射。映射只调整输出路径和字段名，不执行 JavaScript：

```json
{
  "base": { "provider": "SCU URP++" },
  "coursesPath": "data.courses",
  "schedulePath": "data.schedule",
  "courseFields": {
    "name": "title",
    "teacher": "lecturer",
    "day": "weekday",
    "sections": "periods",
    "weeks": "weeks"
  },
  "scheduleFields": {
    "sections": "periods"
  }
}
```

`courseFields` 可使用 `name`、`teacher`、`position`、`day`、`sections`、`weeks`、`code`、`sequence`、`englishName`、`attribute`、`category`、`credit`、`status`、`campus`、`building`、`classroom`、`startSection`、`endSection` 和 `weekList`。`scheduleFields` 可使用 `morningNum`、`afternoonNum`、`nightNum`、`sections` 和 `sectionList`。右侧目标值支持 `data.items` 形式的对象嵌套路径，不支持数组索引；相互覆盖的路径会在保存时被拒绝。

### 隐私与自定义身份

- 在 **系统设置** 选择关闭、一键隐私或自定义隐私；遮罩只改变当前页面显示，不修改教务数据
- 自定义模式可分别设置学号/证件、学院/专业、联系与个人信息、成绩、绩点、学分、其他数据、课表和头像
- 首页默认将已修课程数、未及格课程数和待修课程数归入“其他数据”；开启“页面内修改”后，可直接点击首页与清爽模式中带标记的数据进行编辑
- 自定义姓名与头像属于显示美化；隐私模式开启时优先显示隐私遮罩

---

## 特别鸣谢

- **AI 支持**：GPT-5.6 Sol、Grok 4.5、Kimi K2.7 Code、DeepSeek V4 Pro/Flash
- **Agent 支持**：[HanaAgent](https://github.com/liliMozi/openhanako)（原 OpenHanako，由 liliMozi 开发）
- **功能灵感来源**：[scu-plus](https://github.com/The-Brotherhood-of-SCU/scu-plus)
- **美化风格支持**：[STYLEKIT](https://www.stylekit.top/zh)

---

## 仓库结构

```text
URP++/
├── urppp.user.js              # 主脚本
├── urpppp.user.js             # 辅助插件（可选）
├── README.md                  # 主脚本说明
├── README_.md                 # 辅助插件说明与风险声明
├── LICENSE                    # MIT 开源协议
├── CHANGELOG.md               # 主脚本更新日志
└── docs/
    ├── scu-urppp-logo.png       # 标题 Logo
    ├── icon.png                 # 油猴脚本图标
    ├── Main-Page.jpg            # 效果：主站美化
    ├── Clean-Mode.jpg           # 效果：清爽 · 类Apple
    ├── Clean-Mode-Flat.jpg      # 效果：清爽 · 极简扁平
    ├── Clean-Mode-Organic.jpg   # 效果：清爽 · 自然有机
    └── Clean-Mode-Mobile.jpg    # 效果：清爽 · 手机
```

---

## 注意

1. 仅供个人学习与效率用途，请遵守学校教务使用规范  
2. 教务改版可能导致选择器 / 接口失效，需跟进适配  
3. 辅助插件相关风险与免责见 [README_.md](./README_.md)

---

## 开发

本地直接改 `urppp.user.js`，在 Tampermonkey 中指向文件或复制安装后硬刷新验收。

常见调试：

- 清爽模式：`window.__urpppCleanMode`

```bash
node --check urppp.user.js
```

---

## 更新日志

见 [CHANGELOG.md](./CHANGELOG.md)。

---

## 许可

本项目采用 [MIT License](./LICENSE)。

脚本头中的 `@license MIT` 供 Tampermonkey / Greasy Fork 识别；仓库根目录的 `LICENSE` 文件供 GitHub 显示开源协议。
