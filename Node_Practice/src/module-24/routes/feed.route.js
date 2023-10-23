const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed.controller');

router.get('/posts', feedController.getFeeds);

router.post('/post', feedController.postFeeds);

module.exports = router;
