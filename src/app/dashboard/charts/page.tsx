'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { StockChart } from '@/components/dashboard/StockChart';
import { StockSearch } from '@/components/dashboard/StockSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { getStockInfo } from '@/lib/stock-search';
import { useToast } from '@/hooks/use-toast';

export default function ChartsPage() {
  const { assets } = usePortfolioStore();
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  } | null>(null);

  // Auto-select first stock from portfolio on mount
  useEffect(() => {
    if (assets.length > 0 && !selectedStock) {
      const firstAsset = assets[0];
      handleSelectStock(firstAsset.symbol, firstAsset.name);
    }
  }, [assets]);

  const handleSelectStock = async (symbol: string, name: string) => {
    try {
      const info = await getStockInfo(symbol);
      
      // If API fails, use mock data
      if (!info) {
        const mockPrices: Record<string, { price: number; previousClose: number }> = {
          'AAPL': { price: 185.92, previousClose: 182.15 },
          'MSFT': { price: 380.45, previousClose: 375.20 },
          'GOOGL': { price: 140.23, previousClose: 138.90 },
          'AMZN': { price: 145.67, previousClose: 143.50 },
          'NVDA': { price: 495.32, previousClose: 485.10 },
          'TSLA': { price: 245.18, previousClose: 248.90 },
          'META': { price: 325.45, previousClose: 320.10 },
          'VOO': { price: 420.15, previousClose: 418.50 },
          'BTC': { price: 43250.00, previousClose: 42800.00 },
          'ETH': { price: 2315.50, previousClose: 2290.00 },
        };

        const mockData = mockPrices[symbol] || { price: 100, previousClose: 98 };
        
        setSelectedStock({
          symbol: symbol,
          name: name,
          price: mockData.price,
          change: mockData.price - mockData.previousClose,
          changePercent: ((mockData.price - mockData.previousClose) / mockData.previousClose) * 100,
        });
        return;
      }

      setSelectedStock({
        symbol: info.symbol,
        name: info.name,
        price: info.price,
        change: info.price - info.previousClose,
        changePercent: ((info.price - info.previousClose) / info.previousClose) * 100,
      });
    } catch (error) {
      // Fallback to mock data on error
      const mockPrices: Record<string, { price: number; previousClose: number }> = {
        'AAPL': { price: 185.92, previousClose: 182.15 },
        'MSFT': { price: 380.45, previousClose: 375.20 },
        'GOOGL': { price: 140.23, previousClose: 138.90 },
        'AMZN': { price: 145.67, previousClose: 143.50 },
        'NVDA': { price: 495.32, previousClose: 485.10 },
        'TSLA': { price: 245.18, previousClose: 248.90 },
        'META': { price: 325.45, previousClose: 320.10 },
        'VOO': { price: 420.15, previousClose: 418.50 },
        'BTC': { price: 43250.00, previousClose: 42800.00 },
        'ETH': { price: 2315.50, previousClose: 2290.00 },
      };

      const mockData = mockPrices[symbol] || { price: 100, previousClose: 98 };
      
      setSelectedStock({
        symbol: symbol,
        name: name,
        price: mockData.price,
        change: mockData.price - mockData.previousClose,
        changePercent: ((mockData.price - mockData.previousClose) / mockData.previousClose) * 100,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <BarChart3 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Live Charts</h1>
      </div>

      <p className="text-muted-foreground mb-6 max-w-2xl">
        View detailed price charts with real-time updates. Track price movements, 
        volume, and historical performance across multiple timeframes.
      </p>

      {/* Stock Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Stock to Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <StockSearch onAddStock={handleSelectStock} />
          
          {/* Quick Select from Portfolio */}
          {assets.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Or select from your portfolio:</p>
              <div className="flex flex-wrap gap-2">
                {assets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => handleSelectStock(asset.symbol, asset.name)}
                    className="px-3 py-1.5 rounded-md bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Display */}
      {selectedStock ? (
        <StockChart
          symbol={selectedStock.symbol}
          name={selectedStock.name}
          currentPrice={selectedStock.price}
          change={selectedStock.change}
          changePercent={selectedStock.changePercent}
        />
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stock selected</h3>
            <p className="text-muted-foreground">
              Search for a stock or select one from your portfolio to view its chart.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
