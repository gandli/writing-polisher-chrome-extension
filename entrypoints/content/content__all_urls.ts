/**
 * Content script entrypoint for Chinese spelling correction
 * Runs on all web pages to detect and correct spelling errors
 */
// @on-browser-only
// @matches=<all_urls>
// @run-at=document_idle

/**
 * Content script entrypoint for Chinese spelling correction
 * Runs on all web pages to detect and correct spelling errors
 */

declare function defineUnlistedScript(init: () => void): void;

import { correct, initialize, isReady } from '../../src/utils/chinese-corrector';
import { injectStyles, applyHighlights, removeHighlights, showPopup, replaceHighlight, getEditableContainers, removePopup } from '../../src/utils/dom';
import { getEnabled } from '../../src/utils/storage';
import type { MatchResult } from '../../src/types';

// State
let isInitialized = false;
let currentMatches: MatchResult[] = [];

/**
 * Run spelling correction on the entire page
 */
async function runCorrection() {
  const enabled = await getEnabled();
  if (!enabled) {
    removeHighlights();
    currentMatches = [];
    return;
  }

  if (!isReady()) {
    await initialize();
  }

  removeHighlights();
  currentMatches = [];

  const containers = getEditableContainers();
  for (const container of containers) {
    // For input/textarea we can't inject highlights directly
    // but we still keep them for future enhancement
    if (container.tagName.toLowerCase() === 'input' || container.tagName.toLowerCase() === 'textarea') {
      continue;
    }

    // Extract text content
    const text = container.textContent || '';
    if (text.trim().length < 2) continue;

    try {
      const corrected = await correct(text);
      // Simple diff-based matching: for each character that changed, create a match
      // This is simplified approach for character-level model
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== corrected[i] && corrected[i]) {
          // Find span of consecutive different characters
          let start = i;
          while (i < text.length && corrected[i] !== text[i]) {
            i++;
          }
          currentMatches.push({
            text: text.slice(start, i),
            replacement: corrected.slice(start, i),
            start,
            end: i,
            type: 'correction',
          });
        }
      }
    } catch (e) {
      console.error('[writing-polisher] Correction error:', e);
    }
  }

  injectStyles();
  for (const container of containers) {
    if (
      container.tagName.toLowerCase() !== 'input' &&
      container.tagName.toLowerCase() !== 'textarea'
    ) {
      applyHighlights(container, currentMatches);
    }
  }

  // Add click handler for highlights
  document.addEventListener('click', handleHighlightClick, true);
}

/**
 * Handle click on a highlighted error
 */
function handleHighlightClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const HIGHLIGHT_CLASS = 'writing-polisher-highlight';
  if (!target.classList.contains(HIGHLIGHT_CLASS)) return;

  const replacement = target.dataset.replacement;
  const text = target.textContent;
  if (!replacement || !text) return;

  showPopup(
    {
      text,
      replacement,
      start: 0,
      end: 0,
      type: 'correction',
    },
    target,
    () => {
      replaceHighlight(target, replacement);
      removePopup();
    },
    () => {
      removePopup();
    }
  );
}

/**
 * Initialize content script
 */
async function init() {
  injectStyles();
  await runCorrection();
  isInitialized = true;
}

// Start initialization
init().catch(err => {
  console.error('[writing-polisher] Initialization error:', err);
});

// Listen for storage changes from options page
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'settings-updated') {
    runCorrection().catch(err => {
      console.error('[writing-polisher] Update error:', err);
    });
    sendResponse({ ok: true });
  }
});

// Re-run when page history changes (SPA navigation)
let lastUrl: string = typeof location !== 'undefined' ? location.href : '';
typeof MutationObserver !== 'undefined' && new MutationObserver(() => {
  const url = typeof location !== 'undefined' ? location.href : '';
  if (url !== lastUrl) {
    lastUrl = url;
    if (isInitialized) {
      runCorrection().catch(err => {
        console.error('[writing-polisher] Navigation update error:', err);
      });
    }
  }
}).observe(document, { childList: true, subtree: true });

export default defineUnlistedScript(init);
