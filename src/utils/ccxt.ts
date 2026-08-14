// @ts-nocheck
/**
 * CCXT Market Data Utility
 * Provides free exchange data (prices, OHLCV, order books) via CCXT.
 * No API key required — uses public exchange endpoints.
 * Tries multiple exchanges with fallback for regional restrictions.
 */

import ccxt from 'ccxt';

// Priority-ordered list of exchanges (fallback chain)
const EXCHANGE_PRIORITY = ['binance', 'kraken', 'kucoin', 'coinbase', 'bybit', 'okx'];
const DEFAULT_EXCHANGE = 'binance';

function getExchange(exchangeId: string) {
  const ExchangeClass = (ccxt as any)[exchangeId];
  if (!ExchangeClass) {
    throw new Error(`Exchange ${exchangeId} not supported`);
  }
  return new ExchangeClass({ enableRateLimit: true });
}

/**
 * Try fetching from multiple exchanges with fallback
 */
async function tryWithFallback<ReturnType>(
  operation: string,
  fn: (exchangeId: string) => Promise<ReturnType>
): Promise<ReturnType> {
  const errors: string[] = [];
  for (const exchangeId of EXCHANGE_PRIORITY) {
    try {
      return await fn(exchangeId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`${operation} failed on ${exchangeId}: ${msg}`);
      errors.push(`${exchangeId}: ${msg}`);
    }
  }
  throw new Error(`All exchanges failed for ${operation}. Errors: ${errors.join('; ')}`);
}

/**
 * Fetch top market tickers (price, volume, 24h change)
 */
export async function fetchMarketTickers(
  exchangeId: string = DEFAULT_EXCHANGE,
  limit = 50
): Promise<Array<{
  symbol: string; base: string; quote: string; price: number;
  volume24h: number; change24h: number; high24h: number; low24h: number; timestamp: number;
}>> {
  // Try the specified exchange first, then fallback
  const exchangesToCheck = [exchangeId, ...EXCHANGE_PRIORITY.filter(e => e !== exchangeId)];

  const errors: string[] = [];
  for (const exId of exchangesToCheck) {
    try {
      const exchange = getExchange(exId);
      await exchange.loadMarkets();
      const tickers = await exchange.fetchTickers();
      const usdtPairs = Object.values(tickers)
        .filter((t: any) => t.symbol && t.symbol.endsWith('/USDT') && t.last && t.last > 0)
        .sort((a: any, b: any) => (b.quoteVolume || 0) - (a.quoteVolume || 0))
        .slice(0, limit);

      return usdtPairs.map((t: any) => ({
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${exId}: ${msg}`);
    }
  }
  throw new Error(`All exchanges failed for tickers. Errors: ${errors.join('; ')}`);
}

/**
 * Fetch OHLCV (candlestick) data
 */
export async function fetchOHLCV(
  symbol: string,
  timeframe = '1d',
  limit = 30,
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<Array<{ timestamp: number; open: number; high: number; low: number; close: number; volume: number }>> {
  return tryWithFallback('OHLCV', async (exId) => {
    const exchange = getExchange(exId);
    const normalizedSymbol = symbol.includes('/') ? symbol : `${symbol}/USDT`;
    const ohlcv = await exchange.fetchOHLCV(normalizedSymbol, timeframe, undefined, limit);
    return ohlcv.map((candle: any) => ({
      timestamp: candle[0],
      open: candle[1], high: candle[2], low: candle[3],
      close: candle[4], volume: candle[5],
    }));
  });
}

/**
 * Fetch order book for a symbol
 */
export async function fetchOrderBook(
  symbol: string,
  limit = 20,
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<{ bids: Array<[number, number]>; asks: Array<[number, number]>; timestamp: number }> {
  return tryWithFallback('OrderBook', async (exId) => {
    const exchange = getExchange(exId);
    const normalizedSymbol = symbol.includes('/') ? symbol : `${symbol}/USDT`;
    const orderbook = await exchange.fetchOrderBook(normalizedSymbol, limit);
    return {
      bids: orderbook.bids as Array<[number, number]>,
      asks: orderbook.asks as Array<[number, number]>,
      timestamp: orderbook.timestamp || Date.now(),
    };
  });
}

/**
 * Fetch single ticker for a symbol
 */
export async function fetchTicker(
  symbol: string,
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<{ symbol: string; price: number; volume24h: number; change24h: number; high24h: number; low24h: number; bid: number; ask: number; timestamp: number }> {
  return tryWithFallback('Ticker', async (exId) => {
    const exchange = getExchange(exId);
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
  });
}

/**
 * Fetch list of supported trading pairs for an exchange
 */
export async function fetchMarkets(
  exchangeId: string = DEFAULT_EXCHANGE
): Promise<Array<{ symbol: string; base: string; quote: string; active: boolean }>> {
  return tryWithFallback('Markets', async (exId) => {
    const exchange = getExchange(exId);
    const markets = await exchange.loadMarkets();
    return Object.values(markets)
      .filter((m: any) => m.active && m.quote === 'USDT')
      .map((m: any) => ({ symbol: m.symbol, base: m.base, quote: m.quote, active: m.active }));
  });
}

export default { fetchMarketTickers, fetchOHLCV, fetchOrderBook, fetchTicker, fetchMarkets };
