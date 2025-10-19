'use client';

import { useEffect, useState } from 'react';
import { Grid3x3, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

export default function HeatmapPage() {
  const { assets } = usePortfolioStore();
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const totalValue = assets.reduce((acc, asset) => acc + asset.value, 0);

  // Sort by value for better visualization
  const sortedAssets = [...assets].sort((a, b) => b.value - a.value);

  const getColor = (change: number) => {
    if (change > 3) return 'bg-green-600';
    if (change > 1) return 'bg-green-500';
    if (change > 0) return 'bg-green-400';
    if (change > -1) return 'bg-red-400';
    if (change > -3) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getSize = (value: number) => {
    const percentage = (value / totalValue) * 100;
    if (percentage > 15) return 'col-span-2 row-span-2';
    if (percentage > 10) return 'col-span-2';
    return 'col-span-1';
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Grid3x3 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Portfolio Heatmap</h1>
      </div>

      <p className="text-muted-foreground mb-6 max-w-2xl">
        Visual representation of your portfolio. Size represents allocation, color represents performance.
        Green = gains, Red = losses.
      </p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {sortedAssets.map((asset) => {
          const allocation = ((asset.value / totalValue) * 100).toFixed(1);
          const isHovered = hoveredAsset === asset.symbol;

          return (
            <Card
              key={asset.symbol}
              className={cn(
                'relative overflow-hidden transition-all duration-300 cursor-pointer',
                getSize(asset.value),
                getColor(asset.daily_change_percent),
                isHovered && 'ring-2 ring-primary scale-105 z-10'
              )}
              onMouseEnter={() => setHoveredAsset(asset.symbol)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <CardContent className="p-4 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="font-bold text-lg">{asset.symbol}</div>
                  <div className="text-xs opacity-90 truncate">{asset.name}</div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">
                    {asset.daily_change_percent >= 0 ? '+' : ''}
                    {asset.daily_change_percent?.toFixed(2) ?? '0.00'}%
                  </div>
                  <div className="text-sm opacity-90">{allocation}% of portfolio</div>
                  <div className="text-xs opacity-75 mt-1">
                    {formatCurrency(asset.value)}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  {asset.daily_change_percent >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded"></div>
              <span className="text-sm">+3% or more</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded"></div>
              <span className="text-sm">+1% to +3%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-400 rounded"></div>
              <span className="text-sm">0% to +1%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-400 rounded"></div>
              <span className="text-sm">0% to -1%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded"></div>
              <span className="text-sm">-1% to -3%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded"></div>
              <span className="text-sm">-3% or less</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Tile size represents allocation percentage. Larger tiles = bigger portion of your portfolio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
