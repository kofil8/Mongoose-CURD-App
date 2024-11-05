const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandaler/todoHandler');
require('dotenv').config();

// express
const app = express();
app.use(express.json());

// database connection
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost/todos', {});
        console.log('Database connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}...`);
        });
    } catch (err) {
        console.log(err);
    }
}

connectToDatabase();

// application routes
app.use('/todo', todoHandler);

// error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
