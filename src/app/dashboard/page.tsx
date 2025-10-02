"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

// Schema for mood/productivity tracking
const moodSchema = z.object({
  mood: z.string().min(1, "Please select a mood"),
  productivity: z.number().min(1).max(10),
  task: z.string().min(1, "Please describe what you did today"),
  notes: z.string().optional(),
});

// Mood options with colors
const moodOptions = [
  { value: "excited", label: "Excited", color: "bg-green-500"},
  { value: "happy", label: "Happy", color: "bg-yellow-500"},
  { value: "neutral", label: "Neutral", color: "bg-gray-500"},
  { value: "sad", label: "Sad", color: "bg-blue-500"},
  { value: "stressed", label: "Stressed", color: "bg-red-500"},
];

type MoodEntry = {
  id: string;
  mood: string;
  productivity: number;
  task: string;
  notes?: string;
  created_at: string;
  user_id: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [viewPeriod, setViewPeriod] = useState<'week' | 'month' | 'all'>('week');

  const form = useForm<z.infer<typeof moodSchema>>({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      mood: "",
      productivity: 5,
      task: "",
      notes: "",
    },
  });

  // Check authentication and load user data
  useEffect(() => {
    async function checkUser() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUser(user);
      await loadMoodEntries(user.id);
      setLoading(false);
    }

    checkUser();
  }, [router]);

  // Populate form with today's entry if it exists
  useEffect(() => {
    if (moodEntries.length > 0) {
      const today = new Date().toDateString();
      const todaysEntry = moodEntries.find(entry => 
        new Date(entry.created_at).toDateString() === today
      );
      
      if (todaysEntry) {
        form.setValue('mood', todaysEntry.mood);
        form.setValue('productivity', todaysEntry.productivity);
        form.setValue('task', todaysEntry.task);
        form.setValue('notes', todaysEntry.notes || '');
        setSelectedMood(todaysEntry.mood);
      }
    }
  }, [moodEntries, form]);

  // Load mood entries from Supabase
  const loadMoodEntries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading mood entries:', error);
      } else {
        setMoodEntries(data || []);
      }
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  };

  // Handle form submission - save to Supabase (one entry per day, allow updates)
  const onSubmit = async (data: z.infer<typeof moodSchema>) => {
    if (!user) return;

    setSubmitting(true);
    
    try {
      // Check if there's already an entry for today
      const today = new Date().toDateString();
      const existingEntry = moodEntries.find(entry => 
        new Date(entry.created_at).toDateString() === today
      );

      if (existingEntry) {
        // Update existing entry
        const { data: updatedEntry, error } = await supabase
          .from('mood_entries')
          .update({
            mood: data.mood,
            productivity: data.productivity,
            task: data.task,
            notes: data.notes || null,
          })
          .eq('id', existingEntry.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating mood entry:', error);
          form.setError('mood', { message: 'Failed to update entry. Please try again.' });
        } else {
          // Update the entry in the list
          setMoodEntries(prev => 
            prev.map(entry => entry.id === existingEntry.id ? updatedEntry : entry)
          );
          
          // Reset form
          form.reset({
            mood: "",
            productivity: 5,
            task: "",
            notes: "",
          });
          setSelectedMood("");
        }
      } else {
        // Create new entry
        const { data: newEntry, error } = await supabase
          .from('mood_entries')
          .insert([
            {
              user_id: user.id,
              mood: data.mood,
              productivity: data.productivity,
              task: data.task,
              notes: data.notes || null,
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Error saving mood entry:', error);
          form.setError('mood', { message: 'Failed to save entry. Please try again.' });
        } else {
          // Add new entry to the top of the list
          setMoodEntries(prev => [newEntry, ...prev]);
          
          // Reset form
          form.reset({
            mood: "",
            productivity: 5,
            task: "",
            notes: "",
          });
          setSelectedMood("");
        }
      }
    } catch (error) {
      console.error('Error saving mood entry:', error);
      form.setError('mood', { message: 'An unexpected error occurred.' });
    }

    setSubmitting(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Generate calendar grid based on selected period
  const generateCalendarGrid = () => {
    const today = new Date();
    const dates: Date[] = [];

    if (viewPeriod === 'week') {
      // Get current week (Sunday to Saturday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } else if (viewPeriod === 'month') {
      // Get current month
      const year = today.getFullYear();
      const month = today.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Start from first Sunday before or on the first day of month
      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - firstDay.getDay());
      
      // Generate dates for 6 weeks (42 days) to fill the grid
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
      }
    } else {
      // All time - last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date);
      }
    }

    return dates;
  };

  // Get mood entry for a specific date
  const getMoodForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return moodEntries.find(entry => 
      new Date(entry.created_at).toDateString() === dateStr
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Salud...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          border: none;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-750 to-purple-750 to-gray-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Salud</h1>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Today's Check-in - Moved to Top */}
        <Card className="shadow-lg border-gray-200 bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Today&apos;s Check-in
            </CardTitle>
            <p className="text-sm text-gray-600">
              How are you feeling and what did you accomplish today?
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Mood Selection */}
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-base font-medium">How are you feeling?</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-5 gap-3 mt-2">
                          {moodOptions.map((mood) => (
                            <button
                              key={mood.value}
                              type="button"
                              onClick={() => {
                                field.onChange(mood.value);
                                setSelectedMood(mood.value);
                              }}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                                field.value === mood.value
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full ${mood.color}`}></div>
                              <span className="text-xs font-medium text-gray-700">{mood.label}</span>
                              <span className="text-sm">{mood.emoji}</span>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Productivity Scale */}
                  <FormField
                    control={form.control}
                    name="productivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base font-medium">
                          Productivity Level: {field.value}/10
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={field.value}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Low</span>
                              <span>Medium</span>
                              <span>High</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Task Input */}
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base font-medium">What did you work on?</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Completed project proposal..."
                            {...field}
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes Input */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-base font-medium">Additional notes (optional)</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Any additional thoughts or reflections..."
                          {...field}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  {submitting ? 'Saving...' : (() => {
                    const today = new Date().toDateString();
                    const existingEntry = moodEntries.find(entry => 
                      new Date(entry.created_at).toDateString() === today
                    );
                    return existingEntry ? 'Update Today\'s Entry' : 'Save Today\'s Entry';
                  })()}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Entries Card */}
          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entries</p>
                  <p className="text-3xl font-bold text-gray-900">{moodEntries.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Common Mood Card */}
          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Common Mood</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {moodEntries.length > 0 
                      ? (() => {
                          // Count occurrences of each mood
                          const moodCounts = moodEntries.reduce((acc, entry) => {
                            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          // Find the most common mood
                          const mostCommonMood = Object.entries(moodCounts).reduce((max, [mood, count]) => 
                            count > max.count ? { mood, count } : max
                          , { mood: '', count: 0 });
                          
                          // Capitalize the mood name
                          return mostCommonMood.mood.charAt(0).toUpperCase() + mostCommonMood.mood.slice(1);
                        })()
                      : 'No Data'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">
                    {moodEntries.length > 0 
                      ? (() => {
                          // Get the emoji for the most common mood
                          const moodCounts = moodEntries.reduce((acc, entry) => {
                            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          const mostCommonMood = Object.entries(moodCounts).reduce((max, [mood, count]) => 
                            count > max.count ? { mood, count } : max
                          , { mood: '', count: 0 });
                          
                          const moodEmojis = {
                            excited: '🤩',
                            happy: '😊',
                            neutral: '😐',
                            sad: '😢',
                            stressed: '😰'
                          };
                          
                          return moodEmojis[mostCommonMood.mood as keyof typeof moodEmojis] || '😊';
                        })()
                      : '😊'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Productivity Card */}
          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {moodEntries.length > 0 
                      ? (moodEntries.reduce((sum, entry) => sum + entry.productivity, 0) / moodEntries.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Streak Card */}
          <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(() => {
                      // Calculate streak of consecutive days with entries
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
                    })()}
                  </p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Mood Distribution
              </CardTitle>
              <p className="text-sm text-gray-600">
                Breakdown of your emotional patterns
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const moodCounts = moodEntries.reduce((acc, entry) => {
                    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const moodLabels = {
                    excited: { label: 'Excited', color: 'bg-green-500', emoji: '🤩' },
                    happy: { label: 'Happy', color: 'bg-yellow-500', emoji: '😊' },
                    neutral: { label: 'Neutral', color: 'bg-gray-500', emoji: '😐' },
                    sad: { label: 'Sad', color: 'bg-blue-500', emoji: '😢' },
                    stressed: { label: 'Stressed', color: 'bg-red-500', emoji: '😰' }
                  };

                  return Object.entries(moodLabels).map(([mood, config]) => {
                    const count = moodCounts[mood] || 0;
                    const percentage = moodEntries.length > 0 ? (count / moodEntries.length) * 100 : 0;
                    
                    return (
                      <div key={mood} className="flex items-center space-x-3">
                        <span className="text-xl">{config.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{config.label}</span>
                            <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${config.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Weekly Productivity Trend
              </CardTitle>
              <p className="text-sm text-gray-600">
                Your productivity over the last 7 days
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  const last7Days = [];
                  const today = new Date();
                  
                  for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    
                    const dayEntries = moodEntries.filter(entry => 
                      new Date(entry.created_at).toDateString() === date.toDateString()
                    );
                    
                    const avgProductivity = dayEntries.length > 0 
                      ? dayEntries.reduce((sum, entry) => sum + entry.productivity, 0) / dayEntries.length
                      : 0;
                    
                    last7Days.push({
                      date,
                      productivity: avgProductivity,
                      dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
                    });
                  }
                  
                  return last7Days.map((day, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600 w-8">{day.dayName}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="w-full bg-gray-200 rounded-full h-6 relative">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${(day.productivity / 10) * 100}%` }}
                            >
                              {day.productivity > 0 && (
                                <span className="text-xs text-white font-medium">
                                  {day.productivity.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* GitHub-style Mood Heatmap - Extended to full width */}
          <Card className="shadow-lg border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Mood Activity ({moodEntries.length} entries)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Your mood patterns over the past 12 weeks
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Month labels - properly distributed */}
                <div className="flex justify-start text-xs text-gray-500">
                  <div className="w-12"></div> {/* Space for day labels */}
                  <div className="flex-1 grid grid-cols-12 gap-1">
                    {(() => {
                      const months = [];
                      const today = new Date();
                      for (let i = 11; i >= 0; i--) {
                        const date = new Date(today);
                        date.setDate(today.getDate() - (i * 7)); // Go back by weeks
                        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                        months.push(monthName);
                      }
                      
                      // Group months to avoid repetition
                      const uniqueMonths = [];
                      let lastMonth = '';
                      for (let i = 0; i < 12; i++) {
                        if (months[i] !== lastMonth) {
                          uniqueMonths.push({ month: months[i], col: i });
                          lastMonth = months[i];
                        }
                      }
                      
                      return uniqueMonths.map((item, index) => (
                        <div key={index} style={{ gridColumn: `${item.col + 1} / span 1` }}>
                          {item.month}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                
                {/* Heatmap with day labels */}
                <div className="flex">
                  {/* Day labels */}
                  <div className="flex flex-col text-xs text-gray-500 mr-3 justify-between" style={{ height: '70px' }}>
                    <span></span>
                    <span>Mon</span>
                    <span></span>
                    <span>Wed</span>
                    <span></span>
                    <span>Fri</span>
                    <span></span>
                  </div>
                  
                  {/* Heatmap Grid - 12 weeks × 7 days */}
                  <div className="grid gap-1" style={{ 
                    gridTemplateColumns: 'repeat(12, 1fr)', 
                    gridTemplateRows: 'repeat(7, 1fr)',
                    width: '100%'
                  }}>
                    {(() => {
                      const today = new Date();
                      const startDate = new Date(today);
                      startDate.setDate(today.getDate() - 83); // 12 weeks back
                      
                      // Create a 2D array for weeks and days
                      const weeks = [];
                      for (let week = 0; week < 12; week++) {
                        const weekDays = [];
                        for (let day = 0; day < 7; day++) {
                          const date = new Date(startDate);
                          date.setDate(startDate.getDate() + (week * 7) + day);
                          weekDays.push(date);
                        }
                        weeks.push(weekDays);
                      }
                      
                      // Render by columns (weeks) then rows (days)
                      const cells = [];
                      for (let week = 0; week < 12; week++) {
                        for (let day = 0; day < 7; day++) {
                          const date = weeks[week][day];
                          const entry = moodEntries.find(entry => 
                            new Date(entry.created_at).toDateString() === date.toDateString()
                          );
                          
                          let bgColor = 'bg-gray-100 border border-gray-200'; // No entry
                          if (entry) {
                            switch (entry.mood) {
                              case 'excited': bgColor = 'bg-green-500 border border-green-600'; break;
                              case 'happy': bgColor = 'bg-yellow-400 border border-yellow-500'; break;
                              case 'neutral': bgColor = 'bg-gray-400 border border-gray-500'; break;
                              case 'sad': bgColor = 'bg-blue-500 border border-blue-600'; break;
                              case 'stressed': bgColor = 'bg-red-500 border border-red-600'; break;
                              default: bgColor = 'bg-gray-200 border border-gray-300';
                            }
                          }
                          
                          cells.push(
                            <div
                              key={`${week}-${day}`}
                              className={`w-6 h-6 rounded-sm ${bgColor} transition-all duration-200 hover:scale-110 cursor-pointer`}
                              style={{ 
                                gridColumn: week + 1, 
                                gridRow: day + 1 
                              }}
                              title={entry 
                                ? `${date.toLocaleDateString()}: ${entry.mood} mood, ${entry.productivity}/10 productivity` 
                                : `${date.toLocaleDateString()}: No entry`
                              }
                            />
                          );
                        }
                      }
                      
                      return cells;
                    })()}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                  <span>Less</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm" title="No entry"></div>
                    <div className="w-3 h-3 bg-red-500 border border-red-600 rounded-sm" title="Stressed"></div>
                    <div className="w-3 h-3 bg-blue-500 border border-blue-600 rounded-sm" title="Sad"></div>
                    <div className="w-3 h-3 bg-gray-400 border border-gray-500 rounded-sm" title="Neutral"></div>
                    <div className="w-3 h-3 bg-yellow-400 border border-yellow-500 rounded-sm" title="Happy"></div>
                    <div className="w-3 h-3 bg-green-500 border border-green-600 rounded-sm" title="Excited"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Check-ins</p>
                  <p className="text-2xl font-bold text-gray-900">{moodEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {moodEntries.length > 0 
                      ? (moodEntries.reduce((sum, entry) => sum + entry.productivity, 0) / moodEntries.length).toFixed(1)
                      : '0'
                    }/10
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">😊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {moodEntries.filter(e => {
                      const entryDate = new Date(e.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return entryDate >= weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </>
  );
}