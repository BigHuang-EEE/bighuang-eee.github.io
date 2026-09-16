# Silver Xiwen Huang — Personal Website

个人学术网站，内容涵盖 Robotics、Physical Intelligence、Machine Learning 与 Computer Vision。

- 网站：https://bighuang-eee.github.io/xiwen-huang.github.io/
- GitHub：https://github.com/BigHuang-EEE/xiwen-huang.github.io
- 联系邮箱：standingfloating@gmail.com

## 本地预览

```bash
cd "/Users/bighuang/Downloads/Resume/Personal Website"
npm run dev
```

打开 http://localhost:4173/。需要 Node.js 22 或更高版本，不需要安装 npm 依赖。修改 `site/` 后刷新浏览器；按 `Control+C` 关闭服务。不要直接双击 HTML 文件。

## 当前内容

- Research：空中操作安全强化学习、LLM 幻觉与弃答、通用类血管结构分割、可微仿真四足机器人运动策略，共 4 个项目及详情页。
- Publications：`Physics-Consistent Safe RL for Aerial Manipulation`，第二作者，拟投 ICRA 2027，状态为准备中。
- CV：教育、研究兴趣、奖项、研究与项目经历、实习、技能及联系方式。
- Updates：5 条依据简历时间线整理的动态。
- 研究配图：基于简历绘制的 SVG 方法示意图，不是实验照片或论文原图。每项研究均有 `overview.svg` 和 `overview-dark.svg` 两个主题版本。
- 下载简历：`site/assets/pdf/Huang-Xiwen-CV.pdf`，来自 `Huang-Xiwen-CV-ouyang-style_9.pdf`，内容保持原件。旧地址 `CV_general.pdf` 也指向同一份内容。

按站主 2026-09-17 的要求，**首页 About me 及其上方的正文暂未改写**，其中仍有待后续更新的光子学背景描述。UI 改版调整了这一区域的排版与布局，正文保持不变。全站导航姓名、标题、元数据、页脚及 About me 以下内容已个性化。

## 视觉系统

使用系统无衬线字体、黑白与冷蓝色、透明导航、圆角研究卡片、大字号层级和轻量入场动效。支持移动端导航、深色主题、减少动态效果设置和 CV 打印。无需新的运行依赖。

全站颜色和间距集中在 `site/assets/css/keynote.css`。它在原有样式之后加载，正文内容仍在各 HTML 页面中。

## 修改位置

| 内容 | 位置 |
| --- | --- |
| 首页介绍、精选项目、近期动态、稿件摘要 | `site/index.html` |
| 研究列表 | `site/projects/index.html` |
| 项目详情 | `site/projects/各项目名称/index.html` |
| 研究示意图 | `site/assets/img/projects/各项目名称/overview.svg` |
| 论文列表 | `site/publications/index.html` |
| 简历页面 | `site/cv/index.html` |
| 下载简历 | `site/assets/pdf/Huang-Xiwen-CV.pdf` |
| 动态列表与详情 | `site/news/` |
| 头像 | `site/assets/img/prof_pic.jpg` |
| 原有布局与主题 | `site/assets/css/main.css` |
| 个性化内容的补充样式 | `site/assets/css/profile.css` |
| Apple Keynote 风格的全站视觉系统 | `site/assets/css/keynote.css` |
| 导航滚动状态与轻量入场动效 | `site/assets/js/keynote.js` |
| 站点地图 | `site/sitemap.xml` |

这是静态 HTML 项目。修改姓名、联系方式或项目摘要时，需要同步相关页面；更新下载简历时，也同步 `CV_general.pdf` 这一兼容地址。新增／删除页面后同步站点地图。编辑 `site/`，不要编辑自动生成的 `dist/`。

## 检查与构建

```bash
npm run check                 # 检查页面链接、图片和锚点，需要 Python 3
npm run build                 # 生成 dist/
python3 scripts/check.py dist # 检查构建结果
npm run preview               # 预览 dist/，先关闭占用 4173 的 dev 服务
```

本项目同时支持用户主页根路径和普通仓库子路径，GitHub Actions 会自动配置发布地址。

手动检查当前仓库路径：

```bash
SITE_URL=https://bighuang-eee.github.io/xiwen-huang.github.io BASE_PATH=/xiwen-huang.github.io npm run build
python3 scripts/check.py dist /xiwen-huang.github.io
BASE_PATH=/xiwen-huang.github.io npm run preview
```

## 发布更新

```bash
git add -A
git commit -m "Update website content"
git push
```

推送到 `main` 后，`.github/workflows/pages.yml` 自动构建、检查并发布网站。进入仓库 **Actions → Deploy website to GitHub Pages** 查看结果。绿色勾表示部署成功。

初次启用时，进入仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。若需要重新发布，在 Actions 中点击 **Run workflow**，选择 `main` 后运行。

## 常见问题

- **图片没有变化**：部署成功后，按 `Command+Shift+R` 强制刷新；也可以为图片地址增加版本参数。
- **预览端口占用**：关闭原来的预览服务，或执行 `PORT=4174 npm run dev`。
- **图标或字体加载不完整**：第三方库仍使用 jsDelivr 和 Google Fonts，需要联网。
- **Pages 配置报错**：确认 Pages 的 Source 是 GitHub Actions，再运行部署。

主题沿用并调整自 al-folio，保留原有 MIT 许可证。内容来源和验证范围见 [SOURCE.md](SOURCE.md)。
