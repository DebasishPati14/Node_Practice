const express = require('express')
const route = express.Router()
const adminController = require('../controller/admin.controller')

route.get('/add-product', adminController.addProduct)

route.get('/edit-product', adminController.getEditProduct)

route.post('/edit-product', adminController.postEditProduct)

route.post('/delete-product', adminController.postDeleteProduct)

route.get('/products', adminController.getProducts)

route.post('/product', adminController.postProduct)

route.get('/', adminController.basePage)

module.exports = route
