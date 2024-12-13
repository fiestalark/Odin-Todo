export class StorageManager {
    constructor() {
        this.storageKey = 'todos'; // Key used in localStorage
    }

    // Build async to support transition to databases later

    async loadTodos() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch(error) {
            console.error('Error loading todos:', error);
            return [];
        }
    }

    async saveTodos(todos) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(todos));
        } catch(error) {
            console.error('Error saving todos:', error);
        }
    }
}
