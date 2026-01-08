// Mock API Client - работает без Base44
// Сохраняет данные в localStorage

const mockServers = [
    { id: 1, country: "США", country_code: "US", city: "Нью-Йорк", load: 35, ping: 120, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 2, country: "США", country_code: "US", city: "Лос-Анджелес", load: 42, ping: 145, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 3, country: "США", country_code: "US", city: "Майами", load: 28, ping: 135, is_premium: true, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 4, country: "Германия", country_code: "DE", city: "Франкфурт", load: 55, ping: 45, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 5, country: "Германия", country_code: "DE", city: "Берлин", load: 38, ping: 48, is_premium: true, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 6, country: "Нидерланды", country_code: "NL", city: "Амстердам", load: 62, ping: 42, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 7, country: "Великобритания", country_code: "GB", city: "Лондон", load: 48, ping: 55, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 8, country: "Великобритания", country_code: "GB", city: "Манчестер", load: 25, ping: 58, is_premium: true, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 9, country: "Франция", country_code: "FR", city: "Париж", load: 51, ping: 50, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 10, country: "Швейцария", country_code: "CH", city: "Цюрих", load: 32, ping: 40, is_premium: true, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 11, country: "Япония", country_code: "JP", city: "Токио", load: 45, ping: 180, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 12, country: "Япония", country_code: "JP", city: "Осака", load: 28, ping: 175, is_premium: true, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 13, country: "Сингапур", country_code: "SG", city: "Сингапур", load: 58, ping: 160, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 14, country: "Австралия", country_code: "AU", city: "Сидней", load: 35, ping: 220, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
    { id: 15, country: "Канада", country_code: "CA", city: "Торонто", load: 40, ping: 130, is_premium: false, status: "online", created_date: new Date().toISOString(), updated_date: new Date().toISOString() },
];

class MockEntity {
    constructor(name, initialData = []) {
        this.name = name;
        this.data = JSON.parse(localStorage.getItem(`mock_${name}`) || JSON.stringify(initialData));
    }

    save() {
        localStorage.setItem(`mock_${this.name}`, JSON.stringify(this.data));
    }

    list(sort = '-updated_date', limit = 50) {
        let result = [...this.data];
        if (sort.startsWith('-')) {
            result.sort((a, b) => new Date(b[sort.slice(1)]) - new Date(a[sort.slice(1)]));
        } else {
            result.sort((a, b) => new Date(a[sort]) - new Date(b[sort]));
        }
        return result.slice(0, limit);
    }

    filter(query = {}, sort = '-updated_date', limit = 50) {
        let result = this.data.filter(item => {
            return Object.entries(query).every(([key, value]) => item[key] === value);
        });
        if (sort.startsWith('-')) {
            result.sort((a, b) => new Date(b[sort.slice(1)]) - new Date(a[sort.slice(1)]));
        }
        return result.slice(0, limit);
    }

    create(data) {
        const id = Math.max(...this.data.map(d => d.id || 0), 0) + 1;
        const newItem = {
            ...data,
            id,
            created_date: new Date().toISOString(),
            updated_date: new Date().toISOString()
        };
        this.data.push(newItem);
        this.save();
        return newItem;
    }

    update(id, data) {
        const index = this.data.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data[index] = {
                ...this.data[index],
                ...data,
                updated_date: new Date().toISOString()
            };
            this.save();
            return this.data[index];
        }
        return null;
    }

    delete(id) {
        this.data = this.data.filter(d => d.id !== id);
        this.save();
    }

    schema() {
        return {};
    }
}

class MockAuth {
    constructor() {
        const stored = localStorage.getItem('mock_user');
        this.currentUser = stored ? JSON.parse(stored) : null;
    }

    async me() {
        if (!this.currentUser) {
            throw new Error('Not authenticated');
        }
        return this.currentUser;
    }

    async updateMe(data) {
        this.currentUser = { ...this.currentUser, ...data };
        localStorage.setItem('mock_user', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    async isAuthenticated() {
        return !!this.currentUser;
    }

    redirectToLogin(nextUrl = '/') {
        // Demo login - создаём тестового пользователя
        const user = {
            id: 'demo-user-123',
            email: 'demo@nexusvpn.com',
            full_name: 'Demo User',
            role: 'user'
        };
        this.currentUser = user;
        localStorage.setItem('mock_user', JSON.stringify(user));
        window.location.href = nextUrl || '/';
    }

    logout(redirectUrl = '/') {
        this.currentUser = null;
        localStorage.removeItem('mock_user');
        window.location.href = redirectUrl || '/';
    }
}

// Export mock base44 client
export const base44 = {
    entities: {
        Server: new MockEntity('Server', mockServers),
        Subscription: new MockEntity('Subscription', []),
        Payment: new MockEntity('Payment', []),
        SupportTicket: new MockEntity('SupportTicket', []),
    },
    auth: new MockAuth(),
    users: {
        inviteUser: (email, role) => Promise.resolve({ success: true })
    }
};