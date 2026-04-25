type Network = 'mainnet' | 'testnet';

const BASE_URLS: Record<Network, string> = {
  mainnet: 'https://stellar.expert/explorer/public',
  testnet: 'https://stellar.expert/explorer/testnet',
};

/** Returns the Stellar Expert URL for the given transaction hash. */
export function txExplorerLink(txHash: string, network: Network = 'mainnet'): string {
  return `${BASE_URLS[network]}/tx/${txHash}`;
}

/** Returns the Stellar Expert URL for the given account address. */
export function accountExplorerLink(address: string, network: Network = 'mainnet'): string {
  return `${BASE_URLS[network]}/account/${address}`;
}
