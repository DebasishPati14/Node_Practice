const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed.controller');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth, feedController.getFeeds);

router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('title').trim().isLength({ min: 5 }),
  ],
  isAuth,
  feedController.postFeeds
);

router.get('/post/:id', isAuth, feedController.getSinglePost);

router.delete('/post/:id', isAuth, feedController.deleteSinglePost);

router.patch('/post/:id', isAuth, feedController.updateSinglePost);

module.exports = router;
