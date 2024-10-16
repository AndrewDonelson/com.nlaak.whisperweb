// @/lib/ledger/core/Block.ts

import { Transaction } from './Transaction';
import { SHA256 } from 'crypto-js';

export class Block {
  public readonly index: number;
  public readonly timestamp: number;
  public readonly transactions: Transaction[];
  public readonly previousHash: string;
  public nonce: number = 0;
  public hash: string;

  constructor(
    index: number,
    transactions: Transaction[],
    previousHash: string
  ) {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  public calculateHash(): string {
    return SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce
    ).toString();
  }

  public mineBlock(difficulty: number): void {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  public hasValidTransactions(): boolean {
    return this.transactions.every(tx => tx.isValid());
  }

  public toJSON(): object {
    return {
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions.map(tx => tx.toJSON()),
      previousHash: this.previousHash,
      nonce: this.nonce,
      hash: this.hash,
    };
  }
}