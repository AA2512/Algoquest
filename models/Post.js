const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    default: "",
  },
  tags: {
    type: Array,
    default: [],
  },
  innerHTML: {
    type: String,
    required: true,
  },
  upVotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
