import deleteIconSrc from './images/delete-icon.svg';
import editIconSrc from './images/edit-icon.svg';

export class UiManager {
    // todoList class is passed in when UiManager is called in index.js
    constructor(todoList, projects) {
        this.todoList = todoList;
        this.projectsList = projects;
        this.init();
        // Run event listeners as soon as function loads
        this.setupEventListeners();
    }

    async init() {
        await this.todoList.init();
        await this.projectsList.init();
        this.renderTodos(this.todoList.todos);
        this.renderProjects();
    }

    renderTodos(todos) {
        document.querySelectorAll('.todo-items').forEach(quadrant => {
            quadrant.innerHTML = '';
        });

        todos.forEach(todo => {
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
        project.textContent = this.projectsList.getProjectName(todo.projectId).name;

        // Edit Icon
        const editIcon = document.createElement('img');
        editIcon.src = editIconSrc;
        editIcon.classList.add('edit-icon');

        // Delete button
        const deleteIcon = document.createElement('img');
        deleteIcon.src = deleteIconSrc;
        deleteIcon.classList.add('delete-icon');

        li.append(checkbox, todoText, project, editIcon, deleteIcon);
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
        // finish logic
    }

    // Project related methods

    renderProjects() {
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';

        const projectOptions = document.getElementById('project-options');
        projectOptions.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a project';
        defaultOption.setAttribute('selected', ''); 
        defaultOption.setAttribute('disabled', '');
        projectOptions.appendChild(defaultOption);

        this.projectsList.projects.forEach(project => {
            const projectElement = this.createProjectElement(project);
            projectList.appendChild(projectElement);

            const projectOption = document.createElement('option');
            projectOption.value = project.name;
            projectOption.dataset.id = project.id;
            projectOption.textContent = project.name;

            projectOptions.appendChild(projectOption);
        });
        
    }

    createProjectElement(project) {
        const div = document.createElement('div');
        div.classList.add('project-item');
        div.dataset.id = project.id;
        
        const spanTitle = document.createElement('span');
        spanTitle.classList.add('nav-title');
        spanTitle.textContent = project.name;

        const deleteIcon = document.createElement('img');
        deleteIcon.src = deleteIconSrc;
        deleteIcon.classList.add('delete-icon');

        const spanBadge = document.createElement('span');
        spanBadge.classList.add('badge');
        spanBadge.textContent = ''; // Add count here

        div.append(spanTitle, deleteIcon, spanBadge);
        return div;
    }

    showProjectModal() {
        document.getElementById('project-modal').classList.add('show');
        document.getElementById('modal-backdrop').classList.add('show');
    }

    hideProjectModal() {
        document.getElementById('project-modal').classList.remove('show');
        document.getElementById('modal-backdrop').classList.remove('show');
    }

    setupEventListeners() {
        // Clear local storage
        // window.addEventListener('load', () => {
        //     localStorage.clear();
        //     console.log('localStorage has been cleared.');
        // });

        // Event listeners for the create todo form
        const todoForm = document.getElementById('todoForm');

        todoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Get todo item attributes
            const titleElement = todoForm.querySelector('#title');
            const title = titleElement.value.trim();
            const details = todoForm.querySelector('#details')?.value || '';
            const projectSelect = todoForm.querySelector('#project-options');
            const selectedOption = projectSelect.options[projectSelect.selectedIndex];
            const projectId = selectedOption?.dataset.id || this.projectsList.getDefaultProjectId();
            const dueDate = todoForm.querySelector('#due-date')?.value || '';
            const importance = todoForm.querySelector('input[name="importance"]:checked')?.value || '';
            const urgency = todoForm.querySelector('input[name="urgency"]:checked')?.value || '';

            if (!title) {
                console.error('Title is required!');
                return;
            }

            const todoData = { title, details, projectId, dueDate, importance, urgency };

            const newTodo = await this.todoList.addTodo(todoData);
            this.addTodoToDisplay(newTodo);
            titleElement.value = '';
            todoForm.querySelectorAll('input[type="radio"]:checked').forEach(input => input.checked = false);
            this.hideTodoModal();
        });

        // Event listeners for the todo items
        document.querySelectorAll('.todo-items').forEach(list => {
            list.addEventListener('click', async (e) => {
                if (e.target.classList.contains('delete-icon')) {
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

        // Show add todo modal event listener
        document.getElementById('add-btn').addEventListener('click', (e) => {
            this.showTodoModal();
        })

        // Close add todo modal event listener
        document.getElementById('close-todo-modal').addEventListener('click', (e) => {
            this.hideTodoModal();
        })

        // Toggle selected class on urgency/importance radio buttons
        document.querySelectorAll('.radio-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.classList.toggle('selected');
            })
        })

        // Project event listeners

        const projectForm = document.getElementById('projectForm');

        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameElement = projectForm.querySelector('#projectName');
            const name = nameElement.value.trim();

            
            if (!name) {
                console.error('Name is required!');
                return;
            }

            await this.projectsList.addProject(name);
            this.renderProjects();
            nameElement.value = '';
            this.hideProjectModal();
        })

        document.getElementById('project-list').addEventListener('click', async (e) => {
            const projectItem = e.target.closest('.project-item');

            if (e.target.classList.contains('delete-icon')) {
                //const projectItem = e.target.closest('.project-item');
                e.stopPropagation();
                const id = projectItem.dataset.id;
                await this.projectsList.deleteProject(id);
                this.renderProjects();
            }
            if (projectItem && !e.target.classList.contains('delete-icon')) {
                const projectId = projectItem.dataset.id;
                this.renderTodos(this.todoList.filterByProject(projectId));
            }
        });

        // Show add project modal event listener
        document.getElementById('add-project-btn').addEventListener('click', (e) => {
            this.showProjectModal();
        })

        // Close add project modal event listener
        document.getElementById('close-project-modal').addEventListener('click', (e) => {
            this.hideProjectModal();
        })
    }
}
