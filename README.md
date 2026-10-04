# AI8458 应用目录

在线地址：<https://ai8458.github.io/>。

简洁的应用与项目入口，按游戏、创作、学习、源码分组。支持名称和功能搜索，所有链接直接写入 HTML，关闭 JavaScript 后仍可浏览。适配手机与电脑，无远程字体、外部依赖或统计服务。

## 更新目录

1. 编辑 `apps.json`，添加名称、简短用途、分类、链接和搜索关键词。
2. 运行 `npm run build`，再运行 `npm run check`。
3. 将更新后的文件和生成的 `index.html` 提交到 `main`，GitHub Pages 自动发布。

`index.template.html` 是页面模板；`style.css` 是样式；`app.js` 负责搜索筛选。

## 本地运行

需要 Node.js 18 或更新版本，无需安装 npm 依赖。

```sh
npm run build
npm start
```

打开 <http://127.0.0.1:4190/>。各应用由自己的项目仓库独立发布。
