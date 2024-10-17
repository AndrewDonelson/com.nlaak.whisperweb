// file: @/lib/ledger/core/Transaction.ts

import { v4 as uuidv4 } from 'uuid';
import { TRANSACTION_CONSTANTS } from '../Constants';

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

interface TransactionState {
  id: string;
  timestamp: number;
  type: TransactionType;
  data: TransactionData;
  sender: string;
  signature: string | null;
}

export class Transaction {
  private state: TransactionState;

  constructor(type: TransactionType, data: TransactionData, sender: string) {
    this.state = {
      id: uuidv4(),
      timestamp: Date.now(),
      type,
      data,
      sender,
      signature: null
    };
  }

  get id(): string { return this.state.id; }
  get timestamp(): number { return this.state.timestamp; }
  get type(): TransactionType { return this.state.type; }
  get data(): TransactionData { return this.state.data; }
  get sender(): string { return this.state.sender; }
  get signature(): string | null { return this.state.signature; }

  public sign(signature: string): void {
    this.state.signature = signature;
  }

  public isValid(): boolean {
    if (!this.id || !this.timestamp || !this.type || !this.sender || !this.signature) {
      return false;
    }

    switch (this.type) {
      case TransactionType.Message:
        return typeof this.data.message === 'string' && this.data.message.length >= TRANSACTION_CONSTANTS.MIN_MESSAGE_LENGTH;
      case TransactionType.Post:
        return typeof this.data.postContent === 'string' && this.data.postContent.length > 0;
      case TransactionType.Payment:
        return typeof this.data.amount === 'number' && 
               this.data.amount >= TRANSACTION_CONSTANTS.MIN_PAYMENT_AMOUNT && 
               typeof this.data.recipient === 'string';
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

  public static fromJSON(json: any): Transaction {
    const transaction = new Transaction(json.type, json.data, json.sender);
    transaction.state.id = json.id;
    transaction.state.timestamp = json.timestamp;
    transaction.state.signature = json.signature;
    return transaction;
  }
}