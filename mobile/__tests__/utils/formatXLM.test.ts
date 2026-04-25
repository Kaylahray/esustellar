import { formatXLM } from '@/utils/formatXLM';

describe('formatXLM', () => {
  it('formats an integer amount', () => {
    expect(formatXLM(100)).toBe('100 XLM');
  });

  it('formats a decimal amount, stripping trailing zeros', () => {
    expect(formatXLM(1.5)).toBe('1.5 XLM');
  });

  it('handles zero', () => {
    expect(formatXLM(0)).toBe('0 XLM');
  });

  it('formats a very small amount', () => {
    expect(formatXLM(0.0000001)).toBe('0.0000001 XLM');
  });

  it('handles a string input', () => {
    expect(formatXLM('25.5')).toBe('25.5 XLM');
  });

  it('returns 0 XLM for NaN input', () => {
    expect(formatXLM('abc')).toBe('0 XLM');
  });
});
