/**
 * Text matching for dictionary and laws
 */

import { getMergedDictionary, getSortedKeywords } from './dictionary';
import { parseLawReferences } from './laws';
import { MatchResult } from '../types';

/**
 * Find all dictionary matches in text
 */
export async function findDictionaryMatches(text: string): Promise<MatchResult[]> {
  const dictionary = await getMergedDictionary();
  const keywords = await getSortedKeywords();
  const matches: MatchResult[] = [];

  // We need to check non-overlapping matches, longest first
  // Track which character positions are already matched
  const matchedPositions = new Set<number>();

  for (const keyword of keywords) {
    const replacement = dictionary[keyword];
    let startIndex = 0;
    let index;

    while ((index = text.indexOf(keyword, startIndex)) !== -1) {
      const end = index + keyword.length;
      // Check if any character in this range is already matched
      let overlaps = false;
      for (let i = index; i < end; i++) {
        if (matchedPositions.has(i)) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        matches.push({
          text: keyword,
          replacement,
          start: index,
          end,
          type: 'dictionary',
        });
        // Mark positions as matched
        for (let i = index; i < end; i++) {
          matchedPositions.add(i);
        }
      }

      startIndex = end;
    }
  }

  // Sort by start position
  matches.sort((a, b) => a.start - b.start);
  return matches;
}

/**
 * Find all law matches in text
 */
export async function findLawMatches(text: string): Promise<MatchResult[]> {
  const references = parseLawReferences(text);
  const matches: MatchResult[] = [];

  for (const ref of references) {
    matches.push({
      text: text.substring(ref.start, ref.end),
      replacement: '',
      start: ref.start,
      end: ref.end,
      type: 'law',
      data: {
        name: ref.name,
        article: ref.article,
        content: '',
        isCustom: false,
      },
    });
  }

  return matches;
}

/**
 * Find all matches (dictionary + laws) sorted by position
 */
export async function findAllMatches(text: string): Promise<MatchResult[]> {
  const dictMatches = await findDictionaryMatches(text);
  const lawMatches = await findLawMatches(text);
  const allMatches = [...dictMatches, ...lawMatches];
  allMatches.sort((a, b) => a.start - b.start);

  // Remove overlaps (keep earlier match)
  const result: MatchResult[] = [];
  let lastEnd = -1;
  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      result.push(match);
      lastEnd = match.end;
    }
  }

  return result;
}
