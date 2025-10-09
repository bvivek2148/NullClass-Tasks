import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Add the new EventDetails import
const EventDetails = React.lazy(() => import('./pages/EventDetails'));

// Import i18n configuration
import './i18n';

// Import global styles
import './styles/global.css';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

function App() {
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate authentication check on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate API call to check authentication
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Mock user data - in real app, fetch from API
          setUser({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: '/avatars/john.jpg'
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update document title when language changes
  useEffect(() => {
    const updateTitle = () => {
      const titleKey = 'pages.titles.home';
      if (i18n.exists(titleKey)) {
        document.title = t(titleKey);
      }
    };

    updateTitle();
    i18n.on('languageChanged', updateTitle);

    return () => {
      i18n.off('languageChanged', updateTitle);
    };
  }, [t, i18n]);

  // Update meta description when language changes
  useEffect(() => {
    const updateMetaDescription = () => {
      const descriptionKey = 'pages.descriptions.home';
      if (i18n.exists(descriptionKey)) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', t(descriptionKey));
        }
      }
    };

    updateMetaDescription();
    i18n.on('languageChanged', updateMetaDescription);

    return () => {
      i18n.off('languageChanged', updateMetaDescription);
    };
  }, [t, i18n]);

  const handleLogin = async (email: string, password: string) => {
    try {
      // Simulate login API call
      console.log('Logging in:', email, password);
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: '/avatars/john.jpg'
      };
      
      localStorage.setItem('auth-token', 'mock-token');
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: t('messages.errors.loginFailed') };
    }
  };

  const handleRegister = async (userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
  }) => {
    try {
      // Simulate registration API call
      console.log('Registering:', userData);
      
      // Mock successful registration
      const mockUser: User = {
        id: '1',
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        avatar: '/avatars/default.jpg'
      };
      
      localStorage.setItem('auth-token', 'mock-token');
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: t('messages.errors.general') };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Protected route component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <p>{t('ui.labels.loading')}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout 
          isAuthenticated={isAuthenticated}
          user={user ?? undefined}
          onLogout={handleLogout}
        >
          <Suspense fallback={<LoadingSpinner size="large" />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Authentication routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Login onLogin={handleLogin} />
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Register onRegister={handleRegister} />
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Add the new route for event details */}
              <Route 
                path="/event/:eventId" 
                element={
                  <ProtectedRoute>
                    <EventDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
