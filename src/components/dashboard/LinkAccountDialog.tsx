'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Landmark, Wallet, TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';

const institutions = [
  { name: 'Robinhood', icon: TrendingUp },
  { name: 'Coinbase', icon: Wallet },
  { name: 'Fidelity', icon: TrendingUp },
  { name: 'Chase', icon: Landmark },
  { name: 'Bank of America', icon: Landmark },
  { name: 'Charles Schwab', icon: TrendingUp },
  { name: 'Vanguard', icon: TrendingUp },
  { name: 'E*TRADE', icon: TrendingUp },
];

type LinkAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LinkAccountDialog({ open, onOpenChange }: LinkAccountDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstitutions = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInstitutionClick = (name: string) => {
    console.log(`Simulating connection to ${name}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Link a New Account</DialogTitle>
          <DialogDescription>
            Select your financial institution to connect your account.
          </DialogDescription>
        </DialogHeader>
        <div className="relative my-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search institutions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {filteredInstitutions.map(({name, icon: Icon}) => (
                <Button 
                    key={name}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => handleInstitutionClick(name)}
                >
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="text-sm">{name}</span>
                </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
