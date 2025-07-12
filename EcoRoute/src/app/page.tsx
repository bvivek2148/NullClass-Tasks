'use client';

import { useState } from 'react';
import { RouteCalculator } from '@/components/RouteCalculator';
import { CarbonDashboard } from '@/components/CarbonDashboard';
import { AchievementPanel } from '@/components/AchievementPanel';
import { PersonalizedDashboard } from '@/components/PersonalizedDashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard' | 'achievements' | 'personal'>('calculator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setActiveTab('calculator')}
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-50"
              title="Go to Route Calculator"
            >
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EcoRoute</h1>
            </button>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calculator'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Route Calculator
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'achievements'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Profile
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Carbon Footprint Calculator
              </h2>
              <p className="text-lg text-gray-600">
                Plan your journey and discover eco-friendly alternatives to reduce your carbon footprint.
              </p>
            </div>
            <RouteCalculator />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Environmental Impact
              </h2>
              <p className="text-lg text-gray-600">
                Track your progress and see how your choices make a difference.
              </p>
            </div>
            <CarbonDashboard />
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Achievements & Rewards
              </h2>
              <p className="text-lg text-gray-600">
                Unlock achievements and earn rewards for your eco-friendly choices.
              </p>
            </div>
            <AchievementPanel />
          </div>
        )}

        {activeTab === 'personal' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Personal Dashboard
              </h2>
              <p className="text-lg text-gray-600">
                Your personalized carbon footprint analytics, trends, and preferences.
              </p>
            </div>
            <PersonalizedDashboard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 EcoRoute. Making transportation sustainable, one trip at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
