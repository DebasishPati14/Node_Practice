const Product = require('../model/product.model');

exports.addProduct = (req, res, next) => {
  res.render('admin/add-product.ejs', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.editProduct = (req, res, next) => {
  res.render('admin/edit-product.ejs', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render('admin/products.ejs', {
      pageTitle: 'Products',
      path: '/admin/products',
      prods: products,
    });
  });
};

exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const productObj = new Product(title, price, imageUrl, description);
  productObj.saveProduct();
  res.redirect('shop/message');
};

exports.basePage = (req, res, next) => {
  res.render('admin/message.ejs', {
    pageTitle: 'Admin',
    path: '/admin',
  });
};
