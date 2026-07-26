# Manifest Documentation

## Manifest Version

- `manifest_version: 3` (MV3) - latest Chrome extension specification

## Key Fields

```json
{
  "name": "Writing Polisher",
  "version": "1.0.0",
  "description": "Pure browser-side Chinese spelling correction, completely offline",
  "manifest_version": 3,
  "minimum_chrome_version": "116",
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; img-src https: data:;"
  },
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "run_at": "document_idle"
    }
  ],
  "options_page": "options.html",
  "action": {
    "default_popup": "popup.html"
  }
}
```

## Explanation

| Field | Purpose |
|-------|---------|
| `name` | Extension name displayed in Chrome extensions list |
| `version` | Semantic versioning, auto-bumped by release-please |
| `description` | Short description displayed in store |
| `manifest_version` | Always 3 for modern extensions |
| `minimum_chrome_version` | Require Chrome 116+ for ONNX Runtime Web compatibility |
| `content_security_policy` | Restrict what can be loaded into extension pages |
| `permissions` | `storage` needed to persist user settings |
| `host_permissions` | `<all_urls>` needed to inject content script into all web pages |
| `content_scripts` | Content script configuration |
| `options_page` | Extension settings page |
| `action.default_popup` | Popup shown when clicking extension icon |

## CSP Explanation

```
script-src 'self'           Only load scripts from this extension
object-src 'none'           No plugins allowed
style-src 'self' 'unsafe-inline'  Allow inline styles for highlighting
img-src https: data:       Allow images from HTTPS and data URIs
```

This CSP follows best practices for security while allowing necessary functionality.
