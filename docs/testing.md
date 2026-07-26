# Testing Strategy

## Overview

This project uses two levels of testing:

1. **Unit Tests** (Vitest) - Test individual utility functions
2. **End-to-End (E2E) Tests** (Playwright) - Test the entire extension in Chrome

## Running Tests

### Unit Tests

```bash
npm run test
```

Runs all unit tests under `test/` directory with Vitest.

### Watch Mode

```bash
npx vitest
```

### E2E Tests

```bash
npm run test:e2e
```

Runs all E2E tests under `e2e/` directory with Playwright.

## What to Test

| Layer | Tests |
|-------|-------|
| `src/types.ts` | Default storage data structure |
| `src/utils/storage.ts` | Storage API structure |
| `src/utils/dom.ts` | DOM utility functions can be imported and called |
| `src/utils/chinese-corrector.ts` | ONNX initialization API structure |
| E2E | Extension can load, basic structure is correct |

## Current Test Coverage

- ✅ Core module structure
- ✅ Default values are correct
- ✅ All modules can be imported without errors
- ✅ TypeScript types are correct
- ✅ E2E framework is configured and runs

## Adding New Tests

### Unit Test

Create file in `test/`:
```
test/<name>.test.ts
```

Use:
```typescript
import { describe, it, expect } from 'vitest';

describe('feature', () => {
  it('should do something', () => {
    expect(thing).toBe(expected);
  });
});
```

### E2E Test

Create file in `e2e/`:
```
e2e/<name>.test.ts
```

Use:
```typescript
import { test, expect } from '@playwright/test';

test('feature should work', async ({ page }) => {
  // test code
});
```

## CI

GitHub Actions runs:

1. `npm run test` on every push and PR
2. `npx playwright install --with-deps chromium`
3. `npm run test:e2e`

All tests must pass before merging.

## Testing Tips

- Unit tests should be fast and test one thing
- E2E tests test the whole user experience
- ONNX model loading is not unit tested because it's large and requires network
- Model correctness is verified by the original pycorrector project
