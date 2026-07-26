/**
 * Chinese spelling correction with ONNX Runtime Web
 * Based on shibing64/mengzi-t5-base-chinese-correction-onnx
 */

import { InferenceSession, Tensor } from 'onnxruntime-web';
import { getModelUrl, getVocabUrl } from './storage';

// Token types
const BOS_TOKEN = '<s>';
const EOS_TOKEN = '</s>';
const PAD_TOKEN = '<pad>';
const UNK_TOKEN = '<unk>';

// Cache for vocab and session
let vocab: Map<string, number> | null = null;
let session: InferenceSession | null = null;
let loading = false;

/**
 * Load vocabulary from URL
 */
async function loadVocab(): Promise<Map<string, number>> {
  if (vocab) {
    return vocab;
  }
  const vocabUrl = await getVocabUrl();
  const response = await fetch(vocabUrl);
  const text = await response.text();
  const lines = text.split('\n').filter(line => line.trim());
  const vocabMap = new Map<string, number>();
  lines.forEach((line, i) => {
    const token = line.trim().split(/\s+/)[0];
    vocabMap.set(token, i);
  });
  vocab = vocabMap;
  return vocabMap;
}

/**
 * Load ONNX model session
 */
async function loadModel(): Promise<InferenceSession> {
  if (session) {
    return session;
  }
  if (loading) {
    throw new Error('Model is already loading');
  }
  loading = true;
  try {
    const modelUrl = await getModelUrl();
    session = await InferenceSession.create(modelUrl, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    });
    return session;
  } finally {
    loading = false;
  }
}

/**
 * Initialize model and vocab
 */
export async function initialize(): Promise<void> {
  await Promise.all([loadVocab(), loadModel()]);
}

/**
 * Tokenize input text
 */
function tokenize(text: string, vocab: Map<string, number>): number[] {
  const tokens: number[] = [vocab.get(BOS_TOKEN) || 0];
  for (const char of text) {
    const id = vocab.get(char) ?? vocab.get(UNK_TOKEN) ?? 0;
    tokens.push(id);
  }
  tokens.push(vocab.get(EOS_TOKEN) || 1);
  return tokens;
}

/**
 * Detokenize output tokens back to text
 */
function detokenize(tokens: number[], vocab: Map<string, number>): string {
  const idToToken = new Map<number, string>();
  vocab.forEach((id, token) => idToToken.set(id, token));
  return tokens
    .map(id => idToToken.get(id) || '')
    .filter(token => ![BOS_TOKEN, EOS_TOKEN, PAD_TOKEN].includes(token))
    .join('');
}

/**
 * Run correction on input text
 */
export async function correct(text: string): Promise<string> {
  if (!vocab || !session) {
    await initialize();
  }
  if (!vocab || !session) {
    throw new Error('Failed to initialize model');
  }

  const inputIds = tokenize(text, vocab);
  const attentionMask = inputIds.map(() => 1);

  // Create ONNX inputs
  const inputIdsTensor = new Tensor('int64', new BigInt64Array(inputIds.map(BigInt)), [1, inputIds.length]);
  const attentionMaskTensor = new Tensor('int64', new BigInt64Array(attentionMask.map(BigInt)), [1, attentionMask.length]);

  const feeds = {
    'input_ids': inputIdsTensor,
    'attention_mask': attentionMaskTensor,
  };

  const results = await session.run(feeds);
  const output = results['logits'];

  if (!output) {
    throw new Error('No output from model');
  }

  // Get predicted token ids
  const predictedIds: number[] = [];
  const dims = output.dims;
  const seqLen = dims[1];
  const vocabSize = dims[2];
  const data = output.data as Float32Array;

  for (let i = 0; i < seqLen; i++) {
    let maxLogit = -Infinity;
    let maxId = 0;
    for (let v = 0; v < vocabSize; v++) {
      const logit = data[i * vocabSize + v];
      if (logit > maxLogit) {
        maxLogit = logit;
        maxId = v;
      }
    }
    predictedIds.push(maxId);
  }

  return detokenize(predictedIds, vocab);
}

/**
 * Check if model is loaded
 */
export function isReady(): boolean {
  return vocab !== null && session !== null;
}

/**
 * Get loading status
 */
export function getLoadingStatus(): boolean {
  return loading;
}
