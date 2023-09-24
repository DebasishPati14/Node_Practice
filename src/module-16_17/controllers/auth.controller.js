const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

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

const getSignUpMessage = (mailId, userName) => {
  return {
    from: 'mr.debasish005@gmail.com',
    to: mailId,
    subject: 'Account Creation Successful! ✌',
    html: `
        <h1>Welcome ${userName}</h1>
        <div style=" background-color: #acacac;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
        margin: 20px auto;  max-width: 400px;">
          <h3 style="color: #0073e6;">Your Account is Created Successfully 🌹</h3>
          <p style="color: #333;">Your account with ${mailId} has been successfully created. Welcome to our shopping application!</p>
        </div>
    `,
  };
};

exports.getLogin = (req, res, next) => {
  const errorMessage = req.flash('error')[0];
  const successFlash = req.flash('success');

  res.render('auth/login.ejs', {
    pageTitle: 'Login',
    path: '/auth/login',
    errorMessage,
    successMessage: successFlash[0],
  });
};

exports.postLogin = (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if (!userEmail || !userPassword) {
    req.flash('error', 'All fields are required');
    return res.redirect('/auth/login');
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
  });
};

exports.postSignup = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'isAuthenticated=true;path=/');
  const userName = req.body.name;
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userConfirmPassword = req.body.confirmPassword;
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
            return transporter.sendMail(getSignUpMessage(userEmail, userName));
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
