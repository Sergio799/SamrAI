# 📚 Technical Documentation - SamrAI

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Modules](#core-modules)
3. [API Reference](#api-reference)
4. [Data Flow](#data-flow)
5. [Deployment](#deployment)

## Architecture Overview

### Technology Stack

**Frontend**
- Next.js 15.5.6 (App Router, Server Components)
- React 18.3.1
- TypeScript 5
- Tailwind CSS 3.4.1
- Shadcn/ui (Radix UI primitives)

**AI & Backend**
- Genkit 1.0.1
- Google Gemini 2.0 Flash
- Zod 3.24.2 (validation)
- Zustand 5.0.8 (state management)

**Data & Charts**
- Yahoo Finance API
- Recharts 2.15.1
- Date-fns 3.6.0

**Authentication**
- Clerk 5.2.8

### Project Structure

```
samrai-dashboard/
├── src/
│   ├── ai/                    # AI flows and configuration
│   │   ├── flows/
│   │   │   ├── advisor-flow.ts
│   │   │   └── panic-selling-flow.ts
│   │   └── genkit.ts
│   ├── app/                   # Next.js app router
│   │   ├── dashboard/         # Main application
│   │   ├── api/              # API routes
│   │   ├── sign-in/          # Auth pages
│   │   └── sign-up/
│   ├── components/            # React components
│   │   ├── dashboard/        # Dashboard-specific
│   │   ├── providers/        # Context providers
│   │   └── ui/              # Shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── data-pipeline.ts  # Data fetching
│   │   ├── stock-api.ts      # Real-time API
│   │   ├── news-api.ts       # News aggregation
│   │   ├── cache.ts          # Caching
│   │   ├── financial-formulas.ts
│   │   └── trade-history.ts
│   └── quant/                # Quantitative engine
│       ├── core/
│       │   └── risk-metrics.ts
│       └── insights-engine.ts
├── public/                   # Static assets
└── docs/                     # Documentation
```

## Core Modules

### 1. AI Advisor (`src/ai/flows/advisor-flow.ts`)

**Purpose**: Main AI investment advisor with quantitative analysis

**Key Functions**:
```typescript
export async function advise(history: any): Promise<string>
```

**Features**:
- Natural language understanding
- Real-time data integration
- Quantitative metrics calculation
- News context integration
- Strategic recommendations

**Data Flow**:
1. Parse user query
2. Fetch real-time prices
3. Fetch relevant news (if needed)
4. Generate quantitative insights
5. Build comprehensive prompt
6. Generate AI response

**Dependencies**:
- `@/ai/genkit` - AI configuration
- `@/lib/stock-api` - Price & news data
- `@/quant/insights-engine` - Quantitative analysis
- `zod` - Input validation

### 2. Quantitative Engine (`src/quant/`)

#### Risk Metrics (`core/risk-metrics.ts`)

**Calculations**:
```typescript
// Risk-adjusted returns
calculateSharpeRatio(returns, riskFreeRate): number
calculateSortinoRatio(returns, targetReturn, riskFreeRate): number
calculateTreynorRatio(portfolioReturn, beta, riskFreeRate): number

// Market correlation
calculateBeta(stockReturns, marketReturns): number
calculateAlpha(stockReturn, beta, marketReturn, riskFreeRate): number

// Downside risk
calculateVaR(returns, confidence, portfolioValue): number
calculateCVaR(returns, confidence, portfolioValue): number
calculateMaxDrawdown(prices): DrawdownResult

// Volatility
calculateVolatility(returns, annualize): number

// Comprehensive analysis
calculateAllRiskMetrics(prices, marketPrices, riskFreeRate): RiskMetrics
```

**Formulas**:
- **Sharpe Ratio**: `(Return - RiskFreeRate) / Volatility`
- **Beta**: `Covariance(Stock, Market) / Variance(Market)`
- **Alpha**: `ActualReturn - (RiskFreeRate + Beta * (MarketReturn - RiskFreeRate))`
- **VaR**: Percentile-based loss estimation
- **Max Drawdown**: Peak-to-trough decline

#### Insights Engine (`insights-engine.ts`)

**Purpose**: Generate strategic insights from quantitative metrics

**Main Function**:
```typescript
export async function generateQuantitativeInsights(
  portfolio: Asset[]
): Promise<QuantitativeInsights>
```

**Process**:
1. Fetch historical data for all holdings
2. Calculate portfolio-level metrics
3. Analyze individual holdings
4. Generate insights (opportunities, risks, anomalies)
5. Detect market regime
6. Format for AI consumption

**Output**:
```typescript
interface QuantitativeInsights {
  portfolio: {
    totalValue: number;
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    var95: number;
    beta: number;
    alpha: number;
    volatility: number;
    diversificationScore: number;
  };
  holdings: Array<{
    symbol: string;
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    confidence: number;
    // ... metrics
  }>;
  insights: Array<{
    type: 'opportunity' | 'risk' | 'anomaly' | 'rebalance';
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    mathematicalBasis: string;
    recommendation?: string;
  }>;
  marketContext: {
    regime: 'bull' | 'bear' | 'sideways';
    volatility: 'low' | 'medium' | 'high';
    sentiment: string;
  };
}
```

### 3. Data Pipeline (`src/lib/data-pipeline.ts`)

**Purpose**: Fetch comprehensive market data from Yahoo Finance

**Key Functions**:
```typescript
// Historical OHLCV data
fetchHistoricalData(symbol, period, interval): Promise<OHLCVData[]>

// Market benchmark (S&P 500)
fetchMarketBenchmark(period): Promise<OHLCVData[]>

// Risk-free rate (10-year Treasury)
fetchRiskFreeRate(): Promise<number>

// Market data (quote + stats)
fetchMarketData(symbol): Promise<MarketData>

// Fundamental data
fetchFundamentals(symbol): Promise<FundamentalData>

// Comprehensive fetch
fetchAllPortfolioData(symbols): Promise<PortfolioData>
```

**Data Structures**:
```typescript
interface OHLCVData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

interface FundamentalData {
  revenue: number;
  netIncome: number;
  eps: number;
  pe: number;
  pb: number;
  roe: number;
  debtToEquity: number;
  // ... more metrics
}
```

**Performance**:
- Parallel requests for all symbols
- ~2-3 seconds for 10 stocks
- No rate limiting (Yahoo Finance)

### 4. Stock API (`src/lib/stock-api.ts`)

**Purpose**: Real-time prices and news

**Functions**:
```typescript
// Real-time prices
fetchYahooPrice(symbol): Promise<number | null>
fetchStockPriceWithFallback(symbol): Promise<number | null>
updatePortfolioWithRealPrices(portfolio): Promise<Asset[]>

// News
fetchYahooNews(symbol): Promise<NewsArticle[]>
fetchMarketNews(): Promise<NewsArticle[]>
fetchPortfolioNews(symbols): Promise<Map<string, NewsArticle[]>>
```

**Fallback Strategy**:
1. Try Yahoo Finance (primary)
2. Try Alpha Vantage (if API key available)
3. Try Finnhub (if API key available)
4. Return null (use cached data)

### 5. Utility Modules

#### Cache (`src/lib/cache.ts`)
```typescript
class Cache {
  set<T>(key: string, data: T, ttlMinutes: number): void
  get<T>(key: string): T | null
  has(key: string): boolean
  clear(): void
  delete(key: string): void
}

export const cache = new Cache();
```

#### Trade History (`src/lib/trade-history.ts`)
```typescript
interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  date: string;
  notes?: string;
}

addTrade(trade): Trade
getTradeHistory(): TradeHistory
deleteTrade(tradeId): void
getTradesBySymbol(symbol): Trade[]
calculateAverageCost(symbol): number
```

#### Financial Formulas (`src/lib/financial-formulas.ts`)
```typescript
// Growth
calculateCompoundAnnualGrowthRate(start, end, years): number
calculateSimpleReturn(start, end): number

// Valuation
calculatePriceToEarnings(price, eps): number
calculatePriceToBook(price, bookValue): number
calculateDividendYield(dividend, price): number

// Profitability
calculateReturnOnEquity(netIncome, equity): number
calculateReturnOnAssets(netIncome, assets): number

// Formatting
formatCurrency(value): string
formatLargeNumber(value): string
```

## API Reference

### Internal APIs (`src/app/api/`)

#### `/api/stock-price`
```typescript
GET /api/stock-price?symbol=AAPL
Response: { price: number, change: number }
```

#### `/api/stock-prices`
```typescript
POST /api/stock-prices
Body: { symbols: string[] }
Response: { [symbol: string]: number }
```

#### `/api/stock-search`
```typescript
GET /api/stock-search?q=apple
Response: { results: SearchResult[] }
```

#### `/api/health`
```typescript
GET /api/health
Response: { status: 'ok', timestamp: string }
```

### External APIs

#### Yahoo Finance
```
Base URL: https://query1.finance.yahoo.com

Endpoints:
- /v8/finance/chart/{symbol}?interval=1d&range=1y
- /v10/finance/quoteSummary/{symbol}?modules=price,summaryDetail
- /v1/finance/search?q={query}&newsCount=5
```

**Rate Limits**: None (unlimited, free)

#### Google Gemini (via Genkit)
```
Model: googleai/gemini-2.0-flash-exp
Rate Limit: 15 requests/minute (free tier)
```

## Data Flow

### Portfolio Analysis Flow
```
User Opens Dashboard
    ↓
Load Portfolio Data (localStorage/API)
    ↓
Fetch Real-time Prices (Yahoo Finance)
    ↓
Update Portfolio Values
    ↓
Display Dashboard
```

### AI Advisor Flow
```
User Asks Question
    ↓
Parse Query & Detect Intent
    ↓
Fetch Required Data:
  - Real-time prices
  - Historical data (if needed)
  - News (if relevant)
    ↓
Generate Quantitative Insights:
  - Calculate risk metrics
  - Analyze portfolio
  - Detect patterns
    ↓
Build AI Prompt with Context
    ↓
Generate Response (Gemini)
    ↓
Display to User
```

### Quantitative Analysis Flow
```
Portfolio Data
    ↓
Fetch Historical Data (1 year)
    ↓
Fetch S&P 500 Benchmark
    ↓
Calculate Returns
    ↓
Calculate Risk Metrics:
  - Sharpe Ratio
  - Beta & Alpha
  - VaR & CVaR
  - Max Drawdown
  - Volatility
    ↓
Generate Insights:
  - Concentration risks
  - Rebalancing suggestions
  - Performance analysis
    ↓
Format for AI
    ↓
Return to Advisor
```

## State Management

### Zustand Stores

#### Portfolio Store (`use-portfolio-store.ts`)
```typescript
interface PortfolioStore {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  removeAsset: (symbol: string) => void;
  updateAsset: (symbol: string, updates: Partial<Asset>) => void;
  clearPortfolio: () => void;
}
```

#### Watchlist Store (`use-watchlist-store.ts`)
```typescript
interface WatchlistStore {
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}
```

#### Chat History (`use-chat-history.ts`)
```typescript
interface ChatHistoryStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearHistory: () => void;
}
```

## Deployment

### Environment Variables

**Required**:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GOOGLE_GENAI_API_KEY=AIzaSy...
```

**Optional**:
```env
ALPHA_VANTAGE_API_KEY=...
NEXT_PUBLIC_NEWS_API_KEY=...
```

### Build & Deploy

**Development**:
```bash
npm run dev
# Runs on http://localhost:9003
```

**Production Build**:
```bash
npm run build
npm run start
# Runs on http://localhost:3000
```

**Docker**:
```bash
npm run docker:build
npm run docker:run
```

### Performance Optimization

**Implemented**:
- Server Components for reduced JS bundle
- Parallel data fetching
- In-memory caching
- Code splitting
- Image optimization

**Recommended**:
- Redis for production caching
- CDN for static assets
- Database for user data
- WebSocket for real-time updates

## Testing

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Verification
```bash
npm run verify
```

## Security

**Implemented**:
- Server-side API calls only
- Input validation (Zod)
- Authentication (Clerk)
- HTTPS in production
- No PII in external APIs

**Best Practices**:
- Environment variables for secrets
- CORS configuration
- Rate limiting (future)
- SQL injection prevention (future)

## Monitoring & Logging

**Current**:
- Console errors for debugging
- API warnings for failures

**Recommended**:
- Sentry for error tracking
- Analytics (Vercel Analytics)
- Performance monitoring
- User behavior tracking

---

**For more information, see:**
- `README.md` - Getting started
- `HACKATHON_READY.md` - Demo preparation
- `UTILITY_MODULES.md` - Utility reference
- `PROJECT_SUMMARY.md` - Executive summary
