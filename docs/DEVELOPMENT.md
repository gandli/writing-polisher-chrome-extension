# Development Guide

## Prerequisites

- Node.js 20+
- npm or yarn
- Google Chrome / Chromium

## Install Dependencies

```bash
npm install
```

## Development

Start development server with hot reload:

```bash
npm run dev
```

WXT will give you a local extension output directory that you can load into Chrome:

```
✔ Opening dev tools at: chrome://inspect/#devices
✔ Waiting for connection from devtools
```

## Build for Production

```bash
npm run build
```

Output is in `.output/chrome-mv3/`

## Package for Distribution

```bash
npm run build:zip
```

Output zip file can be uploaded to Chrome Web Store.

## Testing

### Unit Tests

```bash
npm run test
```

Uses [Vitest](https://vitest.dev/) for unit testing core utility functions.

### E2E Tests

```bash
npm run test:e2e
```

Uses [Playwright](https://playwright.dev/) for end-to-end testing.

## Project Structure

```
writing-polisher-extension/
├── .github/
│   └── workflows/
│       └── tests.yml            # GitHub Actions CI
├── entrypoints/
│   ├── content/
│   │   └── content__all_urls.ts    # Content script injected into all web pages
│   ├── options/
│   │   ├── index.html             # Options page HTML
│   │   └── index.tsx             # Options page entry
│   └── popup/
│       ├── index.html             # Popup HTML
│       └── index.tsx             # Popup entry
├── e2e/                          # Playwright E2E tests
├── src/
│   ├── components/
│   │   └── CorrectorSettings.tsx  # Settings page React component
│   ├── utils/
│   │   ├── chinese-corrector.ts   # ONNX Runtime Web inference wrapper
│   │   ├── dom.ts                 # DOM utilities for highlighting
│   │   └── storage.ts            # chrome.storage.local wrapper
│   └── types.ts                  # TypeScript type definitions
├── assets/
│   └── readme/
│       └── hero.svg              # README hero SVG image
├── test/                          # Vitest unit tests
├── docs/
│   ├── CHANGELOG.md              # Changelog
│   └── DEVELOPMENT.md           # This file
├── .gitignore
├── LICENSE                       # MIT License
├── README.md                     # Project README
├── package.json
├── playwright.config.ts            # Playwright E2E config
├── tsconfig.json
├── vitest.config.ts               # Vitest unit test config
└── wxt.config.ts                 # Wxt extension config
```

## Load Extension into Chrome

1. Build the extension: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Turn on **Developer mode**
4. Click **Load unpacked**
5. Select the `.output/chrome-mv3` directory
6. The extension is now loaded!

## Model

By default, the extension uses:
- Model URL: `https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/model.onnx`
- Vocabulary URL: `https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/vocab.txt`

You can change these URLs in the extension options page.

## Credits

- [pycorrector](https://github.com/shibing624/pycorrector) - Original NLP project for Chinese text correction
- [mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) - Pre-trained ONNX model
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) - Browser inference engine
- [WXT](https://wxt.dev/) - Browser extension development framework
