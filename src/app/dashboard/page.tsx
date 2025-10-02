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
  { value: "amazing", label: "Amazing", color: "bg-emerald-500", emoji: "🤩" },
  { value: "great", label: "Great", color: "bg-green-500", emoji: "😊" },
  { value: "good", label: "Good", color: "bg-lime-500", emoji: "🙂" },
  { value: "okay", label: "Okay", color: "bg-yellow-500", emoji: "😐" },
  { value: "meh", label: "Meh", color: "bg-orange-500", emoji: "😕" },
  { value: "bad", label: "Bad", color: "bg-red-500", emoji: "😞" },
  { value: "terrible", label: "Terrible", color: "bg-red-700", emoji: "😢" },
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

  // Handle form submission - save to Supabase
  const onSubmit = async (data: z.infer<typeof moodSchema>) => {
    if (!user) return;

    setSubmitting(true);
    
    try {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mood & Productivity Input Form */}
          <Card className="shadow-lg border-gray-200 bg-white">
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
                          <div className="grid grid-cols-4 gap-2 mt-2">
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
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>1 - Low</span>
                              <span>5 - Average</span>
                              <span>10 - Amazing</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Task Description */}
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">What did you work on today?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe your main tasks or activities"
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Optional Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Notes (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Any additional thoughts or reflections"
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save Today's Entry"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Mood & Productivity Visualization */}
          <Card className="shadow-lg border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Your Mood Journey ({moodEntries.length} entries)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Visual calendar of your mood patterns
              </p>
              
              {/* Period Filter Buttons */}
              <div className="flex space-x-2 mt-4">
                {(['week', 'month', 'all'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setViewPeriod(period)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewPeriod === period
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {period === 'week' ? 'This Week' : 
                     period === 'month' ? 'This Month' : 
                     'Last 30 Days'}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* Mood Calendar Grid */}
                <div>
                  {viewPeriod === 'week' && (
                    <div className="mb-4">
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {viewPeriod === 'month' && (
                    <div className="mb-4">
                      <div className="text-center font-medium text-gray-800 mb-3">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`grid gap-2 ${
                    viewPeriod === 'week' ? 'grid-cols-7' :
                    viewPeriod === 'month' ? 'grid-cols-7' :
                    'grid-cols-10'
                  }`}>
                    {generateCalendarGrid().map((date, index) => {
                      const moodEntry = getMoodForDate(date);
                      const mood = moodEntry ? moodOptions.find(m => m.value === moodEntry.mood) : null;
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isCurrentMonth = viewPeriod !== 'month' || date.getMonth() === new Date().getMonth();
                      
                      return (
                        <div
                          key={index}
                          className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                            moodEntry
                              ? `${mood?.color} border-gray-300 text-white font-medium`
                              : isCurrentMonth
                                ? 'bg-white border-gray-200 hover:border-gray-300'
                                : 'bg-gray-100 border-gray-100 opacity-50'
                          } ${
                            isToday ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                          }`}
                          title={
                            moodEntry
                              ? `${mood?.label} - Productivity: ${moodEntry.productivity}/10\n${moodEntry.task}`
                              : `${date.toLocaleDateString()} - No entry`
                          }
                        >
                          <span className={`text-xs ${
                            moodEntry ? 'text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {viewPeriod === 'all' ? `${date.getMonth() + 1}/${date.getDate()}` : date.getDate()}
                          </span>
                          {moodEntry && (
                            <span className="text-xs mt-1">{mood?.emoji}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">Mood Legend</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {moodOptions.map((mood) => (
                      <div key={mood.value} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${mood.color}`}></div>
                        <span className="text-xs text-gray-600">{mood.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-200"></div>
                    <span className="text-xs text-gray-600">No entry</span>
                  </div>
                </div>

                {/* Recent Entries List */}
                {moodEntries.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-3">Recent Check-ins</h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {moodEntries.slice(0, 5).map((entry) => {
                        const mood = moodOptions.find(m => m.value === entry.mood);
                        return (
                          <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${mood?.color || 'bg-gray-300'}`}></div>
                              <span className="text-sm text-gray-700">{mood?.label}</span>
                              <span className="text-xs text-purple-600">({entry.productivity}/10)</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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