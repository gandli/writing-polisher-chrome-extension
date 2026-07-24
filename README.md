# Writing Polisher Chrome Extension

> 浏览器扩展：将口语化表达转换为专业书面法律文书表达，支持离线使用，内置词典转换和法条查询。

## 功能特性

- ✨ **自动标记**：输入时自动识别口语化表达，下划线高亮提示
- 🔄 **一键替换**：点击标记文本，弹窗显示建议替换，选择是否替换
- 📖 **法条查询**：自动识别文中的法条引用，点击查看完整条款内容
- 📝 **自定义词典**：支持用户添加/删除自定义转换词条
- 📚 **自定义法条**：支持用户添加/删除自定义法条
- 📤 **导出导入**：支持词典和法条的导出导入，方便团队共享
- 🔌 **完全离线**：所有数据本地存储，不联网，不上传，适合企业内网使用
- 🎯 **精确匹配**：长句优先匹配，避免短句拆分错误

## 项目结构

```
writing-polisher-chrome-extension/
├── entrypoints/
│   ├── background.ts    # 后台服务
│   ├── content.tsx      # 内容脚本（页面注入）
│   ├── popup.html       # 弹出窗口
│   ├── popup.tsx        # 弹出窗口逻辑
│   ├── options.html     # 选项页（词典/法条管理）
│   └── options.tsx      # 选项页逻辑
├── src/
│   ├── data/            # 内置数据
│   │   ├── dictionary.json   # 内置转换词典
│   │   └── laws.json         # 内置法条库
│   ├── hooks/           # React Hooks
│   ├── utils/           # 工具函数
│   │   ├── dictionary.ts # 词典加载和匹配
│   │   ├── matcher.ts    # 文本匹配逻辑
│   │   └── storage.ts    # 本地存储
│   └── components/      # React 组件
├── data/                # 文档相关数据
├── docs/                # 项目文档
├── public/              # 静态资源
└── wxt.config.ts        # WXT 配置
```

## 开发指南

### 环境要求

- Node.js 18+
- npm/yarn/pnpm/bun

### 开发运行

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 打包扩展 zip
npm run zip
```

### 加载到浏览器

1. 打开 Chrome 浏览器，进入 `chrome://extensions/`
2. 打开「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `.output/chrome-mv3-dev`（开发）或 `.output/chrome-mv3-prod`（生产）目录

## 使用文档

- [项目需求设计](./docs/design.md)
- [词典制作指南](./docs/dictionary-guide.md)
- [法条整理指南](./docs/laws-guide.md)
- [开发手册](./docs/development.md)

## 许可

MIT License
