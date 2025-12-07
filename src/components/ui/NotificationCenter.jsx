import { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../ui/Core';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Welcome!', message: 'Welcome to your Personal Manager.', time: 'Just now', read: false },
        { id: 2, title: 'Task Reminder', message: 'Review your weekly goals.', time: '2h ago', read: false },
        { id: 3, title: 'Budget Alert', message: 'You spent 80% of your daily budget.', time: '5h ago', read: true },
    ]);
    const btnRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    const toggle = () => setIsOpen(!isOpen);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            <button
                ref={btnRef}
                onClick={toggle}
                className="relative p-2 rounded-full hover:bg-[var(--bg-app)] transition-colors"
            >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 z-50">
                    <Card className="shadow-xl border-[var(--border)] max-h-96 overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">Notifications</h3>
                            <button
                                onClick={markAllRead}
                                className="text-xs text-[var(--primary)] hover:underline"
                            >
                                Mark all read
                            </button>
                        </div>

                        <div className="space-y-2">
                            {notifications.length === 0 ? <p className="text-sm text-[var(--text-muted)]">No notifications.</p> : (
                                notifications.map(n => (
                                    <div key={n.id} className={`p-2 rounded-md ${n.read ? 'opacity-50' : 'bg-[var(--bg-app)]'}`}>
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-sm">{n.title}</p>
                                            <span className="text-[10px] text-[var(--text-muted)]">{n.time}</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">{n.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
