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
 * Regex pattern to match law references
 * Matches: 《烟草专卖法》第三十一条, 烟草专卖法第31条, etc.
 */
export function getLawPattern(): RegExp {
  // Match: [《]?XXX[》]?[ ]*第([0-9]+)[款条]
  return /[《]?([^《》\d]+)[》]?[ ]*第([0-9一二三四五六七八九十]+)[款条]/g;
}

/**
 * Convert Chinese numerals to Arabic
 */
function chineseToArabic(str: string): string {
  const map: Record<string, string> = {
    一: '1', 二: '2', 三: '3', 四: '4', 五: '5',
    六: '6', 七: '7', 八: '8', 九: '9', 十: '10',
  };
  return str.replace(/[一二三四五六七八九十]/g, (m) => map[m] || m);
}

/**
 * Parse law references from text
 */
export function parseLawReferences(text: string): Array<{
  name: string;
  article: string;
  start: number;
  end: number;
}> {
  const pattern = getLawPattern();
  const matches = [];
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const name = match[1].trim();
    let article = match[2].trim();
    article = chineseToArabic(article);
    matches.push({
      name,
      article,
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return matches;
}
