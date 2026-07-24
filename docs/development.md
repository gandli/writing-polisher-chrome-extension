# 开发手册

本文档供扩展开发者参考，介绍项目结构、核心逻辑和开发流程。

## 项目结构

```
.
├── entrypoints/
│   ├── background.ts    # 后台服务，监听右键菜单等
│   ├── content.tsx      # 内容脚本，注入到网页，处理标记和弹窗
│   ├── popup.html       # 弹出窗口HTML
│   ├── popup.tsx        # 弹出窗口逻辑
│   ├── options.html     # 选项页HTML
│   └── options.tsx      # 选项页逻辑（词典/法条管理）
├── src/
│   ├── data/
│   │   ├── dictionary.json   # 内置转换词典
│   │   └── laws.json         # 内置法条库
│   ├── utils/
│   │   ├── dictionary.ts     # 词典加载、合并、查询
│   │   ├── matcher.ts        # 文本匹配算法
│   │   ├── laws.ts           # 法条加载、查询
│   │   ├── storage.ts        # chrome.storage 封装
│   │   └── dom.ts            # DOM操作（标记、弹窗）
│   ├── components/
│   │   ├── PopupCard.tsx     # 弹窗组件
│   │   ├── DictionaryManager.tsx  # 词典管理组件
│   │   └── LawsManager.tsx       # 法条管理组件
│   └── types.ts              # TypeScript 类型定义
├── docs/
│   ├── design.md             # 需求设计
│   ├── dictionary-guide.md   # 词典制作指南
│   ├── laws-guide.md         # 法条整理指南
│   └── development.md        # 开发手册（本文档）
├── public/                   # 静态资源
├── wxt.config.ts             # WXT 配置
├── tailwind.config.js        # Tailwind CSS 配置
└── package.json
```

## 核心模块说明

### 1. 词典模块 (`src/utils/dictionary.ts`)

负责：
- 加载内置词典
- 从存储加载用户自定义词典
- 合并词典（自定义覆盖内置）
- 获取所有词条列表

### 2. 匹配模块 (`src/utils/matcher.ts`)

负责：
- 将所有关键词按长度降序排序
- 在文本中查找所有匹配项
- 去重和避免重叠匹配
- 返回匹配位置列表供高亮使用

### 3. 法条模块 (`src/utils/laws.ts`)

负责：
- 加载内置法条
- 加载用户自定义法条
- 合并法条
- 文本中识别法条引用
- 根据名称和条款查询内容

### 4. DOM模块 (`src/utils/dom.ts`)

负责：
- 在可编辑区域遍历文本节点
- 给匹配到的文本包裹高亮标记标签
- 创建和管理弹窗气泡
- 处理文本替换

### 5. 存储模块 (`src/utils/storage.ts`)

封装 `chrome.storage.local`，提供：
- 读取自定义词典
- 保存自定义词典
- 读取自定义法条
- 保存自定义法条
- 读取扩展设置（是否开启实时检测）

## 数据类型

```typescript
// 词典词条
interface DictionaryEntry {
  colloquial: string;
  formal: string;
  isCustom: boolean; // 是否是用户自定义
}

// 法条
interface LawEntry {
  name: string;
  article: string;
  content: string;
  isCustom: boolean;
}

// 匹配结果
interface MatchResult {
  text: string;
  replacement: string;
  start: number;
  end: number;
  type: 'dictionary' | 'law';
}
```

## 开发流程

### 本地开发

```bash
npm run dev
```

然后在 Chrome 中加载解压的扩展：`chrome://extensions/` → 加载已解压的扩展 → 选择 `.output/chrome-mv3-dev`

修改代码后会自动热重载，浏览器中就能看到变化。

### 构建生产版本

```bash
npm run build
```

产物在 `.output/chrome-mv3-prod` 目录。

### 打包为 ZIP

```bash
npm run zip
```

产物在 `.output/writing-polisher-chrome-extension-<version>.zip`，可以直接上传到 Chrome 应用商店，或者手动分发安装。

## 权限说明

扩展需要的权限：

- `activeTab`：访问当前标签页内容
- `storage`：存储用户自定义词典和法条
- `contextMenus`：右键菜单支持（可选，用于全选转换等）

所有权限都只在本地使用，不会向外发送任何数据。

## 调试技巧

1. **内容脚本调试**：打开网页开发者工具 → Console，查看 content script 输出
2. **后台调试**：`chrome://extensions/` → 详情 → 查看视图（背景页）
3. **存储查看**：开发者工具 → Application → Local Storage → chrome-extension://...

## MV3 注意事项

- 使用 `chrome.action` 代替 `chrome.browserAction`
- 后台使用 service worker
- 权限声明遵循 Chrome MV3 规范

## 发布

1. 构建并打包 ZIP 文件
2. 上传到 Chrome Web Store 开发者后台
3. 审核通过后用户可以安装

对于企业内网使用，可以直接分发 ZIP，用户手动加载解压后的扩展即可。
