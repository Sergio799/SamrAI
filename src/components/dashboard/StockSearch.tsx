'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { searchStocks, type StockSearchResult } from '@/lib/stock-search';
import { useDebounce } from '@/hooks/use-debounce';

interface StockSearchProps {
  onAddStock: (symbol: string, name: string) => void;
}

export function StockSearch({ onAddStock }: StockSearchProps) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Search when debounced query changes
  useEffect(() => {
    async function search() {
      if (debouncedQuery.length < 1) {
        setResults([]);
        return;
      }

      setLoading(true);
      const searchResults = await searchStocks(debouncedQuery);
      setResults(searchResults);
      setLoading(false);
      setIsOpen(true);
    }

    search();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddStock = (result: StockSearchResult) => {
    onAddStock(result.symbol, result.name);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, TSLA, BTC-USD)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <Card className="absolute z-50 w-full mt-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.symbol}
                  onClick={() => handleAddStock(result)}
                  className="w-full px-4 py-3 hover:bg-accent transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{result.symbol}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                        {result.name}
                      </div>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
