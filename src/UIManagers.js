import { TodoList } from './dataManagers.js';

export function UIManager() {
    const todoList = new TodoList();

    document.getElementById('todoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('todoInput');
        if (input.value.trim()) {
            todoList.addTodo(input.value);
            input.value = '';
        }
        todoList.displayTodos();
    })
}
