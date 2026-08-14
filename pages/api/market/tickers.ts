import type { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from 'utils/rateLimit';
import { fetchMarketTickers } from 'utils/ccxt';

export default withRateLimit(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { exchange = 'binance', limit = '50' } = req.query;
    const parsedLimit = Math.min(parseInt(limit as string, 10) || 50, 200);

    if (typeof exchange !== 'string' || exchange.length > 50) {
      return res.status(400).json({ error: 'Invalid exchange parameter' });
    }

    const tickers = await fetchMarketTickers(exchange, parsedLimit);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({ data: tickers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Market tickers error:', message);
    return res.status(500).json({ error: message });
  }
});
