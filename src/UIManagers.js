export class UiManager {
    // todoList class is passed in when UiManager is called in index.js
    constructor(todoList) {
        this.todoList = todoList;
        // Run event listeners as soon as function loads
        this.setupEventListeners();
    }

    getTodoElement(id) {
        return document.querySelector(`li[data-id="${id}"]`);
    }

    createTodoElement(todo) {
            console.log(todo);
            const li = document.createElement('li');
            li.dataset.id = todo.id;

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.classList.add('toggle-checkbox');

            // todo text
            const todoText = document.createElement('span');
            todoText.textContent = todo.title;
            todoText.classList.add('todo-text');
            if (todo.completed) {
                todoText.classList.add('completed');
            }

            // Edit Icon
            const editIcon = document.createElement('button');
            editIcon.textContent = 'Edit';
            editIcon.classList.add('edit-icon');

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');

            li.append(checkbox, todoText, editIcon, deleteBtn);
            return li;
    }

    addTodoToDisplay(todo) {
        const todoElement = this.createTodoElement(todo);
        document.getElementById('todoList').appendChild(todoElement);
    }

    toggleTodoComplete(id) {
        const todoElement = this.getTodoElement(id);
        todoElement.querySelector('.todo-text').classList.toggle('completed');
        const checkbox = todoElement.querySelector('.toggle-checkbox');
        checkbox.checked= !checkbox.checked;
    }

    deleteTodoFromDisplay(id) {
        const todoElement = this.getTodoElement(id);
        todoElement.remove();
    }

    showCreateTodoModal() {
        document.getElementById('create-todo-modal').classList.add('show');
        document.getElementById('modal-backdrop').classList.add('show');
    }

    hideCreateTodoModal() {
        document.getElementById('create-todo-modal').classList.remove('show');
        document.getElementById('modal-backdrop').classList.remove('show');
    }

    showEditModal(id) {
        const editModal = document.getElementById('edit-modal');
        editModal.classList.add('show');
        document.getElementById('modal-backdrop').classList.add('show');
        const todoToEdit = this.todoList.getTodo(id);
        editModal.querySelector('#edit-todo-title').value = todoToEdit.title;
    }

    closeEditModal() {
        const editModal = document.getElementById('edit-modal');
        editModal.classList.remove('show');
        document.getElementById('modal-backdrop').classList.remove('show');
    }
    saveEdit() {

    }

    setupEventListeners() {
        const todoForm = document.getElementById('todoForm');

        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Get title, priority, urgency
            const title = todoForm.querySelector('#title');
            const priority = todoForm.querySelector('input[name="priority"]:checked');
            const urgency = todoForm.querySelector('input[name="urgency"]:checked');
            
            if (title.value.trim()) {
                const todoData = {
                    title: title.value
                };

                if (priority) {
                    todoData.priority = priority.value;
                }
                if (urgency) {
                    todoData.urgency = urgency.value;
                }

                const newTodo = this.todoList.addTodo(todoData);
                this.addTodoToDisplay(newTodo);
                title.value = '';
                todoForm.querySelectorAll('input[type="radio"]:checked').forEach(input => input.checked = false);
                this.hideCreateTodoModal();
            }
        });

        document.getElementById('todoList').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.parentElement.dataset.id;
                this.todoList.deleteTodo(id);
                this.deleteTodoFromDisplay(id);
            }
            if (e.target.classList.contains('toggle-checkbox')) {
                const id = e.target.parentElement.dataset.id;
                this.todoList.toggleComplete(id);
                this.toggleTodoComplete(id);
            }
            if (e.target.classList.contains('edit-icon')) {
                const id = e.target.parentElement.dataset.id;
                this.showEditModal(id);
            }
        });

        document.getElementById('add-btn').addEventListener('click', (e) => {
            this.showCreateTodoModal();
        })

        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('close-button')) {
                this.closeEditModal();
            }
            if (e.target.classList.contains('confirm-button')) {
                this.saveEdit();
            }
        })
    }
}
