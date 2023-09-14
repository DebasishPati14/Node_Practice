const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')
const path = require('path')
const productModel = require('./controllers/product.controllers')
app.use(bodyParser.urlencoded())

app.use(express.static(path.join(__dirname, 'public/css')))

app.set('view engines', 'ejs')
app.set('views', 'views')

app.use('/admin', adminRoute)
app.use('/shop', shopRoute)

app.use('*', productModel.pageNotFound)

app.listen(2400)
