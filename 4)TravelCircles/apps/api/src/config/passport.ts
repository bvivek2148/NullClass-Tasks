import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { logger } from '../utils/logger';

// Mock user database - replace with actual database calls
const users: any[] = [];
const accounts: any[] = [];

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
}, async (payload, done) => {
  try {
    // In a real app, you'd query the database to get user details
    const user = users.find(u => u.id === payload.userId);
    
    if (user) {
      return done(null, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    }
    
    return done(null, false);
  } catch (error) {
    logger.error('JWT strategy error:', error);
    return done(error, false);
  }
}));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      logger.info('Google OAuth callback:', { profileId: profile.id, email: profile.emails?.[0]?.value });
      
      // Check if account already exists
      const existingAccount = accounts.find(
        acc => acc.provider === 'google' && acc.providerAccountId === profile.id
      );
      
      if (existingAccount) {
        const user = users.find(u => u.id === existingAccount.userId);
        return done(null, user);
      }
      
      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      let user = users.find(u => u.email === email);
      
      if (!user) {
        // Create new user
        user = {
          id: Date.now().toString(),
          email,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          avatar: profile.photos?.[0]?.value,
          isVerified: true, // OAuth users are considered verified
          role: 'USER',
          createdAt: new Date().toISOString(),
          reputation: 0,
        };
        users.push(user);
      }
      
      // Create account link
      const account = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        createdAt: new Date().toISOString(),
      };
      accounts.push(account);
      
      logger.info('Google OAuth user created/linked:', { userId: user.id, email: user.email });
      return done(null, user);
    } catch (error) {
      logger.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      logger.info('Facebook OAuth callback:', { profileId: profile.id, email: profile.emails?.[0]?.value });
      
      // Check if account already exists
      const existingAccount = accounts.find(
        acc => acc.provider === 'facebook' && acc.providerAccountId === profile.id
      );
      
      if (existingAccount) {
        const user = users.find(u => u.id === existingAccount.userId);
        return done(null, user);
      }
      
      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      let user = users.find(u => u.email === email);
      
      if (!user) {
        // Create new user
        user = {
          id: Date.now().toString(),
          email,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          avatar: profile.photos?.[0]?.value,
          isVerified: true, // OAuth users are considered verified
          role: 'USER',
          createdAt: new Date().toISOString(),
          reputation: 0,
        };
        users.push(user);
      }
      
      // Create account link
      const account = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'oauth',
        provider: 'facebook',
        providerAccountId: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        createdAt: new Date().toISOString(),
      };
      accounts.push(account);
      
      logger.info('Facebook OAuth user created/linked:', { userId: user.id, email: user.email });
      return done(null, user);
    } catch (error) {
      logger.error('Facebook OAuth error:', error);
      return done(error, null);
    }
  }));
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = users.find(u => u.id === id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
