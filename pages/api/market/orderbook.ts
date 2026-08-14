import type { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from 'utils/rateLimit';
import { fetchOrderBook } from 'utils/ccxt';

export default withRateLimit(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol = 'BTC/USDT', limit = '20', exchange = 'binance' } = req.query;
    const parsedLimit = Math.min(parseInt(limit as string, 10) || 20, 100);

    if (typeof symbol !== 'string' || symbol.length > 20) {
      return res.status(400).json({ error: 'Invalid symbol parameter' });
    }
    if (typeof exchange !== 'string' || exchange.length > 50) {
      return res.status(400).json({ error: 'Invalid exchange parameter' });
    }

    const orderbook = await fetchOrderBook(symbol as string, parsedLimit, exchange as string);

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
    return res.status(200).json({ data: orderbook });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Order book error:', message);
    return res.status(500).json({ error: message });
  }
});
