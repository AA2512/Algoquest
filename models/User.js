const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleID: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    default: "Rather not say",
  },
  phone: {
    type: String,
    default: "+91 1234567890",
  },
  image: {
    type: String,
    default: "../../img/custom/avatar-1.jpg",
  },
  followers: {
    type: Array,
    default: [],
  },
  posts: {
    type: Array,
    default: [],
  },
  username: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  college: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
