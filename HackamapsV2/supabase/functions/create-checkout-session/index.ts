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

    try {
        const body = await req.json();
        console.log('Request body:', JSON.stringify(body));
        const { tier, success_url, cancel_url } = body;

        // Get user from Supabase Auth
        const authHeader = req.headers.get('Authorization');
        console.log('Auth header present:', !!authHeader);
        if (!authHeader) throw new Error('Missing Authorization header');

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            console.error('Auth error or user missing:', authError);
            throw new Error('Unauthorized');
        }

        console.log('Authenticated user:', user.email);

        let priceId = '';
        let mode: 'payment' | 'subscription' = 'payment';

        if (tier === 'premium') {
            priceId = Deno.env.get('STRIPE_PREMIUM_PRICE_ID') ?? '';
            mode = 'subscription';
        } else if (tier === 'elite') {
            priceId = Deno.env.get('STRIPE_ELITE_PRICE_ID') ?? '';
            mode = 'payment';
        } else {
            console.error('Invalid tier provided:', tier);
            throw new Error('Invalid tier');
        }

        console.log(`Using tier: ${tier}, Price ID: ${priceId}, Mode: ${mode}`);

        if (!priceId) {
            console.error(`Missing Price ID for tier: ${tier}`);
            throw new Error(`Price ID for tier ${tier} not configured`);
        }

        console.log('Creating Stripe session...');
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode,
            success_url,
            cancel_url,
            client_reference_id: user.id,
            customer_email: user.email,
            allow_promotion_codes: true,
            metadata: {
                tier,
                user_id: user.id
            }
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
