/**
 * Mock Service Adapter
 * Simulates Firestore CRUD operations with local storage persistence.
 */

const STORAGE_KEYS = {
    USERS: 'pm_users',
    TASKS: 'pm_tasks',
    EXPENSES: 'pm_expenses',
    WORKOUTS: 'pm_workouts',
    INVESTMENTS: 'pm_investments',
};

// Helper to simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

class MockService {
    constructor(collectionKey) {
        this.key = collectionKey;
    }

    _getData() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    _saveData(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    async getAll(userId) {
        await delay();
        const all = this._getData();
        if (!userId) return all;
        return all.filter(item => item.userId === userId);
    }

    async getById(id) {
        await delay();
        const all = this._getData();
        return all.find(item => item.id === id) || null;
    }

    async create(item) {
        await delay();
        const all = this._getData();
        const newItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        all.push(newItem);
        this._saveData(all);
        return newItem;
    }

    async update(id, updates) {
        await delay();
        const all = this._getData();
        const index = all.findIndex(item => item.id === id);
        if (index === -1) throw new Error('Item not found');

        all[index] = { ...all[index], ...updates, updatedAt: new Date().toISOString() };
        this._saveData(all);
        return all[index];
    }

    async delete(id) {
        await delay();
        const all = this._getData();
        const filtered = all.filter(item => item.id !== id);
        this._saveData(filtered);
        return true;
    }
}

export const UserService = new MockService(STORAGE_KEYS.USERS);
export const TaskService = new MockService(STORAGE_KEYS.TASKS);
export const ExpenseService = new MockService(STORAGE_KEYS.EXPENSES);
export const WorkoutService = new MockService(STORAGE_KEYS.WORKOUTS);
export const InvestmentService = new MockService(STORAGE_KEYS.INVESTMENTS);

// Mock Auth
export const AuthService = {
    currentUser: null,

    async login(email, password) {
        await delay(800);
        // Simulating login - in real mock, we might check a hardcoded user or just allow any
        const user = {
            uid: 'user_123',
            email,
            displayName: 'Augustus',
            emailVerified: true
        };
        this.currentUser = user;
        localStorage.setItem('pm_current_user', JSON.stringify(user));
        return user;
    },

    async logout() {
        await delay(300);
        this.currentUser = null;
        localStorage.removeItem('pm_current_user');
    },

    // Initialize from local storage
    init() {
        const stored = localStorage.getItem('pm_current_user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }
};
AuthService.init();
