import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Core';
import { TaskService, AuthService } from '../../services/mockService';

export function TaskItem({ task, onUpdate, onDelete }) {
    const isDone = task.status === 'done';

    const toggleStatus = () => {
        onUpdate(task.id, { status: isDone ? 'todo' : 'done' });
    };

    const priorityColor = {
        high: 'text-[var(--danger)]',
        medium: 'text-[var(--warning)]',
        low: 'text-[var(--info)]'
    };

    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] transition-all ${isDone ? 'bg-[var(--bg-app)] opacity-75' : 'bg-[var(--bg-card)]'}`}>
            <button
                onClick={toggleStatus}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-[var(--success)] border-[var(--success)]' : 'border-[var(--text-muted)] hover:border-[var(--primary)]'}`}
            >
                {isDone && <span className="text-white text-xs">✓</span>}
            </button>

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                        {task.title}
                    </h4>
                    <span className={`text-xs font-bold uppercase ${priorityColor[task.priority] || 'text-[var(--text-muted)]'}`}>
                        {task.priority || 'NORMAL'}
                    </span>
                </div>
                {task.remarks && <p className="text-xs text-[var(--text-muted)] mt-1">{task.remarks}</p>}
                {task.dueDate && <p className="text-xs text-[var(--text-muted)] mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
            </div>

            <Button variant="ghost" onClick={() => onDelete(task.id)} className="text-[var(--danger)] px-2">
                ×
            </Button>
        </div>
    );
}

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [priority, setPriority] = useState('medium');
    const [activeView, setActiveView] = useState('todo'); // 'todo', 'done', 'routine'

    // Mock Daily Routine
    const [routine, setRoutine] = useState([
        { id: 'r1', title: 'Morning Workout (30 mins)', done: false },
        { id: 'r2', title: 'Read 10 pages', done: false },
        { id: 'r3', title: 'Drink 3L Water', done: false },
        { id: 'r4', title: 'Plan tomorrow', done: false },
    ]);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        const userId = AuthService.currentUser?.uid;
        if (userId) {
            const data = await TaskService.getAll(userId);
            // Sort by Due Date (soonest first), then Priority
            const sorted = data.sort((a, b) => {
                if (a.status === 'done' && b.status !== 'done') return 1;
                if (a.status !== 'done' && b.status === 'done') return -1;

                // If both todo, sort by due date
                if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
                if (a.dueDate) return -1;
                if (b.dueDate) return 1;

                return 0;
            });
            setTasks(sorted);
        }
        setLoading(false);
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            userId: AuthService.currentUser?.uid,
            title: newTask,
            status: 'todo',
            priority: priority,
            dueDate: newDueDate || null,
            createdAt: new Date().toISOString()
        };

        await TaskService.create(task);
        setNewTask('');
        setNewDueDate('');
        loadTasks();
    };

    const updateTask = async (id, updates) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
        await TaskService.update(id, updates);
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        setTasks(tasks.filter(t => t.id !== id));
        await TaskService.delete(id);
    };

    const toggleRoutine = (id) => {
        setRoutine(routine.map(r => r.id === id ? { ...r, done: !r.done } : r));
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--text-main)]">My Tasks</h2>
                <Button onClick={loadTasks} variant="ghost">Refresh</Button>
            </header>

            {/* Add Task Form */}
            <Card className="p-4">
                <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4 items-end">
                    <Input
                        label="New Task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 w-full"
                    />
                    <Input
                        label="Due Date"
                        type="datetime-local"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full md:w-48"
                    />
                    <div className="flex flex-col gap-1 w-full md:w-32">
                        <label className="text-sm font-medium text-[var(--text-muted)]">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-app)] text-[var(--text-main)] focus:outline-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <Button type="submit" className="w-full md:w-auto">Add Task</Button>
                </form>
            </Card>

            {/* Daily Routine Section */}
            <Card title="Daily Routine">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {routine.map(r => (
                        <div
                            key={r.id}
                            onClick={() => toggleRoutine(r.id)}
                            className={`cursor-pointer p-3 rounded-lg border transition-all flex items-center gap-3 ${r.done ? 'bg-[var(--success)]/10 border-[var(--success)]' : 'bg-[var(--bg-app)] border-[var(--border)] hover:border-[var(--primary)]'}`}
                        >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${r.done ? 'bg-[var(--success)] border-[var(--success)] text-white' : 'border-[var(--text-muted)]'}`}>
                                {r.done && '✓'}
                            </div>
                            <span className={`text-sm font-medium ${r.done ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-main)]'}`}>{r.title}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[var(--border)]">
                <button
                    onClick={() => setActiveView('todo')}
                    className={`pb-2 px-1 font-medium text-sm transition-colors ${activeView === 'todo' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                    Pending ({tasks.filter(t => t.status !== 'done').length})
                </button>
                <button
                    onClick={() => setActiveView('done')}
                    className={`pb-2 px-1 font-medium text-sm transition-colors ${activeView === 'done' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                    Completed
                </button>
            </div>

            {/* Task Lists */}
            <div className="space-y-4 min-h-[300px]">
                {loading ? <p>Loading...</p> : (
                    <>
                        {activeView === 'todo' && (
                            tasks.filter(t => t.status !== 'done').length === 0
                                ? <div className="text-center py-10 text-[var(--text-muted)]">No pending tasks. Great job!</div>
                                : tasks.filter(t => t.status !== 'done').map(task => (
                                    <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
                                ))
                        )}

                        {activeView === 'done' && (
                            tasks.filter(t => t.status === 'done').length === 0
                                ? <div className="text-center py-10 text-[var(--text-muted)]">No completed tasks yet.</div>
                                : tasks.filter(t => t.status === 'done').map(task => (
                                    <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
                                ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
