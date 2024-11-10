const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routeHandaler/todoHandler');
const userRoutes = require('./routeHandaler/userHandler');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {});
        console.log('Database connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}...`);
        });
    } catch (error) {
        console.log(error);
    }
})();

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to Mongoose CRUD App' }));

app.use('/todo', todoRoutes);
app.use('/user', userRoutes);

app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message });
    next(error);
});
