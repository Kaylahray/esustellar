import { txExplorerLink, accountExplorerLink } from '@/utils/explorerLink';

describe('txExplorerLink', () => {
  it('returns a mainnet tx URL by default', () => {
    const url = txExplorerLink('abc123');
    expect(url).toBe('https://stellar.expert/explorer/public/tx/abc123');
  });

  it('returns a testnet tx URL when specified', () => {
    const url = txExplorerLink('abc123', 'testnet');
    expect(url).toBe('https://stellar.expert/explorer/testnet/tx/abc123');
  });
});

describe('accountExplorerLink', () => {
  it('returns a mainnet account URL by default', () => {
    const url = accountExplorerLink('GABC');
    expect(url).toBe('https://stellar.expert/explorer/public/account/GABC');
  });

  it('returns a testnet account URL when specified', () => {
    const url = accountExplorerLink('GABC', 'testnet');
    expect(url).toBe('https://stellar.expert/explorer/testnet/account/GABC');
  });
});
