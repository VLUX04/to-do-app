async function loadTodos() {
    const res = await fetch('http://localhost:3000/todos');
    const todos = await res.json();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach(todo => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = todo.text;
    list.appendChild(card);
    });
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    if (!input.value.trim()) return;
    await fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value })
    });
    input.value = '';
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

waitForBackend();