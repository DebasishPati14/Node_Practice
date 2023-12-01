const { validationResult } = require('express-validator');
const Post = require('../models/post.model');

exports.getFeeds = (req, res, next) => {
  let totalItems = 0;
  const page = req.query.page;
  const perPage = req.query.perPage || 2;
  Post.countDocuments()
    .then((total) => {
      totalItems = total;
      return Post.find()
        .skip((page - 1) * perPage)
        .limit(perPage);
    })
    .then((result) => {
      res.status(200).json({
        result: 'success message',
        posts: result,
        totalItems,
      });
    })
    .catch((err) => {
      if (!err.status) {
        err.setStatus = 500;
      }
      next(err);
    });
};

exports.postFeeds = (req, res, next) => {
  const error = validationResult(req);
  console.table(req);
  const file = req.file;

  if (!file) {
    const error = new Error('Sorry no file selected');
    error.setStatus = 422;
    throw error;
  }

  if (!error.isEmpty()) {
    const error = new Error('Failed to accept the request');
    error.setStatus = 422;
    throw error;
  }

  const post = {
    title: req.body.title,
    content: req.body.content,
    creator: JSON.parse(req.body.creator),
    imageUrl: req.file.filename,
  };

  console.table(post);
  // DATABASE operation
  return Post(post)
    .save()
    .then((result) => {
      console.log('Saved', res);
      return res.status(201).json({
        result: 'success message',
        receivedPost: result,
      });
    })
    .catch((error) => {
      if (!error.status) {
        error.setStatus = 500;
      }
      next(error);
    });
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.id;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post is there with this id');
        error.setStatus = 404;
        throw error;
      }
      res.status(200).json({
        result: 'success message',
        post,
      });
    })
    .catch((err) => {
      if (!err.status) {
        err.setStatus = 500;
      }
      next(err);
    });
};

exports.deleteSinglePost = (req, res, next) => {
  const postId = req.params.id;
  Post.findByIdAndDelete(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post is there with this id');
        error.setStatus = 404;
        throw error;
      }
      res.status(200).json({
        result: 'success message',
        post,
      });
    })
    .catch((err) => {
      if (!err.status) {
        err.setStatus = 500;
      }
      next(err);
    });
};
