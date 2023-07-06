const Product = require("../model/product.model");
const Cart = require("../model/cart.model");

exports.getMessage = (req, res, next) => {
  res.render("shop/message.ejs", {
    pageTitle: "Message",
    path: "/shop/message",
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchCartProduct((products) => {
    res.render("shop/cart.ejs", {
      pageTitle: "Cart",
      path: "/shop/cart",
      products: products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  const price = req.body.price;
  Cart.saveIntoCart(id, price, () => {
    res.redirect("/shop");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout.ejs", {
    pageTitle: "Checkout",
    path: "/shop/checkout",
  });
};

exports.deleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  const productPrice = req.body.productPrice;
  Cart.removeCartItem(productId, productPrice);
  res.redirect("/shop");
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.productId;
  Product.fetchById(id, (product) => {
    res.render("shop/product-detail.ejs", {
      pageTitle: "Product Details",
      path: "/shop/product-details",
      product: product,
    });
  });
};

exports.basePage = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/product-list.ejs", {
      pageTitle: "Shop",
      prods: products,
      path: "/shop",
    });
  });
};
