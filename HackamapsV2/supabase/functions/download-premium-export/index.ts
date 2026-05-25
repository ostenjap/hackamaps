import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reuse UI filter logic on backend for 100% parity
function determineType(categories: string[] | null): string {
    if (!categories || categories.length === 0) return 'generic';
    const lowerCats = categories.map(c => c.toLowerCase());

    if (lowerCats.some(c => c.includes('web3') || c.includes('blockchain') || c.includes('crypto'))) return 'web3';
    if (lowerCats.some(c => c.includes('ai') || c.includes('ml') || c.includes('llm'))) return 'ai';
    if (lowerCats.some(c => c.includes('defense') || c.includes('military') || c.includes('security'))) return 'defense';
    if (lowerCats.some(c => c.includes('fintech') || c.includes('finance') || c.includes('banking'))) return 'fintech';
    if (lowerCats.some(c => c.includes('social') || c.includes('community'))) return 'social';
    if (lowerCats.some(c => c.includes('cloud') || c.includes('devops'))) return 'cloud';

    return 'generic';
}

function determineContinent(country?: string, city?: string): string {
    if (!country) return 'Unknown';
    const c = country.toLowerCase();

    if (['united states', 'usa', 'canada', 'mexico'].some(x => c.includes(x))) return 'North America';
    if (['united kingdom', 'uk', 'germany', 'france', 'spain', 'italy', 'poland', 'netherlands', 'sweden', 'switzerland'].some(x => c.includes(x))) return 'Europe';
    if (['china', 'japan', 'india', 'singapore', 'korea', 'thailand', 'vietnam', 'uae', 'dubai'].some(x => c.includes(x))) return 'Asia';
    if (['brazil', 'argentina', 'colombia', 'peru', 'chile'].some(x => c.includes(x))) return 'South America';
    if (['australia', 'new zealand'].some(x => c.includes(x))) return 'Oceania';
    if (['nigeria', 'kenya', 'south africa', 'egypt', 'ghana'].some(x => c.includes(x))) return 'Africa';

    return 'Other';
}

function escapeCsvValue(val: any): string {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function generateCsvString(events: any[]): string {
    const headers = [
        'Name',
        'Start Date',
        'End Date',
        'Location',
        'Country',
        'City',
        'Is Online',
        'Prize Pool',
        'Categories',
        'Website URL',
        'Description',
        'Discord Link (Enriched)',
        'Past Winners Repo (Enriched)',
        'Contact Email (Enriched)',
        'Historical Prize USD (Enriched)'
    ];

    const rows = events.map(e => [
        e.name || 'Untitled Event',
        e.start_date || '',
        e.end_date || '',
        e.location || '',
        e.country || '',
        e.city || '',
        e.is_online ? 'Yes' : 'No',
        e.prize_pool || 'N/A',
        (e.categories || []).join('; '),
        e.website_url || '',
        e.description || '',
        e.discord_url || 'N/A',
        e.past_winners_repo || 'N/A',
        e.contact_email || 'N/A',
        e.historical_prize_usd ? `$${e.historical_prize_usd.toLocaleString()}` : 'N/A'
    ]);

    // Upsell message embedded in the first row of CSV as a comment
    const commentHeader = '# HACKAMAPS PREPARED DATA EXPORT. Upgrade to Pro/Elite for real-time Discord notifications and automated scraping alerts at https://hackamaps.com\n';

    const csvContent = [
        headers.map(escapeCsvValue).join(','),
        ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    return commentHeader + csvContent;
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Authorization header is required' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        });
    }

    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
    );

    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    try {
        // 1. Get authenticated user
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) {
            throw new Error('Invalid authentication token');
        }

        // 2. Validate tier in profiles
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('is_premium, tier')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            throw new Error('User profile not found');
        }

        const isAuthorized = profile.is_premium || ['pro', 'elite', 'premium', 'lifetime'].includes(profile.tier?.toLowerCase() || '');
        if (!isAuthorized) {
            return new Response(JSON.stringify({ error: 'Upgrade required. Secure direct exports are restricted to Premium/Elite members.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403,
            });
        }

        // 3. Receive filters
        const body = await req.json();
        const filters = body.filters || {};

        // 4. Fetch all hackathons from database
        const { data: hackathons, error: fetchError } = await supabaseAdmin
            .from('hackathons')
            .select('*');

        if (fetchError || !hackathons) {
            throw new Error('Failed to retrieve hackathons from database');
        }

        // 5. Apply filters identical to the frontend UI
        const filtered = hackathons.filter(event => {
            // A. Categories
            if (filters.selectedCategories && filters.selectedCategories.length > 0) {
                const eventType = determineType(event.categories);
                if (!filters.selectedCategories.includes(eventType)) return false;
            }

            // B. Continents
            if (filters.selectedContinents && filters.selectedContinents.length > 0) {
                const eventContinent = determineContinent(event.country, event.city);
                if (!filters.selectedContinents.includes(eventContinent)) return false;
            }

            // C. Location Search
            if (filters.locationSearch) {
                const search = filters.locationSearch.toLowerCase();
                const matches =
                    (event.name || '').toLowerCase().includes(search) ||
                    (event.location || '').toLowerCase().includes(search) ||
                    (event.country || '').toLowerCase().includes(search) ||
                    (event.city || '').toLowerCase().includes(search);

                if (!matches) return false;
            }

            // D. Start Date Threshold
            if (filters.selectedWeeksAhead && filters.selectedWeeksAhead > 0) {
                const thresholdDate = new Date();
                thresholdDate.setDate(thresholdDate.getDate() + (filters.selectedWeeksAhead * 7));
                const eventStartDate = new Date(event.start_date);

                if (eventStartDate < thresholdDate) return false;
            }

            return true;
        });

        // 6. Generate enriched CSV
        const csvString = generateCsvString(filtered);

        // 7. Return directly as streamable attachment
        return new Response(csvString, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="hackamap_premium_export.csv"',
            },
            status: 200,
        });

    } catch (error) {
        console.error('Premium Download Error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
