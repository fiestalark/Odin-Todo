export class UiManager {
    // todoList class is passed in when UiManager is called in index.js
    constructor(todoList) {
        this.todoList = todoList;
        this.init();
        // Run event listeners as soon as function loads
        this.setupEventListeners();
    }

    async init() {
        await this.todoList.init();
        this.renderTodos();
    }

    renderTodos() {
        document.querySelectorAll('.todo-items').forEach(quadrant => {
            quadrant.innerHTML = '';
        });

        this.todoList.todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            document.getElementById(`quadrant${todo.quadrant}`).appendChild(todoElement);
        })
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
        const project = document.createElement('span');
        project.textContent = todo.project;

        // Edit Icon
        const editIcon = document.createElement('button');
        editIcon.textContent = 'Edit';
        editIcon.classList.add('edit-icon');

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        li.append(checkbox, todoText, project, editIcon, deleteBtn);
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
        const modal = document.getElementById('todo-modal');
        const modalTitle = document.getElementById('modal-title');
        const submitBtn = document.getElementById('submit-btn');
        
        modalTitle.textContent = 'Create a new...';
        submitBtn.textContent = 'ADD TO DO';
        
        // Clear the form
        document.getElementById('todoForm').reset();
        
        // Show the modal
        modal.classList.add('show');
        document.getElementById('modal-backdrop').classList.add('show');
    }

    hideTodoModal() {
        document.getElementById('todo-modal').classList.remove('show');
        document.getElementById('modal-backdrop').classList.remove('show');
    }

    showEditModal(id) {
        const modal = document.getElementById('todo-modal');
        const modalTitle = document.getElementById('modal-title');
        const submitBtn = document.getElementById('submit-btn');
        
        modalTitle.textContent = 'Edit Todo';
        submitBtn.textContent = 'SAVE CHANGES';
        // Show the modal
        modal.classList.add('show');
        document.getElementById('modal-backdrop').classList.add('show');

        const todoToEdit = this.todoList.getTodo(id);
        const todoForm = document.getElementById('todoForm');

        // First reset the form to clear any previous values
        todoForm.reset();

        // Then populate the form fields
        Object.keys(todoToEdit).forEach(key => {
            const element = todoForm.elements[key];
            if (element) {
                if (element.type === 'radio') {
                    // For radio buttons, we need to find and check the correct one
                    const radio = todoForm.querySelector(`input[name="${key}"][value="${todoToEdit[key]}"]`);
                    if (radio) {
                        radio.checked = true;
                    }
                } else {
                    element.value = todoToEdit[key];
                }
            }
        });
    }

    saveEdit() {

    }

    setupEventListeners() {
        // Event listeners for the create todo form
        const todoForm = document.getElementById('todoForm');

        todoForm.addEventListener('submit', async (e) => {
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

            const newTodo = await this.todoList.addTodo(todoData);
            this.addTodoToDisplay(newTodo);
            titleElement.value = '';
            todoForm.querySelectorAll('input[type="radio"]:checked').forEach(input => input.checked = false);
            this.hideTodoModal();
        });

        // Event listeners for the todo items
        document.querySelectorAll('.todo-items').forEach(list => {
            list.addEventListener('click', async (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    const id = e.target.parentElement.dataset.id;
                    await this.todoList.deleteTodo(id);
                    this.deleteTodoFromDisplay(id);
                }
                if (e.target.classList.contains('toggle-checkbox')) {
                    const id = e.target.parentElement.dataset.id;
                    await this.todoList.toggleComplete(id);
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

        // Toggle selected class on urgency/importance radio buttons
        document.querySelectorAll('.radio-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.classList.toggle('selected');
            })
        })
    }
}
