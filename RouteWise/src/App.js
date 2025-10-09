import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home.js';
import RoutePlanner from './pages/RoutePlanner.js';
import MyTrips from './pages/MyTrips.js';
import Analytics from './pages/Analytics.js';
import SharedRoutes from './pages/SharedRoutes.js';
import Profile from './pages/Profile.js';
import StandaloneProfile from './pages/StandaloneProfile.js';

// Utility function for creating page URLs
export const createPageUrl = (pageName) => {
  const routes = {
    Home: '/',
    RoutePlanner: '/planner',
    MyTrips: '/trips',
    Analytics: '/analytics',
    SharedRoutes: '/shared',
    Profile: '/profile'
  };
  return routes[pageName] || '/';
};

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Layout currentPageName="Home">
          <Home />
        </Layout>
      } />
      <Route path="/planner" element={
        <Layout currentPageName="Route Planner">
          <RoutePlanner />
        </Layout>
      } />
      <Route path="/trips" element={
        <Layout currentPageName="My Trips">
          <MyTrips />
        </Layout>
      } />
      <Route path="/analytics" element={
        <Layout currentPageName="Analytics">
          <Analytics />
        </Layout>
      } />
      <Route path="/shared" element={
        <Layout currentPageName="Shared Routes">
          <SharedRoutes />
        </Layout>
      } />
      <Route path="/profile" element={<StandaloneProfile />} />
    </Routes>
  );
}

export default App;