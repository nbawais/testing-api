const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
// const { check, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');

// const User = require('../models/User');

router.post('/login', login);
router.post('/register', register);

module.exports = router;