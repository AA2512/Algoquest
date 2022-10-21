const express = require("express");

const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { getAllPosts } = require("../middleware/dashboard");
const { checkSignUp } = require("../middleware/user");

//@desc Login
//@route GET /

router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

router.get("/dashboard", ensureAuth, checkSignUp, getAllPosts, (req, res) => {
  res.locals.user = req.user;
  res.render("dashboard");
});

router.get("/signup/profile", ensureAuth, (req, res) => {
  if (req.user.username && req.user.username.length > 0)
    return res.redirect("/dashboard");
  res.render("signup-profile");
});

router.patch("/signup/profile", ensureAuth, async (req, res) => {
  try {
    const username = req.body.username;
    const college = req.body.college;
    const about = req.body.about;
    console.log(username, college, about);
    const user = req.user;
    user.username = username;
    user.college = college;
    user.about = about;

    await user.save();
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
});

module.exports = router;
