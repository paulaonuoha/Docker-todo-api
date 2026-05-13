const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads the .env file into process.env
const Todo = require('./models/Todo');

const app = express();
app.use(express.json()); // Allows Express to parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- ROUTES ---

// GET all todos
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST a new todo
app.post('/todos', async (req, res) => {
  const newTodo = new Todo({ title: req.body.title });
  const savedTodo = await newTodo.save();
  res.status(201).json(savedTodo);
});

// GET a single todo by ID
app.get('/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// PUT (update) a todo by ID
app.put('/todos/:id', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true } // Return the updated document
  );
  if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });
  res.json(updatedTodo);
});

// DELETE a todo by ID
app.delete('/todos/:id', async (req, res) => {
  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
  if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });
  res.json({ message: 'Todo deleted successfully' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));