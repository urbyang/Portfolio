// 1. Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// --- NEW: Load tasks from Local Storage when the page loads ---
document.addEventListener('DOMContentLoaded', loadTasks);

// 2. Event Listener for the "Add" button
addBtn.addEventListener('click', addTask);

// 3. Event Listener for "Enter" key in input field
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// 4. Function to Add a Task
function addTask() {
    const taskText = taskInput.value;

    if (taskText === '') {
        alert("Please enter a task!");
        return;
    }

    // Create the UI element
    createTaskElement(taskText);

    // --- NEW: Save to Local Storage ---
    saveTaskToLocal(taskText);

    taskInput.value = '';
}

// 5. Helper Function to Create UI (keeps code clean)
function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="delete-btn">Delete</button>
    `;

    li.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') return;
        li.classList.toggle('completed');
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        taskList.removeChild(li);
        removeTaskFromLocal(taskText); // --- NEW: Remove from storage ---
    });

    taskList.appendChild(li);
}

// --- NEW: Local Storage Functions ---

function saveTaskToLocal(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => createTaskElement(task));
}

function removeTaskFromLocal(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const filteredTasks = tasks.filter(t => t !== taskText);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}
 