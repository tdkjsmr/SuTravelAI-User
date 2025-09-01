# 江苏旅游大模型助手

# SuTravelAI-Node

## 前言

这是一款通过调用通义千问和 deepseek-r1 大模型 api 实现的智能旅游助手，该仓库为前端部分。

前端基于 vue 开发。

## 说明

该项目为本科毕业设计，代码存在不成熟或繁复的现象，请见谅。

后端地址传送门：[SuTravelAI-Node](https://github.com/tdkjsmr/SuTravelAI-Node)

### 技术（前端部分）

- Vue
- ElementUI
- lodash
- Vue-router
- axios

### 需要做的

- 需要 Node 环境
- 在 request.ts 文件中修改你的密钥和静态文件存储地址

### 能做到的

- 用户通过对话框输入内容向旅游助手提问，旅游助手会进行回复，包括旅游路线制定、景点推荐
- 用户自行选择使用通义千问模型或者 DeepSeek-R1 模型，通义千问侧重工具调用回复，DeepSeek 侧重深度思考
- 用户提问后 AI 返回真实有效的火车票信息或天气信息
- 用户使用绘制模块生成各种风格的画作
- 用户输入聊天信息后，AI 会在回复的下方推荐相关旅游广告

## 运行

```
  git clone https://github.com/tdkjsmr/SuTravelAI-User
  cd SuTravelAI-User
  npm install
```

在确认后端启动后

```
  npm run dev
```

项目运行在(http://127.0.0.1:5173)
