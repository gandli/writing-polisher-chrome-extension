# [1.0.0](https://github.com/gandli/writing-polisher-extension/compare/v0.0.3...v1.0.0) (2026-07-26)
# [1.0.0](https://github.com/gandli/writing-polisher-extension/compare/v0.0.3...v1.0.0) (2026-07-26)
# CHANGELOG

## v1.0.0 (2026-07-26)

### ✨ Features
- Initial release of pure browser-side Chinese spelling correction extension
- ONNX Runtime Web inference, completely offline
- Automatic error highlighting with red wavy underline
- One-click replacement via popup menu
- Custom model and vocabulary URL configuration in options page
- Privacy-first, no text leaves the browser
- Perfect for intranet/enterprise environments with strict privacy requirements
- Based on pre-trained [shibing624/mengzi-t5-base-chinese-correction-onnx](https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx) model

### 🧹 Code Refactoring
- Full code quality audit & cleanup
- Remove legacy dictionary and law conversion features, keep only spelling correction
- Fix all TypeScript errors and build issues
- Add comprehensive unit tests and E2E test framework

### 🔧 Bug Fixes
- Fix WXT content script entrypoint configuration
- Fix TypeScript type errors
- Fix CI configuration
- Add missing MIT LICENSE

### 📚 Documentation
- Add beautiful README with SVG hero
- Add GitHub Actions CI for tests
- Add CHANGELOG
- Add DEVELOPMENT guide
