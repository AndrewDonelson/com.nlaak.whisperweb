// file: @/app/ledger/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Chain } from '@/lib/ledger/core/Chain';
import { Wallet, WalletOptions } from '@/lib/ledger/core/Wallet';
import { Transaction, TransactionType } from '@/lib/ledger/core/Transaction';
import ChainTable from '@/components/ledger/ChainTable';
import WalletCard from '@/components/ledger/WalletCard';
import TransactionCard from '@/components/ledger/TransactionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const BlockchainExplorer = () => {
  const [chain, setChain] = useState<Chain>(new Chain());
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize wallet
    const walletOptions: WalletOptions = {
      organizationID: BigInt(1),
      appID: BigInt(1),
      userID: BigInt(1),
      assetID: BigInt(1),
      name: "Explorer Wallet",
      passphrase: "examplePassphrase",
      tags: ["explorer"]
    };
    setWallet(new Wallet(walletOptions));

    // Simulate fetching latest transactions
    const sampleTransactions = [
      new Transaction(TransactionType.Message, { message: "Hello, blockchain!" }, "sender123"),
      new Transaction(TransactionType.Payment, { amount: 10, recipient: "recipient456" }, "sender789"),
      new Transaction(TransactionType.Post, { postContent: "First post on the chain!" }, "poster101")
    ];
    setLatestTransactions(sampleTransactions);
  }, []);

  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching for:", searchTerm);
    // You would typically query your blockchain here based on the search term
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-3xl font-bold mb-6">Blockchain Explorer</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Search for blocks, transactions, or addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              placeholder="Enter block number, transaction ID, or address" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chain" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chain">Blockchain</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="transactions">Latest Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="chain">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Overview</CardTitle>
              <CardDescription>View all blocks and transactions in the chain</CardDescription>
            </CardHeader>
            <CardContent>
              <ChainTable chain={chain} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Explorer Wallet</CardTitle>
              <CardDescription>Manage your blockchain wallet</CardDescription>
            </CardHeader>
            <CardContent>
              {wallet && <WalletCard wallet={wallet} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Latest Transactions</CardTitle>
              <CardDescription>View the most recent transactions on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {latestTransactions.map((tx, index) => (
                  <div key={index} className="mb-4">
                    <TransactionCard transaction={tx} />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockchainExplorer;