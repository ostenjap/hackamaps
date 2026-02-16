import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Analytics />
    </AuthProvider>
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
