import React from 'react';
import { useTranslation } from 'react-i18next';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`loading-spinner-container ${size} ${className}`}>
      <div className="loading-spinner" aria-hidden="true" />
      {message && (
        <p className="loading-message" aria-live="polite">
          {message}
        </p>
      )}
      <span className="sr-only">
        {t('accessibility.loadingContent')}
      </span>
    </div>
  );
};

export default LoadingSpinner;
