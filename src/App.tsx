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

import { Heart, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, toast, dismissToast } = useApp();

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
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <Navbar />
      <div className="flex-1">
        {renderCurrentView()}
      </div>
      <Footer />

      {/* Real-time Toast feedback for favorites & actions */}
      {toast && (
        <aside 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="status"
          aria-live="polite"
        >
          <div className="w-7 h-7 rounded-xl bg-slate-800 text-rose-400 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <p className="text-xs font-medium flex-1 text-slate-100">
            {toast.message}
          </p>
          <button 
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
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
