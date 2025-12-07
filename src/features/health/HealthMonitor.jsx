import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Core';
import { WorkoutService, AuthService } from '../../services/mockService';

export default function HealthMonitor() {
    const [workouts, setWorkouts] = useState([]);
    const [calories, setCalories] = useState(0); // Daily calories (mock)
    const [newWorkout, setNewWorkout] = useState({ type: 'Strength', duration: 30, notes: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const userId = AuthService.currentUser?.uid;
        if (userId) {
            const data = await WorkoutService.getAll(userId);
            setWorkouts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            // Mock calorie loading - normally from a diet service
            setCalories(Math.floor(Math.random() * 500) + 1500);
        }
    };

    const logWorkout = async (e) => {
        e.preventDefault();
        await WorkoutService.create({
            userId: AuthService.currentUser?.uid,
            ...newWorkout,
            date: new Date().toISOString()
        });
        setNewWorkout({ type: 'Strength', duration: 30, notes: '' });
        loadData();
    };

    const addCalories = (amount) => {
        setCalories(c => c + amount);
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--text-main)]">Health Monitor</h2>
                <div className="text-right">
                    <p className="text-sm text-[var(--text-muted)]">Today's Goal</p>
                    <p className="font-bold text-[var(--success)]">2,200 Kcal</p>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <p className="text-3xl font-bold text-[var(--primary)]">{calories}</p>
                    <p className="text-xs text-[var(--text-muted)]">Calories Consumed</p>
                    <div className="flex justify-center gap-2 mt-2">
                        <Button variant="ghost" className="text-xs px-2 py-1 bg-[var(--bg-app)]" onClick={() => addCalories(100)}>+100</Button>
                        <Button variant="ghost" className="text-xs px-2 py-1 bg-[var(--bg-app)]" onClick={() => addCalories(500)}>+500</Button>
                    </div>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-[var(--accent)]">{workouts.length}</p>
                    <p className="text-xs text-[var(--text-muted)]">Workouts This Week</p>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-[var(--warning)]">72</p>
                    <p className="text-xs text-[var(--text-muted)]">Kg Weight</p>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-[var(--info)]">7h</p>
                    <p className="text-xs text-[var(--text-muted)]">Sleep Avg</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Log Workout */}
                <Card title="Log Log Workout">
                    <form onSubmit={logWorkout} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-[var(--text-muted)]">Type</label>
                                <select
                                    className="px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-app)] text-[var(--text-main)] outline-none"
                                    value={newWorkout.type}
                                    onChange={e => setNewWorkout({ ...newWorkout, type: e.target.value })}
                                >
                                    <option>Strength</option>
                                    <option>Cardio</option>
                                    <option>HIIT</option>
                                    <option>Yoga</option>
                                    <option>Sports</option>
                                </select>
                            </div>
                            <Input
                                type="number"
                                label="Duration (min)"
                                value={newWorkout.duration}
                                onChange={e => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                            />
                        </div>
                        <Input
                            label="Notes"
                            placeholder="e.g. Chest & Triceps, 5k Run..."
                            value={newWorkout.notes}
                            onChange={e => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                        />
                        <Button type="submit" className="w-full">Log Session</Button>
                    </form>
                </Card>

                {/* History */}
                <Card title="Recent Activity">
                    {workouts.length === 0 ? <p className="text-[var(--text-muted)] text-sm">No workouts logged yet.</p> : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {workouts.map(w => (
                                <div key={w.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-app)]">
                                    <div>
                                        <p className="font-bold text-[var(--text-main)]">{w.type}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{new Date(w.date).toLocaleDateString()} • {w.notes || 'No notes'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[var(--accent)]">{w.duration} min</p>
                                        <p className="text-xs text-[var(--text-muted)]">~{w.duration * 5} kcal</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
