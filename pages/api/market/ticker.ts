import type { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from 'utils/rateLimit';
import { fetchTicker } from 'utils/ccxt';

export default withRateLimit(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol = 'BTC/USDT', exchange = 'binance' } = req.query;

    if (typeof symbol !== 'string' || symbol.length > 20) {
      return res.status(400).json({ error: 'Invalid symbol parameter' });
    }
    if (typeof exchange !== 'string' || exchange.length > 50) {
      return res.status(400).json({ error: 'Invalid exchange parameter' });
    }

    const ticker = await fetchTicker(symbol as string, exchange as string);

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json({ data: ticker });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Ticker error:', message);
    return res.status(500).json({ error: message });
  }
});
