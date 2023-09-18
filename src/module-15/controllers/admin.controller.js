const Product = require('../models/product.model');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product.ejs', {
    pageTitle: 'AddProduct',
    isAuthenticated: req.session.isAuthenticated,
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const userDetails = req.user;
  console.log(userDetails);
  Product({ title, description, price, imageUrl, userId: userDetails._id })
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.query.productId;
  Product.findById(productId).then((selectedProduct) => {
    res.render('admin/edit-product.ejs', {
      pageTitle: 'EditProduct',
      path: '/admin/edit-product',
      product: selectedProduct,
      isAuthenticated: req.session.isAuthenticated,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const userDetails = req.user;
  Product.findById(id)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      product.userId = userDetails;
      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    });
};

exports.getAllProducts = (req, res, next) => {
  Product.find().then((product) => {
    res.render('admin/products.ejs', {
      pageTitle: 'AllProduct',
      path: '/admin/edit-product',
      products: product,
      isAuthenticated: req.session.isAuthenticated,
    });
  });
};

exports.getAdmin = (req, res, next) => {
  res.render('admin/admin.ejs', {
    pageTitle: 'Admin',
    path: '/admin',
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.deleteProducts = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByIdAndDelete(productId).then(() => {
    res.redirect('/');
  });
};
