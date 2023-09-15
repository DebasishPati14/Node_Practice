const express = require('express');
const router = express.Router();
const productModel = require('../controllers/product.controllers');

router.get('/add-product', productModel.addProduct);

router.post('/products', productModel.products);

module.exports = router;
