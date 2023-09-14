const Product = require('../model/product.model')

exports.addProduct = (req, res, next) => {
  res.render('admin/add-product.ejs', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  })
}

exports.getEditProduct = (req, res, next) => {
  const productId = req.query.productId
  Product.fetchAllProduct((cb) => {
    res.render('admin/edit-product.ejs', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: cb.find((prod) => prod.id === productId)
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImage = req.body.imageUrl
  const updatedDescription = req.body.description

  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedPrice,
    updatedImage,
    updatedDescription
  )
  updatedProduct.saveProduct()
  res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteProduct(productId)
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render('admin/products.ejs', {
      pageTitle: 'Products',
      path: '/admin/products',
      prods: products
    })
  })
}

exports.postProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const productObj = new Product(null, title, price, imageUrl, description)
  productObj.saveProduct()
  res.redirect('shop/message')
}

exports.basePage = (req, res, next) => {
  res.render('admin/message.ejs', {
    pageTitle: 'Admin',
    path: '/admin'
  })
}
