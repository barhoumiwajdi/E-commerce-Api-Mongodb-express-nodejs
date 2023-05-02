const express = require('express');
const { register, login, resetPassword, forgotPassword } = require('../Controllers/AuthController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/resetPassword', resetPassword);
router.post('/forgotPassword', forgotPassword);
// router.post('/logout', LogOut)

module.exports = router