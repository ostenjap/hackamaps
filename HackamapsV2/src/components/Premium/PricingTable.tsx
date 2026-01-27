import React from 'react';
import { Check, X, Star, Crown, Zap, Users, Trophy, MessageSquare } from 'lucide-react';
import { Button, Card, Badge } from '../ui';

export const PricingTable = () => {
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
                        Join Elite builders and get exclusive access to investors, advanced tools, and a global community.
                    </p>
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
                                <span className="text-2xl font-bold text-white">€120</span>
                                <span className="text-neutral-500 text-sm">/year</span>
                            </div>
                            <p className="mt-1 text-[10px] text-blue-400 font-medium">Standard choice for active hackers</p>
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
                        <Button className="w-full">Upgrade Now</Button>
                    </Card>

                    {/* Elite Tier */}
                    <Card className="p-3 flex flex-col h-full border-yellow-500/50 bg-gradient-to-b from-neutral-900 to-neutral-900 shadow-[0_0_40px_rgba(234,179,8,0.1)] relative scale-[1.02] z-10 overflow-visible">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <Badge className="bg-yellow-500 text-black border-none font-bold px-4 py-1">
                                BEST VALUE
                            </Badge>
                        </div>

                        <div className="mb-2">
                            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                Elite <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white uppercase">€25</span>
                                <span className="text-neutral-500 text-sm">once</span>
                                <span className="ml-2 text-neutral-500 line-through text-sm">€50</span>
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
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    <span className="text-[10px] text-yellow-500 font-bold uppercase">
                                        497/500 Elite spots remaining
                                    </span>
                                </div>
                                <p className="text-[10px] text-neutral-500 italic">
                                    "Best €25 investment in my dev career" - @theleanbuild
                                </p>
                            </div>
                            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold animate-pulse-gold border-none">
                                Become Elite Member
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Social Proof */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 border-y border-white/5 py-8">
                    <div className="flex flex-col items-center text-center">
                        <Users className="w-5 h-5 text-neutral-500 mb-4" />
                        <p className="text-2xl font-bold text-white">347/500</p>
                        <p className="text-neutral-500 text-sm">Elite Members</p>
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
                                    <th className="py-3 px-5 font-medium text-yellow-500">ELITE</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    ['Live hackathon directory', '✓', '✓', '✓'],
                                    ['Basic map view', '✓', '✓', '✓'],
                                    ['Advanced filters', '✗', '✓', '✓'],
                                    ['Early notifications', '✗', '24h Early', '48h Early'],
                                    ['Calendar sync', '✗', '✓', '✓'],
                                    ['Map badge', '✗', '🌟 Premium', '👑 Elite'],
                                    ['Discord access', '✗', 'General', 'General + Elite'],
                                    ['Map profile', '✗', '✗', '✓ Featured'],
                                    ['Investor database', '✗', '✗', '✓ Full Access'],
                                    ['Investor office hours', '✗', '✗', '✓ Monthly'],
                                    ['Starter kit & templates', '✗', '✗', '✓'],
                                    ['Priority support', '✗', '✗', '✓ 24h response'],
                                    ['Beta feature access', '✗', '✗', '✓'],
                                    ['Elite Summit invite', '✗', '✗', '✓ Annual'],
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
                <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Crown className="w-48 h-48 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Elite costs €25 once → Premium costs €120/year</h3>
                    <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
                        In just 3 months, Elite pays for itself compared to Premium. After that, you're building with total advantage for free, forever.
                    </p>
                    <Button className="h-12 px-10 text-base bg-yellow-500 hover:bg-yellow-600 text-black font-bold animate-pulse-gold border-none">
                        Get Lifetime Access for €25
                    </Button>
                </div>
            </div>
        </section>
    );
};
