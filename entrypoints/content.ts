/**
 * Content script - injected into web pages
 */

import { findAllMatches } from '../src/utils/matcher';
import {
  injectStyles,
  removeHighlights,
  removePopup,
  applyHighlights,
  showPopup,
  replaceHighlight,
  getEditableContainers,
  HIGHLIGHT_CLASS_DICT,
  HIGHLIGHT_CLASS_LAW,
} from '../src/utils/dom';
import { getEnabled } from '../src/utils/storage';
import { findLaw } from '../src/utils/laws';
import { MatchResult } from '../src/types';

console.log('[Writing Polisher] Content script loaded');

declare const chrome: any;

export default () => {

let enabled = true;
let debounceTimer: number | null = null;

/**
 * Debounced highlighting
 */
async function updateHighlights() {
  if (!enabled) {
    removeHighlights();
    return;
  }

  removeHighlights();

  const containers = getEditableContainers();
  for (const container of containers) {
    const text = container.textContent || '';
    if (!text.trim()) continue;

    const matches = await findAllMatches(text);
    if (matches.length > 0) {
      applyHighlights(container, matches);
    }
  }
}

/**
 * Handle click on highlighted text
 */
async function handleHighlightClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (
    target.classList.contains(HIGHLIGHT_CLASS_DICT) ||
    target.classList.contains(HIGHLIGHT_CLASS_LAW)
  ) {
    e.preventDefault();
    e.stopPropagation();

    const type = target.dataset.matchType as 'dictionary' | 'law';
    const replacement = target.dataset.replacement || '';
    const text = target.textContent || '';

    if (type === 'dictionary') {
      showPopup(
        {
          text,
          replacement,
          start: 0,
          end: 0,
          type: 'dictionary',
        },
        target,
        () => {
          replaceHighlight(target, replacement);
          // Schedule a new highlight after replacement
          setTimeout(updateHighlights, 100);
        },
        () => {
          // Remove highlight on ignore
          replaceHighlight(target, text);
          setTimeout(updateHighlights, 100);
        }
      );
    } else {
      // Law - find content
      const matchText = target.textContent || '';
      const { parseLawReferences } = await import('../src/utils/laws');
      const parsed = parseLawReferences(matchText);
      if (parsed.length > 0) {
        const { name, article } = parsed[0];
        const content = await findLaw(name, article);
        showPopup(
          {
            text: matchText,
            replacement: '',
            start: 0,
            end: 0,
            type: 'law',
            data: {
              name,
              article,
              content: content || '未找到该法条内容',
              isCustom: false,
            },
          },
          target
        );
      }
    }
  }
}

/**
 * Debounce input handler
 */
function handleInput() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = window.setTimeout(() => {
    updateHighlights();
  }, 500);
}

/**
 * Initialize content script
 */
async function init() {
  // Inject styles
  injectStyles();

  // Get enabled state
  enabled = await getEnabled();

  // Add click listener
  document.addEventListener('click', handleHighlightClick, true);

  // Add input listeners for editable content
  document.addEventListener('input', handleInput, true);

  // Initial highlight
  setTimeout(updateHighlights, 500);

  // Listen for storage changes
  chrome.storage.onChanged.addListener(async () => {
    enabled = await getEnabled();
    updateHighlights();
  });
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

};
