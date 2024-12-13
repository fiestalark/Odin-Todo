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
