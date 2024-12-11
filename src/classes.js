export class Todo {
    constructor(title, description = null, dueDate = null, priority = null, notes = [], checklist = []) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.completed = false;
        this.id = crypto.randomUUID(); 
    }

    updateTitle(newTitle) {
        this.title = newTitle;
    }
    updateDate(newDate) {
        this.dueDate = newDate;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    addNote(note) {
        this.notes.push(note);
    }

    addChecklistItem(item) {
        this.checklist.push({ text: item, checked: false, id: crypto.randomUUID() });
    }

    toggleChecklistItem(itemId) {
        const item = this.checklist.find(item => item.id === itemID);
        if (item) {
            item.checked = !item.checked;
        }
    }

    matchesSearch(searchTerm) {
        return this.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

export class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
        
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todo) {
        this.todos = this.todos.filter(t => t.id !== todo.id);
    }

    getTodoById(todoId) {
        return this.todos.find(todo => todo.id === todoId);
    }

    searchTodos(searchTerm) {
        return this.todos.filter(todo => todo.matchesSearch(searchTerm));
    }
}

export class ProjectManager {
    constructor() {
        this.projects = [];
        this.defaultProject = this.createProject('Default');
    }

    createProject(name) {
        const project = new Project(name);
        this.projects.push(project);
        return project;
    }

    getProjectByName(name) {
        return this.projects.find(p => p.name === name);
    }

    createTodo(projectName, title, description = null, dueDate = null, priority = null, notes = [], checklist = []) {
        const todo = new Todo(title, description, dueDate, priority);
        const project = this.projects.find(p => p.name === projectName) || this.defaultProject;
        project.addTodo(todo);
        return todo;
    }

    moveTodoToProject(todo, fromProject, newProjectName) {
        fromProject.removeTodo(todo);
        const newProject = this.projects.find(p => p.name === newProjectName) || this.defaultProject;
        newProject.addTodo(todo);
    }

    getAllProjects() {
        return [...this.projects];
    }

    searchAllTodos(searchTerm) {
        const results = [];

        this.projects.forEach(project => {
            const projectResults = project.searchTodos(searchTerm);
            projectResults.forEach(todo => {
                results.push({
                    todo,
                    projectName: project.name
                });
            });
        });
        return results;
    }
}
