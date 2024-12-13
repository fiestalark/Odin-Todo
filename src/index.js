import "./styles.css";
import { UiManager } from './UiManagers.js';
import { TodoList } from './dataManagers.js';

const todoList = new TodoList();
const ui = new UiManager(todoList);
