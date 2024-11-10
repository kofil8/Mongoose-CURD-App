const jwt = require('jsonwebtoken');

const checkLogin = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const { username, id } = decoded;

        req.username = username;
        req.id = id;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Authentication failed!',
            error: error.message,
        });
    }
};

module.exports = checkLogin;
