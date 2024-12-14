export class TodoList {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.todos = [];
        this.init();
    }

    async init() {
        this.todos = await this.storageManager.load('todos');
    }

    async addTodo(todoData) {
        const newTodo = {
            id: crypto.randomUUID(),
            completed: false,
            ...todoData
        }
        if (newTodo.urgency && newTodo.importance) {
            const quadrantMap = {
                'high-high': 1,
                'low-high': 2,
                'high-low': 3,
                'low-low': 4
            };
            newTodo.quadrant = quadrantMap[`${newTodo.urgency}-${newTodo.importance}`];
        } else {
            newTodo.quadrant = 5;
        }
        this.todos.push(newTodo);
        await this.storageManager.save('todos', this.todos);
        return newTodo;
        }

    async deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        await this.storageManager.save('todos', this.todos);
    }

    async editTodo(id, updates = {}) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, ...updates } : todo
        );
        await this.storageManager.save('todos', this.todos);
    }

    filterByProject(projectId) {
        return this.todos.filter(todo => todo.projectId === projectId);
    }
    
    getTodo(id) {
        // Use find to return the matching todo object directly; filter would return an array
        return this.todos.find(todo => todo.id === id);
    }

    async toggleComplete(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        await this.storageManager.save('todos', this.todos);
    }
}

export class Project {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.projects = [];
        this.init();
    }

    async init() {
        this.projects = await this.storageManager.load('projects');

        if (!this.projects || this.projects.length === 0) {
            const defaultProject = {
                id: crypto.randomUUID(),
                name: 'Home',
                isDefault: true
            }
            this.projects = [defaultProject];
            await this.storageManager.save('projects', this.projects);
        }
    }

    async addProject(name) {
        const newProject = {
            id: crypto.randomUUID(),
            name: name
        }
        this.projects.push(newProject);
        await this.storageManager.save('projects', this.projects);
        return newProject;
    }

    async deleteProject(id) {
        this.projects = this.projects.filter(project => project.id !== id);
        await this.storageManager.save('projects', this.projects);
    }

    getProjectName(id) {
        return this.projects.find(project => project.id === id);
    }

    getDefaultProjectId() {
        return this.projects.find(p => p.isDefault)?.id;
    }
}
