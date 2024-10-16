// @/lib/ledger/core/Transaction.ts

import { v4 as uuidv4 } from 'uuid';

export enum TransactionType {
  Message = 'Message',
  Post = 'Post',
  Payment = 'Payment'
}

export interface TransactionData {
  message?: string;
  postContent?: string;
  amount?: number;
  recipient?: string;
}

export class Transaction {
  public readonly id: string;
  public readonly timestamp: number;
  public readonly type: TransactionType;
  public readonly data: TransactionData;
  public readonly sender: string;
  public signature: string | null = null;

  constructor(type: TransactionType, data: TransactionData, sender: string) {
    this.id = uuidv4();
    this.timestamp = Date.now();
    this.type = type;
    this.data = data;
    this.sender = sender;
  }

  public sign(signature: string): void {
    this.signature = signature;
  }

  public isValid(): boolean {
    // Basic validation logic
    if (!this.id || !this.timestamp || !this.type || !this.sender || !this.signature) {
      return false;
    }

    switch (this.type) {
      case TransactionType.Message:
        return typeof this.data.message === 'string' && this.data.message.length > 0;
      case TransactionType.Post:
        return typeof this.data.postContent === 'string' && this.data.postContent.length > 0;
      case TransactionType.Payment:
        return typeof this.data.amount === 'number' && this.data.amount > 0 && typeof this.data.recipient === 'string';
      default:
        return false;
    }
  }

  public toJSON(): object {
    return {
      id: this.id,
      timestamp: this.timestamp,
      type: this.type,
      data: this.data,
      sender: this.sender,
      signature: this.signature,
    };
  }
}