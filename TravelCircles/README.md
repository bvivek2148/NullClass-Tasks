# 🚌 TravelCircles - Indian Bus Travel Platform

<div align="center">

![TravelCircles Logo](https://img.shields.io/badge/TravelCircles-Bus%20Booking%20Platform-blue?style=for-the-badge&logo=bus)

**A comprehensive Indian bus travel booking platform with integrated community features, localized content, and modern web technologies.**

[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [🛠️ Development](#️-development)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Features

### 🚌 Core Bus Booking System
- **Route Management**: Real-time schedules with Indian routes (Delhi-Mumbai, Bangalore-Chennai, etc.)
- **Interactive Seat Selection**: Visual seat maps with different categories (Sleeper, Semi-Sleeper, AC/Non-AC)
- **Multi-Payment Gateway**: Integrated Stripe, Razorpay, and UPI payment options
- **Smart Booking Dashboard**: Comprehensive booking management with Indian railway-style PNR system
- **Digital Tickets**: QR code tickets with SMS/WhatsApp notifications in Hindi/English
- **Dynamic Pricing**: Surge pricing based on demand and festive seasons

### 🏛️ Indian Localization
- **Multi-language Support**: Hindi, English, and regional language interfaces
- **Indian Payment Methods**: UPI, Net Banking, Wallets (Paytm, PhonePe, Google Pay)
- **Festival Integration**: Special routes and pricing for Diwali, Holi, Durga Puja
- **Regional Customization**: State-specific bus operators and route preferences
- **Indian Address System**: Pincode-based location services
- **Currency**: All pricing in Indian Rupees (₹)

### 👥 Community Platform
- **Content Management**: Rich text editor for travel blogs, photo albums, destination guides
- **Forum System**: Route-based discussions, travel tips, and passenger reviews
- **Social Features**: User profiles, follow system, direct messaging in multiple languages
- **Gamification**: Achievement badges, reputation system, travel streak rewards
- **Real-time Features**: Live chat, booking notifications, bus tracking updates
- **Travel Stories**: User-generated content about Indian destinations

### 🔧 Advanced Features
- **Progressive Web App (PWA)**: Offline booking capabilities and push notifications
- **Social Authentication**: Google, Facebook, and WhatsApp login integration
- **Journey Analytics**: Visual route maps with Google Maps integration
- **Smart Search**: Full-text search with filters for AC/Non-AC, timing, price range
- **Mobile-First Design**: Responsive design optimized for Indian mobile users
- **Analytics Dashboard**: Booking trends, popular routes, user engagement metrics

---

## 🏗️ Architecture

### 🛠️ Technology Stack

**Frontend (Next.js 14)**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.3+ with custom Indian theme
- **UI Components**: Headless UI, Heroicons, Framer Motion
- **State Management**: Zustand for global state
- **Forms**: React Hook Form with validation
- **Real-time**: Socket.io client for live updates

**Backend (Node.js + Express)**
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma 5.7+ with comprehensive schema
- **Authentication**: Passport.js with JWT and OAuth
- **Real-time**: Socket.io server with Redis adapter
- **File Upload**: Multer with Sharp for image processing
- **Payment**: Stripe SDK with Indian payment methods

**Infrastructure & DevOps**
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Caching**: Redis for sessions and real-time features
- **File Storage**: Local storage (development) / AWS S3 (production)
- **Email**: Nodemailer with SMTP configuration
- **Logging**: Winston with structured logging
- **Security**: Helmet, CORS, rate limiting, input validation

---

## 📁 Project Structure

```
travelcircles/
├── 📱 apps/
│   ├── 🌐 web/                    # Next.js Frontend Application
│   │   ├── src/
│   │   │   ├── app/              # Next.js 14 App Router pages
│   │   │   │   ├── (auth)/       # Authentication pages
│   │   │   │   ├── booking/      # Booking flow pages
│   │   │   │   ├── community/    # Community features
│   │   │   │   └── dashboard/    # User dashboard
│   │   │   ├── components/       # Reusable React components
│   │   │   │   ├── ui/          # Basic UI components
│   │   │   │   ├── forms/       # Form components
│   │   │   │   ├── layout/      # Layout components
│   │   │   │   └── booking/     # Booking-specific components
│   │   │   ├── contexts/        # React contexts
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── lib/             # Utility libraries
│   │   │   └── types/           # TypeScript type definitions
│   │   ├── public/              # Static assets
│   │   ├── next.config.js       # Next.js configuration
│   │   ├── tailwind.config.js   # Tailwind CSS configuration
│   │   └── package.json         # Frontend dependencies
│   │
│   └── 🔧 api/                    # Express.js Backend API
│       ├── src/
│       │   ├── routes/          # API route handlers
│       │   │   ├── auth.ts      # Authentication endpoints
│       │   │   ├── bookings.ts  # Booking management
│       │   │   ├── buses.ts     # Bus and route data
│       │   │   ├── community.ts # Community features
│       │   │   ├── payments.ts  # Payment processing
│       │   │   └── users.ts     # User management
│       │   ├── middleware/      # Express middleware
│       │   │   ├── auth.ts      # Authentication middleware
│       │   │   ├── validation.ts # Input validation
│       │   │   └── errorHandler.ts # Error handling
│       │   ├── services/        # Business logic services
│       │   ├── utils/           # Utility functions
│       │   ├── config/          # Configuration files
│       │   └── index.ts         # Server entry point
│       ├── prisma/
│       │   ├── schema.prisma    # Database schema
│       │   ├── migrations/      # Database migrations
│       │   └── seed.ts          # Database seeding
│       ├── uploads/             # File upload directory
│       ├── logs/                # Application logs
│       └── package.json         # Backend dependencies
│
├── 📦 packages/                   # Shared Packages (Future)
│   ├── types/                   # Shared TypeScript types
│   ├── ui/                      # Shared UI components
│   └── utils/                   # Shared utility functions
│
├── 📚 docs/                       # Documentation
│   ├── API_DOCUMENTATION.md     # API endpoint documentation
│   ├── DEPLOYMENT_GUIDE.md      # Production deployment guide
│   ├── DEVELOPMENT_SETUP.md     # Development environment setup
│   └── TROUBLESHOOTING.md       # Common issues and solutions
│
├── 🛠️ tools/                      # Development Tools
│   ├── scripts/                 # Build and deployment scripts
│   └── configs/                 # Shared configurations
│
├── 🚀 Startup Scripts
│   ├── start-platform.bat       # Windows batch script
│   ├── start-platform.ps1       # PowerShell script
│   ├── start-platform.sh        # Unix/Linux script
│   └── install-dependencies.bat # Dependency installation
│
├── ⚙️ Configuration Files
│   ├── package.json             # Root package configuration
│   ├── turbo.json               # Turborepo configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── .env                     # Root environment variables
│   └── .gitignore               # Git ignore rules
│
└── 📄 Documentation Files
    ├── README.md                # This file
    ├── CHANGELOG.md             # Version history
    └── LICENSE                  # License information
```

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

| Requirement | Version | Purpose | Installation |
|-------------|---------|---------|--------------|
| **Node.js** | 20.0.0+ | JavaScript runtime | [Download](https://nodejs.org/) |
| **npm** | 9.0.0+ | Package manager | Included with Node.js |
| **Git** | Latest | Version control | [Download](https://git-scm.com/) |

**Optional (for production):**
- **PostgreSQL** 15+ (SQLite used for development)
- **Redis** 6+ (for caching and real-time features)

### ⚡ Quick Installation

**Option 1: Automated Setup (Recommended)**

```bash
# Clone the repository
git clone https://github.com/your-username/travelcircles.git
cd travelcircles

# Run automated setup (Windows)
install-dependencies.bat

# Run automated setup (PowerShell)
powershell -ExecutionPolicy Bypass -File start-platform.ps1

# Run automated setup (Linux/Mac)
chmod +x start-platform.sh && ./start-platform.sh
```

**Option 2: Manual Setup**

```bash
# 1. Clone the repository
git clone https://github.com/your-username/travelcircles.git
cd travelcircles

# 2. Install root dependencies
npm install

# 3. Install backend dependencies
cd apps/api
npm install
cd ../..

# 4. Install frontend dependencies
cd apps/web
npm install
cd ../..

# 5. Start both servers
npm run dev
```

### 🌐 Access Your Application

After successful installation, your application will be available at:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main user interface |
| **Backend API** | http://localhost:3002 | REST API endpoints |
| **API Documentation** | http://localhost:3002/api/docs | Swagger documentation |

### 🎯 Default Test Credentials

For testing purposes, you can use these default credentials:

```
Email: admin@travelcircles.com
Password: admin123

Email: user@travelcircles.com
Password: user123
```

---

## ⚙️ Configuration

### 🔧 Environment Variables

The platform uses environment variables for configuration. Here are the key files:

#### Backend Configuration (`apps/api/.env`)

```bash
# Server Configuration
PORT=3002                                    # API server port
NODE_ENV=development                         # Environment mode

# Database Configuration
DATABASE_URL="file:./dev.db"                # SQLite for development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key         # JWT signing secret
JWT_REFRESH_SECRET=your-refresh-secret       # JWT refresh secret
JWT_EXPIRES_IN=7d                           # Token expiration

# CORS Configuration
CORS_ORIGIN=http://localhost:3000           # Frontend URL

# Stripe Configuration (Test Keys)
STRIPE_SECRET_KEY=sk_test_...               # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...          # Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_...             # Stripe webhook secret

# Email Configuration
SMTP_HOST=smtp.gmail.com                    # Email server
SMTP_PORT=587                               # Email port
SMTP_USER=your-email@gmail.com              # Email username
SMTP_PASS=your-app-password                 # Email password

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379            # Redis connection

# File Upload Configuration
MAX_FILE_SIZE=5242880                       # 5MB max file size
UPLOAD_PATH=./uploads                       # Upload directory

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000                 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100                 # Max requests per window

# Logging
LOG_LEVEL=info                              # Log level
LOG_FILE=./logs/app.log                     # Log file path
```

#### Frontend Configuration (`apps/web/.env.local`)

```bash
# Next.js Configuration
PORT=3000                                   # Frontend port

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3002   # Backend API URL

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Stripe public key

# App Configuration
NEXT_PUBLIC_APP_NAME=TravelCircles          # Application name
NEXT_PUBLIC_APP_URL=http://localhost:3000   # Frontend URL

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false          # Analytics toggle
NEXT_PUBLIC_ENABLE_CHAT=false               # Chat feature toggle

# Map Configuration (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key    # Google Maps API

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX     # Google Analytics
```

### 🔐 Security Configuration

- **JWT Secrets**: Generate strong, unique secrets for production
- **CORS**: Configure allowed origins for production deployment
- **Rate Limiting**: Adjust limits based on expected traffic
- **File Uploads**: Configure secure file upload restrictions
- **HTTPS**: Enable HTTPS in production environments

---

## 🛠️ Development

### 📝 Available Scripts

#### Root Level Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:api          # Start only backend API server
npm run dev:web          # Start only frontend web server

# Building
npm run build            # Build both applications
npm run build:api        # Build only backend
npm run build:web        # Build only frontend

# Utilities
npm run clean            # Clean all build artifacts
npm run install:all      # Install all dependencies
npm run format           # Format code with Prettier

# Turborepo (Advanced)
npm run turbo:dev        # Start development with Turborepo
npm run turbo:build      # Build with Turborepo
```

#### Backend Scripts (`apps/api`)

```bash
# Development
npm run dev              # Start development server with nodemon
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server

# Database
npm run db:migrate       # Run Prisma migrations
npm run db:generate      # Generate Prisma client
npm run db:seed          # Seed database with test data

# Testing & Quality
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking

# Utilities
npm run clean            # Clean build directory
```

#### Frontend Scripts (`apps/web`)

```bash
# Development
npm run dev              # Start Next.js development server
npm run build            # Build for production
npm run start            # Start production server

# Quality & Testing
npm run lint             # Run Next.js linting
npm run type-check       # Run TypeScript type checking

# Utilities
npm run clean            # Clean .next directory
```

### 🔄 Development Workflow

1. **Start Development Environment**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Frontend changes: Edit files in `apps/web/src/`
   - Backend changes: Edit files in `apps/api/src/`
   - Both servers support hot reload

3. **Database Changes**
   ```bash
   cd apps/api
   npx prisma db push          # Push schema changes
   npx prisma studio           # Open database browser
   ```

4. **Testing Changes**
   ```bash
   npm run test                # Run all tests
   npm run lint                # Check code quality
   npm run type-check          # Verify TypeScript
   ```

### 🐛 Debugging

#### Backend Debugging
- **Logs**: Check `apps/api/logs/app.log`
- **Database**: Use `npx prisma studio` to inspect data
- **API Testing**: Use tools like Postman or Thunder Client

#### Frontend Debugging
- **Browser DevTools**: Use React Developer Tools
- **Network Tab**: Monitor API calls and responses
- **Console**: Check for JavaScript errors and warnings

---

## 🧪 Testing

### 🔬 Testing Strategy

The platform includes comprehensive testing at multiple levels:

#### Backend Testing

```bash
# Run all backend tests
cd apps/api
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- auth.test.ts
```

**Test Types:**
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Prisma model testing
- **Authentication Tests**: JWT and OAuth testing

#### Frontend Testing

```bash
# Run frontend tests
cd apps/web
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (if configured)
npm run test:e2e
```

**Test Types:**
- **Component Tests**: React component testing
- **Integration Tests**: Page and flow testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: WCAG compliance testing

### 📊 Test Coverage

Current test coverage targets:
- **Backend**: 80%+ code coverage
- **Frontend**: 70%+ component coverage
- **Critical Paths**: 95%+ coverage (authentication, payments, bookings)

---

## 📦 Deployment

### 🏗️ Production Build

#### Local Production Build

```bash
# Build all applications
npm run build

# Test production build locally
cd apps/web && npm run start    # Frontend on port 3000
cd apps/api && npm run start    # Backend on port 3002
```

#### Build Verification

```bash
# Check build outputs
ls apps/web/.next/              # Next.js build output
ls apps/api/dist/               # TypeScript compiled output

# Verify build sizes
npm run build -- --analyze     # Analyze bundle sizes
```

### 🚀 Deployment Options

#### Option 1: Traditional VPS/Server Deployment

```bash
# 1. Clone repository on server
git clone https://github.com/your-username/travelcircles.git
cd travelcircles

# 2. Install dependencies
npm install --production

# 3. Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
# Edit files with production values

# 4. Set up database
cd apps/api
npx prisma migrate deploy
npx prisma generate

# 5. Build applications
cd ../..
npm run build

# 6. Start with PM2 (recommended)
npm install -g pm2
pm2 start ecosystem.config.js
```

#### Option 2: Docker Deployment

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 3: Cloud Platform Deployment

**Vercel (Frontend)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd apps/web
vercel --prod
```

**Railway/Render (Backend)**
```bash
# Connect your repository to Railway/Render
# Set environment variables in dashboard
# Deploy automatically on git push
```

### 🔧 Production Configuration

#### Environment Variables for Production

**Backend (`apps/api/.env`)**
```bash
NODE_ENV=production
PORT=3002
DATABASE_URL=postgresql://user:password@host:5432/travelcircles
REDIS_URL=redis://user:password@host:6379
JWT_SECRET=your-super-secure-production-secret
STRIPE_SECRET_KEY=sk_live_your_live_key
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (`apps/web/.env.local`)**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

#### Performance Optimizations

- **Database**: Use PostgreSQL with connection pooling
- **Caching**: Implement Redis for session and data caching
- **CDN**: Use CloudFlare or AWS CloudFront for static assets
- **Monitoring**: Set up application monitoring (New Relic, DataDog)
- **SSL**: Enable HTTPS with Let's Encrypt or CloudFlare

#### Security Checklist

- [ ] Update all default passwords and secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting and DDoS protection
- [ ] Enable security headers (Helmet.js configured)
- [ ] Regular security updates and dependency audits
- [ ] Database backup and recovery procedures
- [ ] Log monitoring and alerting

---

## 🔧 Troubleshooting

### 🚨 Common Issues and Solutions

#### Installation Issues

**Problem**: `npm install` fails with peer dependency errors
```bash
# Solution 1: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 2: Use force flag
npm install --force

# Solution 3: Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Node.js version compatibility
```bash
# Check Node.js version
node --version

# Install Node.js 20+ from https://nodejs.org/
# Or use Node Version Manager (nvm)
nvm install 20
nvm use 20
```

#### Development Server Issues

**Problem**: Port already in use (EADDRINUSE)
```bash
# Find process using port
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Mac/Linux

# Kill process
taskkill /PID <PID> /F          # Windows
kill -9 <PID>                   # Mac/Linux

# Or use different port
PORT=3001 npm run dev
```

**Problem**: Database connection errors
```bash
# Reset database
cd apps/api
rm -f prisma/dev.db            # Remove SQLite database
npx prisma migrate reset        # Reset and recreate
npx prisma db seed             # Reseed data
```

#### Build Issues

**Problem**: TypeScript compilation errors
```bash
# Check TypeScript configuration
npm run type-check

# Fix common issues
npm run lint --fix
npm run format
```

**Problem**: Next.js build failures
```bash
# Clear Next.js cache
cd apps/web
rm -rf .next
npm run build
```

#### Runtime Issues

**Problem**: API endpoints returning 404
- Check if backend server is running on correct port (3002)
- Verify API proxy configuration in `apps/web/next.config.js`
- Check CORS configuration in backend

**Problem**: Authentication not working
- Verify JWT secrets are set in environment variables
- Check if cookies are being set correctly
- Ensure CORS allows credentials

### 📞 Getting Help

If you encounter issues not covered here:

1. **Check Documentation**: Review files in `/docs` directory
2. **Search Issues**: Look through existing GitHub issues
3. **Create Issue**: Open a new issue with:
   - Error message and stack trace
   - Steps to reproduce
   - Environment details (OS, Node.js version, etc.)
   - Screenshots if applicable

### 🔍 Debug Mode

Enable debug mode for detailed logging:

```bash
# Backend debug mode
DEBUG=travelcircles:* npm run dev

# Frontend debug mode
NEXT_PUBLIC_DEBUG=true npm run dev
```

---

## 🤝 Contributing

We welcome contributions to TravelCircles! Here's how you can help improve the platform:

### 🌟 Ways to Contribute

- **🐛 Bug Reports**: Report issues and bugs
- **💡 Feature Requests**: Suggest new features and improvements
- **📝 Documentation**: Improve documentation and guides
- **🔧 Code Contributions**: Submit bug fixes and new features
- **🎨 UI/UX Improvements**: Enhance user interface and experience
- **🌍 Localization**: Add support for more Indian languages

### 📋 Contribution Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/travelcircles.git
   cd travelcircles
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b bugfix/fix-issue-123
   ```

3. **Set Up Development Environment**
   ```bash
   npm install
   npm run dev
   ```

4. **Make Your Changes**
   - Follow the existing code style and conventions
   - Add tests for new features
   - Update documentation as needed
   - Ensure all tests pass

5. **Test Your Changes**
   ```bash
   npm run test           # Run all tests
   npm run lint           # Check code style
   npm run type-check     # Verify TypeScript
   npm run build          # Test production build
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   # Use conventional commit format
   ```

7. **Push and Create Pull Request**
   ```bash
   git push origin feature/amazing-feature
   # Then create PR on GitHub
   ```

### 📝 Coding Standards

#### Code Style
- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive variable and function names

#### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add new booking confirmation feature
fix: resolve payment gateway timeout issue
docs: update API documentation
style: improve button component styling
refactor: optimize database queries
test: add unit tests for auth service
```

#### Pull Request Guidelines
- **Title**: Clear, descriptive title
- **Description**: Explain what changes were made and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how changes were tested
- **Breaking Changes**: Highlight any breaking changes

### 🏆 Recognition

Contributors will be recognized in:
- **README Contributors Section**
- **GitHub Contributors Graph**
- **Release Notes** for significant contributions
- **Special Thanks** in documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📜 License Summary

```
MIT License

Copyright (c) 2024 TravelCircles

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🔗 Links & Resources

### 📚 Documentation
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Database structure and relationships
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Development Setup](docs/DEVELOPMENT_SETUP.md)** - Detailed development environment setup
- **[Contributing Guidelines](docs/CONTRIBUTING.md)** - Detailed contribution guidelines
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### 🛠️ Development Tools
- **[Next.js Documentation](https://nextjs.org/docs)** - Frontend framework
- **[Express.js Guide](https://expressjs.com/en/guide/routing.html)** - Backend framework
- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling framework
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type system

### 🌐 External Services
- **[Stripe Documentation](https://stripe.com/docs)** - Payment processing
- **[Socket.io Guide](https://socket.io/docs/v4/)** - Real-time communication
- **[Redis Documentation](https://redis.io/documentation)** - Caching and sessions
- **[Nodemailer Guide](https://nodemailer.com/about/)** - Email services

### 🚀 Deployment Platforms
- **[Vercel](https://vercel.com/docs)** - Frontend deployment
- **[Railway](https://docs.railway.app/)** - Full-stack deployment
- **[Render](https://render.com/docs)** - Backend deployment
- **[DigitalOcean](https://docs.digitalocean.com/)** - VPS deployment

---

## 🙏 Acknowledgments

### 👥 Contributors

Thanks to all the contributors who have helped build TravelCircles:

<!-- Contributors will be automatically added here -->

### 🎯 Special Thanks

- **Indian Railway System** - Inspiration for booking flow and PNR system
- **RedBus** - Reference for bus booking user experience
- **MakeMyTrip** - Inspiration for travel community features
- **Open Source Community** - For the amazing tools and libraries

### 📦 Built With

This project is built with love using these amazing open-source technologies:

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Node.js web framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Socket.io](https://socket.io/) - Real-time communication
- [Stripe](https://stripe.com/) - Payment processing
- [And many more...](package.json)

---

<div align="center">

**Made with ❤️ for the Indian travel community**

**[⭐ Star this repository](https://github.com/your-username/travelcircles)** if you find it helpful!

[![GitHub stars](https://img.shields.io/github/stars/your-username/travelcircles?style=social)](https://github.com/your-username/travelcircles/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/travelcircles?style=social)](https://github.com/your-username/travelcircles/network/members)
[![GitHub issues](https://img.shields.io/github/issues/your-username/travelcircles)](https://github.com/your-username/travelcircles/issues)

</div>
