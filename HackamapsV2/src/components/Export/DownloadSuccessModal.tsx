import React from 'react';
import { CheckCircle2, Mail, Sparkles, ArrowRight, X } from 'lucide-react';

interface DownloadSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export const DownloadSuccessModal = ({ isOpen, onClose, onUpgrade }: DownloadSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            {/* Modal Body */}
            <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)] animate-in scale-in duration-300">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 hover:bg-white/5 rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8 flex flex-col items-center text-center">
                    
                    {/* Success Icon */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative bg-blue-900/40 border border-blue-500/30 p-4 rounded-full text-blue-400 flex items-center justify-center">
                            <Mail className="w-8 h-8" />
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute -bottom-1 -right-1 bg-neutral-900 rounded-full" />
                        </div>
                    </div>

                    {/* Thank You Headers */}
                    <h2 className="text-2xl font-bold text-white mb-2">Purchase Successful!</h2>
                    <p className="text-blue-400 font-semibold font-mono text-sm uppercase tracking-wider mb-3">Enriched Export Compiling</p>
                    
                    <p className="text-sm text-neutral-400 max-w-sm mb-8 leading-relaxed">
                        Your high-signal hackathon spreadsheet has been compiled and is on its way to your inbox! Please check your email in 1-2 minutes.
                    </p>

                    {/* UPSELL CARD */}
                    <div className="w-full relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-blue-500/20 rounded-xl p-5 text-left overflow-hidden shadow-inner group">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20 text-blue-400">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">Exclusive Pro Upgrade</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1.5">Unlock Live Dev Signals</h3>
                        <p className="text-xs text-neutral-500 mb-4">Why buy exports when you can get continuous, live updates?</p>

                        <ul className="space-y-2 text-xs text-neutral-300 mb-5">
                            <li className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold">✓</span>
                                <span>Real-time Discord notification hooks</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold">✓</span>
                                <span>Continuous automated scraper API feeds</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold">✓</span>
                                <span>Position custom face pins on our global network map</span>
                            </li>
                        </ul>

                        <button 
                            onClick={() => {
                                onUpgrade();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/10"
                        >
                            <span>Explore Pro Plans</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};
