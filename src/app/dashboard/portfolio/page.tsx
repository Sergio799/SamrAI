'use client';

import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { type Asset } from '@/lib/portfolio-data';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { DailyChange } from '@/components/dashboard/DailyChange';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { PORTFOLIO_UPDATE_INTERVAL } from '@/lib/constants';

const generateNewUpdate = (asset: Asset): Asset => {
  const priceChange = (Math.random() - 0.49) * (asset.price * 0.05);
  const newPrice = Math.max(0.01, asset.price + priceChange);
  const dailyChange = ((newPrice - asset.price_open) / asset.price_open) * 100;

  return {
    ...asset,
    price: newPrice,
    value: newPrice * asset.shares,
    daily_change_percent: dailyChange,
  };
};

// Lazy load AssetCard with better loading state
const AssetCard = dynamic(
  () => import('@/components/dashboard/AssetCard').then(mod => mod.AssetCard),
  {
    loading: () => <Skeleton className="h-[218px] w-full" />,
    ssr: false,
  }
);

const MobileView = ({ assets, totalValue }: { assets: Asset[], totalValue: number }) => (
  <div className="space-y-4">
    {assets.map((asset) => (
      <AssetCard key={asset.symbol} asset={asset} totalValue={totalValue} />
    ))}
  </div>
);


// Memoized desktop view for better performance
const DesktopView = ({ assets, totalValue }: { assets: Asset[], totalValue: number }) => {
  const rows = useMemo(() => 
    assets.map((asset) => ({
      ...asset,
      allocation: ((asset.value / totalValue) * 100).toFixed(2),
    })),
    [assets, totalValue]
  );

  return (
    <div className="bg-background/80 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Shares</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Daily Change</TableHead>
            <TableHead>Allocation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((asset) => (
            <TableRow key={asset.symbol} className="hover:bg-accent">
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{asset.symbol}</Badge>
              </TableCell>
              <TableCell>{asset.shares.toLocaleString()}</TableCell>
              <TableCell>{formatCurrency(asset.price)}</TableCell>
              <TableCell>{formatCurrency(asset.value)}</TableCell>
              <TableCell>
                <DailyChange change={asset.daily_change_percent} />
              </TableCell>
              <TableCell>{asset.allocation}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function PortfolioPage() {
  const { assets: storeAssets, updateAsset } = usePortfolioStore();
  const [assets, setAssets] = useState<Asset[]>(storeAssets);
  const isMobile = useIsMobile();

  // Sync with store
  useEffect(() => {
    setAssets(storeAssets);
  }, [storeAssets]);

  // Memoize the update function
  const updateAssets = useCallback(() => {
    setAssets(prevAssets => 
      prevAssets.map(generateNewUpdate).sort((a, b) => b.value - a.value)
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updateAssets, PORTFOLIO_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateAssets]);

  // Memoize total value calculation
  const totalValue = useMemo(
    () => assets.reduce((acc, asset) => acc + asset.value, 0),
    [assets]
  );

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    const totalCost = assets.reduce((sum, asset) => sum + (asset.shares * asset.price_open), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalReturn = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    const dailyChange = assets.reduce((sum, asset) => {
      const dailyGainLoss = (asset.price - asset.price_open) * asset.shares;
      return sum + dailyGainLoss;
    }, 0);
    const dailyChangePercent = totalCost > 0 ? (dailyChange / totalCost) * 100 : 0;

    const sortedByPerformance = [...assets].sort((a, b) => b.daily_change_percent - a.daily_change_percent);
    const bestPerformer = sortedByPerformance[0];
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

    return {
      totalReturn,
      totalGainLoss,
      dailyChange,
      dailyChangePercent,
      bestPerformer,
      worstPerformer,
    };
  }, [assets, totalValue]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Portfolio Dashboard</h1>
        <div className="flex gap-2">
          <a href="/dashboard/search">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Manage Watchlist
            </Badge>
          </a>
          <a href="/dashboard/heatmap">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              View Heatmap
            </Badge>
          </a>
          <a href="/dashboard/analytics">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Analytics
            </Badge>
          </a>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {assets.length} holdings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${performanceMetrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {performanceMetrics.totalReturn >= 0 ? '+' : ''}{performanceMetrics.totalReturn.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performanceMetrics.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(performanceMetrics.totalGainLoss)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${performanceMetrics.dailyChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {performanceMetrics.dailyChangePercent >= 0 ? '+' : ''}{performanceMetrics.dailyChangePercent.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performanceMetrics.dailyChange >= 0 ? '+' : ''}{formatCurrency(performanceMetrics.dailyChange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.bestPerformer?.symbol || 'N/A'}</div>
            <p className="text-xs text-green-500 mt-1">
              {performanceMetrics.bestPerformer ? `+${performanceMetrics.bestPerformer.daily_change_percent.toFixed(2)}%` : ''}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        {isMobile === undefined ? (
          <Skeleton className="h-[400px] w-full" />
        ) : isMobile ? (
          <MobileView assets={assets} totalValue={totalValue} />
        ) : (
          <DesktopView assets={assets} totalValue={totalValue} />
        )}
      </Suspense>
    </div>
  );
}
