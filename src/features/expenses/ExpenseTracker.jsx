import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Core';
import { ExpenseService, AuthService } from '../../services/mockService';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Salary', 'Investment', 'Other'];

export default function ExpenseTracker() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        amount: '',
        category: 'Food',
        description: '',
        type: 'expense'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const userId = AuthService.currentUser?.uid;
        if (userId) {
            const data = await ExpenseService.getAll(userId);
            setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.amount || !form.description) return;

        const newTx = {
            userId: AuthService.currentUser?.uid,
            amount: parseFloat(form.amount),
            category: form.type === 'income' ? 'Salary' : form.category,
            description: form.description,
            type: form.type,
            date: new Date().toISOString()
        };

        await ExpenseService.create(newTx);
        setForm({ ...form, amount: '', description: '' });
        loadData();
    };

    const deleteTx = async (id) => {
        if (confirm('Delete this transaction?')) {
            await ExpenseService.delete(id);
            setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    // Stats
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;

    // Category Breakdown
    const byCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const maxCategory = Math.max(...Object.values(byCategory), 1);

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-2xl font-bold text-[var(--text-main)]">Expense Tracker</h2>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-[var(--info)]">
                    <p className="text-[var(--text-muted)] text-sm">Total Balance</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">AED {balance.toFixed(2)}</p>
                </Card>
                <Card className="border-l-4 border-l-[var(--success)]">
                    <p className="text-[var(--text-muted)] text-sm">Total Income</p>
                    <p className="text-2xl font-bold text-[var(--success)]">+ AED {income.toFixed(2)}</p>
                </Card>
                <Card className="border-l-4 border-l-[var(--danger)]">
                    <p className="text-[var(--text-muted)] text-sm">Total Expenses</p>
                    <p className="text-2xl font-bold text-[var(--danger)]">- AED {expense.toFixed(2)}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form & History */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Add Transaction">
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="flex gap-4">
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={form.type === 'expense'}
                                            onChange={() => setForm({ ...form, type: 'expense' })}
                                        /> Expense
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={form.type === 'income'}
                                            onChange={() => setForm({ ...form, type: 'income' })}
                                        /> Income
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    required
                                />
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={form.amount}
                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {form.type === 'expense' && (
                                <select
                                    className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-app)] text-[var(--text-main)]"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            )}

                            <Button type="submit" variant={form.type === 'income' ? 'primary' : 'danger'}>
                                {form.type === 'income' ? 'Add Income' : 'Add Expense'}
                            </Button>
                        </form>
                    </Card>

                    <Card title="Recent Transactions">
                        {loading ? <p>Loading...</p> : (
                            <div className="space-y-3">
                                {transactions.length === 0 ? <p className="text-[var(--text-muted)]">No transactions yet.</p> :
                                    transactions.map(tx => (
                                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-app)]">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {tx.type === 'income' ? '💰' : '💸'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[var(--text-main)]">{tx.description}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">{new Date(tx.date).toLocaleDateString()} • {tx.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold ${tx.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--text-main)]'}`}>
                                                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toFixed(2)}
                                                </span>
                                                <button onClick={() => deleteTx(tx.id)} className="text-[var(--text-muted)] hover:text-[var(--danger)]">×</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Breakdown */}
                <div className="space-y-6">
                    <Card title="Spending by Category">
                        {Object.keys(byCategory).length === 0 ? <p className="text-[var(--text-muted)]">No expense data.</p> : (
                            <div className="space-y-4">
                                {Object.entries(byCategory).sort(([, a], [, b]) => b - a).map(([cat, val]) => (
                                    <div key={cat}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{cat}</span>
                                            <span className="font-medium">{val.toFixed(2)}</span>
                                        </div>
                                        <div className="h-2 bg-[var(--bg-app)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--danger)]"
                                                style={{ width: `${(val / maxCategory) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
