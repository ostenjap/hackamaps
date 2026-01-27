import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from 'https://esm.sh/stripe@16.0.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2024-06-20',
    httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return new Response('No signature', { status: 400 });
    }

    try {
        const body = await req.text();
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
        );

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.client_reference_id;
            const tier = session.metadata?.tier;

            if (userId && tier) {
                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        is_premium: true,
                        tier: tier
                    })
                    .eq('id', userId);

                if (error) throw error;
                console.log(`Successfully updated profile for user ${userId} to tier ${tier}`);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error(`Webhook error: ${error.message}`);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
