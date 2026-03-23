// ToDo App - Apple-Inspired Design
(function() {
    'use strict';

    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const taskCount = document.getElementById('taskCount');
    const clearCompleted = document.getElementById('clearCompleted');
    const filterPills = document.querySelectorAll('.filter-pill');
    const currentDateEl = document.getElementById('currentDate');

    // State
    let tasks = [];
    let currentFilter = 'all';

    // Initialize
    function init() {
        loadTasks();
        bindEvents();
        updateDate();
        render();
    }

    // Update Date Display
    function updateDate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        currentDateEl.textContent = now.toLocaleDateString('zh-CN', options);
    }

    // Bind Events
    function bindEvents() {
        // Add task
        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        // Filter pills
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                currentFilter = pill.dataset.filter;
                updateFilterPills();
                render();
            });
        });

        // Clear completed
        clearCompleted.addEventListener('click', clearCompletedTasks);
    }

    // Add Task
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            important: false,
            createdAt: new Date().toISOString()
        };

        tasks.unshift(task);
        taskInput.value = '';

        // 自动切换到全部视图，确保新任务可见
        if (currentFilter !== 'all') {
            currentFilter = 'all';
            updateFilterPills();
        }

        saveTasks();
        render();
    }

    // Delete Task
    function deleteTask(id) {
        const taskEl = document.querySelector(`[data-id="${id}"]`);
        if (taskEl) {
            taskEl.classList.add('removing');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                render();
            }, 280);
        }
    }

    // Toggle Complete
    function toggleComplete(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            render();
        }
    }

    // Toggle Important
    function toggleImportant(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.important = !task.important;
            saveTasks();
            render();
        }
    }

    // Start Edit
    function startEdit(id) {
        const task = tasks.find(t => t.id === id);
        if (!task || task.completed) return;

        const taskEl = document.querySelector(`[data-id="${id}"]`);
        const contentEl = taskEl.querySelector('.task-content');

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-input-edit';
        input.value = task.text;

        contentEl.replaceWith(input);
        input.focus();
        input.select();

        taskEl.classList.add('editing');

        function save() {
            const newText = input.value.trim();
            if (newText && newText !== task.text) {
                task.text = newText;
                saveTasks();
            }
            render();
        }

        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') render();
        });
    }

    // Clear Completed Tasks
    function clearCompletedTasks() {
        const completedIds = tasks.filter(t => t.completed).map(t => t.id);

        // Animate out
        completedIds.forEach((id, i) => {
            setTimeout(() => {
                const taskEl = document.querySelector(`[data-id="${id}"]`);
                if (taskEl) taskEl.classList.add('removing');
            }, i * 50);
        });

        // Remove after animation
        setTimeout(() => {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            render();
        }, 300 + completedIds.length * 50);
    }

    // Get Filtered Tasks
    function getFilteredTasks() {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            case 'important':
                return tasks.filter(t => t.important);
            default:
                return tasks;
        }
    }

    // Update Filter Pills
    function updateFilterPills() {
        filterPills.forEach(pill => {
            const isActive = pill.dataset.filter === currentFilter;
            pill.classList.toggle('active', isActive);
            pill.setAttribute('aria-selected', isActive);
        });
    }

    // Update Stats with Animation
    function updateStats() {
        const activeCount = tasks.filter(t => !t.completed).length;
        const completedCount = tasks.filter(t => t.completed).length;

        taskCount.textContent = activeCount;
        taskCount.classList.add('updated');
        setTimeout(() => taskCount.classList.remove('updated'), 400);

        clearCompleted.disabled = completedCount === 0;
    }

    // Render
    function render() {
        const filteredTasks = getFilteredTasks();

        // Show/Hide Empty State
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.classList.add('show');
        } else {
            emptyState.classList.remove('show');
            taskList.innerHTML = filteredTasks.map((task, index) =>
                createTaskHTML(task, index)
            ).join('');

            // Bind task events with stagger
            filteredTasks.forEach((task, index) => {
                const taskEl = document.querySelector(`[data-id="${task.id}"]`);
                if (taskEl) {
                    taskEl.style.setProperty('--item-index', index);

                    const checkbox = taskEl.querySelector('.task-checkbox');
                    const star = taskEl.querySelector('.task-star');
                    const deleteBtn = taskEl.querySelector('.task-delete');
                    const content = taskEl.querySelector('.task-content');

                    checkbox.addEventListener('click', () => toggleComplete(task.id));
                    star.addEventListener('click', () => toggleImportant(task.id));
                    deleteBtn.addEventListener('click', () => deleteTask(task.id));
                    content.addEventListener('dblclick', () => startEdit(task.id));
                }
            });
        }

        updateStats();
    }

    // Create Task HTML
    function createTaskHTML(task, index) {
        const starPath = task.important
            ? '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>'
            : '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>';

        return `
            <li class="task-item" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="task-content ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
                <button class="task-star ${task.important ? 'active' : ''}" aria-label="${task.important ? '取消重要' : '标记重要'}">
                    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        ${starPath}
                    </svg>
                </button>
                <button class="task-delete" aria-label="删除">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            </li>
        `;
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // LocalStorage
    function saveTasks() {
        try {
            localStorage.setItem('todo-tasks', JSON.stringify(tasks));
        } catch (e) {
            console.warn('无法保存到 LocalStorage');
        }
    }

    function loadTasks() {
        try {
            const saved = localStorage.getItem('todo-tasks');
            if (saved) {
                tasks = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('无法从 LocalStorage 加载');
            tasks = [];
        }
    }

    // Start
    init();
})();
