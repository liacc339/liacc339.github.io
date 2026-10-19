# Lia Chen — Personal Website (v2)

这是一个适合 GitHub Pages 的**纯静态个人网站**，参考 Lain-Ego0 个人主页的栏目结构和个人档案感，但代码、文案与插画均重新制作。

## 本地预览

直接双击根目录的 `index.html`（建议用 Chrome 或 Edge 打开）。

## 发布到 GitHub Pages

1. 打开你已经创建的 `liacc339/liacc339.github.io` 公开仓库。
2. 上传**解压后的全部内容**到仓库根目录（注意不是整个 ZIP，也不要在根目录额外套一层 `lia-personal-site-v2` 文件夹）。
3. 确认仓库根目录可以直接看到 `index.html`、`assets/`、`projects/` 和 `notes/`。
4. 在仓库的 `Settings → Pages` 中选择 `Deploy from a branch`，分支 `main`，路径 `/(root)`，保存。
5. 等待 GitHub Pages 显示已发布，再访问 https://liacc339.github.io/ 。

## 你需要在正式公开前确认的信息

- 头像当前使用「L.」字母图形，没有使用你的个人照片。
- 项目被明确标记为「POC」或「方案研究」，没有虚构商业上线或数据指标。
- 两个 POC 的 GitHub 仓库当前为私有，因此本站**没有添加无法对外访问的私有代码链接**。
- 你可以提供公开可访问的 POC 演示地址，我再为每个项目增加「在线体验」按钮。
- 文章是适合继续编辑的**初稿**，不要误当成已经核实发布的专业文章。
- 联系方式未填入，确认你愿意公开的邮箱或社交账号后再添加。
- 网站完全不依赖第三方字体、JS 框架或图片 CDN，对中国大陆访问更友好；但 `github.io` 本身的稳定性仍需实际测试。

## 文件用途

- `index.html` — 个人主页及所有栏目
- `assets/style.css` — 页面样式，包含移动端和深浅色模式
- `assets/main.js` — 深浅色切换和年份自动更新
- `projects/*.html` — 项目详情文章
- `notes/*.html` — AI / 业务分析笔记

若你要更换名称或文案，直接编辑对应 HTML 文件（UTF-8）。更新后重新上传到 GitHub，网站会自动重新部署。
