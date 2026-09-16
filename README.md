# 学术个人网站复刻

已完整保存 [Chengle Fan 原网站](https://chengle-fan.github.io/) 的公开静态页面、样式、脚本、照片、研究配图与简历 PDF。来源是原站公开仓库的 `gh-pages` 发布分支，采集日期为 2026-09-16；不是重新猜测外观制作的页面。

默认项目是 **HTML + CSS + JavaScript 静态网站**，无需安装 Ruby、Jekyll 或 npm 依赖。保留原站的移动端布局、深色／浅色／跟随系统主题、图片放大、数学公式、返回顶部和导航脚本。字体与第三方库仍使用原站的 CDN，需要联网；尚未进行浏览器交互与像素截图测试。

## 1. 在电脑上预览

在终端执行（需要 Node.js 22 或更高版本，本机已具备）：

```bash
cd "/Users/bighuang/Downloads/Resume/Personal Website"
npm run dev
```

浏览器打开 **http://localhost:4173/**。修改 `site/` 中的文件后刷新页面即可。按 `Control+C` 停止服务。

不需要执行 `npm install`。不要直接双击 HTML 文件，因为原站资源使用以 `/` 开头的路径，需要通过本地服务器加载。

其他命令：

```bash
npm run check                 # 检查源文件的站内链接、资源和锚点（需要 Python 3）
npm run build                 # 生成可发布的 dist/ 文件夹
python3 scripts/check.py dist # 检查发布文件
npm run preview               # 预览 dist/；先停止占用 4173 的 dev 服务
```

## 2. 创建 GitHub 仓库

打开 <https://github.com/new>，登录你的 GitHub 账号。

1. **Owner**：选择你的账号。
2. **Repository name**：推荐填写 `你的用户名.github.io`。例如账号是 `xiaoming`，仓库名称就是 `xiaoming.github.io`，最终地址为 `https://xiaoming.github.io/`。
3. **Visibility**：选择 **Public**。
4. **不要初始化 README、.gitignore 或 License**，因为本地已准备好这些文件。
5. 点击 **Create repository**。

也可以取普通名称，例如 `personal-website`，最终地址则是 `https://你的用户名.github.io/personal-website/`。本项目的发布流程会自动处理这两类地址。

注意：这里的“用户名”是 GitHub 账号名，不一定是个人主页上的显示姓名。

## 3. 把工作空间上传到仓库

本地尚未初始化 Git 仓库，也没有替你创建远程仓库。将下面地址中的 `YOUR_USERNAME` 和 `YOUR_REPO` 换成刚创建的账号名与仓库名，再逐行执行：

```bash
cd "/Users/bighuang/Downloads/Resume/Personal Website"
git init -b main
git add .
git commit -m "Initial website replica"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

如果 `git commit` 提示未设置身份，先执行以下命令（只影响这个仓库），然后重新提交：

```bash
git config user.name "你的名字"
git config user.email "你的 GitHub 邮箱或 noreply 邮箱"
```

GitHub 的 HTTPS 推送不能使用账号密码。按系统提示使用已有 GitHub 凭据、个人访问令牌，或在安装了 GitHub CLI 时先运行 `gh auth login`，选择 GitHub.com、HTTPS 和浏览器登录。不要把令牌写进项目文件或远程地址。

## 4. 启用 GitHub Pages

1. 打开刚创建的仓库，进入 **Settings → Pages**。
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
3. 进入 **Actions**，选择 **Deploy website to GitHub Pages**。
4. 如果第一次推送发生在启用 Pages 之前导致失败，点击 **Run workflow → main → Run workflow**，或打开失败运行点击 **Re-run all jobs**。
5. 等待流程成功，在 **Settings → Pages** 或部署结果中打开网站地址。

已配置好的 `.github/workflows/pages.yml` 会构建、检查并发布 `dist/`。后续向 `main` 推送修改即自动更新。无需选择 `gh-pages` 分支，也无需 Jekyll 构建。

发布时流程自动获取你的实际域名和仓库子路径，并修正导航、图片、规范链接、站点地图。`site.config.json` 可以保持默认，不必手动填写用户名。

官方参考：[新建仓库](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)、[Pages 快速入门](https://docs.github.com/en/pages/quickstart)、[自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 5. 换成自己的内容

目前忠实保留了 Chengle Fan 的姓名、简介、照片、邮箱、论文与简历。用于你自己的个人主页时，请将这些内容换成你自己的资料。

| 要修改什么 | 文件位置 |
| --- | --- |
| 首页、自我介绍、研究兴趣、近期动态摘要 | `site/index.html` |
| 研究项目列表 | `site/projects/index.html` |
| 6 个研究项目详情 | `site/projects/各项目目录/index.html` |
| 论文列表 | `site/publications/index.html` |
| 简历页面 | `site/cv/index.html` |
| 简历 PDF | `site/assets/pdf/CV_general.pdf` |
| 动态列表及详情 | `site/news/` |
| 头像 | `site/assets/img/prof_pic.jpg` |
| 研究配图 | `site/assets/img/projects/` |
| 样式、布局、响应式与主题颜色 | `site/assets/css/main.css` |
| 主题切换 | `site/assets/js/theme.js` |
| 移动端导航 | `site/assets/js/nav-toggle.js` |

编辑 HTML 时，可先使用编辑器的“格式化文档”功能，方便阅读。姓名、邮箱、页脚和导航出现在多个页面，修改时在 `site/` 范围全局搜索替换；首页与动态列表中的摘要也需要同步修改。新增页面后同步维护 `site/sitemap.xml`。

请编辑 `site/`，**不要编辑 `dist/`**，后者每次构建都会重新生成。

修改后上传：

```bash
npm run check
npm run build
git add .
git commit -m "Update my profile"
git push
```

## 6. 文件结构与原始源码

```text
site/                          可编辑的完整静态网站（15 个 HTML 页面）
scripts/build.mjs              构建与部署路径转换
scripts/serve.mjs              本地预览服务
scripts/check.py               本地链接、资源、锚点检查
.github/workflows/pages.yml    GitHub Pages 自动部署
site.config.json               手动构建时的地址配置
reference/original-jekyll-source.zip  上游 main 分支的完整 Jekyll 源码
SOURCE.md                      来源、版本与复刻差异
LICENSE                        原项目 MIT 许可证
dist/                          构建结果，不提交 Git
```

如果将来需要用 Markdown、YAML、BibTeX 管理内容，可以把 `reference/original-jekyll-source.zip` 解压到**另一个文件夹**，按原项目的 `HOW_TO_UPDATE.md` 编辑 `_pages/`、`_projects/`、`_data/` 等，并配置其 Ruby/Jekyll 构建环境。压缩包中的原始工作流、域名和统计配置是原作者的快照，不能原样作为你的发布配置。

压缩包仅用于保留原始源码，**当前构建不会读取它，也不会与 `site/` 自动同步**。如需将来切换到 Jekyll 工作流，应完整切换维护方式，避免同时编辑两套文件。

## 7. 可选：手动构建其他域名或子路径

例如：

```bash
SITE_URL=https://example.github.io/personal-website BASE_PATH=/personal-website npm run build
python3 scripts/check.py dist /personal-website
BASE_PATH=/personal-website npm run preview
```

打开 `http://localhost:4173/personal-website/`。若使用自己的根域名，`SITE_URL` 填域名，`BASE_PATH` 留空。也可以在 `site.config.json` 设置 `siteUrl`；完整 URL 中的路径会自动作为基础路径。

## 常见问题

- **端口占用**：先关闭已有预览，或运行 `PORT=4174 npm run dev` 后访问相应端口。
- **样式或图标不完整**：先通过本地服务器访问，确保网络能访问 jsDelivr 和 Google Fonts。
- **网站返回 404**：确认 Pages 来源是 GitHub Actions，Actions 的最新运行已成功，访问的是仓库对应的完整地址。
- **推送提示 remote origin 已存在**：先运行 `git remote -v` 检查，不要重复执行 `git init` 或 `git remote add`。
- **第一次推送被拒绝**：确认 GitHub 上创建的是空仓库，不要使用 `git push --force` 覆盖未知内容。
