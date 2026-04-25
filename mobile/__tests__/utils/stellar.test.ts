import { truncateAddress } from '@/utils/stellar';

describe('truncateAddress', () => {
  it('truncates a full Stellar address', () => {
    const address = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRST';
    const result = truncateAddress(address);
    expect(result).toBe('GABC...QRST');
  });

  it('returns the original string when too short', () => {
    expect(truncateAddress('GABC')).toBe('GABC');
    expect(truncateAddress('')).toBe('');
  });

  it('respects custom leading and trailing lengths', () => {
    const address = 'GABCDEFGHIJKLMNOP';
    expect(truncateAddress(address, 6, 6)).toBe('GABCDE...LMNOP'.slice(0, 6) + '...' + address.slice(-6));
  });
});
