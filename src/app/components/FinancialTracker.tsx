// app/components/FinancialTracker.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Transaction,
  TransactionType,
  PaymentMethod,
  TransactionTypeOption,
  PaymentMethodOption,
  BankAccount,
  CreditCard,
  FormData
} from '../types/finance';

const FinancialTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  
  const [formData, setFormData] = useState<FormData>({
    date: '',
    type: 'expense',
    category: '',
    amount: '',
    paymentMethod: 'cash',
    bankAccount: '',
    creditCard: '',
    person: '',
    description: ''
  });

  // Configuration data
  const transactionTypes: TransactionTypeOption[] = [
    { id: 'expense', name: 'Regular Expense' },
    { id: 'lent', name: 'Money Lent' },
    { id: 'borrowed', name: 'Money Borrowed' },
    { id: 'received', name: 'Money Received' },
    { id: 'reimbursement', name: 'Office Reimbursement' },
    { id: 'shared', name: 'Shared Expense' }
  ];

  const bankAccounts: BankAccount[] = [
    { id: 'hdfc_savings', name: 'HDFC Savings' },
    { id: 'icici_salary', name: 'ICICI Salary Account' },
    { id: 'sbi_savings', name: 'SBI Savings' }
  ];

  const creditCards: CreditCard[] = [
    { id: 'hdfc_card', name: 'HDFC Credit Card' },
    { id: 'icici_card', name: 'ICICI Credit Card' },
    { id: 'axis_card', name: 'Axis Credit Card' }
  ];

  const categories: string[] = [
    'Food & Groceries',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Personal Care',
    'Office Expenses',
    'Loans',
    'Credit Card Bill',
    'Others'
  ];

  const paymentMethods: PaymentMethodOption[] = [
    { id: 'cash', name: 'Cash' },
    { id: 'bank', name: 'Bank Transfer' },
    { id: 'credit', name: 'Credit Card' },
    { id: 'upi', name: 'UPI' }
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMonthlyStats = () => {
    const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    return {
      totalExpenses: monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      totalLent: monthlyTransactions
        .filter(t => t.type === 'lent')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      totalReceived: monthlyTransactions
        .filter(t => t.type === 'received')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    };
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTransaction]);
    
    // Reset form
    setFormData({
      date: '',
      type: 'expense',
      category: '',
      amount: '',
      paymentMethod: 'cash',
      bankAccount: '',
      creditCard: '',
      person: '',
      description: ''
    });
  };

  const stats = getMonthlyStats();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Financial Tracker</h1>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold">Monthly Expenses</h3>
          <p className="text-xl">₹{stats.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold">Money Lent</h3>
          <p className="text-xl">₹{stats.totalLent.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold">Money Received</h3>
          <p className="text-xl">₹{stats.totalReceived.toFixed(2)}</p>
        </div>
      </div>

      {/* Monthly selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Month</label>
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Transaction Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              {transactionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter amount"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id}>{method.name}</option>
              ))}
            </select>
          </div>
          {(['lent', 'borrowed', 'shared', 'reimbursement'].includes(formData.type)) && (
            <div>
              <label className="block text-sm font-medium mb-1">Person/Company</label>
              <input
                type="text"
                name="person"
                value={formData.person}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter name"
                required
              />
            </div>
          )}
        </div>

        {formData.paymentMethod === 'bank' && (
          <div>
            <label className="block text-sm font-medium mb-1">Bank Account</label>
            <select
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Bank Account</option>
              {bankAccounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
        )}

        {formData.paymentMethod === 'credit' && (
          <div>
            <label className="block text-sm font-medium mb-1">Credit Card</label>
            <select
              name="creditCard"
              value={formData.creditCard}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Credit Card</option>
              {creditCards.map(card => (
                <option key={card.id} value={card.id}>{card.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter description"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>

      {/* Transactions List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Monthly Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">Date</th>
                <th className="p-2 text-left border">Type</th>
                <th className="p-2 text-left border">Category</th>
                <th className="p-2 text-left border">Amount</th>
                <th className="p-2 text-left border">Payment</th>
                <th className="p-2 text-left border">Person</th>
                <th className="p-2 text-left border">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(t => t.date.startsWith(currentMonth))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(transaction => (
                  <tr key={transaction.id}>
                    <td className="p-2 border">{transaction.date}</td>
                    <td className="p-2 border">{transactionTypes.find(t => t.id === transaction.type)?.name}</td>
                    <td className="p-2 border">{transaction.category}</td>
                    <td className="p-2 border">₹{Number(transaction.amount).toFixed(2)}</td>
                    <td className="p-2 border">
                      {paymentMethods.find(m => m.id === transaction.paymentMethod)?.name}
                      {transaction.creditCard && ` - ${creditCards.find(c => c.id === transaction.creditCard)?.name}`}
                    </td>
                    <td className="p-2 border">{transaction.person || '-'}</td>
                    <td className="p-2 border">{transaction.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialTracker;