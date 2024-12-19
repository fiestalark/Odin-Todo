import deleteIconSrc from './images/delete-icon.svg';
import editIconSrc from './images/edit-icon.svg';

export class UiManager {
    // todoList class is passed in when UiManager is called in index.js
    constructor(todoList, projects) {
        this.todoList = todoList;
        this.projectsList = projects;
        this.init();
        this.todoToEditId = '';
        // Run event listeners as soon as function loads
        this.setupEventListeners();
    }

    async init() {
        await this.todoList.init();
        await this.projectsList.init();
        this.renderTodos(this.todoList.todos);
        this.renderProjects();
        this.renderQuadrants();
        this.populateCounts();
    }

    renderTodos(todos) {
        document.querySelectorAll('.todo-items').forEach(quadrant => {
            quadrant.innerHTML = '';
        });

        todos.forEach(todo => {
            this.updateTodoDisplay(todo);
        });
        this.populateCounts();
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
        const editIcon = document.createElement('img');
        editIcon.src = editIconSrc;
        editIcon.classList.add('edit-icon');

        // Delete button
        const deleteIcon = document.createElement('img');
        deleteIcon.src = deleteIconSrc;
        deleteIcon.classList.add('delete-icon');

        li.append(checkbox, todoText, editIcon, deleteIcon);
        return li;
    }

    updateTodoDisplay(todo) {
        const todoElement = document.querySelector(`[data-id="${todo.id}"]`);
        if (todoElement) {
            // Update todo content
            todoElement.querySelector('.todo-text').textContent = todo.title;
            todoElement.querySelector('.toggle-checkbox').checked = todo.completed;

            // Move to new quadrant, if needed
            const currentQuadrant = todoElement.parentElement;
            console.log(currentQuadrant);
            const correctQuadrant = document.getElementById(`quadrant${todo.quadrant}`);
            console.log(correctQuadrant);

            if (currentQuadrant.id !== correctQuadrant.id) {
                correctQuadrant.appendChild(todoElement);
            }
        } else {
            const newTodoElement = this.createTodoElement(todo);
            document.getElementById(`quadrant${todo.quadrant}`).appendChild(newTodoElement);
        }
        this.populateCounts();
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

    async showEditModal(id) {
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

        // Handle the project selection separately since its id doesn't match the todo property
        const projectSelect = todoForm.querySelector('#project-options');
        if (projectSelect && todoToEdit.projectId) {
            const options = projectSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].dataset.id === todoToEdit.projectId) {
                    projectSelect.selectedIndex = i;
                    break;
                }
            }
        }

        // Then populate the form fields
        Object.keys(todoToEdit).forEach(key => {
            //if (key !== projectId) {
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
            //}  
        });
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
        this.populateCounts();
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
        spanBadge.dataset.id = project.id;
        //spanBadge.textContent = this.todoList.getTodoCount({projectId: project.id});

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

    renderQuadrants() {
        const quadrants = document.getElementById('quadrants');
        quadrants.innerHTML = '';

        const quadrantValues = {
            1: 'Do First',
            2: 'Schedule',
            3: 'Delegate',
            4: 'Eliminate'
        }

        Object.entries(quadrantValues).forEach(([id, value]) => {
            const quadrantElement = this.createQuadrantElements(id, value);
            quadrants.appendChild(quadrantElement);
        }); 
    }

    createQuadrantElements(id, name) {
        const div = document.createElement('div');
        div.classList.add('quadrant-item');
        div.dataset.id = id;
        
        const spanTitle = document.createElement('span');
        spanTitle.classList.add('nav-title');
        spanTitle.textContent = name;

        const spanBadge = document.createElement('span');
        spanBadge.classList.add('badge');
        spanBadge.dataset.id = `Quadrant-${id}`;
        //spanBadge.textContent = this.todoList.getTodoCount({quadrant: id});

        div.append(spanTitle, spanBadge);
        return div;
    }

    populateCounts() {
        const homeCount = document.getElementById('home-badge');
        homeCount.textContent = this.todoList.getTodoCount();

        const todayCount = document.getElementById('today-badge');
        todayCount.textContent = this.todoList.getTodoCount({ dueDate: 'today' })

        const weekCount = document.getElementById('week-badge');
        weekCount.textContent = this.todoList.getTodoCount({ dueDate: 'thisWeek' });

        this.projectsList.projects.forEach(project => {
            const projectCountBadge = document.querySelector(`span[data-id="${project.id}"]`);
            console.log(projectCountBadge);
            if (projectCountBadge) {
                projectCountBadge.textContent = this.todoList.getTodoCount({projectId: project.id});
            }
            
        })
    }

    setupEventListeners() {
        //Clear local storage
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
            const dueDate = todoForm.querySelector('#dueDate')?.value || '';
            const importance = todoForm.querySelector('input[name="importance"]:checked')?.value || '';
            const urgency = todoForm.querySelector('input[name="urgency"]:checked')?.value || '';

            if (!title) {
                console.error('Title is required!');
                return;
            }

            const todoData = { title, details, projectId, dueDate, importance, urgency };
            
            if (this.todoToEditId !== '') {
                const updatedTodo = await this.todoList.editTodo(this.todoToEditId, todoData);
                console.log("Updated todo: ", updatedTodo);
                this.updateTodoDisplay(updatedTodo);
                this.todoToEditId = '';
            } else {
                const newTodo = await this.todoList.addTodo(todoData);
                this.updateTodoDisplay(newTodo);
            }
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
                    this.populateCounts();
                }
                if (e.target.classList.contains('toggle-checkbox')) {
                    const id = e.target.parentElement.dataset.id;
                    await this.todoList.toggleComplete(id);
                    this.toggleTodoComplete(id);
                    this.populateCounts();
                }
                if (e.target.classList.contains('edit-icon')) {
                    const id = e.target.parentElement.dataset.id;
                    this.todoToEditId = id;
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
                e.stopPropagation();
                const id = projectItem.dataset.id;
                await this.projectsList.deleteProject(id);
                this.renderProjects();
            }
            if (projectItem && !e.target.classList.contains('delete-icon')) {
                const projectId = projectItem.dataset.id;
                this.renderTodos(this.todoList.filterTodos({projectId: projectId}));
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

        // Sidebar event listeners
        const sidebar = document.querySelector('.sidebar-nav');

        sidebar.addEventListener('click', (e) => {
            if (e.target.id === 'home') {
                this.renderTodos(this.todoList.todos);
            } else if (e.target.id === 'today') {
                this.renderTodos(this.todoList.filterTodos({dueDate : 'today'}));
            } else if (e.target.id === 'this-week') {
                this.renderTodos(this.todoList.filterTodos({dueDate : 'thisWeek'}));
            }
        })
    }
}
