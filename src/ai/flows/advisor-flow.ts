'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { portfolioData } from '@/lib/portfolio-data';
import { updatePortfolioWithRealPrices, fetchPortfolioNews, fetchMarketNews } from '@/lib/stock-api';
import { generateQuantitativeInsights, formatInsightsForAI } from '@/quant/insights-engine';

export async function advise(history: any): Promise<string> {
    const MessageSchema = z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    });

    const HistorySchema = z.array(MessageSchema);
    HistorySchema.parse(history);

    const latestMessage = history[history.length - 1].content;
    const isGreeting = ['hello', 'hi', 'hey'].some(g => latestMessage.toLowerCase().includes(g));

    if (isGreeting) {
        const { output } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-exp',
            prompt: `You are SamrAI, a quantitative investment advisor with expertise in portfolio theory and financial markets. Greet the user professionally and mention you can provide research-grade analysis. Keep it brief (1-2 sentences).`,
            output: { format: 'text' }
        });
        return output!;
    }


    const updatedPortfolio = await updatePortfolioWithRealPrices(portfolioData);


    const isAskingAboutMarket = /market|news|trend|economy|fed|inflation|rate/i.test(latestMessage);
    const mentionedSymbols = portfolioData
        .map(asset => asset.symbol)
        .filter(symbol => new RegExp(`\\b${symbol}\\b`, 'i').test(latestMessage));

    let marketNews: any[] = [];
    let portfolioNews: Map<string, any[]> = new Map();

    if (isAskingAboutMarket) {
        marketNews = await fetchMarketNews();
    }

    if (mentionedSymbols.length > 0) {
        portfolioNews = await fetchPortfolioNews(mentionedSymbols);
    }

    let quantInsights;
    try {
        quantInsights = await generateQuantitativeInsights(updatedPortfolio);
    } catch (error) {
        console.error('Error generating insights:', error);
        quantInsights = null;
    }
    const totalValue = updatedPortfolio.reduce((acc, asset) => acc + asset.value, 0);
    const totalCost = updatedPortfolio.reduce((acc, asset) => acc + (asset.shares * asset.purchase_price), 0);
    const totalReturn = ((totalValue - totalCost) / totalCost * 100);
    const totalGainLoss = (totalValue - totalCost);

    const todayOpen = updatedPortfolio.reduce((acc, asset) => acc + (asset.shares * asset.price_open), 0);
    const todayChange = ((totalValue - todayOpen) / todayOpen * 100);
    const todayGainLoss = (totalValue - todayOpen);

    const portfolioMetrics = updatedPortfolio.map(asset => {
        const totalGain = asset.value - (asset.shares * asset.purchase_price);
        const totalGainPercent = ((asset.price - asset.purchase_price) / asset.purchase_price) * 100;
        return {
            symbol: asset.symbol,
            name: asset.name,
            shares: asset.shares,
            currentPrice: asset.price,
            entryPrice: asset.purchase_price,
            currentValue: asset.value,
            allocation: (asset.value / totalValue) * 100,
            dailyChange: asset.daily_change_percent,
            totalGain,
            totalGainPercent,
            type: asset.type,
        };
    });

    let newsContext = '';

    if (marketNews.length > 0) {
        newsContext += '\n\n## REAL-TIME MARKET NEWS\n\n';
        marketNews.slice(0, 5).forEach((news, i) => {
            newsContext += `${i + 1}. **${news.title}** (${news.publisher})\n`;
            if (news.summary) {
                newsContext += `   ${news.summary}\n`;
            }
            newsContext += '\n';
        });
    }

    if (portfolioNews.size > 0) {
        newsContext += '\n\n## NEWS FOR YOUR HOLDINGS\n\n';
        portfolioNews.forEach((news, symbol) => {
            if (news.length > 0) {
                newsContext += `### ${symbol}:\n`;
                news.slice(0, 3).forEach((item, i) => {
                    newsContext += `${i + 1}. **${item.title}** (${item.publisher})\n`;
                });
                newsContext += '\n';
            }
        });
    }

    let quantContext = '';
    if (quantInsights) {
        quantContext = '\n\n' + formatInsightsForAI(quantInsights);
    }
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.5-pro',
        prompt: `
You are SamrAI, a quantitative investment advisor with a PhD-level understanding of portfolio theory, risk management, and financial markets.

# PORTFOLIO DATA

## Overview
- **Total Value:** $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- **Total Return (All Time):** ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}% ($${totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
- **Today's Change:** ${todayChange >= 0 ? '+' : ''}${todayChange.toFixed(2)}% ($${todayGainLoss >= 0 ? '+' : ''}${Math.abs(todayGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
- **Holdings:** ${portfolioMetrics.length} positions

## Current Holdings

| Symbol | Allocation | Price | Daily Change | Total Return |
|--------|------------|-------|--------------|--------------|
${portfolioMetrics.map(m =>
            `| ${m.symbol} | ${m.allocation.toFixed(1)}% | $${m.currentPrice.toFixed(2)} | ${m.dailyChange >= 0 ? '+' : ''}${m.dailyChange.toFixed(2)}% | ${m.totalGainPercent >= 0 ? '+' : ''}${m.totalGainPercent.toFixed(2)}% |`
        ).join('\n')}

${quantContext}

${newsContext}

---

# USER QUESTION
"${latestMessage}"

# CONVERSATION HISTORY
${history.slice(0, -1).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}

---

# YOUR TASK

You are a research-grade quantitative analyst. Provide insights that combine:

1. **Quantitative Analysis** - Reference specific metrics (Sharpe ratio, Beta, Alpha, VaR, etc.)
2. **Real-Time Data** - Use current prices and news
3. **Mathematical Rigor** - Show formulas and calculations when relevant
4. **Strategic Thinking** - Provide actionable recommendations

## Response Guidelines:

### Structure:
1. **Direct Answer** - Address the question immediately
2. **Quantitative Evidence** - Reference specific metrics and calculations
3. **Risk Assessment** - Highlight concerns with mathematical basis
4. **Strategic Recommendations** - Provide clear action items
5. **Market Context** - Explain how current conditions affect the portfolio

### Style:
- Think like a Stanford/MIT quantitative researcher
- Reference academic concepts (MPT, CAPM, Fama-French, etc.)
- Show mathematical reasoning
- Be precise with numbers
- Provide confidence levels for recommendations

### Format:
- Use **bold** for key metrics
- Use tables for comparisons
- Use bullet points for lists
- Show formulas in code blocks when relevant
- Organize with headers

### Example Insights:

"Your portfolio's **Sharpe ratio of 1.42** indicates excellent risk-adjusted returns. This means you're earning 1.42 units of return for each unit of risk, significantly above the market's 0.95.

**Mathematical Basis:**
\`\`\`
Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Volatility
            = (18.3% - 4.2%) / 9.9%
            = 1.42
\`\`\`

However, your **Beta of 1.15** suggests 15% higher volatility than the market. Combined with a **max drawdown of 18.2%**, this indicates moderate risk exposure.

**Recommendation:** Given the current bull market regime (50-day MA > 200-day MA) and low VIX (14.2), maintain current positioning but set trailing stops at -8% to protect gains."

---

**IMPORTANT:**
- Always reference quantitative metrics when available
- Explain the mathematical reasoning behind recommendations
- Provide specific numbers and calculations
- Think creatively about patterns and opportunities
- Consider both technical and fundamental factors
- Reference academic research when relevant

**ALWAYS END WITH:**
---
*This analysis combines quantitative metrics, real-time data, and portfolio theory. Not financial advice. Consult a qualified advisor before making investment decisions.*
        `,
        output: {
            format: 'text'
        }
    });

    return output!;
}
