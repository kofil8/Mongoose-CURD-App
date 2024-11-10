const express = require('express');
const Todo = require('../schemas/todoSchema');
const checkLogin = require('../middlewares/checkLogin');

const router = express.Router();

// GET all todos
router.get('/', checkLogin, async (req, res) => {
    try {
        const activeTodos = await Todo.find({
            status: 'active',
        })
            .select({
                _id: 0,
                __v: 0,
                date: 0,
            })
            .limit(1);
        return res.status(200).json({ message: 'Todos fetched successfully', todos: activeTodos });
    } catch (error) {
        return res.status(500).json({ message: `Ineternal server error: ${error.message}` });
    }
});

// GET a todo by ID
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id).select({
            _id: 0,
            __v: 0,
            date: 0,
        });
        return res.status(200).json({ message: 'Todo fetched successfully', todo });
    } catch (error) {
        return res.status(500).json({ message: `Ineternal server error: ${error.message}` });
    }
});

// Post a new todo
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    try {
        const savedTodo = await newTodo.save();
        res.status(200).json({ message: 'Todo saved successfully', todo: savedTodo });
    } catch (err) {
        res.json({ message: err });
    }
});

// POST multiple todos
router.post('/all', async (req, res) => {
    try {
        const todos = await Todo.insertMany(req.body);
        res.status(201).json({ message: 'Todos saved successfully', todos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT a todo
router.put('/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: `Todo with id ${req.params.id} not found` });
        }

        res.status(200).json({ message: 'Todo deleted successfully', todo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    return null;
});

module.exports = router;
