import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, optionalAuth, checkResourceOwnership, authorize } from '../middleware/auth';
import { UserService } from '../services/userService';
import { logger } from '../utils/logger';

const router = express.Router();

// Mock user data (will be replaced with database)
const users: any[] = [
  {
    id: '1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: null,
    bio: 'Travel enthusiast',
    location: 'New York, NY',
    phone: '+1-555-0123',
    dateOfBirth: '1990-01-01',
    isVerified: true,
    role: 'USER',
    reputation: 150,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: '2024-01-15T00:00:00.000Z',
    isActive: true,
  },
];

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user!.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'User not found',
    });
  }
});

// Validation middleware
const validateProfileUpdate = [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
];

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', authenticate, validateProfileUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, phone, dateOfBirth } = req.body;

    const updatedUser = await UserService.updateUser(req.user!.id, {
      firstName,
      lastName,
      phone,
      dateOfBirth,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get public user profile
// @access  Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    data: {
      id,
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
      bio: 'Travel enthusiast',
      location: 'New York, NY',
      joinedAt: '2024-01-01T00:00:00.000Z',
      stats: {
        tripsCompleted: 15,
        routesTraveled: 8,
        communityPosts: 23,
        helpfulVotes: 45,
        reputation: 150,
      },
      badges: [
        { id: 1, name: 'First Trip', icon: '🚌', earnedAt: '2024-01-15T00:00:00.000Z' },
        { id: 2, name: 'Community Helper', icon: '🤝', earnedAt: '2024-02-01T00:00:00.000Z' },
      ],
      recentActivity: [
        {
          id: 1,
          type: 'post',
          title: 'Great experience on NYC to Boston route',
          createdAt: '2024-01-10T00:00:00.000Z',
        },
        {
          id: 2,
          type: 'tip',
          title: 'Best food stops along I-95',
          createdAt: '2024-01-08T00:00:00.000Z',
        },
      ],
    },
  });
});

// @route   GET /api/users
// @desc    Search users
// @access  Public
router.get('/', (req, res) => {
  const { search, limit = 10, offset = 0 } = req.query;
  
  // Mock search results
  const users = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
      location: 'New York, NY',
      reputation: 150,
      badges: ['First Trip', 'Community Helper'],
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: null,
      location: 'Boston, MA',
      reputation: 200,
      badges: ['Route Explorer', 'Safety First'],
    },
  ];
  
  res.json({
    success: true,
    data: {
      users: users.slice(Number(offset), Number(offset) + Number(limit)),
      total: users.length,
      hasMore: Number(offset) + Number(limit) < users.length,
    },
  });
});

// @route   POST /api/users/:id/follow
// @desc    Follow a user
// @access  Private
router.post('/:id/follow', (req, res) => {
  const { id } = req.params;
  
  logger.info(`User follow request for user ID: ${id}`);
  
  res.json({
    success: true,
    message: 'User followed successfully',
    data: {
      isFollowing: true,
      followersCount: 25,
    },
  });
});

// @route   DELETE /api/users/:id/follow
// @desc    Unfollow a user
// @access  Private
router.delete('/:id/follow', (req, res) => {
  const { id } = req.params;
  
  logger.info(`User unfollow request for user ID: ${id}`);
  
  res.json({
    success: true,
    message: 'User unfollowed successfully',
    data: {
      isFollowing: false,
      followersCount: 24,
    },
  });
});

// @route   GET /api/users/:id/followers
// @desc    Get user followers
// @access  Public
router.get('/:id/followers', (req, res) => {
  const { id } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  
  // Mock followers data
  const followers = [
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: null,
      followedAt: '2024-01-15T00:00:00.000Z',
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      avatar: null,
      followedAt: '2024-01-20T00:00:00.000Z',
    },
  ];
  
  res.json({
    success: true,
    data: {
      followers: followers.slice(Number(offset), Number(offset) + Number(limit)),
      total: followers.length,
      hasMore: Number(offset) + Number(limit) < followers.length,
    },
  });
});

// @route   GET /api/users/:id/following
// @desc    Get users that this user is following
// @access  Public
router.get('/:id/following', (req, res) => {
  const { id } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  
  // Mock following data
  const following = [
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      avatar: null,
      followedAt: '2024-01-10T00:00:00.000Z',
    },
  ];
  
  res.json({
    success: true,
    data: {
      following: following.slice(Number(offset), Number(offset) + Number(limit)),
      total: following.length,
      hasMore: Number(offset) + Number(limit) < following.length,
    },
  });
});

export default router;
