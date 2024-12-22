// index.js
import "./styles.css";
import { UiManager } from './UiManagers.js';
import { TodoList, Project } from './dataManagers.js';
import  { StorageManager } from './storageManager';
import { ThemeToggle } from './themeToggle.js';

new ThemeToggle();
const storageManager = new StorageManager();
const projectManager = new Project(storageManager);
const todoList = new TodoList(storageManager);
const uiManager = new UiManager(todoList, projectManager);
