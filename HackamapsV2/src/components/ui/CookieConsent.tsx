import React, { useState, useEffect } from 'react';
import { Cookie, ExternalLink } from 'lucide-react';
import { optInTracking, optOutTracking, trackPageView } from '../../lib/posthog';

const CONSENT_KEY = 'hackamaps_cookie_consent';

export function CookieConsent() {
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(CONSENT_KEY) === null;
        }
        return false;
    });

    useEffect(() => {
        // 1. Check initial consent preference
        const storedConsent = localStorage.getItem(CONSENT_KEY);
        if (storedConsent === 'accepted') {
            optInTracking();
            // Track initial pageview now that consent is verified
            trackPageView(window.location.pathname);
        } else if (storedConsent === 'declined') {
            optOutTracking();
        }

        // 2. Listen for custom event to manage preferences again
        const handleOpenConsent = () => {
            setIsOpen(true);
        };

        window.addEventListener('open_cookie_consent', handleOpenConsent);
        return () => window.removeEventListener('open_cookie_consent', handleOpenConsent);
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        optInTracking();
        // Track the current view state as a pageview upon opting in
        trackPageView(window.location.pathname);
        setIsOpen(false);
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        optOutTracking();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[999] animate-in slide-in-from-bottom-6 duration-500">
            <div className="relative overflow-hidden bg-neutral-950/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4">
                {/* Visual Glow Highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-blue-500/20" />
                
                <div className="flex gap-3">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 h-fit">
                        <Cookie className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                            Cookie & Privacy Consent
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                            We use cookies and telemetry (PostHog) to understand user flow, page performance, and improve Hackamaps. 
                            <strong> No personal or tracking data is collected unless you accept.</strong>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                    <a 
                        href="/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
                    >
                        Read Privacy Policy <ExternalLink className="w-2.5 h-2.5" />
                    </a>

                    <div className="flex gap-2">
                        <button
                            onClick={handleDecline}
                            className="px-3.5 py-1.5 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                        >
                            Essential Only
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer"
                        >
                            Accept Analytics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
