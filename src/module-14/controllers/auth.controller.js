exports.getLogin = (req, res, next) => {
  console.log(req.get('Cookie'));
  res.render('auth/login.ejs', {
    pageTitle: 'Login',
    path: '/auth/login',
    isAuthenticated: req.isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  res.setHeader('Set-Cookie', 'isAuthenticated=true;path=/');
  res.redirect('/shop');
};
