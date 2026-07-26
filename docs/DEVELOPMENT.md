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
│       ├── tests.yml             # GitHub Actions CI
│       └── release-please.yml     # Automated changelog and releases
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
├── LICENSE                       # MIT License
├── README.md                     # Project README
├── package.json
├── playwright.config.ts           # Playwright E2E config
├── tsconfig.json
├── vitest.config.ts               # Vitest unit test config
└── wxt.config.ts                # Wxt extension config
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

## Getting the ONNX Model

To convert your own PyTorch model to ONNX format:

1. Clone the original pycorrector project:
```bash
git clone https://github.com/shibing624/pycorrector.git
cd pycorrector
```

2. Follow the instructions in [pycorrector](https://github.com/shibing624/pycorrector) to export the model to ONNX:
```python
# Use optimum/onnxruntime to export the model
from optimum.onnxruntime import ORTModelForSeq2SeqLM
from transformers import AutoTokenizer

model = ORTModelForSeq2SeqLM.from_pretrained("shibing624/mengzi-t5-base-chinese-correction", export=True)
tokenizer = AutoTokenizer.from_pretrained("shibing624/mengzi-t5-base-chinese-correction")

model.save_pretrained("./onnx")
tokenizer.save_pretrained("./onnx")
```

3. Upload the exported `model.onnx` and `vocab.txt` to your preferred hosting (HuggingFace Hub, GitHub Release, etc.)
4. Update the model URL in extension options

## CI Status

[![Tests](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml/badge.svg)](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Common Issues

### Build fails with "Entrypoint content not found"

Make sure the content script entrypoint follows WXT conventions:
- File naming: `entrypoints/content/content__all_urls.ts`
- Add `// @on-browser-only` and `// @matches=<all_urls>` at the top of the file

### ONNX model doesn't load

Check:
- Model URL is accessible (CORS headers must allow `access-control-allow-origin: *`)
- Model format is ONNX opset compatible with ONNX Runtime Web
- Model size is reasonable for browser loading

### Why is this extension 150KB after gzip?

The ONNX model is downloaded on-demand from HuggingFace Hub when the extension is first used, not bundled with the extension. This keeps the extension size small.

## Credits

- [pycorrector](https://github.com/shibing624/pycorrector) - Original NLP project for Chinese text correction
- [mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) - Pre-trained ONNX model
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) - Browser inference engine
- [WXT](https://wxt.dev/) - Browser extension development framework
