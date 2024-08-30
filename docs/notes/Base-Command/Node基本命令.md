---
title: Node基本命令
author: GaoJ
createTime: 2024/08/30 10:22:34
permalink: /Base-Command/e4p9obpq/
---

## 1. 安装 Node.js 和 npm

```bash
node -v  # 查看 Node.js 版本
npm -v   # 查看 npm 版本
```

## 2. 运行 JavaScript 文件

```bash
node app.js
```

## 3. npm 初始化项目
使用 npm init 命令可以初始化一个新的 Node.js 项目，这将创建一个 package.json 文件，用于管理项目的元数据和依赖。
```bash
npm init  # 逐步提示输入项目信息
npm init -y  # 使用默认配置快速初始化项目
```

## 4. 安装依赖包

使用 npm install 命令可以安装项目所需的依赖包。你可以指定包名来安装特定的包。
```bash
npm install package-name  # 安装某个依赖包并添加到 dependencies
npm install --save-dev package-name  # 安装开发依赖并添加到 devDependencies
npm install  # 安装 package.json 文件中列出的所有依赖包
```

## 5. 卸载依赖包

如果需要移除某个已安装的包，可以使用 npm uninstall 命令。
```bash
npm uninstall package-name  #  卸载某个依赖包
npm uninstall --save-dev package-name  # 卸载开发依赖包
```

## 6. 更新依赖包

更新依赖包
```bash
npm update  # 更新项目中所有依赖包
npm update package-name  # 更新特定依赖包
```

## 7. 查看全局安装的包

npm list -g 可以查看全局安装的所有包。
```bash
npm list -g --depth=0  # 只显示全局安装包的列表
```

## 8. 全局安装或卸载包

有时你可能需要在系统范围内安装或卸载某些工具包，如 nodemon 或 http-server。
```bash
npm install -g package-name  # Install a package globally
npm uninstall -g package-name  # Uninstall a package globally
```

## 查看npm镜像
```bash
# 查看当前 npm 镜像源
npm config get registry

#切换 npm 镜像源
#淘宝镜像：https://registry.npmmirror.com/（适合国内用户，速度更快）
npm config set registry https://registry.npmmirror.com/

#查看所有 npm 配置
npm config list
```