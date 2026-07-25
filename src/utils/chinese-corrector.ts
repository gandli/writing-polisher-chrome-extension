/**
 * 纯浏览器端中文文本纠错
 * 使用 ONNX Runtime Web 推理 MacBERT-CSC / Mengzi-T5 中文纠错模型
 * 字符级输入，不需要分词
 */

import * as ort from 'onnxruntime-web';
import { GrammarMatch } from '../types';

// 模型配置，使用量化后的 ONNX 模型
// 默认使用 shibing624/mengzi-t5-base-chinese-correction 转换的 ONNX 模型
// 可以配置为其他模型 URL
const DEFAULT_MODEL_URL = 'https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/model.onnx';
const DEFAULT_VOCAB_URL = 'https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/vocab.txt';

export class ChineseSpellingCorrector {
  private session: ort.InferenceSession | null = null;
  private vocab: Map<string, number> | null = null;
  private idToToken: string[] | null = null;
  private modelUrl: string;
  private vocabUrl: string;
  private initialized = false;
  private initializing = false;

  constructor(modelUrl: string = DEFAULT_MODEL_URL, vocabUrl: string = DEFAULT_VOCAB_URL) {
    this.modelUrl = modelUrl;
    this.vocabUrl = vocabUrl;
  }

  /**
   * 初始化模型和词典
   */
  async init(): Promise<boolean> {
    if (this.initialized) return true;
    if (this.initializing) {
      // Wait for ongoing initialization
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.initialized;
    }

    this.initializing = true;
    try {
      // Load vocabulary
      await this.loadVocab();

      // Load ONNX model
      ort.env.wasm.numThreads = 4;
      ort.env.wasm.simd = true;
      this.session = await ort.InferenceSession.create(this.modelUrl, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });

      this.initialized = true;
      console.log('[pycorrector] Chinese spelling corrector initialized');
      this.initializing = false;
      return true;
    } catch (error) {
      console.error('[pycorrector] Failed to initialize Chinese spelling corrector:', error);
      this.initializing = false;
      return false;
    }
  }

  /**
   * 加载词表
   */
  private async loadVocab(): Promise<void> {
    const response = await fetch(this.vocabUrl);
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    this.vocab = new Map();
    this.idToToken = [];
    lines.forEach((line, index) => {
      const token = line.trim();
      this.vocab!.set(token, index);
      this.idToToken!.push(token);
    });
  }

  /**
   * Tokenize text
   */
  private tokenize(text: string): number[] {
    if (!this.vocab || !this.idToToken) return [];

    const tokens: number[] = [];
    // Add [CLS]
    tokens.push(this.vocab.get('[CLS]') || 0);

    for (const char of text) {
      const id = this.vocab.get(char);
      if (id !== undefined) {
        tokens.push(id);
      } else {
        tokens.push(this.vocab.get('[UNK]') || 100);
      }
    }

    // Add [SEP]
    tokens.push(this.vocab.get('[SEP]') || 1);
    return tokens;
  }

  /**
   * Check text for spelling errors
   * @param text Input text
   * @returns Array of matches
   */
  async check(text: string): Promise<GrammarMatch[]> {
    if (!this.initialized || !this.session || !this.vocab || !this.idToToken) {
      console.warn('[pycorrector] Spelling corrector not initialized');
      return [];
    }

    if (!text.trim()) return [];

    try {
      const inputIds = this.tokenize(text);
      const attentionMask = new Array(inputIds.length).fill(1);

      // Create input tensor
      const inputIdsTensor = new ort.Tensor('int64', new BigInt64Array(inputIds.map(BigInt)), [1, inputIds.length]);
      const attentionMaskTensor = new ort.Tensor('int64', new BigInt64Array(attentionMask.map(BigInt)), [1, attentionMask.length]);

      // Run inference
      const feeds: Record<string, ort.Tensor> = {
        'input_ids': inputIdsTensor,
        'attention_mask': attentionMaskTensor,
      };

      const results = await this.session.run(feeds);
      const output = results['logits'];
      if (!output) {
        console.error('[pycorrector] No logits output from model');
        return [];
      }

      // Process predictions
      const matches: GrammarMatch[] = [];
      const data = output.data as Float32Array;
      const seqLen = inputIds.length;
      const vocabSize = output.dims[2];

      for (let i = 1; i < seqLen - 1; i++) { // Skip [CLS] and [SEP]
        const startIdx = i * vocabSize;
        let maxProb = -Infinity;
        let maxId = 0;
        for (let j = 0; j < vocabSize; j++) {
          if (data[startIdx + j] > maxProb) {
            maxProb = data[startIdx + j];
            maxId = j;
          }
        }
        const predictedToken = this.idToToken[maxId];
        const originalChar = text[i - 1]; // i=1 -> char 0
        if (predictedToken !== originalChar && predictedToken) {
          matches.push({
            offset: i - 1,
            length: 1,
            message: `拼写建议：${predictedToken}`,
            replacements: [predictedToken],
            rule: {
              id: 'spelling-error',
              description: '拼写错误',
            },
          });
        }
      }

      return matches;
    } catch (error) {
      console.error('[pycorrector] Spelling check error:', error);
      return [];
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export default ChineseSpellingCorrector;