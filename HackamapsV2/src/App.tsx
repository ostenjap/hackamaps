import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';
// import { Analytics } from '@vercel/analytics/react';
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
        {/* <Analytics /> */}
      </HelmetProvider>
    );
  }

  // Handle auth callback
  if (pathname === '/auth/callback') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <h2 className="text-2xl font-bold">Completing login...</h2>
          <p className="text-neutral-400">Please wait while we verify your session.</p>
        </div>
        <script>
          {`
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          `}
        </script>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <AuthProvider>
        <AppContent />
        {/* <Analytics /> */}
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
