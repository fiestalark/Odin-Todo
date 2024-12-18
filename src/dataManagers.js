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
            ...todoData, 
            quadrant: this.calculateQuadrant(todoData.urgency, todoData.importance)
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
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                const updatedTodo = { ...todo, ...updates };
                if (updates.urgency || updates.importance) {
                    updatedTodo.quadrant = this.calculateQuadrant(updatedTodo.urgency, updatedTodo.importance);
                }
                return updatedTodo;
            }
            return todo;
        });

        await this.storageManager.save('todos', this.todos);
        return this.getTodo(id);
    }

    calculateQuadrant(urgency, importance) {
        if (!urgency || !importance) {
            return 5;
        }
        const quadrantMap = {
            'high-high': 1,
            'low-high': 2,
            'high-low': 3,
            'low-low': 4
        };

        return quadrantMap[`${urgency}-${importance}`];
    }

    filterTodos(filters = {}) {
        if (Object.keys(filters).length === 0) {
            return this.todos;
        }

        const filterHandlers = {
            id: (todo, value) => todo.id === value,
            projectId: (todo, value) => todo.projectId === value,
            quadrant: (todo, value) => Number(todo.quadrant) === Number(value),
            dueDate: (todo, value) => {
                // Parse the date in local timezone by appending T00:00
                const todoDate = new Date(`${todo.dueDate}T00:00`);
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const dateHandlers = {
                    today: () => {
                        const isSameDay = 
                            todoDate.getFullYear() === today.getFullYear() &&
                            todoDate.getMonth() === today.getMonth() &&
                            todoDate.getDate() === today.getDate();

                        return isSameDay;
                    },
                    thisWeek: () => {
                        const weekFromNow = new Date(today);
                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                        return todoDate >= today && todoDate <= weekFromNow;
                    }
                };
                return dateHandlers[value]();
            }
        };

        return this.todos.filter(todo => 
            Object.entries(filters).every(([key, value]) => {
                const handler = filterHandlers[key] || (() => true);
                return handler(todo, value);
            })
        );
    }

    getTodoCount(filters = {}) {
        return this.filterTodos(filters).length;
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
