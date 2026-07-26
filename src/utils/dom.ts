/**
 * DOM utilities for highlighting spelling errors and popup
 */

import { MatchResult } from '../types';

// Class names
export const HIGHLIGHT_CLASS = 'writing-polisher-highlight';
export const POPUP_CLASS = 'writing-polisher-popup';

/**
 * Add highlight styles to page if not already added
 */
export function injectStyles(): void {
  if (document.getElementById('writing-polisher-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'writing-polisher-styles';
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      background-color: rgba(255, 230, 109, 0.4);
      text-decoration: underline wavy rgba(255, 152, 0, 0.6);
      cursor: pointer;
      border-radius: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    .${POPUP_CLASS} {
      position: absolute;
      z-index: 999999;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 12px;
      min-width: 200px;
      max-width: 350px;
      font-size: 14px;
      line-height: 1.5;
    }

    .${POPUP_CLASS} .title {
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .${POPUP_CLASS} .content {
      margin-bottom: 10px;
      color: #555;
    }

    .${POPUP_CLASS} .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .${POPUP_CLASS} button {
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 13px;
    }

    .${POPUP_CLASS} button.primary {
      background: #1677ff;
      color: white;
      border-color: #1677ff;
    }

    .${POPUP_CLASS} button:hover {
      opacity: 0.9;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Remove existing highlights
 */
export function removeHighlights(): void {
  const highlights = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
  highlights.forEach((el) => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ''), el);
      parent.normalize();
    }
  });
}

/**
 * Remove existing popup
 */
export function removePopup(): void {
  const popup = document.querySelector(`.${POPUP_CLASS}`);
  if (popup) {
    popup.remove();
  }
}

/**
 * Wrap matched text with highlight element
 */
function wrapTextNode(node: Text, matches: MatchResult[]): void {
  const text = node.textContent || '';
  const parent = node.parentNode;
  if (!parent) return;

  let lastIndex = 0;
  const fragment = document.createDocumentFragment();

  for (const match of matches) {
    if (match.start > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.start)));
    }

    const span = document.createElement('span');
    span.textContent = text.slice(match.start, match.end);
    span.dataset.replacement = match.replacement;
    span.dataset.start = match.start.toString();
    span.dataset.end = match.end.toString();
    span.className = HIGHLIGHT_CLASS;
    fragment.appendChild(span);

    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  parent.replaceChild(fragment, node);
}

/**
 * Walk text nodes in an element
 */
function walkTextNodes(element: Element, callback: (node: Text) => void): void {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const parentTag = textNode.parentElement?.tagName.toLowerCase();
    // Skip script and style tags
    if (parentTag !== 'script' && parentTag !== 'style') {
      callback(textNode);
    }
  }
}

/**
 * Apply highlights to the page based on matches
 */
export function applyHighlights(container: Element, matches: MatchResult[]): void {
  // Group matches by text node - simplified approach for content editable
  // This works for most cases, for complex editors we may need adjustment
  walkTextNodes(container, (textNode) => {
    const text = textNode.textContent || '';
    if (!text.trim()) return;

    const nodeMatches = matches.filter((m) => {
      // Approximate matching for text node - this is simplified
      return text.includes(m.text);
    });

    if (nodeMatches.length > 0) {
      wrapTextNode(textNode, nodeMatches);
    }
  });
}

/**
 * Create and show popup
 */
export function showPopup(
  match: MatchResult,
  targetElement: HTMLElement,
  onReplace?: () => void,
  onClose?: () => void
): void {
  removePopup();

  const rect = targetElement.getBoundingClientRect();
  const popup = document.createElement('div');
  popup.className = POPUP_CLASS;

  // Build popup with DOM API to avoid XSS from user text
  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = '💡 Suggestion';
  popup.appendChild(title);

  const content = document.createElement('div');
  content.className = 'content';

  const originalRow = document.createElement('div');
  const originalLabel = document.createElement('strong');
  originalLabel.textContent = 'Original:';
  originalRow.appendChild(originalLabel);
  originalRow.appendChild(document.createTextNode(` ${match.text}`));
  content.appendChild(originalRow);

  const replacementRow = document.createElement('div');
  const replacementLabel = document.createElement('strong');
  replacementLabel.textContent = 'Replacement:';
  replacementRow.appendChild(replacementLabel);
  replacementRow.appendChild(document.createTextNode(` ${match.replacement}`));
  content.appendChild(replacementRow);
  popup.appendChild(content);

  const actions = document.createElement('div');
  actions.className = 'actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'wp-popup-cancel';
  cancelBtn.textContent = 'Ignore';
  actions.appendChild(cancelBtn);

  const replaceBtn = document.createElement('button');
  replaceBtn.id = 'wp-popup-replace';
  replaceBtn.className = 'primary';
  replaceBtn.textContent = 'Replace';
  actions.appendChild(replaceBtn);

  popup.appendChild(actions);

  // Position popup
  popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(popup);

  // Event listeners
  replaceBtn.addEventListener('click', () => {
    onReplace?.();
    removePopup();
  });
  cancelBtn.addEventListener('click', () => {
    onClose?.();
    removePopup();
  });

  // Close when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeOnClick(e) {
      if (!popup.contains(e.target as Node)) {
        removePopup();
        document.removeEventListener('click', closeOnClick);
      }
    });
  }, 0);
}

/**
 * Replace text in the DOM
 */
export function replaceHighlight(highlightEl: HTMLElement, replacement: string): void {
  const parent = highlightEl.parentNode;
  if (parent) {
    parent.replaceChild(document.createTextNode(replacement), highlightEl);
    parent.normalize();
  }
}

/**
 * Check if element is editable
 */
export function isEditable(element: Element): element is HTMLElement {
  return 'isContentEditable' in element && (element as HTMLElement).isContentEditable;
}

/**
 * Get all editable containers on the page
 */
export function getEditableContainers(): Element[] {
  const containers: Element[] = [];
  // Input and textarea
  document.querySelectorAll('input, textarea').forEach((el) => {
    containers.push(el);
  });
  // Content editable elements
  document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
    containers.push(el);
  });
  return containers;
}
