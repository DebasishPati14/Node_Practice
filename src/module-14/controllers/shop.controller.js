const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

exports.getAllProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop/all-products.ejs', {
      pageTitle: 'All Products',
      path: '/shop',
      products,
      isAuthenticated: req.get('Cookie').split('=')[1] === 'true',
    });
  });
};

exports.getCheckout = (req, res, next) => {
  console.log(req.get('Cookie'));
  res.render('shop/checkout.ejs', {
    pageTitle: 'Checkout',
    path: '/shop/checkout',
    isAuthenticated: req.get('Cookie').split('=')[1] === 'true',
  });
};

exports.getCart = (req, res, next) => {
  User.findById(req.user._id).then((userData) => {
    const cartData = userData.cartDetail;
    getCartProducts(cartData.products, (cartDetails) => {
      res.render('shop/cart.ejs', {
        pageTitle: 'Cart',
        path: '/shop/cart',
        products: cartDetails || [],
        totalPrice: cartData.totalPrice || 0,
        isAuthenticated: req.get('Cookie').split('=')[1] === 'true',
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  const price = req.body.price;
  User.findById(req.user._id).then((user) => {
    user
      .addToCart(id, price)
      .then(() => {
        res.redirect('/shop/cart');
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id }).then((result) => {
    console.log(req.get('Cookie'));
    res.render('shop/orders.ejs', {
      pageTitle: 'Orders',
      path: '/shop/orders',
      allOrders: result,
      isAuthenticated: req.get('Cookie').split('=')[1] === 'true',
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id).then((product) => {
    res.render('shop/product-details.ejs', {
      pageTitle: 'Product Details',
      path: '/shop/product-details',
      product,
      isAuthenticated: req.get('Cookie').split('=')[1] === 'true',
    });
  });
};

exports.deleteCartProduct = (req, res, next) => {
  const productId = req.body.productId;
  const price = req.body.productPrice;
  User.findById(req.user._id).then((user) => {
    user
      .deleteProductFromCart(productId, price)
      .then(() => {
        res.redirect('/shop');
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

exports.postOrder = (req, res, next) => {
  const cartProducts = req.user.cartDetail.products || [];
  getCartProducts(cartProducts, (detailedProducts) => {
    const orderObj = {
      products: detailedProducts,
      totalPrice: req.user.cartDetail.totalPrice || 0,
      userId: req.user,
      userName: req.user.name,
    };
    console.log(orderObj);
    Order(orderObj)
      .save()
      .then(() => {
        req.user.cartDetail = { totalPrice: 0, products: [] };
        req.user.save().then(() => {
          res.redirect('/shop');
        });
      });
  });
};

const getCartProducts = (cartProducts, callBack) => {
  let updatedProducts = [];
  Product.find().then((allProducts) => {
    updatedProducts =
      cartProducts &&
      cartProducts.map((eachCartProduct) => {
        const productDetails = allProducts.find(
          (prod) => prod._id.toString() === eachCartProduct.productId.toString()
        );
        return {
          ...productDetails._doc,
          quantity: eachCartProduct.quantity,
        };
      });
    callBack(updatedProducts);
  });
};
