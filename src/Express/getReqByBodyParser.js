const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded());

// app.use('/', (req, res, next) => {
//     console.log('always running middleware')
// });

app.use('/add-product', (req, res, next) => {
  res.send(`<form action='/products' method='POST'>
    <input type='text' name='productName'/>
    <button type='submit'>Add</button>
    </form>`);
  // console.log('Add')
});

app.use('/products', (req, res, next) => {
  console.log('products middleware', req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h2>Default Page</h2>');
});

app.listen(9000);
