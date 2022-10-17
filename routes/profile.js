const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const { checkSignUp } = require("../middleware/user");
const { getAllPosts } = require("../middleware/dashboard");
const { getPostsByUsername } = require("../middleware/posts");

const User = require("../models/User");

//Cloudinary Config
cloudinary.config({
  cloud_name: "djtqk69w2",
  api_key: "988281195666512",
  api_secret: "gAYRXw0injArpakh9jIdPjt2etM",
});

router.get("/profile", ensureAuth, checkSignUp, (req, res) => {
  res.locals.user = req.user;
  const skills = req.user.skills;
  let skillsVal = "";
  skills.forEach((skill) => {
    skillsVal += `${skill}, `;
  });
  res.locals.skillsVal = skillsVal;
  res.render("profile-settings");
});

router.patch("/update/profile", ensureAuth, checkSignUp, async (req, res) => {
  const user = req.user;

  console.log(user, req.body);
  try {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.phone = req.body.phone;
    user.about = req.body.about;
    user.gender = req.body.gender;
    user.skills = req.body.skills;
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

router.post("/update/avatar", ensureAuth, checkSignUp, async (req, res) => {
  const file = req.files.avatar;
  const user = req.user;
  console.log(req.files);
  if (file) {
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    user.image = result.secure_url;
    await user.save();
    res.status(201).json({
      status: "OK",
    });
  } else {
    res.json({ error: "Image required!" });
  }
});

router.get(
  "/profile/:username",
  ensureAuth,
  checkSignUp,
  getPostsByUsername,
  async (req, res) => {
    const username = req.params.username;
    res.locals.user = req.user;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) return res.render("error-404");
    res.locals.publicProfile = {
      displayName: user.displayName,
      username: user.username,
      image: user.image,
      about: user.about,
      skills: user.skills,
    };
    res.render("public-profile");
  }
);

module.exports = router;
