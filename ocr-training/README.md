# 验证码本地 OCR 训练（本地专用，不推送 GitHub）

辅助插件（urpppp）的验证码本地识别模型训练目录。**本目录在 `.gitignore` 中排除，不会推送到 GitHub。**

## 目录

| 路径 | 内容 |
|------|------|
| `zhjw/001.jpg ~ 100.jpg` | 教务系统验证码样本（180×60，红色扭曲字符 + 黑色曲线干扰） |
| `scu-id/001.png ~ 100.png` | 统一认证验证码样本（80×26，4 位彩色字符 + 灰斜线 + 噪点） |
| `labels/*.json` | 人工/自动标注结果（样本号 → 字符内容） |
| `model/*.json` | 训练产物：质心模板模型（内嵌进插件） |

## 收集

```bash
node collect-zhjw.mjs 100    # 教务系统：http://zhjw.scu.edu.cn/img/captcha.jpg（免登录）
node collect-scu-id.mjs 100  # 统一认证：https://id.scu.edu.cn/api/public/bff/v1.2/one_time_login/captcha
```

## 训练流程

1. **标注**：`labels/zhjw.json` / `labels/scu-id.json`，格式 `{ "001": "1181f", ... }`
2. **预处理**：统一尺寸 → 去干扰（教务去黑曲线/统一认证去斜线）→ 颜色分割字符 → 归一化
3. **训练**：`node train.mjs <site>` 生成 `model/<site>.json`（字符类质心模板，36 类 × 8×6 uint8）

## 关键参数（逆向结论）

| 站点 | 尺寸 | 位数 | 字符集 | 干扰 |
|------|------|------|--------|------|
| 教务 zhjw | 180×60 | 4~5 | 字母+数字 | 黑色曲线涂抹，红字 |
| 统一认证 scu-id | 80×26 | 4 | 字母+数字 | 灰色斜线 + 彩色噪点，每字符独立颜色 |

> 统一认证验证码与 scu-plus 仓库逆向的「白字黑底 + 灰线 #6f6e70」**已不同款**，需独立训练。
