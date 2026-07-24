import { describe, it, expect, vi } from 'vitest';
import { findDictionaryMatches } from '../matcher';

vi.mock('../dictionary', () => ({
  getMergedDictionary: () => Promise.resolve({
    '抓到': '查获',
    '当场抓到': '当场查获',
    'a': 'X',
    'ab': 'XY',
    '卖烟': '经营卷烟',
  }),
  getSortedKeywords: () => Promise.resolve(['当场抓到', '抓到', 'ab', 'a', '卖烟']),
}));

describe('matcher', () => {
  it('should find single word match', async () => {
    const matches = await findDictionaryMatches('我们抓到嫌疑人');
    expect(matches.length).toBe(1);
    expect(matches[0].text).toBe('抓到');
    expect(matches[0].replacement).toBe('查获');
  });

  it('should prioritize longer matches over shorter ones', async () => {
    const matches = await findDictionaryMatches('我们当场抓到嫌疑人');
    expect(matches.length).toBe(1);
    expect(matches[0].text).toBe('当场抓到');
    expect(matches[0].replacement).toBe('当场查获');
  });

  it('should not overlap matches', async () => {
    const matches = await findDictionaryMatches('abc');
    expect(matches.length).toBe(1);
    expect(matches[0].text).toBe('ab');
  });

  it('should find multiple non-overlapping matches', async () => {
    const matches = await findDictionaryMatches('我们抓到嫌疑人卖烟');
    expect(matches.length).toBe(2);
    expect(matches[0].text).toBe('抓到');
    expect(matches[1].text).toBe('卖烟');
  });
});
