module.exports = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    return res.redirect('/auth/login');
  }
};
