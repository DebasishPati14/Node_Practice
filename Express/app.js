const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')

app.use(bodyParser.urlencoded())
app.use(adminRouter)
app.use(userRouter)

app.listen(3000)
