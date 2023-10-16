exports.getFeeds = (req, res, next) => {
  res.status(200).json({
    result: 'success message',
    posts: [
      {
        name: 'Post 1',
        message: 'Hi This is first Post',
      },
    ],
  });
};

exports.postFeeds = (req, res, next) => {
  const feedName = req.body.name;
  const feedMessage = req.body.message;

  // DATABASE operation

  res.json({
    result: 'success message',
    receivedPost: { feedName, feedMessage },
  });
};
