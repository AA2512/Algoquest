const express = require("express");

const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { getAllPosts } = require("../middleware/dashboard");

//@desc Login
//@route GET /

router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

router.get("/dashboard", ensureAuth, getAllPosts, (req, res) => {
  res.locals.user = req.user;
  res.render("dashboard");
});

router.get("/signup/profile", ensureAuth, (req, res) => {
  res.render("signup-profile");
});

router.patch("/signup/profile", ensureAuth, async (req, res) => {
  try {
    const username = req.body.username;
    const college = req.body.college;
    const about = req.body.about;

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

router.get("/profile", ensureAuth, (req, res) => {
  res.locals.user = req.user;
  res.render("profile-settings");
});

router.patch("/update/profile", ensureAuth, async (req, res) => {
  const user = req.user;

  console.log(user, req.body);
  try {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.phone = req.body.phone;
    user.about = req.body.about;
    user.gender = req.body.gender;
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
