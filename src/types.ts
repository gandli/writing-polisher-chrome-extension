/**
 * Type definitions for pycorrector-chrome-extension
 */

// Grammar match from ONNX model
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

// Highlight match result
export interface MatchResult {
  text: string;
  replacement: string;
  start: number;
  end: number;
  type: 'grammar';
  grammarMessage?: string;
  grammarReplacements?: string[];
}

// 存储数据结构
export interface StorageData {
  enabled: boolean;
  modelUrl: string;
  vocabUrl: string;
}

// 默认存储数据
export const defaultStorageData: StorageData = {
  enabled: true,
  modelUrl: 'https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/model.onnx',
  vocabUrl: 'https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/vocab.txt',
};
