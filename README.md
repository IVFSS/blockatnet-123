# blockatnet

A modern crypto market dashboard with DeFi wallet integration, built with Next.js, Chakra UI, and CCXT.

## Live Demo

[https://blockatnet-123.vercel.app](https://blockatnet-123.vercel.app)

## Features

- **Wallet Connection** - Connect via MetaMask or other EVM wallets using wagmi + NextAuth + Moralis
- **Live Market Data** - Real-time crypto prices powered by CCXT (Binance, Coinbase, etc.)
- **Token Ratings** - TokenInsight rating widgets embedded via auto-resizing iframes
- **Portfolio Tracking** - Transaction history, token balances, NFT holdings
- **Price Alerts** - Set custom alerts for crypto price movements
- **Responsive Design** - Mobile-first with bouncy animated navigation
- **Dark Mode** - Full light/dark theme support with smooth transitions

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **UI**: Chakra UI + Framer Motion
- **Market Data**: CCXT (exchange data) + Moralis (on-chain data)
- **Wallet**: wagmi + NextAuth.js + Moralis Auth
- **Charts**: Chart.js + React Chart.js
- **Animations**: GSAP + Framer Motion
- **Deploy**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Moralis API key (get one at [admin.moralis.io](https://admin.moralis.io))

### Installation

```bash
# Clone the repository
git clone https://github.com/IVFSS/blockatnet-123.git
cd blockatnet-123

# Install dependencies
npm install --legacy-peer-deps

# Create .env.local with your environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
# Moralis API key (required for wallet features)
MORALIS_API_KEY=your_moralis_api_key

# NextAuth (required for wallet authentication)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# TokenInsight API key (for token ratings)
TOKENINSIGHT_API_KEY=your_tokeninsight_api_key
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Check formatting
npm run format:check
```

## Project Structure

```
├── pages/
│   ├── api/
│   │   ├── market/          # CCXT market data API routes
│   │   │   ├── index.ts     # Combined market endpoint
│   │   ├── moralis/         # Moralis API proxy
│   │   └── auth/            # NextAuth endpoints
│   ├── index.tsx            # Home page
│   ├── alert.tsx            # Price alert system
│   ├── track.tsx            # Portfolio tracking
│   ├── transactions.tsx     # Transaction history
│   ├── balances/            # Token/NFT balances
│   └── transfers/           # Token/NFT transfers
├── src/
│   ├── components/
│   │   ├── layout/          # BouncyNav, Hero, Footer, etc.
│   │   ├── modules/         # ConnectButton, Footer
│   │   ├── elements/        # Logo, ColorModeButton
│   │   ├── particles/       # Canvas-based particles background
│   │   └── templates/       # Page templates (Cryptocurrencies, Alert, Track)
│   ├── theme/               # Coinbase-style color scheme
│   ├── utils/               # API helpers, animations, rate limiting
│   └── types/               # TypeScript type definitions
```

## API Routes

All market data routes include rate limiting (60 req/min per IP) and input validation:

- `GET /api/market?type=tickers` - Fetch market tickers (CCXT)
- `GET /api/market?type=ohlcv&symbol=BTC/USDT` - Fetch OHLCV data
- `GET /api/market/tickers?exchange=binance&limit=50` - Exchange tickers
- `GET /api/market/ticker?symbol=BTC/USDT` - Single token ticker
- `GET /api/market/orderbook?symbol=BTC/USDT` - Order book data
- `GET /api/moralis/*` - Moralis API proxy (avoids exposing API keys client-side)

## Pages

| Route                  | Description                          |
|------------------------|--------------------------------------|
| `/`                    | Home page with market overview       |
| `/Cryptocurrencies`    | Token list with charts & ratings     |
| `/alert`               | Price alert creation & management    |
| `/track`               | Portfolio performance visualization  |
| `/transactions`        | Transaction history                |
| `/balances/erc20`      | ERC20 token balances                |
| `/balances/nft`        | NFT holdings                        |
| `/transfers/erc20`     | ERC20 transfer history             |
| `/transfers/nft`       | NFT transfer history               |

## Design System

- **Colors**: Coinbase blue (#0052FF), dark mode backgrounds
- **Typography**: Inter font family
- **Animations**: Spring-based (Framer Motion) + scroll-triggered (GSAP)

## Deploy

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IVFSS/blockatnet-123.git&env=MORALIS_API_KEY,NEXTAUTH_SECRET,NEXTAUTH_URL,TOKENINSIGHT_API_KEY)

Or manually:
```bash
npm run build
npx vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Acknowledgments

- [CCXT](https://github.com/ccxt/ccxt) for exchange market data
- [Moralis](https://moralis.io/) for Web3 API infrastructure
- [TokenInsight](https://www.tokeninsight.com/) for token ratings
- [Framer Motion](https://www.framer.com/motion/) for animations