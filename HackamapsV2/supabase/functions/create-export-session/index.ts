import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from 'https://esm.sh/stripe@16.0.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2024-06-20',
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    try {
        const body = await req.json();
        console.log('Request body:', JSON.stringify(body));
        const { filters, success_url, cancel_url } = body;

        // 1. Rate limiting (basic IP-based)
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        const { data: rateData } = await supabaseAdmin
            .from('api_rate_limits')
            .select('*')
            .eq('ip', clientIp)
            .single();

        const now = new Date();
        if (rateData) {
            const lastRequest = new Date(rateData.last_request_at);
            const diffMs = now.getTime() - lastRequest.getTime();
            
            // Limit: 10 requests per minute for export creation
            if (diffMs < 60000 && rateData.request_count >= 10) {
                return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 429,
                });
            }

            await supabaseAdmin
                .from('api_rate_limits')
                .update({ 
                    last_request_at: now.toISOString(),
                    request_count: diffMs < 60000 ? rateData.request_count + 1 : 1
                })
                .eq('ip', clientIp);
        } else {
            // If table doesn't exist or record not found, don't block. Insert rate limit entry.
            try {
                await supabaseAdmin.from('api_rate_limits').insert({ ip: clientIp, last_request_at: now.toISOString(), request_count: 1 });
            } catch (e) {
                console.warn('Could not insert rate limit:', e.message);
            }
        }

        // 2. Get user from Supabase Auth (Optional)
        const authHeader = req.headers.get('Authorization');
        let user = null;
        if (authHeader) {
            const supabaseClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_ANON_KEY') ?? '',
                { global: { headers: { Authorization: authHeader } } }
            );
            const { data: { user: authUser } } = await supabaseClient.auth.getUser();
            user = authUser;
        }

        const priceId = Deno.env.get('STRIPE_EXPORT_PRICE_ID') || Deno.env.get('VITE_STRIPE_EXPORT_PRICE_ID');
        if (!priceId) {
            throw new Error('Stripe Export Price ID is not configured on the backend');
        }

        console.log('Creating $1 Export Stripe Checkout Session...');
        const sessionOptions: any = {
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            allow_promotion_codes: true,
            success_url: `${success_url}?export_success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancel_url,
            metadata: {
                is_export: 'true',
                filter_snapshot: JSON.stringify(filters || {}),
                user_id: user?.id || ''
            }
        };

        if (user) {
            sessionOptions.client_reference_id = user.id;
            sessionOptions.customer_email = user.email;
        } else {
            sessionOptions.customer_creation = 'always';
        }

        const session = await stripe.checkout.sessions.create(sessionOptions);
        console.log('Stripe Export session created:', session.id);

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Export Session Error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
