import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Core';

export default function QuickActionFAB({ onAction }) {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { id: 'task', label: 'Add Task', icon: '📝', color: 'bg-blue-500' },
        { id: 'expense', label: 'Log Expense', icon: '💰', color: 'bg-green-500' },
        { id: 'water', label: 'Track Water', icon: '💧', color: 'bg-cyan-500' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex flex-col items-end gap-3"
                    >
                        {actions.map((action, index) => (
                            <motion.button
                                key={action.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => { onAction(action.id); setIsOpen(false); }}
                                className="flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] shadow-lg hover:bg-[var(--bg-app)] transition-colors group"
                            >
                                <span className="text-sm font-medium text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                                    {action.label}
                                </span>
                                <div className={`w-8 h-8 rounded-full ${action.color} text-white flex items-center justify-center text-xs shadow-md`}>
                                    {action.icon}
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl text-white transition-all duration-300 ${isOpen ? 'bg-[var(--danger)] rotate-45' : 'bg-[var(--primary)] rotate-0'}`}
            >
                +
            </motion.button>
        </div>
    );
}
