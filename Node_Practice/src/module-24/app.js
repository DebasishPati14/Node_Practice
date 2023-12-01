const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const feedRoute = require('./routes/feed.route');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './images'));
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, './images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use('/feed', feedRoute);

app.use((error, req, res, next) => {
  const status = error.setStatus || 500;
  return res.status(status).json({
    message: error.message,
    error: error.toString(),
  });
});

mongoose
  .connect(
    'mongodb+srv://FirstUser:V6jUUfwWrXSANq9h@nodelearningcluster.fbds7im.mongodb.net/FeedPost?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connected to DB');
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
