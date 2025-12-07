import { useState } from 'react';
import { Button } from '../ui/Core';
import NotificationCenter from '../ui/NotificationCenter';

export function Sidebar({ activeTab, onTabChange }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'tasks', label: 'To-Do List', icon: '✓' },
        { id: 'expenses', label: 'Expenses', icon: '💰' },
        { id: 'health', label: 'Health', icon: '💪' },
        { id: 'investments', label: 'Investments', icon: '📈' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--bg-card)] border-r border-[var(--border)] p-4 flex flex-col transition-transform transform -translate-x-full md:translate-x-0 z-20">
            <div className="mb-8 px-2 flex justify-between items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                    LifeManager
                </h1>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                ? 'bg-[var(--primary)] text-white shadow-md'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-app)] hover:text-[var(--text-main)]'
                            }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="mt-auto px-2 py-4 border-t border-[var(--border)] space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Notifications</span>
                    <NotificationCenter />
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] font-bold">
                        A
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-[var(--text-main)]">Augustus</p>
                        <p className="text-xs text-[var(--text-muted)]">augustus@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export function MobileHeader({ onMenuClick }) {
    return (
        <header className="md:hidden flex items-center justify-between p-4 bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onMenuClick}>☰</Button>
                <h1 className="font-bold text-[var(--text-main)]">LifeManager</h1>
            </div>
            <NotificationCenter />
        </header>
    );
}

export function AppLayout({ children, activeTab, onTabChange }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)]">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar activeTab={activeTab} onTabChange={(tab) => { onTabChange(tab); setIsMobileMenuOpen(false); }} />
            </div>

            <div className="md:pl-64 transition-all duration-300">
                <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
