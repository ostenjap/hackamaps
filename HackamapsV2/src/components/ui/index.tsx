import React from 'react';

export const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-800/80 hover:-translate-y-1 ${className}`}
    >
        {children}
    </div>
);

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'outline' | 'secondary' }) => {
    const styles = {
        default: "bg-blue-900/30 text-blue-400 border-blue-800/50",
        outline: "border-white/20 text-neutral-400",
        secondary: "bg-purple-900/30 text-purple-400 border-purple-800/50"
    };
    return (
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${styles[variant]} uppercase tracking-wider`}>
            {children}
        </span>
    );
};

export const Button = ({ children, onClick, variant = 'primary', className = '', size = 'default' }: any) => {
    const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
    const variants: Record<string, string> = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)]",
        ghost: "hover:bg-white/10 text-neutral-300 hover:text-white",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white"
    };

    const sizes: Record<string, string> = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base"
    };

    return (
        <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size] || ''} ${className}`}>
            {children}
        </button>
    );
};
