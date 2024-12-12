export class TodoList {
    constructor() {
        this.todos = [];
    }

        addTodo(title) {
            this.todos.push({
                title,
                completed: false,
                id: crypto.randomUUID()
            });
            this.displayTodos();
        }

        deleteTodo(id) {
            this.todos = this.todos.filter(todo => todo.id !== id);
        }

        toggleComplete(id) {
            
        }

        displayTodos() {
            const todoList = document.querySelector('#todoList');
            todoList.innerHTML = '';

            this.todos.forEach(todo => {
                const li = document.createElement('li');
                const todoSpan = document.createElement('span');
                todoSpan.textContent = todo.title;
                todo.completed ? todoSpan.classList.add('complete') : '';
                li.appendChild(todoSpan);
                todoList.appendChild(li);
            });
        }
    }
