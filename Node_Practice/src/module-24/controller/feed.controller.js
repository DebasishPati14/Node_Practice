const posts = [{
  _id: "1",
  title: "Post 1",
  content: "Fake Content",
  creator: {
    name: "Debasish",
  },
  imageUrl: "/images/old-vintage-book.png"
}]

exports.getFeeds = (req, res, next) => {
  res.status(200).json({
    result: 'success message',
    posts
  });
};


exports.postFeeds = (req, res, next) => {
  const feedName = req.body.name;
  const feedMessage = req.body.message;

  console.log(req.body);
  // DATABASE operation
  posts.push({ name: feedName, message: feedMessage })

  res.json({
    result: 'success message',
    receivedPost: { feedName, feedMessage },
  });
};
