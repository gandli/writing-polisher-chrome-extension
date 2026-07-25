/**
 * Content script - injected into web pages
 * Pure browser Chinese spelling correction with ONNX Runtime Web
 * Based on pycorrector pre-trained model
 *
 * @matches "<all_urls>"
 */

import { ChineseSpellingCorrector } from '../../src/utils/chinese-corrector';
import {
  injectStyles,
  removeHighlights,
  removePopup,
  applyHighlights,
  showPopup,
  replaceHighlight,
  getEditableContainers,
} from '../../src/utils/dom';
import { getEnabled, getModelUrl, getVocabUrl } from '../../src/utils/storage';
import { MatchResult } from '../../src/types';

console.log('[pycorrector] Content script loaded');

declare const chrome: any;

export default () => {

let enabled = true;
let corrector: ChineseSpellingCorrector | null = null;
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

    let allMatches: MatchResult[] = [];

    // Chinese spelling correction with ONNX (pure browser)
    if (corrector && corrector.isInitialized()) {
      try {
        const matches = await corrector.check(text);
        matches.forEach(match => {
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
        console.error('[pycorrector] Check failed:', error);
      }
    }

    if (allMatches.length > 0) {
      applyHighlights(container, allMatches);
    }
  }
}

/**
 * Handle click on highlighted text
 */
async function handleHighlightClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('wt-spelling')) {
    e.preventDefault();
    e.stopPropagation();

    const replacement = target.dataset.replacement || '';
    const text = target.textContent || '';
    const grammarMessage = target.dataset.grammarMessage || '';
    const grammarReplacements = target.dataset.grammarReplacements ? JSON.parse(target.dataset.grammarReplacements) : [];

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
  const modelUrl = await getModelUrl();
  const vocabUrl = await getVocabUrl();

  // Initialize ONNX Chinese spelling corrector
  if (enabled) {
    corrector = new ChineseSpellingCorrector(modelUrl, vocabUrl);
    // Initialize in background
    corrector.init().then(success => {
      if (success) {
        console.log('[pycorrector] ONNX model ready');
        updateHighlights();
      } else {
        console.error('[pycorrector] Failed to initialize ONNX model');
      }
    });
  }

  // Add click listener
  document.addEventListener('click', handleHighlightClick, true);

  // Add input listeners for editable content
  document.addEventListener('input', handleInput, true);

  // Initial highlight
  setTimeout(updateHighlights, 500);

  // Listen for storage changes
  chrome.storage.onChanged.addListener(async () => {
    enabled = await getEnabled();
    const url = await getModelUrl();
    const vocab = await getVocabUrl();

    // Initialize corrector if enabled and not initialized
    if (enabled && !corrector) {
      corrector = new ChineseSpellingCorrector(url, vocab);
      corrector.init().then(success => {
        if (success) {
          updateHighlights();
        }
      });
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
