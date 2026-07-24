/**
 * Dictionary loading and management
 */

import builtinDictionary from '../data/dictionary.json';
import { getCustomDictionary } from './storage';
import { DictionaryEntry } from '../types';

/**
 * Get merged dictionary: builtin + custom
 */
export async function getMergedDictionary(): Promise<Record<string, string>> {
  const custom = await getCustomDictionary();
  return {
    ...builtinDictionary,
    ...custom,
  };
}

/**
 * Get all entries as list with isCustom flag
 */
export async function getAllDictionaryEntries(): Promise<DictionaryEntry[]> {
  const merged = await getMergedDictionary();
  const custom = await getCustomDictionary();
  const entries: DictionaryEntry[] = [];

  for (const [colloquial, formal] of Object.entries(merged)) {
    entries.push({
      colloquial,
      formal,
      isCustom: colloquial in custom,
    });
  }

  // Sort by colloquial
  entries.sort((a, b) => a.colloquial.localeCompare(b.colloquial));
  return entries;
}

/**
 * Get sorted keywords by length descending (longest first)
 */
export async function getSortedKeywords(): Promise<string[]> {
  const merged = await getMergedDictionary();
  const keywords = Object.keys(merged);
  // Sort by length descending, then by text
  keywords.sort((a, b) => {
    if (b.length !== a.length) {
      return b.length - a.length;
    }
    return a.localeCompare(b);
  });
  return keywords;
}

/**
 * Escape regex special characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get regex pattern for matching
 */
export async function getDictionaryPattern(): Promise<RegExp | null> {
  const keywords = await getSortedKeywords();
  if (keywords.length === 0) {
    return null;
  }
  const escapedKeywords = keywords.map(escapeRegExp);
  const pattern = `\\b(${escapedKeywords.join('|')})\\b`;
  return new RegExp(pattern, 'g');
}
