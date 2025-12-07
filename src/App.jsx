import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/Layout';
import { Card } from './components/ui/Core';
import TaskList from './features/tasks/TaskList';
import ExpenseTracker from './features/expenses/ExpenseTracker';
import HealthMonitor from './features/health/HealthMonitor';
import InvestmentTracker from './features/investments/InvestmentTracker';
import { AuthService } from './services/mockService';

// Placeholder Views for now
const DashboardView = () => (
  <div className="space-y-6">
    <header>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">Hello, Augustus</h2>
      <p className="text-[var(--text-muted)]">Here's your daily overview.</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Tasks Pending">
        <div className="text-4xl font-bold text-[var(--primary)]">3</div>
        <p className="text-sm text-[var(--text-muted)]">1 High Priority</p>
      </Card>
      <Card title="Today's Spend">
        <div className="text-4xl font-bold text-[var(--accent)]">AED 120</div>
        <p className="text-sm text-[var(--text-muted)]">Grocery & Transport</p>
      </Card>
      <Card title="Health">
        <div className="text-4xl font-bold text-[var(--warning)]">420</div>
        <p className="text-sm text-[var(--text-muted)]">kcal burned</p>
      </Card>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Auto-login for dev if not logged in
      if (!AuthService.currentUser) {
        await AuthService.login('augustus@example.com', 'password');
      }
      setLoading(false);
    };
    init();
  }, []);

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
      case 'dashboard': return <DashboardView />;
      case 'tasks': return <TaskList />;
      case 'expenses': return <ExpenseTracker />;
      case 'health': return <HealthMonitor />;
      case 'investments': return <InvestmentTracker />;
      default: return <DashboardView />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AppLayout>
  );
}

export default App;
