# GlobeSpeak - International Communication Platform

A comprehensive React application demonstrating best practices for internationalization (i18n) with support for multiple languages, accessibility, and modern web development standards.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 🌍 Overview
- **Live Demo**: [GlobeSpeak](https://globe-speak-gamma.vercel.app/)

GlobeSpeak is a cutting-edge communication platform designed to break down language barriers and connect people across the globe. Built with modern web technologies and following industry best practices, GlobeSpeak provides a seamless multilingual experience with robust accessibility features.

### Key Objectives

- Enable real-time communication between users speaking different languages
- Provide an inclusive experience for users with disabilities
- Demonstrate enterprise-grade implementation of internationalization
- Showcase modern React development with TypeScript
- Implement responsive design for all device types

## 🚀 Key Features

### Internationalization (i18n)
- **Multi-language support**: English, Spanish, French, German, Portuguese, Russian, Japanese, Korean, and Chinese
- **Automatic language detection** based on browser locale
- **Persistent language preference** stored in localStorage
- **Instant language switching** without page reload
- **Comprehensive translation coverage** for UI, messages, and accessibility content
- **Fallback system** to English for missing translations
- **Locale-specific formatting** for dates, numbers, and currencies
- **Pluralization support** with ICU message format
- **RTL preparation** for future Arabic/Hebrew support

### Accessibility (WCAG 2.1 AA Compliant)
- **Semantic HTML** with proper ARIA attributes
- **Keyboard navigation** support throughout the application
- **Screen reader compatibility** with descriptive labels
- **Focus management** and visual indicators
- **High contrast mode** support
- **Reduced motion** preferences respected
- **Skip to content** links for better navigation

### User Experience
- **Modern dashboard** with activity tracking and language progress
- **Real-time translation** with pronunciation practice
- **Community features** including events and friend connections
- **Profile management** with achievement tracking
- **Responsive design** optimized for mobile, tablet, and desktop
- **Professional UI/UX** with smooth animations and transitions

### Technical Excellence
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **react-i18next** for internationalization
- **Lucide React** for consistent iconography
- **CSS Custom Properties** for theming
- **Responsive design** with mobile-first approach
- **Error boundaries** for graceful error handling
- **Loading states** and user feedback
- **Form validation** with accessibility in mind

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5.0+
- **Routing**: React Router 6.20.1
- **Internationalization**: i18next ecosystem
- **UI Components**: Lucide React Icons
- **State Management**: React Context API
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier
- **Styling**: CSS Custom Properties (variables)

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Buttons, Cards, etc.)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── forms/           # Form components and validation
│   └── __tests__/       # Component tests
├── pages/               # Page components and routing
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   └── ...
├── i18n/               # Internationalization setup and utilities
│   ├── index.ts
│   ├── resources.ts
│   └── formatters.ts
├── styles/             # Global styles and CSS variables
│   └── global.css
├── hooks/              # Custom React hooks
│   └── useTranslation.ts
├── utils/              # Utility functions
│   └── helpers.ts
└── test/               # Test utilities and mocks
    └── setup.ts

public/
└── locales/            # Translation files
    ├── en/common.json
    ├── es/common.json
    ├── fr/common.json
    ├── de/common.json
    ├── pt/common.json
    ├── ru/common.json
    ├── ja/common.json
    ├── ko/common.json
    └── zh/common.json

scripts/
└── check-translations.js  # Translation validation script
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GlobeSpeak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run i18n:check` | Validate translation files |

## 🌐 Internationalization Guide

### Supported Languages
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)

### Adding New Languages

1. **Create translation files**
   ```bash
   mkdir public/locales/[language-code]
   cp public/locales/en/common.json public/locales/[language-code]/common.json
   ```

2. **Update language configuration**
   ```typescript
   // src/i18n/index.ts
   export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ja', 'ko', 'zh', 'new-lang'];
   export const LANGUAGE_NAMES = {
     // ... existing languages
     'new-lang': 'Language Name'
   };
   ```

3. **Translate content**
   Edit the JSON file with translated strings, maintaining the same key structure.

4. **Validate translations**
   ```bash
   npm run i18n:check
   ```

### Translation Key Structure

```json
{
  "ui": {
    "navigation": { "home": "Home" },
    "buttons": { "save": "Save" },
    "labels": { "loading": "Loading..." }
  },
  "forms": {
    "labels": { "email": "Email" },
    "validation": { "required": "This field is required" }
  },
  "messages": {
    "success": { "saved": "Successfully saved!" },
    "errors": { "general": "An error occurred" }
  },
  "pages": {
    "titles": { "home": "Home - GlobeSpeak" },
    "descriptions": { "home": "Welcome message" }
  }
}
```

### Using Translations in Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('pages.titles.home')}</h1>
      <p>{t('messages.success.saved')}</p>
      
      {/* With interpolation */}
      <p>{t('forms.validation.maxLength', { max: 100 })}</p>
      
      {/* With pluralization */}
      <p>{t('time.minutesAgo', { count: 5 })}</p>
    </div>
  );
}
```

### Locale Formatting Utilities

```typescript
import { formatDate, formatNumber, formatCurrency } from './i18n';

// Date formatting
formatDate(new Date(), { year: 'numeric', month: 'long', day: 'numeric' });

// Number formatting
formatNumber(1234.56);

// Currency formatting
formatCurrency(99.99, 'USD');
```

## 🎨 UI/UX Features

### Dashboard Components
- **Performance Metrics**: Track translation accuracy, daily streaks, and achievements
- **Quick Actions**: One-click access to key features
- **Activity Feed**: Recent user activities and notifications
- **Language Progress**: Visual tracking of language learning progress
- **Upcoming Events**: Calendar integration for language exchange events

### Pronunciation Practice
- **Text Input**: Enter phrases for translation and pronunciation
- **Language Selection**: Choose from 9 supported languages
- **Translation Display**: View translated text with proper formatting
- **Audio Playback**: Listen to correct pronunciation using Web Speech API
- **Progress Visualization**: Visual feedback during audio playback

### Community Features
- **Event Management**: Create and join language exchange events
- **Friend Connections**: Connect with other language learners
- **Achievement System**: Earn badges for milestones and accomplishments
- **Testimonials**: User feedback and success stories

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Testing i18n Components

```typescript
import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';

// Mock useTranslation in tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return key as-is for testing
    i18n: { language: 'en' }
  })
}));
```

### Translation Validation

The project includes a comprehensive translation checker:

```bash
npm run i18n:check
```

This validates:
- ✅ All languages have the same keys
- ✅ No missing translations
- ✅ No empty values
- ✅ Consistent interpolation variables
- ✅ Proper JSON format

## 📱 Browser Support

### Desktop Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Browsers
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)
- ✅ Samsung Internet (12+)

### Accessibility Testing
- ✅ NVDA (Windows)
- ✅ VoiceOver (macOS/iOS)
- ✅ JAWS (Windows)
- ✅ TalkBack (Android)

## 🎨 Styling Guidelines

### CSS Custom Properties
```css
:root {
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
  --color-secondary: #0ea5e9;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;
  --border-radius: 0.75rem;
  --border-radius-sm: 0.5rem;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1200px
- Flexible grid system
- Touch-friendly interactive elements

### Animation Guidelines
- Smooth transitions for state changes
- Meaningful micro-interactions
- Reduced motion preferences respected
- Performance-optimized animations

## 🔧 Configuration

### Environment Variables
```env
VITE_APP_TITLE=GlobeSpeak
VITE_API_URL=https://api.globespeak.com
VITE_APP_VERSION=1.0.0
```

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 3000,
    open: true
  },
  build: { 
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    }
  },
  css: {
    devSourcemap: true
  }
});
```

## 📈 Performance

### Optimization Features
- ✅ Code splitting with React.lazy()
- ✅ Tree shaking for smaller bundles
- ✅ Image optimization
- ✅ Font preloading
- ✅ Gzip compression
- ✅ Service worker ready

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 200ms

### Bundle Analysis
```bash
npm run build
npm run preview
```

## 🔒 Security

### Best Practices Implemented
- ✅ Content Security Policy (CSP)
- ✅ Secure headers
- ✅ Input validation and sanitization
- ✅ Protection against XSS attacks
- ✅ Secure storage of user preferences

### Data Privacy
- No personal data collection
- All user preferences stored locally
- No third-party tracking
- GDPR compliant

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new features
5. Run the test suite (`npm test`)
6. Validate translations (`npm run i18n:check`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits
- 100% test coverage for utilities
- Accessibility compliance

### Branch Naming Convention
- `feature/*` for new features
- `fix/*` for bug fixes
- `hotfix/*` for critical fixes
- `release/*` for releases

### Adding New Features
1. Update translations in all languages
2. Add comprehensive tests
3. Update documentation
4. Verify accessibility compliance
5. Test across supported browsers

## 🐛 Troubleshooting

### Common Issues

**Translations not loading:**
- Check that all language files exist in `public/locales/`
- Verify that `SUPPORTED_LANGUAGES` includes the language code
- Run `npm run i18n:check` to validate files

**Development server not starting:**
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall dependencies
- Check for port conflicts (default: 3000)

**Tests failing:**
- Ensure all dependencies are installed
- Check that translation files are valid JSON
- Verify environment variables are set

### Debugging Tools
- React DevTools for component inspection
- Redux DevTools for state management (if applicable)
- Browser developer tools for network and console logs
- i18next debug mode for translation issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [react-i18next](https://react.i18next.com/) for internationalization
- [Lucide](https://lucide.dev/) for beautiful icons
- [Inter](https://rsms.me/inter/) font family
- [Vite](https://vitejs.dev/) for blazing fast development
- [React Router](https://reactrouter.com/) for navigation
- All contributors and the open-source community

---

**Built with ❤️ for global communication**