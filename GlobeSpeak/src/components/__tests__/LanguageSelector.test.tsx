import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageSelector } from '../LanguageSelector';

// Mock the i18n module
vi.mock('../../i18n', () => ({
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de'],
  LANGUAGE_NAMES: {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  },
  changeLanguage: vi.fn(),
  getCurrentLanguage: vi.fn(() => 'en')
}));

describe('LanguageSelector', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dropdown variant', () => {
    it('renders with default props', () => {
      render(<LanguageSelector />);
      
      expect(screen.getByText('ui.labels.language')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('renders without label when showLabel is false', () => {
      render(<LanguageSelector showLabel={false} />);
      
      expect(screen.queryByText('ui.labels.language')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', async () => {
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText('Español')).toBeInTheDocument();
      expect(screen.getByText('Français')).toBeInTheDocument();
      expect(screen.getByText('Deutsch')).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', async () => {
      render(
        <div>
          <LanguageSelector />
          <div data-testid="outside">Outside</div>
        </div>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      await user.click(screen.getByTestId('outside'));
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('handles keyboard navigation', async () => {
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Test Escape key
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('calls changeLanguage when selecting a different language', async () => {
      const { changeLanguage } = await import('../../i18n');
      
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const spanishOption = screen.getByText('Español');
      await user.click(spanishOption);
      
      expect(changeLanguage).toHaveBeenCalledWith('es');
    });

    it('does not call changeLanguage when selecting current language', async () => {
      const { changeLanguage } = await import('../../i18n');
      
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const englishOption = screen.getByText('English');
      await user.click(englishOption);
      
      expect(changeLanguage).not.toHaveBeenCalled();
    });

    it('shows loading state during language change', async () => {
      const { changeLanguage } = await import('../../i18n');
      changeLanguage.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const spanishOption = screen.getByText('Español');
      await user.click(spanishOption);
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument(); // Loading spinner
      expect(button).toBeDisabled();
      
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Compact variant', () => {
    it('renders compact variant correctly', () => {
      render(<LanguageSelector variant="compact" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('compact');
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('shows language codes in compact dropdown', async () => {
      render(<LanguageSelector variant="compact" />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByText('ES')).toBeInTheDocument();
      expect(screen.getByText('FR')).toBeInTheDocument();
      expect(screen.getByText('DE')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
      expect(button).toHaveAttribute('aria-label', 'ui.labels.selectLanguage');
    });

    it('updates ARIA attributes when dropdown is open', async () => {
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('has proper role attributes for options', async () => {
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(4);
      
      options.forEach(option => {
        expect(option).toHaveAttribute('aria-selected');
      });
    });

    it('marks current language as selected', async () => {
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const englishOption = screen.getByRole('option', { name: /English/ });
      expect(englishOption).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Error handling', () => {
    it('handles language change errors gracefully', async () => {
      const { changeLanguage } = await import('../../i18n');
      changeLanguage.mockRejectedValue(new Error('Network error'));
      
      // Mock alert to avoid actual alert in tests
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<LanguageSelector />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const spanishOption = screen.getByText('Español');
      await user.click(spanishOption);
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('messages.errors.general');
      });
      
      alertSpy.mockRestore();
    });
  });

  describe('Custom styling', () => {
    it('applies custom className', () => {
      render(<LanguageSelector className="custom-class" />);
      
      const container = screen.getByRole('button').closest('.language-selector');
      expect(container).toHaveClass('custom-class');
    });
  });
});
