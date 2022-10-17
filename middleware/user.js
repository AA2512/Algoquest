const User = require("../models/User");

const checkSignUp = async (req, res, next) => {
  const user = req.user;
  if (!user.username || user.username.length == 0) {
    res.redirect("/signup/profile");
  } else next();
};

module.exports = {
  checkSignUp,
};
