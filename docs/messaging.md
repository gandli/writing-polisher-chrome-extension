# Messaging Protocol

## Overview

The extension uses Chrome's `chrome.runtime.onMessage` for communication between different parts:

- Options page → Content script (settings updated)
- Popup → Content script (settings updated)

## Message Types

### `settings-updated`

**Direction**: Options/Popup → Content script

**Purpose**: Notify content script that user changed settings, should re-run correction with new settings.

**Payload**: None (content script reloads settings from storage directly)

**Example**:
```javascript
chrome.runtime.sendMessage({ type: 'settings-updated' });
```

## Message Flow

```
User changes model URL in options page
    ↓
options page saves to chrome.storage.local
    ↓
options page sends { type: 'settings-updated' }
    ↓
content script receives message
    ↓
content script reloads settings from storage
    ↓
content script removes old highlights
    ↓
content script re-runs correction with new settings
```

## No Response Required

All messages are one-way notifications, no request/response needed. Content script reloads settings directly from storage instead of receiving them in message, which avoids stale data.

## Why this design?

- Simple: No complex request/response handshake
- Reliable: Settings always read from source of truth (storage)
- Decoupled: Sender doesn't need to know about receiver internals
