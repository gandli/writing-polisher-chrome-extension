# Background Service Worker

## Overview

This extension **does not use a persistent background service worker** for core functionality. Everything runs in the content script when needed.

## Why no background?

- The ONNX model runs in the content script (in-page) where it has access to the DOM
- Lazy loading model on first use is more memory efficient
- No persistent background process = lower memory usage

## When would we need a background?

- If we added:
  - Keyboard shortcuts
  - Context menu integration
  - Background sync of custom models
  - Browser action badge updates

we would add a service worker. Currently, none of these are needed.

## Current Background Usage

- None needed, WXT automatically handles extension lifecycle
- Settings changes are communicated via `chrome.runtime.onMessage` from options page to content script
