import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { htmlPrerender } from 'vite-plugin-html-prerender';
import path from 'path';
import { SEO_CITIES } from './src/config/cities';
import { getSeoSlugs, seoRoutes } from './scripts/seoSlugs.mjs';

// https://vite.dev/config/
export default defineConfig(async () => {
  // Pull the live city/tag slugs from Supabase so prerendered routes track the
  // database with no hardcoded list. The curated SEO_CITIES act only as a seed
  // so the build never ships fewer routes than before if the query is empty.
  const { citySlugs, tagSlugs } = await getSeoSlugs();

  // Cap how many pages we statically prerender (headless render is expensive).
  // Every route is still discoverable via sitemap.xml + client-side rendering;
  // this just front-loads SSR HTML for the highest-traffic pages. Curated
  // SEO_CITIES are always prerendered.
  const PRERENDER_CITY_CAP = 80;
  const PRERENDER_TAG_CAP = 40;

  const cities = new Set([
    ...Object.keys(SEO_CITIES),
    ...citySlugs.slice(0, PRERENDER_CITY_CAP),
  ]);
  const cityRoutes = [...cities].map(seoRoutes.city);
  const tagRoutes = tagSlugs.slice(0, PRERENDER_TAG_CAP).map(seoRoutes.tag);

  console.log(`[prerender] ${cityRoutes.length} city + ${tagRoutes.length} tag routes`);

  return {
    plugins: [
      react(),
      htmlPrerender({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/', ...cityRoutes, ...tagRoutes],
      }),
    ],
  };
});
