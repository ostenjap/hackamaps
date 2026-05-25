import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from 'npm:stripe@16.12.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2024-06-20',
    httpClient: Stripe.createFetchHttpClient(),
});

// Parity functions for filtering on backend
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

function generateCsvString(events: any[]): string {
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

    const commentHeader = '# HACKAMAPS ENRICHED DATA EXPORT. Upgrade to Pro/Elite for real-time Discord notifications and automated scraping alerts at https://hackamaps.com\n';

    const csvContent = [
        headers.map(escapeCsvValue).join(','),
        ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    return commentHeader + csvContent;
}

// Securely encode UTF-8 CSV string to base64
function utf8ToBase64(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
    }));
}

Deno.serve(async (req) => {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
        return new Response('No signature', { status: 400 });
    }

    try {
        const body = await req.text();
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
        
        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET is not set');
            return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let event;
        try {
            event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
            console.log(`✅ Signature verified for export event: ${event.type}`);
        } catch (err) {
            console.error(`❌ Signature verification failed: ${err.message}`);
            return new Response(JSON.stringify({ error: err.message }), { status: 400 });
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const isExport = session.metadata?.is_export === 'true';

            if (!isExport) {
                // Ignore regular checkouts (handled by standard webhook)
                console.log(`Regular tier checkout ${session.id} ignored by export webhook.`);
                return new Response(JSON.stringify({ received: true, ignored: true }), { status: 200 });
            }

            const sessionId = session.id;
            const buyerEmail = session.customer_details?.email || session.customer_email;
            
            if (!buyerEmail) {
                throw new Error('No customer email provided in Stripe Checkout Session');
            }

            const filterSnapshotStr = session.metadata?.filter_snapshot || '{}';
            const filters = JSON.parse(filterSnapshotStr);

            console.log(`Processing $1 Export for session: ${sessionId}, Email: ${buyerEmail}`);

            // 1. Idempotency Check
            const { data: existingDownload, error: downloadLookupError } = await supabaseAdmin
                .from('sheet_downloads')
                .select('*')
                .eq('stripe_session_id', sessionId)
                .single();

            if (existingDownload && existingDownload.status === 'sent') {
                console.log(`Export for session ${sessionId} already processed and emailed. Skipping.`);
                return new Response(JSON.stringify({ received: true, already_processed: true }), { status: 200 });
            }

            // Create initial row if it doesn't exist
            if (!existingDownload) {
                await supabaseAdmin.from('sheet_downloads').insert({
                    stripe_session_id: sessionId,
                    email: buyerEmail,
                    filter_snapshot: filters,
                    status: 'pending'
                });
            }

            // 2. Fetch and filter hackathons matching the snapshot
            const { data: hackathons, error: fetchError } = await supabaseAdmin
                .from('hackathons')
                .select('*');

            if (fetchError || !hackathons) {
                throw new Error(`Failed to fetch hackathons: ${fetchError?.message}`);
            }

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

            // 3. Generate CSV String
            const csvString = generateCsvString(filtered);

            // 4. Send Email via Resend API
            const resendApiKey = Deno.env.get('RESEND_API_KEY');
            if (!resendApiKey) {
                console.warn('RESEND_API_KEY is not set. Saving file locally in DB, email skipped.');
                await supabaseAdmin
                    .from('sheet_downloads')
                    .update({ status: 'failed' })
                    .eq('stripe_session_id', sessionId);
                throw new Error('Resend email API key not configured on backend');
            }

            console.log(`Sending enriched spreadsheet with ${filtered.length} hackathons to ${buyerEmail}...`);

            const base64Csv = utf8ToBase64(csvString);

            const emailResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'HackaMaps <exports@resend.dev>', // Resend testing domain fallback, or customized later
                    to: [buyerEmail],
                    subject: '🎉 Your HackaMap Enriched Data Export is Ready!',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                            <h2 style="color: #2563eb;">Your Spreadsheet is Ready!</h2>
                            <p>Thank you for purchasing the <strong>HackaMap Enriched Hackathon Spreadsheet</strong> ($1.00 One-time).</p>
                            <p>We have processed your filters and attached the freshly generated <strong>.csv</strong> file containing <strong>${filtered.length} hackathons</strong> directly to this email.</p>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                            
                            <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
                                <h3 style="margin-top: 0; color: #1e3a8a;">🚀 Ready to build even faster?</h3>
                                <p style="margin-bottom: 20px;">Upgrade to **HackaMaps Premium** or **Elite** for real-time Discord notifications, automated scraper feeds, and advanced developer networking pins.</p>
                                <a href="https://hackamaps.com" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Upgrade to Premium</a>
                            </div>
                            
                            <p style="font-size: 12px; color: #6b7280; margin-top: 32px;">If you have any questions or did not receive the attachment, please reply directly to this email.</p>
                        </div>
                    `,
                    attachments: [
                        {
                            content: base64Csv,
                            filename: 'hackamap_enriched_export.csv'
                        }
                    ]
                })
            });

            if (!emailResponse.ok) {
                const responseError = await emailResponse.text();
                throw new Error(`Resend email delivery failed: ${responseError}`);
            }

            console.log(`Spreadsheet successfully sent to ${buyerEmail}`);

            // 5. Update download status to 'sent'
            await supabaseAdmin
                .from('sheet_downloads')
                .update({ status: 'sent' })
                .eq('stripe_session_id', sessionId);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error(`Export Webhook error: ${error.message}`);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
