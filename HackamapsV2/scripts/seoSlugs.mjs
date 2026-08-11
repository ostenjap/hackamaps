// Shared Node helper: pull the distinct city & tag slugs from Supabase.
// Used by both the build (to generate prerender routes) and the sitemap script.
// Mirrors src/lib/slug.ts#toSlug — keep the two in sync.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
    process.env.VITE_SUPABASE_URL || 'https://neueevrpztrqfrbvhoib.supabase.co';
const SUPABASE_ANON_KEY =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_BttD7SaaOtlgnmYJ4Bl5HA_H03lOGze';

export function toSlug(value) {
    return String(value)
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export const seoRoutes = {
    city: slug => `/hackathons-in-${slug}`,
    tag: slug => `/hackathons/tag/${slug}`,
};

/**
 * Returns { citySlugs: string[], tagSlugs: string[] }.
 * Never throws — on any failure it returns empty arrays so the build can fall
 * back to its static seed rather than breaking.
 */
export async function getSeoSlugs() {
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase
            .from('hackathons')
            .select('city, categories, is_online');
        if (error) throw error;

        // Count events per slug so callers can prioritise the highest-value
        // pages (e.g. cap prerendering) while the sitemap still lists them all.
        const cities = new Map();
        const tags = new Map();
        for (const row of data ?? []) {
            if (!row.is_online && row.city) {
                const s = toSlug(row.city);
                if (s) cities.set(s, (cities.get(s) ?? 0) + 1);
            }
            for (const cat of row.categories ?? []) {
                const s = toSlug(cat);
                if (s && s !== 'hackathon') tags.set(s, (tags.get(s) ?? 0) + 1);
            }
        }
        const byCountDesc = m => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
        return { citySlugs: byCountDesc(cities), tagSlugs: byCountDesc(tags) };
    } catch (err) {
        console.warn('[seoSlugs] Supabase query failed, using empty set:', err.message);
        return { citySlugs: [], tagSlugs: [] };
    }
}
