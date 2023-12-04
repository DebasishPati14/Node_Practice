const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  const jwtToken = req.headers.authorization;
  let decodedToken;
  if (!jwtToken) {
    const error = new Error('No token provided');
    error.setStatus = 401;
    throw error;
  }
  try {
    decodedToken = jwt.verify(jwtToken.split(' ')[1], 'superSecretKey');
    if (!jwtToken) {
      const error = new Error('Invalid token provided');
      error.setStatus = 401;
      throw error;
    }
  } catch (error) {
    const err = new Error('No token provided');
    error.setStatus = 401;
    throw err;
  }
  req.userId = decodedToken.userId;
  next();
};

module.exports = isAuth;
