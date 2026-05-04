import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { htmlPrerender } from 'vite-plugin-html-prerender';
import path from 'path';
import { SEO_CITIES } from './src/config/cities';

// Generate routes for all cities in the config
const cityRoutes = Object.keys(SEO_CITIES).map(slug => `/hackathons-in-${slug}`);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    htmlPrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/', ...cityRoutes],
    }),
  ],
});
