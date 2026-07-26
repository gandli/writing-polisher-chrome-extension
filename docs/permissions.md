# Permissions Design

## Required Permissions

### `storage`

**Location**: `manifest.json` → `permissions`

**Purpose**: Store user configuration (model URL, vocabulary URL, enabled/disabled) in `chrome.storage.local`.

**Privacy**: All data stays local to the user's browser, never uploaded.

### `<all_urls>`

**Location**: `manifest.json` → `host_permissions`

**Purpose**: Allow content script to be injected into **all web pages** so that spelling correction works anywhere the user types Chinese.

**Why `<all_urls>`?**: Spelling correction is useful on any website (social media, email, docs, blogs), we need access to all editable text areas.

**Scope**: Content script only reads text from editable areas to perform correction, does not collect or transmit any data.

## Permission Table

| Permission | Type | Required | Purpose |
|------------|------|----------|---------|
| `storage` | `permissions` | Yes | Store user settings |
| `<all_urls>` | `host_permissions` | Yes | Inject into all web pages |

## Least Privilege Principle

This extension follows the principle of least privilege:

- Only the minimal permissions needed are requested
- No unnecessary permissions like `tabs`, `history`, `cookies`, etc.
- All text processing happens locally, no data leaves the browser

## Why no activeTab?

`activeTab` only gives access to the current tab when user clicks the extension icon. We want correction to work automatically on **all pages** whenever the user types, so `host_permissions: ["<all_urls>"]` is required.
