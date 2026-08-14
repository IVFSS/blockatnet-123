// @ts-nocheck
/**
 * CCXT Market Data Utility
 * Provides free exchange data (prices, OHLCV, order books) via CCXT.
 * No API key required — uses public exchange endpoints.
 */

import ccxt from 'ccxt';

// Default exchange (Binance has the best free public API)
const DEFAULT_EXCHANGE = 'binance';

function getExchange(exchangeId: string = DEFAULT_EXCHANGE) {
  const ExchangeClass = (ccxt as any)[exchangeId];
  if (!ExchangeClass) {
    throw new Error(`Exchange ${exchangeId} not supported`);
  }
  return new ExchangeClass({ enableRateLimit: true });
}

/**
 * Fetch top market tickers (price, volume, 24h change)
 * Returns array of { symbol, price, volume24h, change24h, high24h, low24h }
 */
export async function fetchMarketTickers(
  exchangeId: string = DEFAULT_EXCHANGE,
  limit = 50
): Promise<Array<{
  symbol: string;
  base: string;
  quote: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}>> {
  const exchange = getExchange(exchangeId);
  await exchange.loadMarkets();

  const tickers = await exchange.fetchTickers();
  const usdtPairs = Object.values(tickers)
    .filter((t) => t.symbol.endsWith('/USDT') && t.last && t.last > 0)
    .sort((a, b) => (b.quoteVolume || 0) - (a.quoteVolume || 0))
    .slice(0, limit);

  return usdtPairs.map((t) => ({
    symbol: t.symbol,
    base: t.symbol.split('/')[0],
    quote: t.symbol.split('/')[1],
    price: t.last || 0,
    volume24h: t.quoteVolume || 0,
    change24h: t.percentage || 0,
    high24h: t.high || 0,
    low24h: t.low || 0,
    timestamp: t.timestamp || Date.now(),
  }));
}

/**
 * Fetch OHLCV (candlestick) data
 * Returns array of { timestamp, open, high, low, close, volume }
 */
export async function fetchOHLCV(
  symbol: string,
  timeframe = '1d',
  limit = 30,
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<Array<{
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}>> {
  const exchange = getExchange(exchangeId);
  const normalizedSymbol = symbol.includes('/') ? symbol : `${symbol}/USDT`;

  const ohlcv = await exchange.fetchOHLCV(normalizedSymbol, timeframe, undefined, limit);

  return ohlcv.map((candle) => ({
    timestamp: candle[0],
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
    volume: candle[5],
  }));
}

/**
 * Fetch order book for a symbol
 */
export async function fetchOrderBook(
  symbol: string,
  limit = 20,
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<{
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
  timestamp: number;
}> {
  const exchange = getExchange(exchangeId);
  const normalizedSymbol = symbol.includes('/') ? symbol : `${symbol}/USDT`;

  const orderbook = await exchange.fetchOrderBook(normalizedSymbol, limit);

  return {
    bids: orderbook.bids as Array<[number, number]>,
    asks: orderbook.asks as Array<[number, number]>,
    timestamp: orderbook.timestamp || Date.now(),
  };
}

/**
 * Fetch single ticker for a symbol
 */
export async function fetchTicker(
  symbol: string,
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<{
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  timestamp: number;
}> {
  const exchange = getExchange(exchangeId);
  const normalizedSymbol = symbol.includes('/') ? symbol : `${symbol}/USDT`;

  const ticker = await exchange.fetchTicker(normalizedSymbol);

  return {
    symbol: ticker.symbol,
    price: ticker.last || 0,
    volume24h: ticker.quoteVolume || 0,
    change24h: ticker.percentage || 0,
    high24h: ticker.high || 0,
    low24h: ticker.low || 0,
    bid: ticker.bid || 0,
    ask: ticker.ask || 0,
    timestamp: ticker.timestamp || Date.now(),
  };
}

/**
 * Fetch list of supported trading pairs for an exchange
 */
export async function fetchMarkets(
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<Array<{
  symbol: string;
  base: string;
  quote: string;
  active: boolean;
}>> {
  const exchange = getExchange(exchangeId);
  const markets = await exchange.loadMarkets();

  return Object.values(markets)
    .filter((m) => m.active && m.quote === 'USDT')
    .map((m) => ({
      symbol: m.symbol,
      base: m.base,
      quote: m.quote,
      active: m.active,
    }));
}
