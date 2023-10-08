const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const isAuth = require('../middleware/auth-middleware');

// router.get('/checkout', shopController.getCheckout);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/add-order', isAuth, shopController.postOrder);

router.get('/all-products', shopController.getAllProducts);

router.post('/delete-cart-item', isAuth, shopController.deleteCartProduct);

router.get('/product-details/:productId', shopController.getProductDetails);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/order/:orderId', shopController.getInvoice);

router.get('/', shopController.getAllProducts);

module.exports = router;
