const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

router.put(
  '/signup',
  [
    body('name')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Name must contain 4 characters'),
    body('password')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Password must contain 4 characters'),
    body('email').isEmail().withMessage('Invalid Email Address'),
  ],
  authController.putSignUp
);

router.post(
  '/login',
  [
    body('password')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Password must contain 4 characters'),
    body('email').isEmail().withMessage('Invalid Email Address'),
  ],
  authController.postLogin
);

module.exports = router;
