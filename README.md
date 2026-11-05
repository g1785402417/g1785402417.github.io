# 郭润琪 · 个人作品集

个人学术与职业作品集，使用纯 HTML、CSS 和 JavaScript 构建，部署于 GitHub Pages。

**网址：** [https://g1785402417.github.io/](https://g1785402417.github.io/)

## 页面内容

- 个人简介与近况
- 教育背景
- 实习经历
- 项目经历（量化策略明确标注为回测结果）
- 荣誉奖项与学生工作
- 专业技能
- 联系方式与公开简历下载

## 技术说明

- 单页响应式设计，适配桌面与移动端
- 中文为默认语言，支持中英文切换，语言偏好保存在本地
- 使用暖色视觉系统、原创排版、内联 SVG 图标与可动效的 3D 数字形象
- 字体（Noto Serif SC、Noto Sans SC、Fraunces）已作本地子集化并随站点发布，无外部字体或 CDN 依赖
- 支持键盘导航、跳过链接与减少动态效果偏好
- 支持首屏入场、滚动显现、数字滚动、人物浮动与章节进度等动效

## 素材与许可

- 3D 数字形象基于 Microsoft Fluent Emoji 的 “Man raising hand” 素材修改，原项目采用 MIT License；许可和修改说明见 [`assets/avatar/`](assets/avatar/)。
- 字体采用 SIL Open Font License 1.1，许可文本见 [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt)。
- 页面布局、配色和动效为本项目原创实现。

## 隐私说明

- 网站仅公开邮箱，不展示手机号、住址或身份证等个人信息。
- 公开简历 PDF 为单独制作的脱敏版本，已隐去手机号与住址。
- 原始简历、证件照和实习证明不包含在本仓库中。

## 本地预览

在仓库根目录启动任意静态文件服务器，例如：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 部署

GitHub Pages 使用 `main` 分支根目录发布。站点入口为根目录的 `index.html`。
