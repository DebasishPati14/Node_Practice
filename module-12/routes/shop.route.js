const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop.controller')

router.get('/checkout', shopController.getCheckout)

router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

router.get('/orders', shopController.getOrders)

router.post('/add-order', shopController.postOrder)

// router.get("/all-products", shopController.getAllProducts);

router.post('/delete-cart-item', shopController.deleteCartProduct)

router.get('/product-details/:productId', shopController.getProductDetails)

router.get('/', shopController.getAllProducts)

module.exports = router
