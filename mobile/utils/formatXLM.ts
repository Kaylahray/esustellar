/**
 * Formats a raw XLM stroops value (or decimal amount) as a human-readable string.
 * Amounts are displayed with up to 7 decimal places, trailing zeros stripped.
 */
export function formatXLM(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 XLM';
  const formatted = num.toFixed(7).replace(/\.?0+$/, '');
  return `${formatted} XLM`;
}
