const Product = require('../model/product.model');

exports.getMessage = (req, res, next) => {
  res.render('shop/message.ejs', {
    pageTitle: 'Message',
    path: '/shop/message',
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart.ejs', {
    pageTitle: 'Cart',
    path: '/shop/cart',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout.ejs', {
    pageTitle: 'Checkout',
    path: '/shop/checkout',
  });
};

exports.getProductDetails = (req, res, next) => {
  res.render('shop/product-detail.ejs', {
    pageTitle: 'Product Details',
    path: '/shop/product-details',
  });
};

exports.basePage = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render('shop/product-list.ejs', {
      pageTitle: 'Shop',
      prods: products,
      path: '/shop',
    });
  });
};
