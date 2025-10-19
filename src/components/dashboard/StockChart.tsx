'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchChartData, formatPrice, formatVolume, type TimeFrame, type ChartDataPoint } from '@/lib/chart-data';

interface StockChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function StockChart({ symbol, name, currentPrice, change, changePercent }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChartData() {
      setLoading(true);
      const data = await fetchChartData(symbol, timeframe);
      setChartData(data);
      setLoading(false);
    }

    loadChartData();
  }, [symbol, timeframe]);

  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

  const isPositive = change >= 0;

  // Format data for line chart
  const lineChartData = chartData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price: point.close,
    timestamp: point.timestamp,
  }));

  // Format data for volume chart
  const volumeChartData = chartData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    volume: point.volume,
    timestamp: point.timestamp,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${formatPrice(currentPrice)}</div>
            <div className="flex items-center gap-2 justify-end">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <Badge
                variant={isPositive ? 'default' : 'destructive'}
                className={isPositive ? 'bg-green-600/20 text-green-300 border-green-500/30' : ''}
              >
                {isPositive ? '+' : ''}
                {changePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeframe Selector */}
        <div className="flex gap-2 mb-4">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        ) : (
          <>
            {/* Price Chart */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Price</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={lineChartData}>
                  <defs>
                    <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isPositive ? '#22c55e' : '#ef4444'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={isPositive ? '#22c55e' : '#ef4444'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    stroke="#888"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#888"
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${formatPrice(value)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#22c55e' : '#ef4444'}
                    strokeWidth={2}
                    fill={`url(#gradient-${symbol})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Volume Chart */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Volume</h3>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={volumeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    stroke="#888"
                    tick={{ fontSize: 12 }}
                    hide
                  />
                  <YAxis
                    stroke="#888"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatVolume}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [formatVolume(value), 'Volume']}
                  />
                  <Bar dataKey="volume" fill="#6366f1" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
