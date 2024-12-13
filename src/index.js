import "./styles.css";
import { UiManager } from './UiManagers.js';
import { TodoList } from './dataManagers.js';
import  { StorageManager } from './storageManager';

const storageManager = new StorageManager();
const todoList = new TodoList(storageManager);
const uiManager = new UiManager(todoList);
