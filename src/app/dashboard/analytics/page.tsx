'use client';

import { useMemo } from 'react';
import { BarChart, TrendingUp, TrendingDown, DollarSign, Target, PieChart as PieChartIcon, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { formatCurrency } from '@/lib/format';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const { assets } = usePortfolioStore();

  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalCost = assets.reduce((sum, asset) => sum + (asset.shares * asset.price_open), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalReturn = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    // Best and worst performers
    const sortedByPerformance = [...assets].sort(
      (a, b) => b.daily_change_percent - a.daily_change_percent
    );
    const bestPerformer = sortedByPerformance[0];
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

    // Sector breakdown (simplified - based on asset type)
    const sectorData = assets.reduce((acc, asset) => {
      const sector = asset.type;
      if (!acc[sector]) {
        acc[sector] = { value: 0, count: 0 };
      }
      acc[sector].value += asset.value;
      acc[sector].count += 1;
      return acc;
    }, {} as Record<string, { value: number; count: number }>);

    const sectorChartData = Object.entries(sectorData).map(([name, data]) => ({
      name,
      value: data.value,
      percentage: (data.value / totalValue) * 100,
    }));

    // Performance by asset
    const performanceData = assets.map(asset => ({
      name: asset.symbol,
      return: asset.daily_change_percent,
      value: asset.value,
    })).sort((a, b) => b.return - a.return);

    // Risk score (simplified - based on volatility)
    const avgVolatility = assets.reduce((sum, asset) => 
      sum + Math.abs(asset.daily_change_percent), 0
    ) / assets.length;
    
    let riskLevel: 'Low' | 'Medium' | 'High';
    if (avgVolatility < 1) riskLevel = 'Low';
    else if (avgVolatility < 3) riskLevel = 'Medium';
    else riskLevel = 'High';

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalReturn,
      bestPerformer,
      worstPerformer,
      sectorChartData,
      performanceData,
      riskLevel,
      avgVolatility,
    };
  }, [assets]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <BarChart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Portfolio Analytics</h1>
      </div>

      <p className="text-muted-foreground mb-6 max-w-2xl">
        Comprehensive analysis of your portfolio performance, allocation, and risk metrics.
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Cost basis: {formatCurrency(metrics.totalCost)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            {metrics.totalReturn >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(metrics.totalGainLoss)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.riskLevel}</div>
            <p className="text-xs text-muted-foreground">
              Avg volatility: {metrics.avgVolatility.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {metrics.sectorChartData.length} sectors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sector Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.sectorChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.sectorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance by Asset */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={metrics.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
                />
                <Bar dataKey="return" fill="#6366f1">
                  {metrics.performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.return >= 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Best and Worst Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.bestPerformer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                Best Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{metrics.bestPerformer.symbol}</div>
                  <div className="text-sm text-muted-foreground">{metrics.bestPerformer.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-500">
                    +{metrics.bestPerformer.daily_change_percent.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(metrics.bestPerformer.value)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {metrics.worstPerformer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Worst Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{metrics.worstPerformer.symbol}</div>
                  <div className="text-sm text-muted-foreground">{metrics.worstPerformer.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-500">
                    {metrics.worstPerformer.daily_change_percent.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(metrics.worstPerformer.value)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
