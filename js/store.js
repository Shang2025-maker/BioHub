// Simple reactive store
class Store {
    constructor() {
        this.state = {
            isLoggedIn: false,
            currentRole: 'requester', // 'requester' | 'lab'
            currentUser: null,
            notifications: 3,
            unreadMessages: 5,
            subscription: 'free', // 'free' | 'pro' | 'enterprise'
            aiConfig: {
                model: 'gpt-4o',
                useOwnKey: false,
                apiKey: '',
            },
        };
        this.listeners = new Map();
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        if (oldValue !== value) {
            this.emit(key, value, oldValue);
        }
    }

    on(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        return () => {
            const cbs = this.listeners.get(key);
            const idx = cbs.indexOf(callback);
            if (idx > -1) cbs.splice(idx, 1);
        };
    }

    emit(key, value, oldValue) {
        const cbs = this.listeners.get(key) || [];
        cbs.forEach(cb => cb(value, oldValue));
    }

    toggleRole() {
        const newRole = this.state.currentRole === 'requester' ? 'lab' : 'requester';
        this.set('currentRole', newRole);
        return newRole;
    }

    login(user) {
        this.state.currentUser = user;
        this.state.isLoggedIn = true;
        if (user.role) this.state.currentRole = user.role;
        this.emit('isLoggedIn', true, false);
    }

    logout() {
        this.state.currentUser = null;
        this.state.isLoggedIn = false;
        this.emit('isLoggedIn', false, true);
    }
}

export const store = new Store();
