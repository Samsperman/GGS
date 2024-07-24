
function displayLatestTasks() {
    fetch('/get_latest_tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.querySelector(".latest-tasks");
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const taskDiv = document.createElement("div");
                taskDiv.classList.add("task");

                const titleHeading = document.createElement("h3");
                titleHeading.textContent = task.title;

                const descriptionParagraph = document.createElement("p");
                descriptionParagraph.textContent = task.description;

                const deadlineParagraph = document.createElement("p");
                deadlineParagraph.classList.add("deadline");


                const deadlineDate = new Date(task.deadline);
                const adjustedDeadlineDate = new Date(deadlineDate.getTime() - deadlineDate.getTimezoneOffset() * 60000);

                deadlineParagraph.textContent = `Дедлайн: ${formatRussianDate(adjustedDeadlineDate)}`;

                taskDiv.appendChild(titleHeading);
                taskDiv.appendChild(descriptionParagraph);
                taskDiv.appendChild(deadlineParagraph);
                taskList.appendChild(taskDiv);
            });
        })
        .catch(error => console.error('Error fetching latest tasks:', error));
}


function displayTodayTasks() {
    fetch('/get_today_tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.querySelector(".today-tasks");
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const taskDiv = document.createElement("div");
                taskDiv.classList.add("task");

                const titleHeading = document.createElement("h3");
                titleHeading.textContent = task.title;

                const descriptionParagraph = document.createElement("p");
                descriptionParagraph.textContent = task.description;

                const deadlineParagraph = document.createElement("p");
                deadlineParagraph.classList.add("deadline");


                const deadlineDate = new Date(task.deadline);
                const adjustedDeadlineDate = new Date(deadlineDate.getTime() - deadlineDate.getTimezoneOffset() * 60000);

                deadlineParagraph.textContent = `Дедлайн: ${formatRussianDate(adjustedDeadlineDate)}`;

                taskDiv.appendChild(titleHeading);
                taskDiv.appendChild(descriptionParagraph);
                taskDiv.appendChild(deadlineParagraph);
                taskList.appendChild(taskDiv);
            });
        })
        .catch(error => console.error('Error fetching today\'s tasks:', error));
}


function formatRussianDate(date) {
    return date.toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' });
}


function saveThemePreference() {
    const body = document.body;
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
}


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

// Функция для переключения темы
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


function openSettings() {
    document.getElementById('settingsOverlay').style.display = 'block';
    console.log("Opened");
}

function closeSettings() {
    document.getElementById('settingsOverlay').style.display = 'none';
}


const themeToggle = document.getElementById('toggleCheckbox');
themeToggle.addEventListener('change', toggleTheme);


window.addEventListener("load", displayLatestTasks);
window.addEventListener("load", displayTodayTasks);
