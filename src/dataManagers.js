export class TodoList {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.todos = [];
        this.init();
    }

    async init() {
        this.todos = await this.storageManager.loadTodos();
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
        await this.storageManager.saveTodos(this.todos);
        return newTodo;
        }

    async deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        await this.storageManager.saveTodos(this.todos);
    }

    async editTodo(id, updates = {}) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, ...updates } : todo
        );
        await this.storageManager.saveTodos(this.todos);
    }

    async filterByProject(project) {
        return this.todos.filter(todo => todo.project === project);
        // Might want to filter by project id? but that might need a project class, will need when I add ability to create a project
    }
    
    getTodo(id) {
        // Use find to return the matching todo object directly; filter would return an array
        return this.todos.find(todo => todo.id === id);
    }

    async toggleComplete(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        await this.storageManager.saveTodos(this.todos);
    }
}

export class Project {
    constructor() {
        this.projects = [];
    }

    addProject(name) {
        const newProject = {
            id: crypto.randomUUID(),
            name: name
        }
        this.projects.push(newProject);
        return newProject;
    }

    deleteProject(id) {
        this.projects = this.projects.filter(project => project.id !== id);
    }
}
