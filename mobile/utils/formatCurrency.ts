/**
 * Formats a numeric amount as a localized currency string.
 *
 * @param amount  - The numeric value to format.
 * @param currency - ISO 4217 currency code (default: 'USD').
 * @param locale   - BCP 47 locale tag (default: 'en-US').
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts an XLM amount to a fiat equivalent string using a provided rate.
 *
 * @param xlmAmount - Amount in XLM.
 * @param rate      - Fiat price per 1 XLM.
 * @param currency  - ISO 4217 code for the fiat currency.
 * @param locale    - BCP 47 locale tag.
 */
export function xlmToFiat(
  xlmAmount: number,
  rate: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return formatCurrency(xlmAmount * rate, currency, locale);
}
