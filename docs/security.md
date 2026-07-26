# Security Design

## Overview

This extension is designed with privacy and security as top priorities. The core design principle is: **all processing happens locally, no text leaves the browser**.

## Security Principles

### 1. Privacy First

- ✅ No telemetry
- ✅ No analytics
- ✅ No data collection
- ✅ No text is ever sent to any server
- ✅ Model is downloaded on-demand and cached locally
- ✅ ONNX inference runs entirely in the browser

### 2. Least Privilege

- Only two permissions: `storage` + `<all_urls>`
- `storage` only for storing user configuration
- `<all_urls>` only to inject content script for correction on any page
- No access to tabs, history, cookies, or browsing data
- No network access except to download the ONNX model (user configurable)

### 3. Content Security Policy (CSP)

Manifest includes strict CSP for extension pages:

```
extension_pages: script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; img-src https: data:;
```

- `script-src 'self'` → only scripts from this extension can run
- `object-src 'none'` → no plugins allowed
- `img-src https: data:` → only images from HTTPS or data URIs
- Prevents XSS and injection of unauthorized code

### 4. Isolation

- Content script runs in Chrome's **isolated world**
- Cannot access or interfere with page JavaScript
- Page JavaScript cannot access content script variables
- Prevents conflicts and malicious interference

### 5. Dependency Management

- Minimal dependencies
- Dependencies are regularly updated
- Only trusted open-source projects: ONNX Runtime Web, WXT, React
- Runtime dependencies:
  - `onnxruntime-web` - Microsoft-maintained ONNX inference
  - `react` - Meta-maintained UI library
  - `wxt` - Well-maintained extension framework

### Threat Model

| Threat | Mitigation |
|--------|------------|
| XSS injection | Strict CSP, isolated world |
| Data exfiltration | All inference local, no transmission |
| Unauthorized permission | Least privilege, only required permissions |
| Third-party tracking | No third-party tracking, no analytics |
| Model tampering | User can verify model URL, use own model |

### Enterprise Intranet Compatibility

- Works completely offline after model is cached
- No mandatory outbound connections
- Users can host model on internal intranet
- Configure model URL in extension options to use internal model

## Security Audits

This extension has undergone full code quality audit:

- ✅ No hard-coded secrets or API keys
- ✅ No eval() or dynamic code execution
- ✅ No unsafe CORS practices
- ✅ All dependencies have known good versions
- ✅ TypeScript type safety prevents common bugs

## Reporting Security Issues

If you discover a security vulnerability, please open an issue at:
https://github.com/gandli/writing-polisher-extension/issues
