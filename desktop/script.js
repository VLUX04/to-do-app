async function loadTodos() {
    const res = await fetch('http://localhost:3000/todos');
    const todos = await res.json();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach(todo => {
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
        
        const deleteButton = document.createElement('button');
        deleteButton.id = 'delete';
        deleteButton.onclick = () => deleteTodo(todo.id);
        
        const editButton = document.createElement('button');
        editButton.id = 'edit';
        editButton.onclick = () => editTodo(todo.id, todo.text, todo.title);

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        const checkboxContainer = document.createElement('div');
        checkboxContainer.id = 'checkbox-container';

        const todoDoneCheckbox = document.createElement('input');
        todoDoneCheckbox.type = 'checkbox';

        const done = document.createElement('label');
        done.textContent = 'Done';

        checkboxContainer.appendChild(todoDoneCheckbox);
        checkboxContainer.appendChild(done);

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'bottom-container';

        bottomContainer.appendChild(checkboxContainer);
        bottomContainer.appendChild(buttonContainer);

        card.appendChild(bottomContainer);
        
        list.appendChild(card);
    });
}

async function deleteTodo(id) {
    console.log(`Deleting todo with id: ${id}`);
    await fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE' });
    loadTodos();
}

function editTodo(id, currentText) {
    const newText = prompt("Edit task:", currentText);
    if (newText && newText.trim()) updateTodo(id, newText);
}

async function updateTodo(id, newText) {
    await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
    });
    loadTodos();
}

async function addTodo() {
    const title = document.getElementById('titleInput');
    const input = document.getElementById('todoInput');
    const date = document.getElementById('dateInput');
    if (!title.value.trim()) return;
    if (!input.value.trim()) return;
    if (!date.value.trim()) return;
    
    const newTodo = {
        id: Date.now(),
        title: title.value,
        text: input.value,
        date: date.value
    };

    await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
    });
    title.value = '';
    input.value = '';
    date.value = '';
    document.getElementById('overlay').style.display = 'none';
    loadTodos();
}

async function waitForBackend(attempts = 10) {
    for (let i = 0; i < attempts; i++) {
    try {
        const res = await fetch('http://localhost:3000/todos');
        if (res.ok) {
        loadTodos();
        return;
        }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
    }
    document.body.innerHTML = "<h2>Failed to load backend.</h2>";
}
function openAddBox() {
    document.getElementById('overlay').style.display = 'flex'; 
}

waitForBackend();