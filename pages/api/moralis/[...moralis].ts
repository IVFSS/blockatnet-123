import type { NextApiRequest, NextApiResponse } from 'next';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY || '';
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { moralis } = req.query;
  const path = Array.isArray(moralis) ? moralis.join('/') : moralis;

  if (!MORALIS_API_KEY) {
    return res.status(500).json({ error: 'MORALIS_API_KEY is not set. Please configure environment variables.' });
  }

  if (!path) {
    return res.status(400).json({ error: 'No Moralis API path specified' });
  }

  // Build query string (excluding 'moralis' from query params)
  const queryParams = { ...req.query };
  delete queryParams.moralis;
  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
  
  const url = `${MORALIS_BASE_URL}/${path}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: method || 'GET',
      headers: {
        'X-API-Key': MORALIS_API_KEY,
        'accept': 'application/json',
      },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Moralis API proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Moralis API' });
  }
}
