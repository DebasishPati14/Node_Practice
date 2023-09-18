const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin.route');
const shopRoute = require('./routes/shop.route');
const authRoute = require('./routes/auth.route');
const path = require('path');
const User = require('./models/user.model');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoSessionConnect = require('connect-mongodb-session');
const MongoDBSessionStore = mongoSessionConnect(session);

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, './public/css')));

const MONGO_DB_URI =
  'mongodb+srv://Usemy_Node_Practice:ezcYWnvYv4Pdrebn@cluster0.yvpr5b1.mongodb.net/module-15';

const mongoStore = MongoDBSessionStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'user authentication',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id).then((user) => {
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
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log('db connected successfully');
    app.listen(2400);
  })
  .catch((error) => {
    console.log(error);
  });
