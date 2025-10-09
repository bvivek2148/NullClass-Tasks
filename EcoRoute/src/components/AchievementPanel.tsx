'use client';

import { useState } from 'react';
import { Achievement } from '@/lib/types';
import { ACHIEVEMENTS } from '@/lib/achievements';

// Mock user achievements data
const mockUserAchievements: Achievement[] = [
  { ...ACHIEVEMENTS[0], progress: 10000, unlockedAt: new Date('2024-07-01') }, // First Steps
  { ...ACHIEVEMENTS[1], progress: 15, unlockedAt: new Date('2024-07-05') }, // Eco Warrior Bronze
  { ...ACHIEVEMENTS[2], progress: 35000 }, // Walker Bronze (in progress)
  { ...ACHIEVEMENTS[4], progress: 25000 }, // Carbon Saver Silver (in progress)
];

const mockUserPoints = 1250;

export function AchievementPanel() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum'>('all');

  const filteredAchievements = selectedCategory === 'all' 
    ? ACHIEVEMENTS 
    : ACHIEVEMENTS.filter(achievement => achievement.category === selectedCategory);

  const getUserAchievement = (id: string): Achievement | undefined => {
    return mockUserAchievements.find(ua => ua.id === id);
  };

  const getProgressPercentage = (achievement: Achievement): number => {
    const userAchievement = getUserAchievement(achievement.id);
    if (!userAchievement) return 0;
    return Math.min((userAchievement.progress / achievement.threshold) * 100, 100);
  };

  const isUnlocked = (achievement: Achievement): boolean => {
    const userAchievement = getUserAchievement(achievement.id);
    return userAchievement?.unlockedAt !== undefined;
  };

  const getCategoryColor = (category: Achievement['category']): string => {
    switch (category) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const unlockedCount = mockUserAchievements.filter(a => a.unlockedAt).length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
            <div className="text-3xl font-bold text-green-700">{unlockedCount}</div>
            <div className="text-sm text-green-600">Achievements Unlocked</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
            <div className="text-3xl font-bold text-blue-700">{mockUserPoints}</div>
            <div className="text-sm text-blue-600">Total Points</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
            <div className="text-3xl font-bold text-purple-700">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div className="text-sm text-purple-600">Completion Rate</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg">
            <div className="text-3xl font-bold text-yellow-700">
              {mockUserAchievements.filter(a => a.category === 'gold' && a.unlockedAt).length}
            </div>
            <div className="text-sm text-yellow-600">Gold Achievements</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Your Achievements</h3>
          <div className="flex space-x-2">
            {(['all', 'bronze', 'silver', 'gold', 'platinum'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const userAchievement = getUserAchievement(achievement.id);
            const progressPercentage = getProgressPercentage(achievement);
            const unlocked = isUnlocked(achievement);

            return (
              <div
                key={achievement.id}
                className={`
                  relative rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md
                  ${unlocked 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                    : 'bg-white border-gray-200'
                  }
                  ${progressPercentage > 0 && !unlocked ? 'border-blue-200 bg-blue-50' : ''}
                `}
              >
                {/* Achievement Icon and Category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-3xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(achievement.category)}`}>
                      {achievement.category.toUpperCase()}
                    </span>
                  </div>
                  
                  {unlocked && (
                    <div className="text-green-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Achievement Details */}
                <div className="mb-4">
                  <h4 className={`font-semibold mb-1 ${unlocked ? 'text-green-800' : 'text-gray-900'}`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm ${unlocked ? 'text-green-700' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-medium text-gray-700">
                      {userAchievement?.progress || 0} / {achievement.threshold}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {progressPercentage.toFixed(0)}% complete
                  </div>
                </div>

                {/* Unlock Date */}
                {unlocked && userAchievement?.unlockedAt && (
                  <div className="text-xs text-green-600 font-medium">
                    ✅ Unlocked {userAchievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}

                {/* Next Steps */}
                {!unlocked && progressPercentage > 0 && (
                  <div className="text-xs text-blue-600">
                    🎯 {achievement.threshold - (userAchievement?.progress || 0)} more to unlock!
                  </div>
                )}

                {/* Locked State */}
                {!unlocked && progressPercentage === 0 && (
                  <div className="text-xs text-gray-500">
                    🔒 Start your eco-journey to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🎁 Available Rewards</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Free Bus Pass', cost: 500, description: '1-day unlimited public transport', available: true },
            { name: 'Bike Share Credit', cost: 300, description: '2 hours of bike sharing', available: true },
            { name: 'Coffee Shop Discount', cost: 200, description: '20% off at eco-friendly cafes', available: true },
            { name: 'Electric Car Rental', cost: 1000, description: '50% off 1-day rental', available: false },
            { name: 'Tree Planting Certificate', cost: 800, description: 'Plant a tree in your name', available: false },
            { name: 'Eco Product Bundle', cost: 1500, description: 'Sustainable lifestyle products', available: false },
          ].map((reward, index) => (
            <div
              key={index}
              className={`
                border rounded-lg p-4 transition-all duration-200
                ${reward.available 
                  ? 'border-green-200 bg-green-50 hover:shadow-md cursor-pointer' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                <span className={`text-sm font-bold ${reward.available ? 'text-green-600' : 'text-gray-500'}`}>
                  {reward.cost} pts
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              <button
                disabled={!reward.available}
                onClick={() => {
                  if (reward.available) {
                    // Show success message and simulate redemption
                    alert(`🎉 Congratulations! You've successfully redeemed "${reward.name}"!\n\n${reward.description}\n\nYour remaining points: ${mockUserPoints - reward.cost}`);

                    // In a real app, you would:
                    // 1. Call API to redeem reward
                    // 2. Update user's points
                    // 3. Add reward to user's inventory
                    // 4. Send confirmation email
                  }
                }}
                className={`
                  w-full py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none
                  ${reward.available
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {reward.available ? 'Redeem' : `Need ${reward.cost - mockUserPoints} more points`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🏆 Community Leaderboard</h3>
        
        <div className="space-y-3">
          {[
            { rank: 1, name: 'EcoChampion2024', points: 3450, badge: '🥇' },
            { rank: 2, name: 'GreenCommuter', points: 3200, badge: '🥈' },
            { rank: 3, name: 'CarbonCrusher', points: 2980, badge: '🥉' },
            { rank: 23, name: 'You', points: mockUserPoints, badge: '👤', isUser: true },
            { rank: 24, name: 'EcoNewbie', points: 1200, badge: '🌱' },
            { rank: 25, name: 'BikeRider99', points: 1150, badge: '🚴' },
          ].map((user, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${user.isUser 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{user.badge}</span>
                <div>
                  <div className={`font-medium ${user.isUser ? 'text-green-800' : 'text-gray-900'}`}>
                    #{user.rank} {user.name}
                  </div>
                  <div className="text-sm text-gray-600">{user.points} points</div>
                </div>
              </div>
              {user.isUser && (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Your Rank
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
