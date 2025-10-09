# NotifyHub 🔔

> **Enterprise-Grade Multi-Channel Notification Management Platform**

NotifyHub is a comprehensive notification system that enables seamless delivery of messages across multiple channels including email, SMS, and push notifications. Built with advanced queue management, retry logic, and failover strategies for maximum reliability and scale.

## 🚀 Live Demo

**[View Live Demo →](https://notifyhub-xi.vercel.app/)**

## ✨ Key Features

### 📱 Multi-Channel Delivery
- **Email Notifications** - Rich HTML templates with SendGrid integration
- **SMS Messaging** - Reliable SMS delivery via Twilio
- **Push Notifications** - Real-time push notifications using OneSignal
- **Smart Channel Selection** - Automatic channel selection based on user preferences

### ⚡ Advanced Queue System
- **Priority-Based Queuing** - Critical, High, Normal, and Low priority tiers
- **Retry Logic** - Exponential backoff with up to 3 retry attempts
- **Automatic Failover** - SMS/Push failures automatically fallback to email
- **Queue Monitoring** - Real-time queue status and performance metrics

### 🎨 Template Engine
- **Versioned Templates** - Template versioning and rollback capabilities
- **Multi-Language Support** - Internationalization for global reach
- **Dynamic Variables** - Personalized content with variable substitution
- **Rich Media Support** - Images, videos, and interactive content

### 📊 Analytics & Monitoring
- **Delivery Metrics** - Real-time delivery status and success rates
- **Performance Analytics** - Channel performance and optimization insights
- **Error Tracking** - Detailed error reporting and debugging
- **User Engagement** - Click-through rates and engagement metrics

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Better Auth
- **Database**: Drizzle ORM with LibSQL
- **Queue System**: BullMQ with Redis
- **UI Components**: Radix UI, Tailwind CSS, Framer Motion
- **Email**: SendGrid, Nodemailer
- **SMS**: Twilio
- **Push Notifications**: OneSignal
- **Payment**: Stripe integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Redis server (for queue management)
- Environment variables (see `.env.example`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NotifyHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Configure your API keys and database URLs
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   # or
   bun run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── queue/          # Queue monitoring dashboard
│   ├── templates/      # Template management
│   └── profile/        # User profile & preferences
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   └── notifications/ # Notification-specific components
├── db/                # Database schema and utilities
├── lib/               # Utility functions and configurations
└── hooks/             # Custom React hooks
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=your_database_url

# Redis (for queue management)
REDIS_URL=your_redis_url

# Email Services
SENDGRID_API_KEY=your_sendgrid_key
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Push Notifications (OneSignal)
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_API_KEY=your_onesignal_api_key

# Authentication
AUTH_SECRET=your_auth_secret

# Stripe (for premium features)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

## 📊 Usage Examples

### Sending a Multi-Channel Notification

```typescript
import { sendNotification } from '@/lib/notifications';

const result = await sendNotification({
  userId: 123,
  title: 'Welcome to NotifyHub!',
  message: 'Thank you for joining our platform.',
  channels: ['email', 'push'],
  priority: 'high',
  templateId: 'welcome-template'
});
```

### Queue Management

```typescript
import { addToQueue } from '@/lib/queue';

await addToQueue('notification', {
  type: 'email',
  recipient: 'user@example.com',
  subject: 'Important Update',
  template: 'update-template',
  variables: { userName: 'John', updateType: 'Security' }
}, {
  priority: 1, // High priority
  delay: 5000, // 5 second delay
  attempts: 3   // Retry up to 3 times
});
```

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Connect your repository** to [Vercel](https://vercel.com)
2. **Configure environment variables** in the Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**[🌐 Live Demo](https://notifyhub-xi.vercel.app/)** | **[📚 Documentation](#)** | **[🐛 Report Bug](#)** | **[✨ Request Feature](#)**
