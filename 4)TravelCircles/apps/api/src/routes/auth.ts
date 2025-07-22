import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import passport from '../config/passport';
import { generateToken } from '../middleware/auth';
import { authenticate, logAuthEvents } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Mock user data (will be replaced with database)
const users: any[] = [
  {
    id: 'user-1',
    firstName: 'Vivek',
    lastName: 'Kumar',
    email: 'vivek@example.com',
    password: '$2b$10$WmRiXdu53LZny07baSyIgePUbbX/ceUeSb0fYP5TAu1p2m2TZXPUq', // 'password123'
    role: 'USER',
    isVerified: true,
    isActive: true,
    reputation: 150,
    avatar: null,
    bio: 'Travel enthusiast from Mumbai',
    location: 'Mumbai, Maharashtra',
    phone: '+91-9876543210',
    dateOfBirth: '1990-05-15',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@travelcircles.com',
    password: '$2b$10$HkOgK24hMqn12aO14BrXn.ltwiJ9zL31ZgU4IeywfhB4RNmt5UhpG', // 'admin123'
    role: 'ADMIN',
    isVerified: true,
    isActive: true,
    reputation: 500,
    avatar: null,
    bio: 'TravelCircles Administrator',
    location: 'Delhi, India',
    phone: '+91-9876543211',
    dateOfBirth: '1985-03-20',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: null,
  },
];

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists().withMessage('Password is required'),
];

const validatePasswordReset = [
  body('email').isEmail().normalizeEmail(),
];

const validatePasswordChange = [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', logAuthEvents('register'), validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      avatar: null,
      bio: null,
      location: null,
      phone: null,
      dateOfBirth: null,
      isVerified: false,
      role: 'USER',
      reputation: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      isActive: true,
    };

    users.push(newUser);

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          isVerified: newUser.isVerified,
          reputation: newUser.reputation,
        },
        token,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', logAuthEvents('login'), validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          reputation: user.reputation,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticate, logAuthEvents('logout'), (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user?.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      isVerified: user.isVerified,
      role: user.role,
      reputation: user.reputation,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    },
  });
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', validatePasswordReset, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email } = req.body;
    const user = users.find(u => u.email === email);

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });

    if (user) {
      // In a real app, you'd generate a reset token and send an email
      logger.info(`Password reset requested for: ${email}`);
      // TODO: Send password reset email
    }
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticate, validatePasswordChange, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = users.find(u => u.id === req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date().toISOString();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// OAuth Routes

// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user as any;

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      logger.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// @route   GET /api/auth/facebook
// @desc    Facebook OAuth login
// @access  Public
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email'],
}));

// @route   GET /api/auth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    try {
      const user = req.user as any;

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      logger.error('Facebook OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Public
router.post('/verify-email', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Verification token is required',
    });
  }

  // In a real app, you'd verify the token and update user verification status
  res.json({
    success: true,
    message: 'Email verified successfully',
  });
});

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Private
router.post('/resend-verification', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user?.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified',
    });
  }

  // In a real app, you'd send a verification email
  logger.info(`Verification email resent to: ${user.email}`);

  res.json({
    success: true,
    message: 'Verification email sent',
  });
});

export default router;
