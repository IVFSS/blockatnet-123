// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60;

const clients = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(handler: (...args: any[]) => any | Promise<any>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = (req.headers['x-forwarded-for'] as string) || (req.socket?.remoteAddress as string) || 'unknown';

    const now = Date.now();
    const client = clients.get(ip);

    if (client) {
      const timeElapsed = now - client.resetTime;
      if (timeElapsed > RATE_LIMIT_WINDOW) {
        client.count = 0;
        client.resetTime = now;
      } else if (client.count >= MAX_REQUESTS) {
        res.setHeader('Retry-After', String(Math.ceil((RATE_LIMIT_WINDOW - timeElapsed) / 1000)));
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
      }
      client.count++;
    } else {
      clients.set(ip, { count: 1, resetTime: now });
    }

    return handler(req, res);
  };
}

export default withRateLimit;
