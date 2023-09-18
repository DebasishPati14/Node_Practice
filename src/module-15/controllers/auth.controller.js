const User = require('../models/user.model');

exports.getLogin = (req, res, next) => {
  res.render('auth/login.ejs', {
    pageTitle: 'Login',
    path: '/auth/login',
    isAuthenticated: req.isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'isAuthenticated=true;path=/');
  User.findById('65055ef5f6eba7cda8dba262').then((user) => {
    req.session.isAuthenticated = true;
    req.session.user = user;
    res.redirect('/');
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/');
  });
};
