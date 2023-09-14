const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')

router.get('/add-product', adminController.getAddProduct)

router.post('/add-product', adminController.postAddProduct)

router.get('/edit-product', adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct)

router.get('/products', adminController.getProducts)

router.post('/delete-product', adminController.deleteProducts)

router.get('/', adminController.getAdmin)

module.exports = router
