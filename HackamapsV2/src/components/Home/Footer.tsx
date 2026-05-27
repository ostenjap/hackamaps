import React from 'react';
import type { ViewState } from '../../types';

interface FooterProps {
    setView: (view: ViewState) => void;
}

export function Footer({ setView }: FooterProps) {
    const handleNavigation = (view: ViewState) => {
        setView(view);
        // Smooth scroll to top when page changes
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="w-full mt-24 py-8 border-t border-white/5 bg-black/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
                
                {/* Left Side: Brand */}
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white tracking-wider">HACKAMAPS</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-semibold">
                        LIFETIME
                    </span>
                </div>

                {/* Center Side: Legal Links */}
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={() => handleNavigation('impressum')}
                        className="hover:text-white transition-colors duration-200 cursor-pointer font-medium"
                    >
                        Impressum (Legal Notice)
                    </button>
                    <button
                        onClick={() => handleNavigation('privacy')}
                        className="hover:text-white transition-colors duration-200 cursor-pointer font-medium"
                    >
                        Privacy Policy (Datenschutz)
                    </button>
                    <a
                        href="mailto:ojap@hackamaps.com"
                        className="hover:text-white transition-colors duration-200 cursor-pointer font-medium"
                    >
                        Support
                    </a>
                </div>

                {/* Right Side: Copyright */}
                <div className="text-xs text-neutral-600 text-center md:text-right">
                    <p>&copy; {new Date().getFullYear()} Hackamaps. All rights reserved.</p>
                    <p className="text-[10px] mt-0.5 text-neutral-700">Built for secure global builders.</p>
                </div>
            </div>
        </footer>
    );
}
