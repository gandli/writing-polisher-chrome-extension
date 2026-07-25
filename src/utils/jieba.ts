/**
 * 中文分词工具 - 基于 jieba
 * 用于中文文本纠错前的分词处理
 */

import jieba from 'jieba';

let initialized = false;

export async function initJieba(): Promise<void> {
  if (initialized) return;
  try {
    // jieba 会自动加载词典
    await jieba.init();
    initialized = true;
    console.log('[pycorrector] jieba initialized');
  } catch (error) {
    console.error('[pycorrector] Failed to initialize jieba:', error);
    throw error;
  }
}

/**
 * 中文分词
 * @param text 输入文本
 * @returns 分词结果数组
 */
export async function cut(text: string): Promise<string[]> {
  if (!initialized) {
    console.warn('[pycorrector] jieba not initialized yet');
    return [text];
  }
  return await jieba.cut(text);
}

/**
 * 获取带位置的分词结果
 * @param text 输入文本
 * @returns 带位置信息的分词结果
 */
export async function cutWithPos(text: string): Promise<Array<{word: string, pos: string, start: number, end: number}>> {
  if (!initialized) {
    console.warn('[pycorrector] jieba not initialized yet');
    return [{ word: text, pos: 'x', start: 0, end: text.length }];
  }
  const result = await cut(text);
  // 计算位置信息
  let start = 0;
  return result.map((word: string) => {
    const end = start + word.length;
    const posInfo = {
      word,
      pos: 'x',
      start,
      end
    };
    start = end;
    return posInfo;
  });
}