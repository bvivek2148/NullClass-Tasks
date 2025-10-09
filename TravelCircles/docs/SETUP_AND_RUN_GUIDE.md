# TravelCircles Platform - Setup and Run Guide

## 🚀 Quick Start Instructions

### Prerequisites
Before running the TravelCircles platform, ensure you have:

1. **Node.js 18+** installed
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### Step 1: Install Dependencies

Open two terminal windows and navigate to the TravelCircles directory.

**Terminal 1 - Backend API:**
```bash
cd apps/api
npm install
```

**Terminal 2 - Frontend Web:**
```bash
cd apps/web
npm install
```

### Step 2: Environment Configuration

The environment files have been created for you:
- `apps/api/.env` - Backend configuration
- `apps/web/.env.local` - Frontend configuration

**For production use, update these files with your actual:**
- Database connection strings
- Stripe API keys (get from https://stripe.com)
- JWT secrets (generate secure random strings)
- Email service credentials

### Step 3: Start the Platform

**Terminal 1 - Start Backend API:**
```bash
cd apps/api
npm run dev
```
*The API will start on http://localhost:3001*

**Terminal 2 - Start Frontend Web:**
```bash
cd apps/web
npm run dev
```
*The web app will start on http://localhost:3000*

### Step 4: Access the Platform

1. **Web Application:** http://localhost:3000
2. **API Health Check:** http://localhost:3001/health
3. **API Documentation:** http://localhost:3001/api

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "node: command not found"
**Solution:** Install Node.js from https://nodejs.org/

#### Issue 2: "npm install" fails
**Solutions:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

#### Issue 3: Port already in use
**Solutions:**
- Kill existing processes: `npx kill-port 3000 3001`
- Use different ports in environment files

#### Issue 4: TypeScript compilation errors
**Solutions:**
- Install TypeScript globally: `npm install -g typescript`
- Rebuild: `npm run build`

#### Issue 5: Database connection errors
**Solutions:**
- Check DATABASE_URL in .env file
- For development, SQLite is used (no setup required)
- For production, configure your database

### Manual Installation Steps

If automatic scripts don't work, follow these manual steps:

#### Backend Setup:
```bash
# Navigate to backend
cd apps/api

# Install dependencies
npm install express cors helmet morgan dotenv
npm install bcryptjs jsonwebtoken express-validator
npm install winston stripe prisma @prisma/client
npm install -D typescript @types/node @types/express
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install -D ts-node nodemon

# Start development server
npm run dev
```

#### Frontend Setup:
```bash
# Navigate to frontend
cd apps/web

# Install dependencies
npm install next react react-dom
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install axios clsx tailwind-merge
npm install @heroicons/react
npm install -D typescript @types/react @types/node
npm install -D tailwindcss postcss autoprefixer

# Start development server
npm run dev
```

## 📱 Platform Features

Once running, you can access:

### User Features:
- **User Registration/Login** at `/register` and `/login`
- **Route Search** at `/search`
- **Seat Selection** during booking process
- **Payment Processing** with Stripe integration
- **User Dashboard** at `/dashboard`
- **Booking Management** with trip history

### Admin Features:
- **Route Management** - Create and manage bus routes
- **Fleet Management** - Manage bus fleet and seat configurations
- **Booking Analytics** - View booking statistics and reports
- **Payment Management** - Process refunds and view transactions
- **User Management** - Manage user accounts and roles

## 🔐 Default Login Credentials

For testing purposes, you can use these default accounts:

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

**Admin User:**
- Email: `admin@travelcircles.com`
- Password: `admin123`

## 🧪 Testing the Platform

### API Testing:
```bash
# Test API health
curl http://localhost:3001/health

# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'

# Test route search
curl http://localhost:3001/api/routes?origin=New%20York&destination=Boston
```

### Web Testing:
1. Open http://localhost:3000
2. Register a new account or login with default credentials
3. Search for routes (try "New York" to "Boston")
4. Complete a booking workflow
5. Check your dashboard for booking history

## 📊 Platform Status

✅ **Backend API** - Complete with all endpoints
✅ **Frontend Web** - Complete with all pages
✅ **Authentication** - JWT-based with role management
✅ **Payment Processing** - Stripe integration
✅ **Booking System** - Full workflow from search to confirmation
✅ **Admin Dashboard** - Complete management interface
✅ **Mobile Responsive** - Optimized for all devices
✅ **Security** - Enterprise-grade security implementation

## 🎯 Next Steps

After the platform is running:

1. **Customize Branding** - Update colors, logos, and content
2. **Configure Payment** - Set up live Stripe account
3. **Add Real Data** - Import actual routes and bus information
4. **Set Up Database** - Configure production database
5. **Deploy to Production** - Use services like Vercel, Netlify, or AWS

## 📞 Support

If you encounter any issues:

1. Check the console logs in both terminals
2. Verify all dependencies are installed
3. Ensure ports 3000 and 3001 are available
4. Check environment file configurations
5. Review the troubleshooting section above

The TravelCircles platform is now ready to run and provides a complete bus travel booking experience!
