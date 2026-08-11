import { useEffect, useState } from 'react';
import { getTopCities, getTopTags, type SEOLink } from '../../lib/seoData';
import { seoRoutes } from '../../lib/slug';

/**
 * Crawlable internal-link index for Googlebot.
 *
 * Map pins are not crawlable, so this renders real <a href> anchors to every
 * top city/tag pSEO page. It is collapsed by default to stay out of the way
 * visually, but the links remain in the DOM (not display:none-gated behind a
 * fetch failure) so crawlers always see them. Data is fully DB-driven.
 */
export function SEOFooterLinks() {
    const [cities, setCities] = useState<SEOLink[]>([]);
    const [tags, setTags] = useState<SEOLink[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.all([getTopCities(30), getTopTags(20)])
            .then(([c, t]) => {
                if (!active) return;
                setCities(c);
                setTags(t);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    if (cities.length === 0 && tags.length === 0) return null;

    return (
        <nav aria-label="Browse hackathons by city and tag" className="w-full border-t border-white/5 bg-black/40">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <button
                    onClick={() => setOpen(o => !o)}
                    aria-expanded={open}
                    className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
                >
                    Browse hackathons by city &amp; tag
                    <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <div className={open ? 'mt-5 grid md:grid-cols-2 gap-8' : 'sr-only'}>
                    <div>
                        <h2 className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Hackathons by city</h2>
                        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {cities.map(c => (
                                <li key={c.slug}>
                                    <a href={seoRoutes.city(c.slug)} className="text-sm text-neutral-400 hover:text-blue-400 transition-colors">
                                        Hackathons in {c.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Hackathons by tag</h2>
                        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {tags.map(t => (
                                <li key={t.slug}>
                                    <a href={seoRoutes.tag(t.slug)} className="text-sm text-neutral-400 hover:text-blue-400 transition-colors capitalize">
                                        {t.name} hackathons
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
