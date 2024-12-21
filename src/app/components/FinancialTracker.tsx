// app/components/FinancialTracker.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import {
  Transaction,
  TransactionType,
  TransactionTypeOption,
  PaymentMethodOption,
  BankAccount,
  CreditCard,
  FormData
} from '../types/finance';

const FinancialTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const defaultFormData: FormData = {
    date: '',
    type: 'expense',
    category: '',
    amount: '',
    paymentMethod: 'cash',
    bankAccount: '',
    creditCard: '',
    person: '',
    description: ''
  };

  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const transactionTypes: TransactionTypeOption[] = [
    { id: 'expense', name: 'Regular Expense' },
    { id: 'salary', name: 'Salary Income' },
    { id: 'investment', name: 'Investment Income' },
    { id: 'other_income', name: 'Other Income' },
    { id: 'lent', name: 'Money Lent' },
    { id: 'borrowed', name: 'Money Borrowed' },
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

    // Income Categories
    'Monthly Salary',
    'Bonus',
    'Stock Dividends',
    'Stock Sale Gains',
    'Mutual Fund Returns',
    'Interest Income',
    'Rental Income',
    'Freelance Income',

    // Expense Categories
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

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      bankAccount: transaction.bankAccount || '',
      creditCard: transaction.creditCard || '',
      person: transaction.person || '',
      description: transaction.description
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }

      // After successful deletion, fetch fresh data
      await fetchTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTransaction) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update transaction');
      }

      // After successful update, fetch fresh data
      await fetchTransactions();
      setFormData(defaultFormData);
      setEditingTransaction(null);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!currentMonth) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/transactions?month=${currentMonth}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Use this in useEffect
  useEffect(() => {
    fetchTransactions();
  }, [currentMonth]);

  const handleCancel = () => {
    setFormData(defaultFormData);
    setEditingTransaction(null);
    setIsEditing(false);
  };

  const getRelevantCategories = (type: TransactionType) => {
    switch (type) {
      case 'salary':
        return ['Monthly Salary', 'Bonus'];
      case 'investment':
        return ['Stock Dividends', 'Stock Sale Gains', 'Mutual Fund Returns', 'Interest Income'];
      case 'other_income':
        return ['Rental Income', 'Freelance Income', 'Others'];
      case 'expense':
        return categories.filter(cat =>
          !['Monthly Salary', 'Bonus', 'Stock Dividends', 'Stock Sale Gains',
            'Mutual Fund Returns', 'Interest Income', 'Rental Income', 'Freelance Income'
          ].includes(cat)
        );
      default:
        return categories;
    }
  };

  const getMonthlyStats = () => {
    const monthlyTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
      return transactionMonth === currentMonth;
    });

    return {
      totalExpenses: monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      totalSalary: monthlyTransactions
        .filter(t => t.type === 'salary')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      totalInvestmentIncome: monthlyTransactions
        .filter(t => t.type === 'investment')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      totalOtherIncome: monthlyTransactions
        .filter(t => t.type === 'other_income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    };
  };

  // Handle form submission for new transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formattedData = {
        ...formData,
        date: formData.date,
        amount: parseFloat(formData.amount)
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      // After successful creation, fetch fresh data
      const newTransaction = await response.json();
      await fetchTransactions(); // We'll create this function
      setFormData(defaultFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = getMonthlyStats();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Financial Tracker</h1>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold">Monthly Expenses</h3>
          <p className="text-xl">₹{stats.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold">Salary Income</h3>
          <p className="text-xl">₹{stats.totalSalary.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold">Investment Income</h3>
          <p className="text-xl">₹{stats.totalInvestmentIncome.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold">Other Income</h3>
          <p className="text-xl">₹{stats.totalOtherIncome.toFixed(2)}</p>
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
          max={new Date().toISOString().slice(0, 7)} // Limit to current month
        />
      </div>

      {/* Transaction Form */}
      <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="space-y-4">
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
              {getRelevantCategories(formData.type as TransactionType).map(cat => (
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
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
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
                <th className="p-2 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(t => {
                  // Convert the ISO date string to YYYY-MM format for comparison
                  const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
                  return transactionMonth === currentMonth;
                })
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(transaction => (
                  <tr key={transaction.id} className={editingTransaction?.id === transaction.id ? 'bg-blue-50' : ''}>
                    <td className="p-2 border">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="p-2 border">{transactionTypes.find(t => t.id === transaction.type)?.name}</td>
                    <td className="p-2 border">{transaction.category}</td>
                    <td className="p-2 border">₹{Number(transaction.amount).toFixed(2)}</td>
                    <td className="p-2 border">
                      {paymentMethods.find(m => m.id === transaction.paymentMethod)?.name}
                      {transaction.creditCard && ` - ${creditCards.find(c => c.id === transaction.creditCard)?.name}`}
                    </td>
                    <td className="p-2 border">{transaction.person || '-'}</td>
                    <td className="p-2 border">{transaction.description}</td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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