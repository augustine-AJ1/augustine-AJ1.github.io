
/* Button Component */
export function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[var(--primary)] text-white hover:brightness-110",
        secondary: "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-app)]",
        danger: "bg-[var(--danger)] text-white hover:brightness-110",
        ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-app)]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

/* Card Component with Glassmorphism & Animation */
import { motion } from 'framer-motion';

export function Card({ children, className = '', title, actions, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
                bg-[var(--bg-card)]/80 backdrop-blur-md 
                border border-[var(--border)]/50 
                rounded-xl shadow-lg p-5 
                hover:shadow-xl hover:border-[var(--primary)]/30 
                transition-all duration-300
                ${className}
            `}
            {...props}
        >
            {(title || actions) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">{title}</h3>}
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </motion.div>
    );
}

/* Input Component */
export function Input({ label, error, className = '', ...props }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="text-sm font-medium text-[var(--text-muted)]">{label}</label>}
            <input
                className="px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-app)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                {...props}
            />
            {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
        </div>
    );
}
