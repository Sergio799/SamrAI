# Utility Modules Reference

## 1. Cache (`src/lib/cache.ts`)

Simple in-memory caching for API responses.

**Usage:**
```typescript
import { cache } from '@/lib/cache';

// Store data with 5-minute TTL
cache.set('stock-AAPL', stockData, 5);

// Retrieve data
const data = cache.get('stock-AAPL');

// Check if exists
if (cache.has('stock-AAPL')) {
  // Use cached data
}

// Clear specific key
cache.delete('stock-AAPL');

// Clear all cache
cache.clear();
```

**Use Cases:**
- Cache API responses to reduce requests
- Store historical data temporarily
- Improve performance for repeated queries

---

## 2. Trade History (`src/lib/trade-history.ts`)

Track buy/sell trades with localStorage persistence.

**Usage:**
```typescript
import { addTrade, getTradeHistory, getTradesBySymbol } from '@/lib/trade-history';

// Add a trade
const trade = addTrade({
  symbol: 'AAPL',
  type: 'buy',
  shares: 10,
  price: 150.00,
  total: 1500.00,
  date: new Date().toISOString(),
  notes: 'Long-term hold'
});

// Get all trades
const history = getTradeHistory();
console.log(history.totalInvested);
console.log(history.netProfit);

// Get trades for specific symbol
const applTrades = getTradesBySymbol('AAPL');

// Calculate average cost
const avgCost = calculateAverageCost('AAPL');
```

**Use Cases:**
- Track trading activity
- Calculate cost basis
- Analyze trading patterns
- Generate tax reports

---

## 3. Financial Formulas (`src/lib/financial-formulas.ts`)

Common financial calculations and metrics.

**Usage:**
```typescript
import {
  calculateCompoundAnnualGrowthRate,
  calculatePriceToEarnings,
  calculateReturnOnEquity,
  formatCurrency,
  formatLargeNumber
} from '@/lib/financial-formulas';

// Growth calculations
const cagr = calculateCompoundAnnualGrowthRate(1000, 1500, 3);
// Returns: 0.1447 (14.47% annual growth)

// Valuation ratios
const pe = calculatePriceToEarnings(150, 6.5);
// Returns: 23.08

// Profitability metrics
const roe = calculateReturnOnEquity(10000000, 50000000);
// Returns: 0.20 (20% ROE)

// Formatting
formatCurrency(1234.56); // "$1,234.56"
formatLargeNumber(1500000000); // "$1.50B"
```

**Available Functions:**
- Growth: CAGR, Simple Return, Annualized Return
- Time Value: Future Value, Present Value, Compound Interest
- Valuation: P/E, P/B, Dividend Yield, Earnings Yield
- Profitability: ROE, ROA, Margins
- Liquidity: Current Ratio, Quick Ratio
- Leverage: Debt-to-Equity
- Utilities: Rule of 72, Formatting

---

## 4. Panic Selling Detection (`src/ai/flows/panic-selling-flow.ts`)

AI-powered behavioral analysis to detect emotional trading.

**Usage:**
```typescript
import { detectPanicSelling, analyzeTradingBehavior } from '@/ai/flows/panic-selling-flow';

// Detect panic selling
const result = await detectPanicSelling(
  recentTrades,
  {
    volatility: 0.30,
    marketChange: -0.08
  }
);

if (result.isPanicSelling) {
  console.log(`Confidence: ${result.confidence * 100}%`);
  console.log(result.reasoning);
  result.recommendations.forEach(rec => console.log(rec));
}

// Analyze trading pattern
const analysis = await analyzeTradingBehavior(trades);
console.log(analysis.pattern); // 'rational' | 'emotional' | 'panic' | 'fomo'
console.log(analysis.advice);
```

**Use Cases:**
- Detect emotional trading patterns
- Provide behavioral coaching
- Prevent impulsive decisions
- Improve trading discipline

---

## Integration Examples

### Example 1: Cache Historical Data
```typescript
import { cache } from '@/lib/cache';
import { fetchHistoricalData } from '@/lib/data-pipeline';

async function getCachedHistoricalData(symbol: string) {
  const cacheKey = `historical-${symbol}-1y`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch if not cached
  const data = await fetchHistoricalData(symbol, '1y');
  
  // Cache for 1 hour
  cache.set(cacheKey, data, 60);
  
  return data;
}
```

### Example 2: Track Portfolio Trades
```typescript
import { addTrade, calculateAverageCost } from '@/lib/trade-history';

function buyStock(symbol: string, shares: number, price: number) {
  addTrade({
    symbol,
    type: 'buy',
    shares,
    price,
    total: shares * price,
    date: new Date().toISOString()
  });
  
  const avgCost = calculateAverageCost(symbol);
  console.log(`Average cost for ${symbol}: $${avgCost.toFixed(2)}`);
}
```

### Example 3: Calculate Portfolio Metrics
```typescript
import {
  calculateSimpleReturn,
  calculateAnnualizedReturn,
  formatPercentage
} from '@/lib/financial-formulas';

function analyzePortfolio(initialValue: number, currentValue: number, years: number) {
  const totalReturn = calculateSimpleReturn(initialValue, currentValue);
  const annualizedReturn = calculateAnnualizedReturn(totalReturn, years);
  
  console.log(`Total Return: ${formatPercentage(totalReturn)}`);
  console.log(`Annualized Return: ${formatPercentage(annualizedReturn)}`);
}
```

### Example 4: Behavioral Analysis
```typescript
import { detectPanicSelling } from '@/ai/flows/panic-selling-flow';
import { getTradeHistory } from '@/lib/trade-history';

async function checkForPanicSelling() {
  const history = getTradeHistory();
  const recentTrades = history.trades.slice(0, 10);
  
  const result = await detectPanicSelling(recentTrades, {
    volatility: 0.25,
    marketChange: -0.06
  });
  
  if (result.isPanicSelling && result.confidence > 0.7) {
    // Show warning to user
    alert('Warning: Panic selling detected. Consider reviewing your strategy.');
  }
}
```

---

## Best Practices

1. **Caching**: Use for expensive API calls, clear on data updates
2. **Trade History**: Sync with backend in production, use localStorage for demo
3. **Financial Formulas**: Validate inputs, handle division by zero
4. **Panic Detection**: Use as advisory tool, not blocking mechanism

---

## Future Enhancements

- **Cache**: Add Redis support for production
- **Trade History**: Add backend sync, export to CSV
- **Formulas**: Add more advanced metrics (Sortino, Calmar)
- **Panic Detection**: Add machine learning model for better accuracy
