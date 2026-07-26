# writing-polisher-extension

![writing-polisher-extension](./assets/readme/hero.svg)

> Pure browser-side Chinese spelling correction, powered by ONNX Runtime Web. Completely offline, no text leaves your browser.

[![Tests](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml/badge.svg)](https://github.com/gandli/writing-polisher-extension/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: WXT](https://img.shields.io/badge/Framework-WXT-646cff.svg)](https://wxt.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gandli/writing-polisher-extension/pulls)

## Features

- ✨ **Automatic Spelling Correction**: Detects Chinese spelling errors in editable text areas on any web page
- 🔴 **Red Underline Highlighting**: Visually marks potential spelling mistakes
- 🔄 **One-click Replacement**: Click the error to see suggested corrections and apply with one click
- ⚙️ **Custom Model Support**: Configure your own ONNX model and vocabulary URLs in extension options
- 🌓 **Dark Mode Support**: Automatically adapts to browser light/dark theme
- 🔌 **100% Offline**: All inference runs locally in your browser, no text is uploaded to any server
- 🛡️ **Privacy-first**: Perfect for intranet/enterprise environments with strict data privacy requirements
- 🧠 **Powered by pycorrector**: Uses pre-trained [shibing624/mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) model

## Installation

### From Chrome Web Store
*Coming soon*

### Load unpacked (development)

1. **Clone the repository**
```bash
git clone https://github.com/gandli/writing-polisher-extension.git
cd writing-polisher-extension
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the extension**
```bash
npm run build
```

4. **Load into Chrome**
   1. Open Chrome and go to `chrome://extensions/`
   2. Turn on **Developer mode**
   3. Click **Load unpacked**
   4. Select the `.output/chrome-mv3` directory

## Usage

1. After installation, the extension is enabled by default
2. Navigate to any web page with editable text areas
3. Type or paste Chinese text containing spelling errors
4. Errors will be automatically highlighted with a red wavy underline
5. Click on the highlighted error to see correction suggestions
6. Click a suggestion to replace the error

## Testing

### Unit tests
```bash
npm run test
```

### E2E tests
```bash
npm run test:e2e
```

## Project Structure

```
writing-polisher-extension/
├── entrypoints/
│   ├── content/            # Content script injected into pages
│   ├── options/            # Extension options page
│   └── popup/              # Popup toolbar
├── e2e/                    # Playwright E2E tests
├── src/
│   ├── components/         # React components
│   │   └── CorrectorSettings.tsx
│   ├── utils/
│   │   ├── chinese-corrector.ts  # ONNX inference wrapper
│   │   ├── dom.ts               # DOM manipulation for highlighting
│   │   └── storage.ts           # Chrome storage wrapper
│   └── types.ts            # TypeScript type definitions
├── assets/
│   └── readme/             # README assets
├── test/                   # Vitest unit tests
└── wxt.config.ts           # WXT configuration
```

## How it works

1. **Model**: Uses the ONNX version of [mengzi-t5-base-chinese-correction](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction) from pycorrector project
2. **Inference**: Runs entirely in the browser using [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/), no backend server required
3. **Detection**: Analyzes text in editable content, identifies potential character-level spelling errors
4. **User Interface**: Highlights errors with CSS, provides a popup menu for one-click replacement

## Default Model

The extension defaults to:
- Model URL: `https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/model.onnx`
- Vocabulary URL: `https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/vocab.txt`

You can change these in the extension options page to use your own fine-tuned model.

## Development

```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build for production
npm run build

# Zip for distribution
npm run build:zip
```

## Credits

- [pycorrector](https://github.com/shibing624/pycorrector) - Original NLP project for Chinese text correction
- [shibing624/mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) - Pre-trained ONNX model
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) - Browser inference engine
- [WXT](https://wxt.dev/) - Browser extension development framework

## License

MIT License - see [LICENSE](LICENSE) for details.
