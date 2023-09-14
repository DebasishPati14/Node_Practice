const express = require('express')
const path = require('path')
const routingPath = require('../utils/paths')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.sendFile(path.join(routingPath, 'views', 'user.html'))
})

// router.get('/', (req, res, next) => {
//     res.send('<h1>Product Page</h1>');
// });

module.exports = router
