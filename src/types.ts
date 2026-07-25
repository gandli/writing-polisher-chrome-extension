/**
 * Type definitions for Writing Polisher
 */

// 词典词条
export interface DictionaryEntry {
  colloquial: string;
  formal: string;
  isCustom: boolean;
}

// 法条条目
export interface LawEntry {
  name: string;
  article: string;
  content: string;
  isCustom: boolean;
}

// 匹配结果
export interface MatchResult {
  text: string;
  replacement: string;
  start: number;
  end: number;
  type: 'dictionary' | 'law' | 'grammar';
  data?: LawEntry;
  grammarMessage?: string;
  grammarReplacements?: string[];
}

// Grammar match from LanguageTool
export interface GrammarMatch {
  offset: number;
  length: number;
  message: string;
  replacements: string[];
  rule: {
    id: string;
    description: string;
  };
}

// 存储数据结构
export interface StorageData {
  customDictionary: Record<string, string>;
  customLaws: Record<string, Record<string, string>>;
  enabled: boolean;
  grammarEnabled: boolean;
  grammarServerUrl: string;
  grammarLanguage: string;
}

// 默认存储数据
export const defaultStorageData: StorageData = {
  customDictionary: {},
  customLaws: {},
  enabled: true,
  grammarEnabled: true,
  grammarServerUrl: 'http://localhost:8081',
  grammarLanguage: 'zh-CN',
};
