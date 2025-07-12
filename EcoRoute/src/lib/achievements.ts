import { Achievement, UserProfile, TripRecord } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // Bronze Achievements (10kg CO2 saved)
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Save your first 10kg of CO2',
    icon: '🥉',
    threshold: 10000, // 10kg in grams
    category: 'bronze',
    progress: 0
  },
  {
    id: 'eco_warrior_bronze',
    name: 'Eco Warrior Bronze',
    description: 'Complete 10 eco-friendly trips',
    icon: '🌱',
    threshold: 10,
    category: 'bronze',
    progress: 0
  },
  {
    id: 'walker_bronze',
    name: 'Walking Champion',
    description: 'Walk 50km total distance',
    icon: '🚶',
    threshold: 50000, // 50km in meters
    category: 'bronze',
    progress: 0
  },
  {
    id: 'cyclist_bronze',
    name: 'Cycling Enthusiast',
    description: 'Cycle 100km total distance',
    icon: '🚴',
    threshold: 100000, // 100km in meters
    category: 'bronze',
    progress: 0
  },

  // Silver Achievements (50kg CO2 saved)
  {
    id: 'carbon_saver_silver',
    name: 'Carbon Saver Silver',
    description: 'Save 50kg of CO2 emissions',
    icon: '🥈',
    threshold: 50000, // 50kg in grams
    category: 'silver',
    progress: 0
  },
  {
    id: 'public_transport_hero',
    name: 'Public Transport Hero',
    description: 'Take 50 public transport trips',
    icon: '🚌',
    threshold: 50,
    category: 'silver',
    progress: 0
  },
  {
    id: 'streak_master_silver',
    name: 'Streak Master',
    description: 'Maintain a 7-day eco-friendly streak',
    icon: '🔥',
    threshold: 7,
    category: 'silver',
    progress: 0
  },
  {
    id: 'monthly_goal_silver',
    name: 'Monthly Champion',
    description: 'Meet your monthly carbon goal',
    icon: '📅',
    threshold: 1,
    category: 'silver',
    progress: 0
  },

  // Gold Achievements (200kg CO2 saved)
  {
    id: 'carbon_champion_gold',
    name: 'Carbon Champion Gold',
    description: 'Save 200kg of CO2 emissions',
    icon: '🥇',
    threshold: 200000, // 200kg in grams
    category: 'gold',
    progress: 0
  },
  {
    id: 'eco_influencer',
    name: 'Eco Influencer',
    description: 'Inspire 10 friends to join EcoRoute',
    icon: '👥',
    threshold: 10,
    category: 'gold',
    progress: 0
  },
  {
    id: 'zero_emission_week',
    name: 'Zero Emission Week',
    description: 'Complete a week with only zero-emission transport',
    icon: '🌿',
    threshold: 7,
    category: 'gold',
    progress: 0
  },
  {
    id: 'distance_master',
    name: 'Distance Master',
    description: 'Travel 1000km using eco-friendly transport',
    icon: '🏃',
    threshold: 1000000, // 1000km in meters
    category: 'gold',
    progress: 0
  },

  // Platinum Achievements (500kg CO2 saved)
  {
    id: 'planet_protector',
    name: 'Planet Protector',
    description: 'Save 500kg of CO2 emissions',
    icon: '🌍',
    threshold: 500000, // 500kg in grams
    category: 'platinum',
    progress: 0
  },
  {
    id: 'eco_legend',
    name: 'Eco Legend',
    description: 'Maintain a 30-day eco-friendly streak',
    icon: '👑',
    threshold: 30,
    category: 'platinum',
    progress: 0
  },
  {
    id: 'carbon_neutral',
    name: 'Carbon Neutral',
    description: 'Offset your entire yearly carbon footprint',
    icon: '⚖️',
    threshold: 1,
    category: 'platinum',
    progress: 0
  },
  {
    id: 'community_leader',
    name: 'Community Leader',
    description: 'Be in the top 1% of carbon savers',
    icon: '🏆',
    threshold: 1,
    category: 'platinum',
    progress: 0
  }
];

export class AchievementSystem {
  /**
   * Calculate points earned for a trip
   */
  calculatePoints(carbonSaved: number, transportMode: string): number {
    let basePoints = Math.floor(carbonSaved / 100); // 1 point per 100g CO2 saved
    
    // Bonus points for specific transport modes
    const bonusMultipliers: Record<string, number> = {
      walking: 2.0,
      cycling: 1.8,
      electric_scooter: 1.5,
      train: 1.3,
      bus: 1.2,
      electric_car: 1.1
    };
    
    const multiplier = bonusMultipliers[transportMode] || 1.0;
    return Math.floor(basePoints * multiplier);
  }

  /**
   * Check and update achievements for a user
   */
  checkAchievements(userProfile: UserProfile, tripRecords: TripRecord[]): Achievement[] {
    const newAchievements: Achievement[] = [];
    const userAchievements = userProfile.stats.achievements;
    
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (userAchievements.some(ua => ua.id === achievement.id && ua.unlockedAt)) {
        continue;
      }
      
      const progress = this.calculateAchievementProgress(achievement, userProfile, tripRecords);
      
      if (progress >= achievement.threshold) {
        const unlockedAchievement: Achievement = {
          ...achievement,
          progress: achievement.threshold,
          unlockedAt: new Date()
        };
        newAchievements.push(unlockedAchievement);
      }
    }
    
    return newAchievements;
  }

  /**
   * Calculate progress towards a specific achievement
   */
  private calculateAchievementProgress(
    achievement: Achievement,
    userProfile: UserProfile,
    tripRecords: TripRecord[]
  ): number {
    switch (achievement.id) {
      case 'first_steps':
      case 'carbon_saver_silver':
      case 'carbon_champion_gold':
      case 'planet_protector':
        return userProfile.stats.totalCO2Saved;
      
      case 'eco_warrior_bronze':
        return tripRecords.filter(trip => trip.carbonSaved > 0).length;
      
      case 'walker_bronze':
        return tripRecords
          .filter(trip => trip.actualTransportMode.id === 'walking')
          .reduce((total, trip) => total + (trip.route.distance * 1000), 0);
      
      case 'cyclist_bronze':
      case 'distance_master':
        return tripRecords
          .filter(trip => trip.actualTransportMode.id === 'cycling')
          .reduce((total, trip) => total + (trip.route.distance * 1000), 0);
      
      case 'public_transport_hero':
        return tripRecords
          .filter(trip => ['bus', 'train'].includes(trip.actualTransportMode.id))
          .length;
      
      case 'streak_master_silver':
      case 'eco_legend':
        return userProfile.stats.currentStreak;
      
      case 'zero_emission_week':
        return this.calculateZeroEmissionStreak(tripRecords);
      
      case 'monthly_goal_silver':
        return this.hasMetMonthlyGoal(userProfile, tripRecords) ? 1 : 0;
      
      case 'eco_influencer':
        // This would be tracked separately in the database
        return 0;
      
      case 'carbon_neutral':
        // This would require additional carbon offset tracking
        return 0;
      
      case 'community_leader':
        // This would require leaderboard data
        return 0;
      
      default:
        return 0;
    }
  }

  /**
   * Calculate current zero-emission streak
   */
  private calculateZeroEmissionStreak(tripRecords: TripRecord[]): number {
    const sortedTrips = tripRecords
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    let streak = 0;
    for (const trip of sortedTrips) {
      if (trip.actualTransportMode.emissionFactor === 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  /**
   * Check if user has met their monthly carbon goal
   */
  private hasMetMonthlyGoal(userProfile: UserProfile, tripRecords: TripRecord[]): boolean {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTrips = tripRecords.filter(trip => trip.timestamp >= monthStart);
    const monthlySavings = monthlyTrips.reduce((total, trip) => total + trip.carbonSaved, 0);
    
    return monthlySavings >= userProfile.preferences.carbonGoals.monthly;
  }

  /**
   * Get achievement by ID
   */
  getAchievement(id: string): Achievement | undefined {
    return ACHIEVEMENTS.find(achievement => achievement.id === id);
  }

  /**
   * Get achievements by category
   */
  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return ACHIEVEMENTS.filter(achievement => achievement.category === category);
  }

  /**
   * Calculate total points for a user
   */
  calculateTotalPoints(tripRecords: TripRecord[]): number {
    return tripRecords.reduce((total, trip) => {
      return total + this.calculatePoints(trip.carbonSaved, trip.actualTransportMode.id);
    }, 0);
  }

  /**
   * Get next achievement to unlock
   */
  getNextAchievement(userProfile: UserProfile, tripRecords: TripRecord[]): Achievement | null {
    const unlockedIds = userProfile.stats.achievements
      .filter(a => a.unlockedAt)
      .map(a => a.id);
    
    const availableAchievements = ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));
    
    if (availableAchievements.length === 0) return null;
    
    // Find the achievement with the highest progress percentage
    let bestAchievement = availableAchievements[0];
    let bestProgress = 0;
    
    for (const achievement of availableAchievements) {
      const progress = this.calculateAchievementProgress(achievement, userProfile, tripRecords);
      const progressPercentage = (progress / achievement.threshold) * 100;
      
      if (progressPercentage > bestProgress) {
        bestProgress = progressPercentage;
        bestAchievement = { ...achievement, progress };
      }
    }
    
    return { ...bestAchievement, progress: bestProgress };
  }

  /**
   * Generate achievement notification message
   */
  generateNotificationMessage(achievement: Achievement): string {
    const messages = {
      bronze: "🥉 Congratulations! You've earned your first bronze achievement!",
      silver: "🥈 Amazing! You've unlocked a silver achievement!",
      gold: "🥇 Outstanding! You've achieved gold status!",
      platinum: "💎 Incredible! You've reached platinum level!"
    };
    
    return `${messages[achievement.category]} "${achievement.name}" - ${achievement.description}`;
  }
}

// Export singleton instance
export const achievementSystem = new AchievementSystem();
