# Architecture Design

## Overview

`writing-polisher-extension` is a pure browser-side Chrome extension that provides Chinese spelling correction using ONNX Runtime Web for local inference.

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Page (Browser)                       │
│  ┌─────────────┐                                            │
│  │  Content    │  Detects editable text areas, analyzes    │
│  │   Script    │  text with ONNX model, highlights errors  │
│  └─────────────┘  provides popup menu for replacements    │
└─────────────────────────────────────────────────────────────┘
         ↑
         │  DOM + ONNX Runtime Web (in-page)
         ↓
┌─────────────────────────────────────────────────────────────┐
│                   ONNX Model (Remote)                        │
│  Downloaded on-demand, cached by browser                    │
└─────────────────────────────────────────────────────────────┘

All processing happens **locally in the browser**. No text is sent to any remote server.
```

## High-level Architecture

1. **Content Script**: Injected into all web pages, runs in the isolated world
   - Scans for editable text areas
   - Monitors text input changes
   - Runs spelling correction inference
   - Highlights errors with CSS
   - Shows popup menu when user clicks error
   - Handles replacement when user selects suggestion

2. **React Components**: Settings UI in options page and popup
   - Allows configuration of model URL and vocabulary URL
   - Toggle extension on/off
   - Persists settings to `chrome.storage.local`

3. **ONNX Runtime Web**: Runs the pre-trained T5 model in the browser
   - Downloads model on first use
   - Caches model in memory
   - Performs inference locally

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| **No backend required** | Complete offline, privacy-first for enterprise intranets |
| **Model downloaded on demand** | Keeps extension size small (~150KB gzipped) |
| **Character-level detection** | Works for Chinese spelling errors (音似/形似错字) |
| **WXT framework** | Modern extension development with hot reload |
| **TypeScript** | Type safety, better maintainability |

## Data Flow

```
User types text in editable area
    ↓
Mutation observer detects change
    ↓
Extract text from editable area
    ↓
Run ONNX inference to get corrected text
    ↓
Compare original vs corrected, find error positions
    ↓
Highlight errors with red wavy underline
    ↓
User clicks highlighted error
    ↓
Show popup with correction suggestions
    ↓
User selects suggestion → replace text
    ↓
Remove highlights, re-run correction
```

## Technology Stack

- **Framework**: WXT 0.20+ (Chrome Extension development)
- **UI**: React 18 + TypeScript
- **Inference**: ONNX Runtime Web 1.27+
- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **CI**: GitHub Actions

## Memory Model

- Model is loaded once when first correction runs, cached in module scope
- Settings are loaded from `chrome.storage.local` on startup, cached in memory
- Highlights are stored as DOM elements with data attributes, no in-memory cache needed

## Security Model

- Content script runs in isolated world, doesn't interfere with page JavaScript
- CSP (Content Security Policy) is configured to allow loading ONNX model from trusted origins
- No remote code execution, all code is bundled with the extension
- All user text stays in the browser, no network transmission
