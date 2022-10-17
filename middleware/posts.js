const Post = require("../models/Post");

const getPostsByUsername = async (req, res, next) => {
  const username = req.params.username;
  const posts = await Post.find({ username });
  res.locals.posts = posts;
  next();
};

module.exports = {
  getPostsByUsername,
};
