const express = require('express');
const route = express.Router();
const adminController = require('../controller/admin.controller');

route.get('/add-product', adminController.addProduct);

route.get('/edit-product', adminController.editProduct);

route.get('/products', adminController.getProducts);

route.post('/product', adminController.postProduct);

route.get('/', adminController.basePage);

module.exports = route;
