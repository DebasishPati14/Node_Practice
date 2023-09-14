const express = require('express')
const path = require('path')
const router = express.Router()
const adminData = require('./admin')

router.get('/message', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'message.html'))
})

router.get('/', (req, res, next) => {
  // res.sendFile(path.join(__dirname,"../",'views','user.html'));
  res.render('shop', { prods: adminData.products, pageTitle: 'Admin Page' })
})

module.exports = router
