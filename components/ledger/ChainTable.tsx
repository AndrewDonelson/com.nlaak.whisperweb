//file: @/components/ledger/ChainTable.tsx
import React, { useState } from 'react';
import { Chain } from '@/lib/ledger/core/Chain';
import { Block } from '@/lib/ledger/core/Block';
import { Transaction } from '@/lib/ledger/core/Transaction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import BlockCard from './BlockCard';
import TransactionCard from './TransactionCard';

/**  
Example Usage:

import ChainView from '@/components/ChainView';
import { Chain } from '@/lib/ledger/core/Chain';

const YourPage = () => {
  const chain = new Chain(); // Initialize your chain here

  return (
    <div className="p-4">
      <ChainView chain={chain} />
    </div>
  );
};

export default YourPage;
**/
interface ChainTableProps {
  chain: Chain;
}

const ChainTable: React.FC<ChainTableProps> = ({ chain }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const chainData = chain.toJSON() as { chain: Block[], pendingTransactions: Transaction[] };
  const isValid = chain.isChainValid();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Blockchain</CardTitle>
          <Badge variant={isValid ? "secondary" : "destructive"} className={`text-sm ${isValid ? "bg-green-100 text-green-800" : ""}`}>
            {isValid ? (
              <><CheckCircle className="w-4 h-4 mr-1" /> Valid</>
            ) : (
              <><XCircle className="w-4 h-4 mr-1" /> Invalid</>
            )}
          </Badge>
        </div>
        <CardDescription>
          Total Blocks: {chainData.chain.length} | Pending Transactions: {chainData.pendingTransactions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Block #</TableHead>
                <TableHead>Hash (first 8 chars)</TableHead>
                <TableHead>Prev Hash (first 8 chars)</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chainData.chain.map((block: Block) => (
                <TableRow key={block.index}>
                  <TableCell className="font-medium">{block.index}</TableCell>
                  <TableCell>{block.hash.substring(0, 8)}...</TableCell>
                  <TableCell>{block.previousHash.substring(0, 8)}...</TableCell>
                  <TableCell className="text-right">{block.transactions.length}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedBlock(block)}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Block Details</DialogTitle>
                        </DialogHeader>
                        {selectedBlock && <BlockCard block={selectedBlock} />}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Pending Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID (first 8 chars)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chainData.pendingTransactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id.substring(0, 8)}...</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.sender}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && <TransactionCard transaction={selectedTransaction} />}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChainTable;