# API Documentation

## Public Modules

### `src/utils/chinese-corrector.ts`

ONNX inference wrapper for Chinese spelling correction.

```typescript
export interface CorrectionMatch {
  text: string;
  replacement: string;
  start: number;
  end: number;
  type: 'correction';
}

export async function initialize(): Promise<void>;
export async function correct(text: string): Promise<CorrectionMatch[]>;
export function isReady(): boolean;
```

### `src/utils/dom.ts`

DOM utilities for highlighting errors and handling user interaction.

```typescript
export function isEditable(element: Element): element is HTMLElement;
export function getAllEditableElements(): HTMLElement[];
export function injectStyles(): void;
export function applyHighlights(container: HTMLElement, matches: CorrectionMatch[]): void;
export function removeHighlights(container: HTMLElement): void;
export function showPopup(x: number, y: number, matches: CorrectionMatch[], onSelect: (match: CorrectionMatch) => void): void;
export function replaceText(node: Node, start: number, end: number, replacement: string): void;
```

### `src/utils/storage.ts`

Chrome storage wrapper for user configuration.

```typescript
export interface StorageData {
  enabled: boolean;
  modelUrl: string;
  vocabUrl: string;
}

export const defaultStorageData: StorageData;
export function getEnabled(): Promise<boolean>;
export function getModelUrl(): Promise<string>;
export function getVocabUrl(): Promise<string>;
export function setEnabled(enabled: boolean): Promise<void>;
export function setModelUrl(url: string): Promise<void>;
export function setVocabUrl(url: string): Promise<void>;
```

### `src/types.ts`

TypeScript type definitions exported for use in other modules.

```typescript
export { CorrectionMatch, StorageData };
```

## Internal Modules

These are not meant for external use:

- `src/components/CorrectorSettings.tsx` - React component for settings page
- Entrypoints are not API, they boot the extension

## Extension Messages

See [messaging.md](./messaging.md) for message protocol documentation.

## Entrypoints

### `content/content__all_urls.ts`

Content script entrypoint injected into all web pages. Initializes and runs correction.

### `options/index.tsx`

Options page entrypoint for extension settings.

### `popup/index.tsx`

Popup entrypoint shown when clicking extension icon.
