function openTaskForm() {
    document.getElementById("taskFormOverlay").style.display = "flex";
}

function closeTaskForm() {
    document.getElementById("taskFormOverlay").style.display = "none";
    resetTaskForm();
}

function getTime(a) {

	return new Date(a.value)
}


function createTaskElement(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    const localDeadline = new Date(task.deadline + 'Z');
    taskDiv.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p class="deadline">Дедлайн: ${formatRussianDate(localDeadline)}</p>
        <button class="delete-button">Удалить</button>
    `;
    taskDiv.querySelector('.delete-button').addEventListener('click', () => deleteTask(task.id));
    return taskDiv;
}

function formatRussianDate(date) {
    return date.toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' });
}


function deleteTask(taskId) {
    fetch(`/delete_task/${taskId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadTasks();
        }
    });
}

function addTask(event) {
    event.preventDefault();
    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskDeadlineInput = document.getElementById("taskDeadline");
    const taskTime = document.getElementById("taskTime").value;

    const taskDeadline = new Date(
        taskDeadlineInput.value + 'T' + taskTime
    );

    if (taskTitle && taskDescription && !isNaN(taskDeadline.getTime())) {
        fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: taskTitle,
                description: taskDescription,
                deadline: taskDeadline.toISOString()
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadTasks();
                closeTaskForm();
            }
        });
    } else {
        alert("Заполните все поля формы корректно");
    }
}

function saveTasks() {
    const taskList = document.querySelector(".task-list");
    const tasks = Array.from(taskList.children).map(taskDiv => {
        const title = taskDiv.querySelector('h3').textContent;
        const description = taskDiv.querySelector('p').textContent;
        const deadline = taskDiv.querySelector('.deadline').textContent.replace('Дедлайн: ', '');
		const time = taskDiv.querySelector('.deadlineTime').textContent;
		console.log(time, '= save1');
        return { title, description, deadline, time};
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));


}



function loadTasks() {
    fetch('/get_tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.querySelector(".task-list");
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskDiv = createTaskElement(task);
                taskList.appendChild(taskDiv);
            });
        });
}


// Функция для сохранения текущей темы в локальном хранилище
function saveThemePreference() {
    const body = document.body;
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Функция для загрузки темы при запуске страницы
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;

    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.checked = true;
        body.style.backgroundImage = url('../images/Light_Orig.jpg');
    } else {
        body.style.backgroundImage = url('../images/Good_orig.jpg');
    }
}


document.addEventListener('DOMContentLoaded', loadThemePreference);


function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    saveThemePreference();
    console.log('THEME HAS CHANGED');
    themeToggle.checked = body.classList.contains('light-theme');


    if (body.classList.contains('light-theme')) {
        body.style.backgroundImage = url('../images/Light_Orig.jpg');
    } else {
        body.style.backgroundImage = url('../images/Good_orig.jpg');
    }

}




// Функция для открытия окна настроек
function openSettings() {
    document.getElementById('settingsOverlay').style.display = 'block';
	console.log("Открыто");
}
function closeSettings() {
    document.getElementById('settingsOverlay').style.display = 'none';
}

const themeToggle = document.getElementById('toggleCheckbox');
themeToggle.addEventListener('change', toggleTheme);


window.addEventListener("load", loadTasks);

function resetTaskForm() {
    document.getElementById("taskForm").reset();
}
window.addEventListener("load", loadTasks);