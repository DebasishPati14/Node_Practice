const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
exports.getAllProducts = (req, res, next) => {
  Product.fetchAllProducts((cb) => {
    res.render('shop/all-products.ejs', {
      pageTitle: 'All Products',
      path: '/shop',
      products: cb
    })
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout.ejs', {
    pageTitle: 'Checkout',
    path: '/shop/checkout'
  })
}

exports.getCart = (req, res, next) => {
  const cartObj = new Cart()
  cartObj.getCartProducts((products) => {
    res.render('shop/cart.ejs', {
      pageTitle: 'Cart',
      path: '/shop/cart',
      products
    })
    console.log(products)
  })
}

exports.postCart = (req, res, next) => {
  const id = req.body.productId
  const price = req.body.price

  Cart.saveProductInCart(id, price, (callBack) => {
    console.log(callBack)
    res.redirect('/shop/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders.ejs', { pageTitle: 'Orders', path: '/shop/orders' })
}

exports.getProductDetails = (req, res, next) => {
  res.render('shop/product-details.ejs', {
    pageTitle: 'Product Details',
    path: '/shop/product-details',
    product: {}
  })
}

exports.deleteCartProduct = (req, res, next) => {
  const productId = req.body.productId
  const price = req.body.productPrice

  const cartObj = new Cart()
  cartObj.deleteItemFromCart(productId, price)
  res.redirect('/shop')
}

// exports.getAllProducts = (req, res, next) => {
//   res.render("all-products.ejs", { pageTitle: "All Products", path: "/shop/" });
// };

// exports.getAllProducts = (req, res, next) => {
//   res.render("all-products.ejs", { pageTitle: "All Products", path: "/shop/" });
// };
