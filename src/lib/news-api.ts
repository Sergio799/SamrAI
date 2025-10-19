// News API integration for stock-related news

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

/**
 * Fetch news for specific stocks using NewsAPI
 * Free tier: 100 requests/day
 */
export async function fetchStockNews(symbols: string[]): Promise<NewsArticle[]> {
  // For demo, we'll use a mix of real API and mock data
  // In production, you'd get a NewsAPI key from https://newsapi.org
  
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  
  if (!apiKey) {
    // Return mock news for demo
    return getMockNews(symbols);
  }

  try {
    const query = symbols.join(' OR ');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
    );

    if (!response.ok) {
      return getMockNews(symbols);
    }

    const data = await response.json();
    return data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
      sentiment: analyzeSentiment(article.title + ' ' + article.description),
    })) || [];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return getMockNews(symbols);
  }
}

/**
 * Simple sentiment analysis
 */
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['up', 'rise', 'gain', 'bull', 'growth', 'profit', 'surge', 'rally', 'strong', 'beat'];
  const negativeWords = ['down', 'fall', 'loss', 'bear', 'decline', 'drop', 'crash', 'weak', 'miss', 'cut'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * Mock news for demo purposes
 */
function getMockNews(symbols: string[]): NewsArticle[] {
  const mockArticles: NewsArticle[] = [
    {
      title: 'Apple Reports Strong Q4 Earnings, iPhone Sales Surge',
      description: 'Apple Inc. exceeded analyst expectations with robust iPhone sales and services revenue growth.',
      url: 'https://finance.yahoo.com/quote/AAPL',
      source: 'TechCrunch',
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      sentiment: 'positive',
    },
    {
      title: 'Microsoft Azure Revenue Grows 35% Year-over-Year',
      description: 'Cloud computing division continues to drive Microsoft\'s growth with enterprise adoption.',
      url: 'https://finance.yahoo.com/quote/MSFT',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      sentiment: 'positive',
    },
    {
      title: 'Tesla Faces Production Challenges in Q4',
      description: 'Electric vehicle maker reports slower than expected production due to supply chain issues.',
      url: 'https://finance.yahoo.com/quote/TSLA',
      source: 'Bloomberg',
      publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      sentiment: 'negative',
    },
    {
      title: 'NVIDIA AI Chip Demand Remains Strong Despite Market Volatility',
      description: 'Data center revenue continues to grow as AI adoption accelerates across industries.',
      url: 'https://finance.yahoo.com/quote/NVDA',
      source: 'Wall Street Journal',
      publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      sentiment: 'positive',
    },
    {
      title: 'Bitcoin Volatility Increases Amid Regulatory Uncertainty',
      description: 'Cryptocurrency markets show increased volatility as regulatory frameworks remain unclear.',
      url: 'https://finance.yahoo.com/quote/BTC-USD',
      source: 'CoinDesk',
      publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      sentiment: 'negative',
    },
  ];

  // Filter articles relevant to user's symbols
  return mockArticles.filter(article => 
    symbols.some(symbol => 
      article.title.toLowerCase().includes(symbol.toLowerCase()) ||
      article.description.toLowerCase().includes(symbol.toLowerCase())
    )
  ).concat(
    // Add some general market news
    mockArticles.slice(0, 3)
  ).slice(0, 10);
}
