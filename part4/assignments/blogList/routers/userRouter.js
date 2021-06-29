const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    author: 1,
    title: 1,
    url: 1,
  });
  console.log(users);
  res.json(users);
});
userRouter.post("/", async (req, res) => {
  const { body } = req;
  if (body.username.length + body.password.length < 3) {
    res.status(401).json({
      error: "the username or password should be at least 3 characters long",
    });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.json(savedUser);
  }
});

module.exports = userRouter;
