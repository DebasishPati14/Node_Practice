const express = require('express')
const router = express.Router()
const productModel = require('../controllers/product.controllers')

router.get('/message', productModel.message)

router.get('/', productModel.basePage)

module.exports = router
