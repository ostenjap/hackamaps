import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'signin' | 'signup';
}

type AuthView = 'signin' | 'signup' | 'forgot_password';

export function AuthModal({ isOpen, onClose, initialView = 'signin' }: AuthModalProps) {
    const [view, setView] = useState<AuthView>(initialView);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setLoading(true);

        try {
            if (view === 'signin') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            } else if (view === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            username: username
                        }
                    }
                });
                if (error) throw error;
                setSuccessMsg("Check your email to confirm your account!");
            } else if (view === 'forgot_password') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/reset-password',
                });
                if (error) throw error;
                setSuccessMsg("Password reset link sent to your email.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full point-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full point-events-none" />

                {/* Header */}
                <div className="relative p-6 pb-2 flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {view === 'signin' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot_password' && 'Reset Password'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3 text-green-400 text-xs">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {view === 'signup' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400 font-medium ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/5 transition-all placeholder:text-neutral-700"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400 font-medium ml-1">Username</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-2.5 text-neutral-500 group-focus-within:text-blue-400 font-mono text-xs mt-0.5">@</span>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/5 transition-all placeholder:text-neutral-700"
                                        placeholder="jdhacker"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs text-neutral-400 font-medium ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/5 transition-all placeholder:text-neutral-700"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {view !== 'forgot_password' && (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs text-neutral-400 font-medium">Password</label>
                                {view === 'signin' && (
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot_password')}
                                        className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/5 transition-all placeholder:text-neutral-700"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                {view === 'signin' && 'Sign In'}
                                {view === 'signup' && 'Create Account'}
                                {view === 'forgot_password' && 'Send Reset Link'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                    {view === 'signin' && (
                        <p className="text-xs text-neutral-500">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setView('signup')}
                                className="text-white hover:underline decoration-blue-500 underline-offset-2"
                            >
                                Sign up
                            </button>
                        </p>
                    )}
                    {view === 'signup' && (
                        <p className="text-xs text-neutral-500">
                            Already have an account?{' '}
                            <button
                                onClick={() => setView('signin')}
                                className="text-white hover:underline decoration-blue-500 underline-offset-2"
                            >
                                Sign in
                            </button>
                        </p>
                    )}
                    {view === 'forgot_password' && (
                        <button
                            onClick={() => setView('signin')}
                            className="text-xs text-neutral-400 hover:text-white transition-colors"
                        >
                            Return to Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
