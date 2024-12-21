// app/types/finance.ts

export interface Transaction {
    id: number;
    date: string;
    type: TransactionType;
    category: string;
    amount: string;
    paymentMethod: PaymentMethod;
    bankAccount?: string;
    creditCard?: string;
    person?: string;
    description: string;
    timestamp: string;
  }
  
  export type TransactionType = 'expense' | 'lent' | 'borrowed' | 'received' | 'reimbursement' | 'shared' | 'salary' | 'investment' | 'other_income';
  export type PaymentMethod = 'cash' | 'bank' | 'credit' | 'upi';
  
  export interface TransactionTypeOption {
    id: TransactionType;
    name: string;
  }
  
  export interface PaymentMethodOption {
    id: PaymentMethod;
    name: string;
  }
  
  export interface BankAccount {
    id: string;
    name: string;
  }
  
  export interface CreditCard {
    id: string;
    name: string;
  }
  
  export interface FormData {
    date: string;
    type: TransactionType;
    category: string;
    amount: string;
    paymentMethod: PaymentMethod;
    bankAccount: string;
    creditCard: string;
    person: string;
    description: string;
  }
  