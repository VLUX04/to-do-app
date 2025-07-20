const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

function startBackendServer(userDataPath) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const todosFilePath = path.join(userDataPath, 'todos.json');
  console.log('Using TODO_DATA_PATH:', todosFilePath);

  let todos = [];
  try {
    const data = fs.readFileSync(todosFilePath, 'utf-8');
    todos = JSON.parse(data);
    console.log('Loaded todos:', todos);
  } catch (err) {
    console.log('Starting with empty todo list.', err.message);
  }

  function saveTodos() {
    try {
      fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
      console.log('Todos saved.');
    } catch (err) {
      console.error('Failed to save todos:', err);
    }
  }

  app.get('/todos', (req, res) => {
    console.log('GET /todos');
    res.json(todos);
  });

  app.post('/todos', (req, res) => {
    console.log('POST /todos:', req.body);
    const todo = req.body;
    todos.push(todo);
    saveTodos();
    res.status(201).json(todo);
  });

  app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on http://localhost:3000');
  });
}

module.exports = { startBackendServer };
