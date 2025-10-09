import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getPreferredTheme, toggleTheme, type Theme } from '../theme';

export const ThemeToggle: React.FC<{ className?: string }>= ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    const listener = () => {
      const next = toggleTheme();
      setTheme(next);
    };
    // Not using event listeners; state updates via click handler
    return () => void listener;
  }, []);

  const handleClick = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`theme-toggle ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      <span className="theme-toggle-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default ThemeToggle;
