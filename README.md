<p align="center">
  <img src="./assets/readme/hero.svg" width="100%"
       alt="writing-polisher-extension — Pure browser-side Chinese spelling correction Chrome extension, fully offline with ONNX Runtime Web">
</p>

[![Tests](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml/badge.svg)](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: WXT](https://img.shields.io/badge/Framework-WXT-646cff.svg)](https://wxt.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gandli/writing-polisher-extension/pulls)

---

## What it does

Automatically detects Chinese spelling errors in any editable text area on any web page. Errors are marked with a red wavy underline — click to see correction suggestions and apply with one click. All inference runs in your browser. No text ever leaves your device.

---

## Quick start

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Load into Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select .output/chrome-mv3/
```

Once loaded, type Chinese text in any web page input — it works automatically.

---

## How it works

1. **Model** — Uses the pre-trained [mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) ONNX model
2. **Inference** — [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) runs locally in the browser, no backend server needed
3. **Detection** — Analyzes editable text areas and identifies character-level spelling errors
4. **UI** — CSS red wavy underline highlighting + popup menu for one-click replacement

---

## Features

| Feature | Description |
|---------|-------------|
| **100% Offline** | All inference runs locally in-browser, no network required |
| **Privacy-first** | No text leaves your browser — ideal for intranets and enterprise |
| **Auto detection** | Works on any editable text area on any web page |
| **One-click fix** | Red wavy underline marks errors, click to see suggestions |
| **Custom model** | Configure your own ONNX model and vocabulary URLs in options |
| **Dark mode** | Automatically adapts to browser light/dark theme |

---

## Project structure

```
writing-polisher-extension/
├── entrypoints/
│   ├── content/              # Content script injected into pages
│   ├── options/              # Extension options page
│   └── popup/                # Popup toolbar
├── src/
│   ├── components/
│   │   └── CorrectorSettings.tsx
│   ├── utils/
│   │   ├── chinese-corrector.ts  # ONNX inference wrapper
│   │   ├── dom.ts                # DOM manipulation for highlighting
│   │   └── storage.ts            # Chrome storage wrapper
│   └── types.ts              # TypeScript type definitions
├── test/                     # Unit tests (Vitest)
├── e2e/                      # E2E tests (Playwright)
├── assets/readme/            # README assets
└── docs/                     # Architecture documentation
```

---

## Development

```bash
# Dev mode with hot reload
npm run dev

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Production build
npm run build

# Package as zip
npm run build:zip
```

---

## Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions automatically: test → build → zip → create Release.

---

## Tech stack

- **WXT** — Browser extension framework
- **React 18** — UI components
- **TypeScript 5** — Type safety
- **ONNX Runtime Web** — In-browser ML inference
- **Vitest + Playwright** — Testing

---

## Credits

- [pycorrector](https://github.com/shibing624/pycorrector) — Chinese text correction NLP project
- [shibing624/mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) — Pre-trained ONNX model
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) — Browser inference engine
- [WXT](https://wxt.dev/) — Extension framework
- [browser-extension-skills](https://github.com/quangpl/browser-extension-skills) — Development skillset

---

## License

MIT License — see [LICENSE](LICENSE).
