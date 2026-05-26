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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');

    const passwordRequirements = {
        length: password.length >= 8,
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("Sign in is temporarily offline for maintenance. Please check back later.");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 z-10" />
                
                {/* Header - Fixed */}
                <div className="relative p-6 pb-2 flex justify-between items-center flex-shrink-0 z-10">
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

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold text-white mb-2">System Maintenance</h3>
                    <p className="text-sm text-neutral-400 max-w-sm">
                        Authentication is temporarily disabled for scheduled security maintenance. We apologize for the inconvenience and will be back shortly.
                    </p>
                </div>
            </div>
        </div>
    );
}
