/**
 * Moralis API Helper
 * Centralized API client with error handling, rate limiting, and retries.
 */

const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || process.env.MORALIS_API_KEY;
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

// Rate limiting
const rateLimiter = {
  tokens: 10, // max requests
  lastRefill: Date.now(),
  refillRate: 1000, // ms per token

  async acquire(): Promise<boolean> {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(10, this.tokens + Math.floor(elapsed / this.refillRate));
    this.lastRefill = now;

    if (this.tokens <= 0) {
      const waitTime = this.refillRate - (elapsed % this.refillRate);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.acquire();
    }

    this.tokens--;
    return true;
  },
};

// Retry helper
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  await rateLimiter.acquire();

  try {
    const response = await fetch(url, options);

    if (response.status === 429) {
      // Rate limited — wait and retry
      const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      if (retries > 0) {
        return fetchWithRetry(url, options, retries - 1);
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Validate API key
export function validateApiKey() {
  if (!MORALIS_API_KEY) {
    console.error('MORALIS_API_KEY is not set. Please add it to .env.local');
    return false;
  }
  return true;
}

// Get headers
function getHeaders(): HeadersInit {
  return {
    'accept': 'application/json',
    'X-API-Key': MORALIS_API_KEY || '',
  };
}

/**
 * Fetch wallet net worth
 */
export async function fetchNetWorth(address: string) {
  const url = `${MORALIS_BASE_URL}/wallets/${address}/net-worth?exclude_spam=true&exclude_unverified_contracts=true`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return data.total_networth_usd;
}

/**
 * Fetch top token movers (gainers/losers)
 */
export async function fetchTopMovers(showGainers: boolean) {
  const url = `${MORALIS_BASE_URL}/market-data/erc20s/top-movers`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return showGainers ? data.gainers : data.losers;
}

/**
 * Fetch token prices for a list of addresses
 */
export async function fetchTokenPrices(tokenAddresses: string[], chain = 'eth') {
  const addresses = tokenAddresses.join(',');
  const url = `${MORALIS_BASE_URL}/token_price/${chain}?addresses=${addresses}`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return data;
}

/**
 * Fetch wallet token balances
 */
export async function fetchWalletTokens(address: string, chain = 'eth') {
  const url = `${MORALIS_BASE_URL}/wallets/${address}/tokens?chain=${chain}&exclude_spam=true&exclude_unverified_contracts=true`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return data.result;
}

/**
 * Fetch transaction history
 */
export async function fetchTransactionHistory(address: string, fromDate: string, toDate: string) {
  const url = `${MORALIS_BASE_URL}/wallets/${address}/history?chain=eth&from_date=${fromDate}&to_date=${toDate}&include_internal_transactions=true&nft_metadata=true&order=DESC`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return data.result;
}

/**
 * Fetch block number for a date
 */
export async function fetchDateToBlock(date: number) {
  const url = `${MORALIS_BASE_URL}/dateToBlock?chain=eth&date=${date}`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return data.block;
}

/**
 * Fetch ERC20 token price
 */
export async function fetchTokenPrice(tokenAddress: string, chain = 'eth') {
  const url = `${MORALIS_BASE_URL}/erc20/${tokenAddress}/price?chain=${chain}`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return data;
}

/**
 * Fetch token list for a wallet (replaces /api/rating-coins and /api/coins-list)
 */
export async function fetchTokenList(address: string, chain = 'eth') {
  const url = `${MORALIS_BASE_URL}/wallets/${address}/tokens?chain=${chain}&exclude_spam=true&exclude_unverified_contracts=true`;
  const response = await fetchWithRetry(url, { method: 'GET', headers: getHeaders() });
  const data = await response.json();
  return data.result || [];
}
