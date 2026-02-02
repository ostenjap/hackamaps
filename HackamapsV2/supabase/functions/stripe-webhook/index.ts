import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from 'npm:stripe@16.12.0';

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
        // IMPORTANT: Get raw body text for signature verification
        const body = await req.text();
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
        
        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET is not set');
            return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify the webhook signature
        let event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                webhookSecret
            );
            console.log(`✅ Signature verified for event: ${event.type}`);
        } catch (err) {
            console.error(`❌ Signature verification failed: ${err.message}`);
            return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.client_reference_id;
            const tier = session.metadata?.tier;
            const customerId = session.customer as string;
            const subscriptionId = session.subscription as string;

            if (userId && tier) {
                // Update sensitive data in user_secrets
                const { error: secretsError } = await supabaseAdmin
                    .from('user_secrets')
                    .upsert({
                        id: userId,
                        stripe_customer_id: customerId,
                        subscription_id: subscriptionId,
                        premium_since: new Date().toISOString()
                    });

                if (secretsError) {
                    console.error(`Error updating user_secrets: ${secretsError.message}`);
                    throw secretsError;
                }

                // Update public tier in profiles
                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        is_premium: true,
                        tier: tier
                    })
                    .eq('id', userId);

                if (profileError) {
                    console.error(`Error updating profile: ${profileError.message}`);
                    throw profileError;
                }

                console.log(`Successfully upgraded user ${userId} to ${tier}`);
            }
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription;
            
            // Find user ID from secrets
            const { data: secretData, error: lookupError } = await supabaseAdmin
                .from('user_secrets')
                .select('id')
                .eq('subscription_id', subscription.id)
                .single();

            if (lookupError || !secretData) {
                console.error(`Could not find user for subscription ${subscription.id}`);
                return new Response('User not found', { status: 200 }); // Return 200 to acknowledge Stripe
            }

            // Downgrade profile
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({
                    is_premium: false,
                    tier: 'hobby'
                })
                .eq('id', secretData.id);

            if (profileError) throw profileError;
            console.log(`Successfully downgraded user ${secretData.id} after subscription ${subscription.id} deletion`);
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
