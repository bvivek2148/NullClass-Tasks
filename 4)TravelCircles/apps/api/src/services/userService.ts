import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// User interfaces
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
}

// Mock data - will be replaced with database operations
let users: User[] = [
  {
    id: 'user-1',
    firstName: 'Vivek',
    lastName: 'Kumar',
    email: 'vivek@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password123'
    role: 'USER',
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@travelcircles.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'admin123'
    role: 'ADMIN',
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class UserService {
  // Authentication methods
  static async register(userData: CreateUserData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        password: hashedPassword,
        role: 'USER',
        isVerified: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newUser);

      // Generate tokens
      const token = this.generateToken(newUser);
      const refreshToken = this.generateRefreshToken(newUser);

      logger.info('User registered successfully:', { userId: newUser.id, email: newUser.email });

      return {
        user: this.sanitizeUser(newUser),
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      user.updatedAt = new Date().toISOString();

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      logger.info('User logged in successfully:', { userId: user.id, email: user.email });

      return {
        user: this.sanitizeUser(user),
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret') as any;
      
      // Find user
      const user = users.find(u => u.id === decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        user: this.sanitizeUser(user),
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw new Error('Invalid refresh token');
    }
  }

  // User management methods
  static async getUserById(userId: string): Promise<UserProfile> {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      return this.sanitizeUser(user);
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      return user ? this.sanitizeUser(user) : null;
    } catch (error) {
      logger.error('Get user by email error:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, updateData: UpdateUserData): Promise<UserProfile> {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const user = users[userIndex];

      // Update user data
      if (updateData.firstName) user.firstName = updateData.firstName;
      if (updateData.lastName) user.lastName = updateData.lastName;
      if (updateData.phone !== undefined) user.phone = updateData.phone;
      if (updateData.dateOfBirth !== undefined) user.dateOfBirth = updateData.dateOfBirth;
      
      user.updatedAt = new Date().toISOString();

      logger.info('User updated successfully:', { userId, updateData });

      return this.sanitizeUser(user);
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      user.updatedAt = new Date().toISOString();

      logger.info('Password changed successfully:', { userId });
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  static async verifyUser(userId: string): Promise<UserProfile> {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.isVerified = true;
      user.updatedAt = new Date().toISOString();

      logger.info('User verified successfully:', { userId });

      return this.sanitizeUser(user);
    } catch (error) {
      logger.error('Verify user error:', error);
      throw error;
    }
  }

  static async deactivateUser(userId: string): Promise<void> {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.isActive = false;
      user.updatedAt = new Date().toISOString();

      logger.info('User deactivated successfully:', { userId });
    } catch (error) {
      logger.error('Deactivate user error:', error);
      throw error;
    }
  }

  // Admin methods
  static async getAllUsers(filters: any = {}): Promise<{ users: UserProfile[]; total: number }> {
    try {
      let filteredUsers = users;

      // Apply filters
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters.isVerified !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isVerified === filters.isVerified);
      }

      if (filters.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }

      // Sort users
      filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        users: filteredUsers.map(user => this.sanitizeUser(user)),
        total: filteredUsers.length,
      };
    } catch (error) {
      logger.error('Get all users error:', error);
      throw new Error('Failed to fetch users');
    }
  }

  // Utility methods
  private static generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  }

  private static generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );
  }

  private static sanitizeUser(user: User): UserProfile {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Analytics
  static async getUserAnalytics() {
    try {
      const totalUsers = users.length;
      const verifiedUsers = users.filter(u => u.isVerified).length;
      const activeUsers = users.filter(u => u.isActive).length;
      const adminUsers = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length;

      const recentUsers = users.filter(u => {
        const createdDate = new Date(u.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      }).length;

      return {
        totalUsers,
        verifiedUsers,
        activeUsers,
        adminUsers,
        recentUsers,
        verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0,
      };
    } catch (error) {
      logger.error('Error fetching user analytics:', error);
      throw new Error('Failed to fetch user analytics');
    }
  }
}
