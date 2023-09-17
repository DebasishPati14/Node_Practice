const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin.route');
const shopRoute = require('./routes/shop.route');
const authRoute = require('./routes/auth.route');
const path = require('path');
const User = require('./models/user.model');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, './public/css')));

app.use((req, res, next) => {
  User.findById('65055ef5f6eba7cda8dba262').then((user) => {
    req.user = user;
    next();
  });
});

app.set('view engines', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));

app.use('/shop', shopRoute);
app.use('/admin', adminRoute);
app.use('/auth', authRoute);

app.get('/', (req, res, next) => {
  res.render('home.ejs', {
    path: '/',
    pageTitle: 'Main Page',
    isAuthenticated: req.isAuthenticated,
  });
});

app.get('***', (req, res, next) => {
  res.render('404.ejs', {
    path: '404',
    pageTitle: '404 Page',
    isAuthenticated: req.isAuthenticated,
  });
});

mongoose
  .connect(
    'mongodb+srv://Usemy_Node_Practice:ezcYWnvYv4Pdrebn@cluster0.yvpr5b1.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('db connected successfully');
    User.findById('65055ef5f6eba7cda8dba262').then((user) => {
      if (!user) {
        User({
          name: 'Test User',
          email: 'test@email.com',
          cartProduct: { totalPrice: 0, products: [] },
        })
          .save()
          .then(() => {
            console.log('new user created successfully');
            app.listen(2400);
          });
      } else {
        console.log('existing user letting you in');
        app.listen(2400);
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });
