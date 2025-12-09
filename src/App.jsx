import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from './components/layout/Layout';
import { Card } from './components/ui/Core';
import TaskList from './features/tasks/TaskList';
import ExpenseTracker from './features/expenses/ExpenseTracker';
import HealthMonitor from './features/health/HealthMonitor';
import InvestmentTracker from './features/investments/InvestmentTracker';
import { AuthService, TaskService, ExpenseService } from './services/mockService';
import MorningBriefing from './components/dashboard/MorningBriefing';
import QuickActionFAB from './components/ui/QuickActionFAB';

// Dashboard View using new components
const DashboardView = ({ onNavigate, stats }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    <MorningBriefing taskCount={stats.pendingTasks} spentToday={stats.spentToday} />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="Quick Tasks" className="h-full">
        {stats.topTasks.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] mt-4">No pending tasks.</p>
        ) : (
          <div className="space-y-3 mt-2">
            {stats.topTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-app)]/50">
                <input type="checkbox" className="rounded text-[var(--primary)]" />
                <span className="text-sm truncate">{task.title}</span>
              </div>
            ))}
            <button
              onClick={() => onNavigate('tasks')}
              className="w-full text-center text-xs text-[var(--primary)] font-medium hover:underline mt-2"
            >
              View all tasks →
            </button>
          </div>
        )}
      </Card>

      <Card title="Recent Spending" className="h-full">
        {stats.recentTx.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] mt-4">No recent activity.</p>
        ) : (
          <div className="space-y-4 mt-2">
            {stats.recentTx.map(tx => (
              <div key={tx.id} className="flex justify-between items-center text-sm">
                <span className="truncate max-w-[120px]">{tx.description}</span>
                <span className={`font-bold ${tx.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--accent)]'}`}>
                  {tx.type === 'income' ? '+' : '-'} AED {tx.amount}
                </span>
              </div>
            ))}
            <div className="w-full h-2 bg-[var(--bg-app)] rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[var(--accent)] w-[65%]" />
            </div>
            <p className="text-xs text-[var(--text-muted)] text-right">Budget Overview</p>
          </div>
        )}
      </Card>

      <Card title="Health Stats" className="h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🏃</div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="text-center p-3 rounded-lg bg-[var(--bg-app)]/50">
            <div className="text-2xl font-bold text-[var(--warning)]">420</div>
            <div className="text-xs text-[var(--text-muted)]">Active Kcal</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-[var(--bg-app)]/50">
            <div className="text-2xl font-bold text-blue-400">1.2L</div>
            <div className="text-xs text-[var(--text-muted)]">Water</div>
          </div>
        </div>
      </Card>
    </div>
  </motion.div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    pendingTasks: 0,
    spentToday: 0,
    topTasks: [],
    recentTx: []
  });

  useEffect(() => {
    const init = async () => {
      // Auto-login for dev if not logged in
      const user = AuthService.currentUser || await AuthService.login('augustus@example.com', 'password');
      if (user) {
        // Load data for dashboard
        await loadDashboardData(user.uid);
      }
      setLoading(false);
    };
    init();
  }, [activeTab]); // Reload when switching back to dashboard

  const loadDashboardData = async (userId) => {
    const tasks = await TaskService.getAll(userId);
    const expenses = await ExpenseService.getAll(userId);

    const pending = tasks.filter(t => t.status !== 'done');
    const moneySpent = expenses
      .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === new Date().toDateString())
      .reduce((acc, t) => acc + t.amount, 0);

    setDashboardStats({
      pendingTasks: pending.length,
      spentToday: moneySpent,
      topTasks: pending.sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999')).slice(0, 3),
      recentTx: expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
    });
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick Action Triggered:', actionId);
    if (actionId === 'task') setActiveTab('tasks');
    if (actionId === 'expense') setActiveTab('expenses');
    if (actionId === 'water') setActiveTab('health');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[var(--text-muted)] font-medium animate-pulse">Initializing LifeManager...</div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView onNavigate={setActiveTab} stats={dashboardStats} />;
      case 'tasks': return <TaskList />;
      case 'expenses': return <ExpenseTracker />;
      case 'health': return <HealthMonitor />;
      case 'investments': return <InvestmentTracker />;
      default: return <DashboardView onNavigate={setActiveTab} stats={dashboardStats} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <QuickActionFAB onAction={handleQuickAction} />
    </AppLayout>
  );
}

export default App;
