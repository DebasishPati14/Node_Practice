const Product = require('../models/product.model');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product.ejs', {
    pageTitle: 'AddProduct',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const userId = req.user.userId;
  const productObj = new Product(
    title,
    description,
    price,
    imageUrl,
    null,
    userId
  );
  productObj.saveProduct(null);
  res.redirect('/admin/products');
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.query.productId;
  Product.getProductById(productId, (callBackValue) => {
    res.render('admin/edit-product.ejs', {
      pageTitle: 'EditProduct',
      path: '/admin/edit-product',
      product: callBackValue,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const userId = req.user.userId;
  const productObj = new Product(
    title,
    description,
    price,
    imageUrl,
    id,
    userId
  );
  productObj.saveProduct(id);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts((cb) => {
    res.render('admin/products.ejs', {
      pageTitle: 'AllProduct',
      path: '/admin/edit-product',
      products: cb,
    });
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

  Product.deleteProduct(productId);
  res.redirect('/');
};
