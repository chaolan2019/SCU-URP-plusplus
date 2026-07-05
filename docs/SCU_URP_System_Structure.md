# 四川大学 URP 教务系统（学生端）结构文档

> 版本：基于 2026-07-04 登录后实际页面结构整理
> 范围：登录后的学生端首页及主要功能模块
> 脱敏说明：文档已去除姓名、学号、证件号、成绩数值等个人信息，仅保留页面结构与字段名

---

## 1. 全局架构

所有登录后页面共享同一套三栏/双栏骨架：

```
┌─────────────────────────────────────────────────────────────┐
│  顶部固定导航栏 (navbar-fixed-top)                            │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  左侧    │              主内容区 (page-content)              │
│  侧边栏  │                                                  │
│ (sidebar)│   面包屑 / 标题 / 查询区 / 表格 / 弹窗            │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### 1.1 顶部导航栏

| 元素 | 说明 |
|------|------|
| 左侧菜单开关 | `Toggle sidebar`，用于折叠/展开左侧栏 |
| 品牌 Logo | "四川大学教务管理系统"，点击回首页 `/` |
| 学校校历 | 弹窗/新窗口打开校历页面 |
| 作息时间表 | 调用 `openWorkRestSchedule()` 弹窗 |
| 学期周次 | 如 "2025-2026 春 第17周 星期六" |
| 用户菜单 | 首页、在线反馈、修改密码、注销 |
| 客服中心 | 右上角图标，链接 `/main/customerServiceCenter` |

### 1.2 左侧侧边栏

一级菜单（10 个），每个一级菜单下有二级/三级子菜单：

1. **线上服务**
   - 可申请业务
     - 推免申请 `/student/exemptsExam/ExemptExamController/sqIndex`
     - 我要申请 `/student/application/index`

2. **个人管理**
   - 学籍管理
     - 学生学籍信息 `/student/rollManagement/rollInfo/index`
     - 个人信息修改 `/student/rollManagement/personalInfoUpdate/index`
     - 学籍异动信息 `/student/rollManagement/rollChanges/index`
     - 奖惩信息 `/student/rollManagement/rewardsAndPenalties/index`
     - 电子注册 `/student/rollManagement/electronicRegistration/index`
     - 辅修方案注册 `/student/rollManagement/minorProgramRegistration/index`
     - 我的学籍卡片 `/student/rollManagement/myRollCard/index`
     - 学生证明打印 `/student/studentCertificatePrinting/index`
     - 学业预警信息 `/student/personalManagement/warningInfo/queryWarningInfo`

3. **选课管理**
   - 选课管理
     - 选课公告 `/student/courseSelect/courseSelectNotice/index`
     - 选课 `/student/courseSelect/courseSelect/index`
     - 选课结果 `/student/courseSelect/courseSelectResult/index`
     - 退课 `/student/courseSelect/quitCourse/index`
     - 选课失败信息 `/student/courseSelect/courseSelectFailed/index`
   - 本学期课表
     - 本学期课表 `/student/courseSelect/thisSemesterCurriculum/index`
     - 历年学期课表 `/student/courseSelect/calendarSemesterCurriculum/index`
     - 本学期周课表 `/student/personalSenate/giveLessonInfo/thisSemesterSchedule/weekLySchedule`
   - 教材
     - 选定教材 `/student/courseSelect/books/dealBooks/index`

4. **教师课堂评价**
   - 学生评教
     - 评估公告 `/student/teachingEvaluation/evaluateNotice/evaluateNoticeIndex`
     - 教学评估 `/student/teachingEvaluation/newEvaluation/index`

5. **教学资源**
   - 教学资源
     - 教室课表 `/student/teachingResources/classroomCurriculum/index`
     - 班级课表 `/student/teachingResources/classCurriculum/index`
     - 课程课表 `/student/teachingResources/courseCurriculum/index`
   - 自习查询
     - 空闲教室查询 `/student/teachingResources/freeClassroom/index`
     - 教室使用状况查询 `/student/teachingResources/classroomUseStatus/index`

6. **综合查询**
   - 成绩查询
     - 全部及格成绩 `/student/integratedQuery/scoreQuery/allPassingScores/index`
     - 课程属性成绩 `/student/integratedQuery/scoreQuery/coursePropertyScores/index`
     - 方案成绩 `/student/integratedQuery/scoreQuery/schemeScores/index`
     - 不及格成绩 `/student/integratedQuery/scoreQuery/unpassedScores/index`
     - 本学期成绩 `/student/integratedQuery/scoreQuery/thisTermScores/index`
     - 成绩查询（全部学期） `/student/integratedQuery/scoreQuery/allTermScores/index`
     - 课程替代规则查看 `/student/personalManagement/personalApplication/curriculumReplacement/rules`
   - 方案修读情况
     - 方案完成情况 `/student/integratedQuery/planCompletion/index`
     - 指导性教学计划 `/student/integratedQuery/instructionPlanQuery/detail/index`
     - 培养方案查看 `/student/comprehensiveQuery/search/trainProgram/index`
   - 教材
     - 教材选定查询 `/student/integratedQuery/teachingMaterial/SelectionSearch/index`

7. **考务管理**
   - 考务管理
     - 考试安排 `/student/examinationManagement/examPlan/index`
     - 考试报名 `/student/examinationManagement/examSignUp/index`
     - 考试成绩 `/student/examinationManagement/examGrade/index`

8. **可信证明**
   - 可信证明生成
     - 生成可信证明 `/student/integratedQuery/scoreQuery/credibleReportCard/index`
     - 历史生成查看 `/student/integratedQuery/scoreQuery/scoreCard/historyIndex`

9. **结业管理**
   - 结业生基础信息
     - 结业生报名 `/student/graduatesManagement/graduatesExamManagement/graduatesApply/initindex`
     - 缴费单下载 `/student/graduatesManagement/graduatesExamManagement/billUpload/indexDownload`
     - 缴费链接及说明 `/student/graduatesManagement/graduatesExamManagement/billUpload/index`

10. **考研学习**
    - 考研学习
      - 考研学习 `/all/postgraduate/postgraduateExamination/study/index`

### 1.3 全局弹层

多个页面共用以下模态框（默认隐藏）：

- 通知详情弹窗：`getNoticeDetail(id)`
- 调课后的周次弹窗
- 个人申请详情弹窗：`showPersonalApplication()`
- 常用下载弹窗：`queryDownFile()`
- 学分/GPA 详情弹窗：`showMoreGPA()`
- 课程信息弹窗：含"教学日历"、"教学大纲"子 tab

---

## 2. 首页（`/index`）

### 2.1 页面信息

- URL：`http://zhjw.scu.edu.cn/index`
- 标题：URP 高校教学管理与服务平台（学生）
- 布局：顶部通栏 + 左侧菜单 + 右侧多列卡片

### 2.2 内容模块

#### 通知公告
- 公告标题列表 + 发布日期
- 点击调用 `getNoticeDetail(id)` 查看详情
- 右上角"更多"链接：`/main/noticeList/index`

#### 我的待办任务
- 待办任务列表
- 刷新按钮

#### 开放的可申请业务（5 个快捷入口）
- 补办火车票优惠卡
- 补办学生证
- 免修申请
- 期末成绩缓考申请
- 替代课申请

#### 常用下载
- 文件下载列表
- 刷新按钮

#### 学业信息
- 已修读课程门数
- 尚不及格课程门数
- 主修必修 GPA + 算法说明
- 培养方案概况
- 本学期待修读课程门数
- 学分核查入口：去确认

#### 我的日程安排
- FullCalendar 组件
- 视图切换：月 / 周 / 日 / 日程
- 默认"周"视图
- 显示本周课程安排

---

## 3. 选课公告（`/student/courseSelect/courseSelectNotice/index`）

### 3.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/courseSelect/courseSelectNotice/index`
- 标题：选课公告

### 3.2 操作区

- 快捷按钮：
  - 去选课
  - 去退课
  - 去看选课结果
- 关闭按钮

### 3.3 公告列表

- 表格列：标记、公告标题、发布日期
- 每行可点击查看详情

---

## 4. 选课（`/student/courseSelect/courseSelect/index`）

### 4.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/courseSelect/courseSelect/index`
- 标题：提示

### 4.2 页面状态

- 非选课开放时段仅显示提示弹窗
- 弹窗含关闭按钮
- 选课开放时段应显示：查询条件 + 课程列表 + 选课操作

---

## 5. 选课结果（`/student/courseSelect/courseSelectResult/index`）

### 5.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/courseSelect/courseSelectResult/index`
- 标题：选课结果

### 5.2 操作区

- 漏选检查按钮：初修"按项目合成总成绩"课程检查
- 打印课表
- 导出课表

### 5.3 已安排课程课表

- 周视图表格
- 表头：节次、星期日 ~ 星期六
- 行：第一大节 ~ 第五大节，细分为第 1~12 节
- 单元格内容：课程名、教师、周次、节次、教室

### 5.4 全部课程清单

- Tab 切换：按培养方案分组
- 表格列：
  - 课程号
  - 课程名
  - 教学日历
  - 教学大纲
  - 课序号
  - 学分
  - 课程属性
  - 课程类别
  - 考试类型
  - 教师
  - 修读方式
  - 选课状态
  - 选课限制说明
  - 时间
  - 地点
- 每行操作：日历、大纲

### 5.5 实习课安排

- 表格列：课程号、课序号、课程名、实习安排（时间-地点-带队老师）

### 5.6 按项目合成总成绩子课程

- 表格列：序号、方案名称、修读类型、主课程号、主课程名、学分、学时、子课程号、子课程名、课序号

---

## 6. 本学期课程表（`/student/courseSelect/thisSemesterCurriculum/index`）

### 6.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/courseSelect/thisSemesterCurriculum/index`
- 标题：本学期课程表

### 6.2 操作区

- 打印课表
- 导出课表

### 6.3 已安排理论课课表

- 与"选课结果"同结构的周视图表格

### 6.4 全部理论课安排

- Tab 切换：按培养方案/教学计划分组
- 提示：标红课程表示没有具体上课时间地点
- 表格列：
  - 课程号
  - 课程名
  - 教学日历
  - 教学大纲
  - 课序号
  - 学分
  - 课程属性
  - 课程类别
  - 考试类型
  - 教师
  - 修读方式
  - 选课状态
  - 排课备注
  - 选课限制说明
  - QQ/微信群
  - 时间
  - 地点

---

## 7. 成绩查询

### 7.1 全部及格成绩（`/student/integratedQuery/scoreQuery/allPassingScores/index`）

- Tab 切换：按学年学期分组
- 每个学期区块显示：已修门数、学分、通过门数
- 表格列：
  - 序号
  - 课程号
  - 课序号
  - 课程名
  - 课程属性
  - 学分
  - 成绩
  - 英文课程名

### 7.2 本学期成绩（`/student/integratedQuery/scoreQuery/thisTermScores/index`）

- 标题：本学期成绩查询列表
- 表格列：
  - 课程号
  - 课序号
  - 课程名
  - 学分
  - 课程属性
  - 成绩
  - 未通过原因
  - 英文课程名

---

## 8. 学籍信息（`/student/rollManagement/rollInfo/index`）

### 8.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/rollManagement/rollInfo/index`
- 标题：学籍信息
- 特点：多区块卡片式展示，含照片

### 8.2 与我相关的信息

- 主修方案名称
- 学籍异动数量

### 8.3 基本信息

- 照片
- 身高、体重
- 电子邮件
- QQ 号
- 个人简介
- 个人主页
- 手机
- 宿舍电话
- 邮编
- 血型
- 宿舍地址
- 家长信息
- 备注 1 / 2 / 3
- 修改信息按钮

### 8.4 学籍信息

- 学号
- 姓名
- 姓名拼音 / 英文姓名
- 证件号码（脱敏）
- 年级
- 院系
- 专业
- 专业方向
- 班级
- 辅修专业
- 第二学位专业
- 是否有学籍
- 是否有国家学籍
- 学生类别
- 学籍状态
- 学科门类
- 特殊学生类型
- 收费类别
- 分流方向
- 培养方式
- 入学日期
- 因材施教
- 培养层次
- 是否离校
- 是否应届毕业
- 入学年级
- 学制类型
- 学生类型
- 是否留学生

### 8.5 招生信息

- 性别
- 民族
- 政治面貌
- 国家/地区
- 授课语种
- 出生日期
- 籍贯
- 外语语种
- 乘车区间
- 考生特征
- 定向委培单位
- 通讯地址（脱敏）
- 考区
- 高考考生号
- 高考总分
- 毕业中学
- 入学考试语种
- 录取号
- 录取年份
- 学习形式
- 录取类别
- 农村应届

### 8.6 毕业信息

- 学位
- 学位证书编号
- 毕业类型
- 毕业日期
- 预计毕业日期
- 毕业证书编号
- 离校日期
- 授予学位时间
- 第二学位
- 第二学位证书编号
- 辅修证书编号

### 8.7 关联弹窗/标签

页面还包含隐藏或可切换的区域：
- 奖惩信息
- 学籍异动信息
- 培养方案
- 学年学期信息
- 课组信息
- 课程基本信息
- 课程方案信息

---

## 9. 考试安排（`/student/examinationManagement/examPlan/index`）

### 9.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/examinationManagement/examPlan/index`
- 标题：考试安排

### 9.2 显示风格切换

- 单选按钮：时间轴模式 / 日历模式
- 对应按钮

### 9.3 考试时间轴

- 时间轴列表
- 每项：日期、（课程号-课序号）课程名、状态（如"已结束"）

### 9.4 日历模式

- 月历视图
- 标记考试日期

### 9.5 未安排考试课程

- 备注说明区域

---

## 10. 空闲教室查询（`/student/teachingResources/freeClassroom/index`）

### 10.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/teachingResources/freeClassroom/index`
- 标题：空闲教室查询

### 10.2 校区分组

按校区分组列出教学楼按钮/链接：

#### 望江校区
全部教学楼、在线考试虚拟考场、一教、二教、三教、基教楼 A/C/B 座、五教、经济学院、工程设计实验教学中心、生物材料楼、分析测试中心、化工学院、FBR 楼、电气楼、实验室、体育馆、文华活动中心、学生就业指导中心、数学学院、管理楼、经管楼、纺工楼、外文楼、四教、生命学院、公共管理学院、藏学研究所、高分子学院、水电学院、放化馆、皮革楼、文理图书馆、物理馆、体育学院、滨江楼、化学馆、制造学院、自然博物馆、文科楼、西区逸夫科技楼、展业大厦、研究生院二区/三区、新材化楼等。

#### 华西校区
全部教学楼、临医楼、二教、三教、体育场、卫新、卫阶、四教、八教、九教、十教、实验室、华西、口腔教学楼、图书馆、基法学院、五教、第三住院大楼、逸夫楼、校外实习基地、第四/第六教学楼、虚拟教学楼等。

#### 江安校区（当前所在校区）
全部教学楼、虚拟教学楼、一教 A/B/C/D 座、综合楼 B/C 座、图书馆、艺术实验教学中心、艺术大楼、建环大楼、体育场、实验室、二基楼 B 座、工程训练中心、法学大楼主楼/附楼、文科楼一区/二区/三区/四区、灾后重建与管理学院 A/C 区、水电学院、匹兹堡学院、未来游泳馆、匹兹堡学院大楼、现代工学互动教学中心、江安校区体育馆、制造学院、I 创街、体能训练中心、多学科交叉研究创新大楼、燃烧动力学中心、卓越工程师教学训练中心、新能源与低碳技术研究院、学业与发展支持中心、动物实验中心、药学院等。

---

## 11. 教室课表（`/student/teachingResources/classroomCurriculum/index`）

### 11.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/teachingResources/classroomCurriculum/index`
- 标题：教室课表

### 11.2 查询条件

- 学年学期（下拉选择）
- 校区（下拉选择）
- 教学楼（下拉选择）
- 教室名称（下拉选择）
- 查询按钮

### 11.3 教室列表

- 表格列：
  - 序号
  - 课表信息查看
  - 教室信息查看
  - 校区名
  - 教学楼名
  - 教室号
  - 教室名
  - 上课座位数
  - 所属院系
  - 教室类型
- 每行操作：
  - 查看课表
  - 查看教室信息

### 11.4 课表详情弹窗

- 表格列：课程号、课程名、课序号、教师、周次、星期、节次、校区、教学楼、教室

### 11.5 分页

- 页码输入框
- 每页条数下拉（默认 30）

---

## 12. 教学评估（`/student/teachingEvaluation/newEvaluation/index`）

### 12.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/teachingEvaluation/newEvaluation/index`
- 标题：教学评估

### 12.2 Tab 切换

- 课堂及时评教
- 期末评教

### 12.3 评估列表

- 表格列：
  - 序号
  - 操作
  - 问卷名称
  - 被评人
  - 评估内容
  - 评估课程号
  - 评估课序号
  - 教材编号
  - 教材名称
  - ISBN
  - 出版社
  - 出版日期
  - 开课院系
  - 课程号
  - 课程名
  - 是否已评估

### 12.4 教师综合评价打分结果弹窗

- 表格列：序号、教师号、教师名、教师院系、性别、所授课程、是否非常满意、评价分数

---

## 13. 培养方案 / 方案完成情况（`/student/integratedQuery/planCompletion/index`）

### 13.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/integratedQuery/planCompletion/index`
- 标题：培养方案 / 方案完成情况

### 13.2 方案切换

- 按钮：自动化培养方案、电气电子创新设计（微专业）教学计划等
- 点击后加载对应方案详情

### 13.3 详情 Tab

- 培养方案总体完成情况
- 培养方案课程修读情况
- 指导教学计划完成情况

### 13.4 总体完成情况

- 方案内/外修读课程门数
- 及格率
- 未完成课组最低进度百分比
- 完成/未完成修读课组个数

### 13.5 指导教学计划完成情况

- 表格列：
  - 序号
  - 学期学年
  - 学期要求最低学分
  - 已修读学分
  - 已修读学时
  - 已及格门数
  - 未及格门数
  - 学分完成率

---

## 14. 个人申请（`/student/application/index`）

### 14.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/application/index`
- 标题：个人申请

### 14.2 查询条件

- 业务名称输入框
- 查询按钮

### 14.3 可申请业务列表

- Tab：申请中 / 已关闭
- 业务入口（大按钮）：
  - 转专业申请
  - 补办火车票优惠卡
  - 补办学生证
  - 期末成绩缓考申请
  - 替代课申请
  - 微专业方案注销申请
  - 创新/创业

---

## 15. 教学评估公告（`/student/teachingEvaluation/evaluateNotice/evaluateNoticeIndex`）

### 15.1 页面信息

- URL：`http://zhjw.scu.edu.cn/student/teachingEvaluation/evaluateNotice/evaluateNoticeIndex`
- 标题：教学评估公告

### 15.2 公告列表

- 表格列：标记、公告标题、发布日期
- 结构与选课公告类似

---

## 16. 通用 UI 组件

### 16.1 表格

绝大多数列表页使用 Bootstrap/ACE 表格，常见列操作：
- 查看
- 日历
- 大纲
- 编辑/修改信息

### 16.2 按钮样式类

- `btn btn-info btn-xs btn-round`：主要操作按钮
- `btn btn-primary btn-white dropdown-toggle`：下拉菜单触发
- `btn btn-app btn-info`：大图标业务入口
- `btn btn-success btn-round`：方案切换
- `btn btn-purple btn-xs btn-round`：修改信息

### 16.3 弹窗

- 通用模态框结构：标题、内容区、关闭/保存按钮
- 课程信息弹窗含 tab：课程基本信息、课程方案信息、学年学期信息、课组信息

### 16.4 分页

- 页码输入框 + 每页条数下拉（常见 30/50/100）

### 16.5 表单控件

- 文本输入框
- 下拉选择框（select）
- 单选按钮（radio）
- 隐藏域（hidden）用于提交查询参数

---

## 17. 路由索引表

| 模块 | 页面 | 路由 |
|------|------|------|
| 首页 | 首页 | `/index` |
| 选课 | 选课公告 | `/student/courseSelect/courseSelectNotice/index` |
| 选课 | 选课 | `/student/courseSelect/courseSelect/index` |
| 选课 | 选课结果 | `/student/courseSelect/courseSelectResult/index` |
| 选课 | 退课 | `/student/courseSelect/quitCourse/index` |
| 选课 | 本学期课表 | `/student/courseSelect/thisSemesterCurriculum/index` |
| 选课 | 历年学期课表 | `/student/courseSelect/calendarSemesterCurriculum/index` |
| 选课 | 本学期周课表 | `/student/personalSenate/giveLessonInfo/thisSemesterSchedule/weekLySchedule` |
| 成绩 | 全部及格成绩 | `/student/integratedQuery/scoreQuery/allPassingScores/index` |
| 成绩 | 本学期成绩 | `/student/integratedQuery/scoreQuery/thisTermScores/index` |
| 成绩 | 全部学期成绩 | `/student/integratedQuery/scoreQuery/allTermScores/index` |
| 学籍 | 学生学籍信息 | `/student/rollManagement/rollInfo/index` |
| 教学资源 | 教室课表 | `/student/teachingResources/classroomCurriculum/index` |
| 教学资源 | 空闲教室查询 | `/student/teachingResources/freeClassroom/index` |
| 考务 | 考试安排 | `/student/examinationManagement/examPlan/index` |
| 评估 | 教学评估 | `/student/teachingEvaluation/newEvaluation/index` |
| 评估 | 评估公告 | `/student/teachingEvaluation/evaluateNotice/evaluateNoticeIndex` |
| 培养方案 | 方案完成情况 | `/student/integratedQuery/planCompletion/index` |
| 申请 | 我要申请 | `/student/application/index` |

---

## 18. 美化建议方向

基于以上结构，正式页面美化可从以下几个层面入手：

1. **全局样式重置**
   - 替换 Bootstrap/ACE 默认蓝色主色
   - 统一圆角、阴影、间距
   - 优化表格行高和边框

2. **侧边栏**
   - 当前为深色 sidebar + 蓝色选中
   - 可改为与主题一致的极简风格
   - 优化三级菜单缩进和图标

3. **首页卡片**
   - 通知、学业信息、日程等卡片可统一风格
   - 课表周视图可优化色彩和可读性

4. **表格页**
   - 成绩、选课结果、教室课表等页面表格是核心
   - 可优化表头背景、行悬停、分页器

5. **表单/查询区**
   - 查询条件区域可改为 card 风格
   - 下拉框、按钮统一主题

6. **弹窗**
   - 调课周次、课程信息、个人信息修改等弹窗统一圆角和动效

---

*文档生成时间：2026-07-04*
