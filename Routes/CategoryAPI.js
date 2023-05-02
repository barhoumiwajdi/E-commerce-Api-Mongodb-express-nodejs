const express = require('express');
const passport = require('passport');
const authRole = require('../Passport/VerifyUser')
const { addcategory, getcategory, getbyIDcategory, updatecategory, deletecategory, addparentcategories, getProductsbycategory } = require('../Controllers/CategoryController');

const router = express.Router();
router.post('/category', passport.authenticate('bearer', { session: false }), authRole("admin"), addcategory);
router.get('/category', getcategory);
router.get('/category/:id', passport.authenticate('bearer', { session: false }), authRole("admin", "client"), getbyIDcategory)
router.put('/category/:id', passport.authenticate('bearer', { session: false }), authRole("admin"), updatecategory)
router.delete('/category/:id', passport.authenticate('bearer', { session: false }), authRole("admin"), deletecategory)
router.put('/category/:id/:categoryId', passport.authenticate('bearer', { session: false }), addparentcategories)
router.get('/category/getproducts/:id', passport.authenticate('bearer', { session: false }), getProductsbycategory)
module.exports = router