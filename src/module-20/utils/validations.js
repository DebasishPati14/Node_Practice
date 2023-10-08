const { check, body } = require('express-validator');

exports.loginValidation = [
  check('email').isEmail().withMessage('Invalid email address.!'),
  body('password')
    .custom((value, { req }) => {
      if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
        throw new Error('Password must contain both letters and numbers');
      }
      return true;
    })
    .withMessage('Password needs to be alphanumeric.')
    .isLength({ min: 5 })
    .withMessage('Password has at least 5 character'),
];

exports.emailValidation = [
  check('email').isEmail().withMessage('Invalid email address.!'),
];

exports.signupValidation = [
  body('name')
    .isLength({ min: 5 })
    .withMessage('Name field requires at least 5 letter'),
  body('email').isEmail().withMessage('Invalid email address.!'),
  check('password')
    .custom((value, { req }) => {
      if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
        throw new Error('Password must contain both letters and numbers');
      }
      return true;
    })
    .withMessage('Password needs to be alphanumeric.')
    .isLength({ min: 5 })
    .withMessage('Password has at least 5 character'),

  body('confirmPassword').custom((value, { req }) => {
    if (req.password !== req.confirmPassword) {
      throw new Error('Password and Confirm password must match');
    }
    return true;
  }),
];

exports.addProductValidation = [
  body('title')
    .isLength({ min: 5 })
    .withMessage('Product title name field requires at least 5 letter'),
  // body('imageUrl').isURL().withMessage('Product image field must be a URL'),
  check('price', 'Price field must be numeric only').isNumeric(),

  body('description')
    .isLength({ min: 5 })
    .withMessage('Product description field requires at least 5 letter'),
];
