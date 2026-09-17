# Silver Xiwen Huang — Personal Website

个人学术网站，内容涵盖 Robotics、Physical Intelligence、Machine Learning 与 Computer Vision。

- 网站：https://bighuang-eee.github.io/
- GitHub：https://github.com/BigHuang-EEE/bighuang-eee.github.io
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
- CV：把最新版 PDF 的文字自动整理成适合桌面和手机阅读的网页；桌面左侧显示一级章节导航，手机显示横向章节导航，并提供原版 PDF 下载。
- Updates：5 条依据简历时间线整理的动态。
- 研究配图：基于简历绘制的 SVG 方法示意图，不是实验照片或论文原图。每项研究均有 `overview.svg` 和 `overview-dark.svg` 两个主题版本。
- 下载简历：唯一维护源为私有仓库 `BigHuang-EEE/CV` 的 `Huang-Xiwen-CV.pdf`。网站中的 PDF 是自动同步的发布副本；旧地址 `CV_general.pdf` 保持兼容。

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
| 下载简历（维护源） | 相邻仓库 `../CV/Huang-Xiwen-CV.pdf` |
| 动态列表与详情 | `site/news/` |
| 头像 | `site/assets/img/prof_pic.jpg` |
| 原有布局与主题 | `site/assets/css/main.css` |
| 个性化内容的补充样式 | `site/assets/css/profile.css` |
| Apple Keynote 风格的全站视觉系统 | `site/assets/css/keynote.css` |
| 导航滚动状态与轻量入场动效 | `site/assets/js/keynote.js` |
| 站点地图 | `site/sitemap.xml` |

这是静态 HTML 项目。修改姓名、联系方式或项目摘要时，需要同步相关页面；更新下载简历时，只需更新 CV 仓库的 `Huang-Xiwen-CV.pdf` 并推送，自动同步流程会更新两个 PDF 地址。新增／删除页面后同步站点地图。编辑 `site/`，不要编辑自动生成的 `dist/`。

## 检查与构建

```bash
npm run check                 # 检查页面链接、图片和锚点，需要 Python 3
npm run build                 # 生成 dist/
python3 scripts/check.py dist # 检查构建结果
npm run preview               # 预览 dist/，先关闭占用 4173 的 dev 服务
```

本项目同时支持用户主页根路径和普通仓库子路径，GitHub Actions 会自动配置发布地址。

手动检查用户主页路径：

```bash
SITE_URL=https://bighuang-eee.github.io npm run build
python3 scripts/check.py dist
npm run preview
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

## 简历自动同步

数据流：`CV/Huang-Xiwen-CV.pdf` → CV 仓库的同步 Action → 网站仓库 PDF 副本 → Pages 构建时从 PDF 生成可阅读 HTML → 网站。

- **本地预览**：`npm run dev` 每次收到 PDF 请求时读取相邻的 `../CV/Huang-Xiwen-CV.pdf`。更新本地 PDF 后，运行 `python3 scripts/render_cv.py ../CV/Huang-Xiwen-CV.pdf site/cv/index.html` 更新网页正文；PDF 下载无需重启服务。
- **构建**：`npm run build` 优先读取同一文件并写入 `dist/` 的两个 PDF 地址，同时从 PDF 提取文字生成适合窄屏的 CV 正文。如果相邻文件不存在（如 GitHub Actions），使用已同步到网站仓库的副本。构建需安装 Poppler 的 `pdftotext`（macOS：`brew install poppler`；GitHub Actions 自动安装）。
- **自定义位置**：可通过 `CV_SOURCE=/absolute/path/Huang-Xiwen-CV.pdf npm run build`（或 `npm run dev`）指定文件。显式指定的文件缺失或内容不是 PDF 时会报错，不会悄悄发布旧副本。
- **缓存**：构建自动为 PDF 链接添加基于文件内容的版本号，更新 PDF 后链接自动变化。
- **范围**：CV 页面正文和下载均来自同一份 PDF；其他页面的项目和新闻文案仍单独维护。新增或改名 PDF 中的大章节时，检查 `scripts/render_cv.py` 的识别结果。

### GitHub 一次性配置

1. 创建 fine-grained personal access token，仅选择 `BigHuang-EEE/bighuang-eee.github.io`，Repository permissions → **Contents: Read and write**；不需要给它私有 CV 仓库的读取权限。
2. 在 **CV 仓库** Settings → Secrets and variables → Actions 中添加名为 `WEBSITE_SYNC_TOKEN` 的 repository secret，值为上述 token。不要把 token 写进文件或提交到 Git。
3. 提交并推送本网站的改动，以及 CV 仓库的 `.github/workflows/sync-website.yml`。首次也可在 CV 仓库 Actions → **Sync PDF to personal website** → **Run workflow** 手动同步。
4. 检查 CV 同步 Action 与网站 Pages Action 均成功。之后只需在 CV 仓库更新、提交并推送 PDF 到 `main`。发布完成后网站提供新文件，通常需要几分钟。

同步只复制 PDF；网站的 Pages 构建从 PDF 生成公开的网页正文。不复制私有仓库的 LaTeX 或其他文件。PDF 内容不变时不会重复提交。如果 token 过期、分支保护阻止直接推送或同步失败，网站会继续提供上次成功发布的文件；在 CV 仓库 Actions 中查看报错，修复后重跑。请按 token 有效期更新 secret。

使用 personal access token 是为了跨仓库写入并触发网站的 push 部署；默认 `GITHUB_TOKEN` 无法完成这一链路。参见 [GitHub 官方说明](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)。
