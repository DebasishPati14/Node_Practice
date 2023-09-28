const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const emailTemplate = require('../utils/email-templates');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: 'mr.debasish005@gmail.com',
    pass: 'liqbhnlpyfswrgkc',
  },
});

exports.getLogin = (req, res, next) => {
  const errorMessage = req.flash('error');
  const successFlash = req.flash('success');

  res.render('auth/login.ejs', {
    pageTitle: 'Login',
    path: '/auth/login',
    errorMessage,
    successMessage: successFlash[0],
    oldValues: {},
  });
};

exports.postLogin = (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  // if (!userEmail || !userPassword) {
  //   req.flash('error', 'All fields are required');
  //   return res.redirect('/auth/login');
  // }
  console.log(validationResult(req));
  if (!validationResult(req).isEmpty()) {
    const errorMessage = validationResult(req).errors.map((err) => err.msg);
    return res.render('auth/login.ejs', {
      pageTitle: 'Login',
      path: '/auth/login',
      errorMessage,
      successMessage: null,
      oldValues: req.body,
    });
  }
  User.findOne({ email: userEmail }).then((existingUser) => {
    if (!existingUser) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    bcrypt.compare(userPassword, existingUser.password).then((doMatch) => {
      if (doMatch) {
        req.session.isAuthenticated = true;
        req.session.user = existingUser;
        req.session.save((err) => {
          if (!err) {
            res.redirect('/shop');
          }
        });
      } else {
        req.flash('error', 'Invalid email or password');
        res.redirect('/auth/login');
      }
    });
  });
};

exports.getSignup = (req, res, next) => {
  const errorFlash = req.flash('error');
  res.render('auth/signup.ejs', {
    pageTitle: 'Signup',
    path: '/auth/signup',
    errorMessage: errorFlash[0],
    oldValues: {},
  });
};

exports.postSignup = (req, res, next) => {
  const userName = req.body.name;
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userConfirmPassword = req.body.confirmPassword;
  if (!validationResult(req).isEmpty()) {
    console.log(req.body);

    const errorMessage = validationResult(req).errors.map((err) => err.msg);
    return res.render('auth/signup.ejs', {
      pageTitle: 'Signup',
      path: '/auth/signup',
      errorMessage,
      oldValues: { ...req.body },
    });
  }
  if (!userName || !userEmail || !userPassword || !userConfirmPassword) {
    req.flash('error', 'All fields are required');
    return res.redirect('/auth/signup');
  } else {
    if (userPassword !== userConfirmPassword) {
      req.flash('error', 'Password and Confirm Password did not match!');
      return res.redirect('/auth/signup');
    }
    User.findOne({ email: userEmail }).then((existingUser) => {
      if (existingUser) {
        req.flash(
          'error',
          'User exists with this email please try with different one'
        );
        return res.redirect('/auth/signup');
      }

      bcrypt.hash(userPassword, 12).then((encryptedPassword) => {
        User({
          name: userName,
          email: userEmail,
          password: encryptedPassword,
          cartDetail: { products: [], totalPrice: 0 },
        })
          .save()
          .then(() => {
            req.flash(
              'success',
              'Account created Successfully!. Now you need to login.'
            );
            res.redirect('/auth/login');
            return transporter.sendMail(
              emailTemplate.getSignUpMessage(userEmail, userName)
            );
          })
          .then(() => {
            console.log('mail send successfully');
          })
          .catch((error) => {
            console.log('mail send', error);
          })
          .catch((error) => {
            console.log(error);
          })
          .catch((err) => {
            console.log('BCrypt Error', err);
          });
      });
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  const errorFlash = req.flash('error');

  res.render('auth/reset.ejs', {
    pageTitle: 'Reset Password',
    path: '/auth/reset',
    errorMessage: errorFlash[0],
    oldValues: {},
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buff) => {
    if (err) {
      return res.redirect(`auth/reset`);
    }
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No User exist with this email id!');
          return res.redirect(`/auth/reset`);
        }
        user.resetToken = buff.toString('hex');
        user.resetTokenExpires = Date.now() + 900000;
        user
          .save()
          .then(() => {
            transporter
              .sendMail(
                emailTemplate.resetPasswordMessage(
                  req.body.email,
                  buff.toString('hex')
                )
              )
              .then(() => {
                req.flash('success', 'Reset Password link sent Successfully!');
                res.redirect('/');
              })
              .catch((error) => {
                console.log('mail error', error);
              });
          })
          .catch((error) => {
            console.log('user not save', error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.resetToken;

  console.log(validationResult(req).errors);
  if (!validationResult(req).isEmpty()) {
    return res.render('auth/new-password.ejs', {
      pageTitle: 'Reset Password',
      errorMessage: validationResult(req).errors[0].msg,
      userId: req.body.userId,
      resetToken: token,
      oldValues: { ...req.body },
    });
  }

  User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Session has expired or Invalid Token provided!');
        return res.redirect(`/auth/reset`);
      }
      const errorFlash = req.flash('error');
      console.log(user.resetTokenExpires);
      res.render('auth/new-password.ejs', {
        pageTitle: 'Reset Password',
        errorMessage: errorFlash[0],
        userId: user._id,
        resetToken: token,
        oldValues: {},
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const token = req.body.resetToken;
  const userId = req.body.userId;
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;
  if (confirmPassword !== password) {
    return res.redirect(`/auth/new-password/${token}`);
  }
  // if (!validationResult(req).isEmpty()) {
  //   console.log(validationResult(req).errors);
  //   return res.render('auth/new-password.ejs', {
  //     pageTitle: 'Reset Password',
  //     errorMessage: validationResult(req).errors[0].msg,
  //     userId,
  //     resetToken: token,
  //     oldValues: {},
  //   });
  // }
  User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      req.flash('error', 'Session has expired!');
      return res.redirect(`/auth/reset`);
    }
    bcrypt
      .hash(password, 12)
      .then((encodedPassword) => {
        user.password = encodedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        return user.save();
      })
      .then(() => {
        req.flash(
          'success',
          'Password changed Successfully!Log in with new password'
        );
        res.redirect('/auth/login');
        return transporter.sendMail(
          emailTemplate.getChangePasswordMessage(user.email)
        );
      })
      .then(() => {})
      .catch((error) => {
        console.log('mail send error', error);
      })
      .catch((error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
