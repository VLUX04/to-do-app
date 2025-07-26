let editingId = null;

async function loadTodos() {
  const res = await fetch('http://localhost:3000/todos');
  const todos = await res.json();
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  todos.forEach(todo => {
    const card = createTodoCard(todo, false);
    list.appendChild(card);
  });
}

async function loadCompletedTodos() {
  const res = await fetch('http://localhost:3000/todos');
  const todos = await res.json();
  const list = document.getElementById('todoCompleted');
  list.innerHTML = '';
  todos.forEach(todo => {
    if (todo.done) {
      const card = createTodoCard(todo, true);
      list.appendChild(card);
    }
  });
}

function createTodoCard(todo, isCompleted) {
  const card = document.createElement('div');
  card.classList.add('card');

  const titleEl = document.createElement('h3');
  titleEl.textContent = todo.title;
  card.appendChild(titleEl);

  const textEl = document.createElement('p');
  textEl.id = 'todoText';
  textEl.textContent = todo.text;
  card.appendChild(textEl);

  const dateEl = document.createElement('p');
  dateEl.textContent = todo.date ? `Due: ${new Date(todo.date).toLocaleDateString()}` : 'No due date';
  card.appendChild(dateEl);

  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button-container';

  if (!isCompleted) {
    const editButton = document.createElement('button');
    editButton.id = 'edit';
    editButton.onclick = () => openEditOverlay(todo);
    buttonContainer.appendChild(editButton);
  }

  const deleteButton = document.createElement('button');
  deleteButton.id = 'delete';
  deleteButton.onclick = () => deleteTodo(todo.id);
  buttonContainer.appendChild(deleteButton);

  const checkboxContainer = document.createElement('div');
  checkboxContainer.id = 'checkbox-container';

  const checkbox = document.createElement('input');
  checkbox.id = `doneCheckbox-${todo.id}`;
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.onchange = async () => {
    await toggleTodoDone(todo, checkbox.checked);
  };
  

  const doneLabel = document.createElement('label');
  doneLabel.textContent = 'Done';

  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(doneLabel);

  const bottomContainer = document.createElement('div');
  bottomContainer.id = 'bottom-container';

  bottomContainer.appendChild(checkboxContainer);
  bottomContainer.appendChild(buttonContainer);

  card.appendChild(bottomContainer);

  return card;
}

function openEditOverlay(todo) {
  const overlay = document.getElementById('overlay');
  document.getElementById('titleInput').value = todo.title;
  document.getElementById('todoInput').value = todo.text;
  document.getElementById('dateInput').value = todo.date || '';
  overlay.style.display = 'flex';
  overlay.dataset.editingId = todo.id;
  editingId = todo.id;
}

async function toggleTodoDone(todo, done) {
    const updatedTodo = { ...todo, done };

  const res = await fetch(`http://localhost:3000/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTodo)
  });

  await loadCompletedTodos();
  await loadTodos();
   
}

async function deleteTodo(id) {
  const res = await fetch(`http://localhost:3000/todos/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    alert('Failed to delete todo.');
    return;
  }

  await loadTodos();
}

async function addOrUpdateTodo() {
  const titleInput = document.getElementById('titleInput');
  const textInput = document.getElementById('todoInput');
  const dateInput = document.getElementById('dateInput');
  const overlay = document.getElementById('overlay');

  const title = titleInput.value.trim();
  const text = textInput.value.trim();
  const date = dateInput.value.trim();

  if (!title || !text || !date) return alert('Please fill all fields.');

  if (editingId) {
    const checkbox = document.getElementById('doneCheckbox-' + editingId);
    const done = checkbox.checked;
    const updatedTodo = { id: editingId, title: title, text: text, date: date, done: done};

    const res = await fetch(`http://localhost:3000/todos/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo)
    });
  } else {
    const newTodo = {
      id: Date.now(),
      title,
      text,
      date,
      done: false
    };

    const res = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });

    if (!res.ok) {
      alert('Failed to add todo.');
      return;
    }
  }

  titleInput.value = '';
  textInput.value = '';
  dateInput.value = '';
  overlay.style.display = 'none';
  overlay.dataset.editingId = '';
  editingId = null;

  await loadTodos();
}

function openAddBox() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';
  overlay.dataset.editingId = '';
  editingId = null;

  document.getElementById('titleInput').value = '';
  document.getElementById('todoInput').value = '';
  document.getElementById('dateInput').value = '';
}

async function waitForBackend(attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch('http://localhost:3000/todos');
      if (res.ok) {
        if (document.getElementById('todoCompleted')) {
          await loadCompletedTodos();
        } else {
          await loadTodos();
        }
        return;
      }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  document.body.innerHTML = '<h2>Failed to load backend.</h2>';
}

function goToDonePage() {
  window.location.href = 'done.html';   
}

function goToHomePage() {
  window.location.href = 'index.html';  
}

function goToCalendarPage() {
  window.location.href = 'calendar.html';
}

waitForBackend();
