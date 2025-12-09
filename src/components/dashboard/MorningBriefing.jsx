import { motion } from 'framer-motion';

export default function MorningBriefing({ taskCount = 0, spentToday = 0 }) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
        >
            <p className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wider mb-2">{today}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Good Morning, <br />
                <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
                    Augustine
                </span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg max-w-xl">
                You have <strong className="text-[var(--text-main)]">{taskCount} active tasks</strong> today,
                and have tracked <strong className="text-[var(--text-main)]">AED {spentToday}</strong> in expenses.
                Let's make today productive.
            </p>
        </motion.div>
    );
}
