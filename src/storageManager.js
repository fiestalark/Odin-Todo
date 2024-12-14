export class StorageManager {
    // Build async to support transition to databases later

    async load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch(error) {
            console.error(`Error loading ${key}:`, error);
            return [];
        }
    }

    async save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch(error) {
            console.error(`Error saving ${key}:`, error);
        }
    }
}
