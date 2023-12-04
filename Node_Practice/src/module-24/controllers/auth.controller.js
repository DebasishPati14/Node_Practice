const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.putSignUp = (req, res, next) => {
  validationCheck(req);

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new Error('Email-id exist');
      }
    })
    .catch((error) => {
      if (!error.status) {
        error.setStatus = 500;
      }
      next(error);
    });

  bcrypt
    .hash(req.body.password, 12)
    .then((hashPw) => {
      return User({
        email: req.body.email,
        name: req.body.name,
        password: hashPw,
      }).save();
    })
    .then((result) => {
      res.status(201).json({
        result: 'Success message!',
        userId: result._id,
      });
    })
    .catch((error) => {
      if (!error.status) {
        error.setStatus = 500;
      }
      next(error);
    });
};

exports.postLogin = (req, res, next) => {
  validationCheck(req);
  let userId;
  const userEmail = req.body.email;
  User.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        throw new Error('Invalid (particularly email) or password');
      }
      userId = user._id;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((value) => {
      if (!value) {
        throw new Error('Invalid email or (particularly password)');
      }
      const jwtToken = createJWT(userEmail, userId);
      return res.status(200).json({
        result: 'Login successful!',
        userId,
        token: jwtToken,
      });
    })
    .catch((error) => {
      if (!error.status) {
        error.setStatus = 500;
      }
      next(error);
    });
};

function validationCheck(req) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error();
    err.setStatus = 422;
    err.data = error.array();
    throw err;
  }
}

function createJWT(email, userId) {
  let jwtToken;
  try {
    jwtToken = jwt.sign({ email, userId }, 'superSecretKey', {
      expiresIn: '1h',
    });
  } catch (err) {
    const error = new Error('Failed to create JSON web token');
    err.statusCode = 500;
    throw error;
  }
  if (!jwtToken) {
    const error = new Error('Failed to create JSON web token unfortunately!');
    err.statusCode = 500;
    throw error;
  }
  return jwtToken;
}
