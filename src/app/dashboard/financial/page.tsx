"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FinancialEntry = {
  id: string;
  user_id: string;
  amount: number;
  type: 'expense' | 'income';
  description: string;
  category: string;
  date: string;
  created_at: string;
};

const expenseCategories = [
  { value: "food", label: "Food & Dining", color: "bg-orange-500" },
  { value: "transport", label: "Transportation", color: "bg-blue-500" },
  { value: "shopping", label: "Shopping", color: "bg-pink-500" },
  { value: "entertainment", label: "Entertainment", color: "bg-purple-500" },
  { value: "bills", label: "Bills & Utilities", color: "bg-red-500" },
  { value: "health", label: "Healthcare", color: "bg-green-500" },
  { value: "education", label: "Education", color: "bg-indigo-500" },
  { value: "other", label: "Other", color: "bg-gray-500" }
];

const incomeCategories = [
  { value: "salary", label: "Salary", color: "bg-green-600" },
  { value: "freelance", label: "Freelance", color: "bg-blue-600" },
  { value: "business", label: "Business", color: "bg-purple-600" },
  { value: "investment", label: "Investment", color: "bg-indigo-600" },
  { value: "gift", label: "Gift", color: "bg-pink-600" },
  { value: "other", label: "Other", color: "bg-gray-600" }
];

export default function FinancialPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUser(user);
      await loadEntries(user.id);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const loadEntries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('financial_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading entries:', error);
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !amount || !description || !category) return;
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('financial_entries')
        .insert({
          user_id: user.id,
          type,
          amount: parseFloat(amount),
          description,
          category,
          date
        });

      if (error) {
        console.error('Error submitting entry:', error);
        return;
      }

      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Reload entries
      await loadEntries(user.id);
      
      console.log("Financial entry submitted successfully!");
      
    } catch (error) {
      console.error('Error submitting entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Calculate statistics
  const stats = {
    totalIncome: entries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0),
    totalExpenses: entries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0),
    netBalance: entries
      .reduce((sum, e) => sum + (e.type === 'income' ? e.amount : -e.amount), 0),
    thisMonth: entries.filter(e => {
      const entryDate = new Date(e.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && 
             entryDate.getFullYear() === now.getFullYear();
    }).length,
    avgExpense: (() => {
      const expenses = entries.filter(e => e.type === 'expense');
      return expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length : 0;
    })(),
    avgIncome: (() => {
      const income = entries.filter(e => e.type === 'income');
      return income.length > 0 ? income.reduce((sum, e) => sum + e.amount, 0) / income.length : 0;
    })()
  };

  // Get expense breakdown by category
  const expenseBreakdown = expenseCategories.map(cat => {
    const categoryExpenses = entries.filter(e => e.type === 'expense' && e.category === cat.value);
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      ...cat,
      total,
      count: categoryExpenses.length,
      percentage: stats.totalExpenses > 0 ? (total / stats.totalExpenses) * 100 : 0
    };
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-green-200">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="ghost"
                size="sm"
                className="mr-4 hover:bg-gray-100"
              >
                ← Back to Dashboard
              </Button>
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              <h1 className="text-xl font-semibold text-gray-800">Financial Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Income</p>
                  <p className="text-3xl font-bold text-green-600">${stats.totalIncome.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-600">${stats.totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Balance</p>
                  <p className={`text-3xl font-bold ${
                    stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(stats.netBalance).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Expense</p>
                  <p className="text-2xl font-bold text-orange-600">${stats.avgExpense.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Add Transaction Form */}
          <Card className="shadow-lg border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Add New Transaction
              </CardTitle>
              <p className="text-gray-600">Track your income and expenses</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Transaction Type */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Transaction Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setType('income');
                        setCategory('');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        type === 'income'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">💰</div>
                      <div className="text-sm font-medium">Income</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setType('expense');
                        setCategory('');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        type === 'expense'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">💸</div>
                      <div className="text-sm font-medium">Expense</div>
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-2 block">
                    Amount ($)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full border-gray-300"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    Description
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={type === 'income' ? 'Salary, freelance work, etc.' : 'Coffee, groceries, gas, etc.'}
                    className="w-full border-gray-300"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {currentCategories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          category === cat.value
                            ? `border-transparent ${cat.color} text-white`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-sm font-medium">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-gray-300"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!amount || !description || !category || submitting}
                  className={`w-full py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    type === 'income' 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {submitting ? "Saving..." : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="shadow-lg border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Expense Breakdown
              </CardTitle>
              <p className="text-gray-600">Your spending by category</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseBreakdown.length > 0 ? (
                  expenseBreakdown.map((cat) => (
                    <div key={cat.value} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded ${cat.color}`}></div>
                          <span className="font-medium text-gray-900">{cat.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${cat.total.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{cat.count} transactions</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${cat.color}`}
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {cat.percentage.toFixed(1)}% of total expenses
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No expenses recorded yet</p>
                    <p className="text-sm text-gray-400">Add some expenses to see the breakdown</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Recent Transactions */}
        {entries.length > 0 && (
          <Card className="shadow-lg border-gray-200 bg-white mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                Recent Transactions
                <span className="text-sm font-normal text-gray-600">
                  {entries.length} total transactions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.slice(0, 20).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className="text-xl">
                          {entry.type === 'income' ? '💰' : '💸'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{entry.description}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {entry.category.replace('_', ' ')} • {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
}