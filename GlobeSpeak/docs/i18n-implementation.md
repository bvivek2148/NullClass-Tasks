# GlobeSpeak Internationalization Implementation

This document provides a comprehensive overview of the internationalization (i18n) implementation in GlobeSpeak, including technical details, best practices, and maintenance guidelines.

## 🏗️ Architecture Overview

### Core Technologies
- **react-i18next**: React integration for i18next
- **i18next-browser-languagedetector**: Automatic language detection
- **i18next-http-backend**: Dynamic translation loading
- **Intl APIs**: Native browser internationalization

### Language Support
- **English (en)**: Base language and fallback
- **Spanish (es)**: Full translation coverage
- **French (fr)**: Full translation coverage  
- **German (de)**: Full translation coverage

## 📁 File Structure

```
public/locales/
├── en/common.json          # English translations (base)
├── es/common.json          # Spanish translations
├── fr/common.json          # French translations
└── de/common.json          # German translations

src/i18n/
└── index.ts                # i18n configuration and utilities

src/components/
└── LanguageSelector.tsx    # Language switching component

scripts/
└── check-translations.js  # Translation validation script
```

## 🔧 Configuration Details

### i18next Setup
```typescript
// src/i18n/index.ts
i18n
  .use(Backend)                    // Load translations from JSON files
  .use(languageDetector)           // Detect user language
  .use(initReactI18next)          // React integration
  .init({
    fallbackLng: 'en',            // Fallback to English
    supportedLngs: ['en', 'es', 'fr', 'de'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'globespeak-language',
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
```

### Language Detection Priority
1. **localStorage**: Saved user preference (`globespeak-language` key)
2. **navigator.language**: Browser language setting
3. **HTML lang attribute**: Document language
4. **Fallback**: English (en)

### Persistence Strategy
- User language preference stored in `localStorage`
- Key: `globespeak-language`
- Automatically applied on app initialization
- Persists across browser sessions

## 🗂️ Translation Key Organization

### Hierarchical Structure
```json
{
  "ui": {
    "navigation": { "home": "Home", "about": "About" },
    "buttons": { "save": "Save", "cancel": "Cancel" },
    "labels": { "loading": "Loading...", "required": "Required" },
    "status": { "online": "Online", "offline": "Offline" }
  },
  "forms": {
    "labels": { "email": "Email", "password": "Password" },
    "placeholders": { "enterEmail": "Enter your email" },
    "validation": { "required": "This field is required" }
  },
  "messages": {
    "success": { "saved": "Successfully saved!" },
    "errors": { "general": "An error occurred" },
    "warnings": { "unsavedChanges": "You have unsaved changes" },
    "info": { "welcome": "Welcome to GlobeSpeak!" }
  },
  "pages": {
    "titles": { "home": "Home - GlobeSpeak" },
    "descriptions": { "home": "Welcome message" },
    "headings": { "welcome": "Welcome to GlobeSpeak" }
  },
  "accessibility": {
    "skipToContent": "Skip to main content",
    "openMenu": "Open navigation menu",
    "loadingContent": "Loading content, please wait"
  },
  "time": {
    "now": "now",
    "minuteAgo": "a minute ago",
    "minutesAgo": "{{count}} minutes ago"
  },
  "languages": {
    "en": "English",
    "es": "Español",
    "fr": "Français",
    "de": "Deutsch"
  }
}
```

### Key Naming Conventions
- **Dot notation**: `ui.navigation.home`
- **Descriptive names**: Clear purpose indication
- **Consistent grouping**: Related keys together
- **Plural forms**: Separate keys for singular/plural

## 🎯 Usage Patterns

### Basic Translation
```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('pages.headings.welcome')}</h1>;
}
```

### Interpolation
```typescript
// Translation: "Hello {{name}}, you have {{count}} messages"
<p>{t('messages.greeting', { name: 'John', count: 5 })}</p>
```

### Pluralization
```typescript
// Automatic plural handling based on count
<p>{t('time.minutesAgo', { count: minutes })}</p>
```

### Conditional Translations
```typescript
const message = isError 
  ? t('messages.errors.general')
  : t('messages.success.saved');
```

## 🌐 Locale Formatting

### Date Formatting
```typescript
import { formatDate } from '../i18n';

// Automatic locale-aware formatting
formatDate(new Date(), { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});
```

### Number Formatting
```typescript
import { formatNumber, formatCurrency } from '../i18n';

formatNumber(1234.56);           // "1,234.56" (en) / "1.234,56" (de)
formatCurrency(99.99, 'EUR');    // "€99.99" (en) / "99,99 €" (fr)
```

### Relative Time
```typescript
import { formatRelativeTime } from '../i18n';

formatRelativeTime(new Date(Date.now() - 300000)); // "5 minutes ago"
```

## 🔄 Language Switching

### LanguageSelector Component
```typescript
import { LanguageSelector } from './components/LanguageSelector';

// Full dropdown with label
<LanguageSelector />

// Compact version for headers
<LanguageSelector variant="compact" showLabel={false} />
```

### Programmatic Language Change
```typescript
import { changeLanguage } from './i18n';

await changeLanguage('es'); // Switch to Spanish
```

### Language Change Effects
1. **UI Updates**: All translated text updates instantly
2. **HTML Attributes**: `lang` and `dir` attributes updated
3. **Document Title**: Page title updated if translated
4. **localStorage**: Preference saved automatically
5. **Custom Event**: `languageChanged` event dispatched

## 🧪 Testing Strategy

### Component Testing
```typescript
// Mock useTranslation for tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));
```

### Translation Validation
```bash
npm run i18n:check
```

Validates:
- ✅ Key consistency across languages
- ✅ No missing translations
- ✅ No empty values
- ✅ Interpolation variable matching
- ✅ JSON syntax validation

### Manual Testing Checklist
- [ ] Language selector functionality
- [ ] Instant switching without reload
- [ ] Persistence across sessions
- [ ] Fallback to English for missing keys
- [ ] Layout adaptation for text expansion
- [ ] Accessibility with screen readers
- [ ] Browser language detection

## 🎨 Layout Considerations

### Text Expansion
- **German**: Up to 30% longer than English
- **French**: Up to 20% longer than English
- **Spanish**: Similar length to English

### Responsive Design
```css
/* Accommodate text expansion */
.button {
  min-width: 120px;
  padding: 8px 16px;
}

/* Flexible layouts */
.navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
```

### RTL Preparation
```css
[dir="rtl"] .component {
  text-align: right;
  margin-left: auto;
  margin-right: 0;
}
```

## ♿ Accessibility Implementation

### Screen Reader Support
```typescript
// Announce language changes
<div role="status" aria-live="polite">
  {t('messages.success.languageChanged')}
</div>
```

### ARIA Labels
```typescript
<button aria-label={t('accessibility.toggleLanguage')}>
  <Globe />
</button>
```

### Semantic HTML
```typescript
<main role="main" aria-labelledby="page-title">
  <h1 id="page-title">{t('pages.titles.home')}</h1>
</main>
```

## 🚀 Performance Optimizations

### Code Splitting
```typescript
// Lazy load pages to reduce initial bundle
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

### Translation Loading
- **Preload**: English translations loaded immediately
- **Lazy Load**: Other languages loaded on demand
- **Caching**: Translations cached in memory
- **Fallback**: Instant fallback to English

### Bundle Size
- **Tree Shaking**: Unused translations removed
- **Compression**: Gzip compression for JSON files
- **CDN**: Static assets served from CDN

## 🔧 Maintenance Guidelines

### Adding New Languages
1. Create translation directory: `public/locales/[lang]/`
2. Copy base translations: `cp en/common.json [lang]/common.json`
3. Update configuration: Add to `SUPPORTED_LANGUAGES`
4. Translate content: Maintain key structure
5. Validate: Run `npm run i18n:check`
6. Test: Manual testing across browsers

### Updating Translations
1. **Add new keys**: Add to English first
2. **Maintain structure**: Keep hierarchical organization
3. **Update all languages**: Ensure consistency
4. **Validate**: Run translation checker
5. **Test**: Verify in application

### Translation Workflow
1. **Development**: Add keys in English
2. **Translation**: Professional translation service
3. **Review**: Native speaker review
4. **Integration**: Update JSON files
5. **Validation**: Automated checking
6. **Testing**: QA across languages

## 📊 Monitoring & Analytics

### Translation Coverage
```bash
# Check translation completeness
npm run i18n:check

# Output example:
# EN: 247/247 keys (100.0% coverage)
# ES: 247/247 keys (100.0% coverage)
# FR: 245/247 keys (99.2% coverage)
# DE: 247/247 keys (100.0% coverage)
```

### Usage Analytics
- Track language selection frequency
- Monitor user language preferences
- Identify missing translations in production
- Measure translation loading performance

## 🐛 Troubleshooting

### Common Issues

**Missing Translation Keys**
```typescript
// Check if key exists before using
if (i18n.exists('key.path')) {
  return t('key.path');
}
return 'Fallback text';
```

**Interpolation Errors**
```typescript
// Ensure variables match between languages
// EN: "Hello {{name}}"
// ES: "Hola {{name}}" ✅
// FR: "Bonjour {{nom}}" ❌ (variable mismatch)
```

**Layout Breaking**
```css
/* Prevent text overflow */
.text-container {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
```

### Debug Mode
```typescript
// Enable debug logging in development
i18n.init({
  debug: process.env.NODE_ENV === 'development'
});
```

## 📈 Future Enhancements

### Planned Features
- [ ] **RTL Support**: Arabic and Hebrew languages
- [ ] **Context-aware translations**: Different translations based on context
- [ ] **Pluralization rules**: Advanced plural forms for complex languages
- [ ] **Translation management**: Admin interface for translators
- [ ] **A/B testing**: Test different translations
- [ ] **Machine translation**: Fallback for missing translations

### Technical Improvements
- [ ] **Lazy loading**: Load translations on route change
- [ ] **Service worker**: Offline translation support
- [ ] **CDN integration**: Serve translations from CDN
- [ ] **Real-time updates**: Hot reload translations in development

---

This implementation provides a solid foundation for internationalization that can scale with the application's growth while maintaining excellent user experience across all supported languages.
