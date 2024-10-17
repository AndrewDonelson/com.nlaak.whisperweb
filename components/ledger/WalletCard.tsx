// file: @/components/ledger/WalletCard.tsx
import React, { useState } from 'react';
import { Wallet } from '@/lib/ledger/core/Wallet';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, Unlock, Copy, Eye, EyeOff } from 'lucide-react';

interface WalletCardProps {
  wallet: Wallet;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleUnlock = () => {
    try {
      wallet.unlock(passphrase);
      setIsUnlocking(false);
      setPassphrase('');
    } catch (error) {
      console.error('Failed to unlock wallet:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleLock = () => {
    try {
      wallet.lock(passphrase);
      setPassphrase('');
    } catch (error) {
      console.error('Failed to lock wallet:', error);
      // You might want to show an error message to the user here
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a success message to the user here
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{wallet.getWalletName()}</CardTitle>
          <Badge variant={wallet['encrypted'] ? "secondary" : "destructive"} className={`text-sm ${wallet['encrypted'] ? "bg-green-100 text-green-800" : ""}`}>
            {wallet['encrypted'] ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
            {wallet['encrypted'] ? 'Locked' : 'Unlocked'}
          </Badge>
        </div>
        <CardDescription>
          Wallet Address: {wallet.getAddress().substring(0, 10)}...
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(wallet.getAddress())}>
            <Copy className="w-4 h-4" />
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Balance</p>
          <p className="text-2xl font-bold">{wallet.getBalance().toString()} coins</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Tags</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {wallet.getTags().map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
        {!wallet['encrypted'] && (
          <div>
            <p className="text-sm font-medium text-gray-500">Public Key</p>
            <p className="text-xs font-mono truncate">{wallet.getPublicKey()}</p>
          </div>
        )}
        {!wallet['encrypted'] && (
          <div>
            <p className="text-sm font-medium text-gray-500">Private Key</p>
            <div className="flex items-center space-x-2">
              <p className="text-xs font-mono truncate">
                {showPrivateKey ? wallet.getPrivateKey() : '••••••••••••••••'}
              </p>
              <Button variant="ghost" size="sm" onClick={() => setShowPrivateKey(!showPrivateKey)}>
                {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {wallet['encrypted'] ? (
          <Dialog open={isUnlocking} onOpenChange={setIsUnlocking}>
            <DialogTrigger asChild>
              <Button variant="outline">Unlock Wallet</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unlock Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
                <Button onClick={handleUnlock}>Unlock</Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button variant="outline" onClick={handleLock}>Lock Wallet</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletCard;