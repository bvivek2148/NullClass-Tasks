import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isAuthenticated = false,
  user,
  onLogout,
  showFooter = true
}) => {
  const { t } = useTranslation();

  return (
    <div className="layout">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-content"
        aria-label={t('accessibility.skipToContent')}
      >
        {t('accessibility.skipToContent')}
      </a>

      <Header 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
      />

      <main 
        id="main-content" 
        className="main-content"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
