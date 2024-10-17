// file: @/lib/ledger/core/Chain.ts

import { Block } from './Block';
import { Transaction, TransactionType } from './Transaction';
import { BLOCKCHAIN_CONSTANTS } from '../Constants';

export class Chain {
    private readonly chain: Block[];
    private pendingTransactions: Transaction[];

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }

    private createGenesisBlock(): Block {
        return new Block(0, [], BLOCKCHAIN_CONSTANTS.GENESIS_PREVIOUS_HASH);
    }

    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    public getChain(): Block[] {
        return [...this.chain];
    }

    public getPendingTransactions(): Transaction[] {
        return [...this.pendingTransactions];
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
        block.mineBlock(BLOCKCHAIN_CONSTANTS.MINING_DIFFICULTY);
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(TransactionType.Payment, { amount: BLOCKCHAIN_CONSTANTS.MINING_REWARD, recipient: minerAddress }, 'System')
        ];
    }

    public updateChain(newChain: Block[], newPendingTransactions: Transaction[]): void {
        // Perform validation here if needed
        if (this.isValidChain(newChain)) {
            this.chain.length = 0; // Clear the existing chain
            this.chain.push(...newChain);
            this.pendingTransactions = [...newPendingTransactions];
        } else {
            throw new Error("Invalid chain data");
        }
    }

    private isValidChain(chain: Block[]): boolean {
        // Implement chain validation logic here
        // This is a placeholder and should be replaced with actual validation
        return (chain.length > 0 && this.isChainValid());
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

    public static fromJSON(json: any): Chain {
        const chain = new Chain();
        const newChain = json.chain.map((blockData: any) => Block.fromJSON(blockData));
        const newPendingTransactions = json.pendingTransactions.map((txData: any) => Transaction.fromJSON(txData));
        chain.updateChain(newChain, newPendingTransactions);
        return chain;
    }
}