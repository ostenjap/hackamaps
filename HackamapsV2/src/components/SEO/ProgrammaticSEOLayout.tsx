import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Trophy, Users, CalendarDays } from 'lucide-react';
import type { HackathonEvent } from '../../types';
import { useEvents } from '../../hooks/useEvents';
import { getCityStats, getTagStats, type SEOStats } from '../../lib/seoData';
import { formatMoney } from '../../lib/currency';
import { toSlug, deslugify, seoRoutes } from '../../lib/slug';
import { SEOMap } from './SEOMap';
import { SEOFooterLinks } from './SEOFooterLinks';

const SITE = 'https://hackamaps.com';

type Mode = 'city' | 'tag';

/**
 * Reusable template for programmatic-SEO pages (cities, tags).
 *
 * Responsibilities (per pSEO spec):
 *  - capture the route param (slug) and fetch aggregated Supabase stats,
 *  - handle loading / empty / 404 gracefully,
 *  - render a readable HTML summary *before* the interactive map so Googlebot
 *    gets textual context it can index without executing map interactions,
 *  - inject dynamic <title>/description/OpenGraph + a self-referencing canonical.
 */
export function ProgrammaticSEOLayout({ mode, slug }: { mode: Mode; slug: string }) {
    const { data: allEvents, isLoading: eventsLoading } = useEvents();
    // undefined = still loading; null = not found; object = resolved.
    const [stats, setStats] = useState<SEOStats | null | undefined>(undefined);

    useEffect(() => {
        let active = true;
        setStats(undefined);
        const load = mode === 'city' ? getCityStats(slug) : getTagStats(slug);
        load.then(s => active && setStats(s)).catch(() => active && setStats(null));
        return () => {
            active = false;
        };
    }, [mode, slug]);

    const events = useMemo<HackathonEvent[]>(() => {
        if (!allEvents) return [];
        if (mode === 'tag') {
            return allEvents.filter(ev => (ev.tags ?? []).some(t => toSlug(t) === slug));
        }
        return allEvents.filter(ev => {
            const cityPart = (ev.location || '').split(',')[0].trim();
            return cityPart && toSlug(cityPart) === slug;
        });
    }, [allEvents, mode, slug]);

    const path = mode === 'city' ? seoRoutes.city(slug) : seoRoutes.tag(slug);
    const canonical = `${SITE}${path}`;

    // --- Definitive 404 (fetch resolved with no such city/tag) ---
    // Only when stats === null. While stats is still undefined (e.g. during
    // prerender before the async fetch resolves) we render the normal page with
    // slug-derived meta, so Googlebot always gets a valid title/description.
    if (stats === null) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 text-center">
                <Helmet>
                    <title>Not found | Hackamaps</title>
                    <meta name="robots" content="noindex, follow" />
                    <link rel="canonical" href={canonical} />
                </Helmet>
                <MapPin className="w-10 h-10 text-neutral-600 mb-4" />
                <h1 className="text-2xl font-bold mb-2">No hackathons here yet</h1>
                <p className="text-neutral-400 max-w-md mb-6">
                    We don't have any {mode === 'tag' ? `${slug} ` : ''}hackathons listed for
                    {mode === 'city' ? ` "${slug}"` : ' this tag'} right now. Explore the live
                    map to find events worldwide.
                </p>
                <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to the map
                </a>
            </div>
        );
    }

    // --- Render. Meta/heading are synchronous (slug-derived) so they survive
    // prerendering; live figures fill in once `stats` resolves on the client. ---
    const displayName = pretty(stats?.name ?? deslugify(slug));
    const activeCount = stats ? stats.upcomingCount || stats.totalCount : 0;
    const prizeStr = stats ? formatMoney(stats.totalPrize) : null;
    const cityCount = stats?.cityCount ?? 0;
    const builderCount = stats?.builderCount ?? 0;
    const center = stats?.center ?? null;
    const year = new Date().getFullYear();

    const title =
        mode === 'tag'
            ? `Top ${displayName} Hackathons (${year}) | Hackamaps`
            : `Upcoming Hackathons in ${displayName} (${year}) | Hackamaps`;

    const description = stats
        ? mode === 'tag'
            ? `Find and join ${activeCount} active ${displayName} hackathons across ${cityCount} ${
                  cityCount === 1 ? 'city' : 'cities'
              }.${prizeStr ? ` Browse prize pools totaling ${prizeStr}.` : ''} Explore the live map on Hackamaps.`
            : `Find and join ${activeCount} active hackathons in ${displayName}.${
                  prizeStr ? ` Discover prize pools totaling ${prizeStr}` : ''
              }${builderCount ? `${prizeStr ? ',' : ''} and connect with ${builderCount} local builders` : ''}. Browse the live map on Hackamaps.`
        : mode === 'tag'
        ? `Find and join ${displayName} hackathons worldwide. Browse the live interactive map of upcoming events, dates and prize pools on Hackamaps.`
        : `Find and join upcoming hackathons in ${displayName}. Browse the live interactive map, dates, prize pools and registration links on Hackamaps.`;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 flex flex-col">
            <Helmet>
                {/* robots + og:type come from index.html defaults — don't repeat
                    them here or the prerendered head ends up with duplicates. */}
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonical} />
            </Helmet>

            {/* Crawlable HTML summary — rendered before the map for Googlebot context. */}
            <header className="max-w-5xl w-full mx-auto px-6 pt-12 pb-6">
                <a href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Hackamaps
                </a>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                    {mode === 'tag' ? `${displayName} Hackathons` : `Hackathons in ${displayName}`}{' '}
                    <span className="text-blue-500">{year}</span>
                </h1>
                <p className="text-neutral-300 leading-relaxed max-w-3xl">{description}</p>

                {stats && (
                    <dl className="flex flex-wrap gap-3 mt-6">
                        <Stat icon={<CalendarDays className="w-4 h-4" />} label="Active events" value={String(activeCount)} />
                        {prizeStr && <Stat icon={<Trophy className="w-4 h-4" />} label="Total prize pool" value={prizeStr} />}
                        {mode === 'tag' && cityCount > 0 && (
                            <Stat icon={<MapPin className="w-4 h-4" />} label="Cities" value={String(cityCount)} />
                        )}
                        {mode === 'city' && builderCount > 0 && (
                            <Stat icon={<Users className="w-4 h-4" />} label="Builders nearby" value={String(builderCount)} />
                        )}
                    </dl>
                )}
            </header>

            {/* Crawlable list of events (real anchors — Googlebot cannot click map pins). */}
            <section className="max-w-5xl w-full mx-auto px-6 pb-6">
                <h2 className="text-lg font-bold mb-3">
                    {mode === 'tag' ? `${displayName} hackathons` : `Hackathons in ${displayName}`}
                    {events.length > 0 ? ` (${events.length})` : ''}
                </h2>
                {events.length === 0 && eventsLoading && (
                    <p className="text-sm text-neutral-500">Loading events…</p>
                )}
                <ul className="grid sm:grid-cols-2 gap-2">
                    {events.map(ev => (
                        <li key={ev.id} className="border border-white/10 rounded-xl px-4 py-3 bg-white/[0.02]">
                            <a
                                href={ev.website || path}
                                target={ev.website ? '_blank' : undefined}
                                rel={ev.website ? 'noopener noreferrer' : undefined}
                                className="font-semibold text-white hover:text-blue-400 transition-colors"
                            >
                                {ev.title}
                            </a>
                            <div className="text-xs text-neutral-400 mt-1">
                                {ev.date} · {ev.location}
                                {ev.prize && ev.prize !== 'N/A' ? ` · ${ev.prize}` : ''}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Interactive map. */}
            <section className="max-w-5xl w-full mx-auto px-6 pb-12">
                <div className="h-[460px]">
                    <SEOMap events={events} center={center} zoom={mode === 'city' ? 9 : 4} label={`${events.length} hackathons`} />
                </div>
            </section>

            <SEOFooterLinks />
        </div>
    );
}

/** Capitalise the first letter for display (DB tags are lowercase, e.g. "ai"). */
function pretty(value: string): string {
    return value ? value[0].toUpperCase() + value.slice(1) : value;
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2 border border-white/10 bg-white/[0.03] rounded-xl px-4 py-2">
            <span className="text-blue-400">{icon}</span>
            <div>
                <div className="text-sm font-bold leading-none">{value}</div>
                <div className="text-[10px] uppercase tracking-wide text-neutral-500 mt-0.5">{label}</div>
            </div>
        </div>
    );
}
