exports.get404 = (req, res, next) => {
  res.render('404.ejs', {
    path: '404',
    pageTitle: '404 Page',
  });
};

exports.get500 = (req, res, next) => {
  res.render('500.ejs', {
    path: '500',
    pageTitle: 'Error 500 Page',
  });
};
