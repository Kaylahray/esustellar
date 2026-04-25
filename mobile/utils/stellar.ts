/**
 * Truncates a Stellar address to the format GXXX...XXXX.
 * Returns the original string if it is too short to truncate.
 */
export function truncateAddress(address: string, leading = 4, trailing = 4): string {
  if (address.length <= leading + trailing) return address;
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}
