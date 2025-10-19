'use client';

import { useState } from 'react';
import { Eye, Plus, Trash2, TrendingUp } from 'lucide-react';
import { StockSearch } from '@/components/dashboard/StockSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getStockInfo } from '@/lib/stock-search';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import type { Asset } from '@/lib/portfolio-data';

export default function WatchlistPage() {
  const { assets, addAsset, removeAsset } = usePortfolioStore();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddStock = async (symbol: string, name: string) => {
    // Check if already exists
    if (assets.find((a) => a.symbol === symbol)) {
      toast({
        title: 'Already in portfolio',
        description: `${symbol} is already in your portfolio.`,
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);

    try {
      // Fetch real stock info
      const info = await getStockInfo(symbol);

      if (!info) {
        toast({
          title: 'Failed to add stock',
          description: `Could not fetch data for ${symbol}.`,
          variant: 'destructive',
        });
        return;
      }

      // Create new asset
      const newAsset: Asset = {
        name: info.name,
        symbol: info.symbol,
        shares: 10, // Default shares
        price: info.price,
        price_open: info.previousClose,
        value: info.price * 10,
        daily_change_percent: ((info.price - info.previousClose) / info.previousClose) * 100,
        type: info.type === 'CRYPTOCURRENCY' ? 'Crypto' : info.type === 'ETF' ? 'ETF' : 'Stock',
      };

      addAsset(newAsset);

      toast({
        title: 'Stock added!',
        description: `${symbol} has been added to your portfolio.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add stock. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStock = (symbol: string, name: string) => {
    removeAsset(symbol);
    toast({
      title: 'Stock removed',
      description: `${name} (${symbol}) has been removed from your portfolio.`,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Eye className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Watchlist & Portfolio Manager</h1>
      </div>

      <p className="text-muted-foreground mb-6 max-w-2xl">
        Search for any stock, ETF, or cryptocurrency and add it to your portfolio. 
        Track unlimited assets with real-time data.
      </p>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StockSearch onAddStock={handleAddStock} />
          {adding && (
            <p className="text-sm text-muted-foreground mt-2">
              Adding stock to portfolio...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Current Holdings ({assets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {asset.symbol} • {asset.shares} shares
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">
                      ${asset.value.toLocaleString()}
                    </div>
                    <Badge
                      variant={asset.daily_change_percent >= 0 ? 'default' : 'destructive'}
                      className={asset.daily_change_percent >= 0 ? 'bg-green-600/20 text-green-300 border-green-500/30' : ''}
                    >
                      {asset.daily_change_percent >= 0 ? '+' : ''}
                      {asset.daily_change_percent?.toFixed(2) ?? '0.00'}%
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStock(asset.symbol, asset.name)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
