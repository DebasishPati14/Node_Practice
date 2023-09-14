const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");


exports.getAllProducts = (req, res, next) => {
  Product.fetchAllProducts((cb) => {
    res.render("shop/all-products.ejs", {
      pageTitle: "All Products",
      path: "/shop",
      products: cb,
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout.ejs", {
    pageTitle: "Checkout",
    path: "/shop/checkout",
  });
};

exports.getCart = (req, res, next) => {
  // const cartObj = new Cart();
  // cartObj.getCartProducts((cartDetails) => {
  //   console.log(cartDetails);
  //   res.render("shop/cart.ejs", {
  //     pageTitle: "Cart",
  //     path: "/shop/cart",
  //     products: cartDetails.products,
  //     totalPrice:cartDetails.totalPrice
  //   });
  // });

  console.log(req.user);
  const userObj = new User(req.user.name,
    req.user.email,
    req.user.cartDetails.products,
    req.user._id);
  userObj.getAllCartProducts(cartDetails => {
    res.render("shop/cart.ejs", {
      pageTitle: "Cart",
      path: "/shop/cart",
      products: cartDetails.products || [],
      totalPrice: cartDetails.totalPrice || 0
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  const price = req.body.price;
  User.saveProductsInCart(id, price, req.user, (callBack) => {
    res.redirect("/shop/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders.ejs", { pageTitle: "Orders", path: "/shop/orders" });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.productId;
  Product.getProductById(id, cb => {
    res.render("shop/product-details.ejs", {
      pageTitle: "Product Details",
      path: "/shop/product-details",
      product: cb,
    });
  })

};

exports.deleteCartProduct = (req, res, next) => {
  const productId = req.body.productId;
  const price = req.body.productPrice;

  const userObj = new User(req.user.name,
    req.user.email,
    req.user.cartDetails.products,
    req.user._id);
  userObj.deleteProductFromCart(productId, price, () => {
    res.redirect("/shop");
  });
};


exports.postOrder = (req, res, next) => {
  const userObj = new User(req.user.name,
    req.user.email,
    req.user.cartDetails.products,
    req.user._id);
  userObj.addOrder((callBack) => {
    res.redirect("/shop/");
  });
};
