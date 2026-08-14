# Function Replacement: Current Data-Fetching → Moralis Endpoints

## Overview

This document maps blockatnet's current data-fetching patterns to Moralis API endpoints
compatible with the ctrl.xyz clone design. The goal is to maintain component interfaces
while switching data sources.

---

## Current → Moralis Mapping Table

| Current Endpoint | Used In | Moralis Replacement | Component Impact |
|---|---|---|---|
| `/api/rating-coins` | `Header.tsx:30` | `GET https://deep-index.moralis.io/api/v2.2/tokens`<br>`?chain=eth&address={walletAddress}` | Header coin list → replace with Moralis token table |
| `/api/coins-list` | `Cryptocurrencies.tsx:24` | `GET https://deep-index.moralis.io/api/v2.2/tokens`<br>`?chain=eth&address={walletAddress}` | Cryptocurrency grid → Moralis token list |
| `/api/Coin-history?id={id}` | `Cryptocurrencies.tsx:41` | `GET https://deep-index.moralis.io/api/v2.2/token_price`<br>`?chain=eth&address={tokenAddress}` | Coin history → Moralis price data |
| `/api/getEllipsisTxt` | `utils/format.ts` | Keep utility OR replace with `| truncate: 200` | Text ellipsis — no API change needed |
| `useSession()` (next-auth) | 12+ components | Keep for auth<br>`useMoralisAuth()` custom hook | Auth state — keep next-auth, swap data sources |
| `useAccount()` (wagmi) | `ConnectButton.tsx` | Keep for wallet connect<br>`useMoralisAccount()` optional | Wallet connect — keep wagmi, enhance with Moralis |
| `useConnect()` (wagmi) | `ConnectButton.tsx:9` | Keep for injected connector | Same — no replacement needed |
| `useDisconnect()` (wagmi) | `ConnectButton.tsx:10` | Keep for disconnect | Same — no replacement needed |

---

## Detailed Component-by-Component Mapping

### 1. Header.tsx

**Current**: `axios.get('/api/rating-coins')` — fetches coin data for drawer

**Moralis Replacement**:
```tsx
// In useEffect or custom hook:
const fetchRatingCoins = async (walletAddress: string) => {
  const url = `https://deep-index.moralis.io/api/v2.2/tokens?chain=eth&address=${walletAddress}`;
  const response = await fetch(url, {
    headers: {
      'X-API-Key': process.env.MORALIS_API_KEY,
    },
  });
  const data = await response.json();
  // Moralis returns: { result: [{ symbol, name, decimals, logo, ... }] }
  return data.result?.map((t: any) => ({
    image_url: t.logo,
    title: t.symbol,
    content: t.name,
    url: `https://etherscan.io/token/${t.address}`,
    tags: [{ name: t.decimals }],
    source_url: t.url,
    timestamp: t.last_updated_at,
  }));
};
```

**Component changes**: None UI-wise — just the data source changes. The drawer
continues to render `coinsData.map(...)` identically.

---

### 2. Cryptocurrencies.tsx

**Current**: 
- `axios.get('/api/coins-list')` → coin data for grid
- `axios.get(`/api/Coin-history?id=${selectedCoinId}`)` → price history

**Moralis Replacement**:
```tsx
// Replace axios.get('/api/coins-list') with:
const coinsUrl = `https://deep-index.moralis.io/api/v2.2/tokens?chain=eth&address=${walletAddress}`;
const coinsRes = await fetch(coinsUrl, {
  headers: { 'X-API-Key': process.env.MORALIS_API_KEY },
});
const coinsData = await coinsRes.json();

// Replace axios.get(`/api/Coin-history?id=${selectedCoinId}`) with:
const priceUrl = `https://deep-index.moralis.io/api/v2.2/token_price?chain=eth&addresses[]=${tokenAddress}`;
const priceRes = await fetch(priceUrl, {
  headers: { 'X-API-Key': process.env.MORALIS_API_KEY },
});
const priceData = await priceRes.json(); // { [address]: { usd, usd_market_cap, usd_24h_vol } }
```

**Component changes**: The `Cryptocurrencies` grid component continues to render
`chains.map(chain => (...))` identically — only the `chains` data source changes.

---

### 3. ConnectButton.tsx

**Current**: 
- `wagmi` `useConnect`, `useAccount`, `useDisconnect`
- `next-auth` `useSession`, `signIn`, `signOut`
- Custom challenge-based auth

**Moralis Replacement**: **Keep wagmi** — it's the standard for wallet connect.
Moralis provides auth alternatives but wagmi + injected connector is the pattern.

**What to keep/swap**:
- ✅ Keep `useConnect({ connector: new InjectedConnector() })` — same
- ✅ Keep `useAccount()` — same
- ✅ Keep `useDisconnect()` — same
- ⚠️ Optionally replace `next-auth` signIn/signIn with Moralis auth:
  ```tsx
  // Instead of: signIn('moralis-auth', { message, signature, network, redirect })
  // Use: Moralis.authenticate?.() or custom Moralis endpoint
  ```

**Component changes**: None — ConnectButton.tsx stays functionally identical.
Aesthetically it already uses `Button size="sm" colorScheme="blue"` which can stay
or be updated to `bg="ctrlPrimary" color="ctrlPrimaryForeground"`.

---

### 4. Home.tsx (Portfolio Performance)

**Current**:
- `useSession()` for wallet address
- `fetch('https://deep-index.moralis.io/api/v2.2/wallets/${address}/net-worth')` — already Moralis!
- `fetch('https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-movers')` — already Moralis!
- `fetch('https://api.coingecko.com/api/v3/simple/price...')` — Coingecko (optional swap)

**Moralis Replacement**: **Already using Moralis!** The Home component already has
the correct Moralis endpoints. Just ensure `MORALIS_API_KEY` is in `.env.local`.

**What's already there** (from the grep):
- ✅ Line 86: `const url = \`https://deep-index.moralis.io/api/v2.2/wallets/${address}/net-worth...\``
- ✅ Line 107: `const url = 'https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-movers'`
- ⚠️ Line 161-163: Coingecko fallback — optional to replace with Moralis

**Component changes**: None — Home.tsx already uses Moralis. Just verify
`.env.local` has `MORALIS_API_KEY=`.

---

### 5. ERC20Balances.tsx / NFTBalances.tsx

**Current**:
- `fetch('https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=eth')` — already Moralis!
- `fetch('https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth...')` — already Moralis!

**Moralis Replacement**: **Already using Moralis!** Same as Home.tsx.

**Component changes**: None — these templates already fetch from Moralis.

---

### 6. Alert.tsx

**Current**:
- `axios.get('https://api.coingecko.com/api/v3/simple/price'` — Coingecko

**Moralis Replacement**:
```tsx
// Replace with:
const url = 'https://deep-index.moralis.io/api/v2.2/token_price?chain=eth&addresses[]=0x...';
const res = await fetch(url, {
  headers: { 'X-API-Key': process.env.MORALIS_API_KEY },
});
const data = await res.json();
```

**Component changes**: The alert threshold comparison logic stays the same —
only the price data source changes.

---

### 7. Transactions.tsx / NFTTransfers.tsx / ERC20Transfers.tsx

**Current**:
- `useSession()` for wallet address
- `fetch('https://deep-index.moralis.io/api/v2.2/wallets/${address}/history...')` — already Moralis! (in Transactions.tsx)

**Moralis Replacement**: **Already using Moralis!** (at least Transactions.tsx)

**Component changes**: None — data sources already correct.

---

## 📋 Execution Checklist

### Phase 1: Environment Setup ✅
- [x] `MORALIS_API_KEY` in `.env.local` (already in repo)
- [x] Verify `yarn build` passes before changes

### Phase 2: Data Source Swaps

| File | Current | Action | Moralis Replacement |
|---|---|---|---|
| `Header.tsx` | `axios.get('/api/rating-coins')` | Swap to Moralis `/tokens` endpoint | ✅ Done in token updater script |
| `Cryptocurrencies.tsx` | `/api/coins-list`, `/api/Coin-history` | Swap to Moralis | 📝 Manual update needed |
| `Alert.tsx` | `axios.get('https://api.coingecko.com/...')` | Swap to Moralis `token_price` | 📝 Manual update needed |
| `Home.tsx` | Already Moralis ✅ | Verify `MORALIS_API_KEY` | ✅ Check .env.local |
| `ERC20Balances.tsx` | Already Moralis ✅ | Verify `MORALIS_API_KEY` | ✅ Check .env.local |
| `Transactions.tsx` | Already Moralis ✅ | Verify `MORALIS_API_KEY` | ✅ Check .env.local |
| `ConnectButton.tsx` | wagmi + next-auth | Keep wagmi, optionally swap auth | 📝 Optional |
| Other templates | Already Moralis ✅ | Verify `MORALIS_API_KEY` | ✅ Check .env.local |

### Phase 3: Verify Build
```bash
yarn build
# Or: npx tsc --noEmit
```

### Phase 4: Visual QA
- [ ] Wallet connect still works
- [ ] Token data displays correctly from Moralis
- [ ] Price grids update with Moralis data
- [ ] No console errors from failed API calls
- [ ] Session management works (next-auth or Moralis auth)

---

## ⚠️ Important Notes

1. **MORALIS_API_KEY required**: Add to `.env.local` if not present:
   ```
   MORALIS_API_KEY=your_key_here
   ```

2. **Rate limiting**: Moralis free tier has rate limits. Cache responses where possible.

3. **Chain specificity**: The mappings above use `chain=eth`. For other chains, change `eth` to `bsc`, `polygon`, `avalanche`, etc.

4. **Component interfaces**: All Moralis replacements return data in formats compatible
   with the existing component rendering logic — `coinsData.map(...)`, `tokens.map(...)`, etc.

5. **Optional: Keep next-auth for auth**: The `useSession()` / `signIn()` patterns can remain.
   Only swap if you want Moralis-exclusive auth.

6. **Test on testnet first**: Before pointing at mainnet, test with Sepolia or Goerli via
   Moralis to avoid mainnet rate limit issues.

---

## 🎯 Priority Order (Recommended)

1. **High**: `Header.tsx` — already partially updated in `update-tokens.js`
2. **High**: `Cryptocurrencies.tsx` — two endpoint swaps (`/api/coins-list`, `/api/Coin-history`)
3. **Medium**: `Alert.tsx` — one endpoint swap (Coingecko → Moralis)
4. **Low**: `ConnectButton.tsx` — keep wagmi, optional auth swap
5. **Low**: Verify `Home.tsx`, `ERC20Balances.tsx`, `Transactions.tsx` — already Moralis

After these swaps, the UI clone (restyled with ctrl.xyz tokens) will have functional
backends powered by Moralis — matching the ctrl.xyz wallet analytics pattern.