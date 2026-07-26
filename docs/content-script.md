# Content Script Documentation

## Overview

Content script is injected into every web page matching `<all_urls>`, runs in the **isolated world** (doesn't conflict with page JavaScript).

## Entrypoint

**File**: `entrypoints/content/content__all_urls.ts`

**Annotations**:
```javascript
// @on-browser-only
// @matches=<all_urls>
```

WXT automatically converts these annotations to the correct `content_scripts` entry in `manifest.json`.

## Responsibilities

1. **Initialization**
   - Load settings from `chrome.storage.local`
   - Initialize ONNX Runtime Web
   - Download and load model + vocabulary if not cached

2. **DOM Monitoring**
   - Find all editable elements (`contenteditable`, `<input>`, `<textarea>`)
   - Monitor DOM changes with `MutationObserver` for SPA navigation
   - Re-run correction when page content changes

3. **Correction Pipeline**
   ```
   Extract text → Tokenize → ONNX inference → Compare → Find errors → Apply highlights
   ```

4. **User Interaction**
   - Detect clicks on highlighted errors
   - Show popup menu with correction suggestions
   - Apply replacement when user clicks suggestion
   - Remove highlights and re-run correction

5. **Styling**
   - Inject CSS for red wavy underline highlighting
   - Inject CSS for popup menu
   - Respect `prefers-reduced-motion` media query to disable animations when user prefers

## Highlighting Algorithm

- For each error found, wrap the error text in a `<span class="writing-polisher-error">` with a red wavy text decoration
- Store original text and correction suggestions in `data-*` attributes
- Add click event listener to show popup

## SPA Navigation Support

- Observer tracks `location.href` changes
- When navigation detected, re-scan page and re-run correction
- Works with GitHub, Notion, Gmail, and other SPA sites

## Isolated World

Content script runs in isolated DOM world:
- Can access page DOM
- Cannot access JavaScript variables from the page
- Page JavaScript cannot access content script variables
- This provides security isolation and prevents conflicts

## CORS Considerations

- ONNX model must be hosted on a server that sends:
  ```
  Access-Control-Allow-Origin: *
  ```
- HuggingFace Hub and GitHub Release both support this
