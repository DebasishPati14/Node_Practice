const { validationResult } = require('express-validator');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

exports.getFeeds = (req, res, next) => {
  let totalItems = 0;
  const page = req.query.page;
  const perPage = req.query.perPage || 2;
  let creator;
  Post.countDocuments()
    .then((total) => {
      totalItems = total;
      return Post.find()
        .populate('creator', 'name email')
        .skip((page - 1) * perPage)
        .limit(perPage);
    })
    .then((result) => {
      // result.creator.name = 'Mr Deba';
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
  const file = req.file;
  let postRecord;

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
    creator: req.userId,
    imageUrl: req.file.filename,
  };

  console.log(post);
  // DATABASE operation
  Post(post)
    .save()
    .then((result) => {
      postRecord = result;
      return User.findById(req.userId);
    })
    .then((user) => {
      user.post.push(postRecord._id);
      return user.save();
    })
    .then(() => {
      return res.status(201).json({
        result: 'success message',
        receivedPost: post,
        creator: { id: req.userId },
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

exports.deleteSinglePost = async (req, res, next) => {
  const postId = req.params.id;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post is there with this id');
        error.setStatus = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error('You can not delete this post');
        error.setStatus = 422;
        throw error;
      }
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      return User.findById(result.creator);
    })
    .then((user) => {
      user.post.pull(postId);
      return user.save();
    })
    .then((userDetail) => {
      res.status(200).json({
        result: 'successfully deleted message',
        userDetail,
      });
    })
    .catch((err) => {
      if (!err.status && !err.setStatus) {
        err.setStatus = 500;
      }
      next(err);
    });
};

exports.updateSinglePost = (req, res, next) => {
  const postId = req.params.id;
  const newFileSelected = req.file;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post is there with this id');
        error.setStatus = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error('You can not edit this post');
        error.setStatus = 422;
        throw error;
      }
      if (newFileSelected) {
        console.log(path.join(__dirname, 'images', post.imageUrl));
        fs.unlink(
          path.join(__dirname, '..', 'images', post.imageUrl),
          (err) => {
            if (!err) {
              console.log('file removed');
            }
          }
        );
      }
      return Post.findByIdAndUpdate(postId, {
        $set: {
          content: req.body.content,
          title: req.body.title,
          imageUrl: newFileSelected
            ? newFileSelected.filename
            : req.body.imageUrl,
        },
      });
    })
    .then(() => {
      res.status(200).json({
        result: 'success message',
      });
    })
    .catch((err) => {
      if (!err.status) {
        err.setStatus = 500;
      }
      next(err);
    });
};
