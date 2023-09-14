const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')

app.use(bodyParser.urlencoded())
app.use(express.static(path.join(__dirname, 'public/css')))
// app.set('view engine','pug')
// app.set('views','views')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(adminRoute.routes)
app.use(userRoute)

app.use('***', (req, res, next) => {
  res.render('404', { pageTitle: 'Pg nt fnd' })
})

app.listen(2400)
