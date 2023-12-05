const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const fs = require('fs');
const path = require('path');
const PdfDocument = require('pdfkit');
const utilMethod = require('../utils/util-methods');

const ITEMS_PER_PAGE = 3;

exports.getAllProducts = async (req, res, next) => {
  const pageNumber = +req.query.page || 1;
  let totalDocuments = 0;
  Product.find()
    .countDocuments()
    .then((totalDoc) => {
      totalDocuments = totalDoc;
      return Product.find()
        .skip((pageNumber - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/all-products.ejs', {
        pageTitle: 'All Products',
        path: '/shop',
        products,
        totalDocuments,
        lastPage: Math.ceil(totalDocuments / ITEMS_PER_PAGE),
        currentPage: pageNumber,
      });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    })
    .catch((error) => {
      console.log(error);
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout.ejs', {
    pageTitle: 'Checkout',
    path: '/shop/checkout',
  });
};

exports.getCart = (req, res, next) => {
  User.findById(req.user._id)
    .then((userData) => {
      const cartData = userData.cartDetail;
      getCartProducts(cartData.products, (cartDetails) => {
        res.render('shop/cart.ejs', {
          pageTitle: 'Cart',
          path: '/shop/cart',
          products: cartDetails || [],
          totalPrice: cartData.totalPrice || 0,
        });
      });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  const price = req.body.price;
  User.findById(req.user._id)
    .then((user) => {
      user
        .addToCart(id, price)
        .then(() => {
          res.redirect('/shop/cart');
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .then((result) => {
      res.render('shop/orders.ejs', {
        pageTitle: 'Orders',
        path: '/shop/orders',
        allOrders: result,
      });
      console.log(result);
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((product) => {
      res.render('shop/product-details.ejs', {
        pageTitle: 'Product Details',
        path: '/shop/product-details',
        product,
      });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.deleteCartProduct = (req, res, next) => {
  const productId = req.body.productId;
  const price = req.body.productPrice;
  User.findById(req.user._id)
    .then((user) => {
      user
        .deleteProductFromCart(productId, price)
        .then(() => {
          res.redirect('/shop');
        })
        .catch((error) => {
          const err = new Error(error);
          err.httpStatusCode = 500;
          return next(err);
        });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
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
    Order(orderObj)
      .save()
      .then(() => {
        req.user.cartDetail = { totalPrice: 0, products: [] };
        req.user.save().then(() => {
          res.redirect('/shop');
        });
      })
      .catch((error) => {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
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

exports.getInvoice = async (rex, res, next) => {
  const orderId = rex.params.orderId;
  const invoiceName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join(
    'src',
    'module-20_21',
    'data',
    'invoices',
    invoiceName
  );
  /*
 This approach helps to open pdf in same tab
  const stream = fs.createReadStream(invoicePath);
  // res.setHeader(
  //   'Content-Disposition',
  //   'attachment; filename="' + invoiceName + '"'
  // );
  res.setHeader('Content-Type', 'application/pdf');
  stream.pipe(res);
*/

  const orderDetails = await Order.findById(orderId);
  const pdfDoc = new PdfDocument();
  pdfDoc.pipe(res);
  pdfDoc.fontSize(28).fillColor('aqua').text('Invoice', { underline: true });
  pdfDoc.fontSize(28).text('\n');
  const col1Width = 25;
  const col2Width = 15;
  const col3Width = 8;
  const col4Width = 10;
  // const colSpacing = 5;

  pdfDoc
    .fontSize(18)
    .fillColor('gray')
    .text(
      utilMethod.alignText('Name', col1Width) +
        utilMethod.alignText('Price', col2Width, 'right') +
        utilMethod.alignText('Qty', col3Width, 'right') +
        utilMethod.alignText('Amount', col4Width, 'right')
    );
  pdfDoc.fontSize(28).text();

  orderDetails.products.forEach((product) => {
    pdfDoc
      .fontSize(16)
      .text(
        utilMethod.alignText(product.title, col1Width) +
          utilMethod.alignText(product.price, col2Width, 'right') +
          utilMethod.alignText(product.quantity, col3Width, 'right') +
          utilMethod.alignText(
            (product.quantity * product.price).toString(),
            col4Width,
            'right'
          )
      );
  });
  pdfDoc
    .fontSize(18)
    .text(
      '----------  ----------  ----------   ----------  ----------  ---------- -----'
    );
  pdfDoc
    .fontSize(24)
    .fillColor('red')
    .text('Total Price = ' + orderDetails.totalPrice);
  pdfDoc.end();

  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) {
  //     return next(err);
  //   }
  // res.setHeader(
  //   'Content-Disposition',
  //   'attachment; filename="' + invoiceName + '"'
  // );
  // res.setHeader('Content-Type', 'application/pdf');
  // res.send(data);
  // });
};
