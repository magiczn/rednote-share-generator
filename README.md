# ✨ newapp - 待办清单 (Todo List)

一个界面精美、交互流畅的个人待办清单网页应用。

![Screenshot](https://via.placeholder.com/800x450.png?text=newapp+Preview)

## 🌟 特性

- **高颜值界面**：采用毛玻璃效果 (Backdrop Filter) 和 动态渐变背景。
- **重要度分级**：支持标记任务为“重要”，并有明显的视觉区分。
- **本地存储**：任务自动保存至浏览器的 `localStorage`，刷新页面不丢失。
- **响应式设计**：完美适配手机、平板及电脑屏幕。
- **自动化部署**：通过 GitHub Actions 自动部署至 GitHub Pages。

## 🚀 快速开始

### 本地运行
由于本项目是纯前端静态应用，你只需克隆仓库并在浏览器中打开 `index.html` 即可运行：

```bash
git clone https://github.com/magiczn/newapp.git
cd newapp
open index.html
```

## 🛠 部署指南

本项目已配置 GitHub Actions 自动部署流程。

### 自动化部署步骤
1. 将代码推送到 GitHub 仓库的 `main` 分支。
2. 转到仓库的 **Settings > Pages**。
3. 在 **Build and deployment > Source** 中选择 **GitHub Actions**。
4. 每次代码推送后，GitHub Actions 会自动构建并发布。

### 环境变量配置 (可选)
如果后续需要扩展服务端功能，请参考以下配置：
- 在 GitHub 仓库的 **Settings > Secrets and variables > Actions** 中添加变量。
- 模板请参考环境参数说明。

## 📄 许可证
[MIT](LICENSE)
