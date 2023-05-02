const express = require('express');
const passport = require('passport');
const authRole = require('../Passport/VerifyUser')
const { getuser, updateuser, deleteuser } = require('../Controllers/UserController');
const router = express.Router();
router.get('/user', passport.authenticate('bearer', { session: false }), authRole("admin"), getuser);
router.put('/user/:id', passport.authenticate('bearer', { session: false }), authRole("admin"), updateuser)
router.delete('/user/:id', passport.authenticate('bearer', { session: false }), authRole("admin"), deleteuser)

module.exports = router