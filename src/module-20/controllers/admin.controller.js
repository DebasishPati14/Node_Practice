const Product = require('../models/product.model');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product.ejs', {
    pageTitle: 'AddProduct',
    path: '/admin/add-product',
    oldValues: {},
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.file?.path;
  const userDetails = req.user;
  console.log(req.file);

  if (!validationResult(req).isEmpty() || !imageUrl) {
    const errorMessage = validationResult(req).errors.map((err) => err.msg);
    if (!imageUrl) {
      errorMessage.push('No image proper image file is provided.');
    }

    return res.render('admin/add-product.ejs', {
      pageTitle: 'AddProduct',
      path: '/admin/add-product',
      errorMessage,
      oldValues: req.body,
    });
  }

  Product({
    title,
    description,
    price,
    imageUrl,
    userId: userDetails._id,
  })
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.query.productId;
  Product.findById(productId)
    .then((selectedProduct) => {
      res.render('admin/edit-product.ejs', {
        pageTitle: 'EditProduct',
        path: '/admin/edit-product',
        product: selectedProduct,
      });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.file?.path;
  const userDetails = req.user;

  Product.findById(id)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.price = price;
      if (imageUrl) {
        fs.unlink(product.imageUrl, (cb) => {});
        product.imageUrl = imageUrl;
      }
      product.userId = userDetails;
      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .then((product) => {
      res.render('admin/products.ejs', {
        pageTitle: 'AllProduct',
        path: '/admin/edit-product',
        products: product,
      });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getAdmin = (req, res, next) => {
  res.render('admin/admin.ejs', {
    pageTitle: 'Admin',
    path: '/admin',
  });
};

exports.deleteProducts = (req, res, next) => {
  const productId = req.body.productId;
  const productImageUrl = req.body.imageUrl;
  fs.unlink(productImageUrl, (cb) => {});

  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};
