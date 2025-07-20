const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let todos = [];

app.get('/todos', (req, res) => res.json(todos));
app.post('/todos', (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.status(201).json(todo);
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
