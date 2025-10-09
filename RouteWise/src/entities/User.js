// User entity for authentication and user management

export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.full_name = data.full_name || '';
    this.first_name = data.first_name || '';
    this.last_name = data.last_name || '';
    this.role = data.role || 'user';
    this.avatar_url = data.avatar_url || null;
    this.phone = data.phone || '';
    this.organization = data.organization || '';
    this.created_date = data.created_date || new Date().toISOString();
    this.last_login = data.last_login || null;
    this.preferences = data.preferences || {
      currency: 'INR',
      language: 'en',
      timezone: 'Asia/Kolkata',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    };
    this.subscription_type = data.subscription_type || 'free';
    this.is_verified = data.is_verified || false;
    this.is_active = data.is_active || true;
    this.statistics = data.statistics || {
      totalTrips: 0,
      totalDistance: 0,
      totalSavings: 0,
      totalTimeSaved: 0,
      averageEfficiency: 0,
      routesShared: 0,
      achievementsEarned: [],
      lastActivityDate: null
    };
  }

  // Static methods for user authentication and management
  static async me() {
    try {
      // Mock user data - in real app, this would fetch from API
      const userData = localStorage.getItem('routewise_user');
      if (userData) {
        return new User(JSON.parse(userData));
      }
      
      // Return mock user for demo
      const mockUser = {
        id: 'user_123',
        email: 'user@example.com',
        full_name: 'Vivek Bukka',
        first_name: 'Vivek',
        last_name: 'Bukka',
        role: 'user',
        phone: '+91 98765 43210',
        organization: 'TechCorp India',
        subscription_type: 'professional',
        is_verified: true,
        preferences: {
          currency: 'INR',
          language: 'en',
          timezone: 'Asia/Kolkata',
          notifications: {
            email: true,
            push: true,
            sms: false
          }
        },
        statistics: {
          totalTrips: 47,
          totalDistance: 2845,
          totalSavings: 12450,
          totalTimeSaved: 125,
          averageEfficiency: 18.5,
          routesShared: 8,
          achievementsEarned: ['route_master', 'efficiency_expert'],
          lastActivityDate: new Date().toISOString()
        }
      };
      
      return new User(mockUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  static async loginWithRedirect(redirectUrl = '/planner') {
    try {
      // Mock login - in real app, this would redirect to auth provider
      const mockUser = {
        id: 'user_123',
        email: 'user@example.com',
        full_name: 'Vivek Bukka',
        first_name: 'Vivek',
        last_name: 'Bukka',
        role: 'user',
        phone: '+91 98765 43210',
        organization: 'TechCorp India',
        subscription_type: 'professional',
        is_verified: true,
        last_login: new Date().toISOString()
      };
      
      localStorage.setItem('routewise_user', JSON.stringify(mockUser));
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  }

  static async logout() {
    try {
      localStorage.removeItem('routewise_user');
      localStorage.removeItem('routewise_auth_token');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  static async register(userData) {
    try {
      // Mock registration - in real app, this would call API
      const newUser = new User({
        ...userData,
        id: `user_${Date.now()}`,
        created_date: new Date().toISOString(),
        subscription_type: 'free',
        is_verified: false
      });
      
      localStorage.setItem('routewise_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  }

  // Instance methods
  async update(data) {
    try {
      Object.assign(this, data);
      localStorage.setItem('routewise_user', JSON.stringify(this));
      return this;
    } catch (error) {
      console.error('Update error:', error);
      throw new Error('Update failed');
    }
  }

  async updatePreferences(preferences) {
    try {
      this.preferences = { ...this.preferences, ...preferences };
      localStorage.setItem('routewise_user', JSON.stringify(this));
      return this.preferences;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw new Error('Failed to update preferences');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      // Mock password change - in real app, this would call API
      console.log('Password change requested');
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Password change error:', error);
      throw new Error('Password change failed');
    }
  }

  async uploadAvatar(file) {
    try {
      // Mock avatar upload - in real app, this would upload to storage
      const mockUrl = URL.createObjectURL(file);
      this.avatar_url = mockUrl;
      localStorage.setItem('routewise_user', JSON.stringify(this));
      return mockUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw new Error('Avatar upload failed');
    }
  }

  // Get user initials for avatar
  getInitials() {
    if (this.first_name && this.last_name) {
      return `${this.first_name[0]}${this.last_name[0]}`.toUpperCase();
    }
    if (this.full_name) {
      const names = this.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (this.email) {
      return this.email[0].toUpperCase();
    }
    return 'U';
  }

  // Check if user has permission
  hasPermission(permission) {
    const permissions = {
      free: ['basic_routing', 'save_trips'],
      professional: ['basic_routing', 'save_trips', 'analytics', 'optimization', 'team_sharing'],
      enterprise: ['basic_routing', 'save_trips', 'analytics', 'optimization', 'team_sharing', 'api_access', 'custom_integrations']
    };
    
    return permissions[this.subscription_type]?.includes(permission) || false;
  }

  // Check if subscription is active
  hasActiveSubscription() {
    return this.subscription_type !== 'free';
  }

  // Get subscription features
  getSubscriptionFeatures() {
    const features = {
      free: [
        'Up to 10 routes per month',
        'Basic route optimization',
        'Mobile access',
        'Community support'
      ],
      professional: [
        'Unlimited routes',
        'AI-powered optimization',
        'Advanced analytics',
        'Priority support',
        'Team collaboration (5 users)',
        'Export & sharing'
      ],
      enterprise: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Advanced security',
        'Unlimited team members'
      ]
    };
    
    return features[this.subscription_type] || features.free;
  }

  // Update user statistics
  async updateStatistics(newStats) {
    try {
      this.statistics = { ...this.statistics, ...newStats };
      localStorage.setItem('routewise_user', JSON.stringify(this));
      return this.statistics;
    } catch (error) {
      console.error('Update statistics error:', error);
      throw new Error('Failed to update statistics');
    }
  }

  // Add achievement
  async addAchievement(achievementId) {
    try {
      if (!this.statistics.achievementsEarned.includes(achievementId)) {
        this.statistics.achievementsEarned.push(achievementId);
        localStorage.setItem('routewise_user', JSON.stringify(this));
      }
      return this.statistics.achievementsEarned;
    } catch (error) {
      console.error('Add achievement error:', error);
      throw new Error('Failed to add achievement');
    }
  }

  // Get formatted statistics
  getFormattedStats() {
    return {
      totalTrips: this.statistics.totalTrips.toString(),
      totalDistance: `${(this.statistics.totalDistance).toLocaleString()} km`,
      totalSavings: `₹${this.statistics.totalSavings.toLocaleString()}`,
      totalTimeSaved: `${this.statistics.totalTimeSaved} hrs`,
      averageEfficiency: `${this.statistics.averageEfficiency}%`,
      routesShared: this.statistics.routesShared.toString()
    };
  }

  // Get achievements with details
  getAchievements() {
    const allAchievements = {
      route_master: {
        id: 'route_master',
        title: 'Route Master',
        description: 'Created 50+ optimized routes',
        icon: 'Award',
        earned: this.statistics.achievementsEarned.includes('route_master')
      },
      efficiency_expert: {
        id: 'efficiency_expert',
        title: 'Efficiency Expert',
        description: 'Achieved 15%+ fuel savings',
        icon: 'TrendingUp',
        earned: this.statistics.achievementsEarned.includes('efficiency_expert')
      },
      community_contributor: {
        id: 'community_contributor',
        title: 'Community Contributor',
        description: 'Shared 10+ routes',
        icon: 'Users',
        earned: this.statistics.achievementsEarned.includes('community_contributor')
      },
      world_explorer: {
        id: 'world_explorer',
        title: 'World Explorer',
        description: 'Used routes in 5+ cities',
        icon: 'Globe',
        earned: this.statistics.achievementsEarned.includes('world_explorer')
      }
    };
    
    return Object.values(allAchievements);
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      full_name: this.full_name,
      first_name: this.first_name,
      last_name: this.last_name,
      role: this.role,
      avatar_url: this.avatar_url,
      phone: this.phone,
      organization: this.organization,
      created_date: this.created_date,
      last_login: this.last_login,
      preferences: this.preferences,
      subscription_type: this.subscription_type,
      is_verified: this.is_verified,
      is_active: this.is_active,
      statistics: this.statistics
    };
  }
}