import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { X, Lock, Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UpdatePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UpdatePasswordModal({ isOpen, onClose }: UpdatePasswordModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordRequirements = {
        length: password.length >= 8,
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isPasswordValid) {
            setError("Please meet all password requirements.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setPassword('');
                setConfirmPassword('');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-50" />

                {/* Header */}
                <div className="relative p-6 pb-2 flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                        Update Password
                    </h2>
                    {!success && (
                        <button
                            onClick={onClose}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Password Updated!</h3>
                                <p className="text-sm text-neutral-400">Your security settings have been saved.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400 font-medium ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500 group-focus-within:text-green-400 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 focus:bg-green-900/5 transition-all placeholder:text-neutral-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400 font-medium ml-1">Confirm New Password</label>
                                <div className="relative group">
                                    <CheckCircle2 className={`absolute left-3 top-2.5 w-4 h-4 transition-colors ${password && confirmPassword ? (password === confirmPassword ? 'text-green-500' : 'text-red-500') : 'text-neutral-500'}`} />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 focus:bg-green-900/5 transition-all placeholder:text-neutral-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="mt-2 space-y-1.5 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Security Requirements</div>
                                <div className={`flex items-center gap-2 text-[11px] transition-colors ${passwordRequirements.length ? 'text-green-400' : 'text-neutral-500'}`}>
                                    <CheckCircle2 className={`w-3 h-3 ${passwordRequirements.length ? 'text-green-500' : 'text-neutral-600'}`} />
                                    Min 8 characters
                                </div>
                                <div className={`flex items-center gap-2 text-[11px] transition-colors ${passwordRequirements.number ? 'text-green-400' : 'text-neutral-500'}`}>
                                    <CheckCircle2 className={`w-3 h-3 ${passwordRequirements.number ? 'text-green-500' : 'text-neutral-600'}`} />
                                    At least one number
                                </div>
                                <div className={`flex items-center gap-2 text-[11px] transition-colors ${passwordRequirements.special ? 'text-green-400' : 'text-neutral-500'}`}>
                                    <CheckCircle2 className={`w-3 h-3 ${passwordRequirements.special ? 'text-green-500' : 'text-neutral-600'}`} />
                                    One special character (!@#$%^&*)
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Update Password
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
