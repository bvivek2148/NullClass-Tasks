import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-visual">
            <div className="error-code">404</div>
            <div className="error-illustration">
              <Search size={120} />
            </div>
          </div>
          
          <div className="not-found-text">
            <h1 className="not-found-title">Page Not Found</h1>
            <p className="not-found-description">
              Sorry, we couldn't find the page you're looking for. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-lg">
              <Home size={18} />
              {t('ui.navigation.home')}
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline btn-lg"
            >
              <ArrowLeft size={18} />
              {t('ui.buttons.back')}
            </button>
          </div>

          <div className="not-found-help">
            <p>Need help? <Link to="/contact" className="help-link">{t('ui.navigation.contact')}</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
