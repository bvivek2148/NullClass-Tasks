import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Language configuration
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch'
};

// Storage key for language preference
export const LANGUAGE_STORAGE_KEY = 'globespeak-language';

// Custom language detector configuration
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'localStorage',
  lookup() {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage) ? stored : undefined;
  },
  cacheUserLanguage(lng: string) {
    if (SUPPORTED_LANGUAGES.includes(lng as SupportedLanguage)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    }
  }
});

// Resolve mode safely for Vite without @types/node
const MODE: string = (import.meta as any).env?.MODE || 'development';

// Initialize i18next
i18n
  .use(Backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    // Language settings
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,

    // Detection settings
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
      // i18next v23 uses 'supportedLngs' instead of deprecated 'whitelist'
    },

    // Backend settings
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.missing.json'
    },

    // Namespace settings
    ns: ['common'],
    defaultNS: 'common',

    // React settings
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span']
    },

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes values
      format: (value: any, format?: string, lng?: string) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);

        // Date formatting
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(new Date(value));
        }
        if (format === 'datetime') {
          return new Intl.DateTimeFormat(lng, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(value));
        }

        // Number formatting
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'EUR' // Default currency, can be made configurable
          }).format(value);
        }

        return value;
      }
    },

    // Debug settings (disable in production)
    debug: MODE === 'development',

    // Missing key handling
    saveMissing: MODE === 'development',
    // i18next missingKeyHandler signature: (lngs, ns, key, fallbackValue, updateMissing, options)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    missingKeyHandler: (lngs: readonly string[], _ns: string, key: string) => {
      if (MODE === 'development') {
        console.warn(`Missing translation key: ${key} for languages: ${lngs.join(', ')}`);
      }
    },

    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',

    // Performance
    load: 'languageOnly', // Don't load region-specific variants
    preload: ['en'], // Preload English as fallback

    // Clean code on production
    cleanCode: true,

    // Return objects for complex translations
    returnObjects: false,
    returnEmptyString: false,
    returnNull: false
  });

// Language change handler
i18n.on('languageChanged', (lng: string) => {
  // Update HTML lang attribute
  document.documentElement.lang = lng;

  // Update HTML dir attribute for RTL languages (future enhancement)
  const rtlLanguages = ['ar', 'he', 'fa'];
  document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';

  // Update page title if needed
  const titleKey = 'pages.titles.home';
  if (i18n.exists(titleKey)) {
    document.title = i18n.t(titleKey);
  }

  // Store language preference
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);

  // Dispatch custom event for components that need to react to language changes
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lng } }));
});

// Utility functions
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage;
};

export const changeLanguage = async (lng: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(lng);
};

export const isLanguageSupported = (lng: string): lng is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lng as SupportedLanguage);
};

export const getLanguageName = (lng: SupportedLanguage): string => {
  return LANGUAGE_NAMES[lng];
};

// Format utilities using current locale
export const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
  const currentLang = getCurrentLanguage();
  return new Intl.DateTimeFormat(currentLang, options).format(new Date(date));
};

export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  const currentLang = getCurrentLanguage();
  return new Intl.NumberFormat(currentLang, options).format(number);
};

export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  const currentLang = getCurrentLanguage();
  return new Intl.NumberFormat(currentLang, {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatCompactNumber = (value: number, maximumFractionDigits = 1): string => {
  const currentLang = getCurrentLanguage();
  return new Intl.NumberFormat(currentLang, { notation: 'compact', maximumFractionDigits }).format(value);
};

export const formatRelativeTime = (date: Date | string | number): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // const rtf = new Intl.RelativeTimeFormat(currentLang, { numeric: 'auto' });

  if (diffInSeconds < 60) return i18n.t('time.now');
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return minutes === 1 ? i18n.t('time.minuteAgo') : i18n.t('time.minutesAgo', { count: minutes });
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 ? i18n.t('time.hourAgo') : i18n.t('time.hoursAgo', { count: hours });
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? i18n.t('time.dayAgo') : i18n.t('time.daysAgo', { count: days });
  }
  if (diffInSeconds < 2419200) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return weeks === 1 ? i18n.t('time.weekAgo') : i18n.t('time.weeksAgo', { count: weeks });
  }
  if (diffInSeconds < 29030400) {
    const months = Math.floor(diffInSeconds / 2419200);
    return months === 1 ? i18n.t('time.monthAgo') : i18n.t('time.monthsAgo', { count: months });
  }

  const years = Math.floor(diffInSeconds / 29030400);
  return years === 1 ? i18n.t('time.yearAgo') : i18n.t('time.yearsAgo', { count: years });
};

export default i18n;
