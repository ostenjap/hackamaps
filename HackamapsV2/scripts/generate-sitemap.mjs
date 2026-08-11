// Generates public/sitemap.xml from live Supabase data.
// Run standalone (`npm run sitemap`) or as part of the build.
//
// Output is written to public/ so Vite copies it to the dist root and it is
// served at https://hackamaps.com/sitemap.xml.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSeoSlugs, seoRoutes } from './seoSlugs.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://hackamaps.com';
const OUT = resolve(__dirname, '../public/sitemap.xml');

// Static, high-value routes that always exist.
const STATIC_ROUTES = ['/', '/discover', '/map', '/face_map', '/organizers', '/privacy', '/impressum'];

function urlEntry(path, priority) {
    const loc = `${SITE}${path}`
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
    const { citySlugs, tagSlugs } = await getSeoSlugs();

    const entries = [
        ...STATIC_ROUTES.map(p => urlEntry(p, p === '/' ? '1.0' : '0.7')),
        ...citySlugs.map(s => urlEntry(seoRoutes.city(s), '0.8')),
        ...tagSlugs.map(s => urlEntry(seoRoutes.tag(s), '0.6')),
    ];

    const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        entries.join('\n') +
        '\n</urlset>\n';

    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, xml, 'utf8');
    console.log(
        `[sitemap] wrote ${entries.length} URLs ` +
            `(${citySlugs.length} cities, ${tagSlugs.length} tags) -> ${OUT}`,
    );
}

main();
