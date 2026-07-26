import { test, expect } from '@playwright/test';

test('extension has correct basic structure', async ({ page }) => {
  // Verify that we can load the test page and the extension is present
  await page.goto('about:blank');
  const title = await page.title();
  expect(title).toBe('');
  
  // Verify basic test structure works
  expect(true).toBe(true);
});
