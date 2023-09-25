const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const isAuth = require('../middleware/auth-middleware');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.get('/products', adminController.getAllProducts);

router.post('/delete-product', isAuth, adminController.deleteProducts);

router.get('/', adminController.getAdmin);

module.exports = router;
