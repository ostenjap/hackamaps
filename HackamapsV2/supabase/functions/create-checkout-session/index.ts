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
        const { tier, interval, success_url, cancel_url } = body;

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
            
            // Limit: 5 requests per minute
            if (diffMs < 60000 && rateData.request_count >= 5) {
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
            await supabaseAdmin.from('api_rate_limits').insert({ ip: clientIp, last_request_at: now.toISOString(), request_count: 1 });
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

        if (user) {
            console.log('Authenticated user:', user.email);
        } else {
            console.log('Guest checkout request');
        }

        let priceId = '';
        let mode: 'payment' | 'subscription' = 'payment';

        if (tier === 'premium') {
            priceId = interval === 'year' 
                ? Deno.env.get('STRIPE_PREMIUM_YEARLY_PRICE_ID') ?? ''
                : Deno.env.get('STRIPE_PREMIUM_PRICE_ID') ?? '';
            mode = 'subscription';
        } else if (tier === 'elite') {
            // Fetch current count to determine price
            const { data: stats } = await supabaseAdmin
                .from('site_stats')
                .select('founder_spots_sold')
                .eq('id', 'global')
                .single();
            
            const count = stats?.founder_spots_sold || 0;
            
            if (count < 25) {
                // Use Discount Price
                priceId = Deno.env.get('STRIPE_ELITE_PRICE_ID') ?? '';
                console.log(`Using discount price for spot #${count + 1}`);
            } else {
                // Use Full Price
                priceId = Deno.env.get('STRIPE_ELITE_FULL_PRICE_ID') ?? '';
                console.log(`Discount sold out (${count} spots). Using full price.`);
            }
            mode = 'payment';
        } else {
            throw new Error('Invalid tier');
        }

        if (!priceId) throw new Error(`Price ID for tier ${tier} not configured`);

        console.log('Creating Stripe session...');
        const sessionOptions: any = {
            line_items: [{ price: priceId, quantity: 1 }],
            mode,
            success_url,
            cancel_url,
            allow_promotion_codes: true,
            metadata: {
                tier,
                interval: tier === 'elite' ? 'once' : (interval || 'month'),
                user_id: user?.id || ''
            }
        };

        if (user) {
            sessionOptions.client_reference_id = user.id;
            sessionOptions.customer_email = user.email;
        } else if (mode === 'payment') {
            // For guest checkout, allow Stripe to collect email and create customer
            sessionOptions.customer_creation = 'always';
        }

        const session = await stripe.checkout.sessions.create(sessionOptions);

        // 3. Track session for idempotency
        await supabaseAdmin.from('stripe_checkout_sessions').insert({
            id: session.id,
            user_id: user?.id || null,
            email: user?.email || 'pending_stripe_collection',
            tier: tier,
            status: 'created'
        });

        console.log('Stripe session created:', session.id);

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Function caught error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
