const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/message', (req, res, next) => {
  res.send('<h3>In Message Page</h3>');
  // res.redirect('/');
});

router.get('/', (req, res, next) => {
  // res.send(`<h3>In Home Page</h3><br /><a href='/add-product'>Go To Add Product</a>`)
  res.sendFile(path.join(__dirname, '../', 'views', 'user.html'));
});

module.exports = router;
