const express = require('express');
const passport = require('passport');
const authRole = require('../Passport/VerifyUser')
const { addProduct, getProduct, getbyIDProduct, deleteProduct, updateProduct, getProductPrice } = require('../Controllers/ProductController');
const upload = require('../middlewares/multer');

const router = express.Router();
router.post('/product', passport.authenticate('bearer', { session: false }), authRole("admin"), (upload.single('Image')), addProduct);
router.get('/product', passport.authenticate('bearer', { session: false }), authRole("admin", "client"), getProduct);
router.get('/product/:id', passport.authenticate('bearer', { session: false }), authRole("admin", "client"), getbyIDProduct)
router.put('/product/:id', passport.authenticate('bearer', { session: false }), authRole("admin"), updateProduct)
router.delete('/product/:id', passport.authenticate('bearer', { session: false }), authRole("admin"), deleteProduct)
router.post('/product/getproducts', passport.authenticate('bearer', { session: false }), authRole("admin", "client"), getProductPrice)

module.exports = router