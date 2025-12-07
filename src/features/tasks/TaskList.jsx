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
    const [priority, setPriority] = useState('medium');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        const userId = AuthService.currentUser?.uid;
        if (userId) {
            const data = await TaskService.getAll(userId);
            // Sort by status (todo first) then precedence or date
            const sorted = data.sort((a, b) => {
                if (a.status === b.status) return 0;
                return a.status === 'done' ? 1 : -1;
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
            createdAt: new Date().toISOString()
        };

        await TaskService.create(task);
        setNewTask('');
        loadTasks();
    };

    const updateTask = async (id, updates) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
        await TaskService.update(id, updates);
        // Reload to ensure sync? Or mostly fine.
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        setTasks(tasks.filter(t => t.id !== id));
        await TaskService.delete(id);
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--text-main)]">My Tasks</h2>
                <Button onClick={loadTasks} variant="ghost">Refresh</Button>
            </header>

            {/* Add Task Form */}
            <Card className="p-4">
                <form onSubmit={addTask} className="flex gap-2 items-end">
                    <Input
                        label="New Task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1"
                    />
                    <div className="flex flex-col gap-1 w-32">
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
                    <Button type="submit">Add Task</Button>
                </form>
            </Card>

            {/* Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="space-y-4">
                    <h3 className="font-semibold text-[var(--text-muted)] uppercase text-sm tracking-wider">To Do</h3>
                    {loading ? <p>Loading...</p> : (
                        tasks.filter(t => t.status !== 'done').length === 0
                            ? <p className="text-[var(--text-muted)] italic">No pending tasks.</p>
                            : tasks.filter(t => t.status !== 'done').map(task => (
                                <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
                            ))
                    )}
                </section>

                <section className="space-y-4">
                    <h3 className="font-semibold text-[var(--text-muted)] uppercase text-sm tracking-wider">Completed</h3>
                    {tasks.filter(t => t.status === 'done').map(task => (
                        <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
                    ))}
                </section>
            </div>
        </div>
    );
}
