const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed.controller');
const { body } = require('express-validator');

router.get('/posts', feedController.getFeeds);

router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 8 }),
    body('title').trim().isLength({ min: 5 }),
  ],
  feedController.postFeeds
);

router.get('/post/:id', feedController.getSinglePost);

router.delete('/post/:id', feedController.deleteSinglePost);

module.exports = router;
