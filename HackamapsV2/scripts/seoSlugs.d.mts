// Type declarations for the Node-side SEO slug helper (consumed by vite.config.ts).

export function toSlug(value: string): string;

export const seoRoutes: {
    city: (slug: string) => string;
    tag: (slug: string) => string;
};

export function getSeoSlugs(): Promise<{
    citySlugs: string[];
    tagSlugs: string[];
}>;
