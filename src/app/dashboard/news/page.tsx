'use client';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { fetchStockNews, type NewsArticle } from '@/lib/news-api';

export default function NewsPage() {
  const { assets } = usePortfolioStore();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const symbols = assets.map(a => a.symbol);
      const articles = await fetchStockNews(symbols);
      setNews(articles);
      setLoading(false);
    }

    loadNews();

    // Refresh news every 5 minutes
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [assets]);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
            Positive
          </Badge>
        );
      case 'negative':
        return (
          <Badge variant="destructive">
            Negative
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Neutral
          </Badge>
        );
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Newspaper className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Market News</h1>
      </div>

      <p className="text-muted-foreground mb-6 max-w-2xl">
        Stay updated with the latest news affecting your portfolio.
        News is filtered based on your current holdings and updated every 5 minutes.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((article, index) => (
            <Card key={index} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSentimentIcon(article.sentiment)}
                      <h3 className="font-semibold text-lg leading-tight">
                        {article.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{article.source}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(article.publishedAt)}
                        </span>
                        {getSentimentBadge(article.sentiment)}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                        className="flex items-center gap-2"
                      >
                        Read More
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {news.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No news found</h3>
                <p className="text-muted-foreground">
                  No recent news found for your portfolio holdings.
                  Try adding more stocks to get relevant news updates.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
