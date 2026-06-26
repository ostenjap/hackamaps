import React, { useState } from 'react';
import { Download, FileSpreadsheet, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import type { FilterState } from '../../types';
import { trackEvent } from '../../lib/posthog';

interface ExportButtonProps {
    filters: FilterState;
}

export const ExportButton = ({ filters }: ExportButtonProps) => {
    const { session, profile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const isPremium = profile?.is_premium || ['pro', 'elite', 'premium', 'lifetime'].includes(profile?.tier?.toLowerCase() || '');

    const baseUrl = import.meta.env.VITE_SUPABASE_URL;

    const handleExport = async () => {
        setIsLoading(true);
        setErrorMsg(null);

        trackEvent('export_button_clicked', {
            is_premium: isPremium,
            filters
        });

        try {
            if (isPremium) {
                // PREMIUM: Direct download via secured edge function
                const token = session?.access_token;
                if (!token) throw new Error("Authentication token not found. Please log in.");

                console.log("Triggering premium export download...");
                const response = await fetch(`${baseUrl}/functions/v1/download-premium-export`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ filters })
                });

                if (!response.ok) {
                    const errRes = await response.json();
                    throw new Error(errRes.error || "Failed to download the export.");
                }

                // Convert response stream to Blob and download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `hackamap_premium_export_${Date.now()}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                console.log("Premium download completed successfully.");
            } else {
                // ANONYMOUS: $1 tripwire Stripe Checkout flow
                console.log("Initiating $1 export Stripe Checkout...");
                const token = session?.access_token;
                const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`${baseUrl}/functions/v1/create-export-session`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        filters,
                        success_url: window.location.origin + window.location.pathname,
                        cancel_url: window.location.origin + window.location.pathname
                    })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Failed to initiate payment checkout.");
                }

                if (data.url) {
                    trackEvent('export_stripe_checkout_initiated', {
                        filters
                    });
                    // Redirect directly to Stripe Checkout
                    window.location.href = data.url;
                } else {
                    throw new Error("Checkout URL was not returned.");
                }
            }
        } catch (err: any) {
            console.error("Export failure:", err);
            setErrorMsg(err.message || "An unexpected error occurred.");
            setTimeout(() => setErrorMsg(null), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-end">
            <button
                onClick={handleExport}
                disabled={isLoading}
                className={`relative overflow-hidden group flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-60 shadow-lg ${
                    isPremium
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/30 hover:border-blue-500/60 shadow-blue-500/20'
                }`}
            >
                {/* Background pulse highlight */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-shimmer" />

                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Compiling Sheet...</span>
                    </>
                ) : isPremium ? (
                    <>
                        <Download className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
                        <span>Download Spreadsheet</span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                    </>
                ) : (
                    <>
                        <FileSpreadsheet className="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform" />
                        <span>Export Enriched Sheet</span>
                        <span className="ml-1 px-1.5 py-0.5 bg-white/20 text-white rounded-md text-[10px] font-mono font-bold tracking-tight">
                            $1
                        </span>
                    </>
                )}
            </button>

            {errorMsg && (
                <div className="absolute top-12 z-50 bg-red-950/90 border border-red-500/50 text-red-200 px-3 py-1.5 rounded-lg text-xs font-mono shadow-xl animate-in fade-in slide-in-from-top-2">
                    ⚠️ {errorMsg}
                </div>
            )}
        </div>
    );
};
