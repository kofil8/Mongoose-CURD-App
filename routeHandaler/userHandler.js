const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, username, password, status } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            status,
        });

        const isUsernameTaken = await User.findOne({ username });

        if (isUsernameTaken) {
            return res.status(400).json({ message: 'Username already exists!' });
        }

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed!' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password!' });
        }
        // generate jwt
        const token = await jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
        );

        res.status(200).json({
            token,
            message: 'Login successful!',
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed!' });
    }
});

module.exports = router;
