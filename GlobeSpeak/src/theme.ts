export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'globespeak-theme';

export function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  // Always default to light theme instead of checking system preference
  return 'light';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  // Update theme-color meta for better mobile UX
  const lightMeta = document.querySelector('meta[name="theme-color"][media*="light"]') as HTMLMetaElement | null;
  const darkMeta = document.querySelector('meta[name="theme-color"][media*="dark"]') as HTMLMetaElement | null;
  if (lightMeta && darkMeta) {
    // Nothing else needed; browser picks by media
  } else {
    // Fallback single theme-color meta
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = theme === 'dark' ? '#0b1220' : '#ffffff';
  }
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

export function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const current = (document.documentElement.getAttribute('data-theme') as Theme) || getPreferredTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

// Initialize ASAP in SPA entry
if (typeof window !== 'undefined') {
  // Apply early to avoid flash
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    // Always default to light theme instead of checking system preference
    const initial: Theme = stored ?? 'light';
    document.documentElement.setAttribute('data-theme', initial);
  } catch {}
}