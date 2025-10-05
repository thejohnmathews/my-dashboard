"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

type MoodEntry = {
  id: string;
  mood: string;
  productivity: number;
  task: string;
  notes?: string;
  created_at: string;
  user_id: string;
};

type FinancialEntry = {
  id: string;
  user_id: string;
  amount: number;
  type: 'expense' | 'income';
  description: string;
  date: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUser(user);
      await loadAllData(user.id);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const loadAllData = async (userId: string) => {
    try {
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setMoodEntries(moodData || []);

      const { data: financialData } = await supabase
        .from('financial_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setFinancialEntries(financialData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Calculate analytics
  const moodAnalytics = {
    totalEntries: moodEntries.length,
    avgProductivity: moodEntries.length > 0 
      ? (moodEntries.reduce((sum, entry) => sum + entry.productivity, 0) / moodEntries.length).toFixed(1)
      : '0.0',
    thisWeek: moodEntries.filter(e => {
      const entryDate = new Date(e.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length,
    currentStreak: (() => {
      const today = new Date();
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const hasEntry = moodEntries.some(entry => 
          new Date(entry.created_at).toDateString() === checkDate.toDateString()
        );
        if (hasEntry) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    })()
  };

  const financialAnalytics = {
    totalIncome: financialEntries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0),
    totalExpenses: financialEntries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0),
    netBalance: financialEntries
      .reduce((sum, e) => sum + (e.type === 'income' ? e.amount : -e.amount), 0),
    thisMonth: financialEntries.filter(e => {
      const entryDate = new Date(e.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && 
             entryDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Salud Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-200">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0 flex-1 sm:flex-none">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-sm sm:text-xl font-semibold text-gray-800 truncate">
                <span className="hidden sm:inline">Salud - Dashboard</span>
                <span className="sm:hidden">Salud</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-600 hidden md:block truncate max-w-32 lg:max-w-none">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Personal Widgits Overview
          </h2>
          <p className="text-gray-600">
            Track everything that matters to you - mood, productivity, and finances - all in one place.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mood Check-ins</p>
                  <p className="text-3xl font-bold text-purple-600">{moodAnalytics.totalEntries}</p>
                  <p className="text-xs text-gray-500">total entries</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
                  <p className="text-3xl font-bold text-green-600">{moodAnalytics.avgProductivity}</p>
                  <p className="text-xs text-gray-500">out of 10</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Balance</p>
                  <p className={`text-3xl font-bold ${
                    financialAnalytics.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(financialAnalytics.netBalance).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {financialAnalytics.netBalance >= 0 ? 'positive' : 'negative'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-600">{moodAnalytics.currentStreak}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Module Navigation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-all cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">🧠</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">Mood & Productivity</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Daily check-ins and mental health tracking</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/dashboard/mood')}
                  className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto flex-shrink-0"
                  size="sm"
                >
                  <span className="sm:hidden">Open Mood Tracker</span>
                  <span className="hidden sm:inline">Open →</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{moodAnalytics.totalEntries}</p>
                    <p className="text-xs text-gray-600">Total Entries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{moodAnalytics.avgProductivity}</p>
                    <p className="text-xs text-gray-600">Avg Productivity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{moodAnalytics.thisWeek}</p>
                    <p className="text-xs text-gray-600">This Week</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Recent Mood Trend</p>
                  <div className="flex space-x-1">
                    {moodEntries.slice(0, 7).map((entry, index) => {
                      let color = 'bg-gray-200';
                      switch (entry.mood) {
                        case 'excited': color = 'bg-green-500'; break;
                        case 'happy': color = 'bg-yellow-400'; break;
                        case 'neutral': color = 'bg-gray-400'; break;
                        case 'sad': color = 'bg-blue-500'; break;
                        case 'stressed': color = 'bg-red-500'; break;
                      }
                      return (
                        <div key={index} className={`w-4 h-4 rounded-sm ${color}`} />
                      );
                    })}
                    {Array.from({ length: Math.max(0, 7 - moodEntries.length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="w-4 h-4 rounded-sm bg-gray-100 border border-gray-200" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-all cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">💰</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">Financial Tracker</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Income, expenses, and financial analytics</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/dashboard/financial')}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto flex-shrink-0"
                  size="sm"
                >
                  <span className="sm:hidden">Open Financial Tracker</span>
                  <span className="hidden sm:inline">Open →</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${financialAnalytics.totalIncome.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Income</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      ${financialAnalytics.totalExpenses.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Expenses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{financialAnalytics.thisMonth}</p>
                    <p className="text-xs text-gray-600">This Month</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Income vs Expenses</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${financialAnalytics.totalIncome > 0 ? 
                              (financialAnalytics.totalIncome / Math.max(financialAnalytics.totalIncome + financialAnalytics.totalExpenses, 1)) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">Inc</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${financialAnalytics.totalExpenses > 0 ? 
                              (financialAnalytics.totalExpenses / Math.max(financialAnalytics.totalIncome + financialAnalytics.totalExpenses, 1)) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">Exp</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="shadow-lg border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Recent Mood Check-ins
              </CardTitle>
              <p className="text-sm text-gray-600">Your latest mood and productivity entries</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moodEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                        <span className="text-sm">
                          {entry.mood === 'excited' ? '🤩' :
                           entry.mood === 'happy' ? '😊' :
                           entry.mood === 'neutral' ? '😐' :
                           entry.mood === 'sad' ? '😢' :
                           entry.mood === 'stressed' ? '😰' : '❓'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{entry.mood}</p>
                        <p className="text-sm text-gray-600">
                          Productivity: {entry.productivity}/10 • {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {moodEntries.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No mood entries yet</p>
                    <p className="text-sm text-gray-400">Start tracking your mood and productivity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Recent Transactions
              </CardTitle>
              <p className="text-sm text-gray-600">Your latest financial activity</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financialEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className="text-sm">
                          {entry.type === 'income' ? '💰' : '💸'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{entry.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
                {financialEntries.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Start tracking your finances</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

      </main>
    </div>
  );
}
