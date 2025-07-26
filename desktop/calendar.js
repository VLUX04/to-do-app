
const now = new Date();
let year = now.getFullYear();
let month = now.getMonth(); 

function goToHomePage() {
  window.location.href = 'index.html';  
}


function fetchTodosForMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  firstDay.setHours(0, 0, 0, 0);
  lastDay.setHours(23, 59, 59, 999);

  return fetch('http://localhost:3000/todos')
    .then(res => res.json())
    .then(todos => {
      const todosByDay = {};

      todos.forEach(todo => {
        const todoDate = new Date(todo.date);
        todoDate.setHours(0, 0, 0, 0);

        if (todoDate >= firstDay && todoDate <= lastDay) {
          const day = todoDate.getDate();
          if (!todosByDay[day]) {
            todosByDay[day] = [];
          }
          todosByDay[day].push(todo);
        }
      });

      const daysWithTodos = Object.keys(todosByDay).map(Number);
      console.log("Days with todos:", daysWithTodos);
      return daysWithTodos;
    })
    .catch(err => {
      console.error('Failed to fetch todos for the month:', err);
      return [];
    });
}
function generateCalendar() {
  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = "";

  fetchTodosForMonth(year, month).then(daysWithTodos => {
    generateCalendarWithTodos(daysWithTodos);
  });
}

function generateCalendarWithTodos(daysWithTodos = []) {
  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = ""; 

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  document.getElementById("monthYear").textContent = monthNames[month] + " " + year;

  const weekdaysDiv = document.createElement("div");
  weekdaysDiv.classList.add("weekdays");
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = weekdayNames[i];
    weekdaysDiv.appendChild(dayDiv);
  }
  calendarGrid.appendChild(weekdaysDiv);

  const daysContainer = document.createElement("div");
  daysContainer.classList.add("days");

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("day", "empty");
    daysContainer.appendChild(emptyDiv);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = day;

    if (daysWithTodos.includes(day)) {
      dayDiv.classList.add("has-todo"); 
    }

    daysContainer.appendChild(dayDiv);
  }

  calendarGrid.appendChild(daysContainer);
}


function changeMonth(direction) {
  
  if (direction === 'prev') {
    if (month === 0) {
      year--;
      month = 11;
    } else {
      month--;
    }
  } else if (direction === 'next') {
    if (month === 11) {
      year++;
      month = 0;
    } else {
      month++;
    }
  }

  generateCalendar();
}

document.addEventListener("DOMContentLoaded", generateCalendar);