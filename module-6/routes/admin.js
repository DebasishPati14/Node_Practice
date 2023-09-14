const express = require('express')
const router = express.Router()

const products = []

router.post('/products', (req, res, next) => {
  products.push({ productName: req.body.productName })
  console.log(products)
  res.redirect('/message')
})

router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(__dirname,"../",'views','admin.html'));
  res.render('admin', { pageTitle: 'Admin Page' })
})

exports.routes = router
exports.products = products
