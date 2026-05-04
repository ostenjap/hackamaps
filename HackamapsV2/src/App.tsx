import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';

import { HackathonsInBerlin } from './components/SEO/HackathonsInBerlin';

export default function App() {
  const isBerlinPage = typeof window !== 'undefined' && window.location.pathname === '/hackathons-in-berlin';

  if (isBerlinPage) {
    return (
      <HelmetProvider>
        <HackathonsInBerlin />
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
