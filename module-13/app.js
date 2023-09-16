const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin.route');
const shopRoute = require('./routes/shop.route');
const path = require('path');
// const User = require('./models/user.model');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, './public/css')));

// app.use((req, res, next) => {
//   User.findUserById('64fe843df52a06768c4e3154', (user) => {
//     req.user = user;
//     next();
//   });
// });

app.set('view engines', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));

app.use('/shop', shopRoute);
app.use('/admin', adminRoute);

app.get('/', (req, res, next) => {
  res.render('home.ejs', { path: '/', pageTitle: 'Main Page' });
});

app.get('***', (req, res, next) => {
  res.render('404.ejs', { path: '404', pageTitle: '404 Page' });
});

mongoose
  .connect(
    'mongodb+srv://Usemy_Node_Practice:ezcYWnvYv4Pdrebn@cluster0.yvpr5b1.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('db connected successfully');
    app.listen(2400);
  })
  .catch((error) => {
    console.log(error);
  });
