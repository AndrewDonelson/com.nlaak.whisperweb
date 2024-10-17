// file: @/components/ledger/BlockCard.tsx
import React, { useState } from 'react';
import { Block } from '@/lib/ledger/core/Block';
import { Transaction } from '@/lib/ledger/core/Transaction';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Hash, Clock, Link } from 'lucide-react';
import TransactionCard from './TransactionCard';
/** 
 Example Usage:
 
 import BlockCard from '@/components/BlockCard';
import { Block } from '@/lib/ledger/core/Block';
import { Transaction, TransactionType } from '@/lib/ledger/core/Transaction';

const YourPage = () => {
  const sampleTransaction = new Transaction(
    TransactionType.Message,
    { message: "Hello, blockchain!" },
    "sender123"
  );

  const sampleBlock = new Block(1, [sampleTransaction], "previoushash123");

  return (
    <div className="p-4">
      <BlockCard block={sampleBlock} />
    </div>
  );
};

export default YourPage;
 **/
interface BlockCardProps {
  block: Block;
}

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Block #{block.index}</CardTitle>
          <Badge variant="secondary" className="text-sm">
            {block.transactions.length} Transactions
          </Badge>
        </div>
        <CardDescription>
          {formatDistanceToNow(block.timestamp, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium">Hash:</p>
            <p className="text-sm font-mono truncate">{block.hash}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium">Previous Hash:</p>
            <p className="text-sm font-mono truncate">{block.previousHash}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium">Nonce:</p>
            <p className="text-sm">{block.nonce}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Collapsible className="w-full" open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {isExpanded ? (
                <>Hide Transactions <ChevronUp className="w-4 h-4 ml-2" /></>
              ) : (
                <>Show Transactions <ChevronDown className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {block.transactions.map((transaction: Transaction, index: number) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};

export default BlockCard;