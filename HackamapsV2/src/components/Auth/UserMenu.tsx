import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';

interface UserMenuProps {
    onOpenAuth: () => void;
    onOpenProfile: () => void;
}

export function UserMenu({ onOpenAuth, onOpenProfile }: UserMenuProps) {
    const { user, profile, signOut, isLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading) {
        return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;
    }

    if (!user) {
        return (
            <button
                onClick={onOpenAuth}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-full transition-all shadow-lg hover:shadow-blue-500/25 border border-white/10"
            >
                SIGN IN
            </button>
        );
    }

    // Generate initials
    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : user.email?.substring(0, 2).toUpperCase() || '??';

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 bg-neutral-900/50 hover:bg-neutral-800 border border-white/10 rounded-full transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-white">{initials}</span>
                        )}
                    </div>
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-[10px] text-neutral-400 font-mono leading-none mb-0.5">OPERATOR</p>
                    <p className="text-xs font-medium text-white leading-none max-w-[80px] truncate">
                        {profile?.username || user.email?.split('@')[0]}
                    </p>
                </div>
                <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in slide-in-from-top-2 fade-in duration-200">

                    <div className="px-4 py-3 border-b border-white/5 md:hidden">
                        <p className="text-sm font-medium text-white truncate">{profile?.full_name || user.email}</p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onOpenProfile();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                        <UserIcon className="w-4 h-4" />
                        Profile
                    </button>

                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    <button
                        onClick={() => {
                            signOut();
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
