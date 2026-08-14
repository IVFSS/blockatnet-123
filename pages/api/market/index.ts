/**
 * Combined Market API
 * Merges Moralis on-chain data with CCXT exchange data.
 * Falls back to CCXT-only if Moralis is unavailable.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from 'utils/rateLimit';
import { fetchMarketTickers, fetchOHLCV } from 'utils/ccxt';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

async function fetchMoralisTopMovers(): Promise<unknown[] | null> {
  if (!MORALIS_API_KEY) return null;
  try {
    const res = await fetch(`${MORALIS_BASE_URL}/market-data/erc20s/top-movers`, {
      headers: { 'X-API-Key': MORALIS_API_KEY, accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.gainers || [];
  } catch {
    return null;
  }
}

export default withRateLimit(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type = 'tickers', symbol, limit = '50' } = req.query;
    const parsedLimit = Math.min(parseInt(limit as string, 10) || 50, 200);

    if (type !== 'tickers' && type !== 'ohlcv') {
      return res.status(400).json({ error: 'Invalid type. Use: tickers, ohlcv' });
    }

    if (type === 'tickers') {
      // Get CCXT tickers (exchange data)
      const ccxtTickers = await fetchMarketTickers('binance', parsedLimit);

      // Try to enrich with Moralis data
      const moralisMovers = await fetchMoralisTopMovers();
      const moralisMap = new Map<string, unknown>();
      if (moralisMovers && Array.isArray(moralisMovers)) {
        for (const mover of moralisMovers) {
          const m = mover as Record<string, unknown>;
          if (m.symbol) moralisMap.set((m.symbol as string).toUpperCase(), m);
        }
      }

      // Merge: CCXT as primary, enrich with Moralis where available
      const merged = ccxtTickers.map((ticker) => {
        const moralisData = moralisMap.get(ticker.base);
        const m = moralisData as Record<string, unknown> | undefined;
        return {
          ...ticker,
          // Use Moralis price if available (on-chain price can differ)
          usd_price_moralis: m ? (m.usd_price as number) : null,
          logo: m ? (m.logo as string) : null,
          name: m ? (m.name as string) : ticker.base,
        };
      });

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).json({ data: merged, sources: { ccxt: true, moralis: !!moralisMovers } });
    }

    if (type === 'ohlcv') {
      const symbolParam = (symbol as string) || 'BTC/USDT';
      if (typeof symbolParam !== 'string' || symbolParam.length > 20) {
        return res.status(400).json({ error: 'Invalid symbol parameter' });
      }
      const ohlcv = await fetchOHLCV(symbolParam, '1d', parsedLimit);
      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate');
      return res.status(200).json({ data: ohlcv });
    }

    return res.status(400).json({ error: 'Invalid type. Use: tickers, ohlcv' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Combined market API error:', message);
    return res.status(500).json({ error: message });
  }
});
