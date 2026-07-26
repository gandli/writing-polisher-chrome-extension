<p align="center">
  <img src="./assets/readme/hero.svg" width="100%"
       alt="writing-polisher-extension — 纯浏览器端中文拼写纠错 Chrome 扩展，完全离线，ONNX Runtime Web">
</p>

[![Tests](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml/badge.svg)](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: WXT](https://img.shields.io/badge/Framework-WXT-646cff.svg)](https://wxt.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gandli/writing-polisher-extension/pulls)

---

## 它能做什么

在任意网页的文本输入框中自动检测中文拼写错误，用红色波浪线标出，点击即可看到修正建议并一键替换。所有推理都在浏览器中完成，文字不会离开你的设备。

---

## Proof

> *扩展在网页文本框中自动检测错误、标注并弹出修正建议的演示。*

## 快速开始

```bash
# 安装依赖
npm install

# 构建扩展
npm run build

# 加载到 Chrome
# 1. 打开 chrome://extensions/
# 2. 开启开发者模式
# 3. 点击「加载已解压的扩展程序」
# 4. 选择 .output/chrome-mv3/ 目录
```

加载后，在任何网页的文本框中输入中文即可自动生效。

---

## 工作原理

1. **模型** —— 使用 [mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) 预训练 ONNX 模型
2. **推理** —— [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) 在浏览器中本地运行，无需后端服务
3. **检测** —— 分析可编辑文本区域，识别字符级拼写错误
4. **交互** —— CSS 红色波浪线高亮 + 点击弹出修正建议菜单

---

## 特性

| 特性 | 说明 |
|------|------|
| **完全离线** | 全部推理在浏览器本地完成，无需网络 |
| **隐私优先** | 文字不出浏览器，适合内网/企业环境 |
| **自动检测** | 支持任意网页的文本输入框 |
| **一键修正** | 红色波浪线标注，点击即弹出建议 |
| **自定义模型** | 可在选项页配置 ONNX 模型和词表 URL |
| **深色模式** | 自动适应浏览器浅色/深色主题 |

---

## 项目结构

```
writing-polisher-extension/
├── entrypoints/
│   ├── content/              # 注入页面的 Content Script
│   ├── options/              # 扩展选项页面
│   └── popup/                # 弹出工具栏
├── src/
│   ├── components/
│   │   └── CorrectorSettings.tsx
│   ├── utils/
│   │   ├── chinese-corrector.ts  # ONNX 推理包装
│   │   ├── dom.ts                # DOM 高亮操作
│   │   └── storage.ts            # Chrome 存储包装
│   └── types.ts              # TypeScript 类型定义
├── test/                     # 单元测试 (Vitest)
├── e2e/                      # E2E 测试 (Playwright)
├── assets/readme/            # README 资源
└── docs/                     # 完整架构文档
```

---

## 开发和测试

```bash
# 开发模式（热重载）
npm run dev

# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 构建生产版本
npm run build

# 打包 zip
npm run build:zip
```

---

## 发布

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 自动执行：测试 → 构建 → zip 打包 → 创建 Release。

---

## 技术栈

- **WXT** —— 浏览器扩展开发框架
- **React 18** —— UI 组件
- **TypeScript 5** —— 类型安全
- **ONNX Runtime Web** —— 浏览器端 ML 推理
- **Vitest + Playwright** —— 测试

---

## 致谢

- [pycorrector](https://github.com/shibing624/pycorrector) —— 中文文本纠正 NLP 项目
- [shibing624/mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) —— 预训练 ONNX 模型
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) —— 浏览器推理引擎
- [WXT](https://wxt.dev/) —— 扩展框架
- [browser-extension-skills](https://github.com/quangpl/browser-extension-skills) —— 开发者技能集

---

## 许可证

MIT License —— 详见 [LICENSE](LICENSE)。
