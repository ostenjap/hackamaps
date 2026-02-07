import React, { useState, useEffect } from 'react';
import { Check, X, Star, Crown, Zap, Users, Trophy, MessageSquare, Loader2 } from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export const PricingTable = () => {
    const { user, setIsAuthModalOpen } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

    // Auto-resume checkout after login
    useEffect(() => {
        if (user) {
            const pendingTier = sessionStorage.getItem('pending_checkout_tier');
            if (pendingTier === 'premium' || pendingTier === 'elite') {
                const pendingInterval = sessionStorage.getItem('pending_checkout_interval') as 'month' | 'year' || 'month';
                sessionStorage.removeItem('pending_checkout_tier');
                sessionStorage.removeItem('pending_checkout_interval');
                handleUpgrade(pendingTier, pendingInterval);
            }
        }
    }, [user]);

    const handleUpgrade = async (tier: 'premium' | 'elite', interval: 'month' | 'year' = 'month') => {
        if (!user) {
            sessionStorage.setItem('pending_checkout_tier', tier);
            sessionStorage.setItem('pending_checkout_interval', interval);
            setIsAuthModalOpen(true);
            return;
        }

        try {
            setLoading(tier);

            // Get fresh session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                console.error('Session error:', sessionError);
                setIsAuthModalOpen(true);
                return;
            }

            console.log(`Sending checkout request for ${tier}...`);
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    tier,
                    interval,
                    success_url: window.location.origin + '/?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: window.location.origin + '/pricing'
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) {
                // If it's a 401, maybe the token expired exactly now
                if (error.status === 401 || (error as any).message?.includes('401')) {
                    console.warn('401 Unauthorized from function - refreshing session...');
                    await supabase.auth.refreshSession();
                    // Optional: retry once or just tell user to try again
                }
                throw error;
            }

            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Error initiating upgrade:', error);
            // alert('Something went wrong. Please try again.');
        } finally {
            setLoading(null);
        }
    };
    return (
        <section id="pricing" className="w-full py-12 bg-black/50 border-t border-white/5 relative overflow-hidden scroll-mt-32">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-4">
                    <Badge variant="secondary" className="mb-2 bg-yellow-900/30 text-yellow-500 border-yellow-500/30 animate-pulse text-[9px]">
                        LIMITED TIME: 50% OFF
                    </Badge>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                        Stop Paying Monthly. <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Start Building Forever.</span>
                    </h2>
                    <p className="text-neutral-400 text-sm max-w-2xl mx-auto">
                        Join FOUNDER LIFETIME builders and get exclusive access to investors, advanced tools, and a global community.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex items-center gap-3 p-1 bg-neutral-900/80 rounded-full border border-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setBillingInterval('month')}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingInterval === 'month' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('year')}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${billingInterval === 'year' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                        >
                            Yearly
                            <Badge className="bg-green-500/10 text-green-500 border-none px-1.5 py-0 text-[9px]">Save 16%</Badge>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 mt-4">

                    {/* Free Tier */}
                    <Card className="p-3 flex flex-col h-full bg-neutral-900/40 border-white/5">
                        <div className="mb-2">
                            <h3 className="text-base font-bold text-white mb-1">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">€0</span>
                                <span className="text-neutral-500 text-sm">/forever</span>
                            </div>
                            <p className="mt-1 text-[10px] text-neutral-400 font-medium">Essential features for every builder</p>
                        </div>

                        <ul className="space-y-1 mb-3 flex-1">
                            {['Live hackathon directory', 'Basic map view', 'Face Map view'].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-neutral-400 text-xs">
                                    <Check className="w-3 h-3 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                            {['Hackamaps Discord', 'Face Map Pin', 'Early Stage Investor List', 'Premium Map Pin'].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-neutral-600 text-xs">
                                    <X className="w-3 h-3" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full">Current Plan</Button>
                    </Card>

                    {/* Premium Tier */}
                    <Card className="p-3 flex flex-col h-full bg-neutral-900/40 border-white/10 relative group">
                        <div className="mb-2">
                            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                Premium <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">
                                    {billingInterval === 'month' ? '€10' : '€100'}
                                </span>
                                <span className="text-neutral-500 text-sm">
                                    /{billingInterval === 'month' ? 'mo' : 'year'}
                                </span>
                                {billingInterval === 'year' && (
                                    <span className="ml-2 text-[10px] text-neutral-500 italic">
                                        (€8.33/mo)
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-[10px] text-blue-400 font-medium">Full access • Best for active hackers</p>
                        </div>

                        <ul className="space-y-1 mb-3 flex-1">
                            {[
                                'Live hackathon directory',
                                'Basic map view',
                                'Face Map view',
                                'Hackamaps Discord',
                                'Face Map Pin',
                                'Premium Map Pin'
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-neutral-300 text-xs">
                                    <Check className="w-3 h-3 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                            {['Early Stage Investor List'].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-neutral-600 text-xs">
                                    <X className="w-3 h-3" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Button
                            className="w-full"
                            onClick={() => handleUpgrade('premium', billingInterval)}
                            disabled={loading !== null}
                        >
                            {loading === 'premium' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgrade Now'}
                        </Button>
                    </Card>

                    {/* FOUNDER LIFETIME Tier */}
                    <Card className="p-3 flex flex-col h-full border-yellow-500/50 bg-gradient-to-b from-neutral-900 to-neutral-900 shadow-[0_0_40px_rgba(234,179,8,0.1)] relative scale-[1.02] z-10 overflow-visible">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <Badge className="bg-yellow-500 text-black border-none font-bold px-4 py-1">
                                BEST VALUE
                            </Badge>
                        </div>

                        <div className="mb-2">
                            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                FOUNDER LIFETIME <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white uppercase">€49</span>
                                <span className="text-neutral-500 text-sm">once</span>
                                <span className="ml-2 text-neutral-500 line-through text-sm">€99</span>
                            </div>
                            <p className="mt-1 text-[10px] text-yellow-500 font-bold uppercase tracking-widest">
                                pay once, access forever, never pay again
                            </p>
                        </div>

                        {/* <div className="mb-6 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-[10px] text-yellow-500 font-bold uppercase mb-2">Value Breakdown</p>
                            <div className="space-y-1 text-xs text-neutral-400">
                                <div className="flex justify-between"><span>Investor Database</span> <span>€299/y</span></div>
                                <div className="flex justify-between"><span>Discord Elite</span> <span>€99/y</span></div>
                                <div className="flex justify-between"><span>Office Hours</span> <span>€240/y</span></div>
                                <div className="flex justify-between"><span>Starter Kits</span> <span>€79</span></div>
                                <div className="flex justify-between border-t border-white/5 pt-1 mt-1 text-white font-bold">
                                    <span>Total Value</span> <span>€717</span>
                                </div>
                            </div>
                        </div> */}

                        <ul className="space-y-1 mb-3 flex-1">
                            {[
                                'Live hackathon directory',
                                'Basic map view',
                                'Face Map view',
                                'Hackamaps Discord',
                                'Face Map Pin',
                                'Premium Map Pin',
                                'Early Stage Investor List'
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-white text-xs">
                                    <Check className="w-3 h-3 text-yellow-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-4">


                            <div className="text-center">
                                <div className="flex flex-col items-center gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
                                        <span className="text-[11px] text-yellow-500 font-bold uppercase tracking-wider">
                                            497/500 FOUNDER LIFETIME spots remaining
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-yellow-500 w-[99.4%] shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                    </div>
                                    <div className="flex justify-between w-full text-[9px] font-medium">
                                        <span className="text-yellow-500/80">Price increases to €99 after 500 members</span>
                                        <span className="text-neutral-500 italic">Last spot taken 47m ago</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-neutral-500 italic mb-4">
                                    "Best €49 investment in my dev career" - @theleanbuild
                                </p>
                            </div>
                            <Button
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold animate-pulse-gold border-none h-12 text-base"
                                onClick={() => handleUpgrade('elite')}
                                disabled={loading !== null}
                            >
                                {loading === 'elite' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Become FOUNDER LIFETIME Member'}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Social Proof */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 border-y border-white/5 py-8">
                    <div className="flex flex-col items-center text-center">
                        <Users className="w-5 h-5 text-neutral-500 mb-4" />
                        <p className="text-2xl font-bold text-white">347/500</p>
                        <p className="text-neutral-500 text-sm">FOUNDER LIFETIME Members</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Trophy className="w-5 h-5 text-neutral-500 mb-4" />
                        <p className="text-2xl font-bold text-white">€2.4M+</p>
                        <p className="text-neutral-500 text-sm">Prize Money Won</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Zap className="w-5 h-5 text-neutral-500 mb-4" />
                        <p className="text-2xl font-bold text-white">200+</p>
                        <p className="text-neutral-500 text-sm">VC Connections Made</p>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">Verified Success Stories</span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                quote: "Elite database got me into Y Combinator's radar",
                                handle: "@startup_founder",
                                context: "Series A Builder"
                            },
                            {
                                quote: "Found my co-founder in the Elite Discord",
                                handle: "@build_with_me",
                                context: "Technical Lead"
                            },
                            {
                                quote: "Won 3 hackathons using their starter kit",
                                handle: "@hackathon_king",
                                context: "Venture Hackathon Fellow"
                            }
                        ].map((t, i) => (
                            <Card key={i} className="p-6 bg-neutral-900/20 border-white/5 hover:border-yellow-500/20 transition-all group">
                                <div className="flex flex-col h-full">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        ))}
                                    </div>
                                    <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic">
                                        "{t.quote}"
                                    </p>
                                    <div className="mt-auto flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border border-white/10 flex-shrink-0" />
                                        <div>
                                            <p className="text-white text-xs font-bold">{t.handle}</p>
                                            <p className="text-neutral-500 text-[10px]">{t.context}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Do The Math Section */}
                <div className="mb-24 mt-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-2">Do The Math:</h3>
                        <p className="text-neutral-500">Visual proof that FOUNDER LIFETIME is the only rational choice for builders.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <Card className="p-8 bg-neutral-900/10 border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Check className="w-24 h-24 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-neutral-400 mb-4 uppercase">PREMIUM {billingInterval}ly</h4>
                            <div className="space-y-2 text-2xl font-mono">
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-500 text-sm">Cost</span>
                                    <span>{billingInterval === 'month' ? '€10/mo' : '€100/yr'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-neutral-500 text-sm">3 Year Total</span>
                                    <span className="text-white">€300</span>
                                </div>
                            </div>
                            <p className="mt-6 text-sm text-neutral-500">Subscription adds up over time.</p>
                        </Card>

                        <Card className="p-8 bg-yellow-500/5 border-yellow-500/20 relative overflow-hidden ring-1 ring-yellow-500/30">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Crown className="w-24 h-24 text-yellow-500" />
                            </div>
                            <h4 className="text-lg font-bold text-yellow-500 mb-4 uppercase">FOUNDER LIFETIME</h4>
                            <div className="space-y-2 text-2xl font-mono">
                                <div className="flex justify-between items-center text-yellow-500">
                                    <span className="text-yellow-500/50 text-sm font-sans uppercase font-bold">One-Time Payment</span>
                                    <span className="font-bold">€49</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-yellow-500/10 text-yellow-500">
                                    <span className="text-yellow-500/50 text-sm font-sans uppercase font-bold">Years 2, 3, 5, 10...</span>
                                    <span className="font-bold">€0</span>
                                </div>
                            </div>
                            <p className="mt-6 text-sm text-yellow-500/80 font-medium">Pay once. Build forever. No renewals, no hidden fees.</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { time: "After 3 Months", saving: "Saved Money", detail: "Elite already paid for itself", color: "text-blue-400" },
                            { time: "After 1 Year", saving: "€75 Saved", detail: "Versus Paying Premium", color: "text-green-400" },
                            { time: "After 3 Years", saving: "€275 Saved", detail: "Total building advantage", color: "text-yellow-500" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5 text-center">
                                <p className="text-neutral-500 text-xs uppercase tracking-widest mb-2">{item.time}</p>
                                <p className={`text-2xl font-bold mb-1 ${item.color}`}>{item.saving}</p>
                                <p className="text-[10px] text-neutral-500">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-24 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Questions?</span>
                        <h3 className="text-3xl font-bold text-white">Frequently Asked Questions</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "What if I'm not satisfied?",
                                a: "30-day money-back guarantee. No questions asked. We're builders too, and we only want your money if we're helping you win."
                            },
                            {
                                q: "Can I upgrade later?",
                                a: "Yes, but the 50% lifetime discount is only available for the first 500 members. Once those spots are gone, the price for FOUNDER LIFETIME access increases to €99."
                            },
                            {
                                q: "What's in the investor database?",
                                a: "We maintain a curated list of 200+ VCs, angels, and accelerators specifically looking for hackathon-stage projects. Includes contact info, investment thesis, and previous portfolio companies."
                            },
                            {
                                q: "Is this really lifetime?",
                                a: "Yes. Absolutely. Pay once, access forever. You will never see a renewal charge or be asked to pay for a subscription again."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-white/10 transition-colors">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-3">
                                    <span className="text-neutral-600 text-lg">❓</span> {faq.q}
                                </h4>
                                <p className="text-neutral-400 text-sm leading-relaxed pl-9">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Table for now we will not use it but good to have in mind 
                <div className="mt-16">
                    <h3 className="text-xl font-bold text-white text-center mb-8">Detailed Comparison</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-neutral-500 text-sm font-mono tracking-widest text-left">
                                    <th className="py-3 px-5 font-medium">FEATURE</th>
                                    <th className="py-3 px-5 font-medium">FREE</th>
                                    <th className="py-3 px-5 font-medium">PREMIUM</th>
                                    <th className="py-3 px-5 font-medium text-yellow-500">FOUNDER LIFETIME</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    ['Live hackathon directory', '✓', '✓', '✓'],
                                    ['Basic map view', '✓', '✓', '✓'],
                                    ['Advanced filters', '✗', '✓', '✓'],
                                    ['Early notifications', '✗', '24h Early', '48h Early'],
                                    ['Calendar sync', '✗', '✓', '✓'],
                                    ['Map badge', '✗', '🌟 Premium', '👑 FOUNDER LIFETIME'],
                                    ['Discord access', '✗', 'General', 'General + FOUNDER LIFETIME'],
                                    ['Map profile', '✗', '✗', '✓ Featured'],
                                    ['Investor database', '✗', '✗', '✓ Full Access'],
                                    ['Investor office hours', '✗', '✗', '✓ Monthly'],
                                    ['Starter kit & templates', '✗', '✗', '✓'],
                                    ['Priority support', '✗', '✗', '✓ 24h response'],
                                    ['Beta feature access', '✗', '✗', '✓'],
                                    ['FOUNDER LIFETIME Summit invite', '✗', '✗', '✓ Annual'],
                                ].map(([feature, free, premium, elite], i) => (
                                    <tr key={feature} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                                        <td className="py-3 px-5 text-neutral-400 font-medium">{feature}</td>
                                        <td className="py-3 px-5 text-neutral-500">{free === '✓' ? <Check className="w-4 h-4 text-green-500/50" /> : free === '✗' ? <X className="w-4 h-4 text-red-500/30" /> : free}</td>
                                        <td className="py-3 px-5 text-neutral-300">{premium === '✓' ? <Check className="w-4 h-4 text-blue-500/70" /> : premium === '✗' ? <X className="w-4 h-4 text-red-500/30" /> : premium}</td>
                                        <td className="py-3 px-5 text-white font-bold">{elite === '✓' ? <Check className="w-4 h-4 text-yellow-500" /> : elite}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> */}



                {/* Final Value Stack CTA */}
                <div className="mt-16 text-center p-12 rounded-[2.5rem] bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.05)]">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Crown className="w-64 h-64 text-yellow-500" />
                    </div>
                    <div className="relative z-10">
                        <Badge className="bg-yellow-500 text-black border-none font-bold px-4 py-1 mb-6 animate-bounce">
                            FINAL OPPORTUNITY
                        </Badge>
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Build Forever with FOUNDER LIFETIME.</h3>
                        <p className="text-neutral-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                            Stop the recurring drain on your bank account. Join <span className="text-white font-bold">347 members</span> who have already secured their lifetime advantage. Not satisfied? 100% money-back guarantee.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Button
                                className="h-16 px-12 text-lg bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold animate-pulse-gold border-none rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-105 transition-all"
                                onClick={() => handleUpgrade('elite')}
                                disabled={loading !== null}
                            >
                                {loading === 'elite' ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                Get FOUNDER LIFETIME Access for €49
                            </Button>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                                Limited to first 500 members • Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
