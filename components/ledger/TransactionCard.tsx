// file: @/components/ledger/TransactionCard.tsx
import React from 'react';
import { Transaction, TransactionType } from '@/lib/ledger/core/Transaction';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, FileText, CreditCard } from 'lucide-react';

/** 
 * Example Usage:
 
import TransactionCard from '@/components/TransactionCard';
import { Transaction, TransactionType } from '@/lib/ledger/core/Transaction';

const YourPage = () => {
  const sampleTransaction: Transaction = new Transaction(
    TransactionType.Message,
    { message: "Hello, blockchain!" },
    "sender123"
  );

  return (
    <div className="p-4">
      <TransactionCard transaction={sampleTransaction} />
    </div>
  );
};

export default YourPage;
**/
interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.Message:
        return <MessageSquare className="w-4 h-4" />;
      case TransactionType.Post:
        return <FileText className="w-4 h-4" />;
      case TransactionType.Payment:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTransactionContent = (transaction: Transaction) => {
    switch (transaction.type) {
      case TransactionType.Message:
        return transaction.data.message;
      case TransactionType.Post:
        return transaction.data.postContent;
      case TransactionType.Payment:
        return `Amount: ${transaction.data.amount} to ${transaction.data.recipient}`;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Transaction</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            {getTypeIcon(transaction.type)}
            {transaction.type}
          </Badge>
        </div>
        <CardDescription>
          {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Content:</p>
          <p className="text-sm">{getTransactionContent(transaction)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <p className="text-xs text-gray-500">
          <span className="font-medium">ID:</span> {transaction.id}
        </p>
        <p className="text-xs text-gray-500">
          <span className="font-medium">Sender:</span> {transaction.sender}
        </p>
        <p className="text-xs text-gray-500">
          <span className="font-medium">Signature:</span> {transaction.signature ? transaction.signature.slice(0, 20) + '...' : 'Not signed'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default TransactionCard;