// @/lib/ledger/core/Chain.ts

import { Block } from './Block';
import { Transaction, TransactionType } from './Transaction';

export class Chain {
  private readonly chain: Block[];
  private pendingTransactions: Transaction[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  private createGenesisBlock(): Block {
    return new Block(0, [], '0');
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public addTransaction(transaction: Transaction): void {
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }
    this.pendingTransactions.push(transaction);
  }

  public minePendingTransactions(minerAddress: string): void {
    const block = new Block(
      this.getLatestBlock().index + 1,
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(4); // Adjust difficulty as needed
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(TransactionType.Payment, { amount: 1, recipient: minerAddress }, 'System')
    ];
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  public getBalanceOfAddress(address: string): number {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.sender === address) {
          balance -= transaction.data.amount || 0;
        }
        if (transaction.data.recipient === address) {
          balance += transaction.data.amount || 0;
        }
      }
    }
    return balance;
  }

  public toJSON(): object {
    return {
      chain: this.chain.map(block => block.toJSON()),
      pendingTransactions: this.pendingTransactions.map(tx => tx.toJSON()),
    };
  }
}