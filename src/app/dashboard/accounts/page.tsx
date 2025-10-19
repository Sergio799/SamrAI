'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, PlusCircle, TrendingUp, Wallet, Trash2 } from "lucide-react";
import { LinkAccountDialog } from '@/components/dashboard/LinkAccountDialog';

const mockAccounts = [
    {
        id: '1',
        institution: 'Chase Bank',
        name: 'Checking',
        mask: '1234',
        balance: 5420.11,
        type: 'depository',
    },
    {
        id: '2',
        institution: 'Fidelity',
        name: 'Brokerage Account',
        mask: '5678',
        balance: 88324.50,
        type: 'investment',
    },
    {
        id: '3',
        institution: 'Coinbase',
        name: 'Digital Wallet',
        mask: '9012',
        balance: 18450.75,
        type: 'crypto',
    },
    {
        id: '4',
        institution: 'Bank of America',
        name: 'Savings',
        mask: '3456',
        balance: 25000.00,
        type: 'depository',
    },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
}).format(value);

const AccountIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'investment':
            return <TrendingUp className="w-6 h-6 text-primary" />;
        case 'crypto':
            return <Wallet className="w-6 h-6 text-primary" />;
        default:
            return <Landmark className="w-6 h-6 text-primary" />;
    }
}


export default function AccountsPage() {
    const [accounts, setAccounts] = useState(mockAccounts);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

    const handleDeleteAccount = (accountId: string) => {
        setAccounts(accounts.filter((acc) => acc.id !== accountId));
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                    <Landmark className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Linked Accounts</h1>
                </div>
                <Button onClick={() => setIsLinkDialogOpen(true)} size="sm" className="md:size-default">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    <span className="hidden sm:inline">Link New Account</span>
                    <span className="sm:hidden">Link Account</span>
                </Button>
            </div>

            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-2xl">
                Connect your external bank and brokerage accounts to get a complete, unified view of your financial life.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {accounts.map((account) => (
                    <Card key={account.id} className="hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <AccountIcon type={account.type} />
                                    <span className="text-xl">{account.institution}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteAccount(account.id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">{account.name} •••• {account.mask}</p>
                            <p className="text-3xl font-bold mt-2 text-white">
                                {formatCurrency(account.balance)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                <Card
                    onClick={() => setIsLinkDialogOpen(true)}
                    className="border-dashed border-2 hover:border-primary hover:bg-accent/20 transition-colors flex items-center justify-center min-h-[160px] md:min-h-[190px] cursor-pointer"
                >
                    <div className="text-center text-muted-foreground">
                        <PlusCircle className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2" />
                        <p className="text-base md:text-lg font-semibold">Link New Account</p>
                    </div>
                </Card>
            </div>
            <LinkAccountDialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen} />
        </div>
    );
}
