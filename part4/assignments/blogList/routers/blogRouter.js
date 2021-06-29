const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(blogs);
});

// eslint-disable-next-line consistent-return
blogRouter.post("/", async (req, res) => {
  const { body } = req;
  if (!body.title || !body.url || !body.userId) {
    return res.status(400).end();
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) return res.status(401).json({ error: "token missing or invalid" });

  const { user } = req;
  console.log(user);
  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes ? body.likes : 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.json(savedBlog);
});

blogRouter.delete("/:id", async (req, res) => {
  const { token } = req;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!req.token || !decodedToken) return res.status(401).json({ error: "token missing or invalid" });

  const blog = await Blog.findById(req.params.id);
  if (blog.user.toString() === decodedToken.id.toString()) {
    const { user } = req;
    user.blogs = user.blogs.filter((bl) => bl !== req.params.id);
    await user.save();
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } else {
    res.status(401).json({ error: "session corrupted" });
  }
});

blogRouter.put("/:id", async (request, response) => {
  const { body } = request;
  const blog = {
    likes: body.likes,
  };
  if (!body.likes) blog.likes = 0;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(204).json(updatedBlog);
});

module.exports = blogRouter;
