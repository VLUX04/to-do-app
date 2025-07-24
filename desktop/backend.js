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
  } catch (err) {
  }

  function saveTodos() {
    try {
      fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
    } catch (err) {
    }
  }

  app.get('/todos', (req, res) => {
    res.json(todos);
  });

  app.post('/todos', (req, res) => {
    const todo = req.body;
    todos.push(todo);
    saveTodos();
    res.status(201).json(todo);
  });

  app.delete('/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    if (todos.length === initialLength) {
      return res.status(404).json({ error: "Todo not found." });
    }
    saveTodos();
    res.json({ message: "Todo deleted successfully." });
  });

  app.put('/todos/:id', (req, res) => {
    const id = Number(req.params.id); 
    const { title, text, date, done } = req.body;  
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Todo not found." });
    }
    todos[index] = { ...todos[index], title, text, date, done }; 

    saveTodos();

    res.json(todos[index]);
  });

  app.listen(3000, 'localhost');
}

module.exports = { startBackendServer };