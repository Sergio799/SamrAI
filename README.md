# 🚀 SamrAI - AI-Powered Investment Platform

> Professional investment analysis powered by AI and quantitative research

## Overview

SamrAI is an intelligent investment platform that combines real-time market data with research-grade quantitative analysis and AI-powered insights. Built for retail investors who want institutional-quality analysis without the institutional price tag.

## ✨ Key Features

### 📊 Portfolio Management
- **Real-time tracking** of stocks, ETFs, and cryptocurrencies
- **Live price updates** from Yahoo Finance
- **Performance analytics** with daily and all-time returns
- **Visual heatmap** for allocation analysis
- **Sector diversification** tracking

### 🤖 AI Investment Advisor
- **Natural language chat** interface
- **Quantitative analysis** with Sharpe Ratio, Beta, Alpha, VaR
- **Strategic recommendations** with confidence scores
- **News integration** for contextual insights
- **Mathematical reasoning** with formulas explained

### 📈 Quantitative Analysis
- **Risk Metrics**: Sharpe, Sortino, Treynor ratios
- **Market Correlation**: Beta, Alpha calculations
- **Downside Risk**: VaR, CVaR, Max Drawdown
- **Portfolio Optimization**: Diversification scoring
- **Regime Detection**: Bull/bear market identification

### 📰 Market Intelligence
- **Real-time news** from Yahoo Finance
- **Sentiment analysis** (positive/negative/neutral)
- **Stock-specific** news filtering
- **Market trends** and updates

### 📉 Interactive Charts
- **Multiple timeframes** (1D, 5D, 1M, 6M, 1Y, 5Y)
- **Technical indicators** support
- **Price history** visualization
- **Performance tracking**

### 🎯 Additional Features
- **Watchlist management**
- **Stock search** and discovery
- **Goal tracking**
- **Trade history** (with localStorage)
- **Behavioral analysis** (panic selling detection)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **AI**: Google Gemini 2.5 via Genkit
- **Data**: Yahoo Finance API (free, unlimited)
- **Auth**: Clerk
- **State**: Zustand
- **Charts**: Recharts

### Project Structure
```
src/
├── ai/
│   ├── flows/
│   │   ├── advisor-flow.ts          # AI investment advisor
│   │   └── panic-selling-flow.ts    # Behavioral analysis
│   └── genkit.ts                     # AI configuration
├── app/
│   ├── dashboard/
│   │   ├── portfolio/               # Portfolio overview
│   │   ├── advisor/                 # AI chat interface
│   │   ├── analytics/               # Performance metrics
│   │   ├── charts/                  # Price charts
│   │   ├── heatmap/                 # Visual allocation
│   │   ├── news/                    # Market news
│   │   ├── search/                  # Stock search
│   │   ├── watchlist/               # Watchlist
│   │   ├── goals/                   # Goal tracking
│   │   ├── accounts/                # Account management
│   │   └── predictions/             # Future predictions
│   ├── sign-in/                     # Authentication
│   └── sign-up/
├── components/
│   ├── dashboard/                   # Dashboard components
│   ├── providers/                   # Context providers
│   └── ui/                          # Shadcn/ui components
├── hooks/
│   ├── use-portfolio-store.ts       # Portfolio state
│   ├── use-watchlist-store.ts       # Watchlist state
│   ├── use-real-prices.ts           # Live price updates
│   └── use-chat-history.ts          # Chat state
├── lib/
│   ├── data-pipeline.ts             # Historical data fetching
│   ├── stock-api.ts                 # Real-time prices & news
│   ├── news-api.ts                  # News aggregation
│   ├── portfolio-data.ts            # Portfolio data model
│   ├── financial-formulas.ts        # Financial calculations
│   ├── trade-history.ts             # Trade tracking
│   ├── cache.ts                     # Caching utility
│   └── chart-data.ts                # Chart data processing
└── quant/
    ├── core/
    │   └── risk-metrics.ts          # Risk calculations
    └── insights-engine.ts           # Quantitative insights
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd samrai-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Required environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Google AI (Gemini)
GOOGLE_GENAI_API_KEY=your_api_key

# Optional: Alpha Vantage (for additional data)
ALPHA_VANTAGE_API_KEY=your_key
```

4. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:9003`

### Available Scripts

```bash
npm run dev          # Start development server (port 9003)
npm run build        # Build for production
npm run start        # Start production server (port 3000)
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run verify       # Verify demo setup
```

## 📖 Core Modules

### 1. Quantitative Analysis (`src/quant/`)

**Risk Metrics** (`core/risk-metrics.ts`):
- Sharpe Ratio, Sortino Ratio, Treynor Ratio
- Beta, Alpha calculations
- VaR, CVaR (Value at Risk)
- Max Drawdown, Volatility
- Calmar Ratio, Information Ratio

**Insights Engine** (`insights-engine.ts`):
- Portfolio-level analysis
- Individual stock recommendations
- Risk warnings and alerts
- Rebalancing suggestions
- Market regime detection

### 2. Data Pipeline (`src/lib/data-pipeline.ts`)

Fetches comprehensive market data:
- Historical OHLCV data (1-5 years)
- S&P 500 benchmark
- Risk-free rate (10-year Treasury)
- Fundamental data
- Real-time quotes

### 3. AI Advisor (`src/ai/flows/advisor-flow.ts`)

Features:
- Natural language understanding
- Real-time data integration
- Quantitative analysis
- News-driven insights
- Strategic recommendations

### 4. Utility Modules

**Cache** (`lib/cache.ts`):
- In-memory caching with TTL
- Reduces API calls
- Improves performance

**Trade History** (`lib/trade-history.ts`):
- Track buy/sell trades
- Calculate cost basis
- Performance tracking
- localStorage persistence

**Financial Formulas** (`lib/financial-formulas.ts`):
- 20+ financial calculations
- CAGR, ROE, ROA, P/E ratios
- Margin calculations
- Number formatting

**Panic Selling Detection** (`ai/flows/panic-selling-flow.ts`):
- Behavioral analysis
- Emotional trading detection
- AI-powered recommendations

## 🎯 Key Differentiators

### vs. Robinhood/Webull
- ✅ Research-grade quantitative analysis
- ✅ AI-powered strategic insights
- ✅ Educational explanations
- ✅ Mathematical reasoning

### vs. Bloomberg Terminal
- ✅ Free and accessible
- ✅ User-friendly interface
- ✅ AI-powered insights
- ✅ No learning curve

### vs. Robo-Advisors
- ✅ Transparent reasoning
- ✅ Educational component
- ✅ User maintains control
- ✅ Real-time analysis

## 📊 Data Sources

All data sources are **free** and require **no API keys** (except optional):

- **Yahoo Finance**: Prices, historical data, news (unlimited, free)
- **Google Gemini**: AI analysis (free tier: 15 req/min)
- **Alpha Vantage**: Optional additional data (25 req/day free)

## 🎨 UI Components

Built with **Shadcn/ui** for a polished, professional interface:
- Cards, Dialogs, Tooltips
- Forms, Inputs, Buttons
- Charts (Recharts)
- Responsive design
- Dark mode support

## 🔒 Security

- **Authentication**: Clerk (secure, production-ready)
- **API Security**: Server-side requests only
- **Data Privacy**: No PII sent to external APIs
- **Input Validation**: Zod schemas

## 📈 Performance

- **First Load**: ~2-3 seconds
- **Data Fetching**: ~5-7 seconds (first query)
- **Cached Queries**: ~1-2 seconds
- **Real-time Updates**: Automatic
- **Optimizations**: Parallel requests, caching

## 🚧 Roadmap

### Phase 2 (Post-Launch)
- [ ] Portfolio optimization (MPT)
- [ ] Monte Carlo simulation
- [ ] Tax optimization
- [ ] Automated rebalancing
- [ ] Mobile app

### Phase 3
- [ ] Broker integration (Plaid)
- [ ] Real account connections
- [ ] Paper trading
- [ ] Social features
- [ ] Advanced charting

### Phase 4
- [ ] Machine learning predictions
- [ ] Options strategies
- [ ] Alternative investments
- [ ] Robo-advisor capabilities

## 🤝 Contributing

This is a hackathon project. Contributions welcome after initial release.

## 📄 License

Private - All rights reserved

## 🎓 Educational Purpose

**Disclaimer**: This platform is for educational and informational purposes only. It does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.

## 📞 Support

For questions or issues, please refer to the documentation files:
- `HACKATHON_READY.md` - Hackathon preparation guide
- `DEMO_SCRIPT.md` - Presentation script
- `README_QUANT.md` - Quantitative analysis details
- `UTILITY_MODULES.md` - Utility modules reference

---

**Built with ❤️ for democratizing professional investment analysis**

🚀 **SamrAI - Intelligent investing through data-driven AI insights**
