# 🚀 EcoRoute Deployment Guide

This guide covers deploying the EcoRoute Carbon Footprint Calculator to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository access
- Environment variables configured
- Database setup (for production)

## 🌐 Vercel Deployment (Recommended)

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ecoroute)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.example`

### Environment Variables for Vercel
```bash
NEXT_PUBLIC_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  ecoroute:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_MAPS_API_KEY=${NEXT_PUBLIC_MAPS_API_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

### Build and Run
```bash
# Build the image
docker build -t ecoroute .

# Run the container
docker run -p 3000:3000 --env-file .env.local ecoroute
```

## ☁️ AWS Deployment

### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Select the main branch

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add environment variables in Amplify Console
   - Configure build environment

### AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - Configure security groups (port 3000, 80, 443)

2. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository
   git clone https://github.com/your-username/ecoroute.git
   cd ecoroute
   
   # Install dependencies
   npm ci
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "ecoroute" -- start
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Database Setup

### Supabase (Recommended)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note the URL and anon key

2. **Database Schema**
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email VARCHAR UNIQUE NOT NULL,
     name VARCHAR NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Trip records table
   CREATE TABLE trip_records (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     origin_lat DECIMAL,
     origin_lng DECIMAL,
     destination_lat DECIMAL,
     destination_lng DECIMAL,
     transport_mode VARCHAR NOT NULL,
     distance DECIMAL NOT NULL,
     carbon_emitted DECIMAL NOT NULL,
     carbon_saved DECIMAL NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Achievements table
   CREATE TABLE user_achievements (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     achievement_id VARCHAR NOT NULL,
     unlocked_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Row Level Security**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE trip_records ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
   
   -- Policies
   CREATE POLICY "Users can view own data" ON users
     FOR SELECT USING (auth.uid() = id);
   
   CREATE POLICY "Users can view own trips" ON trip_records
     FOR SELECT USING (auth.uid() = user_id);
   ```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate API keys regularly

### API Security
- Implement rate limiting
- Use CORS properly
- Validate all inputs
- Sanitize user data

### Database Security
- Enable Row Level Security (RLS)
- Use prepared statements
- Regular backups
- Monitor access logs

## 📊 Monitoring & Analytics

### Performance Monitoring
```bash
# Install monitoring tools
npm install @vercel/analytics @vercel/speed-insights
```

### Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs
```

### Analytics Setup
```javascript
// Google Analytics 4
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
    </html>
  )
}
```

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Performance optimization
- [ ] Security headers configured
- [ ] Backup strategy implemented
- [ ] CI/CD pipeline setup

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support

For deployment issues:
1. Check the [troubleshooting guide](TROUBLESHOOTING.md)
2. Review environment variables
3. Check application logs
4. Contact support team

---

**Happy Deploying! 🌱**
