import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// JWT utility functions
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
};

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    const decoded = verifyToken(token);
    
    // In a real app, you might want to check if user still exists in database
    // and if the token hasn't been blacklisted
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decoded = verifyToken(token);
        req.user = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

// Rate limiting by user
export const rateLimitByUser = (maxRequests: number, windowMs: number) => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Skip rate limiting for unauthenticated users
    }

    const userId = req.user.id;
    const now = Date.now();
    const userLimit = userRequests.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      userRequests.set(userId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
      });
    }

    userLimit.count++;
    next();
  };
};

// Middleware to check if user owns resource
export const checkResourceOwnership = (resourceIdParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Admin users can access any resource
    if (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const resourceId = req.params[resourceIdParam];
    const userId = req.user.id;

    // This is a simplified check - in a real app, you'd query the database
    // to verify ownership based on the resource type
    if (resourceId === userId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: You can only access your own resources',
    });
  };
};

// Middleware to validate API key for external integrations
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required',
    });
  }

  // In a real app, you'd validate against stored API keys
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!validApiKeys.includes(apiKey as string)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key',
    });
  }

  next();
};

// Middleware to log authentication events
export const logAuthEvents = (event: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (responseData.success) {
        logger.info(`Auth event: ${event}`, {
          userId: req.user?.id,
          email: req.user?.email,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString(),
        });
      } else {
        logger.warn(`Auth event failed: ${event}`, {
          error: responseData.message,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString(),
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};
