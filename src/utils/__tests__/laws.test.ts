import { describe, it, expect } from 'vitest';
import { parseLawReferences } from '../laws';

describe('laws parser', () => {
  it('should parse 《烟草专卖法》第三十一条', () => {
    const text = '根据《烟草专卖法》第三十一条规定';
    const result = parseLawReferences(text);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('烟草专卖法');
    expect(result[0].article).toBe('31');
  });

  it('should parse 烟草专卖法第三十一条 without brackets', () => {
    const text = '根据烟草专卖法第三十一条规定';
    const result = parseLawReferences(text);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('烟草专卖法');
    expect(result[0].article).toBe('31');
  });

  it('should parse chinese numerals', () => {
    const text = '《烟草专卖法》第三条';
    const result = parseLawReferences(text);
    expect(result.length).toBe(1);
    expect(result[0].article).toBe('3');
  });

  it('should find multiple laws', () => {
    const text = '根据《烟草专卖法》第三十一条和《实施条例》第二十三条';
    const result = parseLawReferences(text);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('烟草专卖法');
    expect(result[1].name).toBe('实施条例');
  });
});
