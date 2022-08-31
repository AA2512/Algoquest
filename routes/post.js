const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const moment = require("moment");

const { ensureGuest, ensureAuth } = require("../middleware/auth");

const router = express.Router();

// All the routes are automatically prefixed by /post

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);

  res.locals.post = post;

  let m = moment(post.createdAt);
  res.locals.createdDate = m.format("dddd, MMMM Do YYYY");

  res.render("post");
});

router.get("/create/new", ensureAuth, (req, res) => {
  res.locals.user = req.user;
  res.render("create-post");
});

router.post("/create/new", ensureAuth, async (req, res) => {
  try {
    const user = req.user;
    const newPost = {
      userID: req.user.googleID,
      username: req.user.username,
      userImage: req.user.image,
      title: req.body.title,
      description: req.body.description,
      cover: req.body.cover,
      tags: req.body.tags,
      innerHTML: req.body.innerHTML,
    };

    const post = await Post.create(newPost);
    user.posts.push(post._id.toString());
    await user.save();
    res.status(200).json({
      id: post._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

router.get("/edit/:id", ensureAuth, async (req, res) => {
  const postID = req.params.id.toString();
  const user = req.user;
  const id = user.posts.indexOf(postID);
  if (id != -1) {
    try {
      const post = await Post.findById(postID);

      res.locals.post = post;
      res.render("edit-post");
    } catch (err) {
      res.render("error-not-allowed");
    }
  } else {
    res.render("error-404");
  }
});

router.patch("/edit/:id", ensureAuth, async (req, res) => {
  const postID = req.params.id.toString();
  const user = req.user;
  const id = user.posts.indexOf(postID);
  if (id != -1) {
    try {
      const post = await Post.findById(postID);

      post.title = req.body.title;
      post.cover = req.body.cover;
      post.tags = req.body.tags;
      post.innerHTML = req.body.innerHTML;

      await post.save();
      res.status(200).json({
        id: post._id,
      });
    } catch (err) {
      res.status(400).json({
        error: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      err: "Not Allowed",
    });
  }
});

router.delete("/delete/:id", ensureAuth, async (req, res) => {
  const postID = req.params.id.toString();
  const user = req.user;
  const id = user.posts.indexOf(postID);
  if (id != -1) {
    try {
      const deletionInfo = await Post.findByIdAndDelete(postID);
      console.log(deletionInfo);
      res.status(200).json({
        deleted: 1,
      });
    } catch (err) {
      res.status(400).json({
        error: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      err: "Not Allowed",
    });
  }
});

module.exports = router;
