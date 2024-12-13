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

        // Project

        // Importance & urgency
        const importance = document.createElement('span');
        importance.textContent = `Importance: ${todo.importance}`;
        const urgency = document.createElement('span');
        urgency.textContent = `Urgency: ${todo.urgency}`;

        // Edit Icon
        const editIcon = document.createElement('button');
        editIcon.textContent = 'Edit';
        editIcon.classList.add('edit-icon');

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        li.append(checkbox, todoText, importance, urgency, editIcon, deleteBtn);
        return li;
    }

    addTodoToDisplay(todo) {
        const todoElement = this.createTodoElement(todo);
        document.getElementById(`quadrant${todo.quadrant}`).appendChild(todoElement);
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

    showTodoModal() {
        document.getElementById('todo-modal').classList.add('show');
        document.getElementById('modal-backdrop').classList.add('show');
    }

    hideTodoModal() {
        document.getElementById('todo-modal').classList.remove('show');
        document.getElementById('modal-backdrop').classList.remove('show');
    }

    showEditModal(id) {
        const editModal = document.getElementById('todo-modal');
        editModal.classList.add('show');
        document.getElementById('modal-backdrop').classList.add('show');
        const todoToEdit = this.todoList.getTodo(id);
        editModal.querySelector('#todoForm #title').value = todoToEdit.title;
    }

    saveEdit() {

    }

    setupEventListeners() {
        const todoForm = document.getElementById('todoForm');

        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Get title, importance, urgency
            const titleElement = todoForm.querySelector('#title');
            const title = titleElement.value.trim();
            const details = todoForm.querySelector('#details')?.value || '';
            const project = todoForm.querySelector('#project')?.value || 'Home';
            const dueDate = todoForm.querySelector('#due-date')?.value || '';
            const importance = todoForm.querySelector('input[name="importance"]:checked')?.value || '';
            const urgency = todoForm.querySelector('input[name="urgency"]:checked')?.value || '';

            if (!title) {
                console.error('Title is required!');
                return;
            }

            const todoData = { title, details, project, dueDate, importance, urgency };

            const newTodo = this.todoList.addTodo(todoData);
            this.addTodoToDisplay(newTodo);
            titleElement.value = '';
            todoForm.querySelectorAll('input[type="radio"]:checked').forEach(input => input.checked = false);
            this.hideTodoModal();
        });

        document.querySelectorAll('.todo-list').forEach(list => {
            list.addEventListener('click', (e) => {
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
        });

        document.getElementById('add-btn').addEventListener('click', (e) => {
            this.showTodoModal();
        })
        document.getElementById('close-todo-modal').addEventListener('click', (e) => {
            this.hideTodoModal();
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
