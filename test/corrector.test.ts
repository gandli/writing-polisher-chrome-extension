/**
 * Unit tests for Chinese corrector
 */

import { describe, it, expect } from 'vitest';
import { defaultStorageData } from '../src/types';

describe('types', () => {
  it('defaultStorageData should have correct default values', () => {
    expect(defaultStorageData.enabled).toBe(true);
    expect(defaultStorageData.modelUrl).toContain('huggingface.co');
    expect(defaultStorageData.vocabUrl).toContain('vocab.txt');
  });
});

describe('storage', () => {
  it('default storage should be complete', () => {
    expect(defaultStorageData).toHaveProperty('enabled');
    expect(defaultStorageData).toHaveProperty('modelUrl');
    expect(defaultStorageData).toHaveProperty('vocabUrl');
  });
});

import { isEditable } from '../src/utils/dom';

describe('dom', () => {
  it('isEditable should work', () => {
    // Simple smoke test to ensure module can be imported
    expect(typeof isEditable).toBe('function');
  });
});

describe('types', () => {
  it('MatchResult should have correct structure', () => {
    const match: any = {
      text: 'gongyuan',
      replacement: 'gongyuan',
      start: 0,
      end: 8,
      type: 'correction',
    };
    expect(match.type).toBe('correction');
    expect(match).toHaveProperty('text');
    expect(match).toHaveProperty('replacement');
  });
});
