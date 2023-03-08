const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Please authenticate');
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decodedUser.id }).select('-password');
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer')) {
    //     throw new UnauthenticatedError('Please authenticate');
    // }
    // const token = req.header('Authorization').replace('Bearer ', '');
    // const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findOne({ _id: decodedUser.id });

    // if (!user) {
    //     throw new UnauthenticatedError('Please authenticate');
    // }

    // req.user = user;
    // req.token = token;
    // next();
}

module.exports = authMiddleware;