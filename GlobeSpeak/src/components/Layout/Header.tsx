import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';
import ThemeToggle from '../ThemeToggle';
import './Header.css';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  user,
  onLogout
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { key: 'home', path: '/', label: t('ui.navigation.home') },
    { key: 'dashboard', path: '/dashboard', label: t('ui.navigation.dashboard'), requiresAuth: true },
    { key: 'about', path: '/about', label: t('ui.navigation.about') },
    { key: 'contact', path: '/contact', label: t('ui.navigation.contact') }
  ];

  const filteredNavItems = navigationItems.filter(item =>
    !item.requiresAuth || isAuthenticated
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    onLogout?.();
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand">
          <Link
            to="/"
            className="brand-link"
            aria-label={t('pages.headings.welcome')}
          >
            {/* Custom minimal logomark (SVG) */}
            <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" className="brand-icon">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4f46e5"/>
                  <stop offset="60%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#0ea5e9"/>
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="none" stroke="url(#g)" strokeWidth="2" />
              <path d="M4 12h16M12 4v16M6 8c2 2 10 2 12 0M6 16c2-2 10-2 12 0" fill="none" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <span className="brand-text">GlobeSpeak</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" role="navigation" aria-label={t('accessibility.openMenu')}>
          <ul className="nav-list">
            {filteredNavItems.map((item) => (
              <li key={item.key} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <LanguageSelector variant="compact" showLabel={false} />

          {/* Authentication Section */}
          {isAuthenticated && user ? (
            <div className="user-menu-container">
              <button
                type="button"
                className="user-menu-trigger"
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                aria-label={t('ui.navigation.profile')}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    <User size={20} />
                  </div>
                )}
                <span className="user-name">{user.name}</span>
              </button>

              {isUserMenuOpen && (
                <div className="user-menu" role="menu">
                  <Link
                    to="/profile"
                    className="user-menu-item"
                    role="menuitem"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User size={16} />
                    {t('ui.navigation.profile')}
                  </Link>
                  <Link
                    to="/settings"
                    className="user-menu-item"
                    role="menuitem"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings size={16} />
                    {t('ui.navigation.settings')}
                  </Link>
                  <hr className="user-menu-divider" />
                  <button
                    type="button"
                    className="user-menu-item logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    {t('ui.navigation.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button login">
                {t('ui.navigation.login')}
              </Link>
              <Link to="/register" className="auth-button register">
                {t('ui.navigation.register')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t('accessibility.closeMenu') : t('accessibility.openMenu')}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
          <ul className="mobile-nav-list">
            {filteredNavItems.map((item) => (
              <li key={item.key} className="mobile-nav-item">
                <Link
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {!isAuthenticated && (
              <>
                <li className="mobile-nav-item">
                  <Link
                    to="/login"
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('ui.navigation.login')}
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    to="/register"
                    className="mobile-nav-link register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('ui.navigation.register')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
