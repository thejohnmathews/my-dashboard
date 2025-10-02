"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      
      if (data.user) {
        router.push('/dashboard')
      } else {
        setLoading(false) // Show landing page if not authenticated
      }
    }

    checkUser()
  }, [router])

  const handleGetStarted = () => {
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-200">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Salud</h1>
            </div>
            <Button
              onClick={handleGetStarted}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Log In / Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Track Your
              <span className="text-purple-600"> Mood </span>
              & 
              <span className="text-purple-600"> Productivity</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Build better habits and understand your patterns with Salud&apos;s simple, 
              beautiful mood and productivity tracker. Visualize your journey with 
              our intuitive calendar view.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                Start Tracking Today
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to understand yourself better
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, powerful tools to track your daily mood and productivity patterns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">😊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mood Tracking</h3>
                <p className="text-gray-600">
                  Track your daily emotions with our simple 5-point mood scale. 
                  From excited to stressed, capture how you&apos;re really feeling.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Productivity Insights</h3>
                <p className="text-gray-600">
                  Rate your productivity on a 1-10 scale and track what you accomplished. 
                  See your patterns over time.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Calendar View</h3>
                <p className="text-gray-600">
                  Visualize your mood journey with our beautiful calendar grid. 
                  See patterns at a glance across weeks and months.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Daily Reflections</h3>
                <p className="text-gray-600">
                  Add notes about your tasks and thoughts. Build a personal journal 
                  of your productivity journey.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h3>
                <p className="text-gray-600">
                  Get insights into your mood patterns and productivity trends. 
                  Understand what works best for you.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="shadow-lg border-gray-200 bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Private & Secure</h3>
                <p className="text-gray-600">
                  Your data is private and secure. Only you can see your mood entries 
                  and productivity insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg font-semibold text-gray-800">Salud</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 Salud
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}