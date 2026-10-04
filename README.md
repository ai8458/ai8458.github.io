# 灵感游乐场 · AI8458 的应用导览

在线地址：<https://ai8458.github.io/>。

为 AI8458 已上线的网页应用提供统一入口，包含真实预览图、分类、关键词搜索和随机探索。全部应用链接直接写入生成的 HTML，即使关闭 JavaScript 也能浏览和打开。页面适配手机、平板和电脑，支持键盘导航与减少动态效果偏好。

## 更新应用目录

1. 在 `apps.json` 中添加或编辑应用信息。`category` 对应文件中的分类，`keywords` 用于搜索。
2. 将应用预览图保存到 `assets/`，推荐 800×500 WebP。
3. 运行 `npm run build`，再运行 `npm run check`。
4. 将 `apps.json`、生成后的 `index.html` 和资源一起提交到 `main`。GitHub Pages 从分支根目录自动发布。

模板在 `index.template.html`；页面样式在 `style.css`；交互在 `app.js`。新增源码项目可以编辑模板中的“更多项目”区域。

## 本地预览

需要 Node.js 18 或更新版本，无需安装 npm 依赖。

```sh
npm run build
npm start
```

打开 <http://127.0.0.1:4190/>。

## 内容范围

收录六个已启用 GitHub Pages 的公开应用；未上线的两个公开项目仅提供 GitHub 源码链接。应用预览来自各自公开页面或同项目已有的画面，所有图片随本仓库提供。目录不依赖运行时 GitHub API、第三方 CDN、远程字体或统计服务。

此仓库只部署根路径导览页。各应用继续由各自项目仓库发布。
