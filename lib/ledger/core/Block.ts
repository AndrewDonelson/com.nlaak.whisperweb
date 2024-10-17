// file: @/lib/ledger/core/Block.ts

import { Transaction } from './Transaction';
import { SHA256 } from 'crypto-js';
import { BLOCKCHAIN_CONSTANTS } from '../Constants';

interface BlockState {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  nonce: number;
  hash: string;
}

export class Block {
  private state: BlockState;

  constructor(
    index: number,
    transactions: Transaction[],
    previousHash: string
  ) {
    this.state = {
      index,
      timestamp: Date.now(),
      transactions,
      previousHash,
      nonce: 0,
      hash: ''
    };
    this.state.hash = this.calculateHash();
  }

  get index(): number { return this.state.index; }
  get timestamp(): number { return this.state.timestamp; }
  get transactions(): Transaction[] { return this.state.transactions; }
  get previousHash(): string { return this.state.previousHash; }
  get nonce(): number { return this.state.nonce; }
  set nonce(value: number) { this.state.nonce = value; }
  get hash(): string { return this.state.hash; }
  set hash(value: string) { this.state.hash = value; }

  public calculateHash(): string {
    return SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce
    ).toString();
  }

  public mineBlock(difficulty: number = BLOCKCHAIN_CONSTANTS.MINING_DIFFICULTY): void {
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

  public static fromJSON(json: any): Block {
    const block = new Block(
      json.index,
      json.transactions.map((txData: any) => Transaction.fromJSON(txData)),
      json.previousHash
    );
    block.state.timestamp = json.timestamp;
    block.state.nonce = json.nonce;
    block.state.hash = json.hash;
    return block;
  }
}