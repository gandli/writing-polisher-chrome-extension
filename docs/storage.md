# Storage Design

## Overview

User configuration is stored in `chrome.storage.local`, which persists across browser restarts.

## Storage Schema

```typescript
interface StorageData {
  enabled: boolean;        // Enable spelling correction
  modelUrl: string;        // ONNX model URL
  vocabUrl: string;        // Vocabulary file URL
}
```

## Default Values

```javascript
{
  enabled: true,
  modelUrl: "https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/model.onnx",
  vocabUrl: "https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/vocab.txt"
}
```

## API

**File**: `src/utils/storage.ts`

```typescript
// Getters
export function getEnabled(): Promise<boolean>;
export function getModelUrl(): Promise<string>;
export function getVocabUrl(): Promise<string>;

// Setters
export function setEnabled(enabled: boolean): Promise<void>;
export function setModelUrl(url: string): Promise<void>;
export function setVocabUrl(url: string): Promise<void>;

// Defaults
export const defaultStorageData: StorageData;
```

## Caching

Settings are cached in memory after first load to avoid async storage overhead. Cache is invalidated when new settings are saved.

## Storage vs LocalStorage

Why `chrome.storage.local` instead of `localStorage`:

- `chrome.storage.local` is synced across devices if user is signed into Chrome
- Higher storage quota (can cache model if needed in future)
- Accessible from content script, options page, and any extension context
- More secure for extension configuration

## Privacy

All data is stored locally on the user's device. No data is uploaded or synced to any cloud except what Chrome itself does for sync.
