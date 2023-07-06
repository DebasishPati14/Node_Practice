const express = require("express");
const route = express.Router();
const userController = require("../controller/shop.controller");

route.get("/shop/message", userController.getMessage);

route.get("/product-details/:productId", userController.getProductDetails);

route.get("/cart", userController.getCart);

route.post("/cart", userController.postCart);

route.post("/shop/delete-cart-item", userController.deleteCartItem);

route.get("/checkout", userController.getCheckout);

route.get("/", userController.basePage);

module.exports = route;
