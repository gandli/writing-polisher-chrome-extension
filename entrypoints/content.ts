/**
 * Content script - injected into web pages
 */

import { findAllMatches } from '../src/utils/matcher';
import { LanguageToolClient } from '../src/utils/languagetool';
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
import { getEnabled, getGrammarEnabled, getGrammarServerUrl, getGrammarLanguage } from '../src/utils/storage';
import { findLaw } from '../src/utils/laws';
import { MatchResult } from '../src/types';

console.log('[Writing Polisher] Content script loaded');

declare const chrome: any;

export default () => {

let enabled = true;
let grammarEnabled = true;
let grammarClient: LanguageToolClient | null = null;
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
  let allMatches: MatchResult[] = [];

  for (const container of containers) {
    const text = container.textContent || '';
    if (!text.trim()) continue;

    const dictMatches = await findAllMatches(text);
    allMatches = allMatches.concat(dictMatches);

    // Grammar check with LanguageTool
    if (grammarEnabled && grammarClient) {
      try {
        const grammarMatches = await grammarClient.check(text, await getGrammarLanguage());
        grammarMatches.forEach(match => {
          allMatches.push({
            text: text.slice(match.offset, match.offset + match.length),
            replacement: match.replacements[0] || '',
            start: match.offset,
            end: match.offset + match.length,
            type: 'grammar',
            grammarMessage: match.message,
            grammarReplacements: match.replacements,
          });
        });
      } catch (error) {
        console.error('[Writing Polisher] Grammar check failed:', error);
      }
    }
  }

  if (allMatches.length > 0) {
    applyHighlights(container, allMatches);
  }
}

/**
 * Handle click on highlighted text
 */
async function handleHighlightClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (
    target.classList.contains(HIGHLIGHT_CLASS_DICT) ||
    target.classList.contains(HIGHLIGHT_CLASS_LAW) ||
    target.classList.contains('wt-spelling')
  ) {
    e.preventDefault();
    e.stopPropagation();

    const type = target.dataset.matchType as 'dictionary' | 'law' | 'grammar';
    const replacement = target.dataset.replacement || '';
    const text = target.textContent || '';
    const grammarMessage = target.dataset.grammarMessage || '';
    const grammarReplacements = target.dataset.grammarReplacements ? JSON.parse(target.dataset.grammarReplacements) : [];

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
    } else if (type === 'grammar') {
      showPopup(
        {
          text,
          replacement: grammarReplacements[0] || '',
          start: 0,
          end: 0,
          type: 'grammar',
        },
        target,
        () => {
          replaceHighlight(target, grammarReplacements[0] || '');
          setTimeout(updateHighlights, 100);
        },
        () => {
          replaceHighlight(target, text);
          setTimeout(updateHighlights, 100);
        },
        grammarMessage,
        grammarReplacements
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
  grammarEnabled = await getGrammarEnabled();
  const serverUrl = await getGrammarServerUrl();
  grammarClient = new LanguageToolClient(serverUrl);

  // Add click listener
  document.addEventListener('click', handleHighlightClick, true);

  // Add input listeners for editable content
  document.addEventListener('input', handleInput, true);

  // Initial highlight
  setTimeout(updateHighlights, 500);

  // Listen for storage changes
  chrome.storage.onChanged.addListener(async () => {
    enabled = await getEnabled();
    grammarEnabled = await getGrammarEnabled();
    const url = await getGrammarServerUrl();
    if (grammarClient) {
      grammarClient.setServerUrl(url);
    } else {
      grammarClient = new LanguageToolClient(url);
    }
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
