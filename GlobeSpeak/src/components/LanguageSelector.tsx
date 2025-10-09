import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe, Check } from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
  changeLanguage,
  getCurrentLanguage,
  type SupportedLanguage
} from '../i18n';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'compact';
  showLabel?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  showLabel = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguage = getCurrentLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          // Focus next option
          break;
        case 'ArrowUp':
          event.preventDefault();
          // Focus previous option
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          // Select focused option
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    try {
      await changeLanguage(language);
      
      // Show success message briefly
      const successMessage = t('messages.success.updated');
      
      // Create and show a temporary toast notification
      const toast = document.createElement('div');
      toast.className = 'language-change-toast';
      toast.textContent = successMessage;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 12px 16px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        font-size: 14px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      `;
      
      document.body.appendChild(toast);
      
      // Animate in
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });
      
      // Remove after 2 seconds
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to change language:', error);
      
      // Show error message
      const errorMessage = t('messages.errors.general');
      alert(errorMessage); // Simple fallback, could be replaced with proper toast
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`language-selector-compact ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="language-selector-button compact"
          aria-label={t('accessibility.toggleLanguage')}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={isLoading}
        >
          <Globe size={16} />
          <span className="current-language">{currentLanguage.toUpperCase()}</span>
          {isLoading ? (
            <div className="loading-spinner" />
          ) : (
            <ChevronDown size={14} className={isOpen ? 'rotated' : ''} />
          )}
        </button>

        {isOpen && (
          <div className="language-dropdown" role="listbox">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`language-option ${lang === currentLanguage ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang)}
                role="option"
                aria-selected={lang === currentLanguage}
              >
                <span className="language-code">{lang.toUpperCase()}</span>
                <span className="language-name">{LANGUAGE_NAMES[lang]}</span>
                {lang === currentLanguage && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`language-selector ${className}`} ref={dropdownRef}>
      {showLabel && (
        <label htmlFor="language-select" className="language-label">
          {t('ui.labels.language')}:
        </label>
      )}
      
      <div className="language-selector-wrapper">
        <button
          type="button"
          id="language-select"
          onClick={() => setIsOpen(!isOpen)}
          className="language-selector-button"
          aria-label={t('ui.labels.selectLanguage')}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={isLoading}
        >
          <Globe size={18} />
          <span className="current-language-text">
            {LANGUAGE_NAMES[currentLanguage]}
          </span>
          {isLoading ? (
            <div className="loading-spinner" />
          ) : (
            <ChevronDown size={16} className={isOpen ? 'rotated' : ''} />
          )}
        </button>

        {isOpen && (
          <div className="language-dropdown" role="listbox">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`language-option ${lang === currentLanguage ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang)}
                role="option"
                aria-selected={lang === currentLanguage}
              >
                <span className="language-name">{LANGUAGE_NAMES[lang]}</span>
                <span className="language-code">({lang.toUpperCase()})</span>
                {lang === currentLanguage && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
