const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Save todo data in userData folder, which is writable
const userDataPath = path.join(require('electron').app.getPath('userData') || '.', 'todos.json');

// Load todos or start empty
let todos = [];
try {
  const data = fs.readFileSync(userDataPath, 'utf-8');
  todos = JSON.parse(data);
} catch {
  todos = [];
}

function saveTodos() {
  fs.writeFileSync(userDataPath, JSON.stringify(todos, null, 2));
}

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const todo = req.body;
  todos.push(todo);
  saveTodos();
  res.status(201).json(todo);
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
