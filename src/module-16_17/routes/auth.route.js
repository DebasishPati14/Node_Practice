const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const isAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/shop');
  }
  return next();
};

router.get('/login', isAuth, authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', isAuth, authController.getSignup);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', isAuth, authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:resetToken', isAuth, authController.getNewPassword);

router.post('/set-password', authController.postNewPassword);

module.exports = router;
