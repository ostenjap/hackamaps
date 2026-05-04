import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';

import { CityLandingPage } from './components/SEO/CityLandingPage';
import { SEO_CITIES } from './config/cities';

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Match /hackathons-in-:city (e.g., /hackathons-in-berlin)
  const cityMatch = pathname.match(/^\/hackathons-in-([a-z-]+)$/);
  const cityKey = cityMatch ? cityMatch[1] : null;
  const cityConfig = cityKey ? SEO_CITIES[cityKey] : null;

  if (cityConfig) {
    return (
      <HelmetProvider>
        <CityLandingPage cityKey={cityKey!} />
        <Analytics />
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <AuthProvider>
        <AppContent />
        <Analytics />
      </AuthProvider>
    </HelmetProvider>
  );
}

// Global styles for custom scrollbar (moved to index.css would be better, but keeping for now)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .scrollbar-none::-webkit-scrollbar { display: none; }
    .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}
