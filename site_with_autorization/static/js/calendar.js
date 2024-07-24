

function parseDateFromString(dateString) {
    return new Date(dateString);
}

const months = [
    "Январь", "Февраль", "Март",
    "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь",
    "Октябрь", "Ноябрь", "Декабрь"
];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function displayTasksOnCalendar(tasks) {
    const daysContainer = document.querySelector(".days");


    const taskSquares = document.querySelectorAll(".task-square");
    taskSquares.forEach(square => square.remove());


    tasks.forEach(task => {
        const taskDate = new Date(task.deadline);

        const adjustedTaskDate = new Date(taskDate.getTime() - taskDate.getTimezoneOffset() * 60000);
        const taskDay = adjustedTaskDate.getDate();
        const dayDiv = daysContainer.querySelector(`[data-day="${taskDay}"]`);

        if (dayDiv && adjustedTaskDate.getMonth() == currentMonth && adjustedTaskDate.getFullYear() == currentYear) {
            const taskSquare = document.createElement("div");
            taskSquare.classList.add("task-square");
            taskSquare.textContent = task.title;

            // Add event listener to open task details
            taskSquare.addEventListener("click", function (event) {
                event.stopPropagation();
                openTaskDetails(task.title, task.description, adjustedTaskDate);
            });

            dayDiv.appendChild(taskSquare);
        }
    });
}

function openTaskDetails(title, description, deadline) {
    const overlay = document.querySelector(".task-details-overlay");
    const titleElement = document.getElementById("details-title");
    const descriptionElement = document.getElementById("details-description");
    const deadlineElement = document.getElementById("details-deadline");

    titleElement.textContent = title;
    descriptionElement.textContent = description;
    deadlineElement.textContent = `Дедлайн: ${formatRussianDate(deadline)}`;

    overlay.style.display = "flex";
}

function closeTaskDetails() {
    const overlay = document.querySelector(".task-details-overlay");
    overlay.style.display = "none";
}

function formatRussianDate(date) {
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    displayCalendar();
}

function displayCalendar() {
    const calendarHeader = document.querySelector(".current-month");
    calendarHeader.textContent = `${months[currentMonth]} ${currentYear}`;

    const daysContainer = document.querySelector(".days");
    daysContainer.innerHTML = "";

    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= lastDayOfMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.setAttribute("data-day", day);
        dayDiv.textContent = day;
        daysContainer.appendChild(dayDiv);
    }


    fetch('/get_tasks')
        .then(response => response.json())
        .then(tasks => {
            displayTasksOnCalendar(tasks);
        })
        .catch(error => console.error('Error fetching tasks:', error));
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

// Загрузка темы при запуске страницы
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

window.addEventListener("load", displayCalendar);
