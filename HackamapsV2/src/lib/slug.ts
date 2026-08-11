/**
 * URL slug helpers for programmatic SEO routes.
 *
 * The DB stores human-readable values ("New York", "AI"); URLs use lowercase,
 * hyphenated slugs ("new-york", "ai"). These keep the mapping in one place so
 * routing, link generation and the sitemap stay consistent.
 */

/** "New York" -> "new-york", "São Paulo" -> "sao-paulo". */
export function toSlug(value: string): string {
    return value
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '') // strip accents
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/** "new-york" -> "New York" (best-effort title case for display fallbacks). */
export function deslugify(slug: string): string {
    return slug
        .split('-')
        .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(' ');
}

/** Programmatic URL builders — single source of truth for path shapes. */
export const seoRoutes = {
    city: (slug: string) => `/hackathons-in-${slug}`,
    tag: (slug: string) => `/hackathons/tag/${slug}`,
};
