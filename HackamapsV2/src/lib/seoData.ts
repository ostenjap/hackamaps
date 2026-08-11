/**
 * Programmatic-SEO data layer.
 *
 * Every city/tag figure on a pSEO page flows from Supabase through here — there
 * is no hardcoded list of cities or tags. The `hackathons` table is small
 * enough (hundreds of rows) that we fetch the relevant columns once and
 * aggregate in memory, which keeps slug-matching logic in JS where it is
 * testable and avoids brittle SQL on a free-text schema.
 */

import { supabase } from './supabaseClient';
import { toSlug } from './slug';
import { sumPrizes } from './currency';

/** Minimal row shape we read for aggregation. */
interface HackathonRow {
    city: string | null;
    country: string | null;
    categories: string[] | null;
    prize_pool: string | null;
    start_date: string | null;
    is_online: boolean | null;
    latitude: number | null;
    longitude: number | null;
}

export interface SEOStats {
    /** Canonical display name, e.g. "Berlin" or "AI". */
    name: string;
    slug: string;
    /** Events whose start_date is today or later. */
    upcomingCount: number;
    /** All matching events regardless of date. */
    totalCount: number;
    /** Summed, parsed prize pool in USD (0 when none parseable). */
    totalPrize: number;
    /** Distinct cities a tag spans (tag pages) — 0 for city pages. */
    cityCount: number;
    /** Builders pinned on the Face Map near this city — 0 for tag pages. */
    builderCount: number;
    /** Centroid of matching events, for centring the map. null if unknown. */
    center: [number, number] | null;
}

const SELECT_COLS =
    'city, country, categories, prize_pool, start_date, is_online, latitude, longitude';

function isUpcoming(startDate: string | null): boolean {
    if (!startDate) return false;
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return false;
    // Compare on date only — an event starting today still counts.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
}

function centroid(rows: HackathonRow[]): [number, number] | null {
    const pts = rows
        .map(r => [Number(r.latitude), Number(r.longitude)] as [number, number])
        .filter(([la, lo]) => !isNaN(la) && !isNaN(lo) && (la !== 0 || lo !== 0));
    if (pts.length === 0) return null;
    const [sumLat, sumLng] = pts.reduce(
        ([aLat, aLng], [la, lo]) => [aLat + la, aLng + lo],
        [0, 0],
    );
    return [sumLat / pts.length, sumLng / pts.length];
}

async function fetchRows(): Promise<HackathonRow[]> {
    const { data, error } = await supabase.from('hackathons').select(SELECT_COLS);
    if (error) {
        console.error('[seoData] failed to fetch hackathons:', error.message);
        return [];
    }
    return (data as HackathonRow[]) ?? [];
}

/**
 * Count Face Map builders within a rough bounding box around a centroid.
 * Face pins carry no city field, so proximity is the best available signal.
 */
async function countBuildersNear(center: [number, number] | null): Promise<number> {
    if (!center) return 0;
    const [lat, lng] = center;
    const d = 0.6; // ~60km box, generous enough for a metro area
    const { count, error } = await supabase
        .from('face_pins_public')
        .select('id', { count: 'exact', head: true })
        .gte('latitude', lat - d)
        .lte('latitude', lat + d)
        .gte('longitude', lng - d)
        .lte('longitude', lng + d);
    if (error) {
        console.error('[seoData] builder count failed:', error.message);
        return 0;
    }
    return count ?? 0;
}

/** Aggregated stats for a city page, or null if the city has no events. */
export async function getCityStats(citySlug: string): Promise<SEOStats | null> {
    const rows = (await fetchRows()).filter(
        r => !r.is_online && r.city && toSlug(r.city) === citySlug,
    );
    if (rows.length === 0) return null;

    const center = centroid(rows);
    return {
        name: rows[0].city as string,
        slug: citySlug,
        upcomingCount: rows.filter(r => isUpcoming(r.start_date)).length,
        totalCount: rows.length,
        totalPrize: sumPrizes(rows.map(r => r.prize_pool)),
        cityCount: 0,
        builderCount: await countBuildersNear(center),
        center,
    };
}

/** Aggregated stats for a tag page, or null if the tag has no events. */
export async function getTagStats(tagSlug: string): Promise<SEOStats | null> {
    const rows = (await fetchRows()).filter(r =>
        (r.categories ?? []).some(c => toSlug(c) === tagSlug),
    );
    if (rows.length === 0) return null;

    // Preserve the human-readable tag spelling from the data.
    const display =
        rows
            .flatMap(r => r.categories ?? [])
            .find(c => toSlug(c) === tagSlug) ?? tagSlug;
    const cities = new Set(
        rows.filter(r => r.city).map(r => toSlug(r.city as string)),
    );

    return {
        name: display,
        slug: tagSlug,
        upcomingCount: rows.filter(r => isUpcoming(r.start_date)).length,
        totalCount: rows.length,
        totalPrize: sumPrizes(rows.map(r => r.prize_pool)),
        cityCount: cities.size,
        builderCount: 0,
        center: centroid(rows),
    };
}

export interface SEOLink {
    name: string;
    slug: string;
    count: number;
}

/** Top cities by number of in-person events, for the crawlable link index. */
export async function getTopCities(limit = 30): Promise<SEOLink[]> {
    const rows = await fetchRows();
    const map = new Map<string, SEOLink>();
    for (const r of rows) {
        if (r.is_online || !r.city) continue;
        const slug = toSlug(r.city);
        if (!slug) continue;
        const entry = map.get(slug) ?? { name: r.city, slug, count: 0 };
        entry.count += 1;
        map.set(slug, entry);
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

/** Top tags by number of events, excluding the noise "hackathon" catch-all. */
export async function getTopTags(limit = 20): Promise<SEOLink[]> {
    const rows = await fetchRows();
    const map = new Map<string, SEOLink>();
    for (const r of rows) {
        for (const cat of r.categories ?? []) {
            const slug = toSlug(cat);
            if (!slug || slug === 'hackathon') continue;
            const entry = map.get(slug) ?? { name: cat, slug, count: 0 };
            entry.count += 1;
            map.set(slug, entry);
        }
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}
