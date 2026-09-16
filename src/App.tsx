/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/home/HomePage';
import { PropertyBrowsePage } from './components/browse/PropertyBrowsePage';
import { PropertyDetailsPage } from './components/details/PropertyDetailsPage';
import { AuthPage } from './components/auth/AuthPage';
import { TenantDashboard } from './components/dashboard/TenantDashboard';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  // Scroll to top whenever the page route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'browse':
        return <PropertyBrowsePage />;
      case 'property-details':
        return <PropertyDetailsPage />;
      case 'auth':
        return <AuthPage />;
      case 'tenant-dashboard':
        return <TenantDashboard />;
      case 'owner-dashboard':
        return <OwnerDashboard />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      <Navbar />
      <div className="flex-1">
        {renderCurrentView()}
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
