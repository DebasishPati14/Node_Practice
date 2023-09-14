const express = require('express')
const path = require('path')
const routingPath = require('../utils/paths')
const router = express.Router()

// router.get('/add-product', (req, res, next) => {
//     res.send(`<form action='products' method='POST'>
//     <input type='text' name='productName'/>
//     <button type='submit'>Add</button>
//     </form>`)
//     // console.log('Add')
// });

router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(routingPath, 'views', 'add-product.html'))
})

router.post('/products', (req, res, next) => {
  console.log('products middleware', req.body)
  res.redirect('/')
})

module.exports = router
