/**
 * Laws loading and search
 */

import builtinLaws from '../data/laws.json';
import { getCustomLaws } from './storage';
import { LawEntry } from '../types';

/**
 * Get merged laws: builtin + custom
 */
export async function getMergedLaws(): Promise<Record<string, Record<string, string>>> {
  const custom = await getCustomLaws();
  return {
    ...builtinLaws,
    ...custom,
  };
}

/**
 * Get all law entries as list
 */
export async function getAllLawEntries(): Promise<LawEntry[]> {
  const merged = await getMergedLaws();
  const custom = await getCustomLaws();
  const entries: LawEntry[] = [];

  for (const [name, articles] of Object.entries(merged)) {
    for (const [article, content] of Object.entries(articles)) {
      entries.push({
        name,
        article,
        content,
        isCustom: name in custom && article in custom[name],
      });
    }
  }

  // Sort by name then article
  entries.sort((a, b) => {
    if (a.name !== b.name) {
      return a.name.localeCompare(b.name);
    }
    return parseInt(a.article) - parseInt(b.article);
  });
  return entries;
}

/**
 * Find law by name and article
 */
export async function findLaw(name: string, article: string): Promise<string | null> {
  const merged = await getMergedLaws();
  // Find closest matching law name
  const matchedName = Object.keys(merged).find(
    (key) => key.includes(name) || name.includes(key)
  );
  if (!matchedName) {
    return null;
  }
  return merged[matchedName][article] || null;
}

/**
 * Convert Chinese numerals to Arabic
 * Handles: 一 → 1, 三十一 → 31, 第三十一条 → 31
 */
function chineseToArabic(str: string): string {
  let result = 0;
  let previous = 0;
  
  for (const c of str.trim()) {
    if (c === '十') {
      if (previous === 0) {
        // 十 → 10
        result = 10;
      } else {
        // 三十 → previous × 10
        result = previous * 10;
      }
    } else if (/[一二三四五六七八九]/.test(c)) {
      const map: Record<string, number> = {
        一: 1, 二: 2, 三: 3, 四: 4, 五: 5,
        六: 6, 七: 7, 八: 8, 九: 9,
      };
      if (result === 0) {
        result = map[c];
      } else {
        result += map[c];
      }
      previous = map[c];
    }
  }

  return result === 0 ? str : result.toString();
}

/**
 * Parse law references from text
 * Match "XXX第N条" where XXX is the law name
 */
export function parseLawReferences(text: string): Array<{
  name: string;
  article: string;
  start: number;
  end: number;
}> {
  // First find all "第N条" occurrences, then backtrack to find the law name
  const pattern = /第\s*([0-9一二三四五六七八九十]+)\s*条/g;
  const matches = [];
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const articleNum = match[1];
    const endIndex = match.index + match[0].length;
    
    // Backtrack from "第" to find the law name (stop at whitespace)
    let nameStart = match.index;
    // Keep going backward, skip past closing brackets
    while (nameStart > 0) {
      const prevChar = text[nameStart - 1];
      if (prevChar === '《' || prevChar === '》') {
        // Skip bracket and continue
        nameStart--;
        continue;
      }
      if (/\s/.test(prevChar) || ['和', '及', '、', '，', ','].includes(prevChar)) {
        // Stop at whitespace or punctuation/connector
        nameStart++; // skip the whitespace/connector itself
        break;
      }
      nameStart--;
    }
    // Trim any brackets/whitespace from the name
    let name = text.slice(nameStart, match.index).trim();
    name = name.replace(/[《》]/g, '').trim();
    
    // Remove common prefixes like "根据", "依据", "按照", "和", "及", "以及" etc.
    name = name.replace(/^根据|^依据|^按照|^和|^及|^以及/, '').trim();
    
    const article = chineseToArabic(articleNum);
    matches.push({
      name,
      article,
      start: nameStart,
      end: endIndex,
    });
  }

  return matches;
}
