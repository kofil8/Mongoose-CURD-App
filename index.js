const express = require('express');
const mongoose = require('mongoose');

// express
const app = express();
app.use(express.json());

// database connection
mongoose
    .connect('mongodb://localhost:27017/todos' {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));

// application routes

// default error handler
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ message: err.message });
}

app.listen(3000, () => console.log('Server started on port 3000'));
