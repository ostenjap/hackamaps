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
            const sessionId = session.id;
            const userId = session.client_reference_id;
            const customerEmail = session.customer_details?.email || session.customer_email;
            const tier = session.metadata?.tier;
            const customerId = session.customer as string;
            const subscriptionId = session.subscription as string;

            console.log(`Processing checkout.session.completed for ${sessionId} (${customerEmail})`);

            // 1. Idempotency Check
            const { data: existingSession, error: sessionLookupError } = await supabaseAdmin
                .from('stripe_checkout_sessions')
                .select('*')
                .eq('id', sessionId)
                .single();

            if (sessionLookupError && sessionLookupError.code !== 'PGRST116') {
                console.error(`Error looking up session: ${sessionLookupError.message}`);
                throw sessionLookupError;
            }

            if (existingSession?.processed_at) {
                console.log(`Session ${sessionId} already processed at ${existingSession.processed_at}. Skipping.`);
                return new Response(JSON.stringify({ received: true, already_processed: true }), { status: 200 });
            }

            // 2. Provisioning Logic
            let finalUserId = userId;

            if (!finalUserId && customerEmail) {
                // Guest checkout - check if user exists
                console.log(`Guest checkout for ${customerEmail}. Checking for existing user...`);
                const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());

                if (existingUser) {
                    // EMAIL MATCH - SECURITY RISK - CLAIM FLOW
                    console.warn(`Soft match found for ${customerEmail} (ID: ${existingUser.id}). Adding to pending_claims.`);
                    
                    const { error: claimError } = await supabaseAdmin
                        .from('pending_claims')
                        .insert({
                            stripe_checkout_session_id: sessionId,
                            email: customerEmail,
                            tier: tier || 'premium'
                        });

                    if (claimError) {
                        console.error(`Error creating pending claim: ${claimError.message}`);
                        throw claimError;
                    }
                    
                    // Note: We don't upgrade the profile yet.
                    finalUserId = null; 
                } else {
                    // NEW USER - AUTO PROVISION
                    console.log(`No existing user for ${customerEmail}. Creating new account...`);
                    
                    const throwawayPassword = crypto.randomUUID() + crypto.randomUUID();
                    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                        email: customerEmail,
                        password: throwawayPassword,
                        email_confirm: true,
                        user_metadata: { tier: tier || 'premium' }
                    });

                    if (createError) {
                        console.error(`Error creating user: ${createError.message}`);
                        throw createError;
                    }

                    if (newUser?.user) {
                        finalUserId = newUser.user.id;
                        console.log(`Created new user ${finalUserId} for ${customerEmail}`);

                        // Synchronously trigger Magic Link / Password Reset
                        // Using resetPasswordForEmail to send a secure link immediately
                        const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(customerEmail, {
                            redirectTo: `${Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:3000'}/auth/callback`
                        });
                        
                        if (resetError) {
                            console.error(`Error sending reset email to ${customerEmail}: ${resetError.message}`);
                            // We don't throw here because the user is already created and we want to finish provisioning
                        } else {
                            console.log(`Sent welcome/reset email to ${customerEmail}`);
                        }
                    }
                }
            }

            // 3. Increment founder spots if elite tier
            if (tier === 'elite') {
                console.log('Incrementing founder spots in site_stats...');
                const { error: statsError } = await supabaseAdmin.rpc('increment_founder_spots');
                if (statsError) {
                    console.error(`Error incrementing founder spots: ${statsError.message}`);
                }
            }

            // 4. Update Profile/Secrets if we have a resolved user ID
            if (finalUserId && tier) {
                console.log(`Finalizing upgrade for user ${finalUserId} to ${tier}`);
                
                // Update sensitive data in user_secrets
                const { error: secretsError } = await supabaseAdmin
                    .from('user_secrets')
                    .upsert({
                        id: finalUserId,
                        stripe_customer_id: customerId,
                        subscription_id: subscriptionId,
                        premium_since: new Date().toISOString()
                    });

                if (secretsError) throw secretsError;

                // Update public tier in profiles
                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        is_premium: true,
                        tier: tier
                    })
                    .eq('id', finalUserId);

                if (profileError) throw profileError;

                console.log(`Successfully upgraded user ${finalUserId} to ${tier}`);
            }

            // 5. Mark session as processed
            await supabaseAdmin
                .from('stripe_checkout_sessions')
                .upsert({
                    id: sessionId,
                    user_id: finalUserId,
                    email: customerEmail,
                    tier: tier,
                    status: 'completed',
                    processed_at: new Date().toISOString()
                });
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
