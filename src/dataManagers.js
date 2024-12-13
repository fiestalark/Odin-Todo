export class TodoList {
    constructor() {
        this.todos = [];
    }

        addTodo(todoData) {
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
            return newTodo;
        }

        deleteTodo(id) {
            this.todos = this.todos.filter(todo => todo.id !== id);
        }
        editTodo(id, updates = {}) {
            this.todos = this.todos.map(todo => 
                todo.id === id ? { ...todo, ...updates } : todo
            );
        }
        
        getTodo(id) {
            // Use find to return the matching todo object directly; filter would return an array
            return this.todos.find(todo => todo.id === id);
        }

        toggleComplete(id) {
            this.todos = this.todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
        }
    }
